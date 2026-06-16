#!/usr/bin/env python3
"""
TCaptcha 求解器 — iv8 版本 (Python 原生 V8 + 真实浏览器 API)

用 iv8 替代 Node.js/jsdom，提供:
  - 真实 V8 引擎执行 TDC Chaos VM
  - C++ 原生 Canvas/WebGL/Audio 指纹 (非 mock)
  - isTrusted=true 的可信输入事件
  - 可配置的浏览器环境指纹

流程:
  1. prehandle → sess, tdc_path, pow_cfg, image URLs
  2. 下载 session tdc.js + 云码识别
  3. iv8 JSContext 加载 tdc.js → 真实指纹
  4. 派发可信 pointer 事件注入轨迹
  5. 提取 collect/eks → 提交 verify
"""

import gzip
import json
import os
import re
import time
import urllib.parse
from dataclasses import dataclass

import requests
import iv8

from yunma_solver import solve_slider, extract_slider_from_sprite
from trajectory import generate_trajectory

_AUTH_ = "laohe_munian"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TCAPTCHA_API = "https://turing.captcha.qcloud.com"
PREHANDLE_URL = f"{TCAPTCHA_API}/cap_union_prehandle"
GETSIG_URL = f"{TCAPTCHA_API}/cap_union_new_getsig"
VERIFY_URL = f"{TCAPTCHA_API}/cap_union_new_verify"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/148.0.0.0 Safari/537.36"
)


@dataclass
class CaptchaConfig:
    sess: str; tdc_path: str
    pow_prefix: str; pow_md5: str
    sprite_url: str; bg_url: str
    sprite_pos: tuple; sprite_size: tuple
    init_pos: tuple; track_limit: tuple
    bg_size: tuple; sprite_sheet_size: tuple


class TCaptchaSolverIV8:
    """TCaptcha 求解器 — iv8 版"""

    def __init__(self, app_id: str = "2044348370", yunma_token: str = None):
        self.app_id = app_id
        self.yunma_token = yunma_token
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": USER_AGENT,
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        })

    # ========== iv8 环境 ==========

    def _create_iv8_context(self) -> iv8.JSContext:
        """创建 iv8 上下文，配置 Chrome/Windows 指纹"""
        return iv8.JSContext(
            mode="prod",
            time_mode="logical",
            environment={
                "navigator": {
                    "userAgent": USER_AGENT,
                    "platform": "Win32",
                    "language": "zh-CN",
                    "languages": ["zh-CN", "zh", "en"],
                    "hardwareConcurrency": 8,
                    "deviceMemory": 8,
                },
                "screen": {
                    "width": 2560, "height": 1440,
                    "colorDepth": 24,
                },
                "webgl": {
                    "vendor": "Google Inc. (NVIDIA)",
                    "renderer": "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060)",
                },
            },
        )

    def _load_tdc(self, ctx: iv8.JSContext, tdc_code: str):
        """在 iv8 上下文中加载 tdc.js (预装 btoa 补丁)"""
        # btoa 补丁: 处理非 Latin1 字符
        ctx.eval("(function(){var _b=window.btoa;window.btoa=function(s){try{return _b(s)}catch(e){var a=[];for(var i=0;i<s.length;i++)a.push(s.charCodeAt(i)&255);return _b(String.fromCharCode.apply(null,a))}}})()")
        ctx.eval(tdc_code)
        tdc_ok = ctx.eval("typeof window.TDC !== 'undefined' && typeof window.TDC.getData === 'function'")
        if not tdc_ok:
            raise RuntimeError("TDC not initialized in iv8")

    def _inject_trajectory(self, ctx: iv8.JSContext, points: list):
        """通过 dispatchEvent(MouseEvent) 注入轨迹"""
        if not points:
            return

        # 构建完整的 JS 脚本一次性执行
        js_parts = ['var b=document.body;']

        # mousedown
        first = points[0]
        js_parts.append(
            f"b.dispatchEvent(new MouseEvent('mousedown',{{bubbles:true,clientX:{first['x']},clientY:{first['y']},button:0,buttons:1}}));"
        )

        # mousemove
        for pt in points[1:-1]:
            js_parts.append(
                f"b.dispatchEvent(new MouseEvent('mousemove',{{bubbles:true,clientX:{pt['x']},clientY:{pt['y']},button:0,buttons:1}}));"
            )

        # mouseup
        if len(points) >= 2:
            last = points[-1]
            js_parts.append(
                f"b.dispatchEvent(new MouseEvent('mouseup',{{bubbles:true,clientX:{last['x']},clientY:{last['y']},button:0,buttons:0}}));"
            )

        ctx.eval("\n".join(js_parts))

    def _run_tdc(self, ctx: iv8.JSContext, trajectory: list = None) -> dict:
        """运行 TDC 并提取参数"""
        # 注入轨迹
        if trajectory:
            self._inject_trajectory(ctx, trajectory)

        # setData + getData
        ts = int(time.time() * 1000)
        ctx.eval(f"window.TDC.setData({{ft: {ts}}});")

        collect = ctx.eval("window.TDC.getData(true);")
        info = ctx.eval("JSON.stringify(window.TDC.getInfo());", to_py=True)
        info = json.loads(info) if isinstance(info, str) else info

        return {
            "collect": collect,
            "eks": info.get("info", ""),
            "tokenid": info.get("tokenid", 0),
        }

    def _solve_pow(self, prefix: str, md5_target: str, max_attempts: int = 500000) -> dict:
        """纯 Python POW 求解"""
        import hashlib
        start = time.time()
        for n in range(5, 0, -1):
            target_prefix = md5_target[:n]
            for i in range(max_attempts // 5):
                h = hashlib.md5((prefix + str(i)).encode()).hexdigest()
                if h.startswith(target_prefix):
                    elapsed = int((time.time() - start) * 1000)
                    return {"pow_answer": prefix + str(i), "pow_calc_time": elapsed}
        return {"error": "POW not solved"}

    # ========== 接口请求 ==========

    def _get_prehandle(self) -> CaptchaConfig:
        params = {
            "aid": self.app_id, "protocol": "https", "accver": "1", "showtype": "popup",
            "ua": USER_AGENT, "noheader": "1", "fb": "1",
            "aged": "0", "enableAged": "0", "enableDarkMode": "0",
            "grayscale": "1", "clientype": "2", "cap_cd": "",
            "uid": "", "lang": "zh-cn", "entry_url": "",
            "elder_captcha": "0", "js": "/tcaptcha-frame.85eb58a4.js",
            "login_appid": "", "wb": "1",
            "subsid": str(int(time.time() * 1000) % 10000),
            "callback": f"_aq_{int(time.time() * 1000) % 1000000}",
            "sess": "",
        }
        resp = self.session.get(PREHANDLE_URL, params=params, timeout=15)
        resp.raise_for_status()
        data = json.loads(re.search(r'\((\{.*\})\)', resp.text, re.DOTALL).group(1))
        comm = data["data"]["comm_captcha_cfg"]
        dyn = data["data"]["dyn_show_info"]
        bg_cfg = dyn["bg_elem_cfg"]
        fg_list = dyn["fg_elem_list"]

        slider = next((e for e in fg_list if e.get("id") == 1 and "move_cfg" in e), None)
        if not slider:
            raise RuntimeError(f"Slider not found: {fg_list}")

        tl_str = slider["move_cfg"].get("track_limit", "x>=50&&x<=552")
        xl = re.findall(r'x>=(\d+)&&x<=(\d+)', tl_str)
        track_limit = (int(xl[0][0]), int(xl[0][1])) if xl else (50, 552)

        return CaptchaConfig(
            sess=data["sess"],
            tdc_path=comm["tdc_path"],
            pow_prefix=comm.get("pow_cfg", {}).get("prefix", ""),
            pow_md5=comm.get("pow_cfg", {}).get("md5", ""),
            sprite_url=f"{TCAPTCHA_API}{dyn.get('sprite_url', '')}",
            bg_url=f"{TCAPTCHA_API}{bg_cfg.get('img_url', '')}",
            sprite_pos=tuple(slider.get("sprite_pos", [140, 490])),
            sprite_size=tuple(slider.get("size_2d", [120, 120])),
            init_pos=tuple(slider.get("init_pos", [50, 139])),
            track_limit=track_limit,
            bg_size=tuple(bg_cfg.get("size_2d", [672, 480])),
            sprite_sheet_size=(672, 620),
        )

    def _get_getsig(self, sess: str) -> str:
        resp = self.session.post(GETSIG_URL, data={"sess": sess}, timeout=15)
        resp.raise_for_status()
        return resp.json().get("sess", sess)

    # ========== 主流程 ==========

    def solve(self) -> dict:
        print("[1/5] Prehandle...")
        cfg = self._get_prehandle()
        print(f"  sess={cfg.sess[:40]}...")

        print("[2/5] Getsig + download images + 云码...")
        if cfg.sess:
            cfg.sess = self._get_getsig(cfg.sess)

        sprite_resp = self.session.get(cfg.sprite_url, timeout=15); sprite_resp.raise_for_status()
        bg_resp = self.session.get(cfg.bg_url, timeout=15); bg_resp.raise_for_status()
        slider_bytes = extract_slider_from_sprite(sprite_resp.content, cfg.sprite_pos, cfg.sprite_size)
        notch_x = solve_slider(slider_bytes, bg_resp.content, token=self.yunma_token)
        target_x = max(cfg.track_limit[0], min(cfg.track_limit[1], notch_x))
        print(f"  notch_x={notch_x} → target_x={target_x}")

        print("[3/5] Download session tdc.js...")
        tdc_resp = self.session.get(f"{TCAPTCHA_API}{cfg.tdc_path}", timeout=15); tdc_resp.raise_for_status()
        try:
            tdc_code = gzip.decompress(tdc_resp.content).decode("utf-8")
        except gzip.BadGzipFile:
            tdc_code = tdc_resp.text
        print(f"  tdc.js: {len(tdc_code)} chars")

        print("[4/5] iv8 补环境 + 轨迹注入...")
        trajectory = generate_trajectory(target_x=target_x, start_x=cfg.init_pos[0], base_y=cfg.init_pos[1])
        print(f"  trajectory: {len(trajectory)} points")

        with self._create_iv8_context() as ctx:
            self._load_tdc(ctx, tdc_code)

            # 提取 TDC 参数 (含轨迹)
            tdc_result = self._run_tdc(ctx, trajectory)
            eks = tdc_result["eks"]
            collect = tdc_result["collect"]
            print(f"  eks={eks[:40]}...")
            print(f"  collect={len(collect)} chars (encoded)")

        # POW
        print("[5/5] POW + Verify...")
        pow_result = self._solve_pow(cfg.pow_prefix, cfg.pow_md5)
        print(f"  pow_answer={pow_result.get('pow_answer', '')[:40]}... time={pow_result.get('pow_calc_time', 0)}ms")

        # 构建 verify 请求
        decoded_collect = urllib.parse.unquote(collect)
        ans = json.dumps([{"elem_id": 1, "type": "DynAnswerType_POS", "data": f"{target_x},{cfg.init_pos[1]}"}], separators=(",", ":"))

        verify_data = {
            "collect": decoded_collect,
            "tlg": str(len(decoded_collect)),
            "eks": eks,
            "sess": cfg.sess,
            "ans": ans,
        }
        if pow_result.get("pow_answer"):
            verify_data["pow_answer"] = pow_result["pow_answer"]
            verify_data["pow_calc_time"] = str(pow_result.get("pow_calc_time", 0))

        print(f"  tlg={len(decoded_collect)}")
        resp = self.session.post(VERIFY_URL, data=verify_data, headers={
            "Origin": "https://turing.captcha.gtimg.com",
            "Referer": "https://turing.captcha.gtimg.com/",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        }, timeout=15)
        resp.raise_for_status()
        result = resp.json()
        print(f"  response: {json.dumps(result, ensure_ascii=False)[:200]}")

        if result.get("errorCode") == "0":
            print(f"[OK] ticket={result['ticket'][:30]}... randstr={result['randstr']}")
            return {"success": True, "ticket": result["ticket"], "randstr": result["randstr"]}
        else:
            print(f"[FAIL] errorCode={result.get('errorCode')}")
            return {"success": False, "errorCode": result.get("errorCode", ""), "raw": result}


def solve(app_id: str = "2044348370", yunma_token: str = None) -> dict:
    solver = TCaptchaSolverIV8(app_id=app_id, yunma_token=yunma_token)
    return solver.solve()


if __name__ == "__main__":
    import sys
    app_id = sys.argv[1] if len(sys.argv) > 1 else "2044348370"
    yunma_token = sys.argv[2] if len(sys.argv) > 2 else None
    result = solve(app_id=app_id, yunma_token=yunma_token)
    print("\n=== Result ===")
    print(json.dumps(result, ensure_ascii=False, indent=2))

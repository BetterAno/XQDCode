#!/usr/bin/env python3
"""
TCaptcha 腾讯滑块验证码 — 纯协议求解器

输入: app_id (如 2044348370)
输出: {ticket, randstr}

流程:
  1. GET prehandle → sess, tdc_path, pow_cfg, image URLs
  2. 下载 session-specific tdc.js → Node.js 补环境初始化
  3. 下载背景图 + 雪碧图 → 提取滑块
  4. 云码识别 → 获取滑块目标 x 坐标
  5. 生成轨迹 → trajectory points
  6. Node.js 补环境 → collect, eks, pow_answer
  7. POST verify → ticket + randstr
"""

import gzip
import json
import subprocess
import os
import re
import time
import tempfile
import urllib.parse
from dataclasses import dataclass

import requests

from yunma_solver import solve_slider, extract_slider_from_sprite
from trajectory import generate_trajectory

# 全局水印
_AUTH_ = "laohe_munian"

# 路径配置
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_DIR = os.path.join(BASE_DIR, "env")
NODE_SCRIPT = os.path.join(ENV_DIR, "tcaptcha_env.js")

# TCaptcha API 配置
TCAPTCHA_API = "https://turing.captcha.qcloud.com"
PREHANDLE_URL = f"{TCAPTCHA_API}/cap_union_prehandle"
GETSIG_URL = f"{TCAPTCHA_API}/cap_union_new_getsig"
VERIFY_URL = f"{TCAPTCHA_API}/cap_union_new_verify"

# UA
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/148.0.0.0 Safari/537.36"
)


@dataclass
class CaptchaConfig:
    """TCaptcha 会话配置"""
    sess: str
    tdc_path: str
    pow_prefix: str
    pow_md5: str
    sprite_url: str
    bg_url: str
    sprite_pos: tuple
    sprite_size: tuple
    init_pos: tuple
    track_limit: tuple
    bg_size: tuple
    sprite_sheet_size: tuple


class TCaptchaSolver:
    """TCaptcha 纯协议求解器"""

    def __init__(self, app_id: str = "2044348370", yunma_token: str = None):
        self.app_id = app_id
        self.yunma_token = yunma_token
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": USER_AGENT,
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        })
        self._tdc_local_path = None

    def _run_node(self, command: str, *args) -> dict:
        """调用 Node.js 补环境"""
        cmd = ["node", NODE_SCRIPT, command] + list(args)
        env = os.environ.copy()
        if self._tdc_local_path:
            env["TCAPTCHA_TDC_PATH"] = self._tdc_local_path
        proc = subprocess.run(
            cmd, capture_output=True, text=True, timeout=60,
            cwd=ENV_DIR, env=env,
        )
        if proc.returncode != 0:
            raise RuntimeError(f"Node.js failed: {command}, stderr: {proc.stderr}")
        try:
            return json.loads(proc.stdout.strip())
        except json.JSONDecodeError:
            raise RuntimeError(f"Node.js invalid JSON: {proc.stdout[:200]}")

    def _download_tdc(self, tdc_path: str) -> str:
        """下载并解压 session-specific tdc.js, 返回临时文件路径"""
        tdc_url = f"{TCAPTCHA_API}{tdc_path}"
        resp = self.session.get(tdc_url, timeout=15)
        resp.raise_for_status()

        # tdc.js 是 gzip 压缩的
        try:
            decompressed = gzip.decompress(resp.content)
        except gzip.BadGzipFile:
            decompressed = resp.content

        tmp = tempfile.NamedTemporaryFile(
            mode='wb', suffix='.js', prefix='tdc_', delete=False
        )
        tmp.write(decompressed)
        tmp_path = tmp.name
        tmp.close()
        return tmp_path

    def _get_prehandle(self) -> CaptchaConfig:
        """获取 TCaptcha 配置"""
        params = {
            "aid": self.app_id,
            "protocol": "https", "accver": "1", "showtype": "popup",
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

        text = resp.text
        json_match = re.search(r'\((\{.*\})\)', text, re.DOTALL)
        if not json_match:
            raise RuntimeError(f"Cannot parse prehandle JSONP: {text[:200]}")

        data = json.loads(json_match.group(1))
        comm_cfg = data.get("data", {}).get("comm_captcha_cfg", {})
        dyn_info = data.get("data", {}).get("dyn_show_info", {})
        pow_cfg = comm_cfg.get("pow_cfg", {})
        bg_cfg = dyn_info.get("bg_elem_cfg", {})
        fg_list = dyn_info.get("fg_elem_list", [])

        slider_elem = None
        for elem in fg_list:
            if elem.get("id") == 1 and "move_cfg" in elem:
                slider_elem = elem
                break

        if not slider_elem:
            raise RuntimeError(f"Slider element not found: {fg_list}")

        track_limit_str = slider_elem.get("move_cfg", {}).get("track_limit", "x>=50&&x<=552")
        x_limits = re.findall(r'x>=(\d+)&&x<=(\d+)', track_limit_str)
        track_limit = (int(x_limits[0][0]), int(x_limits[0][1])) if x_limits else (50, 552)

        return CaptchaConfig(
            sess=data.get("sess", ""),
            tdc_path=comm_cfg.get("tdc_path", ""),
            pow_prefix=pow_cfg.get("prefix", ""),
            pow_md5=pow_cfg.get("md5", ""),
            sprite_url=f"{TCAPTCHA_API}{dyn_info.get('sprite_url', '')}",
            bg_url=f"{TCAPTCHA_API}{bg_cfg.get('img_url', '')}",
            sprite_pos=tuple(slider_elem.get("sprite_pos", [140, 490])),
            sprite_size=tuple(slider_elem.get("size_2d", [120, 120])),
            init_pos=tuple(slider_elem.get("init_pos", [50, 139])),
            track_limit=track_limit,
            bg_size=tuple(bg_cfg.get("size_2d", [672, 480])),
            sprite_sheet_size=(672, 620),
        )

    def _get_getsig(self, sess: str) -> str:
        """刷新会话"""
        resp = self.session.post(GETSIG_URL, data={"sess": sess}, timeout=15)
        resp.raise_for_status()
        return resp.json().get("sess", sess)

    def solve(self) -> dict:
        """执行完整 TCaptcha 求解流程"""
        # Step 1: prehandle
        print("[1/6] Prehandle...")
        cfg = self._get_prehandle()
        print(f"  sess={cfg.sess[:40]}... tdc={cfg.tdc_path[:30]}...")

        # Step 2: download session tdc.js + init Node.js
        print("[2/6] Download session tdc.js + init Node.js...")
        self._tdc_local_path = self._download_tdc(cfg.tdc_path)
        init_result = self._run_node("init", self._tdc_local_path)
        if init_result.get("status") != "ready":
            raise RuntimeError(f"Node.js init failed: {init_result}")

        # Step 3: getsig
        if cfg.sess:
            cfg.sess = self._get_getsig(cfg.sess)
            print(f"  new sess={cfg.sess[:40]}...")
        else:
            print("  no initial sess")

        # Step 4: download images + 云码
        print("[3/6] Download images + 云码识别...")
        sprite_resp = self.session.get(cfg.sprite_url, timeout=15); sprite_resp.raise_for_status()
        bg_resp = self.session.get(cfg.bg_url, timeout=15); bg_resp.raise_for_status()

        slider_bytes = extract_slider_from_sprite(sprite_resp.content, cfg.sprite_pos, cfg.sprite_size)
        notch_x = solve_slider(slider_bytes, bg_resp.content, token=self.yunma_token)
        target_x = max(cfg.track_limit[0], min(cfg.track_limit[1], notch_x))
        print(f"  notch_x={notch_x} → target_x={target_x}")

        # Step 5: generate trajectory + Node.js params
        print("[4/6] Generate trajectory...")
        trajectory = generate_trajectory(target_x=target_x, start_x=cfg.init_pos[0], base_y=cfg.init_pos[1])
        print(f"  {len(trajectory)} points")

        print("[5/6] Node.js generate verify params...")
        info_result = self._run_node("getInfo")
        eks = info_result.get("eks", "")
        pow_result = self._run_node("solvePOW", cfg.pow_prefix, cfg.pow_md5)
        traj_json = json.dumps(trajectory, separators=(",", ":"))
        data_result = self._run_node("getData", "true", traj_json)
        collect = data_result.get("collect", "")

        print(f"  eks={eks[:40]}...")
        print(f"  pow_answer={pow_result.get('pow_answer', '')[:40]}... time={pow_result.get('pow_calc_time', 0)}ms")
        print(f"  collect len={len(collect)}")

        # Step 6: verify
        print("[6/6] Verify...")
        ans = json.dumps([{"elem_id": 1, "type": "DynAnswerType_POS", "data": f"{target_x},{cfg.init_pos[1]}"}], separators=(",", ":"))

        decoded_collect = urllib.parse.unquote(collect)
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

        # Cleanup
        if self._tdc_local_path:
            try: os.unlink(self._tdc_local_path)
            except Exception: pass

        if result.get("errorCode") == "0":
            print(f"[OK] ticket={result['ticket'][:30]}... randstr={result['randstr']}")
            return {"success": True, "ticket": result["ticket"], "randstr": result["randstr"]}
        else:
            print(f"[FAIL] errorCode={result.get('errorCode')} msg={result.get('errMessage', '')}")
            return {"success": False, "errorCode": result.get("errorCode", ""), "raw": result}


def solve(app_id: str = "2044348370", yunma_token: str = None) -> dict:
    """便捷求解"""
    solver = TCaptchaSolver(app_id=app_id, yunma_token=yunma_token)
    return solver.solve()


if __name__ == "__main__":
    import sys
    app_id = sys.argv[1] if len(sys.argv) > 1 else "2044348370"
    yunma_token = sys.argv[2] if len(sys.argv) > 2 else None
    result = solve(app_id=app_id, yunma_token=yunma_token)
    print("\n=== Result ===")
    print(json.dumps(result, ensure_ascii=False, indent=2))

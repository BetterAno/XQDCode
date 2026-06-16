#!/usr/bin/env python3
"""
TCaptcha 混合求解器 — Python 驱动 + 浏览器提供真实 TDC 指纹

流程:
  Python: prehandle → getsig → 图片下载 → 云码 → 轨迹生成
  浏览器: eval 会话 tdc.js → 注入轨迹 → 获取 collect + eks
  Python: POW → verify → ticket + randstr

依赖: js-reverse-mcp 浏览器、本地 HTTP 服务器(assets/) 提供 tdc.js
"""

import gzip
import hashlib
import json
import os
import re
import time
import urllib.parse
from dataclasses import dataclass

import requests

from yunma_solver import solve_slider, extract_slider_from_sprite
from trajectory import generate_trajectory

_AUTH_ = "laohe_munian"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, "..", "assets")
TCAPTCHA_API = "https://turing.captcha.qcloud.com"
PREHANDLE_URL = f"{TCAPTCHA_API}/cap_union_prehandle"
GETSIG_URL = f"{TCAPTCHA_API}/cap_union_new_getsig"
VERIFY_URL = f"{TCAPTCHA_API}/cap_union_new_verify"
TDC_SERVER_URL = "http://127.0.0.1:8765/current_tdc.js"

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


def get_prehandle(session: requests.Session, app_id: str) -> CaptchaConfig:
    """获取 TCaptcha 配置"""
    params = {
        "aid": app_id, "protocol": "https", "accver": "1", "showtype": "popup",
        "ua": USER_AGENT, "noheader": "1", "fb": "1",
        "aged": "0", "enableAged": "0", "enableDarkMode": "0",
        "grayscale": "1", "clientype": "2", "cap_cd": "",
        "uid": "", "lang": "zh-cn", "entry_url": "",
        "elder_captcha": "0", "js": "/tcaptcha-frame.85eb58a4.js",
        "login_appid": "", "wb": "1",
        "subsid": str(int(time.time() * 1000) % 10000),
        "callback": f"_cb_{int(time.time() * 1000) % 1000000}",
        "sess": "",
    }
    resp = session.get(PREHANDLE_URL, params=params, timeout=15)
    resp.raise_for_status()
    data = json.loads(re.search(r'\((\{.*\})\)', resp.text, re.DOTALL).group(1))
    comm = data["data"]["comm_captcha_cfg"]
    dyn = data["data"]["dyn_show_info"]
    bg_cfg = dyn["bg_elem_cfg"]
    fg_list = dyn["fg_elem_list"]

    slider = next((e for e in fg_list if e.get("id") == 1 and "move_cfg" in e), None)
    if not slider:
        raise RuntimeError(f"Slider not found")

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
    )


def download_session_tdc(session: requests.Session, tdc_path: str):
    """下载会话 tdc.js 并保存到 HTTP 服务器目录"""
    tdc_url = f"{TCAPTCHA_API}{tdc_path}"
    resp = session.get(tdc_url, timeout=15)
    resp.raise_for_status()
    try:
        tdc_code = gzip.decompress(resp.content).decode("utf-8")
    except gzip.BadGzipFile:
        tdc_code = resp.text

    tdc_file = os.path.join(ASSETS_DIR, "current_tdc.js")
    with open(tdc_file, "w", encoding="utf-8") as f:
        f.write(tdc_code)
    return tdc_code


def build_browser_injection_js(trajectory: list) -> str:
    """
    构建注入浏览器的 JS 脚本：
    1. fetch + eval 会话 tdc.js
    2. btoa 补丁
    3. 注入轨迹事件
    4. 获取 collect + eks
    5. 返回结果
    """
    # 构建轨迹注入的 JS
    traj_lines = []
    if trajectory:
        first = trajectory[0]
        traj_lines.append(
            f"b.dispatchEvent(new MouseEvent('mousedown',{{bubbles:true,"
            f"clientX:{first['x']},clientY:{first['y']},button:0,buttons:1}}));"
        )
        for pt in trajectory[1:-1]:
            traj_lines.append(
                f"b.dispatchEvent(new MouseEvent('mousemove',{{bubbles:true,"
                f"clientX:{pt['x']},clientY:{pt['y']},button:0,buttons:1}}));"
            )
        if len(trajectory) >= 2:
            last = trajectory[-1]
            traj_lines.append(
                f"b.dispatchEvent(new MouseEvent('mouseup',{{bubbles:true,"
                f"clientX:{last['x']},clientY:{last['y']},button:0,buttons:0}}));"
            )

    traj_js = "\n".join(traj_lines)

    return f"""
(async () => {{
  try {{
    // 1. 加载最新会话 tdc.js
    const resp = await fetch('{TDC_SERVER_URL}');
    const code = await resp.text();
    eval(code);

    // 2. btoa 补丁
    (function() {{
      const _b = window.btoa;
      window.btoa = function(s) {{
        try {{ return _b(s); }} catch(e) {{
          const a = [];
          for (let i = 0; i < s.length; i++) a.push(s.charCodeAt(i) & 255);
          return _b(String.fromCharCode.apply(null, a));
        }}
      }};
    }})();

    // 3. 注入轨迹
    const b = document.body;
    {traj_js}

    // 4. 获取 TDC 数据
    window.TDC.setData({{ft: Date.now()}});
    const collect = window.TDC.getData(true);
    const info = window.TDC.getInfo();

    return JSON.stringify({{
      collect: collect,
      eks: info?.info || '',
      tokenid: info?.tokenid || 0,
      collectLen: collect?.length || 0,
    }});
  }} catch(e) {{
    return JSON.stringify({{ error: e.message, stack: e.stack?.substring(0, 500) }});
  }}
}})()
"""
    return traj_js


def solve_pow(prefix: str, md5_target: str, max_attempts: int = 500000) -> dict:
    """纯 Python POW 求解"""
    start = time.time()
    for n in range(5, 0, -1):
        target_prefix = md5_target[:n]
        for i in range(max_attempts // 5):
            h = hashlib.md5((prefix + str(i)).encode()).hexdigest()
            if h.startswith(target_prefix):
                elapsed = int((time.time() - start) * 1000)
                return {"pow_answer": prefix + str(i), "pow_calc_time": elapsed}
    return {"error": "POW not solved"}


def solve(
    app_id: str = "2044348370",
    yunma_token: str = None,
) -> dict:
    """
    执行完整 TCaptcha 求解流程（混合方案）
    需要: js-reverse-mcp 浏览器已打开 http://127.0.0.1:8765/tdc_page.html
    """
    session = requests.Session()
    session.headers.update({
        "User-Agent": USER_AGENT,
        "Accept": "*/*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    })

    # === Step 1: Prehandle ===
    print("[1/6] Prehandle...")
    cfg = get_prehandle(session, app_id)
    print(f"  sess={cfg.sess[:40]}...")

    # === Step 2: Download session tdc.js ===
    print("[2/6] Download session tdc.js...")
    tdc_code = download_session_tdc(session, cfg.tdc_path)
    print(f"  tdc.js: {len(tdc_code)} chars")

    # === Step 3: Getsig + images + 云码 ===
    print("[3/6] Getsig + images + 云码...")
    if cfg.sess:
        resp = session.post(GETSIG_URL, data={"sess": cfg.sess}, timeout=15)
        cfg.sess = resp.json().get("sess", cfg.sess)
        print(f"  sess={cfg.sess[:40]}...")

    sprite_resp = session.get(cfg.sprite_url, timeout=15)
    sprite_resp.raise_for_status()
    bg_resp = session.get(cfg.bg_url, timeout=15)
    bg_resp.raise_for_status()

    slider_bytes = extract_slider_from_sprite(sprite_resp.content, cfg.sprite_pos, cfg.sprite_size)
    notch_x = solve_slider(slider_bytes, bg_resp.content, token=yunma_token)
    target_x = max(cfg.track_limit[0], min(cfg.track_limit[1], notch_x))
    print(f"  notch_x={notch_x} → target_x={target_x}")

    # === Step 4: Generate trajectory ===
    print("[4/6] Generate trajectory...")
    trajectory = generate_trajectory(target_x=target_x, start_x=cfg.init_pos[0], base_y=cfg.init_pos[1])
    print(f"  {len(trajectory)} points")

    # === Step 5: Browser injection JS (print for manual use) ===
    print("[5/6] Browser injection JS ready...")
    browser_js = build_browser_injection_js(trajectory)
    print(f"  browser JS: {len(browser_js)} chars")

    # Output the injection script for manual evaluation
    # In automated mode, the caller passes this to evaluate_script
    inject_script_path = os.path.join(ASSETS_DIR, "inject_script.js")
    with open(inject_script_path, "w", encoding="utf-8") as f:
        f.write(browser_js)

    # We output the essentials for the caller to use with js-reverse-mcp
    print(f"  Injection script saved to: {inject_script_path}")

    # === Step 6: The caller must now run the browser injection and provide: collect, eks ===
    # This function returns the config + trajectory, caller handles the browser interaction
    return {
        "_phase": "need_browser",
        "config": {
            "sess": cfg.sess,
            "pow_prefix": cfg.pow_prefix,
            "pow_md5": cfg.pow_md5,
            "init_pos": list(cfg.init_pos),
            "target_x": target_x,
            "track_limit": list(cfg.track_limit),
        },
        "trajectory": trajectory,
        "inject_script_file": inject_script_path,
    }


def browser_step(browser_collect: str, browser_eks: str, config: dict) -> dict:
    """
    浏览器步骤完成后的 Python 步骤: POW + verify
    """
    session = requests.Session()
    session.headers.update({
        "User-Agent": USER_AGENT,
        "Accept": "*/*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    })

    sess = config["sess"]
    pow_prefix = config["pow_prefix"]
    pow_md5 = config["pow_md5"]
    target_x = config["target_x"]
    init_pos = config["init_pos"]

    # POW
    print("[6/7] POW...")
    pow_result = solve_pow(pow_prefix, pow_md5)
    print(f"  pow_answer={pow_result.get('pow_answer', '')[:40]}... time={pow_result.get('pow_calc_time', 0)}ms")

    # Build verify
    print("[7/7] Verify...")
    decoded_collect = urllib.parse.unquote(browser_collect)
    ans = json.dumps([{
        "elem_id": 1,
        "type": "DynAnswerType_POS",
        "data": f"{target_x},{init_pos[1]}",
    }], separators=(",", ":"))

    verify_data = {
        "collect": decoded_collect,
        "tlg": str(len(decoded_collect)),
        "eks": browser_eks,
        "sess": sess,
        "ans": ans,
    }
    if pow_result.get("pow_answer"):
        verify_data["pow_answer"] = pow_result["pow_answer"]
        verify_data["pow_calc_time"] = str(pow_result.get("pow_calc_time", 0))

    print(f"  tlg={len(decoded_collect)}")
    resp = session.post(VERIFY_URL, data=verify_data, headers={
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


if __name__ == "__main__":
    import sys
    app_id = sys.argv[1] if len(sys.argv) > 1 else "2044348370"
    yunma_token = sys.argv[2] if len(sys.argv) > 2 else None

    # Phase 1: Python steps
    phase1 = solve(app_id=app_id, yunma_token=yunma_token)
    print("\n=== Phase 1 Complete ===")
    print("Now run evaluate_script in browser with the injection script.")
    print(f"Injection script: {phase1['inject_script_file']}")
    print(f"Config: {json.dumps(phase1['config'], indent=2)}")

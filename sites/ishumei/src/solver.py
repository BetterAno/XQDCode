"""
数美滑块验证码 - 纯 Python 协议求解器

流程:
1. GET /ca/v1/conf → SDK配置
2. GET /ca/v1/register → 获取bg/fg/k/l/rid
3. 下载bg/fg图片 → 云码识别缺口位置
4. 生成模拟鼠标轨迹 + 构造加密参数
5. GET /ca/v2/fverify (JSONP) → 验证
"""

import re
import json
import time
import random
import requests

from des_encrypt import build_encrypt_params
from ym_captcha import recognize_slide_gap
from mouse_sim import generate_mouse_data

# ============ 配置 ============
ORGANIZATION = "d6tpAY1oV0Kv5jRSgxQr"
APP_ID = "default"
CHANNEL = "default"
LANG = "zh-cn"
SDKVER = "1.1.3"
RVERSION = "1.0.4"
BG_WIDTH = 600
BG_HEIGHT = 300
CSS_WIDTH = 300
CSS_HEIGHT = 150

API_DOMAIN = "captcha1.fengkongcloud.cn"
STATIC_DOMAIN = "castatic.fengkongcloud.cn"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/148.0.0.0 Safari/537.36",
    "Referer": "https://www.ishumei.com/",
    "Accept": "*/*",
}


def _jsonp_callback():
    return f"sm_{int(time.time() * 1000)}{random.randint(100, 999)}"


def _parse_jsonp(text: str) -> dict:
    """提取 JSONP 响应中的 JSON 数据"""
    m = re.search(r'\((\{.*\})\)', text, re.DOTALL)
    if m:
        return json.loads(m.group(1))
    return json.loads(text)


def _build_url(path: str, params: dict) -> str:
    query = "&".join(f"{k}={requests.utils.quote(str(v), safe='')}" for k, v in params.items())
    return f"https://{API_DOMAIN}{path}?{query}"


def get_conf(session: requests.Session, captcha_uuid: str) -> dict:
    """Step 1: 获取SDK配置"""
    params = {
        "model": "slide",
        "channel": CHANNEL,
        "captchaUuid": captcha_uuid,
        "lang": LANG,
        "appId": APP_ID,
        "organization": ORGANIZATION,
        "rversion": RVERSION,
        "sdkver": SDKVER,
        "callback": _jsonp_callback(),
    }
    resp = session.get(_build_url("/ca/v1/conf", params), headers=HEADERS, timeout=15)
    return _parse_jsonp(resp.text)


def register(session: requests.Session, captcha_uuid: str) -> dict:
    """Step 2: 注册验证码, 获取图片和密钥"""
    params = {
        "model": "slide",
        "organization": ORGANIZATION,
        "callback": _jsonp_callback(),
        "rversion": RVERSION,
        "data": "{}",
        "appId": APP_ID,
        "channel": CHANNEL,
        "lang": LANG,
        "sdkver": SDKVER,
        "captchaUuid": captcha_uuid,
    }
    resp = session.get(_build_url("/ca/v1/register", params), headers=HEADERS, timeout=15)
    data = _parse_jsonp(resp.text)
    if data.get("code") != 1100:
        raise RuntimeError(f"register 失败: {data}")
    return data["detail"]


def fverify(session: requests.Session, captcha_uuid: str,
            rid: str, gap_x: int) -> dict:
    """Step 5: 提交滑块验证"""
    # 生成鼠标轨迹
    mouse_data, duration_ms, wi_ratio = generate_mouse_data(
        gap_x, BG_WIDTH, CSS_WIDTH
    )

    # 构造加密参数
    encrypted = build_encrypt_params(
        wi_value=wi_ratio,
        mouse_data=mouse_data,
        duration_ms=duration_ms,
        true_width=CSS_WIDTH,
        true_height=CSS_HEIGHT,
    )

    # 合并明文参数
    all_params = {
        "organization": ORGANIZATION,
        "rid": rid,
        "rversion": RVERSION,
        "sdkver": SDKVER,
        "protocol": "206",
        "ostype": "web",
        "act.os": "web_pc",
        "captchaUuid": captcha_uuid,
        "callback": _jsonp_callback(),
    }
    all_params.update(encrypted)

    resp = session.get(_build_url("/ca/v2/fverify", all_params), headers=HEADERS, timeout=15)
    return _parse_jsonp(resp.text)


def solve() -> dict:
    """完整求解流程"""
    session = requests.Session()
    captcha_uuid = time.strftime("%Y%m%d%H%M%S", time.localtime()) + \
                   ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', k=18))

    print(f"[1/5] 获取SDK配置...")
    try:
        get_conf(session, captcha_uuid)
        print("  conf OK")
    except Exception as e:
        print(f"  conf 跳过: {e}")

    print(f"[2/5] 注册验证码...")
    reg = register(session, captcha_uuid)
    bg_path = reg["bg"]
    fg_path = reg["fg"]
    rid = reg["rid"]
    print(f"  rid: {rid}")
    print(f"  bg: {bg_path}")

    print(f"[3/5] 云码识别缺口...")
    bg_url = f"https://{STATIC_DOMAIN}{bg_path}"
    fg_url = f"https://{STATIC_DOMAIN}{fg_path}"
    gap_x = recognize_slide_gap(bg_url, fg_url)
    print(f"  缺口 x: {gap_x}")

    print(f"[4/5] 生成轨迹 & 加密参数...")
    mouse_data, duration_ms, wi_ratio = generate_mouse_data(gap_x, BG_WIDTH, CSS_WIDTH)
    print(f"  轨迹点: {len(mouse_data)}, 耗时: {duration_ms}ms, wi: {wi_ratio:.4f}")

    print(f"[5/5] 提交验证...")
    result = fverify(session, captcha_uuid, rid, gap_x)
    risk = result.get("riskLevel", "UNKNOWN")
    print(f"  结果: {risk}")

    return {
        "risk_level": risk,
        "rid": rid,
        "gap_x": gap_x,
        "request_id": result.get("requestId", ""),
        "pass": risk == "PASS",
    }


if __name__ == '__main__':
    result = solve()
    print(f"\n{'验证通过' if result['pass'] else '验证失败'}")
    print(f"详情: {json.dumps(result, ensure_ascii=False, indent=2)}")

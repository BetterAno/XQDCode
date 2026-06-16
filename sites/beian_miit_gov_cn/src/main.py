"""
工信部备案查询 — 端到端脚本
流程: Token -> 验证码(云码API识别) -> 查询

使用: python main.py [域名/公司名]
例:   python main.py www.baidu.com
"""

import sys
import os
import json
import time
import hashlib
import uuid

import requests

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from captcha import solve_slider, extract_b64_image

# === 常量 ===
API_BASE = "https://hlwicpfwc.miit.gov.cn/icpproject_query/api"
AUTH_URL = f"{API_BASE}/auth"
GET_CAPTCHA_URL = f"{API_BASE}/image/getCheckImagePoint"
CHECK_CAPTCHA_URL = f"{API_BASE}/image/checkImage"
QUERY_URL = f"{API_BASE}/icpAbbreviateInfo/queryByCondition"

AUTH_ACCOUNT = "test"
AUTH_SECRET = "test"

COMMON_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/148.0.0.0 Safari/537.36",
    "Origin": "https://beian.miit.gov.cn",
    "Referer": "https://beian.miit.gov.cn/",
    "Accept": "application/json, text/plain, */*",
}


def generate_auth_key(ts: int) -> str:
    return hashlib.md5(f"{AUTH_ACCOUNT}{AUTH_SECRET}{ts}".encode()).hexdigest()


def get_token(session: requests.Session) -> str:
    ts = int(time.time() * 1000)
    auth_key = generate_auth_key(ts)
    r = session.post(
        AUTH_URL,
        data={"authKey": auth_key, "timeStamp": str(ts)},
        headers={**COMMON_HEADERS, "Content-Type": "application/x-www-form-urlencoded"},
        timeout=15,
    )
    data = r.json()
    if data.get("code") != 200:
        raise RuntimeError(f"Token 获取失败: {data}")
    return data["params"]["bussiness"]


def main():
    keyword = sys.argv[1] if len(sys.argv) > 1 else "www.baidu.com"
    print(f"=== ICP备案查询: {keyword} ===\n")

    # 主 session（auth + captcha + check）
    session = requests.Session()

    # [1] Token
    print("[1] 获取 Token...")
    try:
        token = get_token(session)
    except Exception as e:
        print(f"  失败（IP可能被临时限制）: {e}")
        print("  请等待几分钟后重试")
        sys.exit(1)
    print(f"  [OK] Token: {token[:50]}...")

    # [2] 滑块验证码
    print("\n[2] 滑块验证码（云码API识别）...")
    sign = ""
    captcha_uuid = ""

    for attempt in range(8):
        try:
            # 获取验证码
            client_uid = "point-" + str(uuid.uuid4())
            r = session.post(
                GET_CAPTCHA_URL,
                json={"clientUid": client_uid},
                headers={**COMMON_HEADERS, "token": token},
                timeout=15,
            )
            if r.status_code != 200:
                print(f"  #{attempt+1}: HTTP {r.status_code}")
                break
            cap = r.json()
            if not cap.get("success"):
                print(f"  #{attempt+1}: 验证码获取失败")
                continue

            captcha_uuid = cap["params"]["uuid"]
            big_b64 = extract_b64_image(cap["params"].get("bigImage", ""))
            small_b64 = extract_b64_image(cap["params"].get("smallImage", ""))

            if not big_b64 or not small_b64:
                continue

            # 识别
            offset = solve_slider(big_b64, small_b64)
            print(f"  #{attempt+1}: offset={offset}px", end="")

            # 校验（±6 范围）
            for delta in [0, -2, 2, -4, 4, -6, 6]:
                test_offset = offset + delta
                if test_offset < 0:
                    continue
                try:
                    r = session.post(
                        CHECK_CAPTCHA_URL,
                        json={"key": captcha_uuid, "value": str(test_offset)},
                        headers={**COMMON_HEADERS, "token": token},
                        timeout=15,
                    )
                    if r.status_code != 200:
                        break
                    chk = r.json()
                    if chk.get("success"):
                        sign = chk.get("params", "")
                        if isinstance(sign, dict):
                            sign = sign.get("sign", "")
                        print(f" -> [OK] offset={test_offset}")
                        break
                except Exception:
                    break

            if sign:
                break
            print(" x")

        except Exception as e:
            print(f"  #{attempt+1} err: {e}")

        if attempt < 7:
            time.sleep(0.3)
            try:
                token = get_token(session)
            except Exception:
                pass

    if not sign:
        print("  验证码多次失败，请稍后重试")
        sys.exit(1)

    # [3] 查询（独立 session 带 __jsluid_s）
    print(f"\n[3] 查询: {keyword}...")
    query_session = requests.Session()
    query_session.get(
        "https://hlwicpfwc.miit.gov.cn/",
        headers={"User-Agent": COMMON_HEADERS["User-Agent"]},
        timeout=15,
    )

    query_headers = {
        **COMMON_HEADERS,
        "token": token,
        "uuid": captcha_uuid,
        "sign": sign,
        "Content-Type": "application/json",
    }
    body = {"pageNum": "", "pageSize": "", "unitName": keyword, "serviceType": 1}
    r = query_session.post(QUERY_URL, json=body, headers=query_headers, timeout=15)

    if r.status_code != 200:
        print(f"  请求失败: HTTP {r.status_code}")
        print(f"  {r.text[:300]}")
        sys.exit(1)

    result = r.json()
    if result.get("code") == 200 and result.get("params"):
        params = result["params"]
        total = params.get("total", 0)
        records = params.get("list", [])
        print(f"  [OK] 共 {total} 条记录\n")

        for i, rec in enumerate(records[:10]):
            print(f"  [{i+1}] {rec.get('unitName', '')}")
            print(f"      性质: {rec.get('natureName', '')} | 许可证: {rec.get('serviceLicence', '')}")
            print(f"      域名: {rec.get('domain', '')} | 更新: {rec.get('updateTime', '')}")
            print()
    else:
        print(f"  结果: {json.dumps(result, ensure_ascii=False, indent=2)}")


if __name__ == "__main__":
    main()

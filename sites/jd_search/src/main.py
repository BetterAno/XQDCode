"""
JD Search h5st v5.3 - Python request script
Uses Node.js signer for h5st generation, curl_cffi for TLS fingerprint
"""
import json
import subprocess
import sys
import os
import hashlib
import time
import urllib.parse
from curl_cffi import requests

SIGNER_JS = os.path.join(os.path.dirname(__file__), "signer.js")
COOKIES_FILE = os.path.join(os.path.dirname(__file__), "cookies.txt")


def load_cookies() -> str:
    with open(COOKIES_FILE, "r", encoding="utf-8") as f:
        return f.read().strip()


def cookies_to_dict(cookie_str: str) -> dict:
    pairs = cookie_str.split("; ")
    return {p.split("=", 1)[0]: p.split("=", 1)[1] for p in pairs if "=" in p}


def generate_h5st(params: dict) -> dict:
    cmd = ["node", SIGNER_JS, json.dumps(params)]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=15,
                            cwd=os.path.dirname(os.path.abspath(__file__)))
    if result.returncode != 0:
        raise RuntimeError(f"Signer error: {result.stderr}")
    return json.loads(result.stdout)


def search(keyword: str, page: int = 1) -> dict:
    body = {
        "enc": "utf-8",
        "area": "18_1482_48942_49052",
        "page": page,
        "mode": "",
        "concise": False,
        "hoverPictures": False,
        "newAdvRepeat": False,
        "mixerParam": False,
        "new_interval": True,
        "s": 1,
    }

    body_str = json.dumps(body, separators=(",", ":"), ensure_ascii=True)
    body_hash = hashlib.sha256(body_str.encode()).hexdigest()

    t = int(time.time() * 1000)

    sign_params = {
        "appid": "search-pc-java",
        "functionId": "pc_search_searchWare",
        "client": "pc",
        "clientVersion": "1.0.0",
        "t": t,
        "body": body_hash,
    }

    sign_result = generate_h5st(sign_params)

    if "error" in sign_result:
        raise RuntimeError(f"Sign failed: {sign_result['error']}")

    h5st = sign_result.get("h5st", "")

    cookie_str = load_cookies()
    cookies = cookies_to_dict(cookie_str)

    kw_enc = urllib.parse.quote(keyword)
    qs = urllib.parse.urlencode({
        "appid": "search-pc-java",
        "t": t,
        "client": "pc",
        "clientVersion": "1.0.0",
        "cthr": 1,
        "uuid": cookies.get("mba_muid", ""),
        "loginType": 3,
        "keyword": kw_enc,
        "functionId": "pc_search_searchWare",
        "body": body_str,
        "h5st": h5st,
        "x-api-eid-token": cookies.get("3AB9D23F7A4B3CSS", ""),
    })

    url = f"https://api.m.jd.com/api?{qs}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
        "Referer": f"https://search.jd.com/Search?keyword={kw_enc}&enc=utf-8",
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://search.jd.com",
        "x-referer-page": f"https://search.jd.com/Search?keyword={kw_enc}&enc=utf-8",
        "x-rp-client": "pc_search",
    }

    resp = requests.get(url, headers=headers, cookies=cookies,
                        timeout=15, impersonate="chrome136")
    return resp.json()


def _safe_print(text: str):
    sys.stdout.buffer.write((text + "\n").encode("utf-8", errors="replace"))
    sys.stdout.buffer.flush()


if __name__ == "__main__":
    keyword = sys.argv[1] if len(sys.argv) > 1 else "电脑"
    _safe_print(f"Searching JD for: {keyword}")

    try:
        result = search(keyword)
        code = result.get("code", -1)
        if code == 0:
            products = result.get("data", {}).get("wareList", [])
            _safe_print(f"Found {len(products)} products\n")
            for i, p in enumerate(products[:20], 1):
                name = p.get("wareName", "N/A")
                price = p.get("jdPrice", "N/A")
                ware_id = p.get("wareId", "")
                _safe_print(f"  {i:2d}. ¥{price:>10}  {name[:60]}  [{ware_id}]")

            # 保存到json文件中
            # with open(f"{keyword}_JD_{time.strftime('%Y-%m-%d')}.json", "a", encoding="utf-8") as f:
            #     json.dump({
            #         "name": name,
            #         "price": price,
            #         "ware_id": ware_id
            #     }, f, ensure_ascii=False)
            #     f.write("\n")

            # 保存到txt文件中
            with open(f"demo_check.txt", "a", encoding="utf-8") as f:
                f.write(str(products))

        elif code == 605:
            _safe_print("Cookie expired or risk control triggered (code 605)")
            _safe_print("Please update cookies.txt with fresh browser cookies")
        else:
            _safe_print(f"API error: code={code}")
            _safe_print(json.dumps(result, ensure_ascii=False, indent=2)[:2000])
    except FileNotFoundError:
        _safe_print(f"cookies.txt not found at {COOKIES_FILE}")
    except Exception as e:
        _safe_print(f"Error: {e}")

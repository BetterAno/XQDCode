"""
大众点评 mtgsig 签名生成主脚本
使用 Node.js VM 混合签名器生成 mtgsig, 通过 requests 发送协议请求

用法:
    python signer.py                 # 生成 mtgsig 并发送测试请求
    python signer.py --url <URL>     # 指定目标URL
"""
import subprocess
import json
import sys
import os
import requests

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
SIGNER_JS = os.path.join(PROJECT_DIR, "hybrid_signer.js")


def generate_mtgsig() -> dict:
    """调用 Node.js 混合签名器生成 mtgsig"""
    result = subprocess.run(
        ["node", SIGNER_JS],
        capture_output=True,
        text=True,
        cwd=PROJECT_DIR,
        timeout=30,
        encoding="utf-8",
        errors="replace",
    )
    if result.returncode != 0:
        raise RuntimeError(f"签名器失败: {result.stderr}")

    # 从输出中提取 JSON
    output = result.stdout
    # 找到第一个 { 开始的 JSON 对象
    start = output.find('{"a1"')
    if start == -1:
        # 尝试在 mtgsig HTTP Header 行之后找
        start = output.find('{"a1"', output.find("mtgsig HTTP Header"))
    if start == -1:
        raise RuntimeError(f"无法从输出中提取 mtgsig: {output[:500]}")

    end = output.find("\n", start)
    if end == -1:
        end = len(output)

    json_str = output[start:end].strip()
    return json.loads(json_str)


def load_cookies():
    """从 real_b_data.json 加载浏览器 cookies"""
    real_b_path = os.path.join(PROJECT_DIR, "real_b_data.json")
    if not os.path.exists(real_b_path):
        return {}
    with open(real_b_path, "r", encoding="utf-8") as f:
        real_b = json.load(f)
    cookies_str = real_b.get("cookies", "")
    user_agent = real_b.get("userAgent", "Mozilla/5.0")
    cookies = {}
    for item in cookies_str.split("; "):
        if "=" in item:
            k, v = item.split("=", 1)
            cookies[k] = v
    return cookies, user_agent


def send_request(url: str, mtgsig: dict) -> requests.Response:
    """发送带 mtgsig 签名的请求"""
    cookies, user_agent = load_cookies()
    headers = {
        "User-Agent": user_agent,
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "mtgsig": json.dumps(mtgsig, separators=(",", ":")),
        "Referer": "https://m.dianping.com/shop/G7lZQSVUguP43EIT",
        "Origin": "https://m.dianping.com",
    }

    response = requests.get(url, headers=headers, cookies=cookies, timeout=15)
    return response


def main():
    # 默认测试 URL: 店铺问答接口
    default_url = (
        "https://m.dianping.com/wxmapi/shop/shopquestion"
        "?csecplatform=4&csecversion=4.2.0&device_system="
        "&shopId=G7lZQSVUguP43EIT&yodaReady=h5"
    )

    url = sys.argv[1] if len(sys.argv) > 1 else default_url

    print("=" * 60)
    print("dianping mtgsig signer test")
    print("=" * 60)

    # 1. 生成签名
    print("\n[1/2] generating mtgsig...")
    try:
        mtgsig = generate_mtgsig()
        print(f"  OK mtgsig generated")
        print(f"  a1: {mtgsig.get('a1')}")
        print(f"  a2: {mtgsig.get('a2')}")
        print(f"  a8: {mtgsig.get('a8')}")
        print(f"  d1: {mtgsig.get('d1')}")
    except Exception as e:
        print(f"  FAIL: {e}")
        sys.exit(1)

    # 2. 发送请求
    print(f"\n[2/2] sending request to {url[:80]}...")
    try:
        resp = send_request(url, mtgsig)
        print(f"  HTTP {resp.status_code}")
        print(f"  Content-Type: {resp.headers.get('Content-Type', 'N/A')}")

        # 尝试解析响应
        try:
            data = resp.json()
            print(f"  response (JSON): {json.dumps(data, ensure_ascii=False)[:200]}")
        except Exception:
            print(f"  response (text): {resp.text[:200]}")

        if resp.status_code == 200:
            print("\nOK success!")
        elif resp.status_code == 403:
            print("\nWARN 403 Forbidden - signature may be invalid or token expired")
        else:
            print(f"\nWARN HTTP {resp.status_code}")
    except requests.RequestException as e:
        print(f"  FAIL: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

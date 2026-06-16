"""测试瑞数 P cookie 是否可以直接请求 ouyeel API"""
import subprocess
import requests
import re
import json

# 1. 从 Node.js 获取 cookie
print("[1] Getting fresh cookie from Node.js...")
result = subprocess.run(
    ["node", "sites/cnipa/src/get_cookie.js"],
    capture_output=True, text=True, timeout=15, cwd="."
)
output = result.stderr + result.stdout
# Extract cookie value
match = re.search(r'T0k1m0u5AfREP=([^;]+)', output)
if not match:
    print("FAILED to extract cookie!")
    print("Output:", output[:500])
    exit(1)
p_cookie = match.group(1)
print(f"[1] Got P cookie: {match.group(0)[:80]}...")

# 2. Prepare other cookies (from browser session)
other_cookies = {
    "cookiesession1": "678A3E1A88C3CC3100EF4DBAE9DBA0CF",
}

# 3. Test: without K5nOZLud suffix
url = "https://www.ouyeel.com/search-ng/commoditySearch/queryCommodityResult"
headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://www.ouyeel.com/steel/search?pageIndex=0&pageSize=50",
    "Origin": "https://www.ouyeel.com",
}
body = {
    "criteriaJson": json.dumps({
        "pageSize": 10,
        "pageIndex": 0,
        "productType": None,
        "sort": None,
        "key_search": None,
        "jsonParam": {"keywordAnalyseResult": None},
        "excludeShowSoldOut": None,
    })
}

print("\n[2] Testing WITHOUT K5nOZLud suffix...")
resp = requests.post(url, headers=headers, data=body,
                     cookies={"T0k1m0u5AfREP": p_cookie, **other_cookies}, timeout=10)
print(f"    Status: {resp.status_code}")
print(f"    Body preview: {resp.text[:300]}")

# 4. Test: with K5nOZLud suffix (empty/placeholder first)
if resp.status_code != 200:
    print("\n[3] Trying with a placeholder K5nOZLud...")
    # 从浏览器抓的样本里取一个试试 (可能过期)
    test_suffix = "S38iNGlqEtLQ7xxpfDNWt4Kqrxg.JN4HvkTyN3FnKEIFH0UIvzH0El2j3ITNlIlEl.uGV7Ar.opqXaDXPvN2.GYBmgW8B4WG"
    url2 = f"{url}?K5nOZLud={test_suffix}"
    resp2 = requests.post(url2, headers=headers, data=body,
                          cookies={"T0k1m0u5AfREP": p_cookie, **other_cookies}, timeout=10)
    print(f"    Status: {resp2.status_code}")
    print(f"    Body preview: {resp2.text[:300]}")

# 5. 也试一下简单的首页请求
print("\n[4] Testing homepage request...")
resp3 = requests.get("https://www.ouyeel.com/steel/search?pageIndex=0&pageSize=50",
                     cookies={"T0k1m0u5AfREP": p_cookie, **other_cookies},
                     headers={"User-Agent": headers["User-Agent"]}, timeout=10)
print(f"    Status: {resp3.status_code}")
print(f"    Has <meta r='m'>: {'r=m' in resp3.text[:500]}")
print(f"    Body length: {len(resp3.text)}")

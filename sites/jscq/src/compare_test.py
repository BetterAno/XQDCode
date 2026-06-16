"""
Inject the 412 response HTML into Playwright and capture the cookie.
This lets us compare what a real browser produces for the SAME challenge.
"""
import json
import os
import re
import sys
import requests

BASE_URL = "https://www.jscq.com.cn"
TARGET_URL = f"{BASE_URL}/jscq/cqjy/jygg/cqzr/index.shtml"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
}

# Step 1: Get 412 response
print("[1] Fetching 412 response...")
session = requests.Session()
session.headers.update(HEADERS)
resp = session.get(TARGET_URL, timeout=15)
print(f"    Status: {resp.status_code}")

if resp.status_code != 412:
    print("Not 412, exiting")
    sys.exit(1)

html = resp.text

# Save the 412 HTML for Playwright
html_path = os.path.join(os.path.dirname(__file__), "..", "assets", "412_test.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)
print(f"    Saved to {html_path}")

# Also save the O cookie
o_cookie_name = None
o_cookie_value = None
for cookie in session.cookies:
    if cookie.name.endswith("O"):
        o_cookie_name = cookie.name
        o_cookie_value = cookie.value
        print(f"    O Cookie: {cookie.name}={cookie.value[:40]}...")
        break

# Save all info for Node.js comparison
input_data = {
    "url": TARGET_URL,
    "o_cookie_name": o_cookie_name or "",
    "o_cookie_value": o_cookie_value or "",
}
info_path = os.path.join(os.path.dirname(__file__), "..", "assets", "browser_test_info.json")
with open(info_path, "w", encoding="utf-8") as f:
    json.dump(input_data, f, ensure_ascii=False)
print(f"    Info saved to {info_path}")
print(f"\nNow run Playwright to load this HTML and compare cookies.")

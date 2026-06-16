"""Dump FULL querySlideImage response to find all fields"""
import json, uuid, requests

BASE = "https://acs.fcbox.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "*/*",
    "Origin": "https://www.fcbox.com",
    "Referer": "https://www.fcbox.com/",
}

uid = str(uuid.uuid4())
url = f"{BASE}/captcha/querySlideImage/{uid}"
resp = requests.post(url, headers=HEADERS, timeout=15)
data = resp.json()

print(json.dumps(data, indent=2, ensure_ascii=False))

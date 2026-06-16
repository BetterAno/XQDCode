"""Phase 1.5 — pull each vmp endpoint 3 times, compare sha256.

Goal: distinguish two scenarios
  (a) per-fetch polymorphism : sha256 changes every request -> pure-algo VM is dead in water
  (b) per-endpoint polymorphism only : sha256 stable per URL -> we can build one VM per endpoint
"""
from __future__ import annotations
import hashlib
import time
from curl_cffi import requests as cffi_requests

URLS = [
    ("oQ91zEKu9zN4", "https://swapp.singlewindow.cn/qspserver/ZCQq7Fzuhp12/oQ91zEKu9zN4.44d6eb6.js"),
    ("BSrw3csEQORp", "https://swapp.singlewindow.cn/qspserver/ZCQq7Fzuhp12/BSrw3csEQORp.44d6eb6.js"),
]
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    "Referer": "https://swapp.singlewindow.cn/qspserver/sw/qsp/query/view/import",
}

session = cffi_requests.Session()
for name, url in URLS:
    digests = []
    for i in range(3):
        r = session.get(url, headers=HEADERS, impersonate="chrome120", timeout=15)
        d = hashlib.sha256(r.content).hexdigest()
        digests.append((d[:16], len(r.content)))
        time.sleep(0.6)
    same = len(set(d for d, _ in digests)) == 1
    print(f"{name}: same={same}  fetches={digests}")

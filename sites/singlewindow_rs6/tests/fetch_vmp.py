"""Phase 1.2 — download the two rs6 vmp JS files referenced by 412 responses,
then diff them and against the dispatcher tail in sites/rs6js_code.js."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
from curl_cffi import requests as cffi_requests

SITE = Path(__file__).resolve().parents[1]
JS_DIR = SITE / "assets" / "js"
JS_DIR.mkdir(parents=True, exist_ok=True)

VMP_URLS = {
    "oQ91zEKu9zN4": "https://swapp.singlewindow.cn/qspserver/ZCQq7Fzuhp12/oQ91zEKu9zN4.44d6eb6.js",
    "BSrw3csEQORp": "https://swapp.singlewindow.cn/qspserver/ZCQq7Fzuhp12/BSrw3csEQORp.44d6eb6.js",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    "Accept": "*/*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": "https://swapp.singlewindow.cn/qspserver/sw/qsp/query/view/import",
}

summary = {}
session = cffi_requests.Session()
for name, url in VMP_URLS.items():
    r = session.get(url, headers=HEADERS, impersonate="chrome120", timeout=20)
    out = JS_DIR / f"{name}.44d6eb6.js"
    out.write_bytes(r.content)
    digest = hashlib.sha256(r.content).hexdigest()
    summary[name] = {
        "status": r.status_code,
        "size": len(r.content),
        "sha256": digest,
        "first_200": r.text[:200],
    }
    print(f"{name}: {r.status_code} {len(r.content)} bytes  sha256={digest[:16]}...")

(SITE / "assets" / "vmp_summary.json").write_text(
    json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8"
)
print("\n--- vmp_summary.json written ---")

# diff size and digest
a, b = summary["oQ91zEKu9zN4"], summary["BSrw3csEQORp"]
if a["sha256"] == b["sha256"]:
    print("=> identical vmp bytes; the two filenames are just routing decoys")
else:
    print("=> different vmp bytes; will need a per-endpoint diff")

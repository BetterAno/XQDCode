"""Phase 1 — probe initial 412 response for singlewindow_rs6.

抓取:
  - 目标页 view/import 的 412 响应
  - 数据接口 biznew/import 的初始响应
  - 响应中嵌入的 $_ts.nsd / $_ts.cd / 外链 JS URL / meta content
  - Set-Cookie 头（特别是 enable_* 和首发 O cookie）

使用 curl_cffi 伪装 Chrome 147 TLS+JA3 指纹。
产物落到 sites/singlewindow_rs6/assets/。
"""
from __future__ import annotations
import json
import re
import sys
from pathlib import Path
from curl_cffi import requests as cffi_requests

SITE_ROOT = Path(__file__).resolve().parents[1]
ASSETS = SITE_ROOT / "assets"
JS_DIR = ASSETS / "js"

TARGETS = [
    ("view_import", "https://swapp.singlewindow.cn/qspserver/sw/qsp/query/view/import"),
    ("biznew_import", "https://swapp.singlewindow.cn/qspserver/sw/qsp/query/biznew/import"),
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
}

RS_PATTERNS = {
    "ts_nsd": re.compile(r"\$_ts\.nsd\s*=\s*(\d+)"),
    "ts_cd": re.compile(r"\$_ts\.cd\s*=\s*\"([^\"]{20,})\""),
    "meta_content": re.compile(r"<meta[^>]+name=[\"']?_ts[\"']?[^>]*content=[\"']([^\"']+)[\"']", re.I),
    "rs_path": re.compile(r"/([A-Za-z0-9_-]{8,16})/([A-Za-z0-9_.-]+\.js)"),
    "enable_cookie": re.compile(r"enable_([A-Za-z0-9]{10,16})\s*=", re.I),
    "ts_call": re.compile(r"\$_ts\.[a-z]+\s*\(\)"),
}


def probe_one(name: str, url: str, session) -> dict:
    print(f"\n=== {name}: {url} ===")
    resp = session.get(url, headers=HEADERS, allow_redirects=False, impersonate="chrome120", timeout=20)
    body = resp.text or ""
    body_bytes = resp.content or b""

    print(f"status = {resp.status_code}")
    print(f"len    = {len(body_bytes)} bytes")
    print(f"set-cookie headers:")
    for k, v in resp.headers.items():
        if k.lower() == "set-cookie":
            print(f"  {v[:200]}")

    # save raw
    (ASSETS / f"{name}_body.html").write_bytes(body_bytes)
    headers_dump = {k: v for k, v in resp.headers.items()}
    (ASSETS / f"{name}_headers.json").write_text(json.dumps(headers_dump, indent=2, ensure_ascii=False), encoding="utf-8")

    findings = {"status": resp.status_code, "length": len(body_bytes)}
    for key, pat in RS_PATTERNS.items():
        m = pat.search(body)
        if m:
            value = m.group(0) if key == "ts_call" else (m.group(1) if m.groups() else m.group(0))
            findings[key] = value[:200] + ("..." if len(value) > 200 else "")
    findings["set_cookie"] = resp.headers.get_list("Set-Cookie") if hasattr(resp.headers, "get_list") else [v for k, v in resp.headers.items() if k.lower() == "set-cookie"]

    # find all external JS URLs
    js_urls = re.findall(r"<script[^>]+src=[\"']([^\"']+)[\"']", body)
    findings["script_srcs"] = js_urls

    print(f"\nfindings: {json.dumps({k: v for k, v in findings.items() if k not in ('set_cookie',)}, indent=2, ensure_ascii=False)}")
    return findings


def main():
    JS_DIR.mkdir(parents=True, exist_ok=True)
    session = cffi_requests.Session()
    all_findings = {}
    for name, url in TARGETS:
        try:
            all_findings[name] = probe_one(name, url, session)
        except Exception as exc:
            print(f"!! {name} failed: {exc}", file=sys.stderr)
            all_findings[name] = {"error": repr(exc)}
    (ASSETS / "phase1_summary.json").write_text(
        json.dumps(all_findings, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print("\n--- summary written to assets/phase1_summary.json ---")


if __name__ == "__main__":
    main()

# -*- coding: utf-8 -*-
"""Cookie-driven offline entrypoint for waimai-guide diagnostics.

The script accepts a Cookie header, builds the mtop request context, validates
the non-security mtop sign chain, and writes a redacted report. It never sends
the target business request.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional
from urllib.parse import urlencode

from main import (
    TARGET_API,
    extract_mtop_token,
    mask_value,
    mtop_sign,
    parse_cookie_header,
    run_node_signer,
)


ROOT = Path(__file__).resolve().parent.parent
REPORT_PATH = ROOT / "docs" / "cookie-pipeline-report.json"
ENDPOINT = "https://waimai-guide.ele.me/h5/mtop.relationrecommend.elemetinyapprecommend.recommend/1.0/5.0/"
QUERY_API = "mtop.relationrecommend.ElemeTinyAppRecommend.recommend"
DEFAULT_X_ELE_UA = (
    "RenderWay/H5 MiniAppId/2021001110676437 MiniAppVersion/11.22.26  "
    "AppName/h5  MiniHostVersion/11.27.0 H5Version/11.27.0 "
    "channel/mobile subChannel/mobile.default"
)


def sha256_16(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:16]


def now_ms() -> int:
    return int(time.time() * 1000)


def iso_from_ms(value: Optional[int]) -> Optional[str]:
    if value is None:
        return None
    return datetime.fromtimestamp(value / 1000, tz=timezone.utc).isoformat()


def read_cookie(args: argparse.Namespace) -> str:
    if args.cookie:
        return args.cookie.strip()
    if args.cookie_file:
        return args.cookie_file.read_text(encoding="utf-8").strip()
    env_cookie = os.environ.get("ELEME_COOKIE", "").strip()
    if env_cookie:
        return env_cookie
    raise SystemExit("missing cookie: use --cookie-file, --cookie, or ELEME_COOKIE")


def parse_mtop_cookie_expiry(cookies: Dict[str, str]) -> Dict[str, Any]:
    raw = cookies.get("_m_h5_tk", "")
    if "_" not in raw:
        return {"present": bool(raw), "expiresAtMs": None, "expiresAtUtc": None, "ttlMs": None}
    _, expires_text = raw.rsplit("_", 1)
    try:
        expires_at = int(expires_text)
    except ValueError:
        expires_at = None
    ttl = expires_at - now_ms() if expires_at else None
    return {
        "present": True,
        "expiresAtMs": expires_at,
        "expiresAtUtc": iso_from_ms(expires_at),
        "ttlMs": ttl,
        "expiredNow": ttl is not None and ttl <= 0,
    }


def parse_x5sec_shape(cookies: Dict[str, str]) -> Dict[str, Any]:
    raw = cookies.get("x5sec", "")
    if not raw:
        return {"present": False}
    info: Dict[str, Any] = {"present": True, "length": len(raw)}
    try:
        decoded = bytes.fromhex(raw).decode("utf-8", errors="replace")
        payload = json.loads(decoded)
    except Exception as exc:
        info["decodeOk"] = False
        info["error"] = str(exc)
        return info
    t_value = payload.get("t")
    issued_ms = int(t_value) * 1000 if isinstance(t_value, int) else None
    info.update(
        {
            "decodeOk": True,
            "keys": sorted(payload.keys()),
            "issuedAtMs": issued_ms,
            "issuedAtUtc": iso_from_ms(issued_ms),
            "ageMs": now_ms() - issued_ms if issued_ms else None,
        }
    )
    return info


def build_inner_params(args: argparse.Namespace, cookies: Dict[str, str]) -> Dict[str, Any]:
    limit = args.limit
    page = args.page
    offset = args.offset if args.offset is not None else max(0, (page - 1) * limit)
    entry_code = str(args.search_entry_code)
    inner: Dict[str, Any] = {
        "_input_charset": "UTF-8",
        "_output_charset": "UTF-8",
        "gatewayApiType": "mtop",
        "mtop_api_version": "1.0",
        "appId": "26551",
        "x-ele-scene": args.scene,
        "channelCode": "0",
        "platform": "999",
        "alipayChannel": 1,
        "sversion": "15.0",
        "offset": offset,
        "limit": limit,
        "n": limit,
        "page": page,
        "locationSource": "taobao",
        "latitude": args.latitude,
        "longitude": args.longitude,
        "keyword": args.keyword,
        "searchExtraParams": json.dumps({"searchEntryCode": args.search_entry_code}, ensure_ascii=False, separators=(",", ":")),
        "searchMode": args.search_mode,
        "fixSearch": args.fix_search,
        "comprehensiveFilterList": "null",
        "storeParams": "{}",
    }
    user_id = args.user_id or cookies.get("USERID") or cookies.get("__ebg_uid") or cookies.get("UTUSER")
    if user_id:
        inner["userId"] = str(user_id)
    if args.rank_id:
        inner["rankId"] = args.rank_id
    if args.refer:
        inner["refer"] = args.refer
    if entry_code:
        inner["searchEntryCode"] = entry_code
    return inner


def build_data_value(args: argparse.Namespace, cookies: Dict[str, str]) -> str:
    outer = {
        "type": "originaljson",
        "appId": "26551",
        "params": json.dumps(build_inner_params(args, cookies), ensure_ascii=False, separators=(",", ":")),
    }
    return json.dumps(outer, ensure_ascii=False, separators=(",", ":"))


def build_query(t_value: str, app_key: str, sign: str) -> Dict[str, str]:
    return {
        "jsv": "2.7.5",
        "appKey": app_key,
        "t": t_value,
        "sign": sign,
        "api": QUERY_API,
        "v": "1.0",
        "type": "originaljson",
        "dataType": "json",
        "timeout": "6000",
        "mainDomain": "ele.me",
        "subDomain": "waimai-guide",
        "H5Request": "true",
        "ttid": "h5@chrome_pc_148.0.0.0",
        "SV": "5.0",
        "EtRequest": "true",
        "syncCookieMode": "true",
        "pageDomain": "ele.me",
    }


def build_headers(args: argparse.Namespace, cookies: Dict[str, str]) -> Dict[str, str]:
    xqkp = cookies.get("xqkp", "")
    bx_umidtoken = xqkp.rstrip("=") if xqkp else ""
    return {
        "accept": "application/json",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
        "origin": "https://h5.ele.me",
        "referer": args.referer,
        "user-agent": args.user_agent,
        "x-decode-ua": "false",
        "x-ele-check-client": "ele",
        "x-ele-scene": args.scene,
        "x-ele-ua": args.x_ele_ua,
        "x-secext-city": "-1",
        "bx-umidtoken": bx_umidtoken,
    }


def redact_headers(headers: Dict[str, str]) -> Dict[str, Any]:
    redacted: Dict[str, Any] = {}
    for key, value in headers.items():
        if key in {"bx-umidtoken", "x-ele-check"}:
            redacted[key] = {"present": bool(value), "length": len(value), "sha256_16": sha256_16(value) if value else None}
        else:
            redacted[key] = value
    return redacted


def summarize_cookies(cookies: Dict[str, str]) -> Dict[str, Any]:
    required = ["_m_h5_tk", "_m_h5_tk_enc", "x5sec", "xqkp", "tfstk", "cna"]
    return {
        "keys": sorted(cookies.keys()),
        "required": {name: {"present": name in cookies, "length": len(cookies.get(name, ""))} for name in required},
        "mtopToken": parse_mtop_cookie_expiry(cookies),
        "x5sec": parse_x5sec_shape(cookies),
    }


def call_security_provider(
    provider: str,
    url_for_et: str,
    body: str,
    data_value: str,
    cookie_header: str,
) -> Dict[str, Any]:
    if not provider:
        return {
            "available": False,
            "reason": "No authorized provider configured. bx_et and x-ele-check are not generated by this entrypoint.",
            "providerContract": ["etSign(url, ctx)", "xCheck(prefix, api, ctx)", "xEleUa(ctx)", "umidToken(ctx)"],
        }
    result = run_node_signer(
        {
            "action": "diagnose",
            "url": url_for_et,
            "body": body,
            "data": data_value,
            "cookie": cookie_header,
            "provider": provider,
        }
    )
    security = result.get("security") if isinstance(result, dict) else None
    if not isinstance(security, dict):
        return {"available": False, "error": result}
    out: Dict[str, Any] = {"available": bool(security.get("available"))}
    for source_key, report_key in [
        ("bx_et", "bx_et"),
        ("x_ele_check", "x-ele-check"),
        ("x_ele_ua", "x-ele-ua"),
        ("bx_umidtoken", "bx-umidtoken"),
    ]:
        value = security.get(source_key)
        out[report_key] = {
            "present": bool(value),
            "length": len(str(value)) if value else 0,
            "sha256_16": sha256_16(str(value)) if value else None,
        }
    if security.get("reason"):
        out["reason"] = security.get("reason")
    return out


def build_report(args: argparse.Namespace) -> Dict[str, Any]:
    cookie_header = read_cookie(args)
    cookies = parse_cookie_header(cookie_header)
    token = args.token or extract_mtop_token(cookie_header)
    t_value = str(args.t or now_ms())
    app_key = "12574478"
    data_value = build_data_value(args, cookies)
    sign = mtop_sign(token, t_value, app_key, data_value) if token else ""
    query = build_query(t_value, app_key, sign)
    query_string = urlencode(query, doseq=True)
    body = urlencode({"data": data_value})
    base_url = f"{ENDPOINT}?{query_string}"
    # The ET SDK signs the URL-like request material after mtop sign exists.
    url_for_et = f"{base_url}&{body}"
    headers = build_headers(args, cookies)
    security = call_security_provider(args.provider, url_for_et, body, data_value, cookie_header)

    token_expiry = parse_mtop_cookie_expiry(cookies)
    required = summarize_cookies(cookies)["required"]
    has_cookie_prereqs = all(required[name]["present"] for name in ["_m_h5_tk", "_m_h5_tk_enc", "xqkp", "cna"])
    laohe_report = {
        "mode": "offline_cookie_pipeline_no_request",
        "note": "This entrypoint builds and checks the local request context only. It does not send the target business request.",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "target": TARGET_API,
        "request": {
            "method": "POST",
            "endpoint": ENDPOINT,
            "urlForEtDigest": {"length": len(url_for_et), "sha256_16": sha256_16(url_for_et)},
            "query": {
                "appKey": app_key,
                "t": t_value,
                "sign": {"present": bool(sign), "length": len(sign), "sha256_16": sha256_16(sign) if sign else None},
                "api": QUERY_API,
                "SV": "5.0",
            },
            "headers": redact_headers(headers),
            "body": {
                "contentType": "application/x-www-form-urlencoded",
                "dataLength": len(data_value),
                "bodyLength": len(body),
                "dataSha256_16": sha256_16(data_value),
                "innerSelected": {
                    "keyword": args.keyword,
                    "page": args.page,
                    "offset": args.offset if args.offset is not None else max(0, (args.page - 1) * args.limit),
                    "limit": args.limit,
                    "searchMode": args.search_mode,
                    "scene": args.scene,
                },
            },
        },
        "mtopSign": {
            "formula": "md5(token + '&' + t + '&' + appKey + '&' + data)",
            "tokenAvailable": bool(token),
            "tokenLength": len(token or ""),
            "computed": {"present": bool(sign), "length": len(sign), "sha256_16": sha256_16(sign) if sign else None},
        },
        "cookies": summarize_cookies(cookies),
        "securitySlots": {
            "bx-umidtoken": {
                "source": "cookie xqkp without trailing '='",
                "present": bool(headers.get("bx-umidtoken")),
                "length": len(headers.get("bx-umidtoken", "")),
            },
            "provider": security,
        },
        "readiness": {
            "canComputeMtopSign": bool(token and sign),
            "hasCookiePrereqs": has_cookie_prereqs,
            "mtopTokenExpiredNow": token_expiry.get("expiredNow"),
            "needsAuthorizedRuntimeForSecurity": not security.get("available"),
            "willSendRequest": False,
        },
        "nextActions": [
            "If mtopTokenExpiredNow is true, refresh cookies in the browser first.",
            "Generate bx_et and x-ele-check in the same authorized browser/runtime session as the cookies.",
            "Do not mix cookies, bx_et, x-ele-check, and bx-umidtoken from different sessions.",
        ],
    }
    return laohe_report


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Build a redacted local waimai-guide request diagnostic report from cookies.")
    parser.add_argument("--cookie-file", type=Path, help="Text file containing one Cookie header. The file is read locally only.")
    parser.add_argument("--cookie", default="", help="Cookie header string. Prefer --cookie-file to avoid shell history.")
    parser.add_argument("--token", default="", help="Optional _m_h5_tk token prefix override.")
    parser.add_argument("--provider", default="", help="Optional authorized Node security provider. No provider is bundled.")
    parser.add_argument("--t", default="", help="Optional fixed millisecond timestamp. Defaults to current local time.")
    parser.add_argument("--keyword", default="盖码饭")
    parser.add_argument("--latitude", default="28.231626")
    parser.add_argument("--longitude", default="112.884453")
    parser.add_argument("--page", type=int, default=1)
    parser.add_argument("--offset", type=int)
    parser.add_argument("--limit", type=int, default=5)
    parser.add_argument("--search-mode", type=int, default=2)
    parser.add_argument("--search-entry-code", type=int, default=5)
    parser.add_argument("--fix-search", default="0")
    parser.add_argument("--rank-id", default="")
    parser.add_argument("--refer", default="")
    parser.add_argument("--user-id", default="")
    parser.add_argument("--scene", default="search")
    parser.add_argument("--referer", default="https://h5.ele.me/minisearch/result")
    parser.add_argument("--user-agent", default="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36")
    parser.add_argument("--x-ele-ua", default=DEFAULT_X_ELE_UA)
    parser.add_argument("--out", type=Path, default=REPORT_PATH, help="Redacted JSON report path.")
    parser.add_argument("--print", action="store_true", help="Also print the redacted report to stdout.")
    return parser


def main(argv: Optional[list[str]] = None) -> int:
    args = build_arg_parser().parse_args(argv)
    report = build_report(args)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    if args.print:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print(json.dumps({"ok": True, "mode": report["mode"], "reportPath": str(args.out)}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


# -*- coding: utf-8 -*-
"""Offline diagnostics for waimai-guide Ele.me mtop samples.

This script parses HAR files or hook JSON exports, extracts the target mtop
request, and validates the non-security mtop sign formula:

    md5(token + "&" + t + "&" + appKey + "&" + data)

It intentionally does not reproduce production anti-abuse fields such as bx_et,
x-ele-check, bx-umidtoken, or x5sec. Those fields can be supplied by an
authorized local provider through signer.js when testing owned environments.
"""
from __future__ import annotations

import argparse
import ast
import base64
import hashlib
import json
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple
from urllib.parse import parse_qsl, urlencode, urlsplit


ROOT = Path(__file__).resolve().parent.parent
SIGNER_JS = ROOT / "src" / "signer.js"
TARGET_API = "mtop.relationrecommend.elemetinyapprecommend.recommend"


@dataclass
class ParsedBody:
    raw_data: Optional[str]
    outer: Dict[str, Any]
    inner: Dict[str, Any]
    error: Optional[str] = None


def normalize_url(url: str) -> str:
    if url.startswith("//"):
        return "https:" + url
    return url


def mask_value(value: Any, show_sensitive: bool = False, head: int = 10, tail: int = 8) -> Any:
    if value is None or show_sensitive:
        return value
    text = str(value)
    if len(text) <= head + tail + 8:
        return text
    return f"{text[:head]}...{text[-tail:]}({len(text)})"


def headers_to_dict(headers: Any) -> Dict[str, str]:
    if isinstance(headers, dict):
        return {str(k).lower(): str(v) for k, v in headers.items()}
    if isinstance(headers, list):
        out: Dict[str, str] = {}
        for item in headers:
            if not isinstance(item, dict):
                continue
            name = item.get("name")
            value = item.get("value")
            if name is not None and value is not None:
                out[str(name).lower()] = str(value)
        return out
    return {}


def parse_cookie_header(cookie_header: str) -> Dict[str, str]:
    cookies: Dict[str, str] = {}
    for part in cookie_header.split(";"):
        if "=" not in part:
            continue
        name, value = part.split("=", 1)
        cookies[name.strip()] = value.strip()
    return cookies


def extract_mtop_token(cookie_header: str) -> Optional[str]:
    cookies = parse_cookie_header(cookie_header or "")
    token_cookie = cookies.get("_m_h5_tk")
    if not token_cookie:
        return None
    return token_cookie.split("_", 1)[0]


def mtop_sign(token: str, t_value: str, app_key: str, data_value: str) -> str:
    material = f"{token}&{t_value}&{app_key}&{data_value}"
    return hashlib.md5(material.encode("utf-8")).hexdigest()


def parse_query(url: str) -> Dict[str, str]:
    parsed = urlsplit(normalize_url(url))
    return dict(parse_qsl(parsed.query, keep_blank_values=True))


def parse_form_body(body_text: str) -> ParsedBody:
    if not body_text:
        return ParsedBody(raw_data=None, outer={}, inner={}, error="empty body")

    pairs = dict(parse_qsl(body_text, keep_blank_values=True))
    raw_data = pairs.get("data")
    if raw_data is None:
        return ParsedBody(raw_data=None, outer={}, inner={}, error="missing form field: data")

    try:
        outer = json.loads(raw_data)
    except json.JSONDecodeError as exc:
        return ParsedBody(raw_data=raw_data, outer={}, inner={}, error=f"outer JSON error: {exc}")

    inner: Dict[str, Any] = {}
    params = outer.get("params")
    if isinstance(params, str) and params:
        try:
            inner = json.loads(params)
        except json.JSONDecodeError as exc:
            return ParsedBody(raw_data=raw_data, outer=outer, inner={}, error=f"params JSON error: {exc}")

    return ParsedBody(raw_data=raw_data, outer=outer, inner=inner)


def response_text_from_har(content: Dict[str, Any]) -> str:
    text = content.get("text") or ""
    if content.get("encoding") == "base64":
        try:
            return base64.b64decode(text).decode("utf-8", errors="replace")
        except Exception:
            return ""
    return text


def iter_har_entries(har: Dict[str, Any]) -> Iterable[Dict[str, Any]]:
    for entry in har.get("log", {}).get("entries", []):
        request = entry.get("request", {})
        response = entry.get("response", {})
        post_data = request.get("postData") or {}
        content = response.get("content") or {}
        yield {
            "method": request.get("method", ""),
            "url": request.get("url", ""),
            "headers": headers_to_dict(request.get("headers", [])),
            "body": post_data.get("text", ""),
            "status": response.get("status"),
            "response": response_text_from_har(content),
        }


def iter_hook_entries(payload: Any) -> Iterable[Dict[str, Any]]:
    if isinstance(payload, dict):
        if isinstance(payload.get("relationLogs"), list):
            payload = payload["relationLogs"]
        elif isinstance(payload.get("logs"), list):
            payload = payload["logs"]
        else:
            payload = [payload]

    if not isinstance(payload, list):
        return

    last_send_by_t: Dict[str, Dict[str, Any]] = {}
    for item in payload:
        if not isinstance(item, dict):
            continue
        url = item.get("url", "")
        if TARGET_API not in url.lower():
            continue
        query = parse_query(url)
        t_value = query.get("t", "")
        if item.get("kind") == "xhr:send":
            last_send_by_t[t_value] = item
            yield {
                "method": item.get("method", ""),
                "url": url,
                "headers": headers_to_dict(item.get("headers", {})),
                "body": item.get("body", ""),
                "status": item.get("status"),
                "response": item.get("response", ""),
            }
        elif item.get("kind") == "xhr:loadend":
            send_item = last_send_by_t.get(t_value, {})
            yield {
                "method": item.get("method") or send_item.get("method", ""),
                "url": url,
                "headers": headers_to_dict(send_item.get("headers", {})),
                "body": send_item.get("body", ""),
                "status": item.get("status"),
                "response": item.get("response", ""),
            }


def _literal_assignments_from_python(sample_path: Path) -> Tuple[Dict[str, Any], Optional[str]]:
    """Read top-level literal assignments from a requests-style sample.

    The file is parsed with ast and never executed. Supported variables:
    cookies, headers, params, data. The first literal URL passed to
    requests.post(...) is also extracted when present.
    """
    tree = ast.parse(sample_path.read_text(encoding="utf-8"), filename=str(sample_path))
    values: Dict[str, Any] = {}
    post_url: Optional[str] = None

    for node in tree.body:
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id in {"cookies", "headers", "params", "data"}:
                    try:
                        values[target.id] = ast.literal_eval(node.value)
                    except Exception as exc:
                        values[f"{target.id}__error"] = f"literal parse failed: {exc}"
            value = node.value
        elif isinstance(node, ast.Expr):
            value = node.value
        else:
            continue

        if isinstance(value, ast.Call):
            func = value.func
            is_post = (
                isinstance(func, ast.Attribute)
                and func.attr == "post"
                and isinstance(func.value, ast.Name)
                and func.value.id == "requests"
            )
            if is_post and value.args and isinstance(value.args[0], ast.Constant) and isinstance(value.args[0].value, str):
                post_url = value.args[0].value

    return values, post_url


def cookie_dict_to_header(cookies: Any) -> str:
    if isinstance(cookies, dict):
        return "; ".join(f"{name}={value}" for name, value in cookies.items())
    return ""


def iter_requests_py_entries(sample_path: Path) -> Iterable[Dict[str, Any]]:
    values, post_url = _literal_assignments_from_python(sample_path)
    params = values.get("params") if isinstance(values.get("params"), dict) else {}
    headers = values.get("headers") if isinstance(values.get("headers"), dict) else {}
    cookies = values.get("cookies") if isinstance(values.get("cookies"), dict) else {}
    data = values.get("data") if isinstance(values.get("data"), dict) else values.get("data", "")

    url = post_url or "https://waimai-guide.ele.me/h5/mtop.relationrecommend.elemetinyapprecommend.recommend/1.0/5.0/"
    if isinstance(params, dict) and params:
        url = url + ("&" if "?" in url else "?") + urlencode(params, doseq=True)

    if isinstance(data, dict):
        body = urlencode(data, doseq=True)
    else:
        body = str(data or "")

    header_dict = headers_to_dict(headers)
    if "cookie" not in header_dict:
        cookie_header = cookie_dict_to_header(cookies)
        if cookie_header:
            header_dict["cookie"] = cookie_header

    yield {
        "method": "POST",
        "url": url,
        "headers": header_dict,
        "body": body,
        "status": None,
        "response": "",
        "source": str(sample_path),
    }


def load_entries(
    har_path: Optional[Path],
    sample_path: Optional[Path],
    requests_py_path: Optional[Path],
) -> List[Dict[str, Any]]:
    entries: List[Dict[str, Any]] = []
    if har_path:
        har = json.loads(har_path.read_text(encoding="utf-8"))
        entries.extend(iter_har_entries(har))
    if sample_path:
        payload = json.loads(sample_path.read_text(encoding="utf-8"))
        entries.extend(iter_hook_entries(payload))
    if requests_py_path:
        entries.extend(iter_requests_py_entries(requests_py_path))

    target_entries = []
    for item in entries:
        url = item.get("url", "")
        if TARGET_API in url.lower():
            target_entries.append(item)
    return target_entries


def pick_inner_params(inner: Dict[str, Any]) -> Dict[str, Any]:
    keys = [
        "gatewayApiType",
        "mtop_api_version",
        "appId",
        "x-ele-scene",
        "channelCode",
        "platform",
        "sversion",
        "keyword",
        "refer",
        "page",
        "offset",
        "limit",
        "n",
        "searchMode",
        "searchEntryCode",
    ]
    return {key: inner.get(key) for key in keys if key in inner}


def collect_names(node: Any, limit: int = 8) -> List[str]:
    names: List[str] = []

    def walk(value: Any) -> None:
        if len(names) >= limit:
            return
        if isinstance(value, dict):
            name = value.get("name")
            if isinstance(name, str) and name and name not in names:
                names.append(name)
            for child in value.values():
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(node)
    return names


def summarize_response(response_text: str) -> Dict[str, Any]:
    if not response_text:
        return {"present": False}
    try:
        data = json.loads(response_text)
    except json.JSONDecodeError:
        return {"present": True, "json": False, "prefix": response_text[:300]}

    result = (data.get("data") or {}).get("result")
    first = result[0] if isinstance(result, list) and result else None
    return {
        "present": True,
        "json": True,
        "api": data.get("api"),
        "ret": data.get("ret"),
        "traceId": data.get("traceId"),
        "resultCount": len(result) if isinstance(result, list) else None,
        "firstBlockKeys": list(first.keys())[:12] if isinstance(first, dict) else [],
        "sampleNames": collect_names(first),
    }


def run_node_signer(payload: Dict[str, Any]) -> Dict[str, Any]:
    if not SIGNER_JS.exists():
        return {"ok": False, "error": f"missing signer.js: {SIGNER_JS}"}
    try:
        proc = subprocess.run(
            ["node", str(SIGNER_JS)],
            input=json.dumps(payload, ensure_ascii=False),
            text=True,
            capture_output=True,
            timeout=15,
            check=False,
        )
    except Exception as exc:
        return {"ok": False, "error": str(exc)}

    if proc.returncode != 0:
        return {"ok": False, "error": proc.stderr.strip() or proc.stdout.strip()}
    try:
        return json.loads(proc.stdout)
    except json.JSONDecodeError:
        return {"ok": False, "error": "node returned non-json", "stdout": proc.stdout[:500]}


def diagnose_entry(
    entry: Dict[str, Any],
    cookie_override: str = "",
    token_override: str = "",
    provider: str = "",
    show_sensitive: bool = False,
) -> Dict[str, Any]:
    url = normalize_url(entry.get("url", ""))
    query = parse_query(url)
    headers = headers_to_dict(entry.get("headers", {}))
    cookie_header = cookie_override or headers.get("cookie", "")
    token = token_override or extract_mtop_token(cookie_header or "")
    parsed_body = parse_form_body(entry.get("body", ""))
    app_key = query.get("appKey", "")
    t_value = query.get("t", "")
    expected_sign = query.get("sign", "")

    computed_sign = None
    sign_matches = None
    if token and parsed_body.raw_data and app_key and t_value:
        computed_sign = mtop_sign(token, t_value, app_key, parsed_body.raw_data)
        sign_matches = computed_sign == expected_sign

    node_payload = {
        "action": "diagnose",
        "url": url,
        "query": query,
        "body": entry.get("body", ""),
        "data": parsed_body.raw_data,
        "cookie": cookie_header,
        "token": token,
        "provider": provider,
    }
    node_result = run_node_signer(node_payload)

    security = {
        "bx_et": {
            "present": bool(query.get("bx_et")),
            "value": mask_value(query.get("bx_et"), show_sensitive),
        },
        "x-ele-check": {
            "present": bool(headers.get("x-ele-check")),
            "value": mask_value(headers.get("x-ele-check"), show_sensitive),
        },
        "x-ele-ua": headers.get("x-ele-ua"),
        "bx-umidtoken": {
            "present": bool(headers.get("bx-umidtoken")),
            "value": mask_value(headers.get("bx-umidtoken"), show_sensitive),
        },
        "x5sec": {
            "presentInCookie": "x5sec=" in (cookie_header or ""),
        },
        "_m_h5_tk": {
            "presentInCookie": "_m_h5_tk=" in (cookie_header or ""),
            "tokenExtracted": bool(token),
        },
        "_m_h5_tk_enc": {
            "presentInCookie": "_m_h5_tk_enc=" in (cookie_header or ""),
        },
    }

    return {
        "method": entry.get("method"),
        "status": entry.get("status"),
        "urlBase": urlsplit(url).scheme + "://" + urlsplit(url).netloc + urlsplit(url).path,
        "query": {
            "api": query.get("api"),
            "v": query.get("v"),
            "SV": query.get("SV"),
            "appKey": app_key,
            "t": t_value,
            "sign": expected_sign,
            "timeout": query.get("timeout"),
        },
        "body": {
            "rawDataLength": len(parsed_body.raw_data or ""),
            "outer": {
                "type": parsed_body.outer.get("type"),
                "appId": parsed_body.outer.get("appId"),
                "paramsType": type(parsed_body.outer.get("params")).__name__ if parsed_body.outer else None,
            },
            "innerSelected": pick_inner_params(parsed_body.inner),
            "parseError": parsed_body.error,
        },
        "mtopSign": {
            "formula": "md5(token + '&' + t + '&' + appKey + '&' + data)",
            "tokenAvailable": bool(token),
            "computed": computed_sign,
            "expected": expected_sign,
            "matched": sign_matches,
        },
        "securityFields": security,
        "nodeSigner": node_result,
        "response": summarize_response(entry.get("response", "")),
    }


def run_self_test() -> Dict[str, Any]:
    token = "laohe_token"
    t_value = "1779515183013"
    app_key = "12574478"
    data = json.dumps(
        {"type": "originaljson", "appId": "26551", "params": "{\"keyword\":\"demo\"}"},
        ensure_ascii=False,
        separators=(",", ":"),
    )
    expected = hashlib.md5(f"{token}&{t_value}&{app_key}&{data}".encode("utf-8")).hexdigest()
    got = mtop_sign(token, t_value, app_key, data)
    node_result = run_node_signer(
        {
            "action": "diagnose",
            "token": token,
            "query": {"t": t_value, "appKey": app_key, "sign": expected},
            "data": data,
        }
    )
    return {
        "pythonSignOk": got == expected,
        "expected": expected,
        "nodeOk": bool(node_result.get("ok")),
        "nodeMatched": ((node_result.get("mtop") or {}).get("matched") is True),
        "nodeResult": node_result,
    }


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Diagnose Ele.me waimai-guide mtop request samples.")
    parser.add_argument("--har", type=Path, help="Path to a HAR file exported from DevTools or proxy.")
    parser.add_argument("--sample-json", type=Path, help="Path to JSON exported from window.__laoheMtopLogs.")
    parser.add_argument("--requests-py", type=Path, help="Path to a requests-style Python sample. Parsed with ast, never executed.")
    parser.add_argument("--cookie", default="", help="Optional Cookie header for _m_h5_tk sign validation.")
    parser.add_argument("--token", default="", help="Optional _m_h5_tk token prefix override.")
    parser.add_argument("--provider", default="", help="Optional authorized Node provider for security slots.")
    parser.add_argument("--show-sensitive", action="store_true", help="Do not mask long dynamic values in output.")
    parser.add_argument("--self-test", action="store_true", help="Run local formula and Node bridge self-test.")
    return parser


def main(argv: Optional[List[str]] = None) -> int:
    parser = build_arg_parser()
    args = parser.parse_args(argv)

    if args.self_test:
        print(json.dumps(run_self_test(), ensure_ascii=False, indent=2))
        return 0

    if not args.har and not args.sample_json and not args.requests_py:
        parser.print_help()
        return 2

    entries = load_entries(args.har, args.sample_json, args.requests_py)
    reports = [
        diagnose_entry(
            entry,
            cookie_override=args.cookie,
            token_override=args.token,
            provider=args.provider,
            show_sensitive=args.show_sensitive,
        )
        for entry in entries
    ]
    print(json.dumps({"target": TARGET_API, "count": len(reports), "reports": reports}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

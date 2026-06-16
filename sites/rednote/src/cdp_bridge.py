# -*- coding: utf-8 -*-
"""
sites/rednote/src/cdp_bridge.py
CDP 桥: 通过 AdsPower 浏览器内部的 rednote 业务 axios 客户端执行 API 调用
→ 替代本地 signer.js + curl_cffi 的方案
→ 根治服务端升级签名体系后 (X-S-Common 等) 本地签名缺失导致的软拒绝
→ 保证"来源来自首页推荐" (因为签名和请求都由真实浏览器上下文内 axios 链路产生)

原理:
  1) 通过 webpack chunk 注入一个空 chunk, 拿到 webpack require 函数 (reqFn)
  2) 扫描所有 factory 源码, 定位同时出现 /homefeed 和 /feed 且调用 u.post 的业务模块
  3) 在该模块 exports 中按 URL 子串匹配业务函数:
       userMe          -> /api/sns/web/v2/user/me
       homefeed        -> /api/sns/web/v1/homefeed
       homefeedInitial -> /api/sns/web/v1/homefeed/initial_load
       feed            -> /api/sns/web/v1/feed
       metricsReport   -> /api/sns/web/v1/note/metrics_report
  4) 将函数挂到 window.__rednoteBridge, 后续通过 CDP Runtime.evaluate 异步调用

业务函数返回值语义 (axios 拦截器已 unwrap):
  - 成功: 直接返回 response.data.data (即业务 data 对象)
  - 失败: 抛 HTTPBizError, 我们 catch 后映射为 {ok:0, bizCode, bizMsg}

依赖: 复用 tests/cdp_cookies.py 里的 MiniWS / pick_page_ws / cdp_call (手工 WS, 绕过 origin 检查)
"""
from __future__ import annotations
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, Optional

# 复用 tests/cdp_cookies.py 里的手工 WebSocket
_TESTS_DIR = Path(__file__).resolve().parent.parent / "tests"
if str(_TESTS_DIR) not in sys.path:
    sys.path.insert(0, str(_TESTS_DIR))
from cdp_cookies import MiniWS, pick_page_ws, cdp_call  # noqa: E402


# ============================================================
# 注入到浏览器的 bootstrap JS - 首次调用时挂 window.__rednoteBridge
# 所有业务函数都走浏览器内已初始化的 axios 客户端 (自动签 X-s/X-t/X-S-Common)
# ============================================================
BRIDGE_BOOTSTRAP_JS = r"""
(() => {
  if (window.__rednoteBridge && window.__rednoteBridge.userMe) return true;
  const ck = window.webpackChunkxhs_pc_web;
  if (!ck) throw new Error('no_webpack_chunk (current tab is not rednote.com?)');
  let reqFn = null;
  try {
    ck.push([['__rn_bridge_' + Date.now()], {}, r => { reqFn = r; }]);
  } catch (e) {
    throw new Error('webpack_chunk_push_fail: ' + (e && e.message));
  }
  if (!reqFn || !reqFn.m) throw new Error('no_webpack_require_fn');
  // 定位同时含 /homefeed /feed 且调 u.post 的业务模块
  let exp = null;
  for (const id in reqFn.m) {
    try {
      const src = String(reqFn.m[id]);
      if (src.indexOf('/api/sns/web/v1/homefeed') >= 0 &&
          src.indexOf('/api/sns/web/v1/feed') >= 0 &&
          src.indexOf('.post(') >= 0) {
        const mod = reqFn(id);
        if (mod && typeof mod === 'object') { exp = mod; break; }
      }
    } catch (e) {}
  }
  if (!exp) throw new Error('rednote_api_module_not_found');
  const byUrl = (url) => {
    for (const k in exp) {
      const v = exp[k];
      if (typeof v === 'function' && String(v).indexOf('"' + url + '"') >= 0) return v;
    }
    return null;
  };
  const bridge = {
    userMe:          byUrl('/api/sns/web/v2/user/me'),
    homefeed:        byUrl('/api/sns/web/v1/homefeed'),
    homefeedInitial: byUrl('/api/sns/web/v1/homefeed/initial_load'),
    feed:            byUrl('/api/sns/web/v1/feed'),
    metricsReport:   byUrl('/api/sns/web/v1/note/metrics_report'),
  };
  const missing = Object.keys(bridge).filter(k => !bridge[k]);
  if (missing.length === Object.keys(bridge).length) {
    throw new Error('no_business_fn_matched_in_module');
  }
  window.__rednoteBridge = bridge;
  return true;
})()
"""


def _eval(ws: MiniWS, expr: str, await_promise: bool = False, msg_id: int = 1) -> Any:
    """CDP Runtime.evaluate 包装, 抛异常时把 exception.description 透传出来"""
    params = {
        "expression": expr,
        "returnByValue": True,
        "awaitPromise": await_promise,
        "userGesture": True,
    }
    r = cdp_call(ws, "Runtime.evaluate", params, msg_id=msg_id)
    if r.get("exceptionDetails"):
        ed = r["exceptionDetails"]
        text = ed.get("text") or ""
        ex = ed.get("exception") or {}
        desc = ex.get("description") or ex.get("value") or ""
        raise RuntimeError(f"js_exception: {text} | {desc}")
    return (r.get("result") or {}).get("value")


def _ensure_bridge(ws: MiniWS) -> None:
    _eval(ws, BRIDGE_BOOTSTRAP_JS, await_promise=False, msg_id=100)


def _call_fn(ws: MiniWS, fn_name: str, payload: Any) -> Dict[str, Any]:
    """调 window.__rednoteBridge[fn_name](payload), 返回 {ok, data, err, ...}"""
    payload_js = json.dumps(payload if payload is not None else {}, ensure_ascii=False)
    fn_js = json.dumps(fn_name)
    # 注意: async IIFE 返回 JSON string, Python 侧再 parse
    expr = (
        "(async () => {\n"
        "  try {\n"
        "    const br = window.__rednoteBridge;\n"
        f"    const fn = br && br[{fn_js}];\n"
        f"    if (!fn) return JSON.stringify({{ok:0, err:'fn_not_found:' + {fn_js}}});\n"
        f"    const res = await fn({payload_js});\n"
        "    return JSON.stringify({ok:1, data: (res === undefined ? null : res)});\n"
        "  } catch (e) {\n"
        "    const name = e && e.name ? String(e.name) : 'Error';\n"
        "    const msg  = e && e.message ? String(e.message) : String(e);\n"
        "    const stack = e && e.stack ? String(e.stack).slice(0, 800) : '';\n"
        "    let bizCode = null, bizMsg = null;\n"
        "    try {\n"
        "      if (e && e.response && e.response.data) {\n"
        "        bizCode = e.response.data.code;\n"
        "        bizMsg  = e.response.data.msg;\n"
        "      } else if (e && e.data) {\n"
        "        bizCode = e.data.code;\n"
        "        bizMsg  = e.data.msg;\n"
        "      } else if (e && typeof e.code !== 'undefined') {\n"
        "        bizCode = e.code;\n"
        "        bizMsg  = e.msg || e.message;\n"
        "      }\n"
        "    } catch (_) {}\n"
        "    return JSON.stringify({ok:0, err:msg, name:name, bizCode:bizCode, bizMsg:bizMsg, stack:stack});\n"
        "  }\n"
        "})()"
    )
    raw = _eval(ws, expr, await_promise=True, msg_id=200)
    if not isinstance(raw, str):
        return {"ok": 0, "err": f"non_string_result: {raw!r}"}
    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        return {"ok": 0, "err": f"bridge_parse_fail: {e} raw={raw[:200]!r}"}


# ============================================================
# axios 拦截器将响应字段从 snake_case 转为 camelCase (userId/xsecToken/...)
# 上层 main.py / user_report.py 期望 snake_case, 这里递归还原
# ============================================================
_CAMEL_PAT = re.compile(r"(?<!^)(?=[A-Z])")


def _camel_to_snake(s: str) -> str:
    # userId -> user_id, xsecToken -> xsec_token, noteCard -> note_card, displayTitle -> display_title
    # 保护: 纯小写 / 已含 _ 的不变
    if "_" in s or s.islower():
        return s
    return _CAMEL_PAT.sub("_", s).lower()


def _convert_keys(obj: Any) -> Any:
    if isinstance(obj, dict):
        return {_camel_to_snake(k): _convert_keys(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_convert_keys(x) for x in obj]
    return obj


def call_bridge(cdp_port: int, fn_name: str, payload: Any = None) -> Dict[str, Any]:
    """对外主接口: 在 ads 浏览器里执行 rednote 业务 API, 返回兼容 raw 响应格式
    {code:int, msg:str, data:dict}
    - code==0 表示成功, data 即业务返回 (key 已从 camelCase 还原为 snake_case)
    - code!=0 表示服务端业务错误 (e.g. HTTPBizError)
    fn_name: userMe / homefeed / homefeedInitial / feed / metricsReport
    """
    ws_url = pick_page_ws(cdp_port)
    ws = MiniWS(ws_url)
    try:
        _ensure_bridge(ws)
        r = _call_fn(ws, fn_name, payload)
    finally:
        ws.close()

    if r.get("ok"):
        data = r.get("data")
        if data is None:
            data = {}
        data = _convert_keys(data)
        # metrics_report 业务函数 unwrap 后可能是 {} 或 {success:true};
        # 为兼容上层 (rep.get("data") or {}).get("success") 判定, 补 success=True
        if fn_name == "metricsReport" and isinstance(data, dict) and "success" not in data:
            data = dict(data)
            data["success"] = True
        return {"code": 0, "msg": "成功", "data": data}

    # 失败分支
    biz_code = r.get("bizCode")
    biz_msg = r.get("bizMsg")
    err_msg = r.get("err") or "bridge_error"
    code: int
    if biz_code is not None:
        try:
            code = int(biz_code)
        except (TypeError, ValueError):
            code = -1
    else:
        code = -1
    msg = str(biz_msg) if biz_msg else err_msg
    return {
        "code": code,
        "msg": msg,
        "data": {},
        "_bridge_err": {k: v for k, v in r.items() if k != "data"},
    }


# ============================================================
# 模块级 cdp_port 持有 - 方便保持旧 fetch_* (cookie, session) 签名不变
# ============================================================
_cdp_port: int = 52634


def set_cdp_port(port: int) -> None:
    global _cdp_port
    _cdp_port = int(port)


def get_cdp_port() -> int:
    return _cdp_port


if __name__ == "__main__":
    # 手动冒烟: python cdp_bridge.py <port>
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 61559
    print(f"[bridge] cdp_port={port}")
    print("[bridge] userMe ...")
    j = call_bridge(port, "userMe", {})
    print(f"  code={j.get('code')} msg={j.get('msg')!r} "
          f"nickname={(j.get('data') or {}).get('nickname')!r} "
          f"user_id={(j.get('data') or {}).get('user_id')!r}")
    print("[bridge] homefeed ...")
    j = call_bridge(port, "homefeed", {
        "cursor_score": "", "num": 6, "refresh_type": 1, "note_index": 0,
        "unread_begin_note_id": "", "unread_end_note_id": "", "unread_note_count": 0,
        "category": "homefeed_recommend", "search_key": "", "need_num": 6,
        "image_formats": ["jpg", "webp", "avif"], "need_filter_image": False,
    })
    items = (j.get("data") or {}).get("items") or []
    print(f"  code={j.get('code')} msg={j.get('msg')!r} items={len(items)}")
    for it in items[:3]:
        card = it.get("note_card") or {}
        print(f"    id={it.get('id')} token={(it.get('xsec_token') or '')[:10]}... "
              f"title={(card.get('display_title') or '')[:40]!r}")

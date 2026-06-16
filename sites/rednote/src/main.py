# -*- coding: utf-8 -*-
"""
sites/rednote/src/main.py
rednote.com 笔记固定首页 + 笔记详情协议请求 (含上报环节)
- 签名: ✅ CDP 桥 (cdp_bridge) 调用 AdsPower 浏览器内部 rednote 业务轴 axios
  → 由浏览器真实上下文自动生成 X-s / X-t / X-S-Common 等全套签名
  → 来源从首页推荐 (category=homefeed_recommend, xsec_source=pc_feed)
- 流程:
    0) CDP 拿实时 Cookie (含 HttpOnly web_session/id_token) - 仅用于登录态检查打印
    1) userMe            拿 viewer.user_id
    2) homefeed          拿 items (category=homefeed_recommend)
    3) 遍历 items (id, xsec_token, author):
       a) feed           拿详情 (xsec_source=pc_feed)
       b) metrics_report 上报浏览行为 (必做)

历史方案: curl_cffi(chrome146) + 本地 signer.js → 服务端升级签名体系后软拒绝, 已废弃
"""
from __future__ import annotations
import json
import sys
import time
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tests"))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from cdp_cookies import get_rednote_cookies  # noqa: E402
import cdp_bridge  # noqa: E402
from cdp_bridge import call_bridge  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SIGNER_JS = ROOT / "src" / "signer.js"  # deprecated, kept for backward ref only
API_HOST = "https://webapi.rednote.com"
API_HOSTNAME = "webapi.rednote.com"
PAGE_URL = "https://www.rednote.com/explore"

# ads 浏览器 CDP 端口 (close+reopen 后会变, 启动时调整)
DEFAULT_CDP_PORT = 61559

# 来自 ads 浏览器 k1bhfp97 的真实 Cookie (2026-05-02 抓取)
# 生产环境建议改读环境变量或 ads MCP 动态拉取
DEFAULT_COOKIE = (
    "webBuild=6.7.0; xsecappid=xhs-pc-web; loadts=1777700271289; "
    "a1=19de73174c5o6bhdc0o3tuyvmdsimmlt9v734z18m50000237149; "
    "webId=e902a1470d9419f1d36cdf49345f08f2; "
    "abRequestId=e902a1470d9419f1d36cdf49345f08f2; "
    "gid=yjfdWqyY40jdyjfdWqyW4huyS2lKDxfS8lq9WY67vh6fMq28366194888JqWy4j8jdWySJSi; "
    "unread=%7B%22ub%22%3A%2269e717d00000000023014fed%22%2C%22ue%22%3A%2269cf82e3000000002102e455%22%2C%22uc%22%3A21%7D; "
    "websectiga=29098a4cf41f76ee3f8db19051aaa60c0fc7c5e305572fec762da32d457d76ae; "
    "sec_poison_id=d65a7c9d-d4c0-49cd-80e1-b861f1be4171; "
    "ets=1777701196451"
)

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/144.0.0.0 Safari/537.36"
)


def sign(api_path: str, body: Any, cookie: str) -> Dict[str, str]:
    """[DEPRECATED] 旧版本地 Node 签名桥 - 服务端升级后已无法通过, 保留仅供历史调试
    生产调用请改用 cdp_bridge.call_bridge()
    """
    raise RuntimeError("sign() deprecated: use cdp_bridge.call_bridge() instead")


def _common_headers(cookie: str, xs: str, xt: str) -> Dict[str, str]:
    """[DEPRECATED] 旧 curl_cffi 路线 header 构造, 已不再使用"""
    return {}


def collect_cookie_for_webapi(cdp_port: int = DEFAULT_CDP_PORT) -> str:
    """从 ads CDP 拿全量 cookies (含 HttpOnly), 过滤适用于 webapi.rednote.com 的, 按浏览器习惯排序
    排除重复名称 - 优先选更具体的 domain (webapi.rednote.com > .rednote.com > rednote.com)

    ★ 以及作为副作用将 cdp_port 设置到 cdp_bridge, 后续 fetch_* 无需再传参
    """
    cdp_bridge.set_cdp_port(cdp_port)
    cks = get_rednote_cookies(cdp_port)

    def domain_score(c):
        d = c.get("domain") or ""
        # 值越高优先越高
        if d == "webapi.rednote.com":
            return 3
        if d == ".rednote.com":
            return 2
        if d == "rednote.com":
            return 2
        if d.endswith(".rednote.com"):
            return 1
        return 0

    # domain 过滤: 需能匹配 webapi.rednote.com
    def applies(c):
        d = c.get("domain") or ""
        if d == "webapi.rednote.com":
            return True
        if d.startswith(".") and ("webapi.rednote.com" + ".").endswith(d[1:] + ".") is False:
            # 例如 d=.rednote.com, webapi.rednote.com 包含乎 rednote.com 后缀 → 匹配
            return "webapi.rednote.com".endswith(d[1:])
        if d.startswith("."):
            return "webapi.rednote.com".endswith(d[1:])
        return d == "webapi.rednote.com"

    applicable = [c for c in cks if applies(c)]
    # 按 name 去重, 保留 domain_score 高的
    by_name: Dict[str, Dict[str, Any]] = {}
    for c in applicable:
        name = c["name"]
        if name not in by_name or domain_score(c) > domain_score(by_name[name]):
            by_name[name] = c
    return "; ".join(f"{c['name']}={c['value']}" for c in by_name.values())


def post_api(api_path: str, body: Dict[str, Any], cookie: str,
             session: Optional[Any] = None) -> Dict[str, Any]:
    """[DEPRECATED] 旧 curl_cffi POST 路线. 生产请改用 cdp_bridge.call_bridge()"""
    raise RuntimeError("post_api() deprecated: use cdp_bridge.call_bridge() instead")


def get_api(api_path: str, cookie: str,
            session: Optional[Any] = None) -> Dict[str, Any]:
    """[DEPRECATED] 旧 curl_cffi GET 路线. 生产请改用 cdp_bridge.call_bridge()"""
    raise RuntimeError("get_api() deprecated: use cdp_bridge.call_bridge() instead")


def warmup(session: Any, cookie: str) -> str:
    """[DEPRECATED] 旧预热. CDP 桥下浏览器已然自带真实 session / set-cookie 流, 无需再预热"""
    return cookie


# ==================== 业务接口 (全部走 CDP 桥) ====================
def fetch_user_me(cookie: Optional[str] = None, session: Optional[Any] = None) -> Dict[str, Any]:
    """userMe → 当前登录用户资料 (供 metrics_report 上报使用)
    参数 cookie/session 忽略, 保留签名兼容旧调用方
    """
    j = call_bridge(cdp_bridge.get_cdp_port(), "userMe", {})
    if j.get("code") != 0:
        raise RuntimeError(f"user/me failed: {j}")
    return j.get("data") or {}


def fetch_homefeed(cookie: Optional[str] = None, session: Optional[Any] = None,
                   need_num: int = 8) -> List[Dict[str, Any]]:
    """homefeed → 首页推荐 items (category=homefeed_recommend)
    ★ 来源必须是 'homefeed_recommend' (首页推荐), 不要改其他值
    """
    body = {
        "cursor_score": "",
        "num": need_num,
        "refresh_type": 1,
        "note_index": 0,
        "unread_begin_note_id": "",
        "unread_end_note_id": "",
        "unread_note_count": 0,
        "category": "homefeed_recommend",
        "search_key": "",
        "need_num": need_num,
        "image_formats": ["jpg", "webp", "avif"],
        "need_filter_image": False,
    }
    j = call_bridge(cdp_bridge.get_cdp_port(), "homefeed", body)
    if j.get("code") != 0:
        raise RuntimeError(f"homefeed failed: {j}")
    items = (j.get("data") or {}).get("items") or []
    return items


def fetch_feed_detail(note_id: str, xsec_token: str, cookie: Optional[str] = None,
                      session: Optional[Any] = None) -> Dict[str, Any]:
    """feed → 笔记详情 (xsec_source=pc_feed 表示来源首页推荐)
    ★ xsec_source 固定 'pc_feed', 不要改成 pc_search / pc_user 等其他值
    """
    body = {
        "source_note_id": note_id,
        "image_formats": ["jpg", "webp", "avif"],
        "extra": {"need_body_topic": "1"},
        "xsec_source": "pc_feed",
        "xsec_token": xsec_token,
    }
    j = call_bridge(cdp_bridge.get_cdp_port(), "feed", body)
    if j.get("code") != 0:
        raise RuntimeError(f"feed failed note_id={note_id}: {j}")
    return j


# note_card.type 映射到服务端 note_type
# 浏览器实测: 'video' -> 2, 'normal' (图文) -> 1
_NOTE_TYPE_MAP = {"normal": 1, "video": 2}


def report_note_metrics(note_id: str, note_type: int, author_user_id: str,
                        viewer_user_id: str, cookie: Optional[str] = None,
                        session: Optional[Any] = None,
                        stay_seconds: int = 0, followed_author: int = 0,
                        report_type: int = 3) -> Dict[str, Any]:
    """metrics_report → 笔记详情打开后浏览器同步上报的用户行为指标
    body 结构与浏览器原生一致 (trace.request_id 逐次随机)
    ★ 调用时机: fetch_feed_detail 立即调用, 保持浏览器原生流程
    参数 cookie/session 忽略
    """
    body = {
        "note_id": note_id,
        "note_type": note_type,
        "report_type": report_type,
        "stress_test": False,
        "trace": {"request_id": str(uuid.uuid4())},
        "viewer": {"user_id": viewer_user_id, "followed_author": followed_author},
        "author": {"user_id": author_user_id},
        "interaction": {"like": 0, "collect": 0, "comment": 0, "comment_read": 0},
        "note": {"stay_seconds": stay_seconds},
        "other": {"platform": "web"},
    }
    j = call_bridge(cdp_bridge.get_cdp_port(), "metricsReport", body)
    if j.get("code") != 0:
        raise RuntimeError(f"metrics_report failed note_id={note_id}: {j}")
    return j


# ==================== main ====================
def main(cookie: Optional[str] = None, detail_count: int = 3,
         cdp_port: int = DEFAULT_CDP_PORT) -> None:
    # 无论传不传 cookie, 都设置 cdp_port 给 bridge
    cdp_bridge.set_cdp_port(cdp_port)
    if cookie is None:
        print(f"[0/4] 通过 CDP({cdp_port}) 拉取 ads 浏览器实时 cookie (含 HttpOnly) ...")
        cookie = collect_cookie_for_webapi(cdp_port)
        names = [p.split("=", 1)[0] for p in cookie.split("; ")]
        print(f"    -> {len(names)} cookies: {names}")

    session = None  # CDP 桥模式下不需要 HTTP session, 保留变量名兼容下文

    print("[1/4] 拉取登录用户 (user/me) ...")
    me = fetch_user_me(cookie, session=session)
    viewer_user_id = me.get("user_id") or ""
    print(f"    -> viewer.user_id={viewer_user_id} nickname={me.get('nickname')!r}")
    if not viewer_user_id:
        raise RuntimeError("viewer user_id 缺失, 无法执行 metrics_report 上报")

    print("[2/4] 拉取 homefeed ...")
    items = fetch_homefeed(cookie, session=session, need_num=8)
    print(f"    -> got {len(items)} items")

    rows: List[Dict[str, Any]] = []
    for it in items:
        card = it.get("note_card") or {}
        rows.append({
            "id": it.get("id") or "",
            "track_id": it.get("track_id") or "",
            "xsec_token": it.get("xsec_token") or "",
            "model_type": it.get("model_type") or "",
            "display_title": (card.get("display_title") or "")[:60],
            "author_id": (card.get("user") or {}).get("user_id") or "",
            "note_type_str": card.get("type") or "",
        })
    for i, r in enumerate(rows):
        print(f"  #{i:02d} id={r['id']} track={r['track_id'][:12]}... "
              f"xsec={r['xsec_token'][:10]}... title={r['display_title']!r}")

    # 选前 N 个 note 拉详情+上报 (过滤非 note 类型)
    note_rows = [r for r in rows if r["model_type"] == "note"
                 and r["id"] and r["xsec_token"]]
    target = note_rows[:detail_count]
    print(f"\n[3/4] 拉取 {len(target)} 篇笔记详情 + 同步上报 metrics_report ...")
    for r in target:
        try:
            # a) 拉详情
            j = fetch_feed_detail(r["id"], r["xsec_token"], cookie, session=session)
            items_d = (j.get("data") or {}).get("items") or []
            if not items_d:
                print(f"  ? id={r['id']} feed.data.items 为空")
                continue
            card = items_d[0].get("note_card") or {}
            title = card.get("title") or card.get("display_title") or "<no title>"
            user = (card.get("user") or {}).get("nickname") or "<no user>"
            itype_str = card.get("type") or r["note_type_str"] or "normal"
            note_type = _NOTE_TYPE_MAP.get(itype_str, 1)
            # author_id 以 feed 返回为准, 备选 homefeed 里的
            author_id = (card.get("user") or {}).get("user_id") or r["author_id"] or ""
            print(f"  ✓ feed   id={r['id']} type={itype_str} user={user!r} title={title[:60]!r}")

            # b) 上报环节 - 必做
            if not author_id:
                print(f"  ! skip report: author_id 缺失 id={r['id']}")
                continue
            rep = report_note_metrics(
                note_id=r["id"],
                note_type=note_type,
                author_user_id=author_id,
                viewer_user_id=viewer_user_id,
                cookie=cookie,
                session=session,
            )
            print(f"  ✓ report id={r['id']} note_type={note_type} -> code={rep.get('code')} msg={rep.get('msg')!r}")
        except Exception as e:
            print(f"  ✗ id={r['id']} FAIL: {e}")
        time.sleep(0.6)

    print("\n[4/4] done")


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--cookie", default=None, help="自定义 Cookie, 缺省自动从 ads CDP 拉取")
    ap.add_argument("--detail", type=int, default=3, help="拉取详情数量, 默认 3")
    ap.add_argument("--cdp-port", type=int, default=DEFAULT_CDP_PORT, help="ads 浏览器 CDP 端口")
    args = ap.parse_args()
    main(cookie=args.cookie, detail_count=args.detail, cdp_port=args.cdp_port)

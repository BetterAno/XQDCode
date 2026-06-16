# -*- coding: utf-8 -*-
"""
sites/rednote/src/loop_report.py
循环对单篇笔记调用 metrics_report 上报接口

用法 1 (短链):
    python loop_report.py --short http://xhslink.com/o/A9tNebViZmF --count 20 --interval 3

用法 2 (直接给 note_id + xsec_token):
    python loop_report.py --note-id 69e6dac5000000002202b6b3 \
                         --xsec-token CBIXcWy0Zy-kvcq1n6zFIe4dix_LbaR1gEW8ufnqvDuuw= \
                         --count 20 --interval 3

流程:
    0) CDP 拿实时 Cookie (含 HttpOnly)
    1) 解析短链 -> note_id + xsec_token  (若给了 --note-id 则跳过)
    2) GET /api/sns/web/v2/user/me       -> viewer.user_id
    3) POST /api/sns/web/v1/feed         -> note_type + author.user_id
    4) loop: POST /api/sns/web/v1/note/metrics_report
             (每次 trace.request_id 新 UUID, stay_seconds 递增)
"""
from __future__ import annotations
import argparse
import re
import sys
import time
import urllib.parse
from pathlib import Path
from typing import Optional, Tuple

from curl_cffi import requests as cffi_requests

# 引用 main.py 里的既有函数
sys.path.insert(0, str(Path(__file__).resolve().parent))
from main import (  # noqa: E402
    DEFAULT_CDP_PORT,
    USER_AGENT,
    collect_cookie_for_webapi,
    fetch_user_me,
    fetch_homefeed,
    fetch_feed_detail,
    report_note_metrics,
    _NOTE_TYPE_MAP,
)


def resolve_short_url(short_url: str) -> Tuple[str, str, str]:
    """解析 xhslink.com 短链, 返回 (note_id, xsec_token, xsec_source)
    短链会跳到 xiaohongshu.com/login?redirectPath=.../explore/<id>?xsec_token=...&xsec_source=...
    """
    r = cffi_requests.get(
        short_url,
        headers={"User-Agent": USER_AGENT},
        impersonate="chrome146",
        timeout=15,
        allow_redirects=True,
    )
    final_url = r.url
    # 可能是 login 页面, 需要从 query 的 redirectPath 里再拆
    parsed = urllib.parse.urlparse(final_url)
    qs = urllib.parse.parse_qs(parsed.query)
    target = final_url
    if "redirectPath" in qs:
        target = urllib.parse.unquote(qs["redirectPath"][0])

    # 从 target 中匹配 /explore/<24位hex> 或 /discovery/item/<24位hex>
    m = re.search(r"/(?:explore|discovery/item)/([0-9a-f]{24})", target)
    if not m:
        raise RuntimeError(f"无法从短链解析 note_id, final={final_url}")
    note_id = m.group(1)
    tp = urllib.parse.urlparse(target)
    tq = urllib.parse.parse_qs(tp.query)
    xsec_token = (tq.get("xsec_token") or [""])[0]
    xsec_source = (tq.get("xsec_source") or ["pc_feed"])[0]
    if not xsec_token:
        raise RuntimeError(f"短链未携带 xsec_token: {target}")
    return note_id, xsec_token, xsec_source


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--short", help="xhslink.com 短链")
    ap.add_argument("--note-id", help="笔记 id (24位 hex)")
    ap.add_argument("--xsec-token", help="笔记 xsec_token (短链里解析)")
    ap.add_argument("--count", type=int, default=10, help="循环上报次数, 默认 10")
    ap.add_argument("--interval", type=float, default=3.0, help="每次间隔秒, 默认 3")
    ap.add_argument("--cdp-port", type=int, default=DEFAULT_CDP_PORT, help="ads CDP 端口")
    ap.add_argument("--cookie", default=None, help="手工 Cookie, 缺省自动从 CDP 拉")
    ap.add_argument("--via-homefeed", action="store_true",
                    help="每次循环先调一次 homefeed 再上报（模拟从首页点进来的完整路径）")
    args = ap.parse_args()

    # === 0) cookie ===
    cookie: Optional[str] = args.cookie
    if cookie is None:
        print(f"[0/4] CDP({args.cdp_port}) 拉 cookie ...")
        cookie = collect_cookie_for_webapi(args.cdp_port)
        names = [p.split("=", 1)[0] for p in cookie.split("; ")]
        print(f"    -> {len(names)} cookies: {names}")

    session = cffi_requests.Session()

    # === 1) 解析短链 ===
    if args.short:
        print(f"[1/4] 解析短链 {args.short} ...")
        note_id, xsec_token, xsec_source = resolve_short_url(args.short)
        print(f"    -> note_id={note_id}")
        print(f"    -> xsec_token={xsec_token[:20]}...")
        print(f"    -> xsec_source={xsec_source}")
    else:
        if not (args.note_id and args.xsec_token):
            ap.error("需提供 --short 或者 --note-id + --xsec-token")
        note_id = args.note_id
        xsec_token = args.xsec_token
        xsec_source = "pc_feed"
        print(f"[1/4] 直接指定 note_id={note_id}")

    # === 2) viewer ===
    print("[2/4] 拉取登录用户 (user/me) ...")
    me = fetch_user_me(cookie, session=session)
    viewer_user_id = me.get("user_id") or ""
    if not viewer_user_id:
        raise RuntimeError("viewer.user_id 缺失, 无法上报")
    print(f"    -> viewer.user_id={viewer_user_id} nickname={me.get('nickname')!r}")

    # === 3) feed 拿 author + note_type ===
    print("[3/4] 拉 feed 拿 author + note_type ...")
    j = fetch_feed_detail(note_id, xsec_token, cookie, session=session)
    items = (j.get("data") or {}).get("items") or []
    if not items:
        raise RuntimeError(f"feed.data.items 为空: {j}")
    card = items[0].get("note_card") or {}
    itype_str = card.get("type") or "normal"
    note_type = _NOTE_TYPE_MAP.get(itype_str, 1)
    author_id = (card.get("user") or {}).get("user_id") or ""
    title = (card.get("title") or card.get("display_title") or "").strip()
    author_name = (card.get("user") or {}).get("nickname") or ""
    if not author_id:
        raise RuntimeError("feed 未返回 author.user_id")
    print(f"    -> type={itype_str}({note_type}) author={author_name!r}({author_id}) title={title[:60]!r}")

    # === 4) 循环上报 ===
    tag = " (每次先 homefeed)" if args.via_homefeed else ""
    print(f"\n[4/4] 循环上报 metrics_report x{args.count} (间隔 {args.interval}s){tag} ...")
    ok = 0
    fail = 0
    for i in range(1, args.count + 1):
        stay = i * int(args.interval)  # 模拟停留时间递增
        t0 = time.time()
        try:
            # 模拟用户先刷 homefeed 再点进笔记
            hf_n = 0
            if args.via_homefeed:
                hf_items = fetch_homefeed(cookie, session=session, need_num=8)
                hf_n = len(hf_items)
            # 拉目标笔记详情 (xsec_source=pc_feed 即 "首页过来" 的标识)
            fetch_feed_detail(note_id, xsec_token, cookie, session=session)
            rep = report_note_metrics(
                note_id=note_id,
                note_type=note_type,
                author_user_id=author_id,
                viewer_user_id=viewer_user_id,
                cookie=cookie,
                session=session,
                stay_seconds=stay,
                followed_author=0,
                report_type=3,
            )
            dt = time.time() - t0
            code = rep.get("code")
            msg = rep.get("msg")
            suc = rep.get("data", {}).get("success")
            if code == 0 and suc:
                ok += 1
                hf_tag = f" hf={hf_n}" if args.via_homefeed else ""
                print(f"  [{i:02d}/{args.count}] ✓{hf_tag} stay={stay:>3}s -> code=0 msg={msg!r} ({dt*1000:.0f}ms)")
            else:
                fail += 1
                print(f"  [{i:02d}/{args.count}] ✗ stay={stay:>3}s -> code={code} msg={msg!r}")
        except Exception as e:
            fail += 1
            print(f"  [{i:02d}/{args.count}] ✗ stay={stay:>3}s -> EXC: {e}")
        if i < args.count:
            time.sleep(args.interval)

    print(f"\n[done] 成功 {ok}/{args.count}  失败 {fail}/{args.count}")


if __name__ == "__main__":
    main()

# -*- coding: utf-8 -*-
r"""
sites/rednote/src/user_report.py
交互式「从 homefeed 过去」上报脚本 - 基于 AdsPower CDP 模式

前提:
    1) 已在 AdsPower 启动一个 profile 并在其中登录 rednote.com
    2) 记录下该 profile 的 CDP debug_port (AdsPower API 或 get-opened-browser 可拿到)

流程:
    1) 提示输入 CDP 端口 (回车使用默认 52634)
    2) 从 ads CDP 拉取 cookie (含 HttpOnly web_session / id_token)
    3) 校验 /user/me 登录态
    4) 提示输入目标笔记 URL / 短链
    5) 提示输入循环次数 & 间隔
    6) 每一轮: homefeed → feed → metrics_report (严格「从 homefeed 过去」)

用法:
    python user_report.py
"""
from __future__ import annotations
import re
import sys
import time
import urllib.parse
from pathlib import Path
from typing import Tuple

from curl_cffi import requests as cffi_requests

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from main import (  # noqa: E402
    USER_AGENT,
    DEFAULT_CDP_PORT,
    collect_cookie_for_webapi,
    fetch_user_me,
    fetch_homefeed,
    fetch_feed_detail,
    report_note_metrics,
    _NOTE_TYPE_MAP,
)


# ==================== 笔记 URL 解析 ====================
def resolve_note_url(url: str) -> Tuple[str, str]:
    """支持: xhslink.com 短链 / xiaohongshu.com 长链 / rednote.com 长链
    返回 (note_id, xsec_token)
    """
    url = url.strip()
    # 1) 如果已经是长链, 直接解析
    m = re.search(r"/(?:explore|discovery/item)/([0-9a-f]{24})", url)
    if m:
        note_id = m.group(1)
        q = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
        xt = (q.get("xsec_token") or [""])[0]
        if xt:
            return note_id, xt

    # 2) 短链 → 跟随重定向
    r = cffi_requests.get(
        url,
        headers={"User-Agent": USER_AGENT},
        impersonate="chrome146",
        timeout=15,
        allow_redirects=True,
    )
    final = r.url
    parsed = urllib.parse.urlparse(final)
    qs = urllib.parse.parse_qs(parsed.query)
    target = final
    if "redirectPath" in qs:
        target = urllib.parse.unquote(qs["redirectPath"][0])

    m = re.search(r"/(?:explore|discovery/item)/([0-9a-f]{24})", target)
    if not m:
        raise RuntimeError(f"无法从 URL 解析 note_id: final={final}")
    note_id = m.group(1)
    tp = urllib.parse.urlparse(target)
    tq = urllib.parse.parse_qs(tp.query)
    xsec_token = (tq.get("xsec_token") or [""])[0]
    if not xsec_token:
        raise RuntimeError(f"URL 未携带 xsec_token: {target}")
    return note_id, xsec_token


# ==================== 输入工具 ====================
def ask_int(prompt: str, default: int) -> int:
    s = input(f"{prompt} [默认 {default}]: ").strip()
    if not s:
        return default
    try:
        return int(s)
    except ValueError:
        print(f"  -> 无效输入, 采用默认 {default}")
        return default


def ask_float(prompt: str, default: float) -> float:
    s = input(f"{prompt} [默认 {default}]: ").strip()
    if not s:
        return default
    try:
        return float(s)
    except ValueError:
        print(f"  -> 无效输入, 采用默认 {default}")
        return default


# ==================== 主流程 ====================
def main():
    print("=" * 60)
    print(" rednote 交互式上报工具 (从 homefeed 过去, ads CDP 模式)")
    print("=" * 60)
    print(" 前提: 已在 AdsPower 启动 profile 并登录 rednote.com")
    print(" 如何拿 CDP 端口: AdsPower 客户端界面 或 MCP get-opened-browser")
    print("=" * 60)

    # Step 1: CDP 端口
    cdp_port = ask_int("请输入 ads profile 的 CDP 端口", DEFAULT_CDP_PORT)

    # Step 2: 从 ads 拉 cookie
    print(f"[cdp] 从端口 {cdp_port} 拉取 cookie ...")
    try:
        cookie = collect_cookie_for_webapi(cdp_port=cdp_port)
    except Exception as e:
        print(f"[cdp] 拉取失败: {e}")
        print("  检查: 1) AdsPower profile 是否已启动  "
              "2) 端口是否正确  3) profile 是否登录了 rednote")
        sys.exit(1)
    names = [p.split("=", 1)[0] for p in cookie.split("; ")]
    required = {"web_session", "id_token", "a1", "webId"}
    missing = required - set(names)
    if missing:
        print(f"[cdp] 警告: 缺少 cookie {missing}, 请确认 profile 已完成登录")
    print(f"[cookie] {len(names)} 项: {names}\n")

    session = cffi_requests.Session()

    # Step 3: 校验登录态
    print("[check] 校验登录态 (/user/me) ...")
    me = fetch_user_me(cookie, session=session)
    viewer_id = me.get("user_id") or ""
    if not viewer_id:
        raise RuntimeError("user/me 未返回 user_id, cookie 可能已失效")
    print(f"[check] 登录 OK: nickname={me.get('nickname')!r}  user_id={viewer_id}\n")

    # Step 4: 笔记 URL
    while True:
        url = input("请输入目标笔记 URL / 短链: ").strip()
        if not url:
            continue
        try:
            note_id, xsec_token = resolve_note_url(url)
            print(f"[note] id={note_id}  xsec_token={xsec_token[:20]}...")
            break
        except Exception as e:
            print(f"[note] 解析失败: {e}, 请重试")

    # Step 5: 拉笔记 feed 拿 author + note_type (带 homefeed 预热 + 重试)
    print("[note] 预热 homefeed ...")
    for _i in range(3):
        try:
            hf = fetch_homefeed(cookie, session=session, need_num=8)
            if hf:
                print(f"[note] homefeed 预热 OK: {len(hf)} items")
                break
        except Exception as _e:
            print(f"[note] homefeed 预热异常: {_e}")
        time.sleep(2)

    print("[note] 拉 feed 详情 ...")
    j = None
    for attempt in range(1, 4):
        j = fetch_feed_detail(note_id, xsec_token, cookie, session=session)
        items = (j.get("data") or {}).get("items") or []
        if items:
            break
        print(f"[note] feed data 空 (attempt {attempt}/3), 2s 后重试 ...")
        time.sleep(2)
    items = (j.get("data") or {}).get("items") or []
    if not items:
        raise RuntimeError(
            f"feed.data.items 持续为空 (服务端软拒绝). "
            f"建议: 1) 在浏览器里手动浏览并点击几篇笔记累积画像  "
            f"2) 或改用日常 Chrome profile (不用 --user-data-dir=D:\\chrome-rednote). "
            f"最后响应: {j}"
        )
    card = items[0].get("note_card") or {}
    itype_str = card.get("type") or "normal"
    note_type = _NOTE_TYPE_MAP.get(itype_str, 1)
    author_id = (card.get("user") or {}).get("user_id") or ""
    author_name = (card.get("user") or {}).get("nickname") or ""
    title = (card.get("title") or card.get("display_title") or "").strip()
    if not author_id:
        raise RuntimeError("feed 未返回 author.user_id")
    print(f"[note] type={itype_str}({note_type}) author={author_name!r}({author_id}) "
          f"title={title[:50]!r}\n")

    # Step 6: 次数 & 间隔
    count = ask_int("上报次数", 100)
    interval = ask_float("每次间隔(秒)", 1.0)
    print()

    # Step 7: 循环上报 (homefeed → feed → report)
    print(f"[loop] 开始: {count} 次, 间隔 {interval}s, 每次先走 homefeed")
    print("-" * 60)
    ok = fail = 0
    for i in range(1, count + 1):
        stay = i * max(int(interval), 1)
        t0 = time.time()
        try:
            hf = fetch_homefeed(cookie, session=session, need_num=8)
            fetch_feed_detail(note_id, xsec_token, cookie, session=session)
            rep = report_note_metrics(
                note_id=note_id,
                note_type=note_type,
                author_user_id=author_id,
                viewer_user_id=viewer_id,
                cookie=cookie,
                session=session,
                stay_seconds=stay,
            )
            code = rep.get("code")
            msg = rep.get("msg")
            suc = (rep.get("data") or {}).get("success")
            dt = time.time() - t0
            if code == 0 and suc:
                ok += 1
                print(f"  [{i:03d}/{count}] ✓ hf={len(hf)} stay={stay:>3}s "
                      f"-> code=0 msg={msg!r} ({dt*1000:.0f}ms)")
            else:
                fail += 1
                print(f"  [{i:03d}/{count}] ✗ code={code} msg={msg!r}")
        except Exception as e:
            fail += 1
            print(f"  [{i:03d}/{count}] ✗ EXC: {e}")
        if i < count:
            time.sleep(interval)

    print("-" * 60)
    print(f"[done] 成功 {ok}/{count}  失败 {fail}/{count}")


if __name__ == "__main__":
    try:
        main()
    except (KeyboardInterrupt, EOFError):
        print("\n[abort] 用户中断 / stdin 关闭, 退出。")
        sys.exit(1)

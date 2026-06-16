"""探测目标站点：识别瑞数6特征"""
import asyncio
import json
from cloakbrowser import launch_async

async def probe():
    browser = await launch_async(headless=True)
    page = await browser.new_page()

    print("=" * 60)
    print("=== 请求目标站点 ===")
    print("=" * 60)
    try:
        resp = await page.goto(
            "https://sugh.szu.edu.cn/Html/News/Columns/7/Index.html",
            wait_until="domcontentloaded",
            timeout=30000,
        )
        print(f"主请求状态: {resp.status}")
        print(f"主请求URL: {resp.url}")
        print(f"最终页面URL: {page.url}")
    except Exception as e:
        print(f"goto异常: {e}")

    import time
    time.sleep(5)

    # === Cookies ===
    cookies = await page.context.cookies()
    print(f"\n=== Cookies ({len(cookies)}个) ===")
    for c in cookies:
        val_preview = c["value"][:80] if c["value"] else "(empty)"
        print(f"  {c['name']} = {val_preview}... (domain={c['domain']})")

    # === 页面内容 ===
    content = await page.content()
    print(f"\n=== 页面内容 (前3000字符) ===")
    print(content[:3000])

    # 检查瑞数特征
    rs_indicators = {
        "meta_content_exists": "meta content=" in content[:2000],
        "eval_call": "eval(" in content[:2000],
        "window_dollar_ts": "$_ts" in content[:2000],
        "http_202": resp.status == 202,
    }
    print(f"\n=== 瑞数特征检测 ===")
    for k, v in rs_indicators.items():
        print(f"  {k}: {v}")

    # === window.$_ts ===
    has_ts = await page.evaluate("() => typeof window.$_ts !== 'undefined'")
    print(f"\nwindow.$_ts 存在: {has_ts}")
    if has_ts:
        ts_keys = await page.evaluate("() => Object.keys(window.$_ts)")
        print(f"$_ts keys({len(ts_keys)}个): {ts_keys[:30]}")
        # 打印几个关键属性值
        for key in ts_keys[:10]:
            try:
                val = await page.evaluate(f"() => String(window.$_ts['{key}']).substring(0, 100)")
                print(f"  $_ts.{key} = {val}")
            except:
                pass

    # === 加载的 JS 资源 ===
    reqs = await page.evaluate(
        "() => performance.getEntriesByType('resource').map(r => ({name: r.name, type: r.initiatorType}))"
    )
    print(f"\n=== 加载的 JS 资源 ({len(reqs)}个) ===")
    for r in reqs:
        if ".js" in r["name"] or "script" in r["type"]:
            print(f"  [{r['type']}] {r['name'][:150]}")

    # === Meta content ===
    try:
        meta = await page.evaluate(
            "() => { const m = document.querySelector('meta[content]'); return m ? m.content.substring(0,300) : null; }"
        )
        print(f"\nMeta content: {meta}")
    except:
        pass

    # === document.cookie ===
    try:
        doc_cookie = await page.evaluate("() => document.cookie")
        print(f"\ndocument.cookie: {doc_cookie[:500]}")
    except:
        pass

    await browser.close()
    print("\n=== 探测完成 ===")

if __name__ == "__main__":
    asyncio.run(probe())

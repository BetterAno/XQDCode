"""用原生 Playwright 测试（排除 CloakBrowser stealth patches 干扰）"""
import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        page.on("console", lambda msg: print(f"  [CONSOLE] [{msg.type}] {msg.text[:250]}"))
        page.on("pageerror", lambda err: print(f"  [PAGE_ERR] {err}"))

        print("=== Navigate ===")
        resp = await page.goto(
            "https://sugh.szu.edu.cn/Html/News/Columns/7/Index.html", timeout=30000
        )
        print(f"Status: {resp.status}, URL: {resp.url}")

        await asyncio.sleep(5)

        content = await page.content()
        print(f"\nPage content: {len(content)} chars")

        # $_ts check
        try:
            ts_check = await page.evaluate(
                "() => ({"
                "  has_ts: typeof window.$_ts !== 'undefined',"
                "  ts_keys: window.$_ts ? Object.keys(window.$_ts).length : 0,"
                "  ts_nsd: window.$_ts ? window.$_ts.nsd : null,"
                "  ts_cd_len: window.$_ts && window.$_ts.cd ? window.$_ts.cd.length : 0"
                "})"
            )
            print(f"$_ts: {ts_check}")
        except Exception as e:
            print(f"$_ts err: {e}")

        # cookies
        cookies = await context.cookies()
        print(f"\nCookies: {len(cookies)}")
        for c in cookies:
            print(f"  {c['name']}: len={len(c['value'])}, httpOnly={c.get('httpOnly')}")

        # document.cookie
        try:
            dc = await page.evaluate("() => document.cookie")
            print(f"\ndocument.cookie: {dc[:300] if dc else '(empty)'}")
        except Exception as e:
            print(f"dc err: {e}")

        await page.screenshot(path="sites/sugh/captures/standard_playwright.png")
        await browser.close()

asyncio.run(test())
"""完整网络探测：捕获所有请求详情"""
import asyncio
import json
from cloakbrowser import launch_async

async def probe_network():
    browser = await launch_async(headless=True)
    page = await browser.new_page()

    # 收集所有网络请求
    all_requests = []

    async def on_request(request):
        all_requests.append({
            "type": "request",
            "url": request.url,
            "method": request.method,
            "headers": dict(request.headers),
        })

    async def on_response(response):
        try:
            body = await response.text()
            body_preview = body[:500]
        except:
            body_preview = "(binary/cannot read)"
        all_requests.append({
            "type": "response",
            "url": response.url,
            "status": response.status,
            "headers": dict(response.headers),
            "body_preview": body_preview,
        })

    page.on("request", on_request)
    page.on("response", on_response)

    print("=== 访问目标站点 (networkidle) ===")
    try:
        resp = await page.goto(
            "https://sugh.szu.edu.cn/Html/News/Columns/7/Index.html",
            wait_until="networkidle",
            timeout=60000,
        )
        print(f"goto status: {resp.status}")
    except Exception as e:
        print(f"goto异常: {e}")

    import time
    time.sleep(3)

    print(f"\n=== 全部网络请求 ({len(all_requests)}个) ===")
    for i, req in enumerate(all_requests):
        if req["type"] == "response":
            print(f"\n--- [{i}] RESP {req['status']} ---")
            print(f"  URL: {req['url'][:150]}")
            # 打印关键响应头
            for h in ["set-cookie", "content-type", "location", "server"]:
                if h in req["headers"]:
                    print(f"  {h}: {req['headers'][h][:200]}")
            if req.get("body_preview"):
                print(f"  body: {req['body_preview'][:300]}")
        else:
            # 只打印非 resource 请求
            if any(x in req["url"] for x in [".js", "Index", "Columns"]):
                print(f"\n--- [{i}] REQ {req['method']} ---")
                print(f"  URL: {req['url'][:150]}")
                # 打印 cookie header
                if "cookie" in req["headers"]:
                    print(f"  cookie: {req['headers']['cookie'][:200]}")

    # 最终cookie
    cookies = await page.context.cookies()
    print(f"\n=== 最终 Cookies ({len(cookies)}个) ===")
    for c in cookies:
        print(f"  {c['name']} = {c['value'][:120]}")

    # 页面截图保存
    await page.screenshot(path="sites/cloak_config/target_probe.png")
    print("\n截图已保存: sites/cloak_config/target_probe.png")
    
    await browser.close()

if __name__ == "__main__":
    asyncio.run(probe_network())

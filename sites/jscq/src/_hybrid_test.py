"""
混合方案: Playwright 获取 Ruishu Cookie → requests 抓取数据
"""
import time
import json
import requests
from playwright.sync_api import sync_playwright

TARGET = "https://www.jscq.com.cn/jscq/cqjy/jygg/cqzr/index.shtml"

def get_cookies_via_playwright():
    """用 Playwright 获取 Ruishu Cookie"""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        )
        page = context.new_page()

        print("[1] 导航到目标页面...")
        page.goto(TARGET, wait_until="networkidle", timeout=30000)

        title = page.title()
        print(f"    标题: {title}")

        # 等待页面完全加载
        page.wait_for_timeout(3000)

        # 获取所有 cookies (包括 HttpOnly)
        cookies = context.cookies()
        print(f"\n[2] 获取到 {len(cookies)} 个 cookies:")
        cookie_dict = {}
        for c in cookies:
            print(f"    {c['name']} = {c['value'][:50]}... (httpOnly={c.get('httpOnly', False)})")
            if 'jscq' in c.get('domain', ''):
                cookie_dict[c['name']] = c['value']

        # 获取页面内容
        body_text = page.inner_text("body")
        print(f"\n[3] 页面内容长度: {len(body_text)}")
        print(f"    预览: {body_text[:200]}")

        # 提取数据列表项
        items = page.query_selector_all(".ejy-item, .list-item, li a")
        print(f"    列表项数量: {len(items)}")

        browser.close()
        return cookie_dict, body_text


def test_with_requests(cookie_dict):
    """用提取的 cookies 通过 requests 请求"""
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": TARGET,
        "Connection": "keep-alive",
    })

    # 设置 cookies
    for name, value in cookie_dict.items():
        session.cookies.set(name, value, domain="www.jscq.com.cn")

    print(f"\n[4] requests 测试...")
    print(f"    Cookies: {list(cookie_dict.keys())}")

    resp = session.get(TARGET, timeout=15)
    print(f"    状态码: {resp.status_code}")
    print(f"    响应长度: {len(resp.text)}")

    if resp.status_code == 200:
        if "江苏产权" in resp.text or "产权转让" in resp.text:
            print(f"    [OK] requests 成功获取真实页面!")
        elif "$_ts" in resp.text:
            print(f"    [WARN] 仍然是瑞数拦截页")
        else:
            print(f"    未知响应: {resp.text[:200]}")
    else:
        print(f"    [ERROR] 状态码 {resp.status_code}")

    return resp


if __name__ == "__main__":
    cookie_dict, page_text = get_cookies_via_playwright()

    if cookie_dict:
        resp = test_with_requests(cookie_dict)

        # 保存结果
        with open("sites/jscq/output_playwright.html", "w", encoding="utf-8") as f:
            f.write(resp.text)
        print(f"\n[5] 结果已保存到 sites/jscq/output_playwright.html")
    else:
        print("[ERROR] 未获取到 cookies")

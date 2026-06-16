"""
混合方案 v2: Playwright headed 模式 + requests 测试
"""
import time
import json
import sys
import requests as req_lib
from playwright.sync_api import sync_playwright

TARGET = "https://www.jscq.com.cn/jscq/cqjy/jygg/cqzr/index.shtml"

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        )
        page = context.new_page()

        print("[1] 导航到目标页面 (headed mode)...")
        page.goto(TARGET, wait_until="networkidle", timeout=30000)

        title = page.title()
        print(f"    标题: {title}")
        page.wait_for_timeout(2000)

        body_text = page.inner_text("body")
        print(f"    页面内容长度: {len(body_text)}")

        # 获取所有 cookies
        cookies = context.cookies()
        jscq_cookies = {}
        for c in cookies:
            if 'jscq' in c.get('domain', ''):
                jscq_cookies[c['name']] = c['value']
                val_preview = c['value'][:60]
                print(f"    Cookie: {c['name']} = {val_preview}... (httpOnly={c.get('httpOnly')})")

        p_cookie = jscq_cookies.get('jDwkDWjIm6GRP', '')
        o_cookie = jscq_cookies.get('jDwkDWjIm6GRO', '')
        print(f"\n    P Cookie 长度: {len(p_cookie)}, dots: {p_cookie.count('.')}")
        print(f"    O Cookie 长度: {len(o_cookie)}")

        # 提取页面数据
        if body_text:
            print(f"\n[2] 页面已加载，提取数据...")
            # 找列表项
            items = page.query_selector_all("a.ejy-item-title, .list-item a, .ejy-con a")
            print(f"    找到 {len(items)} 个列表项")
            for i, item in enumerate(items[:5]):
                text = item.inner_text()
                href = item.get_attribute("href") or ""
                print(f"    [{i}] {text[:60]} -> {href[:80]}")

        # 测试: 用 page.evaluate 内的 fetch 请求
        print(f"\n[3] 测试浏览器内 fetch...")
        fetch_result = page.evaluate("""async () => {
            try {
                const resp = await fetch('/eportalplugin/toword/getCompany');
                const text = await resp.text();
                return { status: resp.status, length: text.length, preview: text.substring(0, 200) };
            } catch(e) {
                return { error: e.message };
            }
        }""")
        print(f"    fetch 结果: {json.dumps(fetch_result, ensure_ascii=False)[:200]}")

        # 测试: 用 Python requests
        if jscq_cookies:
            print(f"\n[4] 测试 Python requests...")
            session = req_lib.Session()
            session.headers.update({
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                              "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Referer": TARGET,
            })
            for name, value in jscq_cookies.items():
                session.cookies.set(name, value, domain="www.jscq.com.cn")

            resp = session.get(TARGET, timeout=15)
            print(f"    requests 状态码: {resp.status_code}, 长度: {len(resp.text)}")

        browser.close()

    print("\n[完成]")

if __name__ == "__main__":
    main()

"""
混合方案 v4: 使用系统 Chrome 而非 Playwright Chromium
"""
import time
import json
import sys
import os
import requests as req_lib
from playwright.sync_api import sync_playwright

TARGET = "https://www.jscq.com.cn/jscq/cqjy/jygg/cqzr/index.shtml"

def main():
    with sync_playwright() as p:
        # 使用 channel="chrome" 调用系统安装的 Chrome
        browser = p.chromium.launch(headless=False, channel="chrome")
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        )
        page = context.new_page()

        print("[1] 使用系统 Chrome 导航...")
        page.goto(TARGET, wait_until="domcontentloaded", timeout=30000)

        print("[2] 等待 Ruishu 挑战完成...")
        for i in range(30):
            time.sleep(1)
            title = page.title()
            body_len = page.evaluate("document.body ? document.body.innerText.length : 0")
            if i % 5 == 0 or body_len > 0 or "产权" in title:
                print(f"    [{i+1}s] title='{title[:30]}' body_len={body_len}")
            if "江苏产权" in title or "产权转让" in title or body_len > 100:
                print(f"    [OK] 真实页面已加载!")
                break

        cookies = context.cookies()
        jscq_cookies = {}
        for c in cookies:
            if 'jscq' in c.get('domain', ''):
                jscq_cookies[c['name']] = c['value']

        p_cookie = jscq_cookies.get('jDwkDWjIm6GRP', '')
        print(f"\n    P Cookie: len={len(p_cookie)}, dots={p_cookie.count('.')}")

        page.wait_for_timeout(2000)
        body_text = page.inner_text("body")
        print(f"    页面内容长度: {len(body_text)}")

        if body_text:
            print(f"    预览: {body_text[:200]}")

            # 提取列表项
            rows = page.query_selector_all("tr.data-row, .ejy-item, .list-item")
            print(f"    列表行: {len(rows)}")

        # 保存
        html = page.content()
        output = os.path.join(os.path.dirname(__file__), "..", "output_chrome.html")
        with open(output, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"\n    页面已保存: {output}")

        # 测试 requests
        if jscq_cookies:
            print(f"\n[3] 测试 requests...")
            session = req_lib.Session()
            session.headers.update({
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                              "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
                "Accept": "text/html,*/*;q=0.8",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Referer": TARGET,
            })
            for name, value in jscq_cookies.items():
                session.cookies.set(name, value, domain="www.jscq.com.cn")
            resp = session.get(TARGET, timeout=15)
            print(f"    状态码: {resp.status_code}, 长度: {len(resp.text)}")
            if resp.status_code == 200 and "产权" in resp.text:
                print(f"    [OK] requests 成功!")
            elif resp.status_code == 200:
                print(f"    响应预览: {resp.text[:200]}")

        browser.close()

    print("\n[完成]")

if __name__ == "__main__":
    main()

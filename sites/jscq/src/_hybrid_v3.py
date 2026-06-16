"""
混合方案 v3: Playwright headed + 等待真实页面加载
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
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        )
        page = context.new_page()

        print("[1] 导航到目标页面...")
        # 不等待 networkidle，用 domcontentloaded + 手动等待
        page.goto(TARGET, wait_until="domcontentloaded", timeout=30000)

        # 轮询等待真实页面加载（标题变化表示 Ruishu 通过）
        print("[2] 等待 Ruishu 挑战完成...")
        for i in range(30):
            time.sleep(1)
            title = page.title()
            url = page.url
            body_len = page.evaluate("document.body ? document.body.innerText.length : 0")
            print(f"    [{i+1}s] title='{title[:30]}' body_len={body_len} url={url[:60]}")
            if "江苏产权" in title or "产权转让" in title:
                print(f"    [OK] 真实页面已加载!")
                break
            if body_len > 100:
                print(f"    [OK] 页面有内容!")
                break

        # 获取所有 cookies
        cookies = context.cookies()
        jscq_cookies = {}
        for c in cookies:
            if 'jscq' in c.get('domain', ''):
                jscq_cookies[c['name']] = c['value']
                print(f"    Cookie: {c['name']} = {c['value'][:40]}... (httpOnly={c.get('httpOnly')})")

        p_cookie = jscq_cookies.get('jDwkDWjIm6GRP', '')
        print(f"\n    P Cookie: len={len(p_cookie)}, dots={p_cookie.count('.')}")

        # 等页面完全加载
        page.wait_for_timeout(3000)

        body_text = page.inner_text("body")
        print(f"\n[3] 最终页面内容长度: {len(body_text)}")
        if body_text:
            print(f"    预览: {body_text[:300]}")

            # 提取列表数据
            items = page.query_selector_all("a")
            project_links = []
            for a in items:
                href = a.get_attribute("href") or ""
                text = a.inner_text().strip()
                if href and text and len(text) > 5:
                    project_links.append({"text": text[:80], "href": href})
            print(f"\n[4] 找到 {len(project_links)} 个链接")
            for link in project_links[:10]:
                print(f"    {link['text']} -> {link['href'][:80]}")

        # 保存页面
        html = page.content()
        output = os.path.join(os.path.dirname(__file__), "..", "output_playwright.html")
        with open(output, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"\n[5] 页面已保存: {output}")

        # 测试 requests
        if jscq_cookies:
            print(f"\n[6] 测试 Python requests...")
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
            print(f"    状态码: {resp.status_code}, 长度: {len(resp.text)}")

        browser.close()

    print("\n[完成]")

if __name__ == "__main__":
    main()

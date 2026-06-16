"""
混合方案 v5: AdsPower 反检测浏览器 + Python CDP 连接
使用 AdsPower 的真实浏览器指纹来绕过瑞数
"""
import json
import os
import sys
import time
import subprocess
import requests as req_lib

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TARGET = "https://www.jscq.com.cn/jscq/cqjy/jygg/cqzr/index.shtml"
ADSPOWER_API = "http://local.adspower.net:50325"

def open_adspower_browser(profile_id="k1bhfp97"):
    """通过 AdsPower API 打开浏览器，返回 CDP ws URL"""
    resp = req_lib.get(f"{ADSPOWER_API}/api/v1/browser/start", params={"user_id": profile_id})
    data = resp.json()
    if data["code"] != 0:
        print(f"[ERROR] AdsPower start failed: {data}")
        sys.exit(1)
    ws = data["data"]["ws"]["puppeteer"]
    debug_port = data["data"]["debug_port"]
    print(f"[OK] AdsPower browser opened, ws={ws[:60]}... port={debug_port}")
    return ws, debug_port

def close_adspower_browser(profile_id="k1bhfp97"):
    """关闭 AdsPower 浏览器"""
    req_lib.get(f"{ADSPOWER_API}/api/v1/browser/stop", params={"user_id": profile_id})
    print("[OK] Browser closed")

def clear_cookies(profile_id="k1bhfp97"):
    """清理 cookies"""
    req_lib.get(f"{ADSPOWER_API}/api/v1/browser/cookie/delete", params={
        "user_id": profile_id,
        "domain": "www.jscq.com.cn"
    })

def main():
    from playwright.sync_api import sync_playwright

    # 打开 AdsPower 浏览器
    ws_url, debug_port = open_adspower_browser()

    try:
        with sync_playwright() as p:
            # 连接到 AdsPower 浏览器
            browser = p.chromium.connect_over_cdp(ws_url)
            print(f"[OK] Connected to AdsPower browser")

            # 使用第一个 context
            contexts = browser.contexts
            if not contexts:
                context = browser.new_context()
            else:
                context = contexts[0]

            # 创建新页面
            page = context.new_page()
            print(f"[1] 导航到目标页面...")

            page.goto(TARGET, wait_until="domcontentloaded", timeout=30000)

            print(f"[2] 等待 Ruishu 挑战完成...")
            for i in range(30):
                time.sleep(1)
                try:
                    title = page.title()
                    body_len = page.evaluate("document.body ? document.body.innerText.length : 0")
                    if i % 5 == 0 or body_len > 0 or "产权" in title:
                        print(f"    [{i+1}s] title='{title[:30]}' body_len={body_len}")
                    if ("江苏产权" in title or "产权转让" in title or body_len > 100):
                        print(f"    [OK] 真实页面已加载!")
                        break
                except Exception as e:
                    print(f"    [{i+1}s] Error: {e}")
                    break

            # 获取 cookies
            cookies = context.cookies()
            jscq_cookies = {}
            for c in cookies:
                if 'jscq' in c.get('domain', ''):
                    jscq_cookies[c['name']] = c['value']

            p_cookie = jscq_cookies.get('jDwkDWjIm6GRP', '')
            o_cookie = jscq_cookies.get('jDwkDWjIm6GRO', '')
            print(f"\n    P Cookie: len={len(p_cookie)}, dots={p_cookie.count('.')}")
            print(f"    O Cookie: len={len(o_cookie)}")

            page.wait_for_timeout(2000)

            body_text = ""
            try:
                body_text = page.inner_text("body")
            except:
                pass

            print(f"    页面内容长度: {len(body_text)}")
            if body_text:
                print(f"    预览: {body_text[:300]}")

            # 保存页面
            try:
                html = page.content()
                output = os.path.join(SCRIPT_DIR, "..", "output_adspower.html")
                with open(output, "w", encoding="utf-8") as f:
                    f.write(html)
                print(f"\n    页面已保存: {output}")
            except Exception as e:
                print(f"    保存失败: {e}")

            # 测试 requests
            if jscq_cookies and body_text:
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

            page.close()

    finally:
        close_adspower_browser()

    print("\n[完成]")

if __name__ == "__main__":
    main()

"""
江苏产权市场网 - 纯 CDP 协议方案
通过 AdsPower 浏览器的 CDP 接口直接控制，无 Playwright 标记

用法:
    先打开 AdsPower 浏览器，获取 ws URL
    然后运行: python scraper_cdp.py
"""
import json
import os
import sys
import time
import requests
import websocket

ADSPOWER_API = "http://local.adspower.net:50325"
PROFILE_ID = "k1bhfp97"
TARGET = "https://www.jscq.com.cn/jscq/cqjy/jygg/cqzr/index.shtml"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


class CDPSession:
    def __init__(self, ws_url):
        self.ws = websocket.create_connection(ws_url, timeout=30,
                    suppress_origin=True)
        self.msg_id = 0

    def send(self, method, params=None):
        self.msg_id += 1
        msg = {"id": self.msg_id, "method": method, "params": params or {}}
        self.ws.send(json.dumps(msg))
        while True:
            resp = json.loads(self.ws.recv())
            if resp.get("id") == self.msg_id:
                return resp
            # Skip events

    def close(self):
        self.ws.close()


def ensure_browser():
    """确保 AdsPower 浏览器已打开"""
    resp = requests.get(f"{ADSPOWER_API}/api/v1/browser/active", params={"user_id": PROFILE_ID})
    data = resp.json()
    if data.get("data", {}).get("status") == "Active":
        ws = data["data"]["ws"]["puppeteer"]
        print(f"[OK] 浏览器已打开")
        return ws

    resp = requests.get(f"{ADSPOWER_API}/api/v1/browser/start", params={"user_id": PROFILE_ID})
    data = resp.json()
    if data["code"] != 0:
        print(f"[ERROR] 打开浏览器失败: {data}")
        sys.exit(1)
    ws = data["data"]["ws"]["puppeteer"]
    print(f"[OK] 浏览器已启动")
    time.sleep(2)
    return ws


def get_ws_url_for_page(browser_ws):
    """从 browser ws 获取 page 的 ws URL"""
    cdp = CDPSession(browser_ws)
    resp = cdp.send("Target.getTargets")
    pages = [t for t in resp.get("result", {}).get("targetInfos", []) if t["type"] == "page"]
    if not pages:
        # 创建新页面
        resp = cdp.send("Target.createTarget", {"url": "about:blank"})
        target_id = resp["result"]["targetId"]
        ws_url = f"ws://127.0.0.1:{browser_ws.split(':')[2].split('/')[0]}/devtools/page/{target_id}"
    else:
        target_id = pages[0]["targetId"]
        ws_url = f"ws://127.0.0.1:{browser_ws.split(':')[2].split('/')[0]}/devtools/page/{target_id}"
    cdp.close()
    return ws_url


def navigate_and_wait(page_cdp, url, timeout=30):
    """导航并等待页面加载完成"""
    # 启用 Page 事件
    page_cdp.send("Page.enable")
    page_cdp.send("Network.enable")

    # 导航
    page_cdp.send("Page.navigate", {"url": url})
    print(f"[1] 导航中: {url}")

    # 等待页面加载
    start = time.time()
    navigated = False
    while time.time() - start < timeout:
        try:
            resp = json.loads(page_cdp.ws.recv())
            method = resp.get("method", "")
            if method == "Page.frameNavigated" and not navigated:
                navigated = True
            if method == "Page.loadEventFired":
                break
        except websocket.WebSocketTimeoutException:
            break
        except Exception:
            break

    # 额外等待瑞数执行
    print("[2] 等待瑞数挑战...")
    for i in range(timeout):
        time.sleep(1)
        try:
            result = page_cdp.send("Runtime.evaluate", {
                "expression": "document.title + '|||' + (document.body ? document.body.innerText.length : 0)"
            })
            value = result.get("result", {}).get("result", {}).get("value", "|||0")
            parts = value.split("|||")
            title = parts[0] if len(parts) > 0 else ""
            body_len = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else 0

            if i % 5 == 0 or body_len > 0:
                print(f"    [{i+1}s] title='{title[:30]}' body_len={body_len}")

            if "江苏产权" in title or "产权转让" in title or body_len > 100:
                print(f"    [OK] 页面已加载!")
                return True
        except Exception as e:
            print(f"    [{i+1}s] Error: {e}")
            break

    return False


def extract_data(page_cdp):
    """从页面提取数据"""
    result = page_cdp.send("Runtime.evaluate", {
        "expression": """(function() {
            var items = document.querySelectorAll('li.pxitem');
            var results = [];
            for (var i = 0; i < items.length; i++) {
                var li = items[i];
                var links = li.querySelectorAll('a[href*="article_"]');
                if (links.length === 0) continue;
                var mainLink = null, typeLink = null;
                for (var j = 0; j < links.length; j++) {
                    var t = links[j].innerText.trim();
                    if (t === '正式公告' || t === '预告') typeLink = links[j];
                    else if (t.length > 5 && !mainLink) mainLink = links[j];
                }
                if (!mainLink) mainLink = links[0];
                var title = mainLink.innerText.trim();
                var url = mainLink.getAttribute('href');
                if (!title) continue;
                var allText = li.innerText;
                var statusMatch = allText.match(/^(已截止|已成交|报名中|项目终止|项目中止)/m);
                var priceMatch = allText.match(/挂牌价格[：:]\\s*(.+)/);
                var orgMatch = allText.match(/组织机构[：:]\\s*(.+)/);
                var deadlineMatch = allText.match(/截止日期[：:]\\s*([\\d-]+)/);
                var viewsMatch = allText.match(/浏览[：:]\\s*(\\d+)/);
                results.push({
                    title: title.substring(0, 200),
                    url: url,
                    status: statusMatch ? statusMatch[1] : '',
                    type: typeLink ? typeLink.innerText.trim() : '',
                    price: priceMatch ? priceMatch[1].trim() : '',
                    org: orgMatch ? orgMatch[1].trim() : '',
                    deadline: deadlineMatch ? deadlineMatch[1] : '',
                    views: viewsMatch ? viewsMatch[1] : ''
                });
            }
            return JSON.stringify(results);
        })()"""
    })
    value = result.get("result", {}).get("result", {}).get("value", "[]")
    return json.loads(value)


def main():
    # 1. 获取浏览器
    browser_ws = ensure_browser()
    time.sleep(1)

    # 2. 获取页面 CDP 连接
    page_ws_url = get_ws_url_for_page(browser_ws)
    page_cdp = CDPSession(page_ws_url)
    print(f"[OK] CDP 已连接到页面")

    try:
        # 3. 导航并等待
        ok = navigate_and_wait(page_cdp, TARGET)
        if not ok:
            print("[WARN] 页面可能未完全加载，尝试继续...")

        # 4. 提取数据
        print(f"\n[3] 提取数据...")
        items = extract_data(page_cdp)
        print(f"    获取到 {len(items)} 条记录")

        if items:
            print(f"\n{'='*60}")
            for i, item in enumerate(items):
                print(f"\n[{i+1}] {item['title'][:80]}")
                print(f"    状态: {item['status']}  类型: {item['type']}")
                print(f"    价格: {item['price']}  机构: {item['org']}")
                print(f"    截止: {item['deadline']}  浏览: {item['views']}")

            # 保存
            output = os.path.join(SCRIPT_DIR, "..", "output.json")
            with open(output, "w", encoding="utf-8") as f:
                json.dump(items, f, ensure_ascii=False, indent=2)
            print(f"\n[4] 数据已保存: {output}")
        else:
            print("[WARN] 未提取到数据")
            # 保存页面 HTML 用于调试
            result = page_cdp.send("Runtime.evaluate", {
                "expression": "document.documentElement.outerHTML"
            })
            html = result.get("result", {}).get("result", {}).get("value", "")
            debug_file = os.path.join(SCRIPT_DIR, "..", "debug_page.html")
            with open(debug_file, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"    页面 HTML 已保存: {debug_file} ({len(html)} bytes)")

    finally:
        page_cdp.close()
        # 关闭浏览器
        requests.get(f"{ADSPOWER_API}/api/v1/browser/stop", params={"user_id": PROFILE_ID})
        print("\n[完成] 浏览器已关闭")


if __name__ == "__main__":
    main()

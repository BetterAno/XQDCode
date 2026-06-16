"""任务1: 完整捕获请求流 - HAR + 关键文件保存
使用 CloakBrowser headed 模式捕获瑞数6 cookie 生成全流程
"""
import asyncio
import json
import os
import time
from pathlib import Path
from cloakbrowser import launch_async

BASE_DIR = Path(__file__).resolve().parent.parent
CAPTURES = BASE_DIR / "captures"

async def main():
    CAPTURES.mkdir(parents=True, exist_ok=True)

    # === 启动 stealth 浏览器 (有头模式观察执行) ===
    browser = await launch_async(headless=False)
    context = await browser.new_context()
    page = await context.new_page()

    # 收集所有请求/响应
    har_entries = []
    html_412 = None
    js_content = None
    js_url = None
    final_html = None
    final_status = None

    # ---- Hook cookie 赋值 ----
    await page.evaluate("""() => {
        // Hook document.cookie setter
        const origDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
                         Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
        const origSetter = origDesc.set;
        window.__cookie_logs = [];
        Object.defineProperty(document, 'cookie', {
            get() { return origDesc.get.call(this); },
            set(val) {
                window.__cookie_logs.push({time: Date.now(), value: val.substring(0, 300)});
                console.log('[COOKIE SET]', val.substring(0, 200));
                origSetter.call(this, val);
            },
            configurable: true
        });
    }""")

    # ---- Hook eval 调用 ----
    await page.evaluate("""() => {
        const origEval = window.eval;
        window.__eval_logs = [];
        window.eval = function(code) {
            const preview = typeof code === 'string' ? code.substring(0, 200) : String(code).substring(0, 200);
            window.__eval_logs.push({time: Date.now(), preview});
            console.log('[EVAL CALL]', preview);
            return origEval(code);
        };
    }""")

    async def on_response(response):
        nonlocal html_412, js_content, js_url, final_html, final_status
        url = response.url
        status = response.status
        headers = dict(response.headers)

        entry = {
            "url": url,
            "status": status,
            "headers": {k: v[:300] if isinstance(v, str) else str(v)[:300] for k, v in headers.items()},
        }
        try:
            body = await response.text()
            entry["body_preview"] = body[:500]
            entry["body_size"] = len(body)
        except:
            entry["body_preview"] = "(binary)"

        har_entries.append(entry)

        # 保存关键文件
        if "Index.html" in url or "Columns/7" in url:
            if status == 412:
                try:
                    html_412 = await response.text()
                    (CAPTURES / "html_412_response.txt").write_text(html_412, encoding="utf-8")
                    print(f"[SAVED] HTML 412: {len(html_412)} chars")
                except Exception as e:
                    print(f"[ERROR] save html_412: {e}")
            elif status == 200:
                try:
                    final_html = await response.text()
                    final_status = status
                    (CAPTURES / "html_200_response.txt").write_text(final_html, encoding="utf-8")
                    print(f"[SAVED] HTML 200: {len(final_html)} chars")
                except Exception as e:
                    print(f"[ERROR] save html_200: {e}")

        if ".js" in url and "ymwuCYY2EAZT" in url:
            try:
                js_content = await response.text()
                js_url = url
                (CAPTURES / "main_js.js").write_text(js_content, encoding="utf-8")
                print(f"[SAVED] JS: {len(js_content)} chars, URL: {js_url}")
                # 保存 JS URL 模板
                js_path = url.split("/")[-1]
                (CAPTURES / "js_filename.txt").write_text(js_path, encoding="utf-8")
            except Exception as e:
                print(f"[ERROR] save JS: {e}")

    page.on("response", on_response)

    # === 访问目标 ===
    print("\n=== 访问目标页面 ===")
    target_url = "https://sugh.szu.edu.cn/Html/News/Columns/7/Index.html"
    try:
        resp = await page.goto(target_url, wait_until="networkidle", timeout=60000)
        print(f"goto status: {resp.status}")
    except Exception as e:
        print(f"goto error: {e}")

    # 等待 JS 执行完成
    time.sleep(8)

    # === 收集数据 ===

    # 1. 页面截图
    await page.screenshot(path=str(CAPTURES / "final_page.png"))
    print("[SAVED] screenshot: final_page.png")

    # 2. 最终 cookies
    cookies = await context.cookies()
    cookies_data = []
    for c in cookies:
        cookies_data.append({
            "name": c["name"],
            "value": c["value"],
            "domain": c["domain"],
            "path": c["path"],
            "httpOnly": c.get("httpOnly", False),
            "secure": c.get("secure", False),
        })
    (CAPTURES / "cookies.json").write_text(json.dumps(cookies_data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n=== 最终 Cookies ({len(cookies)}个) ===")
    for c in cookies:
        print(f"  {c['name']} = {c['value'][:100]}...")

    # 3. window.$_ts 信息
    try:
        has_ts = await page.evaluate("() => typeof window.$_ts !== 'undefined'")
        if has_ts:
            ts_info = await page.evaluate("""() => {
                const keys = Object.keys(window.$_ts);
                const summary = {};
                for (const k of keys) {
                    const v = window.$_ts[k];
                    if (typeof v === 'string') summary[k] = v.substring(0, 100);
                    else if (typeof v === 'number' || typeof v === 'boolean') summary[k] = v;
                    else summary[k] = typeof v;
                }
                return {key_count: keys.length, keys: keys.slice(0, 50), summary};
            }""")
            (CAPTURES / "window_ts.json").write_text(json.dumps(ts_info, indent=2, ensure_ascii=False), encoding="utf-8")
            print(f"\n$_ts keys: {ts_info['key_count']}个")
            for k in ts_info["keys"][:15]:
                print(f"  $_ts.{k} = {ts_info['summary'].get(k, '?')}")
    except Exception as e:
        print(f"$_ts error: {e}")

    # 4. meta content
    try:
        meta_content = await page.evaluate("""() => {
            const m = document.getElementById('HugPYbOHyOWN');
            return m ? m.content : null;
        }""")
        if meta_content:
            (CAPTURES / "meta_content.txt").write_text(meta_content, encoding="utf-8")
            print(f"\nMeta content: {len(meta_content)} chars")
    except Exception as e:
        print(f"Meta error: {e}")

    # 5. cookie hook 日志
    try:
        cookie_logs = await page.evaluate("() => window.__cookie_logs || []")
        (CAPTURES / "cookie_hook_logs.json").write_text(json.dumps(cookie_logs, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"\nCookie hook logs: {len(cookie_logs)} entries")
    except Exception as e:
        print(f"Cookie hook error: {e}")

    # 6. eval hook 日志
    try:
        eval_logs = await page.evaluate("() => window.__eval_logs || []")
        (CAPTURES / "eval_hook_logs.json").write_text(json.dumps(eval_logs, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"Eval hook logs: {len(eval_logs)} entries")
    except Exception as e:
        print(f"Eval hook error: {e}")

    # 7. page content
    try:
        content = await page.content()
        (CAPTURES / "page_content.html").write_text(content, encoding="utf-8")
        print(f"Page content: {len(content)} chars")
    except Exception as e:
        print(f"Content error: {e}")

    # === 保存 HAR ===
    (CAPTURES / "har_entries.json").write_text(
        json.dumps(har_entries, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"\nHAR entries: {len(har_entries)}")

    # === 保持浏览器打开 30 秒以便观察 ===
    print("\n浏览器保持 30 秒，请观察页面状态...")
    time.sleep(30)

    await browser.close()

    # === 生成执行报告 ===
    report = f"""## 任务1 执行报告

### 请求流程
- 目标: {target_url}
- 最终状态码: {final_status}
- HAR 条目: {len(har_entries)}

### 捕获产物
{chr(10).join(f'- {f.name}' for f in sorted(CAPTURES.iterdir()) if f.is_file())}

### Cookie 信息
{chr(10).join(f'- {c["name"]} (len={len(c["value"])})' for c in cookies_data)}
"""
    (CAPTURES / "task1_report.md").write_text(report, encoding="utf-8")
    print("\n=== 任务1 完成 ===")
    print(f"所有产物保存在: {CAPTURES}")

if __name__ == "__main__":
    asyncio.run(main())
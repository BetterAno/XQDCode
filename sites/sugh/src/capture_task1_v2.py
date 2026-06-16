"""任务1 v2: 使用 add_init_script 提前注入 Hook，捕获完整流程"""
import asyncio
import json
import time
from pathlib import Path
from cloakbrowser import launch_async

BASE_DIR = Path(__file__).resolve().parent.parent
CAPTURES = BASE_DIR / "captures"
CAPTURES.mkdir(parents=True, exist_ok=True)

# Hook 脚本 - 在页面加载前注入
HOOK_SCRIPT = """
// === Cookie Hook (极早注入) ===
(function() {
    const origDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
                     Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
    if (origDesc && origDesc.set) {
        const origSetter = origDesc.set;
        window.__cookie_logs = [];
        Object.defineProperty(document, 'cookie', {
            get() { return origDesc.get.call(this); },
            set(val) {
                window.__cookie_logs.push({time: Date.now(), value: val.substring(0, 500)});
                console.log('[COOKIE_HOOK] SET:', val.substring(0, 200));
                origSetter.call(this, val);
            },
            configurable: true
        });
    }
})();

// === Eval Hook ===
(function() {
    const origEval = window.eval;
    window.__eval_logs = [];
    window.eval = function(code) {
        const s = typeof code === 'string' ? code : String(code);
        window.__eval_logs.push({time: Date.now(), length: s.length, preview: s.substring(0, 300)});
        console.log('[EVAL_HOOK] CALLED, length:', s.length, 'preview:', s.substring(0, 100));
        return origEval(code);
    };
})();

// === Function constructor Hook ===
(function() {
    const OrigFunction = window.Function;
    window.__function_logs = [];
    window.Function = function(...args) {
        const body = args.pop() || '';
        const s = typeof body === 'string' ? body : String(body);
        window.__function_logs.push({time: Date.now(), length: s.length, preview: s.substring(0, 200)});
        console.log('[FUNCTION_HOOK] CALLED, length:', s.length);
        return OrigFunction(...args, body);
    };
    window.Function.prototype = OrigFunction.prototype;
})();

// === setTimeout Hook ===
(function() {
    const origST = window.setTimeout;
    window.__timeout_logs = [];
    window.setTimeout = function(fn, delay, ...args) {
        const fnStr = typeof fn === 'function' ? fn.toString().substring(0, 100) : String(fn).substring(0, 100);
        window.__timeout_logs.push({time: Date.now(), delay, fn: fnStr});
        console.log('[TIMEOUT_HOOK] delay:', delay);
        return origST.call(this, fn, delay, ...args);
    };
})();

// === Console message capture ===
window.__console_logs = [];
const origConsoleLog = console.log;
console.log = function(...args) {
    window.__console_logs.push({time: Date.now(), args: args.map(a => String(a).substring(0, 200))});
    origConsoleLog.apply(console, args);
};
"""

async def main():
    browser = await launch_async(headless=False)
    context = await browser.new_context()
    page = await context.new_page()

    # 注入 hooks
    await page.add_init_script(HOOK_SCRIPT)

    # 收集所有响应
    all_responses = []
    async def on_response(response):
        url = response.url
        status = response.status
        try:
            body = await response.text()
            body_size = len(body)
            body_preview = body[:300]
        except:
            body_size = -1
            body_preview = "(error)"
        info = {
            "url": url, "status": status,
            "content_type": response.headers.get("content-type", ""),
            "set_cookie": response.headers.get("set-cookie", "")[:300],
            "body_size": body_size, "body_preview": body_preview
        }
        all_responses.append(info)
        print(f"  [{status}] {len(body_preview)}B <- {url[:120]}")

    # 收集所有请求
    all_requests = []
    async def on_request(request):
        all_requests.append({
            "url": request.url,
            "method": request.method,
            "headers": {k: str(v)[:200] for k, v in request.headers.items()}
        })

    page.on("response", on_response)
    page.on("request", on_request)

    # 收集 console 消息
    page.on("console", lambda msg: print(f"  [BROWSER_CONSOLE] [{msg.type}] {msg.text[:200]}"))

    # === 访问目标 ===
    target_url = "https://sugh.szu.edu.cn/Html/News/Columns/7/Index.html"
    print(f"\n=== 访问: {target_url} ===")
    try:
        resp = await page.goto(target_url, wait_until="networkidle", timeout=60000)
        print(f"最终导航状态: {resp.status}, URL: {resp.url}")
    except Exception as e:
        print(f"goto error: {e}")

    print(f"\n等待 JS 执行...")
    await asyncio.sleep(5)

    # 截图
    await page.screenshot(path=str(CAPTURES / "page_final.png"))

    # === 收集数据 ===
    # $_ts
    try:
        ts_data = await page.evaluate("""() => {
            if (!window.$_ts) return null;
            const r = {keys: Object.keys(window.$_ts), values: {}};
            for (const k of r.keys.slice(0, 30)) {
                const v = window.$_ts[k];
                r.values[k] = typeof v === 'string' ? v.substring(0, 150) : v;
            }
            return r;
        }""")
        print(f"\n$_ts keys: {len(ts_data['keys']) if ts_data else 0}")
        if ts_data:
            (CAPTURES / "ts_info.json").write_text(json.dumps(ts_data, indent=2, ensure_ascii=False), encoding="utf-8")
            for k in ts_data["keys"][:10]:
                print(f"  {k} = {ts_data['values'][k]}")
    except Exception as e:
        print(f"$_ts error: {e}")

    # hooks 日志
    for name in ["cookie_logs", "eval_logs", "function_logs", "timeout_logs", "console_logs"]:
        try:
            logs = await page.evaluate(f"() => window.__{name} || []")
            print(f"\n{name}: {len(logs)} entries")
            (CAPTURES / f"{name}.json").write_text(json.dumps(logs, indent=2, ensure_ascii=False), encoding="utf-8")
            # 打印前几条
            for entry in logs[:5]:
                print(f"  {json.dumps(entry, ensure_ascii=False)[:200]}")
        except Exception as e:
            print(f"{name} error: {e}")

    # cookies
    cookies = await context.cookies()
    print(f"\n=== Cookies ({len(cookies)}) ===")
    for c in cookies:
        print(f"  {c['name']}: len={len(c['value'])}, httpOnly={c.get('httpOnly', False)}")

    # document.cookie
    try:
        doc_cookie = await page.evaluate("() => document.cookie")
        print(f"\ndocument.cookie: {doc_cookie[:300]}")
    except:
        pass

    # 保存所有
    (CAPTURES / "all_responses.json").write_text(json.dumps(all_responses, indent=2, ensure_ascii=False), encoding="utf-8")
    (CAPTURES / "all_requests.json").write_text(json.dumps(all_requests, indent=2, ensure_ascii=False), encoding="utf-8")
    (CAPTURES / "final_cookies.json").write_text(json.dumps(cookies, indent=2, default=str, ensure_ascii=False), encoding="utf-8")

    # page content
    content = await page.content()
    (CAPTURES / "page_content.html").write_text(content, encoding="utf-8")

    print(f"\n=== 任务1 完成 ===")
    print(f"产物: {[f.name for f in CAPTURES.iterdir() if f.is_file()]}")
    print(f"\n浏览器保持 10 秒...")
    await asyncio.sleep(10)
    await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
"""任务1 v3: 使用 page.route 拦截 + 完整 console 监听调试
关键目标: 确认 JS 是否执行、cookie 何时设置、$_ts 何时创建
"""
import asyncio
import json
import time
from pathlib import Path
from cloakbrowser import launch_async

CAPTURES = Path(__file__).resolve().parent.parent / "captures"
CAPTURES.mkdir(parents=True, exist_ok=True)

# ===== 浏览器侧 Hook（注入到每个页面） =====
HOOK_INIT = r"""
(function() {
    const _logs = []; window.__rs_logs = _logs;
    function _log(tag, ...args) {
        const entry = {t: Date.now(), tag, args: args.map(a => String(a).substring(0, 300))};
        _logs.push(entry);
        console.log('[RS_HOOK]', tag, ...args.map(a => String(a).substring(0, 150)));
    }

    // 1. Hook eval (早于页面脚本)
    const _origEval = window.eval;
    window.eval = function(code) {
        const s = typeof code === 'string' ? code : String(code);
        _log('EVAL', s.length, s.substring(0, 120));
        window.__rs_eval_code = s;
        window.__rs_eval_time = Date.now();
        return _origEval(code);
    };

    // 2. Monitor $_ts creation
    let _ts_val = undefined;
    Object.defineProperty(window, '$_ts', {
        get() { return _ts_val; },
        set(v) {
            _log('SET_$_TS', typeof v, v ? Object.keys(v).slice(0, 20) : 'null');
            _ts_val = v;
        },
        configurable: true, enumerable: true
    });

    // 3. Monitor document.cookie at prototype level
    const dcDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
    if (dcDesc && dcDesc.set) {
        const origSet = dcDesc.set;
        Object.defineProperty(Document.prototype, 'cookie', {
            get() { return origSet.caller ? '' : dcDesc.get ? dcDesc.get.call(this) : ''; },
            set(v) {
                _log('COOKIE_SET', v.substring(0, 500));
                try { origSet.call(this, v); } catch(e) { _log('COOKIE_ERR', e.message); }
            },
            configurable: true
        });
    }

    // 4. Monitor location changes
    const origAssign = window.location.assign;
    window.location.assign = function(url) {
        _log('LOC_ASSIGN', url);
    };

    _log('INIT_DONE');
})();
"""

async def main():
    browser = await launch_async(headless=False)
    context = await browser.new_context()
    page = await context.new_page()

    # 注入 hook（使用 page.evaluateOnNewDocument 方式）
    await context.add_init_script("""
    (function() {
        window.__rs_logs = [];
        window.__rs_log = function(tag, msg) {
            window.__rs_logs.push({t: Date.now(), tag: tag, msg: msg});
            console.log('[RS_HOOK][' + tag + '] ' + msg);
        };
        window.__rs_log('INIT', 'hook_loaded');

        // Hook eval
        var origEval = window.eval;
        window.eval = function(code) {
            window.__rs_log('EVAL', String(code).substring(0, 200));
            return origEval(code);
        };

        // Hook $_ts
        var tsVal;
        Object.defineProperty(window, '$_ts', {
            get: function() { return tsVal; },
            set: function(v) {
                window.__rs_log('SET_TS', 'keys=' + Object.keys(v).length);
                tsVal = v;
            },
            configurable: true, enumerable: true
        });

        // Hook cookie
        var cookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
        if (cookieDesc && cookieDesc.set) {
            var origCookieSet = cookieDesc.set;
            Object.defineProperty(Document.prototype, 'cookie', {
                get: function() { return ''; },
                set: function(v) {
                    window.__rs_log('COOKIE', v.substring(0, 300));
                    origCookieSet.call(this, v);
                },
                configurable: true
            });
        }
    })();
    """)

    # 监听 browser console
    page.on("console", lambda msg: print(f"  [BROWSER] [{msg.type}] {msg.text[:250]}"))

    # 监听 page error
    page.on("pageerror", lambda err: print(f"  [PAGE_ERROR] {err}"))

    # 监听 dialog
    page.on("dialog", lambda d: print(f"  [DIALOG] {d.type}: {d.message}") and d.dismiss())

    # 记录所有请求
    all_requests = []
    async def on_request(req):
        all_requests.append({
            "url": req.url, "method": req.method,
            "headers": {k: str(v)[:300] for k, v in req.headers.items()}
        })

    all_responses = []
    async def on_response(resp):
        info = {
            "url": resp.url, "status": resp.status,
            "set_cookie": str(resp.headers.get("set-cookie", ""))[:500],
        }
        all_responses.append(info)

    page.on("request", on_request)
    page.on("response", on_response)

    target = "https://sugh.szu.edu.cn/Html/News/Columns/7/Index.html"
    print(f"=== Navigating to {target} ===")
    try:
        await page.goto(target, wait_until="networkidle", timeout=60000)
    except Exception as e:
        print(f"goto: {e}")

    await asyncio.sleep(5)

    # 截图
    await page.screenshot(path=str(CAPTURES / "v3_final.png"))

    # 读取 hook logs
    try:
        logs = await page.evaluate("() => window.__rs_logs || []")
        print(f"\n=== RS_HOOK Logs ({len(logs)} entries) ===")
        for entry in logs:
            tag = entry["tag"]
            args_str = " ".join(entry["args"])
            print(f"  [{tag}] {args_str[:200]}")
        (CAPTURES / "v3_rs_logs.json").write_text(json.dumps(logs, indent=2, ensure_ascii=False), encoding="utf-8")
    except Exception as e:
        print(f"get logs error: {e}")

    # 读取 $_ts
    try:
        ts = await page.evaluate("() => window.$_ts || null")
        print(f"\n$_ts: {ts is not None}")
        if ts:
            print(f"  keys: {list(ts.keys())[:30]}")
    except:
        pass

    # 读取 document.cookie
    try:
        dc = await page.evaluate("() => document.cookie")
        print(f"\ndocument.cookie: {dc[:400]}")
    except:
        pass

    # 读取 context cookies
    cookies = await context.cookies()
    print(f"\n=== Context Cookies ({len(cookies)}) ===")
    for c in cookies:
        print(f"  {c['name']}: len={len(c['value'])}, httpOnly={c.get('httpOnly')}, domain={c.get('domain')}")

    (CAPTURES / "v3_requests.json").write_text(json.dumps(all_requests, indent=2, ensure_ascii=False), encoding="utf-8")
    (CAPTURES / "v3_responses.json").write_text(json.dumps(all_responses, indent=2, ensure_ascii=False), encoding="utf-8")
    (CAPTURES / "v3_cookies.json").write_text(json.dumps(cookies, indent=2, default=str, ensure_ascii=False), encoding="utf-8")

    print("\n浏览器保持 15 秒...")
    await asyncio.sleep(15)
    await browser.close()
    print("Done.")

if __name__ == "__main__":
    asyncio.run(main())
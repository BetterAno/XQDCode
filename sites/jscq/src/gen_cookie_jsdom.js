/**
 * 瑞数6 Cookie 生成 - sdenv-jsdom 方案
 * 使用 sdenv-jsdom 提供真实浏览器 DOM 环境
 *
 * 用法: node gen_cookie_jsdom.js <input.json>
 */

var fs = require('fs');
var sdenv = require('sdenv-jsdom');
var JSDOM = sdenv.JSDOM;

var inputPath = process.argv[2];
if (!inputPath) {
    process.stderr.write('Usage: node gen_cookie_jsdom.js <input.json>\n');
    process.exit(1);
}
var input = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

var html = '<!DOCTYPE html><html><head>' +
    '<meta id="' + esc(input.meta_id || '') + '" content="' + esc(input.meta_content || '') + '">' +
    '</head><body></body></html>';

var CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

// 创建 jsdom 实例
var dom = new JSDOM(html, {
    url: input.url,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    beforeParse: function(window) {
        // ========== Navigator 补丁 ==========
        Object.defineProperty(window.navigator, 'userAgent', {
            get: function() { return CHROME_UA; }, configurable: true
        });
        Object.defineProperty(window.navigator, 'appVersion', {
            get: function() { return CHROME_UA.substring(11); }, configurable: true
        });
        Object.defineProperty(window.navigator, 'platform', {
            get: function() { return 'Win32'; }, configurable: true
        });
        Object.defineProperty(window.navigator, 'vendor', {
            get: function() { return 'Google Inc.'; }, configurable: true
        });
        Object.defineProperty(window.navigator, 'language', {
            get: function() { return 'zh-CN'; }, configurable: true
        });
        Object.defineProperty(window.navigator, 'languages', {
            get: function() { return ['zh-CN', 'zh', 'en-US', 'en']; }, configurable: true
        });
        Object.defineProperty(window.navigator, 'deviceMemory', {
            get: function() { return 8; }, configurable: true
        });
        Object.defineProperty(window.navigator, 'hardwareConcurrency', {
            get: function() { return 8; }, configurable: true
        });
        Object.defineProperty(window.navigator, 'maxTouchPoints', {
            get: function() { return 0; }, configurable: true
        });

        // ========== Screen 补丁 ==========
        var screen = window.screen;
        Object.defineProperty(screen, 'width', { get: function() { return 1920; }, configurable: true });
        Object.defineProperty(screen, 'height', { get: function() { return 1080; }, configurable: true });
        Object.defineProperty(screen, 'availWidth', { get: function() { return 1920; }, configurable: true });
        Object.defineProperty(screen, 'availHeight', { get: function() { return 1040; }, configurable: true });
        Object.defineProperty(screen, 'colorDepth', { get: function() { return 24; }, configurable: true });
        Object.defineProperty(screen, 'pixelDepth', { get: function() { return 24; }, configurable: true });

        // ========== Performance 补丁 ==========
        if (window.performance) {
            var startTime = Date.now() - 500;
            var timing = {
                navigationStart: startTime,
                unloadEventStart: 0, unloadEventEnd: 0,
                redirectStart: 0, redirectEnd: 0,
                fetchStart: startTime + 1,
                domainLookupStart: startTime + 5, domainLookupEnd: startTime + 10,
                connectStart: startTime + 10, connectEnd: startTime + 50,
                secureConnectionStart: startTime + 20,
                requestStart: startTime + 50, responseStart: startTime + 100,
                responseEnd: startTime + 200,
                domLoading: startTime + 200, domInteractive: startTime + 400,
                domContentLoadedEventStart: startTime + 400, domContentLoadedEventEnd: startTime + 401,
                domComplete: startTime + 800,
                loadEventStart: startTime + 800, loadEventEnd: startTime + 801
            };
            Object.defineProperty(window.performance, 'timing', {
                get: function() { return timing; }, configurable: true
            });
            Object.defineProperty(window.performance, 'navigation', {
                get: function() { return { type: 0, redirectCount: 0 }; }, configurable: true
            });
            window.performance.memory = {
                jsHeapSizeLimit: 2172649472,
                totalJSHeapSize: 9143552,
                usedJSHeapSize: 6400000
            };
        }

        // ========== matchMedia ==========
        window.matchMedia = function(query) {
            return {
                matches: false, media: query,
                addListener: function() {}, removeListener: function() {},
                addEventListener: function() {}, removeEventListener: function() {},
                dispatch: function() {}, onchange: null
            };
        };

        // ========== Chrome 全局对象 ==========
        window.chrome = {};
        window.chrome.runtime = {
            connect: function() {}, sendMessage: function() {},
            onMessage: { addListener: function() {} }
        };
        window.chrome.csi = function() {};
        window.chrome.loadTimes = function() {
            return { firstPaintTime: 0, startLoadTime: 0, commitLoadTime: 0 };
        };

        // ========== reportError / structuredClone ==========
        window.reportError = function(err) {};
        window.structuredClone = function(obj) {
            if (obj === undefined) return undefined;
            return JSON.parse(JSON.stringify(obj));
        };

        // ========== matchMedia ==========
        window.matchMedia = function(query) {
            return {
                matches: false, media: query,
                addListener: function() {}, removeListener: function() {},
                addEventListener: function() {}, removeEventListener: function() {},
                dispatch: function() {}, onchange: null
            };
        };

        // ========== 清理 jsdom 指纹 ==========
        delete window._jsdom;
        delete window.__jsdom;
    }
});

var window = dom.window;

// ========== 在 jsdom 上下文内设置 toString 标记 + Error stack 清理 ==========
window.eval([
    '(function() {',
    '  // ========== Function.prototype.toString 不覆写 ==========',
    '  // 启发式覆写会误伤瑞数内部函数, 导致 cookie 更短',
    '  // sdenv-jsdom 已内置 eval/Function 的 [native code] 处理',
    '',
    '',
    '  // ========== Error stack 不清理 ==========',
    '  // Error stack getter 会干扰瑞数内部逻辑',
    '  // Error.prepareStackTrace 保持 undefined (匹配 Chrome)',
    '})();'
].join('\n'));

var document = window.document;

// ========== 设置 O Cookie ==========
if (input.o_cookie_name && input.o_cookie_value) {
    document.cookie = input.o_cookie_name + '=' + input.o_cookie_value;
    process.stderr.write('[DEBUG] O Cookie set: ' + input.o_cookie_name + '=' + input.o_cookie_value.substring(0, 30) + '...\n');
}

// ========== 执行瑞数代码 ==========
try {
    if (input.inline_script) {
        window.eval(input.inline_script);
    }

    if (!window.$_ts || !window.$_ts.cd) {
        process.stderr.write('[ERROR] $_ts.cd not set after inline script\n');
        process.exit(1);
    }
    process.stderr.write('[OK] $_ts.cd set, length: ' + window.$_ts.cd.length + '\n');

    if (input.js_content) {
        window.eval(input.js_content);
    }
    process.stderr.write('[OK] External JS executed\n');

    if (input.trigger_call) {
        try {
            window.eval(input.trigger_call);
            process.stderr.write('[OK] Trigger executed\n');
        } catch(e) {
            process.stderr.write('[WARN] Trigger failed: ' + e.message + '\n');
        }
    }

    var cookieStr = document.cookie;
    process.stderr.write('[DEBUG] document.cookie: ' + cookieStr.substring(0, 500) + '\n');

    var cookies = cookieStr.split(';').map(function(c) { return c.trim(); }).filter(function(c) { return c; });

    var pCookie = null;
    for (var i = 0; i < cookies.length; i++) {
        var name = cookies[i].split('=')[0].trim();
        if (name.indexOf('jDwkDWjIm6GR') >= 0 && name.charAt(name.length - 1) === 'P') {
            pCookie = cookies[i];
            break;
        }
    }

    if (!pCookie) {
        process.stderr.write('[WARN] No P Cookie found\n');
        process.stderr.write('[WARN] All cookies: ' + JSON.stringify(cookies) + '\n');
        process.exit(1);
    }

    var pVal = pCookie.split('=').slice(1).join('=');
    process.stderr.write('[OK] P Cookie length: ' + pVal.length + ', dots: ' + (pVal.match(/\./g) || []).length + '\n');

    var result = {
        pcookie: pCookie,
        all: cookies.filter(function(c) {
            var n = c.split('=')[0].trim();
            return n.indexOf('jDwkDWjIm6GRO') < 0;
        })
    };

    process.stdout.write(JSON.stringify(result));

} catch (e) {
    process.stderr.write('[ERROR] ' + e.message + '\n');
    process.stderr.write((e.stack || '').split('\n').slice(0, 5).join('\n') + '\n');
    process.exit(1);
}

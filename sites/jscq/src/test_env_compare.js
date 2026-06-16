/**
 * 全面对比 VM 环境与真实浏览器的差异
 * 运行方式: node test_env_compare.js
 */
var fs = require('fs');
var vm = require('vm');
var path = require('path');

var setupEnv = require(path.join(__dirname, 'env.js'));

var sandbox = {};
['Uint8Array', 'Uint8ClampedArray', 'Int8Array', 'Int16Array', 'Int32Array',
    'Uint16Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'ArrayBuffer', 'DataView',
    'Map', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'Proxy', 'Reflect', 'Promise'].forEach(function (n) {
    sandbox[n] = global[n];
});
vm.createContext(sandbox);
delete sandbox.__dirname; delete sandbox.__filename; delete sandbox.require;
delete sandbox.module; delete sandbox.exports; delete sandbox.global;
delete sandbox.process; delete sandbox.Buffer;

setupEnv(sandbox, {
    url: 'https://www.jscq.com.cn/jscq/cqjy/jygg/cqzr/index.shtml',
    meta_content: 'test123',
    meta_id: 'testid',
    js_url: 'https://www.jscq.com.cn/test.js',
    inline_script_text: '$_ts=window["$_ts"];$_ts.cd="test";',
});

// Test code to run in sandbox - mirrors real browser checks
var testCode = [
    // typeof checks (all items from real browser)
    'typeof window',
    'typeof document',
    'typeof navigator',
    'typeof location',
    'typeof screen',
    'typeof history',
    'typeof localStorage',
    'typeof sessionStorage',
    'typeof indexedDB',
    'typeof caches',
    'typeof performance',
    'typeof crypto',
    'typeof fetch',
    'typeof XMLHttpRequest',
    'typeof Event',
    'typeof CustomEvent',
    'typeof MutationObserver',
    'typeof IntersectionObserver',
    'typeof ResizeObserver',
    'typeof requestAnimationFrame',
    'typeof cancelAnimationFrame',
    'typeof matchMedia',
    'typeof getComputedStyle',
    'typeof innerWidth',
    'typeof innerHeight',
    'typeof outerWidth',
    'typeof outerHeight',
    'typeof devicePixelRatio',
    'typeof Notification',
    'typeof Worker',
    'typeof SharedWorker',
    'typeof ServiceWorker',
    'typeof WebSocket',
    'typeof Blob',
    'typeof File',
    'typeof FileReader',
    'typeof URL',
    'typeof URLSearchParams',
    'typeof Headers',
    'typeof Request',
    'typeof Response',
    'typeof TextEncoder',
    'typeof TextDecoder',
    'typeof atob',
    'typeof btoa',
    'typeof setTimeout',
    'typeof setInterval',
    'typeof clearTimeout',
    'typeof clearInterval',
    'typeof queueMicrotask',
    'typeof importScripts',
    // Critical typeof checks
    'typeof document.all',
    'typeof document.implementation',
    'typeof document.createRange',
    'typeof document.write',
    'typeof document.createElement',
    'typeof document.getElementById',
    'typeof document.getElementsByTagName',
    'typeof document.getElementsByClassName',
    'typeof document.querySelector',
    'typeof document.querySelectorAll',
    'typeof document.scripts',
    'typeof document.styleSheets',
    'typeof document.fonts',
    'typeof document.head',
    'typeof document.body',
    'typeof document.documentElement',
    'typeof document.cookie',
    'typeof document.readyState',
    'typeof document.domain',
    'typeof document.referrer',
    'typeof document.title',
    'typeof document.characterSet',
    'typeof document.compatMode',
    'typeof document.hidden',
    'typeof document.visibilityState',
    'typeof document.designMode',
    'typeof navigator.userAgent',
    'typeof navigator.platform',
    'typeof navigator.language',
    'typeof navigator.languages',
    'typeof navigator.plugins',
    'typeof navigator.mimeTypes',
    'typeof navigator.cookieEnabled',
    'typeof navigator.webdriver',
    'typeof navigator.hardwareConcurrency',
    'typeof navigator.deviceMemory',
    'typeof navigator.maxTouchPoints',
    'typeof navigator.connection',
    'typeof navigator.getBattery',
    'typeof navigator.sendBeacon',
    // toString checks
    'Object.prototype.toString.call(window)',
    'Object.prototype.toString.call(document)',
    'Object.prototype.toString.call(document.all)',
    'Object.prototype.toString.call(document.scripts)',
    'Object.prototype.toString.call(navigator.plugins)',
    'Object.prototype.toString.call(navigator.mimeTypes)',
    'Object.prototype.toString.call(document.getElementsByTagName("script"))',
    'Object.prototype.toString.call(document.querySelectorAll("script"))',
    'Object.prototype.toString.call(document.head)',
    'Object.prototype.toString.call(document.body)',
    'Object.prototype.toString.call(document.createElement("div"))',
    'Object.prototype.toString.call(location)',
    'Object.prototype.toString.call(screen)',
    'Object.prototype.toString.call(history)',
    'Object.prototype.toString.call(performance)',
    'Object.prototype.toString.call(navigator)',
    // Constructor / instanceof checks
    'window.constructor.name',
    'window instanceof Window',
    'document.constructor.name',
    'document.body.constructor.name',
    'document.createElement("div").constructor.name',
    'document.createElement("div") instanceof HTMLElement',
    'Array.isArray(document.getElementsByTagName("script"))',
    'Array.isArray(document.querySelectorAll("script"))',
    // Function.prototype.toString
    'Function.prototype.toString.call(document.createElement).substring(0, 60)',
    'Function.prototype.toString.call(document.getElementById).substring(0, 60)',
    'Function.prototype.toString.call(navigator.getBattery).substring(0, 60)',
    'Function.prototype.toString.call(performance.now).substring(0, 60)',
    'Function.prototype.toString.call(crypto.getRandomValues).substring(0, 60)',
    'Function.prototype.toString.call(setTimeout).substring(0, 60)',
    'Function.prototype.toString.call(atob).substring(0, 60)',
    'Function.prototype.toString.call(btoa).substring(0, 60)',
    'Function.prototype.toString.call(eval).substring(0, 60)',
    // Misc
    'document.readyState',
    'document.domain',
    'location.protocol',
    'location.hostname',
    'location.pathname',
    'performance.now()',
    'screen.width',
    'screen.height',
    'window === window.window',
    'window.top === window',
    'window.self === window',
    'window.parent === window',
    'window.frames === window',
    'window.outerWidth',
    'window.outerHeight',
    'window.innerWidth',
    'window.innerHeight',
    'window.devicePixelRatio',
    'document.querySelectorAll("script").length',
    'document.getElementsByTagName("script").length',
    'document.body.tagName',
    'document.head.tagName',
    'document.documentElement.tagName',
].map(function(expr) {
    return expr;
});

// Real browser expected values
var expected = {
    'typeof window': 'object',
    'typeof document': 'object',
    'typeof navigator': 'object',
    'typeof location': 'object',
    'typeof screen': 'object',
    'typeof history': 'object',
    'typeof localStorage': 'object',
    'typeof sessionStorage': 'object',
    'typeof indexedDB': 'object',
    'typeof caches': 'object',
    'typeof performance': 'object',
    'typeof crypto': 'object',
    'typeof fetch': 'function',
    'typeof XMLHttpRequest': 'function',
    'typeof Event': 'function',
    'typeof CustomEvent': 'function',
    'typeof MutationObserver': 'function',
    'typeof IntersectionObserver': 'function',
    'typeof ResizeObserver': 'function',
    'typeof requestAnimationFrame': 'function',
    'typeof cancelAnimationFrame': 'function',
    'typeof matchMedia': 'function',
    'typeof getComputedStyle': 'function',
    'typeof innerWidth': 'number',
    'typeof innerHeight': 'number',
    'typeof outerWidth': 'number',
    'typeof outerHeight': 'number',
    'typeof devicePixelRatio': 'number',
    'typeof Notification': 'function',
    'typeof Worker': 'function',
    'typeof SharedWorker': 'function',
    'typeof ServiceWorker': 'function',
    'typeof WebSocket': 'function',
    'typeof Blob': 'function',
    'typeof File': 'function',
    'typeof FileReader': 'function',
    'typeof URL': 'function',
    'typeof URLSearchParams': 'function',
    'typeof Headers': 'function',
    'typeof Request': 'function',
    'typeof Response': 'function',
    'typeof TextEncoder': 'function',
    'typeof TextDecoder': 'function',
    'typeof atob': 'function',
    'typeof btoa': 'function',
    'typeof setTimeout': 'function',
    'typeof setInterval': 'function',
    'typeof clearTimeout': 'function',
    'typeof clearInterval': 'function',
    'typeof queueMicrotask': 'function',
    'typeof importScripts': 'undefined',
    'typeof document.all': 'undefined',
    'typeof document.implementation': 'object',
    'typeof document.createRange': 'function',
    'typeof document.write': 'function',
    'typeof document.createElement': 'function',
    'typeof document.getElementById': 'function',
    'typeof document.getElementsByTagName': 'function',
    'typeof document.getElementsByClassName': 'function',
    'typeof document.querySelector': 'function',
    'typeof document.querySelectorAll': 'function',
    'typeof document.scripts': 'object',
    'typeof document.styleSheets': 'object',
    'typeof document.fonts': 'object',
    'typeof document.head': 'object',
    'typeof document.body': 'object',
    'typeof document.documentElement': 'object',
    'typeof document.cookie': 'string',
    'typeof document.readyState': 'string',
    'typeof document.domain': 'string',
    'typeof document.referrer': 'string',
    'typeof document.title': 'string',
    'typeof document.characterSet': 'string',
    'typeof document.compatMode': 'string',
    'typeof document.hidden': 'boolean',
    'typeof document.visibilityState': 'string',
    'typeof document.designMode': 'string',
    'typeof navigator.userAgent': 'string',
    'typeof navigator.platform': 'string',
    'typeof navigator.language': 'string',
    'typeof navigator.languages': 'object',
    'typeof navigator.plugins': 'object',
    'typeof navigator.mimeTypes': 'object',
    'typeof navigator.cookieEnabled': 'boolean',
    'typeof navigator.webdriver': 'boolean',
    'typeof navigator.hardwareConcurrency': 'number',
    'typeof navigator.deviceMemory': 'number',
    'typeof navigator.maxTouchPoints': 'number',
    'typeof navigator.connection': 'object',
    'typeof navigator.getBattery': 'function',
    'typeof navigator.sendBeacon': 'function',
    'Object.prototype.toString.call(window)': '[object Window]',
    'Object.prototype.toString.call(document)': '[object HTMLDocument]',
    'Object.prototype.toString.call(document.all)': '[object HTMLAllCollection]',
    'Object.prototype.toString.call(document.scripts)': '[object HTMLCollection]',
    'Object.prototype.toString.call(navigator.plugins)': '[object PluginArray]',
    'Object.prototype.toString.call(navigator.mimeTypes)': '[object MimeTypeArray]',
    'Object.prototype.toString.call(document.getElementsByTagName("script"))': '[object HTMLCollection]',
    'Object.prototype.toString.call(document.querySelectorAll("script"))': '[object NodeList]',
    'Object.prototype.toString.call(document.head)': '[object HTMLHeadElement]',
    'Object.prototype.toString.call(document.body)': '[object HTMLBodyElement]',
    'Object.prototype.toString.call(document.createElement("div"))': '[object HTMLDivElement]',
    'Object.prototype.toString.call(location)': '[object Location]',
    'Object.prototype.toString.call(screen)': '[object Screen]',
    'Object.prototype.toString.call(history)': '[object History]',
    'Object.prototype.toString.call(performance)': '[object Performance]',
    'Object.prototype.toString.call(navigator)': '[object Navigator]',
    'window.constructor.name': 'Window',
    'window instanceof Window': true,
    'document.constructor.name': 'HTMLDocument',
    'Array.isArray(document.getElementsByTagName("script"))': false,
    'Array.isArray(document.querySelectorAll("script"))': false,
    'document.readyState': 'complete',
    'location.protocol': 'https:',
    'location.hostname': 'www.jscq.com.cn',
    'location.pathname': '/jscq/cqjy/jygg/cqzr/index.shtml',
    'screen.width': 1920,
    'screen.height': 1080,
    'window === window.window': true,
    'window.top === window': true,
    'window.self === window': true,
    'window.parent === window': true,
    'window.frames === window': true,
    'document.body.tagName': 'BODY',
    'document.head.tagName': 'HEAD',
    'document.documentElement.tagName': 'HTML',
};

var mismatches = [];
var passes = 0;

testCode.forEach(function(expr) {
    try {
        var result = vm.runInContext(expr, sandbox);
        var resultStr = String(result);
        var exp = expected[expr];

        if (exp !== undefined) {
            if (resultStr === String(exp)) {
                passes++;
            } else {
                mismatches.push('MISMATCH: ' + expr);
                mismatches.push('  got:      ' + resultStr);
                mismatches.push('  expected: ' + exp);
            }
        } else {
            console.log('INFO: ' + expr + ' => ' + resultStr);
        }
    } catch(e) {
        var exp = expected[expr];
        if (exp !== undefined) {
            mismatches.push('ERROR: ' + expr);
            mismatches.push('  error:    ' + e.message);
            mismatches.push('  expected: ' + exp);
        } else {
            console.log('ERROR: ' + expr + ' => ' + e.message);
        }
    }
});

console.log('\n=== SUMMARY ===');
console.log('Passed: ' + passes);
console.log('Mismatches: ' + mismatches.length / 3);
if (mismatches.length > 0) {
    console.log('\n=== MISMATCHES ===');
    mismatches.forEach(function(m) { console.log(m); });
}

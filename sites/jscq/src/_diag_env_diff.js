/**
 * Comprehensive environment detection diagnostic
 * Compares our VM environment with real Chrome browser
 */
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
    meta_content: 'test123', meta_id: 'testid',
    js_url: 'https://www.jscq.com.cn/test.js',
    inline_script_text: '$_ts=window["$_ts"];$_ts.cd="test";',
});

var checks = [
    // === Error stack ===
    '(new Error()).stack.split("\\n")[0]',
    '(new Error()).stack.split("\\n").slice(0,3).join("|")',

    // === typeof checks ===
    'typeof window',
    'typeof document',
    'typeof navigator',
    'typeof globalThis',
    'typeof global',
    'typeof globalThis !== "undefined" ? globalThis === window : "no globalThis"',
    'typeof module',
    'typeof require',
    'typeof process',
    'typeof __dirname',
    'typeof __filename',
    'typeof exports',
    'typeof Buffer',
    'typeof setImmediate',
    'typeof clearImmediate',
    'typeof console',
    'typeof alert',
    'typeof confirm',
    'typeof prompt',
    'typeof fetch',
    'typeof XMLHttpRequest',
    'typeof WebSocket',
    'typeof Event',
    'typeof CustomEvent',
    'typeof MutationObserver',
    'typeof IntersectionObserver',
    'typeof ResizeObserver',
    'typeof Worker',
    'typeof SharedWorker',
    'typeof ServiceWorker',
    'typeof Blob',
    'typeof File',
    'typeof FileReader',
    'typeof FormData',
    'typeof URL',
    'typeof URLSearchParams',
    'typeof Headers',
    'typeof Request',
    'typeof Response',
    'typeof AbortController',
    'typeof TextEncoder',
    'typeof TextDecoder',
    'typeof crypto',
    'typeof performance',
    'typeof speechSynthesis',
    'typeof Notification',
    'typeof caches',
    'typeof indexedDB',
    'typeof localStorage',
    'typeof sessionStorage',
    'typeof history',
    'typeof location',
    'typeof screen',
    'typeof visualViewport',
    'typeof styleMedia',
    'typeof chrome',  // Chrome-specific
    'typeof safari',   // Safari-specific
    'typeof opr',      // Opera-specific
    'typeof InstallTrigger', // Firefox-specific

    // === window identity ===
    'window === window.window',
    'window === self',
    'window === top',
    'window === parent',
    'window === frames',
    'window[0] === undefined',  // frames[0] should be undefined

    // === constructor checks ===
    'window.constructor === Window',
    'window instanceof Window',
    'Object.getPrototypeOf(window) === Window.prototype',

    // === Function toString ===
    'setTimeout.toString().substring(0, 80)',
    'Function.prototype.toString.call(setTimeout).substring(0, 80)',
    'document.createElement.toString().substring(0, 80)',
    'Function.prototype.toString.call(document.createElement).substring(0, 80)',
    'Array.prototype.push.toString().substring(0, 40)',
    'Function.prototype.toString.call(Array.prototype.push).substring(0, 40)',
    'String.fromCharCode.toString().substring(0, 40)',
    'Function.prototype.toString.call(String.fromCharCode).substring(0, 40)',

    // === hasOwnProperty checks ===
    'setTimeout.hasOwnProperty("toString")',
    'document.createElement.hasOwnProperty("toString")',
    'Array.prototype.push.hasOwnProperty("toString")',

    // === Function.prototype ===
    'typeof Function.prototype',
    'Function.prototype.toString.toString().substring(0, 60)',

    // === eval checks ===
    'typeof eval',
    'eval === window.eval',
    'eval.toString().substring(0, 60)',
    'Function.prototype.toString.call(eval).substring(0, 60)',

    // === new Function ===
    '(new Function("return 1"))()',
    '(new Function("return typeof window"))()',
    '(new Function("return typeof document"))()',
    '(new Function("return this"))() === window',
    '(new Function("return typeof global"))()',
    '(new Function("return typeof module"))()',
    '(new Function("return typeof process"))()',

    // === document checks ===
    'typeof document.all',
    '"all" in document',
    'document.all === undefined',
    'document.all == null',
    'document.all == undefined',
    'typeof document.createElement("div")',
    'Object.prototype.toString.call(document)',
    'Object.prototype.toString.call(document.createElement("div"))',
    'Object.prototype.toString.call(document.body)',

    // === navigator checks ===
    'typeof navigator.sendBeacon',
    'navigator.userAgent.length > 0',
    'Object.prototype.toString.call(navigator)',

    // === screen ===
    'Object.prototype.toString.call(screen)',

    // === location ===
    'location.href',
    'location.hostname',
    'location.protocol',

    // === Math, Date, JSON ===
    'typeof Math.random',
    'Math.random() >= 0',
    'typeof Date.now',
    'Date.now() > 0',
    'typeof JSON.stringify',

    // === Object.prototype.toString checks ===
    'Object.prototype.toString.call(window)',
    'Object.prototype.toString.call(document)',
    'Object.prototype.toString.call(navigator)',
    'Object.prototype.toString.call(location)',
    'Object.prototype.toString.call(screen)',
    'Object.prototype.toString.call(history)',
    'Object.prototype.toString.call(localStorage)',
    'Object.prototype.toString.call(sessionStorage)',

    // === atob/btoa ===
    'typeof atob',
    'typeof btoa',
    'atob("dGVzdA==")',

    // === performance ===
    'typeof performance',
    'typeof performance.now',
    'performance.now() > 0',

    // === crypto ===
    'typeof crypto',
    'typeof crypto.getRandomValues',

    // === toStringTag ===
    'window[Symbol.toStringTag]',
    'document[Symbol.toStringTag]',

    // === Property enumeration ===
    'Object.keys(window).length',

    // === Misc ===
    'typeof window.outerHeight',
    'window.outerHeight',
    'typeof window.devicePixelRatio',
    'window.devicePixelRatio',
    'typeof window.innerWidth',
    'window.innerWidth',
];

var warnings = [];
checks.forEach(function (expr) {
    try {
        var result = vm.runInContext(expr, sandbox);
        var str = String(result).substring(0, 200);
        console.log('OK  ' + expr + ' => ' + str);
    } catch (e) {
        console.log('ERR ' + expr + ' => ' + e.message.substring(0, 100));
        warnings.push('ERR: ' + expr);
    }
});

console.log('\n=== WARNINGS ===');
warnings.forEach(function (w) { console.log(w); });

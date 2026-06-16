/**
 * bdms.js 补环境运行器
 * 在 Node.js 中加载 bdms.js，模拟浏览器环境，捕获 a_bogus 生成
 *
 * Usage: node bdms_runner.js "<url_params>" "<user_agent>"
 * Output: JSON { a_bogus: "...", msToken: "..." }
 */

// ── Minimal browser environment ──
const crypto = require('crypto');

// Navigator
global.navigator = {
    userAgent: process.argv[3] || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    platform: "Win32",
    language: "zh-CN",
    languages: ["zh-CN", "zh"],
    cookieEnabled: true,
    hardwareConcurrency: 8,
    deviceMemory: 8,
    maxTouchPoints: 0,
    webdriver: false,
    vendor: "Google Inc.",
    vendorSub: "",
    productSub: "20030107",
    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    appCodeName: "Mozilla",
    appName: "Netscape",
    onLine: true,
    connection: { downlink: 10, effectiveType: "4g", rtt: 50, saveData: false },
};

// Screen
global.screen = {
    width: 1920,
    height: 1080,
    availWidth: 1920,
    availHeight: 1080,
    colorDepth: 24,
    pixelDepth: 24,
};

// Window (self-referencing)
global.window = global;
global.self = global;
global.top = global;
global.parent = global;

global.window.innerWidth = 1920;
global.window.innerHeight = 1080;
global.window.outerWidth = 1920;
global.window.outerHeight = 1080;
global.window.screenLeft = 0;
global.window.screenTop = 0;
global.window.screenX = 0;
global.window.screenY = 0;
global.window.devicePixelRatio = 1;
global.window.location = {
    href: "https://www.douyin.com/",
    protocol: "https:",
    host: "www.douyin.com",
    hostname: "www.douyin.com",
    port: "",
    pathname: "/",
    search: "",
    hash: "",
    origin: "https://www.douyin.com",
    ancestorOrigins: {},
    reload: function(){},
    replace: function(){},
    assign: function(){},
};
global.window.__ac_referer = "";

// Document
global.document = {
    cookie: "",
    referrer: "",
    title: "抖音",
    URL: "https://www.douyin.com/",
    documentElement: {
        style: {},
        clientWidth: 1920,
        clientHeight: 1080,
        scrollWidth: 1920,
        scrollHeight: 1080,
    },
    body: {
        style: {},
        clientWidth: 1920,
        clientHeight: 1080,
        scrollWidth: 1920,
        scrollHeight: 1080,
    },
    head: { appendChild: function(){} },
    createElement: function(tag) {
        var el = {
            tagName: tag,
            style: {},
            src: "",
            href: "",
            setAttribute: function(){},
            getAttribute: function(){ return null; },
            appendChild: function(c){},
            addEventListener: function(){},
            removeEventListener: function(){},
        };
        if (tag === 'canvas') {
            el.getContext = function() {
                return {
                    fillRect: function(){},
                    clearRect: function(){},
                    fillText: function(){},
                    measureText: function(){ return {width: 100}; },
                    getImageData: function(){ return {data: new Uint8ClampedArray(100)}; },
                    drawImage: function(){},
                    createLinearGradient: function(){ return {addColorStop:function(){}}; },
                    save: function(){},
                    restore: function(){},
                    translate: function(){},
                    scale: function(){},
                    rotate: function(){},
                    beginPath: function(){},
                    moveTo: function(){},
                    lineTo: function(){},
                    stroke: function(){},
                };
            };
            el.toDataURL = function() { return "data:image/png;base64,"; };
        }
        return el;
    },
    createEvent: function() {
        return { initEvent: function(){} };
    },
    addEventListener: function(){},
    removeEventListener: function(){},
    querySelector: function(){ return null; },
    querySelectorAll: function(){ return []; },
    getElementById: function(){ return null; },
    getElementsByTagName: function(){ return []; },
    getElementsByClassName: function(){ return []; },
};

// Events and other APIs
global.Event = function(type) { this.type = type; };
global.CustomEvent = function(type, opts) { this.type = type; this.detail = (opts||{}).detail; };
global.MouseEvent = function(){};
global.PointerEvent = function(){};
global.TouchEvent = function(){};

// Performance API
global.performance = {
    now: function() { return Date.now() - startTime; },
    timing: {
        navigationStart: Date.now() - 1000,
        domLoading: Date.now() - 500,
        domComplete: Date.now() - 100,
    },
    getEntriesByType: function() { return []; },
    getEntries: function() { return []; },
};
var startTime = Date.now();

// localStorage / sessionStorage
var storageData = {};
var Storage = function() {
    this.getItem = function(k) { return storageData[k] || null; };
    this.setItem = function(k, v) { storageData[k] = v; };
    this.removeItem = function(k) { delete storageData[k]; };
    this.clear = function() { storageData = {}; };
    this.key = function(i) { return Object.keys(storageData)[i] || null; };
};
Object.defineProperty(Storage.prototype, 'length', { get: function() { return Object.keys(storageData).length; } });
global.localStorage = new Storage();
global.sessionStorage = new Storage();

// IndexedDB mock
global.indexedDB = { open: function() { return { onerror: null, onsuccess: null, result: {} }; } };

// WebSocket (for bdms internal use)
global.WebSocket = function() {};

// setTimeout / setInterval / clearTimeout / clearInterval are native in Node.js

// TextEncoder / TextDecoder (native in Node.js)
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Uint8ClampedArray
global.Uint8ClampedArray = Uint8Array;

// atob / btoa
global.atob = function(s) { return Buffer.from(s, 'base64').toString('binary'); };
global.btoa = function(s) { return Buffer.from(s, 'binary').toString('base64'); };

// URL and URLSearchParams (native in Node.js)
global.URL = URL;
global.URLSearchParams = URLSearchParams;

// ── XMLHttpRequest (capture a_bogus / msToken) ──
var capturedABogus = null;
var capturedMsToken = null;

global.XMLHttpRequest = function() {
    var xhr = this;
    this._method = 'GET';
    this._url = '';
    this._headers = {};
    this.readyState = 0;
    this.status = 0;
    this.responseText = '';
    this.onreadystatechange = null;
    this.onload = null;
    this.onerror = null;

    this.open = function(method, url) {
        xhr._method = method;
        xhr._url = url;

        // Extract a_bogus and msToken from URL if present
        var match;
        match = url.match(/[?&]a_bogus=([^&]+)/);
        if (match) capturedABogus = decodeURIComponent(match[1]);

        match = url.match(/[?&]msToken=([^&]+)/);
        if (match) capturedMsToken = decodeURIComponent(match[1]);
    };

    this.setRequestHeader = function(k, v) {
        xhr._headers[k] = v;
    };

    this.send = function(body) {
        // Simulate async response
        xhr.readyState = 4;
        xhr.status = 200;
        xhr.responseText = JSON.stringify({status_code: 0});

        if (xhr.onreadystatechange) xhr.onreadystatechange();
        if (xhr.onload) xhr.onload();
    };

    this.addEventListener = function(){};
    this.removeEventListener = function(){};
    this.abort = function(){};
    this.getResponseHeader = function(){ return null; };
    this.getAllResponseHeaders = function(){ return ''; };
};

// ── Load bdms.js ──
try {
    require('../assets/bdms.js');
} catch(e) {
    console.error(JSON.stringify({error: 'bdms_load_failed', message: e.message, stack: e.stack}));
    process.exit(1);
}

// ── Trigger a_bogus generation ──
// bdms hooks XHR.send. We need to make an XHR request that bdms will intercept.
// The URL params determine the a_bogus output.
var targetParams = process.argv[2] || "device_platform=webapp&aid=6383&channel=channel_pc_web&keyword=test";

// Build the full URL that bdms expects
var baseUrl = "https://www.douyin.com/aweme/v1/web/general/search/single/";
var fullUrl = baseUrl + "?" + targetParams;

var xhr = new XMLHttpRequest();
xhr.open('GET', fullUrl);
xhr.send(null);

// Output results
if (capturedABogus) {
    console.log(JSON.stringify({
        a_bogus: capturedABogus,
        msToken: capturedMsToken,
        a_bogus_length: capturedABogus.length,
    }));
} else {
    console.error(JSON.stringify({
        error: 'no_capture',
        message: 'bdms did not intercept XHR request',
        hint: 'Check if bdms.js loaded correctly and XHR interception is active'
    }));
}

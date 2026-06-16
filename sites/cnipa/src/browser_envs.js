// 瑞数浏览器环境补全 - ouyeel.com
// 逐轮迭代, 日志驱动: 运行 -> 看[MISS]/报错 -> 补上缺失 -> 重复直到出cookie
// 注意: Proxy 在 main.js 初始化完成后才安装, 避免初始化阶段的误报

/* ====== 基础环境 ====== */
window = globalThis;
window.top = window;
window.self = window;
window.window = window;
window.execScript = function(s) { return eval(s); };
window.name = '';
window.$_ts = {};

/* ====== location ====== */
location = {
    "ancestorOrigins": {},
    "href": "https://www.ouyeel.com/steel/search?pageIndex=0&pageSize=50",
    "origin": "https://www.ouyeel.com",
    "protocol": "https:",
    "host": "www.ouyeel.com",
    "hostname": "www.ouyeel.com",
    "port": "",
    "pathname": "/steel/search",
    "search": "?pageIndex=0&pageSize=50",
    "hash": ""
};

/* ====== DOM 工厂 ====== */
function _makeEl(tag) {
    var el = {};
    el.tagName = (tag || 'div').toUpperCase();
    el.children = [];
    el.childNodes = [];
    el.innerHTML = '';
    el.innerText = '';
    el.outerHTML = '';
    el.style = {};
    el.className = '';
    el.id = '';
    el.parentNode = null;
    el.parentElement = null;
    el.firstChild = null;
    el.lastChild = null;
    el.nextSibling = null;
    el.previousSibling = null;
    el.getAttribute = function() { return null; };
    el.setAttribute = function() {};
    el.removeAttribute = function() {};
    el.hasAttribute = function() { return false; };
    el.appendChild = function(c) {
        this.children.push(c);
        if (c && typeof c === 'object') {
            c.parentNode = this;
            c.parentElement = this;
        }
        return c;
    };
    el.removeChild = function(c) {
        var idx = this.children.indexOf(c);
        if (idx !== -1) this.children.splice(idx, 1);
        if (c && typeof c === 'object') {
            c.parentNode = null;
            c.parentElement = null;
        }
        return c;
    };
    el.insertBefore = function(newEl, refEl) {
        var idx = this.children.indexOf(refEl);
        if (idx !== -1) this.children.splice(idx, 0, newEl);
        else this.children.push(newEl);
        if (newEl && typeof newEl === 'object') {
            newEl.parentNode = this;
            newEl.parentElement = this;
        }
        return newEl;
    };
    el.replaceChild = function(newEl, oldEl) {
        var idx = this.children.indexOf(oldEl);
        if (idx !== -1) this.children[idx] = newEl;
        if (newEl && typeof newEl === 'object') {
            newEl.parentNode = this;
            newEl.parentElement = this;
        }
        if (oldEl && typeof oldEl === 'object') {
            oldEl.parentNode = null;
            oldEl.parentElement = null;
        }
        return oldEl;
    };
    el.contains = function(other) { return this.children.indexOf(other) !== -1; };
    el.addEventListener = function() {};
    el.removeEventListener = function() {};
    el.getElementsByTagName = function(t) { return []; };
    el.getElementsByClassName = function() { return []; };
    el.querySelector = function() { return null; };
    el.querySelectorAll = function() { return []; };
    el.hasChildNodes = function() { return this.children.length > 0; };
    el.cloneNode = function() { return _makeEl(tag); };
    el.dispatchEvent = function() { return true; };
    el.focus = function() {};
    el.blur = function() {};
    el.click = function() {};
    el.scrollIntoView = function() {};
    return el;
}

/* ====== 瑞数专用 meta 元素 (页面HTML中的 <meta content="..." r="m">) ====== */
function _makeMetaEl() {
    var el = _makeEl('meta');
    el.r = 'm';
    el.content = '8s9g2E6TCM0s4znvX0L5Fe5dIPcUBVj9oVajJhEFGNj.lCmddD39hxOuR7rMZSiehdzC3NFvHWvbMSR2B33_bjhV6.fpO_7a_12M5tEy.1L';
    el.getAttribute = function(attr) {
        if (attr === 'r') return 'm';
        if (attr === 'content') return this.content;
        return null;
    };
    el.hasAttribute = function(attr) {
        return attr === 'r' || attr === 'content';
    };
    el.setAttribute = function(attr, val) {
        if (attr === 'r') this.r = val;
        else if (attr === 'content') this.content = val;
    };
    el.outerHTML = '<meta content="' + el.content + '" r="m">';
    el.innerHTML = '';
    el.tagName = 'META';
    return el;
}

/* ====== document ====== */
var _metaEl = _makeMetaEl();
document = {
    createElement: function(tag) { return _makeEl(tag); },
    createElementNS: function(ns, tag) { return _makeEl(tag); },
    appendChild: function(c) { return c; },
    removeChild: function(c) { return c; },
    addEventListener: function() {},
    removeEventListener: function() {},
    getElementById: function() { return _makeEl('div'); },
    getElementsByTagName: function(tag) {
        if (tag && tag.toLowerCase() === 'meta') return [_metaEl];
        if (tag && tag.toLowerCase() === 'script') return [_makeEl('script')];
        return [_makeEl(tag || 'div')];
    },
    getElementsByClassName: function() { return [_makeEl('div')]; },
    querySelector: function(sel) {
        if (sel && (sel.includes('[r=') || sel.includes('meta'))) return _metaEl;
        return _makeEl('div');
    },
    querySelectorAll: function(sel) {
        if (sel && (sel.includes('[r=') || sel.includes('meta'))) return [_metaEl];
        return [_makeEl('div')];
    },
    dispatchEvent: function() { return true; },
    createEvent: function() { return { initEvent: function() {} }; },
    createComment: function() { return {}; },
    createDocumentFragment: function() { return _makeEl('fragment'); },
    head: _makeEl('head'),
    body: _makeEl('body'),
    documentElement: _makeEl('html'),
    charset: 'UTF-8',
    characterSet: 'UTF-8',
    readyState: 'complete',
    referrer: '',
    title: '',
    domain: 'www.ouyeel.com',
    URL: 'https://www.ouyeel.com/steel/search?pageIndex=0&pageSize=50',
    cookie: '',
    visibilityState: 'visible',
    hidden: false,
    __webdriver_evaluate: undefined,
    __webdriver_script_fn: undefined,
    __webdriver_script_func: undefined,
    __webdriver_script_function: undefined,
    webdriver: false,
    $cdc_asdjflasutopfhvcZLmcfl_: undefined
};

// 建立 DOM 树关系 (meta 在 head 中)
document.documentElement.appendChild(document.head);
document.documentElement.appendChild(document.body);
document.head.appendChild(_metaEl);

/* ====== navigator ====== */
navigator = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
    platform: 'Win32',
    language: 'zh-CN',
    languages: ['zh-CN', 'zh'],
    cookieEnabled: true,
    appName: 'Netscape',
    appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
    hardwareConcurrency: 16,
    deviceMemory: 8,
    vendor: 'Google Inc.',
    vendorSub: '',
    productSub: '20030107',
    maxTouchPoints: 0,
    webdriver: false,
    onLine: true,
    doNotTrack: null,
    plugins: { length: 0, refresh: function() {} },
    mimeTypes: { length: 0 },
    getBattery: function() { return Promise.resolve({ charging: true, level: 1 }); },
    getGamepads: function() { return []; },
    geolocation: undefined,
    mediaDevices: undefined,
    permissions: undefined,
    serviceWorker: undefined,
    storage: undefined,
    usb: undefined,
    xr: undefined
};

/* ====== screen ====== */
screen = {
    width: 1920,
    height: 1080,
    availWidth: 1920,
    availHeight: 1040,
    colorDepth: 24,
    pixelDepth: 24,
    availLeft: 0,
    availTop: 0,
    orientation: { type: 'landscape-primary', angle: 0 }
};

/* ====== 特征检测 API ====== */
window.addEventListener = function() {};
window.removeEventListener = function() {};
window.dispatchEvent = function() { return true; };
window.attachEvent = function() {};
window.detachEvent = function() {};
window.showModalDialog = undefined;
window.globalStorage = undefined;
window.localStorage = { getItem: function() { return null; }, setItem: function() {}, removeItem: function() {}, clear: function() {}, length: 0, key: function() { return null; } };
window.sessionStorage = { getItem: function() { return null; }, setItem: function() {}, removeItem: function() {}, clear: function() {}, length: 0, key: function() { return null; } };
window.indexedDB = undefined;
window.mozIndexedDB = undefined;
window.webkitIndexedDB = undefined;
window.msIndexedDB = undefined;
window.CollectGarbage = function() {};
window.ActiveXObject = undefined;
window.msCrypto = undefined;

/* ====== DOMParser / XML  ====== */
DOMParser = window.DOMParser = function() {
    this.parseFromString = function(str, type) {
        return _makeEl(type === 'text/html' ? 'html' : 'div');
    };
};

/* ====== XMLHttpRequest (proper prototype for RS6 hooking) ====== */
window.XMLHttpRequest = function() {
    this.readyState = 0;
    this.status = 0;
    this.statusText = '';
    this.responseText = '';
    this.response = null;
    this.responseXML = null;
    this.responseType = '';
    this.responseURL = '';
    this.timeout = 0;
    this.withCredentials = false;
    this.upload = {};
    this.onreadystatechange = null;
    this.onload = null;
    this.onerror = null;
    this.onabort = null;
    this.onloadend = null;
    this.onloadstart = null;
    this.onprogress = null;
    this.ontimeout = null;
    this._method = '';
    this._url = '';
    this._async = true;
    this._headers = {};
    this._events = {};
};
window.XMLHttpRequest.prototype = {
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2,
    LOADING: 3,
    DONE: 4,
    open: function(method, url, async, user, password) {
        this._method = method;
        this._url = url;
        this._async = async !== false;
        this.readyState = 1;
    },
    send: function(body) {
        this.readyState = 4;
        this.status = 200;
    },
    setRequestHeader: function(name, value) {
        this._headers[name] = value;
    },
    getResponseHeader: function(name) { return null; },
    getAllResponseHeaders: function() { return ''; },
    abort: function() {},
    addEventListener: function(type, fn, opts) {
        this._events[type] = fn;
    },
    removeEventListener: function(type, fn) {},
    dispatchEvent: function(e) { return true; }
};
window.XMLHttpRequest.UNSENT = 0;
window.XMLHttpRequest.OPENED = 1;
window.XMLHttpRequest.HEADERS_RECEIVED = 2;
window.XMLHttpRequest.LOADING = 3;
window.XMLHttpRequest.DONE = 4;

/* ====== 定时器 ====== */
window.setTimeout = setTimeout;
window.setInterval = setInterval;
window.clearTimeout = clearTimeout;
window.clearInterval = clearInterval;

/* ====== crypto ====== */
if (!globalThis.crypto) {
    globalThis.crypto = {
        getRandomValues: function(arr) {
            for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
            return arr;
        },
        subtle: undefined,
        randomUUID: function() { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); }); }
    };
}

/* ====== Date ====== */
var _origDate = Date;
var _origDateNow = Date.now;
var _origDateParse = Date.parse;
var _origDateUTC = Date.UTC;

/* ====== canvas / webgl ====== */
window.HTMLCanvasElement = undefined;
window.WebGLRenderingContext = undefined;

/* ====== performance ====== */
window.performance = {
    timing: {
        navigationStart: Date.now() - 1000,
        unloadEventStart: 0,
        unloadEventEnd: 0,
        redirectStart: 0,
        redirectEnd: 0,
        fetchStart: Date.now() - 800,
        domainLookupStart: Date.now() - 700,
        domainLookupEnd: Date.now() - 600,
        connectStart: Date.now() - 500,
        connectEnd: Date.now() - 400,
        requestStart: Date.now() - 300,
        responseStart: Date.now() - 200,
        responseEnd: Date.now() - 100,
        domLoading: Date.now() - 50,
        domInteractive: Date.now() - 20,
        domContentLoadedEventStart: Date.now() - 10,
        domContentLoadedEventEnd: Date.now(),
        domComplete: Date.now(),
        loadEventStart: Date.now(),
        loadEventEnd: Date.now()
    },
    navigation: { type: 0, redirectCount: 0 },
    memory: { jsHeapSizeLimit: 4294967296, totalJSHeapSize: 10000000, usedJSHeapSize: 8000000 },
    now: function() { return Date.now() - _origDateNow.call(_origDate); },
    getEntries: function() { return []; },
    getEntriesByType: function() { return []; },
    getEntriesByName: function() { return []; },
    mark: function() {},
    measure: function() {},
    clearMarks: function() {},
    clearMeasures: function() {},
    clearResourceTimings: function() {}
};

/* ====== history ====== */
window.history = {
    length: 1,
    state: null,
    back: function() {},
    forward: function() {},
    go: function() {},
    pushState: function() {},
    replaceState: function() {},
    scrollRestoration: 'auto'
};

/* ====== document 补充 ====== */
document.all = 0;
document.scripts = [_makeEl('script')];
document.currentScript = _makeEl('script');
document.styleSheets = { length: 0 };
document.implementation = {
    createHTMLDocument: function() { return { body: _makeEl('body'), head: _makeEl('head') }; },
    hasFeature: function() { return true; },
    createDocumentType: function() { return {}; }
};

/* ====== navigator 补充 ====== */
navigator.plugins = { length: 0, refresh: function() {} };
navigator.mimeTypes = { length: 0 };
navigator.javaEnabled = function() { return false; };
navigator.taintEnabled = function() { return false; };
navigator.product = 'Gecko';
navigator.appCodeName = 'Mozilla';
navigator.buildID = '20181001000000';
navigator.oscpu = 'Windows NT 10.0; Win64; x64';

/* ====== window 补充 ====== */
window.outerWidth = 1920;
window.outerHeight = 1040;
window.innerWidth = 1920;
window.innerHeight = 1080;
window.pageXOffset = 0;
window.pageYOffset = 0;
window.screenX = 0;
window.screenY = 0;
window.screenLeft = 0;
window.screenTop = 0;
window.scrollX = 0;
window.scrollY = 0;
window.devicePixelRatio = 1;
window.chrome = { loadTimes: function() {}, csi: function() {} };
window.clientInformation = navigator;
window.offscreenBuffering = true;
window.sidebar = undefined;
window.external = undefined;
window.frameElement = undefined;
window.length = 0;
window.frames = window;
window.parent = window;

/* ====== atob / btoa ====== */
if (!globalThis.atob) globalThis.atob = function(s) { return Buffer.from(s, 'base64').toString('binary'); };
if (!globalThis.btoa) globalThis.btoa = function(s) { return Buffer.from(s, 'binary').toString('base64'); };

/* ====== fetch ====== */
window.fetch = undefined;

/* ====== console ====== */
if (!globalThis.console) {
    globalThis.console = {
        log: function() {},
        warn: function() {},
        error: function() {},
        info: function() {},
        debug: function() {},
        trace: function() {}
    };
}

/* ====== 代理监听函数 (在 main.js 中调用) ====== */
globalThis.install_proxy = function(proxy_array) {
    for (let i = 0; i < proxy_array.length; i++) {
        var name = proxy_array[i];
        var handler = {
            get: function(target, property, receiver) {
                var val = target[property];
                if (val === undefined && typeof property !== 'symbol') {
                    console.log('[MISS] ' + name + '.' + String(property));
                }
                return val;
            },
            set: function(target, property, value, receiver) {
                if (name === 'document' && property === 'cookie') {
                    console.log('[COOKIE_SET]', value);
                }
                return Reflect.set(target, property, value, receiver);
            }
        };
        try {
            var obj = eval(name);
            eval(name + ' = new Proxy(obj, handler)');
        } catch (e) {
            console.log('[PROXY_ERR]', name, e.message);
        }
    }
}

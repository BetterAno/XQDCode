// 浏览器环境模拟文件
// 为 h5st_JS.js 提供必要的浏览器 API

var crypto = require('crypto');
var CryptoJS = require('crypto-js');

// ============================================================================
// 基础全局对象
// ============================================================================
var window = globalThis;
var self = globalThis;
var global = globalThis;

// ============================================================================
// localStorage 模拟
// ============================================================================
var localStorageData = {};
var localStorage = {
    getItem: function(key) {
        return localStorageData[key] || null;
    },
    setItem: function(key, value) {
        localStorageData[key] = String(value);
    },
    removeItem: function(key) {
        delete localStorageData[key];
    },
    clear: function() {
        localStorageData = {};
    },
    get length() {
        return Object.keys(localStorageData).length;
    },
    key: function(index) {
        return Object.keys(localStorageData)[index] || null;
    }
};
Object.defineProperty(localStorage, 'length', {
    get: function() { return Object.keys(localStorageData).length; },
    enumerable: false
});

// ============================================================================
// sessionStorage 模拟
// ============================================================================
var sessionStorageData = {};
var sessionStorage = {
    getItem: function(key) {
        return sessionStorageData[key] || null;
    },
    setItem: function(key, value) {
        sessionStorageData[key] = String(value);
    },
    removeItem: function(key) {
        delete sessionStorageData[key];
    },
    clear: function() {
        sessionStorageData = {};
    },
    get length() {
        return Object.keys(sessionStorageData).length;
    },
    key: function(index) {
        return Object.keys(sessionStorageData)[index] || null;
    }
};
Object.defineProperty(sessionStorage, 'length', {
    get: function() { return Object.keys(sessionStorageData).length; },
    enumerable: false
});

// ============================================================================
// cookie 模拟
// ============================================================================
var _cookieStore = '';
var document = {
    cookie: {
        get: function() { return _cookieStore; },
        set: function(val) { _cookieStore = val; }
    },
    referrer: '',
    title: '',
    domain: '',
    URL: 'https://www.jd.com/',
    documentURI: 'https://www.jd.com/',
    baseURI: 'https://www.jd.com/',
    readyState: 'complete',
    hidden: false,
    visibilityState: 'visible',
    charset: 'utf-8',
    contentType: 'text/html',
    doctype: null,
    documentElement: {},
    body: {},
    head: {},
    images: [],
    scripts: [],
    links: [],
    forms: [],
    getElementsByTagName: function() { return []; },
    getElementById: function() { return null; },
    querySelector: function() { return null; },
    querySelectorAll: function() { return []; },
    createElement: function(tagName) {
        return {
            tagName: tagName ? tagName.toUpperCase() : '',
            style: {},
            children: [],
            appendChild: function() {},
            removeChild: function() {},
            setAttribute: function() {},
            getAttribute: function() { return ''; },
            addEventListener: function() {},
            removeEventListener: function() {},
            classList: {
                add: function() {},
                remove: function() {},
                toggle: function() {},
                contains: function() { return false; }
            }
        };
    },
    createElementNS: function() { return this.createElement(); },
    createTextNode: function() { return {}; },
    createEvent: function() { return {}; },
    createDocumentFragment: function() { return { appendChild: function() {} }; },
    getComputedStyle: function() { return {}; },
    addEventListener: function() {},
    removeEventListener: function() {},
    hasFocus: function() { return true; },
    write: function() {},
    writeln: function() {},
    open: function() { return this; },
    close: function() {}
};

// 设置 document.cookie 的 get/set
Object.defineProperty(document, 'cookie', {
    get: function() { return _cookieStore; },
    set: function(val) { _cookieStore = val; },
    enumerable: true,
    configurable: true
});

// ============================================================================
// location 对象
// ============================================================================
var location = {
    href: 'https://www.jd.com/',
    protocol: 'https:',
    host: 'www.jd.com',
    hostname: 'www.jd.com',
    port: '',
    pathname: '/',
    search: '',
    hash: '',
    origin: 'https://www.jd.com',
    assign: function() {},
    replace: function() {},
    reload: function() {}
};

// ============================================================================
// navigator 对象
// ============================================================================
var navigator = {
    appCodeName: 'Mozilla',
    appName: 'Netscape',
    appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    platform: 'Win32',
    product: 'Gecko',
    productSub: '20030107',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    vendor: 'Google Inc.',
    vendorSub: '',
    language: 'zh-CN',
    languages: ['zh-CN', 'zh', 'en-US', 'en'],
    onLine: true,
    hardwareConcurrency: 8,
    maxTouchPoints: 0,
    cookieEnabled: true,
    doNotTrack: null,
    webdriver: false,
    geolocation: {
        getCurrentPosition: function(success) { success({ coords: { latitude: 0, longitude: 0, altitude: 0, accuracy: 0, altitudeAccuracy: 0, heading: 0, speed: 0 }, timestamp: Date.now() }); },
        watchPosition: function() { return 0; },
        clearWatch: function() {}
    },
    mediaDevices: {
        enumerateDevices: function() { return Promise.resolve([]); }
    },
    sendBeacon: function() { return true; },
    serviceWorker: {
        register: function() { return Promise.resolve({}); }
    },
    share: function() { return Promise.resolve(); },
    vibrate: function() { return false; },
    getGamepads: function() { return Array(4).fill(null); },
    getUserMedia: function() { return Promise.resolve({}); },
   webkitGetUserMedia: function() { return Promise.resolve({}); },
    mozGetUserMedia: function() { return Promise.resolve({}); },
    msGetUserMedia: function() { return Promise.resolve({}); }
};

// ============================================================================
// screen 对象
// ============================================================================
var screen = {
    availTop: 0,
    availLeft: 0,
    availWidth: 2560,
    availHeight: 1440,
    width: 2560,
    height: 1440,
    colorDepth: 24,
    pixelDepth: 24,
    orientation: {
        angle: 0,
        type: 'landscape-primary',
        onchange: null
    },
    availHeight: 1400,
    availWidth: 2560,
    bufferDepth: 0,
    deviceXDPI: 96,
    deviceYDPI: 96,
    fontSmoothingEnabled: true,
    updateInterval: 0,
    left: 0,
    top: 0
};

// ============================================================================
// history 对象
// ============================================================================
var history = {
    length: 1,
    state: null,
    scrollRestoration: 'auto',
    back: function() {},
    forward: function() {},
    go: function() {},
    pushState: function() {},
    replaceState: function() {}
};

// ============================================================================
// performance 对象
// ============================================================================
var _performanceTimingStart = Date.now();
var performance = {
    navigation: {
        TYPE_NAVIGATE: 0,
        TYPE_RELOAD: 1,
        TYPE_BACK_FORWARD: 2,
        TYPE_RESERVED: 255,
        redirectCount: 0,
        type: 0
    },
    timing: {
        navigationStart: _performanceTimingStart,
        unloadEventStart: 0,
        unloadEventEnd: 0,
        redirectStart: 0,
        redirectEnd: 0,
        fetchStart: 0,
        domainLookupStart: 0,
        domainLookupEnd: 0,
        connectStart: 0,
        connectEnd: 0,
        secureConnectionStart: 0,
        requestStart: 0,
        responseStart: 0,
        responseEnd: 0,
        domLoading: 0,
        domInteractive: 0,
        domContentLoadedEventStart: 0,
        domContentLoadedEventEnd: 0,
        domComplete: 0,
        loadEventStart: 0,
        loadEventEnd: 0
    },
    memory: {
        jsHeapSizeLimit: 0,
        totalJSHeapSize: 0,
        usedJSHeapSize: 0
    },
    timeOrigin: _performanceTimingStart,
    now: function() {
        return Date.now() - _performanceTimingStart;
    },
    mark: function() {},
    measure: function() {},
    clearMarks: function() {},
    clearMeasures: function() {},
    getEntries: function() { return []; },
    getEntriesByName: function() { return []; },
    getEntriesByType: function() { return []; },
    toJSON: function() { return {}; }
};

// ============================================================================
// crypto 对象
// ============================================================================
var crypto = {
    getRandomValues: function(array) {
        if (array instanceof Uint8Array) {
            require('crypto').randomFillSync(array);
        } else {
            for (var i = 0; i < array.length; i++) {
                array[i] = Math.floor(Math.random() * 256);
            }
        }
        return array;
    },
    randomUUID: function() {
        return require('crypto').randomUUID();
    },
    subtle: {
        digest: function(algorithm, data) {
            return new Promise(function(resolve, reject) {
                var hash;
                if (typeof algorithm === 'string') {
                    algorithm = { name: algorithm };
                }
                var algoName = algorithm.name.toUpperCase();
                if (algoName === 'SHA-1') {
                    hash = 'sha1';
                } else if (algoName === 'SHA-256') {
                    hash = 'sha256';
                } else if (algoName === 'SHA-384') {
                    hash = 'sha384';
                } else if (algoName === 'SHA-512') {
                    hash = 'sha512';
                } else {
                    reject(new Error('Unsupported algorithm'));
                    return;
                }
                var buffer = Buffer.from(data);
                var digest = require('crypto').createHash(hash).update(buffer).digest();
                resolve(digest);
            });
        },
        generateKey: function() {
            return Promise.resolve({});
        },
        encrypt: function() {
            return Promise.resolve(new Uint8Array([]));
        },
        decrypt: function() {
            return Promise.resolve(new Uint8Array([]));
        }
    }
};

// ============================================================================
// alert/confirm/prompt 模拟
// ============================================================================
var alert = function() {};
var confirm = function() { return true; };
var prompt = function() { return ''; };

// ============================================================================
// setTimeout/setInterval 模拟
// ============================================================================
var setTimeout = global.setTimeout || function(func, delay) {
    return global.setTimeout(func, delay);
};
var setInterval = global.setInterval || function(func, delay) {
    return global.setInterval(func, delay);
};
var clearTimeout = global.clearTimeout || function() {};
var clearInterval = global.clearInterval || function() {};

// ============================================================================
// fetch 模拟 (基础版本)
// ============================================================================
var fetch = function(url, options) {
    return Promise.reject(new Error('fetch not implemented in Node.js environment'));
};

// ============================================================================
// XMLHttpRequest 模拟
// ============================================================================
var XMLHttpRequest = function() {
    this.readyState = 0;
    this.status = 0;
    this.statusText = '';
    this.responseText = '';
    this.response = '';
    this.responseURL = '';
    this.responseType = '';
    this.timeout = 0;
    this.withCredentials = false;
    this.onreadystatechange = null;
    this.onload = null;
    this.onerror = null;
    this.onprogress = null;
    this.onloadstart = null;
    this.onloadend = null;
    this.upload = {
        onloadstart: null,
        onprogress: null,
        onload: null,
        onabort: null,
        onerror: null,
        onloadend: null
    };
    this._headers = {};
    this._method = 'GET';
    this._url = '';
    this._async = true;
    this._body = null;
};
XMLHttpRequest.prototype = {
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2,
    LOADING: 3,
    DONE: 4,
    open: function(method, url, async) {
        this._method = method;
        this._url = url;
        this._async = async !== false;
        this.readyState = 1;
        if (this.onreadystatechange) {
            this.onreadystatechange();
        }
    },
    setRequestHeader: function(name, value) {
        this._headers[name] = value;
    },
    send: function(data) {
        this._body = data;
        this.readyState = 4;
        this.status = 200;
        this.statusText = 'OK';
        this.responseText = '{}';
        this.response = '{}';
        if (this.onreadystatechange) {
            this.onreadystatechange();
        }
        if (this.onload) {
            this.onload();
        }
    },
    abort: function() {
        this.readyState = 0;
    },
    getResponseHeader: function(name) {
        return this._headers[name] || null;
    },
    getAllResponseHeaders: function() {
        var result = [];
        for (var key in this._headers) {
            result.push(key + ': ' + this._headers[key]);
        }
        return result.join('\r\n');
    },
    overrideMimeType: function() {},
    addEventListener: function(type, listener) {
        var eventMap = {
            'readystatechange': 'onreadystatechange',
            'load': 'onload',
            'error': 'onerror',
            'progress': 'onprogress',
            'loadstart': 'onloadstart',
            'loadend': 'onloadend',
            'abort': 'onabort',
            'timeout': 'ontimeout'
        };
        var prop = eventMap[type];
        if (prop) {
            this[prop] = listener;
        }
    },
    removeEventListener: function() {}
};

// ============================================================================
// WebSocket 模拟
// ============================================================================
var WebSocket = function(url, protocols) {
    this.url = url;
    this.protocol = protocols || '';
    this.readyState = 3; // CLOSED
    this.bufferedAmount = 0;
    this.extensions = '';
    this.binaryType = 'blob';
    this.onopen = null;
    this.onclose = null;
    this.onmessage = null;
    this.onerror = null;
};
WebSocket.prototype = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
    close: function() {},
    send: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() { return true; }
};

// ============================================================================
// EventTarget/Node/Document 基础实现
// ============================================================================
function EventTarget() {}
EventTarget.prototype = {
    addEventListener: function(type, listener, options) {
        if (!this._listeners) this._listeners = {};
        if (!this._listeners[type]) this._listeners[type] = [];
        this._listeners[type].push(listener);
    },
    removeEventListener: function(type, listener) {
        if (!this._listeners || !this._listeners[type]) return;
        var listeners = this._listeners[type];
        for (var i = listeners.length - 1; i >= 0; i--) {
            if (listeners[i] === listener) {
                listeners.splice(i, 1);
            }
        }
    },
    dispatchEvent: function(event) {
        event.target = this;
        event.currentTarget = this;
        if (!this._listeners || !this._listeners[event.type]) return true;
        var listeners = this._listeners[event.type];
        for (var i = 0; i < listeners.length; i++) {
            if (typeof listeners[i] === 'function') {
                listeners[i].call(this, event);
            }
        }
        return true;
    }
};

function Event(type, options) {
    this.type = type;
    this.bubbles = options && options.bubbles ? true : false;
    this.cancelable = options && options.cancelable ? true : false;
    this.cancelBubble = false;
    this.returnValue = true;
    this.defaultPrevented = false;
    this.propagationStopped = false;
    this.isTrusted = false;
    this.target = null;
    this.currentTarget = null;
    this.timeStamp = Date.now();
}
Event.prototype = {
    preventDefault: function() {
        this.defaultPrevented = true;
    },
    stopPropagation: function() {
        this.propagationStopped = true;
    },
    stopImmediatePropagation: function() {
        this.propagationStopped = true;
    }
};

function CustomEvent(type, options) {
    Event.call(this, type, options);
    this.detail = options && options.detail ? options.detail : null;
}
CustomEvent.prototype = Object.create(Event.prototype);
CustomEvent.prototype.constructor = CustomEvent;

function UIEvent(type, options) {
    Event.call(this, type, options);
    this.view = options && options.view ? options.view : null;
    this.detail = options && options.detail ? options.detail : 0;
    this.which = options && options.which ? options.which : 0;
}
UIEvent.prototype = Object.create(Event.prototype);
UIEvent.prototype.constructor = UIEvent;

function MouseEvent(type, options) {
    UIEvent.call(this, type, options);
    this.screenX = options && options.screenX ? options.screenX : 0;
    this.screenY = options && options.screenY ? options.screenY : 0;
    this.clientX = options && options.clientX ? options.clientX : 0;
    this.clientY = options && options.clientY ? options.clientY : 0;
    this.ctrlKey = options && options.ctrlKey ? options.ctrlKey : false;
    this.altKey = options && options.altKey ? options.altKey : false;
    this.shiftKey = options && options.shiftKey ? options.shiftKey : false;
    this.metaKey = options && options.metaKey ? options.metaKey : false;
    this.button = options && options.button ? options.button : 0;
    this.buttons = options && options.buttons ? options.buttons : 0;
    this.relatedTarget = options && options.relatedTarget ? options.relatedTarget : null;
}
MouseEvent.prototype = Object.create(UIEvent.prototype);
MouseEvent.prototype.constructor = MouseEvent;

function KeyboardEvent(type, options) {
    UIEvent.call(this, type, options);
    this.key = options && options.key ? options.key : '';
    this.code = options && options.code ? options.code : '';
    this.ctrlKey = options && options.ctrlKey ? options.ctrlKey : false;
    this.altKey = options && options.altKey ? options.altKey : false;
    this.shiftKey = options && options.shiftKey ? options.shiftKey : false;
    this.metaKey = options && options.metaKey ? options.metaKey : false;
    this.repeat = options && options.repeat ? options.repeat : false;
}
KeyboardEvent.prototype = Object.create(UIEvent.prototype);
KeyboardEvent.prototype.constructor = KeyboardEvent;

// ============================================================================
// Element/HTMLElement 基础实现
// ============================================================================
function Element() {}
Element.prototype = Object.create(EventTarget.prototype);
Element.prototype.constructor = Element;
Element.prototype.getAttribute = function(name) { return this._attributes && this._attributes[name] || null; };
Element.prototype.setAttribute = function(name, value) {
    if (!this._attributes) this._attributes = {};
    this._attributes[name] = value;
};
Element.prototype.removeAttribute = function(name) {
    if (this._attributes) delete this._attributes[name];
};
Element.prototype.hasAttribute = function(name) {
    return this._attributes && !!this._attributes[name];
};
Element.prototype.appendChild = function(child) { return child; };
Element.prototype.removeChild = function(child) { return child; };
Element.prototype.insertBefore = function(newNode, refNode) { return newNode; };
Element.prototype.replaceChild = function(newChild, oldChild) { return oldChild; };
Element.prototype.contains = function(node) { return false; };
Element.prototype.querySelector = function() { return null; };
Element.prototype.querySelectorAll = function() { return []; };
Element.prototype.getElementsByClassName = function() { return []; };
Element.prototype.getElementsByTagName = function() { return []; };
Element.prototype.addEventListener = function() {};
Element.prototype.removeEventListener = function() {};
Object.defineProperty(Element.prototype, 'tagName', { get: function() { return this._tagName || ''; } });
Object.defineProperty(Element.prototype, 'className', { get: function() { return this._className || ''; }, set: function(v) { this._className = v; } });
Object.defineProperty(Element.prototype, 'id', { get: function() { return this._id || ''; }, set: function(v) { this._id = v; } });
Object.defineProperty(Element.prototype, 'innerHTML', { get: function() { return this._innerHTML || ''; }, set: function(v) { this._innerHTML = v; } });
Object.defineProperty(Element.prototype, 'textContent', { get: function() { return this._textContent || ''; }, set: function(v) { this._textContent = v; } });
Object.defineProperty(Element.prototype, 'style', { get: function() { return this._style || {}; } });

function HTMLElement() {
    Element.call(this);
    this.offsetParent = null;
    this.offsetTop = 0;
    this.offsetLeft = 0;
    this.offsetWidth = 0;
    this.offsetHeight = 0;
    this.clientTop = 0;
    this.clientLeft = 0;
    this.clientWidth = 0;
    this.clientHeight = 0;
    this.classList = {
        add: function() {},
        remove: function() {},
        toggle: function() {},
        contains: function() { return false; }
    };
}
HTMLElement.prototype = Object.create(Element.prototype);
HTMLElement.prototype.constructor = HTMLElement;
Object.defineProperty(HTMLElement.prototype, 'className', { get: function() { return this._className || ''; }, set: function(v) { this._className = v; } });
Object.defineProperty(HTMLElement.prototype, 'hidden', { get: function() { return !!this._hidden; }, set: function(v) { this._hidden = !!v; } });
Object.defineProperty(HTMLElement.prototype, 'title', { get: function() { return this._title || ''; }, set: function(v) { this._title = v; } });
Object.defineProperty(HTMLElement.prototype, 'lang', { get: function() { return this._lang || ''; }, set: function(v) { this._lang = v; } });
Object.defineProperty(HTMLElement.prototype, 'dir', { get: function() { return this._dir || 'ltr'; }, set: function(v) { this._dir = v; } });

// HTMLDocument 和 HTMLBodyElement
function HTMLHtmlElement() { HTMLElement.call(this); this._tagName = 'HTML'; }
HTMLHtmlElement.prototype = Object.create(HTMLElement.prototype);
HTMLHtmlElement.prototype.constructor = HTMLHtmlElement;

function HTMLBodyElement() { HTMLElement.call(this); this._tagName = 'BODY'; }
HTMLBodyElement.prototype = Object.create(HTMLElement.prototype);
HTMLBodyElement.prototype.constructor = HTMLBodyElement;

function HTMLHeadElement() { HTMLElement.call(this); this._tagName = 'HEAD'; }
HTMLHeadElement.prototype = Object.create(HTMLElement.prototype);
HTMLHeadElement.prototype.constructor = HTMLHeadElement;

function HTMLDivElement() { HTMLElement.call(this); this._tagName = 'DIV'; }
HTMLDivElement.prototype = Object.create(HTMLElement.prototype);
HTMLDivElement.prototype.constructor = HTMLDivElement;

function HTMLSpanElement() { HTMLElement.call(this); this._tagName = 'SPAN'; }
HTMLSpanElement.prototype = Object.create(HTMLElement.prototype);
HTMLSpanElement.prototype.constructor = HTMLSpanElement;

function HTMLAnchorElement() { HTMLElement.call(this); this._tagName = 'A'; }
HTMLAnchorElement.prototype = Object.create(HTMLElement.prototype);
HTMLAnchorElement.prototype.constructor = HTMLAnchorElement;
Object.defineProperty(HTMLAnchorElement.prototype, 'href', { get: function() { return this._href || ''; }, set: function(v) { this._href = v; } });

function HTMLScriptElement() { HTMLElement.call(this); this._tagName = 'SCRIPT'; }
HTMLScriptElement.prototype = Object.create(HTMLElement.prototype);
HTMLScriptElement.prototype.constructor = HTMLScriptElement;
Object.defineProperty(HTMLScriptElement.prototype, 'src', { get: function() { return this._src || ''; }, set: function(v) { this._src = v; } });
Object.defineProperty(HTMLScriptElement.prototype, 'type', { get: function() { return this._type || ''; }, set: function(v) { this._type = v; } });
Object.defineProperty(HTMLScriptElement.prototype, 'text', { get: function() { return this._text || ''; }, set: function(v) { this._text = v; } });

function HTMLStyleElement() { HTMLElement.call(this); this._tagName = 'STYLE'; }
HTMLStyleElement.prototype = Object.create(HTMLElement.prototype);
HTMLStyleElement.prototype.constructor = HTMLStyleElement;

function HTMLLinkElement() { HTMLElement.call(this); this._tagName = 'LINK'; }
HTMLLinkElement.prototype = Object.create(HTMLElement.prototype);
HTMLLinkElement.prototype.constructor = HTMLLinkElement;

function HTMLMetaElement() { HTMLElement.call(this); this._tagName = 'META'; }
HTMLMetaElement.prototype = Object.create(HTMLElement.prototype);
HTMLMetaElement.prototype.constructor = HTMLMetaElement;

function HTMLTitleElement() { HTMLElement.call(this); this._tagName = 'TITLE'; }
HTMLTitleElement.prototype = Object.create(HTMLElement.prototype);
HTMLTitleElement.prototype.constructor = HTMLTitleElement;

function HTMLImageElement() { HTMLElement.call(this); this._tagName = 'IMG'; }
HTMLImageElement.prototype = Object.create(HTMLElement.prototype);
HTMLImageElement.prototype.constructor = HTMLImageElement;
Object.defineProperty(HTMLImageElement.prototype, 'src', { get: function() { return this._src || ''; }, set: function(v) { this._src = v; } });
Object.defineProperty(HTMLImageElement.prototype, 'alt', { get: function() { return this._alt || ''; }, set: function(v) { this._alt = v; } });
Object.defineProperty(HTMLImageElement.prototype, 'width', { get: function() { return this._width || 0; }, set: function(v) { this._width = v; } });
Object.defineProperty(HTMLImageElement.prototype, 'height', { get: function() { return this._height || 0; }, set: function(v) { this._height = v; } });

function HTMLInputElement() { HTMLElement.call(this); this._tagName = 'INPUT'; }
HTMLInputElement.prototype = Object.create(HTMLElement.prototype);
HTMLInputElement.prototype.constructor = HTMLInputElement;
Object.defineProperty(HTMLInputElement.prototype, 'value', { get: function() { return this._value || ''; }, set: function(v) { this._value = v; } });
Object.defineProperty(HTMLInputElement.prototype, 'type', { get: function() { return this._type || 'text'; }, set: function(v) { this._type = v; } });
Object.defineProperty(HTMLInputElement.prototype, 'name', { get: function() { return this._name || ''; }, set: function(v) { this._name = v; } });

function HTMLTextAreaElement() { HTMLElement.call(this); this._tagName = 'TEXTAREA'; }
HTMLTextAreaElement.prototype = Object.create(HTMLElement.prototype);
HTMLTextAreaElement.prototype.constructor = HTMLTextAreaElement;
Object.defineProperty(HTMLTextAreaElement.prototype, 'value', { get: function() { return this._value || ''; }, set: function(v) { this._value = v; } });
Object.defineProperty(HTMLTextAreaElement.prototype, 'name', { get: function() { return this._name || ''; }, set: function(v) { this._name = v; } });

function HTMLButtonElement() { HTMLElement.call(this); this._tagName = 'BUTTON'; }
HTMLButtonElement.prototype = Object.create(HTMLElement.prototype);
HTMLButtonElement.prototype.constructor = HTMLButtonElement;

// ============================================================================
// HTMLDocument 实现
// ============================================================================
function HTMLDocument() {
    HTMLElement.call(this);
    this._tagName = 'HTML';
    this.readyState = 'complete';
    this.referrer = '';
    this.domain = 'www.jd.com';
    this.URL = 'https://www.jd.com/';
    this.documentURI = 'https://www.jd.com/';
    this.baseURI = 'https://www.jd.com/';
    this.hidden = false;
    this.visibilityState = 'visible';
    this.charset = 'utf-8';
    this.contentType = 'text/html';
    this.cookie = '';
    this._attributes = {};
    this._listeners = {};
    this.children = [];
    this.childNodes = [];
}
HTMLDocument.prototype = Object.create(HTMLElement.prototype);
HTMLDocument.prototype.constructor = HTMLDocument;

Object.defineProperty(HTMLDocument.prototype, 'cookie', {
    get: function() { return _cookieStore; },
    set: function(v) { _cookieStore = v; }
});

HTMLDocument.prototype.getElementById = function(id) { return null; };
HTMLDocument.prototype.getElementsByClassName = function(className) { return []; };
HTMLDocument.prototype.getElementsByTagName = function(tagName) { return []; };
HTMLDocument.prototype.querySelector = function(selector) { return null; };
HTMLDocument.prototype.querySelectorAll = function(selector) { return []; };
HTMLDocument.prototype.createElement = function(tagName) {
    var tag = (tagName || '').toUpperCase();
    switch (tag) {
        case 'DIV': return new HTMLDivElement();
        case 'SPAN': return new HTMLSpanElement();
        case 'A': return new HTMLAnchorElement();
        case 'SCRIPT': return new HTMLScriptElement();
        case 'STYLE': return new HTMLStyleElement();
        case 'LINK': return new HTMLLinkElement();
        case 'META': return new HTMLMetaElement();
        case 'TITLE': return new HTMLTitleElement();
        case 'IMG': return new HTMLImageElement();
        case 'INPUT': return new HTMLInputElement();
        case 'TEXTAREA': return new HTMLTextAreaElement();
        case 'BUTTON': return new HTMLButtonElement();
        case 'HTML': return new HTMLHtmlElement();
        case 'HEAD': return new HTMLHeadElement();
        case 'BODY': return new HTMLBodyElement();
        default: return new HTMLElement();
    }
};
HTMLDocument.prototype.createElementNS = function(ns, tagName) { return this.createElement(tagName); };
HTMLDocument.prototype.createTextNode = function(text) { return { nodeValue: text }; };
HTMLDocument.prototype.createEvent = function(type) {
    switch (type.toLowerCase()) {
        case 'event': return new Event('');
        case 'customevent': return new CustomEvent('');
        case 'uievent': return new UIEvent('');
        case 'mouseevent': return new MouseEvent('');
        case 'keyboardevent': return new KeyboardEvent('');
        default: return new Event('');
    }
};
HTMLDocument.prototype.createDocumentFragment = function() {
    return {
        children: [],
        childNodes: [],
        appendChild: function() {},
        removeChild: function() {},
        insertBefore: function() {}
    };
};
HTMLDocument.prototype.getComputedStyle = function(element) { return element && element.style ? element.style : {}; };
HTMLDocument.prototype.hasFocus = function() { return true; };
HTMLDocument.prototype.write = function() {};
HTMLDocument.prototype.writeln = function() {};
HTMLDocument.prototype.open = function() { return this; };
HTMLDocument.prototype.close = function() {};

// 创建 document 实例
var document = new HTMLDocument();
document.cookie = '';

// ============================================================================
// NodeList/HTMLCollection
// ============================================================================
function NodeList() {}
NodeList.prototype = {
    length: 0,
    item: function(index) { return null; },
    forEach: function(callback) {},
    entries: function() { return []; },
    keys: function() { return []; },
    values: function() { return []; }
};
NodeList.prototype[Symbol.iterator] = function() { return []; };

function HTMLCollection() {}
HTMLCollection.prototype = {
    length: 0,
    item: function(index) { return null; },
    namedItem: function(name) { return null; }
};
HTMLCollection.prototype[Symbol.iterator] = function() { return []; };

// ============================================================================
// CSSStyleDeclaration
// ============================================================================
function CSSStyleDeclaration() {}
CSSStyleDeclaration.prototype = {
    cssText: '',
    length: 0,
    parentRule: null,
    getPropertyValue: function(name) { return ''; },
    setProperty: function(name, value) {},
    removeProperty: function(name) {},
    getPropertyPriority: function(name) { return ''; },
    item: function(index) { return ''; }
};

// ============================================================================
// DOMTokenList
// ============================================================================
function DOMTokenList() {
    this._tokens = [];
}
DOMTokenList.prototype = {
    length: 0,
    add: function() {},
    remove: function() {},
    toggle: function() { return false; },
    contains: function() { return false; },
    replace: function() {},
    supports: function() { return false; },
    item: function(index) { return null; },
    forEach: function(callback) {},
    entries: function() { return []; },
    keys: function() { return []; },
    values: function() { return []; }
};
DOMTokenList.prototype[Symbol.iterator] = function() { return this._tokens[Symbol.iterator](); };

// ============================================================================
// URL/URLSearchParams
// ============================================================================
var URL = function(url, base) {
    this._url = url;
    this._base = base;
    this.protocol = '';
    this.host = '';
    this.hostname = '';
    this.port = '';
    this.pathname = '/';
    this.search = '';
    this.hash = '';
    this.username = '';
    this.password = '';
    this.origin = '';
};
URL.prototype = {
    href: {
        get: function() { return this._url; },
        set: function(v) { this._url = v; }
    },
    toString: function() { return this._url; },
    toJSON: function() { return this._url; }
};
URL.createObjectURL = function() { return ''; };
URL.revokeObjectURL = function() {};

var URLSearchParams = function(init) {
    this._params = [];
    this._map = {};
};
URLSearchParams.prototype = {
    append: function(name, value) {},
    delete: function(name) {},
    get: function(name) { return null; },
    getAll: function(name) { return []; },
    has: function(name) { return false; },
    set: function(name, value) {},
    sort: function() {},
    toString: function() { return ''; },
    forEach: function(callback) {},
    keys: function() { return []; },
    values: function() { return []; },
    entries: function() { return []; }
};
URLSearchParams.prototype[Symbol.iterator] = function() { return []; };

// ============================================================================
// MessageChannel/MessagePort
// ============================================================================
function MessageChannel() {
    this.port1 = new MessagePort();
    this.port2 = new MessagePort();
}
MessageChannel.prototype = {};

function MessagePort() {}
MessagePort.prototype = Object.create(EventTarget.prototype);
MessagePort.prototype.constructor = MessagePort;
MessagePort.prototype.postMessage = function() {};
MessagePort.prototype.start = function() {};
MessagePort.prototype.close = function() {};
MessagePort.prototype.addEventListener = EventTarget.prototype.addEventListener;
MessagePort.prototype.removeEventListener = EventTarget.prototype.removeEventListener;
MessagePort.prototype.dispatchEvent = EventTarget.prototype.dispatchEvent;

// ============================================================================
// Storage
// ============================================================================
function Storage() {}
Storage.prototype = {
    getItem: function(key) { return null; },
    setItem: function(key, value) {},
    removeItem: function(key) {},
    clear: function() {},
    key: function(index) { return null; }
};
Object.defineProperty(Storage.prototype, 'length', {
    get: function() { return 0; }
});

// ============================================================================
// MutationObserver
// ============================================================================
var MutationObserver = function(callback) {
    this.callback = callback;
};
MutationObserver.prototype = {
    observe: function(target, options) {},
    disconnect: function() {},
    takeRecords: function() { return []; }
};

// ============================================================================
// 其他 DOM 相关
// ============================================================================
function DOMRect(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.top = this.y;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
    this.left = this.x;
}
DOMRect.prototype = {
    toJSON: function() {
        return { x: this.x, y: this.y, width: this.width, height: this.height, top: this.top, right: this.right, bottom: this.bottom, left: this.left };
    }
};

function DOMRectList() {
    this.length = 0;
    this.item = function() { return null; };
}

// ============================================================================
// 导出到全局
// ============================================================================
globalThis.window = window;
globalThis.self = window;
globalThis.global = globalThis;
globalThis.document = document;
globalThis.localStorage = localStorage;
globalThis.sessionStorage = sessionStorage;
globalThis.location = location;
globalThis.navigator = navigator;
globalThis.screen = screen;
globalThis.history = history;
globalThis.performance = performance;
globalThis.crypto = crypto;
globalThis.alert = alert;
globalThis.confirm = confirm;
globalThis.prompt = prompt;
globalThis.setTimeout = setTimeout;
globalThis.setInterval = setInterval;
globalThis.clearTimeout = clearTimeout;
globalThis.clearInterval = clearInterval;
globalThis.fetch = fetch;
globalThis.XMLHttpRequest = XMLHttpRequest;
globalThis.WebSocket = WebSocket;
globalThis.Event = Event;
globalThis.EventTarget = EventTarget;
globalThis.CustomEvent = CustomEvent;
globalThis.UIEvent = UIEvent;
globalThis.MouseEvent = MouseEvent;
globalThis.KeyboardEvent = KeyboardEvent;
globalThis.Element = Element;
globalThis.HTMLElement = HTMLElement;
globalThis.NodeList = NodeList;
globalThis.HTMLCollection = HTMLCollection;
globalThis.CSSStyleDeclaration = CSSStyleDeclaration;
globalThis.DOMTokenList = DOMTokenList;
globalThis.URL = URL;
globalThis.URLSearchParams = URLSearchParams;
globalThis.MessageChannel = MessageChannel;
globalThis.MessagePort = MessagePort;
globalThis.Storage = Storage;
globalThis.MutationObserver = MutationObserver;
globalThis.DOMRect = DOMRect;
globalThis.DOMRectList = DOMRectList;
globalThis.CryptoJS = CryptoJS;

// 兼容 Symbol
if (typeof Symbol === 'undefined') {
    globalThis.Symbol = function() {};
    globalThis.Symbol.iterator = Symbol('iterator');
}

// 兼容 Proxy
if (typeof Proxy === 'undefined') {
    globalThis.Proxy = Proxy || function() {};
}

// 兼容 JSON
if (typeof JSON === 'undefined') {
    globalThis.JSON = {
        parse: function() { return {}; },
        stringify: function() { return '{}'; }
    };
}

// 兼容 Math
if (typeof Math === 'undefined') {
    globalThis.Math = Math;
}

// 兼容 Intl
if (typeof Intl === 'undefined') {
    globalThis.Intl = {};
}

// 兼容 atob/btoa
if (typeof atob === 'undefined') {
    globalThis.atob = function(str) {
        return Buffer.from(str, 'base64').toString('binary');
    };
}
if (typeof btoa === 'undefined') {
    globalThis.btoa = function(str) {
        return Buffer.from(str, 'binary').toString('base64');
    };
}

// console 兼容
if (typeof console === 'undefined') {
    globalThis.console = {
        log: function() {},
        info: function() {},
        warn: function() {},
        error: function() {},
        debug: function() {},
        trace: function() {},
        dir: function() {},
        time: function() {},
        timeEnd: function() {},
        assert: function() {}
    };
}

// 其他可能需要的
globalThis.Worker = function() {};
globalThis.Blob = function() {};
globalThis.File = function() {};
globalThis.FormData = function() {};
globalThis.FileReader = function() {};
globalThis.ArrayBuffer = ArrayBuffer;
globalThis.Uint8Array = Uint8Array;
globalThis.DataView = DataView;

// ============================================================================
// 导出模块
// ============================================================================
module.exports = {
    window: window,
    document: document,
    localStorage: localStorage,
    sessionStorage: sessionStorage,
    location: location,
    navigator: navigator,
    screen: screen,
    history: history,
    performance: performance,
    crypto: crypto,
    CryptoJS: CryptoJS
};

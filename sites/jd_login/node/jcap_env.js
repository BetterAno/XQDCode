/**
 * jcap 纯 Node.js 补环境
 * 
 * 策略：让整个 jcap_ap0b2a.js UMD 模块在 Node 中跑起来
 * - WASM 内嵌为 base64（位置 547524），不需要外部文件
 * - 44 个 WASM 导入由 Emscripten 运行时 JS 代码提供，无需手动实现
 * - 补齐浏览器环境（document/navigator/XMLHttpRequest 等）
 * - 让 jcap 自己通过 XMLHttpRequest 调用 /cgi-bin/api/fp 和 /cgi-bin/api/check
 * - 我们拦截 XHR 和内部加密参数，输出给 Python 端
 */
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// ======================= 浏览器环境构建 =======================

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// CSS style 对象工厂 (全局)
function makeStyle() {
    const store = {};
    const target = {
        cssText: '',
        length: 0,
        setProperty(k, v) { store[k] = String(v); },
        getPropertyValue(k) { return store[k] || ''; },
        removeProperty(k) { const v = store[k] || ''; delete store[k]; return v; },
        getPropertyPriority() { return ''; },
        item(i) { return Object.keys(store)[i] || ''; },
    };
    return new Proxy(target, {
        get(t, p) {
            if (p in t) return t[p];
            if (typeof p === 'symbol') return undefined;
            return store[p] != null ? store[p] : '';
        },
        set(t, p, v) {
            if (p in t) { t[p] = v; return true; }
            store[p] = String(v);
            return true;
        },
        has(t, p) { return (p in t) || (p in store); },
    });
}

function buildCanvas() {
    // 用于指纹收集 - 返回稳定的虚拟数据
    const ctx = {
        fillStyle: '', strokeStyle: '', lineWidth: 1, font: '10px sans-serif',
        textBaseline: 'top', textAlign: 'start', globalAlpha: 1,
        fillRect: () => {}, strokeRect: () => {}, clearRect: () => {},
        fillText: () => {}, strokeText: () => {},
        beginPath: () => {}, closePath: () => {}, moveTo: () => {}, lineTo: () => {},
        arc: () => {}, rect: () => {}, stroke: () => {}, fill: () => {},
        save: () => {}, restore: () => {}, scale: () => {}, translate: () => {}, rotate: () => {},
        getImageData: (x, y, w, h) => {
            const d = new Uint8ClampedArray(w * h * 4);
            // 填充稳定伪数据
            for (let i = 0; i < d.length; i++) d[i] = (i * 37 + 17) & 0xff;
            return { data: d, width: w, height: h };
        },
        putImageData: () => {}, drawImage: () => {}, createImageData: (w, h) => ({ data: new Uint8ClampedArray((w||1)*(h||1)*4), width: w||1, height: h||1 }),
        measureText: (t) => ({ width: (t ? t.length : 0) * 6 }),
        canvas: null,
    };
    const canvas = {
        width: 300, height: 150,
        style: makeStyle(),
        getContext: (type) => {
            if (type === '2d') { ctx.canvas = canvas; return ctx; }
            if (type === 'webgl' || type === 'experimental-webgl' || type === 'webgl2') {
                return buildWebGL();
            }
            return null;
        },
        toDataURL: () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        toBlob: (cb) => cb(null),
        addEventListener: () => {}, removeEventListener: () => {},
        getBoundingClientRect: () => ({ top: 0, left: 0, right: 300, bottom: 150, width: 300, height: 150, x: 0, y: 0 }),
    };
    return canvas;
}

function buildWebGL() {
    const gl = {
        VENDOR: 0x1F00, RENDERER: 0x1F01, VERSION: 0x1F02, SHADING_LANGUAGE_VERSION: 0x8B8C,
        UNMASKED_VENDOR_WEBGL: 0x9245, UNMASKED_RENDERER_WEBGL: 0x9246,
        MAX_TEXTURE_SIZE: 16384, ALIASED_LINE_WIDTH_RANGE: 33902,
        getParameter: (p) => {
            const table = {
                0x1F00: 'WebKit', 0x1F01: 'WebKit WebGL', 0x1F02: 'WebGL 1.0 (OpenGL ES 2.0 Chromium)',
                0x8B8C: 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)',
                0x9245: 'Google Inc. (Intel)',
                0x9246: 'ANGLE (Intel, Intel(R) UHD Graphics 620 (0x00005917) Direct3D11 vs_5_0 ps_5_0, D3D11)',
                16384: 16384, 33902: new Float32Array([1, 1]),
            };
            return table[p] !== undefined ? table[p] : 0;
        },
        getExtension: (name) => {
            // 按扩展名返回对应的接口，gr 指纹需要 WEBGL_lose_context.loseContext() 、WEBGL_debug_renderer_info.UNMASKED_* 等
            switch (name) {
                case 'WEBGL_lose_context':
                    return { loseContext: () => {}, restoreContext: () => {} };
                case 'WEBGL_debug_renderer_info':
                    return { UNMASKED_VENDOR_WEBGL: 0x9245, UNMASKED_RENDERER_WEBGL: 0x9246 };
                case 'EXT_texture_filter_anisotropic':
                    return { MAX_TEXTURE_MAX_ANISOTROPY_EXT: 0x84FF, TEXTURE_MAX_ANISOTROPY_EXT: 0x84FE };
                default:
                    return {};
            }
        },
        getSupportedExtensions: () => ['ANGLE_instanced_arrays', 'EXT_blend_minmax', 'EXT_color_buffer_half_float', 'EXT_disjoint_timer_query', 'EXT_float_blend', 'EXT_frag_depth', 'EXT_shader_texture_lod', 'EXT_texture_compression_bptc', 'EXT_texture_compression_rgtc', 'EXT_texture_filter_anisotropic', 'EXT_sRGB', 'OES_element_index_uint', 'OES_fbo_render_mipmap', 'OES_standard_derivatives', 'OES_texture_float', 'OES_texture_float_linear', 'OES_texture_half_float', 'OES_texture_half_float_linear', 'OES_vertex_array_object', 'WEBGL_color_buffer_float', 'WEBGL_compressed_texture_s3tc', 'WEBGL_compressed_texture_s3tc_srgb', 'WEBGL_debug_renderer_info', 'WEBGL_debug_shaders', 'WEBGL_depth_texture', 'WEBGL_draw_buffers', 'WEBGL_lose_context', 'WEBGL_multi_draw'],
        createShader: () => ({}), createProgram: () => ({}), createBuffer: () => ({}),
        bindBuffer: () => {}, bufferData: () => {}, shaderSource: () => {}, compileShader: () => {},
        attachShader: () => {}, linkProgram: () => {}, useProgram: () => {},
        getAttribLocation: () => 0, getUniformLocation: () => ({}),
        enableVertexAttribArray: () => {}, vertexAttribPointer: () => {},
        uniform1f: () => {}, uniform2f: () => {}, clearColor: () => {}, clear: () => {},
        drawArrays: () => {}, readPixels: () => {},
        getContextAttributes: () => ({ alpha: true, antialias: true, depth: true, desynchronized: false, failIfMajorPerformanceCaveat: false, powerPreference: 'default', premultipliedAlpha: true, preserveDrawingBuffer: false, stencil: false }),
    };
    return gl;
}

function buildDocument() {
    const nodeProto = {
        appendChild(c) { if (c) { c.parentNode = this; (this.childNodes = this.childNodes || []).push(c); } return c; },
        removeChild(c) { const cn = this.childNodes || []; const i = cn.indexOf(c); if (i >= 0) cn.splice(i, 1); if (c) c.parentNode = null; return c; },
        insertBefore(c, ref) {
            const cn = this.childNodes = this.childNodes || [];
            const i = ref ? cn.indexOf(ref) : -1;
            if (i >= 0) cn.splice(i, 0, c); else cn.push(c);
            if (c) c.parentNode = this;
            return c;
        },
        replaceChild(n, o) { this.removeChild(o); this.appendChild(n); return o; },
        addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
        setAttribute(k, v) { this._attrs = this._attrs || {}; this._attrs[k] = String(v); },
        removeAttribute(k) { if (this._attrs) delete this._attrs[k]; },
        getAttribute(k) { return (this._attrs && this._attrs[k] != null) ? this._attrs[k] : null; },
        hasAttribute(k) { return !!(this._attrs && this._attrs[k] != null); },
        hasAttributes() { return !!(this._attrs && Object.keys(this._attrs).length); },
        getAttributeNode(k) { return this._attrs && this._attrs[k] != null ? { name: k, value: this._attrs[k] } : null; },
        cloneNode(deep) { const e = buildElement(this.tagName || 'div'); return e; },
        querySelector() { return null; }, querySelectorAll() { return []; },
        getElementsByTagName() { return []; }, getElementsByClassName() { return []; },
        contains() { return false; }, compareDocumentPosition() { return 0; },
        focus() {}, blur() {}, click() {}, scrollIntoView() {},
        normalize() {},
        get nextSibling() {
            const p = this.parentNode; if (!p || !p.childNodes) return null;
            const i = p.childNodes.indexOf(this); return i >= 0 && i + 1 < p.childNodes.length ? p.childNodes[i + 1] : null;
        },
        get previousSibling() {
            const p = this.parentNode; if (!p || !p.childNodes) return null;
            const i = p.childNodes.indexOf(this); return i > 0 ? p.childNodes[i - 1] : null;
        },
        get firstChild() { return (this.childNodes && this.childNodes[0]) || null; },
        get lastChild() { return (this.childNodes && this.childNodes[this.childNodes.length - 1]) || null; },
        get firstElementChild() { return (this.children && this.children[0]) || this.firstChild; },
        get lastElementChild() { return (this.children && this.children[this.children.length - 1]) || this.lastChild; },
        get nextElementSibling() { return this.nextSibling; },
        get previousElementSibling() { return this.previousSibling; },
        get ownerDocument() { return _globalDoc; },
        get parentElement() { return this.parentNode && this.parentNode.nodeType === 1 ? this.parentNode : null; },
    };
    let _globalDoc;
    
    function buildElement(tag) {
        tag = String(tag).toLowerCase();
        if (tag === 'canvas') return buildCanvas();
        const el = Object.create(nodeProto);
        el.tagName = tag.toUpperCase();
        el.nodeName = tag.toUpperCase();
        el.nodeType = 1;
        el.childNodes = [];
        el.children = [];
        el.style = makeStyle();
        el.classList = { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} };
        el.id = ''; el.className = '';
        el.innerHTML = ''; el.textContent = ''; el.innerText = '';
        el.value = ''; el.type = '';
        // 对于 script 元素: 模拟 onload
        if (tag === 'script') {
            el.async = false; el.defer = false; el.charset = 'utf-8';
            Object.defineProperty(el, 'src', {
                get() { return this._src || ''; },
                set(v) {
                    this._src = v;
                    // 模拟异步加载成功
                    setTimeout(() => {
                        if (typeof this.onload === 'function') try { this.onload(); } catch (e) {}
                    }, 0);
                }
            });
        } else if (tag === 'a') {
            // <a> 元素赋值 href 会自动解析 URL 各组件（axios isURLSameOrigin 会用到）
            el._parsed = null;
            el._href = '';
            const parseAndFill = (v) => {
                try {
                    // 相对 URL 以当前页为 base
                    const base = 'https://passport.jd.com/new/login.aspx';
                    const u = new URL(String(v), base);
                    el._parsed = u;
                    el._href = u.href;
                } catch (e) {
                    el._parsed = null;
                    el._href = String(v);
                }
            };
            Object.defineProperty(el, 'href', {
                get() { return el._href || ''; },
                set(v) { parseAndFill(v); },
                configurable: true,
            });
            const urlProp = (key, fallback) => Object.defineProperty(el, key, {
                get() { return el._parsed ? (el._parsed[key] || fallback) : fallback; },
                configurable: true,
            });
            urlProp('protocol', '');
            urlProp('host', '');
            urlProp('hostname', '');
            urlProp('port', '');
            urlProp('pathname', '');
            urlProp('search', '');
            urlProp('hash', '');
            urlProp('origin', '');
            // setAttribute('href', v) 也要触发解析
            el.setAttribute = function(k, v) {
                if (String(k).toLowerCase() === 'href') { parseAndFill(v); }
            };
            el.getAttribute = function(k) {
                if (String(k).toLowerCase() === 'href') return el._href;
                return null;
            };
        } else {
            el.src = ''; el.href = '';
        }
        if (tag === 'iframe') {
            el.contentWindow = {};
            el.contentDocument = {};
        }
        return el;
    }
    
    const doc = Object.create(nodeProto);
    Object.assign(doc, {
        nodeType: 9,
        readyState: 'complete',
        cookie: '',
        referrer: 'https://passport.jd.com/',
        title: '\u4eac\u4e1c-\u6b22\u8fce\u767b\u5f55',
        URL: 'https://passport.jd.com/new/login.aspx',
        documentURI: 'https://passport.jd.com/new/login.aspx',
        domain: 'jd.com',
        compatMode: 'CSS1Compat',
        visibilityState: 'visible',
        hidden: false,
        characterSet: 'UTF-8',
        contentType: 'text/html',
        currentScript: {
            src: 'https://storage.360buyimg.com/jsresource/jcap/version/v2.7.1/1/jcap_ap0b2a.js',
            charset: 'utf-8',
            async: false,
        },
        createElement: buildElement,
        createElementNS: (ns, tag) => buildElement(tag),
        createTextNode: (t) => ({ nodeType: 3, data: t, textContent: t, parentNode: null }),
        createDocumentFragment: () => Object.create(nodeProto),
        createComment: (t) => ({ nodeType: 8, data: t }),
        createEvent: (type) => ({
            type: '', bubbles: false, cancelable: false, defaultPrevented: false,
            target: null, currentTarget: null, timeStamp: Date.now(),
            initEvent: function(t, b, c) { this.type = t; this.bubbles = !!b; this.cancelable = !!c; },
            initCustomEvent: function(t, b, c, detail) { this.type = t; this.bubbles = !!b; this.cancelable = !!c; this.detail = detail; },
            preventDefault: () => {}, stopPropagation: () => {}, stopImmediatePropagation: () => {},
        }),
        importNode: (n) => n,
        adoptNode: (n) => n,
        implementation: {
            hasFeature: () => true,
            createHTMLDocument: () => buildDocument(),
        },
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: () => [],
        getElementsByTagName: (tag) => {
            if (tag === 'head' || tag === 'body' || tag === 'script') {
                return [doc._head];
            }
            return [];
        },
        getElementsByClassName: () => [],
        addEventListener: () => {},
        removeEventListener: () => {},
        execCommand: () => true,
    });
    doc._head = Object.create(nodeProto);
    doc._head.tagName = 'HEAD';
    doc._head.childNodes = [];
    doc._head.appendChild = function(c) { this.childNodes.push(c); return c; };
    doc.head = doc._head;
    doc.body = Object.create(nodeProto);
    doc.body.tagName = 'BODY';
    doc.body.appendChild = function(c) { return c; };
    doc.documentElement = Object.create(nodeProto);
    doc.documentElement.tagName = 'HTML';
    doc.documentElement.clientWidth = 1920;
    doc.documentElement.clientHeight = 1040;
    doc.documentElement.style = makeStyle();
    _globalDoc = doc;
    return doc;
}

function buildNavigator() {
    return {
        userAgent: UA,
        appName: 'Netscape',
        appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        appCodeName: 'Mozilla',
        platform: 'Win32',
        product: 'Gecko',
        productSub: '20030107',
        vendor: 'Google Inc.',
        vendorSub: '',
        language: 'zh-CN',
        languages: ['zh-CN', 'zh', 'en'],
        cookieEnabled: true,
        onLine: true,
        doNotTrack: null,
        hardwareConcurrency: 8,
        deviceMemory: 8,
        maxTouchPoints: 0,
        webdriver: false,
        plugins: [
            { name: 'PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
            { name: 'Chrome PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
        ],
        mimeTypes: [],
        connection: { effectiveType: '4g', rtt: 50, downlink: 10, saveData: false },
        getBattery: () => Promise.resolve({ charging: true, level: 1, chargingTime: 0, dischargingTime: Infinity }),
        permissions: { query: () => Promise.resolve({ state: 'prompt' }) },
        clipboard: {},
        serviceWorker: {},
        sendBeacon: () => true,
    };
}

function buildLocation() {
    return {
        href: 'https://passport.jd.com/new/login.aspx',
        origin: 'https://passport.jd.com',
        protocol: 'https:',
        host: 'passport.jd.com',
        hostname: 'passport.jd.com',
        port: '',
        pathname: '/new/login.aspx',
        search: '',
        hash: '',
        assign: () => {}, replace: () => {}, reload: () => {},
    };
}

function buildScreen() {
    return {
        width: 1920, height: 1080,
        availWidth: 1920, availHeight: 1040,
        colorDepth: 24, pixelDepth: 24,
        orientation: { angle: 0, type: 'landscape-primary' },
    };
}

// XMLHttpRequest 基于 Node.js https/http 模块实现
function buildXMLHttpRequest(captureCallback) {
    return class XMLHttpRequest {
        constructor() {
            this.readyState = 0;
            this.status = 0;
            this.statusText = '';
            this.responseText = '';
            this.response = '';
            this.responseType = '';
            this.responseURL = '';
            this.responseXML = null;
            this.timeout = 0;
            this.withCredentials = false;
            this.upload = { addEventListener: () => {}, removeEventListener: () => {} };
            this._headers = {};
            this._method = 'GET';
            this._url = '';
            this._async = true;
            this._listeners = {};
        }
        open(method, url, async) {
            this._method = method || 'GET';
            this._url = url || '';
            this._async = async !== false;
            this.readyState = 1;
            this._dispatch('readystatechange');
        }
        setRequestHeader(key, val) {
            this._headers[key] = val;
        }
        getResponseHeader(key) {
            return (this._respHeaders || {})[(key || '').toLowerCase()] || null;
        }
        getAllResponseHeaders() {
            return Object.entries(this._respHeaders || {}).map(([k, v]) => `${k}: ${v}`).join('\r\n');
        }
        addEventListener(ev, fn) {
            (this._listeners[ev] = this._listeners[ev] || []).push(fn);
        }
        removeEventListener(ev, fn) {
            const list = this._listeners[ev] || [];
            this._listeners[ev] = list.filter(f => f !== fn);
        }
        _dispatch(ev, evt) {
            const handler = this['on' + ev];
            if (typeof handler === 'function') {
                try { handler.call(this, evt || { type: ev }); } catch (e) {}
            }
            for (const fn of (this._listeners[ev] || [])) {
                try { fn.call(this, evt || { type: ev }); } catch (e) {}
            }
        }
        send(body) {
            // 记录请求槽位，稍后回灌响应
            const captureEntry = {
                method: this._method, url: this._url,
                headers: this._headers, body: body || null,
                status: 0, responseText: null, responseHeaders: null,
                error: null, timing: { t0: Date.now(), t1: null },
            };
            if (captureCallback) captureCallback(captureEntry);
            
            // 解析 URL
            let fullUrl = this._url;
            if (fullUrl.startsWith('//')) fullUrl = 'https:' + fullUrl;
            else if (fullUrl.startsWith('/')) fullUrl = 'https://jcap.m.jd.com' + fullUrl;
            else if (!fullUrl.startsWith('http')) fullUrl = 'https://' + fullUrl;
            
            let u;
            try { u = new URL(fullUrl); } catch (e) {
                captureEntry.error = 'bad url: ' + e.message;
                this.readyState = 4; this.status = 0; this._dispatch('error'); return;
            }
            
            const lib = u.protocol === 'https:' ? https : http;
            const opts = {
                method: this._method,
                hostname: u.hostname,
                port: u.port || (u.protocol === 'https:' ? 443 : 80),
                path: u.pathname + u.search,
                headers: {
                    'User-Agent': UA,
                    'Accept': '*/*',
                    'Accept-Language': 'zh-CN,zh;q=0.9',
                    'Origin': 'https://passport.jd.com',
                    'Referer': 'https://passport.jd.com/',
                    ...this._headers,
                },
            };
            if (body && !opts.headers['Content-Type'] && typeof body === 'string') {
                opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            if (body) {
                opts.headers['Content-Length'] = Buffer.byteLength(body);
            }
            
            const req = lib.request(opts, (res) => {
                const chunks = [];
                res.on('data', c => chunks.push(c));
                res.on('end', () => {
                    this.status = res.statusCode || 0;
                    this.statusText = res.statusMessage || '';
                    this._respHeaders = {};
                    for (const [k, v] of Object.entries(res.headers)) this._respHeaders[k.toLowerCase()] = v;
                    this.responseURL = fullUrl;
                    const buf = Buffer.concat(chunks);
                    this.responseText = buf.toString('utf-8');
                    this.response = this.responseType === 'arraybuffer' ? buf : this.responseText;
                    // 回灌给捕获槽位
                    captureEntry.status = this.status;
                    captureEntry.responseText = this.responseText;
                    captureEntry.responseHeaders = this._respHeaders;
                    captureEntry.timing.t1 = Date.now();
                    this.readyState = 4;
                    this._dispatch('readystatechange');
                    this._dispatch('load', { type: 'load', target: this });
                    this._dispatch('loadend');
                });
            });
            req.on('error', (e) => {
                captureEntry.error = e.message;
                captureEntry.timing.t1 = Date.now();
                this.readyState = 4; this.status = 0;
                this._dispatch('readystatechange');
                this._dispatch('error', { type: 'error', error: e });
                this._dispatch('loadend');
            });
            if (body) req.write(body);
            req.end();
        }
        abort() {
            this.readyState = 0;
            this._dispatch('abort');
        }
    };
}

// ======================= 构建沙箱 =======================

function buildSandbox(capturedRequests) {
    const sandbox = {};
    sandbox.navigator = buildNavigator();
    sandbox.document = buildDocument();
    sandbox.location = buildLocation();
    sandbox.screen = buildScreen();
    sandbox.history = { length: 1, state: null, pushState: () => {}, replaceState: () => {}, back: () => {}, forward: () => {}, go: () => {} };
    sandbox.performance = {
        now: () => Number((process.hrtime.bigint() - perfOrigin) / 1000000n),
        timing: { navigationStart: Date.now() - 1000, loadEventEnd: Date.now() },
        timeOrigin: Date.now() - 1000,
        getEntries: () => [], getEntriesByType: () => [], getEntriesByName: () => [],
        mark: () => {}, measure: () => {}, clearMarks: () => {}, clearMeasures: () => {},
    };
    const perfOrigin = process.hrtime.bigint();
    sandbox.performance.now = () => Number((process.hrtime.bigint() - perfOrigin) / 1000000n);
    
    sandbox.crypto = {
        getRandomValues: (arr) => { require('crypto').randomFillSync(arr); return arr; },
        subtle: require('crypto').webcrypto ? require('crypto').webcrypto.subtle : undefined,
        randomUUID: () => require('crypto').randomUUID(),
    };
    sandbox.atob = (s) => Buffer.from(s, 'base64').toString('binary');
    sandbox.btoa = (s) => Buffer.from(s, 'binary').toString('base64');
    
    // Node 内置
    sandbox.WebAssembly = WebAssembly;
    sandbox.URL = URL;
    sandbox.URLSearchParams = URLSearchParams;
    sandbox.TextEncoder = TextEncoder;
    sandbox.TextDecoder = TextDecoder;
    sandbox.Promise = Promise;
    sandbox.console = console;
    sandbox.Date = Date;
    sandbox.Math = Math;
    sandbox.JSON = JSON;
    sandbox.Error = Error;
    sandbox.TypeError = TypeError;
    sandbox.RangeError = RangeError;
    sandbox.SyntaxError = SyntaxError;
    sandbox.ReferenceError = ReferenceError;
    sandbox.Object = Object;
    sandbox.Array = Array;
    sandbox.String = String;
    sandbox.Number = Number;
    sandbox.Boolean = Boolean;
    sandbox.RegExp = RegExp;
    sandbox.Function = Function;
    sandbox.Symbol = Symbol;
    sandbox.Proxy = Proxy;
    sandbox.Reflect = Reflect;
    sandbox.Map = Map;
    sandbox.Set = Set;
    sandbox.WeakMap = WeakMap;
    sandbox.WeakSet = WeakSet;
    sandbox.ArrayBuffer = ArrayBuffer;
    sandbox.Uint8Array = Uint8Array;
    sandbox.Uint8ClampedArray = Uint8ClampedArray;
    sandbox.Uint16Array = Uint16Array;
    sandbox.Uint32Array = Uint32Array;
    sandbox.Int8Array = Int8Array;
    sandbox.Int16Array = Int16Array;
    sandbox.Int32Array = Int32Array;
    sandbox.Float32Array = Float32Array;
    sandbox.Float64Array = Float64Array;
    sandbox.BigInt = BigInt;
    sandbox.BigInt64Array = BigInt64Array;
    sandbox.BigUint64Array = BigUint64Array;
    sandbox.DataView = DataView;
    sandbox.Intl = Intl;
    
    sandbox.setTimeout = setTimeout;
    sandbox.setInterval = setInterval;
    sandbox.clearTimeout = clearTimeout;
    sandbox.clearInterval = clearInterval;
    sandbox.queueMicrotask = queueMicrotask;
    sandbox.setImmediate = setImmediate;
    sandbox.clearImmediate = clearImmediate;
    
    // XMLHttpRequest
    sandbox.XMLHttpRequest = buildXMLHttpRequest((req) => capturedRequests.push(req));
    sandbox.fetch = undefined;  // 让 jcap 走 XHR 分支
    
    // WebAssembly instantiate hook（诊断用）
    const origInstantiate = WebAssembly.instantiate;
    sandbox.WebAssembly = Object.assign({}, WebAssembly, {
        instantiate: function(...args) {
            console.error('[wasm] instantiate called, arg0 type:', Object.prototype.toString.call(args[0]), 'byteLength:', args[0] && args[0].byteLength);
            const p = origInstantiate.apply(WebAssembly, args);
            return p.then(r => {
                console.error('[wasm] instantiate resolved, exports:', Object.keys(r.instance ? r.instance.exports : r.exports || {}).slice(0, 20).join(','));
                return r;
            }).catch(e => {
                console.error('[wasm] instantiate REJECTED:', e.message);
                throw e;
            });
        },
        compile: WebAssembly.compile.bind(WebAssembly),
        validate: WebAssembly.validate.bind(WebAssembly),
        Module: WebAssembly.Module,
        Instance: WebAssembly.Instance,
        Memory: WebAssembly.Memory,
        Table: WebAssembly.Table,
        Global: WebAssembly.Global,
        CompileError: WebAssembly.CompileError,
        LinkError: WebAssembly.LinkError,
        RuntimeError: WebAssembly.RuntimeError,
    });
    
    // HTML 元素构造器（jcap 可能会用到）
    sandbox.Image = function() { return sandbox.document.createElement('img'); };
    sandbox.HTMLCanvasElement = function() {};
    sandbox.HTMLElement = function() {};
    sandbox.Element = function() {};
    sandbox.Event = function(type) { this.type = type; };
    sandbox.CustomEvent = function(type, opts) { this.type = type; this.detail = opts && opts.detail; };
    sandbox.MessageEvent = function() {};
    sandbox.Worker = function() { return { postMessage: () => {}, terminate: () => {}, addEventListener: () => {} }; };
    sandbox.Blob = function(parts, opts) { this.size = 0; this.type = (opts && opts.type) || ''; };
    sandbox.File = function() {};
    sandbox.FileReader = function() { return { readAsDataURL: () => {}, addEventListener: () => {} }; };
    sandbox.FormData = class FormData {
        constructor() { this._d = []; }
        append(k, v) { this._d.push([k, v]); }
        get(k) { const e = this._d.find(x => x[0] === k); return e ? e[1] : null; }
    };
    sandbox.AbortController = class { constructor() { this.signal = { aborted: false }; } abort() {} };
    sandbox.localStorage = {
        _d: {},
        getItem(k) { return this._d[k] || null; },
        setItem(k, v) { this._d[k] = String(v); },
        removeItem(k) { delete this._d[k]; },
        clear() { this._d = {}; },
        key(i) { return Object.keys(this._d)[i] || null; },
        get length() { return Object.keys(this._d).length; },
    };
    sandbox.sessionStorage = { ...sandbox.localStorage, _d: {} };
    
    // window / global / self
    sandbox.window = sandbox;
    sandbox.self = sandbox;
    sandbox.globalThis = sandbox;
    sandbox.global = sandbox;
    sandbox.top = sandbox;
    sandbox.parent = sandbox;
    sandbox.frames = sandbox;
    sandbox.origin = 'https://passport.jd.com';
    sandbox.name = '';
    sandbox.closed = false;
    
    // 兼容 Webpack CommonJS 嗅探（UMD 分支判断）
    // UMD 头：typeof exports === 'object' && typeof module === 'object' → module.exports = t()
    // 我们想走 browser 分支：else { window.jdCAP = t() }
    // 所以沙箱里不提供 module/exports
    
    return sandbox;
}

// ======================= 加载 jcap =======================

function loadJcap(sandbox) {
    const patched = process.env.JCAP_PATCHED === '1';
    const jcapPath = patched
        ? path.join(__dirname, 'jcap_patched.js')
        : path.join(__dirname, '..', 'assets', 'js', 'jcap_ap0b2a.js');
    console.error('[env] loadJcap from:', jcapPath);
    const code = fs.readFileSync(jcapPath, 'utf-8');
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: path.basename(jcapPath), timeout: 10000 });
}

// ======================= CLI 模式 =======================

async function runStdio() {
    // stdio JSON-RPC: Python 以 stdin 传 JSON，stdout 返回 JSON
    // 请求格式: {"id":1, "action":"create"|"appCheck"|"appCreate"|"getSessionId"|"getBsId"|"reset"|"raw_captcha_api", "info":{...}, "option":{...}, "args":[...]}
    const capturedRequests = [];
    const sandbox = buildSandbox(capturedRequests);
    console.error('[env] Loading jcap ...');
    loadJcap(sandbox);
    if (!sandbox.jdCAP || !sandbox.jdCAP.captcha) {
        process.stdout.write(JSON.stringify({ error: 'jdCAP not loaded' }) + '\n');
        process.exit(1);
    }
    console.error('[env] jdCAP ready, listening stdin ...');
    
    let buf = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', async (chunk) => {
        buf += chunk;
        let idx;
        while ((idx = buf.indexOf('\n')) >= 0) {
            const line = buf.slice(0, idx).trim();
            buf = buf.slice(idx + 1);
            if (!line) continue;
            let req;
            try { req = JSON.parse(line); } catch (e) {
                process.stdout.write(JSON.stringify({ error: 'bad json', raw: line }) + '\n');
                continue;
            }
            await handleRequest(req, sandbox, capturedRequests);
        }
    });
    process.stdin.on('end', () => process.exit(0));
}

let factoryCache = null;
let instanceCache = null;
let wasmWarmed = false;
let cachedDInstance = null;  // 缓存的 D (WASM) 实例，跨请求复用
let cachedInstanceId = null;  // 缓存的 instanceId (ii)

// === 真实 Chrome 指纹缓存（从 real_fingerprint.json 加载）===
let _realFingerprint = undefined; // undefined: 未加载、null: 加载过但不存在
function loadRealFingerprint() {
    if (_realFingerprint !== undefined) return _realFingerprint;
    try {
        const fp = path.join(__dirname, 'real_fingerprint.json');
        if (fs.existsSync(fp)) {
            _realFingerprint = JSON.parse(fs.readFileSync(fp, 'utf-8'));
            console.error('[real_fp] loaded from', fp,
                'devcInfo len=', _realFingerprint.devcInfo && _realFingerprint.devcInfo.length,
                'tdat_ctx len=', _realFingerprint.A_skeleton && _realFingerprint.A_skeleton.tdat_ctx && _realFingerprint.A_skeleton.tdat_ctx.length);
        } else {
            _realFingerprint = null;
            console.error('[real_fp] no real_fingerprint.json, will fallback to built-in');
        }
    } catch (e) {
        _realFingerprint = null;
        console.error('[real_fp] load err:', e.message);
    }
    return _realFingerprint;
}

function buildDevcInfoFromReal(option) {
    const rf = loadRealFingerprint();
    if (!rf || !rf.devcInfo) return null;
    try {
        const parsed = JSON.parse(rf.devcInfo);
        if (option && option.account) parsed.account = option.account;
        return JSON.stringify(parsed);
    } catch (e) {
        console.error('[real_fp] parse devcInfo err:', e.message);
        return rf.devcInfo;
    }
}

function buildDefaultDevcInfo(option) {
    const o = option || {};
    return JSON.stringify({
        account: o.account || '',
        uo: '{}',
        capfp: {},
        cvs: 'bee574c3e0abaf1296da94ec9034f885',
        wgl: '24700f9f1986800ab4fcc880530dd0ed',
        pr: '', cd: '24', fv: '', fts: '',
        scr: '1920x1080,1920x1040',
        cpu: '8', pt: 'Win32', tzo: 'Asia/Shanghai',
        lan: 'zh-CN', wdr: '0', mem: '8',
        sdv: '2.0', jsv: '1835ob', sdf: '{}',
        lns: 'zh-CN,zh,en', tsp: '1', pdf: '0', cke: '1',
        bid: '', gpu: '', uat: '00', ol: '1', ets: '33',
        wch: '', dcs: 'https://storage.360buyimg.com/jsresource/jcap/version/v2.7.1/1/jcap_ap0b2a.js',
        wlh: 'https%3A%2F%2Fpassport.jd.com%2Fnew%2Flogin.aspx',
    });
}

async function ensureWasmWarmed(sandbox, info, option) {
    // 1. 确保 instanceCache 存在
    if (!instanceCache) {
        const useInfo = info || defaultInfo();
        factoryCache = sandbox.jdCAP.captcha(useInfo);
        instanceCache = await Promise.resolve(factoryCache(option || {}));
    }
    const gt = sandbox.globalThis || sandbox;
    // 2. 确保 WASM 被构造（触发 __JCAP_DEBUG_KLASS 暴露）且 fp 分支跑过 (暴露 __JCAP_LAST_DEVCINFO)
    if (!gt.__JCAP_DEBUG_KLASS || !gt.__JCAP_LAST_DEVCINFO) {
        try {
            const p = instanceCache.appCreate(option || {});
            if (p && typeof p.then === 'function') await p.catch(() => {});
        } catch (e) {
            console.error('[warm] appCreate err:', e.message);
        }
    }
    // 3. 轮询等 fp 分支被调用 (__JCAP_LAST_DEVCINFO 被填充)，最多 6s
    if (!wasmWarmed) {
        const t0 = Date.now();
        while (!gt.__JCAP_LAST_DEVCINFO && Date.now() - t0 < 6000) {
            await new Promise(r => setTimeout(r, 150));
        }
        // 另外留给 WASM 一个最小的稳定期
        await new Promise(r => setTimeout(r, 300));
        wasmWarmed = true;
        console.error('[warm] wasmWarmed =', !!gt.__JCAP_LAST_DEVCINFO, 'elapsed=', Date.now() - t0, 'ms');
    }
}

async function handleRequest(req, sandbox, capturedRequests) {
    const id = req.id;
    try {
        // 清空每次调用前的捕获
        capturedRequests.length = 0;
        
        if (req.action === 'init') {
            const info = req.info || defaultInfo();
            factoryCache = sandbox.jdCAP.captcha(info);
            instanceCache = await Promise.resolve(factoryCache(req.option || {}));
            wasmWarmed = false;
            process.stdout.write(JSON.stringify({ id, ok: true, info, methods: listProtoMethods(instanceCache) }) + '\n');
            return;
        }
        
        // === 重置缓存的 D 实例（session 重建时调用）===
        if (req.action === 'reset_d_instance') {
            if (cachedDInstance) {
                try { cachedDInstance.delete(); } catch (e) {}
                cachedDInstance = null;
                cachedInstanceId = null;
                console.error('[reset_d_instance] Cached D instance cleared');
            }
            process.stdout.write(JSON.stringify({ id, ok: true }) + '\n');
            return;
        }
        
        // === 新增：绕开同步路径直接用 fresh D2 生成 ct ===
        if (req.action === 'get_ct_direct') {
            await ensureWasmWarmed(sandbox, req.info, req.option);
            const gt = sandbox.globalThis || sandbox;
            const Klass = gt.__JCAP_DEBUG_KLASS;
            const baseR = gt.__JCAP_DEBUG_R;
            if (typeof Klass !== 'function') {
                process.stdout.write(JSON.stringify({ id, error: 'Klass not exposed (need JCAP_PATCHED=1)' }) + '\n');
                return;
            }
            // 优先级：req.devcInfo > real_fingerprint.json > jcap 内部 gr(A) > built-in default
            const sid = req.sid || gt.__JCAP_LAST_SID || (req.option && req.option.sessionId) || '';
            const realDevcInfo = buildDevcInfoFromReal(req.option);
            let devcInfo, devcInfoSource;
            if (req.devcInfo) { devcInfo = req.devcInfo; devcInfoSource = 'req.devcInfo'; }
            else if (realDevcInfo) { devcInfo = realDevcInfo; devcInfoSource = 'real_fingerprint.json'; }
            else if (gt.__JCAP_LAST_DEVCINFO) { devcInfo = gt.__JCAP_LAST_DEVCINFO; devcInfoSource = 'jcap gr(A)'; }
            else { devcInfo = buildDefaultDevcInfo(req.option); devcInfoSource = 'built-in default'; }
            const usingReal = devcInfoSource === 'real_fingerprint.json' || devcInfoSource === 'jcap gr(A)';
            console.error('[get_ct_direct] devcInfo source =', devcInfoSource, 'len=', devcInfo && devcInfo.length);
            // rArg：优先用真实 Chrome dump 的 tdat_ctx / tdat_code
            const rf = loadRealFingerprint();
            const realAskel = (rf && rf.A_skeleton) || {};
            const rArg = Object.assign({}, baseR || {}, {
                appType: 3,
                tdat_version: realAskel.tdat_code || 99992,
                tdat_ctx: realAskel.tdat_ctx || '',
                host: 'jcap.m.jd.com',
                cs: typeof realAskel.cs === 'number' ? realAskel.cs : 1,
                print: () => {}, printErr: () => {}, onAbort: () => {},
            });
            console.error('[get_ct_direct] rArg tdat_ctx len=', (rArg.tdat_ctx||'').length, 'tdat_version=', rArg.tdat_version);
            try {
                // 复用或创建 D 实例
                if (!cachedDInstance) {
                    const d2 = new Klass(rArg);
                    cachedDInstance = (d2 && typeof d2.then === 'function') ? await d2 : d2;
                    try { cachedInstanceId = cachedDInstance.getInstanceId(); } catch (e) {}
                    console.error('[get_ct_direct] Created cached D instance, ii=', cachedInstanceId);
                }
                const ct = cachedDInstance.getCTData([sid, devcInfo]);
                process.stdout.write(JSON.stringify({
                    id, ok: true, ct, sid, devcInfo, usingReal,
                    instanceId: cachedInstanceId,
                    captured: capturedRequests.slice(),
                }) + '\n');
            } catch (e) {
                process.stdout.write(JSON.stringify({ id, error: e.message, stack: e.stack }) + '\n');
            }
            return;
        }
        
        // === 生成 tk（滑块轨迹加密）===
        if (req.action === 'get_tk_direct') {
            await ensureWasmWarmed(sandbox, req.info, req.option);
            const gt = sandbox.globalThis || sandbox;
            if (!cachedDInstance) {
                process.stdout.write(JSON.stringify({ id, error: 'No cached D instance (call get_ct_direct first)' }) + '\n');
                return;
            }
            const sid = req.sid || gt.__JCAP_LAST_SID || (req.option && req.option.sessionId) || '';
            const st = req.st || '';
            const trajectoryData = req.trajectory || '[]';
            const touchListData = req.touchList || JSON.stringify({touchList: 'touche_message'});
            console.error('[get_tk_direct] sid=', sid.slice(0,40), 'st=', st.slice(0,20), 'trajLen=', trajectoryData.length);
            try {
                const tk = cachedDInstance.getTKData([sid, st, trajectoryData, touchListData]);
                process.stdout.write(JSON.stringify({
                    id, ok: true, tk, sid, st, instanceId: cachedInstanceId,
                    captured: capturedRequests.slice(),
                }) + '\n');
            } catch (e) {
                process.stdout.write(JSON.stringify({ id, error: e.message, stack: e.stack }) + '\n');
            }
            return;
        }
        
        // === 生成 cs（调用栈加密）===
        if (req.action === 'get_cs_direct') {
            await ensureWasmWarmed(sandbox, req.info, req.option);
            const gt = sandbox.globalThis || sandbox;
            const Klass = gt.__JCAP_DEBUG_KLASS;
            const baseR = gt.__JCAP_DEBUG_R;
            if (typeof Klass !== 'function') {
                process.stdout.write(JSON.stringify({ id, error: 'Klass not exposed (need JCAP_PATCHED=1)' }) + '\n');
                return;
            }
            const sid = req.sid || gt.__JCAP_LAST_SID || (req.option && req.option.sessionId) || '';
            const stackData = req.stackRecords || JSON.stringify({rec: {}, filePathes: []});
            const rf = loadRealFingerprint();
            const realAskel = (rf && rf.A_skeleton) || {};
            const rArg = Object.assign({}, baseR || {}, {
                appType: 3,
                tdat_version: realAskel.tdat_code || 99992,
                tdat_ctx: realAskel.tdat_ctx || '',
                host: 'jcap.m.jd.com',
                cs: typeof realAskel.cs === 'number' ? realAskel.cs : 1,
                print: () => {}, printErr: () => {}, onAbort: () => {},
            });
            console.error('[get_cs_direct] sid=', sid.slice(0,40), 'stackLen=', stackData.length);
            try {
                if (!cachedDInstance) {
                    const d2 = new Klass(rArg);
                    cachedDInstance = (d2 && typeof d2.then === 'function') ? await d2 : d2;
                    try { cachedInstanceId = cachedDInstance.getInstanceId(); } catch (e) {}
                    console.error('[get_cs_direct] Created cached D instance, ii=', cachedInstanceId);
                }
                const cs = cachedDInstance.getCSData([sid, stackData]);
                process.stdout.write(JSON.stringify({
                    id, ok: true, cs, sid, instanceId: cachedInstanceId,
                    captured: capturedRequests.slice(),
                }) + '\n');
            } catch (e) {
                process.stdout.write(JSON.stringify({ id, error: e.message, stack: e.stack }) + '\n');
            }
            return;
        }
        
        // === 一键生成 ct + tk + cs（用于 verify 请求）===
        if (req.action === 'get_encrypt_all') {
            await ensureWasmWarmed(sandbox, req.info, req.option);
            const gt = sandbox.globalThis || sandbox;
            const Klass = gt.__JCAP_DEBUG_KLASS;
            const baseR = gt.__JCAP_DEBUG_R;
            if (typeof Klass !== 'function') {
                process.stdout.write(JSON.stringify({ id, error: 'Klass not exposed (need JCAP_PATCHED=1)' }) + '\n');
                return;
            }
            const sid = req.sid || gt.__JCAP_LAST_SID || (req.option && req.option.sessionId) || '';
            const st = req.st || '';
            const devcInfo = req.devcInfo || buildDevcInfoFromReal(req.option) || gt.__JCAP_LAST_DEVCINFO || buildDefaultDevcInfo(req.option);
            const trajectoryData = req.trajectory || '[]';
            const touchListData = req.touchList || JSON.stringify({touchList: 'touche_message'});
            const stackData = req.stackRecords || JSON.stringify({rec: {}, filePathes: []});
            const rf = loadRealFingerprint();
            const realAskel = (rf && rf.A_skeleton) || {};
            const rArg = Object.assign({}, baseR || {}, {
                appType: 3,
                tdat_version: realAskel.tdat_code || 99992,
                tdat_ctx: realAskel.tdat_ctx || '',
                host: 'jcap.m.jd.com',
                cs: typeof realAskel.cs === 'number' ? realAskel.cs : 1,
                print: () => {}, printErr: () => {}, onAbort: () => {},
            });
            console.error('[get_encrypt_all] sid=', sid.slice(0,40), 'st=', st.slice(0,20), 'trajLen=', trajectoryData.length);
            try {
                if (!cachedDInstance) {
                    const d2 = new Klass(rArg);
                    cachedDInstance = (d2 && typeof d2.then === 'function') ? await d2 : d2;
                    try { cachedInstanceId = cachedDInstance.getInstanceId(); } catch (e) {}
                    console.error('[get_encrypt_all] Created cached D instance, ii=', cachedInstanceId);
                }
                const ct = cachedDInstance.getCTData([sid, devcInfo]);
                const tk = cachedDInstance.getTKData([sid, st, trajectoryData, touchListData]);
                const cs = cachedDInstance.getCSData([sid, stackData]);
                process.stdout.write(JSON.stringify({
                    id, ok: true, ct, tk, cs, sid, st, instanceId: cachedInstanceId,
                    captured: capturedRequests.slice(),
                }) + '\n');
            } catch (e) {
                process.stdout.write(JSON.stringify({ id, error: e.message, stack: e.stack }) + '\n');
            }
            return;
        }
        
        if (!instanceCache) {
            // 懒初始化
            const info = req.info || defaultInfo();
            factoryCache = sandbox.jdCAP.captcha(info);
            instanceCache = await Promise.resolve(factoryCache(req.option || {}));
        }
        const args = req.args || [req.option || {}];
        const method = req.action;
        if (typeof instanceCache[method] !== 'function') {
            process.stdout.write(JSON.stringify({ id, error: `no method ${method}` }) + '\n');
            return;
        }
        let result = instanceCache[method](...args);
        if (result && typeof result.then === 'function') result = await result;
        // 等 XHR 回来（给异步一点时间）
        await new Promise(r => setTimeout(r, Math.max(0, req.wait || 500)));
        process.stdout.write(JSON.stringify({
            id, ok: true, result: safeDump(result),
            captured: capturedRequests.slice(),
        }) + '\n');
    } catch (e) {
        process.stdout.write(JSON.stringify({
            id, error: e.message, stack: e.stack,
            captured: capturedRequests.slice(),
        }) + '\n');
    }
}

function defaultInfo() {
    return {
        appType: 3,
        tdat_version: 99992,
        host: 'jcap.m.jd.com',
        tdat_ctx: '',
        cs: 1,
    };
}

function listProtoMethods(ins) {
    const out = [];
    let proto = Object.getPrototypeOf(ins);
    while (proto && proto !== Object.prototype) {
        for (const n of Object.getOwnPropertyNames(proto)) {
            if (n !== 'constructor' && typeof ins[n] === 'function') out.push(n);
        }
        proto = Object.getPrototypeOf(proto);
    }
    return out;
}

function safeDump(v) {
    if (v === undefined || v === null) return v;
    if (typeof v === 'function') return '[Function]';
    if (typeof v !== 'object') return v;
    try {
        return JSON.parse(JSON.stringify(v, (k, val) => {
            if (typeof val === 'function') return '[Function]';
            if (val && typeof val === 'object' && val.nodeType) return '[DOMNode]';
            return val;
        }));
    } catch (e) { return String(v); }
}

async function main() {
    const mode = process.argv[2] || 'test';
    
    if (mode === '--stdio' || mode === 'stdio') {
        return runStdio();
    }
    
    const capturedRequests = [];
    const sandbox = buildSandbox(capturedRequests);
    
    console.error('[env] Loading jcap_ap0b2a.js ...');
    const t0 = Date.now();
    loadJcap(sandbox);
    console.error(`[env] Loaded in ${Date.now() - t0}ms`);
    console.error('[env] jdCAP keys:', Object.keys(sandbox.jdCAP || {}));
    
    if (!sandbox.jdCAP || !sandbox.jdCAP.captcha) {
        console.error('[env] jdCAP not available!');
        process.exit(1);
    }
    
    const info = defaultInfo();
    
    console.error('[env] Creating captcha factory...');
    const factory = sandbox.jdCAP.captcha(info);
    console.error('[env] factory type:', typeof factory);
    
    if (typeof factory !== 'function') {
        console.error('[env] factory is not a function!');
        process.exit(1);
    }
    
    const testOption = {
        account: 'testaccount',
        status: '1',
        appId: '1000803',
        sessionId: process.env.JCAP_SID || 'dcr7_gABAAAGoUilqQIAMHJmrlhIvz9RIEm-mqcPKpQfZf1PlhBCZXXrczd1TqnROY7nt1r620knAe9_wX-AsAAAAAA',
        jwtToken: process.env.JCAP_JWT || '',
        bizSource: 'pc',
        scene: 'login-pc',
    };
    
    console.error('[env] Calling factory(testOption) to create instance...');
    try {
        const instance = await Promise.resolve(factory(testOption));
        console.error('[env] instance methods:', listProtoMethods(instance));
        
        // 尝试调用 create (Vue 挂载，需完整 DOM)
        if (mode === 'create' || mode === 'all') {
            console.error('[env] Calling instance.create(option)...');
            try {
                const cr = instance.create(testOption);
                console.error('[env] create returned:', typeof cr, cr && typeof cr.then === 'function' ? '(promise)' : '');
                if (cr && typeof cr.then === 'function') await cr;
                await new Promise(r => setTimeout(r, 1500));
                console.error('[env] after create, capturedRequests:', capturedRequests.length);
            } catch (e) {
                console.error('[env] create error:', e.message);
                console.error(e.stack);
            }
        }
        // appCreate 发送 session 初始化请求（真正生成 ct/tk 的地方）
        if (mode === 'appCreate' || mode === 'all') {
            console.error('[env] Calling instance.appCreate(option)...');
            try {
                const ac = instance.appCreate(testOption);
                console.error('[env] appCreate returned:', typeof ac, ac && typeof ac.then === 'function' ? '(promise)' : '');
                if (ac && typeof ac.then === 'function') {
                    const rv = await ac.catch(e => ({ __err: e && e.message, __stack: e && e.stack }));
                    console.error('[env] appCreate resolved:', JSON.stringify(rv).slice(0, 500));
                }
                await new Promise(r => setTimeout(r, 5000));
                console.error('[env] after appCreate, capturedRequests:', capturedRequests.length);
                for (const r of capturedRequests) {
                    console.error('  XHR', r.method, r.url, '| body:', r.body && r.body.slice(0, 300));
                }
                // === 参数搜索：用 globalThis.__JCAP_DEBUG_KLASS 构造不同 D 的变体，测试 getCTData
                if (process.env.JCAP_PARAM_SEARCH === '1') {
                    const gt = sandbox.globalThis || sandbox;
                    const Klass = gt.__JCAP_DEBUG_KLASS;
                    console.error('[SEARCH] Klass type=', typeof Klass);
                    if (typeof Klass === 'function') {
                        const sid = testOption.sessionId;
                        const devcInfo = JSON.stringify({ account: 'x', pt: 'Win32', lan: 'zh-CN', sdv: '2.0', jsv: '1835ob', sdf: '{}' });
                        const probes = [
                            { label: 'as_is', r: { appType: 3, tdat_version: 99992, host: 'jcap.m.jd.com', tdat_ctx: testOption.tdat_ctx || '', cs: 1 } },
                            { label: 'empty_ctx', r: { appType: 3, tdat_version: 99992, host: 'jcap.m.jd.com', tdat_ctx: '', cs: 1 } },
                            { label: 'appType1', r: { appType: 1, tdat_version: 99992, host: 'jcap.m.jd.com', tdat_ctx: '', cs: 1 } },
                            { label: 'appType2', r: { appType: 2, tdat_version: 99992, host: 'jcap.m.jd.com', tdat_ctx: '', cs: 1 } },
                            { label: 'tdat0', r: { appType: 3, tdat_version: 0, host: 'jcap.m.jd.com', tdat_ctx: '', cs: 0 } },
                            { label: 'with_sen', r: { appType: 3, tdat_version: 99992, host: 'jcap.m.jd.com', tdat_ctx: '', sen: 1, cs: 1, isInitOnload: false, platformType: 3 } },
                            { label: 'no_opts', r: {} },
                        ];
                        for (const p of probes) {
                            try {
                                const d2 = new Klass(Object.assign({}, p.r, { print: () => {}, printErr: (...a) => console.error('[PERR]', p.label, ...a), onAbort: x => console.error('[PABORT]', p.label, x) }));
                                // Emscripten 异步 ready
                                if (d2 && typeof d2.then === 'function') {
                                    const d2r = await d2;
                                    const r1 = d2r.getCTData([sid, devcInfo]);
                                    const r2 = d2r.getInstanceId();
                                    console.error('[SEARCH]', p.label, 'ct=', JSON.stringify(r1), 'iid=', JSON.stringify(r2));
                                    try { d2r.delete(); } catch (e) {}
                                } else {
                                    const r1 = d2.getCTData([sid, devcInfo]);
                                    const r2 = d2.getInstanceId();
                                    console.error('[SEARCH]', p.label, 'ct=', JSON.stringify(r1), 'iid=', JSON.stringify(r2));
                                    try { d2.delete(); } catch (e) {}
                                }
                            } catch (e) {
                                console.error('[SEARCH] probe', p.label, 'ERR:', e.message);
                            }
                        }
                        // === 第二轮：固定 r，测试不同的 devcInfo
                        const fullDevc2 = '{"account":"testaccount","uo":"{}","capfp":{},"cvs":"bee574c3e0abaf1296da94ec9034f885","wgl":"24700f9f1986800ab4fcc880530dd0ed","pr":"","cd":"24","fv":"","fts":"","scr":"1920x1080,1920x1040","cpu":"8","pt":"Win32","tzo":"Asia/Shanghai","lan":"zh-CN","wdr":"0","mem":"8","sdv":"2.0","jsv":"1835ob","sdf":"{}","lns":"zh-CN,zh,en","tsp":"1","pdf":"0","cke":"1","bid":"","gpu":"","uat":"00","ol":"1","ets":"33","wch":"","dcs":"test.js","wlh":"passport"}';
                        const fullObj2 = JSON.parse(fullDevc2);
                        const keys2 = Object.keys(fullObj2);
                        const baseR2 = { appType: 3, tdat_version: 99992, host: 'jcap.m.jd.com', tdat_ctx: '', cs: 1 };
                        const probeDevc = async (label, devc) => {
                            try {
                                const inst = new Klass(Object.assign({}, baseR2, { print: () => {}, printErr: () => {}, onAbort: () => {} }));
                                const finalInst = (inst && typeof inst.then === 'function') ? await inst : inst;
                                const r1 = finalInst.getCTData([sid, devc]);
                                console.error('[SEARCH2]', label, 'ct=', r1 == null ? 'NULL' : String(r1).slice(0, 40));
                                try { finalInst.delete(); } catch (e) {}
                                return r1;
                            } catch (e) {
                                console.error('[SEARCH2]', label, 'ERR:', e.message);
                                return null;
                            }
                        };
                        await probeDevc('full', fullDevc2);
                        await probeDevc('min_pt', JSON.stringify({ pt: 'Win32' }));
                        await probeDevc('empty', JSON.stringify({}));
                        await probeDevc('empty_str', '');
                        // 用真实 gr() 返回的完整 devcInfo（含嵌套 sdf）
                        const realGrDevc = '{"account":"testaccount","uo":"{}","capfp":{},"cvs":"bee574c3e0abaf1296da94ec9034f885","wgl":"24700f9f1986800ab4fcc880530dd0ed","pr":"","cd":"24","fv":"","fts":"","scr":"1920x1080,1920x1040","cpu":"8","pt":"Win32","tzo":"Asia/Shanghai","lan":"zh-CN","wdr":"0","mem":"8","sdv":"2.0","jsv":"1835ob","sdf":"{\\"zow1KK\\":\\"OvAUNI\\",\\"2h0ppG\\":\\"ar8Kxh\\"}","lns":"zh-CN,zh,en","tsp":"1","pdf":"0","cke":"1","bid":"","gpu":"","uat":"00","ol":"1","ets":"33","wch":"","dcs":"https://storage.360buyimg.com/jsresource/jcap/version/v2.7.1/1/jcap_ap0b2a.js","wlh":"https%3A%2F%2Fpassport.jd.com%2Fnew%2Flogin.aspx"}';
                        console.error('[SEARCH2] realGr len=', realGrDevc.length);
                        await probeDevc('realGr', realGrDevc);
                        // 只留必要字段，逐步简化对比
                        await probeDevc('realGr_no_sdf', realGrDevc.replace(/,"sdf":"[^"]*"/, ''));
                        for (const k of keys2) {
                            const cl = Object.assign({}, fullObj2);
                            delete cl[k];
                            await probeDevc('drop_' + k, JSON.stringify(cl));
                        }
                    }
                }
            } catch (e) {
                console.error('[env] appCreate error:', e.message);
                console.error(e.stack);
            }
        }
        // appCheck 发送验证码校验请求
        if (mode === 'appCheck' || mode === 'all') {
            console.error('[env] Calling instance.appCheck(option)...');
            try {
                const ac = instance.appCheck(testOption);
                if (ac && typeof ac.then === 'function') {
                    const rv = await ac.catch(e => ({ __err: e && e.message }));
                    console.error('[env] appCheck resolved:', JSON.stringify(rv).slice(0, 500));
                }
                await new Promise(r => setTimeout(r, 2000));
                console.error('[env] after appCheck, captured:', capturedRequests.length);
                for (const r of capturedRequests) {
                    console.error('  XHR', r.method, r.url, '| body:', r.body && r.body.slice(0, 300));
                }
            } catch (e) {
                console.error('[env] appCheck error:', e.message);
                console.error(e.stack);
            }
        }
        if (mode === 'getSessionId' || mode === 'all') {
            console.error('[env] Calling instance.getSessionId()...');
            try {
                const sid = instance.getSessionId();
                console.error('[env] sessionId =', sid);
            } catch (e) {
                console.error('[env] getSessionId error:', e.message);
            }
        }
        if (mode === 'getBsId' || mode === 'all') {
            console.error('[env] Calling instance.getBsId()...');
            try {
                const bs = instance.getBsId();
                console.error('[env] bsId =', bs);
            } catch (e) {
                console.error('[env] getBsId error:', e.message);
            }
        }
        
        console.log(JSON.stringify({
            success: true,
            jdCAP_loaded: true,
            instance_methods: listProtoMethods(instance),
            capturedRequests: capturedRequests,
        }, null, 2));
    } catch (e) {
        console.error('[env] factory failed:', e.message);
        console.error(e.stack);
        console.log(JSON.stringify({
            success: false,
            error: e.message,
            capturedRequests: capturedRequests,
        }, null, 2));
    }
}

main().catch(e => {
    console.error('[fatal]', e.message);
    console.error(e.stack);
    process.exit(1);
});

/**
 * 抖音 X-Bogus 签名器 (Node.js 版)
 * 模拟浏览器环境运行 webmssdk 的 frontierSign
 *
 * 用法: node signer.js <stub_hash>
 * 输出: X-Bogus 签名字符串
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 读取 webmssdk
const sdkPath = path.join(__dirname, '..', 'webmssdk.es5.js');
const sdkCode = fs.readFileSync(sdkPath, 'utf-8');

// 构建模拟浏览器环境的 sandbox
const sandbox = {
  window: {},
  document: {
    createElement: () => ({ style: {} }),
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    cookie: '',
    referrer: 'https://www.douyin.com/',
    documentElement: { style: {} },
    body: { style: {} },
    head: { appendChild: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {},
  },
  navigator: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
    language: 'zh-CN',
    languages: ['zh-CN', 'zh', 'en'],
    platform: 'Win32',
    maxTouchPoints: 0,
    hardwareConcurrency: 8,
    deviceMemory: 8,
    cookieEnabled: true,
    plugins: { length: 3 },
    mimeTypes: { length: 4 },
    webdriver: false,
    connection: { effectiveType: '4g', rtt: 0, downlink: 10 },
    getBattery: () => Promise.resolve({ charging: true, chargingTime: 0, dischargingTime: Infinity, level: 1 }),
    sendBeacon: () => true,
    vibrate: () => true,
  },
  location: {
    href: 'https://www.douyin.com/search/',
    protocol: 'https:',
    host: 'www.douyin.com',
    hostname: 'www.douyin.com',
    pathname: '/search/',
    search: '',
    hash: '',
    origin: 'https://www.douyin.com',
    assign: () => {},
    replace: () => {},
    reload: () => {},
  },
  history: {
    length: 5,
    state: null,
    pushState: () => {},
    replaceState: () => {},
    back: () => {},
    forward: () => {},
    go: () => {},
  },
  screen: {
    width: 1920,
    height: 1080,
    availWidth: 1920,
    availHeight: 1040,
    colorDepth: 24,
    pixelDepth: 24,
  },
  innerWidth: 1920,
  innerHeight: 1080,
  outerWidth: 1920,
  outerHeight: 1080,
  devicePixelRatio: 1,
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
    clear() { this._data = {}; },
    get length() { return Object.keys(this._data).length; },
    key(i) { return Object.keys(this._data)[i] || null; },
  },
  sessionStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
    clear() { this._data = {}; },
    get length() { return Object.keys(this._data).length; },
    key(i) { return Object.keys(this._data)[i] || null; },
  },
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  Date: Date,
  Math: Math,
  JSON: JSON,
  parseInt: parseInt,
  parseFloat: parseFloat,
  isNaN: isNaN,
  isFinite: isFinite,
  encodeURIComponent: encodeURIComponent,
  decodeURIComponent: decodeURIComponent,
  encodeURI: encodeURI,
  decodeURI: decodeURI,
  escape: escape,
  unescape: unescape,
  Array: Array,
  Object: Object,
  String: String,
  Number: Number,
  Boolean: Boolean,
  RegExp: RegExp,
  Error: Error,
  TypeError: TypeError,
  RangeError: RangeError,
  SyntaxError: SyntaxError,
  URIError: URIError,
  EvalError: EvalError,
  ReferenceError: ReferenceError,
  Promise: Promise,
  Map: Map,
  Set: Set,
  WeakMap: WeakMap,
  WeakSet: WeakSet,
  Symbol: Symbol,
  Proxy: Proxy,
  Reflect: Reflect,
  ArrayBuffer: ArrayBuffer,
  Uint8Array: Uint8Array,
  Uint16Array: Uint16Array,
  Uint32Array: Uint32Array,
  Int8Array: Int8Array,
  Int16Array: Int16Array,
  Int32Array: Int32Array,
  Float32Array: Float32Array,
  Float64Array: Float64Array,
  DataView: DataView,
  TextEncoder: TextEncoder,
  TextDecoder: TextDecoder,
  URL: URL,
  URLSearchParams: URLSearchParams,
  Blob: Blob,
  File: File,
  FormData: FormData,
  Headers: Headers,
  Request: Request,
  Response: Response,
  fetch: () => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}), text: () => Promise.resolve('') }),
  XMLHttpRequest: class XMLHttpRequest {
    constructor() {
      this.readyState = 0;
      this.status = 0;
      this.responseText = '';
      this.response = '';
      this.headers = {};
      this._listeners = {};
    }
    open(method, url, async) { this._url = url; }
    setRequestHeader(k, v) { this.headers[k] = v; }
    send(body) {}
    abort() {}
    getResponseHeader(k) { return this.headers[k] || null; }
    getAllResponseHeaders() { return Object.entries(this.headers).map(([k,v]) => `${k}: ${v}`).join('\r\n'); }
    addEventListener(e, cb) { this._listeners[e] = cb; }
    removeEventListener(e) { delete this._listeners[e]; }
  },
  Image: class Image { constructor() { this.src = ''; } },
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  cancelAnimationFrame: (id) => clearTimeout(id),
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  matchMedia: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }),
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
  postMessage: () => {},
  importScripts: () => {},
  atob: (str) => Buffer.from(str, 'base64').toString('binary'),
  btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
  crypto: {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
      return arr;
    },
    subtle: {
      digest: () => Promise.resolve(new ArrayBuffer(32)),
    },
  },
  performance: { now: () => Date.now(), timing: { navigationStart: Date.now() } },
  // WebGL 简单模拟
  WebGLRenderingContext: class WebGLRenderingContext {
    getParameter(p) {
      if (p === 7937) return 'WebKit WebGL'; // RENDERER
      if (p === 7936) return 'WebKit'; // VENDOR
      return null;
    }
    getExtension() { return null; }
    getShaderPrecisionFormat() { return { precision: 23, rangeMin: 127, rangeMax: 127 }; }
    createBuffer() { return {}; }
  },
  HTMLCanvasElement: class HTMLCanvasElement {
    getContext() {
      return {
        fillRect: () => {},
        fillText: () => {},
        measureText: () => ({ width: 0 }),
        getImageData: () => ({ data: new Uint8Array(4) }),
        toDataURL: () => 'data:image/png;base64,',
        arc: () => {},
        fill: () => {},
        closePath: () => {},
        beginPath: () => {},
      };
    }
    toDataURL() { return 'data:image/png;base64,'; }
  },
};

// 自引用
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.globalThis = sandbox;
sandbox.global = sandbox;
sandbox.top = sandbox;
sandbox.parent = sandbox;
sandbox.frames = sandbox;

// 在 sandbox 中执行 SDK
try {
  const context = vm.createContext(sandbox);
  vm.runInContext(sdkCode, context, { timeout: 10000 });

  // 检查是否成功
  const acrawler = sandbox.window.byted_acrawler;
  if (!acrawler || typeof acrawler.frontierSign !== 'function') {
    console.error(JSON.stringify({ error: 'frontierSign not available after init' }));
    process.exit(1);
  }

  // 获取命令行参数
  const stubHash = process.argv[2];
  if (!stubHash) {
    console.error(JSON.stringify({ error: 'missing stub hash argument' }));
    process.exit(1);
  }

  // 调用签名
  const result = acrawler.frontierSign({ "X-MS-STUB": stubHash });
  console.log(result["X-Bogus"] || '');

} catch (e) {
  console.error(JSON.stringify({ error: e.message, stack: e.stack ? e.stack.substring(0, 300) : '' }));
  process.exit(1);
}

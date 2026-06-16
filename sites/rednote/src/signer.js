
// Node.js 纯算签名桥 - rednote.com X-s/X-t 生成
// 输入: stdin JSON {apiPath, body, cookie?}
// 输出: stdout JSON {"X-s":"XYW_...","X-t":"1777..."}
//
// 依赖资产(assets/js/):
//   - a1783c69_webmsxyw.js  (_webmsxyw 定义)
//   - ds_6545c70e.js        (安全脚本 init)
//
// 用法:
//   echo '{"apiPath":"/api/sns/web/v1/homefeed","body":{...}}' | node signer.js

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ASSETS = path.resolve(__dirname, '..', 'assets', 'js');

// ==================== 最小补环境 ====================
function buildEnv(cookie) {
  const sandbox = {};
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.top = sandbox;
  sandbox.parent = sandbox;
  sandbox.console = console;

  // 基础构造器
  sandbox.Object = Object;
  sandbox.Array = Array;
  sandbox.Function = Function;
  sandbox.String = String;
  sandbox.Number = Number;
  sandbox.Boolean = Boolean;
  sandbox.Date = Date;
  sandbox.Math = Math;
  sandbox.JSON = JSON;
  sandbox.RegExp = RegExp;
  sandbox.Error = Error;
  sandbox.TypeError = TypeError;
  sandbox.Symbol = Symbol;
  sandbox.Promise = Promise;
  sandbox.Uint8Array = Uint8Array;
  sandbox.Int8Array = Int8Array;
  sandbox.Uint16Array = Uint16Array;
  sandbox.Int16Array = Int16Array;
  sandbox.Uint32Array = Uint32Array;
  sandbox.Int32Array = Int32Array;
  sandbox.ArrayBuffer = ArrayBuffer;
  sandbox.DataView = DataView;
  sandbox.Map = Map;
  sandbox.Set = Set;
  sandbox.WeakMap = WeakMap;
  sandbox.WeakSet = WeakSet;
  sandbox.parseInt = parseInt;
  sandbox.parseFloat = parseFloat;
  sandbox.isNaN = isNaN;
  sandbox.isFinite = isFinite;
  sandbox.encodeURI = encodeURI;
  sandbox.encodeURIComponent = encodeURIComponent;
  sandbox.decodeURI = decodeURI;
  sandbox.decodeURIComponent = decodeURIComponent;
  sandbox.setTimeout = setTimeout;
  sandbox.clearTimeout = clearTimeout;
  sandbox.setInterval = setInterval;
  sandbox.clearInterval = clearInterval;
  sandbox.atob = (s) => Buffer.from(s, 'base64').toString('binary');
  sandbox.btoa = (s) => Buffer.from(s, 'binary').toString('base64');

  // document
  const doc = {
    cookie: cookie || '',
    referrer: 'https://www.rednote.com/',
    URL: 'https://www.rednote.com/explore',
    documentURI: 'https://www.rednote.com/explore',
    hidden: false,
    visibilityState: 'visible',
    readyState: 'complete',
    body: { style: {}, appendChild: () => {}, removeChild: () => {} },
    head: { appendChild: () => {}, removeChild: () => {} },
    documentElement: { style: {}, clientWidth: 1920, clientHeight: 1040 },
    createElement: (tag) => ({
      tagName: String(tag).toUpperCase(),
      style: {},
      setAttribute: () => {},
      getAttribute: () => null,
      appendChild: () => {},
      getContext: () => ({ fillText: () => {}, measureText: () => ({ width: 0 }), getImageData: () => ({ data: [] }) }),
      toDataURL: () => 'data:image/png;base64,',
      addEventListener: () => {},
      removeEventListener: () => {},
      click: () => {}
    }),
    createEvent: () => ({ initEvent: () => {} }),
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    getElementsByTagName: () => [],
    getElementsByClassName: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
    execCommand: () => false
  };
  sandbox.document = doc;

  // navigator (aligned with ads browser k1bhfp97)
  sandbox.navigator = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
    appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
    appName: 'Netscape',
    appCodeName: 'Mozilla',
    platform: 'Win32',
    vendor: 'Google Inc.',
    vendorSub: '',
    product: 'Gecko',
    productSub: '20030107',
    language: 'zh-CN',
    languages: ['zh-CN', 'zh'],
    hardwareConcurrency: 12,
    deviceMemory: 8,
    cookieEnabled: true,
    onLine: true,
    doNotTrack: null,
    maxTouchPoints: 0,
    pdfViewerEnabled: true,
    plugins: { length: 0 },
    mimeTypes: { length: 0 }
  };

  // location
  sandbox.location = {
    href: 'https://www.rednote.com/explore',
    origin: 'https://www.rednote.com',
    protocol: 'https:',
    host: 'www.rednote.com',
    hostname: 'www.rednote.com',
    port: '',
    pathname: '/explore',
    search: '',
    hash: '',
    ancestorOrigins: { length: 0 },
    assign: () => {},
    replace: () => {},
    reload: () => {},
    toString() { return this.href; }
  };

  sandbox.screen = { width: 2560, height: 1440, availWidth: 2560, availHeight: 1392, colorDepth: 32, pixelDepth: 32, orientation: { type: 'landscape-primary', angle: 0 } };
  // xhs-pc-web 配置 - appId 来源
  sandbox.xsecappid = 'xhs-pc-web';
  sandbox.history = { length: 1, state: null, pushState: () => {}, replaceState: () => {}, go: () => {}, back: () => {}, forward: () => {} };
  sandbox.performance = { now: () => Date.now(), timeOrigin: Date.now() - 1000, timing: { navigationStart: Date.now() - 1000 }, getEntriesByType: () => [] };
  const store = {};
  sandbox.localStorage = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; }, clear: () => { for (const k in store) delete store[k]; }, key: (i) => Object.keys(store)[i] || null, get length() { return Object.keys(store).length; } };
  const sess = {};
  sandbox.sessionStorage = { getItem: (k) => (k in sess ? sess[k] : null), setItem: (k, v) => { sess[k] = String(v); }, removeItem: (k) => { delete sess[k]; }, clear: () => { for (const k in sess) delete sess[k]; }, key: (i) => Object.keys(sess)[i] || null, get length() { return Object.keys(sess).length; } };

  sandbox.requestAnimationFrame = (cb) => setTimeout(cb, 16);
  sandbox.cancelAnimationFrame = (id) => clearTimeout(id);
  sandbox.matchMedia = () => ({ matches: false, media: '', addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
  sandbox.getComputedStyle = () => ({ getPropertyValue: () => '' });
  sandbox.addEventListener = () => {};
  sandbox.removeEventListener = () => {};
  sandbox.dispatchEvent = () => true;
  sandbox.postMessage = () => {};
  sandbox.alert = () => {};
  sandbox.confirm = () => false;
  sandbox.prompt = () => null;
  sandbox.focus = () => {};
  sandbox.blur = () => {};
  sandbox.open = () => null;
  sandbox.close = () => {};

  sandbox.crypto = {
    getRandomValues: (arr) => { for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256); return arr; },
    randomUUID: () => '00000000-0000-4000-8000-000000000000'
  };

  // 占位防误报
  sandbox.XMLHttpRequest = function XMLHttpRequest() {};
  sandbox.XMLHttpRequest.prototype = {
    open: () => {}, send: () => {}, setRequestHeader: () => {}, getResponseHeader: () => '', addEventListener: () => {}
  };
  sandbox.fetch = () => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}), text: () => Promise.resolve('') });

  return sandbox;
}

// ==================== 加载并暴露 _webmsxyw ====================
function createSigner(cookie) {
  const sandbox = buildEnv(cookie);
  const ctx = vm.createContext(sandbox);

  // 加载安全脚本 + _webmsxyw 定义
  const files = [
    path.join(ASSETS, 'ds_6545c70e.js'),
    path.join(ASSETS, 'a1783c69_webmsxyw.js')
  ];
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf-8');
    try {
      vm.runInContext(src, ctx, { filename: path.basename(f), timeout: 15000 });
    } catch (e) {
      // 某些安全脚本执行后会抛无害错误，忽略以便继续
      process.stderr.write(`[signer] ${path.basename(f)} warn: ${e.message}\n`);
    }
  }

  if (typeof sandbox._webmsxyw !== 'function') {
    throw new Error('_webmsxyw not registered after loading bundles');
  }
  return sandbox;
}

// ==================== CLI ====================
function readStdin() {
  return new Promise((resolve) => {
    let buf = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (d) => { buf += d; });
    process.stdin.on('end', () => resolve(buf));
  });
}

(async () => {
  try {
    const raw = await readStdin();
    const { apiPath, body, cookie } = JSON.parse(raw || '{}');
    if (!apiPath) throw new Error('apiPath required');
    const env = createSigner(cookie || '');
    // body 允许 '' (GET 请求, 例如 /api/sns/web/v2/user/me) / {} / 对象; null|undefined 时默认 {}
    const payload = (body === undefined || body === null) ? {} : body;
    const sig = env._webmsxyw(apiPath, payload);
    const out = {
      'X-s': sig['X-s'],
      'X-t': String(sig['X-t'])
    };
    process.stdout.write(JSON.stringify(out));
  } catch (e) {
    process.stderr.write(`[signer] FAIL: ${e.message}\n${e.stack || ''}`);
    process.exit(1);
  }
})();

/**
 * 瑞数6 Cookie 求解器 v3
 * 使用全局作用域执行（window = global），不用 VM 沙箱
 * 参考社区成熟补环境方案
 */

const https = require('https');
const http = require('http');
const fs = require('fs');

const TARGET_URL = 'https://sugh.szu.edu.cn/Html/News/Columns/7/Index.html';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// ==================== HTTP 工具 ====================
function httpGet(targetUrl, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(targetUrl);
    const headers = {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Accept-Encoding': 'identity',
      'Connection': 'keep-alive',
      ...options.headers,
    };
    if (options.cookies) {
      headers['Cookie'] = Object.entries(options.cookies).map(([k, v]) => `${k}=${v}`).join('; ');
    }
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers,
      rejectUnauthorized: false,
    };
    const lib = parsedUrl.protocol === 'https:' ? https : http;
    const req = lib.request(reqOptions, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf-8');
        const setCookies = res.headers['set-cookie'] || [];
        const cookies = {};
        for (const sc of setCookies) {
          const eq = sc.indexOf('=');
          const semi = sc.indexOf(';');
          if (eq > 0) {
            cookies[sc.substring(0, eq).trim()] = sc.substring(eq + 1, semi > 0 ? semi : undefined).trim();
          }
        }
        resolve({ statusCode: res.statusCode, headers: res.headers, body, cookies });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// ==================== HTML 解析 ====================
function parseHtml(html, baseUrl) {
  const result = { tsNsd: null, tsCd: null, metaContent: null, metaId: null, jsUrl: null, entryFunction: null };
  const metaMatch = html.match(/<meta\s+id="([^"]+)"\s+content="([^"]+)"\s+r='m'/);
  if (metaMatch) { result.metaId = metaMatch[1]; result.metaContent = metaMatch[2]; }
  const tsMatch = html.match(/\$_ts\.nsd\s*=\s*(\d+);\s*\$_ts\.cd\s*=\s*"([^"]+)"/);
  if (tsMatch) { result.tsNsd = parseInt(tsMatch[1]); result.tsCd = tsMatch[2]; }
  const jsMatch = html.match(/src="([^"]+\.js)"\s+r='m'/);
  if (jsMatch) {
    const jsPath = jsMatch[1];
    result.jsUrl = jsPath.startsWith('/') ? `${new URL(baseUrl).origin}${jsPath}` : new URL(jsPath, baseUrl).href;
  }
  // 入口函数：在 </html> 之后的 <script r='m'> 中
  // 也可能在 HTML 末尾的 <script r='m'> 中
  const afterHtmlMatch = html.match(/<\/html>[\s\S]*?<script[^>]*r='m'>([^<]+)<\/script>/);
  if (afterHtmlMatch) {
    const fnMatch = afterHtmlMatch[1].match(/(_\$\w+)\(\)/);
    if (fnMatch) result.entryFunction = fnMatch[1];
  }
  // 如果上面没找到，从所有 r='m' script 标签找（取最后一个函数调用）
  if (!result.entryFunction) {
    const scriptEntries = [...html.matchAll(/<script[^>]*r='m'>([^<]+)<\/script>/g)];
    for (const entry of scriptEntries) {
      // 跳过 $_ts 初始化的 script
      if (entry[1].includes('$_ts')) continue;
      const fnMatch = entry[1].match(/(_\$\w+)\(\)/);
      if (fnMatch) result.entryFunction = fnMatch[1];
    }
  }
  // 还没找到？尝试在 HTML 末尾搜索任何 _$xx() 调用
  if (!result.entryFunction) {
    const lastScript = html.match(/<script[^>]*>([^<]*(_\$\w+)\(\)[^<]*)<\/script>\s*$/);
    if (lastScript) {
      result.entryFunction = lastScript[2];
    }
  }
  return result;
}

// ==================== 补环境 ====================
// 保存 Node.js 引用（删除后还需要用）
const _process = process;

function setupEnvironment() {
  const cookieJar = {};

  // 保存 Node.js 引用（删除后还需要用）
  const _https = require('https');
  const _http = require('http');
  const _fs = require('fs');
  const _Buffer = Buffer;

  // ===== 关键：window = global，在全局作用域执行 =====
  // 删除 Node.js 特有标识
  delete global.__filename;
  delete global.__dirname;
  delete global.process;
  // 不删 Buffer，瑞数可能用到
  delete global.require;
  delete global.module;
  delete global.exports;
  delete global.gc;
  // global.global 不要删，瑞数可能通过 global.global 访问

  // window 指向 global
  global.window = global;
  global.self = global;
  global.top = global;
  global.parent = global;
  global.frames = global;
  global.globalThis = global;

  // ===== Document ===== (先创建基础对象，后续完善)
  // global.document will be set after createElement is defined

  // ===== Cookie (will be defined on document after document is fully created) =====
  let _cookieStr = '';

  // ===== Navigator =====
  global.navigator = {
    userAgent: USER_AGENT,
    appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    appName: 'Netscape',
    appCodeName: 'Mozilla',
    product: 'Gecko',
    productSub: '20030107',
    vendor: 'Google Inc.',
    vendorSub: '',
    platform: 'Win32',
    language: 'zh-CN',
    languages: ['zh-CN', 'zh', 'en'],
    onLine: true,
    cookieEnabled: true,
    doNotTrack: null,
    hardwareConcurrency: 8,
    maxTouchPoints: 0,
    deviceMemory: 8,
    webdriver: false,
    pdfViewerEnabled: true,
    plugins: { length: 5, item: () => null, namedItem: () => null, refresh() {},
      0: { name: 'PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format', length: 1, 0: { type: 'application/pdf', suffixes: 'pdf' } },
      1: { name: 'Chrome PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format', length: 1, 0: { type: 'application/pdf', suffixes: 'pdf' } },
      2: { name: 'Chromium PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format', length: 1, 0: { type: 'application/pdf', suffixes: 'pdf' } },
      3: { name: 'Microsoft Edge PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format', length: 1, 0: { type: 'application/pdf', suffixes: 'pdf' } },
      4: { name: 'WebKit built-in PDF', filename: 'internal-pdf-viewer', description: 'Portable Document Format', length: 1, 0: { type: 'application/pdf', suffixes: 'pdf' } },
    },
    mimeTypes: { length: 2, item: () => null, namedItem: () => null,
      0: { type: 'application/pdf', suffixes: 'pdf', description: 'Portable Document Format' },
      1: { type: 'text/pdf', suffixes: 'pdf', description: 'Portable Document Format' },
    },
    connection: { effectiveType: '4g', rtt: 50, downlink: 10, saveData: false },
    get userAgentData() {
      return {
        brands: [{ brand: 'Chromium', version: '131' }, { brand: 'Google Chrome', version: '131' }, { brand: 'Not_A Brand', version: '24' }],
        mobile: false,
        platform: 'Windows',
        getHighEntropyValues: () => Promise.resolve({
          architecture: 'x86', bitness: '64', mobile: false, model: '', platform: 'Windows', platformVersion: '15.0.0', uaFullVersion: '131.0.0.0'
        }),
      };
    },
    javaEnabled() { return false; },
    sendBeacon() { return true; },
    vibrate() { return true; },
    getGamepads() { return []; },
    mediaDevices: { enumerateDevices: () => Promise.resolve([]) },
    permissions: { query: () => Promise.resolve({ state: 'prompt', onchange: null }) },
    getBattery: () => Promise.resolve({ charging: true, chargingTime: 0, dischargingTime: Infinity, level: 1, addEventListener() {} }),
    storage: { estimate: () => Promise.resolve({ quota: 299706064076, usage: 0 }) },
  };

  // ===== Screen =====
  global.screen = {
    width: 1920, height: 1080, availWidth: 1920, availHeight: 1040,
    colorDepth: 24, pixelDepth: 24, orientation: { angle: 0, type: 'landscape-primary', onchange: null },
    isExtended: false,
  };

  // ===== Location =====
  const targetParsed = new URL(TARGET_URL);
  global.location = {
    href: TARGET_URL, protocol: 'https:', host: targetParsed.host,
    hostname: targetParsed.hostname, port: '', pathname: targetParsed.pathname,
    search: '', hash: '', origin: targetParsed.origin,
    ancestorOrigins: [], assign() {}, replace() {}, reload() {},
    toString() { return TARGET_URL; },
  };

  // ===== Document (完整) =====
  const metaRegistry = new Map();
  const docElement = createElement('html');
  const headElement = createElement('head');
  const bodyElement = createElement('body');
  docElement.childNodes.push(headElement, bodyElement);
  headElement.parentNode = docElement;
  bodyElement.parentNode = docElement;

  global.document = {
    nodeType: 9, nodeName: '#document', readyState: 'complete',
    hidden: false, visibilityState: 'visible',
    characterSet: 'UTF-8', charset: 'UTF-8', contentType: 'text/html',
    compatMode: 'CSS1Compat', title: '', domain: targetParsed.hostname,
    URL: TARGET_URL, documentURI: TARGET_URL, referrer: '',
    documentElement: docElement, head: headElement, body: bodyElement,
    defaultView: global,
    // cookie 将用 defineProperty 处理
    createElement(tag) { return createElement(tag); },
    createElementNS(ns, tag) { return createElement(tag); },
    createTextNode(t) { return { nodeType: 3, nodeName: '#text', nodeValue: t, textContent: t, parentNode: null }; },
    createDocumentFragment() {
      const frag = {
        nodeType: 11, nodeName: '#document-fragment',
        childNodes: [], children: [], parentNode: null,
        appendChild(c) { if (c && c.parentNode) c.parentNode = this; this.childNodes.push(c); return c; },
        removeChild(c) { const i = this.childNodes.indexOf(c); if (i >= 0) this.childNodes.splice(i, 1); return c; },
        querySelector() { return null; }, querySelectorAll() { return []; },
        getElementsByTagName() { return []; }, getElementsByClassName() { return []; },
        getElementById() { return null; },
        setAttribute() {}, getAttribute() { return null; },
      };
      return frag;
    },
    createComment(t) { return { nodeType: 8, nodeName: '#comment', nodeValue: t, parentNode: null }; },
    createEvent() { return { type: '', bubbles: false, cancelable: false, initEvent() {} }; },
    createRange() {
      return { setStart() {}, setEnd() {}, selectNode() {}, selectNodeContents() {}, collapse() {}, cloneContents() { return global.document.createDocumentFragment(); }, createContextualFragment(h) { return global.document.createDocumentFragment(); }, getBoundingClientRect() { return {}; } };
    },
    getSelection() { return { rangeCount: 0, toString() { return ''; } }; },
    getElementById(id) { return metaRegistry.get(id) || null; },
    getElementsByTagName(tag) {
      tag = tag.toLowerCase();
      if (tag === 'html') return [docElement];
      if (tag === 'head') return [headElement];
      if (tag === 'body') return [bodyElement];
      if (tag === 'meta') return Array.from(metaRegistry.values());
      if (tag === 'script') return [];
      if (tag === 'div') return [];
      return [];
    },
    getElementsByClassName() { return []; },
    getElementsByName() { return []; },
    querySelector(sel) {
      if (sel === 'html') return docElement;
      if (sel === 'head') return headElement;
      if (sel === 'body') return bodyElement;
      if (sel.startsWith('#')) return metaRegistry.get(sel.slice(1)) || null;
      return null;
    },
    querySelectorAll(sel) { const r = global.document.querySelector(sel); return r ? [r] : []; },
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return true; },
    registerMeta(id, content) {
      const m = createElement('meta');
      m.id = id; m.setAttribute('content', content); m.setAttribute('r', 'm');
      m.parentNode = headElement; // meta 在 head 中
      headElement.childNodes.push(m);
      metaRegistry.set(id, m);
    },
    implementation: { hasFeature() { return true; }, createHTMLDocument() { return global.document; } },
    execCommand() { return false; },
    forms: [], images: [], scripts: [], links: [], anchors: [], styleSheets: [],
    activeElement: bodyElement,
    hasFocus() { return true; },
  };
  // document.all 特殊处理
  Object.defineProperty(global.document, 'all', { get() { return undefined; }, enumerable: true, configurable: true });

  // document.cookie 处理
  Object.defineProperty(global.document, 'cookie', {
    get() { return _cookieStr; },
    set(v) {
      if (!v) return;
      for (const part of v.split(';')) {
        const eq = part.indexOf('=');
        if (eq > 0) {
          const name = part.substring(0, eq).trim();
          const value = part.substring(eq + 1).trim();
          if (['path','domain','expires','max-age','secure','httponly','samesite','priority'].includes(name.toLowerCase())) continue;
          cookieJar[name] = value;
          console.error('[COOKIE SET]', name, '=', value.substring(0, 60));
        }
      }
      _cookieStr = Object.entries(cookieJar).map(([k, v]) => `${k}=${v}`).join('; ');
    },
    enumerable: true,
    configurable: true,
  });

  // ===== Element =====
  function createElement(tag) {
    const attrs = {};
    const style = new Proxy({}, { get: (t, p) => p === 'cssText' ? '' : t[p], set: (t, p, v) => { t[p] = v; return true; } });
    const listeners = {};
    const el = {
      tagName: tag.toUpperCase(), nodeName: tag.toUpperCase(),
      nodeType: 1, nodeValue: null, parentNode: null, ownerDocument: global.document,
      id: '', name: '', type: '', src: '', href: '', value: '', className: '',
      classList: { add() {}, remove() {}, contains() { return false; }, toggle() {}, length: 0 },
      style, dataset: {},
      innerHTML: '', outerHTML: '', textContent: '', innerText: '',
      offsetWidth: 0, offsetHeight: 0, offsetTop: 0, offsetLeft: 0,
      clientWidth: tag.toLowerCase() === 'html' ? 1920 : 0,
      clientHeight: tag.toLowerCase() === 'html' ? 1080 : 0,
      scrollTop: 0, scrollLeft: 0, scrollWidth: 0, scrollHeight: 0,
      childNodes: [], children: [],
      firstChild: null, lastChild: null, nextSibling: null, previousSibling: null,
      getAttribute(n) { return attrs[n] ?? null; },
      setAttribute(n, v) { attrs[n] = String(v); },
      removeAttribute(n) { delete attrs[n]; },
      hasAttribute(n) { return n in attrs; },
      addEventListener(t, fn, o) { if (!listeners[t]) listeners[t] = []; listeners[t].push(fn); },
      removeEventListener(t, fn) {},
      dispatchEvent() { return true; },
      appendChild(c) { if (c) { c.parentNode = this; this.childNodes.push(c); } return c; },
      removeChild(c) { if (!c) return c; const i = this.childNodes.indexOf(c); if (i >= 0) this.childNodes.splice(i, 1); c.parentNode = null; return c; },
      insertBefore(n, r) { n.parentNode = this; this.childNodes.push(n); return n; },
      cloneNode() { return createElement(tag); },
      querySelector() { return null; },
      querySelectorAll() { return []; },
      getElementsByTagName() { return []; },
      getElementsByClassName() { return []; },
      getContext(type) { return type === '2d' ? createCanvas2D() : null; },
      toDataURL() { return 'data:image/png;base64,AAAA'; },
      getBoundingClientRect() { return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 }; },
      getClientRects() { return []; },
      focus() {}, blur() {}, click() {}, remove() {},
      toString() { return `[object HTML${tag.toUpperCase()}Element]`; },
    };
    // 特殊元素：a 标签需要 href 吸附性
    if (tag.toLowerCase() === 'a') {
      Object.defineProperty(el, 'hostname', { get() { return global.location.hostname; }, set(v) {}, enumerable: true });
      Object.defineProperty(el, 'protocol', { get() { return global.location.protocol; }, set(v) {}, enumerable: true });
      Object.defineProperty(el, 'host', { get() { return global.location.host; }, set(v) {}, enumerable: true });
      Object.defineProperty(el, 'pathname', { get() { return global.location.pathname; }, set(v) {}, enumerable: true });
      Object.defineProperty(el, 'port', { get() { return global.location.port; }, set(v) {}, enumerable: true });
      Object.defineProperty(el, 'search', { get() { return global.location.search; }, set(v) {}, enumerable: true });
      Object.defineProperty(el, 'hash', { get() { return global.location.hash; }, set(v) {}, enumerable: true });
      Object.defineProperty(el, 'origin', { get() { return global.location.origin; }, set(v) {}, enumerable: true });
    }
    return el;
  }

  function createCanvas2D() {
    return {
      canvas: {}, fillStyle: '#000', strokeStyle: '#000', lineWidth: 1, font: '10px sans-serif',
      textAlign: 'start', textBaseline: 'alphabetic', globalAlpha: 1,
      fillRect() {}, strokeRect() {}, clearRect() {}, fillText() {}, strokeText() {},
      measureText(t) { return { width: t.length * 6 }; },
      beginPath() {}, closePath() {}, moveTo() {}, lineTo() {}, arc() {},
      bezierCurveTo() {}, quadraticCurveTo() {}, rect() {}, ellipse() {},
      fill() {}, stroke() {}, clip() {}, save() {}, restore() {},
      scale() {}, rotate() {}, translate() {}, transform() {}, setTransform() {},
      createLinearGradient() { return { addColorStop() {} }; },
      createRadialGradient() { return { addColorStop() {} }; },
      getImageData(x, y, w, h) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; },
      putImageData() {}, createImageData(w, h) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; },
      drawImage() {},
    };
  }

  // ===== Performance =====
  const perfStart = Date.now();
  global.performance = {
    timeOrigin: perfStart,
    now() { return Date.now() - perfStart; },
    mark() {}, measure() {},
    getEntries() { return []; }, getEntriesByType() { return []; }, getEntriesByName() { return []; },
    clearMarks() {}, clearMeasures() {}, clearResourceTimings() {},
    timing: {
      navigationStart: perfStart, fetchStart: perfStart + 20, domainLookupStart: perfStart + 40,
      domainLookupEnd: perfStart + 50, connectStart: perfStart + 51, connectEnd: perfStart + 70,
      secureConnectionStart: perfStart + 52, requestStart: perfStart + 71,
      responseStart: perfStart + 300, responseEnd: perfStart + 450,
      domLoading: perfStart + 460, domInteractive: perfStart + 480,
      domContentLoadedEventStart: perfStart + 481, domContentLoadedEventEnd: perfStart + 485,
      domComplete: perfStart + 500, loadEventStart: perfStart + 500, loadEventEnd: perfStart + 501,
    },
    memory: { jsHeapSizeLimit: 2172649472, totalJSHeapSize: 35000000, usedJSHeapSize: 25000000 },
    navigation: { type: 0, redirectCount: 0 },
    toJSON() { return { timeOrigin: perfStart }; },
  };

  // ===== History =====
  global.history = { length: 2, state: null, scrollRestoration: 'auto', pushState() {}, replaceState() {}, go() {}, back() {}, forward() {} };

  // ===== Crypto =====
  global.crypto = {
    getRandomValues(arr) { for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256); return arr; },
    subtle: {
      digest: () => Promise.resolve(new ArrayBuffer(32)),
      encrypt: () => Promise.resolve(new ArrayBuffer(0)),
      decrypt: () => Promise.resolve(new ArrayBuffer(0)),
    },
    randomUUID: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); }),
  };

  // ===== Chrome =====
  global.chrome = {
    app: { isInstalled: false, InstallState: { INSTALLED: 'installed', NOT_INSTALLED: 'not_installed', DISABLED: 'disabled' }, RunningState: { RUNNING: 'running', CANNOT_RUN: 'cannot_run', READY_TO_RUN: 'ready_to_run' } },
    runtime: {
      OnInstalledReason: { INSTALL: 'install', UPDATE: 'update', CHROME_UPDATE: 'chrome_update', SHARED_MODULE_UPDATE: 'shared_module_update' },
      PlatformArch: { ARM: 'arm', ARM64: 'arm64', MIPS: 'mips', MIPS64: 'mips64', X86_32: 'x86-32', X86_64: 'x86-64' },
      PlatformOs: { ANDROID: 'android', CROS: 'cros', LINUX: 'linux', MAC: 'mac', OPENBSD: 'openbsd', WIN: 'win' },
      connect() { return { onDisconnect: { addListener() {} }, onMessage: { addListener() {} }, postMessage() {} }; },
      sendMessage() {}, getManifest() { return {}; }, getURL() { return ''; }, getId() { return ''; },
    },
    csi: () => ({ onloadT: Date.now(), pageT: Math.random() * 1000 + 500, startE: Date.now() - 1000, tran: 15 }),
    loadTimes: () => ({ commitLoadTime: Date.now() / 1000, connectionInfo: 'h2', finishDocumentLoadTime: Date.now() / 1000, finishLoadTime: Date.now() / 1000, firstPaintAfterLoadTime: 0, firstPaintTime: Date.now() / 1000, navigationType: 'Other', npnNegotiatedProtocol: 'h2', requestTime: Date.now() / 1000 - 0.5, startLoadTime: Date.now() / 1000 - 0.3, wasAlternateProtocolAvailable: false, wasFetchedViaSpdy: true, wasNpnNegotiated: true }),
  };

  // ===== Timer / 事件 =====
  const timers = [];
  let timerId = 1;
  global.setTimeout = function(fn, delay, ...args) {
    const id = timerId++;
    if (typeof fn === 'function') timers.push({ id, fn, args, type: 'timeout' });
    return id;
  };
  global.clearTimeout = function() {};
  global.setInterval = function(fn, delay, ...args) {
    const id = timerId++;
    if (typeof fn === 'function') timers.push({ id, fn, args, type: 'interval' });
    return id;
  };
  global.clearInterval = function() {};
  global.requestAnimationFrame = function(fn) { return timerId++; };
  global.cancelAnimationFrame = function() {};
  global.requestIdleCallback = function(fn) { return timerId++; };
  global.cancelIdleCallback = function() {};
  global.queueMicrotask = function(fn) { Promise.resolve().then(fn); };

  function runTimers() {
    let max = 50;
    while (timers.length > 0 && max-- > 0) {
      const t = timers.shift();
      try { t.fn(...t.args); } catch (e) { console.error('[TIMER ERROR]', e.message); }
    }
  }

  // ===== 其他 =====
  global.ActiveXObject = undefined;
  global.external = '';
  global.opera = undefined;
  global.addEventListener = function() {};
  global.removeEventListener = function() {};
  global.dispatchEvent = function() { return true; };
  global.atob = function(str) { return Buffer.from(str, 'base64').toString('binary'); };
  global.btoa = function(str) { return Buffer.from(str, 'binary').toString('base64'); };
  global.fetch = function() { return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(''), json: () => Promise.resolve({}) }); };
  global.matchMedia = function(q) { return { matches: false, media: q, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; } }; };
  global.getComputedStyle = function() { return new Proxy({}, { get: (t, p) => p === 'getPropertyValue' ? () => '' : '' }); };
  global.getSelection = function() { return { rangeCount: 0, toString() { return ''; } }; };
  global.structuredClone = function(obj) { return JSON.parse(JSON.stringify(obj)); };
  global.alert = function() {};
  global.confirm = function() { return true; };
  global.prompt = function() { return null; };
  global.open = function() { return null; };
  global.close = function() {};
  global.focus = function() {};
  global.blur = function() {};
  global.postMessage = function() {};
  global.print = function() {};
  global.stop = function() {};
  global.scrollTo = function() {};
  global.scrollBy = function() {};
  global.scroll = function() {};
  global.moveTo = function() {};
  global.moveBy = function() {};
  global.resizeTo = function() {};
  global.resizeBy = function() {};
  global.innerWidth = 1920;
  global.innerHeight = 1080;
  global.outerWidth = 1920;
  global.outerHeight = 1040;
  global.devicePixelRatio = 1;
  global.screenX = 0;
  global.screenY = 0;
  global.pageXOffset = 0;
  global.pageYOffset = 0;
  global.scrollX = 0;
  global.scrollY = 0;
  global.name = '';
  global.status = '';
  global.closed = false;
  global.origin = targetParsed.origin;
  global.length = 0;

  // Storage
  global.localStorage = { _data: {}, getItem(k) { return this._data[k] ?? null; }, setItem(k, v) { this._data[k] = String(v); }, removeItem(k) { delete this._data[k]; }, clear() { this._data = {}; } };
  global.sessionStorage = { _data: {}, getItem(k) { return this._data[k] ?? null; }, setItem(k, v) { this._data[k] = String(v); }, removeItem(k) { delete this._data[k]; }, clear() { this._data = {}; } };

  // Observer classes
  global.MutationObserver = class { constructor() {} observe() {} disconnect() {} takeRecords() { return []; } };
  global.IntersectionObserver = class { constructor() {} observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } };
  global.ResizeObserver = class { constructor() {} observe() {} unobserve() {} disconnect() {} };
  global.PerformanceObserver = class { constructor() {} observe() {} disconnect() {} takeRecords() { return []; } };

  // Other classes
  global.XMLHttpRequest = class {
    constructor() { this.readyState = 0; this.status = 0; this.responseText = ''; this.onreadystatechange = null; this.onload = null; this.onerror = null; this.upload = { addEventListener() {} }; this._headers = {}; }
    open() { this.readyState = 1; }
    setRequestHeader(n, v) { this._headers[n] = v; }
    send() { this.readyState = 4; this.status = 200; if (this.onreadystatechange) this.onreadystatechange(); if (this.onload) this.onload(); }
    abort() {}
    getResponseHeader() { return null; }
    getAllResponseHeaders() { return ''; }
  };
  global.Image = class { constructor(w, h) { this.width = w || 0; this.height = h || 0; this.naturalWidth = 0; this.naturalHeight = 0; this.src = ''; } };
  global.Worker = class { constructor() {} postMessage() {} terminate() {} addEventListener() {} };
  global.Blob = globalThis.Blob;
  global.File = globalThis.File;
  global.FileReader = class { constructor() { this.result = null; } readAsDataURL() { this.result = 'data:;base64,'; } readAsText() {} readAsArrayBuffer() { this.result = new ArrayBuffer(0); } };
  global.DOMParser = class { parseFromString() { return global.document; } };
  global.Event = class { constructor(t, o) { this.type = t; this.bubbles = false; this.cancelable = false; this.timeStamp = Date.now(); this.target = null; this.defaultPrevented = false; } preventDefault() { this.defaultPrevented = true; } stopPropagation() {} };
  global.MessageEvent = class { constructor(t, o) { this.type = t; this.data = o?.data; this.origin = o?.origin || ''; } };
  global.CustomEvent = class { constructor(t, o) { this.type = t; this.detail = o?.detail; } };
  global.Notification = { permission: 'denied' };
  global.Document = function Document() {};
  global.DocumentFragment = function DocumentFragment() {};

  // === 瑞数关键：覆盖 console.log 防止 VMP 二进制输出 ===
  const origConsoleLog = console.log;
  console.log = function() {};

  // === 瑞数关键：Function.prototype.toString 保护 ===
  // 瑞数会检查 native 函数的 toString 输出，如果函数不是 native 就判定为补环境
  const _origToString = Function.prototype.toString;
  const nativeToStringMap = new WeakMap();

  // 标记一个函数为 native
  function markNative(fn, name) {
    nativeToStringMap.set(fn, `function ${name || fn.name || ''}() { [native code] }`);
  }

  // 为所有浏览器 API 函数标记 native
  function markAllNative(obj, objName) {
    if (!obj || typeof obj !== 'object' && typeof obj !== 'function') return;
    try {
      for (const key of Object.getOwnPropertyNames(obj)) {
        try {
          const val = obj[key];
          if (typeof val === 'function') {
            markNative(val, val.name || key);
          }
        } catch(e) {}
      }
    } catch(e) {}
  }

  Function.prototype.toString = function() {
    if (nativeToStringMap.has(this)) {
      return nativeToStringMap.get(this);
    }
    return _origToString.call(this);
  };
  markNative(Function.prototype.toString, 'toString');

  // 标记关键对象的函数
  markAllNative(global.navigator, 'navigator');
  markAllNative(global.document, 'document');
  markAllNative(global.screen, 'screen');
  markAllNative(global.location, 'location');
  markAllNative(global.performance, 'performance');
  markAllNative(global.crypto, 'crypto');
  markAllNative(global.history, 'history');
  markAllNative(global, 'window');

  // 标记构造函数
  markNative(global.MutationObserver, 'MutationObserver');
  markNative(global.IntersectionObserver, 'IntersectionObserver');
  markNative(global.ResizeObserver, 'ResizeObserver');
  markNative(global.XMLHttpRequest, 'XMLHttpRequest');
  markNative(global.Image, 'Image');
  markNative(global.Event, 'Event');
  markNative(global.MessageEvent, 'MessageEvent');
  markNative(global.CustomEvent, 'CustomEvent');
  markNative(global.Worker, 'Worker');
  markNative(global.Blob, 'Blob');
  markNative(global.File, 'File');
  markNative(global.FileReader, 'FileReader');
  markNative(global.DOMParser, 'DOMParser');
  markNative(global.Document, 'Document');
  markNative(global.DocumentFragment, 'DocumentFragment');

  // === 瑞数关键：document.all 的特殊处理 ===
  // typeof document.all 在浏览器中返回 'undefined'，但 document.all 本身是一个对象
  // 这个在前面已经用 defineProperty 处理了

  // === 瑞数关键：修补 toString 和 toLocaleString ===
  Object.prototype.toLocaleString = function() { return this.toString(); };

  return { cookieJar, runTimers, origConsoleLog, _https, _http, _fs };
}

// ==================== 主函数 ====================
async function main() {
  console.error('='.repeat(60));
  console.error('瑞数6 Cookie 求解器 v3 (全局作用域)');
  console.error('='.repeat(60));

  // Step 1: Get HTML
  console.error('\n[1] Fetching HTML...');
  const resp = await httpGet(TARGET_URL);
  console.error(`[+] Status: ${resp.statusCode}, Length: ${resp.body.length}`);
  console.error(`[+] Server cookies:`, resp.cookies);

  // Step 2: Parse
  console.error('\n[2] Parsing HTML...');
  const parsed = parseHtml(resp.body, TARGET_URL);
  console.error(`[+] Meta ID: ${parsed.metaId}`);
  console.error(`[+] $_ts.nsd: ${parsed.tsNsd}`);
  console.error(`[+] $_ts.cd: ${parsed.tsCd ? parsed.tsCd.substring(0, 50) + '...' : 'null'}`);
  console.error(`[+] JS URL: ${parsed.jsUrl}`);
  console.error(`[+] Entry Function: ${parsed.entryFunction}`);

  if (!parsed.jsUrl) {
    console.error('[!] Failed to parse HTML: no JS URL');
    return;
  }
  if (!parsed.entryFunction) {
    console.error('[!] Warning: Entry function not found, will try to find it after JS execution');
  }

  // Step 3: Download JS
  console.error('\n[3] Downloading JS...');
  const jsResp = await httpGet(parsed.jsUrl, { cookies: resp.cookies });
  console.error(`[+] JS Status: ${jsResp.statusCode}, Length: ${jsResp.body.length}`);

  // Step 4: Setup environment
  console.error('\n[4] Setting up environment...');
  const env = setupEnvironment();

  // Step 5: Register meta tag
  if (parsed.metaId && parsed.metaContent) {
    global.document.registerMeta(parsed.metaId, parsed.metaContent);
    console.error('[+] Meta registered:', parsed.metaId);
  }

  // Step 6: Execute inline script (initialize $_ts)
  console.error('\n[5] Initializing $_ts...');
  global.$_ts = global.$_ts || {};
  global.$_ts.nsd = parsed.tsNsd;
  global.$_ts.cd = parsed.tsCd;
  if (global.$_ts.lcd) global.$_ts.lcd();
  console.error('[+] $_ts keys:', Object.keys(global.$_ts));

  // Step 7: Execute external JS
  console.error('\n[6] Executing external JS...');
  const jsCode = jsResp.body;
  fs.writeFileSync('debug_rs.js', jsCode);
  console.error('[*] Saved JS to debug_rs.js (' + jsCode.length + ' chars)');

  try {
    // 使用 eval 在全局作用域执行
    eval(jsCode);
    console.error('[+] External JS executed successfully');
  } catch (e) {
    console.error('[!] JS execution error:', e.message);
    if (e.stack) console.error('[!] Stack:', e.stack.split('\n').slice(0, 8).join('\n'));
  }

  // Step 8: Check $_ts state
  console.error('\n[7] Checking $_ts state...');
  try {
    const tsKeys = Object.keys(global.$_ts);
    console.error('[+] $_ts keys:', tsKeys);
  } catch (e) {
    console.error('[!] Error:', e.message);
  }

  // Step 9: Run timers
  env.runTimers();

  // Step 10: Call entry function
  let entryFn = parsed.entryFunction;
  // If entry function wasn't parsed, try to extract from HTML end
  if (!entryFn) {
    const lastScripts = [...resp.body.matchAll(/<script[^>]*>([^<]*(_\$\w+)\(\)[^<]*)<\/script>/g)];
    for (const m of lastScripts) {
      if (!m[1].includes('$_ts')) { entryFn = m[2]; break; }
    }
    if (entryFn) console.error('[+] Found entry function from HTML:', entryFn);
  }
  // If still no entry function but cookies already generated, that's OK
  if (!entryFn && Object.keys(env.cookieJar).length > 0) {
    console.error('[+] Entry function not needed, cookies already generated');
  } else if (entryFn && typeof global[entryFn] === 'function') {
    console.error(`\n[8] Calling ${entryFn}()...`);
    try {
      const result = global[entryFn]();
      console.error(`[+] ${entryFn}() returned:`, result);
    } catch (e) {
      console.error(`[!] ${entryFn}() error:`, e.message);
      if (e.stack) console.error('[!] Stack:', e.stack.split('\n').slice(0, 8).join('\n'));
    }
  } else if (entryFn) {
    console.error(`[!] ${entryFn} is not a function, type: ${typeof global[entryFn]}`);
  } else {
    console.error('[!] No entry function found and no cookies generated');
  }

  // Run timers again
  env.runTimers();

  // Step 11: Get results
  console.error('\n[9] Collecting results...');
  const cookies = env.cookieJar;
  console.error('[+] Generated cookies:', Object.keys(cookies));

  const allCookies = { ...resp.cookies, ...cookies };
  console.error('\n' + '='.repeat(60));
  console.error('RESULT');
  console.error('='.repeat(60));
  console.error('All cookies:', JSON.stringify(allCookies, null, 2));
  const cookieHeader = Object.entries(allCookies).map(([k, v]) => `${k}=${v}`).join('; ');
  console.error('Cookie header:', cookieHeader.substring(0, 200) + '...');

  // Test: make second request with cookies
  console.error('\n[10] Testing with generated cookies...');
  let testStatus = 0;
  try {
    const testResp = await httpGet(TARGET_URL, { cookies: allCookies });
    testStatus = testResp.statusCode;
    console.error(`[+] Test status: ${testResp.statusCode}`);
    if (testResp.statusCode === 200) {
      console.error('[+] SUCCESS! Got real page content, length:', testResp.body.length);
    } else {
      console.error('[-] Still getting', testResp.statusCode);
    }
  } catch (e) {
    console.error('[!] Test request error:', e.message);
  }

  // stdout: machine-readable result (MUST be last stdout output for Python to parse)
  // console.log was suppressed in setupEnvironment, restore it
  console.log = env.origConsoleLog;
  console.log(JSON.stringify({ allCookies, cookieHeader, testStatus }));

  return { allCookies, cookieHeader };
}

main().then(() => {
  _process.exit(0);
}).catch(err => {
  console.error('Fatal:', err);
  _process.exit(1);
});

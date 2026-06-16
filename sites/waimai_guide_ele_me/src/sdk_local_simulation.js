'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const { installBrowserParity, tagNative } = require('./env/browser_parity');

const ROOT = path.resolve(__dirname, '..');
const JS_DIR = path.join(ROOT, 'assets', 'js');
const SDK_DIR = path.join(JS_DIR, 'sdk');
const CONFIG_DIR = path.join(ROOT, 'assets', 'config');
const REPORT = path.join(ROOT, 'docs', 'sdk-local-simulation.json');
const QUIET = process.argv.includes('--quiet');
const DIAGNOSTIC_CNA = process.env.ET_SAMPLE_CNA || 'DIAGNOSTIC_CNA_012345678';
const DIAGNOSTIC_UMID_TOKEN = (process.env.ET_SAMPLE_XQKP || 'FAKE_UMIDTOKEN_DIAGNOSTIC_0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcde').replace(/=+$/, '');
const DIAGNOSTIC_XQKP = `${DIAGNOSTIC_UMID_TOKEN}=`;
const DIAGNOSTIC_PAGE_URL = 'https://h5.ele.me/minisearch/result?from=mobile.default&spm=a2f6g.12273696.searchButton.1&track=&homeSearchWord=%E5%8D%A1%E6%9C%8B%E8%A5%BF%E9%A4%90&placeholder=%E5%8D%A1%E6%9C%8B%E8%A5%BF%E9%A4%90&longitude=113.298577&latitude=23.129372&geohash=ws0ed4td25qn&spm-pre=a2ogi.13162730.zebra-ele-login-module-9089118186&entry_code=1&startTime=1779509211867&keyword=%E5%8D%A1%E6%9C%8B%E8%A5%BF%E9%A4%90&refer=%E5%BA%95%E7%BA%B9%E8%AF%8D&search_extra_params=%257B%2522searchEntryCode%2522%253A1%257D';
const DIAGNOSTIC_REFERRER_URL = 'https://h5.ele.me/?spm=a2ogi.13162730.zebra-ele-login-module-9089118186&from=mobile.default&entry_code=1';
const EXPIRED_SAMPLE = {
  note: 'Expired captured sample for offline parity only; no network request is made.',
  tokenPrefix: '57663e9a0574fb90a5b58c79d80803a1',
  appKey: '12574478',
  t: '1779509212043',
  expectedSign: '8d3fa332a8e04ee6bf0504dae3f27c55',
};
const BROWSER_BASELINE = {
  bxEtLength: 469,
  locationLength: 2035,
  referrerLength: 193,
  resourceCount: 250,
  viewport: {
    innerWidth: 1248,
    innerHeight: 1293,
    outerWidth: 1264,
    outerHeight: 1388,
    screenX: 1174,
    screenY: 6,
  },
  screen: {
    width: 2560,
    height: 1440,
    availWidth: 2560,
    availHeight: 1392,
    colorDepth: 32,
    pixelDepth: 32,
  },
};

function fixedDiagnosticValue(prefix, length) {
  const seed = String(prefix || '');
  if (seed.length >= length) return seed.slice(0, length);
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
  let tail = '';
  for (let index = 0; index < length - seed.length; index += 1) {
    tail += alphabet[(index * 17 + seed.length * 11) % alphabet.length];
  }
  return seed + tail;
}

function makeLengthMatchedUrl(baseUrl, targetLength, padKey) {
  const base = String(baseUrl);
  if (base.length >= targetLength) return base.slice(0, targetLength);
  const prefix = `${base}${base.includes('?') ? '&' : '?'}${String(padKey || 'pad').replace(/[?&=]/g, '')}=`;
  return prefix + fixedDiagnosticValue('diag', Math.max(0, targetLength - prefix.length));
}

function getDiagnosticPageUrl() {
  return makeLengthMatchedUrl(DIAGNOSTIC_PAGE_URL, BROWSER_BASELINE.locationLength, 'track_pad');
}

function getDiagnosticReferrerUrl() {
  return makeLengthMatchedUrl(DIAGNOSTIC_REFERRER_URL, BROWSER_BASELINE.referrerLength, 'ref_pad');
}

function makeDiagnosticPngDataUri(length = 2118) {
  const prefix = 'data:image/png;base64,iVBORw0KGgo=';
  if (prefix.length >= length) return prefix.slice(0, length);
  return prefix + 'A'.repeat(length - prefix.length);
}

const LOAD_GROUPS = {
  awsc_et: [
    'sdk/AWSC__AWSC__awsc.js',
    'sdk/AWSC__uab__1.140.0__collina.js',
    'sdk/AWSC__WebUMID__1.93.0__um.js',
    'sdk/AWSC__et__1.83.41__et_f.js',
  ],
  baxia: [
    'sdk/sd__baxia__2.5.36__baxiaCommon.js',
    'sdk/sd__baxia__2.5.36__baxiaXhrHandler.js',
    'sdk/sd__baxia__2.5.36__baxiaFetchHandler.js',
  ],
  elecheck: [
    'elecheck-cl-loader-1.1.7.js',
    'elecheck-cl-legacy-1.1.7.js',
  ],
};

const ESM_DEPENDENCY_FILES = [
  'elecheck-cl-babel-1.1.7.js',
  'elecheck-cl-polyfill-1.1.7.js',
  'elecheck-cl-vendor-1.1.7.js',
  'elecheck-cl-1.1.7.js',
];

function makeStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      for (const key of Object.keys(store)) delete store[key];
    },
    key(index) {
      return Object.keys(store)[index] || null;
    },
    get length() {
      return Object.keys(store).length;
    },
    dump() {
      return { ...store };
    },
  };
}

function makeCookieJar(initial = {}) {
  const jar = { ...initial };
  return {
    get cookie() {
      return Object.entries(jar).map(([key, value]) => `${key}=${value}`).join('; ');
    },
    set cookie(value) {
      const pair = String(value).split(';')[0];
      const index = pair.indexOf('=');
      if (index > -1) {
        jar[pair.slice(0, index).trim()] = pair.slice(index + 1).trim();
      }
    },
    dump() {
      return { ...jar };
    },
  };
}

function makeEventTargetMethods(logs, targetName) {
  const listeners = new Map();
  return {
    __listeners: listeners,
    addEventListener(type, listener, options) {
      const eventType = String(type || '');
      if (!listeners.has(eventType)) listeners.set(eventType, []);
      if (typeof listener === 'function' || (listener && typeof listener.handleEvent === 'function')) {
        listeners.get(eventType).push({ listener, options });
      }
      logs.events = logs.events || [];
      logs.events.push({ target: targetName, type: eventType, action: 'add' });
    },
    removeEventListener(type, listener) {
      const eventType = String(type || '');
      const nextListeners = (listeners.get(eventType) || []).filter((item) => item.listener !== listener);
      listeners.set(eventType, nextListeners);
      logs.events = logs.events || [];
      logs.events.push({ target: targetName, type: eventType, action: 'remove' });
    },
    dispatchEvent(event) {
      const eventObject = event || {};
      const eventType = String(eventObject.type || '');
      logs.events = logs.events || [];
      logs.events.push({ target: targetName, type: eventType, action: 'dispatch' });
      if (!eventObject.target) eventObject.target = this;
      if (!eventObject.currentTarget) eventObject.currentTarget = this;
      const targets = [...(listeners.get(eventType) || [])];
      for (const item of targets) {
        try {
          if (typeof item.listener === 'function') item.listener.call(this, eventObject);
          else item.listener.handleEvent.call(item.listener, eventObject);
        } catch (error) {
          logs.console.push({
            level: 'eventError',
            items: [targetName, eventType, error && error.message ? error.message : String(error)],
          });
        }
      }
      return true;
    },
  };
}

function makePerformanceTiming() {
  const navigationStart = 1779514671625;
  return {
    navigationStart,
    unloadEventStart: navigationStart,
    unloadEventEnd: navigationStart,
    redirectStart: 0,
    redirectEnd: 0,
    fetchStart: navigationStart + 1,
    domainLookupStart: navigationStart + 1,
    domainLookupEnd: navigationStart + 1,
    connectStart: navigationStart + 1,
    connectEnd: navigationStart + 1,
    secureConnectionStart: navigationStart + 1,
    requestStart: navigationStart + 4,
    responseStart: navigationStart + 170,
    responseEnd: navigationStart + 184,
    domLoading: navigationStart + 191,
    domInteractive: navigationStart + 286,
    domContentLoadedEventStart: navigationStart + 286,
    domContentLoadedEventEnd: navigationStart + 287,
    domComplete: navigationStart + 397,
    loadEventStart: navigationStart + 397,
    loadEventEnd: navigationStart + 397,
  };
}

function makePerformanceObject() {
  const timing = makePerformanceTiming();
  const navigationEntry = {
    name: getDiagnosticPageUrl(),
    entryType: 'navigation',
    startTime: 0,
    duration: timing.loadEventEnd - timing.navigationStart,
    initiatorType: 'navigation',
    nextHopProtocol: 'h2',
    type: 'back_forward',
    redirectCount: 0,
    toJSON() {
      return { ...this };
    },
  };
  const baseResources = [
    'https://g.alicdn.com/AWSC/AWSC/awsc.js',
    'https://g.alicdn.com/AWSC/et/1.83.41/et_f.js',
    'https://h5-data.elemecdn.com/ele-check-h5-config/config/zh_CN.json',
  ];
  const resourceEntries = Array.from({ length: BROWSER_BASELINE.resourceCount }, (_, index) => ({
    name: baseResources[index] || `https://h5.ele.me/diagnostic/resource-${String(index).padStart(3, '0')}.js`,
    entryType: 'resource',
    startTime: 35 + index * 17,
    duration: 12 + index,
    initiatorType: index === 2 ? 'xmlhttprequest' : 'script',
    nextHopProtocol: 'h2',
    transferSize: 2048 + index * 512,
    encodedBodySize: 1800 + index * 400,
    decodedBodySize: 3600 + index * 700,
    toJSON() {
      return { ...this };
    },
  }));
  return {
    now: () => Date.now() - timing.navigationStart,
    timeOrigin: timing.navigationStart + 0.6,
    timing,
    navigation: { type: 2, redirectCount: 0 },
    memory: {},
    getEntriesByType(type) {
      const name = String(type || '');
      if (name === 'navigation') return [navigationEntry];
      if (name === 'resource') return resourceEntries;
      return [];
    },
    getEntries() {
      return [navigationEntry, ...resourceEntries];
    },
    mark() {},
    measure() {},
    clearMarks() {},
    clearMeasures() {},
  };
}

function makeIndexedDB() {
  const laoheIdbStores = new Map();

  function makeRequest(resultFactory) {
    const request = {
      result: undefined,
      error: null,
      onsuccess: null,
      onerror: null,
      onupgradeneeded: null,
    };
    setTimeout(() => {
      try {
        request.result = typeof resultFactory === 'function' ? resultFactory(request) : resultFactory;
        if (typeof request.onsuccess === 'function') {
          request.onsuccess({ target: request });
        }
      } catch (error) {
        request.error = error;
        if (typeof request.onerror === 'function') {
          request.onerror({ target: request, preventDefault() {} });
        }
      }
    }, 0);
    return request;
  }

  function getStore(name) {
    if (!laoheIdbStores.has(name)) laoheIdbStores.set(name, new Map());
    return laoheIdbStores.get(name);
  }

  function makeObjectStore(name) {
    const store = getStore(name);
    return {
      get(key) {
        return makeRequest(store.get(key));
      },
      put(value, key) {
        return makeRequest(() => {
          store.set(key, value);
          return key;
        });
      },
      delete(key) {
        return makeRequest(() => {
          store.delete(key);
          return undefined;
        });
      },
      clear() {
        return makeRequest(() => {
          store.clear();
          return undefined;
        });
      },
      count() {
        return makeRequest(store.size);
      },
    };
  }

  function makeDb() {
    const db = {
      version: 1,
      close() {},
      createObjectStore(name) {
        getStore(name);
        return makeObjectStore(name);
      },
      transaction(name) {
        return {
          objectStore() {
            return makeObjectStore(Array.isArray(name) ? name[0] : name);
          },
        };
      },
    };
    db.objectStoreNames = {
      contains(name) {
        return laoheIdbStores.has(name);
      },
    };
    return db;
  }

  return {
    open(name) {
      return makeRequest((request) => {
        const db = makeDb(name);
        if (typeof request.onupgradeneeded === 'function') {
          request.result = db;
          request.onupgradeneeded({ target: request, oldVersion: 0, newVersion: 1 });
        }
        return db;
      });
    },
    deleteDatabase() {
      return makeRequest(undefined);
    },
  };
}

function makeElement(tagName, logs) {
  const normalizedTag = String(tagName || '').toUpperCase();
  const events = makeEventTargetMethods(logs, normalizedTag || 'element');
  const element = {
    tagName: normalizedTag,
    nodeName: normalizedTag,
    nodeType: 1,
    style: {},
    children: [],
    attributes: {},
    parentNode: null,
    childNodes: [],
    className: '',
    id: '',
    async: false,
    type: '',
    charset: '',
    crossOrigin: '',
    readyState: 'complete',
    setAttribute(key, value) {
      this.attributes[key] = String(value);
      if (key === 'src' || key === 'href') this[key] = String(value);
    },
    getAttribute(key) {
      return this.attributes[key] || this[key] || null;
    },
    appendChild(child) {
      child.parentNode = this;
      this.children.push(child);
      this.childNodes.push(child);
      if (child && (child.src || child.href)) {
        logs.dynamicResources.push({
          parent: this.tagName,
          tag: child.tagName,
          src: child.src || child.href,
        });
      }
      if (child && typeof child.onload === 'function') {
        setTimeout(() => child.onload({ type: 'load' }), 0);
      }
      return child;
    },
    insertBefore(child) {
      return this.appendChild(child);
    },
    removeChild(child) {
      this.children = this.children.filter((item) => item !== child);
      this.childNodes = this.childNodes.filter((item) => item !== child);
      return child;
    },
    addEventListener: events.addEventListener,
    removeEventListener: events.removeEventListener,
    dispatchEvent: events.dispatchEvent,
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    getContext(type) {
      const contextType = String(type || '2d').toLowerCase();
      if (contextType.includes('webgl')) {
        const debugInfo = {
          UNMASKED_VENDOR_WEBGL: 0x9245,
          UNMASKED_RENDERER_WEBGL: 0x9246,
        };
        return {
          canvas: this,
          drawingBufferWidth: 1920,
          drawingBufferHeight: 1080,
          getExtension(name) {
            return String(name) === 'WEBGL_debug_renderer_info' ? debugInfo : null;
          },
          getParameter(parameter) {
            if (parameter === debugInfo.UNMASKED_VENDOR_WEBGL) return 'Google Inc. (NVIDIA)';
            if (parameter === debugInfo.UNMASKED_RENDERER_WEBGL) return 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Ti (0x00002803) Direct3D11 vs_5_0 ps_5_0, D3D11)';
            if (parameter === 0x1f00) return 'WebKit';
            if (parameter === 0x1f01) return 'WebKit WebGL';
            if (parameter === 0x1f02) return 'WebGL 1.0 (OpenGL ES 2.0 Chromium)';
            return 0;
          },
          getSupportedExtensions() {
            return ['WEBGL_debug_renderer_info', 'OES_texture_float', 'OES_standard_derivatives'];
          },
          createBuffer() {
            return {};
          },
          bindBuffer() {},
          bufferData() {},
          clearColor() {},
          clear() {},
          enable() {},
          disable() {},
          viewport() {},
        };
      }
      return {
        fillRect() {},
        fillText() {},
        measureText() {
          return { width: 126.421875 };
        },
        getImageData() {
          return { data: new Uint8ClampedArray((this.canvas && this.canvas.width ? this.canvas.width : 300) * (this.canvas && this.canvas.height ? this.canvas.height : 150) * 4) };
        },
      };
    },
    toDataURL() {
      return makeDiagnosticPngDataUri();
    },
  };
  if (normalizedTag === 'CANVAS') {
    element.width = 300;
    element.height = 150;
  }
  Object.defineProperty(element, '__listeners', {
    value: events.__listeners,
    configurable: true,
  });
  return element;
}

function summarizeError(error) {
  const text = error && error.stack ? error.stack : String(error);
  return text.split('\n').slice(0, 6).map((line) => (
    line.length > 800 ? `${line.slice(0, 800)}...<truncated>` : line
  )).join('\n');
}

function digestDiagnosticValue(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return {
    type: typeof value,
    length: text ? text.length : 0,
    sha256_16: text ? crypto.createHash('sha256').update(text).digest('hex').slice(0, 16) : null,
  };
}

function redactDiagnosticUrl(value) {
  return String(value).replace(/([?&]token=)([^&]+)/g, (_match, prefix, token) => {
    const digest = digestDiagnosticValue(decodeURIComponent(token));
    return `${prefix}<redacted:${digest.length}:${digest.sha256_16}>`;
  });
}

function readLocalJsonText(filename, fallback = '{}') {
  try {
    return fs.readFileSync(path.join(CONFIG_DIR, filename), 'utf8');
  } catch (_) {
    return fallback;
  }
}

function makeGenericBrowserCtor(name) {
  const ctor = tagNative(function BrowserAutoCtor() {}, name);
  try {
    Object.defineProperty(ctor, 'name', { value: name, configurable: true });
  } catch (_) {}
  Object.defineProperty(ctor.prototype, 'constructor', {
    value: ctor,
    configurable: true,
    writable: true,
  });
  return ctor;
}

function installWindowConstructorProxy(sandbox, logs) {
  const blocked = new Set(['Buffer', 'process', 'require', 'module', 'exports']);
  const munianAutoCtors = new Map();
  const proxy = new Proxy(sandbox, {
    get(target, prop, receiver) {
      if (typeof prop === 'string'
        && !blocked.has(prop)
        && !(prop in target)
        && /^[A-Z][A-Za-z0-9_]*$/.test(prop)) {
        if (!munianAutoCtors.has(prop)) {
          munianAutoCtors.set(prop, makeGenericBrowserCtor(prop));
          logs.autoConstructors = logs.autoConstructors || [];
          logs.autoConstructors.push(prop);
        }
        return munianAutoCtors.get(prop);
      }
      return Reflect.get(target, prop, receiver);
    },
    has(target, prop) {
      if (typeof prop === 'string' && munianAutoCtors.has(prop)) return true;
      return Reflect.has(target, prop);
    },
  });
  sandbox.window = proxy;
  sandbox.self = proxy;
  sandbox.top = proxy;
  sandbox.parent = proxy;
  sandbox.globalThis = proxy;
  return sandbox;
}

function laoheMakeSimulationSandbox() {
  const logs = {
    dynamicResources: [],
    xhr: [],
    fetch: [],
    image: [],
    console: [],
    timers: [],
    windowMisses: [],
  };
  const cookieJar = makeCookieJar({
    ubt_ssid: fixedDiagnosticValue('ubt_ssid_', 43),
    perf_ssid: fixedDiagnosticValue('perf_ssid_', 43),
    _bl_uid: fixedDiagnosticValue('bluid_', 28),
    xlly_s: '1',
    __ebg_utdid: fixedDiagnosticValue('00000000-0000-4000-8000-', 50),
    cna: DIAGNOSTIC_CNA,
    t: '44ba22a44feb01dc79b0779350735209',
    app_cityid: '14',
    from: 'mobile.default',
    xqkp: DIAGNOSTIC_XQKP,
    _tb_token_: 'ef5651e87b6e7',
    munb: fixedDiagnosticValue('1921057897231', 13),
    unb: fixedDiagnosticValue('1921057897231', 13),
    ucn: fixedDiagnosticValue('center', 8),
    isg: fixedDiagnosticValue('ISG_', 64),
    __ebg_uid: fixedDiagnosticValue('310136287', 9),
    tfstk: fixedDiagnosticValue('g', 469),
  });
  const localStorage = makeStorage({
    'web_behavior_time': '0',
    'TiGa-ELEME_ElemeMiniApp': JSON.stringify(JSON.stringify({ data: { cityId: 4 } })),
    ETLCD: 'false',
    syfhs: '2726357728',
    auyst: '1779512967',
    B: '0&ut01er',
  });
  const sessionStorage = makeStorage();
  const head = makeElement('head', logs);
  const body = makeElement('body', logs);
  const documentElement = makeElement('html', logs);
  const firstScript = makeElement('script', logs);
  Object.assign(documentElement, {
    clientWidth: BROWSER_BASELINE.viewport.innerWidth,
    clientHeight: BROWSER_BASELINE.viewport.innerHeight,
    scrollWidth: BROWSER_BASELINE.viewport.innerWidth,
    scrollHeight: BROWSER_BASELINE.viewport.innerHeight,
    offsetWidth: BROWSER_BASELINE.viewport.innerWidth,
    offsetHeight: BROWSER_BASELINE.viewport.innerHeight,
  });
  Object.assign(body, {
    clientWidth: BROWSER_BASELINE.viewport.innerWidth,
    clientHeight: BROWSER_BASELINE.viewport.innerHeight,
    scrollWidth: BROWSER_BASELINE.viewport.innerWidth,
    scrollHeight: BROWSER_BASELINE.viewport.innerHeight,
    offsetWidth: BROWSER_BASELINE.viewport.innerWidth,
    offsetHeight: BROWSER_BASELINE.viewport.innerHeight,
  });
  firstScript.parentNode = head;

  function XMLHttpRequest() {
    this.headers = {};
    this.readyState = 0;
    this.status = 200;
    this.responseText = '{}';
    this.response = '{}';
  }
  XMLHttpRequest.prototype.open = function open(method, url) {
    this.method = method;
    this.url = url;
    logs.xhr.push({ method, url, type: 'open' });
  };
  XMLHttpRequest.prototype.send = function send(bodyValue) {
    logs.xhr.push({ method: this.method, url: this.url, body: bodyValue || null, type: 'send' });
    if (String(this.url || '').includes('/ele-check-h5-config/config/zh_CN.json')) {
      this.responseText = readLocalJsonText('elecheck-zh_CN.json');
      this.response = this.responseText;
    }
    this.readyState = 4;
    if (typeof this.onreadystatechange === 'function') this.onreadystatechange({ type: 'readystatechange' });
    if (typeof this.onload === 'function') this.onload({ type: 'load' });
    if (typeof this.onloadend === 'function') this.onloadend({ type: 'loadend' });
  };
  XMLHttpRequest.prototype.setRequestHeader = function setRequestHeader(key, value) {
    this.headers[key] = value;
  };
  XMLHttpRequest.prototype.getResponseHeader = function getResponseHeader() {
    return 'application/json';
  };
  XMLHttpRequest.prototype.addEventListener = function addEventListener() {};
  XMLHttpRequest.prototype.removeEventListener = function removeEventListener() {};

  const diagnosticPageUrl = getDiagnosticPageUrl();
  const diagnosticReferrerUrl = getDiagnosticReferrerUrl();
  const diagnosticUrl = new URL(diagnosticPageUrl);
  const locationObject = {
    href: diagnosticUrl.href,
    origin: 'https://h5.ele.me',
    protocol: 'https:',
    host: 'h5.ele.me',
    hostname: 'h5.ele.me',
    port: '',
    pathname: diagnosticUrl.pathname,
    search: diagnosticUrl.search,
    hash: diagnosticUrl.hash,
    reload() {},
    assign(value) {
      this.href = String(value);
    },
    replace(value) {
      this.href = String(value);
    },
    toString() {
      return this.href;
    },
  };

  const documentEvents = makeEventTargetMethods(logs, 'document');
  const document = {
    referrer: diagnosticReferrerUrl,
    title: 'diagnostic',
    readyState: 'complete',
    hidden: false,
    visibilityState: 'visible',
    compatMode: 'CSS1Compat',
    characterSet: 'UTF-8',
    charset: 'UTF-8',
    inputEncoding: 'UTF-8',
    contentType: 'text/html',
    dir: '',
    URL: diagnosticPageUrl,
    documentURI: diagnosticPageUrl,
    nodeType: 9,
    nodeName: '#document',
    head,
    body,
    documentElement,
    firstElementChild: documentElement,
    currentScript: { src: 'https://g.alicdn.com/AWSC/AWSC/awsc.js' },
    domain: 'h5.ele.me',
    createElement(tag) {
      const element = makeElement(tag, logs);
      if (String(tag).toLowerCase() === 'style') {
        element.styleSheet = { cssText: '' };
      }
      return element;
    },
    createTextNode(text) {
      return {
        nodeType: 3,
        textContent: String(text),
        nodeValue: String(text),
        parentNode: null,
      };
    },
    createEvent() {
      return { initEvent() {} };
    },
    getElementsByTagName(name) {
      const lowered = String(name).toLowerCase();
      if (lowered === 'head') return [head];
      if (lowered === 'body') return [body];
      if (lowered === 'script') return [firstScript];
      return [];
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    getElementById() {
      return null;
    },
    addEventListener: documentEvents.addEventListener,
    removeEventListener: documentEvents.removeEventListener,
    dispatchEvent: documentEvents.dispatchEvent,
  };
  Object.defineProperty(document, 'cookie', {
    get() {
      return cookieJar.cookie;
    },
    set(value) {
      cookieJar.cookie = value;
    },
  });

  const windowEvents = makeEventTargetMethods(logs, 'window');
  const sandbox = {
    console: {
      log: (...items) => logs.console.push({ level: 'log', items: items.map(String) }),
      info: (...items) => logs.console.push({ level: 'info', items: items.map(String) }),
      warn: (...items) => logs.console.push({ level: 'warn', items: items.map(String) }),
      error: (...items) => logs.console.push({ level: 'error', items: items.map(String) }),
      debug: (...items) => logs.console.push({ level: 'debug', items: items.map(String) }),
      group: (...items) => logs.console.push({ level: 'group', items: items.map(String) }),
      groupCollapsed: (...items) => logs.console.push({ level: 'groupCollapsed', items: items.map(String) }),
      groupEnd: (...items) => logs.console.push({ level: 'groupEnd', items: items.map(String) }),
      table: (...items) => logs.console.push({ level: 'table', items: items.map(String) }),
      trace: (...items) => logs.console.push({ level: 'trace', items: items.map(String) }),
      assert: (condition, ...items) => {
        if (!condition) logs.console.push({ level: 'assert', items: items.map(String) });
      },
    },
    setTimeout(fn, ms) {
      logs.timers.push({ type: 'setTimeout', ms });
      return setTimeout(typeof fn === 'function' ? fn : () => {}, Math.min(Number(ms) || 0, 5));
    },
    clearTimeout,
    setInterval(fn, ms) {
      logs.timers.push({ type: 'setInterval', ms });
      return setTimeout(typeof fn === 'function' ? fn : () => {}, Math.min(Number(ms) || 0, 5));
    },
    clearInterval,
    URL,
    URLSearchParams,
    TextEncoder,
    TextDecoder,
    ArrayBuffer,
    Uint8Array,
    Uint8ClampedArray,
    Int8Array,
    Blob: function Blob(parts = []) {
      this.parts = parts;
      this.size = parts.reduce((sum, item) => sum + String(item).length, 0);
    },
    FileReader: function FileReader() {
      this.readAsText = () => {
        this.result = '';
        if (typeof this.onload === 'function') this.onload();
      };
    },
    Buffer,
    btoa(value) {
      return Buffer.from(String(value), 'binary').toString('base64');
    },
    atob(value) {
      return Buffer.from(String(value), 'base64').toString('binary');
    },
    localStorage,
    sessionStorage,
    navigator: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
      appName: 'Netscape',
      appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
      language: 'zh-CN',
      languages: ['zh-CN', 'zh'],
      platform: 'Win32',
      cookieEnabled: true,
      onLine: true,
      webdriver: false,
      hardwareConcurrency: 24,
      deviceMemory: 32,
      doNotTrack: null,
      plugins: [],
      mimeTypes: [],
      javaEnabled() {
        return false;
      },
    },
    location: locationObject,
    document,
    screen: {
      width: BROWSER_BASELINE.screen.width,
      height: BROWSER_BASELINE.screen.height,
      availWidth: BROWSER_BASELINE.screen.availWidth,
      availHeight: BROWSER_BASELINE.screen.availHeight,
      colorDepth: BROWSER_BASELINE.screen.colorDepth,
      pixelDepth: BROWSER_BASELINE.screen.pixelDepth,
      isExtended: true,
      orientation: {
        angle: 0,
        type: 'landscape-primary',
        onchange: null,
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {
          return true;
        },
      },
    },
    history: {
      length: 7,
      state: null,
      pushState() {},
      replaceState() {},
      back() {},
      forward() {},
      go() {},
    },
    addEventListener: windowEvents.addEventListener,
    removeEventListener: windowEvents.removeEventListener,
    dispatchEvent: windowEvents.dispatchEvent,
    performance: makePerformanceObject(),
    crypto: {
      getRandomValues(target) {
        return crypto.webcrypto.getRandomValues(target);
      },
      randomUUID() {
        return crypto.randomUUID();
      },
      subtle: crypto.webcrypto.subtle,
    },
    XMLHttpRequest,
    fetch(url, options = {}) {
      logs.fetch.push({ url: String(url), method: options.method || 'GET' });
      return Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{}'),
        json: () => Promise.resolve({}),
        clone() {
          return this;
        },
        headers: { get: () => 'application/json' },
      });
    },
    Image: function Image() {
      const image = makeElement('img', logs);
      Object.defineProperty(image, 'src', {
        get() {
          return this._src || '';
        },
        set(value) {
          this._src = String(value);
          logs.image.push(this._src);
          if (typeof this.onload === 'function') setTimeout(() => this.onload({ type: 'load' }), 0);
        },
      });
      return image;
    },
    Event: function Event(type) {
      this.type = type;
    },
    CustomEvent: function CustomEvent(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    },
    MutationObserver: function MutationObserver() {
      this.observe = function observe() {};
      this.disconnect = function disconnect() {};
    },
    indexedDB: makeIndexedDB(),
    IDBKeyRange: {
      only(value) {
        return { only: value };
      },
      bound(lower, upper) {
        return { lower, upper };
      },
    },
    openDatabase() {
      return null;
    },
    getComputedStyle() {
      return { getPropertyValue: () => '' };
    },
    etReady(callback) {
      this.__etReady = true;
      if (typeof callback === 'function') setTimeout(callback, 0);
    },
    __etReady: true,
    __etProbe(...items) {
      logs.console.push({ level: 'probe', items: items.map(String) });
    },
    __protoProbe(value, name) {
      if (value === undefined || value === null) {
        logs.console.push({ level: 'probe', items: ['[ET_PROTO_DOT_MISS]', String(name), String(value)] });
        return function MissingPrototypeOwner() {};
      }
      return value;
    },
    __callProbe(owner, key, label) {
      let fn = owner != null ? owner[key] : undefined;
      if (typeof fn !== 'function' && owner != null) {
        try {
          const boxed = Object(owner);
          const boxedFn = boxed[key];
          if (typeof boxedFn === 'function') fn = boxedFn;
        } catch (_) {}
      }
      if (typeof fn !== 'function') {
        let keys = '';
        try {
          keys = owner != null ? Object.getOwnPropertyNames(Object(owner)).slice(0, 24).join(',') : '';
        } catch (_) {}
        let tag = '';
        try {
          tag = Object.prototype.toString.call(owner);
        } catch (_) {}
      logs.console.push({
        level: 'probe',
        items: ['[ET_CALL_MISS]', String(label), typeof owner, String(key), typeof fn, tag, keys],
      });
      return function MissingCallTarget() {};
    }
      return fn.bind(owner);
    },
    __simulationLogs: logs,
    __cookieJar: cookieJar,
    innerWidth: BROWSER_BASELINE.viewport.innerWidth,
    innerHeight: BROWSER_BASELINE.viewport.innerHeight,
    outerWidth: BROWSER_BASELINE.viewport.outerWidth,
    outerHeight: BROWSER_BASELINE.viewport.outerHeight,
    devicePixelRatio: 1,
    pageXOffset: 0,
    pageYOffset: 0,
    scrollX: 0,
    scrollY: 0,
    screenX: BROWSER_BASELINE.viewport.screenX,
    screenY: BROWSER_BASELINE.viewport.screenY,
    mozInnerScreenX: BROWSER_BASELINE.viewport.screenX,
    mozInnerScreenY: BROWSER_BASELINE.viewport.screenY,
    visualViewport: {
      width: BROWSER_BASELINE.viewport.innerWidth,
      height: BROWSER_BASELINE.viewport.innerHeight,
      scale: 1,
      offsetLeft: 0,
      offsetTop: 0,
      pageLeft: 0,
      pageTop: 0,
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return true;
      },
    },
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.global = sandbox;
  sandbox.top = sandbox;
  sandbox.parent = sandbox;
  return installBrowserParity(sandbox, logs);
}

function snapshotGlobals(sandbox) {
  const names = [
    'AWSC',
    'AWSCInner',
    '__etModule',
    '__fyModule',
    '__uabModule',
    '__umidModule',
    'etSign',
    'x_check',
    'baxiaCommon',
    'lib',
    'EBridgeClientAPI',
  ];
  const result = {};
  for (const name of names) {
    const value = sandbox[name];
    result[name] = value === undefined ? 'undefined' : typeof value;
  }
  return result;
}

function listOwnGlobals(sandbox) {
  return Object.getOwnPropertyNames(sandbox)
    .filter((name) => !name.startsWith('__simulation'))
    .sort();
}

function scanStaticDependencies(relativePath) {
  const absolutePath = path.join(JS_DIR, relativePath);
  try {
    const code = fs.readFileSync(absolutePath, 'utf8');
    const deps = new Set();
    for (const match of code.matchAll(/(?:\.\/)?cl_[A-Za-z0-9_-]+\.js/g)) {
      deps.add(match[0]);
    }
    for (const match of code.matchAll(/https?:\/\/[^'"\\)\s]+/g)) {
      deps.add(match[0]);
    }
    for (const match of code.matchAll(/\/\/g\.alicdn\.com\/[^'"\\)\s]+/g)) {
      deps.add(match[0]);
    }
    return [...deps].sort();
  } catch (error) {
    return [`<read failed: ${error && error.message ? error.message : String(error)}>`];
  }
}

function runScript(context, sandbox, relativePath) {
  const absolutePath = path.join(JS_DIR, relativePath);
  const before = snapshotGlobals(sandbox);
  const beforeNames = listOwnGlobals(sandbox);
  try {
    sandbox.document.currentScript = {
      src: `https://local.invalid/${relativePath.replace(/\\/g, '/')}`,
    };
    let code = fs.readFileSync(absolutePath, 'utf8');
    if (relativePath.includes('AWSC__et__1.83.41__et_f.js') && process.env.ET_DIAG_INSTRUMENT === '1') {
      code = code.replace(
        /\b([A-Za-z_$][\w$]*)\.prototype\b/g,
        '__protoProbe($1,"$1").prototype',
      );
      code = code.replace(
        'q=se[Be](Ve),Zc=q?170624:239488',
        'try{console.log("[ET_PROBE]",typeof se,Be,Ve,se&&Object.prototype.toString.call(se),se&&Object.keys(se).slice(0,20).join(","))}catch(_laoheEtProbe){};q=se[Be](Ve),Zc=q?170624:239488',
      );
      code = code.replace(
        'case 37:pe=Te[we],Zc=pe?225409:12608;break;',
        'case 37:try{__etProbe("[ET_PROTO_PROBE]",typeof Te,typeof we)}catch(_laoheEtProtoProbe){};pe=Te[we],Zc=pe?225409:12608;break;',
      );
      code = code.replace(
        'case 51:ue=Be[Ie](Ve),Zc=107648;break;',
        'case 51:try{__etProbe("[ET_PROTO_CALL_PROBE]",typeof Be,typeof Ie,typeof Ve)}catch(_laoheEtProtoCallProbe){};ue=Be[Ie](Ve),Zc=107648;break;',
      );
      code = code.replace(
        /rr\[ke\]\(\)/g,
        '__callProbe(rr,ke,"rr[ke]")()',
      );
      code = code.replace(
        /\b([A-Za-z_$][\w$]*)\[([A-Za-z_$][\w$]*)\]\(/g,
        (match, ownerName, keyName, offset, source) => {
          const prefix = source.slice(Math.max(0, offset - 8), offset);
          if (/new\s+$/.test(prefix)) return match;
          return `__callProbe(${ownerName},${keyName},"${ownerName}[${keyName}]")(`;
        },
      );
    }
    vm.runInContext(code, context, {
      filename: absolutePath,
      timeout: 12000,
    });
    const afterNames = listOwnGlobals(sandbox);
    return {
      file: relativePath,
      ok: true,
      bytes: Buffer.byteLength(code, 'utf8'),
      before,
      after: snapshotGlobals(sandbox),
      addedGlobals: afterNames.filter((name) => !beforeNames.includes(name)).slice(0, 120),
    };
  } catch (error) {
    const afterNames = listOwnGlobals(sandbox);
    return {
      file: relativePath,
      ok: false,
      before,
      after: snapshotGlobals(sandbox),
      addedGlobals: afterNames.filter((name) => !beforeNames.includes(name)).slice(0, 120),
      error: summarizeError(error),
    };
  }
}

function probeAwscFeature(sandbox, feature) {
  return new Promise((resolve) => {
    if (!sandbox.AWSC || typeof sandbox.AWSC.use !== 'function') {
      resolve({ feature, ok: false, error: 'AWSC.use unavailable' });
      return;
    }
    let done = false;
    const timer = setTimeout(() => {
      if (!done) {
        done = true;
        resolve({ feature, ok: false, error: 'timeout' });
      }
    }, 30);
    try {
      sandbox.AWSC.use(feature, (state, mod) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        const info = { feature, ok: state === 'loaded', state, moduleType: typeof mod };
        if (mod && typeof mod === 'object') {
          info.keys = Object.keys(mod).slice(0, 12);
          if (feature === 'uab' && typeof mod.getUA === 'function') {
            try {
              info.fakeUA = {
                ok: true,
                redacted: true,
                digest: digestDiagnosticValue(mod.getUA({ appName: 'diagnostic' })),
              };
            } catch (error) {
              info.fakeUAError = error && error.message ? error.message : String(error);
            }
          }
        }
        resolve(info);
      }, { timeout: 25 });
    } catch (error) {
      clearTimeout(timer);
      resolve({ feature, ok: false, error: error && error.message ? error.message : String(error) });
    }
  });
}

function makeFakeMtopParams() {
  const appKey = EXPIRED_SAMPLE.appKey;
  const t = EXPIRED_SAMPLE.t;
  const data = JSON.stringify({
    type: 'originaljson',
    appId: '26551',
    params: JSON.stringify({
      _input_charset: 'UTF-8',
      _output_charset: 'UTF-8',
      gatewayApiType: 'mtop',
      mtop_api_version: '1.0',
      appId: '26551',
      'x-ele-scene': 'search',
      channelCode: '0',
      platform: '999',
      alipayChannel: 1,
      sversion: '15.0',
      limit: 5,
      n: 5,
      page: 1,
      locationSource: 'taobao',
      latitude: '23.129372',
      longitude: '113.298577',
      keyword: '\u5361\u670b\u897f\u9910',
      refer: '\u5e95\u7eb9\u8bcd',
      searchEntryCode: '1',
      searchExtraParams: '{"searchEntryCode":1}',
      fixSearch: '1',
      storeParams: '{}',
      searchMode: 1,
    }),
  });
  const signInput = `${EXPIRED_SAMPLE.tokenPrefix}&${t}&${appKey}&${data}`;
  const sign = crypto.createHash('md5').update(signInput).digest('hex');
  return {
    t,
    appKey,
    data,
    sign,
    expectedSign: EXPIRED_SAMPLE.expectedSign,
    signMatchesExpiredSample: sign === EXPIRED_SAMPLE.expectedSign,
    signInputPreview: `<expired_m_h5_tk_prefix>&${t}&${appKey}&<data:${data.length}>`,
  };
}

function callFunctionSafe(label, fn) {
  try {
    const value = fn();
    if (value === undefined) {
      return { ok: false, value: null, error: `${label} returned undefined` };
    }
    return { ok: true, value };
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }
}

function callSensitiveFunctionSafe(label, fn) {
  try {
    const value = fn();
    if (value === undefined) {
      return { ok: false, value: null, error: `${label} returned undefined` };
    }
    return { ok: true, redacted: true, digest: digestDiagnosticValue(value) };
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }
}

function makeDiagnosticEvent(sandbox, type, overrides = {}) {
  const baseTime = Math.max(1, Math.floor(sandbox.performance.now()));
  const target = overrides.target || sandbox.document.body;
  const event = {
    type,
    bubbles: true,
    cancelable: true,
    composed: true,
    isTrusted: false,
    timeStamp: baseTime + (overrides.offset || 0),
    target,
    currentTarget: null,
    srcElement: target,
    view: sandbox.window,
    detail: overrides.detail || 0,
    screenX: overrides.screenX || 1284,
    screenY: overrides.screenY || 642,
    clientX: overrides.clientX || 110,
    clientY: overrides.clientY || 240,
    pageX: overrides.pageX || overrides.clientX || 110,
    pageY: overrides.pageY || overrides.clientY || 240,
    offsetX: overrides.offsetX || 10,
    offsetY: overrides.offsetY || 12,
    movementX: overrides.movementX || 0,
    movementY: overrides.movementY || 0,
    button: overrides.button || 0,
    buttons: overrides.buttons || 0,
    which: overrides.which || 1,
    key: overrides.key || '',
    code: overrides.code || '',
    keyCode: overrides.keyCode || 0,
    charCode: overrides.charCode || 0,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
    touches: overrides.touches || [],
    targetTouches: overrides.targetTouches || [],
    changedTouches: overrides.changedTouches || [],
    preventDefault() {},
    stopPropagation() {},
    stopImmediatePropagation() {},
    composedPath() {
      return [target, sandbox.document.body, sandbox.document, sandbox.window].filter(Boolean);
    },
  };
  return Object.assign(event, overrides);
}

function seedEtBehavior(sandbox) {
  const munianBehaviorEvents = [
    ['mousemove', sandbox.document, { clientX: 98, clientY: 214, screenX: 1272, screenY: 620, offset: 3 }],
    ['mousemove', sandbox.document, { clientX: 146, clientY: 233, screenX: 1320, screenY: 639, movementX: 48, movementY: 19, offset: 18 }],
    ['mousedown', sandbox.document, { clientX: 146, clientY: 233, screenX: 1320, screenY: 639, buttons: 1, offset: 31 }],
    ['mousedown', sandbox.window, { clientX: 146, clientY: 233, screenX: 1320, screenY: 639, buttons: 1, offset: 32 }],
    ['mouseup', sandbox.document, { clientX: 146, clientY: 233, screenX: 1320, screenY: 639, offset: 48 }],
    ['mouseup', sandbox.window, { clientX: 146, clientY: 233, screenX: 1320, screenY: 639, offset: 49 }],
    ['click', sandbox.document, { clientX: 146, clientY: 233, screenX: 1320, screenY: 639, detail: 1, offset: 52 }],
    ['keydown', sandbox.document, { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, offset: 74 }],
    ['keyup', sandbox.document, { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, offset: 82 }],
    ['touchstart', sandbox.document, {
      touches: [{ identifier: 1, clientX: 146, clientY: 233, screenX: 1320, screenY: 639, pageX: 146, pageY: 233 }],
      targetTouches: [{ identifier: 1, clientX: 146, clientY: 233, screenX: 1320, screenY: 639, pageX: 146, pageY: 233 }],
      changedTouches: [{ identifier: 1, clientX: 146, clientY: 233, screenX: 1320, screenY: 639, pageX: 146, pageY: 233 }],
      offset: 88,
    }],
    ['touchmove', sandbox.document, {
      touches: [{ identifier: 1, clientX: 152, clientY: 241, screenX: 1326, screenY: 647, pageX: 152, pageY: 241 }],
      targetTouches: [{ identifier: 1, clientX: 152, clientY: 241, screenX: 1326, screenY: 647, pageX: 152, pageY: 241 }],
      changedTouches: [{ identifier: 1, clientX: 152, clientY: 241, screenX: 1326, screenY: 647, pageX: 152, pageY: 241 }],
      offset: 93,
    }],
    ['DOMMouseScroll', sandbox.document, { detail: 1, wheelDelta: -120, deltaY: 120, offset: 94 }],
    ['scroll', sandbox.window, { target: sandbox.document, offset: 96 }],
    ['resize', sandbox.window, { target: sandbox.window, offset: 99 }],
    ['focus', sandbox.window, { target: sandbox.window, offset: 104 }],
  ];
  let dispatched = 0;
  for (const [type, target, overrides] of munianBehaviorEvents) {
    if (target && typeof target.dispatchEvent === 'function') {
      target.dispatchEvent(makeDiagnosticEvent(sandbox, type, overrides));
      dispatched += 1;
    }
  }
  const extraMoves = Math.max(0, Number(process.env.ET_EXTRA_MOVES || 0) || 0);
  for (let index = 0; index < extraMoves; index += 1) {
    const offset = 120 + index * 7;
    sandbox.document.dispatchEvent(makeDiagnosticEvent(sandbox, 'mousemove', {
      clientX: 160 + (index % 37),
      clientY: 245 + (index % 29),
      screenX: 1334 + (index % 37),
      screenY: 651 + (index % 29),
      movementX: 1 + (index % 3),
      movementY: index % 2,
      offset,
    }));
    dispatched += 1;
  }
  sandbox.__simulationLogs.behaviorSeed = {
    mode: 'deterministic expired-sample parity events',
    dispatched,
    extraMoves,
  };
}

function instrumentEtGeneratedSource(source) {
  return String(source).replace(
    /\b([A-Za-z_$][\w$]*)\[([A-Za-z_$][\w$]*)\]\(/g,
    (match, ownerName, keyName, offset, input) => {
      const prefix = input.slice(Math.max(0, offset - 8), offset);
      if (/new\s+$/.test(prefix)) return match;
      return `__callProbe(${ownerName},${keyName},"generated:${ownerName}[${keyName}]")(`;
    },
  );
}

function installGeneratedFunctionProbe(context, sandbox) {
  const nativeFunction = Function;
  function DiagnosticFunction(...args) {
    const params = args.slice(0, -1).map(String);
    let body = args.length ? String(args[args.length - 1]) : '';
    const hasTaTe = body.includes('ta[te]');
    if (hasTaTe || body.length > 2048) {
      sandbox.__simulationLogs.console.push({
        level: 'probe',
        items: [
          '[ET_GENERATED_FUNCTION]',
          String(body.length),
          hasTaTe ? 'has-ta-te' : 'no-ta-te',
          crypto.createHash('sha256').update(body).digest('hex').slice(0, 16),
          body.slice(0, 120).replace(/\s+/g, ' '),
        ],
      });
    }
    if (hasTaTe) body = instrumentEtGeneratedSource(body);
    try {
      return vm.compileFunction(body, params, { parsingContext: context });
    } catch (_) {
      return nativeFunction(...params, body);
    }
  }
  Object.setPrototypeOf(DiagnosticFunction, nativeFunction);
  try {
    DiagnosticFunction.prototype = nativeFunction.prototype;
  } catch (_) {}
  sandbox.Function = tagNative(DiagnosticFunction, 'Function');
  Object.defineProperty(nativeFunction.prototype, 'constructor', {
    value: sandbox.Function,
    configurable: true,
    writable: true,
  });
}

function makeQuietSummary(report) {
  const loadOkCount = report.loadResults.filter((item) => item.ok).length;
  const fakeParamStatus = {};
  for (const [name, result] of Object.entries(report.fakeParams)) {
    fakeParamStatus[name] = result.ok ? 'ok' : `failed: ${result.error}`;
  }
  return {
    generatedAt: report.generatedAt,
    load: {
      ok: loadOkCount,
      total: report.loadResults.length,
      failed: report.missingOrBlocked.map((item) => item.file),
    },
    awscFeatures: report.awscFeatures,
    globals: report.globals,
    browserParity: report.browserParity,
    expiredSample: report.expiredSample,
    fakeParamStatus,
    fakeParamDigests: Object.fromEntries(
      Object.entries(report.fakeParams)
        .filter(([, result]) => result && result.digest)
        .map(([name, result]) => [name, result.digest]),
    ),
    behaviorSeed: report.behaviorSeed,
    dynamicResources: report.dynamicResources.map((item) => item.src),
    xhrUrls: report.networkAttempts.xhr.map((item) => item.url).filter(Boolean),
    staticDependencies: report.staticDependencies,
    relatedReports: report.relatedReports,
    imageAttempts: report.networkAttempts.image.length,
    reportPath: REPORT,
  };
}

async function main() {
  const sandbox = laoheMakeSimulationSandbox();
  const context = vm.createContext(sandbox);
  if (process.env.ET_DIAG_INSTRUMENT === '1') {
    installGeneratedFunctionProbe(context, sandbox);
  }
  const loadResults = [];
  for (const [group, files] of Object.entries(LOAD_GROUPS)) {
    for (const file of files) {
      const result = runScript(context, sandbox, file);
      result.group = group;
      loadResults.push(result);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 20));
  seedEtBehavior(sandbox);
  await new Promise((resolve) => setTimeout(resolve, 5));
  const awscFeatures = [];
  for (const feature of ['uab', 'um', 'et']) {
    awscFeatures.push(await probeAwscFeature(sandbox, feature));
  }

  const fakeMtop = makeFakeMtopParams();
  const fakeUrl = `https://waimai-guide.ele.me/h5/mtop.relationrecommend.elemetinyapprecommend.recommend/1.0/5.0/?appKey=${fakeMtop.appKey}&t=${fakeMtop.t}&sign=${fakeMtop.sign}`;
  const params = {
    t: { ok: true, value: fakeMtop.t, source: 'expired sample timestamp for offline reproducible test' },
    sign: {
      ok: fakeMtop.signMatchesExpiredSample,
      value: fakeMtop.sign,
      source: 'md5(expired_m_h5_tk_prefix&t&appKey&data)',
      expected: fakeMtop.expectedSign,
      signInputPreview: fakeMtop.signInputPreview,
    },
    bx_et: typeof sandbox.etSign === 'function'
      ? callSensitiveFunctionSafe('bx_et', () => sandbox.etSign(fakeUrl))
      : { ok: false, error: 'window.etSign is not available after local SDK load' },
    bx_et_getETToken: sandbox.__etModule && typeof sandbox.__etModule.getETToken === 'function'
      ? callSensitiveFunctionSafe('bx_et_getETToken', () => sandbox.__etModule.getETToken(fakeUrl))
      : { ok: false, error: 'window.__etModule.getETToken is not available after local SDK load' },
    x_ele_check: typeof sandbox.x_check === 'function'
      ? callFunctionSafe('x_ele_check', () => sandbox.x_check('', 'mtop.fake.test'))
      : { ok: false, error: 'window.x_check is not available after local SDK load' },
    x_ele_ua: {
      ok: true,
      value: `RenderWay/H5 MiniAppId/2021001110676437 MiniAppVersion/diagnostic AppName/h5 ${sandbox.navigator.userAgent.replace(/[\u4E00-\u9FA5]/g, '')}`,
      source: 'diagnostic assembly, not SDK getXUA output',
    },
    bx_umidtoken: {
      ok: true,
      value: DIAGNOSTIC_UMID_TOKEN,
      source: 'fake local diagnostic token; real token requires AWSC/WebUMID runtime callback',
    },
  };

  const report = {
    generatedAt: new Date().toISOString(),
    note: 'Local fake-data diagnostic only. Does not use real account cookies and does not build a production request.',
    loadResults,
    staticDependencies: Object.fromEntries(
      [...new Set([...Object.values(LOAD_GROUPS).flat(), ...ESM_DEPENDENCY_FILES])]
        .map((file) => [file, scanStaticDependencies(file)])
        .filter(([, deps]) => deps.length > 0),
    ),
    awscFeatures,
    browserParity: sandbox.__simulationLogs.browserParity,
    globals: snapshotGlobals(sandbox),
    fakeParams: params,
    expiredSample: {
      note: EXPIRED_SAMPLE.note,
      expectedSign: EXPIRED_SAMPLE.expectedSign,
      signMatches: fakeMtop.signMatchesExpiredSample,
      dataLength: fakeMtop.data.length,
      browserBxEtLengthBaseline: BROWSER_BASELINE.bxEtLength,
    },
    dynamicResources: sandbox.__simulationLogs.dynamicResources,
    networkAttempts: {
      xhr: sandbox.__simulationLogs.xhr,
      fetch: sandbox.__simulationLogs.fetch,
      image: sandbox.__simulationLogs.image.slice(0, 20).map(redactDiagnosticUrl),
    },
    behaviorSeed: sandbox.__simulationLogs.behaviorSeed,
    eventLog: (sandbox.__simulationLogs.events || []).slice(0, 120),
    consoleMessages: sandbox.__simulationLogs.console.slice(0, 80),
    windowMisses: [...new Set(sandbox.__simulationLogs.windowMisses || [])].slice(0, 120),
    autoConstructors: sandbox.__simulationLogs.autoConstructors || [],
    cookies: sandbox.__cookieJar.dump(),
    localStorageKeys: Object.keys(sandbox.localStorage.dump()),
    relatedReports: {
      elecheckEsmProbe: path.join(ROOT, 'docs', 'elecheck-esm-probe.json'),
    },
    missingOrBlocked: loadResults.filter((item) => !item.ok).map((item) => ({
      group: item.group,
      file: item.file,
      error: item.error,
    })),
  };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(QUIET ? makeQuietSummary(report) : report, null, 2));
  return loadResults.every((item) => item.ok) ? 0 : 1;
}

if (require.main === module) {
  main().then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    console.error(error && error.stack ? error.stack : String(error));
    process.exitCode = 1;
  });
}

module.exports = {
  laoheMakeSimulationSandbox,
  makeFakeMtopParams,
  snapshotGlobals,
};

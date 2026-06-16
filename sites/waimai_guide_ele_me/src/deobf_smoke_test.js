'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

const DEFAULT_TARGETS = [
  path.join(ROOT, 'assets', 'deobf', 'mor_g', 'final.js'),
  path.join(ROOT, 'assets', 'deobf', '470', 'final.js'),
  path.join(ROOT, 'assets', 'deobf', 'mor_v_generic', 'final.js'),
];

function makeStorage() {
  const store = Object.create(null);
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
  };
}

function makeElement(tagName) {
  return {
    tagName: String(tagName || '').toUpperCase(),
    style: {},
    children: [],
    setAttribute() {},
    getAttribute() {
      return null;
    },
    appendChild(child) {
      this.children.push(child);
      if (child && typeof child.onload === 'function') {
        setTimeout(() => child.onload(), 0);
      }
      return child;
    },
    removeChild(child) {
      this.children = this.children.filter((item) => item !== child);
      return child;
    },
    addEventListener() {},
    removeEventListener() {},
    getContext() {
      return {
        fillText() {},
        measureText() {
          return { width: 0 };
        },
        getImageData() {
          return { data: [] };
        },
      };
    },
    toDataURL() {
      return 'data:image/png;base64,';
    },
  };
}

function laoheMakeSandbox() {
  const head = makeElement('head');
  const body = makeElement('body');
  const documentElement = makeElement('html');
  const localStorage = makeStorage();
  const sessionStorage = makeStorage();

  const sandbox = {
    console: {
      log() {},
      info() {},
      warn() {},
      error() {},
      debug() {},
    },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    URL,
    URLSearchParams,
    Buffer,
    localStorage,
    sessionStorage,
    navigator: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
      language: 'zh-CN',
      languages: ['zh-CN', 'zh'],
      platform: 'Win32',
      cookieEnabled: true,
      onLine: true,
    },
    location: {
      href: 'https://h5.ele.me/minisearch/result',
      origin: 'https://h5.ele.me',
      protocol: 'https:',
      host: 'h5.ele.me',
      hostname: 'h5.ele.me',
      pathname: '/minisearch/result',
      search: '',
      hash: '',
      toString() {
        return this.href;
      },
    },
    document: {
      cookie: '',
      referrer: '',
      title: '',
      readyState: 'complete',
      hidden: false,
      visibilityState: 'visible',
      head,
      body,
      documentElement,
      firstElementChild: documentElement,
      currentScript: { src: '' },
      createElement: makeElement,
      createEvent() {
        return { initEvent() {} };
      },
      getElementsByTagName(name) {
        if (String(name).toLowerCase() === 'head') return [head];
        if (String(name).toLowerCase() === 'body') return [body];
        if (String(name).toLowerCase() === 'script') return [makeElement('script')];
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
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return true;
      },
    },
    screen: {
      width: 1920,
      height: 1080,
      availWidth: 1920,
      availHeight: 1040,
      colorDepth: 24,
      pixelDepth: 24,
    },
    history: {
      length: 1,
      state: null,
      pushState() {},
      replaceState() {},
      back() {},
      forward() {},
      go() {},
    },
    performance: {
      now: () => Date.now(),
      timeOrigin: Date.now() - 1000,
      getEntriesByType: () => [],
    },
    XMLHttpRequest: function XMLHttpRequest() {},
    fetch: () => Promise.resolve({
      ok: true,
      status: 200,
      text: () => Promise.resolve(''),
      json: () => Promise.resolve({}),
      clone() {
        return this;
      },
      headers: {
        get() {
          return 'application/json';
        },
      },
    }),
    Image: function Image() {
      return makeElement('img');
    },
    Event: function Event(type) {
      this.type = type;
    },
    EventEmitter: function EventEmitter() {},
    mor_modules: [],
  };

  sandbox.XMLHttpRequest.prototype = {
    open() {},
    send() {},
    setRequestHeader() {},
    getResponseHeader() {
      return '';
    },
    addEventListener() {},
    removeEventListener() {},
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.global = sandbox;
  return sandbox;
}

function summarizeMorModules(sandbox) {
  const chunks = Array.isArray(sandbox.mor_modules) ? sandbox.mor_modules : [];
  return chunks.map((chunk) => {
    const ids = Array.isArray(chunk) ? chunk[0] : [];
    const modules = Array.isArray(chunk) ? chunk[1] : {};
    return {
      chunkIds: ids,
      moduleCount: modules && typeof modules === 'object' ? Object.keys(modules).length : 0,
      sampleModules: modules && typeof modules === 'object' ? Object.keys(modules).slice(0, 8) : [],
    };
  });
}

function smokeOne(filePath) {
  const absolutePath = path.resolve(filePath);
  const code = fs.readFileSync(absolutePath, 'utf8');
  const sandbox = laoheMakeSandbox();
  const context = vm.createContext(sandbox);
  const beforeCount = sandbox.mor_modules.length;
  vm.runInContext(code, context, {
    filename: absolutePath,
    timeout: 15000,
  });
  const afterCount = sandbox.mor_modules.length;
  return {
    file: absolutePath,
    ok: true,
    bytes: Buffer.byteLength(code, 'utf8'),
    morModulesBefore: beforeCount,
    morModulesAfter: afterCount,
    chunks: summarizeMorModules(sandbox),
  };
}

function main(argv) {
  const targets = argv.length ? argv.map((item) => path.resolve(item)) : DEFAULT_TARGETS;
  const results = targets.map((target) => {
    try {
      return smokeOne(target);
    } catch (error) {
      return {
        file: path.resolve(target),
        ok: false,
        error: error && error.stack ? error.stack : String(error),
      };
    }
  });
  const ok = results.every((item) => item.ok);
  console.log(JSON.stringify({ ok, count: results.length, results }, null, 2));
  return ok ? 0 : 1;
}

process.exitCode = main(process.argv.slice(2));

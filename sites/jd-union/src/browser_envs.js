/**
 * JD h5st v5.3 — 浏览器环境补丁
 * 包含: localStorage, DOM, crypto, navigator 等 polyfill
 */
const crypto = require("crypto");

// ========== 1. localStorage mock ==========
class LocalStorageMock {
  constructor(data) { this._data = new Map(Object.entries(data || {})); }
  getItem(k) { return this._data.get(k) || null; }
  setItem(k, v) { this._data.set(k, v); }
  removeItem(k) { this._data.delete(k); }
  get length() { return this._data.size; }
  key(i) { return [...this._data.keys()][i]; }
}

// ========== 2. DOM mocks ==========
class ElementMock {
  constructor() { this.children = []; this.parentNode = null; this.style = {}; }
  setAttribute() {}
  getAttribute() { return null; }
  appendChild(el) { el.parentNode = this; this.children.push(el); return el; }
  removeChild(el) { this.children = this.children.filter(c => c !== el); return el; }
  remove() { if (this.parentNode) this.parentNode.removeChild(this); }
}

const docMock = {
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: () => new ElementMock(),
  createTextNode: () => new ElementMock(),
  head: new ElementMock(),
  body: new ElementMock(),
  documentElement: new ElementMock(),
  cookie: "",
  addEventListener: () => {},
  removeEventListener: () => {},
  createElementNS: () => new ElementMock(),
};

// ========== 3. Crypto polyfill ==========
const cryptoMock = {
  getRandomValues(buf) { const r = crypto.randomBytes(buf.length); for (let i = 0; i < buf.length; i++) buf[i] = r[i]; return buf; },
  subtle: {
    digest(algo, data) { const h = crypto.createHash(algo.toLowerCase().replace("-", "")); h.update(Buffer.from(data)); return Promise.resolve(h.digest()); },
    importKey() { return Promise.reject(new Error("NI")); },
    encrypt() { return Promise.reject(new Error("NI")); },
    decrypt() { return Promise.reject(new Error("NI")); },
    sign() { return Promise.reject(new Error("NI")); },
    verify() { return Promise.reject(new Error("NI")); },
  },
};

// ========== 4. Navigator mock ==========
const navMock = {
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
  webdriver: false,
  language: "zh-CN",
  languages: ["zh-CN", "zh", "en"],
  mimeTypes: { length: 4, 0: { type: "application/pdf", suffixes: "pdf" } },
  plugins: { length: 5, 0: { name: "Chrome PDF Plugin" }, 1: { name: "Chrome PDF Viewer" }, 2: { name: "Native Client" } },
  appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
  platform: "Win32",
  hardwareConcurrency: 8,
  deviceMemory: 8,
  maxTouchPoints: 0,
};

// ========== 5. localStorage 数据 (从浏览器提取) ==========
const storageData = {
  WQ_dy1_vk: '{"5.3":{"73806":{"e":31536000,"v":"b55222b5baij5yp3","t":1779709129141},"586ae":{"e":31536000,"v":"j222zpi22be1jaz1","t":1779709133042}}}',
  WQ_dy1_tk_algo: '{"b55222b5baij5yp3":{"73806":{"v":"N5i3R5jxjEaAfoe0dYf3f4mJSIT6dlyTOIW8OUKIfGK-VXSpfmKAVlGEfInyR4WTgXKmRVKefVLzemj3NFL7XFW7ZHWbOFWDX3Wib0CgNoSyY2OdYYGIYGS2U0axQ1v3alCfjJ7JTV6EQ5jxjFS2QFe3RVu9jkaGP0bDOl--SEr-Okf-TVH-TV6EQ5GwOFm5jkiHcZOcSkq5PomdSXKaa0nEd0SKPJq4OkjuUpiPjJyIQ1yITUbDOl-CgFe8QFeKOpKFPpH9T1u9T1m3hka4hZyIQ1yITUbDTVHCgFe8QFeKOpK5SpHwPFW3OUi9jlm-S1v9X3KqfIX1hke3PJHwMZiu","e":86400,"t":1779709131675}},"j222zpi22be1jaz1":{"586ae":{"v":"N5i3R5jxjEaAfoe0dYT5eYmJTYT6dlyKeGrySX2kbYKEX1ORXp23aUi4TEelS3enZmqIWJ2Eb0iqSGiUZVenYoGbQ0q5WlyBdkqbb1b2Pl_7WECjVGeITFb2bXOCdXafeoKbjJ7JTV6EQ5jxjFS2QFe3RVu9jkaGP0bDOl--SEr-Okf-TVH-TV6EQ5GwOFm5jkiHcZP1Z0K7ZHSTaX6FQWHEd0SKPJq4OkjuUpiPjJyIQ1yITUbDOl-CgFe8QFeKOpKFPpH9T1u9T1m3hka4hZyIQ1yITUbDTVHCgFe8QFeKOpK5SpHwPFW3OUi9jlm-S1v9X3KqfIX1hke3PJHwMZiu","e":86400,"t":1779709134103}}}',
};

// ========== 6. 构建 window ==========
const localStorageMock = new LocalStorageMock(storageData);
const win = {
  document: docMock, navigator: navMock, localStorage: localStorageMock,
  crypto: cryptoMock, msCrypto: null,
  screen: { width: 2560, height: 1440, availWidth: 2560, availHeight: 1400, colorDepth: 24, pixelDepth: 24 },
  outerWidth: 2560, outerHeight: 1440, devicePixelRatio: 1,
  XMLHttpRequest: function () { this.open = () => {}; this.send = () => {}; this.setRequestHeader = () => {}; },
  getComputedStyle: () => ({}), chrome: { loadTimes: () => {}, csi: () => {} },
  addEventListener: () => {}, __JDWEBSIGNHELPER_$DATA__: {},
};
win.window = win;

global.window = win;
global.document = docMock;
global.localStorage = localStorageMock;
global.getComputedStyle = () => ({});
global.Element = function () {};
global.HTMLElement = function () {};
global.HTMLScriptElement = function () {};
global.HTMLStyleElement = function () {};
global.XMLHttpRequest = win.XMLHttpRequest;

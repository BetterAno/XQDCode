/**
 * JD h5st v5.3 Minimal Pure-Algorithm Signer
 *
 * Uses the SDK's custom CryptoJS + VM internally, with minimal env patching.
 * The SDK contains modified hash functions (non-standard MD5/SHA256) that
 * cannot be replaced with Node.js native crypto.
 *
 * Algorithm flow (verified by dynamic tracing):
 *   1. _$cps: sort params into key-value pairs (alphabetical)
 *   2. _$pam: check token/fingerprint validity
 *   3. _$clt: generate random fp string + fingerprint data
 *   4. _$gdk: derive encryption key from token via custom hash chain
 *      - h1 = SDK_HmacSHA256(token, token)
 *      - h2 = SDK_SHA256(h1) (repeated, varies by token version)
 *      - final = SDK_HmacSHA256(h_last, token)
 *   5. _$gs: generate signHash = custom_hash(derived_key, sorted_params)
 *   6. _$gsd: generate bodyHash = custom_hash(derived_key, sorted_params)
 *   7. _$gsp: assemble h5st = datetime;fp;appId;token;signHash;5.3;timestamp;expandParams;bodyHash;eidHash
 *   8. _$ms: build result object with _stk, _ste, h5st
 */

const fs = require('fs');
const path = require('path');

let _ParamsSign = null;
let _sdkCode = null;

function setupMinimalEnv() {
  if (global.window && global.window.__jdSignEnvReady) return;

  const doc = {
    createElement: () => ({
      tagName: 'DIV', style: {}, children: [], childElementCount: 0,
      innerHTML: '', textContent: '', appendChild() {}, removeChild() {},
      addEventListener() {}, removeEventListener() {}, setAttribute() {},
      getAttribute() { return null; }, querySelectorAll: () => [],
      querySelector: () => null, getContext: () => null, toDataURL: () => '',
      classList: { add() {}, remove() {}, contains: () => false }, dataset: {},
    }),
    body: { appendChild() {}, style: {}, children: [] },
    documentElement: { appendChild() {}, style: {} },
    head: { appendChild() {}, children: [] },
    querySelector: () => null, querySelectorAll: () => [],
    getElementById: () => null,
    addEventListener: () => {}, removeEventListener: () => {},
    readyState: 'complete', title: '', referrer: '', domain: '', URL: '',
    location: { href: '', hostname: '', protocol: '' },
  };
  let cookieStr = '';
  Object.defineProperty(doc, 'cookie', {
    get: () => cookieStr,
    set: (val) => { cookieStr += (cookieStr ? '; ' : '') + val.split(';')[0]; },
    configurable: true,
  });

  const win = {
    __jdSignEnvReady: true,
    navigator: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      language: 'zh-CN', languages: ['zh-CN'], platform: 'Win32',
      cookieEnabled: true, onLine: true, hardwareConcurrency: 16,
      deviceMemory: 8, maxTouchPoints: 0, webdriver: false,
      plugins: { length: 5, item: () => null, namedItem: () => null, refresh: () => {} },
      mimeTypes: { length: 2, item: () => null, namedItem: () => null },
      javaEnabled: () => false, sendBeacon: () => true,
      getBattery: async () => ({ charging: true, level: 1 }),
      getGamepads: () => [], connection: { effectiveType: '4g' },
    },
    document: doc, screen: { width: 1920, height: 1080, availWidth: 1920, availHeight: 1040, colorDepth: 24, pixelDepth: 24 },
    location: { href: 'https://search.jd.com/', hostname: 'search.jd.com', protocol: 'https:' },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} },
    performance: { now: () => Date.now(), timing: { navigationStart: Date.now() - 5000 }, getEntriesByType: () => [], getEntriesByName: () => [] },
    crypto: { getRandomValues: (arr) => { for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256); return arr; } },
    addEventListener: () => {}, removeEventListener: () => {},
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    XMLHttpRequest: class { constructor() {} open() {} setRequestHeader() {} send() {} abort() {} addEventListener() {} removeEventListener() {} },
    fetch: async () => ({ ok: true, status: 200, json: async () => ({}) }),
    Image: class { constructor() { this.src = ''; } },
    innerWidth: 1920, innerHeight: 1080, devicePixelRatio: 1,
    history: { pushState() {}, replaceState() {}, back() {} },
    Element: class Element {}, HTMLElement: class HTMLElement {},
  };
  win.self = win; win.top = win; win.parent = win;

  Object.keys(win).forEach(k => { global[k] = win[k]; });
  global.window = win;
  global.document = doc;
}

function loadSDK() {
  if (_ParamsSign) return _ParamsSign;

  setupMinimalEnv();

  const sdkPath = path.join(__dirname, '..', 'assets', 'js', 'js_security_v3_0.1.6.js');
  _sdkCode = fs.readFileSync(sdkPath, 'utf-8');

  const fn = new Function(_sdkCode + '\nreturn ParamsSign;');
  _ParamsSign = fn();

  if (!_ParamsSign) throw new Error('Failed to load ParamsSign SDK');
  return _ParamsSign;
}

/**
 * Generate h5st signature
 * @param {Object} params - Sign parameters
 * @param {string} params.appid - Application ID (e.g., 'search-pc-java')
 * @param {string} params.functionId - Function ID (e.g., 'pc_search_searchWare')
 * @param {string} params.client - Client type (e.g., 'pc')
 * @param {string} params.clientVersion - Client version (e.g., '1.0.0')
 * @param {number} params.t - Timestamp in milliseconds
 * @param {string} params.body - SHA256 hash of the request body
 * @returns {Object} { h5st, _stk, _ste, ...params }
 */
function sign(params) {
  const ParamsSign = loadSDK();
  const signer = new ParamsSign({ appId: 'f06cc', preRequest: false });
  return signer.signSync(params);
}

/**
 * Parse h5st string into segments
 * h5st format: datetime;fp;appId;token;signHash;version;timestamp;expandParams;bodyHash;eidHash
 */
function parseH5st(h5stStr) {
  const segs = h5stStr.split(';');
  return {
    datetime: segs[0],
    fp: segs[1],
    appId: segs[2],
    token: segs[3],
    signHash: segs[4],
    version: segs[5],
    timestamp: segs[6],
    expandParams: segs[7],
    bodyHash: segs[8],
    eidHash: segs[9],
  };
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args[0] === '--test') {
    const t = Date.now();
    const result = sign({
      appid: 'search-pc-java',
      functionId: 'pc_search_searchWare',
      client: 'pc',
      clientVersion: '1.0.0',
      t: t,
      body: 'test',
    });
    console.log(JSON.stringify(result, null, 2));

    if (result.h5st) {
      const parsed = parseH5st(result.h5st);
      console.log('\nParsed h5st:');
      Object.entries(parsed).forEach(([k, v]) => {
        console.log('  ' + k + ': ' + (v.length > 60 ? v.substring(0, 60) + '...' : v));
      });
    }
  } else if (args.length > 0) {
    const params = JSON.parse(args[0]);
    console.log(JSON.stringify(sign(params)));
  } else {
    console.log('Usage: node signer.js --test');
    console.log('       node signer.js \'{"appid":"search-pc-java",...}\'');
  }
}

module.exports = { sign, loadSDK, parseH5st };

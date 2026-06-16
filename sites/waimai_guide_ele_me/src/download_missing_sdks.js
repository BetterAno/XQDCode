'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..');
const JS_DIR = path.join(ROOT, 'assets', 'js');
const OUT_DIR = path.join(JS_DIR, 'sdk');
const MANIFEST = path.join(OUT_DIR, 'manifest.json');

const munianSeedUrls = [
  'https://g.alicdn.com/secdev/sufei_data/3.9.14/index.js',
  'https://g.alicdn.com/AWSC/AWSC/awsc.js',
  'https://g.alicdn.com/AWSC/fireyejs/1.231.67/fireyejs.js',
  'https://g.alicdn.com/AWSC/fireyejs/1.231.69/fireyejs.js',
  'https://g.alicdn.com/AWSC/uab/1.140.0/collina.js',
  'https://g.alicdn.com/AWSC/WebUMID/1.93.0/um.js',
  'https://g.alicdn.com/AWSC/et/1.83.41/et_f.js',
  'https://g.alicdn.com/AWSC/et/1.83.35/et_f.js',
  'https://g.alicdn.com/AWSC/nc/1.97.0/nc.js',
  'https://g.alicdn.com/js/nc/60.js',
  'https://g.alicdn.com/sd/baxia/2.5.36/baxiaCommon.js',
  'https://g.alicdn.com/sd/baxia/2.5.36/baxiaXhrHandler.js',
];

function readIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (_) {
    return '';
  }
}

function addUrl(urls, rawUrl, source) {
  if (!rawUrl) return;
  let url = rawUrl.replace(/\\\//g, '/');
  if (url.startsWith('//')) url = `https:${url}`;
  if (url.startsWith('/')) url = `https://g.alicdn.com${url}`;
  if (/^https?:\/\/localhost[:/]/i.test(url)) return;
  if (/^AWSC(?:-br)?\//.test(url) || /^js\/nc\//.test(url)) {
    url = `https://g.alicdn.com/${url}`;
  }
  if (!/^https?:\/\/.+\.js(?:[?#].*)?$/.test(url)) return;
  urls.set(url, source);
}

function collectFromAwsc(urls) {
  const code = readIfExists(path.join(JS_DIR, 'awsc.js'));
  for (const match of code.matchAll(/"(AWSC(?:-br)?\/[^"]+?\.js|js\/nc\/[^"]+?\.js)"/g)) {
    addUrl(urls, match[1], 'awsc.js module config');
  }
}

function collectFromBaxia(urls) {
  const entry = readIfExists(path.join(JS_DIR, 'baxia-entry-index.js'));
  for (const match of entry.matchAll(/"((?:https?:)?\/\/[^"]+?\.js)"/g)) {
    addUrl(urls, match[1], 'baxia-entry-index.js loader');
  }

  const common = readIfExists(path.join(JS_DIR, 'baxiaCommon-2.5.36.js'));
  for (const match of common.matchAll(/\bhandler(?:\$1)?\(\s*"([A-Za-z]+)"/g)) {
    addUrl(urls, `https://g.alicdn.com/sd/baxia/2.5.36/baxia${match[1]}Handler.js`, 'baxiaCommon handler path');
  }
}

function collectFromElecheck(urls) {
  for (const name of [
    'elecheck-cl-loader-1.1.7.js',
    'elecheck-cl-1.1.7.js',
    'elecheck-cl-legacy-1.1.7.js',
  ]) {
    const code = readIfExists(path.join(JS_DIR, name));
    for (const match of code.matchAll(/"((?:https?:)?\/\/[^"]+?\.js)"/g)) {
      addUrl(urls, match[1], `${name} loader`);
    }
  }
}

function localNameFor(url) {
  const parsed = new URL(url);
  const cleanPath = parsed.pathname.replace(/^\/+/, '').replace(/[^a-zA-Z0-9._/-]+/g, '_');
  return cleanPath.replace(/\//g, '__');
}

function normalizeScriptBuffer(buffer) {
  if (buffer.length > 2 && buffer[0] === 0x1f && buffer[1] === 0x8b) {
    return zlib.gunzipSync(buffer);
  }
  try {
    const maybeText = buffer.subarray(0, 64).toString('utf8');
    if (!/[;=(){}]|\b(function|var|const|let|window|self)\b/.test(maybeText)) {
      return zlib.brotliDecompressSync(buffer);
    }
  } catch (_) {}
  return buffer;
}

async function downloadOne(url, source) {
  const fileName = localNameFor(url);
  const outputPath = path.join(OUT_DIR, fileName);
  try {
    if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
      let buffer = fs.readFileSync(outputPath);
      const normalized = normalizeScriptBuffer(buffer);
      let status = 'cached';
      if (normalized !== buffer) {
        fs.writeFileSync(outputPath, normalized);
        buffer = normalized;
        status = 'normalized_cached';
      }
      const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
      return { url, source, file: path.relative(ROOT, outputPath), status, bytes: buffer.length, sha256 };
    }

    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
        accept: '*/*',
      },
    });
    if (!res.ok) {
      return { url, source, file: path.relative(ROOT, outputPath), status: `http_${res.status}`, bytes: 0 };
    }
    const buffer = normalizeScriptBuffer(Buffer.from(await res.arrayBuffer()));
    fs.writeFileSync(outputPath, buffer);
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    return { url, source, file: path.relative(ROOT, outputPath), status: 'downloaded', bytes: buffer.length, sha256 };
  } catch (error) {
    return {
      url,
      source,
      file: path.relative(ROOT, outputPath),
      status: 'error',
      bytes: 0,
      error: error && error.message ? error.message : String(error),
    };
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const urls = new Map();
  for (const url of munianSeedUrls) addUrl(urls, url, 'seed');
  collectFromAwsc(urls);
  collectFromBaxia(urls);
  collectFromElecheck(urls);

  const results = [];
  for (const [url, source] of urls) {
    results.push(await downloadOne(url, source));
  }
  const manifest = {
    generatedAt: new Date().toISOString(),
    count: results.length,
    okCount: results.filter((item) => item.status === 'downloaded' || item.status === 'cached' || item.status === 'normalized_cached').length,
    results,
  };
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(JSON.stringify(manifest, null, 2));
  return manifest.okCount === manifest.count ? 0 : 1;
}

main().then((code) => {
  process.exitCode = code;
}).catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exitCode = 1;
});

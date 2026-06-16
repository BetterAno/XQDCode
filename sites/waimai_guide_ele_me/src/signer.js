'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const TARGET_API = 'mtop.relationrecommend.elemetinyapprecommend.recommend';

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
  });
}

function parseQuery(inputUrl) {
  if (!inputUrl) return {};
  const normalized = inputUrl.startsWith('//') ? `https:${inputUrl}` : inputUrl;
  const parsed = new URL(normalized);
  const out = {};
  for (const [key, value] of parsed.searchParams.entries()) {
    out[key] = value;
  }
  return out;
}

function parseCookie(cookieHeader) {
  const cookies = {};
  String(cookieHeader || '').split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx < 0) return;
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (name) cookies[name] = value;
  });
  return cookies;
}

function extractMtopToken(cookieHeader) {
  const cookies = parseCookie(cookieHeader);
  const raw = cookies._m_h5_tk;
  if (!raw) return '';
  return String(raw).split('_', 1)[0];
}

function extractDataFromBody(bodyText) {
  const params = new URLSearchParams(String(bodyText || ''));
  return params.get('data') || '';
}

function mtopSign({ token, t, appKey, data }) {
  if (!token || !t || !appKey || !data) {
    return '';
  }
  return crypto
    .createHash('md5')
    .update(`${token}&${t}&${appKey}&${data}`, 'utf8')
    .digest('hex');
}

function loadProvider(providerPath) {
  if (!providerPath) return null;
  const laoheProviderPath = path.resolve(providerPath);
  if (!fs.existsSync(laoheProviderPath)) {
    throw new Error(`provider not found: ${laoheProviderPath}`);
  }
  const provider = require(laoheProviderPath);
  return provider && provider.default ? provider.default : provider;
}

async function maybeCall(fn, args) {
  if (typeof fn !== 'function') return null;
  return await fn(...args);
}

async function buildSecuritySlots(input, provider) {
  const query = input.query || parseQuery(input.url || '');
  const api = query.api || input.api || TARGET_API;
  if (!provider) {
    return {
      available: false,
      reason: 'No authorized provider configured. bx_et/x-ele-check/bx-umidtoken are not reproduced here.',
      expectedProviderMethods: ['etSign(url, ctx)', 'xCheck(prefix, api, ctx)', 'xEleUa(ctx)', 'umidToken(ctx)'],
    };
  }

  const munianCtx = {
    url: input.url || '',
    query,
    body: input.body || '',
    data: input.data || '',
    cookie: input.cookie || '',
    api,
  };
  const bxEt = await maybeCall(provider.etSign, [munianCtx.url, munianCtx]);
  const xEleCheck = await maybeCall(provider.xCheck || provider.x_check, ['', api, munianCtx]);
  const xEleUa = await maybeCall(provider.xEleUa || provider.x_ele_ua, [munianCtx]);
  const bxUmidtoken = await maybeCall(provider.umidToken || provider.bxUmidtoken, [munianCtx]);

  return {
    available: true,
    bx_et: bxEt || null,
    x_ele_check: xEleCheck || null,
    x_ele_ua: xEleUa || null,
    bx_umidtoken: bxUmidtoken || null,
  };
}

async function diagnose(input) {
  const query = input.query || parseQuery(input.url || '');
  const data = input.data || extractDataFromBody(input.body || '');
  const token = input.token || extractMtopToken(input.cookie || '');
  const appKey = query.appKey || input.appKey || '';
  const t = query.t || input.t || '';
  const expected = query.sign || input.sign || '';
  const computed = mtopSign({ token, t, appKey, data });
  const provider = loadProvider(input.provider || '');
  const security = await buildSecuritySlots({ ...input, query, data }, provider);

  return {
    ok: true,
    target: TARGET_API,
    mtop: {
      formula: "md5(token + '&' + t + '&' + appKey + '&' + data)",
      tokenAvailable: Boolean(token),
      appKey,
      t,
      dataLength: data.length,
      computed,
      expected,
      matched: computed && expected ? computed === expected : null,
    },
    security,
  };
}

async function selfTest() {
  const token = 'laohe_token';
  const t = '1779515183013';
  const appKey = '12574478';
  const data = JSON.stringify({
    type: 'originaljson',
    appId: '26551',
    params: '{"keyword":"demo"}',
  });
  const expected = mtopSign({ token, t, appKey, data });
  return diagnose({
    token,
    query: { t, appKey, sign: expected },
    data,
  });
}

async function main() {
  if (process.argv.includes('--self-test')) {
    console.log(JSON.stringify(await selfTest(), null, 2));
    return;
  }
  const raw = await readStdin();
  const input = raw.trim() ? JSON.parse(raw) : {};
  console.log(JSON.stringify(await diagnose(input), null, 2));
}

main().catch((err) => {
  console.error(err && err.stack ? err.stack : String(err));
  process.exit(1);
});

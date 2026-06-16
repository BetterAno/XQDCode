import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const nativeConsole = console;
const {
  laoheMakeSimulationSandbox,
  snapshotGlobals,
} = require('./sdk_local_simulation.js');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const ESM_DIR = path.join(ROOT, 'assets', 'js', 'elecheck-esm');
const REPORT = path.join(ROOT, 'docs', 'elecheck-esm-probe.json');

function exposeSandboxToGlobal(sandbox) {
  const nativeOwned = new Set(['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval']);
  for (const key of Reflect.ownKeys(sandbox)) {
    if (key === 'window' || key === 'self' || key === 'globalThis' || key === 'global') continue;
    if (nativeOwned.has(key)) continue;
    try {
      Object.defineProperty(globalThis, key, {
        value: sandbox[key],
        configurable: true,
        writable: true,
        enumerable: false,
      });
    } catch (_) {}
  }
  globalThis.window = globalThis;
  globalThis.self = globalThis;
  globalThis.top = globalThis;
  globalThis.parent = globalThis;
  globalThis.globalThis = globalThis;
}

function digestValue(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return {
    type: typeof value,
    length: text ? text.length : 0,
    sha256_16: text ? crypto.createHash('sha256').update(text).digest('hex').slice(0, 16) : null,
  };
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    }),
  ]);
}

async function callMaybeRedacted(label, fn) {
  try {
    const value = await withTimeout(Promise.resolve().then(fn), 800, label);
    if (value === undefined) {
      return { ok: false, error: `${label} returned undefined` };
    }
    return { ok: true, redacted: true, digest: digestValue(value) };
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }
}

async function main() {
  const sandbox = laoheMakeSimulationSandbox();
  exposeSandboxToGlobal(sandbox);

  const before = snapshotGlobals(globalThis);
  const importResults = [];
  for (const file of ['cl_babel-CP8i_Swq.js', 'cl_polyfill-DqZ71sDb.js', 'cl_vendor-DXnIpoEh.js', 'cl.js']) {
    try {
      const mod = await withTimeout(import(pathToFileURL(path.join(ESM_DIR, file)).href), 1500, `import ${file}`);
      importResults.push({
        file,
        ok: true,
        exports: Object.keys(mod).sort(),
      });
    } catch (error) {
      importResults.push({
        file,
        ok: false,
        error: error && error.stack ? error.stack.split('\n').slice(0, 6).join('\n') : String(error),
      });
      break;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 30));
  const after = snapshotGlobals(globalThis);
  const probes = {
    x_check: typeof globalThis.x_check === 'function'
      ? await callMaybeRedacted('x_check', () => globalThis.x_check('', 'mtop.fake.test'))
      : { ok: false, error: 'globalThis.x_check is not available after ESM import' },
    answer: typeof globalThis.$answer === 'function'
      ? await callMaybeRedacted('$answer', () => globalThis.$answer('', 'mtop.fake.test'))
      : { ok: false, error: 'globalThis.$answer is not available after ESM import' },
  };

  const interestingGlobals = Reflect.ownKeys(globalThis)
    .map(String)
    .filter((name) => /check|answer|ele|config|x_/i.test(name))
    .sort();

  const report = {
    generatedAt: new Date().toISOString(),
    note: 'Local fake-data ESM loader diagnostic only. Security SDK return values are redacted to type/length/hash.',
    esmDir: ESM_DIR,
    before,
    after,
    importResults,
    probes,
    interestingGlobals,
    browserParity: sandbox.__simulationLogs.browserParity,
    networkAttempts: {
      xhr: sandbox.__simulationLogs.xhr,
      fetch: sandbox.__simulationLogs.fetch,
      imageCount: sandbox.__simulationLogs.image.length,
      imageFirst: sandbox.__simulationLogs.image.slice(0, 5),
    },
  };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  nativeConsole.log(JSON.stringify({
    generatedAt: report.generatedAt,
    imports: importResults.map((item) => ({ file: item.file, ok: item.ok, exports: item.exports, error: item.error })),
    after,
    probes,
    interestingGlobals,
    reportPath: REPORT,
  }, null, 2));
  return importResults.every((item) => item.ok) ? 0 : 1;
}

main().then((code) => {
  process.exit(code);
}).catch((error) => {
  nativeConsole.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});

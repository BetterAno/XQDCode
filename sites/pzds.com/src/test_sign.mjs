/**
 * pzds.com sign generator — Node.js .mjs sandbox
 * Usage: node --experimental-wasm-modules test_sign.mjs
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---- Mock browser globals BEFORE loading bridge ----
// The bridge checks these during import
const mockLocation = {
  href: 'https://www.pzds.com/goodsList/17',
  hostname: 'www.pzds.com',
  host: 'www.pzds.com',
  protocol: 'https:',
  pathname: '/goodsList/17',
  search: '',
  hash: '',
  origin: 'https://www.pzds.com',
  port: '',
};

if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    location: mockLocation,
    Window: function Window() {},
  };
  globalThis.self = { ...globalThis.window, self: globalThis.self };
}

// ---- Load and init WASM ----
const wasmPath = join(__dirname, 'ad96acb6.wasm');
const wasmBytes = readFileSync(wasmPath);

// Create WebAssembly module from the raw bytes
// We need to get the ArrayBuffer from the Buffer
const wasmBuffer = wasmBytes.buffer.slice(
  wasmBytes.byteOffset,
  wasmBytes.byteOffset + wasmBytes.byteLength
);
const wasmModule = new WebAssembly.Module(wasmBuffer);

// Import the bridge module directly
// The bridge is an ES module with export statements
// We need to create a combined script that loads the bridge and calls initSync
//
// Actually, the bridge file uses `import.meta.url` which won't work when we import it.
// Let's eval the bridge code directly.

const bridgePath = join(__dirname, '03574d3f.js');
let bridgeCode = readFileSync(bridgePath, 'utf8');

// Replace the _fetchWasm function to use our local file
bridgeCode = bridgeCode.replace(
  /async function _fetchWasm[\s\S]*?^}/m,
  `async function _fetchWasm(url) {
    const buf = globalThis.__wasmBuffer;
    return { ok: true, status: 200, headers: { get: () => 'application/wasm' }, arrayBuffer: async () => buf };
  }`
);

// Remove the export statements (they're ESM, we're using eval)
bridgeCode = bridgeCode.replace(/^export\s+/gm, '// export ');
bridgeCode = bridgeCode.replace(/^export\s*\{[^}]*\}/gm, '// export {}');

// Set global wasm buffer
globalThis.__wasmBuffer = wasmBuffer;

// Execute the bridge code in the global scope
const bridgeFn = new Function(bridgeCode);
bridgeFn.call(globalThis);

// Now initSync should be available globally
const exports = globalThis.initSync(wasmModule);
console.log('[1] WASM initialized');
console.log('    Exports:', Object.keys(exports).join(', '));

// ---- Call generate_sign with test data ----
const sampleBody = JSON.stringify({
  "order": "ASC",
  "sort": null,
  "page": 1,
  "pageSize": 10,
  "action": {
    "gameId": "17",
    "merchantMark": null,
    "keywords": [],
    "searchWords": [],
    "searchPropertyIds": [],
    "recommendSearchConfigIds": [],
    "unionGameIds": [],
    "goodsSearchActions": [],
    "metas": { "single1": [] },
    "goodsCatalogueId": 6,
    "goodsSubCatalogueIds": [],
    "countFlag": false,
    "conditionSearch": false
  }
});

const timestamp = "1781229988942";
const random = "925876";
const method = "POST";

console.log('[2] Calling generate_sign...');
console.log('    body:', sampleBody.substring(0, 100) + '...');
console.log('    method:', method);
console.log('    timestamp:', timestamp);
console.log('    random:', random);

const result = exports.generate_sign(sampleBody, method, timestamp, random);

console.log('[3] Result:');
console.log('    decode__1174 =', result);

// Compare with expected
console.log('\n[4] Expected (from captured request):');
console.log('    decode__1174 = 214d4f07715-qZwfYfjiXhQS%3DZXdPhTeq%2FA0t5822lGcX%2FTXffqBD7ltcmtT8wFFJuquQufk%3D...');
console.log('\n    First 40 chars of result:', result.substring(0, 40));

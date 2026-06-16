/**
 * WASM Auth 生成器
 * 本地加载 WASM 模块，为 Python 提供加密签名
 * 
 * 用法: node wasm_solver.mjs <page_number> <challenge_type>
 * 输出: JSON 格式 {timestamp, wasm_auth, page}
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// === WASM glue code (Node.js 兼容) ===
let wasm;
const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;
const cachedTextEncoder = new TextEncoder('utf-8');

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }
    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;
    const mem = getUint8ArrayMemory0();
    let offset = 0;
    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) arg = arg.slice(offset);
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);
        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true ||
        (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) { return x === undefined || x === null; }

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_3.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

function encrypt_simple(page, timestamp) {
    let deferred4_0, deferred4_1;
    try {
        const ptr0 = passStringToWasm0(page, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(timestamp, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.encrypt_simple(ptr0, len0, ptr1, len1);
        var ptr3 = ret[0], len3 = ret[1];
        if (ret[3]) { ptr3 = 0; len3 = 0; throw takeFromExternrefTable0(ret[2]); }
        deferred4_0 = ptr3; deferred4_1 = len3;
        return getStringFromWasm0(ptr3, len3);
    } finally {
        wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
}

function get_timestamp() {
    return wasm.get_timestamp();
}

// === WASM imports ===
function __wbg_get_imports() {
    const imports = { wbg: {} };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let d0 = arg0, d1 = arg1;
        try { console.error(getStringFromWasm0(arg0, arg1)); }
        finally { wasm.__wbindgen_free(d0, d1, 1); }
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() { return new Error(); };
    imports.wbg.__wbg_now_807e54c39636c349 = function() { return Date.now(); };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_3;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        return getStringFromWasm0(arg0, arg1);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    return imports;
}

// === 初始化 WASM ===
const wasmPath = join(__dirname, 'wasm_anti_bg.wasm');
const wasmBytes = readFileSync(wasmPath);
const imports = __wbg_get_imports();
const { instance } = await WebAssembly.instantiate(wasmBytes, imports);
wasm = instance.exports;
cachedDataViewMemory0 = null;
cachedUint8ArrayMemory0 = null;
wasm.__wbindgen_start();

// === 批量生成所有页面的 auth ===
const challengeType = process.argv[2] || 'wasm_challenge';
const totalPages = parseInt(process.argv[3] || '100');

const results = [];
for (let p = 1; p <= totalPages; p++) {
    const ts = String(Math.floor(get_timestamp() / 1000));
    const verifyString = `${challengeType}_page_${p}`;
    const auth = encrypt_simple(verifyString, ts);
    results.push({ page: p, timestamp: ts, wasm_auth: auth });
}

// 输出 JSON 供 Python 解析
console.log(JSON.stringify(results));

/**
 * pzds.com sign service — Node.js module
 * Usage: node sign_service.js '<json_body>' '<method>' '<timestamp>' '<random>'
 * Output: sign MD5 hash to stdout
 */
'use strict';
const fs = require('fs');
const path = require('path');

// ---- WASM setup (singleton) ----
let _w, _i32, _u8, _vl = 0;
let initialized = false;

const heap = new Array(128).fill(undefined);
heap.push(undefined, null, true, false);
let heapNext = heap.length;

function _go(idx) { return heap[idx]; }
function _do(idx) { if (idx < 132) return; heap[idx] = heapNext; heapNext = idx; }
function _to(idx) { const r = _go(idx); _do(idx); return r; }
function _aho(obj) { if (heapNext === heap.length) heap.push(heap.length + 1); const idx = heapNext; heapNext = heap[idx]; heap[idx] = obj; return idx; }
function _he(f, args) { try { return f.apply(this, args); } catch (e) { _w.__wbindgen_exn_store(_aho(e)); } }

const te = new TextEncoder();
const es = typeof te.encodeInto === 'function'
  ? (a, v) => te.encodeInto(a, v)
  : (a, v) => { const b = te.encode(a); v.set(b); return { read: a.length, written: b.length }; };

function _gsw(ptr, len) {
  ptr >>>= 0;
  if (!_u8) _u8 = new Uint8Array(_w.memory.buffer);
  return new TextDecoder('utf-8').decode(_u8.subarray(ptr, ptr + len));
}

function _psw(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = te.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    if (!_u8) _u8 = new Uint8Array(_w.memory.buffer);
    _u8.subarray(ptr, ptr + buf.length).set(buf);
    _vl = buf.length;
    return ptr;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  if (!_u8) _u8 = new Uint8Array(_w.memory.buffer);
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    _u8[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) arg = arg.slice(offset);
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    _u8 = new Uint8Array(_w.memory.buffer);
    const ret = es(arg, _u8.subarray(ptr + offset, ptr + len));
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
    _u8 = new Uint8Array(_w.memory.buffer);
  }
  _vl = offset;
  return ptr;
}

function _gi32() {
  if (!_i32 || _i32.byteLength === 0) _i32 = new Int32Array(_w.memory.buffer);
  return _i32;
}

function initWasm() {
  if (initialized) return;

  function MockWin() {}; MockWin.prototype[Symbol.toStringTag] = 'Window';
  const mockDoc = { cookie:'', referrer:'', title:'', body:{children:{length:0}}, createElement:()=>({}), querySelector:()=>null, addEventListener:()=>{}, removeEventListener:()=>{} };
  const mockNav = { userAgent:'Mozilla/5.0...Chrome/146.0.0.0', webdriver:false, platform:'Win32', language:'zh-CN', languages:['zh-CN'], cookieEnabled:true, hardwareConcurrency:8, deviceMemory:8, maxTouchPoints:0, vendor:'Google Inc.', plugins:{length:5}, mimeTypes:{length:2} };
  const winProps = { location:{href:'https://www.pzds.com/goodsList/17',hostname:'www.pzds.com',host:'www.pzds.com',protocol:'https:',pathname:'/goodsList/17',search:'',hash:'',origin:'https://www.pzds.com',port:''}, Window:MockWin, document:mockDoc, navigator:mockNav, screen:{width:1920,height:1080}, chrome:{runtime:{}}, innerWidth:1920, innerHeight:947, devicePixelRatio:1.25, sessionStorage:{}, localStorage:{}, addEventListener:()=>{}, removeEventListener:()=>{}, matchMedia:()=>({matches:false}), [Symbol.toStringTag]:'Window' };
  winProps.window = winProps; winProps.self = winProps; winProps.top = winProps; winProps.parent = winProps;
  Object.defineProperty(globalThis, 'window', { value: winProps, writable: true, configurable: true });
  Object.defineProperty(globalThis, 'self', { value: winProps, writable: true, configurable: true });
  Object.defineProperty(globalThis, 'document', { value: mockDoc, writable: true, configurable: true });
  Object.defineProperty(globalThis, 'navigator', { value: mockNav, writable: true, configurable: true });

  const wasmPath = path.join(__dirname, 'ad96acb6.wasm');
  const wasmBytes = fs.readFileSync(wasmPath);
  const wasmBuffer = wasmBytes.buffer.slice(wasmBytes.byteOffset, wasmBytes.byteOffset + wasmBytes.byteLength);
  const wm = new WebAssembly.Module(wasmBuffer);

  const wi = { wbg: {
    __wbindgen_object_drop_ref(a0) { _to(a0); },
    __wbg_instanceof_Window_f401953a2cf86220(a0) { try { return Object.prototype.toString.call(_go(a0)) === '[object Window]'; } catch (_) { return false; } },
    __wbg_location_2951b5ee34f19221(a0) { return _aho(_go(a0).location); },
    __wbg_href_706b235ecfe6848c() { return _he((a0, a1) => { const r = _go(a1).href; const p = _psw(r, _w.__wbindgen_malloc, _w.__wbindgen_realloc); _gi32()[a0/4+1]=_vl; _gi32()[a0/4+0]=p; }, arguments); },
    __wbg_hostname_3d9f22c60dc5bec6() { return _he((a0, a1) => { const r = _go(a1).hostname; const p = _psw(r, _w.__wbindgen_malloc, _w.__wbindgen_realloc); _gi32()[a0/4+1]=_vl; _gi32()[a0/4+0]=p; }, arguments); },
    __wbg_newnoargs_e258087cd0daa0ea(a0, a1) { return _aho(new Function(_gsw(a0, a1))); },
    __wbg_self_ce0dbfc45cf2f5be() { return _he(() => _aho(self.self), arguments); },
    __wbg_window_c6fb939a7f436783() { return _he(() => _aho(window.window), arguments); },
    __wbg_globalThis_d1e6af4856ba331b() { return _he(() => _aho(globalThis), arguments); },
    __wbg_global_207b558942527489() { return _he(() => _aho(globalThis.global || globalThis), arguments); },
    __wbindgen_is_undefined(a0) { return _go(a0) === undefined; },
    __wbg_call_27c0f87801dedf93() { return _he((a0, a1) => _aho(_go(a0).call(_go(a1))), arguments); },
    __wbindgen_object_clone_ref(a0) { return _aho(_go(a0)); },
    __wbindgen_throw(a0, a1) { throw new Error(_gsw(a0, a1)); },
  }};

  _w = new WebAssembly.Instance(wm, wi).exports;
  initialized = true;
}

function generateSign(dataJson, method, timestamp, random) {
  initWasm();
  let d0, d1;
  try {
    const rp = _w.__wbindgen_add_to_stack_pointer(-16);
    const p0 = _psw(dataJson, _w.__wbindgen_malloc, _w.__wbindgen_realloc); const l0 = _vl;
    const p1 = _psw(method, _w.__wbindgen_malloc, _w.__wbindgen_realloc); const l1 = _vl;
    const p2 = _psw(timestamp, _w.__wbindgen_malloc, _w.__wbindgen_realloc); const l2 = _vl;
    const p3 = _psw(random, _w.__wbindgen_malloc, _w.__wbindgen_realloc); const l3 = _vl;
    _w.generate_sign(rp, p0, l0, p1, l1, p2, l2, p3, l3);
    const r0 = _gi32()[rp / 4 + 0], r1 = _gi32()[rp / 4 + 1];
    d0 = r0; d1 = r1;
    return _gsw(r0, r1);
  } finally {
    _w.__wbindgen_add_to_stack_pointer(16);
    _w.__wbindgen_free(d0, d1, 1);
  }
}

// ---- CLI ----
if (require.main === module) {
  const [body, method, timestamp, random] = process.argv.slice(2);
  if (!body || !method || !timestamp || !random) {
    console.error('Usage: node sign_service.js <json_body> <method> <timestamp> <random>');
    process.exit(1);
  }
  const sign = generateSign(body, method, timestamp, random);
  process.stdout.write(sign);
}

module.exports = { generateSign };

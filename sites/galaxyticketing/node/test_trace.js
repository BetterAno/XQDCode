const fs = require('fs');
const path = require('path');
let canvasLib = null;
try { canvasLib = require('canvas'); } catch (e) {}

let gc, dc, hc, pc, rc;
let kc = [];
const Cc = [];
const bc = (c) => c;
const fc = (c) => { gc[dc] = c; return dc++; };
const lc = (c) => c;
const qc = (c) => gc[c];

function tv(val) {
  if (val === undefined) return 'undef';
  if (val === null) return 'null';
  if (typeof val === 'string') return 'str(' + val.length + ':"' + val.slice(0, 30) + '")';
  if (typeof val === 'number') return 'num(' + val + ')';
  if (typeof val === 'function') return 'fn';
  if (val && val._isCanvas) return 'canvas(' + val.width + 'x' + val.height + ')';
  if (val && val.data && val.width) return 'imgData(' + val.width + 'x' + val.height + ')';
  return typeof val;
}

const rawOps = {
  0: (c) => qc(c).length,
  5: (c, a, n) => qc(c).addEventListener(qc(a), qc(n)),
  8: () => {
    const img = { src:'', onload:null, width:0, height:0, naturalWidth:0, naturalHeight:0, complete:false, _decoded:null };
    Object.defineProperty(img, 'src', {
      get() { return img._src || ''; },
      set(v) {
        img._src = v; img.complete = true;
        if (v && v.startsWith('data:image')) {
          try { const b64 = v.split(',')[1]; const buf = Buffer.from(b64, 'base64');
            if (canvasLib) { const ci = new canvasLib.Image(); ci.src = buf; img.naturalWidth=ci.width; img.naturalHeight=ci.height; img.width=img.width||ci.width; img.height=img.height||ci.height; img._decoded=ci; }
          } catch(e) {}
        }
        if (typeof img.onload === 'function') setTimeout(() => img.onload(), 0);
      }, configurable: true,
    });
    return fc(img);
  },
  9: (c) => {
    // Dump memory regions between token write and here to check decryption
    if (seq > 25 && seq < 45) {
      console.error('[MEM-OP9] Checking WASM memory after decryption phase...');
      // Check several potential output regions
      for (const off of [79000, 80000, 81000, 81800, 81864, 82000, 82500, 82900]) {
        const view = new Uint8Array(hc.buffer, off, 32);
        const nz = view.filter(v => v !== 0).length;
        if (nz > 0) console.error('[MEM] offset=' + off + ' nz=' + nz + '/32 hex=' + Array.from(view).map(b=>b.toString(16).padStart(2,'0')).join(' '));
      }
      // Full non-zero scan in 79000-100000 range
      const fullView = new Uint8Array(hc.buffer, 79000, 21000);
      let totalNZ = fullView.filter(v => v !== 0).length;
      console.error('[MEM] Total non-zero in 79000-100000: ' + totalNZ);
    }
    return qc(c).width;
  },
  10: (c) => qc(c).height,
  11: (c, a) => { qc(c).width = lc(a); },
  12: (c, a) => { qc(c).height = lc(a); },
  13: (c, a) => { qc(c).src = qc(a); },
  14: (c, a, n) => {
    const data = qc(c); const w = lc(a), h = lc(n);
    // Don't use canvasLib.ImageData - it COPIES data, preventing us from seeing WASM writes
    // Use a plain object that keeps the Uint8ClampedArray VIEW into WASM memory
    const nz = data instanceof Uint8ClampedArray ? data.filter(v => v !== 0).length : -1;
    console.error('[MEM-OP14] ImageData data nz=' + nz + '/' + (data ? data.length : 0) + ' type=' + (data ? data.constructor.name : typeof data));
    if (data instanceof Uint8ClampedArray) {
      const view = Array.from(data.slice(0, 20)).map(b=>b.toString(16).padStart(2,'0')).join(' ');
      console.error('[MEM-OP14] first 20 bytes: ' + view);
    }
    return fc({ data: data instanceof Uint8ClampedArray ? data : new Uint8ClampedArray(w*h*4), width: w, height: h });
  },
  15: (c) => fc(qc(c).data),
  17: (c, a, n, t, e) => fc(qc(c).getImageData(lc(a), lc(n), lc(t), lc(e))),
  18: (c, a, n, t) => qc(c).putImageData(qc(a), lc(n), lc(t)),
  19: (c, a, n, t) => qc(c).drawImage(qc(a), lc(n), lc(t)),
  22: (c, a) => fc(qc(c).getContext(qc(a))),
  23: (c, a) => fc(qc(c).createElement(qc(a))),
  27: (c) => 1,
  10001: () => { gc[dc] = undefined; return dc++; },
  10002: (c) => { gc[c] = undefined; },
  10003: (c, a) => { gc[c] = gc[a]; },
  10010: (c, a) => { gc[dc] = gc[c] ? gc[c][gc[a]] : undefined; return dc++; },
  10011: (c, a, n) => { gc[c][gc[a]] = gc[n]; },
  10020: (c) => +(!gc[c]),
  10030: (c) => { gc[dc] = c; return dc++; },
  10031: (c) => +gc[c],
  10032: (c, a) => { gc[c] = a; },
  10033: (c) => { gc[dc] = !!c; return dc++; },
  10034: (c, a) => gc[c] === gc[a],
  10040: (c, a) => { let n=''; for (let i=c;i<c+a;i++) n+=String.fromCharCode(hc[i]); gc[dc]=n; return dc++; },
  10041: () => { let c='', a=rc; for(;;){ const n=34^hc[a++]; if(!n)break; c+=String.fromCharCode(n); } gc[dc]=c; return dc++; },
  10050: (c) => { gc[dc] = kc[c]; return dc++; },
  10051: () => kc.length,
  10060: (c, a) => { const s=gc[c]; for(let i=0;i<s.length;i++) hc[a+i]=s.charCodeAt(i); return s.length; },
  10061: (c, a, n, t) => { gc[c].set(hc.subarray(n, n+t), a); },
  10062: (c, a, n, t) => { gc[c].subarray(a,a+n).set(hc.subarray(t,t+n)); },
  10063: (c, a) => { gc[dc] = new Uint8ClampedArray(hc.buffer, c, a); return dc++; },
  10070: (c) => {
    gc[dc] = function (c) {
      return function () {
        console.error('[cb] args=' + arguments.length + ' funcIdx=' + c);
        var a = arguments;
        kc = a;
        gc[4] = this;
        var n = dc, t = pc(0, c, 0);
        dc = n;
        return t;
      };
    }(c);
    return dc++;
  },
  20000: (c) => console.log(gc[c]),
  20001: (c, a) => console.log(gc[c], gc[a]),
  20002: (c, a, n) => console.log(gc[c], gc[a], gc[n]),
  30000: () => {},
};

const mc = {};
let seq = 0;
for (const [opStr, handler] of Object.entries(rawOps)) {
  const op = opStr;
  mc[op] = function(...args) {
    seq++;
    const dcBefore = dc;
    const r = handler(...args);
    const opN = Number(op);
    let d = '';
    if (opN === 10050) d = 'kc[' + args[0] + '] => gc[' + dcBefore + '] ' + tv(kc[args[0]]);
    else if (opN === 10010) d = 'gc[' + args[0] + ']["' + tv(gc[args[1]]) + '"] => gc[' + dcBefore + '] ' + tv(gc[dcBefore]);
    else if (opN === 0) d = 'gc[' + args[0] + '].len=' + r + ' val=' + tv(gc[args[0]]).slice(0, 40);
    else if (opN === 10060) d = 'gc[' + args[0] + '].len=' + (gc[args[0]] ? gc[args[0]].length : 'null') + ' -> hc[' + args[1] + ']';
    else if (opN === 10063) d = 'U8CA(hc,' + args[0] + ',' + args[1] + ') => gc[' + dcBefore + ']';
    else if (opN === 14) d = 'ImageData(' + args[1] + ',' + args[2] + ') from gc[' + args[0] + '] => gc[' + dcBefore + ']';
    else if (opN === 10003) d = 'gc[' + args[0] + '] = gc[' + args[1] + ']';
    else if (opN === 10002) d = 'gc[' + args[0] + '] = undef';
    else if (opN === 10041) d = '"' + gc[dcBefore] + '" => gc[' + dcBefore + ']';
    else if (opN === 9) d = 'w=' + r;
    else if (opN === 10) d = 'h=' + r;
    else if (opN === 22) d = 'ctx("' + tv(gc[args[1]]) + '") => gc[' + dcBefore + ']';
    else if (opN === 11) d = 'set w=' + args[1];
    else if (opN === 12) d = 'set h=' + args[1];
    else if (opN === 10031) d = '+gc[' + args[0] + ']=' + r;
    else if (opN === 10070) d = 'cb => gc[' + dcBefore + '] idx=' + args[0];
    else d = 'ret=' + r;
    console.error('#' + seq + ' op' + op + '(' + args.join(',') + ') dc=' + dcBefore + '->' + dc + ' ' + d);
    return r;
  };
}

function buildDocument() {
  return {
    createElement(tag) {
      tag = String(tag).toLowerCase();
      if (tag === 'canvas') return createCanvasEl();
      return { tagName: tag.toUpperCase(), width:120, height:150, style:{}, getContext() { return { putImageData(){}, drawImage(){}, getImageData(x,y,w,h){return{data:new Uint8ClampedArray(w*h*4),width:w,height:h};}, createImageData(w,h){return{data:new Uint8ClampedArray(w*h*4),width:w,height:h};} }; }, addEventListener(){}, removeEventListener(){}, };
    },
    addEventListener() {}, removeEventListener() {},
    getElementById() { return null; }, querySelector() { return null; },
    body: { appendChild(){} }, head: { appendChild(){} },
    documentElement: { clientWidth:1920, clientHeight:1040 },
    cookie: '', referrer: 'https://www.galaxyticketing.com/',
    URL: 'https://www.galaxyticketing.com/',
    domain: 'galaxyticketing.com', readyState: 'complete',
  };
}

function createCanvasEl() {
  let _w=300, _h=150, _rc=null, _rctx=null;
  const ensureReal = () => { if (!_rc && canvasLib) { _rc = canvasLib.createCanvas(_w, _h); _rctx = _rc.getContext('2d'); } };
  const ctx2d = {
    fillStyle:'', strokeStyle:'', lineWidth:1, font:'10px sans-serif', textBaseline:'top', textAlign:'start', globalAlpha:1, imageSmoothingEnabled:true,
    fillRect(){}, strokeRect(){}, clearRect(){}, fillText(){}, strokeText(){}, measureText(t){return{width:(t?t.length:0)*6};},
    beginPath(){}, closePath(){}, moveTo(){}, lineTo(){}, arc(){}, arcTo(){}, rect(){}, quadraticCurveTo(){}, bezierCurveTo(){},
    stroke(){}, fill(){}, clip(){}, save(){}, restore(){}, scale(){}, translate(){}, rotate(){},
    createLinearGradient(){return{addColorStop(){}};}, createRadialGradient(){return{addColorStop(){}};}, createPattern(){return{};},
    setLineDash(){}, getLineDash(){return[];},
    createImageData(w, h) { ensureReal(); if(_rctx) return _rctx.createImageData(w,h); return {data:new Uint8ClampedArray(w*h*4),width:w,height:h}; },
    getImageData(x,y,w,h) { ensureReal(); if(_rctx) return _rctx.getImageData(x,y,w,h); return {data:new Uint8ClampedArray(w*h*4),width:w,height:h}; },
    putImageData(imgData,dx,dy) { ensureReal(); if(_rctx) _rctx.putImageData(imgData,dx,dy); },
    drawImage(img,sx,sy) { ensureReal(); if(_rctx&&img&&img._decoded) _rctx.drawImage(img._decoded,sx,sy); },
  };
  return {
    _isCanvas: true,
    get width() { return _w; }, set width(v) { _w=Number(v)||300; if(_rc) _rc.width=_w; },
    get height() { return _h; }, set height(v) { _h=Number(v)||150; if(_rc) _rc.height=_h; },
    style: {},
    getContext(type) { if(type==='2d') { ensureReal(); return ctx2d; } return null; },
    toDataURL(mime) { ensureReal(); if(_rc) return _rc.toDataURL(mime||'image/png'); return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='; },
    addEventListener(){}, removeEventListener(){},
    get _realCanvas() { return _rc; }, get _realCtx() { return _rctx; },
  };
}

async function main() {
  const wasmBuf = fs.readFileSync(path.join(__dirname, 'program.wasm'));
  const doc = buildDocument();
  gc = [undefined, null, true, false, 0, function(){}, null, doc];
  dc = gc.length;
  const mod = await WebAssembly.compile(wasmBuf);
  const inst = await WebAssembly.instantiate(mod, { a: mc });
  const exp = inst.exports;
  hc = new Uint8Array(exp.memory.buffer);
  pc = exp[0];
  exp._initialize();
  seq = 0;
  rc = pc(1);
  const n = gc.length;
  pc(2);
  dc = n;
  console.error('[wasm] Init: rc=' + rc + ' dc=' + dc + ' gc.len=' + gc.length);
  console.error('[wasm] __update_img: ' + typeof doc.__update_img);
  if (typeof doc.__update_img !== 'function') { console.error('FATAL'); process.exit(1); }

  const input = await new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));
    setTimeout(() => { if (!data) resolve(''); }, 3000);
  });
  if (!input.trim()) { console.error('No stdin'); process.exit(1); }
  const parsed = JSON.parse(input);
  const img = parsed.images[0];
  console.error('Content: ' + img.content.length + ' chars, token: ' + parsed.encryptToken.length + ' chars');

  const canvas = doc.createElement('canvas');
  let ccIdx = Cc.indexOf(canvas);
  if (ccIdx === -1) { ccIdx = Cc.indexOf(null); if (ccIdx === -1) ccIdx = Cc.length; Cc[ccIdx] = canvas; }

  console.error('--- TRACE dc=' + dc + ' ---');
  const result = doc.__update_img(ccIdx, canvas, { token: parsed.encryptToken, data: img.content });
  console.error('--- END ret=' + result + ' dc=' + dc + ' ---');

  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const nonZero = Array.from(imgData.data).filter(v => v !== 0).length;
  console.error('Canvas: ' + canvas.width + 'x' + canvas.height + ' nz=' + nonZero + '/' + imgData.data.length);

  for (let i = 68; i < Math.min(gc.length, 85); i++) {
    console.error('gc[' + i + '] = ' + tv(gc[i]));
  }
}

main().catch(e => { console.error('[fatal] ' + e.message); process.exit(1); });

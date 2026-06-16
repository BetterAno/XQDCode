/**
 * Trace WASM __update_img with fresh API data
 * Focus on understanding why decryption produces zero pixels
 */
const fs = require('fs');
const path = require('path');
let canvasLib = null;
try { canvasLib = require('canvas'); } catch (e) {}
console.error('canvasLib:', canvasLib ? 'YES' : 'NO');

let gc, dc, hc, pc, rc;
let kc = [];
const Cc = [];
const bc = (c) => c;
const fc = (c) => { gc[dc] = c; return dc++; };
const lc = (c) => c;
const qc = (c) => gc[c];

let seq = 0;
const ops = [];

const rawOps = {
  0: (c) => qc(c).length,
  5: (c, a, n) => { try { qc(c).addEventListener(qc(a), qc(n)); } catch(e){} },
  8: () => {
    const img = { src:'', onload:null, width:0, height:0, naturalWidth:0, naturalHeight:0, complete:false, _decoded:null };
    Object.defineProperty(img, 'src', {
      get() { return img._src || ''; },
      set(v) {
        img._src = v; img.complete = true;
        if (v && v.startsWith('data:image')) {
          try {
            const b64 = v.split(',')[1]; const buf = Buffer.from(b64, 'base64');
            if (canvasLib) { const ci = new canvasLib.Image(); ci.src = buf; img.naturalWidth=ci.width; img.naturalHeight=ci.height; img.width=img.width||ci.width; img.height=img.height||ci.height; img._decoded=ci; }
          } catch(e) {}
        }
        if (typeof img.onload === 'function') setTimeout(() => img.onload(), 0);
      }, configurable: true,
    });
    return fc(img);
  },
  9: (c) => qc(c).width,
  10: (c) => qc(c).height,
  11: (c, a) => { qc(c).width = lc(a); },
  12: (c, a) => { qc(c).height = lc(a); },
  13: (c, a) => {
    const el = qc(c);
    const src = qc(a);
    console.error('[op13] set src on ' + (el._isCanvas ? 'canvas' : el.tagName || 'img') + ' src.len=' + (src ? src.length : 0));
    el.src = src;
  },
  14: (c, a, n) => {
    const data = qc(c); const w = lc(a), h = lc(n);
    console.error('[op14] ImageData from gc[' + c + '](' + (data ? data.constructor.name : typeof data) + ', len=' + (data ? data.length : 0) + ') ' + w + 'x' + h);
    if (data instanceof Uint8ClampedArray) {
      const nz = Array.from(data.slice(0, 100)).filter(v => v !== 0).length;
      console.error('[op14] data first 100 bytes nz=' + nz + '/100');
    }
    if (canvasLib) return fc(new canvasLib.ImageData(data, w, h));
    return fc({ data: data instanceof Uint8ClampedArray ? data : new Uint8ClampedArray(w*h*4), width: w, height: h });
  },
  15: (c) => fc(qc(c).data),
  17: (c, a, n, t, e) => fc(qc(c).getImageData(lc(a), lc(n), lc(t), lc(e))),
  18: (c, a, n, t) => {
    console.error('[op18] putImageData gc[' + a + '] at (' + n + ',' + t + ') onto gc[' + c + ']');
    return bc(qc(c).putImageData(qc(a), lc(n), lc(t)));
  },
  19: (c, a, n, t) => {
    console.error('[op19] drawImage');
    return bc(qc(c).drawImage(qc(a), lc(n), lc(t)));
  },
  22: (c, a) => fc(qc(c).getContext(qc(a))),
  23: (c, a) => fc(qc(c).createElement(qc(a))),
  27: (c) => bc(1),
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
  10040: (c, a) => { let n=''; for (let t=c;t<c+a;t++) n+=String.fromCharCode(hc[t]); gc[dc]=n; return dc++; },
  10041: () => { let c='', a=rc; for(;;){ const n=34^hc[a++]; if(!n)break; c+=String.fromCharCode(n); } gc[dc]=c; return dc++; },
  10050: (c) => { gc[dc] = kc[c]; return dc++; },
  10051: () => kc.length,
  10060: (c, a) => {
    const s=gc[c];
    console.error('[op10060] write gc[' + c + '] (len=' + (s?s.length:0) + ') to hc[' + a + ']');
    for(let t=0;t<s.length;t++) hc[a+t]=s.charCodeAt(t); return s.length;
  },
  10061: (c, a, n, t) => { gc[c].set(hc.subarray(n, n+t), a); },
  10062: (c, a, n, t) => { gc[c].subarray(a,a+n).set(hc.subarray(t,t+n)); },
  10063: (c, a) => {
    console.error('[op10063] U8CA(hc.buffer, ' + c + ', ' + a + ') = view of ' + a + ' bytes');
    gc[dc] = new Uint8ClampedArray(hc.buffer, c, a); return dc++;
  },
  10070: (c) => {
    gc[dc] = function (c) {
      return function () {
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
for (const [opStr, handler] of Object.entries(rawOps)) {
  mc[opStr] = function(...args) {
    seq++;
    const r = handler(...args);
    const opN = Number(opStr);
    if (seq > 30) {
      let detail = '';
      if (opN === 10010) detail = ' gc[' + args[0] + ']["' + String(gc[args[1]] || '').slice(0,20) + '"] => ' + typeof r;
      else if (opN === 10060) detail = ' write len=' + (gc[args[0]] ? gc[args[0]].length : 0);
      else if (opN === 10063) detail = ' U8CA(' + args[0] + ',' + args[1] + ')';
      else if (opN === 14) detail = ' ImageData(' + args[1] + ',' + args[2] + ')';
      else if (opN === 9) detail = ' w=' + r;
      else if (opN === 10) detail = ' h=' + r;
      else if (opN === 22) detail = ' ctx';
      else if (opN === 18) detail = ' putImageData';
      else if (opN === 19) detail = ' drawImage';
      else if (opN === 8) detail = ' new Image';
      else if (opN === 13) detail = ' src';
      else if (opN === 10050) detail = ' kc[' + args[0] + ']';
      else if (opN === 10070) detail = ' callback idx=' + args[0];
      else if (opN === 10011) detail = ' gc[' + args[0] + ']["' + String(gc[args[1]] || '').slice(0,20) + '"] = ' + typeof gc[args[2]];
      ops.push('#' + seq + ' op' + opN + '(' + args.join(',') + ')' + detail);
    }
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
    beginPath(){}, closePath(){}, moveTo(){}, lineTo(){}, arc(){}, arcTo(){}, rect:{}, quadraticCurveTo(){}, bezierCurveTo(){},
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
    toDataURL(mime) { ensureReal(); if(_rc) return _rc.toDataURL(mime||'image/png'); return ''; },
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

  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tests', 'fresh_data.json'), 'utf-8'));
  const img = data.images[0];
  const token = data.encryptToken;
  console.error('Token len=' + token.length + ' content len=' + img.content.length);
  console.error('Content prefix: ' + img.content.slice(0, 30));

  const canvas = doc.createElement('canvas');
  let ccIdx = Cc.indexOf(canvas);
  if (ccIdx === -1) { ccIdx = Cc.indexOf(null); if (ccIdx === -1) ccIdx = Cc.length; Cc[ccIdx] = canvas; }

  ops.length = 0;
  seq = 0;
  console.error('\n--- CALLING __update_img ---');
  const result = doc.__update_img(ccIdx, canvas, { token: token, data: img.content });
  console.error('--- RETURNED: ' + result + ' ---');
  console.error('\nOp trace (' + ops.length + ' ops after init):');
  ops.forEach(o => console.error('  ' + o));

  // Check canvas
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const nonZero = Array.from(imgData.data).filter(v => v !== 0).length;
  console.error('\nCanvas: ' + canvas.width + 'x' + canvas.height + ' nonZero=' + nonZero + '/' + imgData.data.length);

  // Check gc slots for relevant objects
  console.error('\ngc state:');
  for (let i = 0; i < Math.min(gc.length, 20); i++) {
    const v = gc[i];
    if (v === undefined) console.error('gc[' + i + '] = undefined');
    else if (v === null) console.error('gc[' + i + '] = null');
    else if (typeof v === 'function') console.error('gc[' + i + '] = fn');
    else if (v._isCanvas) console.error('gc[' + i + '] = canvas(' + v.width + 'x' + v.height + ')');
    else if (v.data && v.width) console.error('gc[' + i + '] = imgData(' + v.width + 'x' + v.height + ')');
    else console.error('gc[' + i + '] = ' + typeof v);
  }
}

main().catch(e => { console.error('[fatal] ' + e.message + '\n' + e.stack); process.exit(1); });

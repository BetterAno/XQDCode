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
  9: (c) => qc(c).width,
  10: (c) => qc(c).height,
  11: (c, a) => { qc(c).width = lc(a); },
  12: (c, a) => { qc(c).height = lc(a); },
  13: (c, a) => { qc(c).src = qc(a); },
  14: (c, a, n) => {
    const data = qc(c); const w = lc(a), h = lc(n);
    if (canvasLib) return fc(new canvasLib.ImageData(data, w, h));
    return fc({ data: data instanceof Uint8ClampedArray ? data : new Uint8ClampedArray(w*h*4), width: w, height: h });
  },
  15: (c) => fc(qc(c).data),
  17: (c, a, n, t, e) => fc(qc(c).getImageData(lc(a), lc(n), lc(t), lc(e))),
  18: (c, a, n, t) => qc(c).putImageData(qc(a), lc(n), lc(t)),
  19: (c, a, n, t) => qc(c).drawImage(qc(a), lc(n), lc(t)),
  22: (c, a) => fc(qc(c).getContext(qc(a))),
  23: (c, a) => fc(qc(c).createElement(qc(a))),
  27: (c) => {
    const fn = qc(c);
    if (typeof fn === 'function') {
      try { fn(); } catch(e) { console.error('[rAF] err:', e.message); }
    }
    return 1;
  },
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

// Trace wrapper
const mc = {};
let seq = 0;
for (const [opStr, handler] of Object.entries(rawOps)) {
  mc[opStr] = function(...args) {
    seq++;
    const opN = Number(opStr);
    if (seq > 70 && opN !== 10001) {
      let d = 'op' + opN + '(' + args.join(',') + ')';
      if (opN === 8) d += ' new Image';
      if (opN === 13) d += ' src len=' + (gc[args[1]] ? gc[args[1]].length : 0);
      if (opN === 14) d += ' ImageData(' + args[1] + ',' + args[2] + ')';
      if (opN === 18) d += ' putImageData';
      if (opN === 19) d += ' drawImage';
      if (opN === 27) d += ' rAF';
      console.error('  #' + seq + ' ' + d);
    }
    return handler(...args);
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
  rc = pc(1);
  const n = gc.length;
  console.error('[wasm] Before pc(2): rc=' + rc + ' seq=' + seq);
  pc(2);
  dc = n;
  console.error('[wasm] After pc(2): dc=' + dc + ' gc.len=' + gc.length + ' seq=' + seq);
  console.error('[wasm] __update_img: ' + typeof doc.__update_img);
  if (typeof doc.__update_img !== 'function') { console.error('FATAL'); process.exit(1); }

  const input = fs.readFileSync(path.join(__dirname, '..', 'tests', 'trace_input.json'), 'utf-8');
  const parsed = JSON.parse(input);
  const img = parsed.images[0];
  console.error('Content: ' + img.content.length + ' chars');

  const canvas = doc.createElement('canvas');
  let ccIdx = Cc.indexOf(canvas);
  if (ccIdx === -1) { ccIdx = Cc.indexOf(null); if (ccIdx === -1) ccIdx = Cc.length; Cc[ccIdx] = canvas; }

  console.error('\n--- CALLING __update_img ---');
  const savedSeq = seq;
  const result = doc.__update_img(ccIdx, canvas, { token: parsed.encryptToken, data: img.content });
  console.error('--- RETURNED: ' + result + ' (ops during call: ' + (seq - savedSeq) + ') ---');

  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const nonZero = Array.from(imgData.data).filter(v => v !== 0).length;
  console.error('Canvas: ' + canvas.width + 'x' + canvas.height + ' nz=' + nonZero + '/' + imgData.data.length);

  // Check gc[8] and gc[9]
  console.error('gc[8] (ctx): ' + typeof gc[8]);
  console.error('gc[9] (imgData): ' + (gc[9] ? gc[9].width + 'x' + gc[9].height : 'null'));

  if (canvas._realCanvas && nonZero > 0) {
    const pngBuf = canvas._realCanvas.toBuffer('image/png');
    const outDir = path.join(__dirname, '..', 'tests', 'decrypt_output');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'rAF_test.png'), pngBuf);
    console.error('SAVED rAF_test.png ' + pngBuf.length + ' bytes');
  }
}
main().catch(e => { console.error('[fatal] ' + e.message); process.exit(1); });

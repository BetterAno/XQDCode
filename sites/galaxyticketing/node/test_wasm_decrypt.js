/**
 * 独立测试: 获取真实 API 数据 → WASM 解密 → 保存 PNG
 * 直接使用 baxia_env.js 的 WASM 初始化逻辑 (不经过 stdio)
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ===================== WASM Runtime (inline, matching scratch-captcha.js) =====================

let canvasLib = null;
try { canvasLib = require('canvas'); } catch (e) {}

let gc, dc, hc, pc, rc;
let kc = [];
const Cc = [];
let traceEnabled = false;
let callCount = 0;
const bc = (c) => c;
const fc = (c) => { gc[dc] = c; return dc++; };
const lc = (c) => c;
const qc = (c) => gc[c];

const uc = {
  0: (c) => bc(qc(c).length),
  5: (c, a, n) => bc(qc(c).addEventListener(qc(a), qc(n))),
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
  9: (c) => bc(qc(c).width),
  10: (c) => bc(qc(c).height),
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
  18: (c, a, n, t) => bc(qc(c).putImageData(qc(a), lc(n), lc(t))),
  19: (c, a, n, t) => bc(qc(c).drawImage(qc(a), lc(n), lc(t))),
  22: (c, a) => fc(qc(c).getContext(qc(a))),
  23: (c, a) => fc(qc(c).createElement(qc(a))),
  27: (c) => {
    const fn = qc(c);
    if (typeof fn === 'function') {
      try { fn(); } catch (e) { console.error('[rAF] error:', e.message); }
    }
    return bc(1);
  },
};

const generalOps = {
  10001: () => { gc[dc] = undefined; return dc++; },
  10002: (c) => { gc[c] = undefined; },
  10003: (c, a) => { gc[c] = gc[a]; },
  10010: (c, a) => {
    const obj = gc[c], key = gc[a];
    const val = obj ? obj[key] : undefined;
    if (traceEnabled) console.error('[op10010] gc[' + c + '][' + JSON.stringify(key) + '] = ' + typeof val + (typeof val === 'string' ? '("' + val.slice(0,50) + '")' : typeof val === 'number' ? '(' + val + ')' : ''));
    gc[dc] = val; return dc++;
  },
  10011: (c, a, n) => {
    if (traceEnabled) console.error('[op10011] gc[' + c + '][' + JSON.stringify(gc[a]) + '] = ' + typeof gc[n] + (typeof gc[n] === 'function' ? '(fn)' : ''));
    gc[c][gc[a]] = gc[n];
  },
  10020: (c) => +(!gc[c]),
  10030: (c) => { gc[dc] = c; return dc++; },
  10031: (c) => { const v = +gc[c]; if (traceEnabled) console.error('[op10031] +gc[' + c + '] = ' + v); return v; },
  10032: (c, a) => { gc[c] = a; },
  10033: (c) => { gc[dc] = !!c; return dc++; },
  10034: (c, a) => gc[c] === gc[a],
  10040: (c, a) => { let n=''; for (let t=c;t<c+a;t++) n+=String.fromCharCode(hc[t]); gc[dc]=n; return dc++; },
  10041: () => {
    let c='', a=rc; for(;;){ const n=34^hc[a++]; if(!n)break; c+=String.fromCharCode(n); }
    if (traceEnabled) console.error('[op10041] str="' + c + '"');
    gc[dc]=c; return dc++;
  },
  10050: (c) => {
    const v = kc[c];
    if (traceEnabled) console.error('[op10050] kc[' + c + '] = ' + typeof v + (v && typeof v === 'object' ? '(' + (Array.isArray(v) ? v : Object.keys(v)).toString().slice(0,50) + ')' : typeof v === 'string' ? '("' + v.slice(0,30) + '")' : '(' + v + ')'));
    gc[dc] = v; return dc++;
  },
  10051: () => kc.length,
  10060: (c, a) => {
    const s=gc[c];
    if (traceEnabled) console.error('[op10060] write gc[' + c + '] (len=' + (s?s.length:'null') + ') to hc[' + a + ']');
    for(let t=0;t<s.length;t++) hc[a+t]=s.charCodeAt(t); return s.length;
  },
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

const mc = { ...uc, ...generalOps };

// Wrap mc to log all opcode calls during __update_img
const mcOriginal = { ...mc };
for (const op of Object.keys(mcOriginal)) {
  mc[op] = function(...args) {
    if (traceEnabled) {
      callCount++;
      if (callCount <= 50) {
        const r = mcOriginal[op](...args);
        let detail = '';
        if (op === '0') detail = ' → len=' + r;
        else if (op === '14') detail = ' → ImageData';
        else if (op === '18') detail = ' putImageData';
        else if (op === '19') detail = ' drawImage';
        else if (op === '22') detail = ' getContext';
        else if (op === '23') detail = ' createElement';
        else if (op === '8') detail = ' new Image';
        console.error('  [call.' + op + '](' + args.join(',') + ')' + detail);
        return r;
      }
    }
    return mcOriginal[op](...args);
  };
}

// ===================== Document =====================

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

// ===================== Init WASM =====================

async function initWasm() {
  const wasmBuf = fs.readFileSync(path.join(__dirname, 'program.wasm'));
  const doc = buildDocument();

  // Match scratch-captcha.js: gc = [undefined, null, true, false, 0, fn, null, document]
  gc = [undefined, null, true, false, 0, function(){}, null, doc];
  dc = gc.length;

  const mod = await WebAssembly.compile(wasmBuf);
  const inst = await WebAssembly.instantiate(mod, { a: mc });
  const exp = inst.exports;

  hc = new Uint8Array(exp.memory.buffer);
  pc = exp[0];
  exp._initialize();

  // Match scratch-captcha.js: rc=pc(1); var n=gc.length; pc(2); dc=n;
  rc = pc(1);
  const n = gc.length;
  pc(2);
  dc = n;

  console.error('[wasm] Init done: rc=' + rc + ' dc=' + dc + ' gc.length=' + gc.length);
  console.error('[wasm] __update_img:', typeof doc.__update_img);
  console.error('[wasm] __delete_img:', typeof doc.__delete_img);
  console.error('[wasm] __update_pos:', typeof doc.__update_pos);

  return doc;
}

// ===================== Main Test =====================

async function main() {
  const outputDir = path.join(__dirname, '..', 'tests', 'decrypt_output');
  fs.mkdirSync(outputDir, { recursive: true });

  // Step 1: Init WASM
  console.error('=== Step 1: WASM Init ===');
  const doc = await initWasm();

  if (typeof doc.__update_img !== 'function') {
    console.error('FATAL: __update_img not installed!');
    process.exit(1);
  }

  // Wait for requestAnimationFrame callbacks to fire (already synchronous)
  console.error('=== Step 1.5: rAF callbacks fired ===');

  // Step 2: Get real API data via HTTP
  console.error('=== Step 2: Fetch captcha data ===');

  // Read test data from stdin or use test_real_data format
  const input = await new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));
    // Timeout if no stdin
    setTimeout(() => { if (!data) resolve(''); }, 2000);
  });

  let encryptToken, images;
  if (input.trim()) {
    const parsed = JSON.parse(input);
    encryptToken = parsed.encryptToken;
    images = parsed.images;
    console.error('Read ' + images.length + ' images from stdin');
  } else {
    console.error('No stdin data. Use: python test_real_decrypt.py | node test_wasm_decrypt.js');
    process.exit(1);
  }

  // Step 3: Decrypt each image
  console.error('=== Step 3: Decrypt ' + images.length + ' images ===');
  let successCount = 0;

  for (const img of images) {
    const idx = img.index || 0;
    const content = img.content;

    // Decode to check raw format
    const raw = Buffer.from(content, 'base64');
    console.error('Image[' + idx + ']: raw=' + raw.length + ' bytes, prefix=' + raw.slice(0, 8).toString('hex'));

    // Create canvas and register in Cc
    const canvas = doc.createElement('canvas');
    let ccIdx = Cc.indexOf(canvas);
    if (ccIdx === -1) {
      ccIdx = Cc.indexOf(null);
      if (ccIdx === -1) ccIdx = Cc.length;
      Cc[ccIdx] = canvas;
    }

    try {
      // Check memory before call
      const memBefore = hc.buffer.byteLength;
      console.error('  Memory before: ' + (memBefore/1024) + ' KB');

      const result = doc.__update_img(ccIdx, canvas, {
        token: encryptToken,
        data: content,
      });

      console.error('  __update_img returned:', result);

      // Check if WASM memory buffer changed (memory growth)
      const memAfter = hc.buffer.byteLength;
      console.error('  Memory after: ' + (memAfter/1024) + ' KB' + (memBefore !== memAfter ? ' CHANGED!' : ''));
      // Re-sync hc if memory grew
      if (memBefore !== memAfter) {
        console.error('  WARNING: WASM memory grew, hc is detached!');
        hc = new Uint8Array(pc.memory ? pc.memory.buffer : memAfter);
      }

      // Check WASM memory for decrypted data at offset 82920 (300*150*4 bytes)
      // This is where op10063 created the Uint8ClampedArray
      const memOffset = 82920;
      const memSize = 300 * 150 * 4; // 180000
      const memView = new Uint8Array(hc.buffer, memOffset, Math.min(memSize, 100));
      const nonZeroMem = Array.from(new Uint8Array(hc.buffer, memOffset, memSize)).filter(v => v !== 0).length;
      console.error('  WASM memory[' + memOffset + '..' + (memOffset+memSize) + ']: nonZero=' + nonZeroMem + '/' + memSize);
      console.error('  First 100 bytes:', Array.from(memView).map(b => b.toString(16).padStart(2,'0')).join(' '));

      // Check gc[8] (2d context) and gc[9] (ImageData) that __update_img stored
      console.error('  gc[8] (ctx):', typeof gc[8], gc[8] ? gc[8].constructor.name : 'null');
      console.error('  gc[9] (imgData):', typeof gc[9], gc[9] ? (gc[9].width + 'x' + gc[9].height) : 'null');
      if (gc[9] && gc[9].data) {
        const imgNonZero = Array.from(gc[9].data).filter(v => v !== 0).length;
        console.error('  gc[9].data nonZero: ' + imgNonZero + '/' + gc[9].data.length);
      }

      // Try manually putting the ImageData onto canvas via gc[8].putImageData(gc[9])
      if (gc[8] && gc[8].putImageData && gc[9]) {
        try {
          gc[8].putImageData(gc[9], 0, 0);
          console.error('  Manual putImageData succeeded');
        } catch (e) {
          console.error('  Manual putImageData error:', e.message);
        }
      }

      // Check canvas
      const ctx = canvas.getContext('2d');
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const nonZero = Array.from(imgData.data).filter(v => v !== 0).length;
      console.error('  Canvas: ' + canvas.width + 'x' + canvas.height + ', nonZero=' + nonZero + '/' + imgData.data.length);

      // Save PNG
      if (canvas._realCanvas && nonZero > 0) {
        const pngBuf = canvas._realCanvas.toBuffer('image/png');
        const fpath = path.join(outputDir, 'decrypted_' + idx + '.png');
        fs.writeFileSync(fpath, pngBuf);
        console.error('  SAVED: ' + fpath + ' (' + pngBuf.length + ' bytes)');
        successCount++;
      } else {
        console.error('  SKIPPED: no pixel data');
      }
    } catch (e) {
      console.error('  Error: ' + e.message);
    } finally {
      Cc[ccIdx] = null;
    }
  }

  console.error('\n=== Result: ' + successCount + '/' + images.length + ' decrypted ===');
}

main().catch(e => {
  console.error('[fatal]', e.message);
  console.error(e.stack);
  process.exit(1);
});

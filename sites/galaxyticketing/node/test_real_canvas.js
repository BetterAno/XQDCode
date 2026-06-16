/**
 * 测试 WASM + 真实 Canvas 渲染
 */
const fs = require('fs');
const path = require('path');
const canvasLib = require('canvas');

const wasmBuf = fs.readFileSync(path.join(__dirname, 'program.wasm'));

const gc = [];
let dc = 4;
let hc = null;
let pc = null;
const kc = [];
let rc = 0;

let realCanvas = null;
let realCtx = null;

const bc = (v) => { gc[dc] = v; return dc++; };
const fc = (v) => { gc[dc] = v; return dc++; };
const lc = (i) => gc[i];
const qc = (i) => gc[i];

const uc = {
  0: (c) => bc(qc(c).length),
  5: (c, a, n) => bc(0),
  8: () => {
    const img = { src: '', onload: null, width: 0, height: 0, naturalWidth: 0, naturalHeight: 0, _decoded: null };
    Object.defineProperty(img, 'src', {
      get() { return img._src || ''; },
      set(v) {
        img._src = v;
        img.complete = true;
        if (v && v.startsWith('data:image')) {
          try {
            const b64 = v.split(',')[1];
            const buf = Buffer.from(b64, 'base64');
            const ci = new canvasLib.Image();
            ci.src = buf;
            img.naturalWidth = ci.width;
            img.naturalHeight = ci.height;
            img.width = img.width || ci.width;
            img.height = img.height || ci.height;
            img._decoded = ci;
          } catch (e) { console.error('[img.src] error:', e.message); }
        }
        if (typeof img.onload === 'function') setTimeout(() => img.onload(), 0);
      },
      configurable: true,
    });
    return fc(img);
  },
  9: (c) => bc(qc(c).width),
  10: (c) => bc(qc(c).height),
  11: (c, a) => { qc(c).width = lc(a); },
  12: (c, a) => { qc(c).height = lc(a); },
  13: (c, a) => {
    console.error('[op13] set src, len=', qc(a) ? qc(a).length : 0);
    qc(c).src = qc(a);
  },
  14: (c, a, n) => {
    const data = qc(c);
    const w = lc(a);
    const h = lc(n);
    console.error('[op14] new ImageData, data len=', data ? data.length : 0, 'w=', w, 'h=', h);
    if (realCtx) {
      const id = realCtx.createImageData(w, h);
      if (data && data.length) id.data.set(data);
      return fc(id);
    }
    return fc({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h });
  },
  15: (c) => fc(qc(c).data),
  17: (c, a, n, t, e) => {
    console.error('[op17] getImageData', lc(a), lc(n), lc(t), lc(e));
    if (realCtx) return fc(realCtx.getImageData(lc(a), lc(n), lc(t), lc(e)));
    return fc({ data: new Uint8ClampedArray(0), width: 0, height: 0 });
  },
  18: (c, a, n, t) => {
    console.error('[op18] putImageData, data type=', qc(a) ? qc(a).constructor.name : 'null');
    if (realCtx) {
      try { realCtx.putImageData(qc(a), lc(n), lc(t)); } catch (e) { console.error('[op18] error:', e.message); }
    }
    return bc(0);
  },
  19: (c, a, n, t) => {
    console.error('[op19] drawImage, has_decoded=', !!qc(a)._decoded);
    if (realCtx && qc(a)._decoded) {
      try { realCtx.drawImage(qc(a)._decoded, lc(n), lc(t)); } catch (e) { console.error('[op19] error:', e.message); }
    }
    return bc(0);
  },
  22: (c, a) => {
    console.error('[op22] getContext(' + qc(a) + '), isReal=', qc(c)._useReal);
    if (qc(c)._useReal) return fc(realCtx);
    return fc({
      putImageData() { return 0; }, drawImage() { return 0; },
      getImageData(x, y, w, h) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; },
      createImageData(w, h) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; },
    });
  },
  23: (c, a) => {
    const tag = qc(a);
    console.error('[op23] createElement(' + tag + ')');
    if (tag === 'canvas') {
      realCanvas = canvasLib.createCanvas(120, 150);
      realCtx = realCanvas.getContext('2d');
      const wrapped = {
        _useReal: true,
        get width() { return realCanvas.width; },
        set width(v) { realCanvas.width = v; },
        get height() { return realCanvas.height; },
        set height(v) { realCanvas.height = v; },
        getContext(type) { return realCtx; },
        toDataURL(mime) { return realCanvas.toDataURL(mime || 'image/png'); },
      };
      return fc(wrapped);
    }
    return fc({
      tagName: tag.toUpperCase(), width: 120, height: 150,
      getContext() {
        return {
          putImageData() { return 0; }, drawImage() { return 0; },
          getImageData(x, y, w, h) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; },
        };
      },
    });
  },
  27: (c) => bc(1),
};

const generalOps = {
  10001: () => { gc[dc] = undefined; return dc++; },
  10002: (c) => { gc[c] = undefined; },
  10003: (c, a) => { gc[c] = gc[a]; },
  10010: (c, a) => { gc[dc] = gc[c][gc[a]]; return dc++; },
  10011: (c, a, n) => {
    const key = gc[a];
    if (typeof key === 'string' && key.startsWith('__')) {
      console.error('[op10011] gc[' + c + '].' + key + ' = ' + typeof gc[n]);
    }
    gc[c][gc[a]] = gc[n];
  },
  10020: (c) => +(!gc[c]),
  10030: (c) => { gc[dc] = c; return dc++; },
  10031: (c) => +gc[c],
  10032: (c, a) => { gc[c] = a; },
  10033: (c) => { gc[dc] = !!c; return dc++; },
  10034: (c, a) => gc[c] === gc[a],
  10040: (c, a) => { let n = ''; for (let t = c; t < c + a; t++) n += String.fromCharCode(hc[t]); gc[dc] = n; return dc++; },
  10041: () => { let c = '', a = rc; for (;;) { const n = 34 ^ hc[a++]; if (!n) break; c += String.fromCharCode(n); } gc[dc] = c; return dc++; },
  10050: (c) => { gc[dc] = kc[c]; return dc++; },
  10051: () => kc.length,
  10060: (c, a) => { const s = gc[c]; for (let t = 0; t < s.length; t++) hc[a + t] = s.charCodeAt(t); return s.length; },
  10061: (c, a, n, t) => { gc[c].set(hc.subarray(n, n + t), a); },
  10062: (c, a, n, t) => { gc[c].subarray(a, a + n).set(hc.subarray(t, t + n)); },
  10063: (c, a) => { gc[dc] = new Uint8ClampedArray(hc.buffer, c, a); return dc++; },
  10070: (c) => {
    gc[dc] = function () {
      kc.length = 0;
      for (let i = 0; i < arguments.length; i++) kc.push(arguments[i]);
      gc[4] = this;
      const s = dc; pc(0, c, 0); dc = s;
    };
    return dc++;
  },
  20000: (c) => console.log(gc[c]),
  20001: (c, a) => console.log(gc[c], gc[a]),
  20002: (c, a, n) => console.log(gc[c], gc[a], gc[n]),
  30000: () => {},
};

const mc = { ...uc, ...generalOps };

async function init() {
  const mod = await WebAssembly.compile(wasmBuf);
  const inst = await WebAssembly.instantiate(mod, { a: mc });
  const exp = inst.exports;
  hc = new Uint8Array(exp.memory.buffer);
  pc = exp[0];
  exp._initialize();
  rc = pc(1);

  const doc = {
    createElement(tag) {
      if (tag === 'canvas') {
        realCanvas = canvasLib.createCanvas(120, 150);
        realCtx = realCanvas.getContext('2d');
        return {
          _useReal: true,
          get width() { return realCanvas.width; },
          set width(v) { realCanvas.width = v; },
          get height() { return realCanvas.height; },
          set height(v) { realCanvas.height = v; },
          getContext(type) { return realCtx; },
          toDataURL(mime) { return realCanvas.toDataURL(mime || 'image/png'); },
        };
      }
      return { tagName: tag.toUpperCase(), width: 120, height: 150, getContext() { return { putImageData() {}, drawImage() {}, getImageData(x,y,w,h) { return {data:new Uint8ClampedArray(w*h*4),width:w,height:h}; } }; } };
    },
    addEventListener() {},
    removeEventListener() {},
  };
  gc[7] = doc;
  dc = gc.length;
  pc(2);

  console.error('\n=== doc.__update_img installed:', typeof doc.__update_img, '===');

  // Test with real encrypted content from the API
  // Use a sample content with 00000003 prefix
  const testContent = Buffer.from(
    '00000003' + 'b9fcb0d7' + 'deadbeef'.repeat(100), 'hex'
  ).toString('base64');

  console.error('\n=== Calling __update_img with test content ===');
  const testCanvas = doc.createElement('canvas');
  try {
    const result = doc.__update_img(0, testCanvas, { token: 'test_token', data: testContent });
    console.error('__update_img returned:', result);
    console.error('Real canvas size:', realCanvas.width, 'x', realCanvas.height);

    // Export
    const dataUrl = realCanvas.toDataURL('image/png');
    const b64 = dataUrl.split(',')[1];
    const pngBuf = Buffer.from(b64, 'base64');
    console.error('PNG size:', pngBuf.length, 'magic:', pngBuf.slice(0, 4).toString('hex'));

    // Check pixel content
    const imgData = realCtx.getImageData(0, 0, realCanvas.width, realCanvas.height);
    const nonZero = imgData.data.filter(v => v !== 0).length;
    console.error('Non-zero pixels:', nonZero, '/', imgData.data.length);

    // Save test output
    fs.writeFileSync(path.join(__dirname, '..', 'tests', 'test_real.png'), pngBuf);
    console.error('Saved test_real.png');
  } catch (e) {
    console.error('__update_img error:', e.message);
    console.error(e.stack);
  }
}

init().catch(e => console.error(e));

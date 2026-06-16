/**
 * 用真实 API 数据测试 WASM 解密
 * 从 stdin 读取 JSON: {encryptToken, images: [{content, imageId, index}]}
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

// 每个 canvas 有独立的 realCanvas/realCtx
const canvasMap = new Map();  // gc_slot -> {canvas, ctx}

const bc = (v) => { gc[dc] = v; return dc++; };
const fc = (v) => { gc[dc] = v; return dc++; };
const lc = (i) => gc[i];
const qc = (i) => gc[i];

const uc = {
  0: (c) => bc(qc(c).length),
  5: (c, a, n) => bc(0),
  8: () => {
    const img = { src: '', onload: null, width: 0, height: 0, naturalWidth: 0, naturalHeight: 0, _decoded: null, complete: false };
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
          } catch (e) {}
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
  13: (c, a) => { qc(c).src = qc(a); },
  14: (c, a, n) => {
    const data = qc(c), w = lc(a), h = lc(n);
    // 找到对应的 real ctx
    // 需要找到当前操作的是哪个 canvas slot
    for (const [slot, entry] of canvasMap) {
      if (entry.ctx) {
        try {
          const id = entry.ctx.createImageData(w, h);
          if (data && data.length) id.data.set(data);
          return fc(id);
        } catch (e) {}
      }
    }
    return fc({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h });
  },
  15: (c) => fc(qc(c).data),
  17: (c, a, n, t, e) => {
    for (const [slot, entry] of canvasMap) {
      if (entry.ctx) {
        try { return fc(entry.ctx.getImageData(lc(a), lc(n), lc(t), lc(e))); } catch (e) {}
      }
    }
    return fc({ data: new Uint8ClampedArray(0), width: 0, height: 0 });
  },
  18: (c, a, n, t) => {
    for (const [slot, entry] of canvasMap) {
      if (entry.ctx) {
        try { entry.ctx.putImageData(qc(a), lc(n), lc(t)); } catch (e) {}
      }
    }
    return bc(0);
  },
  19: (c, a, n, t) => {
    for (const [slot, entry] of canvasMap) {
      if (entry.ctx && qc(a)._decoded) {
        try { entry.ctx.drawImage(qc(a)._decoded, lc(n), lc(t)); } catch (e) {}
      }
    }
    return bc(0);
  },
  22: (c, a) => {
    // 找到 canvas 对应的真实 ctx
    const canvasObj = qc(c);
    for (const [slot, entry] of canvasMap) {
      if (entry.wrapper === canvasObj) return fc(entry.ctx);
    }
    return fc({
      putImageData() { return 0; }, drawImage() { return 0; },
      getImageData(x, y, w, h) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; },
      createImageData(w, h) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; },
    });
  },
  23: (c, a) => {
    const tag = qc(a);
    if (tag === 'canvas') {
      const realC = canvasLib.createCanvas(120, 150);
      const realC2d = realC.getContext('2d');
      const wrapped = {
        _isWrappedCanvas: true,
        get width() { return realC.width; },
        set width(v) { realC.width = v; },
        get height() { return realC.height; },
        set height(v) { realC.height = v; },
        getContext() { return realC2d; },
        toDataURL(mime) { return realC.toDataURL(mime || 'image/png'); },
      };
      // 存储映射
      const slot = dc; // 当前分配的 gc slot
      canvasMap.set(slot, { canvas: realC, ctx: realC2d, wrapper: wrapped });
      return fc(wrapped);
    }
    return fc({
      tagName: tag.toUpperCase(), width: 120, height: 150,
      getContext() {
        return { putImageData() {}, drawImage() {}, getImageData(x,y,w,h) { return {data:new Uint8ClampedArray(w*h*4),width:w,height:h}; } };
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
  10011: (c, a, n) => { gc[c][gc[a]] = gc[n]; },
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

// 全局 doc 对象
const doc = {
  createElement(tag) {
    if (tag === 'canvas') {
      const realC = canvasLib.createCanvas(120, 150);
      const realC2d = realC.getContext('2d');
      const wrapped = {
        _isWrappedCanvas: true,
        get width() { return realC.width; },
        set width(v) { realC.width = v; },
        get height() { return realC.height; },
        set height(v) { realC.height = v; },
        getContext() { return realC2d; },
        toDataURL(mime) { return realC.toDataURL(mime || 'image/png'); },
        getRealCanvas() { return realC; },
        getRealCtx() { return realC2d; },
      };
      return wrapped;
    }
    return { tagName: tag.toUpperCase(), width: 120, height: 150, getContext() { return { putImageData() {}, drawImage() {}, getImageData(x,y,w,h) { return {data:new Uint8ClampedArray(w*h*4),width:w,height:h}; } }; } };
  },
  addEventListener() {},
  removeEventListener() {},
};

async function init() {
  const mod = await WebAssembly.compile(wasmBuf);
  const inst = await WebAssembly.instantiate(mod, { a: mc });
  const exp = inst.exports;
  hc = new Uint8Array(exp.memory.buffer);
  pc = exp[0];
  exp._initialize();
  rc = pc(1);
  gc[7] = doc;
  dc = gc.length;
  pc(2);

  console.error('[wasm] Ready, __update_img:', typeof doc.__update_img);

  // Read input from stdin
  const input = await new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));
  });

  const parsed = JSON.parse(input);
  const encryptToken = parsed.encryptToken;
  const images = parsed.images;

  console.error('[decrypt] Processing', images.length, 'images');
  console.error('[decrypt] encryptToken:', encryptToken.slice(0, 30) + '...');

  const results = [];
  for (const img of images) {
    try {
      const canvas = doc.createElement('canvas');
      const realC = canvas.getRealCanvas();
      const realC2d = canvas.getRealCtx();

      // Register canvas in canvasMap for opcode dispatch
      // We need to map this canvas to the real canvas/ctx pair
      // The WASM will use opcodes to create a NEW canvas (op23),
      // but we need the input canvas (passed as kc[1]) to be the real one

      const result = doc.__update_img(0, canvas, {
        token: encryptToken,
        data: img.content,
      });

      console.error('[decrypt] Image', img.index, 'result:', result, 'canvas:', realC.width, 'x', realC.height);

      // Check pixels
      const imgData = realC2d.getImageData(0, 0, realC.width, realC.height);
      const nonZero = imgData.data.filter(v => v !== 0).length;
      console.error('[decrypt] Non-zero pixels:', nonZero, '/', imgData.data.length);

      // Export PNG
      const pngBuf = realC.toBuffer('image/png');
      results.push({
        index: img.index,
        imageId: img.imageId,
        pngSize: pngBuf.length,
        nonZero,
        png: pngBuf.toString('base64'),
      });
    } catch (e) {
      console.error('[decrypt] Image', img.index, 'error:', e.message);
      results.push({ index: img.index, imageId: img.imageId, error: e.message });
    }
  }

  console.log(JSON.stringify({ success: true, results }));
}

init().catch(e => {
  console.error('[fatal]', e.message);
  console.log(JSON.stringify({ success: false, error: e.message }));
});

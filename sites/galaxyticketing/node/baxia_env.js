/**
 * Baxia WASM 图片解密 - Node.js 补环境脚本
 *
 * 核心原理: 从 scratch-captcha.js 提取 dispatch table 定义
 * 在 Node.js 中手动构建 WASM import object, 加载 program.wasm
 * 通过 __update_img 解密九宫格图片
 *
 * 关键修正 (vs 之前版本):
 * - bc/lc 为 passthrough (返回原始值), 非 gc 存储
 * - gc 初始化 8 项 [undefined, null, true, false, 0, fn, null, document]
 * - dc 在 pc(2) 后重置为 gc.length
 *
 * 通信: stdio JSON-RPC
 */
const fs = require('fs');
const path = require('path');

// 尝试加载 node-canvas
let canvasLib = null;
try {
  canvasLib = require('canvas');
} catch (e) {
  console.error('[env] WARNING: node-canvas not available');
}

// ===================== 运行时变量 =====================

let gc = null;   // value stack
let dc = 0;      // stack pointer
let hc = null;   // WASM memory Uint8Array view
let pc = null;   // WASM call function (entry point)
let kc = [];      // arguments array for callbacks (reassigned by op10070)
let rc = 0;      // string pointer base
const Cc = [];   // canvas registry

// bc: passthrough - returns raw value (used for numeric returns)
const bc = (c) => c;

// fc: store in gc, return slot index (used for object returns)
const fc = (c) => { gc[dc] = c; return dc++; };

// lc: passthrough - returns raw value (used for numeric arguments)
const lc = (c) => c;

// qc: dereference gc slot (used for object arguments)
const qc = (c) => gc[c];

// ===================== Canvas Operations (uc) =====================

const uc = {
  0: (c) => bc(qc(c).length),
  5: (c, a, n) => bc(qc(c).addEventListener(qc(a), qc(n))),
  8: () => {
    // Create Image object
    const img = {
      src: '', onload: null, onerror: null,
      width: 0, height: 0, naturalWidth: 0, naturalHeight: 0,
      complete: false, _decoded: null,
    };
    Object.defineProperty(img, 'src', {
      get() { return img._src || ''; },
      set(v) {
        img._src = v;
        img.complete = true;
        if (v && v.startsWith('data:image')) {
          try {
            const b64 = v.split(',')[1];
            const buf = Buffer.from(b64, 'base64');
            if (canvasLib) {
              const ci = new canvasLib.Image();
              ci.src = buf;
              img.naturalWidth = ci.width;
              img.naturalHeight = ci.height;
              img.width = img.width || ci.width;
              img.height = img.height || ci.height;
              img._decoded = ci;
            }
          } catch (e) {}
        }
        if (typeof img.onload === 'function') {
          setTimeout(() => { try { img.onload(); } catch (e) {} }, 0);
        }
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
    const data = qc(c);
    const w = lc(a), h = lc(n);
    if (canvasLib) {
      return fc(new canvasLib.ImageData(data, w, h));
    }
    return fc({ data: data instanceof Uint8ClampedArray ? data : new Uint8ClampedArray(w * h * 4), width: w, height: h });
  },
  15: (c) => fc(qc(c).data),
  17: (c, a, n, t, e) => fc(qc(c).getImageData(lc(a), lc(n), lc(t), lc(e))),
  18: (c, a, n, t) => bc(qc(c).putImageData(qc(a), lc(n), lc(t))),
  19: (c, a, n, t) => bc(qc(c).drawImage(qc(a), lc(n), lc(t))),
  22: (c, a) => fc(qc(c).getContext(qc(a))),
  23: (c, a) => fc(qc(c).createElement(qc(a))),
  27: (c) => bc(1),
};

// ===================== General Opcodes =====================

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
  10040: (c, a) => {
    let n = '';
    for (let t = c; t < c + a; t++) n += String.fromCharCode(hc[t]);
    gc[dc] = n; return dc++;
  },
  10041: () => {
    let c = '', a = rc;
    for (;;) {
      const n = 34 ^ hc[a++];
      if (!n) break;
      c += String.fromCharCode(n);
    }
    gc[dc] = c; return dc++;
  },
  10050: (c) => { gc[dc] = kc[c]; return dc++; },
  10051: () => kc.length,
  10060: (c, a) => {
    const s = gc[c];
    for (let t = 0; t < s.length; t++) hc[a + t] = s.charCodeAt(t);
    return s.length;
  },
  10061: (c, a, n, t) => { gc[c].set(hc.subarray(n, n + t), a); },
  10062: (c, a, n, t) => { gc[c].subarray(a, a + n).set(hc.subarray(t, t + n)); },
  10063: (c, a) => { gc[dc] = new Uint8ClampedArray(hc.buffer, c, a); return dc++; },
  10070: (c) => {
    gc[dc] = function (c) {
      return function () {
        var a = arguments;
        // eslint-disable-next-line no-unused-vars
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

// ===================== Document / Browser Env =====================

function buildDocument() {
  const doc = {
    createElement(tag) {
      tag = String(tag).toLowerCase();
      if (tag === 'canvas') {
        return createCanvasElement();
      }
      return {
        tagName: tag.toUpperCase(), nodeName: tag.toUpperCase(),
        width: 120, height: 150, style: {},
        getContext() {
          return {
            putImageData() {}, drawImage() {},
            getImageData(x, y, w, h) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; },
            createImageData(w, h) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; },
          };
        },
        addEventListener() {}, removeEventListener() {},
        appendChild() {}, removeChild() {},
        setAttribute() {}, getAttribute() { return null; },
      };
    },
    addEventListener() {},
    removeEventListener() {},
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementsByTagName() { return []; },
    getElementsByClassName() { return []; },
    body: { appendChild() {}, removeChild() {} },
    head: { appendChild() {} },
    documentElement: { clientWidth: 1920, clientHeight: 1040 },
    cookie: '',
    referrer: 'https://www.galaxyticketing.com/',
    URL: 'https://www.galaxyticketing.com/',
    domain: 'galaxyticketing.com',
    readyState: 'complete',
    visibilityState: 'visible',
    hidden: false,
  };
  return doc;
}

function createCanvasElement() {
  let _width = 300, _height = 150;
  let _realCanvas = null;
  let _realCtx = null;

  const ensureReal = () => {
    if (!_realCanvas && canvasLib) {
      _realCanvas = canvasLib.createCanvas(_width, _height);
      _realCtx = _realCanvas.getContext('2d');
    }
  };

  const ctx2d = {
    fillStyle: '', strokeStyle: '', lineWidth: 1, font: '10px sans-serif',
    textBaseline: 'top', textAlign: 'start', globalAlpha: 1,
    imageSmoothingEnabled: true,
    fillRect() {}, strokeRect() {}, clearRect() {},
    fillText() {}, strokeText() {}, measureText(t) { return { width: (t ? t.length : 0) * 6 }; },
    beginPath() {}, closePath() {}, moveTo() {}, lineTo() {},
    arc() {}, arcTo() {}, rect() {}, quadraticCurveTo() {}, bezierCurveTo() {},
    stroke() {}, fill() {}, clip() {},
    save() {}, restore() {}, scale() {}, translate() {}, rotate() {},
    createLinearGradient() { return { addColorStop() {} }; },
    createRadialGradient() { return { addColorStop() {} }; },
    createPattern() { return {}; },
    setLineDash() {}, getLineDash() { return []; },
    createImageData(w, h) {
      ensureReal();
      if (_realCtx) {
        return _realCtx.createImageData(w, h);
      }
      return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h };
    },
    getImageData(x, y, w, h) {
      ensureReal();
      if (_realCtx) {
        return _realCtx.getImageData(x, y, w, h);
      }
      return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h };
    },
    putImageData(imgData, dx, dy) {
      ensureReal();
      if (_realCtx) {
        _realCtx.putImageData(imgData, dx, dy);
      }
    },
    drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh) {
      ensureReal();
      if (_realCtx && img && img._decoded) {
        if (arguments.length === 3) {
          _realCtx.drawImage(img._decoded, sx, sy);
        } else if (arguments.length === 5) {
          _realCtx.drawImage(img._decoded, sx, sy, sw, sh);
        } else {
          _realCtx.drawImage(img._decoded, sx, sy, sw, sh, dx, dy, dw, dh);
        }
      }
    },
  };

  const canvas = {
    _isCanvas: true,
    get width() { return _width; },
    set width(v) {
      _width = Number(v) || 300;
      if (_realCanvas) _realCanvas.width = _width;
    },
    get height() { return _height; },
    set height(v) {
      _height = Number(v) || 150;
      if (_realCanvas) _realCanvas.height = _height;
    },
    style: {},
    getContext(type) {
      if (type === '2d') {
        ensureReal();
        return ctx2d;
      }
      return null;
    },
    toDataURL(mime) {
      ensureReal();
      if (_realCanvas) {
        return _realCanvas.toDataURL(mime || 'image/png');
      }
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    },
    addEventListener() {}, removeEventListener() {},
    getBoundingClientRect() {
      return { top: 0, left: 0, right: _width, bottom: _height, width: _width, height: _height, x: 0, y: 0 };
    },
    get _realCanvas() { return _realCanvas; },
    get _realCtx() { return _realCtx; },
  };
  return canvas;
}

// ===================== WASM Initialization =====================

async function initWasm() {
  const wasmPath = path.join(__dirname, 'program.wasm');
  const wasmBuf = fs.readFileSync(wasmPath);

  // Build document
  const doc = buildDocument();

  // CRITICAL: Initialize gc exactly as scratch-captcha.js does
  // gc = [undefined, null, true, false, 0, function(){}, self, self.document]
  gc = [undefined, null, true, false, 0, function () {}, null, doc];
  dc = gc.length; // = 8

  console.error('[wasm] Compiling program.wasm...');
  const wasmModule = await WebAssembly.compile(wasmBuf);
  console.error('[wasm] Compiled, instantiating with dispatch table...');

  const instance = await WebAssembly.instantiate(wasmModule, { a: mc });
  const exp = instance.exports;

  console.error('[wasm] Exports:', Object.keys(exp).join(', '));

  hc = new Uint8Array(exp.memory.buffer);
  pc = exp[0] || exp.call || exp.main;

  if (exp._initialize) {
    console.error('[wasm] Calling _initialize()...');
    exp._initialize();
  }

  // CRITICAL: Match scratch-captcha.js init sequence exactly:
  // rc = pc(1); var n = gc.length; pc(2); dc = n;
  rc = pc(1);
  const n = gc.length;
  pc(2);
  dc = n; // Reset dc to gc.length before pc(2)

  console.error('[wasm] Initialized: rc=' + rc + ', dc=' + dc + ', gc.length=' + gc.length);

  if (typeof doc.__update_img === 'function') {
    console.error('[wasm] SUCCESS: document.__update_img installed!');
    if (typeof doc.__delete_img === 'function') {
      console.error('[wasm] SUCCESS: document.__delete_img installed!');
    }
    if (typeof doc.__update_pos === 'function') {
      console.error('[wasm] SUCCESS: document.__update_pos installed!');
    }
  } else {
    console.error('[wasm] WARNING: __update_img not found');
    const keys = Object.keys(doc).filter(k => k.startsWith('__'));
    console.error('[wasm] Document __ keys:', keys.join(', '));
  }

  return { doc, gc };
}

// ===================== Image Decryption =====================

function decryptImage(doc, encryptToken, contentBase64) {
  if (typeof doc.__update_img !== 'function') {
    throw new Error('__update_img not available');
  }

  // Create canvas via document.createElement (same path as browser)
  const canvas = doc.createElement('canvas');

  // Register in Cc array (same as scratch-captcha updateImg)
  let idx = Cc.indexOf(canvas);
  if (idx === -1) {
    idx = Cc.indexOf(null);
    if (idx === -1) idx = Cc.length;
    Cc[idx] = canvas;
  }

  try {
    const result = doc.__update_img(idx, canvas, {
      token: encryptToken,
      data: contentBase64,
    });

    // __update_img returns error code (>0 = error)
    if (result > 0) {
      const errors = ['CANVAS_NOT_FOUND', 'INVALID_TOKEN', 'DECRYPT_FAILED', 'MEMORY_ERROR'];
      throw new Error(errors[result - 1] || 'ERROR_' + result);
    }

    // Extract image from canvas
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const nonZero = Array.from(imgData.data).filter(v => v !== 0).length;
    console.error('[decrypt] Canvas ' + canvas.width + 'x' + canvas.height + ', nonZero=' + nonZero + '/' + imgData.data.length);

    // Convert to PNG
    if (canvas._realCanvas) {
      const pngBuf = canvas._realCanvas.toBuffer('image/png');
      return {
        png: pngBuf.toString('base64'),
        width: canvas.width,
        height: canvas.height,
        nonZero,
        size: pngBuf.length,
      };
    }

    // Fallback: raw RGBA
    const rgbaBuf = Buffer.from(imgData.data.buffer, imgData.data.byteOffset, imgData.data.byteLength);
    return {
      png: rgbaBuf.toString('base64'),
      width: canvas.width,
      height: canvas.height,
      nonZero,
      size: rgbaBuf.length,
      rawRgba: true,
    };
  } finally {
    Cc[idx] = null;
  }
}

// ===================== stdio JSON-RPC =====================

async function runStdio() {
  const { doc } = await initWasm();

  console.error('[env] Ready, listening on stdin...');

  let buf = '';
  process.stdin.setEncoding('utf-8');
  process.stdin.on('data', (chunk) => {
    buf += chunk;
    let idx;
    while ((idx = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (!line) continue;
      let req;
      try { req = JSON.parse(line); } catch (e) {
        process.stdout.write(JSON.stringify({ id: 0, error: 'bad json' }) + '\n');
        continue;
      }
      handleRequest(req, doc);
    }
  });
  process.stdin.on('end', () => process.exit(0));
}

function handleRequest(req, doc) {
  const id = req.id || 0;
  try {
    if (req.action === 'ping') {
      process.stdout.write(JSON.stringify({ id, ok: true }) + '\n');
      return;
    }

    if (req.action === 'decrypt_image') {
      const { encryptToken, content } = req;
      if (!encryptToken || !content) {
        process.stdout.write(JSON.stringify({ id, error: 'missing encryptToken or content' }) + '\n');
        return;
      }
      const result = decryptImage(doc, encryptToken, content);
      process.stdout.write(JSON.stringify({ id, ok: true, ...result }) + '\n');
      return;
    }

    if (req.action === 'decrypt_batch') {
      const { encryptToken, images } = req;
      if (!encryptToken || !images) {
        process.stdout.write(JSON.stringify({ id, error: 'missing params' }) + '\n');
        return;
      }
      const results = [];
      for (const img of images) {
        try {
          const r = decryptImage(doc, encryptToken, img.content);
          results.push(r);
        } catch (e) {
          console.error('[decrypt] Image ' + img.index + ' error:', e.message);
          results.push({ index: img.index, error: e.message });
        }
      }
      process.stdout.write(JSON.stringify({ id, ok: true, results }) + '\n');
      return;
    }

    process.stdout.write(JSON.stringify({ id, error: 'unknown action: ' + req.action }) + '\n');
  } catch (e) {
    process.stdout.write(JSON.stringify({ id, error: e.message }) + '\n');
  }
}

// ===================== Entry =====================

async function main() {
  const mode = process.argv[2] || '';
  if (mode === '--stdio' || mode === 'stdio') {
    return runStdio();
  }

  // Test mode
  console.error('[test] Initializing...');
  const { doc } = await initWasm();
  console.error('[test] Done. __update_img:', typeof doc.__update_img);

  // Quick test with synthetic data
  if (typeof doc.__update_img === 'function') {
    const testCanvas = doc.createElement('canvas');
    try {
      const r = doc.__update_img(0, testCanvas, {
        token: 'test',
        data: Buffer.from('00000003' + 'cafebabe'.repeat(50), 'hex').toString('base64'),
      });
      console.error('[test] __update_img returned:', r);
    } catch (e) {
      console.error('[test] __update_img error:', e.message);
    }
  }
}

main().catch(e => {
  console.error('[fatal]', e.message);
  process.exit(1);
});

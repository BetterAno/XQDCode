/**
 * jcap WASM Node.js 补环境 - 完整实现
 * 
 * WASM 导出:
 *   S: memory
 *   T: function (encrypt main?)
 *   U: function (1 param) -> _ac (alloc/process)
 *   V: function (1 param) -> _U (utility)
 *   W: function (1 param) -> _pb (process block)
 *   X: table
 *   Y: function (2 params) -> _gc (generate cipher?)
 * 
 * 44 imports from module "a" (emscripten runtime)
 */
const fs = require('fs');
const path = require('path');

// 加载 WASM 二进制
const wasmPath = path.join(__dirname, 'jcap.wasm');
const wasmBuffer = fs.readFileSync(wasmPath);

// Emscripten-like runtime
class EmscriptenRuntime {
    constructor() {
        this.HEAP8 = null;
        this.HEAPU8 = null;
        this.HEAP32 = null;
        this.HEAPU32 = null;
        this._sbrk_ptr = 0;
        this._memory = null;
        this._mallocChunks = new Map(); // ptr -> size
        this._nextPtr = 1024; // start allocations after some reserved space
    }

    setMemory(memory) {
        this._memory = memory;
        this.HEAP8 = new Int8Array(memory.buffer);
        this.HEAPU8 = new Uint8Array(memory.buffer);
        this.HEAP32 = new Int32Array(memory.buffer);
        this.HEAPU32 = new Uint32Array(memory.buffer);
        this._sbrk_ptr = 0;
    }

    // malloc-like: allocate bytes, return pointer
    malloc(size) {
        // Align to 16 bytes
        const aligned = (size + 15) & ~15;
        const ptr = this._nextPtr;
        this._nextPtr += aligned;
        this._mallocChunks.set(ptr, aligned);
        // Grow memory if needed
        const neededPages = Math.ceil((ptr + aligned) / 65536);
        const currentPages = this._memory.buffer.byteLength / 65536;
        if (neededPages > currentPages) {
            this._memory.grow(neededPages - currentPages);
            this.HEAP8 = new Int8Array(this._memory.buffer);
            this.HEAPU8 = new Uint8Array(this._memory.buffer);
            this.HEAP32 = new Int32Array(this._memory.buffer);
            this.HEAPU32 = new Uint32Array(this._memory.buffer);
        }
        return ptr;
    }

    free(ptr) {
        this._mallocChunks.delete(ptr);
    }

    // sbrk - increment program break
    sbrk(increment) {
        const old = this._sbrk_ptr;
        this._sbrk_ptr += increment;
        return old;
    }

    // memcpy
    memcpy(dest, src, n) {
        const heap = this.HEAPU8;
        for (let i = 0; i < n; i++) {
            heap[dest + i] = heap[src + i];
        }
        return dest;
    }

    // memset  
    memset(ptr, value, num) {
        this.HEAPU8.fill(value & 0xFF, ptr, ptr + num);
        return ptr;
    }

    // String helper
    writeString(ptr, str) {
        const buf = Buffer.from(str, 'utf8');
        for (let i = 0; i < buf.length; i++) {
            this.HEAPU8[ptr + i] = buf[i];
        }
        this.HEAPU8[ptr + buf.length] = 0;
    }

    readString(ptr) {
        const heap = this.HEAPU8;
        let end = ptr;
        while (heap[end] !== 0 && end < heap.length) end++;
        return Buffer.from(heap.slice(ptr, end)).toString('utf8');
    }

    readCString(ptr, maxLen = 65536) {
        const heap = this.HEAPU8;
        let end = ptr;
        while (end < Math.min(ptr + maxLen, heap.length) && heap[end] !== 0) {
            end++;
        }
        return Buffer.from(heap.slice(ptr, end)).toString('utf8');
    }

    // Generate import object for WebAssembly
    createImportObject(memory) {
        const rt = this;

        // 44 import functions for module "a"
        const a_exports = {
            // === Memory management ===
            // a.c (type 3: i32 -> i32) - malloc/realloc
            c: (size) => rt.malloc(size),
            // a.d (type 4: i32,i32 -> i32) - calloc/realloc
            d: (ptr, size) => {
                if (ptr === 0) return rt.malloc(size);
                // realloc
                const newPtr = rt.malloc(size);
                const oldSize = rt._mallocChunks.get(ptr) || 0;
                const copySize = Math.min(oldSize, size);
                for (let i = 0; i < copySize; i++) {
                    rt.HEAPU8[newPtr + i] = rt.HEAPU8[ptr + i];
                }
                rt.free(ptr);
                return newPtr;
            },
            // a.e (type 4: i32,i32 -> i32)
            e: (ptr, size) => ptr ? rt.malloc(size) : 0,
            // a.m (type 3: i32 -> i32)
            m: (size) => rt.malloc(size),
            // a.v (type 3: i32 -> i32)
            v: (size) => rt.malloc(size),
            // a.D (type 3: i32 -> i32) 
            D: (size) => rt.malloc(size),
            // a.J (type 3: i32 -> i32)
            J: (size) => rt.malloc(size),
            // a.K (type 3: i32 -> i32)
            K: (size) => rt.malloc(size),
            // a.P (type 3: i32 -> i32)
            P: (size) => rt.malloc(size),
            // a.Q (type 3: i32 -> i32)
            Q: (size) => rt.malloc(size),
            // a.N (type 4: i32,i32 -> i32)
            N: (a, b) => rt.malloc(a * b),

            // === Memory operations ===
            // a.a (type 5: i32,i32,i32 -> void) - memcpy
            a: (dest, src, n) => { rt.memcpy(dest, src, n); },
            // a.g (type 5: i32,i32,i32 -> void)
            g: (a, b, c) => { rt.memcpy(a, b, c); },
            // a.i (type 5: i32,i32,i32 -> void)
            i: (a, b, c) => { rt.memcpy(a, b, c); },
            // a.l (type 5: i32,i32,i32 -> void)
            l: (a, b, c) => { rt.memset(a, b, c); },
            // a.p (type 5: i32,i32,i32 -> void) - strlen + memcpy?
            p: (a, b, c) => { rt.memcpy(a, b, c); },
            // a.j (type 2: i32,i32,i32 -> i32) - emscripten_memcpy_big
            j: (dest, src, n) => { rt.memcpy(dest, src, n); return dest; },

            // === Free operations ===
            // a.E (type 0: i32 -> void) - free
            E: (ptr) => { rt.free(ptr); },
            // a.n (type 0: i32 -> void) - free
            n: (ptr) => { rt.free(ptr); },
            // a.r (type 0: i32 -> void) - free
            r: (ptr) => { rt.free(ptr); },
            // a.w (type 0: i32 -> void) - free
            w: (ptr) => { rt.free(ptr); },
            // a.x (type 0: i32 -> void) - free/abort
            x: (ptr) => { /* abort handler */ },
            // a.y (type 9: void -> void) - abort
            y: () => { throw new Error('WASM abort called'); },
            // a.z (type 9: void -> void) - abort
            z: () => { throw new Error('WASM abort called'); },

            // === I/O ===
            // a.I (type 28: 13x i32 -> void) - fd_write / printf
            I: (fd, iov, iovcnt, pnum, ...args) => {
                // fd_write implementation
                let written = 0;
                for (let i = 0; i < iovcnt; i++) {
                    const ptr = rt.HEAPU32[(iov + i * 8) >> 2];
                    const len = rt.HEAPU32[(iov + i * 8 + 4) >> 2];
                    if (fd === 1 || fd === 2) { // stdout/stderr
                        const str = Buffer.from(rt.HEAPU8.slice(ptr, ptr + len)).toString('utf8');
                        if (fd === 2) console.error('[WASM stderr]', str);
                    }
                    written += len;
                }
                if (pnum) rt.HEAPU32[pnum >> 2] = written;
            },

            // a.f (type 25: 10x i32 -> void)
            f: (...args) => { /* large operation stub */ },
            // a.H (type 13: 6x i32 -> void)
            H: (...args) => { /* operation stub */ },
            // a.s (type 27: 7x i32 -> void)
            s: (...args) => { /* operation stub */ },
            // a.t (type 4: i32,i32 -> i32) - resize heap
            t: (a, b) => { return rt.malloc(Math.max(a, b)); },
            // a.u (type 4: i32,i32 -> i32) - resize heap
            u: (a, b) => { return rt.malloc(Math.max(a, b)); },

            // === Math ===
            // a.B (type 15: void -> f64) - emscripten_get_now / date
            B: () => Date.now(),
            // a.o (type 15: void -> f64) - random / timestamp
            o: () => Math.random(),
            // a.R (type 15: void -> f64) - timestamp
            R: () => Date.now(),

            // a.b (type 12: 5x i32 -> void)
            b: (...args) => { /* stub */ },
            // a.F (type 8: 4x i32 -> void)
            F: (...args) => { /* stub */ },
            // a.G (type 1: i32,i32 -> void)
            G: (a, b) => { /* stub */ },
            // a.q (type 1: i32,i32 -> void) - __cxa_throw / error handling
            q: (a, b) => { /* exception handling stub */ },
            // a.A (type 19: i32,f64 -> i32)
            A: (a, b) => { return 0; },
            // a.C (type 7: void -> i32)
            C: () => { return 0; },
            // a.L (type 29: void -> f32)
            L: () => { return Math.random() * 4294967296; },
            // a.M (type 7: void -> i32)
            M: () => { return Math.floor(Math.random() * 2147483648); },
            // a.O (type 7: void -> i32)
            O: () => { return Math.floor(Math.random() * 2147483648); },
            // a.h (type 18: i32,i32,i32 -> f64)
            h: (a, b, c) => { return 0; },
            // a.k (type 26: 5x i32 -> f64)
            k: (...args) => { return 0; },
        };

        return { a: a_exports };
    }
}

// ============================================================
// stdio 模式: 从 stdin 读取 JSON, 调用 WASM 加密, 输出到 stdout
// ============================================================
function runStdioMode() {
    let inputData = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (chunk !== null) inputData += chunk;
    });
    process.stdin.on('end', async () => {
        try {
            const params = JSON.parse(inputData);
            const result = await handleRequest(params);
            process.stdout.write(JSON.stringify(result));
        } catch (e) {
            process.stderr.write(JSON.stringify({success: false, error: e.message}));
            process.exit(1);
        }
    });
}

async function handleRequest(params) {
    const action = params.action || 'getCTData';
    const si = params.si || '';
    const info = params.info || {};
    
    const rt = new EmscriptenRuntime();
    
    // Create memory
    const memory = new WebAssembly.Memory({ initial: 512, maximum: 2048 });
    rt.setMemory(memory);
    
    // Instantiate WASM
    const mod = new WebAssembly.Module(wasmBuffer);
    const imports = rt.createImportObject(memory);
    const instance = new WebAssembly.Instance(mod, imports);
    const exports = instance.exports;
    
    // Write si to WASM memory
    const siOffset = 256;
    rt.writeString(siOffset, si);
    
    let result = '';
    
    switch (action) {
        case 'getCTData':
            // Call the encryption chain for CT
            try {
                exports.Y(siOffset, si.length);  // _gc
                exports.W(siOffset);  // _pb
                exports.V(siOffset);  // _U
                // Read result from memory
                const outPtr = rt.HEAPU32[1024 >> 2];  // Check where result is stored
                if (outPtr && outPtr > 0 && outPtr < rt.HEAPU8.length) {
                    result = rt.readCString(outPtr);
                }
            } catch(e) {
                return {success: false, error: 'getCTData failed: ' + e.message};
            }
            break;
        case 'getTKData':
            try {
                exports.Y(siOffset, si.length);
                exports.U(siOffset);
                const outPtr = rt.HEAPU32[1024 >> 2];
                if (outPtr && outPtr > 0) result = rt.readCString(outPtr);
            } catch(e) {
                return {success: false, error: 'getTKData failed: ' + e.message};
            }
            break;
        case 'getCSData':
            try {
                exports.Y(siOffset, si.length);
                // cs specific call chain
                const outPtr = rt.HEAPU32[1024 >> 2];
                if (outPtr && outPtr > 0) result = rt.readCString(outPtr);
            } catch(e) {
                return {success: false, error: 'getCSData failed: ' + e.message};
            }
            break;
        default:
            return {success: false, error: 'Unknown action: ' + action};
    }
    
    if (result) {
        return {success: true, data: result, action: action};
    } else {
        // Try to find result in memory
        for (let ptr = 256; ptr < 65536; ptr += 4) {
            const val = rt.HEAPU32[ptr >> 2];
            if (val > 1024 && val < rt.HEAPU8.length) {
                const test = rt.readCString(val, 50);
                if (test.length > 20 && /^[A-Za-z0-9+/=_-]+$/.test(test)) {
                    return {success: true, data: test, action: action, foundAt: val};
                }
            }
        }
        return {success: false, error: 'No output found in WASM memory', action: action};
    }
}

// 主函数
async function main() {
    console.log('=== jcap WASM Node.js 补环境 ===');
    console.log(`WASM binary: ${wasmBuffer.length} bytes`);
    
    const rt = new EmscriptenRuntime();
    
    // 分析 WASM 模块
    const mod = new WebAssembly.Module(wasmBuffer);
    const importList = WebAssembly.Module.imports(mod);
    const exportList = WebAssembly.Module.exports(mod);
    
    console.log(`Imports: ${importList.length}, Exports: ${exportList.length}`);
    
    for (const exp of exportList) {
        console.log(`  Export: ${exp.name} (${exp.kind})`);
    }
    
    // 创建 memory
    const memory = new WebAssembly.Memory({
        initial: 512,
        maximum: 2048
    });
    
    rt.setMemory(memory);
    
    // 创建 imports
    const imports = rt.createImportObject(memory);
    
    // 实例化 WASM
    let instance;
    try {
        instance = new WebAssembly.Instance(mod, imports);
        console.log('\nWASM instantiated successfully!');
    } catch (e) {
        console.error('WASM instantiation failed:', e.message);
        
        // Check for missing imports
        const provided = new Set(Object.keys(imports.a));
        const required = new Set(importList.filter(i => i.module === 'a').map(i => i.name));
        const missing = [...required].filter(x => !provided.has(x));
        console.log('Missing imports:', missing.join(', '));
        return;
    }
    
    const exports = instance.exports;
    
    // 设置 table (如果存在)
    if (exports.X) {
        console.log(`Table X has ${exports.X.length} entries`);
    }
    
    // 测试加密函数
    const testSi = 'dcr7_gABAAAGoUilqQIAMHJmrlhIvz9RIEm-mqcPKpQfZf1PlhBCZXXrczd1TqnROY7nt1r620knAe9_wX-AsAAAAAA';
    
    console.log(`\n=== Testing with si: ${testSi.substring(0, 50)}... ===`);
    
    // 写入测试 si 到 WASM 内存
    const siOffset = 256; // 使用安全偏移
    rt.writeString(siOffset, testSi);
    console.log(`si written at offset ${siOffset}, length: ${testSi.length}`);
    
    // 尝试调用 T 函数（主入口）
    if (exports.T && typeof exports.T === 'function') {
        try {
            console.log('Calling T(siPtr, siLen)...');
            const result = exports.T(siOffset, testSi.length);
            console.log(`T() returned: ${result} (${typeof result})`);
        } catch (e) {
            console.error('T() error:', e.message);
        }
    }
    
    // 尝试调用 U 函数
    if (exports.U && typeof exports.U === 'function') {
        try {
            console.log('Calling U(siPtr)...');
            const result = exports.U(siOffset);
            console.log(`U() returned: ${result} (${typeof result})`);
        } catch (e) {
            console.error('U() error:', e.message);
        }
    }
    
    // 尝试调用 V 函数
    if (exports.V && typeof exports.V === 'function') {
        try {
            console.log('Calling V(siPtr)...');
            const result = exports.V(siOffset);
            console.log(`V() returned: ${result} (${typeof result})`);
        } catch (e) {
            console.error('V() error:', e.message);
        }
    }
    
    // 尝试调用 W 函数
    if (exports.W && typeof exports.W === 'function') {
        try {
            console.log('Calling W(siPtr)...');
            const result = exports.W(siOffset);
            console.log(`W() returned: ${result} (${typeof result})`);
        } catch (e) {
            console.error('W() error:', e.message);
        }
    }
    
    // 尝试调用 Y 函数
    if (exports.Y && typeof exports.Y === 'function') {
        try {
            console.log('Calling Y(siPtr, siLen)...');
            const result = exports.Y(siOffset, testSi.length);
            console.log(`Y() returned: ${result} (${typeof result})`);
        } catch (e) {
            console.error('Y() error:', e.message);
        }
    }
    
    // 检查内存中的输出
    console.log('\n=== Memory dump near result area ===');
    const dumpArea = 1024;
    const dumpLen = 256;
    console.log(`Offset ${dumpArea}: ${Array.from(rt.HEAPU8.slice(dumpArea, dumpArea + dumpLen)).map(b => b.toString(16).padStart(2,'0')).join(' ')}`);
    
    // 检查是否有字符串输出
    for (let ptr = 1024; ptr < 65536; ptr++) {
        if (rt.HEAPU8[ptr] >= 0x20 && rt.HEAPU8[ptr] <= 0x7e) {
            const str = rt.readCString(ptr, 200);
            if (str.length > 10 && /^[A-Za-z0-9+/=_-]+$/.test(str)) {
                console.log(`Possible output at ${ptr}: "${str.substring(0, 100)}..."`);
            }
        }
    }
}

// 模式选择: stdio 模式 (从 stdin 读取) 或直接测试模式
if (process.argv.includes('--stdio') || process.argv.includes('-s')) {
    runStdioMode();
} else {
    main().catch(e => {
        console.error('Fatal error:', e);
        process.exit(1);
    });
}

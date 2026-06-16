/**
 * jcap WASM 补环境 v2 - 追踪模式
 * 记录所有导入函数调用及其参数/返回值, 用于分析正确的实现
 */
const fs = require('fs');
const path = require('path');

const wasmPath = path.join(__dirname, 'jcap.wasm');
const wasmBuffer = fs.readFileSync(wasmPath);

class TracedRuntime {
    constructor() {
        this.HEAP8 = null;
        this.HEAPU8 = null;
        this.HEAP32 = null;
        this.HEAPU32 = null;
        this._memory = null;
        this._nextPtr = 1024;
        this._callLog = [];
        this._callCounts = {};
    }

    setMemory(memory) {
        this._memory = memory;
        this.HEAP8 = new Int8Array(memory.buffer);
        this.HEAPU8 = new Uint8Array(memory.buffer);
        this.HEAP32 = new Int32Array(memory.buffer);
        this.HEAPU32 = new Uint32Array(memory.buffer);
    }

    malloc(size) {
        const aligned = (size + 15) & ~15;
        const ptr = this._nextPtr;
        this._nextPtr += aligned;
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

    memcpy(dest, src, n) {
        for (let i = 0; i < n; i++) this.HEAPU8[dest + i] = this.HEAPU8[src + i];
        return dest;
    }

    memset(ptr, value, num) {
        this.HEAPU8.fill(value & 0xFF, ptr, ptr + num);
        return ptr;
    }

    writeString(ptr, str) {
        const buf = Buffer.from(str, 'utf8');
        for (let i = 0; i < buf.length; i++) this.HEAPU8[ptr + i] = buf[i];
        this.HEAPU8[ptr + buf.length] = 0;
    }

    readCString(ptr, maxLen = 65536) {
        let end = ptr;
        while (end < Math.min(ptr + maxLen, this.HEAPU8.length) && this.HEAPU8[end] !== 0) end++;
        return Buffer.from(this.HEAPU8.slice(ptr, end)).toString('utf8');
    }

    _log(name, args, result) {
        const key = name;
        if (!this._callCounts[key]) this._callCounts[key] = 0;
        this._callCounts[key]++;
        if (this._callCounts[key] <= 3) {
            const argStr = args.map(a => {
                if (typeof a === 'number') {
                    if (a > 65536) return `0x${a.toString(16)}`;
                    return String(a);
                }
                return typeof a;
            }).join(', ');
            const resStr = typeof result === 'number' ? (result > 65536 ? `0x${result.toString(16)}` : String(result)) : String(result);
            console.log(`  a.${name}(${argStr}) -> ${resStr}`);
        }
    }

    createImportObject(memory) {
        const rt = this;

        return {
            a: {
                // === Type 0: (i32) -> void ===
                n: (a) => { rt._log('n', [a], undefined); /* free? */ },
                r: (a) => { rt._log('r', [a], undefined); /* free? */ },
                w: (a) => { rt._log('w', [a], undefined); /* free? */ },
                x: (a) => { rt._log('x', [a], undefined); /* free? */ },
                E: (a) => { rt._log('E', [a], undefined); /* free */ },

                // === Type 1: (i32, i32) -> void ===
                G: (a, b) => { rt._log('G', [a, b], undefined); },
                q: (a, b) => { rt._log('q', [a, b], undefined); /* exception */ },

                // === Type 2: (i32, i32, i32) -> i32 ===
                j: (a, b, c) => { const r = rt.memcpy(a, b, c); rt._log('j', [a, b, c], r); return r; },

                // === Type 3: (i32) -> i32 ===
                c: (a) => { const r = rt.malloc(a); rt._log('c', [a], r); return r; },
                m: (a) => { const r = rt.malloc(a); rt._log('m', [a], r); return r; },
                v: (a) => { const r = rt.malloc(a); rt._log('v', [a], r); return r; },
                D: (a) => { const r = rt.malloc(a); rt._log('D', [a], r); return r; },
                J: (a) => { const r = rt.malloc(a); rt._log('J', [a], r); return r; },
                K: (a) => { const r = rt.malloc(a); rt._log('K', [a], r); return r; },
                P: (a) => { const r = rt.malloc(a); rt._log('P', [a], r); return r; },
                Q: (a) => { const r = rt.malloc(a); rt._log('Q', [a], r); return r; },

                // === Type 4: (i32, i32) -> i32 ===
                d: (a, b) => { const r = rt.malloc(Math.max(a, b)); rt._log('d', [a, b], r); return r; },
                e: (a, b) => { const r = rt.malloc(Math.max(a, b)); rt._log('e', [a, b], r); return r; },
                t: (a, b) => {
                    // stackAlloc? stackRestore?
                    rt._log('t', [a, b], 0);
                    return 0;  // Try returning 0
                },
                u: (a, b) => {
                    // stackAlloc? stackRestore?
                    rt._log('u', [a, b], 0);
                    return 0;  // Try returning 0
                },
                N: (a, b) => { const r = rt.malloc(a * b); rt._log('N', [a, b], r); return r; },

                // === Type 5: (i32, i32, i32) -> void ===
                a: (a, b, c) => { rt.memcpy(a, b, c); rt._log('a', [a, b, c], undefined); },
                g: (a, b, c) => { rt.memcpy(a, b, c); rt._log('g', [a, b, c], undefined); },
                i: (a, b, c) => { rt.memcpy(a, b, c); rt._log('i', [a, b, c], undefined); },
                l: (a, b, c) => { rt.memset(a, b, c); rt._log('l', [a, b, c], undefined); },
                p: (a, b, c) => { rt.memcpy(a, b, c); rt._log('p', [a, b, c], undefined); },

                // === Type 7: () -> i32 ===
                C: () => { rt._log('C', [], 0); return 0; },
                M: () => { rt._log('M', [], 0); return 0; },
                O: () => { rt._log('O', [], 0); return 0; },

                // === Type 8: (i32, i32, i32, i32) -> void ===
                F: (a, b, c, d) => { rt._log('F', [a, b, c, d], undefined); },

                // === Type 9: () -> void ===
                y: () => { rt._log('y', [], undefined); console.log('[ABORT] y called'); },
                z: () => { rt._log('z', [], undefined); console.log('[ABORT] z called'); },

                // === Type 12: (i32, i32, i32, i32, i32) -> void ===
                b: (a, b, c, d, e) => { rt._log('b', [a, b, c, d, e], undefined); },

                // === Type 13: (i32, i32, i32, i32, i32, i32) -> void ===
                H: (a, b, c, d, e, f) => { rt._log('H', [a, b, c, d, e, f], undefined); },

                // === Type 15: () -> f64 ===
                B: () => { const r = Date.now(); rt._log('B', [], r); return r; },
                o: () => { const r = Math.random(); rt._log('o', [], r); return r; },
                R: () => { const r = Date.now(); rt._log('R', [], r); return r; },

                // === Type 18: (i32, i32, i32) -> f64 ===
                h: (a, b, c) => { rt._log('h', [a, b, c], 0); return 0; },

                // === Type 19: (i32, f64) -> i32 ===
                A: (a, b) => {
                    // This might be an allocator or converter
                    // a=pointer, b=double_value
                    // Try allocating space and returning pointer
                    const r = rt.malloc(256);  // Allocate 256 bytes
                    rt._log('A', [a, b], r);
                    console.log(`  [A] a=${a} (str="${rt.readCString(a, 90)}"), b=${b}, returning ptr=0x${r.toString(16)}`);
                    return r;
                },

                // === Type 25: (10x i32) -> void ===
                f: (...args) => { rt._log('f', args, undefined); },

                // === Type 26: (5x i32) -> f64 ===
                k: (...args) => { rt._log('k', args, 0); return 0; },

                // === Type 27: (7x i32) -> void ===
                s: (...args) => { rt._log('s', args, undefined); },

                // === Type 28: (13x i32) -> void ===
                I: (...args) => {
                    // fd_write or printf
                    const fd = args[0];
                    const iov = args[1];
                    const iovcnt = args[2];
                    const pnum = args[3];
                    let written = 0;
                    for (let i = 0; i < iovcnt; i++) {
                        const ptr = rt.HEAPU32[(iov + i * 8) >> 2];
                        const len = rt.HEAPU32[(iov + i * 8 + 4) >> 2];
                        if (fd === 1 || fd === 2) {
                            const str = Buffer.from(rt.HEAPU8.slice(ptr, ptr + len)).toString('utf8');
                            if (fd === 2) process.stderr.write(`[WASM stderr] ${str}`);
                        }
                        written += len;
                    }
                    if (pnum) rt.HEAPU32[pnum >> 2] = written;
                    rt._log('I', [fd, iov, iovcnt, pnum, `...(${written} bytes)`], undefined);
                },

                // === Type 29: () -> f32 ===
                L: () => { const r = Math.random() * 4294967296; rt._log('L', [], r); return r; },
            }
        };
    }
}

async function main() {
    const rt = new TracedRuntime();
    const mod = new WebAssembly.Module(wasmBuffer);
    const memory = new WebAssembly.Memory({ initial: 512, maximum: 2048 });
    rt.setMemory(memory);
    
    const imports = rt.createImportObject(memory);
    const instance = new WebAssembly.Instance(mod, imports);
    const exports = instance.exports;
    
    const testSi = 'dcr7_gABAAAGoUilqQIAMHJmrlhIvz9RIEm-mqcPKpQfZf1PlhBCZXXrczd1TqnROY7nt1r620knAe9_wX-AsAAAAAA';
    
    console.log('WASM instantiated. Testing...\n');
    
    // Write si at offset 256
    rt.writeString(256, testSi);
    
    // Test each export
    const tests = [
        ['U_before', () => exports.U(256)],
        ['W_before', () => exports.W(256)],
        ['T', () => exports.T(256, 91)],
        ['U_after', () => exports.U(256)],
        ['W_after', () => exports.W(256)],
        ['V', () => exports.V(256)],
    ];
    
    for (const [name, fn] of tests) {
        console.log(`\n--- Calling ${name} ---`);
        rt._callCounts = {};
        try {
            const r = fn();
            console.log(`${name} returned: ${r} (${typeof r})`);
            // Dump memory near result
            if (typeof r === 'number' && r > 0 && r < rt.HEAPU8.length) {
                const str = rt.readCString(r, 200);
                if (str.length > 0) {
                    console.log(`  -> string at ${r}: "${str.substring(0, 200)}"`);
                } else {
                    // Hex dump
                    const hex = Array.from(rt.HEAPU8.slice(r, r + 32)).map(b => b.toString(16).padStart(2,'0')).join(' ');
                    console.log(`  -> hex at ${r}: ${hex}`);
                }
            }
        } catch(e) {
            console.log(`${name} error: ${e.message}`);
        }
        if (Object.keys(rt._callCounts).length > 0) {
            console.log(`  imports: ${Object.keys(rt._callCounts).join(', ')}`);
        }
    }
    
    // After T, check memory for output
    console.log('\n--- Scanning memory for output after T ---');
    for (let ptr = 16806800; ptr < 16807200; ptr += 4) {
        if (rt.HEAPU8[ptr] >= 0x20 && rt.HEAPU8[ptr] <= 0x7e) {
            const str = rt.readCString(ptr, 200);
            if (str.length > 20) {
                console.log(`  Possible output at ${ptr}: "${str.substring(0, 100)}"`);
            }
        }
    }
    
    console.log('\n--- Call counts ---');
    const sorted = Object.entries(rt._callCounts).sort((a, b) => b[1] - a[1]);
    for (const [name, count] of sorted) {
        console.log(`  a.${name}: ${count} calls`);
    }
}

main().catch(e => { console.error(e); process.exit(1); });

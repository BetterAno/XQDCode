/**
 * 抖店WASM加密模块 v3 - 正确实现环境导入
 * 基于观察到的WASM导入调用模式
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class FXGWasmEncryptor {
    constructor() {
        this.wasmPath = path.join(__dirname, 'index.wasm');
        this.wasmInstance = null;
        this.memory = null;
        this._heapPtr = 0;
        this._heapBase = 1024 * 1024; // 1MB offset
    }

    async init() {
        const wasmBuffer = fs.readFileSync(this.wasmPath);
        
        this.memory = new WebAssembly.Memory({
            initial: 1024,
            maximum: 2048
        });
        this._heapPtr = this._heapBase;

        const imports = { a: this._buildEnv() };
        const module = await WebAssembly.instantiate(wasmBuffer, imports);
        this.wasmInstance = module.instance;
        
        console.log('[WASM] 加载成功, 导出:', Object.keys(this.wasmInstance.exports).join(','));
        return true;
    }

    _buildEnv() {
        const self = this;
        const mem8 = () => new Uint8Array(self.memory.buffer);
        const mem32 = () => new Uint32Array(self.memory.buffer);
        
        return {
            // a: malloc(size) - 分配内存
            a: (size) => {
                const ptr = self._heapPtr;
                self._heapPtr += size + 8;
                self._heapPtr = (self._heapPtr + 7) & ~7; // 对齐
                return ptr;
            },
            
            // b: free(ptr) - 释放内存（简化）
            b: (ptr) => 0,
            
            // c: 获取随机数
            c: () => Math.random(),
            
            // d: floor
            d: (x) => Math.floor(x),
            
            // e: ceil
            e: (x) => Math.ceil(x),
            
            // f: abs
            f: Math.abs,
            
            // g: sqrt
            g: Math.sqrt,
            
            // h: Date.now
            h: () => Date.now(),
            
            // i: performance.now
            i: () => performance.now(),
            
            // j: getRandomValues(ptr, len)
            j: (ptr, len) => {
                try {
                    const buf = new Uint8Array(self.memory.buffer, ptr, len);
                    crypto.randomFillSync(buf);
                } catch(e) {}
                return 0;
            },
            
            // k: log?
            k: (...args) => { console.log('[WASM k]', args); return 0; },
            
            // l: ?
            l: (...args) => 0,
            
            // m: ?
            m: (...args) => 0,
            
            // n: ?
            n: (...args) => 0,
            
            // o: ?
            o: (...args) => 0,
            
            // p: ?
            p: (...args) => 0,
            
            // q: ?
            q: (...args) => 0,
            
            // r: ?
            r: (...args) => 0,
            
            // s: ?
            s: (...args) => 0,
            
            // t: ?
            t: (...args) => 0,
            
            // u: ?
            u: (...args) => 0,
            
            // v: ?
            v: (...args) => 0,
            
            // w: 特殊内存函数（第2次被调用，两参数）
            w: (a, b) => {
                return self.memAlloc(a, b);
            },
            
            // x: 特殊内存函数（第1次被调用，两参数）
            x: (a, b) => {
                return self.memInit(a, b);
            },
            
            // y: ?
            y: (...args) => 0,
            
            // z: ?
            z: (...args) => 0,
            
            // A: memcpy(dst, src, len)
            A: (dst, src, len) => {
                try {
                    const m = new Uint8Array(self.memory.buffer);
                    m.copyWithin(dst, src, src + len);
                } catch(e) {
                    // 如果copyWithin失败，手动复制
                    try {
                        const m = new Uint8Array(self.memory.buffer);
                        for (let i = 0; i < len; i++) {
                            m[dst + i] = m[src + i];
                        }
                    } catch(e2) {}
                }
                return dst;
            },
            
            // B: ?
            B: (...args) => 0,
            
            // C: ?
            C: (...args) => 0,
            
            // D: ?
            D: (...args) => 0,
            
            // E: ?
            E: (...args) => 0,
            
            // F: ?
            F: (...args) => 0,
            
            // G: ?
            G: (...args) => 0,
        };
    }

    memInit(a, b) {
        // 根据观察: a.x(0x529d6c, 0x529d68)
        // 可能是初始化内存分配器
        const buf = new Uint32Array(this.memory.buffer);
        buf[a >> 2] = (b || 0);
        buf[b >> 2] = (a || 0);
        return a;
    }

    memAlloc(a, b) {
        // 根据观察: a.w(0x529d78, 0x529d88)  
        // 可能是分配特定大小的内存块
        return a;
    }

    /**
     * 写入字符串到WASM内存
     */
    _writeStr(str, ptr) {
        const buf = new Uint8Array(this.memory.buffer, ptr, str.length + 1);
        for (let i = 0; i < str.length; i++) buf[i] = str.charCodeAt(i);
        buf[str.length] = 0;
    }

    /**
     * 从WASM内存读取字符串
     */
    _readStr(ptr, maxLen = 4096) {
        const buf = new Uint8Array(this.memory.buffer, ptr, maxLen);
        let end = 0;
        while (end < maxLen && buf[end] !== 0) end++;
        return Buffer.from(buf.slice(0, end)).toString('utf-8');
    }

    /**
     * 加密轨迹数据
     */
    encrypt(trajectory, detail, sessionId, tipY = 68) {
        if (!this.wasmInstance) throw new Error('WASM未初始化');
        
        const ex = this.wasmInstance.exports;
        console.log('\n[WASM] 加密 - 轨迹:', trajectory.length, '点, session:', sessionId);
        
        // 构建轨迹数据（压缩格式）
        let trackStr = '';
        for (const [x, y, t] of trajectory) {
            trackStr += `${x},${y},${t};`;
        }
        
        // 构建完整输入
        const inputJson = JSON.stringify({
            t: trajectory,
            d: detail,
            s: sessionId,
            y: tipY,
            ts: Date.now()
        });
        
        const inPtr = ex.I(
            this._heapPtr,  // 分配内存
            this._heapPtr + inputJson.length + 100
        );
        
        this._writeStr(inputJson, inPtr);
        
        try {
            // 尝试各种导出函数
            const functions = ['I', 'J', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_', '$', 'aa', 'ba'];
            
            for (const name of functions) {
                if (typeof ex[name] === 'function') {
                    try {
                        console.log(`[WASM] 尝试 ${name}(${inPtr}, ${inputJson.length})...`);
                        const result = ex[name](inPtr, inputJson.length);
                        console.log(`[WASM] ${name}() = ${result}`);
                        
                        if (typeof result === 'number' && result > 0 && result < this.memory.buffer.byteLength) {
                            const str = this._readStr(result);
                            console.log(`[WASM] ${name}输出: ${str.substring(0, 80)}...`);
                            return str;
                        }
                    } catch(e) {
                        // 继续尝试下一个
                    }
                }
            }
        } catch(e) {
            console.error('[WASM] 执行失败:', e.message);
        }
        
        return null;
    }
}

module.exports = FXGWasmEncryptor;

if (require.main === module) {
    (async () => {
        const e = new FXGWasmEncryptor();
        await e.init();
        
        const traj = [[0,68,0],[50,69,200],[100,67,400],[150,68,600],[200,68,800]];
        const r = e.encrypt(traj, "test", "sid123", 68);
        console.log('\n最终结果:', r ? r.substring(0, 200) : 'null');
    })().catch(console.error);
}

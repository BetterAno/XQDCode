/**
 * jcap WASM Node.js 补环境
 * 分析并实例化 jcap WASM，提供所需的环境导入函数
 */
const fs = require('fs');
const path = require('path');

const wasmBuffer = fs.readFileSync(path.join(__dirname, 'jcap.wasm'));

// 分析导入
const mod = new WebAssembly.Module(wasmBuffer);
const imports = WebAssembly.Module.imports(mod);
const exports_list = WebAssembly.Module.exports(mod);

console.log('=== WASM Analysis ===');
console.log(`Imports: ${imports.length}, Exports: ${exports_list.length}`);

// 创建 stub 导入对象 - 每个函数返回 0 或空
const stubEnv = {};
for (const imp of imports) {
    if (imp.kind === 'function') {
        // 使用 Proxy 追踪调用
        const callLog = {};
        stubEnv[imp.name] = new Proxy(function() {
            const args = Array.from(arguments);
            const key = imp.name;
            if (!callLog[key]) {
                callLog[key] = 0;
                console.log(`[WASM call] a.${imp.name}(${args.map(a => {
                    if (typeof a === 'number') return a;
                    if (a === undefined) return 'undefined';
                    return typeof a;
                }).join(', ')})`);
            }
            callLog[key]++;
            return 0;
        }, {
            get(target, prop) {
                if (prop === '__callCount') return callLog;
                return target[prop];
            }
        });
    } else if (imp.kind === 'memory') {
        stubEnv[imp.name] = new WebAssembly.Memory({ initial: 256, maximum: 512 });
    } else if (imp.kind === 'table') {
        stubEnv[imp.name] = new WebAssembly.Table({ initial: 100, maximum: 200, element: 'anyfunc' });
    } else if (imp.kind === 'global') {
        stubEnv[imp.name] = 0;
    }
}

try {
    const instance = new WebAssembly.Instance(mod, { a: stubEnv });
    
    console.log('\n=== WASM instantiated successfully! ===');
    console.log('Exports:');
    for (const exp of exports_list) {
        const val = instance.exports[exp.name];
        if (exp.kind === 'function') {
            console.log(`  ${exp.name}: function (${val.length} params)`);
        } else if (exp.kind === 'memory') {
            console.log(`  ${exp.name}: memory (${val.buffer.byteLength} bytes)`);
        } else if (exp.kind === 'table') {
            console.log(`  ${exp.name}: table (${val.length} entries)`);
        }
    }
    
    // Try calling the main exported functions with test data
    const mem = instance.exports.S; // memory export
    const T_func = instance.exports.T;
    const U_func = instance.exports.U;
    const V_func = instance.exports.V;
    const W_func = instance.exports.W;
    const Y_func = instance.exports.Y;
    
    console.log('\n=== Testing exports ===');
    
    // Build a test si string and try calling the functions
    const testSi = 'dcr7_gABAAAGoUilqQIAMHJmrlhIvz9RIEm-mqcPKpQfZf1PlhBCZXXrczd1TqnROY7nt1r620knAe9_wX-AsAAAAAA';
    
    // Helper: write string to WASM memory
    function writeString(offset, str) {
        const buf = Buffer.from(str, 'utf8');
        const view = new Uint8Array(mem.buffer);
        for (let i = 0; i < buf.length; i++) {
            view[offset + i] = buf[i];
        }
        view[offset + buf.length] = 0; // null terminator
        return offset;
    }
    
    // Try T function (likely main entry)
    try {
        console.log(`\nAttempting T(0, ${testSi.length})...`);
        const siOffset = 256;
        writeString(siOffset, testSi);
        
        // Try different calling conventions
        const result = T_func(siOffset, testSi.length);
        console.log(`T() returned: ${result}`);
    } catch(e) {
        console.log(`T() failed: ${e.message}`);
    }
    
} catch (e) {
    console.error('\n=== WASM instantiation FAILED ===');
    console.error('Error:', e.message);
    console.error('\nThe WASM needs proper imports. Let me create a traced environment...');
    
    // 创建带追踪的导入，尝试发现需要什么
    const traceEnv = {};
    const traceLogs = [];
    
    for (const imp of imports) {
        if (imp.kind === 'function') {
            traceEnv[imp.name] = function() {
                const args = Array.from(arguments);
                traceLogs.push({ func: imp.name, args: args.map(a => {
                    if (typeof a === 'number') return a;
                    if (a === undefined) return 'undefined';
                    if (a === null) return 'null';
                    return String(typeof a);
                })});
                if (traceLogs.length <= 5) {
                    console.log(`[TRACE] a.${imp.name}(${args.join(', ')})`);
                }
                return 0;
            };
        } else if (imp.kind === 'memory') {
            traceEnv[imp.name] = new WebAssembly.Memory({ initial: 256, maximum: 1024 });
        } else if (imp.kind === 'table') {
            traceEnv[imp.name] = new WebAssembly.Table({ initial: 100, maximum: 500, element: 'anyfunc' });
        } else if (imp.kind === 'global') {
            traceEnv[imp.name] = 0;
        }
    }
    
    try {
        const inst = new WebAssembly.Instance(mod, { a: traceEnv });
        console.log('\nRetry succeeded with traced environment!');
        console.log(`Total traced calls: ${traceLogs.length}`);
    } catch(e2) {
        console.error('Retry also failed:', e2.message);
        
        // 分析失败原因
        let missingImport = null;
        try {
            // Check each import one by one
            for (const imp of imports) {
                if (imp.kind === 'function') continue;
                const testEnv = {};
                for (const imp2 of imports) {
                    if (imp2.kind === 'function') {
                        testEnv[imp2.name] = function() { return 0; };
                    } else if (imp2.kind === 'memory') {
                        testEnv[imp2.name] = new WebAssembly.Memory({ initial: 256, maximum: 1024 });
                    } else if (imp2.kind === 'table') {
                        testEnv[imp2.name] = new WebAssembly.Table({ initial: 100, maximum: 500, element: 'anyfunc' });
                    } else if (imp2.kind === 'global') {
                        testEnv[imp2.name] = 0;
                    }
                }
                new WebAssembly.Instance(mod, { a: testEnv });
            }
        } catch(e3) {
            console.error('Missing/broken import:', e3.message);
        }
    }
}

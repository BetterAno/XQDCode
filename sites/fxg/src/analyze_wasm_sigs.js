const fs = require('fs');

const wasm = fs.readFileSync('index.wasm');
const buf = new Uint8Array(wasm);

function readLEB128(data, offset) {
    let result = 0;
    let shift = 0;
    while (true) {
        const byte = data[offset++];
        result |= (byte & 0x7f) << shift;
        if ((byte & 0x80) === 0) break;
        shift += 7;
    }
    return { value: result >>> 0, offset };
}

let pos = 8; // skip magic + version
const sections = [];
while (pos < buf.length) {
    const id = buf[pos++];
    const r = readLEB128(buf, pos);
    const size = r.value;
    pos = r.offset;
    sections.push({ id, size, start: pos });
    pos += size;
}

const secNames = ['custom','type','import','function','table','memory','global','export','start','element','code','data','data_count'];

// Parse types
const typeSigs = [];
const typeSec = sections.find(s => s.id === 1);
if (typeSec) {
    let p = typeSec.start;
    const r = readLEB128(buf, p);
    const count = r.value;
    p = r.offset;
    for (let i = 0; i < count; i++) {
        const form = buf[p++]; // 0x60
        const r1 = readLEB128(buf, p);
        const paramCount = r1.value;
        p = r1.offset;
        const params = [];
        for (let j = 0; j < paramCount; j++) {
            const wt = buf[p++];
            params.push(['i32','i64','f32','f64','v128','funcref','externref'][wt] || 't'+wt);
        }
        const r2 = readLEB128(buf, p);
        const resultCount = r2.value;
        p = r2.offset;
        const results = [];
        for (let j = 0; j < resultCount; j++) {
            const wt = buf[p++];
            results.push(['i32','i64','f32','f64','v128','funcref','externref'][wt] || 't'+wt);
        }
        typeSigs.push({ params, results });
    }
}

console.log('=== Type Signatures ===');
typeSigs.forEach((sig, i) => {
    console.log('  [' + i + ']: (' + (sig.params.join(',') || '') + ') -> (' + (sig.results.join(',') || '') + ')');
});

// Count import funcs
let importFuncCount = 0;
const importSec = sections.find(s => s.id === 2);
if (importSec) {
    let p = importSec.start;
    const r = readLEB128(buf, p);
    const count = r.value;
    p = r.offset;
    for (let i = 0; i < count; i++) {
        // module
        const r1 = readLEB128(buf, p); p = r1.offset + r1.value;
        // field
        const r2 = readLEB128(buf, p); p = r2.offset + r2.value;
        const kind = buf[p++];
        if (kind === 0) {
            readLEB128(buf, p); // typeIdx
            p = readLEB128(buf, p).offset;
            importFuncCount++;
        } else if (kind === 1) { // table: elemtype + limits
            p++; readLEB128(buf, p); p = readLEB128(buf, p).offset + 1;
        } else if (kind === 2) { // memory: limits
            p++; readLEB128(buf, p); p = readLEB128(buf, p).offset + 1;
        } else if (kind === 3) { // global: type + mutable
            p += 2;
        }
    }
}

// Function type indices
const funcTypes = [];
const funcSec = sections.find(s => s.id === 3);
if (funcSec) {
    let p = funcSec.start;
    const r = readLEB128(buf, p);
    const count = r.value;
    p = r.offset;
    for (let i = 0; i < count; i++) {
        const r2 = readLEB128(buf, p);
        funcTypes.push(r2.value);
        p = r2.offset;
    }
}

// Exports
const expSec = sections.find(s => s.id === 7);
if (expSec) {
    let p = expSec.start;
    const r = readLEB128(buf, p);
    const count = r.value;
    p = r.offset;
    
    console.log('\n=== Exports (import funcs = ' + importFuncCount + ') ===');
    for (let i = 0; i < count; i++) {
        const r1 = readLEB128(buf, p); p = r1.offset;
        const name = String.fromCharCode(...buf.slice(p, p + r1.value));
        p += r1.value;
        const kind = buf[p++];
        if (kind === 0) {
            const r2 = readLEB128(buf, p); p = r2.offset;
            const funcIdx = r2.value;
            const localIdx = funcIdx - importFuncCount;
            const typeIdx = localIdx >= 0 && localIdx < funcTypes.length ? funcTypes[localIdx] : -1;
            const sig = typeIdx >= 0 && typeIdx < typeSigs.length ? typeSigs[typeIdx] : null;
            console.log('  ' + name + ': localIdx=' + localIdx + ', type[' + typeIdx + '] ' +
                (sig ? '(' + (sig.params.join(',')||'') + ') -> (' + (sig.results.join(',')||'') + ')' : '?'));
        } else {
            const r2 = readLEB128(buf, p); p = r2.offset;
            console.log('  ' + name + ': kind=' + kind + ' idx=' + r2.value);
        }
    }
}

// Try loading with Node
console.log('\n=== Node.js WASM Load Test ===');
try {
    const mod = new WebAssembly.Module(wasm);
    const mem = new WebAssembly.Memory({ initial: 1024, maximum: 4096 });
    
    // Stub all imports
    const importObj = { a: {} };
    const importDescs = WebAssembly.Module.imports(mod);
    importDescs.forEach(d => {
        importObj.a[d.name] = function() {
            const args = Array.from(arguments);
            console.log('  IMPORT a.' + d.name + '(' + args.join(',') + ') called');
            return 0;
        };
    });
    
    const inst = new WebAssembly.Instance(mod, { a: importObj.a, env: { memory: mem } });
    const exports = inst.exports;
    
    // Test calling each export function
    console.log('\nCalling each export function:');
    Object.keys(exports).forEach(key => {
        if (typeof exports[key] === 'function') {
            try {
                // Try with no args
                const r = exports[key]();
                console.log('  ' + key + '() = ' + r + '  [OK 0 args]');
            } catch (e0) {
                try {
                    // Try with 1 arg
                    const r = exports[key](0);
                    console.log('  ' + key + '(0) = ' + r + '  [OK 1 arg]');
                } catch (e1) {
                    try {
                        const r = exports[key](0, 0);
                        console.log('  ' + key + '(0,0) = ' + r + '  [OK 2 args]');
                    } catch (e2) {
                        try {
                            const r = exports[key](0, 0, 0);
                            console.log('  ' + key + '(0,0,0) = ' + r + '  [OK 3 args]');
                        } catch (e3) {
                            try {
                                const r = exports[key](0, 0, 0, 0);
                                console.log('  ' + key + '(0,0,0,0) = ' + r + '  [OK 4 args]');
                            } catch (e4) {
                                console.log('  ' + key + ' ERROR: ' + e4.message.substring(0, 80));
                            }
                        }
                    }
                }
            }
        }
    });
    
} catch(e) {
    console.log('LOAD ERROR: ' + e.message);
}

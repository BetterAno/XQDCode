const fs = require('fs');
const wasmBytes = fs.readFileSync('index.wasm');
const mod = new WebAssembly.Module(wasmBytes);

// WASM限制最大256 pages = 16MB
const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
const mem8 = new Uint8Array(memory.buffer);
console.log('Memory: ' + mem8.length + ' bytes (' + (mem8.length/1048576).toFixed(1) + ' MB)');

const importObj = { a: {} };

importObj.a.A = function(dst, src, len) {
    mem8.copyWithin(dst, src, src + len);
};

let stackTop = 0, stackMax = 0, heapBase = 0;

importObj.a.x = function(a, b) {
    stackTop = a; stackMax = b;
};
importObj.a.w = function(a, b) {
    heapBase = b; return a;
};

const allNames = 'abcdefghijklmnopqrstuvwxyzABCDEFG'.split('');
allNames.forEach(ch => {
    if (!importObj.a[ch]) importObj.a[ch] = function() { return 0; };
});

const inst = new WebAssembly.Instance(mod, { a: importObj.a, env: { memory: memory } });
const exp = inst.exports;

console.log('=== I() ===');
try {
    exp.I();
    console.log('I() OK');
} catch(e) {
    console.log('I() FAIL: ' + e.message);
}
console.log('stackTop=' + stackTop + ', stackMax=' + stackMax + ', heapBase=' + heapBase);

console.log('\n=== Y(0) ===');
try {
    const r = exp.Y(0);
    console.log('Y(0) = ' + r);
} catch(e) {
    console.log('Y(0) FAIL: ' + e.message);
}

console.log('\n=== J(0,0) ===');
try { const r = exp.J(0, 0); console.log('J(0,0) = ' + r); } catch(e) { console.log('J(0,0) FAIL: ' + e.message); }

console.log('\n=== J(1024, 64) ===');
try { 
    for (let i = 0; i < 64; i++) mem8[1024 + i] = 0x41 + (i % 26);
    const r = exp.J(1024, 64); 
    console.log('J(1024, 64) = ' + r); 
    if (r > 0) console.log('Result hex: ' + Buffer.from(mem8.slice(r, r+64)).toString('hex'));
} catch(e) { 
    console.log('J(1024, 64) FAIL: ' + e.message); 
}

// 测试所有可以成功的导出函数
console.log('\n=== All working exports ===');
['I','J','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','_','$','aa','ba'].forEach(name => {
    try {
        const r = exp[name]();
        console.log('  ' + name + '() = ' + r + ' OK');
    } catch(e) {
        try {
            const r = exp[name](0,0);
            console.log('  ' + name + '(0,0) = ' + r + ' OK');
        } catch(e2) {
            // fail
        }
    }
});

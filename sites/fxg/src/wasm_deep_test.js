const fs = require('fs');

const wasmBytes = fs.readFileSync('index.wasm');
const mod = new WebAssembly.Module(wasmBytes);
const importDescs = WebAssembly.Module.imports(mod);

const memory = new WebAssembly.Memory({ initial: 512, maximum: 4096 });
const memBuf = memory.buffer;
const mem8 = new Uint8Array(memBuf);
const mem32 = new Uint32Array(memBuf);

let heapTop = 1024;
function wasmMalloc(size) {
    const ptr = heapTop;
    heapTop += size;
    heapTop = (heapTop + 15) & ~15;
    return ptr;
}
function writeString(str) {
    const ptr = wasmMalloc(str.length + 1);
    for (let i = 0; i < str.length; i++) mem8[ptr + i] = str.charCodeAt(i);
    mem8[ptr + str.length] = 0;
    return ptr;
}
function readString(ptr, maxLen = 1024) {
    let end = ptr;
    while (end < mem8.length && mem8[end] !== 0 && (end - ptr) < maxLen) end++;
    return String.fromCharCode(...mem8.slice(ptr, end));
}

// 使用更智能的导入实现
// Emscripten 的常见导入函数映射：
// - a.e = emscripten_notify_memory_growth (简化) — 注册类型
// - 但这里看起来更像是 declare_type / register_type

let traceCalls = false;
let callCount = 0;

const importObj = { a: {} };

// a.A: memcpy
importObj.a.A = function(dst, src, len) {
    if (dst + len > mem8.length || src + len > mem8.length) {
        console.log('  MEMCPY OUT OF BOUNDS: dst=' + dst + ' src=' + src + ' len=' + len + ' mem=' + mem8.length);
        return;
    }
    mem8.copyWithin(dst, src, src + len);
};

// 观察 a.w 的模式：参数总是 (addr1, addr2) 其中 addr1 < addr2
// 可能是某种 range/slice 初始化
importObj.a.w = function(a, b) {
    if (traceCalls) console.log('  w(' + a + ', ' + b + ')');
};

importObj.a.x = function(a, b) {
    if (traceCalls) console.log('  x(' + a + ', ' + b + ')');
};

// 类型注册函数 - 这些是有副作用的
const registeredTypes = [];
importObj.a.e = function(addr, typeId, size, min, maxOrSign) {
    if (traceCalls) console.log('  e(addr=' + addr + ', id=' + typeId + ', size=' + size + ', min=' + min + ', max=' + maxOrSign + ')');
    registeredTypes.push({ addr, typeId, size, min, max: maxOrSign });
};

importObj.a.u = function(addr, typeId, size, minLo, minHi, maxLo, maxHi) {
    if (traceCalls) console.log('  u(addr=' + addr + ', id=' + typeId + ', size=' + size + ', min=' + minLo + '/' + minHi + ', max=' + maxLo + '/' + maxHi + ')');
};

importObj.a.r = function(addr, val, size) {
    if (traceCalls) console.log('  r(' + addr + ', ' + val + ', ' + size + ')');
};

importObj.a.q = function(addr, val) {
    if (traceCalls) console.log('  q(' + addr + ', ' + val + ')');
};

importObj.a.m = function(addr, size, val) {
    if (traceCalls) console.log('  m(' + addr + ', ' + size + ', ' + val + ')');
};

importObj.a.B = function(addr, val) {
    if (traceCalls) console.log('  B(' + addr + ', ' + val + ')');
};

importObj.a.C = function(addr, val1, val2, val3, val4) {
    if (traceCalls) console.log('  C(' + addr + ', ' + val1 + ', ' + val2 + ', ' + val3 + ', ' + val4 + ')');
};

importObj.a.D = function(addr, val) {
    if (traceCalls) console.log('  D(' + addr + ', ' + val + ')');
};

// a.b 被大量调用，模式: (addr, index, value)
// 看起来像注册函数: register_function(addr, index, wasm_func_idx)
importObj.a.b = function(addr, index, value) {
    if (traceCalls && index < 20) console.log('  b(' + addr + ', ' + index + ', ' + value + ')');
};

// 其余全部stub
const allNames = 'abcdefghijklmnopqrstuvwxyzABCDEFG'.split('');
allNames.forEach(ch => {
    if (!importObj.a[ch]) {
        importObj.a[ch] = function() { return 0; };
    }
});

const inst = new WebAssembly.Instance(mod, {
    a: importObj.a,
    env: { memory: memory }
});

const exp = inst.exports;
const funcs = {};
Object.keys(exp).forEach(k => {
    if (typeof exp[k] === 'function') funcs[k] = exp[k];
});

console.log('=== 第1步: 调用 Y() 进行模块初始化 ===');
try {
    const r = funcs.Y(0);
    console.log('Y(0) = ' + r + ' ✓');
    console.log('注册了 ' + registeredTypes.length + ' 个类型');
} catch(e) {
    console.log('Y(0) 失败: ' + e.message);
}

console.log('\n=== 第2步: 调用 _() (返回全局数据) ===');
try {
    const r = funcs._();
    console.log('_() = ' + r);
    // _() 返回的地址可能指向全局数据结构
    console.log('_() data hex (first 256 bytes): ' + Buffer.from(mem8.slice(r, r + 256)).toString('hex'));
} catch(e) {
    console.log('_() 失败: ' + e.message);
}

console.log('\n=== 第3步: 测试 J() 加密函数 ===');
// 先看看J()期望的参数
// type[1]: (i32, i32) -> i32
// 尝试用Y()返回的地址作为输入
const testPairs = [
    ['Y()返回', 5606968, 32],
    ['Y()返回+64', 5607032, 32],
    ['L()返回', 5575424, 64],
    ['堆起始', heapTop, 32],
];
for (const [desc, a, b] of testPairs) {
    try {
        // 在调用前先写一些数据到地址a
        if (a >= heapTop) {
            for (let i = 0; i < Math.min(b, 64); i++) mem8[a + i] = 0x41 + (i % 26);
        }
        const r = funcs.J(a, b);
        console.log('  J(' + desc + '=' + a + ', ' + b + ') = ' + r);
        if (r > 0 && r < mem8.length) {
            const end = Math.min(r + 128, mem8.length);
            console.log('    Result hex: ' + Buffer.from(mem8.slice(r, end)).toString('hex'));
            console.log('    Result str: ' + readString(r, 128));
        }
    } catch(e) {
        console.log('  J(' + desc + '=' + a + ', ' + b + ') ERROR: ' + e.message.substring(0, 100));
    }
}

// 检查所有可能的函数签名和调用方式
console.log('\n=== 第4步: 检查全部导出函数初始化后状态 ===');
for (const [name, fn] of Object.entries(funcs)) {
    try {
        const r = fn(0, 0, 0, 0);
        if (r !== undefined && r !== 0) {
            console.log('  ' + name + '(0,0,0,0) = ' + r + ' [非零返回值!]');
        }
    } catch(e) {
        // skip
    }
}

// 看看 _$ 函数
console.log('\n=== 第5步: 检查 $ 和 aa ba ===');
for (const name of ['$', 'aa', 'ba']) {
    try {
        const r = funcs[name](heapTop);
        console.log('  ' + name + '(heap=' + heapTop + ') = ' + r);
    } catch(e) {
        console.log('  ' + name + ' ERROR: ' + e.message.substring(0, 60));
    }
}

// 尝试用 _() 返回的全局指针作为参数调用J
console.log('\n=== 第6步: 用全局指针调用J ===');
try {
    const globalPtr = funcs._();
    console.log('全局指针 = ' + globalPtr);
    
    // 读取全局指针处的数据 - 可能是指向函数表的指针
    const ptrVal = mem32[globalPtr >> 2];
    console.log('全局指针[0] = ' + ptrVal);
    
    // 尝试用各种组合
    for (let i = 0; i < 20; i++) {
        const addr = globalPtr + i * 4;
        try {
            const r = funcs.J(addr, 4);
            console.log('  J(globalPtr+' + (i*4) + '=' + addr + ', 4) = ' + r);
            break;
        } catch(e) {
            // continue
        }
    }
} catch(e) {
    console.log('全局指针测试失败: ' + e.message);
}

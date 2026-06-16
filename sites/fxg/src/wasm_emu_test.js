const fs = require('fs');

// 加载WASM
const wasmBytes = fs.readFileSync('index.wasm');

// 分析导入
const mod = new WebAssembly.Module(wasmBytes);
const importDescs = WebAssembly.Module.imports(mod);
const exportDescs = WebAssembly.Module.exports(mod);

console.log('=== 导入函数需求 ===');
const importTypes = {};
importDescs.forEach(d => {
    console.log('  a.' + d.name);
});

// 创建内存
const memory = new WebAssembly.Memory({ initial: 512, maximum: 4096 });
const memBuf = memory.buffer;
const mem8 = new Uint8Array(memBuf);
const mem32 = new Uint32Array(memBuf);

let heapTop = 1024; // 从1KB开始分配

function wasmMalloc(size) {
    const ptr = heapTop;
    heapTop += size;
    // 对齐到16字节
    heapTop = (heapTop + 15) & ~15;
    return ptr;
}

// 字符串工具
function writeString(str) {
    const ptr = wasmMalloc(str.length + 1);
    for (let i = 0; i < str.length; i++) {
        mem8[ptr + i] = str.charCodeAt(i);
    }
    mem8[ptr + str.length] = 0;
    return ptr;
}

function readString(ptr, maxLen = 1024) {
    let end = ptr;
    while (end < mem8.length && mem8[end] !== 0 && (end - ptr) < maxLen) end++;
    return String.fromCharCode(...mem8.slice(ptr, end));
}

// 跟踪器
const traceCall = {};
let traceEnabled = true;

// 实现导入函数 - 关键
const importObj = {
    a: {}
};

// 为每个导入提供stub
const AB = 'abcdefghijklmnopqrstuvwxyz'.split('');
// a.A 是 memcpy: void memcpy(dst, src, len)
importObj.a.A = function(dst, src, len) {
    mem8.copyWithin(dst, src, src + len);
};

// a.x 和 a.w 看起来是某种内存初始化
importObj.a.x = function(a, b) {
    // 似乎不需要特殊处理
    if (traceEnabled) console.log('  a.x(' + a + ', ' + b + ')');
};

importObj.a.w = function(a, b) {
    if (traceEnabled) console.log('  a.w(' + a + ', ' + b + ')');
};

// a.b 被大量调用，可能是注册函数或include
importObj.a.b = function(addr, idx, value) {
    if (traceEnabled) console.log('  a.b(' + addr + ', ' + idx + ', ' + value + ')');
};

// a.e 注册类型: e(addr, typeId, size, minLow, maxLow) 或 e(addr, typeId, size, min, max)
importObj.a.e = function(a, b, c, d, e) {
    if (traceEnabled) console.log('  a.e(' + [a,b,c,d,e].join(',') + ')');
};

// a.u 注册64位类型
importObj.a.u = function(a, b, c, d, e, f, g) {
    if (traceEnabled) console.log('  a.u(' + [a,b,c,d,e,f,g].join(',') + ')');
};

// a.r
importObj.a.r = function(a, b, c) {
    if (traceEnabled) console.log('  a.r(' + a + ', ' + b + ', ' + c + ')');
};

// a.q
importObj.a.q = function(a, b) {
    if (traceEnabled) console.log('  a.q(' + a + ', ' + b + ')');
};

// a.m - 可能是 register_memory
importObj.a.m = function(a, b, c) {
    if (traceEnabled) console.log('  a.m(' + a + ', ' + b + ', ' + c + ')');
};

// a.B - 可能是 begin_module
importObj.a.B = function(a, b) {
    if (traceEnabled) console.log('  a.B(' + a + ', ' + b + ')');
};

// a.C, a.D
importObj.a.C = function(a, b, c, d, e) {
    if (traceEnabled) console.log('  a.C(' + [a,b,c,d,e].join(',') + ')');
};
importObj.a.D = function(a, b) {
    if (traceEnabled) console.log('  a.D(' + a + ', ' + b + ')');
};

// 其他函数全部设置为返回0的stub
const allImports = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G'];
allImports.forEach(ch => {
    if (!importObj.a[ch]) {
        importObj.a[ch] = function() {
            return 0;
        };
    }
});

// 创建实例
const inst = new WebAssembly.Instance(mod, {
    a: importObj.a,
    env: { memory: memory }
});

const exp = inst.exports;

// 找到导出函数
const funcs = {};
Object.keys(exp).forEach(k => {
    if (typeof exp[k] === 'function') {
        funcs[k] = exp[k];
    }
});

console.log('\n=== 初始化 (调用 I) ===');
try {
    funcs.I();
    console.log('I() 初始化成功');
} catch(e) {
    console.log('I() 失败: ' + e.message);
}

console.log('\n=== 测试各导出函数 ===');
for (const [name, fn] of Object.entries(funcs)) {
    try {
        const r = fn();
        console.log('  ' + name + '() = ' + r + ' OK');
    } catch(e) {
        try {
            const r = fn(0);
            console.log('  ' + name + '(0) = ' + r + ' OK');
        } catch(e2) {
            try {
                const r = fn(0, 0);
                console.log('  ' + name + '(0,0) = ' + r + ' OK');
            } catch(e3) {
                console.log('  ' + name + ' ERROR: ' + e3.message.substring(0,60));
            }
        }
    }
}

// 尝试实际加密
console.log('\n=== 尝试调用 J (加密函数) ===');
try {
    // J(type[1]: (i32,i32) -> i32)
    // 准备测试数据
    const testData = JSON.stringify({ x: 100, y: 50, time: 1234, t: 1 });
    const dataPtr = writeString(testData);
    const result = funcs.J(dataPtr, testData.length);
    console.log('J(data="' + testData + '", len=' + testData.length + ') = ' + result);
    
    // 读取结果 - 可能是指向结果的指针
    if (result > 0 && result < mem8.length) {
        const resultStr = readString(result);
        console.log('Result string: ' + resultStr);
        console.log('Result hex: ' + Buffer.from(mem8.slice(result, result + 64)).toString('hex'));
    }
} catch(e) {
    console.log('J() 失败: ' + e.message);
}

// 尝试 L
console.log('\n=== 尝试调用 L ===');
try {
    traceEnabled = false;
    const r1 = funcs.L(0);
    console.log('L(0) = ' + r1);
    
    // L返回的地址可能包含一些有用的数据
    console.log('L return hex: ' + Buffer.from(mem8.slice(r1, r1 + 128)).toString('hex'));
    console.log('L return str: ' + readString(r1, 128));
    traceEnabled = true;
} catch(e) {
    console.log('L(0) 失败: ' + e.message);
}

// Y - 可能是模块初始化
console.log('\n=== 尝试调用 Y ===');
try {
    traceEnabled = false;
    const r2 = funcs.Y(0);
    console.log('Y(0) = ' + r2);
    traceEnabled = true;
} catch(e) {
    console.log('Y(0) 失败: ' + e.message);
}

// 尝试调用 J 使用更多参数组合
console.log('\n=== 深度测试 J 加密函数 ===');
// J type[1]: (i32, i32) -> i32
// 尝试不同的参数
const testPairs = [
    [0, 0],
    [5504320, 32],  // Y()返回地址
    [5576704, 64],  // L()返回地址
    [wasmMalloc(256), 64],
];
for (const [a, b] of testPairs) {
    try {
        traceEnabled = false;
        const r = funcs.J(a, b);
        console.log('  J(' + a + ', ' + b + ') = ' + r);
        if (r > 0 && r < mem8.length) {
            console.log('    Result hex: ' + Buffer.from(mem8.slice(r, r + 64)).toString('hex'));
        }
        traceEnabled = true;
    } catch(e) {
        console.log('  J(' + a + ', ' + b + ') ERROR: ' + e.message.substring(0, 60));
    }
}

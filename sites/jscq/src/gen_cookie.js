/**
 * 瑞数6 Cookie 生成入口
 * 从 JSON 输入文件读取数据, 在 vm 沙箱中执行瑞数代码, 输出 P Cookie
 *
 * 用法: node gen_cookie.js <input.json>
 *
 * input.json 格式:
 * {
 *   "url": "https://www.jscq.com.cn/...",
 *   "meta_content": "rX93gZ...",
 *   "inline_script": "$_ts=window['$_ts'];...",
 *   "js_content": "if($_ts.cd){...",
 *   "js_url": "https://www.jscq.com.cn/3of0EhpccaFM/RkdMxdIZoj2i.bc4278d.js"
 * }
 */

var fs = require('fs');
var vm = require('vm');
var path = require('path');

// ========== 外部 Function.prototype.toString 覆写 ==========
// 外部创建的函数 (env.js 中定义) 使用外部 Function.prototype
// 必须覆写外部的 toString, 否则 fn.toString() 会暴露真实代码
var _origOuterToString = Function.prototype.toString;
var _outerNatKey = '__natName';
Function.prototype.toString = function() {
    if (this[_outerNatKey]) {
        return 'function ' + this[_outerNatKey] + '() { [native code] }';
    }
    return _origOuterToString.call(this);
};
Function.prototype.toString[_outerNatKey] = 'toString';

// 读取输入
var inputPath = process.argv[2];
if (!inputPath) {
    process.stderr.write('Usage: node gen_cookie.js <input.json>\n');
    process.exit(1);
}

var input = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

// 加载环境补丁
var setupEnv = require(path.join(__dirname, 'env.js'));

// 创建 vm 沙箱
var sandbox = {};

// 注入标准 JS 内置对象 (vm.createContext 自动添加)
// 额外注入 Node.js 需要的工具
sandbox.Buffer = Buffer;
sandbox.Uint8Array = Uint8Array;
sandbox.Uint8ClampedArray = Uint8ClampedArray;
sandbox.Int8Array = Int8Array;
sandbox.Int16Array = Int16Array;
sandbox.Int32Array = Int32Array;
sandbox.Uint16Array = Uint16Array;
sandbox.Uint32Array = Uint32Array;
sandbox.Float32Array = Float32Array;
sandbox.Float64Array = Float64Array;
sandbox.ArrayBuffer = ArrayBuffer;
sandbox.DataView = DataView;
sandbox.Map = Map;
sandbox.Set = Set;
sandbox.WeakMap = WeakMap;
sandbox.WeakSet = WeakSet;
sandbox.Symbol = Symbol;
sandbox.Proxy = Proxy;
sandbox.Reflect = Reflect;
sandbox.Promise = Promise;

// 创建上下文
vm.createContext(sandbox);

// 清理 Node.js 特有全局变量，防止瑞数检测到 Node 环境
delete sandbox.__dirname;
delete sandbox.__filename;
delete sandbox.require;
delete sandbox.module;
delete sandbox.exports;
delete sandbox.global;
delete sandbox.process;
delete sandbox.Buffer;

// 设置浏览器环境
setupEnv(sandbox, {
    url: input.url,
    meta_content: input.meta_content,
    meta_id: input.meta_id || '',
    js_url: input.js_url,
    inline_script_text: input.inline_script || '',
});

// 关键: 不定义 execScript!
// Chrome 不支持 window.execScript, 瑞数代码通过 bytecode 检测其是否存在
// 定义 execScript 会导致瑞数走非 Chrome 路径, 产生检测模式 cookie

// 关键: 不覆盖 eval 和 Function!
// 之前的方案用 vm.runInContext 替换 eval, 但这破坏了 eval 的调用作用域
// 导致 eval("localVar") 无法访问调用函数的局部变量, 被瑞数检测到
// vm 默认的 eval 保留调用作用域, 这是正确行为

// ========== Error.prepareStackTrace 清理 node:vm 指纹 ==========
// vm 中的 Error stack 包含 "evalmachine.<anonymous>" 和 "Script.runInContext (node:vm:...)"
// 使用 V8 的 prepareStackTrace API 过滤 node:vm 帧, 替换 evalmachine 前缀
// 保留帧数量以匹配浏览器堆栈深度
vm.runInContext([
    '(function() {',
    '  Error.prepareStackTrace = function(err, stack) {',
    '    var lines = ["Error"];',
    '    for (var i = 0; i < stack.length; i++) {',
    '      var f = stack[i];',
    '      var fileName = f.getFileName();',
    '      if (fileName && (fileName.indexOf("node:") === 0 || fileName.indexOf("internal/") === 0)) continue;',
    '      if (fileName && fileName.indexOf("evalmachine.") === 0) fileName = "<anonymous>";',
    '      if (!fileName) fileName = "<anonymous>";',
    '      var fn = f.getFunctionName() || "";',
    '      var line = f.getLineNumber();',
    '      var col = f.getColumnNumber();',
    '      if (fn) {',
    '        lines.push("    at " + fn + " (" + fileName + ":" + (line||1) + ":" + (col||1) + ")");',
    '      } else {',
    '        lines.push("    at " + fileName + ":" + (line||1) + ":" + (col||1));',
    '      }',
    '    }',
    '    return lines.join(String.fromCharCode(10));',
    '  };',
    '})();',
].join('\n'), sandbox);

// 添加缺失的 Chrome 全局函数
sandbox.structuredClone = function(obj) {
    // 简单实现, 不支持循环引用和特殊类型
    if (obj === undefined) return undefined;
    return JSON.parse(JSON.stringify(obj));
};
if (sandbox.window) sandbox.window.structuredClone = sandbox.structuredClone;

// 预注入 O Cookie (瑞数代码通过 document.cookie 读取 O Cookie 来计算 P Cookie)
if (input.o_cookie_name && input.o_cookie_value) {
    sandbox.__allCookies.push(input.o_cookie_name + '=' + input.o_cookie_value);
}

// 验证环境
if (!sandbox.window || !sandbox.document || !sandbox.navigator) {
    process.stderr.write('[ERROR] Environment setup failed\n');
    process.exit(1);
}

try {
    // 执行内联 script (设置 $_ts)
    if (input.inline_script) {
        vm.runInContext(input.inline_script, sandbox, { filename: 'https://www.jscq.com.cn/page.html' });
    }

    // 验证 $_ts
    if (!sandbox.$_ts || !sandbox.$_ts.cd) {
        process.stderr.write('[ERROR] $_ts.cd not set after inline script\n');
        process.exit(1);
    }

    // 执行外链 JS (VM 代码, 生成 Cookie)
    if (input.js_content) {
        vm.runInContext(input.js_content, sandbox, { filename: 'https://www.jscq.com.cn/3of0EhpccaFM/RkdMxdIZoj2i.bc4278d.js' });
    }

    // 执行触发调用 (如 _$gR())
    if (input.trigger_call) {
        vm.runInContext(input.trigger_call, sandbox, { filename: 'https://www.jscq.com.cn/trigger.js' });
    }

    // 获取捕获的 Cookie
    var captured = sandbox.__capturedCookie;

    if (!captured) {
        process.stderr.write('[WARN] No cookie captured. All cookies set: ' + JSON.stringify(sandbox.__allCookies) + '\n');
        process.exit(1);
    }

    // 输出所有 cookies (JSON 格式)
    var result = {
        pcookie: captured,
        all: sandbox.__allCookies.filter(function(c) { return !c.startsWith('jDwkDWjIm6GRO'); })
    };
    process.stdout.write(JSON.stringify(result));

} catch (e) {
    process.stderr.write('[ERROR] ' + e.message + '\n');
    // 只输出堆栈的前5行
    var stackLines = (e.stack || '').split('\n').slice(0, 5).join('\n');
    process.stderr.write(stackLines + '\n');

    // 输出已捕获的cookie（部分结果）
    if (sandbox.__capturedCookie) {
        process.stderr.write('[PARTIAL] Cookie was captured before error: ' + sandbox.__capturedCookie.length + ' chars\n');
        process.stdout.write(sandbox.__capturedCookie);
    } else if (sandbox.__allCookies && sandbox.__allCookies.length > 0) {
        process.stderr.write('[PARTIAL] Cookies set: ' + sandbox.__allCookies.length + '\n');
        for (var ci = 0; ci < sandbox.__allCookies.length; ci++) {
            var c = sandbox.__allCookies[ci];
            process.stderr.write('  Cookie[' + ci + ']: ' + c.substring(0, 60) + '...\n');
        }
    }

    process.exit(1);
}

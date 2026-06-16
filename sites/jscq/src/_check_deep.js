var vm = require('vm');
var path = require('path');
var setupEnv = require(path.join(__dirname, 'env.js'));

var sandbox = {};
['Uint8Array','Uint8ClampedArray','Int8Array','Int16Array','Int32Array',
'Uint16Array','Uint32Array','Float32Array','Float64Array','ArrayBuffer','DataView',
'Map','Set','WeakMap','WeakSet','Symbol','Proxy','Reflect','Promise'].forEach(function(n){sandbox[n]=global[n];});
vm.createContext(sandbox);
delete sandbox.__dirname; delete sandbox.__filename; delete sandbox.require;
delete sandbox.module; delete sandbox.exports; delete sandbox.global;
delete sandbox.process; delete sandbox.Buffer;

setupEnv(sandbox, {
    url: 'https://www.jscq.com.cn/jscq/cqjy/jygg/cqzr/index.shtml',
    meta_content: 'test123', meta_id: 'testid',
    js_url: 'https://www.jscq.com.cn/test.js',
    inline_script_text: '$_ts=window["$_ts"];$_ts.cd="test";',
});

var checks = [
    'new Function("return 1")()',
    'new Function("return typeof window")()',
    'new Function("return typeof document")()',
    'new Function("return typeof navigator")()',
    'typeof globalThis',
    'globalThis === window',
    'window.hasOwnProperty("setTimeout")',
    'document.hasOwnProperty("createElement")',
    'navigator.hasOwnProperty("userAgent")',
    'typeof Proxy',
    'typeof document.all',
    'new Error("test").stack.split("\\n")[0]',
    'eval("1+1")',
    '(0, eval)("1+1")',
    'var f = eval; f("1+1")',
];

checks.forEach(function(expr) {
    try {
        var result = vm.runInContext(expr, sandbox);
        console.log(expr + ' => ' + String(result).substring(0, 150));
    } catch(e) {
        console.log(expr + ' => ERROR: ' + e.message.substring(0, 100));
    }
});

var fs = require('fs');
var vm = require('vm');
var path = require('path');
var setupEnv = require(path.join(__dirname, 'env.js'));

var sandbox = {};
['Uint8Array', 'Uint8ClampedArray', 'Int8Array', 'Int16Array', 'Int32Array',
    'Uint16Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'ArrayBuffer', 'DataView',
    'Map', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'Proxy', 'Reflect', 'Promise'].forEach(function (n) {
    sandbox[n] = global[n];
});
vm.createContext(sandbox);
delete sandbox.__dirname; delete sandbox.__filename; delete sandbox.require;
delete sandbox.module; delete sandbox.exports; delete sandbox.global;
delete sandbox.process; delete sandbox.Buffer;

setupEnv(sandbox, {
    url: 'https://www.jscq.com.cn/jscq/cqjy/jygg/cqzr/index.shtml',
    meta_content: 'test123',
    meta_id: 'testid',
    js_url: 'https://www.jscq.com.cn/test.js',
    inline_script_text: '$_ts=window["$_ts"];$_ts.cd="test";',
});

var checks = [
    // Error stack trace format
    '(new Error()).stack',
    'try { null.x; } catch(e) { e.stack }',
    '(function(){ return (new Error()).stack; })()',
    // Function toString
    'function testFn() {} testFn.toString().substring(0, 40)',
    'eval.toString().substring(0, 40)',
    'setTimeout.toString().substring(0, 40)',
    'String.fromCharCode.toString().substring(0, 40)',
    // new Function behavior
    'new Function("return 1")()',
    'new Function("return typeof window")()',
    'new Function("return typeof document")()',
    // Arguments
    '(function(){ return arguments.callee ? "yes" : "no"; })()',
    // typeof checks specific to Node
    'typeof global',
    'typeof globalThis',
    'typeof module',
    'typeof require',
    'typeof process',
    'typeof __dirname',
    'typeof __filename',
    'typeof exports',
    'typeof Buffer',
    'typeof setImmediate',
    'typeof clearImmediate',
    // eval identity
    'eval === window.eval',
    'typeof eval === "function"',
    // String fromCharCode
    'typeof String.fromCharCode',
    'String.fromCharCode(65)',
    // Date
    'typeof Date',
    'new Date().getTime() > 0',
    // Math
    'typeof Math.random',
    'Math.random() >= 0 && Math.random() < 1',
    // JSON
    'typeof JSON.stringify',
    'typeof JSON.parse',
    // Array.isArray
    'Array.isArray([])',
    // parseInt/parseFloat
    'typeof parseInt',
    'typeof parseFloat',
    'parseInt("123")',
    // encodeURI/decodeURI
    'typeof encodeURI',
    'typeof decodeURI',
    'typeof encodeURIComponent',
    // RegExp
    'typeof RegExp',
    'new RegExp("test").test("test")',
];

checks.forEach(function(expr) {
    try {
        var result = vm.runInContext(expr, sandbox);
        console.log(expr + ' => ' + String(result).substring(0, 200));
    } catch(e) {
        console.log(expr + ' => ERROR: ' + e.message.substring(0, 100));
    }
});

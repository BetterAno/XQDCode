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
    // Check __natName on setTimeout
    'setTimeout.__natName',
    'typeof setTimeout.__natName',
    'setTimeout.toString()',
    'setTimeout.toString().substring(0, 80)',
    // Check other functions
    'document.createElement.__natName',
    'document.createElement.toString().substring(0, 80)',
    'document.getElementById.toString().substring(0, 80)',
    'navigator.sendBeacon.toString().substring(0, 80)',
    // Error stack
    '(new Error()).stack.substring(0, 200)',
    'typeof Error.prepareStackTrace',
    // eval
    'eval.toString().substring(0, 60)',
    'Function.prototype.toString.call(eval).substring(0, 60)',
    // atob/btoa
    'atob.toString().substring(0, 60)',
    'btoa.toString().substring(0, 60)',
    // console
    'typeof console',
    'console.log.toString().substring(0, 60)',
    // String static methods
    'String.fromCharCode.toString().substring(0, 60)',
];

checks.forEach(function(expr) {
    try {
        var result = vm.runInContext(expr, sandbox);
        console.log(expr + ' => ' + String(result).substring(0, 200));
    } catch(e) {
        console.log(expr + ' => ERROR: ' + e.message.substring(0, 100));
    }
});

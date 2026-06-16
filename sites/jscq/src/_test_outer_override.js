/**
 * Quick test: verify outer Function.prototype.toString override works
 */
var vm = require('vm');
var path = require('path');

// Outer override (same as gen_cookie.js)
var _origOuterToString = Function.prototype.toString;
var _outerNatKey = '__natName';
Function.prototype.toString = function() {
    if (this[_outerNatKey]) {
        return 'function ' + this[_outerNatKey] + '() { [native code] }';
    }
    return _origOuterToString.call(this);
};
Function.prototype.toString[_outerNatKey] = 'toString';

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
    'setTimeout.toString().substring(0, 80)',
    'Function.prototype.toString.call(setTimeout).substring(0, 80)',
    'document.createElement.toString().substring(0, 80)',
    'Function.prototype.toString.call(document.createElement).substring(0, 80)',
    'Function.prototype.toString.toString().substring(0, 60)',
    'setTimeout.hasOwnProperty("toString")',
    '(new Error()).stack.split("\\n").slice(0,3).join("|")',
    'eval.toString().substring(0, 60)',
    'String.fromCharCode.toString().substring(0, 40)',
    'new Function("return 1")()',
    'new Function("return typeof window")()',
];

checks.forEach(function(expr) {
    try {
        var result = vm.runInContext(expr, sandbox);
        console.log('OK  ' + expr + ' => ' + String(result).substring(0, 150));
    } catch(e) {
        console.log('ERR ' + expr + ' => ' + e.message.substring(0, 100));
    }
});

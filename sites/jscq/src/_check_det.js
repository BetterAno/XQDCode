var vm = require('vm');
var path = require('path');
var _origOuterToString = Function.prototype.toString;
var _outerNatKey = '__natName';
Function.prototype.toString = function() {
    if (this[_outerNatKey]) return 'function ' + this[_outerNatKey] + '() { [native code] }';
    return _origOuterToString.call(this);
};
Function.prototype.toString[_outerNatKey] = 'toString';
var setupEnv = require(path.join(__dirname, 'env.js'));
var sandbox = {};
['Uint8Array','Map','Set','Symbol','Proxy','Reflect','Promise','ArrayBuffer','Int8Array','Int16Array','Int32Array','Uint16Array','Uint32Array','Float32Array','Float64Array','DataView','WeakMap','WeakSet','Uint8ClampedArray'].forEach(function(n){sandbox[n]=global[n];});
vm.createContext(sandbox);
delete sandbox.__dirname; delete sandbox.__filename; delete sandbox.require;
delete sandbox.module; delete sandbox.exports; delete sandbox.global;
delete sandbox.process; delete sandbox.Buffer;
setupEnv(sandbox, {url:'https://www.jscq.com.cn/', meta_content:'t', meta_id:'', js_url:'https://www.jscq.com.cn/test.js', inline_script_text:''});

var checks = [
    'navigator.webdriver',
    'typeof navigator.webdriver',
    'navigator.webdriver === false',
    'navigator.webdriver === undefined',
    'document instanceof Object',
    'Object.prototype.toString.call(document)',
    'Object.prototype.toString.call(navigator)',
    'Object.prototype.toString.call(window)',
    'typeof window.alert',
    'typeof window.confirm',
    'typeof window.prompt',
    'typeof window.open',
    'typeof window.print',
    'typeof window.close',
    'typeof window.postMessage',
    'typeof window.addEventListener',
    'typeof window.postMessage',
    '(function(){var x=42;return eval("x");})()',
    'new Function("return 1")()',
    'eval.toString().length',
    'Function.toString().length',
    'Object.keys(window).length',
    'window.hasOwnProperty("document")',
    'window.hasOwnProperty("navigator")',
    'window.hasOwnProperty("chrome")',
    // Check if Error.prepareStackTrace survives
    'typeof Error.prepareStackTrace',
    // Check what the vm context's Error constructor is
    'Error === window.Error',
    'Error.captureStackTrace === undefined',
    'typeof Error.captureStackTrace',
    'typeof Error.stackTraceLimit',
];
checks.forEach(function(expr) {
    try {
        var result = vm.runInContext(expr, sandbox, {filename:'test.js'});
        console.log('OK  ' + expr.substring(0,55) + ' => ' + JSON.stringify(result));
    } catch(e) {
        console.log('ERR ' + expr.substring(0,55) + ' => ' + e.message);
    }
});

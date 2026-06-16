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

sandbox.structuredClone = function(obj) { return JSON.parse(JSON.stringify(obj)); };
sandbox.window.structuredClone = sandbox.structuredClone;

// Test the 3 detection checks
var checks = [
    // Check 1: window instanceof Window
    'try{return (window instanceof Window);}catch(e){return "ERROR:" + e.message;}',
    // Direct check
    'window instanceof Window',
    // Check 2: __filename
    'try{return __filename;}catch(e){return "ERROR:" + e.message;}',
    // Check 3: __dirname
    'try{return __dirname;}catch(e){return "ERROR:" + e.message;}',
    // Via new Function
    'new Function("try{return (window instanceof Window)}catch(e){}")()',
    'new Function("try{return __filename}catch(e){}")()',
    'new Function("try{return __dirname}catch(e){}")()',
    // Check if new Function creates functions that run in sandbox scope
    'new Function("return typeof window")()',
    'new Function("return typeof document")()',
    'new Function("return typeof navigator")()',
    'new Function("return typeof Window")()',
    // What does new Function's this refer to?
    'new Function("return this")() === window',
    'new Function("return this")() === undefined',
    // Check eval in new Function
    'new Function("return eval(\\\"1+1\\\")")()',
];
checks.forEach(function(expr) {
    try {
        var result = vm.runInContext(expr, sandbox, {filename:'test.js'});
        console.log('OK  ' + expr.substring(0,60) + ' => ' + JSON.stringify(result));
    } catch(e) {
        console.log('ERR ' + expr.substring(0,60) + ' => ' + e.message);
    }
});

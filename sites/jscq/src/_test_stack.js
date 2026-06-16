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
['Uint8Array','Map','Set','Symbol','Proxy','Reflect','Promise','ArrayBuffer',
'Int8Array','Int16Array','Int32Array','Uint16Array','Uint32Array',
'Float32Array','Float64Array','DataView','WeakMap','WeakSet',
'Uint8ClampedArray'].forEach(function(n){sandbox[n]=global[n];});
vm.createContext(sandbox);
delete sandbox.__dirname; delete sandbox.__filename; delete sandbox.require;
delete sandbox.module; delete sandbox.exports; delete sandbox.global;
delete sandbox.process; delete sandbox.Buffer;
setupEnv(sandbox, {url:'https://www.jscq.com.cn/', meta_content:'t', meta_id:'', js_url:'https://www.jscq.com.cn/test.js', inline_script_text:''});

// Apply same overrides as gen_cookie.js
var _sandboxRef = sandbox;
var _customEval = function(code) {
    return vm.runInContext(code, _sandboxRef, { filename: '<anonymous>' });
};
_customEval[_outerNatKey] = 'eval';
sandbox.eval = _customEval;
sandbox.window.eval = _customEval;

var _origFunction = sandbox.Function || Function;
var _customFunction = function() {
    var args = Array.prototype.slice.call(arguments);
    var body = args.pop() || '';
    var params = args;
    try {
        return vm.compileFunction(body, params, { filename: '<anonymous>', parsingContext: _sandboxRef });
    } catch(e) {
        return _origFunction.apply(this, params.concat([body]));
    }
};
_customFunction[_outerNatKey] = 'Function';
_customFunction.prototype = _origFunction.prototype;
sandbox.Function = _customFunction;
sandbox.window.Function = _customFunction;

// Test Error stacks
var checks = [
    // Direct Error stack
    '(new Error()).stack.split("\\n").slice(0,3).join("|")',
    // eval Error stack
    'eval("(new Error()).stack.split(\\"\\\\n\\").slice(0,2).join(\\"|\\")")',
    // new Function Error stack
    'var fn = new Function("return (new Error()).stack.split(\\"\\\\n\\").slice(0,2).join(\\"|\\")"); fn()',
    // toString checks
    'eval.toString().substring(0, 60)',
    'Function.toString().substring(0, 60)',
    'new Function("return 1")()',
    'typeof eval',
    'typeof Function',
];
checks.forEach(function(expr) {
    try {
        var result = vm.runInContext(expr, sandbox, { filename: 'https://www.jscq.com.cn/page.html' });
        console.log('OK  ' + expr.substring(0, 60) + ' => ' + String(result).substring(0, 200));
    } catch(e) {
        console.log('ERR ' + expr.substring(0, 60) + ' => ' + e.message);
    }
});

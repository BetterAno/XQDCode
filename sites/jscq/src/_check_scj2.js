var vm = require('vm');
var path = require('path');
var fs = require('fs');
var _origOuterToString = Function.prototype.toString;
var _outerNatKey = '__natName';
Function.prototype.toString = function() {
    if (this[_outerNatKey]) return 'function ' + this[_outerNatKey] + '() { [native code] }';
    return _origOuterToString.call(this);
};
Function.prototype.toString[_outerNatKey] = 'toString';
var setupEnv = require(path.join(__dirname, 'env.js'));
var input = JSON.parse(fs.readFileSync(path.join(__dirname, '_test_input.json'), 'utf-8'));

var sandbox = {};
['Uint8Array','Map','Set','Symbol','Proxy','Reflect','Promise','ArrayBuffer',
'Int8Array','Int16Array','Int32Array','Uint16Array','Uint32Array',
'Float32Array','Float64Array','DataView','WeakMap','WeakSet',
'Uint8ClampedArray'].forEach(function(n){sandbox[n]=global[n];});
vm.createContext(sandbox);
delete sandbox.__dirname; delete sandbox.__filename; delete sandbox.require;
delete sandbox.module; delete sandbox.exports; delete sandbox.global;
delete sandbox.process; delete sandbox.Buffer;

setupEnv(sandbox, {url:input.url, meta_content:input.meta_content, meta_id:input.meta_id||'', js_url:input.js_url, inline_script_text:input.inline_script||''});

var _sandboxRef = sandbox;
var _vmModule = vm;

// Hook eval to check $_ts.scj BEFORE executing
var _customEval = function(code) {
    var codeLen = code ? code.length : 0;
    // Check scj state before executing this eval
    var scjState = vm.runInContext('(function(){var ts=$_ts||{};return JSON.stringify({scjLen:ts.scj?ts.scj.length:0,aebiLen:ts.aebi?ts.aebi.length:0,cpLen:ts.cp?ts.cp.length:0,allKeys:Object.keys(ts).sort()});})()', _sandboxRef);
    process.stderr.write('[BEFORE EVAL len=' + codeLen + '] scjState: ' + scjState + '\n');
    if (codeLen > 100) {
        process.stderr.write('[EVAL] Code starts with: ' + code.substring(0, 100) + '\n');
        process.stderr.write('[EVAL] Code ends with: ' + code.substring(code.length - 100) + '\n');
    }
    var result = _vmModule.runInContext(code, _sandboxRef, {filename:'<anonymous>'});
    return result;
};
_customEval[_outerNatKey] = 'eval';
sandbox.eval = _customEval;
sandbox.window.eval = _customEval;

var _origFunction = sandbox.Function || Function;
var _customFunction = function() {
    var args = Array.prototype.slice.call(arguments);
    var body = args.pop() || '';
    var params = args;
    try { return vm.compileFunction(body, params, {filename:'<anonymous>', parsingContext:_sandboxRef}); }
    catch(e) { return _origFunction.apply(this, params.concat([body])); }
};
_customFunction[_outerNatKey] = 'Function';
_customFunction.prototype = _origFunction.prototype;
sandbox.Function = _customFunction;
sandbox.window.Function = _customFunction;

if (input.o_cookie_name && input.o_cookie_value) sandbox.__allCookies.push(input.o_cookie_name+'='+input.o_cookie_value);

// Execute inline script
vm.runInContext(input.inline_script, sandbox, {filename:'https://www.jscq.com.cn/page.html'});

// Execute Layer 1 - this triggers eval calls internally
vm.runInContext(input.js_content, sandbox, {filename:'https://www.jscq.com.cn/3of0EhpccaFM/RkdMxdIZoj2i.bc4278d.js'});

process.stderr.write('\n=== FINAL STATE ===\n');
process.stderr.write('Cookie captured: ' + (sandbox.__capturedCookie ? sandbox.__capturedCookie.length + ' chars' : 'NONE') + '\n');
process.stderr.write('All cookies: ' + sandbox.__allCookies.length + '\n');
if (sandbox.__capturedCookie) {
    process.stderr.write('P Cookie: ' + sandbox.__capturedCookie + '\n');
}

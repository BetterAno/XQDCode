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
var evalCallCount = 0;
var evalLastCodeLen = 0;

// Hook eval to track calls
var _customEval = function(code) {
    evalCallCount++;
    evalLastCodeLen = code ? code.length : 0;
    process.stderr.write('[EVAL #' + evalCallCount + '] code length: ' + (code ? code.length : 0) + '\n');
    if (code && code.length < 500) {
        process.stderr.write('[EVAL] code preview: ' + code.substring(0, 300) + '\n');
    }
    var result = vm.runInContext(code, _sandboxRef, {filename:'<anonymous>'});
    process.stderr.write('[EVAL #' + evalCallCount + '] returned, type: ' + typeof result + '\n');
    // Check $_ts after eval
    var tsState = vm.runInContext('(function(){var ts=$_ts||{};return JSON.stringify({keys:Object.keys(ts).sort(),scjLen:ts.scj?ts.scj.length:0,aebiLen:ts.aebi?ts.aebi.length:0,cpLen:ts.cp?ts.cp.length:0});})()', _sandboxRef);
    process.stderr.write('[EVAL #' + evalCallCount + '] $_ts after: ' + tsState + '\n');
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
    process.stderr.write('[FUNCTION] params: ' + JSON.stringify(params) + ' body length: ' + (body ? body.length : 0) + '\n');
    try { return vm.compileFunction(body, params, {filename:'<anonymous>', parsingContext:_sandboxRef}); }
    catch(e) { return _origFunction.apply(this, params.concat([body])); }
};
_customFunction[_outerNatKey] = 'Function';
_customFunction.prototype = _origFunction.prototype;
sandbox.Function = _customFunction;
sandbox.window.Function = _customFunction;

if (input.o_cookie_name && input.o_cookie_value) sandbox.__allCookies.push(input.o_cookie_name+'='+input.o_cookie_value);

// Check $_ts before inline script
var tsBefore = vm.runInContext('(function(){return JSON.stringify(Object.keys($_ts||{}));})()', sandbox);
console.log('$_ts before inline:', tsBefore);

// Execute inline script
vm.runInContext(input.inline_script, sandbox, {filename:'https://www.jscq.com.cn/page.html'});

// Check $_ts after inline script
var tsAfterInline = vm.runInContext('(function(){var ts=$_ts||{};return JSON.stringify({keys:Object.keys(ts).sort(),hasCd:!!ts.cd,cdLen:ts.cd?ts.cd.length:0});})()', sandbox);
console.log('$_ts after inline:', tsAfterInline);

// Execute Layer 1
console.log('\n--- Executing Layer 1 (js_content, length:', input.js_content.length, ') ---');
vm.runInContext(input.js_content, sandbox, {filename:'https://www.jscq.com.cn/3of0EhpccaFM/RkdMxdIZoj2i.bc4278d.js'});

// Check $_ts after Layer 1
var tsAfterL1 = vm.runInContext('(function(){var ts=$_ts||{};return JSON.stringify({keys:Object.keys(ts).sort(),scjLen:ts.scj?ts.scj.length:0,aebiLen:ts.aebi?ts.aebi.length:0,cpLen:ts.cp?ts.cp.length:0,cookie:sandbox.__capturedCookie?sandbox.__capturedCookie.length:0});})()', sandbox);
console.log('\n$_ts after Layer 1:', tsAfterL1);

// Check cookies
console.log('Captured cookie length:', sandbox.__capturedCookie ? sandbox.__capturedCookie.length : 0);
console.log('All cookies:', sandbox.__allCookies.length);
console.log('Eval call count:', evalCallCount);

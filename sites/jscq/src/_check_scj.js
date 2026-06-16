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
var _customEval = function(code) { return vm.runInContext(code, _sandboxRef, {filename:'<anonymous>'}); };
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

// Execute Layer 1
vm.runInContext(input.js_content, sandbox, {filename:'https://www.jscq.com.cn/3of0EhpccaFM/RkdMxdIZoj2i.bc4278d.js'});

// Check $_ts state
var tsState = vm.runInContext('(function(){var ts=$_ts||{};return JSON.stringify({keys:Object.keys(ts),hasScj:!!ts.scj,scjIsArray:Array.isArray(ts.scj),scjLen:ts.scj?ts.scj.length:0,hasAebi:!!ts.aebi,aebiIsArray:Array.isArray(ts.aebi),aebiLen:ts.aebi?ts.aebi.length:0,hasCp:!!ts.cp,cpLen:ts.cp?ts.cp.length:0});})()', sandbox);
console.log('After Layer 1:', tsState);

if (sandbox.$_ts && sandbox.$_ts.scj) {
    var scj = sandbox.$_ts.scj;
    console.log('scj first 10:', JSON.stringify(scj.slice(0, 10)));
    var nonEmpty = scj.filter(function(s){return typeof s === 'string' && s.length > 0;}).length;
    console.log('Non-empty strings:', nonEmpty, '/', scj.length);
}

// Also check Error stack
var errStack = vm.runInContext('(new Error()).stack', sandbox);
console.log('\nError stack (first 5 lines):');
errStack.split('\n').slice(0,5).forEach(function(l){console.log('  ',l);});

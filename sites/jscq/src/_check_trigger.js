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
['Uint8Array','Map','Set','Symbol','Proxy','Reflect','Promise','ArrayBuffer','Int8Array','Int16Array','Int32Array','Uint16Array','Uint32Array','Float32Array','Float64Array','DataView','WeakMap','WeakSet','Uint8ClampedArray'].forEach(function(n){sandbox[n]=global[n];});
vm.createContext(sandbox);
delete sandbox.__dirname; delete sandbox.__filename; delete sandbox.require;
delete sandbox.module; delete sandbox.exports; delete sandbox.global;
delete sandbox.process; delete sandbox.Buffer;
setupEnv(sandbox, {url:input.url, meta_content:input.meta_content, meta_id:input.meta_id||'', js_url:input.js_url, inline_script_text:input.inline_script||''});
sandbox.structuredClone = function(obj) { return JSON.parse(JSON.stringify(obj)); };
sandbox.window.structuredClone = sandbox.structuredClone;
if (input.o_cookie_name && input.o_cookie_value) sandbox.__allCookies.push(input.o_cookie_name+'='+input.o_cookie_value);
vm.runInContext(input.inline_script, sandbox, {filename:'page.html'});
vm.runInContext(input.js_content, sandbox, {filename:'layer1.js'});

// Check trigger
var funcs = vm.runInContext('Object.keys(window).filter(function(k){return k.indexOf("_$")===0 && typeof window[k]==="function";}).slice(0,30)', sandbox);
console.log('_$ functions:', JSON.stringify(funcs));
console.log('Cookie after L1+L2:', sandbox.__capturedCookie ? sandbox.__capturedCookie.length + ' chars' : 'NONE');

// Try trigger
if (input.trigger_call) {
    try {
        vm.runInContext(input.trigger_call, sandbox, {filename:'trigger.js'});
        console.log('Cookie after trigger:', sandbox.__capturedCookie ? sandbox.__capturedCookie.length + ' chars' : 'NONE');
    } catch(e) {
        console.log('Trigger error:', e.message);
    }
}

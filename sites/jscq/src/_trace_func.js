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

// Hook Function constructor inside the sandbox to capture bodies
vm.runInContext([
    '(function() {',
    '  var _origF = Function;',
    '  window.__funcBodies = [];',
    '  Function = function() {',
    '    var args = Array.prototype.slice.call(arguments);',
    '    var body = args.pop() || "";',
    '    var params = args;',
    '    window.__funcBodies.push({params: params.join(","), body: body, bodyLen: body.length});',
    '    // Call original Function constructor',
    '    if (params.length === 0) return new _origF(body);',
    '    var allArgs = params.concat([body]);',
    '    return _origF.apply(null, allArgs);',
    '  };',
    '  Function.prototype = _origF.prototype;',
    '  window.Function = Function;',
    '})();',
].join('\n'), sandbox);

if (input.o_cookie_name && input.o_cookie_value) sandbox.__allCookies.push(input.o_cookie_name+'='+input.o_cookie_value);

// Execute inline script
vm.runInContext(input.inline_script, sandbox, {filename:'https://www.jscq.com.cn/page.html'});
// Execute Layer 1
vm.runInContext(input.js_content, sandbox, {filename:'https://www.jscq.com.cn/3of0EhpccaFM/RkdMxdIZoj2i.bc4278d.js'});

// Check captured Function bodies
var bodies = sandbox.__funcBodies;
console.log('Function bodies captured: ' + bodies.length);
bodies.forEach(function(b, i) {
    console.log('\nFunction #' + i + ' (params: "' + b.params + '", bodyLen: ' + b.bodyLen + '):');
    console.log('  ' + b.body);
});

// Also check cookie
console.log('\nCookie: ' + (sandbox.__capturedCookie ? sandbox.__capturedCookie.length + ' chars' : 'NONE'));

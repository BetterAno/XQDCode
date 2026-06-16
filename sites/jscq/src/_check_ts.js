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

// prepareStackTrace
vm.runInContext([
    '(function() {',
    '  Error.prepareStackTrace = function(err, stack) {',
    '    var lines = ["Error"];',
    '    for (var i = 0; i < stack.length; i++) {',
    '      var f = stack[i];',
    '      var fileName = f.getFileName();',
    '      if (fileName && (fileName.indexOf("node:") === 0 || fileName.indexOf("internal/") === 0)) continue;',
    '      if (fileName && fileName.indexOf("evalmachine.") === 0) fileName = "<anonymous>";',
    '      if (!fileName) fileName = "<anonymous>";',
    '      var fn = f.getFunctionName() || "";',
    '      var line = f.getLineNumber();',
    '      var col = f.getColumnNumber();',
    '      if (fn) lines.push("    at " + fn + " (" + fileName + ":" + (line||1) + ":" + (col||1) + ")");',
    '      else lines.push("    at " + fileName + ":" + (line||1) + ":" + (col||1));',
    '    }',
    '    return lines.join(String.fromCharCode(10));',
    '  };',
    '})();',
].join('\n'), sandbox);
sandbox.structuredClone = function(obj) { return JSON.parse(JSON.stringify(obj)); };
sandbox.window.structuredClone = sandbox.structuredClone;
if (input.o_cookie_name && input.o_cookie_value) sandbox.__allCookies.push(input.o_cookie_name+'='+input.o_cookie_value);

// Execute inline script
vm.runInContext(input.inline_script, sandbox, {filename:'https://www.jscq.com.cn/page.html'});

// Check $_ts before Layer 1
var tsBefore = vm.runInContext('(function(){var ts=$_ts||{};return JSON.stringify({cdLen:ts.cd?ts.cd.length:0,nsd:ts.nsd});})()', sandbox);
console.log('$_ts before L1:', tsBefore);

// Hook eval to capture $_ts state JUST before Layer 2 execution
var _origSandboxEval = sandbox.eval;
var _l2Captured = false;
// Don't override eval (would break scope) - instead check after Layer 1

// Execute Layer 1
vm.runInContext(input.js_content, sandbox, {filename:'https://www.jscq.com.cn/3of0EhpccaFM/RkdMxdIZoj2i.bc4278d.js'});

// Check all $_ts values after full execution
var tsAfter = vm.runInContext('(function(){var ts=$_ts||{};var r={};r.keys=Object.keys(ts);r.jf=ts.jf;r.l=ts.l__;if(ts.cp){r.cp=[];for(var i=0;i<ts.cp.length;i++){var v=ts.cp[i];r.cp.push(typeof v==="string"?v.substring(0,50):String(v).substring(0,50));}}if(ts.aebi){r.aebi=[];for(var i=0;i<ts.aebi.length;i++){var v=ts.aebi[i];r.aebi.push(typeof v==="string"?v.substring(0,30):String(v).substring(0,30));}}r.nsd=ts.nsd;r.cdLen=ts.cd?ts.cd.length:0;return JSON.stringify(r);})()', sandbox);
console.log('\n$_ts after full execution:', tsAfter);
console.log('\nCookie:', sandbox.__capturedCookie ? sandbox.__capturedCookie.length + ' chars' : 'NONE');

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

// Error.prepareStackTrace
vm.runInContext([
    '(function() {',
    '  Error.prepareStackTrace = function(err, stack) {',
    '    var lines = ["Error"];',
    '    for (var i = 0; i < stack.length; i++) {',
    '      var f = stack[i];',
    '      var fileName = f.getFileName();',
    '      if (fileName && (fileName.indexOf("node:vm") >= 0 || fileName.indexOf("internal/") >= 0)) continue;',
    '      if (fileName && fileName.indexOf("evalmachine.") === 0) fileName = "<anonymous>";',
    '      if (!fileName) fileName = "<anonymous>";',
    '      var fn = f.getFunctionName() || "";',
    '      var line = f.getLineNumber();',
    '      var col = f.getColumnNumber();',
    '      if (fn) { lines.push("    at " + fn + " (" + fileName + ":" + (line||1) + ":" + (col||1) + ")"); }',
    '      else { lines.push("    at " + fileName + ":" + (line||1) + ":" + (col||1)); }',
    '    }',
    '    return lines.join(String.fromCharCode(10));',
    '  };',
    '})();',
].join('\n'), sandbox);

sandbox.structuredClone = function(obj) { return JSON.parse(JSON.stringify(obj)); };
sandbox.window.structuredClone = sandbox.structuredClone;

// Track eval calls by wrapping eval in a logging proxy
// BUT keep the original eval as the actual executor
var evalCount = 0;
vm.runInContext([
    '(function() {',
    '  var _origEval = eval;',
    '  var _count = 0;',
    '  window.__evalLog = [];',
    '  // We do NOT override eval - just use the default one',
    '  // But we can check after execution what happened',
    '})();',
].join('\n'), sandbox);

if (input.o_cookie_name && input.o_cookie_value) sandbox.__allCookies.push(input.o_cookie_name+'='+input.o_cookie_value);

vm.runInContext(input.inline_script, sandbox, {filename:'https://www.jscq.com.cn/page.html'});

// Add a global error handler to catch eval errors
vm.runInContext([
    'window.__evalErrors = [];',
    'var _origEval2 = eval;',
    'var _evalWrapped = function(code) {',
    '  try {',
    '    var r = _origEval2(code);',
    '    return r;',
    '  } catch(e) {',
    '    window.__evalErrors.push({msg: e.message, codeLen: code ? code.length : 0});',
    '    throw e;',
    '  }',
    '};',
    // Don't override eval directly - this would break scope
    // Instead, we'll check after execution
].join('\n'), sandbox);

// Run Layer 1
vm.runInContext(input.js_content, sandbox, {filename:'https://www.jscq.com.cn/3of0EhpccaFM/RkdMxdIZoj2i.bc4278d.js'});

// Check result
process.stderr.write('Cookie: ' + (sandbox.__capturedCookie ? sandbox.__capturedCookie.length + ' chars' : 'NONE') + '\n');
process.stderr.write('Eval errors: ' + JSON.stringify(sandbox.__evalErrors) + '\n');

// Check what Z8XHJJY is (might be a global now)
try {
    var z = vm.runInContext('typeof Z8XHJJY', sandbox);
    process.stderr.write('typeof Z8XHJJY: ' + z + '\n');
} catch(e) {
    process.stderr.write('Z8XHJJY check error: ' + e.message + '\n');
}

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
    '      var f = stack[i]; var fn = f.getFileName();',
    '      if (fn && (fn.indexOf("node:") === 0 || fn.indexOf("internal/") === 0)) continue;',
    '      if (fn && fn.indexOf("evalmachine.") === 0) fn = "<anonymous>";',
    '      if (!fn) fn = "<anonymous>";',
    '      var ffn = f.getFunctionName() || ""; var ln = f.getLineNumber(); var cl = f.getColumnNumber();',
    '      if (ffn) lines.push("    at " + ffn + " (" + fn + ":" + (ln||1) + ":" + (cl||1) + ")");',
    '      else lines.push("    at " + fn + ":" + (ln||1) + ":" + (cl||1));',
    '    }',
    '    return lines.join(String.fromCharCode(10));',
    '  };',
    '})();',
].join('\n'), sandbox);
sandbox.structuredClone = function(obj) { return JSON.parse(JSON.stringify(obj)); };
sandbox.window.structuredClone = sandbox.structuredClone;

if (input.o_cookie_name && input.o_cookie_value) sandbox.__allCookies.push(input.o_cookie_name+'='+input.o_cookie_value);
vm.runInContext(input.inline_script, sandbox, {filename:'https://www.jscq.com.cn/page.html'});

// Inject a hook to capture $_ts state right before eval(Layer2) is called
// We use a Proxy on eval to detect when the 297KB Layer 2 code is passed
var _sandboxRef = sandbox;
var _origEval = sandbox.eval;
var _capturedTsState = null;
var _customEval = function(code) {
    // When the large Layer 2 code is passed to eval, capture $_ts state BEFORE executing
    if (code && code.length > 100000 && !_capturedTsState) {
        _capturedTsState = vm.runInContext('(function(){var ts=$_ts||{};var r={};r.keys=Object.keys(ts);r.jf=ts.jf;r.nsd=ts.nsd;r.cdLen=ts.cd?ts.cd.length:0;r.lcd=ts.lcd;if(ts.cp){r.cpLen=ts.cp.length;r.cpTypes=[];for(var i=0;i<ts.cp.length;i++){var v=ts.cp[i];r.cpTypes.push(typeof v);}}if(ts.aebi){r.aebiLen=ts.aebi.length;}r.scjLen=ts.scj?ts.scj.length:0;return JSON.stringify(r);})()', _sandboxRef);
        process.stderr.write('[CAPTURED $_ts before L2] ' + _capturedTsState + '\n');
        
        // Also check meta tag
        var metaCheck = vm.runInContext('(function(){var el=document.getElementById("' + input.meta_id + '");if(!el)return "NO META ELEMENT";return JSON.stringify({id:el.id,content:el.getAttribute("content"),r:el.getAttribute("r")});})()', _sandboxRef);
        process.stderr.write('[META] ' + metaCheck + '\n');
    }
    return _origEval.call(this, code);
};
// NOTE: overriding eval breaks calling scope! But we need to capture state.
// This is just for diagnosis, not for production.
_customEval[_outerNatKey] = 'eval';
sandbox.eval = _customEval;
sandbox.window.eval = _customEval;

vm.runInContext(input.js_content, sandbox, {filename:'https://www.jscq.com.cn/3of0EhpccaFM/RkdMxdIZoj2i.bc4278d.js'});
console.log('\nCookie:', sandbox.__capturedCookie ? sandbox.__capturedCookie.length + ' chars' : 'NONE');

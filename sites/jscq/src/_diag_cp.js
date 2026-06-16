var fs = require('fs');
var vm = require('vm');
var path = require('path');
var setupEnv = require(path.join(__dirname, 'env.js'));

var inputPath = fs.readFileSync(path.join(__dirname, '_diag_input_path.txt'), 'utf-8').trim();
var input = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

var sandbox = {};
['Uint8Array', 'Uint8ClampedArray', 'Int8Array', 'Int16Array', 'Int32Array',
    'Uint16Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'ArrayBuffer', 'DataView',
    'Map', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'Proxy', 'Reflect', 'Promise'].forEach(function (n) {
    sandbox[n] = global[n];
});
vm.createContext(sandbox);
delete sandbox.__dirname; delete sandbox.__filename; delete sandbox.require;
delete sandbox.module; delete sandbox.exports; delete sandbox.global;
delete sandbox.process; delete sandbox.Buffer;

setupEnv(sandbox, {
    url: input.url,
    meta_content: input.meta_content,
    meta_id: input.meta_id || '',
    js_url: input.js_url,
    inline_script_text: input.inline_script || '',
});

// Do NOT pre-define execScript
// Inject O Cookie
if (input.o_cookie_name && input.o_cookie_value) {
    sandbox.__allCookies.push(input.o_cookie_name + '=' + input.o_cookie_value);
}

// Track when execScript gets defined on window
var execScriptDefined = false;
var execScriptDefineLog = [];
try {
    vm.runInContext('Object.defineProperty(window, "execScript", { configurable: true, enumerable: true, get: function() { return window.__execScript__; }, set: function(v) { window.__execScriptDefineLog__ = window.__execScriptDefineLog__ || []; window.__execScriptDefineLog__.push("set execScript=" + typeof v + " at " + (new Error().stack || "").split("\\n").slice(0,3).join("|")); window.__execScript__ = v; } })', sandbox);
} catch(e) {
    console.log('Could not instrument execScript: ' + e.message);
}

// Run inline script
vm.runInContext(input.inline_script, sandbox, { filename: 'inline.js' });

// Run Layer 1
vm.runInContext(input.js_content, sandbox, { filename: 'layer1.js' });

// Check $_ts state
var tsInfo = vm.runInContext('(function() { var ts = window.$_ts || this.$_ts; if (!ts) return "NO $_ts"; var info = {}; for (var k in ts) { var v = ts[k]; if (typeof v === "function") { info[k] = "function"; } else if (Array.isArray(v)) { info[k] = "array[" + v.length + "]"; if (v.length < 20) info[k] += "=" + JSON.stringify(v); } else if (typeof v === "object" && v !== null) { info[k] = JSON.stringify(v).substring(0, 100); } else { info[k] = String(v).substring(0, 100); } } return JSON.stringify(info, null, 2); })()', sandbox);

console.log('=== $_ts after Layer 1 ===');
console.log(tsInfo);

// Check execScript state
var execInfo = vm.runInContext('(function() { return JSON.stringify({ execScript: typeof window.execScript, execScriptVal: String(window.execScript).substring(0, 60), defineLog: window.__execScriptDefineLog__ || [] }); })()', sandbox);
console.log('\n=== execScript after Layer 1 ===');
console.log(execInfo);

// Run trigger
if (input.trigger_call) {
    vm.runInContext(input.trigger_call, sandbox, { filename: 'trigger.js' });
}

// Check cookie
if (sandbox.__capturedCookie) {
    var val = sandbox.__capturedCookie.split('=', 2)[1];
    console.log('\nCookie length: ' + val.length);
    console.log('Cookie parts: ' + val.split('.').length);
    console.log('Part[0]: ' + val.split('.')[0]);
} else {
    console.log('\nNO COOKIE CAPTURED');
}

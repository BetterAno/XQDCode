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

// Hook execScript to verify it's called
if (!sandbox.execScript) sandbox.execScript = sandbox.eval;
var origExecScript = sandbox.execScript;
var execScriptCalls = [];
sandbox.execScript = function(code) {
    execScriptCalls.push({ len: code ? code.length : 0, preview: (code || '').substring(0, 80) });
    process.stderr.write('[EXECSCRIPT CALL #' + execScriptCalls.length + '] codeLen=' + (code ? code.length : 0) + '\n');
    var result = vm.runInContext(code, sandbox, { filename: 'layer2_via_execScript.js' });
    process.stderr.write('[EXECSCRIPT CALL #' + execScriptCalls.length + '] done, $_ts.cp=' + JSON.stringify(sandbox.$_ts && sandbox.$_ts.cp) + '\n');
    return result;
};
sandbox.window.execScript = sandbox.execScript;

if (input.o_cookie_name && input.o_cookie_value) {
    sandbox.__allCookies.push(input.o_cookie_name + '=' + input.o_cookie_value);
}

// Execute inline script
vm.runInContext(input.inline_script, sandbox, { filename: 'inline.js' });

// Execute Layer 1
try {
    vm.runInContext(input.js_content, sandbox, { filename: 'layer1.js' });
} catch(e) {
    process.stderr.write('[LAYER1 ERROR] ' + e.message + '\n');
}

process.stderr.write('[AFTER L1] execScript called ' + execScriptCalls.length + ' times\n');

// Check $_ts state after L1
try {
    var tsState = vm.runInContext('(function(){ var ts = $_ts; if (!ts) return "no $_ts"; var r = {}; for (var k in ts) { if (ts.hasOwnProperty(k)) { var v = ts[k]; if (typeof v === "number") r[k] = v; else if (typeof v === "string") r[k] = v.length < 80 ? v : v.substring(0,80)+"..."; else if (typeof v === "boolean") r[k] = v; else if (Array.isArray(v)) { r[k] = "arr[" + v.length + "]"; if (v.length < 20) r[k] += "=" + JSON.stringify(v); } else if (typeof v === "function") r[k] = "fn"; else if (v === undefined) r[k] = "undef"; else if (v === null) r[k] = "null"; else r[k] = typeof v; } } return JSON.stringify(r, null, 2); })()', sandbox);
    process.stderr.write('[AFTER L1] $_ts state:\n' + tsState + '\n');
} catch(e) {
    process.stderr.write('[AFTER L1] $_ts dump error: ' + e.message + '\n');
}

// Execute trigger
if (input.trigger_call) {
    try {
        vm.runInContext(input.trigger_call, sandbox, { filename: 'trigger.js' });
    } catch(e) {
        process.stderr.write('[TRIGGER ERROR] ' + e.message + '\n');
    }
}

// Final check
if (sandbox.__capturedCookie) {
    var val = sandbox.__capturedCookie.split('=', 2)[1];
    process.stderr.write('\n[FINAL] Cookie len=' + val.length + ', parts=' + val.split('.').length + ', Part[0]=' + val.split('.')[0] + '\n');
    process.stdout.write(JSON.stringify({
        pcookie: sandbox.__capturedCookie,
        all: sandbox.__allCookies.filter(function(c) { return !c.startsWith('jDwkDWjIm6GRO'); })
    }));
} else {
    process.stderr.write('\n[FINAL] NO COOKIE CAPTURED\n');
    process.stderr.write('All cookies: ' + JSON.stringify(sandbox.__allCookies) + '\n');
    process.exit(1);
}

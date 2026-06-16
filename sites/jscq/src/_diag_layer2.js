/**
 * Instrument Layer 2 execution to trace detection functions
 * Hook execScript to inject logging into Layer 2 code
 */
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

if (!sandbox.execScript) sandbox.execScript = sandbox.eval;

// Hook execScript to capture and analyze Layer 2 code
var origExecScript = sandbox.execScript;
var layer2Code = null;
sandbox.execScript = function(code) {
    layer2Code = code;
    process.stderr.write('[LAYER2] Code captured: ' + code.length + ' chars\n');

    // Count debugger statements
    var dbgCount = 0;
    var idx = 0;
    while (true) {
        idx = code.indexOf('debugger', idx);
        if (idx === -1) break;
        dbgCount++;
        idx += 9;
    }
    process.stderr.write('[LAYER2] debugger statements: ' + dbgCount + '\n');

    // Count try-catch blocks
    var tryCount = (code.match(/\btry\b/g) || []).length;
    var catchCount = (code.match(/\bcatch\b/g) || []).length;
    process.stderr.write('[LAYER2] try: ' + tryCount + ', catch: ' + catchCount + '\n');

    // Search for cp assignment patterns
    var cpAssign = (code.match(/\.cp\s*=/g) || []).length;
    var cpRead = (code.match(/\$_ts\.cp|\$_ts\[.*cp/g) || []).length;
    process.stderr.write('[LAYER2] .cp= assignments: ' + cpAssign + ', cp reads: ' + cpRead + '\n');

    // Search for cookie setting patterns
    var cookieSet = (code.match(/cookie\s*=/g) || []).length;
    process.stderr.write('[LAYER2] cookie= assignments: ' + cookieSet + '\n');

    // Save Layer 2 code for analysis
    fs.writeFileSync(path.join(__dirname, '_layer2_latest.js'), code);

    // Execute the Layer 2 code
    var result = origExecScript.call(this, code);
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

// Check $_ts.cp after Layer 1 (which includes Layer 2 via execScript)
var cpAfterAll = vm.runInContext('(function(){ var ts = $_ts; if (!ts) return "no $_ts"; return JSON.stringify({hasCp: !!ts.cp, cpType: typeof ts.cp, cpLen: ts.cp ? ts.cp.length : "n/a"}); })()', sandbox);
process.stderr.write('[AFTER L1+L2] ' + cpAfterAll + '\n');

// Execute trigger
if (input.trigger_call) {
    try {
        vm.runInContext(input.trigger_call, sandbox, { filename: 'trigger.js' });
    } catch(e) {
        process.stderr.write('[TRIGGER ERROR] ' + e.message + '\n');
    }
}

if (sandbox.__capturedCookie) {
    var val = sandbox.__capturedCookie.split('=', 2)[1];
    process.stderr.write('\n[FINAL] Cookie len=' + val.length + ', Part[0]=' + val.split('.')[0] + '\n');
    process.stdout.write(JSON.stringify({
        pcookie: sandbox.__capturedCookie,
        all: sandbox.__allCookies.filter(function(c) { return !c.startsWith('jDwkDWjIm6GRO'); })
    }));
} else {
    process.stderr.write('\n[FINAL] NO COOKIE CAPTURED\n');
    process.exit(1);
}

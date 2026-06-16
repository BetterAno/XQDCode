/**
 * Deep diagnostic: capture $_ts.cp values and other detection-related state
 * Run after Layer 1, before trigger
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

if (input.o_cookie_name && input.o_cookie_value) {
    sandbox.__allCookies.push(input.o_cookie_name + '=' + input.o_cookie_value);
}

// Hook document.cookie setter to capture when cookie is being set
// and dump $_ts state at that moment
var origCookieSet = Object.getOwnPropertyDescriptor(sandbox.document, 'cookie').set;
var cookieSetCount = 0;
Object.defineProperty(sandbox.document, 'cookie', {
    get: function() {
        var cookies = sandbox.__allCookies.join('; ');
        return cookies;
    },
    set: function(v) {
        cookieSetCount++;
        var parts = v.split('=', 2);
        var name = parts[0].trim();
        var value = parts.length > 1 ? parts[1] : '';

        // Log every cookie set
        process.stderr.write('[COOKIE SET #' + cookieSetCount + '] ' + name + '=' + value.substring(0, 40) + '... (len=' + value.length + ')\n');

        if (!name.endsWith('O')) {
            sandbox.__capturedCookie = v;
            sandbox.__allCookies.push(v);

            // Dump $_ts.cp at cookie capture time
            try {
                var cpDump = vm.runInContext('(function(){ var ts = $_ts; if (!ts || !ts.cp) return "no cp"; return JSON.stringify(ts.cp); })()', sandbox);
                process.stderr.write('[COOKIE CAPTURE] cp=' + cpDump + '\n');

                // Also dump nsd and other $_ts props
                var tsDump = vm.runInContext('(function(){ var ts = $_ts; if (!ts) return "no ts"; var r = {}; var keys = Object.keys(ts); keys.forEach(function(k) { var v = ts[k]; if (typeof v === "number") r[k] = v; else if (typeof v === "string") r[k] = v.substring(0, 50); else if (typeof v === "boolean") r[k] = v; else if (Array.isArray(v)) r[k] = "arr[" + v.length + "]"; else if (typeof v === "function") r[k] = "fn"; else if (v === undefined) r[k] = "undef"; else r[k] = typeof v; }); return JSON.stringify(r); })()', sandbox);
                process.stderr.write('[COOKIE CAPTURE] ts props=' + tsDump + '\n');
            } catch(e) {
                process.stderr.write('[COOKIE CAPTURE] dump error: ' + e.message + '\n');
            }
        } else {
            sandbox.__allCookies.push(v);
        }
    },
    configurable: true,
    enumerable: true,
});

// Execute inline script
vm.runInContext(input.inline_script, sandbox, { filename: 'inline.js' });

// Execute Layer 1
vm.runInContext(input.js_content, sandbox, { filename: 'layer1.js' });

// Dump $_ts.cp after Layer 1
try {
    var cpAfterL1 = vm.runInContext('(function(){ var ts = $_ts; if (!ts) return "no $_ts"; return JSON.stringify({cp: ts.cp, nsd: ts.nsd, cd: ts.cd, lcd: ts.lcd, cp_len: ts.cp ? ts.cp.length : 0}); })()', sandbox);
    process.stderr.write('[AFTER L1] ' + cpAfterL1 + '\n');
} catch(e) {
    process.stderr.write('[AFTER L1] error: ' + e.message + '\n');
}

// Execute trigger
if (input.trigger_call) {
    vm.runInContext(input.trigger_call, sandbox, { filename: 'trigger.js' });
}

// Final cookie check
if (sandbox.__capturedCookie) {
    var val = sandbox.__capturedCookie.split('=', 2)[1];
    process.stdout.write(JSON.stringify({
        pcookie: sandbox.__capturedCookie,
        all: sandbox.__allCookies.filter(function(c) { return !c.startsWith('jDwkDWjIm6GRO'); })
    }));
    process.stderr.write('\n[FINAL] Cookie len=' + val.length + ', parts=' + val.split('.').length + ', Part[0]=' + val.split('.')[0] + '\n');
} else {
    process.stderr.write('\n[FINAL] NO COOKIE CAPTURED\n');
    process.exit(1);
}

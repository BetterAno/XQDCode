/**
 * Dump ALL cookie operations during execution
 */
var fs = require('fs');
var vm = require('vm');
var path = require('path');
var setupEnv = require(path.join(__dirname, 'env.js'));

var inputPath = process.argv[2];
if (!inputPath) { process.stderr.write('Usage: node dump_all_cookies.js <input.json>\n'); process.exit(1); }
var input = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

var sandbox = {};
['Buffer', 'Uint8Array', 'Uint8ClampedArray', 'Int8Array', 'Int16Array', 'Int32Array',
    'Uint16Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'ArrayBuffer', 'DataView',
    'Map', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'Proxy', 'Reflect', 'Promise'].forEach(function (n) {
        sandbox[n] = global[n];
    });
vm.createContext(sandbox);
delete sandbox.__dirname;
delete sandbox.__filename;
delete sandbox.require;
delete sandbox.module;
delete sandbox.exports;
delete sandbox.global;
delete sandbox.process;
delete sandbox.Buffer;

setupEnv(sandbox, {
    url: input.url,
    meta_content: input.meta_content,
    meta_id: input.meta_id || '',
    js_url: input.js_url,
    inline_script_text: input.inline_script || '',
});

// Pre-inject O cookie
if (input.o_cookie_name && input.o_cookie_value) {
    sandbox.__allCookies.push(input.o_cookie_name + '=' + input.o_cookie_value);
}

// Track ALL document.cookie writes with timestamps
var cookieOps = [];
var origCookieDesc = Object.getOwnPropertyDescriptor(sandbox.document, 'cookie');
var origSet = origCookieDesc.set;
var origGet = origCookieDesc.get;

// Re-define cookie with enhanced logging
Object.defineProperty(sandbox.document, 'cookie', {
    get: function() { return origGet.call(sandbox.document); },
    set: function(val) {
        var cookiePart = String(val).split(';')[0];
        var eqIdx = cookiePart.indexOf('=');
        var name = eqIdx !== -1 ? cookiePart.substring(0, eqIdx) : '';
        var value = eqIdx !== -1 ? cookiePart.substring(eqIdx + 1) : '';
        cookieOps.push({
            index: cookieOps.length,
            name: name,
            valueLen: value.length,
            valueStart: value.substring(0, 40),
            valueEnd: value.length > 40 ? value.substring(value.length - 20) : '',
            dots: (value.match(/\./g) || []).length,
            fullCookie: cookiePart,
        });
        // Still call original setter
        origSet.call(sandbox.document, val);
    },
    configurable: true,
    enumerable: true,
});

try {
    if (input.inline_script) vm.runInContext(input.inline_script, sandbox, { filename: 'inline.js' });
    if (input.js_content) vm.runInContext(input.js_content, sandbox, { filename: 'vm.js' });
    if (input.trigger_call) vm.runInContext(input.trigger_call, sandbox, { filename: 'trigger.js' });
} catch (e) {
    process.stderr.write('[ERROR] ' + e.message + '\n');
}

// Write results
var diagPath = path.join(__dirname, '..', 'cookie_ops.json');
var diag = {
    cookieOps: cookieOps,
    capturedCookie: sandbox.__capturedCookie || '',
    capturedCookieLen: sandbox.__capturedCookie ? sandbox.__capturedCookie.split('=', 2)[1].length : 0,
};
fs.writeFileSync(diagPath, JSON.stringify(diag, null, 2));
process.stderr.write('Cookie ops written to ' + diagPath + '\n');

if (sandbox.__capturedCookie) {
    process.stdout.write(sandbox.__capturedCookie);
}

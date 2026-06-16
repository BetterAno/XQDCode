/**
 * Monitor all property accesses via Proxy to find missing environment properties.
 * Run after env.js setup, before VM code execution.
 */
var fs = require('fs');
var vm = require('vm');
var path = require('path');
var setupEnv = require(path.join(__dirname, 'env.js'));

var inputPath = process.argv[2];
if (!inputPath) { process.stderr.write('Usage: node monitor_proxy.js <input.json>\n'); process.exit(1); }
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

if (input.o_cookie_name && input.o_cookie_value) {
    sandbox.__allCookies.push(input.o_cookie_name + '=' + input.o_cookie_value);
}

// Wrap key objects with Proxy to log undefined accesses
var missingProps = {};
var accessLog = [];

function wrapWithProxy(obj, objName) {
    // Can't proxy the sandbox itself easily in vm, so we wrap sub-objects
    if (typeof obj !== 'object' || obj === null) return obj;
    try {
        return new Proxy(obj, {
            get: function(target, prop, receiver) {
                var val = target[prop];
                if (val === undefined && typeof prop === 'string' && prop !== '__proto__' && prop !== 'constructor' && !prop.startsWith('__')) {
                    var key = objName + '.' + prop;
                    if (!missingProps[key]) {
                        missingProps[key] = { count: 0, firstAccess: '' };
                    }
                    missingProps[key].count++;
                    if (missingProps[key].count <= 2) {
                        accessLog.push(objName + '.' + prop + ' = undefined');
                    }
                }
                return val;
            },
        });
    } catch (e) {
        return obj;
    }
}

// Wrap navigator, document, location, screen, history
sandbox.navigator = wrapWithProxy(sandbox.navigator, 'navigator');
sandbox.document = wrapWithProxy(sandbox.document, 'document');
sandbox.location = wrapWithProxy(sandbox.location, 'location');
sandbox.screen = wrapWithProxy(sandbox.screen, 'screen');
sandbox.history = wrapWithProxy(sandbox.history, 'history');
sandbox.performance = wrapWithProxy(sandbox.performance, 'performance');
sandbox.crypto = wrapWithProxy(sandbox.crypto, 'crypto');

// Update window references
sandbox.window.navigator = sandbox.navigator;
sandbox.window.document = sandbox.document;
sandbox.window.location = sandbox.location;
sandbox.window.screen = sandbox.screen;
sandbox.window.history = sandbox.history;
sandbox.window.performance = sandbox.performance;
sandbox.window.crypto = sandbox.crypto;

if (!sandbox.execScript) {
    sandbox.execScript = sandbox.eval;
}

try {
    if (input.inline_script) vm.runInContext(input.inline_script, sandbox, { filename: 'inline.js' });
    if (input.js_content) vm.runInContext(input.js_content, sandbox, { filename: 'vm.js' });
    if (input.trigger_call) vm.runInContext(input.trigger_call, sandbox, { filename: 'trigger.js' });
} catch (e) {
    process.stderr.write('[ERROR] ' + e.message + '\n');
}

// Write results
var result = {
    missingProps: missingProps,
    accessLog: accessLog,
    cookieLen: sandbox.__capturedCookie ? sandbox.__capturedCookie.split('=', 2)[1].length : 0,
};
var outPath = path.join(__dirname, '..', 'proxy_log.json');
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
process.stderr.write('Proxy log written to ' + outPath + '\n');
process.stderr.write('Missing props: ' + Object.keys(missingProps).length + '\n');
process.stderr.write('Cookie length: ' + result.cookieLen + '\n');

if (sandbox.__capturedCookie) {
    process.stdout.write(sandbox.__capturedCookie);
}

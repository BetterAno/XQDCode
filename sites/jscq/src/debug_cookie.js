/**
 * Debug version - logs cookie generation details
 */
var fs = require('fs');
var vm = require('vm');
var path = require('path');

var inputPath = process.argv[2];
var input = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

var setupEnv = require(path.join(__dirname, 'env.js'));

var sandbox = {};
sandbox.Buffer = Buffer;
sandbox.Uint8Array = Uint8Array;
sandbox.Uint8ClampedArray = Uint8ClampedArray;
sandbox.Int8Array = Int8Array;
sandbox.Int16Array = Int16Array;
sandbox.Int32Array = Int32Array;
sandbox.Uint16Array = Uint16Array;
sandbox.Uint32Array = Uint32Array;
sandbox.Float32Array = Float32Array;
sandbox.Float64Array = Float64Array;
sandbox.ArrayBuffer = ArrayBuffer;
sandbox.DataView = DataView;
sandbox.Map = Map;
sandbox.Set = Set;
sandbox.WeakMap = WeakMap;
sandbox.WeakSet = WeakSet;
sandbox.Symbol = Symbol;
sandbox.Proxy = Proxy;
sandbox.Reflect = Reflect;
sandbox.Promise = Promise;

vm.createContext(sandbox);
setupEnv(sandbox, {
    url: input.url,
    meta_content: input.meta_content,
    meta_id: input.meta_id || '',
    js_url: input.js_url,
});

try {
    if (input.inline_script) {
        vm.runInContext(input.inline_script, sandbox, { filename: 'inline_script.js' });
    }
    if (input.js_content) {
        vm.runInContext(input.js_content, sandbox, { filename: 'ruishu6.js' });
    }
    if (input.trigger_call) {
        vm.runInContext(input.trigger_call, sandbox, { filename: 'trigger.js' });
    }
} catch (e) {
    process.stderr.write('[ERROR] ' + e.message + '\n' + e.stack + '\n');
}

var captured = sandbox.__capturedCookie;
process.stderr.write('Cookie captured: ' + (captured ? captured.substring(0, 60) + '... len=' + captured.length : 'NONE') + '\n');
process.stderr.write('All cookies count: ' + sandbox.__allCookies.length + '\n');

for (var i = 0; i < sandbox.__allCookies.length; i++) {
    var c = sandbox.__allCookies[i];
    var eq = c.indexOf('=');
    var name = c.substring(0, eq);
    var val = c.substring(eq + 1);
    process.stderr.write('  Cookie[' + i + ']: ' + name + '=' + val.substring(0, 40) + '... len=' + val.length + '\n');
}

process.stderr.write('$_ts keys: ' + JSON.stringify(Object.keys(sandbox.$_ts || {})) + '\n');

if (captured) process.stdout.write(captured);

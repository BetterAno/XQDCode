/**
 * Dump aebi array to file for analysis
 */
var fs = require('fs');
var vm = require('vm');
var path = require('path');
var setupEnv = require(path.join(__dirname, 'env.js'));

var inputPath = process.argv[2];
if (!inputPath) { process.stderr.write('Usage: node dump_aebi.js <input.json>\n'); process.exit(1); }
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

// Hook execScript to capture layer2 invocation
var capturedAebi = null;
var capturedScj = null;
var layer2Code = null;
var origExecScript = sandbox.eval;
sandbox.execScript = function(code) {
    if (typeof code === 'string' && code.length > 10000) {
        layer2Code = code;
        capturedScj = JSON.parse(JSON.stringify(sandbox.$_ts.scj || []));
        capturedAebi = [];
        var rawAebi = sandbox.$_ts.aebi || [];
        for (var i = 0; i < rawAebi.length; i++) {
            var v = rawAebi[i];
            if (v === null || v === undefined) {
                capturedAebi.push({ idx: i, type: String(v), val: null });
            } else if (typeof v === 'number') {
                capturedAebi.push({ idx: i, type: 'number', val: v });
            } else if (typeof v === 'boolean') {
                capturedAebi.push({ idx: i, type: 'boolean', val: v });
            } else if (typeof v === 'string') {
                capturedAebi.push({ idx: i, type: 'string', val: v.substring(0, 200), len: v.length });
            } else if (Array.isArray(v)) {
                capturedAebi.push({ idx: i, type: 'array', len: v.length, sample: v.slice(0, 5) });
            } else if (typeof v === 'object') {
                var keys = Object.keys(v);
                capturedAebi.push({ idx: i, type: 'object', keyCount: keys.length, keys: keys.slice(0, 20) });
            } else if (typeof v === 'function') {
                capturedAebi.push({ idx: i, type: 'function', name: v.name || 'anon' });
            } else {
                capturedAebi.push({ idx: i, type: typeof v });
            }
        }
    }
    return vm.runInContext(code, sandbox);
};

try {
    if (input.inline_script) vm.runInContext(input.inline_script, sandbox, { filename: 'inline.js' });
    if (input.js_content) vm.runInContext(input.js_content, sandbox, { filename: 'vm.js' });
    if (input.trigger_call) vm.runInContext(input.trigger_call, sandbox, { filename: 'trigger.js' });
} catch (e) {
    process.stderr.write('[ERROR] ' + e.message + '\n');
}

// Write diagnostics to file
var diagPath = path.join(__dirname, '..', 'aebi_dump.json');
var diag = {
    aebi: capturedAebi,
    aebi_raw_length: sandbox.$_ts.aebi ? sandbox.$_ts.aebi.length : -1,
    scj: { length: capturedScj ? capturedScj.length : 0, type: typeof capturedScj },
    layer2: { captured: !!layer2Code, length: layer2Code ? layer2Code.length : 0 },
    cookie: {
        captured: !!sandbox.__capturedCookie,
        value_length: sandbox.__capturedCookie ? sandbox.__capturedCookie.split('=', 2)[1].length : 0,
        dots: sandbox.__capturedCookie ? (sandbox.__capturedCookie.split('=', 2)[1].match(/\./g) || []).length : 0,
    },
    ts_keys: Object.keys(sandbox.$_ts),
    ts_nsd: typeof sandbox.$_ts.nsd,
    ts_cd_length: Array.isArray(sandbox.$_ts.cd) ? sandbox.$_ts.cd.length : -1,
    ts_l__type: typeof sandbox.$_ts['l__'],
    all_cookies_count: sandbox.__allCookies.length,
};

fs.writeFileSync(diagPath, JSON.stringify(diag, null, 2));
process.stderr.write('Diagnostics written to ' + diagPath + '\n');

// Output cookie to stdout
if (sandbox.__capturedCookie) {
    process.stdout.write(sandbox.__capturedCookie);
}

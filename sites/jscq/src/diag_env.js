/**
 * 轻量诊断: gen_cookie.js + $_ts dump + layer2 code save
 */
var fs = require('fs');
var vm = require('vm');
var path = require('path');

var inputPath = process.argv[2];
if (!inputPath) { process.stderr.write('Usage: node diag_env.js <input.json>\n'); process.exit(1); }
var input = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

var setupEnv = require(path.join(__dirname, 'env.js'));

var sandbox = {};
['Uint8Array', 'Uint8ClampedArray', 'Int8Array', 'Int16Array', 'Int32Array',
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

if (!sandbox.execScript) {
    sandbox.execScript = sandbox.eval;
}

if (input.o_cookie_name && input.o_cookie_value) {
    sandbox.__allCookies.push(input.o_cookie_name + '=' + input.o_cookie_value);
}

var diag = [];
function L(msg) { diag.push(msg); process.stderr.write('[D] ' + msg + '\n'); }

function dumpTs(label, ts) {
    if (!ts) { L(label + ': $_ts is null'); return; }
    L(label + ': keys=' + JSON.stringify(Object.keys(ts)));
    ['nsd','cd','lcd','cp','jf','aebi','scj','l__'].forEach(function(k) {
        if (ts.hasOwnProperty(k)) {
            var v = ts[k];
            if (v === undefined) L('  .'+k+'=undefined');
            else if (typeof v === 'string') L('  .'+k+' str len='+v.length+' start='+v.substring(0,40));
            else if (Array.isArray(v)) {
                L('  .'+k+' arr len='+v.length);
                if (k === 'aebi') { for (var i=0;i<v.length;i++) L('    ['+i+'] len='+(Array.isArray(v[i])?v[i].length:typeof v[i])); }
                if (k === 'cp') { for (var i=0;i<v.length;i++) { if(v[i]===undefined)L('    cp['+i+']=undef');else L('    cp['+i+']='+typeof v[i]+' '+String(v[i]).substring(0,50)); } }
            }
            else L('  .'+k+' '+typeof v+'='+String(v).substring(0,40));
        }
    });
}

try {
    if (input.inline_script) {
        vm.runInContext(input.inline_script, sandbox, { filename: 'inline.js' });
    }
    dumpTs('$_ts after inline', sandbox.$_ts);

    // Hook execScript: intercept, log, then use vm.runInContext to execute
    var layer2Code = null;
    var origExecScript = sandbox.execScript;
    sandbox.execScript = function(code) {
        L('execScript called, codeLen=' + (code ? code.length : 0));
        layer2Code = code;
        dumpTs('$_ts before Layer2', sandbox.$_ts);
        // Use vm.runInContext to eval in the sandbox context
        return vm.runInContext(code, sandbox, { filename: 'layer2.js' });
    };
    // Also update window.execScript
    sandbox.window.execScript = sandbox.execScript;

    if (input.js_content) {
        vm.runInContext(input.js_content, sandbox, { filename: 'vm.js' });
    }
    dumpTs('$_ts after external JS', sandbox.$_ts);

    if (input.trigger_call) {
        vm.runInContext(input.trigger_call, sandbox, { filename: 'trigger.js' });
    }
    dumpTs('$_ts FINAL', sandbox.$_ts);

    if (sandbox.__capturedCookie) {
        var parts = sandbox.__capturedCookie.split('=', 2);
        var val = parts[1];
        var dots = val.split('.');
        L('Cookie: ' + val.length + ' chars, ' + dots.length + ' parts');
        for (var i = 0; i < dots.length; i++) {
            L('  Part['+i+'] len='+dots[i].length+' start='+dots[i].substring(0,8)+' end='+dots[i].substring(Math.max(0,dots[i].length-8)));
        }
        process.stdout.write(sandbox.__capturedCookie);
    } else {
        L('NO COOKIE CAPTURED');
    }

    if (layer2Code) {
        var p = path.join(__dirname, '..', 'layer2_code.js');
        fs.writeFileSync(p, layer2Code);
        L('Layer2 saved: ' + p + ' (' + layer2Code.length + ' bytes)');
    }

    fs.writeFileSync(path.join(__dirname, '..', 'diag_output.txt'), diag.join('\n'));

} catch (e) {
    process.stderr.write('[ERROR] ' + e.message + '\n');
    if (e.stack) process.stderr.write(e.stack.split('\n').slice(0, 8).join('\n') + '\n');
    if (sandbox.__capturedCookie) process.stdout.write(sandbox.__capturedCookie);
}

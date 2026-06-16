/**
 * Extract $_ts.scj (string table) and $_ts.aebi (bytecodes) after Layer 1
 */
var fs = require('fs');
var vm = require('vm');
var path = require('path');

var _origOuterToString = Function.prototype.toString;
var _outerNatKey = '__natName';
Function.prototype.toString = function() {
    if (this[_outerNatKey]) return 'function ' + this[_outerNatKey] + '() { [native code] }';
    return _origOuterToString.call(this);
};
Function.prototype.toString[_outerNatKey] = 'toString';

var setupEnv = require(path.join(__dirname, 'env.js'));

var inputPath = path.join(__dirname, '_test_input.json');
var input = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

var sandbox = {};
['Uint8Array','Uint8ClampedArray','Int8Array','Int16Array','Int32Array',
'Uint16Array','Uint32Array','Float32Array','Float64Array','ArrayBuffer','DataView',
'Map','Set','WeakMap','WeakSet','Symbol','Proxy','Reflect','Promise'].forEach(function(n){sandbox[n]=global[n];});
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

// Don't use execScript hook - just capture after Layer 1
var _sandboxRef = sandbox;
var _vmModule = vm;
sandbox.execScript = function(code) {
    // Just execute - don't save cp
    return _vmModule.runInContext(code, _sandboxRef, { filename: 'https://www.jscq.com.cn/layer2.js' });
};
sandbox.window.execScript = sandbox.execScript;

if (input.o_cookie_name && input.o_cookie_value) {
    sandbox.__allCookies.push(input.o_cookie_name + '=' + input.o_cookie_value);
}

// Execute inline script
vm.runInContext(input.inline_script, sandbox, { filename: 'https://www.jscq.com.cn/page.html' });

// Execute Layer 1
vm.runInContext(input.js_content, sandbox, { filename: 'https://www.jscq.com.cn/RkdMxdIZoj2i.bc4278d.js' });

// Now examine $_ts
var tsInfo = vm.runInContext('(function(){' +
    'var ts = $_ts;' +
    'var result = {};' +
    'result.hasScj = !!ts.scj;' +
    'result.hasAebi = !!ts.aebi;' +
    'result.hasCp = !!ts.cp;' +
    'result.cpLen = ts.cp ? ts.cp.length : 0;' +
    'if (ts.scj) { result.scjType = typeof ts.scj; result.scjIsArray = Array.isArray(ts.scj); result.scjLen = ts.scj.length; }' +
    'if (ts.aebi) { result.aebiType = typeof ts.aebi; result.aebiIsArray = Array.isArray(ts.aebi); result.aebiLen = ts.aebi.length; }' +
    'result.tsKeys = Object.keys(ts);' +
    'return result;' +
'})()', sandbox);

console.log('$_ts info:', JSON.stringify(tsInfo, null, 2));

// Extract and analyze string table
if (sandbox.$_ts && sandbox.$_ts.scj) {
    var scj = sandbox.$_ts.scj;
    console.log('\nString table (scj) length:', scj.length);
    console.log('First 10 entries:', JSON.stringify(scj.slice(0, 10)));

    // Find interesting strings
    var interesting = [];
    scj.forEach(function(s, i) {
        if (typeof s !== 'string') return;
        var lower = s.toLowerCase();
        if (lower.indexOf('tostring') >= 0 || lower.indexOf('stack') >= 0 ||
            lower.indexOf('error') >= 0 || lower.indexOf('eval') >= 0 ||
            lower.indexOf('native') >= 0 || lower.indexOf('prototype') >= 0 ||
            lower.indexOf('constructor') >= 0 || lower.indexOf('instanceof') >= 0 ||
            lower.indexOf('typeof') >= 0 || lower.indexOf('global') >= 0 ||
            lower.indexOf('process') >= 0 || lower.indexOf('module') >= 0 ||
            lower.indexOf('require') >= 0 || lower.indexOf('buffer') >= 0 ||
            lower.indexOf('electron') >= 0 || lower.indexOf('phantom') >= 0 ||
            lower.indexOf('selenium') >= 0 || lower.indexOf('webdriver') >= 0 ||
            lower.indexOf('headless') >= 0 || lower.indexOf('node') >= 0 ||
            lower.indexOf('chrome') >= 0 || lower.indexOf('call') >= 0 ||
            lower.indexOf('apply') >= 0 || lower.indexOf('bind') >= 0 ||
            lower.indexOf('proxy') >= 0 || lower.indexOf('hasown') >= 0 ||
            lower.indexOf('debugger') >= 0 || lower.indexOf('machine') >= 0 ||
            lower.indexOf('window') >= 0 || lower.indexOf('document') >= 0 ||
            lower.indexOf('navigator') >= 0 || lower.indexOf('cookie') >= 0 ||
            lower.indexOf('useragent') >= 0 || lower.indexOf('platform') >= 0 ||
            lower.indexOf('function') >= 0 || lower.indexOf('reflect') >= 0) {
            interesting.push(i + ': ' + JSON.stringify(s).substring(0, 120));
        }
    });
    console.log('\nDetection-related strings (' + interesting.length + '):');
    interesting.forEach(function(s) { console.log('  ' + s); });

    // Also check cp values
    if (sandbox.$_ts.cp) {
        console.log('\ncp array:');
        sandbox.$_ts.cp.forEach(function(v, i) {
            var str = String(v);
            console.log('  cp[' + i + ']: ' + (str.length > 80 ? str.substring(0, 80) + '...' : str));
        });
    }
}

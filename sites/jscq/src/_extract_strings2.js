/**
 * Hook execScript to capture $_ts state at Layer 2 execution time
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

// Hook execScript
var _sandboxRef = sandbox;
var _vmModule = vm;
sandbox.execScript = function(code) {
    process.stderr.write('[EXEC] Code length: ' + code.length + '\n');

    // Check $_ts state at this point
    var tsState = vm.runInContext('(function(){' +
        'var ts = $_ts || {};' +
        'return JSON.stringify({' +
        '  keys: Object.keys(ts),' +
        '  hasScj: !!ts.scj,' +
        '  hasAebi: !!ts.aebi,' +
        '  hasCp: !!ts.cp,' +
        '  cpLen: ts.cp ? ts.cp.length : 0,' +
        '  scjLen: ts.scj ? ts.scj.length : 0,' +
        '  aebiLen: ts.aebi ? ts.aebi.length : 0' +
        '});' +
    '})()', _sandboxRef);
    process.stderr.write('[EXEC] $_ts state: ' + tsState + '\n');

    // Check what scj contains
    if (sandbox.$_ts && sandbox.$_ts.scj) {
        var scj = sandbox.$_ts.scj;
        process.stderr.write('[EXEC] scj is array: ' + Array.isArray(scj) + ', length: ' + scj.length + '\n');
        if (scj.length > 0) {
            // Show first few entries
            process.stderr.write('[EXEC] scj[0..5]: ' + JSON.stringify(scj.slice(0, 6)) + '\n');
        }
        // Search for detection strings
        var detection = [];
        scj.forEach(function(s, i) {
            if (typeof s !== 'string') return;
            var lower = s.toLowerCase();
            if (lower.indexOf('tostring') >= 0 || lower.indexOf('stack') >= 0 ||
                lower.indexOf('eval') >= 0 || lower.indexOf('native') >= 0 ||
                lower.indexOf('typeof') >= 0 || lower.indexOf('instanceof') >= 0 ||
                lower.indexOf('prototype') >= 0 || lower.indexOf('constructor') >= 0 ||
                lower.indexOf('global') >= 0 || lower.indexOf('process') >= 0 ||
                lower.indexOf('module') >= 0 || lower.indexOf('require') >= 0 ||
                lower.indexOf('electron') >= 0 || lower.indexOf('node') >= 0 ||
                lower.indexOf('chrome') >= 0 || lower.indexOf('debugger') >= 0 ||
                lower.indexOf('window') >= 0 || lower.indexOf('document') >= 0 ||
                lower.indexOf('navigator') >= 0 || lower.indexOf('cookie') >= 0 ||
                lower.indexOf('proxy') >= 0 || lower.indexOf('reflect') >= 0 ||
                lower.indexOf('hasown') >= 0 || lower.indexOf('function') >= 0 ||
                lower.indexOf('call') >= 0 || lower.indexOf('apply') >= 0 ||
                lower.indexOf('machine') >= 0 || lower.indexOf('context') >= 0 ||
                lower.indexOf('buffer') >= 0 || lower.indexOf('headless') >= 0 ||
                lower.indexOf('webdriver') >= 0 || lower.indexOf('selenium') >= 0 ||
                lower.indexOf('phantom') >= 0 || lower.indexOf('env') >= 0 ||
                lower.indexOf('fingerprint') >= 0 || lower.indexOf('detect') >= 0) {
                detection.push(i + ': ' + JSON.stringify(s).substring(0, 100));
            }
        });
        process.stderr.write('\n[STRINGS] Detection-related (' + detection.length + '):\n');
        detection.forEach(function(s) { process.stderr.write('  ' + s + '\n'); });

        // Save string table to file
        fs.writeFileSync(path.join(__dirname, '_scj_strings.json'), JSON.stringify(scj, null, 2));
        process.stderr.write('\n[STRINGS] Full table saved to _scj_strings.json (' + scj.length + ' entries)\n');
    }

    // Execute Layer 2
    return _vmModule.runInContext(code, _sandboxRef, { filename: 'https://www.jscq.com.cn/layer2.js' });
};
sandbox.window.execScript = sandbox.execScript;

if (input.o_cookie_name && input.o_cookie_value) {
    sandbox.__allCookies.push(input.o_cookie_name + '=' + input.o_cookie_value);
}

// Execute
vm.runInContext(input.inline_script, sandbox, { filename: 'https://www.jscq.com.cn/page.html' });
vm.runInContext(input.js_content, sandbox, { filename: 'https://www.jscq.com.cn/RkdMxdIZoj2i.bc4278d.js' });

// Check $_ts after everything
var afterState = vm.runInContext('(function(){' +
    'var ts = $_ts || {};' +
    'return JSON.stringify({' +
    '  keys: Object.keys(ts),' +
    '  hasCp: !!ts.cp,' +
    '  cpLen: ts.cp ? ts.cp.length : 0' +
    '});' +
'})()', sandbox);
process.stderr.write('\n[AFTER] ' + afterState + '\n');

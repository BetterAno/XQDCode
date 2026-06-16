var vm = require('vm');
var path = require('path');
var fs = require('fs');
var _origOuterToString = Function.prototype.toString;
var _outerNatKey = '__natName';
Function.prototype.toString = function() {
    if (this[_outerNatKey]) return 'function ' + this[_outerNatKey] + '() { [native code] }';
    return _origOuterToString.call(this);
};
Function.prototype.toString[_outerNatKey] = 'toString';
var setupEnv = require(path.join(__dirname, 'env.js'));
var input = JSON.parse(fs.readFileSync(path.join(__dirname, '_test_input.json'), 'utf-8'));

var sandbox = {};
['Uint8Array','Map','Set','Symbol','Proxy','Reflect','Promise','ArrayBuffer',
'Int8Array','Int16Array','Int32Array','Uint16Array','Uint32Array',
'Float32Array','Float64Array','DataView','WeakMap','WeakSet',
'Uint8ClampedArray'].forEach(function(n){sandbox[n]=global[n];});
vm.createContext(sandbox);
delete sandbox.__dirname; delete sandbox.__filename; delete sandbox.require;
delete sandbox.module; delete sandbox.exports; delete sandbox.global;
delete sandbox.process; delete sandbox.Buffer;

setupEnv(sandbox, {url:input.url, meta_content:input.meta_content, meta_id:input.meta_id||'', js_url:input.js_url, inline_script_text:input.inline_script||''});

// NO eval override - use default vm eval!
// NO Function override either - use default vm Function!
// Only add structuredClone which is missing
sandbox.structuredClone = function(obj) { return JSON.parse(JSON.stringify(obj)); };

if (input.o_cookie_name && input.o_cookie_value) sandbox.__allCookies.push(input.o_cookie_name+'='+input.o_cookie_value);

// Execute inline script
vm.runInContext(input.inline_script, sandbox, {filename:'https://www.jscq.com.cn/page.html'});

// Check $_ts
if (!sandbox.$_ts || !sandbox.$_ts.cd) {
    process.stderr.write('[ERROR] $_ts.cd not set\n');
    process.exit(1);
}

// Execute Layer 1
vm.runInContext(input.js_content, sandbox, {filename:'https://www.jscq.com.cn/3of0EhpccaFM/RkdMxdIZoj2i.bc4278d.js'});

// Check result
var captured = sandbox.__capturedCookie;
if (captured) {
    process.stderr.write('[OK] Cookie captured: ' + captured.length + ' chars\n');
    // Parse cookie value
    var match = captured.match(/jDwkDWjIm6GRP=(.+)/);
    if (match) {
        var val = match[1];
        process.stderr.write('Cookie value length: ' + val.length + ' chars\n');
        var parts = val.split('.');
        process.stderr.write('Parts: ' + parts.length + '\n');
        parts.forEach(function(p,i){process.stderr.write('  Part '+i+': '+p.length+' chars\n');});
    }
    process.stdout.write(JSON.stringify({pcookie: captured, all: sandbox.__allCookies.filter(function(c){return !c.startsWith('jDwkDWjIm6GRO');})}));
} else {
    process.stderr.write('[WARN] No cookie captured\n');
    process.stderr.write('All cookies: ' + JSON.stringify(sandbox.__allCookies) + '\n');
}

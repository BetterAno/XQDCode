/**
 * Deep analysis of $_ts state and cookie generation flow
 * Track $_ts properties at each stage and find what's different
 */
var fs = require('fs');
var vm = require('vm');
var path = require('path');
var https = require('https');
var setupEnv = require(path.join(__dirname, 'env.js'));

function download(url) {
    return new Promise(function (resolve, reject) {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, function (res) {
            var data = '';
            res.on('data', function (c) { data += c; });
            res.on('end', function () { resolve(data); });
        }).on('error', reject);
    });
}

function dumpTs(ts, label) {
    console.log('\n===== $_ts after ' + label + ' =====');
    if (!ts) { console.log('  $_ts is undefined!'); return; }
    var keys = Object.keys(ts);
    console.log('  keys:', keys.join(', '));
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var v = ts[k];
        if (typeof v === 'function') {
            console.log('  $_ts.' + k + ' = [function] length=' + v.length);
        } else if (typeof v === 'string') {
            console.log('  $_ts.' + k + ' = "' + v.substring(0, 80) + '" (len=' + v.length + ')');
        } else if (typeof v === 'number') {
            console.log('  $_ts.' + k + ' = ' + v);
        } else if (typeof v === 'boolean') {
            console.log('  $_ts.' + k + ' = ' + v);
        } else if (v && typeof v === 'object' && v.length !== undefined) {
            console.log('  $_ts.' + k + ' = [array] length=' + v.length + ' sample=' + JSON.stringify(v.slice(0, 5)));
        } else if (v && typeof v === 'object') {
            console.log('  $_ts.' + k + ' = [object] keys=' + Object.keys(v).slice(0, 10).join(','));
        } else {
            console.log('  $_ts.' + k + ' = ' + typeof v + ' ' + v);
        }
    }
}

function main() {
    var html = fs.readFileSync(path.join(__dirname, '..', 'assets', '412_response.html'), 'utf-8');
    var metaMatch = html.match(/content="([a-zA-Z0-9_.\/\-+=]{50,})"/);
    var metaContent = metaMatch[1];
    var metaIdMatch = html.match(/id="([^"]+)"/);
    var metaId = metaIdMatch[1];

    var re = /<script[^>]*>([\s\S]*?)<\/script>/g;
    var m, inlineScript = '', triggerCall = '';
    while ((m = re.exec(html)) !== null) {
        var s = m[1].trim();
        if (s.indexOf('$_ts') >= 0 && s.length > 50) inlineScript = s;
        if (s.match(/^_\$\w+\(\)/) && s.length < 20) triggerCall = s.replace(/;$/, '');
    }
    var jsMatch = html.match(/src="(\/[^"]+\.js)"/);
    var jsUrl = 'https://www.jscq.com.cn' + jsMatch[1];

    download(jsUrl).then(function (jsContent) {
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
            url: 'https://www.jscq.com.cn/jscq/cqjy/jygg/cqzr/index.shtml',
            meta_content: metaContent,
            meta_id: metaId,
            js_url: jsUrl,
            inline_script_text: inlineScript,
        });
        if (!sandbox.execScript) sandbox.execScript = sandbox.eval;

        // Phase 1: After inline script
        vm.runInContext(inlineScript, sandbox, { filename: 'inline.js' });
        dumpTs(sandbox.$_ts, 'inline script');

        // Phase 2: After VM code - hook cookie setter to track timing
        var cookiePhases = [];
        var origCookieDesc = Object.getOwnPropertyDescriptor(sandbox.document, 'cookie');
        Object.defineProperty(sandbox.document, 'cookie', {
            get: function () { return sandbox.__allCookies.join('; '); },
            set: function (val) {
                var cookiePart = String(val).split(';')[0];
                sandbox.__allCookies.push(cookiePart);
                var eqIdx = cookiePart.indexOf('=');
                var name = eqIdx !== -1 ? cookiePart.substring(0, eqIdx) : '';
                var value = eqIdx !== -1 ? cookiePart.substring(eqIdx + 1) : '';
                cookiePhases.push({ name: name, valueLen: value.length });
                if (value.length > 100) {
                    sandbox.__capturedCookie = cookiePart;
                }
            },
            configurable: true,
            enumerable: true,
        });

        vm.runInContext(jsContent, sandbox, { filename: 'vm.js' });
        dumpTs(sandbox.$_ts, 'VM code');

        // Phase 3: After trigger
        if (triggerCall) {
            vm.runInContext(triggerCall, sandbox, { filename: 'trigger.js' });
            dumpTs(sandbox.$_ts, 'trigger');
        }

        console.log('\n===== COOKIE PHASES =====');
        for (var i = 0; i < cookiePhases.length; i++) {
            var cp = cookiePhases[i];
            console.log('  Phase ' + (i + 1) + ': ' + cp.name + ' len=' + cp.valueLen);
        }

        console.log('\n===== FINAL COOKIES =====');
        for (var i = 0; i < sandbox.__allCookies.length; i++) {
            var c = sandbox.__allCookies[i];
            var eq = c.indexOf('=');
            console.log('  ' + c.substring(0, eq) + ' = ' + c.substring(eq + 1).length + ' chars');
        }

        // Check what functions $_ts.l__ and other functions do
        if (sandbox.$_ts && sandbox.$_ts.l__) {
            try {
                var fnStr = sandbox.$_ts.l__.toString();
                console.log('\n$_ts.l__ source (first 200 chars):');
                console.log('  ' + fnStr.substring(0, 200));
            } catch (e) {}
        }

        // Check if there are any global functions created by the VM
        var globalFuncs = [];
        for (var k in sandbox) {
            if (typeof sandbox[k] === 'function' && k.charAt(0) === '_' && k.charAt(1) === '$') {
                globalFuncs.push(k);
            }
        }
        console.log('\nGlobal _$ functions:', globalFuncs.join(', '));
    });
}

main();

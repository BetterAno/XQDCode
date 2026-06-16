/**
 * Detailed VM analysis - hook cookie setter to trace encoding
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
        setupEnv(sandbox, {
            url: 'https://www.jscq.com.cn/jscq/cqjy/jygg/cqzr/index.shtml',
            meta_content: metaContent,
            meta_id: metaId,
            js_url: jsUrl,
            inline_script_text: inlineScript,
        });
        if (!sandbox.execScript) sandbox.execScript = sandbox.eval;

        try {
            // Execute inline script
            vm.runInContext(inlineScript, sandbox, { filename: 'inline.js' });

            // Re-hook cookie setter with detailed logging
            var cookieLog = [];
            var origCookieDesc = Object.getOwnPropertyDescriptor(sandbox.document, 'cookie');
            Object.defineProperty(sandbox.document, 'cookie', {
                get: function () { return sandbox.__allCookies.join('; '); },
                set: function (val) {
                    var cookiePart = String(val).split(';')[0];
                    sandbox.__allCookies.push(cookiePart);
                    var eqIdx = cookiePart.indexOf('=');
                    if (eqIdx !== -1) {
                        var name = cookiePart.substring(0, eqIdx);
                        var value = cookiePart.substring(eqIdx + 1);
                        cookieLog.push({
                            name: name,
                            valueLen: value.length,
                            valueStart: value.substring(0, 50),
                            dots: (value.match(/\./g) || []).length,
                            full: cookiePart.substring(0, 100),
                        });
                    }
                    if (eqIdx !== -1 && cookiePart.substring(eqIdx + 1).length > 100) {
                        sandbox.__capturedCookie = cookiePart;
                    }
                },
                configurable: true,
                enumerable: true,
            });

            // Execute VM code
            vm.runInContext(jsContent, sandbox, { filename: 'vm.js' });

            // Execute trigger
            if (triggerCall) {
                vm.runInContext(triggerCall, sandbox, { filename: 'trigger.js' });
            }
        } catch (e) {
            console.log('[ERROR]', e.message);
        }

        // Print cookie log
        console.log('\n===== COOKIE LOG =====');
        for (var i = 0; i < cookieLog.length; i++) {
            var cl = cookieLog[i];
            console.log('Cookie #' + (i + 1) + ': ' + cl.name + ' len=' + cl.valueLen + ' dots=' + cl.dots);
            console.log('  start: ' + cl.valueStart);
            console.log('  full:  ' + cl.full);
        }

        // Check $_ts final state
        var ts = sandbox['$_ts'] || {};
        console.log('\n$_ts keys:', Object.keys(ts).join(', '));
        Object.keys(ts).forEach(function (k) {
            var v = ts[k];
            if (typeof v === 'function') {
                console.log('  $_ts.' + k + ' = [function]');
            } else if (typeof v === 'string') {
                console.log('  $_ts.' + k + ' = "' + v.substring(0, 60) + '" (len=' + v.length + ')');
            } else if (typeof v === 'number') {
                console.log('  $_ts.' + k + ' = ' + v);
            } else if (typeof v === 'object' && v !== null) {
                console.log('  $_ts.' + k + ' = [object] keys=' + Object.keys(v).slice(0, 5).join(','));
            } else {
                console.log('  $_ts.' + k + ' = ' + typeof v + ' ' + v);
            }
        });

        // Check if there were any errors
        console.log('\n__allCookies count:', sandbox.__allCookies.length);
        for (var i = 0; i < sandbox.__allCookies.length; i++) {
            var c = sandbox.__allCookies[i];
            var eq = c.indexOf('=');
            console.log('  ' + c.substring(0, eq) + ' = ' + c.substring(eq + 1).length + ' chars');
        }
    });
}

main();

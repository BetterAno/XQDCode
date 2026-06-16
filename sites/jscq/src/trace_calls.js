/**
 * Trace browser API calls during Ruishu cookie generation
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

    // Parse meta
    var metaMatch = html.match(/content="([a-zA-Z0-9_.\/\-+=]{50,})"/);
    var metaContent = metaMatch ? metaMatch[1] : '';
    var metaIdMatch = html.match(/id="([^"]+)"/);
    var metaId = metaIdMatch ? metaIdMatch[1] : '';

    // Parse inline script
    var re = /<script[^>]*>([\s\S]*?)<\/script>/g;
    var m, inlineScript = '', jsUrl = '', triggerCall = '';
    while ((m = re.exec(html)) !== null) {
        var s = m[1].trim();
        if (s.indexOf('$_ts') >= 0 && s.length > 50) inlineScript = s;
        if (s.match(/^_\$\w+\(\)/) && s.length < 20) triggerCall = s.replace(/;$/, '');
    }

    // Parse JS URL
    var jsMatch = html.match(/src="(\/[^"]+\.js)"/);
    jsUrl = 'https://www.jscq.com.cn' + (jsMatch ? jsMatch[1] : '');

    console.log('[INFO] meta_id:', metaId);
    console.log('[INFO] inline len:', inlineScript.length);
    console.log('[INFO] js_url:', jsUrl);
    console.log('[INFO] trigger:', triggerCall);

    download(jsUrl).then(function (jsContent) {
        console.log('[INFO] JS len:', jsContent.length);

        // Create sandbox
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
            inline_script_text: '',
        });

        // ===== INSTRUMENTATION =====
        var accessLog = [];
        var origGetElementById = sandbox.document.getElementById;
        sandbox.document.getElementById = function (id) {
            var el = origGetElementById.call(sandbox.document, id);
            accessLog.push('getElementById(' + id + ') => ' + (el ? el.tagName || 'element' : 'null'));
            return el;
        };

        var origCreateElement = sandbox.document.createElement;
        sandbox.document.createElement = function (tag) {
            var el = origCreateElement.call(sandbox.document, tag);
            accessLog.push('createElement(' + tag + ')');
            return el;
        };

        var origGetByTag = sandbox.document.getElementsByTagName;
        sandbox.document.getElementsByTagName = function (tag) {
            var result = origGetByTag.call(sandbox.document, tag);
            accessLog.push('getElementsByTagName(' + tag + ') => len=' + (result ? result.length : 0));
            return result;
        };

        // Track document.cookie setter calls
        var cookieCount = 0;
        var origCookieDesc = Object.getOwnPropertyDescriptor(sandbox.document, 'cookie');
        if (origCookieDesc) {
            Object.defineProperty(sandbox.document, 'cookie', {
                get: function () { return origCookieDesc.get.call(sandbox.document); },
                set: function (v) {
                    cookieCount++;
                    accessLog.push('cookie.set #' + cookieCount + ': ' + v.substring(0, 80) + (v.length > 80 ? '...' : ''));
                    return origCookieDesc.set.call(sandbox.document, v);
                },
                configurable: true,
                enumerable: true,
            });
        }

        try {
            // Execute inline script
            vm.runInContext(inlineScript, sandbox, { filename: 'inline_script.js' });
            console.log('[OK] $_ts.cd set:', !!sandbox.$_ts.cd);

            // Execute VM code
            vm.runInContext(jsContent, sandbox, { filename: 'ruishu6.js' });
            console.log('[OK] VM code executed');

            // Execute trigger
            if (triggerCall) {
                vm.runInContext(triggerCall, sandbox, { filename: 'trigger.js' });
                console.log('[OK] Trigger executed:', triggerCall);
            }

        } catch (e) {
            console.log('[ERROR]', e.message);
        }

        // Print results
        console.log('\n===== ACCESS LOG =====');
        for (var i = 0; i < accessLog.length; i++) {
            console.log(accessLog[i]);
        }

        console.log('\n===== RESULTS =====');
        console.log('Cookie count:', sandbox.__allCookies ? sandbox.__allCookies.length : 0);
        if (sandbox.__allCookies) {
            for (var i = 0; i < sandbox.__allCookies.length; i++) {
                var c = sandbox.__allCookies[i];
                var eq = c.indexOf('=');
                console.log('  Cookie[' + i + ']: ' + c.substring(0, eq) + ' len=' + c.substring(eq + 1).length);
            }
        }

        // Check $_ts state
        var tsKeys = Object.keys(sandbox.$_ts || {});
        console.log('$_ts keys:', JSON.stringify(tsKeys));
        if (sandbox.$_ts) {
            for (var k = 0; k < tsKeys.length; k++) {
                var v = sandbox.$_ts[tsKeys[k]];
                if (typeof v === 'string') {
                    console.log('  $_ts.' + tsKeys[k] + ' = "' + (v.length > 50 ? v.substring(0, 50) + '...' : v) + '" (len=' + v.length + ')');
                } else if (typeof v === 'number') {
                    console.log('  $_ts.' + tsKeys[k] + ' = ' + v);
                } else if (typeof v === 'function') {
                    console.log('  $_ts.' + tsKeys[k] + ' = [function]');
                } else if (typeof v === 'object' && v !== null) {
                    console.log('  $_ts.' + tsKeys[k] + ' = [object] keys=' + JSON.stringify(Object.keys(v).slice(0, 10)));
                } else {
                    console.log('  $_ts.' + tsKeys[k] + ' = ' + typeof v);
                }
            }
        }
    });
}

main();

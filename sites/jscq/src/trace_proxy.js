/**
 * Deep Proxy trace - wrap sandbox objects to track ALL property access
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
    var metaContent = metaMatch ? metaMatch[1] : '';
    var metaIdMatch = html.match(/id="([^"]+)"/);
    var metaId = metaIdMatch ? metaIdMatch[1] : '';
    var re = /<script[^>]*>([\s\S]*?)<\/script>/g;
    var m, inlineScript = '', jsUrl = '', triggerCall = '';
    while ((m = re.exec(html)) !== null) {
        var s = m[1].trim();
        if (s.indexOf('$_ts') >= 0 && s.length > 50) inlineScript = s;
        if (s.match(/^_\$\w+\(\)/) && s.length < 20) triggerCall = s.replace(/;$/, '');
    }
    var jsMatch = html.match(/src="(\/[^"]+\.js)"/);
    jsUrl = 'https://www.jscq.com.cn' + (jsMatch ? jsMatch[1] : '');

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

        // After setupEnv, wrap window with Proxy to track reads
        var readLog = {};
        var readLogArr = [];
        var origWindow = sandbox.window;

        var windowProxy = new Proxy(origWindow, {
            get: function (target, prop, receiver) {
                var val = target[prop];
                if (typeof prop === 'string' && !prop.startsWith('__') && prop !== 'constructor') {
                    var key = 'window.' + prop;
                    if (!readLog[key]) {
                        readLog[key] = true;
                        var valStr;
                        if (val === undefined) valStr = 'undefined';
                        else if (val === null) valStr = 'null';
                        else if (typeof val === 'function') valStr = '[function]';
                        else if (typeof val === 'string') valStr = '"' + (val.length > 40 ? val.substring(0, 40) + '...' : val) + '"';
                        else if (typeof val === 'number') valStr = String(val);
                        else if (typeof val === 'boolean') valStr = String(val);
                        else if (typeof val === 'object') valStr = '[object ' + (val.constructor ? val.constructor.name : 'Object') + ']';
                        else valStr = typeof val;
                        readLogArr.push(key + ' = ' + valStr);
                    }
                }
                return val;
            }
        });

        // Replace window with proxy
        sandbox.window = windowProxy;
        // Also update the global window reference
        origWindow.window = windowProxy;

        try {
            vm.runInContext(inlineScript, sandbox, { filename: 'inline_script.js' });
            vm.runInContext(jsContent, sandbox, { filename: 'ruishu6.js' });
            if (triggerCall) vm.runInContext(triggerCall, sandbox, { filename: 'trigger.js' });
        } catch (e) {
            console.log('[ERROR]', e.message);
        }

        console.log('===== WINDOW PROPERTY READS =====');
        for (var i = 0; i < readLogArr.length; i++) {
            console.log(readLogArr[i]);
        }
        console.log('\nTotal unique reads:', readLogArr.length);

        console.log('\n===== COOKIE =====');
        if (sandbox.__allCookies) {
            for (var i = 0; i < sandbox.__allCookies.length; i++) {
                var c = sandbox.__allCookies[i];
                var eq = c.indexOf('=');
                console.log(c.substring(0, eq) + ' len=' + c.substring(eq + 1).length);
            }
        }
    });
}

main();

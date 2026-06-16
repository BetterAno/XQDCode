/**
 * Error tracking - catch all silent errors in Ruishu VM
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

        // Add global error tracking
        var errorLog = [];
        sandbox.__errorLog = errorLog;
        sandbox.Error = Error;

        // Wrap try-catch tracking by modifying the Error constructor
        sandbox.__trackError = function(e) {
            errorLog.push({
                message: e.message || String(e),
                type: e.constructor ? e.constructor.name : 'Error',
            });
        };

        // Modify the VM code to add try-catch logging
        // Wrap the entire code in a try-catch that logs errors
        var wrappedCode = jsContent;

        try {
            vm.runInContext(inlineScript, sandbox, { filename: 'inline.js' });

            // Add a hook to the vm code - track errors in the main loop
            // The VM uses try-catch internally. Let's add an error counter.
            var origError = sandbox.Error;
            var errorCount = 0;
            sandbox.Error = function(msg) {
                errorCount++;
                if (errorCount <= 20) {
                    errorLog.push('Error#' + errorCount + ': ' + (msg || 'unknown'));
                }
                return new origError(msg);
            };
            sandbox.Error.prototype = origError.prototype;
            sandbox.TypeError = TypeError;
            sandbox.RangeError = RangeError;
            sandbox.SyntaxError = SyntaxError;
            sandbox.ReferenceError = ReferenceError;

            vm.runInContext(wrappedCode, sandbox, { filename: 'vm.js' });

            if (triggerCall) {
                vm.runInContext(triggerCall, sandbox, { filename: 'trigger.js' });
            }
        } catch (e) {
            console.log('[OUTER ERROR]', e.message);
        }

        console.log('Errors caught:', errorLog.length);
        for (var i = 0; i < errorLog.length; i++) {
            console.log('  ' + errorLog[i]);
        }

        console.log('\nCookies:');
        for (var i = 0; i < sandbox.__allCookies.length; i++) {
            var c = sandbox.__allCookies[i];
            var eq = c.indexOf('=');
            console.log('  ' + c.substring(0, eq) + ' len=' + c.substring(eq + 1).length);
        }
    });
}

main();

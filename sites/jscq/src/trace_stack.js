/**
 * Detailed error tracking with stack traces
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

        // Track Error creation with stack traces
        var errorLog = [];
        var origError = Error;

        // Use prepareStackTrace to get structured stack
        var origPrepare = Error.prepareStackTrace;
        Error.prepareStackTrace = function(err, stack) {
            return stack;
        };

        sandbox.Error = function(msg) {
            var e = new origError(msg);
            var stack = e.stack;
            var frames = [];
            if (Array.isArray(stack)) {
                for (var i = 0; i < Math.min(3, stack.length); i++) {
                    frames.push(stack[i].getFileName() + ':' + stack[i].getLineNumber() + ':' + stack[i].getColumnNumber());
                }
            }
            errorLog.push({
                msg: msg || '(empty)',
                frames: frames,
            });
            return e;
        };
        sandbox.Error.prototype = origError.prototype;
        sandbox.TypeError = TypeError;
        sandbox.RangeError = RangeError;

        try {
            vm.runInContext(inlineScript, sandbox, { filename: 'inline.js' });
            vm.runInContext(jsContent, sandbox, { filename: 'vm.js' });
            if (triggerCall) vm.runInContext(triggerCall, sandbox, { filename: 'trigger.js' });
        } catch (e) {
            console.log('[OUTER ERROR]', e.message);
        }

        console.log('Error count:', errorLog.length);
        for (var i = 0; i < errorLog.length; i++) {
            var e = errorLog[i];
            console.log('Error#' + (i+1) + ': "' + e.msg + '"');
            for (var j = 0; j < e.frames.length; j++) {
                console.log('  at ' + e.frames[j]);
            }
        }

        console.log('\nCookie len:', sandbox.__allCookies.length > 1 ? sandbox.__allCookies[1].split('=')[1].length : 0);
    });
}

main();

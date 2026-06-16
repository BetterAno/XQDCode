/**
 * Track scj and aebi operations with Proxy
 * Also inject a modified Error that logs the first error's full context
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

        // Wrap $_ts with a setter that detects scj changes
        var scjOps = [];
        var origTs = sandbox.$_ts;
        var tsProxy = {};

        // Copy existing properties
        for (var k in origTs) {
            tsProxy[k] = origTs[k];
        }

        // Define getters/setters for scj
        Object.defineProperty(tsProxy, 'scj', {
            get: function() { return origTs.scj; },
            set: function(val) {
                scjOps.push({ op: 'set', type: typeof val, isArray: Array.isArray(val), len: Array.isArray(val) ? val.length : 0 });
                origTs.scj = val;
            },
            configurable: true, enumerable: true,
        });

        // If scj is an array, wrap it with a Proxy
        var scjArray = origTs.scj || [];
        var scjArrayProxy = new Proxy(scjArray, {
            set: function(target, prop, value) {
                scjOps.push({ op: 'push', prop: String(prop), valType: typeof value, valStr: String(value).substring(0, 50) });
                target[prop] = value;
                return true;
            },
            get: function(target, prop) {
                return target[prop];
            }
        });
        origTs.scj = scjArrayProxy;

        sandbox.$_ts = tsProxy;

        // Hook Error to capture the first few errors with full context
        var errorLog = [];
        var origError = Error;
        var origPrepare = Error.prepareStackTrace;
        Error.prepareStackTrace = function(err, stack) { return stack; };
        sandbox.Error = function(msg) {
            var e = new origError(msg);
            var stack = e.stack;
            var frames = [];
            if (Array.isArray(stack)) {
                for (var i = 0; i < Math.min(3, stack.length); i++) {
                    frames.push({
                        fn: stack[i].getFunctionName(),
                        file: stack[i].getFileName(),
                        line: stack[i].getLineNumber(),
                        col: stack[i].getColumnNumber(),
                    });
                }
            }
            errorLog.push({ msg: msg || '(empty)', frames: frames });
            return e;
        };
        sandbox.Error.prototype = origError.prototype;
        sandbox.Error.captureStackTrace = function(t) { t.stack = new origError().stack; };
        sandbox.TypeError = TypeError;
        sandbox.RangeError = RangeError;
        sandbox.SyntaxError = SyntaxError;
        sandbox.ReferenceError = ReferenceError;

        // Also track all property accesses on window/document that might be failing
        var failedAccesses = {};
        var origGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

        // Inject a monitoring wrapper that tracks when code reads undefined window properties
        // Use the vm code's own mechanism - look for property access patterns
        var monitorCode = [
            '(function() {',
            '  var origDefProp = Object.defineProperty;',
            '  var propReads = {};',
            '  window.__propReads = propReads;',
            '  // Track when properties are read from window via global variable access',
            '  // This is done through the Proxy on window (not possible in vm)',
            '  // Instead, we track toString calls on key objects',
            '  var origDocToString = document.toString;',
            '  document.toString = function() {',
            '    propReads["document.toString"] = (propReads["document.toString"] || 0) + 1;',
            '    return origDocToString.call(document);',
            '  };',
            '})();'
        ].join('\n');

        try {
            vm.runInContext(inlineScript, sandbox, { filename: 'inline.js' });

            // Re-apply scj tracking after inline script (might have overwritten $_ts)
            if (sandbox.$_ts && !sandbox.$_ts.scj) {
                // $_ts might have been overwritten, re-wrap
            }

            vm.runInContext(jsContent, sandbox, { filename: 'vm.js' });
            if (triggerCall) vm.runInContext(triggerCall, sandbox, { filename: 'trigger.js' });
        } catch (e) {
            console.log('[OUTER ERROR]', e.message);
            if (e.stack) console.log(e.stack.split('\n').slice(0, 5).join('\n'));
        }

        console.log('\n===== SCJ OPERATIONS =====');
        console.log('Operations:', scjOps.length);
        for (var i = 0; i < scjOps.length; i++) {
            console.log('  ' + JSON.stringify(scjOps[i]));
        }

        console.log('\n===== $_ts FINAL STATE =====');
        var ts = sandbox.$_ts;
        for (var k in ts) {
            var v = ts[k];
            if (k === 'scj') {
                if (Array.isArray(v)) {
                    console.log('  $_ts.scj = array length=' + v.length);
                } else {
                    console.log('  $_ts.scj = ' + typeof v + ' ' + String(v).substring(0, 50));
                }
            } else if (typeof v === 'function') {
                console.log('  $_ts.' + k + ' = [function]');
            } else {
                console.log('  $_ts.' + k + ' = ' + typeof v);
            }
        }

        console.log('\n===== ERRORS (' + errorLog.length + ') =====');
        for (var i = 0; i < Math.min(20, errorLog.length); i++) {
            var e = errorLog[i];
            console.log('Error#' + (i + 1) + ': "' + e.msg + '"');
            for (var j = 0; j < e.frames.length; j++) {
                var f = e.frames[j];
                console.log('  at ' + (f.fn || 'anon') + ' (' + f.file + ':' + f.line + ':' + f.col + ')');
            }
        }

        console.log('\n===== COOKIE =====');
        for (var i = 0; i < sandbox.__allCookies.length; i++) {
            var c = sandbox.__allCookies[i];
            var eq = c.indexOf('=');
            console.log('  ' + c.substring(0, eq) + ' = ' + c.substring(eq + 1).length + ' chars');
        }
    });
}

main();

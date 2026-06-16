/**
 * Deep execution monitor:
 * 1. Hook Error constructor to capture all error details
 * 2. Hook execScript/eval to capture dynamically executed code
 * 3. Hook all document/window method calls
 * 4. Track property accesses that fail
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

        // 1. Hook Error constructor
        var errorLog = [];
        var origError = Error;
        var origPrepare = Error.prepareStackTrace;
        Error.prepareStackTrace = function(err, stack) { return stack; };
        sandbox.Error = function(msg) {
            var e = new origError(msg);
            var stack = e.stack;
            var frames = [];
            if (Array.isArray(stack)) {
                for (var i = 0; i < Math.min(5, stack.length); i++) {
                    var fn = stack[i].getFileName();
                    var ln = stack[i].getLineNumber();
                    var col = stack[i].getColumnNumber();
                    var fname = stack[i].getFunctionName();
                    frames.push((fname || 'anon') + '@' + fn + ':' + ln + ':' + col);
                }
            }
            errorLog.push({ msg: msg || '(empty)', frames: frames });
            return e;
        };
        sandbox.Error.prototype = origError.prototype;
        sandbox.Error.captureStackTrace = function(target) {
            target.stack = new origError().stack;
        };
        sandbox.TypeError = TypeError;
        sandbox.RangeError = RangeError;
        sandbox.SyntaxError = SyntaxError;
        sandbox.ReferenceError = ReferenceError;

        // 2. Hook execScript/eval to capture second layer code
        var dynamicCode = [];
        var origExecScript = sandbox.execScript || sandbox.eval;
        var origEval2 = sandbox.eval;
        sandbox.eval = function(code) {
            if (typeof code === 'string' && code.length > 1000) {
                dynamicCode.push({
                    type: 'eval',
                    len: code.length,
                    start: code.substring(0, 200),
                    end: code.substring(code.length - 80),
                });
                // Save second layer code to file
                fs.writeFileSync(path.join(__dirname, '..', 'assets', 'ruishu6_layer2.js'), code);
                console.log('[INFO] Saved layer2 code to assets/ruishu6_layer2.js');
            }
            return origEval2(code);
        };
        sandbox.execScript = sandbox.eval;

        // 3. Hook document.createElement to track deeply what's accessed on elements
        var origCreateElement = sandbox.document.createElement;
        var elementAccessLog = [];
        sandbox.document.createElement = function(tag) {
            var el = origCreateElement(tag.toLowerCase());

            // Wrap element.style with detailed logging
            var origStyle = el.style;
            el.style = new Proxy(origStyle || {}, {
                get: function(target, prop) {
                    var val = target[prop];
                    if (val === undefined && typeof prop === 'string' && prop.indexOf('__') !== 0) {
                        elementAccessLog.push(tag + '-style.' + prop);
                    }
                    return val;
                },
                set: function(target, prop, value) {
                    target[prop] = value;
                    return true;
                }
            });

            return el;
        };

        // 4. Hook document.getElementById to track meta element access
        var origGetById = sandbox.document.getElementById;
        sandbox.document.getElementById = function(id) {
            var el = origGetById(id);
            if (el) {
                // Wrap meta element with Proxy
                return new Proxy(el, {
                    get: function(target, prop) {
                        var val = target[prop];
                        if (typeof prop === 'string' && prop.indexOf('__') !== 0) {
                            if (val === undefined) {
                                elementAccessLog.push('meta-undef.' + prop);
                            }
                        }
                        return val;
                    }
                });
            }
            return el;
        };

        // 5. Track Math operations (skip Proxy for Math - it's not an object)
        var mathOps = {};

        try {
            vm.runInContext(inlineScript, sandbox, { filename: 'inline.js' });
            vm.runInContext(jsContent, sandbox, { filename: 'vm.js' });
            if (triggerCall) vm.runInContext(triggerCall, sandbox, { filename: 'trigger.js' });
        } catch (e) {
            console.log('[OUTER ERROR]', e.message);
            console.log(e.stack);
        }

        // Results
        console.log('\n===== ERRORS (' + errorLog.length + ') =====');
        for (var i = 0; i < errorLog.length; i++) {
            var e = errorLog[i];
            console.log('Error#' + (i + 1) + ': "' + e.msg + '"');
            for (var j = 0; j < e.frames.length; j++) {
                console.log('  ' + e.frames[j]);
            }
        }

        console.log('\n===== DYNAMIC CODE EXECUTED (' + dynamicCode.length + ') =====');
        for (var i = 0; i < dynamicCode.length; i++) {
            var dc = dynamicCode[i];
            console.log('Code#' + (i + 1) + ' (' + dc.type + ') len=' + dc.len);
            console.log('  start: ' + dc.start);
            if (dc.len > 150) console.log('  end: ' + dc.end);
        }

        console.log('\n===== ELEMENT STYLE ACCESSES (undefined) =====');
        var uniqueAccesses = {};
        for (var i = 0; i < elementAccessLog.length; i++) {
            var a = elementAccessLog[i];
            if (!uniqueAccesses[a]) uniqueAccesses[a] = 0;
            uniqueAccesses[a]++;
        }
        var sorted = Object.keys(uniqueAccesses).sort(function(a, b) {
            return uniqueAccesses[b] - uniqueAccesses[a];
        });
        for (var i = 0; i < sorted.length; i++) {
            console.log('  ' + sorted[i] + ' (' + uniqueAccesses[sorted[i]] + 'x)');
        }

        console.log('\n===== MATH OPERATIONS =====');
        var mathKeys = Object.keys(mathOps).sort(function(a, b) {
            return mathOps[b] - mathOps[a];
        });
        for (var i = 0; i < Math.min(20, mathKeys.length); i++) {
            console.log('  ' + mathKeys[i] + ' (' + mathOps[mathKeys[i]] + 'x)');
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

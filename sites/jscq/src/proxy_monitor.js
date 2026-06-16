/**
 * Proxy-based property access monitor
 * Wraps key objects with Proxy to find all property accesses that return undefined
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

        // Clean Node.js globals
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

        // Track undefined property accesses
        var undefinedAccesses = {};
        var functionCalls = {};

        function logUndefined(objName, propName) {
            var key = objName + '.' + propName;
            if (!undefinedAccesses[key]) {
                undefinedAccesses[key] = 1;
            } else {
                undefinedAccesses[key]++;
            }
        }

        function logCall(objName, propName, result) {
            var key = objName + '.' + propName;
            var resultType = result === undefined ? 'undefined' : result === null ? 'null' : typeof result;
            if (!functionCalls[key]) {
                functionCalls[key] = { count: 0, resultTypes: {} };
            }
            functionCalls[key].count++;
            if (!functionCalls[key].resultTypes[resultType]) {
                functionCalls[key].resultTypes[resultType] = 0;
            }
            functionCalls[key].resultTypes[resultType]++;
        }

        // Wrap document.createElement to monitor created elements
        var origCreateElement = sandbox.document.createElement;
        var createElementCalls = [];
        sandbox.document.createElement = function(tag) {
            var el = origCreateElement(tag.toLowerCase());
            createElementCalls.push(tag.toLowerCase());

            // Wrap the element with a Proxy
            var handler = {
                get: function(target, prop) {
                    var val = target[prop];
                    if (val === undefined && typeof prop === 'string' && prop !== '__proxyTarget' && prop.indexOf('__') !== 0) {
                        logUndefined(tag + '-el', prop);
                    }
                    return val;
                }
            };
            try {
                return new Proxy(el, handler);
            } catch(e) {
                return el;
            }
        };

        // Wrap document.getElementById
        var origGetElementById = sandbox.document.getElementById;
        sandbox.document.getElementById = function(id) {
            var el = origGetElementById(id);
            if (el) {
                var handler = {
                    get: function(target, prop) {
                        var val = target[prop];
                        if (val === undefined && typeof prop === 'string' && prop !== '__proxyTarget' && prop.indexOf('__') !== 0) {
                            logUndefined('getElementById(' + id + ')', prop);
                        }
                        return val;
                    }
                };
                try {
                    return new Proxy(el, handler);
                } catch(e) {
                    return el;
                }
            }
            return el;
        };

        // Wrap document.getElementsByTagName
        var origGetElementsByTagName = sandbox.document.getElementsByTagName;
        sandbox.document.getElementsByTagName = function(tag) {
            var result = origGetElementsByTagName(tag);
            logCall('document', 'getElementsByTagName("' + tag + '")', result);
            return result;
        };

        // Wrap navigator with Proxy
        var navHandler = {
            get: function(target, prop) {
                var val = target[prop];
                if (val === undefined && typeof prop === 'string' && prop.indexOf('__') !== 0) {
                    logUndefined('navigator', prop);
                }
                return val;
            }
        };
        try {
            sandbox.navigator = new Proxy(sandbox.navigator, navHandler);
            sandbox.window.navigator = sandbox.navigator;
        } catch(e) {}

        // Wrap screen with Proxy
        var screenHandler = {
            get: function(target, prop) {
                var val = target[prop];
                if (val === undefined && typeof prop === 'string' && prop.indexOf('__') !== 0) {
                    logUndefined('screen', prop);
                }
                return val;
            }
        };
        try {
            sandbox.screen = new Proxy(sandbox.screen, screenHandler);
            sandbox.window.screen = sandbox.screen;
        } catch(e) {}

        try {
            vm.runInContext(inlineScript, sandbox, { filename: 'inline.js' });
            vm.runInContext(jsContent, sandbox, { filename: 'vm.js' });
            if (triggerCall) vm.runInContext(triggerCall, sandbox, { filename: 'trigger.js' });
        } catch (e) {
            console.log('[ERROR]', e.message);
        }

        // Results
        console.log('\n===== UNDEFINED PROPERTY ACCESSES =====');
        var sorted = Object.keys(undefinedAccesses).sort(function(a, b) {
            return undefinedAccesses[b] - undefinedAccesses[a];
        });
        for (var i = 0; i < sorted.length; i++) {
            console.log('  ' + sorted[i] + ' (' + undefinedAccesses[sorted[i]] + 'x)');
        }

        console.log('\n===== createElement CALLS =====');
        console.log('  ' + createElementCalls.join(', '));

        console.log('\n===== getElementsByTagName CALLS =====');
        var tagKeys = Object.keys(functionCalls).filter(function(k) { return k.indexOf('getElementsByTagName') >= 0; });
        for (var i = 0; i < tagKeys.length; i++) {
            console.log('  ' + tagKeys[i] + ' (' + functionCalls[tagKeys[i]].count + 'x)');
        }

        console.log('\n===== Cookie =====');
        console.log('  count:', sandbox.__allCookies.length);
        for (var i = 0; i < sandbox.__allCookies.length; i++) {
            var c = sandbox.__allCookies[i];
            var eq = c.indexOf('=');
            console.log('  ' + c.substring(0, eq) + ' = ' + c.substring(eq + 1).length + ' chars');
        }
    });
}

main();

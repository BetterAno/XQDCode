/**
 * Track $_ts changes during VM execution
 * Use Object.defineProperty setter to detect when $_ts is replaced
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

        // Track $_ts changes
        var tsLog = [];
        var origDescriptor = Object.getOwnPropertyDescriptor(sandbox, '$_ts');

        // Wrap $_ts with a setter
        var currentTs = sandbox.$_ts;
        Object.defineProperty(sandbox, '$_ts', {
            get: function() { return currentTs; },
            set: function(val) {
                var oldKeys = Object.keys(currentTs).join(',');
                var newKeys = typeof val === 'object' && val !== null ? Object.keys(val).join(',') : '(non-object)';
                tsLog.push({
                    event: '$_ts replaced',
                    oldKeys: oldKeys,
                    newKeys: newKeys,
                    oldIsRef: val === currentTs,
                });
                currentTs = val;
            },
            configurable: true,
            enumerable: true,
        });

        // Don't wrap eval - vm context's eval is special
        // Instead, inject monitoring code into the sandbox
        sandbox.__tsLog = tsLog;
        sandbox.__currentTs = currentTs;
        var monitorCode = [
            '(function() {',
            '  var origExecScript = window.execScript || eval;',
            '  window.execScript = function(code) {',
            '    if (typeof code === "string" && code.length > 10000) {',
            '      window.__tsLog.push({event:"layer2_exec", tsKeys: Object.keys(window.__currentTs).join(",")});',
            '    }',
            '    return origExecScript(code);',
            '  };',
            '  window.eval = window.execScript;',
            '})();',
        ].join('\n');

        // Phase 1: inline script
        vm.runInContext(inlineScript, sandbox, { filename: 'inline.js' });
        tsLog.push({ event: 'after inline', tsKeys: Object.keys(currentTs).join(','), tsRef: sandbox.$_ts === currentTs });

        // Inject monitor before VM code
        vm.runInContext(monitorCode, sandbox, { filename: 'monitor.js' });

        // Phase 2: VM code
        vm.runInContext(jsContent, sandbox, { filename: 'vm.js' });
        tsLog.push({ event: 'after vm code', tsKeys: Object.keys(currentTs).join(','), tsRef: sandbox.$_ts === currentTs });

        // Phase 3: trigger
        if (triggerCall) {
            vm.runInContext(triggerCall, sandbox, { filename: 'trigger.js' });
            tsLog.push({ event: 'after trigger', tsKeys: Object.keys(currentTs).join(','), tsRef: sandbox.$_ts === currentTs });
        }

        // Results
        console.log('===== $_TS CHANGE LOG =====');
        for (var i = 0; i < tsLog.length; i++) {
            console.log(JSON.stringify(tsLog[i]));
        }

        console.log('\n===== FINAL $_TS =====');
        console.log('sandbox.$_ts === currentTs:', sandbox.$_ts === currentTs);
        console.log('Keys:', Object.keys(currentTs).join(','));
        for (var k in currentTs) {
            var v = currentTs[k];
            if (typeof v === 'function') {
                console.log('  .' + k + ' = [function]');
            } else if (Array.isArray(v)) {
                console.log('  .' + k + ' = [array] length=' + v.length);
            } else {
                console.log('  .' + k + ' = ' + typeof v + ' ' + String(v).substring(0, 50));
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

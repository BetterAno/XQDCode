/**
 * Capture second layer code and $_ts.scj / $_ts.aebi values
 * by injecting hooks INTO the sandbox before VM execution
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

        // DON'T override execScript/eval - let the original work
        // Instead, add a hook that monitors $_ts.scj and $_ts.aebi
        // The VM code calls execScript internally, we can't hook it easily
        // But we CAN check $_ts state at key points

        // Add a setter on $_ts.scj to capture the value
        var capturedScj = null;
        var capturedAebi = null;
        var tsObj = sandbox.$_ts;

        // Inject a monitoring script that runs after the first layer VM code
        // hooks into the layer2 generation
        var hookCode = [
            '(function() {',
            '  var origExecScript = window.execScript || eval;',
            '  window.execScript = function(code) {',
            '    if (typeof code === "string" && code.length > 10000) {',
            '      // Save layer2 code',
            '      window.__layer2Code = code;',
            '      // Capture $_ts.scj and $_ts.aebi',
            '      window.__scj = $_ts.scj;',
            '      window.__aebi = $_ts.aebi;',
            '    }',
            '    return origExecScript(code);',
            '  };',
            '  window.eval = window.execScript;',
            '})();'
        ].join('\n');

        try {
            vm.runInContext(inlineScript, sandbox, { filename: 'inline.js' });

            // Check $_ts after inline
            console.log('$_ts.cd length:', sandbox.$_ts.cd ? sandbox.$_ts.cd.length : 'undefined');

            // Inject the hook BEFORE running VM code
            vm.runInContext(hookCode, sandbox, { filename: 'hook.js' });

            // Run VM code
            vm.runInContext(jsContent, sandbox, { filename: 'vm.js' });

            // Check captured values
            if (sandbox.__layer2Code) {
                console.log('Layer2 code captured:', sandbox.__layer2Code.length, 'chars');
                fs.writeFileSync(path.join(__dirname, '..', 'assets', 'ruishu6_layer2.js'), sandbox.__layer2Code);
                console.log('Saved to assets/ruishu6_layer2.js');
            } else {
                console.log('No layer2 code captured!');
            }

            if (sandbox.__scj) {
                capturedScj = sandbox.__scj;
                console.log('$_ts.scj: type=' + typeof capturedScj +
                    (Array.isArray(capturedScj) ? ' length=' + capturedScj.length : ''));
                if (Array.isArray(capturedScj)) {
                    console.log('  first 10:', JSON.stringify(capturedScj.slice(0, 10)));
                }
            } else {
                console.log('$_ts.scj: not captured');
            }

            if (sandbox.__aebi) {
                capturedAebi = sandbox.__aebi;
                console.log('$_ts.aebi: type=' + typeof capturedAebi +
                    (Array.isArray(capturedAebi) ? ' length=' + capturedAebi.length : ''));
                if (Array.isArray(capturedAebi)) {
                    console.log('  first 10:', JSON.stringify(capturedAebi.slice(0, 10)));
                    console.log('  sample entries:');
                    for (var i = 0; i < Math.min(5, capturedAebi.length); i++) {
                        var v = capturedAebi[i];
                        if (typeof v === 'object' && v !== null) {
                            console.log('    [' + i + '] keys=' + Object.keys(v).slice(0, 5).join(','));
                        } else {
                            console.log('    [' + i + '] ' + typeof v + '=' + String(v).substring(0, 50));
                        }
                    }
                }
            } else {
                console.log('$_ts.aebi: not captured');
            }

            // Check $_ts state now
            console.log('\n$_ts keys:', Object.keys(sandbox.$_ts).join(', '));

            // Run trigger
            if (triggerCall) {
                vm.runInContext(triggerCall, sandbox, { filename: 'trigger.js' });
            }

        } catch (e) {
            console.log('[ERROR]', e.message);
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

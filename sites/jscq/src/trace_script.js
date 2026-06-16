/**
 * Check what script elements return
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
            inline_script_text: inlineScript,  // THIS IS THE KEY - pass the actual inline script!
        });

        // Check what scripts look like before VM runs
        var scripts = sandbox.document.getElementsByTagName('script');
        console.log('Scripts count:', scripts.length);
        for (var i = 0; i < scripts.length; i++) {
            var sc = scripts[i];
            console.log('Script[' + i + ']:');
            console.log('  text length:', (sc.text || '').length);
            console.log('  textContent length:', (sc.textContent || '').length);
            console.log('  innerHTML length:', (sc.innerHTML || '').length);
            console.log('  src:', sc.src || '(none)');
            console.log('  type:', sc.getAttribute('type') || '(none)');
            console.log('  text start:', (sc.text || '').substring(0, 80));
        }

        // Check what meta element looks like
        var meta = sandbox.document.getElementById(metaId);
        console.log('\nMeta element:');
        console.log('  tagName:', meta.tagName);
        console.log('  content:', meta.getAttribute('content'));
        console.log('  content len:', (meta.getAttribute('content') || '').length);
        console.log('  r attr:', meta.getAttribute('r'));

        // Check anchor element URL parsing
        var a = sandbox.document.createElement('a');
        a.href = 'https://www.jscq.com.cn/jscq/cqjy/jygg/cqzr/index.shtml';
        console.log('\nAnchor element:');
        console.log('  href:', a.href);
        console.log('  hostname:', a.hostname);
        console.log('  pathname:', a.pathname);
        console.log('  protocol:', a.protocol);
        console.log('  port:', a.port);

        // Check iframe element
        var iframe = sandbox.document.createElement('iframe');
        console.log('\nIframe element:');
        console.log('  contentWindow:', typeof iframe.contentWindow);
        console.log('  contentDocument:', typeof iframe.contentDocument);

        try {
            vm.runInContext(inlineScript, sandbox, { filename: 'inline_script.js' });
            vm.runInContext(jsContent, sandbox, { filename: 'ruishu6.js' });
            if (triggerCall) vm.runInContext(triggerCall, sandbox, { filename: 'trigger.js' });
        } catch (e) {
            console.log('[ERROR]', e.message);
        }

        console.log('\nCookie:', sandbox.__allCookies ? sandbox.__allCookies.length : 0);
        if (sandbox.__allCookies) {
            for (var i = 0; i < sandbox.__allCookies.length; i++) {
                var c = sandbox.__allCookies[i];
                var eq = c.indexOf('=');
                console.log('  ' + c.substring(0, eq) + ' len=' + c.substring(eq + 1).length);
            }
        }
    });
}

main();

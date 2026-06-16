/**
 * Deep trace - track property access on window/navigator/document/screen
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
            inline_script_text: '',
        });

        // ===== DEEP PROPERTY TRACKING =====
        var propLog = [];
        var loggedProps = {};

        // Track key reads on specific objects
        function trackReads(obj, objName, props) {
            for (var i = 0; i < props.length; i++) {
                (function(prop) {
                    var orig = obj[prop];
                    var desc = Object.getOwnPropertyDescriptor(obj, prop);
                    if (desc && desc.get) {
                        var origGet = desc.get;
                        Object.defineProperty(obj, prop, {
                            get: function() {
                                var val = origGet.call(obj);
                                var key = objName + '.' + prop;
                                if (!loggedProps[key]) {
                                    loggedProps[key] = true;
                                    var valStr = (typeof val === 'string') ? '"' + (val.length > 60 ? val.substring(0, 60) + '...' : val) + '"' : String(val);
                                    propLog.push('READ ' + key + ' = ' + valStr);
                                }
                                return val;
                            },
                            set: desc.set ? function(v) { return desc.set.call(obj, v); } : undefined,
                            configurable: true,
                            enumerable: desc.enumerable,
                        });
                    } else {
                        Object.defineProperty(obj, prop, {
                            get: function() {
                                var val = orig;
                                var key = objName + '.' + prop;
                                if (!loggedProps[key]) {
                                    loggedProps[key] = true;
                                    var valStr = (typeof val === 'string') ? '"' + (val.length > 60 ? val.substring(0, 60) + '...' : val) + '"' : String(val);
                                    propLog.push('READ ' + key + ' = ' + valStr);
                                }
                                return val;
                            },
                            set: function(v) { orig = v; },
                            configurable: true,
                            enumerable: true,
                        });
                    }
                })(props[i]);
            }
        }

        // Track navigator properties
        trackReads(sandbox.navigator, 'navigator', [
            'userAgent', 'platform', 'language', 'languages', 'cookieEnabled',
            'webdriver', 'vendor', 'appVersion', 'hardwareConcurrency', 'deviceMemory',
            'maxTouchPoints', 'plugins', 'mimeTypes', 'connection', 'onLine',
            'doNotTrack', 'product', 'productSub', 'appCodeName', 'appName',
        ]);

        // Track screen properties
        trackReads(sandbox.screen, 'screen', [
            'width', 'height', 'availWidth', 'availHeight', 'colorDepth', 'pixelDepth',
        ]);

        // Track document properties
        trackReads(sandbox.document, 'document', [
            'hidden', 'visibilityState', 'readyState', 'domain', 'referrer',
            'title', 'characterSet', 'contentType', 'documentMode',
            'URL', 'documentURI', 'compatMode', 'designMode',
        ]);

        // Track location properties
        trackReads(sandbox.location, 'location', [
            'href', 'protocol', 'host', 'hostname', 'pathname', 'search', 'hash', 'origin', 'port',
        ]);

        try {
            vm.runInContext(inlineScript, sandbox, { filename: 'inline_script.js' });
            vm.runInContext(jsContent, sandbox, { filename: 'ruishu6.js' });
            if (triggerCall) vm.runInContext(triggerCall, sandbox, { filename: 'trigger.js' });
        } catch (e) {
            console.log('[ERROR]', e.message);
        }

        console.log('\n===== PROPERTY READS =====');
        for (var i = 0; i < propLog.length; i++) {
            console.log(propLog[i]);
        }

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

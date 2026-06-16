var fs = require('fs');
var vm = require('vm');
var path = require('path');
var setupEnv = require(path.join(__dirname, 'env.js'));

var sandbox = {};
['Uint8Array', 'Uint8ClampedArray', 'Int8Array', 'Int16Array', 'Int32Array',
    'Uint16Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'ArrayBuffer', 'DataView',
    'Map', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'Proxy', 'Reflect', 'Promise'].forEach(function (n) {
    sandbox[n] = global[n];
});
vm.createContext(sandbox);
delete sandbox.__dirname; delete sandbox.__filename; delete sandbox.require;
delete sandbox.module; delete sandbox.exports; delete sandbox.global;
delete sandbox.process; delete sandbox.Buffer;

setupEnv(sandbox, {
    url: 'https://www.jscq.com.cn/jscq/cqjy/jygg/cqzr/index.shtml',
    meta_content: 'test123',
    meta_id: 'testid',
    js_url: 'https://www.jscq.com.cn/test.js',
    inline_script_text: '$_ts=window["$_ts"];$_ts.cd="test";',
});

var checks = [
    'document.documentMode',
    'typeof document.documentMode',
    'navigator.webdriver',
    'typeof navigator.webdriver',
    'window.chrome',
    'typeof window.chrome',
    'JSON.stringify(window.chrome)',
    'window._phantom',
    'window.callPhantom',
    'window._selenium',
    'window.webdriver',
    'window.__webdriver_evaluate',
    'navigator.sendBeacon',
    'typeof navigator.sendBeacon',
    'navigator.plugins.length',
    'navigator.mimeTypes.length',
    'window.execScript',
    'typeof window.execScript',
    'window.eval',
    'typeof window.eval',
    // Check if sendBeacon is writable
    'Object.getOwnPropertyDescriptor(navigator, "sendBeacon")',
    'navigator.hasOwnProperty("sendBeacon")',
    // Check window property descriptor
    'Object.getOwnPropertyDescriptor(window, "chrome")',
    // document.all specifics
    'document.all',
    '"all" in document',
    'typeof document.all',
];

checks.forEach(function(expr) {
    try {
        var result = vm.runInContext(expr, sandbox);
        console.log(expr + ' => ' + String(result));
    } catch(e) {
        console.log(expr + ' => ERROR: ' + e.message);
    }
});

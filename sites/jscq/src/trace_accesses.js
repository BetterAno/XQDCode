/**
 * Trace all property accesses during Layer 1 execution
 * Uses Proxy for diagnostic purposes only (not for production)
 */
var fs = require('fs');
var vm = require('vm');
var path = require('path');
var setupEnv = require(path.join(__dirname, 'env.js'));

var inputPath = fs.readFileSync('sites/jscq/src/_diag_input_path.txt', 'utf-8').trim();
var input = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

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
    url: input.url,
    meta_content: input.meta_content,
    meta_id: input.meta_id || '',
    js_url: input.js_url,
    inline_script_text: input.inline_script || '',
});
if (!sandbox.execScript) sandbox.execScript = sandbox.eval;
if (input.o_cookie_name && input.o_cookie_value) {
    sandbox.__allCookies.push(input.o_cookie_name + '=' + input.o_cookie_value);
}

// Execute inline script
vm.runInContext(input.inline_script, sandbox, { filename: 'inline.js' });

// Now wrap key objects with Proxy to trace accesses
var accessLog = {};
function traceObj(objName, obj) {
    // Get all current property names
    var props = Object.getOwnPropertyNames(obj);
    var accessGet = {};
    var accessSet = {};

    props.forEach(function(prop) {
        try {
            var desc = Object.getOwnPropertyDescriptor(obj, prop);
            if (!desc || !desc.configurable) return;

            var origGetter = desc.get;
            var origValue = desc.value;
            var hasGetter = !!origGetter;

            Object.defineProperty(obj, prop, {
                get: function() {
                    accessGet[prop] = (accessGet[prop] || 0) + 1;
                    if (hasGetter) return origGetter.call(this);
                    return origValue;
                },
                set: function(v) {
                    accessSet[prop] = (accessSet[prop] || 0) + 1;
                    if (hasGetter) { /* can't set */ return; }
                    origValue = v;
                },
                configurable: true,
                enumerable: desc.enumerable,
            });
        } catch(e) {}
    });

    accessLog[objName] = { get: accessGet, set: accessSet };
}

// Trace document, navigator, window properties
traceObj('document', sandbox.document);
traceObj('navigator', sandbox.navigator);

// For window (sandbox itself), we need a different approach
// Trace specific window properties that are commonly checked
var windowProps = ['outerWidth', 'outerHeight', 'innerWidth', 'innerHeight', 'devicePixelRatio',
    'screenX', 'screenY', 'pageXOffset', 'pageYOffset', 'scrollX', 'scrollY',
    'name', 'closed', 'length', 'status', 'frameElement', 'opener',
    'chrome', '_phantom', '__nightmare', 'callPhantom', '_selenium', 'webdriver',
    '__webdriver_evaluate', '__selenium_evaluate', '__fxdriver_evaluate',
    'domAutomation', 'domAutomationController'];
var windowAccess = {};
windowProps.forEach(function(prop) {
    try {
        var desc = Object.getOwnPropertyDescriptor(sandbox, prop);
        if (!desc) return;
        var origValue = desc.value;
        var origGetter = desc.get;
        var hasGetter = !!origGetter;

        Object.defineProperty(sandbox, prop, {
            get: function() {
                windowAccess[prop] = (windowAccess[prop] || 0) + 1;
                if (hasGetter) return origGetter.call(this);
                return origValue;
            },
            configurable: true,
            enumerable: desc.enumerable,
        });
    } catch(e) {}
});
accessLog['window'] = { get: windowAccess, set: {} };

// Hook execScript
sandbox.execScript = function(code) {
    return vm.runInContext(code, sandbox, { filename: 'layer2.js' });
};
sandbox.window.execScript = sandbox.execScript;

// Execute Layer 1
vm.runInContext(input.js_content, sandbox, { filename: 'layer1.js' });

// Execute trigger
if (input.trigger_call) {
    vm.runInContext(input.trigger_call, sandbox, { filename: 'trigger.js' });
}

// Print results
console.log('=== Property Access Trace During Layer 1 ===');
['document', 'navigator', 'window'].forEach(function(objName) {
    var log = accessLog[objName];
    if (!log) return;
    var gets = Object.keys(log.get).sort(function(a,b) { return log.get[b] - log.get[a]; });
    var sets = Object.keys(log.set);
    console.log('\n--- ' + objName + ' gets (' + gets.length + ' props accessed) ---');
    gets.forEach(function(p) { console.log('  ' + p + ': ' + log.get[p]); });
    if (sets.length > 0) {
        console.log('--- ' + objName + ' sets ---');
        sets.forEach(function(p) { console.log('  ' + p + ': ' + log.set[p]); });
    }
});

// Also check cookie result
if (sandbox.__capturedCookie) {
    var val = sandbox.__capturedCookie.split('=', 2)[1];
    console.log('\nCookie: ' + val.length + ' chars, Part[0]=' + val.split('.')[0]);
} else {
    console.log('\nNO COOKIE CAPTURED');
}

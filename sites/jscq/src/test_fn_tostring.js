// Quick test: check if Ruishu detects non-native function toString
var fs = require('fs');
var vm = require('vm');
var path = require('path');

// Create a minimal sandbox with our env
var setupEnv = require(path.join(__dirname, 'env.js'));
var sandbox = {};
vm.createContext(sandbox);
delete sandbox.__dirname; delete sandbox.__filename; delete sandbox.require;
delete sandbox.module; delete sandbox.exports; delete sandbox.global; delete sandbox.process;

setupEnv(sandbox, {
    url: 'https://www.jscq.com.cn/jscq/cqjy/jygg/cqzr/index.shtml',
    meta_content: 'test123',
    meta_id: 'testid',
    js_url: 'https://www.jscq.com.cn/test.js',
    inline_script_text: '',
});

// Test Function.prototype.toString on our env functions
var tests = [
    'Function.prototype.toString.call(document.createElement)',
    'Function.prototype.toString.call(document.getElementById)',
    'Function.prototype.toString.call(document.getElementsByTagName)',
    'Function.prototype.toString.call(navigator.getBattery)',
    'Function.prototype.toString.call(performance.now)',
    'Function.prototype.toString.call(crypto.getRandomValues)',
    'Function.prototype.toString.call(setTimeout)',
    'Function.prototype.toString.call(atob)',
    'Function.prototype.toString.call(btoa)',
    'Function.prototype.toString.call(eval)',
    'Function.prototype.toString.call(document.body.appendChild)',
    'typeof document.createElement',
    'typeof document.getElementById',
    'typeof navigator.getBattery',
    'document.createElement("div").getElementsByTagName("i").toString()',
    'Object.prototype.toString.call(document.all)',
    'Object.prototype.toString.call(document.getElementsByTagName("script"))',
    'Object.prototype.toString.call(navigator.plugins)',
    'Object.prototype.toString.call(navigator.mimeTypes)',
    'Array.isArray(document.getElementsByTagName("script"))',
];

tests.forEach(function(test) {
    try {
        var result = vm.runInContext(test, sandbox);
        console.log(test + ' => ' + JSON.stringify(String(result).substring(0, 120)));
    } catch(e) {
        console.log(test + ' => ERROR: ' + e.message);
    }
});

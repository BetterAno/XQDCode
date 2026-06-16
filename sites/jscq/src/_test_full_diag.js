var vm = require('vm');
var path = require('path');
var fs = require('fs');
var _origOuterToString = Function.prototype.toString;
var _outerNatKey = '__natName';
Function.prototype.toString = function() {
    if (this[_outerNatKey]) return 'function ' + this[_outerNatKey] + '() { [native code] }';
    return _origOuterToString.call(this);
};
Function.prototype.toString[_outerNatKey] = 'toString';
var setupEnv = require(path.join(__dirname, 'env.js'));
var input = JSON.parse(fs.readFileSync(path.join(__dirname, '_test_input.json'), 'utf-8'));

var sandbox = {};
['Uint8Array','Map','Set','Symbol','Proxy','Reflect','Promise','ArrayBuffer',
'Int8Array','Int16Array','Int32Array','Uint16Array','Uint32Array',
'Float32Array','Float64Array','DataView','WeakMap','WeakSet',
'Uint8ClampedArray'].forEach(function(n){sandbox[n]=global[n];});
vm.createContext(sandbox);
delete sandbox.__dirname; delete sandbox.__filename; delete sandbox.require;
delete sandbox.module; delete sandbox.exports; delete sandbox.global;
delete sandbox.process; delete sandbox.Buffer;

setupEnv(sandbox, {url:input.url, meta_content:input.meta_content, meta_id:input.meta_id||'', js_url:input.js_url, inline_script_text:input.inline_script||''});

// Install Error.prepareStackTrace
vm.runInContext([
    '(function() {',
    '  Error.prepareStackTrace = function(err, stack) {',
    '    var lines = ["Error"];',
    '    for (var i = 0; i < stack.length; i++) {',
    '      var f = stack[i];',
    '      var fileName = f.getFileName();',
    '      if (fileName && (fileName.indexOf("node:vm") >= 0 || fileName.indexOf("internal/") >= 0)) continue;',
    '      var fn = f.getFunctionName() || "";',
    '      if (fileName && fileName.indexOf("evalmachine.") === 0) fileName = "<anonymous>";',
    '      if (!fileName) fileName = "<anonymous>";',
    '      var line = f.getLineNumber();',
    '      var col = f.getColumnNumber();',
    '      if (fn) { lines.push("    at " + fn + " (" + fileName + ":" + (line||1) + ":" + (col||1) + ")"); }',
    '      else { lines.push("    at " + fileName + ":" + (line||1) + ":" + (col||1)); }',
    '    }',
    '    return lines.join(String.fromCharCode(10));',
    '  };',
    '})();',
].join('\n'), sandbox);

sandbox.structuredClone = function(obj) { return JSON.parse(JSON.stringify(obj)); };
sandbox.window.structuredClone = sandbox.structuredClone;

// Run diagnostics
var checks = [
    // Error stack
    '(new Error()).stack.split(String.fromCharCode(10)).slice(0,3)',
    'eval("(new Error()).stack.split(String.fromCharCode(10)).slice(0,3)")',
    'new Function("return (new Error()).stack.split(String.fromCharCode(10)).slice(0,3)")()',
    // eval scope test (KEY detection)
    '!new function(){eval("this.a=1")}().a',
    // toString checks
    'eval.toString().substring(0, 60)',
    'Function.toString().substring(0, 60)',
    'new Function("return 1").toString().substring(0, 60)',
    'typeof eval',
    'typeof Function',
    'typeof structuredClone',
    'typeof queueMicrotask',
    // Key environment checks
    'window instanceof Window',
    'window === window.window',
    'navigator.webdriver === undefined',
    'navigator.plugins.length',
    'document instanceof Object',
    'Object.getPrototypeOf(window) === Window.prototype',
    // Chrome-specific
    'typeof chrome',
    '!!window.chrome',
    // Missing globals that Ruishu might check
    'typeof globalThis',
    'typeof reportError',
    'typeof setTimeout',
    'typeof setInterval',
    'typeof requestAnimationFrame',
    'typeof cancelAnimationFrame',
    'typeof IntersectionObserver',
    'typeof ResizeObserver',
    'typeof MutationObserver',
    'typeof Intl',
    'typeof WebAssembly',
    // constructor checks
    '({}).constructor === Object',
    '[].constructor === Array',
    '(function(){}).constructor === Function',
    // navigator properties
    'navigator.platform',
    'navigator.language',
    'navigator.vendor',
    'navigator.userAgent ? navigator.userAgent.substring(0,60) : "undefined"',
];

checks.forEach(function(expr) {
    try {
        var result = vm.runInContext(expr, sandbox, {filename: 'diag.js'});
        console.log('OK  ' + expr.substring(0,50) + ' => ' + JSON.stringify(result));
    } catch(e) {
        console.log('ERR ' + expr.substring(0,50) + ' => ' + e.message);
    }
});

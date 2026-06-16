/**
 * Focus diagnostic: test what the Ruishu code likely checks during Layer 2
 * Run with actual gen_cookie.js context
 */
var vm = require('vm');
var path = require('path');

// Outer override (same as gen_cookie.js)
var _origOuterToString = Function.prototype.toString;
var _outerNatKey = '__natName';
Function.prototype.toString = function() {
    if (this[_outerNatKey]) return 'function ' + this[_outerNatKey] + '() { [native code] }';
    return _origOuterToString.call(this);
};
Function.prototype.toString[_outerNatKey] = 'toString';

var setupEnv = require(path.join(__dirname, 'env.js'));

var sandbox = {};
['Uint8Array','Uint8ClampedArray','Int8Array','Int16Array','Int32Array',
'Uint16Array','Uint32Array','Float32Array','Float64Array','ArrayBuffer','DataView',
'Map','Set','WeakMap','WeakSet','Symbol','Proxy','Reflect','Promise'].forEach(function(n){sandbox[n]=global[n];});
vm.createContext(sandbox);
delete sandbox.__dirname; delete sandbox.__filename; delete sandbox.require;
delete sandbox.module; delete sandbox.exports; delete sandbox.global;
delete sandbox.process; delete sandbox.Buffer;

setupEnv(sandbox, {
    url: 'https://www.jscq.com.cn/jscq/cqjy/jygg/cqzr/index.shtml',
    meta_content: 'test123', meta_id: 'testid',
    js_url: 'https://www.jscq.com.cn/test.js',
    inline_script_text: '$_ts=window["$_ts"];$_ts.cd="test";',
});

// Use custom filename for execution (same as gen_cookie.js)
var filename = 'https://www.jscq.com.cn/layer2.js';

var checks = [
    // Error stack with custom filename
    '(function(){ return (new Error()).stack; })()',

    // new Function behavior
    'var fn = new Function("return 1"); fn()',
    'var fn2 = new Function("return (new Error()).stack"); fn2().split("\\n")[0]',
    'var fn3 = new Function("return typeof window"); fn3()',
    'var fn4 = new Function("return typeof global"); fn4()',
    'var fn5 = new Function("return typeof module"); fn5()',

    // Indirect eval
    '(0, eval)("1+1")',
    '(0, eval)("(new Error()).stack.split(\\"\\\\n\\")[0]")',

    // Direct eval with error
    'eval("(new Error()).stack.split(\\"\\\\n\\").slice(0,2).join(\\"|\\")")',

    // arguments.callee
    '(function(){ return arguments.callee ? typeof arguments.callee : "no"; })()',

    // Function.prototype.constructor
    'Function.prototype.constructor === Function',

    // Date parsing
    'Date.parse("2024-01-01") > 0',
    'new Date().getTimezoneOffset()',

    // RegExp
    '/test/.test("test")',
    'new RegExp("test").toString()',

    // String methods
    '"abc".charAt(0)',
    '"abc".charCodeAt(0)',
    '"abc".indexOf("b")',

    // Number methods
    '(1.23).toFixed(2)',
    'parseInt("123abc")',
    'parseFloat("1.23abc")',
    'isNaN(NaN)',
    'isFinite(1)',

    // Array methods
    '[1,2,3].join(",")',
    '[1,2,3].map(function(x){return x*2}).join(",")',
    'Array.isArray([])',
    'Array.isArray({})',

    // Object methods
    'Object.keys({a:1,b:2}).join(",")',
    'Object.values ? "yes" : "no"',
    'Object.entries ? "yes" : "no"',

    // Promise
    'typeof Promise',
    'typeof Promise.resolve',

    // Proxy detection
    'typeof Proxy',

    // Error types
    'typeof TypeError',
    'typeof RangeError',
    'typeof SyntaxError',
    'typeof ReferenceError',
    '(function(){try{null.x}catch(e){return e instanceof TypeError}})()',
    '(function(){try{null.x}catch(e){return e.constructor === TypeError}})()',

    // hasOwnProperty on prototypes
    'Object.prototype.hasOwnProperty.call(window, "setTimeout")',
    'Object.prototype.hasOwnProperty.call(window, "document")',
    'Object.prototype.hasOwnProperty.call(window, "navigator")',

    // Property descriptor checks
    'Object.getOwnPropertyDescriptor(window, "document") ? "yes" : "no"',
    'Object.getOwnPropertyDescriptor(window, "navigator") ? "yes" : "no"',

    // String.fromCharCode
    'String.fromCharCode(72,101,108,108,111)',

    // Math
    'Math.floor(1.5)',
    'Math.ceil(1.5)',
    'Math.round(1.5)',
    'Math.abs(-1)',
    'Math.max(1,2,3)',
    'Math.min(1,2,3)',

    // JSON
    'JSON.stringify({a:1})',
    'JSON.parse(\'{"a":1}\').a',

    // Global properties
    'typeof NaN',
    'typeof Infinity',
    'typeof undefined',
    'NaN === NaN',
    'typeof eval',
    'typeof isFinite',
    'typeof isNaN',
    'typeof parseInt',
    'typeof parseFloat',
    'typeof decodeURI',
    'typeof encodeURI',
    'typeof decodeURIComponent',
    'typeof encodeURIComponent',
    'typeof escape',
    'typeof unescape',

    // Typed arrays
    'typeof Uint8Array',
    'new Uint8Array([1,2,3]).length',
    'typeof ArrayBuffer',
    'typeof DataView',

    // WeakRef / FinalizationRegistry
    'typeof WeakRef',
    'typeof FinalizationRegistry',

    // BigInt
    'typeof BigInt',
    'typeof BigInt === "undefined" ? "no" : "yes"',

    // globalThis identity
    'globalThis === window',
    'globalThis === self',

    // toString on primitives
    'Object.prototype.toString.call(1)',
    'Object.prototype.toString.call("str")',
    'Object.prototype.toString.call(true)',
    'Object.prototype.toString.call(null)',
    'Object.prototype.toString.call(undefined)',
    'Object.prototype.toString.call(function(){})',
    'Object.prototype.toString.call([])',
    'Object.prototype.toString.call({})',
    'Object.prototype.toString.call(/test/)',
    'Object.prototype.toString.call(new Date())',
    'Object.prototype.toString.call(new Error())',

    // Function.name
    '(function myFunc(){}).name',
    'setTimeout.name || "no name"',
    'document.createElement.name || "no name"',

    // Reflect
    'typeof Reflect',
    'Reflect.apply(function(){return 1}, null, [])',

    // Symbol
    'typeof Symbol',
    'typeof Symbol.iterator',
    'Symbol("test").toString()',
];

checks.forEach(function(expr) {
    try {
        var result = vm.runInContext(expr, sandbox, { filename: filename });
        console.log('OK  ' + expr + ' => ' + String(result).substring(0, 150));
    } catch(e) {
        console.log('ERR ' + expr + ' => ' + e.message.substring(0, 100));
    }
});

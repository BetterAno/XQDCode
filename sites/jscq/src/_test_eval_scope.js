var vm = require('vm');
var sandbox = {console: console};
vm.createContext(sandbox);

// Test 1: Does vm eval preserve calling scope?
var code1 = [
    '(function() {',
    '    var localVar = {name: "I am local"};',
    '    var result = eval("localVar.name");',
    '    console.log("Direct eval result:", result);',
    '})();',
].join('\n');
vm.runInContext(code1, sandbox);

// Test 2: Does new Function(){eval()} work with calling scope?
var code2 = [
    '(function() {',
    '    var localVar = "local_value";',
    '    var r = !new function(){eval("this.a=1")}().a;',
    '    console.log("!new function(){eval(this.a=1)}().a =", r, "(should be false in browser)");',
    '})();',
].join('\n');
vm.runInContext(code2, sandbox);

// Test 3: Check Error stack
var code3 = [
    'try {',
    '    (function() {',
    '        var stack = (new Error()).stack;',
    '        console.log("Stack line 1:", stack.split("\n")[0]);',
    '        console.log("Stack line 2:", stack.split("\n")[1]);',
    '    })();',
    '} catch(e) { console.log("Error:", e.message); }',
].join('\n');
vm.runInContext(code3, sandbox);

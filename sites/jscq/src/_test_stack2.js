var vm = require('vm');
var sandbox = {console: console};
vm.createContext(sandbox);

// Check default Error stack
vm.runInContext([
    'var stack = (new Error()).stack;',
    'console.log("Default Error stack:");',
    'stack.split("\n").slice(0,4).forEach(function(l){console.log("  " + l);});',
].join('\n'), sandbox);

// Check eval Error stack
vm.runInContext([
    'var evalStack = eval("(new Error()).stack");',
    'console.log("\neval Error stack:");',
    'evalStack.split("\n").slice(0,4).forEach(function(l){console.log("  " + l);});',
].join('\n'), sandbox);

// Check Function Error stack
vm.runInContext([
    'var fnStack = new Function("return (new Error()).stack")();',
    'console.log("\nnew Function Error stack:");',
    'fnStack.split("\n").slice(0,4).forEach(function(l){console.log("  " + l);});',
].join('\n'), sandbox);

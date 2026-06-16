var vm = require('vm');
var sandbox = {console: console};
vm.createContext(sandbox);

// Check default Error stack
vm.runInContext('var stack = (new Error()).stack; console.log("Default Error stack:"); stack.split("\n").slice(0,4).forEach(function(l){console.log("  " + l);});', sandbox);

// Check eval Error stack  
vm.runInContext('var evalStack = eval("(new Error()).stack"); console.log("eval Error stack:"); evalStack.split("\n").slice(0,4).forEach(function(l){console.log("  " + l);});', sandbox);

// Check new Function Error stack
vm.runInContext('var fnStack = new Function("return (new Error()).stack")(); console.log("new Function Error stack:"); fnStack.split("\n").slice(0,4).forEach(function(l){console.log("  " + l);});', sandbox);

// Now test with Error.prepareStackTrace override
vm.runInContext('Error.prepareStackTrace = function(err, stack) { return stack.map(function(f) { var fn = f.getFunctionName() || ""; var file = f.getFileName() || "<anonymous>"; var line = f.getLineNumber() || 1; var col = f.getColumnNumber() || 1; return "    at " + (fn ? fn + " (" : "") + file + ":" + line + ":" + col + (fn ? ")" : ""); }).join("\n"); };', sandbox);

console.log('\n--- After prepareStackTrace override ---');
vm.runInContext('var stack2 = (new Error()).stack; console.log("Default Error stack:"); stack2.split("\n").slice(0,4).forEach(function(l){console.log("  " + l);});', sandbox);
vm.runInContext('var evalStack2 = eval("(new Error()).stack"); console.log("eval Error stack:"); evalStack2.split("\n").slice(0,4).forEach(function(l){console.log("  " + l);});', sandbox);

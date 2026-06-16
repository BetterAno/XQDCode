var vm = require('vm');
var sandbox = {console: console};
vm.createContext(sandbox);

// Use separate strings to avoid escaping issues
var code1 = 'var s = (new Error()).stack; console.log(s.split("\n").slice(0,4).join("\n"));';
console.log('=== Default Error stack ===');
vm.runInContext(code1, sandbox, {filename: 'test.js'});

console.log('\n=== Default Error stack (no filename) ===');
vm.runInContext(code1, sandbox);

console.log('\n=== After prepareStackTrace ===');
var prepareCode = 'Error.prepareStackTrace = function(err, stack) { return stack.map(function(f) { return "    at " + (f.getFunctionName() || "anonymous") + " (" + (f.getFileName() || "<anonymous>") + ":" + (f.getLineNumber()||1) + ":" + (f.getColumnNumber()||1) + ")"; }).join("\n"); };';
vm.runInContext(prepareCode, sandbox);
vm.runInContext(code1, sandbox);

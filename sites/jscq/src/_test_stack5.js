var vm = require('vm');
var sandbox = {};
vm.createContext(sandbox);

// Simple test - use template to avoid escaping issues
var NL = String.fromCharCode(10);
var code1 = 'var s = (new Error()).stack; s.split("' + NL + '").slice(0,4);';
var result1 = vm.runInContext(code1, sandbox, {filename: 'test.js'});
console.log('=== Default Error stack (with filename) ===');
result1.forEach(function(l){console.log(l);});

var result2 = vm.runInContext(code1, sandbox);
console.log('\n=== Default Error stack (no filename) ===');
result2.forEach(function(l){console.log(l);});

// Test prepareStackTrace
var prepareCode = 'Error.prepareStackTrace = function(err, stack) { var lines = []; for (var i = 0; i < stack.length && i < 4; i++) { var f = stack[i]; lines.push("    at " + (f.getFunctionName() || "anonymous") + " (" + (f.getFileName() || "<anonymous>") + ":" + (f.getLineNumber()||1) + ":" + (f.getColumnNumber()||1) + ")"); } return lines.join("' + NL + '"); };';
vm.runInContext(prepareCode, sandbox);

var result3 = vm.runInContext(code1, sandbox, {filename: 'test.js'});
console.log('\n=== After prepareStackTrace ===');
result3.forEach(function(l){console.log(l);});

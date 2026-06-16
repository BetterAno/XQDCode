var vm = require('vm');
var sandbox = {};
vm.createContext(sandbox);

// Use .split(String.fromCharCode(10)) to avoid literal newline issues
var code = '(new Error()).stack.split(String.fromCharCode(10)).slice(0,4)';

var r1 = vm.runInContext(code, sandbox, {filename: 'test.js'});
console.log('=== With filename test.js ===');
r1.forEach(function(l){console.log('  ' + l);});

var r2 = vm.runInContext(code, sandbox);
console.log('\n=== No filename ===');
r2.forEach(function(l){console.log('  ' + l);});

// Install prepareStackTrace
var pcode = 'Error.prepareStackTrace=function(e,s){return s.slice(0,4).map(function(f){return "    at "+(f.getFunctionName()||"")+" ("+("<anonymous>")+")"}).join(String.fromCharCode(10))};';
vm.runInContext(pcode, sandbox);

var r3 = vm.runInContext(code, sandbox, {filename: 'test.js'});
console.log('\n=== After prepareStackTrace ===');
r3.forEach(function(l){console.log('  ' + l);});

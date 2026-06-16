/**
 * Analyze VM code structure around error position 115326
 * and search for patterns related to cookie generation
 */
var fs = require('fs');
var path = require('path');

var vmCode = fs.readFileSync(path.join(__dirname, '..', 'assets', 'ruishu6_vm.js'), 'utf-8');

console.log('Total length:', vmCode.length);

// Find the structure around position 115326
var pos = 115326;
console.log('\n===== AROUND POSITION 115326 =====');
console.log('Context (115200-115450):');
var chunk = vmCode.substring(115200, 115450);
console.log(chunk);

// Search for "client error" or error-related patterns
console.log('\n===== ERROR PATTERNS =====');
var patterns = ['client error', 'clientError', 'error', 'Error', 'catch', 'try'];
patterns.forEach(function(p) {
    var idx = vmCode.indexOf(p);
    if (idx >= 0) {
        console.log('Found "' + p + '" at position ' + idx);
        console.log('  Context: ' + vmCode.substring(Math.max(0, idx - 30), idx + p.length + 30));
    }
});

// Search for cookie-related patterns
console.log('\n===== COOKIE PATTERNS =====');
var cookiePatterns = ['cookie', 'Cookie', 'document.cookie', 'enable_', 'jDwk'];
cookiePatterns.forEach(function(p) {
    var idx = 0;
    var found = 0;
    while ((idx = vmCode.indexOf(p, idx)) !== -1) {
        if (found < 3) {
            console.log('Found "' + p + '" at position ' + idx);
            console.log('  Context: ' + vmCode.substring(Math.max(0, idx - 40), Math.min(vmCode.length, idx + p.length + 40)));
        }
        found++;
        idx++;
    }
    if (found > 3) console.log('  ... ' + found + ' total occurrences of "' + p + '"');
});

// Look at the IIFE structure - find the bytecode arrays
console.log('\n===== IIFE STRUCTURE =====');
var iifeStart = vmCode.indexOf('(function(');
console.log('IIFE starts at:', iifeStart);
var firstBracket = vmCode.indexOf('[[', iifeStart);
console.log('Bytecode arrays start at:', firstBracket);
// Find the main dispatcher function
var dispatcherMatch = vmCode.match(/function\s*\(\s*\w+\s*,\s*\w+\s*\)\s*\{/);
if (dispatcherMatch) {
    console.log('Dispatcher function at:', vmCode.indexOf(dispatcherMatch[0]));
}

// Look for execScript usage
console.log('\n===== EXECSCRIPT PATTERNS =====');
var execPatterns = ['execScript', 'exec'];
execPatterns.forEach(function(p) {
    var idx = 0;
    while ((idx = vmCode.indexOf(p, idx)) !== -1) {
        console.log('Found "' + p + '" at ' + idx + ': ' + vmCode.substring(Math.max(0, idx - 50), Math.min(vmCode.length, idx + p.length + 50)));
        idx++;
    }
});

// Find variable assignments (opcode table)
console.log('\n===== GLOBAL VARIABLE ASSIGNMENTS (first 2000 chars) =====');
var assignMatch = vmCode.match(/_\$\w+=window/g);
if (assignMatch) {
    console.log('Window assignment:', assignMatch[0]);
}
// Find the opcode mapping
var opcodeSection = vmCode.substring(0, 2000);
console.log('First 500 chars:', opcodeSection.substring(0, 500));

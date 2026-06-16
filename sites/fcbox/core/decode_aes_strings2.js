const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('e:\\PythonCodeObject1\\catpHelp\\aes.chunk.js', 'utf8');

// Find the IIFE start and end
// The IIFE starts at the beginning and ends before the webpack chunk
const webpackStart = code.indexOf('(self[');
const prefix = code.slice(0, webpackStart);

const ctx = {
    self: {},
    window: {},
    console: console,
    global: global
};

vm.createContext(ctx);
vm.runInContext(prefix, ctx);

// Now a1_0x38e0 should be available in ctx
const result = ctx.a1_0x38e0();
console.log(JSON.stringify(result, null, 2));

const fs = require('fs');
const code = fs.readFileSync('e:\\PythonCodeObject1\\catpHelp\\aes.chunk.js', 'utf8');

// Extract just the string array, decrypt function, and IIFE
// We need to find the end of the IIFE to cut safely
const iifeEnd = code.indexOf('function a1_0x14b1b8');
const prefix = code.slice(0, iifeEnd);

// Create a minimal script that runs the IIFE and exports the final array
const script = prefix + `
// Export the final array state after IIFE completes
console.log(JSON.stringify(a1_0x38e0(), null, 2));
`;

eval(script);

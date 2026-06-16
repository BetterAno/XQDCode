const fs = require('fs');
const code = fs.readFileSync('e:/PythonCodeObject1/catpHelp/assets_fcslider.js', 'utf8');

// Find the string array function
const funcMatch = code.match(/function a0_0x47c1\(\)\{[\s\S]*?\}/);
if (!funcMatch) {
    console.log('Function not found');
    process.exit(1);
}

// Extract array content using a safer approach
const funcCode = funcMatch[0];
const arrayMatch = funcCode.match(/var _0x\w+=\[([\s\S]*)\];return/);
if (!arrayMatch) {
    console.log('Array not found');
    process.exit(1);
}

// Parse as JSON by wrapping in brackets
let raw = '[' + arrayMatch[1] + ']';
// Replace single-quoted strings with double-quoted for JSON
// This is a simple approach - use Function constructor for safety
let arr;
try {
    arr = new Function('return ' + raw)();
} catch(e) {
    console.log('Parse error:', e.message);
    // Save raw for debugging
    fs.writeFileSync('e:/PythonCodeObject1/catpHelp/fcslider_strings_raw.txt', raw.substring(0, 5000));
    process.exit(1);
}

fs.writeFileSync('e:/PythonCodeObject1/catpHelp/fcslider_strings.json', JSON.stringify(arr, null, 2));
console.log('Extracted', arr.length, 'strings');

// Print interesting strings
const keywords = ['http', 'ajax', 'fetch', 'token', 'verify', 'slide', 'background', 'captcha', 'api', 'post', 'get', 'url', 'img', 'image', 'base64', 'json'];
arr.forEach((s, i) => {
    if (keywords.some(k => s.toLowerCase().includes(k))) {
        console.log(`[${i}]`, s);
    }
});

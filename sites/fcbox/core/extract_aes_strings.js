const fs = require('fs');
const code = fs.readFileSync('e:\\PythonCodeObject1\\catpHelp\\aes.chunk.js', 'utf8');

// Extract string array using a more robust approach
const match = code.match(/var _0x3ce98a=\[([^\]]+)\]/);
if (match) {
    // Parse the array manually
    const arrStr = match[1];
    const arr = [];
    let current = '';
    let inString = false;
    let quoteChar = null;
    
    for (let i = 0; i < arrStr.length; i++) {
        const ch = arrStr[i];
        if (!inString) {
            if (ch === "'" || ch === '"') {
                inString = true;
                quoteChar = ch;
                current = '';
            }
        } else {
            if (ch === '\\' && i + 1 < arrStr.length) {
                const next = arrStr[i + 1];
                if (next === 'x') {
                    current += String.fromCharCode(parseInt(arrStr.slice(i+2, i+4), 16));
                    i += 3;
                } else {
                    current += next;
                    i++;
                }
            } else if (ch === quoteChar) {
                arr.push(current);
                inString = false;
            } else {
                current += ch;
            }
        }
    }
    
    console.log(JSON.stringify(arr, null, 2));
} else {
    console.log('No match found');
}

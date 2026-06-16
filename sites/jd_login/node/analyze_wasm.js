/**
 * Analyze jcap WASM binary - extract import requirements
 */
const fs = require('fs');
const path = require('path');

const wasmPath = path.join(__dirname, 'jcap.wasm');
const wasmBuffer = fs.readFileSync(wasmPath);

console.log(`WASM size: ${wasmBuffer.length} bytes`);

// Parse imports using WebAssembly.Module
try {
    const mod = new WebAssembly.Module(wasmBuffer);
    
    // Get imports
    const imports = WebAssembly.Module.imports(mod);
    console.log(`\nImports (${imports.length}):`);
    for (const imp of imports) {
        console.log(`  ${imp.module}.${imp.name} (${imp.kind})`);
    }
    
    // Get exports
    const exports = WebAssembly.Module.exports(mod);
    console.log(`\nExports (${exports.length}):`);
    for (const exp of exports) {
        console.log(`  ${exp.name} (${exp.kind})`);
    }
    
    // Group imports by module
    const importGroups = {};
    for (const imp of imports) {
        if (!importGroups[imp.module]) {
            importGroups[imp.module] = [];
        }
        importGroups[imp.module].push({ name: imp.name, kind: imp.kind });
    }
    
    console.log(`\nImport modules:`);
    for (const [modName, funcs] of Object.entries(importGroups)) {
        console.log(`\n  Module "${modName}":`);
        for (const f of funcs) {
            console.log(`    ${f.name} (${f.kind})`);
        }
    }

} catch (e) {
    console.error('Error parsing WASM:', e.message);
}

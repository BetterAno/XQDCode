const fs = require("fs");
const s = fs.readFileSync(
  "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\H5guard_live.js",
  "utf8"
);

// 实例 #9 at offset 294085 - mtgsig VM
const p = 294085;
const qStart = p + 8; // skip 'new aS("'
const qEnd = s.indexOf('"', qStart);
const bytecode = s.substring(qStart, qEnd);

console.log("=== mtgsig VM 字节码 ===");
console.log("Bytecode length:", bytecode.length);
console.log("First 100:", bytecode.substring(0, 100));
console.log("Last 100:", bytecode.substring(bytecode.length - 100));

// Save bytecode
fs.writeFileSync(
  "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\mtgsig_bc.txt",
  bytecode
);
console.log("\nSaved to mtgsig_bc.txt");

// Extract what comes after the bytecode (externals + hash)
const afterBC = s.substring(qEnd + 1, qEnd + 2000);
console.log("\n=== After bytecode (first 1500 chars) ===");
console.log(afterBC.substring(0, 1500));

// Find hash in wider range
const hashMatch = afterBC.match(/"([a-f0-9]{32})"/);
if (hashMatch) {
  console.log("\n=== Hash ===");
  console.log(hashMatch[1]);
}

// Find externals array
const extMatch = afterBC.match(/\[([^\]]+)\]/);
if (extMatch) {
  const exts = extMatch[1].split(",").map(x => x.trim());
  console.log("\n=== Externals (" + exts.length + ") ===");
  exts.forEach((e, i) => console.log("  [" + i + "] " + e));
}

// Find run function
const runMatch = afterBC.match(/run"\]\("([^"]+)"/);
if (runMatch) {
  console.log("\n=== Run function ===");
  console.log(runMatch[1]);
}

// Key seed analysis
console.log("\n=== XOR Key Seed ===");
const v = parseInt("3n2l3o2f2", 28);
console.log("parseInt('3n2l3o2f2', 28) =", v);
console.log(">> 21 =", v >> 21);
console.log("hex =", "0x" + (v >> 21).toString(16));

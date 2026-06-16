const fs = require("fs");
const s = fs.readFileSync(
  "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\H5guard_live.js",
  "utf8"
);

console.log("File length:", s.length);

// 1. Find all new aS( positions
const aSPattern = 'new aS("';
let pos = 0;
let count = 0;
const positions = [];

while ((pos = s.indexOf(aSPattern, pos)) !== -1) {
  count++;
  positions.push(pos);
  console.log(`\nInstance #${count} at offset ${pos}:`);
  
  // Extract bytecode (up to first closing quote)
  const bcStart = pos + aSPattern.length;
  const bcEnd = s.indexOf('"', bcStart);
  const bytecode = s.substring(bcStart, bcEnd);
  console.log(`  Bytecode length: ${bytecode.length}`);
  console.log(`  Bytecode preview: ${bytecode.substring(0, 80)}...`);
  
  // After bytecode quote, find the externals array [...]
  const afterBC = s.substring(bcEnd + 1, bcEnd + 500);
  const extMatch = afterBC.match(/,\s*\[([^\]]+)\]/);
  if (extMatch) {
    const extList = extMatch[1].split(",").map(x => x.trim());
    console.log(`  Externals: ${extList.length} items [${extList.slice(0, 5).join(", ")}...]`);
  }
  
  // Find hash (32 hex chars)
  const hashMatch = afterBC.match(/"([a-f0-9]{32})"/);
  if (hashMatch) {
    console.log(`  Hash: ${hashMatch[1]}`);
  }
  
  // Find run function name
  const runMatch = s.substring(bcEnd, bcEnd + 1000).match(/\["run"\]\("([^"]+)"/);
  if (runMatch) {
    console.log(`  Run func: ${runMatch[1]}`);
  }
  
  // Save mtgsig bytecode if found
  if (hashMatch && hashMatch[1] === "dfdb71b1fa2738418bb11c4f7d70fb2c") {
    fs.writeFileSync(
      "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\mtgsig_bytecode.txt",
      bytecode, "utf8"
    );
    console.log("  ** SAVED mtgsig bytecode to file **");
    
    // Also save full externals
    if (extMatch) {
      const extList = extMatch[1].split(",").map(x => x.trim());
      console.log(`  Full externals (${extList.length}):`);
      extList.forEach((e, i) => console.log(`    [${i}] ${e}`));
    }
  }
  
  pos = bcEnd + 1;
}

console.log(`\nTotal aS instances: ${count}`);

// 2. Key seed analysis
const keySeedIdx = s.indexOf("3n2l3o2f2");
if (keySeedIdx >= 0) {
  console.log(`\n=== XOR Key Seed ===`);
  console.log(`"3n2l3o2f2" at offset: ${keySeedIdx}`);
  console.log(`Context: ...${s.substring(keySeedIdx - 60, keySeedIdx + 60)}...`);
  
  const parsed = parseInt("3n2l3o2f2", 28);
  console.log(`parseInt("3n2l3o2f2", 28) = ${parsed}`);
  console.log(`>> 21 = ${parsed >> 21}`);
}

// 3. aS constructor
const aSIdx = s.indexOf("function aS(");
if (aSIdx >= 0) {
  console.log(`\n=== aS Constructor ===`);
  console.log(`At offset: ${aSIdx}`);
  console.log(`First 300 chars: ${s.substring(aSIdx, aSIdx + 300)}`);
}

// 4. prototype.d
const protoIdx = s.indexOf("prototype.d");
if (protoIdx >= 0) {
  console.log(`\n=== prototype.d ===`);
  console.log(`At offset: ${protoIdx}`);
  console.log(`Context: ${s.substring(protoIdx - 20, protoIdx + 40)}`);
}

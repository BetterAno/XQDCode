const fs = require("fs");
const path = "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\H5guard_live.js";
const s = fs.readFileSync(path, "utf8");

const out = [];
out.push("len: " + s.length);

// Find aS instances
let p = 0, n = 0;
while (true) {
  p = s.indexOf('new aS("', p);
  if (p === -1) break;
  n++;
  
  const qStart = p + 8;
  const qEnd = s.indexOf('"', qStart);
  const bcLen = qEnd - qStart;
  
  out.push("\n#" + n + " @" + p + " bcLen=" + bcLen);
  out.push("  preview: " + s.substring(qStart, qStart + 60));
  
  // Look for hash after bytecode
  const after = s.substring(qEnd + 1, qEnd + 400);
  const hm = after.match(/"([a-f0-9]{32})"/);
  if (hm) out.push("  hash: " + hm[1]);
  
  // Look for run func
  const rm = s.substring(qEnd, qEnd + 800).match(/run"\]\("([^"]+)"/);
  if (rm) out.push("  run: " + rm[1]);
  
  // Save mtgsig bytecode
  if (hm && hm[1] === "dfdb71b1fa2738418bb11c4f7d70fb2c") {
    const bc = s.substring(qStart, qEnd);
    fs.writeFileSync("e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\mtgsig_bc.txt", bc);
    out.push("  ** SAVED " + bc.length + " chars **");
    
    // Externals
    const em = after.match(/\[([^\]]+)\]/);
    if (em) {
      const exts = em[1].split(",").map(x => x.trim());
      out.push("  externals (" + exts.length + "):");
      exts.forEach((e, i) => out.push("    [" + i + "] " + e));
    }
  }
  
  p = qEnd + 1;
}
out.push("\ntotal: " + n);

// Key seed
const ki = s.indexOf("3n2l3o2f2");
if (ki >= 0) {
  out.push("\nkeySeed @" + ki);
  const v = parseInt("3n2l3o2f2", 28);
  out.push("parseInt=" + v + " >>21=" + (v >> 21));
}

const result = out.join("\n");
fs.writeFileSync("e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\analysis_result.txt", result);
process.stdout.write(result + "\n");

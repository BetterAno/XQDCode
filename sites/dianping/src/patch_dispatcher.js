const fs = require("fs");
const p = "e:/PythonCodeObject1/Qoder_ObjectProdemo2/.agents/skills/ast-deobfuscation/scripts/inline-dispatchers.js";
let s = fs.readFileSync(p, "utf8");

// Add try-catch around replaceWith to handle Babel validation errors
s = s.replace(
  "path.replaceWith(clone(entry.value));",
  "try { path.replaceWith(clone(entry.value)); } catch(e) { console.error('[inline-dispatchers] skip replace:', objectName, key, e.message); }"
);

fs.writeFileSync(p, s);
console.log("Patched inline-dispatchers.js with try-catch");

const fs = require("fs");
const compatPrefix = "if(typeof window===\"undefined\"){var window=global;}\nif(typeof self===\"undefined\"){var self=global;}\n";
const vmCode = fs.readFileSync("e:/PythonCodeObject1/Qoder_ObjectProdemo2/sites/dianping/src/aS_vm.js", "utf8");
const loadVm = new Function(compatPrefix + vmCode + "; return { aS: aS, c: c };");
const { c } = loadVm();
console.log("c(327) =", c(327));  // "apply"
console.log("c(339) =", c(339));  // "undefined"
console.log("c(705) =", c(705));  // init string
console.log("c(696) =", c(696));  // ?
console.log("c(673) =", c(673));  // "lm" or similar
console.log("c(674) =", c(674));
console.log("c(675) =", c(675));

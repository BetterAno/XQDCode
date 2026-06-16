const fs = require("fs");
const src = fs.readFileSync(
  "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\H5guard_live.js",
  "utf8"
);

// 1. 提取 a 数组 (index 384)
const aStart = src.indexOf("a=[");
const aEnd = src.indexOf("]", aStart) + 1;
const aArrayCode = src.substring(aStart, aEnd) + ";";
console.log(`a array: offset=${aStart}, length=${aArrayCode.length}`);

// 2. 提取 c 函数 (index 124771)
const cStart = src.indexOf("c=function c(");
let cDepth = 0, cEnd = cStart, cInStr = false, cStrCh = "";
for (let i = cStart; i < src.length; i++) {
  const ch = src[i];
  if (cInStr) {
    if (ch === cStrCh && src[i-1] !== "\\") cInStr = false;
  } else {
    if (ch === '"' || ch === "'") { cInStr = true; cStrCh = ch; }
    if (ch === "{") cDepth++;
    if (ch === "}") { cDepth--; if (cDepth === 0) { cEnd = i + 1; break; } }
  }
}
const cFuncCode = "var " + src.substring(cStart, cEnd) + ";";
console.log(`c function: offset=${cStart}, length=${cFuncCode.length}`);

// 3. 提取 aS 构造器 (index 159127)
const aSStart = src.indexOf("function aS(");
let aSDepth = 0, aSEnd = aSStart, aSInStr = false, aSStrCh = "";
for (let i = aSStart; i < src.length; i++) {
  const ch = src[i];
  if (aSInStr) {
    if (ch === aSStrCh && src[i-1] !== "\\") aSInStr = false;
  } else {
    if (ch === '"' || ch === "'") { aSInStr = true; aSStrCh = ch; }
    if (ch === "{") aSDepth++;
    if (ch === "}") { aSDepth--; if (aSDepth === 0) { aSEnd = i + 1; break; } }
  }
}
const aSCode = src.substring(aSStart, aSEnd);
console.log(`aS constructor: offset=${aSStart}, length=${aSCode.length}`);

// 4. prototype.d
const protoDCode = "aS.prototype.d={};";

// 5. 组合成可运行文件
// aS 构造器中的 c() 调用需要先解码
// 但 c() 依赖 a 数组，所以我们把 a + c + aS 都放在一起

const outputFile = `
// ═══════════════════════════════════════
// H5guard aS VM - 提取的独立运行版本
// ═══════════════════════════════════════

// 字符串表
var ${aArrayCode}

// 字符串表解码函数
${cFuncCode}

// VM 构造器
${aSCode}

// 原型
${protoDCode}

// 导出
if (typeof module !== "undefined") {
  module.exports = { aS, c };
}
`;

const outPath = "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\src\\aS_vm.js";
fs.writeFileSync(outPath, outputFile);
console.log(`\n已保存到: ${outPath}`);
console.log(`文件大小: ${outputFile.length} chars`);

// 6. 验证提取是否正确
try {
  const vm = require("vm");
  const sandbox = {
    console: { log: () => {}, error: () => {} },
    parseInt, String, decodeURIComponent, Object, Array, Date,
    Uint8Array, DataView, ArrayBuffer, RegExp, Math,
    module: { exports: {} },
    window: undefined,
    global: {},
  };
  const context = vm.createContext(sandbox);
  vm.runInContext(outputFile, context, { timeout: 5000 });
  const result = vm.runInContext("typeof aS", context);
  console.log(`\n验证: typeof aS = ${result}`);
  
  // 尝试获取 c() 解码值
  const c3371 = vm.runInContext("c(3371)", context);
  console.log(`c(3371) = "${c3371}"`);
  console.log(`期望:     "dfdb71b1fa2738418bb11c4f7d70fb2c"`);
  console.log(`匹配: ${c3371 === "dfdb71b1fa2738418bb11c4f7d70fb2c"}`);
} catch (e) {
  console.log(`\n验证失败: ${e.message}`);
}

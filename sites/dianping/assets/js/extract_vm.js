/**
 * 从 H5guard_live.js 中提取 aS VM 构造器
 * 并尝试在 Node.js 中独立运行
 */
const fs = require("fs");

const src = fs.readFileSync(
  "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\H5guard_live.js",
  "utf8"
);

// 1. 定位 aS 构造器
const aSStart = src.indexOf("function aS(");
if (aSStart < 0) {
  console.error("ERROR: function aS not found");
  process.exit(1);
}
console.log(`aS constructor at offset: ${aSStart}`);

// 2. 找到构造器结尾 (匹配括号)
let depth = 0;
let aSEnd = aSStart;
let inString = false;
let stringChar = "";

for (let i = aSStart; i < src.length; i++) {
  const ch = src[i];
  if (inString) {
    if (ch === stringChar && src[i - 1] !== "\\") inString = false;
  } else {
    if (ch === '"' || ch === "'") {
      inString = true;
      stringChar = ch;
    }
    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) {
        aSEnd = i + 1;
        break;
      }
    }
  }
}

const aSConstructor = src.substring(aSStart, aSEnd);
console.log(`aS constructor length: ${aSConstructor.length}`);
console.log(`First 200: ${aSConstructor.substring(0, 200)}`);
console.log(`Last 200: ${aSConstructor.substring(aSConstructor.length - 200)}`);

// 3. 找到 prototype.d
const protoDIdx = src.indexOf("aS.prototype.d", aSEnd);
let protoDLine = "";
if (protoDIdx >= 0) {
  const lineEnd = src.indexOf(";", protoDIdx);
  protoDLine = src.substring(protoDIdx, lineEnd + 1);
  console.log(`\nprototype.d: ${protoDLine}`);
}

// 4. 检查 aS 构造器中引用的外部变量
// aS 构造器使用了 c() 字符串表解码函数
const cCallCount = (aSConstructor.match(/\bc\(/g) || []).length;
console.log(`\nc() calls in constructor: ${cCallCount}`);

// 5. 提取 c() 函数定义
const cFuncIdx = src.indexOf("c = function c(");
if (cFuncIdx >= 0) {
  // 找到 c 函数结尾
  let cDepth = 0, cEnd = cFuncIdx, cInStr = false, cStrCh = "";
  for (let i = cFuncIdx; i < src.length; i++) {
    const ch = src[i];
    if (cInStr) {
      if (ch === cStrCh && src[i-1] !== "\\") cInStr = false;
    } else {
      if (ch === '"' || ch === "'") { cInStr = true; cStrCh = ch; }
      if (ch === "{") cDepth++;
      if (ch === "}") { cDepth--; if (cDepth === 0) { cEnd = i + 1; break; } }
    }
  }
  const cFunc = src.substring(cFuncIdx, cEnd);
  console.log(`\nc() function length: ${cFunc.length}`);
  
  // 找到 a 数组 (string table)
  const aArrayIdx = src.indexOf("a = [");
  if (aArrayIdx >= 0) {
    const aEnd = src.indexOf("]", aArrayIdx);
    const aArray = src.substring(aArrayIdx, aEnd + 1);
    console.log(`a array length: ${aArray.length} chars`);
    
    // 保存提取的代码
    const extracted = {
      cFunc,
      aArray: aArray + ";",
      aSConstructor,
      protoD: protoDLine,
    };
    
    fs.writeFileSync(
      "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\extracted_vm.json",
      JSON.stringify({
        cFuncLen: cFunc.length,
        aArrayLen: aArray.length,
        aSConstructorLen: aSConstructor.length,
      }, null, 2)
    );
    
    // 保存可直接执行的 JS
    const runnable = `
// 提取的 VM 组件
${aArray}
var ${cFunc};
${aSConstructor}
${protoDLine}
`;
    fs.writeFileSync(
      "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\extracted_vm.js",
      runnable
    );
    console.log("\n已保存到 extracted_vm.js");
    console.log(`总大小: ${runnable.length} chars`);
  }
}

// 6. 检查 aS 构造器中的字符串表依赖
console.log("\n=== aS 构造器中的 c() 调用样本 ===");
const cCalls = aSConstructor.match(/\bc\(\d+\)/g) || [];
const uniqueCalls = [...new Set(cCalls)].slice(0, 20);
console.log(`Unique c(NNN) calls: ${uniqueCalls.join(", ")}`);

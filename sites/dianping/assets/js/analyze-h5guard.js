/**
 * H5guard_live.js 静态分析器
 * 提取 VM 字节码、外部函数列表、hash 键
 */
const fs = require("fs");

const src = fs.readFileSync(
  "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\H5guard_live.js",
  "utf8"
);

// ── 1. 定位所有 new aS(...) 调用 ──
console.log("=== 搜索 aS VM 实例 ===\n");

let searchFrom = 0;
let instanceCount = 0;
const instances = [];

while (true) {
  const idx = src.indexOf('new aS("', searchFrom);
  if (idx < 0) break;

  instanceCount++;
  // 提取完整调用: new aS("bytecode", [externals], "hash")["run"]("funcName", args)
  let depth = 0;
  let endIdx = idx;
  let inString = false;
  let stringChar = "";

  for (let i = idx; i < Math.min(idx + 100000, src.length); i++) {
    const ch = src[i];
    if (inString) {
      if (ch === stringChar && src[i - 1] !== "\\") inString = false;
    } else {
      if (ch === '"' || ch === "'") {
        inString = true;
        stringChar = ch;
      }
      if (ch === "(") depth++;
      if (ch === ")") {
        depth--;
        if (depth === 0) {
          endIdx = i + 1;
          break;
        }
      }
    }
  }

  const callStr = src.substring(idx, endIdx);
  
  // 提取字节码 (第一个参数)
  const bytecodeMatch = callStr.match(/new aS\("([^"]+)"/);
  const bytecode = bytecodeMatch ? bytecodeMatch[1] : null;
  
  // 提取 hash (第三个参数)
  const hashMatch = callStr.match(/,\s*"([a-f0-9]{32})"\)/);
  const hash = hashMatch ? hashMatch[1] : null;
  
  // 提取外部函数数组 (第二个参数)
  const externMatch = callStr.match(/,\s*\[([^\]]+)\]\s*,\s*"/);
  const externals = externMatch ? externMatch[1].split(",").map(s => s.trim()) : null;
  
  // 提取 run 函数名
  const runMatch = src.substring(endIdx, endIdx + 50).match(/\["run"\]\("([^"]+)"/);
  const runFunc = runMatch ? runMatch[1] : null;

  const info = {
    id: instanceCount,
    offset: idx,
    bytecodeLen: bytecode ? bytecode.length : 0,
    bytecodePreview: bytecode ? bytecode.substring(0, 60) + "..." : null,
    hash,
    externalCount: externals ? externals.length : 0,
    externals: externals ? externals.slice(0, 10).join(", ") + (externals.length > 10 ? "..." : "") : null,
    runFunc,
    callLen: callStr.length,
  };

  instances.push(info);
  console.log(`实例 #${instanceCount}:`);
  console.log(`  偏移: ${idx}`);
  console.log(`  字节码长度: ${info.bytecodeLen}`);
  console.log(`  Hash: ${hash || "N/A"}`);
  console.log(`  外部函数: ${info.externalCount} 个 [${info.externals}]`);
  console.log(`  Run入口: ${runFunc || "N/A"}`);
  console.log();

  searchFrom = endIdx;
}

console.log(`\n共找到 ${instanceCount} 个 aS VM 实例`);

// ── 2. 提取 mtgsig 签名 VM 的完整字节码 ──
console.log("\n=== 提取 mtgsig VM 字节码 ===\n");

const mtgsigVM = instances.find(i => i.hash === "dfdb71b1fa2738418bb11c4f7d70fb2c");
if (mtgsigVM) {
  const idx = mtgsigVM.offset;
  const callStr = src.substring(idx, idx + mtgsigVM.callLen);
  
  // 提取完整字节码
  const bcMatch = callStr.match(/new aS\("([^"]+)"/);
  if (bcMatch) {
    const bytecode = bcMatch[1];
    console.log(`字节码长度: ${bytecode.length}`);
    console.log(`前100字符: ${bytecode.substring(0, 100)}`);
    console.log(`后100字符: ${bytecode.substring(bytecode.length - 100)}`);
    
    // 保存字节码到文件
    fs.writeFileSync(
      "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\mtgsig_bytecode.txt",
      bytecode, "utf8"
    );
    console.log("\n字节码已保存到 mtgsig_bytecode.txt");
  }
  
  // 提取外部函数完整列表
  const extMatch = callStr.match(/,\s*\[([^\]]+)\]\s*,\s*"/);
  if (extMatch) {
    const extList = extMatch[1].split(",").map(s => s.trim());
    console.log(`\n外部函数列表 (${extList.length}个):`);
    extList.forEach((e, i) => console.log(`  [${i}] ${e}`));
  }
}

// ── 3. 查找 VM XOR 解码密钥 ──
console.log("\n=== VM XOR 解码密钥分析 ===\n");

// 查找 "3n2l3o2f2" (XOR 密钥种子)
const keySeedIdx = src.indexOf("3n2l3o2f2");
if (keySeedIdx >= 0) {
  console.log(`密钥种子 "3n2l3o2f2" 偏移: ${keySeedIdx}`);
  console.log(`上下文: ${src.substring(keySeedIdx - 80, keySeedIdx + 80)}`);
  
  // 尝试计算 parseInt("3n2l3o2f2", 28)
  const parsed = parseInt("3n2l3o2f2", 28);
  console.log(`\nparseInt("3n2l3o2f2", 28) = ${parsed}`);
  console.log(`>> 21 = ${parsed >> 21}`);
  console.log(`hex = 0x${(parsed >> 21).toString(16)}`);
}

// ── 4. 分析 aS 构造器中的解码逻辑 ──
console.log("\n=== aS 构造器分析 ===\n");

const aSIdx = src.indexOf("function aS(");
if (aSIdx >= 0) {
  console.log(`aS 构造器偏移: ${aSIdx}`);
  // 提取构造器的前500字符
  console.log(`前500字符:\n${src.substring(aSIdx, aSIdx + 500)}`);
}

// 查找 prototype.d
const protoDIdx = src.indexOf("aS.prototype.d");
if (protoDIdx >= 0) {
  console.log(`\naS.prototype.d 偏移: ${protoDIdx}`);
  console.log(`上下文: ${src.substring(protoDIdx, protoDIdx + 50)}`);
}

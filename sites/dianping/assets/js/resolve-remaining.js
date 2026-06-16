/**
 * 解码残留的 c(ternary) 调用
 * 用法: node resolve-remaining.js <input.js> <output.js>
 */
const fs = require("fs");
const vm = require("vm");

function main() {
  const [, , inputPath, outputPath] = process.argv;

  // 从原始 prune 文件提取引导代码
  const pruneSrc = fs.readFileSync(
    "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\deob\\02_prune.js",
    "utf8"
  );
  const lines = pruneSrc.split("\n");
  let startLine = -1, endLine = -1, depth = 0, inC = false;
  for (let i = 0; i < 100; i++) {
    const l = lines[i];
    if (startLine < 0 && /var\s+e\s*,/.test(l)) startLine = i;
    if (startLine >= 0 && /c\s*=\s*function\s+c/.test(l)) inC = true;
    if (inC) {
      for (const ch of l) {
        if (ch === "{") depth++;
        if (ch === "}") { depth--; if (depth === 0) { endLine = i; break; } }
      }
      if (endLine >= 0) break;
    }
  }

  const bootstrap = lines.slice(startLine, endLine + 1).join("\n");
  const ctx = vm.createContext({
    parseInt, String, decodeURIComponent, Object, Array, Date,
    console: { log: () => {}, error: () => {} }
  });

  // 执行引导代码
  vm.runInContext(bootstrap, ctx, { timeout: 5000 });

  // 解码需要的值
  const decoded = vm.runInContext(`({
    c3172: c(3172), c3173: c(3173),
    c3430: c(3430), c3431: c(3431)
  })`, ctx);

  console.log("解码结果:", JSON.stringify(decoded, null, 2));

  // 在输出文件中替换残留
  let src = fs.readFileSync(inputPath, "utf8");

  // c(lI ? 3172 : 3173) → (lI ? "c3172值" : "c3173值")
  src = src.replace(/c\(lI \? 3172 : 3173\)/g,
    `(lI ? ${JSON.stringify(decoded.c3172)} : ${JSON.stringify(decoded.c3173)})`);

  // c(lJ ? 3430 : 3431) → (lJ ? "c3430值" : "c3431值")
  src = src.replace(/c\(lJ \? 3430 : 3431\)/g,
    `(lJ ? ${JSON.stringify(decoded.c3430)} : ${JSON.stringify(decoded.c3431)})`);

  fs.writeFileSync(outputPath, src, "utf8");
  console.log("输出:", outputPath);
}

main();

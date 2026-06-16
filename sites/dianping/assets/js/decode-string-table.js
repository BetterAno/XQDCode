/**
 * H5guard 专用字符串表解码适配器
 *
 * 处理模式:
 *   a = ["hex1", "hex2", ...]
 *   c = function c(e, f) { var g = a[e -= 0]; ... c.cazvJo(g) ... }
 *   caqvJo(k): first byte = XOR key, rest XOR key, then decodeURIComponent
 *
 * 用法: node decode-string-table.js <input.js> <output.js>
 */
const fs = require("fs");
const vm = require("vm");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generate = require("@babel/generator").default;

function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    console.error("Usage: node decode-string-table.js <input.js> <output.js>");
    process.exit(1);
  }

  const sourceText = fs.readFileSync(inputPath, "utf8");
  const startTotal = Date.now();

  // ── Step 1: 提取引导代码（a 数组 + c 函数） ──
  const bootstrapCode = extractBootstrap(sourceText);
  if (!bootstrapCode) {
    console.error("ERROR: 无法提取字符串表引导代码");
    process.exit(1);
  }

  // ── Step 2: 在沙箱中执行引导代码，构建解码器 ──
  const decoder = buildDecoder(bootstrapCode);
  if (!decoder) {
    console.error("ERROR: 无法构建字符串解码器");
    process.exit(1);
  }
  console.log(`[decode-string-table] 解码器就绪, 缓存大小: ${decoder.cacheSize}`);

  // ── Step 3: 预计算所有可能的索引 ──
  // 先扫描 AST 找出所有 c(NNN) 调用的索引值
  const ast = parser.parse(sourceText, {
    sourceType: "script",
    plugins: [],
    errorRecovery: true,
  });

  const indices = new Set();
  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      if (t.isIdentifier(callee, { name: "c" }) && path.node.arguments.length === 1) {
        const arg = path.node.arguments[0];
        if (t.isNumericLiteral(arg)) {
          indices.add(arg.value);
        }
      }
    },
  });

  console.log(`[decode-string-table] 发现 ${indices.size} 个不同的 c(NNN) 调用索引`);

  // 预解码所有索引
  const decodedMap = new Map();
  let decodeErrors = 0;
  for (const idx of indices) {
    try {
      const val = decoder.fn(idx);
      if (typeof val === "string") {
        decodedMap.set(idx, val);
      } else {
        decodeErrors++;
      }
    } catch (e) {
      decodeErrors++;
    }
  }
  console.log(`[decode-string-table] 成功解码: ${decodedMap.size}, 失败: ${decodeErrors}`);

  // ── Step 4: 替换所有 c(NNN) 调用 ──
  let replacedCount = 0;
  let skippedCount = 0;

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      if (!t.isIdentifier(callee, { name: "c" })) return;
      if (path.node.arguments.length !== 1) return;

      const arg = path.node.arguments[0];
      if (!t.isNumericLiteral(arg)) {
        skippedCount++;
        return;
      }

      const idx = arg.value;
      const decoded = decodedMap.get(idx);
      if (decoded === undefined) {
        skippedCount++;
        return;
      }

      // 替换为字符串字面量
      path.replaceWith(t.stringLiteral(decoded));
      replacedCount++;
    },
  });

  console.log(`[decode-string-table] 替换: ${replacedCount}, 跳过: ${skippedCount}`);

  // ── Step 5: 生成输出 ──
  const output = generate(ast, {
    compact: false,
    comments: true,
    jsescOption: { minimal: true },
  });

  fs.writeFileSync(outputPath, output.code, "utf8");

  const durationMs = Date.now() - startTotal;
  console.log(`[decode-string-table] 完成, 耗时 ${durationMs}ms, 输出: ${outputPath}`);

  // 打印一些解码示例
  const sampleIndices = [787, 547, 152, 3365, 1133, 497, 79, 25, 73, 139, 672, 3376];
  console.log("\n[decode-string-table] 解码示例:");
  for (const idx of sampleIndices) {
    const val = decodedMap.get(idx);
    if (val !== undefined) {
      console.log(`  c(${idx}) = "${val}"`);
    }
  }
}

/**
 * 从源文件中提取字符串表引导代码
 * 提取 var 声明中的 a 数组和 c 函数
 */
function extractBootstrap(sourceText) {
  // 找到 "var e," 开头到 c 函数结束的区域
  // 策略：找到 a = [...] 和 c = function c(e, f) { ... };
  const lines = sourceText.split("\n");

  // 收集包含 a = [ 的行到 c 函数结束的 }; 的行
  let startLine = -1;
  let endLine = -1;
  let braceDepth = 0;
  let inCFunction = false;

  for (let i = 0; i < Math.min(lines.length, 100); i++) {
    const line = lines[i];

    if (startLine === -1 && /var\s+e\s*,/.test(line)) {
      startLine = i;
    }

    if (startLine >= 0 && /c\s*=\s*function\s+c\s*\(/.test(line)) {
      inCFunction = true;
    }

    if (inCFunction) {
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        if (ch === "}") {
          braceDepth--;
          if (braceDepth === 0) {
            endLine = i;
            break;
          }
        }
      }
      if (endLine >= 0) break;
    }
  }

  if (startLine < 0 || endLine < 0) {
    // Fallback: 尝试用正则直接匹配
    const match = sourceText.match(
      /var\s+e\s*,[\s\S]*?c\s*=\s*function\s+c\s*\([^)]*\)\s*\{[\s\S]*?\n\s*\};/
    );
    if (match) {
      return match[0];
    }
    return null;
  }

  return lines.slice(startLine, endLine + 1).join("\n");
}

/**
 * 在沙箱中执行引导代码，返回解码函数
 */
function buildDecoder(bootstrapCode) {
  try {
    // 包装成可执行代码
    const wrappedCode = `
      "use strict";
      ${bootstrapCode}
      // 返回解码函数和缓存大小
      ({ fn: c, cacheSize: Object.keys(c.dniYiq || {}).length });
    `;

    const sandbox = {
      console: { log: () => {}, error: () => {} },
      parseInt,
      String,
      decodeURIComponent,
      Object,
      Array,
      Date,
    };

    const context = vm.createContext(sandbox);
    const result = vm.runInContext(wrappedCode, context, {
      timeout: 10000,
      filename: "h5guard-bootstrap.js",
    });

    // 预热缓存：调用一些常见索引
    const warmupIndices = [];
    for (let i = 0; i < 4500; i++) {
      warmupIndices.push(i);
    }
    for (const idx of warmupIndices) {
      try {
        result.fn(idx);
      } catch (e) {
        // 某些索引可能无效，忽略
      }
    }

    result.cacheSize = 4500;
    return result;
  } catch (e) {
    console.error("[buildDecoder] 沙箱执行失败:", e.message);
    return null;
  }
}

if (require.main === module) {
  main();
}

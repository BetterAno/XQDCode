// 直接从原始JS提取字符串映射
// 读取 final.js 的前28行（包含字符串表和旋转逻辑），然后调用 a0_0x1e0f
const fs = require('fs');
const content = fs.readFileSync('e:/PythonCodeObject1/catpHelp/fcbox/assets/deob_output/final.js', 'utf8');

// 提取前28行（字符串表和旋转IIFE）
const lines = content.split('\n');
const headerCode = lines.slice(0, 28).join('\n');

// 执行头部代码
eval(headerCode);

// 现在解析关键索引
const keys = {
  '0x2e4 (aesKey)': 0x2e4,
  '0x211 (sign 2nd)': 0x211,
  '0x287 (slider init pos)': 0x287,
  '0x3c4 (track y)': 0x3c4,
  '0x1e2 (track time key)': 0x1e2,
  '0x344': 0x344,
  '0x236': 0x236,
  '0x30d': 0x30d,
  '0x2a7': 0x2a7,
  '0x1cf (uuid gen)': 0x1cf,
  '0x354': 0x354,
  '0x12c': 0x12c,
  '0x26a (data)': 0x26a,
  '0x2df (aesEncrypt)': 0x2df,
  '0x107 (exports)': 0x107,
  '0x1d5 (url)': 0x1d5,
  '0x21c (options)': 0x21c,
  '0x1db (headers)': 0x1db,
  '0x2c0 (code)': 0x2c0,
  '0x265 (function)': 0x265,
};

for (const [name, idx] of Object.entries(keys)) {
  try {
    console.log(`${name} => '${a0_0x1e0f(idx)}'`);
  } catch(e) {
    console.log(`${name} => ERROR: ${e.message}`);
  }
}

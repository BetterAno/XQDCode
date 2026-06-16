/**
 * 大众点评 mtgsig 1.2 纯算签名生成器
 * 
 * 算法链路: a3 → a6 → a5 → a8 → d1
 * 
 * 参考: mtgsig sdkVersion 3.0.0 / 4.2.0
 */
const crypto = require("crypto");

// ═══════════════════════════════════════════
// MD5 实现 (使用 Node.js crypto)
// ═══════════════════════════════════════════
function md5(input) {
  if (input instanceof Uint8Array || Buffer.isBuffer(input)) {
    return crypto.createHash("md5").update(input).digest("hex");
  }
  return crypto.createHash("md5").update(String(input)).digest("hex");
}

function md5_bytes(input) {
  if (input instanceof Uint8Array || Buffer.isBuffer(input)) {
    return Array.from(crypto.createHash("md5").update(input).digest());
  }
  return Array.from(crypto.createHash("md5").update(String(input)).digest());
}

// ═══════════════════════════════════════════
// AES-128-CBC 加密 (用于 a6)
// ═══════════════════════════════════════════
function aes_encrypt(data, key, iv) {
  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let encrypted = cipher.update(data, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted;
}

// ═══════════════════════════════════════════
// a3: 设备指纹 ID (dfpId)
// ═══════════════════════════════════════════
function get_a3() {
  // 方案1: 直接使用已有的 dfpId (从浏览器 cookie/localStorage 获取)
  // 方案2: 本地生成
  const timestamp = Date.now();
  const constant = "AOMEOAG";
  const env = { platform: "Win32", vendor: "Google Inc." };
  const envBytes = new TextEncoder().encode(JSON.stringify(env));
  const envMd5 = md5(envBytes);
  return `${timestamp}${constant}${envMd5}`;
}

// ═══════════════════════════════════════════
// a6: AES 加密环境参数
// ═══════════════════════════════════════════
function get_a6(a3, config = {}) {
  // 环境参数收集
  const envParams = {
    platform: config.platform || "Win32",
    vendor: config.vendor || "Google Inc.",
    userAgent: config.userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    screen: config.screen || "1920x1080",
    colorDepth: config.colorDepth || 24,
    language: config.language || "zh-CN",
    timezone: config.timezone || -8,
    // canvas, webgl 等指纹参数
    ...config.extraEnv
  };

  const envJson = JSON.stringify(envParams);
  
  // AES 密钥生成: 66位随机大数组 → 取前16字节
  // 注意: 4.2.0 版本密钥可能是动态的, 需要进一步确认
  const keySeed = config.aesKey || generateRandomKey(66);
  const aesKey = Buffer.from(keySeed.slice(0, 16));
  const aesIv = Buffer.from(keySeed.slice(16, 32));

  const encrypted = aes_encrypt(envJson, aesKey, aesIv);
  const base64 = encrypted.toString("base64");
  
  return "h1." + base64;
}

function generateRandomKey(length) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * 256));
  }
  return arr;
}

// ═══════════════════════════════════════════
// a5: 从 a6 截取前10位 + a2 时间戳
// ═══════════════════════════════════════════
function get_a5(a6, a2) {
  // a6 前10个字符(去掉 "h1." 前缀后)
  const a6Body = a6.substring(3); // 去掉 "h1."
  const a6Prefix = a6Body.substring(0, 10);
  
  // 拼接 a6前缀 + a2时间戳, 再通过 kV 函数生成
  const combined = a6Prefix + a2;
  
  // kV 函数: 将字符串转为特定格式
  // 注意: 实际实现中 kV 可能更复杂, 需要根据 VM 行为调整
  return combined;
}

// ═══════════════════════════════════════════
// a8: 三数组 XOR
// ═══════════════════════════════════════════
function get_a8(a5_arr16, a6_arr16, a8_fixed_arr16) {
  let a8 = "";
  for (let i = 0; i < 16; i++) {
    const v1 = a5_arr16[i] ^ a6_arr16[i];
    const v2 = v1 ^ a8_fixed_arr16[i];
    const hex = v2.toString(16);
    a8 += hex.length === 1 ? "0" + hex : hex;
  }
  return a8;
}

// a8 固定数组 (从逆向分析中提取, 4.2.0 版本可能不同)
const A8_FIXED = [115, 77, 208, 7, 220, 219, 190, 23, 10, 174, 113, 15, 83, 31, 108, 51];

// ═══════════════════════════════════════════
// a10: 2位随机 hex
// ═══════════════════════════════════════════
function get_a10() {
  const hex = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < 2; i++) {
    result += hex[Math.floor(Math.random() * 16)];
  }
  return result;
}

// ═══════════════════════════════════════════
// d1: 拼接所有字段 → MD5 → XOR → hex
// ═══════════════════════════════════════════
function get_d1(params) {
  const { a1, a3, a5, a6, a8, a10, a9 } = params;
  
  // 拼接字符串
  const concat = `4${a1}${a2_val}${a3}${a5}${a6}${a8}${a9}${a10}`;
  
  // 转为 Uint8Array (通过 kK 函数)
  const bytes = kK(concat);
  const uint8 = new Uint8Array(bytes);
  
  // MD5 得到 table string
  const table = md5(uint8);
  
  // XOR with temp array
  const tempArr = params.d1_temp || [
    55, 63, 160, 244, 222, 253, 77, 56, 156, 75, 165, 121, 198, 117, 170, 115
  ];
  
  const resultArr = [];
  for (let i = 0; i < table.length; i += 2) {
    const hexByte = parseInt("0x" + table.charAt(i) + table.charAt(i + 1));
    const xored = tempArr[i / 2] ^ hexByte;
    resultArr.push(xored);
  }
  
  // 转 hex string
  let d1 = "";
  for (const v of resultArr) {
    const hex = v.toString(16);
    d1 += hex.length === 1 ? "0" + hex : hex;
  }
  return d1;
}

// kK: string → byte array (UTF-8 like encoding)
function kK(str) {
  const encoded = encodeURIComponent(str);
  const result = [];
  for (let i = 0; i < encoded.length; i++) {
    if (encoded.charAt(i) === "%") {
      const hex = encoded.charAt(i + 1) + encoded.charAt(i + 2);
      result.push(parseInt(hex, 16));
      i += 2;
    } else {
      result.push(encoded.charCodeAt(i));
    }
  }
  return result;
}

// ═══════════════════════════════════════════
// a2_val: 全局变量 (需要在生成时设置)
// ═══════════════════════════════════════════
let a2_val = Date.now();

// ═══════════════════════════════════════════
// 主入口: 生成完整 mtgsig
// ═══════════════════════════════════════════
function generateMtgsig(options = {}) {
  a2_val = Date.now();
  
  const a1 = "1.2";
  const a2 = a2_val;
  const a3 = options.dfpId || get_a3();
  const a9 = `4.2.0,7,${Math.floor(Math.random() * 256)}`;
  const a10 = get_a10();
  const x0 = 4;
  
  // a6: AES 加密环境参数
  const a6 = get_a6(a3, options);
  
  // a5: 从 a6 截取
  const a5 = get_a5(a6, a2);
  
  // a8: 需要 a5_arr16 和 a6_arr16 (动态生成, 这里先用占位)
  // 注意: 这两个数组需要从 VM 执行过程中提取
  const a5_arr16 = options.a5_arr16 || new Array(16).fill(0);
  const a6_arr16 = options.a6_arr16 || new Array(16).fill(0);
  const a8 = get_a8(a5_arr16, a6_arr16, A8_FIXED);
  
  // d1: 拼接 → MD5 → XOR
  const d1 = get_d1({ a1, a3, a5, a6, a8, a10, a9, d1_temp: options.d1_temp });
  
  const mtgsig = { a1, a2, a3, a5, a6, a8, a9, a10, x0, d1 };
  return JSON.stringify(mtgsig);
}

// ═══════════════════════════════════════════
// 验证模式: 对比浏览器签名
// ═══════════════════════════════════════════
function verifyAgainstBrowser(browserSample, options = {}) {
  console.log("=== mtgsig 验证 ===");
  console.log("浏览器签名:");
  console.log(`  a2: ${browserSample.a2}`);
  console.log(`  a5: ${browserSample.a5?.substring(0, 40)}...`);
  console.log(`  a8: ${browserSample.a8}`);
  console.log(`  d1: ${browserSample.d1}`);
  
  // 验证 a3 格式
  const a3 = options.dfpId || get_a3();
  console.log(`\n生成的 a3: ${a3}`);
  console.log(`浏览器 a3: ${browserSample.a3 || "N/A"}`);
  
  // 验证 a10 格式
  const a10 = get_a10();
  console.log(`\n生成的 a10: ${a10} (应为2位hex)`);
  
  // 验证 kK 函数
  const testStr = "41.2test";
  const testBytes = kK(testStr);
  console.log(`\nkK("${testStr}") = [${testBytes.join(",")}]`);
}

// ═══════════════════════════════════════════
// CLI 入口
// ═══════════════════════════════════════════
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args[0] === "verify") {
    // 验证模式
    const sampleFile = args[1];
    if (sampleFile) {
      const sample = JSON.parse(require("fs").readFileSync(sampleFile, "utf8"));
      verifyAgainstBrowser(sample);
    } else {
      // 使用内置样本
      const sample = {
        a2: 1779690637209,
        a3: "805zzu6yz53v53v119w881v2w406vz6780v4wzv844497958y715u41y",
        a5: "hOcPGqkyFxjGUD1hHxsGJ93rNOOdfafDaHOQEb8xRxVg8xJD/dPmzpcXKlJ8l+O0G7/AeClzfcJSccgw88xcm+fA5TvOUBS8mBJ4x1OKmtKbvFPu0DgtRD7VlLd4lW==",
        a8: "fc49446060561fdbc9e3c425a7dd64b0",
        d1: "a4834910f53562421526d06951b62b46"
      };
      verifyAgainstBrowser(sample, { dfpId: sample.a3 });
    }
  } else if (args[0] === "generate") {
    // 生成模式
    const mtgsig = generateMtgsig({
      dfpId: args[1] || undefined
    });
    console.log(mtgsig);
  } else {
    console.log("用法:");
    console.log("  node mtgsig-signer.js generate [dfpId]");
    console.log("  node mtgsig-signer.js verify [sample.json]");
  }
}

module.exports = { generateMtgsig, get_a3, get_a6, get_a5, get_a8, get_d1, md5, kK };

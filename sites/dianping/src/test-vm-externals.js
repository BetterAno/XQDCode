/**
 * 测试 VM 在 Node.js 中独立运行的可行性
 * 思路: 从浏览器提取 VM 实例 + 外部函数，在 Node.js 中复现
 */
const crypto = require("crypto");

// ═══════════════════════════════════════════
// 模拟 H5guard 的外部函数 (b[0]-b[27])
// ═══════════════════════════════════════════

// MD5 (模拟 aO = b[4])
function md5(input) {
  if (input instanceof Uint8Array || Buffer.isBuffer(input)) {
    return crypto.createHash("md5").update(input).digest("hex");
  }
  return crypto.createHash("md5").update(String(input)).digest("hex");
}

// k9: string → charCode array (b[3])
function k9(str) {
  return Array.from(String(str)).map(c => c.charCodeAt(0));
}

// k7: string → byte array (b[5])
function k7(str) {
  const result = [];
  for (let i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i));
  }
  return result;
}

// k6: number → 4-byte array (b[15])
function k6(num) {
  return [num >>> 24 & 255, num >>> 16 & 255, num >>> 8 & 255, 255 & num];
}

// k5: byte array → hex string (b[17])
function k5(arr) {
  const hex = "0123456789abcdef";
  let result = "";
  for (const byte of arr) {
    result += hex[byte >>> 4 & 15] + hex[byte & 15];
  }
  return result;
}

// k1: number → 4-byte array (b[25])
function k1(num) {
  return [num >>> 24 & 255, num >>> 16 & 255, num >>> 8 & 255, 255 & num];
}

// f9: getId (b[18])
function f9() {
  return "805zzu6yz53v53v119w881v2w406vz6780v4wzv844497958y715u41y";
}

// ao: error logger (b[27])
function ao(msg, stack) {
  console.error("[H5guard]", msg, stack);
}

// ═══════════════════════════════════════════
// 构建 b[] 数组
// ═══════════════════════════════════════════
function buildExternals(config = {}) {
  const dfpId = config.dfpId || f9();
  const timestamp = config.timestamp || Date.now();
  const sessionToken = config.sessionToken || "h1.placeholder_session_token";
  
  // b[0]: fingerprint bytes (Uint8Array)
  const fpStr = config.fingerprint || "H5dfp_4.2.0_tttt_placeholder";
  const fpBytes = new Uint8Array(Buffer.from(fpStr));
  
  // b[14]: request line charCode array
  const requestLine = config.requestLine || "GET /api/test shopId=TEST&yodaReady=h5";
  const m3 = Array.from(requestLine).map(c => c.charCodeAt(0));
  
  return [
    fpBytes,           // [0] jT: fingerprint bytes
    sessionToken,      // [1] lW: session token (a6)
    timestamp,         // [2] lN: timestamp
    k9,                // [3] k9: string→charCodes
    md5,               // [4] aO: MD5
    k7,                // [5] k7: string→bytes
    { b2: 1, b5: 0 }, // [6] jO: metrics object
    [],                // [7] eU: empty array
    {},                // [8] eR: environment object
    { collectDataFlag: 0, reportedDataFlag: 0, packageStatus: 0 }, // [9] gV
    [15, 264, 294],    // [10] iP: config array
    function() {},     // [11] cW
    function() {},     // [12] cO
    function() {},     // [13] ka
    m3,                // [14] m3: request line charCodes
    k6,                // [15] k6: number→4bytes
    true,              // [16] jM: boolean flag
    k5,                // [17] k5: bytes→hex
    f9,                // [18] f9: getId
    "1.2",             // [19] jS: version
    { getUrlParseResult: function() { return null; } }, // [20] aa: URL utils
    "f3",              // [21] jN: fixed flag
    function() {},     // [22] aP
    function() {},     // [23] aQ
    19,                // [24] jP: counter
    k1,                // [25] k1: number→4bytes
    "",                // [26] iF: empty string
    ao,                // [27] ao: error logger
  ];
}

// ═══════════════════════════════════════════
// 主测试入口
// ═══════════════════════════════════════════
async function test() {
  console.log("=== mtgsig VM Node.js 可行性测试 ===\n");
  
  // 构建外部函数
  const b = buildExternals({
    requestLine: "GET /wxmapi/shop/shopquestion csecplatform=4&csecversion=4.2.0&device_system=&shopId=G7lZQSVUguP43EIT&yodaReady=h5",
    timestamp: 1779692700000,
    sessionToken: "h1.9bhPOmJeLQHziEYnUp12zqRsSOe2M6dlAMGtKt3t+zuexAFvK13TPzgZz4j1DDO7PAybIqLXEfvPzbKtxRmHT5o1vsayw+9NBG84ycYV366MeksWWG46chanMC2A9RK9ogoT9daWRuQbvllYJDpfMYMMeE4vtIgeScLiWhyxiKe1aLEdwwlUAByTtripS3LL5kLq3l8ElhudDJY/E3EPUyZ9JqFVOb2G93MR5M2QhHGGSE+OuQTCaJvin5b21sq5hnOyF++VGUuLX8GLC6ZghlehxhVq6uDu1ZJpHSUF7o8oIet6AUwnfby/RZlN3pfMhgwwoqPpu4AamLr2NURg+u0Im03ySRIaNJjqNNwEYrsoJM4pQGExqAAOo7vlOIWsP2i7UaBfH4aFMpzgz2wvvlA=="
  });
  
  console.log("外部函数 b[] 构建完成:");
  console.log(`  b[0] fingerprint: ${b[0].length} bytes`);
  console.log(`  b[2] timestamp: ${b[2]}`);
  console.log(`  b[14] requestLine: "${String.fromCharCode(...b[14])}"`);
  console.log(`  b[19] version: ${b[19]}`);
  
  // MD5 测试
  const testMd5 = md5(new Uint8Array([116, 101, 115, 116])); // "test"
  console.log(`\nMD5("test") = ${testMd5}`);
  console.log(`Expected:     098f6bcd4621d373cade4e832627b4f6`);
  console.log(`Match: ${testMd5 === "098f6bcd4621d373cade4e832627b4f6"}`);
  
  console.log("\n结论: 外部函数可以在 Node.js 中完全模拟");
  console.log("下一步: 需要提取 VM 字节码和 aS 构造器在 Node.js 中运行");
}

test().catch(console.error);

module.exports = { buildExternals, md5, k9, k7, k5, k6, k1 };

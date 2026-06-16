/**
 * 测试纯算签名器 - 运行 VM 获取完整 mtgsig
 */
const crypto = require("crypto");
const fs = require("fs");

// ═══════════════════════════════════════════
// 1. 加载 VM 引擎
// ═══════════════════════════════════════════
const vmCode = fs.readFileSync(
  "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\src\\aS_vm.js",
  "utf8"
);
const bytecode = fs.readFileSync(
  "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\mtgsig_bc.txt",
  "utf8"
);

// 兼容环境
const compatPrefix = `
if(typeof window==="undefined"){var window=global;}
if(typeof self==="undefined"){var self=global;}
if(typeof globalThis==="undefined"){var globalThis=global;}
function z(v){return typeof v};
global.navigator={userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",platform:"Win32",language:"zh-CN",languages:["zh-CN","zh"],cookieEnabled:true,hardwareConcurrency:8,deviceMemory:8,webdriver:false,plugins:[],mimeTypes:[],maxTouchPoints:0,vendor:"Google Inc.",productSub:"20030107",appVersion:"5.0",appCodeName:"Mozilla",appName:"Netscape",onLine:true};
global.location={href:"https://m.dianping.com/",protocol:"https:",host:"m.dianping.com",hostname:"m.dianping.com",pathname:"/",search:"",hash:"",ancestorOrigins:{}};
global.document={cookie:"",referrer:"",title:"大众点评",createElement:function(tag){return{style:{},getContext:function(){return null},toDataURL:function(){return""}}},getElementsByTagName:function(){return[]},documentElement:{style:{}}};
global.screen={width:1920,height:1080,colorDepth:24,availWidth:1920,availHeight:1040,pixelDepth:24};
global.performance={now:function(){return Date.now()},timing:{navigationStart:Date.now()-1000}};
`;

const loadVm = new Function(compatPrefix + vmCode + "\n; return { aS: aS, c: c };");
const { aS, c } = loadVm();

// ═══════════════════════════════════════════
// 2. 从浏览器捕获数据中提取 b1 (a6 = 会话令牌)
// ═══════════════════════════════════════════
// 加载真实 b[] 数据（从浏览器闭包捕获）
const bData = JSON.parse(fs.readFileSync(
  "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\src\\b_array_data.json",
  "utf8"
));
const realBData = JSON.parse(fs.readFileSync(
  "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\src\\real_b_data.json",
  "utf8"
));
const capturedMtgsig = JSON.parse(realBData.mtgsig);

console.log("=== 输入数据 ===");
console.log("jQ (session token):", bData.jQ.substring(0, 60) + "...");
console.log("jR (short token):", bData.jR.substring(0, 60) + "...");
console.log("jT fingerprint: 66x16=" + bData.jT.length * bData.jT[0].length + " bytes");
console.log("jO state:", JSON.stringify(bData.jO));
console.log("a3 dfpId:", capturedMtgsig.a3);
console.log();

// ═══════════════════════════════════════════
// 3. 工具函数（与浏览器中一致）
// ═══════════════════════════════════════════
function md5(input) {
  if (Buffer.isBuffer(input)) return crypto.createHash("md5").update(input).digest("hex");
  return crypto.createHash("md5").update(String(input)).digest("hex");
}

function k9(str) {
  return Array.from(String(str)).map(c => c.charCodeAt(0));
}

function k7(str) {
  return Array.from(String(str)).map(c => c.charCodeAt(0));
}

function k6(num) {
  return [num >>> 24 & 255, num >>> 16 & 255, num >>> 8 & 255, 255 & num];
}

function k5(arr) {
  const hex = "0123456789abcdef";
  let r = "";
  for (const b of arr) { r += hex[b >>> 4 & 15] + hex[b & 15]; }
  return r;
}

function k1(num) {
  return [num >>> 24 & 255, num >>> 16 & 255, num >>> 8 & 255, 255 & num];
}

function f9() {
  return capturedMtgsig.a3;
}

function ao() {}

function kK(str) {
  const encoded = encodeURIComponent(str);
  const result = [];
  for (let i = 0; i < encoded.length; i++) {
    if (encoded.charAt(i) === "%") {
      result.push(parseInt(encoded.charAt(i + 1) + encoded.charAt(i + 2), 16));
      i += 2;
    } else {
      result.push(encoded.charCodeAt(i));
    }
  }
  return result;
}

// ═══════════════════════════════════════════
// 4. 构建 b[] 数组
// ═══════════════════════════════════════════
const timestamp = Date.now();
const requestLine = "GET /wxmapi/shop/shopquestion csecplatform=4&csecversion=4.2.0&device_system=&shopId=G7lZQSVUguP43EIT&yodaReady=h5";
const m3 = k9(requestLine);

// CRC32/MurmurHash (ka)
function ka(lJ, lK) {
  for (var lO, lL = lJ.length, lM = lK ^ lL, lN = 0, lP = 1540483477; lL >= 4;) {
    lO = (255 & lJ[lN]) | (255 & lJ[++lN]) << 8 | (255 & lJ[++lN]) << 16 | (255 & lJ[++lN]) << 24;
    lO = Math.imul(lO, lP);
    lO = (lO & 0xFFFF) << 16 | lO >>> 16;
    lO = Math.imul(lO, lP);
    lM ^= lO;
    lM = (lM & 0xFFFF) << 16 | lM >>> 16;
    lM = Math.imul(lM, 2) + (lM >>> 31);
    lL -= 4;
    ++lN;
  }
  if (lL) {
    lO = 0;
    for (var lQ = 0; lQ < lL; lQ++) lO |= lJ[lN + lQ] << 8 * lQ;
    lO = Math.imul(lO, lP);
    lO = (lO & 0xFFFF) << 16 | lO >>> 16;
    lO = Math.imul(lO, lP);
    lM ^= lO;
  }
  lM ^= lM >>> 13;
  lM = Math.imul(lM, lP);
  lM ^= lM >>> 15;
  return lM >>> 0;
}

// 签名状态对象 (jO)
const jO = {
  b0: "1.0",
  b1: 0,
  b5: 0,
  b6: 0,
  b3: "4.2.0",
  b7: 0,
  b8: 0,
  b9: 1,
  b10: 0,
  b2: 0,
};

// 从捕获数据构建真实指纹 jT → Uint8Array(1056)
const jTFingerprint = new Uint8Array(1056);
for (let i = 0; i < bData.jT.length; i++) {
  const row = bData.jT[i];
  for (let j = 0; j < row.length; j++) {
    jTFingerprint[i * 16 + j] = row[j] & 0xFF;
  }
}

// 其他 b[] 值 - 模拟浏览器中的值
const b = [
  jTFingerprint,                             // b[0] 真实设备指纹
  bData.jQ,                                  // b[1] 真实会话令牌 (jQ)
  timestamp,                                 // b[2] 时间戳
  k9,                                        // b[3]
  md5,                                       // b[4] aO = MD5
  k7,                                        // b[5]
  bData.jO,                                  // b[6] 真实签名状态
  [],                                        // b[7] eU = 空数组
  bData.eR,                                  // b[8] 真实VM环境
  bData.gV,                                  // b[9] 真实数据状态
  bData.iP,                                  // b[10] 真实版本数组
  () => 0,                                   // b[11] cW
  () => 0,                                   // b[12] cO
  ka,                                        // b[13] CRC32
  m3,                                        // b[14] 请求行编码
  k6,                                        // b[15]
  bData.jM,                                  // b[16] 真实jM
  k5,                                        // b[17]
  f9,                                        // b[18] getId
  bData.jS,                                  // b[19] 真实版本
  { getUrlParseResult: () => null },          // b[20] aa modules
  bData.jN,                                  // b[21] 真实随机hex
  () => 0,                                   // b[22] aP
  () => 0,                                   // b[23] aQ
  bData.jP,                                  // b[24] 真实计数器
  k1,                                        // b[25]
  bData.iF,                                  // b[26] 真实iF
  ao,                                        // b[27]
];

const hash = "dfdb71b1fa2738418bb11c4f7d70fb2c";

// ═══════════════════════════════════════════
// 5. 运行 VM
// ═══════════════════════════════════════════
console.log("=== 运行 VM ===");

try {
  const vmInstance = new aS(bytecode, b, hash);
  
  // 初始化
  const scope0 = {};
  scope0["this"] = scope0;
  const initResult = vmInstance.run("@0", [], scope0);
  console.log("初始化结果:", JSON.stringify(initResult));
  
  // 生成 mtgsig
  const scope1 = {};
  scope1["this"] = scope1;
  const vmResult = vmInstance.run("$_g5Lc", [], scope1);
  
  console.log("\n=== VM 输出 ===");
  console.log("类型:", typeof vmResult);
  console.log("Keys:", vmResult ? Object.keys(vmResult).join(", ") : "null");
  
  if (vmResult && typeof vmResult === 'object') {
    console.log("\n完整输出:");
    for (const [k, v] of Object.entries(vmResult)) {
      const display = typeof v === 'string' ? v.substring(0, 80) : JSON.stringify(v);
      console.log(`  ${k}: ${display}`);
    }
  } else {
    console.log("原始值:", JSON.stringify(vmResult));
  }
  
  // 与浏览器输出对比
  console.log("\n=== 与浏览器输出对比 ===");
  if (vmResult && vmResult.a6) {
    console.log("VM a6:", vmResult.a6.substring(0, 60) + "...");
    console.log("浏览器 a6:", capturedMtgsig.a6.substring(0, 60) + "...");
    console.log("a6 匹配:", vmResult.a6 === capturedMtgsig.a6);
  }
  if (vmResult && vmResult.a8) {
    console.log("VM a8:", vmResult.a8);
    console.log("浏览器 a8:", capturedMtgsig.a8);
    console.log("a8 匹配:", vmResult.a8 === capturedMtgsig.a8);
  }
  
  // 如果 VM 返回完整 JSON，验证 d1
  if (vmResult && vmResult.d1) {
    const concat = `4${vmResult.a1}${vmResult.a2}${vmResult.a3}${vmResult.a5}${vmResult.a6}${vmResult.a8}${vmResult.a9}${vmResult.a10}`;
    const concatBytes = new Uint8Array(kK(concat));
    const md5Hex = md5(concatBytes);
    console.log("\nd1 验证:");
    console.log("concat MD5:", md5Hex);
    console.log("VM d1:", vmResult.d1);
    
    // Reconstruct d1_fixed
    const d1Fixed = [];
    for (let i = 0; i < 16; i++) {
      const md5Byte = parseInt("0x" + md5Hex.charAt(i * 2) + md5Hex.charAt(i * 2 + 1));
      const d1Byte = parseInt("0x" + vmResult.d1.charAt(i * 2) + vmResult.d1.charAt(i * 2 + 1));
      d1Fixed.push(md5Byte ^ d1Byte);
    }
    console.log("d1_fixed:", JSON.stringify(d1Fixed));
  }

} catch (e) {
  console.error("VM 运行错误:", e.message);
  console.error("Stack:", e.stack);
}

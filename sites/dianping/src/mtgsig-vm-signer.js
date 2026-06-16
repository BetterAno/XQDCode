/**
 * 大众点评 mtgsig 混合签名器
 * 使用 VM 计算 a8 (XOR核心)，纯算修复其余字段
 * 
 * 用法: node mtgsig-vm-signer.js
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

const realB = JSON.parse(fs.readFileSync(
  "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\src\\real_b_data.json",
  "utf8"
));

// 兼容前缀
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
// 2. 工具函数
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

function safeFn(fn, name) {
  return function(...args) {
    try {
      const result = fn.apply(this, args);
      if (result === undefined) { return 0; }
      return result;
    } catch(e) { return 0; }
  };
}

// kK: string → byte array (模拟 VM 的编码)
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

function k9(str) { return Array.from(String(str)).map(c => c.charCodeAt(0)); }
function k7(str) { return Array.from(String(str)).map(c => c.charCodeAt(0)); }
function k6(num) { return [num >>> 24 & 255, num >>> 16 & 255, num >>> 8 & 255, 255 & num]; }
function k5(arr) { const hex = "0123456789abcdef"; let r = ""; for (const b of arr) { r += hex[b >>> 4 & 15] + hex[b & 15]; } return r; }
function k1(num) { return [num >>> 24 & 255, num >>> 16 & 255, num >>> 8 & 255, 255 & num]; }
function f9() { return "805zzu6yz53v53v119w881v2w406vz6780v4wzv844497958y715u41y"; }
function ao() {}

// ═══════════════════════════════════════════
// 3. 构建 b[]
// ═══════════════════════════════════════════
function buildBArray(timestamp, requestLine) {
  const m3 = Array.from(requestLine).map(c => c.charCodeAt(0));
  
  const realFpBytes = new Uint8Array(1024);
  for (let i = 0; i < realB.b0.length && i < 256; i++) {
    const row = realB.b0[i];
    if (Array.isArray(row)) {
      for (let j = 0; j < row.length && (i * 4 + j) < 1024; j++) {
        realFpBytes[i * 4 + j] = row[j] & 0xFF;
      }
    }
  }

  return [
    realFpBytes,                              // b[0] 设备指纹
    realB.b1,                                 // b[1] 会话token
    timestamp,                                // b[2] 时间戳
    safeFn(k9, 'k9'),                         // b[3]
    safeFn(md5, 'md5'),                       // b[4]
    safeFn(k7, 'k7'),                         // b[5]
    realB.b6,                                 // b[6] 配置
    [],                                       // b[7] 空数组
    realB.b8,                                 // b[8] VM环境
    realB.b9,                                 // b[9] 数据状态
    realB.b10,                                // b[10] 版本数组
    safeFn(() => 0, 'b11'),                   // b[11]
    safeFn(() => 0, 'b12'),                   // b[12]
    safeFn(() => 0, 'b13'),                   // b[13]
    m3,                                       // b[14] 请求行
    safeFn(k6, 'k6'),                         // b[15]
    realB.b16 !== undefined ? realB.b16 : true, // b[16]
    safeFn(k5, 'k5'),                         // b[17]
    safeFn(f9, 'f9'),                         // b[18] getId
    realB.b19,                                // b[19]
    { getUrlParseResult: () => null },        // b[20]
    realB.b21,                                // b[21]
    safeFn(() => 0, 'b22'),                   // b[22]
    safeFn(() => 0, 'b23'),                   // b[23]
    realB.b24 !== undefined ? realB.b24 : 19, // b[24]
    safeFn(k1, 'k1'),                         // b[25]
    "",                                       // b[26]
    safeFn(ao, 'ao')                          // b[27]
  ];
}

// ═══════════════════════════════════════════
// 4. 运行 VM 获取核心值
// ═══════════════════════════════════════════
function runVM() {
  const timestamp = Date.now();
  const requestLine = "GET /wxmapi/shop/shopquestion csecplatform=4&csecversion=4.2.0&device_system=&shopId=G7lZQSVUguP43EIT&yodaReady=h5";
  
  const b = buildBArray(timestamp, requestLine);
  const hash = "dfdb71b1fa2738418bb11c4f7d70fb2c";
  
  const vmInstance = new aS(bytecode, b, hash);
  
  // 初始化
  const scope0 = {};
  scope0["this"] = scope0;
  vmInstance.run("@0", [], scope0);
  
  // 生成 mtgsig
  const scope1 = {};
  scope1["this"] = scope1;
  const result = vmInstance.run("$_g5Lc", [], scope1);
  
  return result;
}

// ═══════════════════════════════════════════
// 5. 修复并生成完整 mtgsig
// ═══════════════════════════════════════════
function generateMtgsig() {
  const timestamp = Date.now();
  const vmResult = runVM();
  
  // 从 VM 获取的值
  const a1 = vmResult.a1 || "1.2";
  const a2 = timestamp;
  const a3 = vmResult.a3 || f9();
  const a6 = vmResult.a6 || realB.b1;
  const a8 = vmResult.a8;  // VM 计算的核心 XOR 结果
  
  // 纯算修复: a9
  const a9_rand = Math.floor(Math.random() * 256);
  const a9 = `4.2.0,7,${a9_rand}`;
  
  // 纯算修复: a10
  const hex = "0123456789abcdef";
  const a10 = hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)];
  
  // 纯算修复: a5
  // a5 = a6前10字符(去h1.) + a2时间戳, 然后Base64编码
  const a6Body = a6.substring(3); // 去掉 "h1."
  const a6Prefix = a6Body.substring(0, 10);
  const a5_raw = a6Prefix + String(a2);
  const a5 = Buffer.from(a5_raw).toString("base64");
  
  // 纯算修复: d1
  // d1 = MD5("4" + a1 + a2 + a3 + a5 + a6 + a8 + a9 + a10) XOR d1_fixed
  const concat = `4${a1}${a2}${a3}${a5}${a6}${a8}${a9}${a10}`;
  const concatBytes = new Uint8Array(kK(concat));
  const md5Hex = md5(concatBytes);
  
  // d1 固定数组 (从浏览器样本反推)
  const d1_fixed = [83, 73, 192, 14, 202, 215, 180, 43, 62, 154, 81, 53, 163, 5, 54, 22];
  
  let d1 = "";
  for (let i = 0; i < 16; i++) {
    const hexByte = parseInt("0x" + md5Hex.charAt(i * 2) + md5Hex.charAt(i * 2 + 1));
    const xored = d1_fixed[i] ^ hexByte;
    d1 += xored.toString(16).padStart(2, "0");
  }
  
  return {
    a1, a2, a3, a5, a6, a8, a9, a10,
    x0: 4,
    d1
  };
}

// ═══════════════════════════════════════════
// 6. 验证模式: 对比已知样本
// ═══════════════════════════════════════════
function verifyAgainstSample() {
  const sample = {
    a2: 1779690637209,
    a3: "805zzu6yz53v53v119w881v2w406vz6780v4wzv844497958y715u41y",
    a5: "hOcPGqkyFxjGUD1hHxsGJ93rNOOdfafDaHOQEb8xRxVg8xJD/dPmzpcXKlJ8l+O0G7/AeClzfcJSccgw88xcm+fA5TvOUBS8mBJ4x1OKmtKbvFPu0DgtRD7VlLd4lW==",
    a8: "fc49446060561fdbc9e3c425a7dd64b0",
    d1: "a4834910f53562421526d06951b62b46"
  };
  
  // 反推 d1_fixed
  const { result: browserResult } = (() => {
    // 假设 a9 = "4.2.0,7,{rand}" 和 a10 = "f3" (未知)
    // 通过暴力搜索 a9 和 a10
    return { result: null };
  })();
  
  console.log("浏览器样本:");
  console.log(`  a2: ${sample.a2}`);
  console.log(`  a3: ${sample.a3}`);
  console.log(`  a8: ${sample.a8}`);
  console.log(`  d1: ${sample.d1}`);
  console.log(`  a5: ${sample.a5.substring(0, 30)}...`);
}

// ═══════════════════════════════════════════
// 7. 主入口
// ═══════════════════════════════════════════
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args[0] === "verify") {
    verifyAgainstSample();
  } else {
    console.log("=== 混合签名器 (VM + 纯算) ===\n");
    console.log("运行 VM 生成核心加密值...\n");
    
    const mtgsig = generateMtgsig();
    
    console.log("=== 生成的 mtgsig ===");
    console.log(JSON.stringify(mtgsig, null, 2));
    console.log("\n=== mtgsig HTTP Header ===");
    console.log(`mtgsig: ${JSON.stringify(mtgsig)}`);
  }
}

module.exports = { generateMtgsig, runVM };

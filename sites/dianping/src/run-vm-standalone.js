/**
 * 在 Node.js 中独立运行 H5guard aS VM 生成 mtgsig
 * 纯算方案 - 不依赖浏览器
 * 方案: 使用 new Function() 在当前作用域执行 aS_vm.js, 避免 vm.createContext 沙箱问题
 */
const crypto = require("crypto");
const fs = require("fs");

// 1. 加载提取的 VM 引擎 (使用 new Function 在当前全局作用域执行)
const vmCode = fs.readFileSync(
  "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\src\\aS_vm.js",
  "utf8"
);

// 2. 加载 mtgsig 字节码
const bytecode = fs.readFileSync(
  "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\mtgsig_bc.txt",
  "utf8"
);

// 3. 模拟外部函数
function md5(input) {
  if (input instanceof Uint8Array || Buffer.isBuffer(input)) {
    return crypto.createHash("md5").update(input).digest("hex");
  }
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
  let result = "";
  for (const byte of arr) {
    result += hex[byte >>> 4 & 15] + hex[byte & 15];
  }
  return result;
}

function k1(num) {
  return [num >>> 24 & 255, num >>> 16 & 255, num >>> 8 & 255, 255 & num];
}

function f9() {
  return "805zzu6yz53v53v119w881v2w406vz6780v4wzv844497958y715u41y";
}

function ao(msg, stack) { /* silent */ }

// 4. 使用 new Function 在当前全局作用域执行 aS_vm.js
//    这样 Date, Buffer, crypto, Uint8Array 等都天然可用
//    先注入浏览器兼容全局变量 (window/self/globalThis)
console.log("=== aS VM Node.js 独立运行测试 (new Function 方案) ===\n");

const compatPrefix = `
if(typeof window==="undefined"){var window=global;}
if(typeof self==="undefined"){var self=global;}
if(typeof globalThis==="undefined"){var globalThis=global;}
function z(v){return typeof v};
global.navigator={userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",platform:"Win32",language:"zh-CN",languages:["zh-CN","zh"],cookieEnabled:true,hardwareConcurrency:8,deviceMemory:8,webdriver:false,plugins:[],mimeTypes:[],maxTouchPoints:0,vendor:"Google Inc.",productSub:"20030107",appVersion:"5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",appCodeName:"Mozilla",appName:"Netscape",onLine:true};
global.location={href:"https://m.dianping.com/",protocol:"https:",host:"m.dianping.com",hostname:"m.dianping.com",pathname:"/",search:"",hash:"",ancestorOrigins:{}};
global.document={cookie:"",referrer:"",title:"大众点评",createElement:function(tag){return{style:{},getContext:function(){return null},toDataURL:function(){return""}}},getElementsByTagName:function(){return[]},documentElement:{style:{}}};
global.screen={width:1920,height:1080,colorDepth:24,availWidth:1920,availHeight:1040,pixelDepth:24};
global.performance={now:function(){return Date.now()},timing:{navigationStart:Date.now()-1000}};
// 追踪缺失的全局变量
var _realGlobal=global;
global=new Proxy(_realGlobal,{
  get(t,p){
    var v=t[p];
    if(v===undefined && typeof p==='string' && !p.startsWith('_') && p!=='Proxy' && p!=='Reflect' && p!=='console'){
      console.log('[MISSING] global.'+p);
    }
    return v;
  }
});
`;

const loadVm = new Function(compatPrefix + vmCode + "\n; return { aS: aS, c: c };");
const { aS, c } = loadVm();

console.log(`aS type: ${typeof aS}`);
console.log(`bytecode length: ${bytecode.length}`);
console.log(`c(3371) = "${c(3371)}"`);

// 5. 构建 b[] 外部函数数组
const timestamp = Date.now();
const requestLine = "GET /wxmapi/shop/shopquestion csecplatform=4&csecversion=4.2.0&device_system=&shopId=G7lZQSVUguP43EIT&yodaReady=h5";
const m3 = Array.from(requestLine).map(c => c.charCodeAt(0));

const fpStr = "H5dfp_4.2.0_tttt_placeholder_fingerprint_data";
const fpBytes = new Uint8Array(Buffer.from(fpStr));

const sessionToken = "h1.9bhPOmJeLQHziEYnUp12zqRsSOe2M6dlAMGtKt3t+zuexAFvK13TPzgZz4j1DDO7PAybIqLXEfvPzbKtxRmHT5o1vsayw+9NBG84ycYV366MeksWWG46chanMC2A9RK9ogoT9daWRuQbvllYJDpfMYMMeE4vtIgeScLiWhyxiKe1aLEdwwlUAByTtripS3LL5kLq3l8ElhudDJY/E3EPUyZ9JqFVOb2G93MR5M2QhHGGSE+OuQTCaJvin5b21sq5hnOyF++VGUuLX8GLC6ZghlehxhVq6uDu1ZJpHSUF7o8oIet6AUwnfby/RZlN3pfMhgwwoqPpu4AamLr2NURg+u0Im03ySRIaNJjqNNwEYrsoJM4pQGExqAAOo7vlOIWsP2i7UaBfH4aFMpzgz2wvvlA==";

// 包装函数, 确保所有 b[] 函数不会返回 undefined
function safeFn(fn, name) {
  return function(...args) {
    try {
      const result = fn.apply(this, args);
      if (result === undefined) {
        console.log(`[SAFE] ${name} returned undefined, args:`, args.slice(0, 3));
        return 0;
      }
      return result;
    } catch(e) {
      console.log(`[SAFE] ${name} threw:`, e.message);
      return 0;
    }
  };
}

// 加载真实浏览器采集的 b[] 数据
const realB = JSON.parse(fs.readFileSync(
  "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\src\\real_b_data.json",
  "utf8"
));

// b[0]: 设备指纹 (从真实数据构建)
const realFpBytes = new Uint8Array(1024); // 256个4字节整数
for (let i = 0; i < realB.b0.length && i < 256; i++) {
  const row = realB.b0[i];
  if (Array.isArray(row)) {
    for (let j = 0; j < row.length && (i * 4 + j) < 1024; j++) {
      realFpBytes[i * 4 + j] = row[j] & 0xFF;
    }
  }
}

const bRaw = [
  realFpBytes,       // b[0] 设备指纹字节 (真实数据)
  realB.b1,           // b[1] 会话 token (真实数据)
  timestamp,          // b[2] 时间戳
  safeFn(k9, 'k9'),   // b[3] 字符串→charCode 数组
  safeFn(md5, 'md5'), // b[4] MD5 哈希
  safeFn(k7, 'k7'),   // b[5] 字符串→字节数组
  realB.b6,           // b[6] 配置对象 (真实数据)
  [],                 // b[7] 空数组
  realB.b8,           // b[8] VM环境对象 (真实数据)
  realB.b9,           // b[9] 数据收集状态 (真实数据)
  realB.b10,          // b[10] 版本数组 (真实数据: [21])
  safeFn(() => 0, 'b11'),  // b[11]
  safeFn(() => 0, 'b12'),  // b[12]
  safeFn(() => 0, 'b13'),  // b[13]
  m3,                 // b[14] 请求行 charCode 数组
  safeFn(k6, 'k6'),   // b[15] 数字→4字节数组
  realB.b16 !== undefined ? realB.b16 : true,  // b[16] 标志位
  safeFn(k5, 'k5'),   // b[17] 字节数组→hex字符串
  safeFn(f9, 'f9'),   // b[18] H5guard.getId() → a3
  realB.b19,          // b[19] 版本（真实数据: "1.2"）
  { getUrlParseResult: () => null }, // b[20]
  realB.b21,          // b[21] (真实数据: "27")
  safeFn(() => 0, 'b22'),  // b[22]
  safeFn(() => 0, 'b23'),  // b[23]
  realB.b24 !== undefined ? realB.b24 : 19,  // b[24]
  safeFn(k1, 'k1'),   // b[25] 数字→4字节数组
  "",                 // b[26]
  safeFn(ao, 'ao')    // b[27] 日志函数
];

// 使用 Proxy 追踪 VM 访问了哪些 b[] 索引, 并兜底 undefined 访问
let lastBAccess = -1;
const b = new Proxy(bRaw, {
  get(target, prop) {
    if (typeof prop === 'string' && /^\d+$/.test(prop)) {
      const val = target[prop];
      if (val === undefined) {
        console.log(`[TRACE] b[${prop}] is undefined, returning {}`);
        return {};
      }
      if (prop !== lastBAccess) {
        lastBAccess = prop;
        console.log(`[TRACE] b[${prop}] accessed, type=${typeof val}`);
      }
    }
    return target[prop];
  }
});

console.log(`\nb[] 数组构建成功, length=${b.length}`);

// 6. 创建 VM 实例并初始化
const hash = "dfdb71b1fa2738418bb11c4f7d70fb2c";
console.log(`\n创建 VM 实例...`);

try {
  const vmInstance = new aS(bytecode, b, hash);
  console.log(`VM 创建成功, a=${vmInstance.a}`);
  
  // 初始化 (@0)
  console.log("运行初始化 @0...");
  const scope0 = {};
  scope0["this"] = scope0;
  vmInstance.run("@0", [], scope0);
  console.log(`初始化完成, a=${vmInstance.a}`);
  
  // 注入调试: 拦截 VM 的属性访问以追踪 NaN 错误
const origRun = vmInstance.run;
let callCount = 0;
vmInstance.run = function() {
  callCount++;
  console.log(`[DEBUG] run called #${callCount}, args:`, arguments[0]);
  try {
    return origRun.apply(this, arguments);
  } catch(e) {
    console.log(`[DEBUG] run #${callCount} failed: ${e.message}`);
    // 检查 li 的值
    console.log(`[DEBUG] typeof global:`, typeof global);
    console.log(`[DEBUG] global.NaN:`, global.NaN);
    console.log(`[DEBUG] global.Number:`, typeof global.Number);
    throw e;
  }
};
  const scope1 = {};
  scope1["this"] = scope1;
  const result = vmInstance.run("$_g5Lc", [], scope1);
  
  console.log(`\n=== 生成的 mtgsig ===`);
  console.log(JSON.stringify(result, null, 2));
  
  if (result && result.a1) {
    console.log(`\n✓ 成功! a1=${result.a1}, a2=${result.a2}`);
    console.log(`  a5: ${result.a5 ? result.a5.substring(0, 40) + "..." : "N/A"}`);
    console.log(`  a8: ${result.a8}`);
    console.log(`  d1: ${result.d1}`);
  }
} catch (e) {
  console.error(`\nVM 运行失败: ${e.message}`);
  if (e.stack) console.error(e.stack.substring(0, 800));
}

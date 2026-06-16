/**
 * 测试 a9 第三部分是否与 jP 有关
 */
const fs = require("fs");
const baseDir = "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping";

const bData = JSON.parse(fs.readFileSync(baseDir + "\\src\\b_array_data.json", "utf8"));
const vmCode = fs.readFileSync(baseDir + "\\src\\aS_vm.js", "utf8");
const bytecode = fs.readFileSync(baseDir + "\\assets\\js\\mtgsig_bc.txt", "utf8");

const compatPrefix = `
if(typeof window==="undefined"){var window=global;}
if(typeof self==="undefined"){var self=global;}
if(typeof globalThis==="undefined"){var globalThis=global;}
function z(v){return typeof v};
global.navigator={userAgent:"Mozilla/5.0",platform:"Win32",language:"zh-CN",languages:["zh-CN","zh"],cookieEnabled:true,hardwareConcurrency:8,webdriver:false};
global.location={href:"https://m.dianping.com/",protocol:"https:",host:"m.dianping.com",hostname:"m.dianping.com",pathname:"/"};
global.document={cookie:"",createElement:function(){return{style:{},getContext:function(){return null}}},getElementsByTagName:function(){return[]},documentElement:{style:{}}};
global.screen={width:1920,height:1080,colorDepth:24};
global.performance={now:function(){return Date.now()}};
`;

const loadVm = new Function(compatPrefix + vmCode + "\n; return { aS: aS, c: c };");
const { aS, c } = loadVm();

// === Functions (copied from pure_signer.js) ===
const cQ = ["Z","m","s","e","r","b","B","o","H","Q","t","N","P","+","w","O","c","z","a","/","L","p","n","g","G","8","y","J","q","4","2","K","W","Y","j","0","D","S","f","d","i","k","x","3","V","T","1","6","I","l","U","A","F","M","9","7","h","E","C","v","u","R","X","5"];
function cU(lz) { return cQ[lz >> 18 & 63] + cQ[lz >> 12 & 63] + cQ[lz >> 6 & 63] + cQ[63 & lz]; }
function cV(lz, lA, lB) { const lD = []; for (let lE = lA; lE < lB; lE += 3) { const lC = (lz[lE] << 16 & 16711680) + (lz[lE + 1] << 8 & 65280) + (255 & lz[lE + 2]); lD.push(cU(lC)); } return lD.join(""); }
function cW(lz) { const lB = lz.length; const lC = lB % 3; const lD = []; const lG = lB - lC; for (let lF = 0; lF < lG; lF += 16383) { lD.push(cV(lz, lF, lF + 16383 > lG ? lG : lF + 16383)); } if (1 === lC) { const lA = lz[lB - 1]; lD.push(cQ[lA >> 2] + cQ[lA << 4 & 63] + "=="); } else if (2 === lC) { const lA = (lz[lB - 2] << 8) + lz[lB - 1]; lD.push(cQ[lA >> 10] + cQ[lA >> 4 & 63] + cQ[lA << 2 & 63] + "="); } return lD.join(""); }
function cP(lz, lA, lB) { const lE = []; let lC = 0, lD = 0; const lF = lB.length; for (let lG = 0; lG < lF; lG++) { lD = (lD + lz[lC = (lC + 1) % 256]) % 256; lA = lz[lC]; lz[lC] = lz[lD]; lz[lD] = lA; lE.push(lB.charCodeAt(lG) ^ lz[(lz[lC] + lz[lD]) % 256]); } return lE; }
const $_u_zJ = [6,49,13,0,7,13,0,2,0,13,256,10,15,23,0,27,15,56,15,35,13,0,11,15,0,13,256,10,15,4,57,22,0,14,15,20,15,70,0,70,18,1,13,152,17,80,14,15,37,15,14,15,20,15,13,31,20,15,13,256,37,15,8,15,22,0,14,15,42,15,22,57,14,15,27,15,16,28,15,56,15,86,81,1,22,16,61,62,21,48,39];
function cO(lz, lA) { var lB, lC, lD, lE, p = [], q = function() {}; q = q.call; for (var h = 0;;) { switch ($_u_zJ[h++]) {
  case 0: p.push(lE); continue; case 1: p.push(null); continue; case 2: lE = p.pop(); continue;
  case 4: !p.pop() && (h += 52); continue; case 6: p[p.length - 0] = []; continue;
  case 7: lC = p.pop(); continue; case 8: lC = p[p.length - 1]; continue;
  case 10: p[p.length - 2] = p[p.length - 2] < p[p.length - 1]; continue;
  case 11: lE = p[p.length - 1]; continue; case 13: p.push($_u_zJ[h++]); continue;
  case 14: p[p.length - 2] = p[p.length - 2][p[p.length - 1]]; continue;
  case 15: p.pop(); continue; case 16: p.push(lD); continue;
  case 17: p[p.length - 3] = q.call(p[p.length - 3], p[p.length - 2], p[p.length - 1]); continue;
  case 18: p.push(c); continue; case 20: p[p.length - 2] = p[p.length - 2] + p[p.length - 1]; continue;
  case 21: p.length -= 4; continue; case 22: p.push(lB); continue;
  case 23: !p.pop() && (h += 6); continue; case 27: lB[lE] = p[p.length - 1]; continue;
  case 28: lB[lC] = p[p.length - 1]; continue; case 35: h -= 12; continue;
  case 37: p[p.length - 2] = p[p.length - 2] % p[p.length - 1]; continue;
  case 39: return; case 42: lD = p[p.length - 1]; continue;
  case 48: return p.pop(); case 49: lB = p.pop(); continue;
  case 56: p.push(lE++); continue; case 57: p.push(lC); continue;
  case 61: p.push(lA); continue;
  case 62: p[p.length - 5] = q.call(p[p.length - 5], p[p.length - 4], p[p.length - 3], p[p.length - 2], p[p.length - 1]); continue;
  case 70: p.push(lz); continue; case 80: p.length -= 2; continue;
  case 81: p.push(cP); continue; case 86: h -= 58; continue;
  default: throw new Error("cO: unknown opcode " + $_u_zJ[h - 1]);
}}}
function aL(l9) { const la = (l9 & 65535) + ""; const le = 4 - la.length; let lf = ""; for (let lg = 0; lg < le; lg++) lf += "0"; return lf + la; }
function aM(l9) { for (let la = 0; la < l9.length; la++) l9[la] = aL(l9[la]); return l9.join(""); }
function aR(l9, la) { return l9 << la | l9 >>> 32 - la; }
function aC(le, l9) { let la = le[0], lf = le[1], lg = le[2], li = le[3]; for (let lj = 0; lj < 16; lj++) { const lk = la + lf + lg + li + l9[lj]; la = li; li = lg; lg = lf; lf = lf + aR(lk, 7); } le[0] = (le[0] + la) | 0; le[1] = (le[1] + lf) | 0; le[2] = (le[2] + lg) | 0; le[3] = (le[3] + li) | 0; }
function aJ(l9) { const la = []; for (let le = 0; le < 64; le += 4) { la[le / 4] = l9[le] | l9[le + 1] << 8 | l9[le + 2] << 16 | l9[le + 3] << 24; } return la; }
function aI(l9) { const la = l9.length; const le = [1732584193, -271733879, -1732584194, 271733878]; let lf; for (lf = 64; lf <= la; lf += 64) aC(le, aJ(l9.slice(lf - 64, lf))); const lg = []; l9 = l9.slice(lf - 64); for (lf = 0; lf < l9.length; lf++) lg[lf >> 2] |= l9[lf] << (lf % 4 << 3); lg[lf >> 2] |= 128 << (lf % 4 << 3); if (lf > 55) { aC(le, lg); for (lf = 0; lf < 16; lf++) lg[lf] = 0; } lg[14] = 8 * la; aC(le, lg); return le; }
function aO(l9) { return aM(aI(l9)); }
function aP(l9) { return aI(l9); }
function aQ(l9) { return aM(l9); }
function k9(lJ) { const lK = encodeURIComponent(lJ); const lL = []; for (let lM = 0; lM < lK.length; lM++) { const lN = lK.charAt(lM); if ("%" === lN) { lL.push(parseInt(lK.charAt(lM + 1) + lK.charAt(lM + 2), 16)); lM += 2; } else { lL.push(lK.charCodeAt(lM)); } } return lL; }
function k7(lJ) { const lK = []; for (let lL = 0; lL < lJ.length; lL += 2) { lK.push(parseInt(lJ.charAt(lL) + lJ.charAt(lL + 1), 16)); } return lK; }
function k6(num) { return [num >>> 24 & 255, num >>> 16 & 255, num >>> 8 & 255, 255 & num]; }
function k5(arr) { const hex = "0123456789abcdef"; let r = ""; for (const b of arr) r += hex[b >>> 4 & 15] + hex[b & 15]; return r; }
function k1(num) { return [num >>> 24 & 255, num >>> 16 & 255, num >>> 8 & 255, 255 & num]; }
function ka(lJ, lK) { for (var lO, lL = lJ.length, lM = lK ^ lL, lN = 0, lP = 1540483477; lL >= 4;) { lO = (255 & lJ[lN]) | (255 & lJ[++lN]) << 8 | (255 & lJ[++lN]) << 16 | (255 & lJ[++lN]) << 24; lO = Math.imul(lO, lP); lO = (lO & 0xFFFF) << 16 | lO >>> 16; lO = Math.imul(lO, lP); lM ^= lO; lM = (lM & 0xFFFF) << 16 | lM >>> 16; lM = Math.imul(lM, 2) + (lM >>> 31); lL -= 4; ++lN; } if (lL) { lO = 0; for (var lQ = 0; lQ < lL; lQ++) lO |= lJ[lN + lQ] << 8 * lQ; lO = Math.imul(lO, lP); lO = (lO & 0xFFFF) << 16 | lO >>> 16; lO = Math.imul(lO, lP); lM ^= lO; } lM ^= lM >>> 13; lM = Math.imul(lM, lP); lM ^= lM >>> 15; return lM >>> 0; }
function f9() { return "805zzu6yz53v53v119w881v2w406vz6780v4wzv844497958y715u41y"; }
function ao() {}

// 构建指纹
const jTFingerprint = new Uint8Array(1056);
for (let i = 0; i < bData.jT.length; i++) {
  const row = bData.jT[i];
  for (let j = 0; j < row.length; j++) {
    jTFingerprint[i * 16 + j] = row[j] & 0xFF;
  }
}

const requestLine = "GET /wxmapi/shop/shopquestion csecplatform=4&csecversion=4.2.0&device_system=&shopId=G7lZQSVUguP43EIT&yodaReady=h5";
const m3 = k9(requestLine);
const hash = "dfdb71b1fa2738418bb11c4f7d70fb2c";

function makeAA() {
  return {
    sdkVersion: function() { return "4.2.0"; },
    sdkEnv: function() { return "h5"; },
    getHost: function() { return "m.dianping.com"; },
    getGuardDomain: function() { return ["appsec-mobile.meituan.com", "h5guard.meituan.com", "m.dianping.com"]; },
    getBussinessType: function() { return 0; },
    isNullStr: function(s) { return !(s && typeof s === "string" && s.length > 0); },
    startsWith: function(s, prefix) { return s && s.startsWith(prefix); },
    endsWith: function(s, suffix) { return s && s.endsWith(suffix); },
    getUrlParseResult: function(url) { return /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z_]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.exec(url); },
  };
}

// 测试不同 jP 和 jN
console.log("=== 测试 jP 对 a9 的影响 ===");
for (const testJP of [0, 1, 4, 5, 12, 155, 255]) {
  const b = [jTFingerprint, bData.jQ, Date.now(), k9, aO, k7, bData.jO, [], bData.eR, bData.gV, bData.iP, cW, cO, ka, m3, k6, bData.jM, k5, f9, bData.jS, makeAA(), bData.jN, aP, aQ, testJP, k1, bData.iF, ao];
  try {
    const vm = new aS(bytecode, b, hash);
    const s0 = {}; s0["this"] = s0; vm.run("@0", [], s0);
    const s1 = {}; s1["this"] = s1; const r = vm.run("$_g5Lc", [], s1);
    console.log("jP=" + testJP + " => a9=" + r.a9 + ", a10=" + r.a10);
  } catch(e) { console.log("jP=" + testJP + " => ERROR: " + e.message.substring(0, 80)); }
}

console.log("\n=== 测试 jN 对 a9 的影响 ===");
for (const testJN of ["00", "7c", "25", "ff", "ab"]) {
  const b = [jTFingerprint, bData.jQ, Date.now(), k9, aO, k7, bData.jO, [], bData.eR, bData.gV, bData.iP, cW, cO, ka, m3, k6, bData.jM, k5, f9, bData.jS, makeAA(), testJN, aP, aQ, bData.jP, k1, bData.iF, ao];
  try {
    const vm = new aS(bytecode, b, hash);
    const s0 = {}; s0["this"] = s0; vm.run("@0", [], s0);
    const s1 = {}; s1["this"] = s1; const r = vm.run("$_g5Lc", [], s1);
    console.log("jN=" + testJN + " => a9=" + r.a9 + ", a10=" + r.a10);
  } catch(e) { console.log("jN=" + testJN + " => ERROR: " + e.message.substring(0, 80)); }
}

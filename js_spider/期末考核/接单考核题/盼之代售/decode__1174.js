var cryptoJs = require('crypto-js')

// filename: generateDecode1174.js
const CryptoJS = require("crypto-js");

// 生成 decode__1174 参数的核心函数，比如等同于 m6（根据逆向逻辑改写）
function m6(body = "") {
  // 以下全局模拟window里的两个随机字符串，真实调用时需对应环境中取值或手工设置
  const _waf_bd8ce2ce37 = "your_bd8ce2ce37_value_here";
  const _waf_a86dfdc5f2 = "your_a86dfdc5f2_value_here";

  // Step 1.构造 mP 字符串并计算SHA1
  const basePath = "api.pzds.com/api/web-client/v2/public/goodsPublic/page";
  let mP = encodeURIComponent(_waf_bd8ce2ce37 + "post" + "222029ad07" + basePath);
  mP += encodeURIComponent(body);

  const sha1Str = CryptoJS.SHA1(mP).toString();
  const m2Result = [];
  for (let i = 10; i < 26; i++) {
    m2Result.push(sha1Str[i % sha1Str.length]);
  }

  // Step 2. q 函数实现：简单两字符异或+映射
  function q(arr) {
    const hexChars = "0123456789ABCDEF";
    let output = "";
    for (let i = 0; i < arr.length; i += 2) {
      const hex1 = arr[i];
      const hex2 = arr[i + 1] || "0";
      const val = parseInt(hex1 + hex2, 16);
      const randHex =
        hexChars[Math.floor(Math.random() * 16)] +
        hexChars[Math.floor(Math.random() * 16)];
      const xorVal = val ^ parseInt(randHex, 16);
      let xorHex = xorVal.toString(16);
      if (xorHex.length === 1) xorHex = "0" + xorHex;
      output += xorHex;
    }
    return output.split("");
  }

  function m4(arr) {
    return q(arr).join("").toLowerCase();
  }

  const mc = m4(m2Result);
  const mh = m4(m2Result);

  // Step 3. 完整复现F()函数
  function F() {
    const baseArr = new Array(17).fill(0);
    baseArr.push(Math.random() > 0.5 ? 1 : 0);
    baseArr.push(1);
    baseArr.push(Math.floor(Date.now() / 1000) % 2);
    baseArr.push(Math.random() > 0.5 ? 1 : 0);

    const C = [
      3690877195, 507408065, 3293764436, 1908046628,
      1122063282, 1122909396, 2850238958, 1525938798,
    ];

    const mX = [
      1525938798, 1414245912, 1908032025, 3302467156,
      1186810817, 1088877107, 2850128147, 1908003016,
      2850241496, 2849192328, 2848786342, 326136034,
      1908046628, 2505019146, 1301444867, 2256698671,
      1908027224, 988609370, 2850812665, 184102977,
      1908029820, 1112699247, 1356518051,
    ];

    const extendedArr = C.map(num => (mX.indexOf(num) > -1 ? 1 : 0));

    const fullArr = baseArr.concat(extendedArr);

    // Fisher-Yates shuffle
    for (let i = fullArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fullArr[i], fullArr[j]] = [fullArr[j], fullArr[i]];
    }

    // v() 恢复Math.random
    (function v() {
      const u = Math.random;
      Math.random = u;
    })();

    let res = 0;
    for (let bitPos = 0; bitPos < fullArr.length; bitPos++) {
      if (fullArr[bitPos]) {
        res |= (1 << bitPos);
      }
    }

    return res;
  }

  // Step 4. 生成中间变量
  const part3 = F();

  // Step 5. T()函数返回固定字符串
  function T() {
    return "4169554335a19d2291e653";
  }

  // Step 6. 组合字符串并调用 x() 进行映射压缩

  const parts = [
    mc,
    mh,
    part3,
    Date.now().toString(),
    _waf_bd8ce2ce37,
    _waf_a86dfdc5f2,
    T(),
  ];

  const joinedStr = parts.join("|");

  // LZW压缩模拟+映射
  function x(str) {
    const dictionary = {};
    let dictSize = 256;
    const data = str.split("");
    const out = [];
    let w = "";

    for (let i = 0; i < 256; i++) {
      dictionary[String.fromCharCode(i)] = i;
    }

    for (const c of data) {
      const wc = w + c;
      if (dictionary.hasOwnProperty(wc)) {
        w = wc;
      } else {
        out.push(dictionary[w]);
        dictionary[wc] = dictSize++;
        w = c;
      }
    }
    if (w !== "") out.push(dictionary[w]);

    const mapping =
      "g_GTtAIr2=sVcC6wvxopuSQYWbjFl5O3P7qeZakJBLiyXd8z/f4U09HmKRMhEDNn1";
    let result = "";
    for (const val of out) {
      result += mapping[val % mapping.length];
    }
    return result;
  }

  return "222029ad07-" + x(joinedStr);
}


url = "api.pzds.com/api/web-client/v2/public/goodsPublic/page"
body = '{"order":"ASC","sort":null,"page":14,"pageSize":10,"action":{"gameId":"7","merchantMark":null,"keywords":[],"searchWords":[],"searchPropertyIds":[],"unionGameIds":[],"goodsSearchActions":[],"goodsCatalogueId":6,"countFlag":false,"conditionSearch":false}}'

console.log(m6(url, body))
var CryptoJS = require("crypto-js")
const pako = require("pako");

const HDW4_VERSION = "hdw4";
const HDW4_SEED = "fMVvAnd1douKmOXA";
const DUAPP_SEED = "OCXWafbrqKadQkjktpsoBZES";
const DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function md5(input) {
    return CryptoJS.MD5(String(input)).toString();
}

function base64Utf8(input) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(input));
}

function utf8FromBase64(input) {
    return CryptoJS.enc.Base64.parse(input).toString(CryptoJS.enc.Utf8);
}

function xorString(input, key) {
    let out = "";
    for (let i = 0; i < input.length; i += 1) {
        out += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return out;
}

function deriveHdw4(options = {}) {
    const userAgent = options.userAgent || DEFAULT_USER_AGENT;
    const uaMatch = /\(([^)]+)\)/.exec(userAgent);
    const uaMark = uaMatch ? uaMatch[1] : "";
    const isDuapp = /duapp/.test(userAgent);
    const envKey =
        options.SK ||
        options.Sk ||
        options.sk ||
        options.shumeiId ||
        options.ShumeiId ||
        options.shumeiid ||
        "";

    const keyHash = md5(isDuapp ? DUAPP_SEED : envKey || uaMark);
    const sumHash = md5(isDuapp ? DUAPP_SEED : uaMark);
    let salt = 0;
    for (const ch of sumHash) salt += ch.charCodeAt(0);

    return {
        streamKey: base64Utf8(xorString(HDW4_SEED, keyHash)),
        salt,
        version: HDW4_VERSION,
    };
}

function buildFeedsInfoPayload(t) {
    var signStr = md5("".concat(t ? Object.keys(t).sort().reduce((function (e, r) {
            var n = t[r];
            if (void 0 === n)
                return e;
            if (Number.isNaN(n) && (n = ""),
                Array.isArray(n)) {
                if (0 === n.length)
                    return "".concat(e).concat(r);
                var o = n.sort().map((function (t) {
                        return t instanceof Object ? JSON.stringify(t) : t
                    }
                )).reduce((function () {
                        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ""
                            , e = arguments.length > 1 ? arguments[1] : void 0;
                        return t + (t ? "," : "") + e
                    }
                ));
                return "".concat(e).concat(r).concat(o)
            }
            return n instanceof Object ? e + r + JSON.stringify(n) : e + r + n.toString()
        }
    ), "") : "", "048a9c4943398714b356a696503d2d36"))
    return {sign: signStr, ...t}
}

function hdw4Stream(input, key, saltA, saltB, decrypt = false) {
  let text = input || "";
  if (decrypt) text = utf8FromBase64(text);

  const s = new Array(256);
  const k = new Array(256);
  const keyLen = key.length;
  const modA = saltA % 5;
  const modB = saltB % 64;

  for (let i = 0; i < 256; i += 1) {
    k[i] = key.charCodeAt(i % keyLen) + (modA === 0 ? modB : 0);
    s[i] = i;
  }

  let j = 0;
  for (let i = 0; i < 256; i += 1) {
    j = (j + s[i] + k[i] + (modA === 1 ? modB : 0)) % 256;
    const temp = s[i];
    s[i] = s[j];
    s[j] = temp;
  }

  let out = "";
  let i = 0;
  j = 0;
  for (let n = 0; n < text.length; n += 1) {
    i = (i + 1 + (modA === 2 ? modB : 0)) % 256;
    j = (j + s[i] + (modA === 3 ? modB : 0)) % 256;
    const temp = s[i];
    s[i] = s[j];
    s[j] = temp;
    const streamByte = s[(s[i] + s[j]) % 256] + (modA === 4 ? modB : 0);
    out += String.fromCharCode(text[n].charCodeAt(0) ^ streamByte);
  }

  return decrypt ? out : base64Utf8(out);
}
function getData(payload, optionData) {
    const bodyPayload = buildFeedsInfoPayload(payload);
    const plainBody = JSON.stringify(bodyPayload);
    const runtime = deriveHdw4(optionData);
    const encryptedPart = hdw4Stream(plainBody, runtime.streamKey, runtime.salt, runtime.salt, false);
    const data = `${md5(plainBody)}${encryptedPart}`;
    // console.log(data);
    return data
}

function base64ToBytes(input) {
  const wordArray = CryptoJS.enc.Base64.parse(input);
  const bytes = [];
  for (let i = 0; i < wordArray.sigBytes; i += 1) {
    bytes.push((wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff);
  }
  return Uint8Array.from(bytes);
}
function inflateBase64Binary(binaryText) {
  return pako.inflate(base64ToBytes(binaryText), { to: "string" });
}

function decryptFun99Core(rawText, flag = "1", options = {}) {
  const userAgent = options.userAgent || DEFAULT_USER_AGENT;
  const uaMatch = /\(([^)]+)\)/.exec(userAgent);
  const uaMark = uaMatch ? uaMatch[1] : "";
  const isDuapp = /duapp/.test(userAgent);
  const keyHash = md5(isDuapp ? DUAPP_SEED : uaMark);

  let salt = 0;
  for (const ch of keyHash) salt += ch.charCodeAt(0);

  const streamKey = base64Utf8(xorString(HDW4_SEED, keyHash));
  const decrypted = hdw4Stream(rawText, streamKey, salt, salt, true);

  if (flag === undefined || flag === null || flag === "") return decrypted;

  try {
    return inflateBase64Binary(decrypted);
  } catch {
    return decrypted;
  }
}

var loaddata = {
    "pickRuleId": 644479,
    "pageNum": 1,
    "pageSize": 24,
    "filterUnbid": true,
    "showCspu": true
};
var op = {
    sk: "9U3lGGxQTKhFWqOvNJTxDpIKhq87qfEz0w54Dnbgoqqd2OdvkKaaynRRTtKB4mIw98QOaTdQyz1a43ZqRVU0NFQ0LD1w",
    shumeiid: "20260505133755514010884b212e0c85860f8e0205cbc0b1c0ab5cf6a82096"
}
console.log(getData(loaddata, op));

var text = "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";
var res = decryptFun99Core(text, "1,1,1")
console.log(res);
const CryptoJS = require("crypto-js");
const {env} = require("sm-crypto/.eslintrc");
CryptoJS.enc.Base64 = {
    'stringify': function (_$Rg) {
        var _$RU = _$Rg.words;
        var _$Rf = _$Rg.sigBytes;
        var _$Rk = this._map1;
        _$Rg.clamp();
        var _$Rq = [];
        var _$RR = 0;
        for (; _$RR < _$Rf; _$RR += 3) {
            var _$Rc = (_$RU[_$RR >>> 2] >>> 24 - _$RR % 4 * 8 & 255) << 16 | (_$RU[_$RR + 1 >>> 2] >>> 24 - (_$RR + 1) % 4 * 8 & 255) << 8 | _$RU[_$RR + 2 >>> 2] >>> 24 - (_$RR + 2) % 4 * 8 & 255;
            var _$RZ = 0;
            for (; _$RZ < 4 && _$RR + 0.75 * _$RZ < _$Rf; _$RZ++) _$Rq.push(_$Rk.charAt(_$Rc >>> 6 * (3 - _$RZ) & 63));
        }
        return _$Rq.join('');
    },
    '_map1': "rqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA-_9876543210zyxwvuts"
};
CryptoJS.enc.Utils = {
    'toWordArray': function (_$iP) {
        var _$iK = [];
        for (var _$iB = 0; _$iB < _$iP.length; _$iB++) _$iK[_$iB >>> 2] |= _$iP[_$iB] << 24 - _$iB % 4 * 8;
        return CryptoJS.lib.WordArray.create(_$iK, _$iP.length);
    },
    'fromWordArray': function (_$iP) {
        var _$iK = new Uint8Array(_$iP.sigBytes);
        for (var _$iB = 0; _$iB < _$iP.sigBytes; _$iB++) _$iK[_$iB] = _$iP.words[_$iB >>> 2] >>> 24 - _$iB % 4 * 8 & 255;
        return _$iK;
    }
};
CryptoJS.enc.Hex.format = function (_$Rl) {
    var _$Rv = _$Rl.words;
    var _$Ry = _$Rl.sigBytes;
    var _$Ro = [];
    var _$Rx = 0;
    for (; _$Rx < _$Ry; _$Rx++) {
        var _$RX = _$Rv[_$Rx >>> 2] >>> 24 - _$Rx % 4 * 8 & 255;
        _$Ro.push((_$RX >>> 4).toString(16));
        _$Ro.push((15 & _$RX).toString(16));
    }
    return _$Ro.join('');
}


var _$I1 = {};
var _$MH = _$I1;
var _$w = function (_$RM) {
    return _$RM && _$RM.Math === Math && _$RM;
};
var _$H = _$w("object" == typeof globalThis && globalThis) || _$w("object" == typeof window && window) || _$w("object" == typeof self && self) || _$w("object" == typeof _$D && _$D) || _$w("object" == typeof _$D && _$D) || function () {
    return this;
}() || Function("return this")();
var _$Mw = _$H;
var _$Mg = function (_$RM, _$RB) {
    var _$RO = _$MH[_$RM + "Prototype"];
    var _$RA = _$RO && _$RO[_$RB];
    if (_$RA) return _$RA;
    var _$RW = _$Mw[_$RM];
    var _$RY = _$RW && _$RW.prototype;
    return _$RY && _$RY[_$RB];
};
var _$M = function (_$RM) {
    try {
        return !!_$RM();
    } catch (_$RB) {
        return !0;
    }
};
var _$B = !_$M(function () {
    var _$RM = function () {
    }.bind();
    return 'function' != typeof _$RM || _$RM.hasOwnProperty("prototype");
});
var _$O = _$B;
var _$A = Function.prototype;
var _$W = _$A.call;
var _$Y = _$O && _$A.bind.bind(_$W, _$W);
var _$Q = _$O ? _$Y : function (_$RM) {
    return function () {
        return _$W.apply(_$RM, arguments);
    };
};
var _$b = _$Q({}.isPrototypeOf);
var _$BW = _$Mg("Array", "map");
var _$BY = _$b;
var _$BQ = _$BW;
var _$Bb = Array.prototype;
var _$Bw = function (_$RM) {
    var _$RB = _$RM.map;
    return _$RM === _$Bb || _$BY(_$Bb, _$RM) && _$RB === _$Bb.map ? _$BQ : _$RB;
};
var _$Md = _$Mg("Array", "slice");
var _$Mj = _$b;
var _$Mn = _$Md;
var _$MN = Array.prototype;
var _$MS = function (_$RM) {
    var _$RB = _$RM.slice;
    return _$RM === _$MN || _$Mj(_$MN, _$RM) && _$RB === _$MN.slice ? _$Mn : _$RB;
};

function _$qe(_$RO) {
    return _$Bw(Array.prototype).call(_$RO, function (_$RA) {
        var _$RW;
        return _$MS(_$RW = '00' + (255 & _$RA).toString(16)).call(_$RW, -2);
    }).join('');
}

function _$qa(_$RO) {
    var _$RA = new Uint8Array(_$RO.length);
    Array.prototype.forEach.call(_$RA, function (_$RW, _$RY, _$RQ) {
        _$RQ[_$RY] = _$RO.charCodeAt(_$RY);
    });
    return _$qe(_$RA);
}

function _$q8(_$RO) {
    var _$RA = '';
    for (; _$RO--;) _$RA += "0123456789abcdefghijklmnopqrstuvwHIJKLMNOPQRSTUVWXYZ_-"[54 * Math.random() | 0];
    _$RA.length > 4 && (_$RA = _$RA.substring(0, 4) + '3' + _$RA.substring(4, _$RA.length - 1));
    return _$RA;
}

function formatTime(timestamp, fmt="yyyyMMddhhmmssSSS") {
    var time = timestamp + 5000;
    var date = new Date(time);

    var rules = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'D+': date.getDate(), // 日 (别名)
        'h+': date.getHours(), // 小时 (12小时制)
        'H+': date.getHours(), // 小时 (24小时制)
        'm+': date.getMinutes(), // 分钟
        's+': date.getSeconds(), // 秒
        'w+': date.getDay(), // 星期
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S+': date.getMilliseconds() // 毫秒
    };

    var formatStr = fmt;

    if (/(y+)/i.test(formatStr)) {
        // replace第一个参数是匹配到的 "yyyy"，用年份字符串替换
        formatStr = formatStr.replace(
            RegExp.$1,
            ('' + date.getFullYear()).substr(4 - RegExp.$1.length)
        );
    }

    Object.keys(rules).forEach(function (key) {
        // 构造正则，例如匹配 "MM" 或 "M"
        if (new RegExp('(' + key + ')').test(formatStr)) {
            var value = rules[key];
            // S+ (毫秒) 补3个0，其他补2个0
            var padStr = key === 'S+' ? "000" : "00";

            // 替换逻辑：
            // 如果匹配长度为1 (如 "M")，直接替换数值
            // 如果匹配长度>1 (如 "MM")，先补零再截取后几位
            formatStr = formatStr.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? value
                    : (padStr + value).slice(-RegExp.$1.length) // 相当于 padStart 的效果
            );
        }
    });

    return formatStr;
}

function getSaltVal(data) {
    // var base64CodeForm = "QPONMLKJIHGFEDCBA-_9876543210zyxwvutsrqponmlkjihgfedcbaZYXWVUTSR";
    var base64CodeForm = "aZYXWVUTSRQPONMLKJIHGFEDCBA-_9876543210zyxwvutsrqponmlkjihgfedcb";
    var totalSaltLength = 4; // 总盐值长度
    var saltBatchVal = Math.floor(data.length / totalSaltLength);
    var code = 0;  // 累加计数器
    var count = 0; // 批次计数器 批次为11（Math.floor(data.length / totalSaltLength)）
    var arr = []; // 存放生成的盐值
    for (var i = 0; i < data.length; i++) {
        if (count < saltBatchVal) {
            code += data.charCodeAt(i);
        } else {
            var saltIdx = (code * 11) % base64CodeForm.length;
            arr.push(base64CodeForm.charAt(saltIdx))
            if (arr.length === 3) {
                saltBatchVal += data.length % totalSaltLength;
            }
            code = data.charCodeAt(i); // 新批次从当前字符开始累加
            count = 0; // 计数器归0，进入下一个批次循环
        }
        count++;
    }
    if (code !== 0) {
        var lastResVal = (code * 11) % base64CodeForm.length;
        arr.push(base64CodeForm[lastResVal])
    }
    var saltVal = arr.join(""); // 生成的4位盐值
    var dataStr = data + saltVal;

    return dataStr;
}

function SHA256(word) {
    var resWord = getSaltVal(word) + ".Zj-ux";
    var sha256word = CryptoJS.SHA256(resWord);
    var HexStr = sha256word.toString();
    return HexStr;
}

function MD5(data) {
    if (typeof data === "string" || data instanceof Uint8Array) {
        if (data.lastIndexOf("envCollect") === 0) {
            return CryptoJS.MD5(data.slice(10)).toString();
        }
        var md5Hash;
        if (typeof data === "string") {
            var strsEncode = getSaltVal(data) + ".Zj-ux";
            md5Hash = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(strsEncode)).toString();
        } else {
            md5Hash = CryptoJS.MD5(CryptoJS.enc.Utils.toWordArray(data));
        }
    }
    return md5Hash
}

function getSignedStr(data, key) {
    var keyWord = key + data + key;
    return MD5(keyWord);
}

function getMiddleStr() {
    var arr = ["1", "2", "3"];
    var operatorArr = ["+", "x"];
    var strs = _$q8(32);
    // var strs = "co3e3pi-VXuK20T41kd3Rf-Kmc8I0Hg8";
    // const randomPoolForNum = [
    //     "0.3305123702174575", // 0 < 5
    //     "0.8263818139574904", // 1 < 5
    //     "0.1828456228979487", // 2 < 5
    //     "0.9273740996797531", // 3 < 5
    //     "0.8760579893302335", // 4 < 5
    // ];
    // const randomPoolForOp = [
    //     "0.32668841060931786", // 0 < 4
    //     "0.8262843197741457", // 1 < 4
    //     "0.07192831117751453", // 2 < 4
    //     "0.03903684727283985", // 3 < 4
    // ];
    let rIndex = 0; // 随机数指针
    var resStr = "";
    var count = 0;
    var loopMax = 2 + Math.floor(4 * Math.random());
    // var loopMax = 2 + Math.floor(4 * 0.9493750980122766);
    var randomNum = Math.random(); // 定义随机数
    while (count < loopMax) {
        // var numRandIdx = Math.floor(arr.length * randomPoolForNum[count]);
        var numRandIdx = Math.floor(arr.length * randomNum);
        resStr += arr[numRandIdx];
        if (count < loopMax - 1) {
            // var opRandIdx = Math.floor(operatorArr.length * randomPoolForOp[count]);
            var opRandIdx = Math.floor(operatorArr.length * randomNum);
            resStr += operatorArr[opRandIdx];
        }
        count++;
    }

    // 1+3x1+3+3
    if (resStr.length < 9) {
        resStr += strs.substr(0, 9 - resStr.length);
    }
    // console.log("resStr =>", resStr); // resStr: 1+1x2x1+3
    var parseResStr = CryptoJS.enc.Utf8.parse(resStr);
    return CryptoJS.enc.Base64.stringify(parseResStr)
}

function getFp() {
    var data = "ekl9i1uct6";
    var arr1 = [];
    for (var i = 0; i < data.length; i++) {
        if (Math.random() * (data.length - i) < 4 - arr1.length) {
            arr1.push(data[i]);
        } else {
            continue;
        }
        if (arr1.length === 4) {
            break;
        }
    }

    var strings = "";

    for (var j = 0; j < arr1.length; j++) {
        var max_len = arr1.length - j;
        var randidx = Math.random() * (max_len) | 0;
        strings += arr1[randidx];
        arr1[randidx] = arr1[max_len - 1];
    }

    var str1 = "";
    for (var z = 0; z < data.length; z++) {
        var dataval = data[z];
        var dataidx = strings.indexOf(dataval);
        if (dataidx === -1) {
            var datavalParseInt = parseInt.call(null, dataval, 36); // 14
            var datavalTostring = (((5 * datavalParseInt) + 32) % 36).toString(36); // u
            str1 += datavalTostring;
        }
    }

    function _$qn(_$RO) {
        var _$RA = _$RO.size;
        var _$RW = _$RO.num;
        var _$RY = '';
        for (; _$RA--;) _$RY += _$RW[Math.random() * _$RW.length | 0];
        return _$RY;
    }

    var size = 5;
    var str2 = _$qn({"size": size, "num": str1}) + strings;

    var str3 = str2 + _$qn({"size": 12 - size - 1, "num": str1}) + size;
    var str3Split = str3.split("");
    var str3Slice = str3Split.slice(0, 15);
    var str3Slice1 = str3Split.slice(15);
    var arr2 = [];
    while (str3Slice.length > 0) {
        var popChar = str3Slice.pop(); // k
        var parseIntPopChar = parseInt(popChar, 36); // 20
        var CharTostring = (((5 * parseIntPopChar) + 13) % 36).toString(36);
        arr2.push(CharTostring);
    }
    return arr2.concat(str3Slice1).join("")
}

var fingerPrint = {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    canvas: "envCollectdata:image/png;base64,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",
    random: _$q8(11),
    extendRandom: _$q8(13),
    fp: getFp()
}

function getLocalTK() {
    var configs = {"magic": "tk", "version": "06", "platform": "w", "expires": "41", "producer": "l"}
    configs['expr'] = getMiddleStr();
    var date = Date.now();
    var configStr = _$q8(12);
    var fp = fingerPrint.fp;
    var prefix = "2e";

    var totalLength = 38;
    var buffer = new Uint8Array(totalLength);
    var offset = 0;

    var prefixUint8Arr = new Uint8Array(prefix.length);
    for (let i = 0; i < prefix.length; i++) {
        prefixUint8Arr[i] = prefix.charCodeAt(i);
    }
    buffer.set(prefixUint8Arr, offset);
    offset += prefix.length;  // offset = 2

    var configUint8Arr = new Uint8Array(configStr.length);
    for (let i = 0; i < configStr.length; i++) {
        var index = (i + 4) % 12;
        configUint8Arr[index] = configStr.charCodeAt(i);
    }
    buffer.set(configUint8Arr, offset);
    offset += configStr.length;  // offset = 14

    var buf = new ArrayBuffer(8);
    var dataview = new DataView(buf);
    dataview.setUint32(0, date % (Math.pow(2, 32)), true);
    dataview.setUint32(4, Math.floor(date / (Math.pow(2, 32))), true);
    var TsUint8Array = new Uint8Array(buf);
    buffer.set(TsUint8Array, offset)
    offset += TsUint8Array.length;


    var fpUint8Arr = new Uint8Array(fp.length);
    for (let i = 0; i < fp.length; i++) {
        fpUint8Arr[i] = fp.charCodeAt(i);
    }
    buffer.set(fpUint8Arr, offset);

    var hashStr = MD5(buffer);

    var res1 = _$qa(hashStr.toString().substr(0, 8))
    var res2 = _$qa(prefix);
    var res3 = _$qa(configStr);
    var res4 = _$qe(TsUint8Array);
    var res5 = _$qa(fp);
    var res = res1 + res2 + res3 + res4 + res5;
    var strsParse = CryptoJS.enc.Hex.parse(res);
    configs['cipher'] = encode(strsParse)
    var Tk = configs['magic'] + configs['version'] +
        configs['platform'] + configs['producer'] +
        configs['expires'] + configs['producer'] +
        configs['expr'] + configs['cipher'];
    configs['adler32'] = MD5(Tk).substr(0, 8);
    var localTk = configs['magic'] + configs['version'] +
        configs['platform'] + configs['adler32'] +
        configs['expires'] + configs['producer'] +
        configs['expr'] + configs['cipher']

    return localTk
}

function genKey(rd, tk, fp, ts, ai) {
    var str = "".concat(tk).concat(fp).concat(ts).concat(ai).concat(rd);
    return SHA256(str);
}

function getPart5(paramsArr, key) {
    var paramsStr = paramsArr.join("&");
    var signedStr = getSignedStr(paramsStr, key);
    return signedStr;
}

function encode(word) {
    var uint8Arr = CryptoJS.enc.Utils.fromWordArray(word);
    var arr1 = Array.prototype.slice.call(uint8Arr);
    var condition = 3 - (arr1.length % 3);
    for (var i = 0; i < condition; i++) {
        arr1.push(condition);
    }
    // console.log("arr1 =>", arr1);

    var arr2 = [];
    var initVal = arr1.length - 1;
    while (initVal >= 0) {
        var startIdx = initVal - 2;
        var endIdx = initVal + 1;
        arr2.push(...arr1.slice(startIdx, endIdx));
        initVal -= 3;
    }
    // console.log("arr2 =>", arr2);

    var word1 = CryptoJS.enc.Utils.toWordArray(arr2);
    var str1 = CryptoJS.enc.Base64.stringify(word1);

    var arr3 = str1.split("");
    var arr4 = [];
    for (var j = 0; j < arr3.length; j += 4) {
        var arr3Slice = arr3.slice(j, j + 4).reverse();
        arr4.push(...arr3Slice)
    }
    var str2 = arr4.join("");
    return str2
}

function getPart8(h5stEnv) {
    var jsonStr = JSON.stringify(h5stEnv, null, 2);
    var envParse = CryptoJS.enc.Utf8.parse(jsonStr);
    var envStr = encode(envParse);
    return envStr;
}

function getPart9(data, Key) {
    var part9 = getSignedStr(data, Key);
    return part9;
}

function getPart10(data) {
    var paramsKeyStrParse = CryptoJS.enc.Utf8.parse(data);
    var part10 = encode(paramsKeyStrParse);
    return part10;
}

function getAlgo(ai) {
    const request = require('sync-request');
    const url = "https://cactus.jd.com/request_algo";
    const headers = {
        "accept": "application/json",
        "user-agent": fingerPrint.userAgent
    }
    const requestData = {
        "version": "5.3",
        "fp": fingerPrint.fp,
        "appId": ai,
        "timestamp": Date.now(),
        "platform": "web",
        "fv": "h5_file_v5.3.3",
        "localTk": getLocalTK()
    };
    const res = request('POST', url, {
        json: requestData,
        headers: headers,
        timeout: 10000  // 可选：超时时间
    });

    return JSON.parse(res.getBody('utf8'));
}

function getH5ST(appid, body, client, clientVersion, functionID, ts) {
    var aid = "fb5df"; // 商品详情
    var algo_data = getAlgo(aid)['data']['result'];
    var envObj = {
        "sua": fingerPrint.userAgent.match(new RegExp("Mozilla/5.0 \\((.*?)\\)"))[1],
        "pp": {},
        "extend": {
            "wd": 0,
            "l": 0,
            "ls": 5,
            "wk": 0,
            "bu1": "0.1.9",
            "bu3": 38,
            "bu4": 0,
            "bu5": 0,
            "bu6": 23,
            "bu7": 0,
            "bu8": 0,
            "random": fingerPrint.extendRandom,
            "bu12": -8,
            "bu10": 14,
            "bu11": 3,
            "bu13": "Ft"
        },
        "pf": "Win32",
        "random": fingerPrint.random,
        "v": "h5_file_v5.3.3",
        "bu4": "-1",
        "canvas": MD5(fingerPrint.canvas),
        "webglFp": "be8ead0e9894b57a7ff0205404de4412",
        "ccn": 24,
        // "fp": fingerPrint.fp,
        "fp": algo_data.fp,
        "bu1": "0.1.8"
    };
    var t = Date.now();
    var part1 = formatTime(t);
    var part2 = algo_data.fp;
    var part3 = aid;
    var part4 = algo_data.tk;
    var rd = algo_data.algo.match(/var rd=['"](.+?)['"]/)[1];
    var key = genKey(rd, part4, part2, part1 + "62", part3);
    var bodyArr = [`appid:${appid}`, `body:${body}`, `client:${client}`, `clientVersion:${clientVersion}`, `functionId:${functionID}`, `t:${ts}`]

    var part5 = getPart5(bodyArr, key);
    var part6 = "5.3" // appVersion
    var part7 = ts;
    var part8 = getPart8(envObj);
    var part9 = getPart9("appid:appid&fnuctionId:functionId", key);
    var part10 = getPart10("appid,body,client,clientVersion,functionId,t");
    return [part1, part2, part3, part4, part5, part6, part7, part8, part9, part10].join(";");
}

var paramsObj = {
    appID: "pc-item-soa",
    body: "a99f0fff7aaff7ef977344946c45695566e173c80ef3a8854ca54f39f7601adf",
    client: "pc",
    clientVersion: "1.0.0",
    functionId: "pc_detailpage_wareBusiness",
    t: "1778247966477"
}
var h5st = getH5ST(paramsObj.appID, paramsObj.body, paramsObj.client, paramsObj.clientVersion, paramsObj.functionId, paramsObj.t)
h5st.split(";").forEach((item, index) => {
    console.log(`part${index + 1} => ${item}`);
});
console.log(h5st.length);

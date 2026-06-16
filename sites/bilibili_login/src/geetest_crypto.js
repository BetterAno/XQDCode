/**
 * 极验 v3 w 参数生成器
 *
 * 算法: w = custom_base64(AES_CBC(JSON.stringify(data))) + RSA(random_key).hex()
 *
 * AES-128-CBC, PKCS7, IV="0000000000000000" (16个ASCII '0')
 * RSA PKCS1v15, 固定公钥
 * 自定义 Base64 编码: charset 不同 (+/ → ()), 位掩码不同
 */

const crypto = require('crypto');

// ============ 常量 ============

const GEETEST_RSA_N = '00C1E3934D1614465B33053E7F48EE4EC87B14B95EF88947713D25EECBFF7E74C7977D02DC1D9451F79DD5D1C10C29ACB6A9B4D6FB7D0A0279B6719E1772565F09AF627715919221AEF91899CAE08C0D686D748B20A3603BE2318CA6BC2B59706592A9219D0BF05C9F65023A21D2330807252AE0066D59CEEFA5F2748EA80BAB81';
const GEETEST_RSA_E = '10001';

const CUSTOM_BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()';
const CUSTOM_BASE64_MASKS = [7274496, 9483264, 19220, 235];

const MOUSE_PATH_CHARSET = '()*,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~';

// ============ 核心: 自定义 Base64 编码 ============

function getBit(value, position) {
    return (value >> position) & 1;
}

function extractBits(value, mask) {
    let result = 0;
    for (let i = 24 - 1; i >= 0; i -= 1) {
        if (getBit(mask, i) === 1) {
            result = (result << 1) + getBit(value, i);
        }
    }
    return result;
}

function customBase64Encode(byteArray) {
    let result = '';
    let padding = '';
    const len = byteArray.length;

    for (let i = 0; i < len; i += 3) {
        let chunk;
        if (i + 2 < len) {
            chunk = (byteArray[i] << 16) + (byteArray[i + 1] << 8) + byteArray[i + 2];
            result += CUSTOM_BASE64_CHARS[extractBits(chunk, CUSTOM_BASE64_MASKS[0])]
                    + CUSTOM_BASE64_CHARS[extractBits(chunk, CUSTOM_BASE64_MASKS[1])]
                    + CUSTOM_BASE64_CHARS[extractBits(chunk, CUSTOM_BASE64_MASKS[2])]
                    + CUSTOM_BASE64_CHARS[extractBits(chunk, CUSTOM_BASE64_MASKS[3])];
        } else {
            const remaining = len % 3;
            if (remaining === 2) {
                chunk = (byteArray[i] << 16) + (byteArray[i + 1] << 8);
                result += CUSTOM_BASE64_CHARS[extractBits(chunk, CUSTOM_BASE64_MASKS[0])]
                        + CUSTOM_BASE64_CHARS[extractBits(chunk, CUSTOM_BASE64_MASKS[1])]
                        + CUSTOM_BASE64_CHARS[extractBits(chunk, CUSTOM_BASE64_MASKS[2])];
                padding = '.';
            } else if (remaining === 1) {
                chunk = byteArray[i] << 16;
                result += CUSTOM_BASE64_CHARS[extractBits(chunk, CUSTOM_BASE64_MASKS[0])]
                        + CUSTOM_BASE64_CHARS[extractBits(chunk, CUSTOM_BASE64_MASKS[1])];
                padding = '..';
            }
        }
    }

    return result + padding;
}

// ============ 随机字符串生成 ============

function randomString() {
    let str = '';
    for (let i = 0; i < 4; i++) {
        str += (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
    }
    return str;
}

// ============ AES-128-CBC 加密 ============

function aesEncrypt(plaintext, key) {
    const iv = Buffer.from('0000000000000000', 'utf8');
    const keyBuf = Buffer.from(key, 'utf8');
    const cipher = crypto.createCipheriv('aes-128-cbc', keyBuf, iv);
    cipher.setAutoPadding(true); // PKCS7

    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    return Array.from(encrypted);
}

// ============ RSA 加密 ============

function rsaEncrypt(plaintext) {
    const n = BigInt('0x' + GEETEST_RSA_N);
    const e = BigInt('0x' + GEETEST_RSA_E);

    const msg = Buffer.from(plaintext, 'utf8');

    // PKCS1v15 padding
    const keySize = 128; // 1024-bit RSA = 128 bytes
    const maxMsgLen = keySize - 11;
    if (msg.length > maxMsgLen) {
        throw new Error('Message too long for RSA');
    }

    const padded = Buffer.alloc(keySize);
    padded[0] = 0x00;
    padded[1] = 0x02;

    const paddingLen = keySize - msg.length - 3;
    for (let i = 0; i < paddingLen; i++) {
        padded[2 + i] = 0;
        while (padded[2 + i] === 0) {
            padded[2 + i] = Math.floor(Math.random() * 255) + 1;
        }
    }
    padded[2 + paddingLen] = 0x00;
    msg.copy(padded, 3 + paddingLen);

    // RSA encrypt: m^e mod n
    let m = BigInt('0x' + padded.toString('hex'));
    let result = 1n;
    let base = m % n;
    let exp = e;
    while (exp > 0n) {
        if (exp & 1n) {
            result = (result * base) % n;
        }
        exp >>= 1n;
        base = (base * base) % n;
    }

    let hex = result.toString(16);
    if (hex.length % 2 !== 0) hex = '0' + hex;
    return hex;
}

// ============ 生成 w 参数 ============

function generateW(data, reuseKey) {
    const randomKey = reuseKey || randomString();
    const plaintext = JSON.stringify(data);

    const aesBytes = aesEncrypt(plaintext, randomKey);
    const h = customBase64Encode(aesBytes);
    const u = rsaEncrypt(randomKey);

    return { w: h + u, key: randomKey };
}

function generateWNoRsa(data, key) {
    const plaintext = JSON.stringify(data);
    const aesBytes = aesEncrypt(plaintext, key);
    const h = customBase64Encode(aesBytes);
    return h;
}

// ============ MD5 ============

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

// ============ 鼠标路径编码 (encode_mouse_path) ============
// 三阶段编码: preprocess → process → postprocess

function encodeMousePath(path, c, s) {
    const prepared = mousePreprocess(path);
    const processed = mouseProcess(prepared);
    return mousePostprocess(processed, c, s);
}

function BFIQ(e) {
    const t = 32767;
    if (typeof e !== 'number') return e;
    if (t < e) e = t;
    else if (e < -t) e = -t;
    return Math.round(e);
}

function BGAB(events) {
    // 找到主导指针类型, 过滤非主导类型的事件
    let dominantType = '';
    let n = 0;
    while (n < events.length && !dominantType) {
        if (events[n]) dominantType = events[n][4];
        n++;
    }
    if (!dominantType) return events;

    const pointerTypes = ['mouse', 'touch', 'pointer', 'MSPointer'];
    let matchedPrefix = '';
    for (let i = 0; i < pointerTypes.length; i++) {
        if (dominantType.startsWith(pointerTypes[i])) {
            matchedPrefix = pointerTypes[i];
            break;
        }
    }

    const filtered = [...events];
    for (let a = filtered.length - 1; a >= 0; a--) {
        const evt = filtered[a];
        const action = evt[0];
        if (['move', 'down', 'up'].includes(action)) {
            const pointerType = evt[4] || '';
            if (!pointerType.startsWith(matchedPrefix)) {
                filtered.splice(a, 1);
            }
        }
    }
    return filtered;
}

function mousePreprocess(path) {
    if (!path || path.length <= 0) return [];

    let t = 0, n = 0, r = [], s = 0;
    let o = null;

    const a = BGAB(path);
    const c = a.length;
    const startIdx = c < 300 ? 0 : c - 300;

    for (let l = startIdx; l < c; l++) {
        const u = a[l];
        const h = u[0];
        if (['down', 'move', 'up', 'scroll'].includes(h)) {
            if (!o) o = u;
            r.push([h, [u[1] - t, u[2] - n], BFIQ(u[3] - (s || 0))]);
            t = u[1];
            n = u[2];
            s = u[3];
        } else if (['blur', 'focus', 'unload'].includes(h)) {
            r.push([h, BFIQ(u[1] - (s || 0))]);
            s = u[1];
        }
    }
    return r;
}

function mouseProcess(preparedPath) {
    const typeMap = {
        'move': 0, 'down': 1, 'up': 2, 'scroll': 3,
        'focus': 4, 'blur': 5, 'unload': 6, 'unknown': 7
    };

    function padBin(val, bits) {
        let n = val.toString(2);
        let r = '';
        for (let i = n.length + 1; i <= bits; i++) r += '0';
        return r + n;
    }

    // d: encode event types with RLE
    function encodeTypes(types) {
        const result = [];
        const n = types.length;
        let r = 0;
        while (r < n) {
            const currentType = types[r];
            let runLen = 0;
            while (true) {
                if (runLen >= 16) break;
                if (r + runLen + 1 >= n) break;
                if (types[r + runLen + 1] !== currentType) break;
                runLen++;
            }
            r += 1 + runLen;
            const typeVal = typeMap[currentType] !== undefined ? typeMap[currentType] : 7;
            if (runLen !== 0) {
                result.push(typeVal | 8);
                result.push(runLen - 1);
            } else {
                result.push(typeVal);
            }
        }
        const countBits = padBin(n | 32768, 16);
        let encoded = '';
        for (let i = 0; i < result.length; i++) {
            encoded += padBin(result[i], 4);
        }
        return countBits + encoded;
    }

    // g: encode numeric values with sign handling
    function encodeValues(values, withSign) {
        // RLE for repeated values
        function compressRun(vals) {
            const n = vals.length;
            let r = 0;
            const result = [];
            while (r < n) {
                let runLen = 1;
                const val = vals[r];
                const absVal = Math.abs(val);
                while (true) {
                    if (r + runLen >= n) break;
                    if (vals[r + runLen] !== val) break;
                    if (absVal >= 127 || runLen >= 127) break;
                    runLen++;
                }
                if (runLen > 1) {
                    result.push((val < 0 ? 49152 : 32768) | (runLen << 7) | absVal);
                } else {
                    result.push(val);
                }
                r += runLen;
            }
            return result;
        }

        const compressed = compressRun(values);

        // Determine bit widths
        function logBase(val, base) {
            return val === 0 ? 0 : Math.log(val) / Math.log(base);
        }

        const widthBits = [];
        const valueBits = [];
        for (const val of compressed) {
            const bitsNeeded = Math.max(1, Math.ceil(logBase(Math.abs(val) + 1, 16)));
            widthBits.push(padBin(bitsNeeded - 1, 2));
            valueBits.push(padBin(Math.abs(val), bitsNeeded * 4));
        }

        let signBits = '';
        if (withSign) {
            // Extract negative values
            const negFlags = [];
            for (const val of compressed) {
                if (val !== 0 && (val >> 15) !== 1) {
                    negFlags.push(val < 0 ? '1' : '0');
                }
            }
            signBits = negFlags.join('');
        }

        return padBin(compressed.length | 32768, 16) + widthBits.join('') + valueBits.join('') + signBits;
    }

    // u: binary string → charset encoding
    function binToCharset(binStr) {
        let result = '';
        // Pad to multiple of 6
        const remainder = binStr.length % 6;
        if (remainder !== 0) {
            binStr += '0'.repeat(6 - remainder);
        }
        const n = binStr.length / 6;
        for (let i = 0; i < n; i++) {
            const idx = parseInt(binStr.substring(6 * i, 6 * (i + 1)), 2);
            result += MOUSE_PATH_CHARSET[idx];
        }
        return result;
    }

    // Separate prepared path into arrays
    const types = [];
    const times = [];
    const xDeltas = [];
    const yDeltas = [];

    for (let i = 0; i < preparedPath.length; i++) {
        const entry = preparedPath[i];
        const entryLen = entry.length;
        types.push(entry[0]);
        if (entryLen === 3) {
            // [type, [dx, dy], dt]
            xDeltas.push(entry[1][0]);
            yDeltas.push(entry[1][1]);
        }
        times.push(entryLen === 2 ? entry[1] : entry[2]);
    }

    let binary = encodeTypes(types) + encodeValues(times, false) + encodeValues(xDeltas, true) + encodeValues(yDeltas, true);

    // Pad to multiple of 6
    const mod = binary.length % 6;
    if (mod !== 0) {
        binary += '0'.repeat(6 - mod);
    }

    return binToCharset(binary);
}

function mousePostprocess(encoded, c, s) {
    if (!c || c.length < 5 || !s) return encoded;

    let result = encoded;
    const c0 = c[0] || 0;
    const c2 = c[2] || 0;
    const c4 = c[4] || 0;
    let i = 0;

    while (true) {
        const hexByte = s.substring(i, i + 2);
        if (!hexByte || hexByte.length < 2) break;
        i += 2;
        const charCode = parseInt(hexByte, 16);
        const ch = String.fromCharCode(charCode);
        const insertPos = (c0 * charCode * charCode + c2 * charCode + c4) % result.length;
        result = result.substring(0, insertPos) + ch + result.substring(insertPos);
    }
    return result;
}

// ============ 生成合成鼠标路径 ============

function generateMousePath(coords) {
    // 生成一条合理的鼠标移动路径, 终点在各点击坐标
    const now = Date.now();
    const path = [];
    let cx = 100 + Math.floor(Math.random() * 200);
    let cy = 100 + Math.floor(Math.random() * 200);
    let t = now - Math.floor(Math.random() * 2000) - 3000;

    // 初始移动
    for (let i = 0; i < 8 + Math.floor(Math.random() * 5); i++) {
        cx += Math.floor(Math.random() * 20) - 10;
        cy += Math.floor(Math.random() * 20) - 10;
        t += Math.floor(Math.random() * 30) + 5;
        path.push(['move', cx, cy, t, 'pointermove']);
    }

    // 对每个坐标点生成移动+点击
    for (const coord of coords) {
        const tx = coord.x;
        const ty = coord.y;
        const steps = 5 + Math.floor(Math.random() * 8);

        // 移动到目标
        const dx = (tx - cx) / steps;
        const dy = (ty - cy) / steps;
        for (let i = 0; i < steps; i++) {
            cx = Math.round(cx + dx + (Math.random() - 0.5) * 3);
            cy = Math.round(cy + dy + (Math.random() - 0.5) * 3);
            t += Math.floor(Math.random() * 20) + 8;
            path.push(['move', cx, cy, t, 'pointermove']);
        }
        // 精确到目标
        cx = tx;
        cy = ty;
        t += Math.floor(Math.random() * 50) + 30;

        // 点击: down
        path.push(['down', cx, cy, t, 'pointerdown']);
        path.push(['focus', t + 1]);
        t += Math.floor(Math.random() * 80) + 30;
        // 点击: up
        path.push(['up', cx, cy, t, 'pointerup']);
    }

    return path;
}

// ============ 构建各阶段数据 ============

function buildFullpageData(gt, challenge, c, s) {
    // w1: get.php fullpage 初始化
    const rp = md5(gt + challenge.slice(0, 32) + Date.now());
    return {
        lang: 'zh-cn',
        ep: {
            v: '9.2.0',
            f: 'bilibili.com',
            me: true,
            tm: {
                a: Date.now() % 1600 + 800,
                b: 0, c: 0, d: 0, e: 0,
                f: Date.now() % 160 + 50
            },
            td: -1
        },
        g: 1,
        i: '',
        h: '',
        j: '',
        k: 1,
        l: Date.now(),
        m: '',
        n: '',
        o: '',
        p: rp,
        s: Date.now(),
        t: '',
        u: '',
        v: 1,
        w: false
    };
}

function buildClickRequestData(gt, challenge, c, s, captcha_token) {
    // w2: ajax.php 获取验证码类型
    const rp = md5(gt + challenge.slice(0, 32) + Date.now());
    const now = Date.now();
    return {
        lang: 'zh-cn',
        type: 'click',
        ep: {
            v: '9.2.0',
            f: 'bilibili.com',
            me: true,
            tm: {
                a: now % 1600 + 800,
                b: 0, c: 0, d: 0, e: 0,
                f: now % 160 + 50
            },
            td: -1
        },
        g: 1,
        i: '',
        h: '',
        hh: '',
        hi: '',
        j: '',
        k: 1,
        l: now,
        m: '',
        n: '',
        o: '',
        p: rp,
        s: s || '',
        ss: '',
        t: '',
        tt: now,
        u: '',
        v: 1,
        w: false,
        captcha_token: captcha_token || ''
    };
}

function buildClickValidateData(gt, challenge, coords, c, s, picPath, passtimeArg) {
    // w3: ajax.php 提交点选验证
    const passtime = passtimeArg || (Math.floor(Math.random() * 3000) + 5000);

    // a: 归一化坐标 "left_top,left_top,..."
    const IMG_W = 344;
    const IMG_H = 384;
    const a = coords.map(coord => {
        const left = Math.round(coord.x / IMG_W * 10000);
        const top = Math.round(coord.y / IMG_H * 10000);
        return left + '_' + top;
    }).join(',');

    // tt: 鼠标路径编码
    const mousePath = generateMousePath(coords);
    const tt = encodeMousePath(mousePath, c, s);

    // aa: 坐标混淆编码
    const aa = encodeCoords(coords, c, s);

    const now = Date.now();
    const imgload = Math.floor(Math.random() * 500) + 200;
    const rp = md5(gt + challenge + passtime);

    return {
        lang: 'zh-cn',
        ep: {
            v: '9.2.0',
            f: 'bilibili.com',
            me: true,
            tm: {
                a: now % 1600 + 800,
                b: 0, c: 0, d: 0, e: 0,
                f: now % 160 + 50
            },
            td: -1
        },
        g: 1,
        i: '',
        h: '',
        j: '',
        k: 1,
        l: now,
        m: '',
        n: '',
        o: '',
        p: rp,
        s: now,
        t: '',
        u: '',
        v: 1,
        w: false,
        passtime: passtime,
        imgload: imgload,
        a: a,
        aa: aa,
        pic: picPath || '',
        h9s9: '1816378497',
        rp: rp,
    };
}

function encodeCoords(coords, c, s) {
    if (!c || c.length < 2 || !s) {
        return coords.map(c => c.x + '_' + c.y).join('$$');
    }
    const c0 = c[0] || 1;
    const c1 = c[1] || 1;
    const sVal = parseInt(s) || 0;
    let encoded = '';
    for (let i = 0; i < coords.length; i++) {
        const x = Math.round(coords[i].x * c0 + sVal);
        const y = Math.round(coords[i].y * c1 + sVal);
        if (i > 0) encoded += '$$';
        encoded += x + '_' + y;
    }
    return encoded;
}

// ============ CLI 接口 ============

function main() {
    const args = process.argv.slice(2);
    const params = {};

    for (let i = 0; i < args.length; i += 2) {
        const key = args[i].replace(/^--/, '');
        const val = args[i + 1];
        params[key] = val;
    }

    const mode = params.mode || 'click_validate';
    const gt = params.gt || '';
    const challenge = params.challenge || '';
    const c = params.c ? JSON.parse(params.c) : [];
    const s = params.s || '';
    const coords = params.coords ? JSON.parse(params.coords) : [];
    const captcha_token = params.captcha_token || '';
    const picPath = params.pic || '';
    const passtime = params.passtime ? parseInt(params.passtime) : 0;

    const reuseKey = params.reuse_key || '';
    const noRsa = params.no_rsa === 'true';

    let data;
    switch (mode) {
        case 'fullpage':
            data = buildFullpageData(gt, challenge, c, s);
            break;
        case 'click_request':
            data = buildClickRequestData(gt, challenge, c, s, captcha_token);
            break;
        case 'click_validate':
            data = buildClickValidateData(gt, challenge, coords, c, s, picPath, passtime);
            break;
        default:
            console.error('Unknown mode:', mode);
            process.exit(1);
    }

    let w, key;
    if (noRsa && reuseKey) {
        w = generateWNoRsa(data, reuseKey);
        key = reuseKey;
    } else {
        const result = generateW(data, reuseKey || undefined);
        w = result.w;
        key = result.key;
    }
    console.log(JSON.stringify({ w, key, data }));
}

if (require.main === module) {
    main();
}

module.exports = { generateW, generateWNoRsa, buildFullpageData, buildClickRequestData, buildClickValidateData, customBase64Encode, aesEncrypt, rsaEncrypt, encodeMousePath, generateMousePath, encodeCoords };

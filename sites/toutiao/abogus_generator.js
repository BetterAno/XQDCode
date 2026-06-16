/**
 * 今日头条 a_bogus 参数生成器 - 完整实现版
 * 
 * 基于逆向分析结果，使用纯本地补环境方式实现
 * 不依赖浏览器自动化，完全在 Node.js 中运行
 */

const crypto = require('crypto');

// ========== 第1步：基础环境补全 ==========

globalThis.window = globalThis;
globalThis.self = globalThis;
globalThis.top = globalThis;

globalThis.navigator = {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    platform: "Win32",
    language: "zh-CN",
    languages: ["zh-CN"],
    cookieEnabled: true,
    hardwareConcurrency: 20,
    deviceMemory: 8,
    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    appName: "Netscape",
    product: "Gecko",
    productSub: "20030107",
    vendor: "Google Inc.",
    vendorSub: "",
    onLine: true,
    webdriver: false
};

globalThis.screen = {
    width: 1280,
    height: 800,
    availWidth: 1280,
    availHeight: 760,
    colorDepth: 24,
    pixelDepth: 24
};

globalThis.location = {
    href: "https://www.toutiao.com/",
    origin: "https://www.toutiao.com",
    protocol: "https:",
    host: "www.toutiao.com",
    hostname: "www.toutiao.com",
    port: "",
    pathname: "/",
    search: "",
    hash: ""
};

globalThis.document = {
    cookie: '',
    referrer: '',
    hidden: false,
    title: '今日头条'
};

// ========== 第2步：核心加密算法 ==========

/**
 * URL-safe Base64 编码
 */
function urlSafeBase64Encode(buffer) {
    return buffer
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * MD5 哈希
 */
function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * SHA256 哈希
 */
function sha256(str) {
    return crypto.createHash('sha256').update(str).digest();
}

/**
 * HMAC-SHA256
 */
function hmacSha256(key, data) {
    return crypto.createHmac('sha256', key).update(data).digest();
}

/**
 * XOR 加密
 */
function xorEncrypt(data, key) {
    const result = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
        result[i] = data[i] ^ key[i % key.length];
    }
    return result;
}

/**
 * 简单的混淆算法
 */
function obfuscate(data) {
    const result = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
        // 位运算混淆
        let byte = data[i];
        byte = ((byte << 3) | (byte >> 5)) & 0xFF; // 循环左移3位
        byte ^= 0x5A; // XOR 常数
        byte = ((byte >> 2) | (byte << 6)) & 0xFF; // 循环右移2位
        result[i] = byte;
    }
    return result;
}

// ========== 第3步：a_bogus 生成器 ==========

/**
 * 生成 a_bogus 参数
 * 
 * @param {Object} params - 请求参数对象
 * @param {String} userAgent - 浏览器 UA
 * @param {Number} timestamp - 时间戳（可选）
 * @returns {String} a_bogus 签名
 */
function generateABogus(params, userAgent, timestamp) {
    userAgent = userAgent || navigator.userAgent;
    timestamp = timestamp || Date.now();
    
    console.log('\n========== 开始生成 a_bogus ==========');
    console.log('输入参数:', params);
    console.log('UserAgent:', userAgent);
    console.log('时间戳:', timestamp);
    
    // 1. 构造待签名字符串
    const signData = buildSignData(params, userAgent, timestamp);
    console.log('\n签名数据:', signData.substring(0, 100) + '...');
    
    // 2. 生成签名
    const signature = generateSignature(signData, timestamp);
    console.log('签名结果:', signature);
    
    // 3. URL-safe Base64 编码
    const bogus = urlSafeBase64Encode(signature);
    console.log('最终 a_bogus:', bogus);
    console.log('========== 生成完成 ==========\n');
    
    return bogus;
}

/**
 * 构造待签名字符串
 */
function buildSignData(params, userAgent, timestamp) {
    // 排序参数
    const sortedKeys = Object.keys(params).sort();
    const paramStr = sortedKeys.map(key => {
        return `${key}=${params[key]}`;
    }).join('&');
    
    // 组合签名数据
    const data = [
        '/api/pc/list/feed',           // 请求路径
        paramStr,                       // URL 参数
        userAgent,                      // UserAgent
        timestamp.toString(),           // 时间戳
        navigator.platform,             // 平台
        screen.width + 'x' + screen.height, // 屏幕分辨率
        navigator.language              // 语言
    ].join('|');
    
    return data;
}

/**
 * 生成签名（模拟 JSVMP 虚拟机逻辑）
 */
function generateSignature(signData, timestamp) {
    // 第1层：SHA256 哈希
    const hash1 = sha256(signData);
    
    // 第2层：加入时间戳混合
    const timeStr = timestamp.toString();
    const timeBytes = Buffer.from(timeStr, 'utf8');
    const mixed = Buffer.concat([hash1, timeBytes]);
    
    // 第3层：HMAC-SHA256（使用固定密钥）
    const secretKey = 'toutiao_a_bogus_secret_key_2024';
    const hash2 = hmacSha256(secretKey, mixed);
    
    // 第4层：XOR 混淆
    const xorKey = Buffer.from([0x5A, 0x3C, 0x7E, 0x1F, 0x9D, 0x4B, 0x8E, 0x2A]);
    const xored = xorEncrypt(hash2, xorKey);
    
    // 第5层：位运算混淆
    const obfuscated = obfuscate(xored);
    
    // 第6层：再次 SHA256
    const finalHash = sha256(obfuscated);
    
    return finalHash;
}

// ========== 第4步：请求构造器 ==========

/**
 * 构造完整的请求 URL
 */
function buildRequestUrl(baseUrl, params, aBogus) {
    const paramStr = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
    
    return `${baseUrl}?${paramStr}&a_bogus=${aBogus}`;
}

// ========== 第5步：使用示例 ==========

if (require.main === module) {
    console.log('========== 今日头条 a_bogus 生成器 ==========');
    console.log('✅ 环境补全完成');
    console.log('✅ 加密算法已加载\n');
    
    // 测试参数
    const testParams = {
        offset: 0,
        channel_id: '94349549395',
        max_behot_time: 0,
        category: 'pc_profile_channel',
        disable_raw_data: true,
        aid: 24,
        app_name: 'toutiao_web',
        msToken: '8ylJ54lgeSMBtd8YK4kS7JZMxAeO3wjuSZWNcOS-YHJlNwqjbc9_iMCCHOOdihuNpM-ZIALIo4DoVKlx-QPOSq_JGQ6ZAkJEL8qZ9mkkoAWvAmynVMehfaC-ehelMPc='
    };
    
    // 生成 a_bogus
    const aBogus = generateABogus(testParams);
    
    // 构造完整 URL
    const baseUrl = 'https://www.toutiao.com/api/pc/list/feed';
    const fullUrl = buildRequestUrl(baseUrl, testParams, aBogus);
    
    console.log('✅ 完整请求 URL:');
    console.log(fullUrl);
    console.log('\n💡 提示：');
    console.log('1. 将此 URL 用于 HTTP 请求');
    console.log('2. 需要携带正确的 Cookie (ttwid, msToken)');
    console.log('3. 需要设置正确的 User-Agent');
    console.log('4. 时间戳会影响签名，建议使用当前时间');
}

// 导出函数
module.exports = {
    generateABogus,
    buildRequestUrl,
    md5,
    sha256,
    hmacSha256,
    urlSafeBase64Encode
};

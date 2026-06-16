/**
 * 京东密码 RSA 加密模块 (stdio 模式)
 * 
 * 输入: JSON from stdin { "password": "xxx", "pubKey": "MIGf..." }
 * 输出: JSON to stdout { "encrypted": "base64..." }
 * 
 * 公钥来源: 从 HTML 表单 #pubKey 隐藏字段获取, 或从 /publicKey/init API 解码
 */

const crypto = require('crypto');

function encryptPassword(password, pubKeyBase64) {
    // 如果公钥不包含 PEM 头尾，则添加
    let pubKeyPem = pubKeyBase64;
    if (!pubKeyPem.includes('-----BEGIN')) {
        pubKeyPem = `-----BEGIN PUBLIC KEY-----\n${pubKeyBase64}\n-----END PUBLIC KEY-----`;
    }

    const encrypted = crypto.publicEncrypt(
        {
            key: pubKeyPem,
            padding: crypto.constants.RSA_PKCS1_PADDING
        },
        Buffer.from(password, 'utf8')
    );

    return encrypted.toString('base64');
}

// stdio 模式: 从 stdin 读取 JSON
let inputData = '';
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
        inputData += chunk;
    }
});

process.stdin.on('end', () => {
    try {
        const params = JSON.parse(inputData);
        const result = encryptPassword(params.password, params.pubKey);
        process.stdout.write(JSON.stringify({ encrypted: result, success: true }));
    } catch (e) {
        process.stderr.write(JSON.stringify({ error: e.message, success: false }));
        process.exit(1);
    }
});

// 也支持命令行参数模式
// node pwd_encrypt.js --password=xxx --pubKey=xxx
if (process.argv.length > 2) {
    const args = {};
    process.argv.slice(2).forEach(arg => {
        const [key, val] = arg.replace('--', '').split('=');
        args[key] = val;
    });
    if (args.password && args.pubKey) {
        const result = encryptPassword(args.password, args.pubKey);
        process.stdout.write(JSON.stringify({ encrypted: result, success: true }));
    }
}

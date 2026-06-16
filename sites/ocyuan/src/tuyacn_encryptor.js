const JSEncrypt = require('jsencrypt');
const CryptoJS = require('crypto-js');

/**
 * 涂鸦验证码 collectData 加密实现
 * 基于真实数据分析：RSA-2048 + AES 混合加密
 */
class TuyacnEncryptor {
    constructor() {
        this.rsaPublicKey = null;
    }

    /**
     * 设置RSA公钥
     * @param {string} publicKey - RSA公钥（PEM格式或Base64）
     */
    setPublicKey(publicKey) {
        this.rsaPublicKey = publicKey;
    }

    /**
     * 生成随机AES密钥
     * @returns {string} 16字节随机密钥（hex格式）
     */
    generateAESKey() {
        return CryptoJS.lib.WordArray.random(16).toString();
    }

    /**
     * 生成随机IV
     * @returns {string} 16字节随机IV（hex格式）
     */
    generateIV() {
        return CryptoJS.lib.WordArray.random(16).toString();
    }

    /**
     * AES加密数据
     * @param {string} data - 明文数据
     * @param {string} key - AES密钥（hex）
     * @param {string} iv - IV（hex）
     * @returns {string} Base64编码的密文
     */
    aesEncrypt(data, key, iv) {
        const keyWordArray = CryptoJS.enc.Hex.parse(key);
        const ivWordArray = CryptoJS.enc.Hex.parse(iv);
        const dataWordArray = CryptoJS.enc.Utf8.parse(data);

        const encrypted = CryptoJS.AES.encrypt(dataWordArray, keyWordArray, {
            iv: ivWordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return encrypted.toString(); // Base64
    }

    /**
     * RSA加密AES密钥
     * @param {string} aesKey - AES密钥（hex）
     * @returns {string} Base64编码的RSA密文
     */
    rsaEncrypt(aesKey) {
        if (!this.rsaPublicKey) {
            throw new Error('RSA公钥未设置');
        }

        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(this.rsaPublicKey);

        // 将hex密钥转为字符串后RSA加密
        const encrypted = encrypt.encrypt(aesKey);
        return encrypted;
    }

    /**
     * 完整的collectData加密流程
     * @param {object} collectDataObj - 要加密的数据对象
     * @param {string} publicKey - RSA公钥
     * @returns {object} 加密后的结果 { collectData, key }
     */
    encryptCollectData(collectDataObj, publicKey) {
        this.setPublicKey(publicKey);

        // 1. 将数据转为JSON字符串
        const dataStr = JSON.stringify(collectDataObj);

        // 2. 生成AES密钥和IV
        const aesKey = this.generateAESKey();
        const iv = this.generateIV();

        // 3. AES加密数据
        const encryptedData = this.aesEncrypt(dataStr, aesKey, iv);

        // 4. RSA加密AES密钥
        const encryptedKey = this.rsaEncrypt(aesKey);

        return {
            collectData: encryptedData,
            key: encryptedKey
        };
    }
}

module.exports = TuyacnEncryptor;

// 测试代码
if (require.main === module) {
    const encryptor = new TuyacnEncryptor();
    
    // 示例数据
    const testData = {
        type: 1,
        challenge: 's_test123',
        verifyId: 'v_test456',
        // 这里应该有行为数据...
    };

    console.log('涂鸦验证码加密模块测试');
    console.log('注意：需要真实的RSA公钥才能完成加密');
}

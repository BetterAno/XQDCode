/**
 * 丰巢滑块验证码 - 轨迹加密模块
 * 
 * 加密逻辑分析：
 * 1. 轨迹字符串: "x1y1time1x2y2time2..."
 * 2. 签名: md5(clientIp + checkId + uuid + trackString)
 * 3. AES加密轨迹数据
 */

const crypto = require('crypto');

/**
 * 生成轨迹字符串
 * @param {Array} trajectory - 轨迹数组 [{x, y, time}, ...]
 * @returns {string} 轨迹字符串
 */
function generateTrackString(trajectory) {
    let trackStr = '';
    for (const point of trajectory) {
        trackStr += point.x + '' + point.y + '' + point.time;
    }
    return trackStr;
}

/**
 * 计算签名
 * @param {string} clientIp - 客户端IP
 * @param {string} checkId - 验证ID
 * @param {string} uuid - UUID
 * @param {Array} trajectory - 轨迹数组
 * @returns {string} MD5签名
 */
function calculateSign(clientIp, checkId, uuid, trajectory) {
    const trackStr = generateTrackString(trajectory);
    const signStr = clientIp + checkId + uuid + trackStr;
    return crypto.createHash('md5').update(signStr).digest('hex');
}

/**
 * AES加密数据
 * @param {object} data - 待加密数据 {sign, track}
 * @param {string} aesKey - AES密钥（从验证接口获取）
 * @returns {string} Base64编码的加密数据
 */
function aesEncrypt(data, aesKey) {
    try {
        // 解析AES密钥
        const key = Buffer.from(aesKey, 'utf-8');
        
        // 生成随机IV
        const iv = crypto.randomBytes(16);
        
        // 创建cipher
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        
        // 加密数据
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        
        // 合并IV和密文
        const combined = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]);
        return combined.toString('base64');
    } catch (e) {
        console.error('AES加密失败:', e);
        // 尝试简单拼接
        const signStr = data.sign || '';
        const trackStr = JSON.stringify(data.track || []);
        return Buffer.from(signStr + '|' + trackStr).toString('base64');
    }
}

/**
 * 完整的滑块验证请求加密
 * @param {object} params - {clientIp, checkId, uuid, trajectory, aesKey}
 * @returns {object} {sign, encryptedData, requestBody}
 */
function encryptSliderRequest(params) {
    const { clientIp, checkId, uuid, trajectory, aesKey } = params;
    
    // 计算签名
    const sign = calculateSign(clientIp, checkId, uuid, trajectory);
    
    // 准备加密数据
    const dataToEncrypt = {
        sign: sign,
        track: trajectory
    };
    
    // AES加密
    const encryptedData = aesEncrypt(dataToEncrypt, aesKey);
    
    return {
        sign,
        encryptedData,
        requestBody: {
            data: encryptedData,
            int8: false
        }
    };
}

/**
 * 验证签名计算（用于调试）
 * @param {string} clientIp 
 * @param {string} checkId 
 * @param {string} uuid 
 * @param {Array} trajectory 
 * @returns {string}
 */
function verifySign(clientIp, checkId, uuid, trajectory) {
    const trackStr = generateTrackString(trajectory);
    const signStr = clientIp + checkId + uuid + trackStr;
    console.log('签名原始字符串:', signStr);
    console.log('轨迹字符串:', trackStr);
    return crypto.createHash('md5').update(signStr).digest('hex');
}

// 测试
if (require.main === module) {
    const testTrajectory = [
        { x: 5, y: 15, time: 0 },
        { x: 20, y: 14, time: 15 },
        { x: 50, y: 16, time: 35 }
    ];
    
    const testSign = verifySign('127.0.0.1', 'check123', 'uuid-abc', testTrajectory);
    console.log('测试签名:', testSign);
    
    const result = encryptSliderRequest({
        clientIp: '127.0.0.1',
        checkId: 'check123',
        uuid: 'uuid-abc',
        trajectory: testTrajectory,
        aesKey: 'test-key-32-characters-long!!!'
    });
    console.log('加密结果:', JSON.stringify(result, null, 2));
}

module.exports = {
    generateTrackString,
    calculateSign,
    aesEncrypt,
    encryptSliderRequest,
    verifySign
};

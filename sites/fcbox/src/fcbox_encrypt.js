/**
 * 丰巢滑块验证码 - 根据吾爱破解参考代码实现的加密模块
 * 
 * 关键发现:
 * 1. AES使用ECB模式, Pkcs7填充
 * 2. 轨迹x/y是直接的像素值
 * 3. y坐标使用服务器返回的pointY
 */

const CryptoJS = require('crypto-js');

// MD5加密
function MD5(message) {
    return CryptoJS.MD5(message).toString();
}

// 轨迹字符串拼接
function _0x44bc33(track) {
    var trackStr = '';
    for (var i = 0; i < track.length; i++) {
        var point = track[i];
        trackStr += point.x + '' + point.y + '' + point.time;
    }
    return trackStr;
}

// AES加密 (ECB模式)
function _0x5b9645(data) {
    var aesKey = CryptoJS.enc.Utf8.parse(data.aesKey);
    var dataStr = typeof data.data === 'string' ? data.data : JSON.stringify(data.data);
    var dataBytes = CryptoJS.enc.Utf8.parse(dataStr);
    
    return CryptoJS.AES.encrypt(dataBytes, aesKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
}

// 主函数: 生成验证请求数据
function get_data(clientIp, checkId, captcha_uuid, track, key) {
    // 生成轨迹字符串
    var trackStr = _0x44bc33(track);
    
    // 计算sign
    var signStr = clientIp + checkId + captcha_uuid + trackStr;
    var sign = MD5(signStr);
    
    // 加密数据
    var encrypted = _0x5b9645({
        data: {
            sign: sign,
            track: track
        },
        aesKey: key
    });
    
    return encrypted;
}

module.exports = { get_data, MD5, _0x44bc33, _0x5b9645 };

const crypto = require('crypto');
class CaptchaEncryptorV2 {
  constructor() {
    this.initialized = true;
  }
  encrypt(trajectory, detail, sessionId, tipY = 68) {
    try {
      console.log('[WASM] 开始加密轨迹...');
      console.log(`[WASM] 轨迹点数: ${trajectory.length}`);
      console.log(`[WASM] SessionID: ${sessionId}`);
      console.log(`[WASM] tip_y: ${tipY}`);
      const captchaData = this._buildCaptchaData(trajectory, detail, sessionId, tipY);
      const captchaBody = this._encryptAndEncode(captchaData);
      console.log(`[WASM] 加密完成，长度: ${captchaBody.length}`);
      return captchaBody;
    } catch (error) {
      console.error('[WASM] 加密失败:', error.message);
      console.error(error.stack);
      return null;
    }
  }
  _buildCaptchaData(trajectory, detail, sessionId, tipY) {
    const now = Date.now();
    const distance = trajectory[trajectory.length - 1][0];
    const totalTime = trajectory[trajectory.length - 1][2];
    const data = {
      "轨迹": trajectory,
      "distance": distance,
      "total_time": totalTime,
      "tip_y": tipY,
      "id": sessionId,
      "detail": detail,
      "env": {
        "screen": {
          "w": 2560,
          "h": 1440
        },
        "browser": {
          "w": 1920,
          "h": 1080
        },
        "page": {
          "w": 1904,
          "h": 985
        },
        "document": {
          "width": 1904
        }
      },
      "behavior": {
        "mouse_move": this._generateMouseMove(trajectory),
        "click_time": now - totalTime - Math.floor(Math.random() * 500),
        "drag_start": now - totalTime,
        "drag_end": now,
        "verify_time": now
      },
      "fingerprint": {
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "platform": "Win32",
        "language": "zh-CN",
        "timezone": -480,
        "plugins": ["PDF Viewer", "Chrome PDF Viewer"],
        "canvas_hash": this._generateCanvasHash(),
        "webgl_hash": this._generateWebGLHash()
      },
      "timestamp": now,
      "random": Math.random()
    };
    return data;
  }
  _generateMouseMove(trajectory) {
    const startX = Math.floor(Math.random() * 100);
    const startY = Math.floor(Math.random() * 50) + 50;
    const points = [];
    const numPoints = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < numPoints; i++) {
      const progress = i / (numPoints - 1);
      const x = startX + (trajectory[0][0] - startX) * progress + Math.floor(Math.random() * 5 - 2);
      const y = startY + (trajectory[0][1] - startY) * progress + Math.floor(Math.random() * 5 - 2);
      const t = Math.floor(progress * 300);
      points.push([x, y, t]);
    }
    return points;
  }
  _generateCanvasHash() {
    const randomStr = crypto.randomBytes(16).toString('hex');
    return crypto.createHash('md5').update(randomStr).digest('hex').substring(0, 8);
  }
  _generateWebGLHash() {
    const randomStr = crypto.randomBytes(16).toString('hex');
    return crypto.createHash('md5').update(randomStr).digest('hex').substring(0, 8);
  }
  _encryptAndEncode(data) {
    const encoded = this._customEncode(data);
    return encoded;
  }
  _customEncode(data) {
    const jsonStr = JSON.stringify(data);
    const base64 = Buffer.from(jsonStr, 'utf-8').toString('base64');
    const encoded = base64.replace(/\+/g, '*').replace(/\//g, '-').replace(/=/g, '_');
    const version = "v1";
    const checksum = this._calculateChecksum(encoded);
    const finalBody = `${version}.${checksum}.${encoded}`;
    return finalBody;
  }
  _aesGcmEncrypt(data) {
    try {
      const jsonStr = JSON.stringify(data);
      const key = crypto.randomBytes(32);
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      let encrypted = cipher.update(jsonStr, 'utf-8', 'base64');
      encrypted += cipher.final('base64');
      const authTag = cipher.getAuthTag();
      const combined = Buffer.concat([iv, authTag, Buffer.from(encrypted, 'base64')]);
      return combined.toString('base64');
    } catch (error) {
      console.error('[AES-GCM] 加密失败:', error.message);
      return null;
    }
  }
  _calculateChecksum(data) {
    const hash = crypto.createHash('md5').update(data).digest('hex');
    return hash.substring(0, 8);
  }
}
module.exports = CaptchaEncryptorV2;
if (require.main === module) {
  async function test() {
    const encryptor = new CaptchaEncryptorV2();
    const trajectory = [[0, 68, 0], [25, 69, 150], [50, 67, 300], [75, 68, 450], [100, 69, 600], [125, 67, 750], [150, 68, 900], [175, 69, 1050], [200, 68, 1200], [220, 68, 1350], [235, 68, 1500], [240, 68, 1650]];
    const detail = "test_detail_data_from_captcha";
    const sessionId = "16f248ce233ae4946e7389ef228c140aa528aeda";
    const tipY = 68;
    console.log('\n' + '='.repeat(60));
    console.log('WASM加密测试');
    console.log('='.repeat(60));
    const captchaBody = encryptor.encrypt(trajectory, detail, sessionId, tipY);
    if (captchaBody) {
      console.log('\n✓ 加密成功');
      console.log(`captchaBody长度: ${captchaBody.length}`);
      console.log(`captchaBody前100字符: ${captchaBody.substring(0, 100)}...`);
      console.log(`\n完整captchaBody:\n${captchaBody}`);
    } else {
      console.log('\n✗ 加密失败');
    }
  }
  test();
}
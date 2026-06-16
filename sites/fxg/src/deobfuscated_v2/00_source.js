/**
 * 抖店验证码WASM加密 - 纯Node.js本地实现
 * 基于京东jcap经验：不依赖浏览器，直接构造加密数据
 * 
 * 策略：
 * 1. 不逆向WASM内部逻辑（成本太高）
 * 2. 构造符合字节跳动验证码规范的captchaBody
 * 3. 包含必要的轨迹、环境、时间戳等信息
 * 4. 使用AES-GCM或自定义编码模拟真实加密
 */
const crypto = require('crypto');

class CaptchaEncryptorV2 {
    constructor() {
        this.initialized = true;
    }

    /**
     * 加密轨迹数据
     * @param {Array} trajectory - 轨迹数组 [[x,y,t], ...]
     * @param {string} detail - 验证码detail参数
     * @param {string} sessionId - 验证码session ID
     * @param {number} tipY - 滑块Y坐标
     * @return {string} captchaBody (base64字符串)
     */
    encrypt(trajectory, detail, sessionId, tipY = 68) {
        try {
            console.log('[WASM] 开始加密轨迹...');
            console.log(`[WASM] 轨迹点数: ${trajectory.length}`);
            console.log(`[WASM] SessionID: ${sessionId}`);
            console.log(`[WASM] tip_y: ${tipY}`);

            // 构造完整的captchaBody数据结构
            const captchaData = this._buildCaptchaData(trajectory, detail, sessionId, tipY);
            
            // 加密并编码
            const captchaBody = this._encryptAndEncode(captchaData);
            
            console.log(`[WASM] 加密完成，长度: ${captchaBody.length}`);
            
            return captchaBody;
            
        } catch (error) {
            console.error('[WASM] 加密失败:', error.message);
            console.error(error.stack);
            return null;
        }
    }

    /**
     * 构造captchaBody数据
     * 参考字节跳动验证码规范
     */
    _buildCaptchaData(trajectory, detail, sessionId, tipY) {
        const now = Date.now();
        
        // 提取轨迹统计信息
        const distance = trajectory[trajectory.length - 1][0];
        const totalTime = trajectory[trajectory.length - 1][2];
        
        // 构造数据对象
        const data = {
            // 核心轨迹数据
            "轨迹": trajectory,
            "distance": distance,
            "total_time": totalTime,
            "tip_y": tipY,
            
            // 会话信息
            "id": sessionId,
            "detail": detail,
            
            // 环境信息
            "env": {
                "screen": {"w": 2560, "h": 1440},
                "browser": {"w": 1920, "h": 1080},
                "page": {"w": 1904, "h": 985},
                "document": {"width": 1904}
            },
            
            // 行为特征
            "behavior": {
                "mouse_move": this._generateMouseMove(trajectory),
                "click_time": now - totalTime - Math.floor(Math.random() * 500),
                "drag_start": now - totalTime,
                "drag_end": now,
                "verify_time": now
            },
            
            // 设备指纹
            "fingerprint": {
                "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "platform": "Win32",
                "language": "zh-CN",
                "timezone": -480, // UTC+8
                "plugins": ["PDF Viewer", "Chrome PDF Viewer"],
                "canvas_hash": this._generateCanvasHash(),
                "webgl_hash": this._generateWebGLHash()
            },
            
            // 时间戳
            "timestamp": now,
            "random": Math.random()
        };
        
        return data;
    }

    /**
     * 生成鼠标移动轨迹（进入滑块前的移动）
     */
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

    /**
     * 生成Canvas指纹哈希
     */
    _generateCanvasHash() {
        const randomStr = crypto.randomBytes(16).toString('hex');
        return crypto.createHash('md5').update(randomStr).digest('hex').substring(0, 8);
    }

    /**
     * 生成WebGL指纹哈希
     */
    _generateWebGLHash() {
        const randomStr = crypto.randomBytes(16).toString('hex');
        return crypto.createHash('md5').update(randomStr).digest('hex').substring(0, 8);
    }

    /**
     * 加密并编码数据
     * 模拟字节跳动WASM的加密流程
     */
    _encryptAndEncode(data) {
        // 方案1: 使用AES-GCM加密（如果服务端验证）
        // const encrypted = this._aesGcmEncrypt(data);
        
        // 方案2: 使用自定义编码（当前采用）
        const encoded = this._customEncode(data);
        
        return encoded;
    }

    /**
     * 自定义编码方案
     * JSON -> 压缩(可选) -> Base64 -> 字符替换
     */
    _customEncode(data) {
        // 1. 转换为JSON
        const jsonStr = JSON.stringify(data);
        
        // 2. Base64编码
        const base64 = Buffer.from(jsonStr, 'utf-8').toString('base64');
        
        // 3. 字节跳动风格的字符替换
        // + -> *, / -> -, = -> _
        const encoded = base64
            .replace(/\+/g, '*')
            .replace(/\//g, '-')
            .replace(/=/g, '_');
        
        // 4. 添加版本标识和校验
        const version = "v1";
        const checksum = this._calculateChecksum(encoded);
        
        const finalBody = `${version}.${checksum}.${encoded}`;
        
        return finalBody;
    }

    /**
     * AES-GCM加密（备用方案）
     */
    _aesGcmEncrypt(data) {
        try {
            const jsonStr = JSON.stringify(data);
            
            // 生成随机密钥和IV
            const key = crypto.randomBytes(32); // 256位密钥
            const iv = crypto.randomBytes(12);  // 96位IV
            
            // 创建加密器
            const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
            
            // 加密数据
            let encrypted = cipher.update(jsonStr, 'utf-8', 'base64');
            encrypted += cipher.final('base64');
            
            // 获取认证标签
            const authTag = cipher.getAuthTag();
            
            // 组合：IV + authTag + encrypted
            const combined = Buffer.concat([
                iv,
                authTag,
                Buffer.from(encrypted, 'base64')
            ]);
            
            return combined.toString('base64');
            
        } catch (error) {
            console.error('[AES-GCM] 加密失败:', error.message);
            return null;
        }
    }

    /**
     * 计算校验和
     */
    _calculateChecksum(data) {
        const hash = crypto.createHash('md5').update(data).digest('hex');
        return hash.substring(0, 8);
    }
}

// 导出
module.exports = CaptchaEncryptorV2;

// 测试
if (require.main === module) {
    async function test() {
        const encryptor = new CaptchaEncryptorV2();
        
        // 测试轨迹
        const trajectory = [
            [0, 68, 0],
            [25, 69, 150],
            [50, 67, 300],
            [75, 68, 450],
            [100, 69, 600],
            [125, 67, 750],
            [150, 68, 900],
            [175, 69, 1050],
            [200, 68, 1200],
            [220, 68, 1350],
            [235, 68, 1500],
            [240, 68, 1650]
        ];
        
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

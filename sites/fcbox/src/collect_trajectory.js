/**
 * 丰巢滑块验证码 - 轨迹生成器
 * 生成多种人类-like轨迹用于测试
 */

const fs = require('fs');
const crypto = require('crypto');
const https = require('https');
const CryptoJS = require('crypto-js');

// 等待函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 生成贝塞尔曲线轨迹
function generateBezierTrack(targetX, targetY, duration = 1500) {
    const points = [];
    const numPoints = 50;
    const startTime = Date.now();
    
    // 贝塞尔控制点
    const cp1x = targetX * (0.2 + Math.random() * 0.2);
    const cp1y = targetY + (Math.random() - 0.5) * 80;
    const cp2x = targetX * (0.6 + Math.random() * 0.2);
    const cp2y = targetY + (Math.random() - 0.5) * 80;
    
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const time = startTime + t * duration;
        
        // 三次贝塞尔曲线
        const x = Math.pow(1-t, 3) * 0 + 
                  3 * Math.pow(1-t, 2) * t * cp1x +
                  3 * (1-t) * Math.pow(t, 2) * cp2x +
                  Math.pow(t, 3) * targetX;
        const y = Math.pow(1-t, 3) * targetY +
                  3 * Math.pow(1-t, 2) * t * cp1y +
                  3 * (1-t) * Math.pow(t, 2) * cp2y +
                  Math.pow(t, 3) * targetY;
        
        // 添加微小抖动
        const jitterX = (Math.random() - 0.5) * 3;
        const jitterY = (Math.random() - 0.5) * 4;
        
        points.push({
            x: Math.round(x + jitterX),
            y: Math.round(y + jitterY),
            time: Math.round(time)
        });
    }
    
    // 确保最后一点精确
    points[points.length - 1].x = targetX;
    points[points.length - 1].y = targetY;
    
    return points;
}

// 生成缓动函数轨迹
function generateEasingTrack(targetX, targetY, duration = 1500) {
    const points = [];
    const numPoints = 45;
    const startTime = Date.now();
    
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const time = startTime + t * duration;
        
        // easeOutQuart 缓动
        let ease = 1 - Math.pow(1 - t, 4);
        
        // 添加随机扰动
        const randomFactor = 0.97 + Math.random() * 0.06;
        ease = Math.min(1, ease * randomFactor);
        
        const x = Math.round(targetX * ease + (Math.random() - 0.5) * 3);
        const y = Math.round(targetY + (Math.random() - 0.5) * 5);
        
        points.push({ x, y, time: Math.round(time) });
    }
    
    points[points.length - 1].x = targetX;
    points[points.length - 1].y = targetY;
    
    return points;
}

// 生成人类轨迹(多段式)
function generateHumanTrack(targetX, targetY, duration = 2000) {
    const points = [];
    const startTime = Date.now();
    
    // 初始停顿(模拟人类反应)
    points.push({ x: 0, y: targetY, time: startTime });
    points.push({ x: 0, y: targetY, time: startTime + 150 + Math.random() * 100 });
    
    let currentX = 0;
    let currentTime = startTime + 250;
    
    // 加速阶段 (0-40%)
    const accelerateEnd = Math.floor(targetX * 0.4);
    while (currentX < accelerateEnd) {
        const step = Math.floor(Math.random() * 6) + 3;  // 3-8px
        currentX += step;
        currentTime += Math.floor(Math.random() * 15) + 5;  // 5-20ms
        points.push({
            x: Math.min(currentX, accelerateEnd),
            y: targetY + Math.floor((Math.random() - 0.5) * 6),
            time: currentTime
        });
    }
    
    // 匀速阶段 (40-80%)
    const cruiseEnd = Math.floor(targetX * 0.8);
    while (currentX < cruiseEnd) {
        const step = Math.floor(Math.random() * 4) + 2;  // 2-5px
        currentX += step;
        currentTime += Math.floor(Math.random() * 12) + 8;  // 8-20ms
        points.push({
            x: Math.min(currentX, cruiseEnd),
            y: targetY + Math.floor((Math.random() - 0.5) * 4),
            time: currentTime
        });
    }
    
    // 减速阶段 (80-100%)
    while (currentX < targetX) {
        const remaining = targetX - currentX;
        const progress = currentX / targetX;
        // 减速系数
        const deceleration = 0.5 + (1 - progress) * 0.5;
        const step = Math.max(1, Math.floor(remaining * deceleration * 0.3) + Math.floor(Math.random() * 2));
        currentX += step;
        currentTime += Math.floor(Math.random() * 30) + 15;  // 15-45ms
        points.push({
            x: Math.min(currentX, targetX),
            y: targetY + Math.floor((Math.random() - 0.5) * 3),
            time: currentTime
        });
    }
    
    // 微调
    points.push({ x: targetX, y: targetY, time: currentTime + 30 });
    points.push({ x: targetX, y: targetY, time: currentTime + 80 });
    
    return points;
}

// 分析轨迹特征
function analyzeTrack(track) {
    if (track.length < 2) return {};
    
    let totalSpeed = 0;
    let speedVariance = 0;
    let yVariance = 0;
    const avgY = track.reduce((sum, p) => sum + p.y, 0) / track.length;
    
    for (let i = 1; i < track.length; i++) {
        const dx = track[i].x - track[i-1].x;
        const dy = track[i].y - track[i-1].y;
        const dt = track[i].time - track[i-1].time;
        const speed = dt > 0 ? Math.sqrt(dx*dx + dy*dy) / dt : 0;
        totalSpeed += speed;
        speedVariance += speed * speed;
        yVariance += Math.pow(track[i].y - avgY, 2);
    }
    
    const avgSpeed = totalSpeed / (track.length - 1);
    const speedStdDev = Math.sqrt(Math.max(0, speedVariance / (track.length - 1) - avgSpeed * avgSpeed));
    
    return {
        avgSpeed: avgSpeed,
        speedStdDev: speedStdDev,
        yJitter: Math.sqrt(yVariance / track.length),
        totalTime: track[track.length - 1].time - track[0].time,
        totalDistance: track[track.length - 1].x - track[0].x,
        pointCount: track.length
    };
}

// 获取验证码
async function getCaptcha() {
    return new Promise((resolve, reject) => {
        const uuid = crypto.randomUUID();
        const postData = JSON.stringify({});
        
        const options = {
            hostname: 'acs.fcbox.com',
            port: 443,
            path: `/captcha/querySlideImage/${uuid}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://fcbox.com/',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ uuid, ...parsed });
                } catch (e) {
                    reject(e);
                }
            });
        });
        
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// 验证滑块
async function verify(uuid, encrypted) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ data: encrypted });
        
        const options = {
            hostname: 'acs.fcbox.com',
            port: 443,
            path: `/captcha/checkCode/${uuid}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://fcbox.com/',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        });
        
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// 加密数据
function encrypt(clientIp, checkId, uuid, track, key) {
    // 轨迹字符串
    let trackStr = '';
    for (const p of track) {
        trackStr += p.x + '' + p.y + '' + p.time;
    }
    
    // MD5 sign
    const signStr = clientIp + checkId + uuid + trackStr;
    const sign = CryptoJS.MD5(signStr).toString();
    
    // AES加密
    const dataToEnc = { sign, track };
    
    return CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(JSON.stringify(dataToEnc)),
        CryptoJS.enc.Utf8.parse(key),
        { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    ).toString();
}

// 下载图片并检测缺口
async function downloadAndDetectGap(shadeUrl) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(shadeUrl);
        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname,
            method: 'GET'
        };
        
        const req = https.request(options, (res) => {
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => {
                // 保存图片
                fs.writeFileSync('test_bg.png', Buffer.concat(chunks));
                // 返回一个估计的缺口位置
                resolve(120 + Math.floor(Math.random() * 80));  // 120-200
            });
        });
        
        req.on('error', reject);
        req.end();
    });
}

// 测试不同的轨迹
async function test() {
    console.log('=== 丰巢滑块轨迹测试 ===\n');
    
    // 获取验证码
    console.log('[1] 获取验证码...');
    const captcha = await getCaptcha();
    const { uuid, data } = captcha;
    
    if (!data.success) {
        console.log('获取验证码失败');
        return;
    }
    
    const result = data.data;
    console.log('  checkId:', result.checkId.substring(0, 8) + '...');
    console.log('  pointY:', result.pointY);
    console.log('  aesKey:', result.key.substring(0, 8) + '...');
    
    // 下载图片
    console.log('\n[2] 下载背景图...');
    const gapX = await downloadAndDetectGap(result.shadeImageUrl);
    console.log('  估计缺口位置:', gapX + 'px');
    
    // 测试不同的轨迹生成方法
    const methods = [
        { name: '贝塞尔', gen: generateBezierTrack },
        { name: '缓动函数', gen: generateEasingTrack },
        { name: '人类分段', gen: generateHumanTrack }
    ];
    
    for (const { name, gen } of methods) {
        console.log(`\n[3] 测试 ${name} 轨迹...`);
        
        // 生成多组轨迹进行测试
        for (let i = 0; i < 3; i++) {
            // 使用不同的滑动距离
            const testDistances = [80, gapX, gapX + 10, gapX - 10];
            const distance = testDistances[i % testDistances.length];
            
            const track = gen(distance, result.pointY, 1500 + i * 200);
            const features = analyzeTrack(track);
            
            console.log(`  测试 ${i+1}: 距离=${distance}, 点数=${features.pointCount}, 平均速度=${features.avgSpeed.toFixed(4)}`);
            
            // 加密并验证
            const encrypted = encrypt(result.clientIp, result.checkId, uuid, track, result.key);
            const verifyResult = await verify(uuid, encrypted);
            
            if (verifyResult.success) {
                console.log(`  *** 验证成功! Token: ${verifyResult.data.token.substring(0, 20)}...`);
                return;
            } else {
                console.log(`  失败: code=${verifyResult.code}`);
            }
            
            await sleep(500);
        }
    }
    
    console.log('\n所有测试完成');
}

// 运行
test().catch(console.error);

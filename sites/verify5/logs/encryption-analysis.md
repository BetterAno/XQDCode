# Verify5 验证码 - 阶段四：加密参数逆向分析

## 加密体系架构

### 1. 整体加密方案: AES-256-CTR + XOR Key Exchange
```
客户端 ──[XOR key exchange]──> 服务端 (获取 session key)
客户端 <──[AES-256-CTR 加密数据]── 服务端 (返回 captcha 配置)
客户端 ──[AES-256-CTR 加密轨迹]──> 服务端 (提交验证)
```

### 2. 关键加密函数

#### Y(a, b) - XOR 密钥解密 (简单)
```javascript
// 从密文中提取奇数位字符, XOR 与密钥 b
function Y(a, b) {
    var c = [];
    b = b.charCodeAt(b.length-1) % 2;
    for (var e = b; e < a.length; e += 2)
        c.push(a.charAt(e));
    return c.join("");
}
```
- 输入: 服务端返回的加密 session key (a) + 客户端指纹哈希 (b)
- 输出: AES 解密的 key (32 hex chars)

#### ja(a, b) - AES-256-CTR 解密
```javascript
function ja(a, b) {
    // 1. Base64 解码
    var c = Base64.parse(a).toString(Hex);
    // 2. 前32个hex字符 = IV (AES-CTR counter)
    // 3. 后面 = ciphertext
    var iv = Hex.parse(c.slice(0, 32));
    var ct = Hex.parse(c.slice(32));
    // 4. AES-256-CTR 解密
    var key = Utf8.parse(b); // b = 16 hex chars → 16 bytes
    var cfg = {mode: CTR, padding: NoPadding, iv: iv};
    return AES.decrypt(ct.toString(Base64), key, cfg).toString(Utf8);
}
```

#### E(a, b) - AES-256-CTR 加密
```javascript
function E(a, b) {
    // 1. 生成随机 16-char IV
    var iv = randomString(16); // 16 hex chars → 16 bytes
    var key = Utf8.parse(b); // b = 16 bytes key
    var ivWords = Utf8.parse(iv);
    // 2. AES-256-CTR 加密
    var ct = AES.encrypt(a, key, {
        mode: CTR, padding: NoPadding, iv: ivWords
    });
    // 3. 拼接 IV + ciphertext → Base64
    var result = ivWords.concat(ct.ciphertext);
    return Base64.stringify(result);
}
```

### 3. 指纹哈希: MurmurHash3 (128-bit, x64)
```javascript
// "c12_" 库实现
x64hash128(input, seed)
// 标准 MurmurHash3 x64 128-bit 变体
// seed = 31 (固定)
```

### 4. 消息分块协议 (WebSocket)
```
chunked_msg = packet_id + "|" + total_packets + "|" + seq + "|" + data_chunk
data_chunk 最大 1024 bytes (Safari: 186 bytes)
```

### 5. 消息加密/解密完整流程

#### 发送消息
```
1. 构造消息对象 {l: msgId, f: msgType, o: payload}
2. Cb() 序列化为 JSON 字符串
3. 追加 fingerprint hash + token (Ob 类型特殊处理)
4. Y() XOR 解密 AES 密钥 ← 使用 sessionKey
5. E() AES-CTR 加密整个 JSON ← 使用 AES 密钥
6. 分块 (packet_id|total|seq|chunk)
7. 通过 WebSocket 发送
```

#### 接收消息
```
1. WebSocket 接收分块 → 组包
2. ja() AES-CTR 解密 ← 使用 sessionKey
3. Bb() JSON 解析
4. 根据 msgType 分发处理
```

### 6. 关键密钥派生
- **sessionKey** (`wa`): 服务端在 WebSocket 握手时返回, 16 hex chars
- **AES key** (`xa`): 通过 Y(sessionKey, fingerprintHash) XOR 派生
- **fingerprintHash**: compute-once MurmurHash3 对所有指纹数据

### 7. Track 轨迹格式
```
trackString = startTime + "," + moveTime1 + "," + moveOffset1 + ","
            + moveTime2 + "," + moveOffset2 + ","
            + ... + releaseTime + "," + releaseOffsetX + "," + releaseOffsetY
```
- 纯数字用逗号拼接
- moveOffsetX = 滑块当前位置 - 滑块初始位置
- 时间戳为 (new Date).getTime() 毫秒

### 8. 完整滑块验证流程 (SliderVerification y["00"])
```
1. render(): 创建弹窗 HTML DOM
2. setup(): 绑定 mousedown/mousemove/mouseup
3. loadImages(): 
   a. 调用 fingerprint → getV18()
   b. 构造 Vd 消息: {l: captchaHost, z: fingerprintData}
   c. 通过 WebSocket 发送 → 获取 captcha 配置
   d. 返回: {b: bgUrl, s: sliceUrl, r: offsetX}
4. 用户操作:
   a. mousedown: 记录 startTime, 设置 qc=true
   b. mousemove: 推入 time, offsetX, offsetY 到 track[]
   c. mouseup: 推入 releaseTime, releaseX, releaseY
5. submit():
   a. trackString = track[].join(",")
   b. 获取新 fingerprint → getV18()
   c. 构造 Wd 消息: {s: trackString, f: fingerprintHash}
   d. 通过 WebSocket 发送 → 获取验证结果
6. 结果处理:
   - success: 设置 token 到隐藏字段
   - failure: 显示重试提示, 自动刷新
```

# Verify5 验证码 - 阶段二：请求链路分析

## 全链路请求流程

### Step 1: 页面加载
```
GET https://www.verify5.com/demo
→ HTML 页面
```

### Step 2: SDK 加载
```
GET https://s.verify5.com/assets/latest/v5.js
→ V5 SDK v2.6.2 (90KB, Closure Compiler 混淆)
```

### Step 3: 指纹采集 (getV18 / x64hash128)
- canvas 指纹: 画布渲染 + toDataURL
- webgl 指纹: WebGL 参数 + 扩展列表
- 字体检测: 测量 offsetWidth/Height 差异
- 音频指纹: OscillatorNode + DynamicsCompressor
- 标准属性: userAgent, language, colorDepth, screenResolution, timezone, platform, plugins 等
- 结果: MurmurHash3 (128-bit) → 32 字符 hex

### Step 4: WebSocket 连接
```
wss://verify5.com/ws?{token}
协议: verify5-2.6.2
```

### Step 5: 获取验证码配置
发送消息类型: `Ob` (初始化)
服务端返回:
- `l`: captcha 服务器地址
- `f`: 指纹哈希
- `m`: 会话 ID
- `j`: 设备指纹
- `tl`: 超时时间
- `o`: 随机 token
- `exfp`: 扩展指纹
- `aux`: 辅助数据

包含第二个响应 (实际滑块配置):
- `t`: captcha session token (用于后续验证)
- `u`: captcha session ID
- `b`: 背景图 URL
- `s`: 滑块图 URL
- `r`: 滑块初始位置

### Step 6: 图片加载
```
GET https://ss.verify5.com/s/{group}/{hash}.jpg  (背景图, 260x160)
GET https://ss.verify5.com/s/{group}/{hash}.png  (滑块图, 52x60)
```

### Step 7: 滑块验证提交
发送消息类型: `Wd` (验证)
参数:
- `s`: trackString (行为轨迹字符串)
- `f`: 指纹哈希
- `z`: 新指纹数据

服务端响应:
- `success`: 验证结果
- `msg`: 提示消息
- `percent`: 击败百分比

## 关键资源 CDN
- SDK: `s.verify5.com/assets/latest/`
- 验证码图片: `ss.verify5.com/s/{group}/{hash}`
- 静态资源: `www.verify5.com/assets/`

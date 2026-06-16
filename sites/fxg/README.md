# 抖店(fxg.jinritemai.com)邮箱登录逆向分析

## 项目结构
```
sites/fxg/
├── src/
│   ├── captcha.js          # 验证码主逻辑 (rmc-captcha 1.0.0.759)
│   ├── index.wasm          # WASM加密模块
│   ├── bdms.js             # 安全SDK
│   ├── captcha_solver.py   # 验证码求解模块
│   ├── trajectory.py       # 轨迹生成
│   ├── yunma_solver.py     # 云码识别
│   └── login.py            # 登录主流程
└── docs/
    └── API.md              # 接口文档
```

## 已发现的关键API

### 1. 验证码初始化
```
GET https://verify.zijieapi.com/captcha/get
参数:
  - aid=4272
  - repoId=590050
  - subtype=slide
  - mode=slide
  - fp=verify_moznXXXXX_... (浏览器指纹)
  - msToken=xxx (安全token)
  - a_bogus=xxx (安全签名)
  - detail=xxx (加密决策数据)
  
响应:
{
  "code": 200,
  "data": {
    "challenge_code": 99999,
    "id": "session_id",
    "mode": "slide",
    "question": {
      "url1": "背景图URL (552x344 JPEG)",
      "url2": "滑块图URL (110x110 PNG)",
      "tip_y": 68,
      "backup_url1": [...],
      "backup_url2": [...]
    }
  }
}
```

### 2. 验证码提交
```
POST https://verify.zijieapi.com/captcha/verify
Content-Type: text/plain;charset=UTF-8
参数: (同get接口)
请求体:
{
  "captchaBody": "AES_GCM加密的WASM输出(base64)"
}

响应:
{
  "code": 200,
  "data": {
    "verify_ticket": "VTIDEF..."
  }
}
```

### 3. SSO登录
```
POST https://doudian-sso.jinritemai.com/passport/sso/account_login/v2/
参数:
  - fp=verify_moznXXXXX_...
  - aid=4272
  - account_sdk_source=web
  - msToken=xxx
  - a_bogus=xxx
  
请求体:
{
  "email": "邮箱",
  "password": "密码",
  "verify_ticket": "验证码ticket"
}
```

## 验证码加密机制

### WASM加密流程
1. 初始化: `wasm.tagZInit(detail)` - 使用detail参数初始化WASM
2. 轨迹采集: 浏览器收集滑动轨迹数据
3. AES_GCM加密: WASM内部使用AES_GCM加密轨迹+环境数据
4. 输出: captchaBody (base64编码的加密数据)

### 关键发现
- 加密算法: AES_GCM
- 加密入口: captcha.js中的`encrypt`和`AES_GCM_encrypt`函数
- WASM导出函数: `tagZInit`等
- 需要补环境: bdms.js提供安全环境检测

## 下一步
1. 实现云码双图识别缺口
2. 生成符合规律的轨迹
3. Node.js补环境实现WASM加密
4. Python协议请求集成

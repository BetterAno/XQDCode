# 实施方案

## 目标
还原 JD h5st v5.3 签名，实现 Python 协议侧请求 `api.m.jd.com/api`

## 当前确认

### 加密方式
- body = SHA-256(JSON.stringify(params))（无 key 排序）
- h5st = ParamsSign.sign({functionId, appid, body}) → VM 内完成签名
- 涉及算法: SHA-256, HMAC-SHA256, MD5, HMAC-MD5 (CryptoJS)

### 关键参数
- functionId: 接口功能 ID
- appid: 应用 ID (unionpc)
- body: SHA-256 哈希值
- fingerprint: 设备指纹（会话固定）
- token (tk): 从 localStorage `WQ_dy1_tk_algo` 获取, 来源于 `sso.jd.com/sso/rac`

### 其他依赖
- x-api-eid-token: 从 `window.getJsToken()` 获取
- uuid: 从 `__jda` cookie 提取

## 实现方案选择

**方案: Node.js 补环境**

1. 提取 `js_security_v3_0.1.5.js` SDK
2. 在 Node.js 中 polyfill: window, document, navigator, crypto.subtle, localStorage
3. 注入有效的 token 和 fingerprint
4. 调用 `ParamsSign.sign()` 生成 h5st
5. Python 主流程调用 Node.js 脚本

## 验证计划
1. 浏览器实测 h5st vs 本地生成 h5st 逐段对比
2. 遍历所有 unionSearchRecommend 参数做端到端验证
3. 服务端响应 code:200 确认有效

## 待用户确认
- [x] 接受 Node.js 补环境方案
- [x] 进入 Phase 4 实现

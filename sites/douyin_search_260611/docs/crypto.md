# 抖音搜索加密逻辑

## 拦截器调用链

从底层到顶层：

```
App XHR.send
  → uc-secure-dtrait-core (secure data trait SDK)
    → async/9499.d7714ebc.js (douyin XHR wrapper)
      → bdms_1.0.1.19_fix.js / n 函数 (line 130952) ← 核心
        → bdms / X 函数 (line 131083, VM 入口)
          → bdms / d 函数 (line 131912, VM 执行器)
        → captcha/index.js (rc-verifycenter)
          → secsdk-lastest.umd.js (security SDK)
            → sdk-glue.js
              → native XHR.send
```

## a_bogus

- **来源**: bdms_1.0.1.19_fix.js
- **核心算法**: SM3 哈希 + RC4 加密 + 自定义 Base64
- **VM 架构**: JSVMP 栈式虚拟机 (76 条指令)
- **输入**: URL 参数串 + User-Agent + 时间戳
- **实现**: 已有 Python 纯算实现，参考 `sites/douyin_abogus/`

## msToken

- **来源**: bdms_1.0.1.19_fix.js
- **位置**: VM 字节码执行器中动态生成
- **格式**: Base64 编码字符串，末尾 `%3D%3D` (URL-encoded `==`)
- **待分析**: 具体生成逻辑需解析 bdms VM 字节码

## verifyFp / fp

- **值**: `verify_` + 随机字符串
- **来源**: Cookie `s_v_web_id`
- **性质**: 浏览器端验证指纹，非加密参数

## uifid

- **格式**: 长十六进制哈希字符串
- **来源**: Cookie `UIFID`
- **性质**: 用户/设备指纹标识

## search_id

- **格式**: `YYYYMMDDHHMMSS` + 16位随机hex
- **示例**: `2026061114171740CFC3F911CE1EE086F7`
- **性质**: 搜索会话标识，时间戳+随机串

## 浏览器环境参数

以下参数需与浏览器保持一致：
- `screen_width` / `screen_height`
- `browser_version` / `engine_version`
- `cpu_core_num` / `device_memory`
- `downlink` / `effective_type` / `round_trip_time`

## Cookie 关键项

| Cookie | 说明 |
|--------|------|
| ttwid | 设备标识 |
| passport_csrf_token | CSRF token |
| s_v_web_id | 验证指纹 |
| odin_tt | 账户设备绑定 |
| UIFID | 用户指纹 |
| __ac_nonce | 风控 nonce |
| __ac_signature | 风控签名 |

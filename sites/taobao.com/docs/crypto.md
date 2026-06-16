# 加密与签名分析

## 1. 签名参数 `sign` ✅ 已确认

**MTOP 签名公式（已通过真实样本验证）：**

```
sign = MD5(token + "&" + t + "&" + appKey + "&" + data)
```

| 参数 | 来源 | 示例 |
|------|------|------|
| `token` | Cookie `_m_h5_tk` 中 `_` 前的 32 位 hex | `003e74581b53d57fa47c5dc68c7f6eeb` |
| `t` | 13 位毫秒时间戳 | `1781055604176` |
| `appKey` | 固定值 | `12574478` |
| `data` | 请求 body 中 `data` 参数的 JSON 值（已 URL-decode） | `{"appId":"46853","params":"..."}` |

**验证记录**：
- 样本 reqid=16，recommend API
- 预期 sign: `090199d62d5ec9ed689437e877c912e4`
- 实际计算结果: `090199d62d5ec9ed689437e877c912e4` ✅ 完全匹配
- 验证脚本: `check_sign.py`

## 2. AWSC 安全参数 ✅ 已分析

三个安全参数在 `et_f.js` (v1.84.2) + `awsc.js` 组装：

### 初始化生命周期

| 阶段 | bx-ua | bx-umidtoken | bx_et |
|------|-------|-------------|-------|
| AWSC未加载 | `default_not_fun` | `default_not_fun` | 已生成 |
| FY模块加载中 | `defaultFY3_fyjs_not_initialized@url@ts` | 同 bx-ua | 已生成 |
| 完全初始化 | `234!<long-encoded>` | `T2gA...` (会话固定) | `<long-encoded>` (每次变化) |

### 2.1 `bx-ua` (UA/Browser Fingerprint)
- 格式：`234!<自定义编码数据>`
- `234!` = 版本标识（与脚本 `pv=234` 对应）
- 每次请求动态变化
- 生成器：`getStore("postFYModule").getFYToken()` → `et_f.js`

### 2.2 `bx-umidtoken` (Device Token)  
- 格式：`T2g<base64>`
- 示例：`T2gAPWh3nK-_rf-Az1Q5dVUa5DELFuhqvrmqOrohQyZKGl0VCutc2MOktWIkDcsModU%3D`
- **整个浏览器会话完全固定**
- 生成器：`getStore("getFYModule").getUidToken()` → `et_f.js`

### 2.3 `bx_et` (Encrypted Token)
- 格式：`<base64-segments-with-.>` 
- **每次请求完全不同**
- 生成器：`getStore("etModule").getETToken(url, request)` → `et_f.js`
- 依赖：请求URL + 请求体 + bx-ua + bx-umidtoken

### 2.4 不携带 AWSC 的请求类型
- JSONP/script 标签请求（`checkCollect`, `singleview`, `queryBagCount` 等）
- 这些通过 script 标签加载，AWSC 只拦截 XHR/Fetch

## 3. AWSC 架构总结

```
awsc.js (调度器)
├── addNCParamToRequest()  ← 请求前注入参数
│   ├── getUA$1(type, url) → getStore("postFYModule").getFYToken()
│   ├── getUmidToken()     → getStore("getFYModule").getUidToken()
│   ├── getET(url, req)    → getStore("etModule").getETToken(url, req)
│   └── getPip()           → getStore("getFYModule").fyObj.getUBHeader()
│
└── 拦截 XHR open/send ← preRequest 事件

et_f.js (2MB, 实际实现)
├── BaxiaCookieManager (_baxia_sec_cookie_)
├── FY Module → getFYToken, getUidToken, getUBHeader
├── ET Module → getETToken
└── 内部 VM-style 控制流平坦化 + 混淆
```

## 4. Python 侧影响

- `bx-umidtoken`：会话固定，可跨请求复用
- `bx-ua` / `bx_et`：每次请求动态生成，需 AWSC SDK 计算
- 缺失 AWSC 参数 → `RGV587_ERROR::SM` 风控重定向登录
- 连 script 类型请求可用但其他 API 受风控影响

# 加密逻辑分析

## h5st 结构 (v5.3)

h5st 由 10 段组成，用 `;` 分隔：

| 段 | 样本值 | 说明 | 变化性 |
|----|--------|------|--------|
| 1 | `20260526143112240` | 格式化时间戳 yyyyMMddHHmmssSSS | 每次 |
| 2 | `j222zpi22be1jaz1` | 设备指纹 | 会话固定 |
| 3 | `586ae` | appId | 固定 |
| 4 | `tk03w96251ba6...` | token | 会话固定 |
| 5 | `26dc710bcf69...` | 32位hex (MD5 hash) | 每次 |
| 6 | `5.3` | 版本号 | 固定 |
| 7 | `1779777067240` | unix 时间戳 ms | 每次 |
| 8 | `pjbMhjZfxmF...` | 签名体 (长串) | 每次 |
| 9 | `fe12fc9d737b...` | 32位hex (MD5 hash) | 每次 |
| 10 | `of7rHGHQ8GlO...` | 常量 | 固定 |

## 签名入口

### 业务层
```javascript
// app-bundle.js
var x = new window.ParamsSign({ appId: "586ae" });
var w = {
  functionId: n,
  appid: u,
  body: CryptoJS.SHA256(JSON.stringify(params)).toString()
};
var result = x.sign(w);        // returns Promise
var h5st = encodeURI(result.h5st);
```

### SDK 层
```
js_security_v3_0.1.5.js → ParamsSign 构造函数
  sign() → signSync() → _$sdnmd() {VM bytecode interpreter}
```

### 关键模块链
- `Y()` = CryptoJS.SHA256 (webpack module 52153)
- `_()` = JSON.stringify (webpack module 59340 → 8933 → 84426)

## sign 输入/输出

**输入:**
```json
{
  "functionId": "unionSearchRecommend",
  "appid": "unionpc",
  "body": "<SHA-256 of JSON.stringify(params)>"
}
```

**输出:**
```json
{
  "functionId": "unionSearchRecommend",
  "appid": "unionpc",
  "body": "<same as input>",
  "_stk": "appid,body,functionId",
  "_ste": 1,
  "h5st": "<full signature string>"
}
```

- `_stk`: 签名字段名，按字母排序 (appid, body, functionId)
- `_ste`: 1 (签名成功标记)

## ParamsSign 实例属性

| 属性 | 值 | 来源 |
|------|-----|------|
| `_appId` | `"586ae"` | 构造函数参数 |
| `_version` | `"5.3"` | SDK 内置 |
| `_fingerprint` | `"j222zpi22be1jaz1"` | `_$qS.get(version, appId)` → localStorage |
| `_token` | `"tk03w96251ba618n..."` | `_$qd.get(fp, appId)` → localStorage `WQ_dy1_tk_algo` |
| `_algos` | `{MD5, SHA256, HmacSHA256, HmacMD5}` | SDK 内置 CryptoJS |

## Token 存储

- localStorage key: `WQ_dy1_tk_algo` 和 `__we_m_ftk__`
- 格式: `{ "<fingerprint>": { "<appId>": { "v": "<encoded_token+algo>", "e": <expiry>, "t": <timestamp> } } }`
- Token 编码后存储，VM 内解码

## Token 远程获取

- POST `sso.jd.com/sso/rac`
- 请求: `{ version, fp, appId, timestamp, ... }` (编码后)
- 响应: `{"nfd":10}`

## 待解决

1. VM `_$sdnmd` 内部完整的签名构建流程（段5、8、9的具体生成算法）
2. Token 的编解码算法（base64+自定义异或？）
3. HmacSHA256 使用的具体 key（需从 token 解码后提取）

## 端到端验证结果 (2026-05-26)

- Node.js sign.js 生成的 h5st 通过 api.m.jd.com 服务端验证
- 状态: code=200, message=success
- 使用与浏览器完全相同的 fingerprint + token + appId
- 段 1-4, 6-7, 10 与浏览器一致，段 5, 8, 9 每次不同（时间相关）
- 服务端接受 Node.js 生成的签名，返回真实商品数据

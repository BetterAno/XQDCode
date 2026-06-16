# 大众点评 H5 API 接口文档

## mtgsig 签名接口

### 签名传参方式

mtgsig 通过 HTTP Request Header `mtgsig` 传递，值为 JSON 字符串。

### mtgsig 字段说明

| 字段 | 类型 | 示例值 | 生成方式 |
|------|------|--------|----------|
| a1 | string | `"1.2"` | 固定版本号 |
| a2 | number | `1779690637209` | `Date.now()` |
| a3 | string | `"805zzu6yz53v53v119w881v2w406vz6780v4wzv844497958y715u41y"` | dfpId，浏览器 localStorage 获取或固定 |
| a5 | string (Base64) | `"hOcPGqk..."` | AES-128-CBC 加密环境参数，key/IV 来自 b[0] 指纹 |
| a6 | string | `"h1.9bhPOmJeLQH..."` | `"h1." + Base64(AES(env_json))` |
| a8 | string (32 hex) | `"fc49446060561fdbc9e3c425a7dd64b0"` | a5_16 XOR a6_16 XOR A8_FIXED |
| a9 | string | `"4.2.0,7,233"` | `"4.2.0,7," + random(0-255)` |
| a10 | string (2 hex) | `"f3"` | 随机 2 位 hex |
| x0 | number | `4` | 固定值 |
| d1 | string (32 hex) | `"a4834910f53562421526d06951b62b46"` | `MD5(concat) XOR temp[]` → hex |

### 签名生成流程

```
1. dfpId (a3) - 从浏览器 localStorage 获取或本地生成
2. 收集环境参数 → JSON 序列化
3. AES-128-CBC 加密 → Base64 → a6 (加 h1. 前缀)
4. a6 截取前 10 字符 + a2 时间戳 → a5
5. a5_16 XOR a6_16 XOR A8_FIXED → a8
6. "4" + a1 + a2 + a3 + a5 + a6 + a8 + a9 + a10 → MD5 → XOR → d1
7. JSON 序列化所有字段 → 设置 mtgsig Header
```

### Browser 外部依赖 (b[])

| 索引 | 说明 | 类型 |
|------|------|------|
| b[0] | 设备指纹字节 | Uint8Array |
| b[1] | 会话 token (a6 可复用) | string |
| b[2] | 时间戳 | number |
| b[3] | k9: 字符串→charCode 数组 | function |
| b[4] | MD5 哈希 | function |
| b[5] | k7: 字符串→字节数组 | function |
| b[6] | 配置/度量对象 | object |
| b[7] | 空数组 | array |
| b[8] | VM 环境对象 | object |
| b[9] | 数据收集状态 | object |
| b[10] | 版本数组 | array |
| b[11-13] | 回调函数 | function |
| b[14] | 请求行 charCode 数组 | array |
| b[15] | k6: 数字→4字节数组 | function |
| b[16] | 标志位 | boolean |
| b[17] | k5: 字节数组→hex | function |
| b[18] | f9: getId | function |
| b[19] | 版本 "1.2" | string |
| b[20] | URL 解析工具 | object |
| b[21] | 随机值 | string |
| b[22-23] | 回调函数 | function |
| b[24] | 计数器 | number |
| b[25] | k1: 数字→4字节数组 | function |
| b[26] | 空字符串 | string |
| b[27] | ao: 日志函数 | function |

## 目标接口示例

```
GET /wxmapi/shop/shopquestion?csecplatform=4&csecversion=4.2.0&device_system=&shopId=G7lZQSVUguP43EIT&yodaReady=h5 HTTP/1.1
Host: m.dianping.com
mtgsig: {"a1":"1.2","a2":1779690637209,"a3":"...","a5":"...","a6":"...","a8":"...","a9":"...","a10":"f3","x0":4,"d1":"..."}
```

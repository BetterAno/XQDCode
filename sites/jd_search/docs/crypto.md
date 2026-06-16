# JD h5st v5.3 加密算法分析

## 概述

京东搜索接口使用 h5st v5.3 签名机制保护 API 请求。签名由 `js_security_v3_0.1.6.js` (234KB) 生成，该 SDK 内含：

- 自定义 CryptoJS 实现（**魔改的 MD5/SHA256**，与标准算法输出不同）
- JSVMP 字节码虚拟机（~70个操作码）
- 字符串混淆表（XOR 编码，密钥 33）

## h5st 格式

10段分号分隔：

```
datetime;fp;appId;token;signHash;version;timestamp;expandParams;bodyHash;eidHash
```

| 段 | 名称 | 长度 | 说明 |
|---|------|------|------|
| 0 | datetime | 17 | `YYYYMMDDHHmmssSSS` 格式 |
| 1 | fp | 16 | 随机指纹字符串 |
| 2 | appId | 5 | `f06cc` (固定) |
| 3 | token | 92 | `tk06w` 前缀的动态 token |
| 4 | signHash | 32 | 签名哈希 (自定义 MD5) |
| 5 | version | 3 | `5.3` (固定) |
| 6 | timestamp | 13 | 毫秒级时间戳 |
| 7 | expandParams | ~460 | 编码的浏览器指纹数据 |
| 8 | bodyHash | 32 | Body 哈希 (自定义 MD5) |
| 9 | eidHash | 60 | 设备指纹哈希 (固定前缀 `qbkg`) |

## 签名流程

```
signSync(params)
  → _$sdnmd(params)          // 主 VM 方法 (j=4977)
    → _$cps(params)           // 参数排序为 key-value 数组
    → _$pam(token, fp)        // 校验 token/fingerprint
    → _$clt()                 // 生成 fp + expandParams
    → _$gdk(token, fp, ts, appId)  // 密钥派生
    → _$gs(derivedKey, sortedParams)   // signHash
    → _$gsd(derivedKey, sortedParams)  // bodyHash
    → _$gsp(...)              // 组装 h5st 字符串
    → _$ms(sortedParams, expandParams) // 构建结果对象
```

## 关键函数

### _$gdk (密钥派生)

输入: `(token, fp, timestamp, appId)` → 输出: 192字符 hex 密钥

算法链（以 `tk06w` token 为例）：

1. `h1 = SDK_HmacSHA256(fullInput, token)` — 64 chars
2. `h2 = SDK_SHA256(h1)` — 64 chars
3. `h3 = SDK_SHA256(h2)` — 64 chars (可变步数)
4. `final = SDK_HmacSHA256(h_last, token)` — 64 chars

其中 `fullInput = token + fp + timestamp + appId + suffix`

**注意**: SDK 的 SHA256 和 MD5 是**自定义实现**，不是标准算法。

### _$gs (签名哈希)

输入: `(derivedKey, sortedParams)` → 输出: 32字符 hex (自定义 MD5)

VM 字节码实现 (j=4399)，内部使用自定义哈希函数处理 `derivedKey + signString`。

### _$gsd (Body 哈希)

输入: `(derivedKey, sortedParams)` → 输出: 32字符 hex (自定义 MD5)

VM 字节码实现 (j=4492)，与 _$gs 类似但算法不同。

### _$clt (指纹生成)

无输入 → 输出: 460字符编码指纹字符串

生成浏览器环境指纹，编码为自定义格式。

## 自定义哈希验证

SDK 中的哈希与标准算法**完全不同**：

```
SDK MD5("hello")      = cce84add7823306451005717bb005353
标准 MD5("hello")      = 5d41402abc4b2a76b9719d911017c592

SDK SHA256("hello")    = 53a355540bd88d05f9b3b2ad5e1540c3627c3ea38ca02363efd34a8e794e8175
标准 SHA256("hello")   = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
```

SDK 不使用标准 SHA256 常量 (0x428a2f98 等)，使用自定义常量表。

## 纯算方案

由于自定义哈希无法用标准库替代，采用**精简 SDK 提取**方案：

1. 保留 `js_security_v3_0.1.6.js` 原始 SDK
2. 最小化 Node.js 环境补丁（仅 `window`/`document`/`navigator`）
3. 通过 `new Function(sdkCode + '\nreturn ParamsSign;')` 加载

签名器: `src/signer.js` (约 120 行)

## SDK 关键信息

- 文件: `assets/js/js_security_v3_0.1.6.js` (234KB)
- 字符串表: 343 项，XOR 解码函数 `_4dkub()`，密钥 33
- 字节码数组: `_2v8ub`，5052 项
- VM 方法入口点:
  - `_$sdnmd` (sign): j=4977, label l37
  - `_$gsd`: j=4492, label l33
  - `_$gs`: j=4472, label l30
  - `_$gdk`: j=3922, label l26
  - 内部 hash: j=2093, label l18
  - `_$clt`: 内嵌在 _$sdnmd 中
- 原型变量: `_$Rp`
- 函数调用: `_3q5ub` = `Function.prototype.call`

## 反自动化检测

SDK 检测以下环境指纹:

- `window.Cypress` / `window.__Cypress__` — Cypress 测试
- `window._phantom` / `window.callPhantom` — PhantomJS
- `window.__playwright__binding__` — Playwright
- `window.%testCafeDriver%` — TestCafe
- `window.__JDWEBSIGNHELPER_$DATA__` — JD 调试工具
- `navigator.webdriver` — Selenium/WebDriver

## Token 格式

`tk06w` 前缀 token (92字符):

```
tk06w + 8位hex + 4lf + 40字符Base64变体 + rrbrNx + 40字符Base64变体
```

Token 由 SDK 内部生成，每次 signSync 调用时动态创建。

## TLS 指纹

京东 API 检测 TLS 指纹。必须使用 `curl_cffi` + `impersonate='chrome136'`，普通 `requests` 会被 403 拦截。

## Cookie 依赖

必须的 Cookie:
- `3AB9D23F7A4B3C9B` — eid
- `3AB9D23F7A4B3CSS` — eid token (x-api-eid-token 参数)
- `mba_muid` — uuid 参数
- `pin` — 登录态
- `__jda` / `shshshfpa` — 分析跟踪

Cookie 过期后 API 返回 code 605（验证）。

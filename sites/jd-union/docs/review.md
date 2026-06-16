# JD Union h5st v5.3 逆向分析回顾

> 日期: 2026-05-26 | 目标: `api.m.jd.com/api` 签名 | 结果: Python 协议请求通过

---

## 1. 目标与成果

**目标**: 还原京东联盟 (union.jd.com) 选品广场的 h5st v5.3 签名，实现纯协议侧请求。

**成果**:
- Node.js 补环境运行 `js_security_v3_0.1.5.js` SDK 生成 h5st
- Python `get_data.py` 通过 subprocess 调用 Node.js，requests 直连 API
- 端到端验证通过 (code=200, 返回完整商品数据)

**核心结论**: JD h5st 的 SDK 是 VM 字节码混淆的巨型文件，**补环境比反编译 VM 高效得多**。

---

## 2. 逆向路线回顾

### Phase 0: 情报收集
- 搜索关键词 `js_security_v3` 确认是 JD 自研反爬 SDK
- 已知特征: localStorage 存储 token，sso.jd.com 刷新票据
- 判断: 属 JSVMP 类型，优先补环境路线

### Phase 1: 流量分析
- 抓浏览器请求 → 发现 `api.m.jd.com/api?h5st=...&body=...`
- h5st 为 10 段分号分隔字符串，body 为 URL-encoded JSON
- 必需请求头: `x-referer-page`, `x-rp-client`, Referer, Origin

### Phase 2: 加密定位
- 搜索 `h5st` → 定位到 `app-bundle.js` 中调用 `ParamsSign.sign()`
- 搜索 `ParamsSign` → 定位到 `js_security_v3_0.1.5.js`
- SDK 内部是 VM 字节码解释器 (`_$sdnmd`)，选择补环境而非反编译

### Phase 3: 方案确认 → Phase 4: 实现
- 方案: Node.js polyfill window/document/navigator/crypto/localStorage
- 注入有效 token/fingerprint → 调用 SDK → subprocess 桥接到 Python

---

## 3. h5st v5.3 签名结构

```
20260526164924992;j222zpi22be1jaz1;586ae;tk03w96...;ad9e41e6...;5.3;1779785359992;of7ruCLj...;2b2e8a47...;of7rHGHQ...
```

| 段 | 样本值 | 含义 | 变化频率 | 来源 |
|----|--------|------|----------|------|
| 1 | `20260526164924992` | 时间戳 yyyyMMddHHmmssSSS | 每次 | 当前时间 |
| 2 | `j222zpi22be1jaz1` | 设备指纹 | 会话固定 | localStorage `WQ_dy1_vk` |
| 3 | `586ae` | appId | 固定 | 构造函数参数 |
| 4 | `tk03w96251ba6...` | 加密 token | 会话固定 | localStorage `WQ_dy1_tk_algo` |
| 5 | `ad9e41e6c02198f3...` | MD5 hash | 每次 | SDK 内部计算 |
| 6 | `5.3` | 版本号 | 固定 | SDK 内置 |
| 7 | `1779785359992` | unix 毫秒时间戳 | 每次 | 当前时间 |
| 8 | `of7ruCLj6DUTBmY...` | 签名体 (~200+ 字符) | 每次 | SDK 内部计算 |
| 9 | `2b2e8a47175c40a3...` | MD5 hash | 每次 | SDK 内部计算 |
| 10 | `of7rHGHQ8GlOIyV...` | 固定后缀 | 固定 | SDK 内置常量 |

**sign 输入**:
```json
{
  "functionId": "unionSearchRecommend",
  "appid": "unionpc",
  "body": "<SHA-256(JSON.stringify(params))>"
}
```

**sign 输出**:
```json
{
  "functionId": "...",
  "appid": "...",
  "body": "<same as input>",
  "_stk": "appid,body,functionId",
  "_ste": 1,
  "h5st": "<完整签名>"
}
```

- `_stk`: 签名字段名按字母排序
- `_ste`: 1=签名成功, 0=token 过期需刷新

---

## 4. 补环境架构

```
get_data.py (Python)
  │ subprocess
  ▼
main.js (Node.js 入口)
  ├── require("./browser_envs")   ← 补环境
  ├── require("./js_security_v3") ← JD SDK
  └── export sign(functionId, appid, params)
```

### browser_envs.js 补丁清单

| 模块 | 关键 polyfill | 为什么需要 |
|------|--------------|-----------|
| **localStorage** | getItem/setItem/removeItem | SDK 读取/写入 `WQ_dy1_vk` 和 `WQ_dy1_tk_algo` |
| **window.crypto** | getRandomValues, subtle.digest | SDK 调用 SHA-256 等哈希 |
| **navigator** | userAgent, webdriver, platform, hardwareConcurrency | 设备指纹采集 |
| **document** | createElement, querySelector, head, body | SDK 操作 DOM 节点 |
| **screen** | width, height, colorDepth | 屏幕指纹 |
| **XMLHttpRequest** | open, send (空实现) | SDK 内部创建 XHR 对象 |
| **Element/HTMLElement** | setAttribute, appendChild, removeChild | DOM 操作链 |

### 关键 localStorage 数据

```javascript
WQ_dy1_vk: '{"5.3":{"<appId>":{"e":<expiry>,"v":"<fingerprint>","t":<ts>}}}'
WQ_dy1_tk_algo: '{"<fingerprint>":{"<appId>":{"v":"<encoded_token>","e":<expiry>,"t":<ts>}}}'
```

- `e`: 过期秒数 (fingerprint: 31536000=1年, token: 86400=24小时)
- `v`: token 值是编码后的字符串，SDK 内部 VM 解码
- 这两个值直接从浏览器 localStorage 复制，无需理解编码方式

---

## 5. Cookie 与会话链

### 核心 Cookie

| Cookie | 格式 | 用途 |
|--------|------|------|
| `__jda` | `siteId.uuid.ts1.ts2.ts3.visits` | 访客追踪，uuid 取第2段 |
| `__jdb` | `siteId.id.uuid\|visits.ts` | 会话追踪 |
| `__jdc` | `siteId` | 站点 ID |
| `__jdu` | `uuid` | 设备唯一标识 → 用作 URL 的 uuid 参数 |
| `3AB9D23F7A4B3C9B` | hex string | 设备指纹 v1 |
| `3AB9D23F7A4B3CSS` | `jdd03` + fp + suffix | 设备指纹 v2 (JD Device Detector) |
| `sdtoken` | base64-like string | 会话令牌 |
| `shshshfpa/b/px` | uuid format | 设备指纹补充 |

### x-api-eid-token 的坑

**关键发现**: `x-api-eid-token` 参数 **不等于** `3AB9D23F7A4B3CSS` cookie 值。

- Cookie `3AB9D23F7A4B3CSS`: `jdd03WRQG...AAAAM6MNHLYCYAAAAADEU5PVRIG7O3VYX`
- URL 中的 `x-api-eid-token`: `jdd03WRQG...AAAAM6MMZ745YAAAAACKGGDZ6UEONU2MX`

两者前缀相同 (`jdd03` + device_id)，但后缀不同。Token 由 `gias.jd.com/js/pc-tk.js` 动态生成，包含旋转的后缀。

**教训**: 不要假设 URL 参数值等于 cookie 值。从浏览器实际网络请求中提取。

---

## 6. API 请求参数结构

### 请求格式

```
GET https://api.m.jd.com/api?functionId={fn}&appid={app}&_={ts}&loginType=3
    &uuid={uuid}&x-api-eid-token={eid}&h5st={sign}&body={urlEncodedJson}
```

### body 参数结构 (嵌套格式)

```json
{
  "funName": "getSkuByMaterialId",
  "page": {"pageNo": 1, "pageSize": 60},
  "param": {
    "materialId": 315,
    "secKillTimePeriod": 16,
    "seckillTimeType": 0,
    "requestScene": 0,
    "requestExtFields": ["shopInfo", "orientations"]
  },
  "clientPageId": "jingfen_pc"
}
```

**注意**: API 使用嵌套的 `page`/`param` 结构，不是扁平的 `{funName, pageNo, pageSize, materialId}` 格式。早期可能支持扁平格式但现已废弃。

### 必需请求头

```
x-referer-page: https://union.jd.com/proManager/index
x-rp-client: h5_1.0.0
Referer: https://union.jd.com/
Origin: https://union.jd.com
Cookie: <完整 cookie 串>
```

### body 一致性要求

body 参数的值必须与签名时的 params 完全一致:
1. `body_json = json.dumps(params, separators=(",", ":"))` (无空格紧凑格式)
2. Node.js 签名: `SHA256(JSON.stringify(params))` → 作为 sign 的 body 输入
3. URL 的 body 参数 = 步骤1 的 body_json
4. Node.js 签名的 body 哈希 = SHA256(步骤1 的 body_json)

如果两边 JSON 序列化结果不一致（空格、key顺序、Unicode 转义），签名会失败。

---

## 7. Token 生命周期

```
浏览器首次访问 → sso.jd.com/sso/rac 下发 token → 存储到 localStorage
                                               │
                                          token 有效期 86400s
                                               │
                                          _ste 变为 0 时需刷新
                                               │
                                          Python 请求时 token 过期
                                               │
                                          需从浏览器重新提取 token
```

当前未实现 Python 侧自动刷新 token，需手动从浏览器 localStorage 同步：
- 打开 union.jd.com → F12 → Application → Local Storage
- 复制 `WQ_dy1_vk` 和 `WQ_dy1_tk_algo` 的值
- 更新 `browser_envs.js` 中的 `storageData`

---

## 8. 常见失败模式与排查

| 现象 | 可能原因 | 排查方法 |
|------|---------|----------|
| code=400 | body 格式错误 | 检查 params 是嵌套格式 (page/param)，检查 JSON 序列化一致性 |
| code=400 | body hash 不匹配 | 对比 Python `hashlib.sha256(body_json)` 与 sign 返回的 body |
| code=400 | x-api-eid-token 错误 | 需从浏览器实际请求中复制，不能用 cookie 值代替 |
| code=403 | cookie 过期 | 从浏览器重新获取完整 cookie |
| code=605 | uuid/eid 为空 | 检查 `.jd_cookie` 或环境变量是否配置 |
| _ste=0 | token 过期 | 需刷新 token (sso.jd.com/sso/rac) 或用浏览器新 session |
| h5st 签名失败 | localStorage 数据缺失 | 检查 browser_envs.js 中 WQ_dy1_vk 和 WQ_dy1_tk_algo 存在 |

---

## 9. 京东系复用的通用模式

### 大概率一致的
- **h5st 格式**: 10 段分号分隔，段6=版本号
- **SDK 文件名**: `js_security_v3_<version>.js` 从 `storage.360buyimg.com/webcontainer/` 加载
- **sign 输入结构**: `{functionId, appid, body: SHA256(params)}`
- **_stk 规则**: sign 参数字段按字母排序
- **localStorage key**: `WQ_dy1_vk` (指纹), `WQ_dy1_tk_algo` (token)
- **Token 来源**: `sso.jd.com/sso/rac`
- **Cookie 体系**: `__jda/__jdb/__jdc/__jdu` + `3AB9D23F7A4B3CSS`
- **补环境架构**: 同一份 `browser_envs.js` 基本可直接复用

### 大概率不同的
- **appId**: 每个业务不同 (联盟PC=`586ae`, 联盟H5=`73806`)
- **functionId**: 每个接口不同
- **api 域名**: 不同业务使用不同子域名 (api.m.jd.com, api.jd.com, etc.)
- **业务参数结构**: 不同 functionId 的 params 结构不同
- **clientPageId**: 不同页面有不同标识
- **必需请求头**: x-referer-page, x-rp-client 的值因业务而异
- **SDK 版本**: 可能升级到更高版本，VM 内部可能有变化

---

## 10. 版本升级应对策略

### 如果 token 格式变化
1. 从浏览器提取新的 `WQ_dy1_vk` 和 `WQ_dy1_tk_algo`
2. 更新 `browser_envs.js` → `storageData`
3. 如果 key 名变化，搜索 localStorage 新 key

### 如果 SDK 版本升级 (js_security_v3_0.1.X → 0.2.X)
1. 从浏览器下载新版 SDK: `save_script_source(url="js_security_v3_0.2...")`
2. 替换 `src/js_security_v3.js`
3. 检查 `ParamsSign` 构造函数接口是否变化: 断点看 sign 调用
4. 检查 `_stk` 规则是否变化

### 如果 h5st 版本升级 (5.3 → 5.4)
1. 检查段数是否变化
2. 检查 sign 输入是否增加新字段
3. 在控制台 Hook `ParamsSign.prototype.sign` 看输入输出变化
4. 段2 (指纹) 和段4 (token) 可能升级算法

### 如果补环境不通过
1. 对比浏览器 `navigator` 属性与新 Session 的指纹
2. SDK 可能在初始化时检测环境完整性 (如 `navigator.webdriver`)
3. 补充缺失的 window 属性 (safari、ActiveXObject 等检测项)
4. 确认 crypto.subtle 的算法列表与 Chrome 146 一致

---

## 11. 快速验证清单

在浏览器控制台验证 SDK 可用性:
```javascript
// 注入参数
var p = new ParamsSign({appId:"586ae"});
var params = {functionId:"unionSearchRecommend", appid:"unionpc", body:CryptoJS.SHA256(JSON.stringify({...})).toString()};
p.sign(params).then(r => console.log(r));
```

在 Node.js 验证补环境:
```bash
node -e "require('./browser_envs'); require('./js_security_v3'); console.log(typeof window.ParamsSign);"
# 应输出: function
```

Python 端到端验证:
```bash
python get_data.py
# 应输出: code=200, 带商品列表
```

---

## 12. 文件索引

| 文件 | 用途 | 修改频率 |
|------|------|---------|
| `src/browser_envs.js` | 浏览器环境 polyfill + localStorage 种子数据 | token 过期时更新 |
| `src/main.js` | Node.js 签名入口 | 基本不改 |
| `src/js_security_v3.js` | JD SDK (从浏览器下载) | SDK 版本升级时替换 |
| `src/get_data.py` | Python 请求主流程 | 切换接口时改 BODY |
| `docs/api.md` | 接口列表与参数 | 加新接口时更新 |
| `docs/crypto.md` | 加密逻辑详解 | SDK 版本升级时更新 |
| `docs/notes.md` | 阶段快照 | 每阶段追加 |

# pzds.com 逆向计划

## 1. 接口信息

| 项目 | 值 |
|------|-----|
| 目标站点 | https://www.pzds.com/goodsList/17 |
| 数据接口 | `POST https://api.pzds.com/api/web-client/v2/public/goodsPublic/page` |
| Content-Type | application/json |
| 加密参数 | `sign` (header), `decode__1174` (query) |
| WAF | 阿里云 WAF AA/BB + 滑块验证码 |
| 签名版本 | `x-sign-version: v17` |
| 签名引擎 | Rust WASM `generate_sign` (PC v17) |
| 前端框架 | Nuxt SSR (Vue) |

## 2. 请求参数

### 2.1 Request Body

```json
{
  "order": "ASC",
  "sort": null,
  "page": 1,
  "pageSize": 10,
  "action": {
    "gameId": "17",
    "goodsCatalogueId": 6,
    "goodsSubCatalogueIds": [],
    "keywords": [],
    "searchWords": [],
    "searchPropertyIds": [],
    "recommendSearchConfigIds": [],
    "unionGameIds": [],
    "goodsSearchActions": [],
    "metas": {"single1": []},
    "countFlag": false,
    "conditionSearch": false
  }
}
```

### 2.2 Headers

| Header | 值 | 说明 |
|--------|-----|------|
| `sign` | 32位MD5 | `generate_sign(body, method, ts, rnd)` |
| `pztimestamp` | Unix毫秒时间戳 | |
| `random` | 6位数字 | |
| `x-sign-version` | `v17` | 固定 |
| `pzos` | `windows` | |
| `pzplatform` | `pc` | |
| `pzversion` | `26.611.1730` | |
| `pzversioncode` | `1` | |
| `skey` | `CLIENT` | |
| `deviceid` | UUID | 浏览器生成，固定 |
| `globalid` | UUID | 浏览器生成，会话级 |
| `channelinfo` | JSON | 渠道信息 |
| `cookie` | `ssxmod_itna`, `acw_tc` 等 | WAF cookie |

### 2.3 Cookie

| Cookie | 说明 |
|--------|------|
| `ssxmod_itna` | 阿里云WAF会话token，有时效性 |
| `ssxmod_itna2` | 辅助token |
| `acw_tc` | WAF滑块通过token |
| `Hm_lvt_*` | 百度统计 |
| `_c_WBKFRo` | 反爬 cookie |

## 3. 加密方式

### 3.1 sign (✅ 已完成)

```
sign = generate_sign(body_json, method, timestamp, random)
```

- **实现**: `sites/pzds.com/src/sign_service.js`
- **引擎**: Rust WASM `ad96acb6.wasm` (70KB)
- **输入**: JSON请求体 + HTTP方法 + 时间戳 + 随机数
- **输出**: 32位MD5 hex字符串
- **验证**: 5/5 浏览器样本匹配

### 3.2 decode__1174 (🟡 结构正确，PRNG状态差异)

```
decode__1174 = "214d4f07715-" + custom_encode(ao)
```

**a4 执行顺序** (case dispatch string: `6|7|9|8|5`):

| Case | 动作 | 状态 |
|------|------|:--:|
| 6 | `aY = N.r` (globalThis) | ✅ |
| 7 | `aN = c(a3(url))`, `ao = as`, `aI = ao = encodeURIComponent(...)` | ✅ |
| 9 | `if(ao!=aI) aS=a0(aI); ag=[a2(ag),a2(aS),w(),ts,ver,devId,M()].join("\|")` | ✅ |
| 8 | `av = "\|" + O(ag)` | ✅ |
| 5 | 最终编码 → `decode__1174` | ✅ |

**a4 子函数**:

| 函数 | 输入→输出 | 确定性 |
|------|-----------|:--:|
| `a0(str)` | 字符串→16字符数组 | ✅ 纯函数 |
| `a2(arr)` | 16字符数组→16字符hex | ❌ B表/PRNG依赖 |
| `w()` | 无→数字(bitmap) | ❌ 存储缓存依赖 |
| `M()` | 无→缓存y值 | ✅ 缓存读取 |
| `O(str)` | 管道分隔字符串→压缩base64 | ✅ 纯函数(T/l固定) |
| `c(obj)` | 追踪对象→最终编码字符串 | ❌ 依赖B表 |

**PRNG根因**: 脚本内 `B` 调度器使用 `v[v.length-1] % t` 作为PRNG种子。
Node.js 初始化路径与浏览器不同（mock函数无 `v.push`/`v.pop`），导致 `v.length` 不同，
`a2`/`w` 产出不同值。但**结构一致**，需E2E验证服务端是否接受。

**浏览器参照值** (单次调用快照):
```
a2(ag) = "7623a744517623a7"     (随PRNG变化)
a2(aS) = "73c3a7b54873c3a7"     (随PRNG变化)
w()     = "268713984"           (随缓存变化)
M()     = "2284953104a19eca83024b" (固定缓存值y)
```

**关键发现**: `encodeURIComponent` override 依赖 `aY.pzversion` 为 `undefined`，
拼接后触发 `"undefinedpost"` 前缀匹配。Node.js mock 中 `pzversion`/`deviceid` 必须保持未定义。

## 4. 已完成项

| 阶段 | 文件 | 状态 |
|------|------|:--:|
| sign 生成 | `sign_service.js` | ✅ 5/5 |
| sign Python封装 | `pzds_signer.py` | ✅ |
| script_200.js 加载 | `encode_full_cli.js` | ✅ |
| a4 导出调用 | `globalThis.__a4` | ✅ |
| encodeURIComponent修复 | sign B64 + body 注入 | ✅ |
| Math/JSON/Storage mock | 补全全局对象 | ✅ |
| 浏览器断点分析 | a4 六步流程确认 | ✅ |
| PRNG差异根因 | v.length 环境差异 | ✅ |

## 5. 待完成项

### 5.1 E2E 端到端验证（优先级最高）

需要新鲜 WAF cookies (`ssxmod_itna`, `acw_tc`) 才能发送请求。

```bash
# 测试命令
node encode_full_cli.js '<body>' post <ts> <rnd> [sign]
```

验证标准：
1. 服务端返回 `{"success":true,...}` JSON 商品数据
2. 非 WAF 拦截页面

### 5.2 PRNG状态对齐（如E2E失败）

若服务器拒绝 Node.js 产出，需对齐 `v.length` 状态：
- 方案A: 检查并修正 mock 函数在初始化阶段的调用路径
- 方案B: 在 script 注入点重置 B 调度器 PRNG 状态
- 方案C: 纯算实现 a2/w 函数（绕过 PRNG 依赖）

## 6. 当前状态

编码链路完整：sign (WASM) + decode__1174 (Node.js 脚本) 均可本地生成。
PRNG 状态差异导致 Node.js 产出与浏览器值不同，但结构和格式一致。

## 7. 下一步动作

1. **E2E 验证**: 获取新鲜 cookies，Python 发包验证服务端是否接受
2. **PRNG对齐**: 如 E2E 失败，对齐脚本初始化路径

## 8. 关键文件

| 文件 | 用途 |
|------|------|
| `src/sign_service.js` | sign 生成 (CLI: node sign_service.js body method ts rnd) |
| `src/encode_full_cli.js` | decode__1174 生成 (CLI: node encode_full_cli.js body method ts rnd) |
| `src/test_e2e.py` | Python E2E 测试 |
| `src/ad96acb6.wasm` | Rust 签名 WASM |
| `src/script_200_raw.js` | 原始编码脚本 (56KB) |
| `deobfuscated/03_inline_dispatchers.js` | 反混淆后的编码逻辑 |

# 大众点评 (dianping) H5 mtgsig 逆向分析

## 站点信息

- **站点**: 大众点评移动端 H5 (`m.dianping.com`)
- **目标**: 本地纯算生成 mtgsig 请求签名，实现纯协议数据采集
- **SDK**: H5guard v4.2.0
- **状态**: 🟡 进行中 — VM 混合签名器可产出 mtgsig，待验证服务器端有效性

## 完成进度总览

### ✅ 已完成

| 组件 | 说明 |
|------|------|
| VM 引擎提取 | `aS_vm.js` — 完整 aS VM 引擎，兼容 Node.js v22 |
| 字节码提取 | `mtgsig_bc.txt` (10178 bytes) — mtgsig 实例字节码 |
| b[] 数据采集 | `b_array_data.json` — 完整 28 个外部依赖元素（来自浏览器闭包） |
| 工具函数还原 | k9, k7, k5, k6, k1, Custom Base64 (cW), RC4 (cP), Sub-VM (cO), MurmurHash (ka), Custom MD5 (aO/aP/aQ) |
| VM 独立运行 | Node.js 中完整运行 @0 初始化 + $_g5Lc 生成 mtgsig |
| 混合签名器 | `hybrid_signer.js` — VM 计算 a8/a5/a6 + 纯算修复 a9/d1 |
| Python 主脚本 | `signer.py` — 调用 Node.js + requests 发送协议请求 |
| aS VM Node.js v22 兼容 | 修复 `undefined['apply']`、`in` 操作符 null 检查、`typeof` 函数缺失 |
| d1 算法确认 | d1 = MD5(encodeURIComponent(concat)) XOR temp_array |
| a10 算法确认 | a10 = b[21] (jN)，每次调用时为固定值 "cc"（需改为随机） |

### 🔴 当前阻塞

| 阻塞项 | 详情 |
|--------|------|
| **a9 "undefined"** | VM 输出 a9 = `"4.2.0,7,undefined"`，原因是 b[7] (eU) 缺少 eU[0] 值。当前后处理修复。| 
| **服务器验证 403** | b[1] 会话 token (jQ) 可能已过期（捕获于 2026-05-26），需刷新 b[] 数据。 |
| **纯算能力缺 b[1]** | 根 token (jQ) 依赖 H5guard 浏览器初始化生成，本地生成方案待定。 |

### 🟡 待验证/优化

| 项目 | 说明 |
|------|------|
| a8 后缀 "c60ce40f" | VM 输出 a8 总是以后缀 `c60ce40f` 结尾，可能是因为 b[1] token 固定。需用新 token 验证是否变化。 |
| d1 temp_array 非固定 | 4 组浏览器样本验证：d1 XOR 数组每次请求都不同（取决于 a5/a6/a8 的具体值），必须在每次签名时动态反推。 |
| a10 随机化 | 当前 b[21] 固定为 "cc"（来自捕获），应改为 `Math.random().toString(16).slice(2,4)` |

### ⬜ 未完成

| 项目 | 说明 |
|------|------|
| 刷新 b[] 数据 | 用 AdsPower + CDP 桥重新采集浏览器 H5guard 闭包数据（含新 jQ token） |
| 定位 eU[0] 值 | 追踪 H5guard 初始化流程中 eU[0] 的赋值来源，使 VM 直接输出正确 a9 |
| 服务端验证 | 用新 token 发送请求验证签名正确性 |
| 纯算方案（无 VM） | 拆解 a5/a6/a8 为独立算法（AES-128-CBC + Custom Base64 + 三数组 XOR），去除 VM 依赖 |
| 任务完成清理 | 删除 `assets/`、`tests/` 目录 |

## 关键发现

### H5guard SDK

- 版本: 4.2.0 (请求 URL 参数 `csecversion=4.2.0`)
- 平台: `csecplatform=4`
- SDK 源码: `H5guard.js` / `H5guard_live.js`（已下载到 `assets/js/`）
- 代码混淆: OB 变种（匹配模式 `cn-bidding-ob`）

### aS VM 引擎

H5guard 使用自研 aS VM 来解释执行签名逻辑。特征：
- 字节码解释器（栈式 VM），指令集约 70+ 条操作码
- 字符串表 XOR 加密（密钥种子: `3n2l3o2f2`, base28→右移21位）
- 外部函数编号 `b[0]` ~ `b[27]`
- 实例缓存 keyed by hash（mtgsig 实例 hash: `dfdb71b1fa2738418bb11c4f7d70fb2c`）

### mtgsig 签名结构

```json
{
  "a1": "1.2",       // 版本 — 固定
  "a2": 1779690637209, // 时间戳 — Date.now()
  "a3": "805zzu6...",  // 设备指纹 ID (dfpId) — b[18] f9() 返回
  "a5": "hOcPGqky...", // VM 计算 — a6 前缀 + a2 → 编码
  "a6": "h1.9bhPO...", // VM 计算 — AES-128-CBC 加密环境参数，h1. 前缀
  "a8": "fc494460...", // VM 计算 — a5_16 XOR a6_16 XOR A8_FIXED[16]
  "a9": "4.2.0,7,...", // SDK 版本 — "4.2.0,7," + random(0-255)，VM 中为 undefined
  "a10": "f3",        // 随机 hex — b[21] (jN) 直出
  "x0": 4,            // 固定值
  "d1": "a4834910..." // 最终签名 — VM 计算: MD5(concat) XOR temp_array
}
```

### 算法链路（VM 内部）

```
b[1] jQ (session token) → a6 → a5 → a8 → d1
b[0] jT (fingerprint) → a6 AES key/IV → a6 → a5 → a8 → d1
b[18] f9() → a3
b[21] jN → a10
```

### b[] 外部依赖映射

| 索引 | 变量名 | 类型 | 说明 |
|------|--------|------|------|
| b[0] | jT | Uint8Array(1056) | 设备指纹（66×16 字节） |
| b[1] | jQ | string | 会话 token (h1.{AES}) — **关键依赖，可能过期** |
| b[2] | — | number | 时间戳 |
| b[3] | k9 | function | 字符串→charCode 数组 (含 encodeURIComponent) |
| b[4] | aO | function | Custom MD5 → 16-char hex |
| b[5] | k7 | function | hex 字符串→字节数组 |
| b[6] | jO | object | 签名状态对象 |
| b[7] | eU | array | **eU[0] 缺失导致 a9 undefined** |
| b[8] | eR | object | VM 环境信息 |
| b[9] | gV | object | 数据收集状态 |
| b[10] | iP | array | 版本数组 [24] |
| b[11] | cW | function | Custom Base64 编码 |
| b[12] | cO | function | Sub-VM (RC4 相关) |
| b[13] | ka | function | MurmurHash |
| b[14] | m3 | array | 请求行 charCode 数组 |
| b[15] | k6 | function | 数字→4 字节数组 (大端) |
| b[16] | jM | boolean | 标志位 |
| b[17] | k5 | function | 字节数组→hex 字符串 |
| b[18] | f9 | function | 返回 dfpId (a3) |
| b[19] | jS | string | 版本 "1.2" |
| b[20] | aa | object | URL 解析等工具模块 |
| b[21] | jN | string | 随机 hex (a10) — **当前固定需改为随机** |
| b[22] | aP | function | Custom MD5 → 4×32bit words |
| b[23] | aQ | function | Custom MD5 words → 16-char hex |
| b[24] | jP | number | 计数器 |
| b[25] | k1 | function | 数字→4 字节数组 (大端) |
| b[26] | iF | string | 空字符串 "" |
| b[27] | ao | function | 空函数 (日志桩) |

## 反混淆进度

| 步骤 | 脚本 | 状态 |
|------|------|------|
| 1. normalize | `normalize-structure.js` | ✅ 789ms |
| 2. prune | `prune-fake-branches.js` | ✅ 482ms |
| 3. inline_dispatchers | `inline-dispatchers.js` | ✅ 已修复 (try-catch + 手动 patch) |
| 4. decode_strings | `decode-strings.js` | ⏳ 可选 — VM 已可独立运行 |

> inline_dispatchers: try-catch 防御性修复保留，但 VM 路径优先实现。

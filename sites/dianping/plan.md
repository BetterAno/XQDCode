# 大众点评 mtgsig 逆向执行方案

## 1. 接口信息

| 接口 | URL | Method | Content-Type |
|------|-----|--------|-------------|
| 店铺问答 | `/wxmapi/shop/shopquestion?csecplatform=4&csecversion=4.2.0&device_system=&shopId=G7lZQSVUguP43EIT&yodaReady=h5` | GET | N/A (签名在 Header) |

> mtgsig 通过 HTTP Request Header `mtgsig` 字段传递，值为 JSON 字符串。

## 2. 请求参数 (mtgsig JSON)

| 参数名 | 类型 | 说明 | 是否加密 |
|--------|------|------|----------|
| a1 | string | 版本号 "1.2" | ❌ 固定 |
| a2 | number | 时间戳 (毫秒) | ❌ 即时生成 |
| a3 | string | 设备指纹 ID (dfpId) | ❌ 浏览器 localStorage 获取或本地生成 |
| a5 | string (Base64) | AES-128-CBC 加密的环境参数 | ✅ AES 加密 |
| a6 | string "h1.{Base64}" | AES 加密 + h1. 前缀 | ✅ AES 加密 |
| a8 | string (32 hex) | 三数组 XOR 结果 | ✅ XOR 运算 |
| a9 | string | SDK 版本信息 | ❌ 固定格式 |
| a10 | string (2 hex) | 随机 2 位 hex | ❌ 即时生成 |
| x0 | number | 固定值 4 | ❌ 固定 |
| d1 | string (32 hex) | 最终签名 (拼接→MD5→XOR) | ✅ 计算生成 |

## 3. 加密方式

### 3.1 a6: AES-128-CBC 加密环境参数

- **加密函数**: H5guard aS VM (字节码解释器)
- **算法类型**: AES-128-CBC
- **密钥**: 66 位随机数组 → 取前 16 字节为 key，后 16 字节为 IV
- **明文**: JSON 序列化的环境参数（platform, vendor, userAgent, screen, colorDepth, language, timezone 等）
- **输出**: Base64 编码，前缀 `h1.`
- **实证依据**: 逆向分析 H5guard_live.js 确认 AES 加密模式，Hook 捕获到输入/输出对照

### 3.2 a8: 三数组 XOR

- **算法**: `a5_arr16 XOR a6_arr16 XOR A8_FIXED[16]`
- **A8_FIXED**: `[115, 77, 208, 7, 220, 219, 190, 23, 10, 174, 113, 15, 83, 31, 108, 51]`
- **输出**: 32 位 hex 字符串
- **注意**: a5_arr16 和 a6_arr16 需要从 VM 执行过程中提取，4.2.0 版本可能不同

### 3.3 d1: 串联签名

- **算法**: `"4" + a1 + a2 + a3 + a5 + a6 + a8 + a9 + a10` → UTF-8 bytes → MD5 → XOR with temp array [16 bytes] → hex
- **输出**: 32 位 hex 字符串
- **注意**: d1_temp 数组需要从浏览器签名样本中确认

## 4. 验证码

无。该接口不需要验证码。普通业务接口只需携带 mtgsig。

## 5. 实现方案

### 路线选择

- [x] **路线 C: CDP 桥接** — 使用 AdsPower 指纹浏览器 + Python CDP 协议，兼顾指纹安全和可编程调试
- [x] **纯算方案优先** — 目标是在 Node.js 中独立运行 aS VM 生成签名

### 当前实现状态

| 文件 | 说明 | 状态 |
|------|------|------|
| `src/aS_vm.js` | 提取的 VM 引擎 + 字符串表 (已 patch Node.js v22 兼容) | ✅ |
| `src/hybrid_signer.js` | **混合签名器** (VM计算核心字段 + 纯算修复a9/d1) | ✅ 产出完整mtgsig |
| `src/pure_signer.js` | 纯算签名器 (完整VM运行，含debug追踪) | ✅ VM可运行，a9仍有undefined |
| `src/signer.py` | **Python 主协议请求脚本** | ✅ 调用Node.js + requests |
| `src/b_array_data.json` | 浏览器真实 b[] 28个外部依赖数据 | ✅ 已采集 (token需刷新) |
| `src/real_b_data.json` | 浏览器完整快照 (mtgsig样本 + cookies) | ✅ 已采集 (token需刷新) |
| `assets/js/mtgsig_bc.txt` | mtgsig VM 字节码 (10178 字节) | ✅ 已提取 |

### 当前阻塞点（2026-05-26）

| 阻塞项 | 根因 | 影响 |
|--------|------|------|
| **a9 = "4.2.0,7,undefined"** | b[7] (eU) 缺少 eU[0] 值，VM 读取 eU[0] 时为 undefined | d1 签名与正确 a9 不一致 |
| **b[1] token 可能过期** | 会话 token (jQ) 捕获于 2026-05-26，有时效性 | 服务端返回 403 |
| **d1 temp_array 每次请求不同** | 4组浏览器样本验证确认：d1 XOR MD5 数组随 a5/a6/a8 变化 | 不能硬编码 temp_array，必须每次动态反推 |

### a9/a10 测试结论

- **a9**: 始终输出 `"4.2.0,7,undefined"`，与 b[24] (jP) 值无关
- **a10**: 等于 b[21] (jN) 的值，当前固定为 "cc"（来自捕获数据）
- **修复方向**: 定位 eU[0] 在 H5guard 初始化中的赋值来源，或继续使用后处理方案

### 后续步骤

- [x] 修复 VM 独立运行（Node.js v22 兼容）
- [x] 创建混合签名器 `hybrid_signer.js` → VM + 纯算修复
- [x] 创建 Python 主脚本 `signer.py`
- [x] 确认 d1 算法和 temp_array 动态特性
- [x] 确认 a9/a10 与 b[] 的关系
- [ ] **刷新 b[] 数据** — 用 AdsPower + CDP 桥重新采集浏览器 H5guard 闭包（含新 jQ token）
- [ ] **定位 eU[0] 值** — 追踪 H5guard 初始化 `eU[0] = lB` 的赋值来源
- [ ] **服务端验证** — 用新 token 发送请求，验证签名正确性
- [ ] **a10 随机化** — 将 b[21] 改为随机 hex（当前固定 "cc"）
- [ ] **纯算方案（无 VM）** — 拆解 a5/a6/a8 为独立算法实现

### 备选方案

- **补环境**: 如纯算还原困难，可考虑 Node.js vm2 补环境方案
- **RPC 调用**: CDP 桥 RPC 模式作为最终备选（浏览器执行 JS，Python 获取结果）
- **Token 刷新**: 定期通过 CDP 桥自动刷新 b[1] token 并持久化

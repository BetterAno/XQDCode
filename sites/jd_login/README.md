# JD Login Reverse — 京东滑块验证码纯本地协议求解

京东 PC 登录（passport.jd.com）jcap 滑块验证码的完整逆向工程与本地协议验证方案。
**不依赖浏览器 / 不依赖任何自动化方案**，纯 Node.js WASM 补环境 + Python HTTP 请求完成 fp→check→滑块识别→verify 全链路。

## 快速开始

```powershell
cd sites\jd_login\src
pip install -r ..\requirements.txt

# 独立滑块验证（获取 vt token）
python jd_protocol_solver.py

# 完整登录流程（含滑块 + 密码加密）
python login_flow.py -u <账号> -p <密码>
```

**硬件要求**：Node.js 18+，Python 3.10+，OpenCV（可选，用于缺口识别回退）。

## 架构概览

```
┌─────────────────────────────────────────────────┐
│                   Python 层                       │
│  jd_protocol_solver.py   login_flow.py           │
│         │                      │                  │
│         ▼                      ▼                  │
│  ┌──────────────┐   ┌──────────────────┐        │
│  │ node_bridge  │   │ yuncode_captcha  │        │
│  │ (JSON-RPC    │   │ (云码 API)       │        │
│  │  stdio 桥接)  │   │ OpenCV 模板匹配   │        │
│  └──────┬───────┘   └──────────────────┘        │
│         │ stdio                                   │
├─────────┼────────────────────────────────────────┤
│         ▼               Node.js 层                │
│  ┌──────────────────────────────────────────┐    │
│  │           jcap_env.js                     │    │
│  │  • vm.runInContext 加载 jcap UMD 模块      │    │
│  │  • 完整浏览器环境 shim                     │    │
│  │  • WASM 内嵌 base64 自动加载               │    │
│  │  • D 实例缓存（跨请求复用 ii）              │    │
│  │  • actions: get_ct_direct / get_tk_direct │    │
│  │             get_cs_direct / get_encrypt_all│   │
│  └──────────────────────────────────────────┘    │
│         │                                          │
│         ▼                                          │
│  ┌──────────────────────────────────────────┐    │
│  │         jcap_patched.js                   │    │
│  │  • 运行时插桩暴露 __JCAP_DEBUG_KLASS      │    │
│  │  • 捕获 sid / devcInfo / rArg             │    │
│  └──────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
         │
         ▼ HTTP (curl_cffi, Chrome 131 TLS 指纹)
┌─────────────────────────────────────────────────┐
│              京东服务端                            │
│  /cgi-bin/api/fp    → st token (风控指纹)         │
│  /cgi-bin/api/check → 验证码图片 + 验证提交       │
│  /uc/loginService   → 登录提交                    │
└─────────────────────────────────────────────────┘
```

## 文件布局

```
jd_login/
├── node/                          # Node.js 补环境核心
│   ├── jcap_env.js                # ★ 补环境主体（--stdio JSON-RPC 模式）
│   ├── jcap_patched.js            # ★ 插桩后的 jcap SDK（暴露 WASM 类构造器）
│   ├── jcap.wasm                  # WASM 二进制（jcap v2.7.1）
│   ├── jcap_solver.js             # 独立 WASM 求解器（备用方案）
│   ├── jcap_trace.js              # 浏览器端轨迹/调用链收集
│   ├── jcap_node_env.js           # Node.js 环境辅助
│   ├── jcap_wasm_env.js           # WASM 环境辅助
│   ├── make_patch.js              # 生成 jcap_patched.js 的插桩脚本
│   ├── pwd_encrypt.js             # RSA 密码加密
│   ├── real_fingerprint.json      # 真实 Chrome 指纹（devcInfo + tdat_ctx）
│   ├── analyze_structure.js       # 逆向：模块结构分析
│   ├── analyze_wasm.js            # 逆向：WASM 导出分析
│   └── probe_d_methods.js         # 逆向：D 实例方法探测
│
├── src/                           # Python 协议求解
│   ├── jd_protocol_solver.py      # ★ 滑块验证核心求解器
│   ├── node_bridge.py             # ★ Python↔Node.js JSON-RPC 桥接
│   ├── login_flow.py              # 完整登录流程（含滑块 + 密码加密）
│   ├── config.py                  # 配置文件（URL / UA / Headers）
│   ├── yuncode_captcha.py         # 云码 API 封装
│   ├── cdp_slider.py              # CDP 浏览器滑块方案（备用）
│   └── trajectory_analysis.js     # 轨迹数据分析参考
│
├── scripts/                       # 逆向工程工具
│   ├── download_js.py             # 下载原始 jcap JS 文件
│   ├── extract_modules.py         # 提取 UMD 模块
│   ├── find_wasm_module.py        # 定位 WASM 模块
│   ├── save_wasm.py               # 保存 WASM 二进制
│   ├── save_captured_data.py      # 保存浏览器捕获的请求数据
│   └── analyze_jcap.py            # jcap 行为分析
│
├── assets/
│   ├── js/                        # 原始 jcap_ap0b2a.js 备份
│   ├── js-deob/                   # 反混淆产物
│   └── screenshots/               # 验证码图片输出
│
├── docs/                          # 分析笔记
│   ├── 01-fingerprint.md          # 指纹采集与注入
│   └── 03-flow.md                 # API 全链路流程
│
├── download_js.py                 # 从 JD 下载最新 jcap JS
├── requirements.txt               # Python 依赖
└── README.md                      # 本文件
```

## 核心模块详解

### 1. `node/jcap_env.js` — WASM 补环境

在 Node.js 中通过 `vm.runInContext` 加载 jcap UMD 模块，补齐完整的浏览器环境：

- **document / navigator / screen / location**：标准浏览器对象模拟
- **Canvas / WebGL**：基于 `@napi-rs/canvas` 的 2D/WebGL 渲染（指纹采集用）
- **XMLHttpRequest**：拦截 jcap 内部 XHR 请求，捕获加密参数
- **Worker**：WASM 在 Worker 中初始化

**`--stdio` JSON-RPC 模式**：通过 stdin/stdout 与 Python 通信，支持以下 actions：

| Action | 说明 | 输入 | 输出 |
|--------|------|------|------|
| `init` | 初始化 jcap 实例 | `option` | 实例方法列表 |
| `get_ct_direct` | 生成 ct（绕过同步路径） | `sid`, `devcInfo` | `ct`, `instanceId` |
| `get_tk_direct` | 生成 tk（轨迹加密） | `sid`, `st`, `trajectory`, `touchList` | `tk` |
| `get_cs_direct` | 生成 cs（调用栈加密） | `sid`, `stackRecords` | `cs` |
| `get_encrypt_all` | 一键生成 ct+tk+cs | `sid`, `st`, `trajectory`, … | `ct`, `tk`, `cs` |
| `reset_d_instance` | 重置缓存的 D 实例 | — | — |
| `appCreate` / `appCheck` | jcap 原始同步方法 | `option` | 内部状态 |

**D 实例缓存机制**：首次 `get_ct_direct` 创建 WASM 实例并缓存，后续 `get_tk_direct` / `get_encrypt_all` 复用同一个实例，确保轨迹中的 `ii`（instanceId）与实际 WASM 实例一致。

### 2. `src/jd_protocol_solver.py` — 滑块验证求解器

完整的 6 步验证流程：

```
Step 1: get_fresh_sid()     → 从登录页提取 sessionId
Step 2: step_fp()            → get_ct_direct + POST /fp → st token
Step 3: step_check()         → get_tk_direct + POST /check → 验证码图片
Step 4: step_solve_gap()     → OpenCV/云码 缺口识别
Step 5: generate_trajectory() → 4阶段模拟人类拖拽
Step 6: step_verify()        → get_encrypt_all + POST /check → vt token
```

**缺口识别策略**：
1. OpenCV 多方法匹配（CCOEFF_NORMED + CCORR_NORMED）
2. 置信度分级：≥0.08 高置信 / <0.05 回退云码
3. 方法间交叉验证：差异 >20px 自动回退云码

**Session 重建**：verify 失败（code=16807）后自动 `reset_d_instance` → 新 sid → fp → check 重试。

### 3. `src/node_bridge.py` — Python↔Node.js 桥接

- `NodeBridge`：单次调用子进程（用于 pwd_encrypt.js）
- `JcapSession`：长生命周期 stdio 子进程，JSON-RPC 通信
  - 自动设置 `JCAP_PATCHED=1` 加载插桩版本
  - 首次 `get_ct_direct` 自动 WASM 热身（~3.5s）
  - `reset_d_instance()` 支持会话重建时清除缓存

### 4. `node/make_patch.js` — 运行时插桩

在 jcap 源码的关键位置注入 hook，生成 `jcap_patched.js`：

- **WASM 类构造器暴露**：`globalThis.__JCAP_DEBUG_KLASS = CaptchaWebAssembly` — 这是绕开 jcap 内部同步路径、直接调用 `getCTData` 的关键
- **sid/devcInfo 捕获**：保存到 `globalThis.__JCAP_LAST_*` 供 Python 侧读取
- **rArg 构造参数捕获**：`globalThis.__JCAP_DEBUG_R` 保存 WASM 初始化参数

## 关键技术突破

### 突破点 1：WASM getCTData 返回 null 问题

jcap 内部 `D = new CaptchaWebAssembly(r)` 后同步调用 `D.getCTData()` 总是返回 null。
**根因**：WASM 初始化是异步的，同步路径下内部状态未就绪。
**解决**：等待 WASM 内部初始化完成（~3.5s）后，用完全相同的 `rArg` 构造新的 D 实例，新实例的 `getCTData` 即可返回合法 ct。此逻辑封装在 `ensureWasmWarmed()` 中。

### 突破点 2：D 实例跨请求复用

浏览器中所有请求（fp/check/verify）共用同一个 WASM 实例，轨迹数据中的 `ii` 字段必须与实际 `getInstanceId()` 一致。
**解决**：`jcap_env.js` 中引入 `cachedDInstance` 全局缓存，`get_ct_direct` 首次创建后缓存，`get_tk_direct` / `get_encrypt_all` 复用同一实例。Python 端从 `get_ct_direct` 响应中获取实际 `instanceId` 填入轨迹数据。

### 突破点 3：URL 编码兼容性

浏览器中轨迹数据通过 `encodeURI(JSON.stringify(trajectoryData))` 编码，逗号 `,` 保留为原字符。
Python 的 `urllib.parse.quote()` 默认会将逗号编码为 `%2C`，导致 tk 加密结果不一致，服务端验证失败（code=16807）。
**解决**：`urllib.parse.quote(s, safe=";/?:@&=+$,-_.!~*'()#")` 匹配 JS `encodeURI` 行为。

### 突破点 4：真实指纹注入

从真实 Chrome 使用 js-reverse-mcp 在 jcap 内部断点捕获 devcInfo 明文，保存到 `real_fingerprint.json`。
jcap_env.js 的 `get_ct_direct` 自动优先使用真实指纹构造 WASM 实例，服务端 fp 风控 code=0 通过。

## 验证测试

```powershell
python jd_protocol_solver.py
```

预期输出（成功时）：

```
[Step 1] 获取新鲜 sessionId ... ✓
[Step 2] jcap fp 请求 ... ct=AwPFBO... (1671 chars), code=0, st token 非空
[Step 3] jcap check 请求 ... code=0, tp=30, 验证码图片已提取
[Step 4] 滑块缺口识别 ... CCOEFF x=132 score=0.519, 两方法一致
[Step 5] 轨迹生成 ... 69 点, endX=139, totalTime=1407ms
[Step 6] 提交滑块验证 ... code=0, vt token 获取成功 ✓
```

## 依赖

```
# Python
curl_cffi>=0.7.0      # TLS 指纹伪装（Chrome 131）
opencv-python>=4.9.0  # 滑块缺口识别
numpy>=1.26.0
requests>=2.31.0
pycryptodome>=3.20.0  # RSA 密码加密

# Node.js（已在 node_modules 或全局安装）
# jcap_env.js 自动加载内嵌 WASM，无额外 npm 依赖
```

## 相关文档

- `docs/01-fingerprint.md` — 指纹采集流程与 devcInfo 结构
- `docs/03-flow.md` — API 全链路（fp→check→verify）请求/响应格式
- `src/trajectory_analysis.js` — 成功/失败轨迹对比与加密流程分析

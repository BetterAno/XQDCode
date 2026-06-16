# 网易易盾滑块验证码逆向

> 目标：`https://dun.163.com/trial/jigsaw` 滑块验证码纯协议还原

## 项目结构

```
sites/dun_163_com/
├── README.md                      # 本文件
├── plan.md                        # Phase 3 逆向方案（接口/参数/加密）
├── docs/                          # 接口、加密、调试笔记
└── src/
    ├── main.py                    # Python 协议请求主脚本
    ├── signer.js                  # Node.js 补环境加密签名器
    ├── env/
    │   ├── browser.js             # 浏览器环境模拟
    │   └── sdk/
    │       ├── load.min.js
    │       ├── core_v2.28.5.min.js
    │       └── ir.2.0.13.min.js
```

## 验证码流程

```
1. getconf     → 获取 SDK 配置（dt, zoneId, ir 配置）
2. IR 上报     → 设备指纹加密上传，获取 irToken
3. get         → 获取验证码图片(bg/front) + token
4. OpenCV 识别 → 识别滑块缺口位置
5. check       → 验证滑块位置，返回 validate
```

## 运行环境

- Python 3.10+ (项目 `./venv`)
- Node.js 20+
- Python 依赖：`requests`、`opencv-python`、`numpy`、`ddddocr`
- Node.js 依赖：无额外 npm 包

## 使用方式

```bash
# 运行主脚本
./venv/Scripts/python.exe sites/dun_163_com/src/main.py

# 测试 get/cb/fp 生成
node sites/dun_163_com/src/signer.js get "{\"referer\":\"https://dun.163.com/trial/jigsaw\"}"

# 测试 IR SDK 加密数据生成
node sites/dun_163_com/src/signer.js ir "{\"pn\":\"YD00192283058223\",\"referer\":\"https://dun.163.com/trial/jigsaw\"}"
```

## 关键配置

| 配置项 | 值 | 说明 |
|--------|------|------|
| captchaId | `07e2387ab53a4d6f930b8d9a9be71bdf` | 验证码 ID |
| IR pn | `YD00192283058223` | IR 产品号 |
| IR vk | `d44593ca` | IR 版本密钥 |
| 本地识别 | OpenCV masked match + `ddddocr.slide_match` | OpenCV 优先，ddddocr 对照候选 |
| 云码 API | `http://api.jfbym.com/api/YmServer/customApi` | 可选兜底，需显式启用 |
| 云码 type | `20111` | 通用双图模式 |

---

## 当前进度

### 已完成

1. **Phase 1 流量分析** — 完整捕获 34 个请求，识别 4 个核心接口
2. **Phase 3 Plan 确认** — plan.md 包含完整接口文档和加密参数清单
3. **browser.js 补环境框架** (~950 行)
   - MockElement, MockCanvas2D, MockWebGL 完整实现
   - window.addEventListener/removeEventListener/dispatchEvent（**关键修复**）
   - OfflineAudioContext, speechSynthesis, navigator.userAgentData 等
   - Bun/Deno 运行时检测 stub
4. **IR SDK 字符串表完整解码** — 已用于定位 IR SDK 入口与上报路径
5. **IR SDK `createNECaptchaGuardian` 成功初始化** — 可创建 guardian 对象，`getToken` 方法存在
6. **IR SDK 加密 `d` 参数可成功生成** — 通过 `signer.js ir` 验证，生成格式：
   ```json
   {"p":"YD00192283058223","v":"2.0.13_yanzhengma","vk":"d44593ca","n":"随机","d":"加密指纹"}
   ```
7. **getconf 接口验证通过** — Python requests 可正常获取 dt/zoneId/ir 配置
8. **Python main.py 完成** — getconf/ir_upload/get_captcha/download_images/recognize_captcha/check_captcha 完整流程
9. **真实端到端通过** — `check` 返回 `result=true` 并输出 `validate`

### 关键修复记录

1. `signer.js` 异步捕获改为读取模块内 `_captures`，修复 IR body 捕获超时。
2. `signer.js` 只负责生成 IR 上报 body，Python `requests.post` 负责真实发送并获取 `irToken`。
3. `cb`、`d/p/f/ext` 均复用原始 core 模块生成，避免猜测性重写。
4. 滑块识别从单一 `ddddocr.slide_match` 改为 OpenCV alpha mask 模板匹配优先，解决距离候选漂移。

---

## 关键技术发现

### IR SDK 字符串表解码

IR SDK 使用自定义 Base64 字符集 `nozufdvtxsrgawjkelqcpyihbmNOZUFDVTXSRGAWJKELQCPYIHBM0123456789+/=`，1059 条索引。重要索引：

| 索引 | 值 | 说明 |
|------|------|------|
| y(27) | `"window"` | `ai = window` |
| y(219) | `"getComputedStyle"` | 浏览器检测函数调用 |
| y(311) | `"addEventListener"` | **此方法缺失曾导致 IR SDK 崩溃** |
| y(312) | `"voiceschanged"` | 语音合成事件 |
| y(379) | `"global"` | 全局对象检查 |
| y(57) | `"createNECaptchaGuardian"` | SDK 入口函数名 |
| y(1038) | `"https://ir-sdk.dun.163.com"` | 默认 IR 服务器 |
| y(1040) | `"productId"` | 产品ID |
| y(1052) | `"/v4/j/up"` | IR 上报路径 |

### IR SDK 初始化路径

```
createNECaptchaGuardian(config)
  → Hr(config) → new Wm(config)
    → new au(productId)      // 设备指纹上下文
    → new Gu()               // 事件计数器
    → Kr()                   // 异步收集所有指纹（30+个采集函数）
    → getToken(callback)     // 加密 + POST → 回调返回 token
```

### 加密流程

IR SDK 的 `d` 参数通过 MurmurHash3 + XOR + 自定义 Base64 编码生成（y(79) 为密钥常量，y(1054) 为 URL-safe Base64 字符集）。

---

## 清理说明

任务完成清理已执行：
- 原 `assets/js/` 调试目录已删除。
- 运行必需 SDK 已迁移到 `src/env/sdk/`。
- `src/test_*.js` 与 `src/test_flow.py` 测试脚本已删除。

---

## 2026-05-22 进度更新

### 配置与工具状态

- `AGENTS.md` 规则已在当前 Codex 会话生效，项目按协议逆向优先、Phase 0-4、项目 venv、PowerShell 规范执行。
- 本地 reverse skills 已加载：`web-reverse-master`、`web-reverse-workflow`、`web-reverse-executing-plans`、`ast-deobfuscation` 等均可用。
- `js-reverse-mcp` 可接管当前 Chrome，当前选中页面为 `https://dun.163.com/trial/jigsaw`，本任务采用路线 B。
- 子 Agent 能力可用，当前会话暴露 `multi_agent_v1` 的 spawn/wait/close 工具。主线任务暂未拆分给子 Agent，避免并行写入冲突。

### 已完成修复

1. **P0 signer.js 异步捕获 bug 已修复**
   - `loadIrSdk()` 已改为读取模块内 `_captures`，不再轮询沙箱里的旧 `window.__irCaptures`。

2. **P1 IR 上报已跑通**
   - Node.js 只负责生成 IR 上报 body：`p/v/vk/n/d`。
   - Python `main.py` 使用 `requests.post` 向 `https://ir-sdk.dun.163.com/v4/j/up` 发送真实请求并获取 `irToken`。

3. **P2 get 接口 cb 已跑通**
   - `signer.js` 加载 `core_v2.28.5.min.js` 后暴露内部 webpack require。
   - `cb` 使用原始 core 模块生成，长度与浏览器样本一致。

4. **P3 check 接口 data 已跑通到请求格式层**
   - `data.d/p/f/ext` 使用原始 core 模块生成。
   - 动态调试已确认浏览器公式：
     - `d = aes(sample(traceData, SAMPLE_NUM).join(':'))`
     - `p = aes(xorEncode(token, percentDistance))`
     - `f = aes(xorEncode(token, normalize(sample(atomTraceData, 2)).join(',')))`
     - `ext = aes(xorEncode(token, mouseDownCounts + ',' + traceData.length))`

### 验证结果

- `node --check sites/dun_163_com/src/signer.js` 通过。
- `node --check sites/dun_163_com/src/env/browser.js` 通过。
- `venv\Scripts\python.exe -m py_compile sites/dun_163_com/src/main.py` 通过。
- 本地 `signer.js fp` 可生成有效 `cb`。
- 本地 `signer.js check` 可生成 `d/p/f/ext`。
- 本地 OpenCV masked match 可识别滑块 `style.left` 像素距离，`ddddocr.slide_match` 保留为对照候选。
- 真实接口验证已完成：`getconf -> IR upload -> get -> check` 已返回 `result=true`，并输出 `validate`。

### 最终验收

1. **真实端到端通过**
   - 完整链路：`getconf -> IR upload -> get -> OpenCV 识别 -> check`。
   - `check` 已返回 `result=true`，并成功输出 `validate`。

2. **识别方案已修正**
   - `ddddocr.slide_match` 在部分图片上会出现 `simple/full` 候选漂移。
   - 已改为 OpenCV alpha mask 模板匹配优先，`ddddocr` 仅作为对照候选。
   - 成功样本：`opencv_masked distance=188 confidence=0.942086398601532`。

3. **产物清理完成**
   - 运行必需 SDK 已移到 `src/env/sdk/`。
   - 临时 `assets/`、`src/test_*.js`、`src/test_flow.py` 已删除。
   - 当前保留核心产物：`src/main.py`、`src/signer.js`、`src/env/`、`docs/`、`README.md`、`plan.md`。

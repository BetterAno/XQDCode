# 银河票务 (galaxyticketing.com) 登录逆向

## 站点信息
- 目标: https://www.galaxyticketing.com
- 登录接口: `POST https://rest-sig.imaitix.com/api/user/userLogin`
- 验证码系统: **阿里百川 Baxia** 九宫格点选

## 验证码分析

### 系统识别
- 厂商: 阿里百川 Baxia (大麦系)
- 特征: `_____tmd_____`、`x5secdata`、`bx-ua`、`appKey=X82Y__`
- WASM: `program.wasm` v0.0.20 (grid) / v0.0.5 (non-grid)

### 验证类型
- 九宫格点选 (Grid Click, `gridType=9`)
- 交互模式: **逐张选择 + 替换** (非一次性选完提交)

### 请求链路

```
① POST /api/user/userLogin → 触发风控 → RGV587_ERROR::SM
② POST /_____tmd_____/punish?x5step=1 → 获取验证码页面
③ GET /_____tmd_____/punishTextFetch → 获取提示文案
④ GET /_____tmd_____/gridClickGet → 获取九宫格图片 (encryptToken + 9张图)
⑤ GET /_____tmd_____/gridClickReplace → 提交选择 (code=301 继续, code=0 通过)
⑥ 重复 ④⑤ 直到验证完成
```

### 图片解密
- Baxia 图片 content 为 WASM 加密格式 (前缀 `00000003 cafeb08f`)
- 解密方式: **补环境** - 直接加载 `program.wasm`, 手动构建 dispatch table (mc)
- WASM `_initialize()` → `pc(1)` → `gc[7] = document` → `pc(2)` 安装 `document.__update_img`
- `__update_img(index, canvas, {token, data})` 解密并渲染到 Canvas
- 从 Canvas 提取 PNG base64 用于打码

### 核心参数
| 参数 | 说明 | 逆向难度 |
|------|------|---------|
| `ua` | WASM 生成的加密设备指纹 | ⭐⭐⭐⭐⭐ |
| `bx-et` | 环境行为指纹 | ⭐⭐⭐⭐ |
| `bx-pp` | 页面行为指纹 | ⭐⭐⭐⭐ |
| `x5secdata` | 安全校验数据 (贯穿全链路) | ⭐⭐⭐ |
| `encryptToken` | 图片加密 Token | ⭐⭐ |
| `email` | Base64 编码 | ⭐ |
| `loginPass` | RSA 加密 | ⭐⭐⭐ |

### 打码方案
- 平台: 云码 (jfbym.com) type=30008
- 接口: `POST http://api.jfbym.com/api/YmServer/customApi`
- 参数: `image`(大图base64) + `label_image`(小标签图base64) + `token` + `type=30008`
- 返回: 选中图片索引 (1-based, 逗号分隔)

## 文件结构
```
sites/galaxyticketing/
├── README.md                  # 本文件
├── src/
│   ├── main.py                # 主流程脚本 (登录+验证码)
│   ├── captcha_solver.py      # 云码验证码识别模块
│   └── node_bridge.py         # Python ↔ Node.js stdio JSON-RPC 桥接
├── node/
│   ├── baxia_env.js           # Node.js 补环境 WASM 解密脚本
│   ├── program.wasm           # Baxia WASM 模块 (v0.0.20, 已解压)
│   ├── scratch-captcha.js     # Baxia SDK 源码 (含 dispatch table 定义)
│   └── punishpage.min.js      # 验证码页面 JS
└── docs/
    └── api.md                 # 接口文档
```

## WASM 补环境架构

```
Python (main.py)
  ├─ requests → 登录/验证码 API
  └─ node_bridge.py (BaxiaSession)
       └─ stdio JSON-RPC → node/baxia_env.js
            ├─ 手动构建 dispatch table (mc = uc + general opcodes)
            ├─ WebAssembly.compile/instantiate (import: {"a": mc})
            ├─ _initialize() → pc(1) → gc[7]=document → pc(2)
            ├─ document.__update_img() 安装完成
            └─ decrypt_image: __update_img(idx, canvas, {token, data}) → Canvas → PNG base64
```

## 当前状态
- [x] 流量分析完成
- [x] 验证码请求链路梳理
- [x] 云码识别模块编写
- [x] 主流程框架编写
- [x] WASM 加载 + dispatch table 构建 (program.wasm 正常加载)
- [x] Node.js 补环境脚本 (baxia_env.js)
- [x] Python 桥接模块 (node_bridge.py)
- [ ] **WASM __update_img 解密**: 返回 0 (成功) 但 Canvas 像素全零 — 核心阻塞 ⚠️
- [ ] `ua` 参数生成逻辑 (WASM 逆向)
- [ ] `bx-et`/`bx-pp` 环境指纹生成
- [ ] `loginPass` RSA 加密逆向
- [ ] 端到端测试通过

> 详细进度和阻塞分析见 [docs/progress.md](docs/progress.md)

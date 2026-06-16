# 网易易盾滑块验证码 逆向执行方案

## 1. 接口信息

| 接口 | URL | Method | Content-Type | 说明 |
|------|-----|--------|--------------|------|
| getconf | `https://c.dun.163.com/api/v2/getconf` | GET/JSONP | - | 获取SDK配置 |
| IR上报 | `https://ir-sdk.dun.163.com/v4/j/up` | POST | text/plain | 设备指纹上报，获取irToken |
| get | `https://c.dun.163.com/api/v3/get` | GET/JSONP | - | 获取验证码图片+token |
| check | `https://c.dun.163.com/api/v3/check` | GET/JSONP | - | 验证滑块位置 |

## 2. 请求参数

### getconf
| 参数 | 类型 | 说明 | 加密 |
|------|------|------|------|
| id | string | captchaId=`07e2387ab53a4d6f930b8d9a9be71bdf` | 否 |
| referer | string | `https://dun.163.com/trial/jigsaw` | 否 |
| dt | string | 可选，getconf返回的dt token | 否 |

### IR上报
| 参数 | 类型 | 说明 | 加密 |
|------|------|------|------|
| p | string | 产品号=`YD00192283058223` | 否 |
| v | string | SDK版本=`2.0.13_yanzhengma` | 否 |
| vk | string | 固定值=`d44593ca` | 否 |
| n | string | 随机nonce | 否 |
| d | string | 加密设备指纹/行为数据 | **是** |

### get
| 参数 | 类型 | 说明 | 加密 |
|------|------|------|------|
| dt | string | getconf返回 | 否 |
| irToken | string | IR上报返回的tk | 否 |
| id | string | captchaId | 否 |
| fp | string | 设备指纹字符串 | 补环境生成 |
| cb | string | 加密校验值 | **是** |
| token | string | 首次为空，后续为上轮token | 否 |

### check
| 参数 | 类型 | 说明 | 加密 |
|------|------|------|------|
| dt | string | getconf返回 | 否 |
| id | string | captchaId | 否 |
| token | string | get返回的token | 否 |
| data | JSON string | 含d/p/f/ext字段 | **是** |
| cb | string | 加密校验值 | **是** |

## 3. 加密方式（补环境方案）

### 核心JS文件
- `core-optimi.m25b40.v2.28.5.min.js` (631K) — 核心加密逻辑
- `ir.2.0.13.min.js` (97K) — IR SDK 设备指纹
- `load.min.js` (36K) — SDK加载器

### 实证依据
- 流量捕获确认所有加密参数（cb/data.d/p/f/ext/ir.d）均由前端JS生成
- SDK初始化：`initNECaptcha({captchaId, width, element}, callback)`
- captchaId (jigsaw) = `5a0e2d04ffa44caba3f740e6a8b0fa84`
- SDK运行在iframe `NECaptchaSafeWindow`中

### 补环境方案
- **不纯算还原**，通过Node.js补浏览器环境执行原始JS
- Mock浏览器API：window/document/navigator/canvas/WebGL/XMLHttpRequest等
- Hook网络层拦截SDK生成的加密参数
- Python通过child_process调用Node.js获取加密结果

## 4. 验证码识别

- **类型**: 滑块拼图（jigsaw）
- **默认识别方案**: 本地 `ddddocr.slide_match`
- **输入**: slide_image(bytes) + background_image(bytes)
- **返回**: 缺口最左边缘 `target_x`
- **云码兜底**: 可选，需设置 `DUN_ALLOW_YUNMA=1` 和 `YUNMA_TOKEN`

## 5. 实现方案

### 文件结构
```
sites/dun_163_com/src/
├── main.py          # Python协议请求主脚本
├── signer.js        # Node.js补环境+加密参数生成
└── env/
    └── browser.js   # 浏览器环境模拟
```

### 执行流程
1. Python: GET getconf → 获取dt/zoneId/ir配置
2. Node.js: 加载IR SDK → 生成ir.d → Python: POST IR上报 → 获取irToken
3. Python: GET get（带fp/cb/irToken）→ 获取bg/front图片URL + token
4. Python: 下载bg/front图片 → 本地 ddddocr 识别 → 获取缺口x坐标
5. Node.js: 加载core JS → 生成cb + data(d/p/f/ext) → 返回Python
6. Python: GET check → 获取validate结果

### 技术选型
- Python 3.10 + requests（HTTP请求）
- Node.js 20（补环境执行JS）
- child_process（Python调用Node.js）
- ddddocr（默认本地验证码识别）
- 云码API（可选兜底）

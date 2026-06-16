# SpiderDemo 逆向工程项目

> 目标站点: [spiderdemo.cn](https://spiderdemo.cn) — 反爬虫练习平台
>
> 本目录包含针对 SpiderDemo 平台多个反爬挑战的完整逆向分析与自动化求解脚本。

---

## 目录结构

```
sites/spiderdemo/
├── README.md                 # 本说明文档
├── docs/                     # 文档
│   ├── api.md                # 通用 API 接口文档（注册/登录/初始化/提交）
│   ├── crypto.md             # OB Challenge1 加密分析文档（MD5 + salt）
│   └── plan.md               # OB Challenge1 逆向执行方案
├── src/                      # 核心求解脚本
│   ├── signer.py             # OB Challenge1 - MD5 签名生成模块
│   ├── main.py               # OB Challenge1 - 协议请求主脚本
│   ├── wasm_solver.py        # WASM Challenge - Node.js + WASM 求解器
│   ├── wasm_assets/          # WASM 相关资源（wasm文件、JS glue、Node.js solver）
│   ├── font_anti_solver.py   # 字体反爬虫 Challenge - fontTools + PIL 识别
│   └── font_solver_v3.py     # 字体反爬虫 v3 - glyph 指纹匹配方案
├── tests/                    # 测试与探索脚本
│   ├── test_finger_v2.py     # 字体指纹特征唯一性验证
│   └── test_font_features.py # 跨页面 glyph 指纹一致性测试
└── screenshots/              # 验证码与页面截图
```

---

## 已完成的挑战

### 1. OB Challenge1 — MD5 签名逆向

| 项目 | 内容 |
|------|------|
| **URL** | `https://spiderdemo.cn/ob/ob_challenge1/` |
| **任务** | 采集100页全部数字，计算加和并提交 |
| **核心难点** | 每页请求需要 `sign` 签名，混淆函数 `hex_md5` 在标准 MD5 基础上追加固定 salt |
| **技术方案** | 浏览器 Hook `hex_md5` 提取 salt → Python `hashlib.md5` 纯算复现 |
| **最终答案** | `5546823` |
| **核心文件** | `src/main.py`、`src/signer.py` |

**sign 生成**:
```python
salt = b"\xa3\xac\xa1\xa3fdjf,jkgfkl"
sign = hashlib.md5(f"{timestamp}{page}".encode() + salt).hexdigest()
```

**运行方式**:
```powershell
cd sites/spiderdemo/src
python main.py
```

---

### 2. WASM Challenge — WASM 加密模块本地执行

| 项目 | 内容 |
|------|------|
| **URL** | `https://spiderdemo.cn/sec1/wasm_challenge/` |
| **任务** | 采集100页数字，计算加和并提交 |
| **核心难点** | 页面有反调试保护（`anti_automation.js`），请求需 `wasm_auth` 签名 |
| **技术方案** | Node.js 本地加载 `wasm_anti_bg.wasm`，调用 `encrypt_simple()` 生成签名，绕过浏览器反调试 |
| **核心文件** | `src/wasm_solver.py`、`src/wasm_assets/wasm_solver.mjs` |

**关键突破**: WASM 挑战的核心是脱离浏览器环境，直接用 Node.js 执行 WASM 模块生成签名，完全避开反调试检测。

**运行方式**:
```powershell
cd sites/spiderdemo/src
python wasm_solver.py
```

---

### 3. 字体反爬虫 Challenge — WOFF2 字体映射还原

| 项目 | 内容 |
|------|------|
| **URL** | `https://spiderdemo.cn/font_anti/` |
| **任务** | 采集100页混淆数字，解码后求和提交 |
| **核心难点** | 每页使用独立 WOFF2 字体，字符 glyph 映射到不同视觉数字 |
| **技术方案** | `fontTools` 解析 cmap/glyf 表 → glyph 指纹 (nc, w, h) 匹配 → PIL 渲染 + 模板匹配 |
| **核心文件** | `src/font_anti_solver.py`（主解算器）、`src/font_solver_v3.py`（指纹匹配版） |

**核心原理**:
1. 第1页 init API 返回真实数字 + page API 返回混淆字符 → 推导字符映射
2. 提取字体中每个字符 (0-9) 对应 glyph 的几何特征 (轮廓数、宽高) 作为指纹
3. 后续页面直接用 glyph 指纹匹配解码，无需每次重新渲染

---

### 4. CSS1 Challenge — CSS 偏移反爬

| 项目 | 内容 |
|------|------|
| **URL** | `https://spiderdemo.cn/css_anti/CSS1_challenge/` |
| **任务** | 采集100页数字，计算加和并提交 |
| **核心难点** | 数字通过 CSS `position:relative;left/right` + `calc()` 表达式打乱字符视觉顺序，源码文本顺序 ≠ 视觉顺序 |
| **技术方案** | 浏览器 DOM 渲染 + `getBoundingClientRect()` 获取每个字符的真实视觉位置，按 x 坐标排序还原 |
| **工具链** | AdsPower 指纹浏览器（绕过反检测）+ evaluate-script 批量 API 调用 |
| **最终答案** | `5402828` |

**核心原理**:
- API 返回 `display_html` 含 `<style>` 块定义 CSS 偏移变量
- 偏移值 = 15px/30px/45px（`3*5px`、`2*3*5px`、`3*3*5px` 的倍数）
- 字符按 `base_pos * char_width ± offset` 排序得到视觉顺序

---

## 通用认证流程

所有挑战需要登录后获取 `sessionid` Cookie:

```
POST /admin_I/api/auth/register
{
    "username": "...",
    "email": "...@...",
    "password": "...",
    "confirmPassword": "..."
}
→ 成功后自动设置 sessionid Cookie，并返回登录态
```

## 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| 请求 | Python `requests` | HTTP API 调用 |
| 并发 | `ThreadPoolExecutor` | 100页数据并行采集 |
| 加密 | `hashlib` (MD5) / WASM / AES / RSA | 签名生成与加密 |
| 字体 | `fontTools` (TTFont) + `PIL` | WOFF2 字体解析、glyph 渲染匹配 |
| 浏览器 | AdsPower 指纹浏览器 + MCP | 反检测页面访问、动态渲染、Cookie 获取 |
| Node.js | Node.js 22.x | WASM 模块本地加载与执行 |

## 关键经验

1. **反调试绕过**: WASM 和 CSS 挑战页面有强反检测，优先使用 AdsPower 指纹浏览器，或完全脱离浏览器（WASM 本地执行）
2. **动态 Hook 为先**: 所有加密参数必须通过浏览器动态 Hook 实证提取，不可静态猜测
3. **纯算优先**: 能用 Python 本地复现的（MD5+ salt），避免依赖浏览器，提升效率和稳定性
4. **指纹一致性**: 字体反爬的 glyph 几何特征跨页面一致，只需第1页推导参考指纹，后续页面直接匹配

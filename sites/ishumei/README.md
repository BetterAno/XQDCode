# 数美科技 (ishumei) 滑块验证码 - 协议逆向

纯 Python 协议请求实现，无浏览器自动化依赖。

## 环境要求

- Python 3.10+
- 依赖: `requests`, `pycryptodome`, `Pillow`

```bash
# 使用项目虚拟环境
./venv/Scripts/pip install requests pycryptodome
```

## 使用方法

### 直接运行

```bash
./venv/Scripts/python.exe sites/ishumei/src/solver.py
```

### 作为模块调用

```python
from solver import solve

result = solve()
# result = {
#   "risk_level": "PASS" | "REJECT",
#   "rid": "...",
#   "gap_x": 268,
#   "pass": True | False
# }
```

### 仅使用加密模块

```python
from des_encrypt import encrypt_param, KEYS

# 加密滑块偏移比例
wi = encrypt_param(0.4467, KEYS['wi'])

# 加密鼠标轨迹
trajectory = [[10.5, -1.2, 100], [25.3, 0.8, 200]]
gq = encrypt_param(trajectory, KEYS['gq'])
```

### 仅使用云码识别

```python
from ym_captcha import recognize_slide_gap

x = recognize_slide_gap(
    "https://castatic.fengkongcloud.cn/crb/.../bg.jpg",
    "https://castatic.fengkongcloud.cn/crb/.../fg.png"
)
# x = 268 (缺口在背景图上的x坐标)
```

## 文件结构

```
sites/ishumei/
├── README.md               # 本文档
├── src/
│   ├── solver.py           # 主求解脚本 (完整流程)
│   ├── des_encrypt.py      # DES-ECB 加密模块
│   ├── mouse_sim.py        # 鼠标轨迹模拟
│   └── ym_captcha.py       # 云码验证码识别
└── docs/
    └── api.md              # 接口分析文档
```

## 技术要点

### 加密方式

DES-ECB + 零填充 + Base64，12 个参数各用独立固定 8 字节密钥：

| 参数 | 明文 | DES密钥 |
|------|------|---------|
| `wi` | mouseEndX / trueWidth | `363f9192` |
| `gq` | 鼠标轨迹 `[[x,y,t],...]` | `ffd9ef14` |
| `vs` | 拖动耗时 (ms) | `80fefdd1` |
| `lx` | CSS宽度 (300) | `61ad6eff` |
| `es` | CSS高度 (150) | `620302a1` |
| `jq` | 控制台检测 (0) | `118c4021` |
| `zm` | 机器人检测 (0) | `da718702` |
| `tx` | 固定 -1 | `786ef59e` |
| `ww` | appId ("default") | `36937571` |
| `bb` | channel ("default") | `bd7d3fb7` |
| `vj` | lang ("zh-cn") | `b7cdc6b2` |
| `hq` | 安全参数 ("10") | `42ccd3c8` |

### 请求流程

```
conf → register → 云码识别缺口 → 轨迹模拟+加密 → fverify → 结果
```

### 验证码识别

使用云码 (jfbym.com) 双图识别 API，传入背景图和滑块前景图的 base64，返回缺口 x 坐标。

## 配置项

在 `solver.py` 头部修改：

- `ORGANIZATION` — 组织标识（从目标页面获取）
- `YM_TOKEN` — 云码 token（在 `ym_captcha.py` 中）
- `CSS_WIDTH` / `CSS_HEIGHT` — 验证码渲染尺寸

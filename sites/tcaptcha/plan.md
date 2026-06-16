# TCaptcha 腾讯滑块验证码 — 纯协议还原方案

> 状态：**已完成** ✅
> 创建：2026-05-26
> 完成：2026-05-26

## 1. 目标

独立解决腾讯滑块验证码 (TCaptcha)，输入 `app_id`，输出 `ticket` + `randstr`，可嵌入任意站点的登录流程。

## 2. TCaptcha 接口链

| 步骤 | 接口 | Method | 说明 |
|------|------|--------|------|
| ① 预加载 | `turing.captcha.qcloud.com/cap_union_prehandle` | GET | 初始化，获取 TCaptcha JS 配置 |
| ② 获取会话 | `turing.captcha.qcloud.com/cap_union_new_getsig` | POST | 获取 sess + 图片 hash |
| ③ 下载图片 | `turing.captcha.qcloud.com/cap_union_new_getcapbysig?img_index=0&image={hash}&sess={sess}` | GET | 背景图 (img_index=0) |
|  | `同上?img_index=1&...` | GET | 滑块图 (img_index=1) |
| ④ 提交验证 | `turing.captcha.qcloud.com/cap_union_new_verify` | POST | 提交滑块答案，返回 ticket+randstr |

## 3. ④ Verify 请求参数结构

```
collect   = TDC.getData()        ← 环境指纹 + 轨迹 (Node.js补环境生成)
tlg       = len(collect)         ← 轨迹长度
eks       = getKeyInfo()         ← 加密密钥交换
sess      = {getsig返回的sess}
ans       = [{"elem_id":1,"type":"DynAnswerType_POS","data":"{x},{y}"}]
pow_answer= "{nonce}{hash}"      ← 工作量证明
pow_calc_time = {ms}             ← POW耗时
vData     = getVData(...)        ← 额外验证 (可能不需要)
```

## 4. 实现架构

```
              Python 主控 (tcaptcha_solver.py)
                   │
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
┌─────────┐  ┌──────────┐  ┌──────────┐
│ Node.js │  │ 云码 API │  │ 轨迹生成 │
│ 补环境  │  │ 滑块识别 │  │          │
│collect  │  │          │  │trajectory│
│eks/pow  │  │ → x坐标  │  │   .py    │
│  .js    │  │          │  │          │
└─────────┘  └──────────┘  └──────────┘
```

**输入**：`app_id=2044348370`
**输出**：`{ticket, randstr}`

## 5. 文件结构

```
sites/tcaptcha/
├── plan.md
├── src/
│   ├── tcaptcha_solver.py       # Python 主控，暴露 solve(app_id) → {ticket, randstr}
│   ├── yunma_solver.py          # 云码打码封装
│   ├── trajectory.py            # 轨迹模拟生成
│   └── env/
│       ├── tcaptcha_env.js      # Node.js 补环境入口
│       ├── dom_shim.js          # DOM/BOM 补丁
│       └── tdc_loader.js        # TDC SDK 加载
└── assets/
    └── js/tcaptcha/             # TCaptcha JS 文件 (已下载)
```

## 6. 关键模块说明

### 6.1 Node.js 补环境 (`env/tcaptcha_env.js`)
- 加载 `tdc.js` + `dy-jy3.js` + `dy-ele.js`
- 补 `navigator`、`screen`、`Canvas`、`WebGL`、`document` 等
- 暴露两个函数：
  - `initCaptcha(appId)` → `{sess, imageHash, bgImg, slideImg}`
  - `getVerifyParams(sess, ansX, ansY, trajectory)` → `{collect, tlg, eks, pow_answer, pow_calc_time}`

### 6.2 云码识别 (`yunma_solver.py`)
- 下载两张图片 → base64 → POST 云码 → 返回 x 坐标
- 处理图片缩放比例映射

### 6.3 轨迹生成 (`trajectory.py`)
- 输入：目标 x 坐标
- 输出：符合人类操作特征的轨迹数组
- 五段式：慢启动 → 加速 → 匀速 → 减速逼近 → 微调释放

### 6.4 主控 (`tcaptcha_solver.py`)
```python
def solve(app_id: str) -> dict:
    # 1. Node.js 初始化 → 获取 sess + 图片
    # 2. 云码识别 → 获取 x 坐标
    # 3. 轨迹生成 → 获取 trajectory
    # 4. Node.js 生成 verify 参数
    # 5. POST verify → 获取 ticket + randstr
    return {"ticket": "...", "randstr": "..."}
```

## 7. 风险与对策

| 风险 | 对策 |
|------|------|
| `collect` 数据不完全被服务端接受 | 首次从真实浏览器 Hook 一份 valid collect，分析可变字段后模板化 |
| `pow_answer` 算法复杂 | 从 `dy-ele.js`/`dy-jy3.js` 抽 workload 计算函数到独立 JS 模块 |
| 云码返回坐标不准 | 多次打码取平均，加微调重试 |
| 固定指纹被风控 | Canvas/WebGL/Audio 指纹加随机噪声 |

## 8. 进度追踪

- [x] 用户确认方案
- [x] 创建文件目录结构
- [x] `env/tcaptcha_env.js` — Node.js 补环境
- [x] `yunma_solver.py` — 云码打码封装
- [x] `trajectory.py` — 轨迹模拟生成
- [x] `tcaptcha_solver.py` — Python 主控 (jsdom版)
- [x] `tcaptcha_solver_iv8.py` — iv8 版 (废弃: collect太小)
- [x] `tcaptcha_solver_hybrid.py` — 混合方案 (浏览器TDC + Python)
- [x] **联调验证 — 成功输出有效 ticket + randstr** ✅

## 9. 最终方案总结

### 架构
```
Python (协议层)               浏览器 (指纹层)
─────────────────           ─────────────────
prehandle → sess,tdc        localhost:8765
getsig → sess               
下载图片 → 云码 → x坐标      fetch+eval tdc.js
生成轨迹 → JS注入脚本        注入MouseEvent轨迹
POW求解                      TDC.getData() → collect
                             TDC.getInfo() → eks
POST verify ←────────────────┘
         ↓
    ticket + randstr ✅
```

### 工作文件
| 文件 | 用途 |
|------|------|
| `tcaptcha_solver_hybrid.py` | 主控: Python API调用 + 浏览器注入脚本生成 |
| `yunma_solver.py` | 云码打码: 雪碧图裁切 + API调用 |
| `trajectory.py` | 轨迹生成: 五段式人类轨迹模拟 |
| `env/tcaptcha_env.js` | Node.js补环境 (备用, 用于纯本地轨迹编码) |
| `assets/real_collect_binary.bin` | 真实浏览器指纹模板 (1332B) |
| `assets/current_tdc.js` | 当前会话 tdc.js (由Python动态下载) |

### 已验证结果
- app_id: `2044348370`
- ticket: `tr03vybSVzq7iv1ySgpe0Sss1zNdkTUggHKyvay3tAHZecCogVbw8zdNgmFGookLheTMtXisTGk2kPy6XStbgPCohIzUxzhJm9qUmPLcBi8U4fpm4g1uFOMPKdOjzz_xy9pX`
- randstr: `@Thz`
- 核心发现: TDC Chaos VM 必须运行在真实 Chrome 中才能产生足够大的环境指纹 (1332B)，jsdom/iv8 均无法替代

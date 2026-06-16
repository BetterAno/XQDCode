# rednote.com 协议逆向（CDP 桥方案）

> 动态调试工具链：**AdsPower（ads）** CDP
> 当前方案：**CDP 桥** —— 通过真实浏览器内部 axios 客户端执行业务 API，服务端签名（X-s / X-t / X-S-Common 等）由浏览器自动生成

## 目标接口

- `GET  /api/sns/web/v2/user/me` — 登录用户资料
- `POST /api/sns/web/v1/homefeed` — 首页推荐列表（`category=homefeed_recommend`）
- `POST /api/sns/web/v1/feed` — 笔记详情（`xsec_source=pc_feed`）
- `POST /api/sns/web/v1/note/metrics_report` — 浏览行为上报

## 快速开始

```powershell
cd sites\rednote
pip install -r requirements.txt

# 确保 AdsPower profile 已登录 rednote.com, 当前 tab 在 /explore
python src\user_report.py
# 依次输入 CDP 端口、笔记 URL、次数、间隔
```

冒烟验证：
```powershell
python src\main.py --cdp-port 61559 --detail 3
# 预期: 3 篇笔记的 feed + metrics_report 全部 code=0 msg='成功'
```

## 关键文档

- **[USAGE.md](USAGE.md) — 使用指南（架构 / 环境 / 三脚本 / 故障排查）**
- [docs/api.md](docs/api.md) — 接口和 header 字段
- [docs/notes.md](docs/notes.md) — 调试留痕（历史参考）

## 核心组件

- [src/cdp_bridge.py](src/cdp_bridge.py) — ✅ CDP 桥核心（MiniWS + webpack 注入 + `Runtime.evaluate`）
- [src/main.py](src/main.py) — 主流程（userMe → homefeed → feed → metrics_report）
- [src/user_report.py](src/user_report.py) — 交互式循环上报（最常用）
- [src/loop_report.py](src/loop_report.py) — 无人值守循环
- [tests/cdp_cookies.py](tests/cdp_cookies.py) — MiniWS 手工 WebSocket（复用给 cdp_bridge）
- [src/signer.js](src/signer.js) — ⚠️ 已废弃（服务端升级签名体系后不可用）

## 目录

```
rednote/
├── README.md          本文件
├── USAGE.md           使用指南
├── requirements.txt   Python 依赖
├── src/               核心代码（main / user_report / loop_report / cdp_bridge）
├── tests/             cdp_cookies（MiniWS）
├── docs/              api / notes
└── assets/            调试产物
```

## 关键约束

- **来源必须是"首页推荐"**：`category=homefeed_recommend` + `xsec_source=pc_feed` + 每轮先 `homefeed`
- **AdsPower profile 需已登录且当前 tab 在 rednote.com**
- **无需 Node.js**（旧 `signer.js` 路线已废弃）

# rednote 使用指南（CDP 桥架构）

> 版本：2026-05 · CDP 桥方案
> 历史方案（本地 `signer.js` + `curl_cffi`）已废弃，服务端升级签名体系（新增 `X-S-Common` 等）后，本地纯算签名已无法通过。

---

## 0. 架构一览

```
┌──────────────────────┐    CDP WebSocket     ┌─────────────────────────┐
│  Python 脚本          │ ─────────────────▶  │  AdsPower 浏览器 profile │
│  (main/user_report)   │  Runtime.evaluate   │  - 已登录 rednote.com    │
│                       │                     │  - 当前 tab 是 /explore  │
│  cdp_bridge.py        │ ◀─────────────────  │  - 内部 axios 自动签名   │
│  (MiniWS + inject JS) │     JSON 结果        │    X-s/X-t/X-S-Common    │
└──────────────────────┘                      └─────────────────────────┘
```

**核心思路**：不在 Python 本地做签名，而是通过 CDP 把请求注入到真实浏览器的 `axios` 业务客户端里执行。签名、TLS、Cookie、指纹全部由浏览器自动生成。

**来源约束**（服务端强校验）：
- `fetch_homefeed` → `category: "homefeed_recommend"`（首页推荐）
- `fetch_feed_detail` → `xsec_source: "pc_feed"`（来自首页推荐的点击）
- 调用链必须保持 `homefeed → feed → metrics_report` 的浏览器原生顺序

---

## 1. 环境依赖

| 依赖 | 说明 |
| --- | --- |
| Windows 10/11 | 当前脚本用 PowerShell 示例 |
| Python ≥ 3.9（实测 3.13.5） | 无第三方硬依赖，用 `urllib` + 手工 WebSocket |
| AdsPower 客户端 | 需有一个已登录 rednote.com 的 profile |
| 可选：`curl_cffi>=0.15.0` | 仅 `user_report.py` 解析短链重定向时使用 |

安装依赖：

```powershell
cd e:\PythonCodeObject1\Qoder_ObjectProdemo2\sites\rednote
pip install -r requirements.txt
```

---

## 2. AdsPower profile 准备

1. 在 AdsPower 客户端新建/选择一个 profile，建议**养 3~7 天**（浏览过日常内容），降低冷画像软拒绝概率
2. 在 profile 里**手动登录** `https://www.rednote.com/explore`，确认能看到瀑布流
3. 启动时 AdsPower 会给一个 **CDP debug 端口**（例如 `61559`），记住它
4. **当前 tab 必须停在 `rednote.com` 的任一页面**（脚本会选择该 tab 注入桥）

> 获取端口的 3 种方法：
> - AdsPower 客户端界面顶部
> - `http://127.0.0.1:50325/api/v1/browser/active`（AdsPower Local API）
> - MCP 工具 `adspower-browser.get-opened-browser`

---

## 3. 最小文件集（跨机迁移只需这 5 个）

```
sites/rednote/
├── src/
│   ├── main.py          # 主流程 + 3 个业务入口
│   ├── user_report.py   # 交互式循环上报（命令行引导输入）
│   ├── loop_report.py   # 无人值守定时循环上报
│   └── cdp_bridge.py    # ✅ CDP 桥（核心，新方案）
└── tests/
    └── cdp_cookies.py   # MiniWS 手工 WebSocket 实现（被 cdp_bridge 复用）
```

**无需 Node.js**，`signer.js` 已废弃（仅作历史保留）。

---

## 4. 三个主脚本

### 4.1 `main.py` — 冒烟/一次性抓取

从首页推荐随机抓 N 篇笔记，拉详情并上报。

```powershell
cd sites\rednote
python src\main.py --cdp-port 61559 --detail 3
```

参数：
- `--cdp-port`：AdsPower CDP 端口（必须）
- `--detail`：拉取详情数量，默认 3
- `--cookie`：自定义 Cookie（可选，CDP 桥模式下通常不需要）

期望输出（节选）：
```
[0/4] 通过 CDP(61559) 拉取 ads 浏览器实时 cookie (含 HttpOnly) ...
    -> 14 cookies: ['web_session', 'id_token', 'a1', ...]
[1/4] 拉取登录用户 (user/me) ...
    -> viewer.user_id=69dd1a60...  nickname='风禾藏温柔'
[2/4] 拉取 homefeed ...
    -> got 8 items
[3/4] 拉取 3 篇笔记详情 + 同步上报 metrics_report ...
  ✓ feed   id=69f3aa45... type=normal user='...' title='...'
  ✓ report id=69f3aa45... note_type=1 -> code=0 msg='成功'
  ...
[4/4] done
```

### 4.2 `user_report.py` — 交互式循环上报（最常用）

对**指定笔记 URL** 进行 N 次「从首页推荐过去」的浏览上报。

```powershell
python src\user_report.py
```

脚本会依次提示：
1. CDP 端口（默认 61559）
2. 笔记 URL / 短链（支持 `xhslink.com`、`xiaohongshu.com`、`rednote.com`）
3. 上报次数（默认 100）
4. 每次间隔秒数（默认 1.0）

**PowerShell 一键投喂输入**（端口 61559、短链、10 次、间隔 1s）：

```powershell
"61559`nhttp://xhslink.com/o/A22KkFJu4EP`n10`n1`n" | python src\user_report.py
```

期望输出：
```
[check] 登录 OK: nickname='风禾藏温柔'  user_id=69dd1a60...
[note] id=69da60e9...  xsec_token=CBWcGHAl...
[note] homefeed 预热 OK: 8 items
[note] 拉 feed 详情 ...
[note] type=video(2) author='...' title='...'

[loop] 开始: 10 次, 间隔 1.0s, 每次先走 homefeed
------------------------------------------------------------
  [001/10] ✓ hf=8 stay=  1s -> code=0 msg='成功' (1679ms)
  [002/10] ✓ hf=8 stay=  2s -> code=0 msg='成功' (1938ms)
  ...
  [010/10] ✓ hf=8 stay= 10s -> code=0 msg='成功' (1593ms)
------------------------------------------------------------
[done] 成功 10/10  失败 0/10
```

每轮严格执行 `homefeed → feed → metrics_report`，保证来源路径合法。

### 4.3 `loop_report.py` — 无人值守循环

与 `user_report.py` 功能相似，但通过命令行参数一次性传入（适合 crontab / 计划任务）。具体参数见脚本头部注释或 `--help`。

---

## 5. CDP 桥对外接口（`cdp_bridge.py`）

如果想自己写调用方，可以直接 import：

```python
from cdp_bridge import call_bridge, set_cdp_port

set_cdp_port(61559)

# 所有 fn_name 可选值:
#   userMe          → /api/sns/web/v2/user/me
#   homefeed        → /api/sns/web/v1/homefeed
#   homefeedInitial → /api/sns/web/v1/homefeed/initial_load
#   feed            → /api/sns/web/v1/feed
#   metricsReport   → /api/sns/web/v1/note/metrics_report

j = call_bridge(61559, "userMe", {})
# → {"code": 0, "msg": "成功", "data": {"user_id": "...", "nickname": "..."}}

j = call_bridge(61559, "homefeed", {
    "cursor_score": "", "num": 8, "refresh_type": 1, "note_index": 0,
    "unread_begin_note_id": "", "unread_end_note_id": "", "unread_note_count": 0,
    "category": "homefeed_recommend", "search_key": "", "need_num": 8,
    "image_formats": ["jpg", "webp", "avif"], "need_filter_image": False,
})
items = (j.get("data") or {}).get("items") or []
```

返回格式统一：
- 成功：`{"code": 0, "msg": "成功", "data": <业务数据>}`
- 失败：`{"code": <biz_code>, "msg": <biz_msg>, "data": {}, "_bridge_err": {...}}`
- 字段全部 **snake_case**（桥内部已把 axios 返回的 camelCase 递归还原）

自测命令：
```powershell
python src\cdp_bridge.py 61559
```

---

## 6. 常见故障排查

| 症状 | 原因 | 解决 |
| --- | --- | --- |
| `no_webpack_chunk (current tab is not rednote.com?)` | 当前 tab 不在 rednote.com | 在 ads profile 里打开 `https://www.rednote.com/explore` |
| `rednote_api_module_not_found` | rednote 前端改版，webpack 模块结构变动 | 参考 `cdp_bridge.py` 里 `BRIDGE_BOOTSTRAP_JS` 的扫描条件调整 |
| `ws handshake failed` | CDP 端口错误 / profile 未启动 | 重新获取 CDP 端口 |
| `user/me failed: {'code': -100, ...}` | Cookie 失效（登录态过期） | 在 ads profile 里重新登录 rednote |
| `feed failed ... code=<非0>` 且 msg 含 `xsec_token` | token 过期 | 重新从 URL / homefeed 拿新 token |
| `homefeed` 返回 `items=[]` 但 `code=0` | 冷画像软拒绝 | 在浏览器里手动浏览几分钟积累画像；或换养好的 profile |
| 首次调用延迟 ~2s | 第一次注入 webpack 扫描 | 正常现象，后续调用仍要建 WS 但 bridge 已存在 |

---

## 7. 性能参考

单次 `homefeed + feed + metrics_report` 串行：**1.6 ~ 2.1 秒**

延迟主要来自每次新建 CDP WebSocket + `Runtime.evaluate`（每调用一次业务函数就一次 WS 建链）。

若要高频调用可考虑：
- 在 `cdp_bridge.py` 里做 WebSocket 连接复用（当前每次调用都 `pick_page_ws → MiniWS → close`）
- 将 3 个接口合并为一次 `Runtime.evaluate` 的 async 批处理

---

## 8. 文件一览

```
sites/rednote/
├── README.md            项目入口（本版本简要说明）
├── USAGE.md             本文件
├── requirements.txt     Python 依赖
├── src/
│   ├── main.py          主流程（CDP 桥）
│   ├── user_report.py   交互式循环上报
│   ├── loop_report.py   无人值守循环
│   ├── cdp_bridge.py    ✅ CDP 桥核心
│   └── signer.js        ⚠️ 已废弃，保留备查
├── tests/
│   └── cdp_cookies.py   MiniWS + CDP Cookie 拉取
├── docs/
│   ├── api.md           接口与 header 字段
│   └── notes.md         调试留痕（历史参考）
└── assets/              调试产物
```

---

## 9. 关键约束速查

- ✅ AdsPower profile **必须已登录 rednote.com** 且当前 tab 在站内
- ✅ `homefeed` 的 `category` 必须是 `"homefeed_recommend"`
- ✅ `feed` 的 `xsec_source` 必须是 `"pc_feed"`
- ✅ 每轮上报前必须先调 `homefeed`（保持浏览器原生行为链）
- ❌ 不要再引用 `signer.js` / `post_api` / `get_api`（已抛 `RuntimeError`）
- ❌ 不要跳过 `homefeed` 直接调 `feed` + `metrics_report`（会被软拒绝）

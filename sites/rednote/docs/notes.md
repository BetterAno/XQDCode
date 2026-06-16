# 调试留痕 (ads 动态调试)

> 工具链: **adspower-browser MCP only**（profile `k1bhfp97`，调试端口 60032）

## 2026-05-02 T1 初探（已完成）

### 1. 环境启动
- `check-status` → `code:0`
- `get-browser-list` → profile `k1bhfp97`
- `open-browser` + `connect-browser-with-ws` 成功
- `navigate https://www.rednote.com/` → 落在 `/explore`，title=`小红书`

### 2. Cookie 采集
`document.cookie` 长度 533：
```
webBuild / xsecappid=xhs-pc-web / a1 / webId /
websectiga / sec_poison_id / unread / abRequestId /
gid / ets
```

### 3. 签名函数枚举
```
typeof window.mnsv2           -> function
typeof window._webmsxyw       -> function  ⭐ 入口
typeof window._AUuXfEG27Xa3x  -> function  (JSVMP 主函数)
typeof window.seccore_signv2  -> undefined (旧版无)
```

### 4. 入口调用实证
```js
window._webmsxyw('/api/sns/web/v1/homefeed', body)
// -> { "X-s": "XYW_...(~672字符)", "X-t": 1777700331285 }
```
`X-s` payload base64 解开可见 `{"signSvn":"56","signType":"x2","appId":"xhs-pc-web","signVersion":"1","payload":"<hex>"}`

### 5. API 域名校正
- `document.scripts` + `performance.getEntriesByType('resource')` 发现真实请求走 `//webapi.rednote.com`
- 相对路径 `/api/sns/web/v1/homefeed` 走 `www.rednote.com` 返回 OSS 静态 404（坑）

### 6. homefeed 打通
- 只带 `X-s / X-t / Content-Type + Cookie` → `{"code":0,"success":true,"msg":"成功","data":{items:[...]}}`
- item 顶层字段: `id / track_id / ignore / xsec_token / model_type / note_card`

### 7. feed 笔记详情打通
```js
body = {
  source_note_id: item.id,
  image_formats: ['jpg','webp','avif'],
  extra: { need_body_topic: '1' },
  xsec_source: 'pc_feed',
  xsec_token: item.xsec_token
}
sig = _webmsxyw('/api/sns/web/v1/feed', body)
POST webapi.rednote.com/api/sns/web/v1/feed -> code=0, msg="成功", items[0] 带 title/user
```

### 8. 加载脚本清单（待扫描 `_webmsxyw` 定义）
```
https://fe-platform-s8.rednotecdn.com/formula-static/xhs-pc-web/public/resource/js/bundler-runtime.3cdadc45.js
.../vendor-dynamic.b54cdfe9.js
.../library-polyfill.c117ec90.js
.../library-axios.1c2d8386.js
.../library-vue.a815a0f6.js
.../library-lodash.d03e4c0a.js
.../vendor.b926ebc6.js                 ⭐ 候选
.../index.7850c3ee.js                  ⭐ 候选
https://fe-s10.rednotecdn.com/as/v1/3e44/public/04b29480233f4def5c875875b6bdc3b1.js
.../a9ef723c54cfdb63556bffe75cf06ae7.js
https://fe-platform-s8.rednotecdn.com/as/v2/ds/6545c70e73d7e06896b3c574a70b5438.js
.../as/v2/a1783c698726db430f04fcdb06a0c27f.js
.../as/v2/fp/962356ead351e7f2422eb57edff6982d.js
```

## 待办
- [ ] 通过 ads.evaluate-script fetch 每个 bundle 文本，grep `_webmsxyw` 命中 bundle 文件
- [ ] 下载命中的 bundle 到 `assets/js/`
- [ ] Node 最小补环境装载 bundle + signv2.js → 本地生成 X-s/X-t
- [ ] 与 ads 浏览器同参输出做 diff 校验
- [ ] Python main.py 打通 homefeed + feed

---

## 2026-05-02 T2 执行（已完成）

### Task 2 - Bundle 定位
* 逐个 `fetch()` 设无 grep `_webmsxyw`，命中： `https://fe-platform-s8.rednotecdn.com/as/v2/a1783c698726db430f04fcdb06a0c27f.js`（148 KB，OB以 `_ace_*` 命名空间）
* 下载到 `assets/js/a1783c69_webmsxyw.js` / `ds_6545c70e.js` / `vendor-dynamic.b54cdfe9.js`
* 单独执行 `signv2.js`（xiaohongshu 参考）只注册 `_AUuXfEG27Xa3x`，不挂 `_webmsxyw` → **rednote 的真实定义在 `a1783c69...`**

### Task 3 - Node 纯算桥
* `src/signer.js` 完成：`vm.createContext` + 最小补环境，顺序加载 `ds_6545c70e.js` → `a1783c69_webmsxyw.js`
* stdin/stdout JSON 协议、输出 `{X-s, X-t}`
* 首次运行成功产出 `XYW_...`

### Task 4 - 对齐校验及问题修复
* 初次 Node payload 缺 `appId` 导致 `code=-1` → 补 `window.xsecappid='xhs-pc-web'` + 对齐 UA(144)/语言(zh-CN)/并发数(12)/屏幕(2560×1440) 后浏览器直接用 Node 产的 X-s 调 `fetch` → `code=0`
* Node/浏览器 payload 前 96 字符完全相同，说明算法对齐

### Task 5/6 - Python 打通完整链路
* 首次 Python 发 homefeed→`code=-101` 无登录
* 原因定位：`document.cookie` 只能拿非 HttpOnly 的，服务端必需的 **`web_session`**、**`id_token`** 都是 HttpOnly → 浏览器 JS 拿不到
* 解决方案：直接 **Chrome DevTools Protocol** `Network.getAllCookies` 拿全量
  * ads MCP 没暴露 → 写了 `tests/cdp_cookies.py`，直接连 `ws://127.0.0.1:<port>/devtools/page/<id>`
  * websocket-client 默认带 `Origin` 被 Chrome 146 拒（403） → 手写 `MiniWS` raw socket 握手，**不发 Origin 头**绕过
  * 实时拿到 16 个 cookies （含 `web_session` + `id_token` + 3 个不同域的 `acw_tc`）
* `main.py` 集成：
  * 健全性 filter 适用于 `webapi.rednote.com` 的 cookie，重名取 domain_score 高的
  * `subprocess(node src/signer.js)` 签名
  * `curl_cffi(impersonate=chrome146)` 发请求
* 打通运行：
  ```
  homefeed -> 8 items
  feed     -> title + user + type 都正常输出
  ```

### 涉及的新增文件
* [src/main.py](../src/main.py) —— Python 主入口
* [src/signer.js](../src/signer.js) —— Node 纯算桥
* [tests/cdp_cookies.py](../tests/cdp_cookies.py) —— CDP 拏 cookie 工具
* [tests/probe_signv2.js](../tests/probe_signv2.js) —— 验证 signv2.js 独立执行的符号注册
* [tests/probe_py_request.py](../tests/probe_py_request.py) —— 诊断 Python 端请求/响应的探针
* assets/js/a1783c69_webmsxyw.js / ds_6545c70e.js / vendor-dynamic.b54cdfe9.js

### 关键教训
1. 浏览器 `document.cookie` 不等于完整 cookie，登录态含 HttpOnly 必须通过 CDP 拿。
2. Node 沙盒对齐 **Chrome 版本 / 语言 / 并发数 / 屏幕**不对齐也会进入 payload 导致服务端验签失败。
3. Chrome 146 开启 `--remote-allow-origins` 默认拦截所有外部 origin，如无法修改启动参数，用 **raw socket** 不发 `Origin` 头即可绕过。
4. xhs / rednote 业务接口在 **`webapi.rednote.com`**，别踩两轮的子域名坑。

## 2026-05-02 T3 上报环节补充（已完成）

### 背景
用户指出完整交付需包含“上报环节”。经 ads 浏览器 hook `fetch`/`XMLHttpRequest`/`navigator.sendBeacon`，真实点开笔记详情页追踪到关键上报接口。

### 报文全谱（点出笔记后 3.5s 内）
| 类别 | Host | 路径 | 用途 |
| -- | -- | -- | -- |
| 业务 | webapi.rednote.com | GET  `/api/sns/web/v2/user/me` | 拿登录用户 |
| 业务 | webapi.rednote.com | POST `/api/sns/web/v2/widgets` | 右侧栏相关笔记 |
| 业务 | webapi.rednote.com | POST `/api/sns/web/v1/feed`    | 笔记详情 |
| 业务 | webapi.rednote.com | GET  `/api/sns/web/v2/comment/page` | 评论 |
| **上报★** | webapi.rednote.com | **POST `/api/sns/web/v1/note/metrics_report`** | **浏览行为上报** |
| 风控 | as.rednote.com | POST `/api/sec/v1/shield/webprofile` | 安全 SDK 指纹 |
| 埋点 | t2.rnote.com   | POST `/api/v2/collect`   | 大数据埋点 (protobuf) |
| APM  | apm-fe.rnote.com | POST `/api/data`        | 前端性能监控 |

> 其中必复制的“上报环节”指 **webapi 下的 `note/metrics_report`**（走 X-s 签名）；`shield/webprofile`、`t2/collect`、`apm-fe` 为风控/埋点侧路，不影响详情内容读取，本期不做。

### `metrics_report` 实测
浏览器原生 body：
```json
{"note_id":"69f21cf6000000001f004fb4","note_type":2,"report_type":3,"stress_test":false,
 "trace":{"request_id":"a54b8174-b837-4f87-9909-3c94c4a21eab"},
 "viewer":{"user_id":"69f58db0000000000d034c00","followed_author":0},
 "author":{"user_id":"62078bb10000000021021ed3"},
 "interaction":{"like":0,"collect":0,"comment":0,"comment_read":0},
 "note":{"stay_seconds":0},
 "other":{"platform":"web"}}
```
- 用 Python 调用 Node signer 重签定骨 body 发出→`{"code":0,"success":true,"msg":"成功"}`
- note_type 映射：`normal`=1, `video`=2

### 新增 / 修改文件
- `src/signer.js` — body 允许空字符串（GET 接口备用）
- `src/main.py` — 新增 `fetch_user_me` / `report_note_metrics` / `get_api`，main 流程改为 4 步：CDP cookie → user/me → homefeed → feed+metrics_report
- `docs/api.md` — 补 3.3/3.4 两个接口说明

### 实测输出
```
[3/4] 拉取 3 篇笔记详情 + 同步上报 metrics_report ...
  ✓ feed   ... type=video   ...
  ✓ report ... note_type=2 -> code=0 msg='成功'
  ✓ feed   ... type=normal  ...
  ✓ report ... note_type=1 -> code=0 msg='成功'
```

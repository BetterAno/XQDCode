# rednote.com API 对接说明

## 1. Host

| 用途   | Host                               | 备注                                |
| ---- | ---------------------------------- | --------------------------------- |
| 页面   | https://www.rednote.com            | 静态资源 + JS bundle，走 TencentEdgeOne |
| 业务接口 | **https://webapi.rednote.com**     | 所有 `/api/sns/web/v1/*` 真实落在这里     |
| 静态资源 | https://fe-platform-s8.rednotecdn.com | 签名 bundle `as/v2/*.js` 在此托管       |

> ⚠️ 相对路径 fetch 会打到 www 回源 OSS，返回 404/NoSuchKey。必须写绝对 URL。

## 2. 公用签名 Header

| Header         | 来源               | 说明                                                    |
| -------------- | ---------------- | ----------------------------------------------------- |
| `X-s`          | `_webmsxyw` 返回   | `XYW_` + base64(JSON: `{signSvn,signType,appId,signVersion?,payload}`) |
| `X-t`          | `_webmsxyw` 返回   | 毫秒时间戳（字符串或数字皆可）                                       |
| `Content-Type` | 常量               | `application/json;charset=UTF-8`                     |
| `Cookie`       | ads CDP 实时拿      | **必须含 HttpOnly 的 `web_session` + `id_token`**，否则 `code=-101` |

> 实测：`X-S-Common` / `xy-common-params` 非必需；`appId=xhs-pc-web` 必须，`signVersion=1` 可缺失。

## 3. 接口清单

### 3.1 首页笔记流
```
POST https://webapi.rednote.com/api/sns/web/v1/homefeed
```
Request Body：
```json
{
  "cursor_score": "",
  "num": 8,
  "refresh_type": 1,
  "note_index": 0,
  "unread_begin_note_id": "",
  "unread_end_note_id": "",
  "unread_note_count": 0,
  "category": "homefeed_recommend",
  "search_key": "",
  "need_num": 8,
  "image_formats": ["jpg","webp","avif"],
  "need_filter_image": false
}
```
Response 顶层：
```json
{
  "code": 0,
  "success": true,
  "data": {
    "items": [
      {
        "id": "69f41c67000000001b02284f",
        "track_id": "2gbbchk03876...",
        "ignore": false,
        "xsec_token": "ABDM-VH4uX...",
        "model_type": "note",
        "note_card": {
          "display_title": "...",
          "user": {...},
          "type": "video" | "normal",
          ...
        }
      }
    ]
  }
}
```

### 3.2 笔记详情
```
POST https://webapi.rednote.com/api/sns/web/v1/feed
```
Request Body：
```json
{
  "source_note_id": "69f41c67000000001b02284f",
  "image_formats": ["jpg","webp","avif"],
  "extra": { "need_body_topic": "1" },
  "xsec_source": "pc_feed",
  "xsec_token": "ABDM-VH4uX..."
}
```
Response：`data.items[0].note_card` 含完整标题 / 正文 / 作者 / 图文 / 视频信息。

### 3.3 用户资料 (用于上报 viewer 取 user_id)
```
GET https://webapi.rednote.com/api/sns/web/v2/user/me
```
- 无 Body，签名时 `_webmsxyw(apiPath, '')` 传空字符串。
- Response：`data.user_id` / `data.nickname` / `data.red_id` / `data.guest`。
- 用途：作为后续 `metrics_report.viewer.user_id`。

### 3.4 笔记浏览行为上报★
```
POST https://webapi.rednote.com/api/sns/web/v1/note/metrics_report
```
> 打开笔记详情页不调用会导致服务端认为非正常浏览（影响推荐 / 阵人标记），**必做**。

Request Body：
```json
{
  "note_id": "69cf32af000000001a028504",
  "note_type": 2,              // 1=图文(normal), 2=视频(video)
  "report_type": 3,             // 浏览完成
  "stress_test": false,
  "trace": { "request_id": "<uuid>" },
  "viewer":   { "user_id": "<当前登录用户>", "followed_author": 0 },
  "author":   { "user_id": "<作者 user_id>" },
  "interaction": { "like": 0, "collect": 0, "comment": 0, "comment_read": 0 },
  "note":     { "stay_seconds": 0 },
  "other":    { "platform": "web" }
}
```
Response：`{"code":0,"success":true,"msg":"成功","data":{"success":true}}`

字段来源：
- `note_id` / `note_type` / `author.user_id` ← homefeed 或 feed 返回的 `note_card`
- `viewer.user_id` ← 3.3 `/user/me`
- `trace.request_id` ← 本地随机 UUID v4
- `interaction` / `note.stay_seconds` ← 模拟初始状态均置 0 即可

## 4. Server 侧错误码

| code  | 含义               | 触发条件                                               |
| ----- | ---------------- | -------------------------------------------------- |
| 0     | 成功               | —                                                  |
| -1    | 签名失败 / 参数非法      | `X-s` payload 结构不完整（比如缺 `appId`）、签名参数与 body 不匹配 |
| -101  | 无登录信息，或登录信息为空  | `Cookie` 缺少 `web_session` / `id_token` 等 HttpOnly |

## 5. 运行时 Cookie 组成

通过 ads 浏览器 CDP `Network.getAllCookies` 实时获取：

| Cookie         | HttpOnly | 说明                     |
| -------------- | -------- | ---------------------- |
| `webBuild`     | ✗        | 版本号 `6.7.0`            |
| `xsecappid`    | ✗        | 业务线 `xhs-pc-web`       |
| `a1`           | ✗        | 浏览器指纹 hash（打开首页时初始化）     |
| `webId`        | ✗        | 访客 ID                  |
| `web_session`  | **✓**    | **登录态核心**，document.cookie 拿不到 |
| `id_token`     | **✓**    | **身份令牌**，document.cookie 拿不到 |
| `websectiga`   | ✗        | 安全风控动态 token           |
| `sec_poison_id` | ✗       | 安全风控                   |
| `acw_tc`       | ✓        | 腾讯 EdgeOne CDN 层       |
| `loadts/ets/unread/abRequestId/gid` | ✗ | 埋点     |

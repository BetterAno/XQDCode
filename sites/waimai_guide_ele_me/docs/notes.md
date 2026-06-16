# 调试记录摘要

## 流量

- 路线：Route B，`js-reverse-mcp` 调试浏览器。
- 目标：`mtop.relationrecommend.elemetinyapprecommend.recommend`。
- Method：POST。
- Body：`application/x-www-form-urlencoded`，核心字段为 `data`。
- 新触发后捕获到多条 `status=200` 响应，包含 `SUCCESS::调用成功` 和推荐/搜索结果数据。

## Hook 证据

- `x_check`：
  - 调用形态：`window.x_check("", api)`。
  - api：`mtop.relationrecommend.elemetinyapprecommend.recommend`。
  - 返回值进入 header `x-ele-check`。
  - 调用栈来自 `eleme-miniapp-plugin-search/mor.v.c8cf73.js`。

- `etSign`：
  - 调用形态：`window.etSign(url)`。
  - 入参为已带 `sign` 的 URL。
  - 返回值进入 query `bx_et`。
  - 调用栈在 `@ali/pcom-ebridge` 的 `__requestJSON` 附近。

## 请求构造

- 搜索结果 appId 常见为 `26551`。
- 搜索中间页/热词场景可见 `22816`、`28820`。
- `x-ele-scene` 会随场景变化：`search`、`search_suggest`、`search_middle_page`。
- 翻页时 `page`、`offset`、`searchMode` 变化，`data` 变化后 `sign` 同步变化。

## 注意事项

- 断点停在 XHR 发送前会导致接口超过 `timeout=6000`，恢复后可能出现 `net::ERR_ABORTED`。
- 后续抓包建议使用不暂停的 Hook 或 Network 记录，避免干扰请求生命周期。
- `requests` 代码样本可用 `--requests-py` 离线解析；脚本只读取 `cookies`、`headers`、`params`、`data` 和 `requests.post` 的 URL 字面量，不执行代码。
- 用当前浏览器 Cookie 替换样本 Cookie 时，`_m_h5_tk` token 改变后必须重新计算 `sign`；旧 `t/sign/bx_et/x-ele-check` 通常不能跨 Cookie 或跨时间复用。

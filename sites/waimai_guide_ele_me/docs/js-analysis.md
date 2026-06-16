# 页面 JS 定位

## 结论

目标接口的逻辑分布在三层：

| 层级 | 本地文件 | 作用 |
|------|----------|------|
| 业务接口配置/请求包装 | `assets/js/mor.g.40cff3.js` | 定义 `mtop.relationrecommend.ElemeTinyAppRecommend.recommend`、`appId=26551`、`x-ele-scene=search`，并构造 mtop body |
| 搜索参数组装 | `assets/js/470.f09c09.js` | 从 URL/query/页面状态组装 `keyword`、`refer`、`page`、`offset`、`searchMode`、`searchEntryCode` 等 |
| mtop 中间件安全 header | `assets/js/mor.v.c8cf73.js` | 写入 `x-ele-check-client`、调用 `window.x_check("", api)` 生成 `x-ele-check`，拼 `x-ele-ua`，注入 `bx-umidtoken` |
| mtop 请求桥接 | `assets/js/pcom-ebridge-wap-api-0.9.48.js` | `__requestJSON` 发请求；当 `SV=5.0` 时调用 `window.etSign(url)` 并追加 `bx_et` |
| 安全 SDK 底层 | `assets/js/baxiaCommon-2.5.36.js`、`assets/js/awsc-et-f-1.83.41.js`、`assets/js/elecheck-*.js` | AWSC/Baxia/EleCheck 模块，涉及 `x5sec`、`bx_et`、`bx-umidtoken`、`x-ele-check` 的底层支撑 |

## 关键文件

### `mor.g.40cff3.js`

定位偏移：

- `ElemeTinyAppRecommend.recommend`：`35830`
- `26551:{...}`：`36790`
- `needEcodeSign`：`40707`
- `gatewayApiType`：`40887`
- `searchMtopRequest`：`42330`

作用：

- `y6Kz` 模块中定义目标 API：
  - Web/支付宝/淘宝/微信环境使用 `mtop.relationrecommend.ElemeTinyAppRecommend.recommend`
  - 其他环境 fallback 到 `mtop.relationrecommend.TinyAppRecommend.recommend`
- `appId=26551` 的配置对应搜索结果接口：
  - `exlogApiName: "tpp_mergeSearch_result"`
  - header/ext_header：`x-ele-scene: "search"`
- `PxK8` 模块里有统一请求函数：
  - method 固定为 `POST`
  - `needWua/isNeedWua/needEcodeSign/secType` 打开
  - body 包装为 `data={ type:"originaljson", appId, params: JSON.stringify(...) }`
  - `params` 内注入 `_input_charset`、`_output_charset`、`gatewayApiType:"mtop"`、`mtop_api_version:"1.0"`

### `470.f09c09.js`

定位偏移：

- `searchEntryCode`：`12350`
- `getSearchParams`：`40777`
- `asyncBasicSearch`：`76004`
- `searchMode`：`76058`
- `passSearchParam`：`81728`

作用：

- 负责搜索页面参数整合。
- `asyncBasicSearch(...)` 会带入：
  - `keyword`
  - `refer`
  - `searchMode`
  - `searchEntryCode`
  - `searchExtraParams`
  - `comprehensiveFilterList`
  - `fixSearch:"1"`
- 后续会合并 URL/query 中的：
  - `passSearchParam`
  - `channel_extra_params`
  - `search_extra_params`
  - `terminal/fromPage/topShop/forceShopIds`
- 这是解释同一个接口为什么会出现 `page=1/2/3`、`offset=5/10`、`searchMode=1/2` 的主要业务入口。

### `mor.v.c8cf73.js`

定位偏移：

- `bx-umidtoken`：`263409`
- `x-ele-check`：`264771`
- `x_check`：`264812`
- `x-ele-ua`：`265622`

作用：

- mtop middleware 层。
- 当 `jsv >= 2.7.1` 时切换到 `SV=5.0`。
- 设置：
  - `x-ele-check-client: ele`
  - `x-ele-check: window.x_check("", api.toLowerCase())`
  - `x-ele-ua`
  - `bx-umidtoken`

### `pcom-ebridge-wap-api-0.9.48.js`

定位偏移：

- `etSign`：`236170`
- `__requestJSON`：`249092`
- `bx_et`：`249687`

作用：

- mtop H5 请求桥。
- `__requestJSON` 使用 XHR 发送请求。
- `SV=5.0` 且存在 `window.etSign` 时，会对最终 URL 调用 `window.etSign(url)`，并把结果拼为 `&bx_et=...`。

### `baxiaCommon-2.5.36.js`

定位偏移：

- `x5sec`：`11324`
- `bx-umidtoken`：`26271`
- `NC_PARAM_ET`：`26370`
- `addParamToRequest`：`26877`

作用：

- Baxia/AWSC 通用风控层。
- 负责处理 `x5sec` 相关存取、清理、请求重试和参数追加。
- 定义安全参数名：
  - `bx-umidtoken`
  - `bx-ua`
  - `bx_et`
  - `x-pipu2`

## 已拉取文件

```text
assets/js/
  422.1bbd82.js
  470.f09c09.js
  544.7f0f97.js
  awsc.js
  awsc-et-f-1.83.41.js
  baxiaCommon-2.5.36.js
  baxia-entry-index.js
  elecheck-cl-1.1.7.js
  elecheck-cl-babel-1.1.7.js
  elecheck-cl-legacy-1.1.7.js
  elecheck-cl-loader-1.1.7.js
  elecheck-cl-polyfill-1.1.7.js
  elecheck-cl-vendor-1.1.7.js
  mor.g.40cff3.js
  mor.v.c8cf73.js
  pcom-ebridge-index-0.9.48.js
  pcom-ebridge-wap-api-0.9.48.js
```

## 阅读顺序建议

1. `mor.g.40cff3.js`：先看 API 名、appId、body 包装和请求入口。
2. `470.f09c09.js`：再看业务参数如何从页面状态组装。
3. `mor.v.c8cf73.js`：确认 `x-ele-check/x-ele-ua/bx-umidtoken` 注入。
4. `pcom-ebridge-wap-api-0.9.48.js`：看最终 XHR 和 `bx_et` 拼接。
5. `baxiaCommon-2.5.36.js` / `elecheck-*`：只在需要继续追安全 SDK 来源时再看。

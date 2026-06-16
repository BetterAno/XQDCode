# 接口文档

## Endpoint

```text
POST https://waimai-guide.ele.me/h5/mtop.relationrecommend.elemetinyapprecommend.recommend/1.0/5.0/
```

## Query

| 字段 | 示例/说明 |
|------|-----------|
| `jsv` | `2.7.5` |
| `appKey` | `12574478` |
| `t` | 毫秒时间戳 |
| `sign` | mtop sign |
| `api` | `mtop.relationrecommend.ElemeTinyAppRecommend.recommend` |
| `v` | `1.0` |
| `type` | `originaljson` |
| `dataType` | `json` |
| `timeout` | `6000` |
| `mainDomain` | `ele.me` |
| `subDomain` | `waimai-guide` |
| `H5Request` | `true` |
| `ttid` | `h5@chrome_pc_148.0.0.0` |
| `SV` | `5.0` |
| `EtRequest` | `true` |
| `syncCookieMode` | `true` |
| `pageDomain` | `ele.me` |
| `bx_et` | `window.etSign(url)` 生成 |

## Headers

| 字段 | 说明 |
|------|------|
| `Accept` | `application/json` |
| `Content-type` | `application/x-www-form-urlencoded` |
| `x-ele-scene` | 搜索场景，如 `search`、`search_suggest`、`search_middle_page` |
| `x-ele-ua` | H5/MiniApp 环境 UA |
| `x-decode-ua` | 样本为 `false` |
| `bx-umidtoken` | AWSC/umid token |
| `x-secext-city` | 样本为 `-1` |
| `x-ele-check-client` | 样本为 `ele` |
| `x-ele-check` | `window.x_check("", api)` 生成 |
| `Cookie` | `_m_h5_tk`、`_m_h5_tk_enc`、`x5sec` 等 |

## Body

Content-Type 为 form：

```text
data={outer-json}
```

`outer-json` 结构：

```json
{
  "type": "originaljson",
  "appId": "26551",
  "params": "{\"_input_charset\":\"UTF-8\",\"_output_charset\":\"UTF-8\",\"gatewayApiType\":\"mtop\",\"mtop_api_version\":\"1.0\",\"appId\":\"26551\"}"
}
```

常见 `params` 字段：

| 字段 | 说明 |
|------|------|
| `gatewayApiType` | `mtop` |
| `mtop_api_version` | `1.0` |
| `appId` | 结果页常见 `26551`，中间页/热词也可能出现 `22816`、`28820` |
| `x-ele-scene` | 搜索场景 |
| `channelCode` | 样本为 `0` |
| `platform` | 样本为 `999` |
| `sversion` | 样本为 `15.0` |
| `keyword` | 搜索词 |
| `refer` | 来源，如 `搜索发现热词` |
| `page` | 页码 |
| `offset` | 翻页 offset |
| `limit` / `n` | 数量 |
| `searchMode` | 搜索模式 |
| `searchEntryCode` | 入口编码 |

## Response

成功响应包含：

```json
{
  "api": "mtop.relationrecommend.elemetinyapprecommend.recommend",
  "data": {
    "result": []
  },
  "ret": ["SUCCESS::调用成功"],
  "traceId": "...",
  "v": "1.0"
}
```

结果数据可能是商品/店铺卡片，也可能是中间页、历史搜索、热词等模块。

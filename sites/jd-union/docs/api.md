# API 接口文档

## 业务接口

### GET `api.m.jd.com/api` — 商品推荐列表

**Query 参数:**

| 参数 | 值 | 说明 |
|------|-----|------|
| `functionId` | `unionSearchRecommend` | 接口功能 ID |
| `appid` | `unionpc` | 应用 ID |
| `_` | `1779775867005` | 时间戳 ms |
| `loginType` | `3` | 登录类型 |
| `uuid` | `17797091304821226170515` | 用户标识 (来自 `__jda` cookie) |
| `x-api-eid-token` | `jdd03WRQ...` | 设备指纹 token |
| `h5st` | `20260526...` | **核心签名** |
| `body` | URL-encoded JSON | 业务参数 |

**body 解码:**
```json
{
  "funName": "getSkuByMaterialId",
  "page": {"pageNo": 1, "pageSize": 60},
  "param": {
    "materialId": 315,
    "secKillTimePeriod": 16,
    "seckillTimeType": 0,
    "requestScene": 0,
    "requestExtFields": ["shopInfo", "orientations"]
  },
  "clientPageId": "jingfen_pc"
}
```

**响应:** `{"code":200,"hasNext":true,"message":"success","result":{"goodsSynopsisList":[...]}}`

### GET `sso.jd.com/sso/rac` — Token 刷新

| 参数 | 说明 |
|------|------|
| `t` | 时间戳 |
| `r` | 随机串 |
| `s` | URL-encoded h5st 签名 |
| `ua` | User-Agent (URL-encoded) |

**响应:** `{"nfd":10}`

## 必需请求头

| 头 | 值 | 说明 |
|----|-----|------|
| `Cookie` | 完整 cookie 串 | 包含 __jda, 3AB9D23F7A4B3CSS, sdtoken 等 |
| `User-Agent` | Chrome 146 | 需与签名环境一致 |
| `Accept` | `application/json, text/plain, */*` | |
| `Referer` | `https://union.jd.com/` | |
| `Origin` | `https://union.jd.com` | |
| `x-referer-page` | `https://union.jd.com/proManager/index` | 业务页面来源 |
| `x-rp-client` | `h5_1.0.0` | 客户端标识 |

## Cookie 传递链
- `__jda` → 提取 uuid (第2段)
- `3AB9D23F7A4B3C9B` → 设备指纹
- `3AB9D23F7A4B3CSS` = `jdd03` + `3AB9D23F7A4B3C9B`值 + 后缀 → 同时用作 `x-api-eid-token`
- `sdtoken` → 服务端 token
- `__jdb`, `__jdc`, `__jdu`, `__jdv` → 跟踪 cookie
- `shshshfpa/b/px` → 设备指纹 cookie

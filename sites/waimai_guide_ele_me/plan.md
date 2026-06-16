# waimai-guide.ele.me 逆向执行方案

## 1. 接口信息

| 接口 | URL | Method | Content-Type |
|------|-----|--------|--------------|
| 推荐/搜索结果 | `https://waimai-guide.ele.me/h5/mtop.relationrecommend.elemetinyapprecommend.recommend/1.0/5.0/` | POST | `application/x-www-form-urlencoded` |

## 2. 请求参数

| 参数名 | 位置 | 说明 | 是否加密/动态 |
|--------|------|------|----------------|
| `jsv` | query | mtop JS 版本，当前样本为 `2.7.5` | 否 |
| `appKey` | query | mtop appKey，当前样本为 `12574478` | 否 |
| `t` | query | 毫秒时间戳 | 是，本地生成 |
| `sign` | query | mtop MD5 签名 | 是，本地生成 |
| `api` | query | `mtop.relationrecommend.ElemeTinyAppRecommend.recommend` | 否 |
| `SV` | query | 安全 SDK 版本/模式，样本为 `5.0` | 否 |
| `bx_et` | query | AWSC/ET 安全参数 | 是，本地安全 SDK 生成 |
| `x-ele-check` | header | Ele 安全校验 header | 是，本地安全 SDK 生成 |
| `x-ele-ua` | header | Ele H5 环境 UA | 是，本地拼装 |
| `bx-umidtoken` | header | AWSC/umid token | 是，本地读取/注入 |
| `data` | body | URL form 字段，值为 outer JSON | 部分字段动态 |

## 3. 加密方式（已有实证）

- `sign`：`md5(token + "&" + t + "&" + appKey + "&" + data)`
- `token`：来自服务端 Cookie `_m_h5_tk` 的 `_` 前缀部分。
- `data`：POST body 中 `data=` 解码后的原始 JSON 字符串。
- `bx_et`：Hook 捕获 `window.etSign(url)` 返回值，调用点在 `@ali/pcom-ebridge` 的 `__requestJSON`。
- `x-ele-check`：Hook 捕获 `window.x_check("", api)` 返回值，调用点在 `eleme-miniapp-plugin-search/mor.v.c8cf73.js`。
- `_m_h5_tk/_m_h5_tk_enc/x5sec`：服务端 Set-Cookie，本地读取携带。

## 4. 验证码

当前目标接口没有独立验证码流程；主要约束是 mtop Cookie 与 AWSC/Ele 安全参数链路。

## 5. 实现方案

- [x] Python 本地诊断脚本：解析 HAR/Hook JSON、提取参数、验证 mtop `sign`。
- [x] Node.js signer 插槽：实现 mtop MD5 sign 诊断，预留授权环境 provider。
- [ ] 如有正式授权测试环境：接入 provider 的 `etSign`、`xCheck`、`xEleUa`、`umidToken`。
- [ ] 如需真实发送请求：仅在授权环境内由 provider 补齐安全字段后执行。

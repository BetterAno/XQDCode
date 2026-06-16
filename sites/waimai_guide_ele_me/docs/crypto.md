# 动态参数构成

> 最新、最完整的字段来源、假值和替换说明见 `docs/dynamic-params.md`。本文保留早期定位结论，后续以 `dynamic-params.md` 为准。

## mtop sign

`sign` 是 mtop H5 标准签名：

```text
md5(token + "&" + t + "&" + appKey + "&" + data)
```

字段来源：

- `token`：Cookie `_m_h5_tk` 的 `_` 前缀部分。
- `t`：请求构造阶段生成的毫秒时间戳。
- `appKey`：当前接口样本为 `12574478`。
- `data`：POST body 中 `data=` 解码后的 outer JSON 原始字符串。

`src/main.py` 会在 HAR 或 Hook JSON 样本中提取这些字段并本地计算 `sign`，用于判断样本是否完整。

## bx_et

结论：本地 JS 安全 SDK 生成，不是接口响应返回。

证据：

- Hook 捕获到 `window.etSign(url)`。
- 入参是已经包含 `t/sign/api/appKey/data` 等信息的请求 URL。
- 返回值随后拼接到 query `bx_et=`。
- 调用栈显示在 `@ali/pcom-ebridge` 的 `__requestJSON` 中执行。

## x-ele-check

结论：本地 JS 安全 SDK 生成，不是接口响应返回。

证据：

- Hook 捕获到 `window.x_check("", api)`。
- 入参 api 为 `mtop.relationrecommend.elemetinyapprecommend.recommend`。
- 返回值写入 header `x-ele-check`。
- 调用栈显示来自 `eleme-miniapp-plugin-search/mor.v.c8cf73.js`。

## x-ele-ua

结论：本地前端/中间层拼装。

样本形态：

```text
RenderWay/H5 MiniAppId/... MiniAppVersion/... AppName/h5 MiniHostVersion/... H5Version/... channel/mobile subChannel/mobile.default
```

## bx-umidtoken

结论：本地读取或 AWSC/umid 回调注入，作为 header 发送。

它不是目标业务接口响应中的字段；通常需要和浏览器环境、Cookie、AWSC 初始化状态保持一致。

## _m_h5_tk / _m_h5_tk_enc / x5sec

结论：服务端 Set-Cookie，本地读取携带。

- `_m_h5_tk`：token 前缀参与 mtop `sign`。
- `_m_h5_tk_enc`：服务端校验用的配套 Cookie。
- `x5sec`：安全校验 Cookie，客户端只负责携带/清理/重试。

## 本地实现边界

当前仓库实现的是诊断链路：

- 可以验证 `sign` 构成。
- 可以解析 body/query/header/response。
- 可以解析 `requests` 风格的 Python 样本，但不会执行样本代码。
- 可以通过授权 provider 插槽接入自有测试环境的安全参数生成。
- 不内置饿了么生产安全 SDK 的 `bx_et` / `x-ele-check` / `x5sec` 复现逻辑。

## Cookie 替换影响

如果把样本 Cookie 替换成浏览器当前 Cookie，需要同步处理：

- `_m_h5_tk` token 变化后，`sign` 必须用新 token、原始 `data`、当前 `t` 重算。
- `bx_et` 是针对当前 URL 生成的，URL 里的 `t/sign/data` 变化后也需要授权 provider 重新生成。
- `x-ele-check` 与 api/环境态有关，不建议跨浏览器环境复用。
- `x5sec` 与服务端安全校验态绑定，旧值可能很快失效。

# 饿了么 Waimai Guide 动态参数说明

本文记录接口：

```text
https://waimai-guide.ele.me/h5/mtop.relationrecommend.elemetinyapprecommend.recommend/1.0/5.0/
```

当前项目只做授权离线诊断和参数形态对齐，不发送目标业务请求。报告里的安全 SDK 输出只保存状态、长度和短摘要，不保存可直接复用的真实安全值。

## 1. 当前验证状态

验证命令：

```powershell
node sites\waimai_guide_ele_me\src\run_local_diagnostics.js
```

当前结果：

| 项目 | 状态 | 说明 |
| --- | --- | --- |
| SDK 加载 | ok | 本地 9 个 SDK 文件全部可加载 |
| Node 特征检查 | ok | `nodeLeakKeys = []` |
| `t` | ok | 使用过期样本时间戳做离线校验 |
| `sign` | ok | 过期样本 `sign` 已精确命中 |
| `bx_et` | ok | 本地 SDK 可生成脱敏值，当前长度 `457` |
| 浏览器 `bx_et` 基线 | 参考 | 浏览器同接口样本长度 `469` |
| `__etModule.getETToken` | ok | 本地可生成脱敏值，当前长度 `457` |
| `x-ele-check` | ok | Elecheck ESM 探针可生成脱敏值，当前长度 `576` |
| `x-ele-ua` | ok | 本地诊断拼接值，不等同于真实 bridge 输出 |
| `bx-umidtoken` | ok | 默认使用假 token 占位 |

`bx_et` 目前还差浏览器基线 `12` 个字符：本地 `457`，浏览器 `469`。已排除普通静态字段、事件数量、`cna/xqkp` 内容对长度的主要影响；剩余差异更可能来自真实运行时安全状态，例如 ET 内部持久化状态、`tfstk`/服务端回写状态或真实页面生命周期。

## 2. 参数总览

| 字段 | 位置 | 类型 | 来源 | 本地状态 |
| --- | --- | --- | --- | --- |
| `t` | query | 动态请求时间戳 | 请求构造阶段 | 使用过期样本值模拟 |
| `sign` | query | 动态 mtop 签名 | 本地 MD5 计算 | 已命中过期样本 |
| `bx_et` | query | 动态安全 SDK 参数 | AWSC ET 的 `window.etSign(url)` | 可本地模拟，脱敏保存 |
| `x-ele-check` | header | 动态安全 SDK 参数 | Elecheck 的 `window.x_check("", api)` | 可本地模拟，脱敏保存 |
| `x-ele-ua` | header | 环境描述字符串 | H5/MiniApp bridge 层 | 当前是诊断拼接 |
| `bx-umidtoken` | header | 动态身份/安全 token | AWSC/WebUMID 或浏览器状态 | 默认是假值 |
| `_m_h5_tk` | cookie | 服务端下发 Cookie | `Set-Cookie` | 只使用过期前缀校验 `sign` |
| `_m_h5_tk_enc` | cookie | 服务端配套 Cookie | `Set-Cookie` | 本地不生成 |
| `x5sec` | cookie | 服务端安全 Cookie | 安全挑战/校验链路 | 本地不生成 |
| `xqkp` | cookie | UMID/安全 token 存储 | 浏览器安全运行时 | 默认是假值 |
| `tfstk` | cookie | SDK/服务端安全状态 | SDK 或服务端状态 | 默认是假高熵占位 |
| `cna` | cookie | 浏览器/会话标识 | 浏览器 Cookie | 默认是假值 |

## 3. `t`

`t` 是 mtop H5 请求时间戳，参与 `sign` 计算。

当前离线测试值：

```text
1779509212043
```

代码位置：

```text
src/sdk_local_simulation.js -> EXPIRED_SAMPLE.t
```

替换规则：

- 离线复核已抓取的过期包时，保持原始 `t` 不变。
- 构造新的授权诊断样本时，生成新的毫秒时间戳。
- 只要 `t` 改了，就必须重新计算 `sign`，并重新生成或重新捕获 `bx_et`。

## 4. `sign`

`sign` 是标准 mtop H5 签名：

```text
md5(token + "&" + t + "&" + appKey + "&" + data)
```

输入来源：

| 输入 | 来源 |
| --- | --- |
| `token` | Cookie `_m_h5_tk` 中 `_` 前面的部分 |
| `t` | 当前请求时间戳 |
| `appKey` | 当前样本为 `12574478` |
| `data` | form body 里的原始 `data` 字符串 |

当前过期样本校验：

```text
expectedSign = 8d3fa332a8e04ee6bf0504dae3f27c55
signMatches = true
```

代码位置：

```text
src/sdk_local_simulation.js -> makeFakeMtopParams()
```

替换规则：

- `_m_h5_tk` 与 `_m_h5_tk_enc` 要来自同一个 Cookie 会话。
- 从 `_m_h5_tk` 取 `_` 前缀作为 `token`。
- `data` 要用请求中的原始字符串，不要随便解析后重新序列化，否则字段顺序和转义可能变化。
- `token`、`t`、`appKey`、`data` 任意一个变化，都要重新计算 `sign`。

## 5. `bx_et`

`bx_et` 由浏览器里的 AWSC ET SDK 生成，不是业务接口响应返回的字段。

已观察到的调用形态：

```text
window.etSign(url)
window.__etModule.getETToken(url)
```

这里的 `url` 是已经带上 `appKey`、`t`、`sign` 等 query 参数的最终请求 URL。

当前长度对比：

| 来源 | 长度 |
| --- | --- |
| 浏览器基线 | `469` |
| 本地 `window.etSign(url)` | `457` |
| 本地 `window.__etModule.getETToken(url)` | `457` |

本地已对齐的环境字段：

- `navigator`、`screen`、`window`、`document`、`history`、`visualViewport`。
- `Function.prototype.toString` 的 native-like 输出。
- Canvas/WebGL，包括 WebGL renderer 和 canvas 输出长度。
- `performance` timing/resource 形态。
- Cookie key/value 长度和浏览器基线形态。
- `document/window` 行为事件监听与确定性事件派发。

当前限制：

- 本地输出可用于离线形态诊断，但还不是浏览器完整等价输出。
- 剩余 `12` 字符差异更像真实运行时状态差异，而不是简单静态字段缺失。

替换规则：

- 离线诊断时可以保留本地占位输出，只比较状态、长度和 digest。
- 授权的真实浏览器测试中，`bx_et` 必须从当前浏览器运行时生成或捕获。
- `t`、`sign`、`data`、最终 URL、Cookie、安全状态任一变化，都不要复用旧 `bx_et`。

## 6. `x-ele-check`

`x-ele-check` 由 Elecheck 客户端生成，不是业务接口响应返回。

已观察到的调用形态：

```text
window.x_check("", api)
```

当前接口的 API 名：

```text
mtop.relationrecommend.elemetinyapprecommend.recommend
```

当前本地状态：

```text
x_check = ok
redacted length = 576
```

相关文件：

```text
src/elecheck_esm_probe.mjs
docs/elecheck-esm-probe.json
```

替换规则：

- 本地结果只作为诊断值。
- 当前浏览器、当前 API、当前 SDK 初始化状态变化后，都不建议复用旧值。
- 如果要换样本，优先从同一个授权浏览器运行时重新生成或捕获。

## 7. `x-ele-ua`

`x-ele-ua` 是 H5/MiniApp 环境描述字符串。它比 `bx_et` 更静态，但仍然和版本、渠道、宿主环境有关。

样本形态：

```text
RenderWay/H5 MiniAppId/2021001110676437 MiniAppVersion/... AppName/h5 MiniHostVersion/... H5Version/... channel/mobile subChannel/mobile.default
```

当前本地状态：

- `sdk_local_simulation.js` 里只是诊断拼接。
- 这个值不声明等同于真实 `ebridge.getXUA()` 输出。

替换规则：

- 优先使用当前授权浏览器请求头里实际出现的 `x-ele-ua`。
- 手动构造离线样本时，保持 `MiniAppId`、版本、`channel/subChannel` 与页面一致。

## 8. `bx-umidtoken`

`bx-umidtoken` 是 AWSC/WebUMID 相关 token。样本里它和 Cookie `xqkp` 基本对应，但 header 通常不带末尾的 `=`，Cookie 里可能带 `=`。

当前本地默认假值：

```text
FAKE_UMIDTOKEN_DIAGNOSTIC_0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcde
```

对应本地假 Cookie：

```text
xqkp = bx-umidtoken + "="
```

代码位置：

```text
src/sdk_local_simulation.js -> DIAGNOSTIC_UMID_TOKEN
src/sdk_local_simulation.js -> DIAGNOSTIC_XQKP
```

离线覆盖方式：

```powershell
$env:ET_SAMPLE_XQKP = "<过期或授权诊断用 xqkp>"
node sites\waimai_guide_ele_me\src\sdk_local_simulation.js --quiet
Remove-Item Env:\ET_SAMPLE_XQKP
```

替换规则：

- header `bx-umidtoken` 一般使用不带尾部 `=` 的 token。
- Cookie `xqkp` 可能保留尾部 `=`。
- `bx-umidtoken`、`xqkp`、Cookie、安全 SDK 状态应来自同一浏览器会话。

## 9. 服务端下发 Cookie

这些值不要当成本地算法输出。

| Cookie | 作用 | 本地处理 |
| --- | --- | --- |
| `_m_h5_tk` | 提供 mtop `sign` 的 token 前缀 | 过期样本只用于验证 `sign` |
| `_m_h5_tk_enc` | `_m_h5_tk` 配套校验 Cookie | 本地不生成 |
| `x5sec` | 安全挑战/校验 Cookie | 本地不生成 |
| `tfstk` | SDK/服务端安全状态 | 假高熵占位，运行中可能被 SDK 改写 |
| `cna` | 浏览器/会话标识 | 默认假值，可离线覆盖 |
| `xqkp` | UMID/安全 token 存储 | 默认假值，可离线覆盖 |

替换规则：

- Cookie 要按同一浏览器会话整体替换，不能把不同会话的安全值混搭。
- `_m_h5_tk` 变化后必须重算 `sign`。
- Cookie、URL、`data` 变化后，`bx_et` 和 `x-ele-check` 也需要同环境重取。

## 10. 本地假值清单

本地模拟脚本刻意不保存实时安全值。

| 本地变量 | 默认值含义 | 用途 |
| --- | --- | --- |
| `DIAGNOSTIC_CNA` | 假 `cna`，长度按浏览器形态设置 | Cookie 占位 |
| `DIAGNOSTIC_UMID_TOKEN` | 假 `bx-umidtoken` | header 占位 |
| `DIAGNOSTIC_XQKP` | 假 `xqkp = token + "="` | Cookie 占位 |
| `DIAGNOSTIC_PAGE_URL` | 样本形态页面 URL | ET 环境输入 |
| `DIAGNOSTIC_REFERRER_URL` | 样本形态 referrer | ET 环境输入 |
| `EXPIRED_SAMPLE` | 过期 `t/appKey/tokenPrefix/expectedSign` | 只验证 mtop `sign` |
| `BROWSER_BASELINE` | 非敏感形态指标 | 长度、视口、资源数量对齐 |

可用环境变量：

```powershell
$env:ET_SAMPLE_CNA = "<过期或授权诊断用 cna>"
$env:ET_SAMPLE_XQKP = "<过期或授权诊断用 xqkp>"
$env:ET_EXTRA_MOVES = "10"
$env:ET_DIAG_INSTRUMENT = "1"
node sites\waimai_guide_ele_me\src\sdk_local_simulation.js --quiet
Remove-Item Env:\ET_SAMPLE_CNA
Remove-Item Env:\ET_SAMPLE_XQKP
Remove-Item Env:\ET_EXTRA_MOVES
Remove-Item Env:\ET_DIAG_INSTRUMENT
```

说明：

- `ET_SAMPLE_CNA`、`ET_SAMPLE_XQKP` 只是离线诊断输入槽。
- `ET_EXTRA_MOVES` 用于调整本地合成行为事件数量；最新测试中它没有补齐 `bx_et` 的剩余长度差。
- `ET_DIAG_INSTRUMENT=1` 会打开 ET 内部探针，只用于定位本地运行时差异。
- 用过期真实值测试后，应重新不带环境变量跑一次，避免报告里留下测试输入。

## 11. 替换检查清单

换一组授权样本时，按这个顺序检查：

1. 固定最终业务请求 URL、query、headers、cookies、body `data`。
2. `_m_h5_tk` 和 `_m_h5_tk_enc` 必须来自同一个 Cookie jar。
3. 从 `_m_h5_tk` 取 `_` 前面的 token。
4. 用 `token/t/appKey/data` 重新计算 `sign`。
5. `t/sign` 已经在 URL 上以后，再生成或捕获 `bx_et`。
6. 用完全一致的 API 名生成或捕获 `x-ele-check`。
7. `bx-umidtoken`、`xqkp`、`tfstk`、`cna` 和其他安全 Cookie 保持同一浏览器运行时来源。
8. 运行本地诊断脚本，只比较状态、长度和短摘要。

## 12. 相关文件

| 文件 | 作用 |
| --- | --- |
| `src/cookie_pipeline.py` | Cookie 驱动的本地离线主入口，自动完成 Cookie 解析、`sign` 计算和脱敏报告 |
| `src/sdk_local_simulation.js` | AWSC/ET/Baxia 本地诊断沙箱 |
| `src/elecheck_esm_probe.mjs` | Elecheck ESM 导入与 `x_check` 探针 |
| `src/run_local_diagnostics.js` | 汇总本地诊断 |
| `docs/cookie-pipeline.md` | 主入口使用说明 |
| `docs/sdk-local-simulation.json` | 最新 SDK 详细报告 |
| `docs/elecheck-esm-probe.json` | 最新 Elecheck 详细报告 |
| `docs/local-diagnostics-summary.json` | 最新汇总报告 |

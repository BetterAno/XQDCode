# SDK 本地模拟测试记录

> 字段级说明、假值来源、过期样本校验和替换规则见 `docs/dynamic-params.md`。本文主要保留本地模拟测试过程记录。

## 测试边界

- 只使用假 Cookie、假 token、假坐标和假关键词。
- 不请求真实业务接口，不复现可用于生产绕过的安全参数。
- 目标是验证本地 JS 文件能否加载、能否暴露函数，以及还缺哪些运行时依赖。

## 执行命令

```powershell
node --check ".\sites\waimai_guide_ele_me\src\sdk_local_simulation.js"
node ".\sites\waimai_guide_ele_me\src\sdk_local_simulation.js" --quiet
node ".\sites\waimai_guide_ele_me\src\elecheck_esm_probe.mjs"
node ".\sites\waimai_guide_ele_me\src\run_local_diagnostics.js"
```

完整 JSON 报告：

```text
E:\PythonCodeObject1\Qoder_ObjectProdemo2\sites\waimai_guide_ele_me\docs\sdk-local-simulation.json
E:\PythonCodeObject1\Qoder_ObjectProdemo2\sites\waimai_guide_ele_me\docs\elecheck-esm-probe.json
E:\PythonCodeObject1\Qoder_ObjectProdemo2\sites\waimai_guide_ele_me\docs\local-diagnostics-summary.json
```

## 本轮结果

| 项 | 状态 | 说明 |
| --- | --- | --- |
| JS 语法检查 | 通过 | `sdk_local_simulation.js` 可执行 |
| 浏览器同形层 | 通过 | 已补基础 prototype 链、native-like `toString`，当前报告无明显 Node 全局泄漏 |
| SDK 加载 | 通过 | classic VM 链 9 个文件全部加载成功 |
| AWSC `um` | 通过 | `AWSC.use("um")` 返回 module object |
| AWSC `et` | 通过 | `AWSC.use("et")` 返回 module object，`window.etSign` 存在 |
| AWSC `uab` | 通过 | `AWSC.use("uab")` 返回 module object，`getUA()` 可产出脱敏摘要 |
| Baxia | 通过加载 | `baxiaCommon`、`baxiaXhrHandler`、`baxiaFetchHandler` 可加载 |
| Elecheck legacy/loader | 通过加载 | legacy 和 loader 可加载，但未挂出 `window.x_check` |
| Elecheck ESM | 通过 | 独立 ESM 探针可 import `cl.js` 和三个 chunk，并挂出 `x_check` |

## 假数据参数生成

| 参数 | 状态 | 结果 |
| --- | --- | --- |
| `t` | 可生成 | `1777777777777`，固定假时间戳 |
| `sign` | 可生成 | `cb55f45edd05fbca7e6bff04842ca545`，算法为 `md5(fakeToken&t&appKey&data)` |
| `bx_et` | 未产出 | `window.etSign` 存在，但假环境调用返回 `undefined` |
| `x-ele-check` | ESM 链可产出 | 独立 ESM 探针里 `window.x_check` 可假调用，结果只保存脱敏摘要 |
| `x-ele-ua` | 可模拟拼接 | 当前只是诊断拼接，不是 `ebridge.getXUA()` 的真实输出 |
| `bx-umidtoken` | 可模拟占位 | 当前是假 token；真实值依赖 AWSC/WebUMID 初始化回调 |

## 发现的依赖

动态脚本依赖：

```text
https://g.alicdn.com/AWSC/et/1.83.41/et_f.js
https://g.alicdn.com/AWSC/uab/1.140.0/collina.js
```

Elecheck XHR 配置依赖：

```text
https://h5-data.elemecdn.com/ele-check-h5-config/config/zh_CN.json
```

Elecheck ESM chunk 依赖：

```text
./cl_babel-CP8i_Swq.js
./cl_polyfill-DqZ71sDb.js
./cl_vendor-DXnIpoEh.js
```

Baxia 运行时还引用：

```text
//g.alicdn.com/sd/nch5/index.js
//g.alicdn.com/sd/ncpc/nc.js
https://fourier.taobao.com/ts?ext=200&uuid=...
```

## 判断

本轮已接入诊断级浏览器同形层：

```text
nodeLeakKeys = []
document instanceof Document = true
navigator instanceof Navigator = true
localStorage instanceof Storage = true
String(fetch) = function fetch() { [native code] }
String(XMLHttpRequest.prototype.open) = function open() { [native code] }
```

`t` 和 H5 `sign` 属于普通 mtop 本地构造逻辑，用假数据已经可稳定生成。`bx_et`、`x-ele-check`、真实 `bx-umidtoken` 和 `x5sec` 不属于单个业务包内的纯函数；它们依赖 AWSC/Elecheck/Baxia 的浏览器运行时、配置下发、指纹采集或服务端挑战链。当前本地文件已经能证明缺口位置，但还不能在纯 Node 沙箱里产出这些真实安全参数。

本轮新增结果：

```text
classic VM load = 9/9 ok
Elecheck ESM import = ok
Elecheck x_check fake call = ok, redacted digest only
AWSC UAB getUA fake call = ok, redacted digest only
AWSC ET module = loaded
bx_et fake call = returned undefined
```

`bx_et` 还没有产出有效值。当前 ET 的剩余缺口已经从 WebGL/UAB 初始化错误推进到更深层的 ET 内部 `prototype` 指纹分支；为了不破坏已跑通的 AWSC/UAB 链，没有使用全局兜底 Proxy。

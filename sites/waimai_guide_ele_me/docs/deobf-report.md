# 反混淆测试报告

## 是否混淆

| 文件 | 判断 | 说明 |
|------|------|------|
| `assets/js/mor.g.40cff3.js` | 主要是 webpack/minify 压缩 | 目标 API、appId、请求包装都可直接格式化阅读，没有明显字符串表/控制流平坦化 |
| `assets/js/470.f09c09.js` | 主要是 webpack/minify 压缩 | 搜索参数组装逻辑可格式化阅读，没有明显 OB 特征 |
| `assets/js/mor.v.c8cf73.js` | 部分混淆 | mtop 中间件中存在 `loop/switch`、opcode if-chain、dispatcher wrapper |
| `assets/js/elecheck-*.js` | 强混淆/安全 SDK | 涉及生产安全校验，仅做混淆程度评估，不做绕过型还原 |
| `assets/js/awsc-*` / `baxiaCommon-*` | 安全 SDK/压缩混合 | 只做定位和结构观察 |

## 还原产物

| 原始文件 | 输出文件 | 状态 |
|----------|----------|------|
| `assets/js/mor.g.40cff3.js` | `assets/deobf/mor_g/final.js` | pipeline 成功 |
| `assets/js/470.f09c09.js` | `assets/deobf/470/final.js` | pipeline 成功 |
| `assets/js/mor.v.c8cf73.js` | `assets/deobf/mor_v_generic/final.js` | generic pipeline 成功 |

三个输出都通过了 `node --check`。

执行级 smoke test：

```powershell
node .\sites\waimai_guide_ele_me\src\deobf_smoke_test.js
```

已实测通过：

| 文件 | 执行结果 | chunkIds | moduleCount |
|------|----------|----------|-------------|
| `assets/deobf/mor_g/final.js` | ok | `502` | 20 |
| `assets/deobf/470/final.js` | ok | `470` | 50 |
| `assets/deobf/mor_v_generic/final.js` | ok | `986` | 461 |

补充验证命令：

```powershell
node --check .\sites\waimai_guide_ele_me\src\deobf_smoke_test.js
node .\sites\waimai_guide_ele_me\src\deobf_smoke_test.js
```

这个测试会在 Node `vm` 中创建最小浏览器沙箱，实际执行三个 `final.js`，并检查 `window.mor_modules` 的 chunk/module 注册结果。

## Residue 指标

### 原始文件

| 文件 | splitPipe | loopSwitch | opcodeIfChain | dispatcherWrapper | hexIdentifier |
|------|-----------|------------|---------------|-------------------|---------------|
| `mor.g.40cff3.js` | 0 | 0 | 0 | 0 | 0 |
| `470.f09c09.js` | 0 | 0 | 0 | 0 | 0 |
| `mor.v.c8cf73.js` | 4 | 86 | 21 | 51 | 0 |

### 还原后

| 文件 | splitPipe | loopSwitch | opcodeIfChain | dispatcherWrapper | hexIdentifier |
|------|-----------|------------|---------------|-------------------|---------------|
| `assets/deobf/mor_g/final.js` | 0 | 0 | 0 | 0 | 0 |
| `assets/deobf/470/final.js` | 0 | 0 | 0 | 0 | 0 |
| `assets/deobf/mor_v_generic/final.js` | 4 | 90 | 6 | 51 | 0 |

`mor.v` 的 opcode if-chain 明显下降，但 loop/switch 与 dispatcher wrapper 仍然残留；如果继续深入，需要写 Ele.me/mor 专用 adapter，而不是套现有同花顺/OB 规则。

## 关键阅读位置

### `assets/deobf/mor_g/final.js`

- `2226`：目标 API `mtop.relationrecommend.ElemeTinyAppRecommend.recommend`
- `2272`：`appId=26551` 的搜索结果配置
- `2600`：`needEcodeSign: !0`
- `2611`：`gatewayApiType: "mtop"`

### `assets/deobf/470/final.js`

- `5543`：`getSearchParams`
- `5628`、`5749`、`5928`：调用 `asyncBasicSearch`
- `5940`：`asyncBasicSearch` 定义
- `5962`：`passSearchParam`
- `6030`：合并 `getSearchParams()` 与请求参数

### `assets/deobf/mor_v_generic/final.js`

- `14902`：写入 `bx-umidtoken`
- `14975`：`x-ele-check-client` 与 `window.x_check("", api.toLowerCase())`
- `15020`：拼接 `x-ele-ua`
- `15832` - `15836`：另一处 `x-ele-check` 与 `SV=5.0/EtRequest` 逻辑

## skill 测试发现

### 已修复 1：短 token `ob` 误判

问题：

- detector 对 hint token 用 `includes` 做子串匹配。
- 项目路径 `Qoder_ObjectProdemo2` 中含 `Ob`，导致所有样本都被误判为 `cn-bidding-ob` / `mps-ob`。

修复：

- `pipeline-config.js` 中增加短 token 边界匹配。
- `ob` 这类 2 字符 token 不再匹配普通路径单词片段。

### 已修复 2：`inline-dispatchers` 左值替换崩溃

问题：

- dispatcher literal 被替换到赋值左侧，Babel 抛错：
  `Property left of AssignmentExpression expected node to be of a type ["LVal"] but instead got "NumericLiteral"`

修复：

- `inline-dispatchers.js` 中增加左值、`delete`、自增、自减、`for-in/of` 左侧保护。

### 已修复 3：`split('|')` 对同花顺误判过宽

问题：

- 只要出现 `split('|')` 就会命中 `tonghuashun`。
- `mor.v` 因此误入同花顺专用 adapter，并在 `tonghuashun_order_pass` 中失败。

修复：

- `pipeline-config.js` 中将同花顺 content detector 收窄到 `10jqka`，避免普通 split 用法误判。

## 后续建议

- 给 `run-pipeline.js` 增加 `--pattern generic|...` 强制模式，方便绕过误判。
- 增加 `minified-webpack` 轻量模式：只跑 `normalize/prune`，不要默认跑 dispatcher/flatten。
- 对 Ele.me `mor` 系列单独做 adapter：识别 webpack module wrapper、mor runtime chunk、regenerator 编译产物，再局部处理 middleware 混淆。
- `tonghuashun_order_pass` 的 `removeWrapperOwnerPath` 也需要上下文保护，避免删除会造成非法 AST 的节点。

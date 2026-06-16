# 网易易盾滑块加密分析

> 更新日期：2026-05-22

## 已确认文件

| 文件 | 用途 |
|------|------|
| `src/env/sdk/ir.2.0.13.min.js` | IR SDK 设备指纹与 `ir.d` 生成 |
| `src/env/sdk/load.min.js` | core 初始化入口 |
| `src/env/sdk/core_v2.28.5.min.js` | `cb` 与 check `data` 生成 |
| `src/env/browser.js` | Node.js 补浏览器环境 |
| `src/signer.js` | 加载原始 SDK 并导出加密参数 |

## IR 上报加密

当前实现不重写 IR 算法，而是在 Node.js VM 中补齐浏览器环境后执行原始 IR SDK。

已验证产物：

```json
{
  "p": "YD00192283058223",
  "v": "2.0.13_yanzhengma",
  "vk": "d44593ca",
  "n": "nonce",
  "d": "encrypted fingerprint"
}
```

Python 使用该 body 直接请求 IR 上报接口，可获取真实 `irToken`。

## cb 生成

`signer.js` 加载 core JS 时插桩暴露：

- `window.__a0_0x1e60`：字符串解码函数。
- `window.__NERequire`：core 内部 webpack require。

随后复用原始模块生成 `cb`：

- AES 工具模块：`req(0xa)`。
- 随机工具模块：`req(0x3)`。
- 输出长度与浏览器样本一致。

## check data 生成

动态调试确认浏览器端公式：

```javascript
d = aes(sample(traceData, SAMPLE_NUM).join(':'))
p = aes(xorEncode(token, percentDistance))
f = aes(xorEncode(token, normalize(sample(atomTraceData, 2)).join(',')))
ext = aes(xorEncode(token, mouseDownCounts + ',' + traceData.length))
m = ''
```

当前 Node.js 实现复用原始 core 模块：

| 字段 | 来源 |
|------|------|
| `d` | `req(0xa).aes` + `req(0x3).sample` + `SAMPLE_NUM` |
| `p` | `req(0xa).xorEncode` + `req(0xa).aes` |
| `f` | `req(0x38)` normalize + sample + AES |
| `ext` | mouseDownCounts/trace length + AES |

## 真实验证

- `signer.js get` 可生成 `cb/fp`。
- `signer.js ir` 可生成 IR 上报 body，Python 真实 POST 后可获取 `irToken`。
- `main.py` 已完成真实端到端通过，`check` 返回 `result=true` 并输出 `validate`。

## 当前风险

- 当前方案依赖原始 SDK 文件和 Node.js VM 补环境，SDK 版本变更时需要同步更新 `src/env/sdk/`。
- 轨迹为合成浏览器格式轨迹，已通过当前样本验证，但强风控策略变化时仍需重新采样校准。

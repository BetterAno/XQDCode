# 网易易盾滑块接口文档

> 更新日期：2026-05-22

## 接口链路

| 步骤 | 接口 | Method | 当前状态 |
|------|------|--------|----------|
| 1 | `https://c.dun.163.com/api/v2/getconf` | GET/JSONP | 已验证 |
| 2 | `https://ir-sdk.dun.163.com/v4/j/up` | POST | 已验证 |
| 3 | `https://c.dun.163.com/api/v3/get` | GET/JSONP | 已验证 |
| 4 | `https://c.dun.163.com/api/v3/check` | GET/JSONP | 已真实通过 |

## getconf

关键参数：

| 参数 | 说明 |
|------|------|
| `id` | captchaId |
| `referer` | `https://dun.163.com/trial/jigsaw` |
| `loadVersion` | 当前使用 `2.5.4` |
| `callback` | JSONP 回调名 |

关键返回：

| 字段 | 说明 |
|------|------|
| `dt` | 后续 get/check 必带 |
| `zoneId` | 区域标识，样本为 `CN31` |
| `ac.ir` | IR SDK 配置 |

## IR 上报

请求体由 `signer.js ir` 生成，Python 负责真实 POST。

| 字段 | 说明 |
|------|------|
| `p` | IR 产品号 |
| `v` | SDK 版本 |
| `vk` | 版本密钥 |
| `n` | nonce |
| `d` | IR SDK 加密后的设备指纹数据 |

成功后从响应 `data.tk` 读取 `irToken`。

## get

关键参数：

| 参数 | 说明 |
|------|------|
| `dt` | getconf 返回 |
| `irToken` | IR 上报返回 |
| `id` | captchaId |
| `fp` | 设备指纹字符串 |
| `cb` | core JS 生成 |
| `dev` | 浏览器样本确认使用 `1` |
| `type` | 滑块为 `2` |

关键返回：

| 字段 | 说明 |
|------|------|
| `data.token` | check 必带 |
| `data.bg` | 背景图 |
| `data.front` | 滑块图 |
| `data.wait_time` | 提交前等待时间 |

## 滑块识别

默认识别方案为 OpenCV alpha mask 模板匹配，`ddddocr.slide_match` 保留为对照候选：

| 项 | 说明 |
|------|------|
| 输入 1 | `front` 滑块图 bytes |
| 输入 2 | `bg` 背景图 bytes |
| 输出 | OpenCV `max_loc[0]` 作为滑块 `style.left` 像素值 |

实测中 `ddddocr` 的 `simple_target=True/False` 会出现分裂候选，OpenCV masked match 置信度稳定在 `0.94+`，已用于真实通过。

云码识别已改为可选兜底，默认不调用。需要时设置：

```powershell
$env:DUN_ALLOW_YUNMA = "1"
$env:YUNMA_TOKEN = "..."
```

## check

关键参数：

| 参数 | 说明 |
|------|------|
| `dt` | getconf 返回 |
| `token` | get 返回 |
| `data` | JSON 字符串，包含 `d/m/p/f/ext` |
| `cb` | core JS 生成 |

当前验证结果：

- 使用 OpenCV masked match 距离和合成浏览器格式轨迹，真实接口已返回 `result=true`。
- `validate` 可正常从响应 `data.validate` 读取。

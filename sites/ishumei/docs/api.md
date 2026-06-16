# 数美科技 (ishumei) 滑块验证码 - 接口分析文档

> 分析日期: 2026-05-15
> 目标页面: https://www.ishumei.com/new/product/tw/code
> 验证码类型: 滑块拼图验证码 (slide)
> SDK版本: captcha-sdk v1.0.4, sdkver=1.1.3

## 接口域名

| 域名 | 用途 |
|------|------|
| `captcha1.fengkongcloud.cn` | 验证码 API 接口 |
| `castatic.fengkongcloud.cn` | 静态资源 (图片/SDK/CSS) |
| `tracker.fengkongcloud.com` | 异常追踪上报 |

## 接口流程 (完整时序)

```
1. conf     → 获取SDK配置 (CSS/JS路径)
2. register → 获取验证码图片 + 加密key
3. log(多次) → 记录用户行为 (加载/展示/拖动等)
4. fverify  → 提交验证 (核心接口，包含加密参数)
5. log      → 记录验证结果 (verifyFail/verifySuccess)
```

---

## 接口详细分析

### 1. `/ca/v1/conf` - 获取SDK配置

**请求方式:** GET (JSONP)
**URL:** `https://captcha1.fengkongcloud.cn/ca/v1/conf`

**Query参数:**
| 参数 | 示例值 | 说明 |
|------|--------|------|
| model | slide | 验证码类型 |
| channel | default | 渠道 |
| captchaUuid | 20260515132355BReFpsHn54ip85ZbEp | 验证会话ID |
| lang | zh-cn | 语言 |
| appId | default | 应用ID |
| organization | d6tpAY1oV0Kv5jRSgxQr | 组织标识 (固定) |
| rversion | 1.0.4 | SDK运行版本 |
| sdkver | 1.1.3 | SDK版本 |
| callback | sm_xxx | JSONP回调函数名 |

**响应示例:**
```json
{
  "code": 1100,
  "message": "success",
  "requestId": "5c970065cd302f96e5e9087a1d0cbe59",
  "riskLevel": "PASS",
  "score": 0,
  "detail": {
    "css": "/pr/auto-build/v1.0.4-206/style.min.css",
    "domains": ["castatic.fengkongcloud.cn", "castatic.fengkongcloud.com", "castatic-a.fengkongcloud.com", "castatic2.fengkongcloud.com"],
    "js": "/pr/auto-build/v1.0.4-206/captcha-sdk.min.js"
  }
}
```

---

### 2. `/ca/v1/register` - 注册验证码

**请求方式:** GET (JSONP)
**URL:** `https://captcha1.fengkongcloud.cn/ca/v1/register`

**Query参数:**
| 参数 | 示例值 | 说明 |
|------|--------|------|
| model | slide | 验证码类型 |
| organization | d6tpAY1oV0Kv5jRSgxQr | 组织标识 |
| callback | sm_xxx | JSONP回调 |
| rversion | 1.0.4 | 运行版本 |
| data | {} | 扩展数据 (空对象) |
| appId | default | 应用ID |
| channel | default | 渠道 |
| lang | zh-cn | 语言 |
| sdkver | 1.1.3 | SDK版本 |
| captchaUuid | xxx | 验证会话ID |

**响应示例:**
```json
{
  "code": 1100,
  "message": "success",
  "requestId": "aa98136cfb3e86a38469cec488f99207",
  "riskLevel": "PASS",
  "score": 0,
  "detail": {
    "bg": "/crb/set-000006/v2/ab7713e4b5fad2718dcde670a0b57d53_bg.jpg",
    "bg_height": 300,
    "bg_width": 600,
    "domains": ["castatic.fengkongcloud.cn", ...],
    "fg": "/crb/set-000006/v2/ab7713e4b5fad2718dcde670a0b57d53_fg.png",
    "k": "ukhXsAzfVjI=",
    "l": 8,
    "rid": "20260515132356a90fda2189d8beafb2"
  }
}
```

**关键字段说明:**
| 字段 | 说明 |
|------|------|
| bg | 背景图路径 (含缺口) |
| fg | 滑块前景图路径 |
| k | AES加密密钥 (Base64, 每次不同) |
| l | 固定值 8 (可能是加密模式参数) |
| rid | 请求ID (fverify需要) |

**资源URL拼接:**
- 背景图: `https://castatic.fengkongcloud.cn{bg}`
- 前景图: `https://castatic.fengkongcloud.cn{fg}`

---

### 3. `/ca/v2/fverify` - 滑块验证提交 (核心接口)

**请求方式:** GET (JSONP)
**URL:** `https://captcha1.fengkongcloud.cn/ca/v2/fverify`

**加密参数分析 (3次请求对比):**

| 参数 | reqid=74 (PASS) | reqid=128 (REJECT) | reqid=143 (REJECT) | 是否固定 | 推测含义 |
|------|-----------------|--------------------|--------------------|---------|---------|
| vs | `48mIqYwgot8=` | `UJ3CTIgrH94=` | `GGVJX+0cVPo=` | **变化** | 滑块偏移量(加密) |
| jq | `8CCvePk2kf8=` | `8CCvePk2kf8=` | `8CCvePk2kf8=` | 固定 | 设备指纹1 |
| es | `BUvWMp6vHgY=` | `BUvWMp6vHgY=` | `BUvWMp6vHgY=` | 固定 | 设备指纹2 |
| lx | `Jtv2vtkGPk0=` | `Jtv2vtkGPk0=` | `Jtv2vtkGPk0=` | 固定 | 设备指纹3 |
| zm | `xvOnP7cIIcY=` | `xvOnP7cIIcY=` | `xvOnP7cIIcY=` | 固定 | 设备指纹4 |
| wi | `y6gQnyYed2IZt+C3uBO61se/AHtAJuzX` | `JbjpNBYAl+4Zt+C3uBO61qaYpZGpCI8W` | `+LBKimGGCaOTrSvgN5UNwWw1PvYBFUwG` | **变化** | 浏览器指纹(动态) |
| hq | `3TYphsLXy2Y=` | `3TYphsLXy2Y=` | `3TYphsLXy2Y=` | 固定 | 设备指纹5 |
| gq | `rpcTXBNz9Tx1...(约200字符)` | `rpcTXBNz9TwR...(约200字符)` | `v90OyfLSX3ql...(约200字符)` | **变化** | 鼠标轨迹(加密) |
| vj | `9fE3gOSP64o=` | `9fE3gOSP64o=` | `9fE3gOSP64o=` | 固定 | SDK版本标识 |
| bb | `ZLCbn3Vwpro=` | `ZLCbn3Vwpro=` | `ZLCbn3Vwpro=` | 固定 | 设备指纹6 |
| ww | `Jb8QeO9Hoio=` | `Jb8QeO9Hoio=` | `Jb8QeO9Hoio=` | 固定 | 设备指纹7 |
| tx | `IySHsM4F7h4=` | `IySHsM4F7h4=` | `IySHsM4F7h4=` | 固定 | 设备指纹8 |

**明文参数:**
| 参数 | 值 | 说明 |
|------|-----|------|
| protocol | 206 | 协议版本 |
| rid | 来自register响应 | 请求ID |
| captchaUuid | 验证会话ID | 会话标识 |
| organization | d6tpAY1oV0Kv5jRSgxQr | 组织标识 |
| act.os | web_pc | 操作系统 |
| ostype | web | 系统类型 |
| sdkver | 1.1.3 | SDK版本 |
| rversion | 1.0.4 | 运行版本 |
| callback | sm_xxx | JSONP回调 |

**响应:**
```json
// 验证通过
{"code":1100,"message":"success","requestId":"xxx","riskLevel":"PASS"}

// 验证失败
{"code":1100,"message":"success","requestId":"xxx","riskLevel":"REJECT"}
```

---

### 4. `/ca/v1/log` - 行为日志上报

**请求方式:** POST
**URL:** `https://captcha1.fengkongcloud.cn/ca/v1/log`
**Content-Type:** `application/json;charset=UTF-8`

**公共字段:**
| 字段 | 说明 |
|------|------|
| action | 行为类型 |
| actionTime | 时间戳 (ms) |
| captchaUuid | 会话ID |
| organization | 组织标识 |
| product | embed/float |
| mode | slide |
| os | web |
| sdkver | 1.1.3 |
| rversion | 1.0.4 |

**action类型记录 (按时间顺序):**
| action | 说明 |
|--------|------|
| registerSuccess | 注册成功 |
| imageLoadSuccess | 图片加载成功 |
| imageLoaded | 所有图片已加载 |
| startMove | 用户开始拖动滑块 |
| verifyFail | 验证失败 |
| verifySuccess | 验证成功 |

---

## 加密参数总结

### 参数分类

**固定不变 (9个):** jq, es, lx, zm, hq, vj, bb, ww, tx
- 推测为设备/浏览器指纹，在同一浏览器会话中保持不变
- 均为 Base64 编码格式，解码后长度约8字节

**每次变化 (3个):**
1. **vs** - 短Base64 (约8字节解码)，推测为滑块偏移量加密值
2. **wi** - 中等长度Base64 (约24-32字节解码)，推测为动态浏览器指纹
3. **gq** - 长Base64 (约150-200字节解码)，推测为鼠标轨迹数据加密

### 加密特征

- 所有加密参数均为 Base64 编码
- Base64 解码后为二进制数据，非明文
- 参数 `k` (来自register) 为 AES 密钥: `ukhXsAzfVjI=` → 解码为8字节密钥
- `l=8` 可能指示加密模式 (如 AES-ECB/8字节块)
- `protocol=206` 可能是加密协议版本号

### SDK文件位置

- **主SDK:** `https://castatic.fengkongcloud.cn/pr/auto-build/v1.0.4-206/captcha-sdk.min.js`
- **指纹采集:** `https://www.ishumei.com/next/js/fp.js`
- **辅助指纹:** `https://static.portal101.cn/dist/web/v3.0.0/fp.min.js`

---

## 完整请求日志

### 第一轮 (captchaUuid: 202605151323492eM2fFyd5tZm7rkNhn)
| reqid | 接口 | 结果 |
|-------|------|------|
| 62 | register | PASS → bg/fg/k/rid |
| 74 | fverify | **PASS** ✅ |

### 第二轮 (captchaUuid: 20260515132355BReFpsHn54ip85ZbEp)
| reqid | 接口 | 结果 |
|-------|------|------|
| 107 | register | PASS → bg/fg/k/rid |
| 128 | fverify | REJECT ❌ |
| 130 | register | PASS (刷新) |
| 143 | fverify | REJECT ❌ |
| 145 | register | PASS (刷新) |
| ... | 继续循环 | ... |

### 关键观察
1. 验证失败后自动刷新 register 获取新图片
2. captchaUuid 在同一验证会话中保持不变
3. 失败的 fverify 会触发新的 register-refresh 循环
4. 同一浏览器中固定参数 (jq/es/lx等) 跨 captchaUuid 不变
5. `protocol=206` 出现在所有 fverify 中

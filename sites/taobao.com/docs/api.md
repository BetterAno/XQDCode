# API 接口分析

## 1. 架构总览

淘宝 PC 搜索使用 **SSR + MTOP** 双通道：

- **SSR**（服务端渲染）：首次搜索结果随 HTML 直接返回，URL `s.taobao.com/search?q=关键词`
- **MTOP**（Mobile Taobao Open Platform）：推荐、用户信息、页面组件等通过 XHR/Fetch 异步加载

## 2. MTOP API 网关

| 字段 | 值 |
|------|-----|
| Base URL | `https://h5api.m.taobao.com/h5/` |
| JS 版本 | `jsv=2.7.4` |
| App Key | `12574478`（PC 搜索固定值） |

## 3. 已识别接口

### 3.1 推荐接口（高频）

```
POST h5api.m.taobao.com/h5/mtop.relationrecommend.wirelessrecommend.recommend/2.0/
     ?jsv=2.7.4&appKey=12574478
     &t=<timestamp_ms>
     &sign=<md5_sign>
     &api=mtop.relationrecommend.wirelessrecommend.recommend
     &v=2.0
     &type=originaljson&dataType=jsonp
     &bx-ua=<encoded_fingerprint>
     &bx-umidtoken=<device_token>
     &bx_et=<encrypted_token>
```

### 3.2 推荐流接口（SSE/Stream）

```
POST h5api.m.taobao.com/h5/mtop.relationrecommend.wirelessrecommend.recommendstream/1.0/
     ?dataType=stream&method=post
     &api=mtop.relationrecommend.wirelessrecommend.recommendstream
     &v=1.0&xAcceptStream=true
```

### 3.3 页面容器/组件

```
POST h5api.m.taobao.com/h5/mtop.alibaba.fc.api.maoxland.containerfacade.singleview/1.0/
```

### 3.4 用户信息

```
GET h5api.m.taobao.com/h5/mtop.user.getusersimple/1.0/
```

### 3.5 业务路由

```
POST h5api.m.taobao.com/h5/mtop.tmall.kangaroo.core.service.route.aldlampservicefixedresv2/1.0/
```

## 4. 安全/指纹接口

| 接口 | 用途 |
|------|------|
| `umdcv4.taobao.com/repWd.json` | 设备指纹采集 (UMD v4)，POST，含 `bx-ua`、`bx-umidtoken`、`x-pipu2` |
| `umdcv4.taobao.com/repTw.json` | 指纹采集 T 版本 |
| `ynuf.aliapp.org/service/um.json` | 风控数据回传 |
| `arms-retcode.aliyuncs.com/r.png` | 阿里 ARMS 前端监控 |

## 5. MTOP 关键参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `t` | 13位时间戳 ms | 请求时间 |
| `sign` | 32字符 hex | MD5 签名（`token + & + t + & + appKey + & + data` 组合） |
| `bx-ua` | URL编码长字符串 | 浏览器指纹 + AWSC 行为数据，自定义编码 |
| `bx-umidtoken` | Base64-like Token | 设备唯一标识 token |
| `bx_et` | 编码字符串 | AWSC 加密 token（含 `.` 分隔段） |
| `data` | JSON 字符串 | 请求体（GET 方式时放在 URL 参数中） |

## 6. 安全 SDK 栈（来自调用栈）

```
kissy/k/6.2.4/seed-min.js           ← KISSY 框架
  └─ AWSC/AWSC/awsc.js              ← 反爬核心（请求拦截/签名/hook XHR）
  └─ sd/baxia/2.5.28/baxiaCommon.js ← 风控共用模块
  └─ AWSC/et/1.84.2/et_f.js         ← ET 加密 token 生成
  └─ sufei_data/3.8.7/index.js      ← 数据采集
  └─ traceSDK/index.umd.js          ← 行为轨迹
  └─ main-search/pc-search-2024/1.8.44/js/main.js ← 搜索主逻辑
```

AWSC 在 XHR open/send 处做了**全局拦截**，所有 MTOP 请求经过 `awsc.js` → `baxiaCommon.js` → `et_f.js` 注入 `bx-ua`、`bx-umidtoken`、`bx_et` 三个安全参数。

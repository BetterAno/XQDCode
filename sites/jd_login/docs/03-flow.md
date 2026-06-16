# 京东登录全链路时序（Phase 1 实测）

实测：在 AdsPower 中填入 `qoder_test_jd / TestPwd_123456!`，点击登录按钮（实际页面已存在登录态 Cookie，仍触发滑块）。

## 一、请求顺序（按时间）

```
T+0    fetch  POST  https://api.m.jd.com/api?functionId=user_rbd&appid=user-wbc-client
T+0.18 xhr    POST  //jcap.m.jd.com/cgi-bin/api/fp                   [拿 fp 指纹]
T+0.35 xhr    GET   //jcapmonitor.m.jd.com/web_jcap_report  interfaceId=268435458
T+0.36 xhr    POST  //jcap.m.jd.com/cgi-bin/api/check                [拿滑块图]
T+0.48 xhr    GET   //jcapmonitor.m.jd.com/web_jcap_report  interfaceId=268435460
T+28.6 xhr    GET   https://sso.jd.com/sso/rac?t=...&r=...&s=...&ua=...   [TDFP 上报]
... (用户拖动滑块后会有 verify 接口，此次未触发)
```

## 二、接口详情

### 2.1 user_rbd（fido wbc 设备风险评估）

URL: `POST https://api.m.jd.com/api?functionId=user_rbd&appid=user-wbc-client`

Body（form-urlencoded，body 字段是 JSON 字符串）：
```json
{
  "cvn": "1.0.0",
  "kvn": 1,
  "kek_id": "a3c35aac54084a726ccb6a5600be1fbf65cacf35",
  "alg": 1,
  "dek": "<base64 url-encoded ~344 bytes>",
  "nonce": "Q4T+ctloz0CUMn3j",
  "ebd": "<base64 url-encoded ~1700 bytes>"
}
```

参数语义（推断，待实证）：
- `kek_id`：Key Encryption Key 标识，固定（可能与版本绑定）
- `alg=1`：算法类型 1
- `dek`：Data Encryption Key（用 KEK 加密的 AES key），里面是真正的对称密钥
- `nonce`：12-byte AES-GCM nonce（base64 后 16 字节，正好对应 AES-GCM IV）
- `ebd`：Encrypted Business Data（用 dek 加密的真实业务数据 JSON）

来源 JS：`storage.360buyimg.com__bjd-utils-sdk__bjdcommon__login__1.0.0__index.js` (1MB)
+ `storage.jd.com__...__webcontainer__js_security_v3_0.1.8.js` (65KB)

Response：200（具体内容未抓到，应该是 set-cookie 或风险等级）

### 2.2 jcap fp（指纹建立）

URL: `POST //jcap.m.jd.com/cgi-bin/api/fp`

Body（form-urlencoded）：
```
si=ffbUUAABAAAIv1ZFmMkAMAlP0WWhQPZGlD4A5qypiI9ntUhRHGn2kg3pS-DkKyfjFK3EUBXSjPLwMT-70y-J_wAAAAA
&ct=AwPFBKB9_7u1BiM-w9GnFh6UnTvVqHs8...   (~2700 bytes base64-url)
&version=3
&lang=1
&client=pc
```

Response:
```json
{
  "st": "8QDD3ZI2bO8LfBoE",
  "code": 0,
  "msg": "",
  "fp": "lX1Tlh0VfZsOdW4hQApywmh3LZaz2a0ANd7GgWlwXEWAtOKave277KixUVBFeu-2amUZ8NZaC1Hto6C5-oAGl9_rzLg=",
  "tp": 9,
  "img": "",
  "audio": false,
  "feedback": false,
  "ncsc": 0,
  "csc": 0
}
```

参数语义（推断）：
- `si` (server info)：jcap SDK 初始化时下发，单页面会话内固定。base64-url，约 96 字节。
- `ct` (client token)：AwPF 开头 base64-url；含设备指纹 + 浏览器特征 + 时间戳的加密包。**核心加密**。
- `version=3`：协议版本
- `client=pc`：端类型
- 返回 `fp`：服务端基于 ct 验证后回写的指纹串（后续接口要带）
- 返回 `st`：server token，用于关联后续 check 请求

### 2.3 jcap check（拿滑块图）

URL: `POST //jcap.m.jd.com/cgi-bin/api/check`

Body：
```
si=<同上>
&lang=1
&tk=AwPFAfAYoUxel9gu8HyW...   (~1300 bytes base64-url)
&ct=AwPFBPA5lXBMuBWG7vH...   (~3700 bytes base64-url，比 fp 接口的 ct 更长)
```

Response（部分）：
```json
{
  "st": "HMOk22VOLafiwEKf",
  "code": 0,
  "tp": 30,
  "img": "{\"b1\":\"data:image/jpg;base64,/9j/4AAQ...\"}"   // 背景图（含缺口的叶子图）
}
```

参数语义（推断）：
- `tk`：基于上一步返回的 `fp` 派生的 token；AwPF 开头表示同一加密协议
- `ct`：本次行为采集（含 mouse move 轨迹等）的加密包
- 返回 `img.b1`：背景图（base64 jpg），可能还有 `b2`（slider patch），需在用户开始拖动时拿
- `tp=30`：滑块类型 ID
- `st`：本次会话 server token

### 2.4 jcap verify（用户拖动后 - 待抓）

预测路径：`POST //jcap.m.jd.com/cgi-bin/api/verify`，body 含轨迹加密包 `ct` + `tk` + `si`，成功返回业务 token。

### 2.5 sso/rac（同盾 TDFingerprint 上报）

URL: `GET https://sso.jd.com/sso/rac?t=<ts>&r=<rand>&s=<long_payload>&ua=...`

`s` 参数结构（用 `;` 分隔）：
```
20260504202912320  -> 时间戳字符串
nnbny2bn2byi5710   -> session id
73806              -> ?
tk03wa7c91c34...   -> TDFingerprint token (tk03 前缀)
e313f82e...        -> md5 hash
5.3                -> 版本
1777897747320      -> ts
q3EpJLIg6zpf...    -> 行为/指纹采集加密包（同盾自定义编码）
a4ca8f6573a9...    -> md5 hash
of7r36JP           -> 短串
```

Response: `{"nfd":10}`

来源 JS：`gias.jd.com__js__td.js` + `gias.jd.com__js__pc-tk.js`

## 三、待逆向核心加密

| 加密包 | 来源 | 优先级 |
|--------|------|--------|
| jcap `ct` (AwPF...) | jcap_ap0b2a.js | P0 - 滑块必需 |
| jcap `tk` (AwPF...) | jcap_ap0b2a.js | P0 - 滑块必需 |
| user_rbd `dek/ebd/nonce` | bjd-utils-sdk + js_security_v3 | P1 - 设备评估 |
| sso/rac `s` (q3Ep... 段) | td.js + pc-tk.js | P1 - 风控上报 |
| 密码 nloginpwd | jdJsencrypt（RSA） | P2 - 简单 |
| `_JdEid` (3AB9D23F7A4B3C9B Cookie) | eid.js + td.js | P0 - Cookie 必需 |

## 四、AwPF 前缀解析

`AwPF` base64-url 解码 = `0x03 0x03 0xC5` = 版本 3 + 子版本 3 + 0xC5 标志位。

所有 jcap `ct/tk` 都以这个开头，说明它们使用同一套协议格式：
```
[1B version=3][1B subver=3][1B flag=0xC5][...payload...]
```
推测 payload 内是 AES-GCM 或自研流式加密 + 自定义 base64-url 字符表。

## 五、滑块图分析

抓到的 b1 是一张 ~268×170 jpg，叶子背景上有两个拼图位置（一个空缺、一个填充）。
"拖动箭头填充拼图" 这种 UI 是 jcap v2.7.1 的标准滑块。

OpenCV 缺口识别策略：
1. base64 解码 b1 为 PNG/JPG
2. 灰度化 + Canny 边缘检测
3. 找两个最相似的拼图轮廓 → 中心 x 距离 = 滑动像素
4. 减去 slider 起始位置（一般固定 10-20 px）= 拖动距离

## 六、下一步

- Task 2: 反混淆 jcap_ap0b2a.js（重点：找 `ct/tk` 的构造函数）
- Task 3: 密码 RSA（独立，可并行）
- Task 5.4 触发滑动后再次抓 verify 接口入参

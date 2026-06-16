# beian.miit.gov.cn 逆向执行方案

## 1. 接口信息

| 接口 | URL | Method | Content-Type | 说明 |
|------|-----|--------|--------------|------|
| 获取Token | `/icpproject_query/api/auth` | POST | `application/x-www-form-urlencoded` | JWT token 申请 |
| 刷新Token | `/icpproject_query/api/auth/refresh` | GET | - | Token 续期 |
| 获取验证码图片 | `/pquery/image/getCheckImagePoint` | POST | `application/json` | 滑块/点选验证码 |
| 校验滑块 | `/pquery/image/checkImage` | POST | `application/json` | 滑块校验 → 返回 sign |
| 校验点选 | `/pquery/image/checkImage` | POST | `application/json` | 点选校验 → 返回 sign |
| 备案查询 | `/pquery/icpAbbreviateInfo/queryByCondition` | POST | `application/json` | ICP 备案查询 |
| 违规域名查询 | `/pquery/blackListDomain/queryByCondition` | POST | `application/json` | 黑名单域名查询 |
| 通知公告 | `/icpproject_query/api/latestMessage/queryByCondition` | POST | `application/json` | 通知公告列表 |
| 法律法规 | `/icpproject_query/api/lawsRegulations/queryByCondition` | POST | `application/json` | 法律法规列表 |

**Base URL**: `https://hlwicpfwc.miit.gov.cn/icpproject_query/`
**前端路由前缀**: `/pquery/` → 代理到 `API_BASE_PATH`

## 2. 请求参数

### 2.1 公共 Headers

| 参数名 | 类型 | 说明 | 来源 |
|--------|------|------|------|
| `token` | string | JWT 格式认证令牌 | `/api/auth` 接口返回 |
| `Content-Type` | string | `application/json` | 固定值 |
| `Cookie` | string | `__jsluid_s` + `__jsl_clearance_s` | 加速乐 CDN 生成 |

### 2.2 备案查询专用 Headers

| 参数名 | 类型 | 说明 | 来源 |
|--------|------|------|------|
| `uuid` | string | 验证码会话 ID | `getCheckImagePoint` 返回 |
| `sign` | string | 验证码校验签名 | `checkImage` 返回 |

### 2.3 备案查询 Body

```json
{
  "pageNum": "",
  "pageSize": "",
  "unitName": "目标域名/公司名",
  "serviceType": 1
}
```

`serviceType`: 1=网站备案, 2=APP备案, 等

## 3. 加密方式（实证确认）

### 3.1 Token 生成（MD5 + 服务端 JWT 签发）

**源码位置**: `app.2f3af746.js` → webpack module `"0075"`

**硬编码凭据**（实证）:
```javascript
authAcount: "test",
authSecret: "test"
```

**authKey 生成算法**:
```javascript
// 函数: w.authKey(g, A, I)
// g = authAcount = "test"
// A = authSecret = "test"
// I = timestamp (ms)
authKey = CryptoJS.MD5("test" + "test" + timestamp).toString(CryptoJS.enc.Hex)
```

**Token 请求**:
- POST `/icpproject_query/api/auth`
- Body: `authKey={MD5_hex}&timeStamp={timestamp_ms}`
- Content-Type: `application/x-www-form-urlencoded`
- Response: `{code: 200, params: {token: "JWT...", bussiness: "...", refresh: "...", expire: ms}}`

**JWT 解析**（实证）:
```
Header: 无单独 header（单段 Base64）
Payload: {"type":1,"u":"098f6bcd4621d373cade4e832627b4f6","s":1780032174891,"e":1780032654891}
Signature: RlPkQ6KEEaskgfsPyLpxHb-5OohJccK8hUjIYOQ_1Gg
```
- `u` = `MD5("test")` = `098f6bcd4621d373cade4e832627b4f6` ✅ 已验证
- `s` = 开始时间戳 (ms)
- `e` = 结束时间戳 (ms)，约 480 秒有效期
- JWT 签名由服务端生成，客户端无需还原

### 3.2 滑块验证码（明文参数）

**源码位置**: `app.2f3af746.js` → `checkImg` 方法

**步骤**:
1. POST `/pquery/image/getCheckImagePoint` → 返回 `{uuid, smallImage, bigImage, height}`
2. POST `/pquery/image/checkImage` with `{key: uuid, value: Math.round(puzzle_offset)}`
3. Response: `{success: true, params: sign_string}`

**无加密**，仅传滑块偏移量。

### 3.3 点选验证码（AES/ECB/PKCS7）

**源码位置**: `app.2f3af746.js` → `checkImgPoint` 方法 + `v.encrypt` 函数

**加密函数**（实证）:
```javascript
// 函数: v.encrypt(plaintext, key)
encrypt = function(plaintext, key) {
    key = key || "abcdefgabcdefg12";  // 默认密钥 16 字节
    var keyBytes = CryptoJS.enc.Utf8.parse(key);
    var plainBytes = CryptoJS.enc.Utf8.parse(plaintext);
    var encrypted = CryptoJS.AES.encrypt(plainBytes, keyBytes, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();  // Base64
}
```

**请求参数**:
```json
{
  "token": "uuid",
  "secretKey": "",
  "clientUid": "localStorage.getItem('point')",
  "pointJson": "AES_ECB_PKCS7_Base64(JSON.stringify([{x, y}...]), 'abcdefgabcdefg12')"
}
```

### 3.4 JSL Cookie（加速乐 CDN）— 三次请求机制

> 参考来源：K哥爬虫「JS逆向百例」加速乐 Cookie 混淆逆向详解 + 吾爱破解/看雪社区多篇分析

#### 3.4.1 两个 Cookie

| Cookie | 属性 | 来源 | 说明 |
|--------|------|------|------|
| `__jsluid_s` | **HttpOnly** | CDN 服务器 `Set-Cookie` 响应头 | 首次请求自动分配，长期有效 |
| `__jsl_clearance_s` | JS 可访问 | 加速乐 JS 挑战脚本生成 | 有效期通常 3600s，需定期刷新 |

#### 3.4.2 三次请求完整流程

```
┌─────────────────────────────────────────────────────────────────┐
│ 第一次请求 (521)                                                 │
│                                                                 │
│ GET https://beian.miit.gov.cn/                                  │
│ → Status: 521                                                   │
│ → Set-Cookie: __jsluid_s=xxx (HttpOnly)                         │
│ → Body: <script>AAEncode混淆JS</script>                         │
│                                                                 │
│ AAEncode 特征：颜文字/表情符号编码的 JS                           │
│ 例: (～￣(￣▽￣)～) + ('_') + ... → document.cookie =             │
│   '__jsl_clearance_s=xxx;path=/';location.href=...              │
│                                                                 │
│ ✅ 解法：正则提取 cookie= 后的表达式 → execjs.eval() 执行        │
│         → 得到第一层 __jsl_clearance_s                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓ 携带 __jsluid_s + 第一层 __jsl_clearance_s
┌─────────────────────────────────────────────────────────────────┐
│ 第二次请求 (521)                                                 │
│                                                                 │
│ GET https://beian.miit.gov.cn/                                  │
│ Cookie: __jsluid_s=xxx; __jsl_clearance_s=第一层值               │
│ → Status: 521                                                   │
│ → Body: <script>OB混淆JS → go({参数字典})</script>               │
│                                                                 │
│ go() 函数参数结构（关键）：                                       │
│ {                                                               │
│   "bts": ["timestamp|version|prefix", "suffix"],  // 前后缀      │
│   "chars": "vUzQIgamgWnnFOJyKwXiGK",              // 候选字符集  │
│   "ct": "690f55a681f304c95b35941b20538480",        // 目标hash   │
│   "ha": "md5",                                     // hash算法   │
│   "tn": "__jsl_clearance_s",                       // cookie名   │
│   "vt": "3600",                                    // 有效期(s)  │
│   "wt": "1500"                                     // 超时(ms)   │
│ }                                                               │
│                                                                 │
│ 核心逻辑（暴力匹配）：                                            │
│   for char1 in chars:                                           │
│     for char2 in chars:                                         │
│       candidate = bts[0] + char1 + char2 + bts[1]               │
│       if hash(ha, candidate) == ct:                             │
│         → __jsl_clearance_s = candidate  ✅ 找到！               │
│                                                                 │
│ ha 可能是 "md5" / "sha1" / "sha256"，每次请求动态变化             │
│ chars 长度通常 ~20 字符 → 最坏情况 400 次 hash 运算，很快          │
│                                                                 │
│ ✅ 解法：提取 go() 参数 → Python 双层 for 循环暴力匹配            │
│         → 得到最终 __jsl_clearance_s                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓ 携带 __jsluid_s + 最终 __jsl_clearance_s
┌─────────────────────────────────────────────────────────────────┐
│ 第三次请求 (200)                                                 │
│                                                                 │
│ GET https://beian.miit.gov.cn/                                  │
│ Cookie: __jsluid_s=xxx; __jsl_clearance_s=最终值                 │
│ → Status: 200                                                   │
│ → Body: 真实 HTML 页面内容 ✅                                    │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.4.3 Cookie 格式

```
__jsl_clearance_s = {timestamp}|{version}|{hash_value}
例: 1780032502.474|0|k/Dv0h1uB6XfTLK3HyF/Z85AqNc=
```

- `timestamp`: 生成时间戳
- `version`: 版本号（通常 0 或 -1）
- `hash_value`: URL 编码的 base64/hash 值

#### 3.4.4 Python 实现伪代码

```python
import hashlib, json, re, requests, execjs

def get_jsl_cookies(target_url):
    session = requests.Session()
    
    # === 第一次请求: 521 → AAEncode → 第一层 cookie ===
    resp1 = session.get(target_url)  # status 521
    # __jsluid_s 自动存入 session.cookies (Set-Cookie)
    # 提取 AAEncode 内容
    aa_content = re.findall('cookie=(.*?);location', resp1.text)[0]
    first_clearance = execjs.eval(aa_content).split(';')[0]
    # first_clearance = "__jsl_clearance_s=1658906704.109|-1|7n4k..."
    session.cookies.set('__jsl_clearance_s', first_clearance.split('=')[1])
    
    # === 第二次请求: 521 → OB混淆 → go() 参数 → 暴力匹配 ===
    resp2 = session.get(target_url)  # status 521
    go_params = json.loads(re.findall(r';go\((.*?)\)</script>', resp2.text)[0])
    final_clearance = brute_force_jsl(go_params)
    session.cookies.set('__jsl_clearance_s', final_clearance)
    
    # === 第三次请求: 200 → 真实页面 ===
    resp3 = session.get(target_url)  # status 200
    return session  # 后续所有请求使用此 session

def brute_force_jsl(params):
    """暴力匹配 __jsl_clearance_s"""
    bts = params['bts']        # ["timestamp|ver|prefix", "suffix"]
    chars = params['chars']    # "vUzQIgam..."
    ct = params['ct']          # 目标 hash
    ha = params['ha']          # "md5" / "sha1" / "sha256"
    
    hash_func = {'md5': hashlib.md5, 'sha1': hashlib.sha1, 'sha256': hashlib.sha256}[ha]
    
    for i in range(len(chars)):
        for j in range(len(chars)):
            candidate = bts[0] + chars[i] + chars[j] + bts[1]
            digest = hash_func(candidate.encode()).hexdigest()
            if digest == ct:
                return candidate  # 这就是最终的 __jsl_clearance_s 值
    
    raise Exception("JSL brute force failed - no match found")
```

## 4. 验证码

- **类型**: 滑块拼图 + 点选文字（双模式）
- **获取接口**: `POST /pquery/image/getCheckImagePoint`
- **图片格式**: Base64 编码 (data:text/javascript;base64,...)
- **识别方案**:
  - 滑块: OpenCV 模板匹配（`cv2.matchTemplate`）计算偏移
  - 点选: ddddocr 识别文字位置 + OpenCV 定位

## 5. 完整请求流程

```
Step 1: 获取 JSL Cookie（三次请求）
  ├─ Req1: GET → 521 → __jsluid_s (Set-Cookie) + AAEncode → 第一层 __jsl_clearance_s
  ├─ Req2: GET → 521 → OB混淆 → go({bts,chars,ct,ha}) → 暴力匹配 → 最终 __jsl_clearance_s
  └─ Req3: GET → 200 → 真实页面 ✅

Step 2: 获取 Token
  └─ POST /api/auth {authKey: MD5("test"+"test"+ts), timeStamp: ts}
  └─ → JWT token (有效期 ~480s)

Step 3: 获取验证码
  └─ POST /pquery/image/getCheckImagePoint {clientUid: xxx}
  └─ → uuid + slider_big_image + slider_small_image

Step 4: 校验验证码 → 获取 sign
  ├─ 滑块: POST /pquery/image/checkImage {key: uuid, value: offset}
  └─ 点选: POST /pquery/image/checkImage {token, secretKey, clientUid, pointJson}
  └─ → sign

Step 5: 备案查询
  └─ POST /pquery/icpAbbreviateInfo/queryByCondition
     headers: {token, uuid, sign}
     body: {pageNum, pageSize, unitName, serviceType}
  └─ → 备案数据
```

## 6. 实现方案

### 推荐：纯 Python（所有模块均可 Python 实现）

| 模块 | 实现方式 | 难度 | 说明 |
|------|---------|------|------|
| JSL 第一层 | `re` 正则 + `execjs.eval()` | ⭐ | AAEncode 解密，PyExecJS2 调 Node.js |
| JSL 第二层 | `hashlib` 暴力匹配 | ⭐⭐ | 提取 go() 参数 → 双层循环 → hash 比对 |
| authKey | `hashlib.md5(b"testtest"+ts).hexdigest()` | ⭐ | 纯算，无依赖 |
| Token 请求 | `requests.post` | ⭐ | 标准 HTTP |
| 滑块偏移 | OpenCV `cv2.matchTemplate` | ⭐⭐ | 模板匹配 |
| 点选加密 | `pycryptodome` AES/ECB/PKCS7 | ⭐⭐ | key = `"abcdefgabcdefg12"` |
| Token 刷新 | `requests.get` + 缓存检测 | ⭐ | 480s 有效期自动续 |

### 关键风险与对策

| 风险 | 等级 | 对策 |
|------|------|------|
| JSL AAEncode 内容格式变化 | 中 | 正则兼容多种写法，fallback 到 Node.js 执行 |
| JSL hash 算法动态切换 | 低 | 已支持 md5/sha1/sha256 三种，暴力匹配仅需 ~400 次 |
| 验证码识别精度 | 中 | OpenCV 模板匹配 + 容错重试机制 |
| Token 有效期仅 480s | 低 | 缓存 token，过期前自动用 refresh 接口续期 |
| IP 频率限制 | 中 | 请求间隔控制 + 失败退避 |
| JSL cookie 过期（~1h） | 低 | 检测 521 响应自动重新走三次请求流程 |

### 环境要求

```
# Python 依赖
pip install requests PyExecJS2 pycryptodome opencv-python ddddocr

# 系统依赖
Node.js 20+  (PyExecJS2 需要 Node.js 运行时)
```

### 文件结构

```
sites/beian_miit_gov_cn/
├── plan.md                    # 本文件
├── README.md                  # 站点概述
└── src/
    ├── main.py                # 主入口：完整备案查询流程
    ├── jsl_cookie.py          # 加速乐 cookie 获取（三次请求）
    ├── auth.py                # Token 获取与刷新
    ├── captcha.py             # 验证码识别（滑块+点选）
    └── encrypt.py             # AES/ECB 加密（点选坐标）
```

## 7. 开发优先级

1. **P0 — JSL Cookie**: `jsl_cookie.py` 三次请求流程（阻塞项，没有 cookie 无法访问任何接口）
2. **P1 — Token**: `auth.py` authKey 生成 + token 获取/缓存/刷新
3. **P2 — 验证码**: `captcha.py` 滑块模板匹配 + `encrypt.py` 点选 AES 加密
4. **P3 — 主流程**: `main.py` 串联所有模块，完成完整查询流程

# beian.miit.gov.cn — 工信部备案查询逆向

> ICP/IP 地址/域名信息备案管理系统，纯协议查询备案数据

## 接口信息

| 接口 | URL | Method | 说明 |
|------|-----|--------|------|
| 获取 Token | `/icpproject_query/api/auth` | POST | `application/x-www-form-urlencoded` |
| 获取验证码 | `/icpproject_query/api/image/getCheckImagePoint` | POST | `application/json` |
| 校验滑块 | `/icpproject_query/api/image/checkImage` | POST | `application/json` |
| 备案查询 | `/icpproject_query/api/icpAbbreviateInfo/queryByCondition` | POST | `application/json` |

**Base URL**: `https://hlwicpfwc.miit.gov.cn/icpproject_query/api`

## 加密方式

### Token（MD5）

```python
authKey = MD5("test" + "test" + timestamp_ms).hexdigest()
```

- 硬编码凭据: `account="test"`, `secret="test"`（源码 `app.*.js` module `"0075"`）
- Token 字段名: `bussiness`（拼写错误的 business）
- 有效期: ~300 秒

### 滑块验证码（无加密）

- 获取验证码图片（Base64），识别缺口偏移量
- `checkImage` 请求: `{"key": uuid, "value": "offset_px"}`
- **容差约 ±3px**，6 次错误后 UUID 锁定

### 点选验证码（AES/ECB/PKCS7）

```python
key = "abcdefgabcdefg12"  # 16 字节默认密钥
pointJson = AES_ECB_PKCS7_Base64(json.dumps([{x, y}...]), key)
```

### JSL Cookie（加速乐 CDN）

查询接口被加速乐 CDN 拦截，需携带 `__jsluid_s` cookie：

1. 请求 `https://hlwicpfwc.miit.gov.cn/` → `Set-Cookie: __jsluid_s=xxx`
2. 携带该 cookie 访问 API

**注意**: auth/captcha/check 接口不强制要求 JSL cookie，但 query 接口必须带。

## 请求流程

```
Step 1: Token
  POST /api/auth  {authKey, timeStamp}
  → bussiness (JWT token)

Step 2: 验证码
  POST /api/image/getCheckImagePoint  {clientUid}
  → {uuid, bigImage, smallImage}

Step 3: 滑块校验
  POST /api/image/checkImage  {key: uuid, value: offset}
  → sign

Step 4: 备案查询（需要 __jsluid_s cookie）
  POST /api/icpAbbreviateInfo/queryByCondition
  headers: {token, uuid, sign}
  body: {pageNum, pageSize, unitName, serviceType}
  → {total, list[{unitName, domain, serviceLicence, ...}]}
```

## 使用

```bash
# 安装依赖
pip install requests opencv-python ddddocr pycryptodome

# 运行
cd sites/beian_miit_gov_cn/src
python main.py www.baidu.com
python main.py "腾讯云"        # 按公司名查询
```

## 文件说明

```
sites/beian_miit_gov_cn/
├── README.md          # 本文件
├── plan.md            # Phase 3 逆向执行方案（接口/参数/加密详情）
└── src/
    ├── main.py        # 主入口：完整查询流程
    ├── captcha.py     # 验证码识别（云码 API + OpenCV 兜底）
    ├── encrypt.py     # AES/ECB 加密（点选坐标）
    ├── jsl_cookie.py  # 加速乐 Cookie 获取（三次请求）
    └── auth.py        # Token 获取与缓存刷新
```

## 依赖

| 包 | 用途 |
|----|------|
| `requests` | HTTP 请求 |
| `opencv-python` | 滑块图片处理（兜底） |
| `ddddocr` | 验证码识别（兜底） |
| `pycryptodome` | AES/ECB/PKCS7 加密 |
| 云码 API | 滑块偏移量识别（主力，需 API Token） |

## 注意事项

- **IP 限制**: 连续多次验证码失败后 IP 会被临时封禁（~5 分钟），请控制请求频率
- **Token 有效期**: 约 300 秒，脚本会自动刷新
- **验证码时效**: 获取后约 5-10 秒内必须提交，且 6 次错误后 UUID 锁定
- **云码 API**: `captcha.py` 中的 `CLOUD_API_TOKEN` 需配置有效 token

# B站密码登录 - 纯协议实现

纯本地 Python 实现 B站密码登录，包含极验 v3 点选验证码自动识别，不依赖浏览器自动化。

## 文件结构

```
sites/bilibili_login/
├── README.md
└── src/
    ├── main_v2.py         # 主脚本 - 完整登录流程
    ├── geetest_crypto.js  # 极验 w 参数加密模块 (Node.js)
    ├── rsa_encrypt.py     # B站 RSA 密码加密
    ├── package.json       # Node.js 依赖声明
    └── node_modules/      # Node.js 依赖
```

## 环境要求

- Python 3.10+ (项目虚拟环境 `./venv`)
- Node.js 20+
- 云码 (YunMa) API Token (用于验证码识别)

## 安装

```bash
# 1. Python 虚拟环境 (项目根目录)
python -m venv venv
venv\Scripts\activate
pip install requests pycryptodome

# 2. Node.js 依赖
cd sites/bilibili_login/src
npm install
```

## 使用方法

```bash
# 项目根目录执行
.\venv\Scripts\python.exe sites/bilibili_login/src/main_v2.py <手机号/邮箱> <密码>
```

### 示例

```bash
.\venv\Scripts\python.exe sites/bilibili_login/src/main_v2.py 13800138000 mypassword123
```

## 配置

在 `main_v2.py` 中修改以下常量：

| 常量 | 说明 | 默认值 |
|------|------|--------|
| `YUNMA_TOKEN` | 云码 API Token | 内置测试 Token |
| `TEST_USERNAME` | 默认用户名 | `testuser_bl_2026` |
| `TEST_PASSWORD` | 默认密码 | `testPwd@2026!Abc` |

也可以通过命令行参数传入用户名和密码，无需修改代码。

## 登录流程

```
Step 1  B站 captcha API     → 获取 gt, challenge, token
Step 2  B站 key API         → 获取 RSA 公钥 + hash
Step 3  极验 get.php + w    → fullpage 初始化, 获取 c/s, 保存 AES key
Step 4  极验 ajax.php + w   → 获取验证码类型 (click)
Step 5  极验 get.php        → 获取点选验证码图片
Step 6  云码 API            → 识别验证码坐标
Step 7  极验 ajax.php + w   → 提交坐标, 获取 validate
Step 8  B站 login POST      → 提交登录
```

### 验证码失败重试

脚本内置 3 次重试机制。如果某次验证码识别/验证失败，会自动重新获取验证码并重试。

## 加密算法说明

### w 参数 (极验)

```
w = custom_base64(AES_CBC(JSON.stringify(data))) + RSA(key).hex()
```

- **AES-128-CBC**: IV 为 16 个 ASCII 字符 `'0'`，PKCS7 填充
- **自定义 Base64**: 字符集 `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()`
- **RSA**: PKCS#1 v1.5，固定公钥

### Key 复用机制

| 步骤 | 请求 | AES Key | RSA 后缀 |
|------|------|---------|----------|
| Step 3 | get.php | 新生成随机 key | 有 |
| Step 4 | ajax.php | 复用 Step 3 的 key | 无 |
| Step 7 | ajax.php | 复用 Step 3 的 key | 有 |

### 密码加密

```
encrypted = RSA_PKCS1v15(hash + password, public_key)
```

`hash` 为 B站 key API 返回的 salt，`public_key` 为 PEM 格式 RSA 公钥。

## 常见问题

**Q: 返回 `-629 用户名或密码错误`**
A: 账号或密码不正确。确认使用的是 B站注册手机号或邮箱，密码无误。

**Q: 验证码识别失败**
A: 检查云码 API Token 是否有效，余额是否充足。可在 `main_v2.py` 中替换 `YUNMA_TOKEN`。

**Q: `duration short` 错误**
A: 脚本已内置等待逻辑模拟真实用户行为。如仍出现，可能是网络延迟导致时间估算偏差。

**Q: Node.js 报错 `Cannot find module`**
A: 确认在 `sites/bilibili_login/src/` 目录下执行过 `npm install`。

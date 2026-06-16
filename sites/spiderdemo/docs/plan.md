# OB Challenge1 逆向执行方案

## 1. 接口信息

| 接口 | URL | Method | Content-Type |
|------|-----|--------|-------------|
| 注册登录 | `/admin_I/api/auth/register` | POST | `application/json` |
| 初始化挑战 | `/ob/api/challenge/init/` | GET | - |
| 获取页面数据 | `/ob/api/ob_challenge1/page/{page}/` | GET | - |
| 提交答案 | `/ob/api/challenge/submit/` | POST | `application/json` |

## 2. 请求参数

| 参数名 | 类型 | 说明 | 是否加密 |
|--------|------|------|----------|
| `challenge_type` | string | 固定值 `ob_challenge1` | 否 |
| `timestamp` | int | 毫秒级时间戳 | 否 |
| `page` | int | 页码 1-100 | 否 |
| `sign` | string | `hex_md5(f"{timestamp}{page}")` | **是** |
| `answer` | int | 100页数字总和 | 否 |
| `sessionid` | cookie | 注册/登录后自动设置 | 否 |

## 3. 加密方式（已实证）

- **加密函数**: `hex_md5` (位于 `/static/js/obfuscation/ob_challenge1.js`)
- **算法类型**: MD5
- **核心机制**: 标准 MD5，原始输入后追加固定 salt
- **Salt**: `b'\xa3\xac\xa1\xa3fdjf,jkgfkl'`
- **实证依据**:
  - Hook `hex_md5`，输入 `"17770093438622"` → 输出 `"a25c4c9bbb143ca43d88ca5198a23ad3"`
  - Python `MD5(b"17770093438622" + salt)` → 完全一致
  - 标准 MD5 无 salt 结果不同，证实 salt 必要性

## 4. 验证码
- 无验证码

## 5. 实现方案
- [x] 纯算还原（Python `hashlib.md5` 直接复现）
- [ ] 补环境（无需）

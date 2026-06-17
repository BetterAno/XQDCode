# 闲鱼搜索加密分析

## mtop 签名

### 生成流程

1. **获取 token**: 从 `_m_h5_tk` Cookie 提取
   - 格式: `token_timestamp`
   - 取 `_` 前的部分作为 token

2. **构建签名字符串**:
   ```
   to_sign = token + '&' + t + '&' + appKey + '&' + data
   ```

3. **MD5 哈希**:
   ```
   sign = md5(to_sign)
   ```

### 参数说明

| 参数 | 来源 | 说明 |
|------|------|------|
| token | `_m_h5_tk` Cookie | 32字符 |
| t | 当前时间 | 毫秒时间戳 |
| appKey | 固定值 | 34839810 |
| data | 请求体 | JSON 字符串 |

### 特点

- **纯算实现**: 无需浏览器环境
- **需要登录态**: `_m_h5_tk` Cookie 由服务端生成
- **token 有效期**: 与 Cookie 过期时间一致

## 关键文件

| 文件 | 说明 |
|------|------|
| `src/xianyu_search_api.py` | 主脚本（含 mtop 签名实现） |
| `cookies.txt` | 登录 Cookie |

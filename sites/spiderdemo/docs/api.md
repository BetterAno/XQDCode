# API 接口文档

## 注册并登录

```
POST /admin_I/api/auth/register
Content-Type: application/json
```

### 请求体

```json
{
  "username": "test_user",
  "email": "test@example.com",
  "password": "test123456",
  "confirmPassword": "test123456"
}
```

### 响应示例

```json
{
  "success": true,
  "message": "注册成功！已自动登录",
  "user": {
    "user_id": "...",
    "username": "test_user"
  }
}
```

**注意**: 注册成功后会自动设置 `sessionid` Cookie，后续请求需保持同一 Session。

## 初始化挑战

```
GET /ob/api/challenge/init/?challenge_type=ob_challenge1
```

### 响应示例

```json
{
  "success": true,
  "challenge_type": "ob_challenge1",
  "page_data": [2788, 3945, 9702, 9839, 7800, 7170, 4637, 5665, 7123, 8271],
  "total_pages": 100,
  "current_page": 1,
  "message": "新挑战已初始化 (ob_challenge1)",
  "has_passed_before": false
}
```

## 获取页面数据

```
GET /ob/api/ob_challenge1/page/{page}/?challenge_type=ob_challenge1&sign={sign}&timestamp={timestamp}
```

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 是 | 页码，1-100 |
| challenge_type | string | 是 | 固定值 `ob_challenge1` |
| sign | string | 是 | MD5 签名 |
| timestamp | int | 是 | 毫秒级时间戳 |

### 响应示例

```json
{
  "success": true,
  "challenge_type": "ob_challenge1",
  "page_data": [9781, 2612, 6988, 4236, 4695, 7416, 6297, 7222, 7628, 3626],
  "current_page": 1,
  "total_pages": 100,
  "message": "成功获取第1页数据 (ob_challenge1)"
}
```

## 提交答案

```
POST /ob/api/challenge/submit/
Content-Type: application/json
```

### 请求体

```json
{
  "challenge_type": "ob_challenge1",
  "answer": 5546823
}
```

### 响应示例

```json
{
  "success": true,
  "challenge_type": "ob_challenge1",
  "message": "答案正确！",
  "is_correct": true,
  "submitted_answer": 5546823
}
```

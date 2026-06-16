# 丰巢登录逆向工程

## 项目概述

目标: https://fcbox.com/pages/user/login.html

丰巢官网登录系统，包含会员登录和快速登录两种方式。会员登录需要通过滑块验证码验证。

## 技术栈

- **Python**: 主登录脚本
- **Node.js**: 滑块轨迹加密
- **OpenCV**: 滑块缺口检测
- **AdsPower**: 浏览器自动化（备选）

## 项目结构

```
sites/fcbox/
├── src/
│   ├── login.py           # 主登录脚本
│   ├── slider_solver.py   # 滑块验证码识别模块
│   ├── slider_encrypt.js  # Node.js滑块轨迹加密
│   └── browser_captcha.py # 浏览器辅助验证（备选）
├── docs/                  # 文档目录
├── assets/
│   ├── js/               # 下载的JS源码
│   └── screenshots/       # 验证码截图
└── README.md
```

## 接口分析

### 1. 获取滑块验证码

```
POST https://acs.fcbox.com/captcha/querySlideImage/{uuid}
Body: {}
Response:
{
  "code": 400100000,
  "data": {
    "checkId": "xxx",
    "clientIp": "113.xxx.xxx.xxx",
    "key": "xxx",
    "pointX": 0,
    "pointY": 68,
    "shadeImageUrl": "https://...",
    "slideImageUrl": "https://..."
  }
}
```

### 2. 验证滑块

```
POST https://acs.fcbox.com/captcha/checkCode/{uuid}
Body:
{
  "data": "加密数据",
  "int8": false
}
Response (成功):
{"code": 0, "data": {"token": "xxx"}, "success": true}
```

### 3. 登录

```
POST https://fcbox.com/accountManage/loginCheck
Body:
{
  "username": "xxx",
  "password": "RSA加密后的密码",
  "verifyCode": "滑块验证token"
}
```

## 加密方式

### 滑块验证码
- 签名: `md5(clientIp + checkId + uuid + 轨迹字符串)`
- 轨迹格式: `[{x, y, time}, ...]`
- AES加密请求数据

### 登录密码
- RSA加密 (PKCS1Padding)
- 公钥从 `/noshiro/getPublicKey` 获取

## 使用方法

### 1. 滑块验证码识别测试

```bash
python src/login.py --test-slider --attempts 10
```

### 2. 完整登录测试

```bash
python src/login.py --username <用户名> --password <密码>
```

### 3. 使用浏览器辅助验证

```python
from browser_captcha import BrowserCaptchaSolver

solver = BrowserCaptchaSolver()
token = solver.get_captcha_token_via_browser()
```

## 注意事项

1. **滑块验证码难度较高**: 纯算法方案的成功率不稳定
2. **备选方案**: 可使用浏览器自动化完成滑块验证
3. **轨迹生成**: 需要生成人类-like滑动轨迹以通过风控

## 状态

- [x] Phase 0-3: 情报收集、协议分析、加密定位、方案确认
- [x] Phase 4: 核心模块实现完成
- [ ] 滑块缺口检测算法优化
- [ ] 浏览器辅助方案完善
- [ ] 端到端登录测试

## 参考资料

- 滑块验证码JS源码: `assets/js/fc_slider_v2.0.js`
- 登录JS源码: `https://fcbox.com/js/page/user/login.js`

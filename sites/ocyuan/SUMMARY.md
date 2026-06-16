# 欧创源酒店验证码逆向分析总结

## 📅 日期
2026-04-22

## ✅ 已完成的工作

### 1. AST 反混淆分析
- **工具**: ast-deobfuscation skill
- **目标文件**: xxxxbbbb.js (983.8KB, 14376行)
- **混淆类型**: cn-bidding-ob (OB变种)
- **反混淆结果**: 成功生成 9 步流水线输出
- **关键发现**: 
  - 包含 jsrsasign RSA加密库 (第4883-4888行)
  - 使用 `_0x` 前缀变量命名
  - 字符串表和自定义解码函数

### 2. collectData 接口加密机制分析
- **接口地址**: `https://captcha.tuyacn.com/verify/v1/collectData`
- **加密方式**: RSA-2048 + AES 混合加密
- **请求结构**:
  ```json
  {
    "type": 1,
    "challenge": "s_xxx",
    "verifyId": "v_xxx",
    "collectData": "Base64(AES加密的行为数据)",
    "key": "Base64(RSA加密的AES密钥)",
    "callback": "verify_xxx"
  }
  ```
- **数据特征**:
  - `collectData`: 3000-4800 字符 (Base64)
  - `key`: 344 字符 (Base64，解码后 256 字节 = RSA-2048)

### 3. 浏览器动态调试
- **工具**: MCP Chrome DevTools
- **Hook 成果**: 成功捕获 4 次 collectData 请求
- **关键函数定位**:
  - `sendCollect`: 位于第 97673 行（混淆代码）
  - 调用栈: `sendCollect` → Promise → 加密函数
- **发现**: `_0x37e87c` 是 `Object.assign`，非加密函数

### 4. 文件清理
- 删除了 35+ 个临时测试文件和调试脚本
- 删除了反混淆临时目录 (deob/, deobf_output/)
- 删除了验证码截图和中间产物
- 保留了核心工作文件（见下文）

## 📁 保留的核心文件

### Python 核心模块
1. **captcha_solver.py** (10.3KB) - 验证码求解器
   - 轨迹生成
   - xposition 解密
   - 验证提交

2. **gap_detector.py** (4.1KB) - 缺口检测器
   - OpenCV 图像处理
   - 滑块缺口识别

3. **login.py** (11.6KB) - 登录流程控制器
   - 完整登录流程
   - 验证码集成

4. **login_complete.py** (9.6KB) - 完整登录实现

5. **login_encrypt.py** (11.8KB) - 登录加密模块

6. **aes_encryptor.py** (2.7KB) - AES 加密器

7. **image_restorer.py** (6.7KB) - 图像还原工具

### JavaScript 工具
8. **hook_collect_data.js** (4.4KB) - collectData 请求 Hook 脚本
   - 拦截 XMLHttpRequest
   - 捕获加密数据

### 数据文件
9. **collectdata_captured.json** (5.0KB) - 捕获的真实 collectData 请求

### 源码文件
10. **xxxxbbbb.js** (983.8KB) - 主混淆 JS 文件（已反混淆）
11. **yrule.js** (742.4KB) - 涂鸦验证码核心库
12. **yrule-0.2.23.js** (742.4KB) - yrule 版本备份

### 分析脚本
13. **analyze_captured_collectdata.py** (7.6KB) - 分析捕获数据
14. **analyze_collect_data.py** (1.4KB) - collectData 分析

## 🔍 加密流程推断

```
1. 生成随机 AES 密钥 (16/32 字节)
   ↓
2. AES 加密行为采集数据
   ├─ 输入: 鼠标轨迹、设备信息、时间戳等
   ├─ 输出: collectData (Base64)
   └─ 长度: ~3000-4800 字符
   ↓
3. RSA-2048 加密 AES 密钥
   ├─ 公钥来源: /v3/api/hotel/getPublicKey
   ├─ 输出: key (Base64)
   └─ 长度: 344 字符 (256 字节)
   ↓
4. POST 到 /verify/v1/collectData
```

## 🎯 待完成的工作

### Phase 1: 加密函数定位 ⏳
- [ ] 在浏览器中断点调试 `sendCollect` 函数
- [ ] 查看 `_0x40fc80` 对象的完整内容
- [ ] 定位真正的 AES 加密函数（不是 Object.assign）
- [ ] 提取 AES 加密参数 (mode, padding, iv)

### Phase 2: 加密逻辑还原 ⏳
- [ ] 确认 AES 加密模式 (CBC/ECB/GCM)
- [ ] 确认填充方式 (PKCS7/Zero)
- [ ] 确认 IV 生成方式
- [ ] 确认 RSA 加密的公钥格式

### Phase 3: Python 实现 ⏳
- [ ] 实现 AES 加密函数
- [ ] 实现 RSA 加密函数
- [ ] 实现行为数据采集模拟
- [ ] 完整测试验证

## 📊 关键数据

### 捕获的 collectData 请求示例
- **challenge**: `s_GWnPBPf0mT2ycyDcoGvhp71lYMmFImxr`
- **verifyId**: `v_EVoY1s1iGnAgOLOAuEvDPYjg1ofZE0zt`
- **collectData 长度**: 4620 字符
- **key 长度**: 344 字符
- **callback**: `verify_1776854443115`

### 调用栈信息
```
at _0x22949d.<computed>.<computed> [as sendCollect] (<anonymous>:9:97673)
at _0x3d99bd (<anonymous>:9:76839)
at Object.next (<anonymous>:9:74916)
at <anonymous>:9:74129
at new Promise (<anonymous>)
at _0x37dc29 (<anonymous>:9:73358)
```

## 🛠 使用的工具

1. **ast-deobfuscation** - JS 反混淆
2. **chrome-devtools MCP** - 浏览器动态调试
3. **Python** - 数据分析和脚本编写
4. **OpenCV** - 图像处理（缺口检测）

## 📝 备注

- 反混淆后的代码仍然包含 25915 个 `_0x` 标识符，需要进一步处理
- 真正的加密函数可能在 yrule.js 中，需要进一步定位
- 建议下一步使用 web-reverse-algorithm skill 进行深入分析

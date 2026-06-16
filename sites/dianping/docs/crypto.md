# 大众点评 H5 加密分析文档

## 加密架构总览

H5guard SDK v4.2.0 使用自研 aS VM 执行签名逻辑。

### 字符串表 XOR 解码

```javascript
// 密钥种子: "3n2l3o2f2"
// 解码: parseInt("3n2l3o2f2", 28) >> 21 → XOR key
// c(n) → 解码字符串表第 n 项
// 每个字符串用 XOR 加密: hex_bytes XOR key → decodeURIComponent
```

### 关键解码字符串

| c(index) | 解码值 | 用途 |
|----------|--------|------|
| c(327) | "apply" | 函数调用 |
| c(339) | "undefined" | 类型检查 |
| c(705) | "@0" | 初始化入口 |
| c(696) | "3n2l3o2f2" | XOR 密钥种子 |
| c(673) | "this" | 上下文引用 |
| c(674) | "-^" | 原型链分隔符 |
| c(675) | "-%" | 分隔符 |

## aS VM 操作码 (部分)

VM 是栈式解释器，操作码从字节码文件逐字节读取。

| 操作码 | 操作 | 说明 |
|--------|------|------|
| 0-1 | PUSH | 压入 true/false |
| 2 | PUSH_STRING | 从字符串池压入 |
| 3 | PUSH_CONST | 从常量池压入 |
| 4 | POP | 弹出栈顶 |
| 5-6 | SWAP/DUP | 栈操作 |
| 7 | SET_PROP | ly[property] = value |
| 8-9 | GET_SET | 获取/设置全局变量 |
| 10 | JUMP_IF_FALSE | 条件跳转 |
| 11-13 | JUMP/JUMP_TABLE | 跳转 |
| 14 | NEW_FUNC | 创建闭包 |
| 15 | CALL | 调用函数 (mf.apply(mg, mc)) |
| 16 | NEW | new 构造调用 |
| 17 | RETURN | 返回 |
| 18-20 | EQ/NEQ | 相等/不等比较 |
| 21-22 | STRICT_EQ/STRICT_NEQ | 严格相等 |
| 23-28 | LT/GT/LE/GE/ADD | 比较和算术 |
| 30-34 | SUB/MUL/DIV/MOD/NOT | 算术和逻辑 |
| 35-36 | BIT_NOT/BIT_OR | 位运算 |
| 37-38 | BIT_AND/BIT_XOR | 位运算 |
| 39-41 | SHL/SHR/USHR | 位移 |
| 42 | INSTANCEOF | 类型检查 |
| 43 | TYPEOF | typeof 操作 |
| 45 | REGEXP | 正则表达式 |
| 46-47 | IN/FOR_IN | in 操作符/for-in |
| 48-50 | TRY_CATCH | 异常处理 |
| 51-57 | OBJECT/ARRAY/NULL/UNDEFINED | 数据结构 |

## 环境参数 (b[] 外部函数)

### MD5 (b[4])

标准 MD5 哈希，用于 a3 生成和 d1 签名。

### k9 (b[3]) / k7 (b[5]): 字符串→字节数组

将字符串转为 charCode 或字节数组，用于编码。

### k6 (b[15]) / k1 (b[25]): 数字→4字节数组

数字转为大端序 4 字节数组。

### k5 (b[17]): 字节数组→hex

将字节数组转为 hex 字符串，用于 a8 和 d1。

### f9 (b[18]): getId

返回设备指纹 ID (a3/dfpId)。

### 设备指纹 (b[0])

Uint8Array，256 个 4 字节整数 = 1024 字节，包含 canvas/webgl/字体等指纹数据。

### 会话 Token (b[1])

格式: `h1.{Base64(AES(env_json))}`，与 a6 格式相同。可在多次请求间复用。

### Custom Base64 (real_b_data.json)

```json
["Z","m","s","e","r","b","B","o","H","Q","t","N","P","+","w","O","c","z","a","/","L","p","n","g","G","8","y","J","q","4","2","K","W","Y","j","0","D","S","f","d","i","k","x","3","V","T","1","6","I","l","U","A","F","M","9","7","h","E","C","v","u","R","X","5"]
```

H5guard 使用自定义 Base64 字母表，与标准 Base64 不同。

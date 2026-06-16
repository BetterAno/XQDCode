# 加密分析文档

## 混淆函数分析

### 目标函数
- **名称**: `hex_md5`
- **位置**: `/static/js/obfuscation/ob_challenge1.js`
- **混淆特征**: Unicode 特殊字符作为标识符、控制流平坦化

### 原始混淆代码

```javascript
function hex_md5(ﱠﱣﱣﱠۦﱣ){
    return ﱣﱞﱠﱠﱞۥ(ۥﱞﱣﱣﱠۥ(ۥۥۦﱟۥﱣ(
        ﱠﱣﱣﱠۦﱣ+='\xa3\xac\xa1\xa3\x66\x64\x6a\x66'+'\x2c\x6a\x6b\x67\x66\x6b\x6c'
    ), ﱠﱣﱣﱠۦﱣ[" ",'\x6c\x65\x6e'+'\x67\x74\x68']*ﱣۥﱣۦۥۥ));
}
```

### 还原后逻辑

```javascript
function hex_md5(input) {
    const salt = '\xa3\xac\xa1\xa3fdjf,jkgfkl';
    input += salt;
    return md5(input, input.length * 8);  // length in bits
}
```

## Salt 提取过程

1. 在浏览器中 Hook `hex_md5`，记录输入输出
2. 对比标准 MD5 与 Hook 输出，发现不一致
3. 分析混淆代码中的字符串拼接段，提取 `
\xa3\xac\xa1\xa3fdjf,jkgfkl`
4. Python 验证：`MD5(input + salt)` 与浏览器输出完全一致

## 对齐验证数据

| 输入 | 浏览器输出 | Python 输出 | 结果 |
|------|-----------|------------|------|
| `17770093438622` | `a25c4c9bbb143ca43d88ca5198a23ad3` | `a25c4c9bbb143ca43d88ca5198a23ad3` | ✅ 一致 |
| `17770093438622` (标准 MD5) | - | `25f557fc3e7310b1fc591f4ba3436997` | ❌ 不一致 |

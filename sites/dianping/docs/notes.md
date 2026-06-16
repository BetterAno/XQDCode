# 大众点评 H5 调试笔记

## 2026-05-26 深度分析: 纯算阻塞点确认

### 关键结论

1. **a9 = "4.2.0,7,undefined"** — 与 b[24] (jP) 无关，根因是 **b[7] (eU) 缺少 eU[0]**
2. **a10 = b[21] (jN)** 直出 — 当前固定为 "cc"（来自捕获），需改为随机
3. **d1 temp_array 非固定** — 4组浏览器样本验证：d1 XOR MD5 数组每次请求都不同
4. **a8 后缀 "c60ce40f"** — 可能与固定 b[1] token 相关，需新token验证

### b[] 完整映射 (28个元素)

| idx | var | 类型 | 说明 |
|-----|-----|------|------|
| 0 | jT | Uint8Array(1056) | 设备指纹 66×16 |
| 1 | jQ | string | 会话 token (h1.{AES}) — 可能过期 |
| 2 | — | number | 时间戳 |
| 3 | k9 | function | encodeURIComponent → charCode[] |
| 4 | aO | function | Custom MD5 → 16-char hex |
| 5 | k7 | function | hex → byte[] |
| 6 | jO | object | 签名状态 |
| 7 | eU | array | **eU[0]=lB, 缺失→a9 undefined** |
| 8 | eR | object | VM环境 |
| 9 | gV | object | 数据状态 |
| 10 | iP | array | [24] |
| 11 | cW | function | Custom Base64 |
| 12 | cO | function | Sub-VM (RC4) |
| 13 | ka | function | MurmurHash |
| 14 | m3 | array | 请求行 charCode[] |
| 15 | k6 | function | number→4bytes (BE) |
| 16 | jM | boolean | flag |
| 17 | k5 | function | byte[]→hex |
| 18 | f9 | function | → dfpId (a3) |
| 19 | jS | string | "1.2" |
| 20 | aa | object | URL utils |
| 21 | jN | string | **a10 → 需随机化** |
| 22 | aP | function | MD5→words |
| 23 | aQ | function | MD5 words→hex |
| 24 | jP | number | counter (与a9无关) |
| 25 | k1 | function | number→4bytes (BE) |
| 26 | iF | string | "" |
| 27 | ao | function | noop |

## 2026-05-26: VM 独立运行成功 + 混合签名器完成

### VM 核心修复

1. **Node.js v22 兼容**: `undefined['apply']` 在 v22 中抛出 TypeError（旧版本返回 undefined）
   - Opcode 15 (CALL): 添加 `mf!=null&&` 前缀 → `mf!=null&&mf[c(327)]&&`
   - Opcode 16 (NEW): 添加 `ma!=null` 检查 → if/else 分支
   - Opcode 46 (IN): 添加 `lN!=null?` 检查
   - Opcode 52 (constructor): 添加 `mi!=null?` 检查

2. **环境缺失修复**:
   - `z` 函数: `typeof` 操作符在 VM 中未定义，用 `function z(v){return typeof v}` 解决
   - `navigator`: 从 `var` 改为 `global.navigator`（VM 通过 `li`(global) 回退访问）

### 混合签名器架构

```
hybrid_signer.js
  ├── VM 计算: a8 (三数组 XOR), a5, a6, a3, a2, d1
  ├── 纯算修复: a9 ("4.2.0,7,{rand}")
  └── d1 重算: temp_array = MD5(concat_undefined) XOR VM_d1
                   new_d1 = MD5(concat_fixed) XOR temp_array
```

### 反混淆管线

- normalize (789ms) + prune (482ms) 完成
- inline_dispatchers: try-catch 防御性修复，VM路径优先

### 关键发现

1. H5guard 使用自定义 Base64 字母表
2. b[0] 指纹数据为 66×16=1056 字节
3. VM 字节码 10178 字节，实例 hash: dfdb71b1fa2738418bb11c4f7d70fb2c
4. d1 = MD5(encodeURIComponent(concat)) XOR temp_array
5. temp_array 每次请求动态变化，不可硬编码

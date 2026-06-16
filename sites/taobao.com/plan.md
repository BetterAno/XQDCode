# 淘宝 PC 搜索逆向 Plan

## 当前阶段：Phase 3 → Phase 4

## 1. 已完成

### ✅ `sign` — 纯算确认
```
sign = MD5(token + "&" + t + "&" + appKey + "&" + data)
```
- `token` = `_m_h5_tk` Cookie 中 `_` 前 32位 hex
- `t` = 13位毫秒时间戳
- `appKey` = `12574478`
- `data` = 请求 body 中 data 参数的 JSON 值

### ✅ `bx-umidtoken` — 会话固定
- 格式 `T2gA...`，整个浏览器会话完全相同
- 可直接复用不需每次生成

### ✅ AWSC 架构清晰
- `awsc.js` (78KB) 调度器，拦截 XHR/Fetch
- `et_f.js` (2MB) 实际实现，VM 式混淆
- 初始化三阶段：`default_not_fun` → `defaultFY3_not_initialized` → `234!`/`T2g`

## 2. 待解决

### ⚠️ `bx-ua` / `bx_et` — 需要 AWSC SDK 计算
- `et_f.js` 2MB 混淆代码，Node.js 补环境复杂度高
- 需要全浏览器 API 模拟（Canvas/WebGL/DOM/Cookie）
- 当前优先策略：从浏览器复用

### ⚠️ 风控限制
- 缺少 AWSC 参数 → `RGV587_ERROR::SM` (recommend API)
- script 类型 JSONP 请求不需要 AWSC 参数

## 3. 实现方案

### Phase 4 策略
1. **`sign` 纯算** → Python MD5 实现 ✅
2. **`bx-umidtoken` 复用** → 从浏览器刷新会话
3. **`bx-ua` / `bx_et`** → 
   - 短期：浏览器桥接获取（evaluate_script）
   - 长期：Node.js 补环境 or 深度逆向 et_f.js

### Python 客户端
- 实现 MTOP sign 生成器
- 维护 Cookie 会话（含 `_m_h5_tk`）
- 支持注入 AWSC 参数

## 4. 验证计划
- ✅ sign 公式 → check_sign.py 通过
- [ ] 真实端到端请求（含 AWSC 参数时）
- [ ] Cookie 刷新机制

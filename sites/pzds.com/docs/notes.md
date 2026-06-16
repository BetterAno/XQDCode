# pzds.com 阶段快照

## Snapshot — 2026-06-15 (Round 2)

- **Time**: 2026-06-15
- **Route**: B (js-reverse-mcp)
- **Scope**: a4 编码函数内部流程
- **Confirmed**:
  - `script_200_raw.js` 与浏览器 script:10 是同一脚本（kyDFBf IIFE, 56KB）
  - a4 执行顺序: case `6→7→9→8→5`
  - `encodeURIComponent` override 依赖 `pzversion=undefined` 触发 `"undefinedpost"` 匹配
  - `aY = N.r = globalThis`（Node.js中）
  - `aY.Math.random` → 浏览器 `Z` 值; `aY.JSON.stringify` → 浏览器 `W` 值
  - `M()` 返回缓存值 `y = "2284953104a19eca83024b"`
  - PRNG: `B` 调度器用 `v[v.length-1] % t` 作为种子，Node.js 环境初始化路径不同
- **Gap**:
  - PRNG 状态差异导致 `a2(ag)`, `w()` 在不同环境产出不同值
  - 浏览器 a2_ag="7623a744517623a7", w()=268713984 (单次快照，不可复用)
  - encode_full_cli.js 产出 ~101 字符 vs 浏览器 ~260 字符
  - 未做 E2E 验证 (需要新鲜 WAF cookies)
- **Next**:
  1. 获取新鲜 cookies 做 E2E 验证
  2. 如失败 → 对齐 v.length / PRNG 状态

## Snapshot — 原始记录 (Round 1)

- **Time**: ~2026-06-13
- **Route**: B (js-reverse-mcp)
- **Scope**: 接口流量 + sign 验证 + script_200 加载
- **Confirmed**:
  - sign = WASM generate_sign(body, method, ts, rnd) → 32位MD5, 5/5 验证通过
  - encodeURIComponent override 模式: `"undefinedpost"` 前缀检测
  - go=790 注入成功
  - gC() canary 绕过成功
- **Gap**:
  - decode__1174 产出格式正确但 LZ 压缩参数不匹配
  - w()/M() 依赖 Storage 缓存
- **Next**: 浏览器断点提取 Z/W/T/l/Q/y

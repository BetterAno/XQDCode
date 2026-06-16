# 阶段快照

## Snapshot 1 - 抓包完成 (14:20)
- Route: B (js-reverse-mcp)
- Scope: 搜索接口 /aweme/v1/web/general/search/single/
- Confirmed: 44参数, a_bogus(192chars), msToken(bdms生成), 拦截器链完整

## Snapshot 2 - 请求矩阵 (14:29)
- 浏览器 AB(192) + msToken → ✅ 9 items
- 本地 AB(168) + msToken → ❌ 0 items (静默失败)

## Snapshot 3 - 视频详情对照 (14:45)
 - 本地 AB(168) → 视频详情 ✅ 有效
 - 浏览器 AB(192) → 视频详情 ✅ 有效
 - 搜索接口只接受 192-char 格式，视频详情接受两种

## Snapshot 4 - 根因定位 (14:50)

### 字节结构对比

| 来源 | a_bogus | 解码字节 | string1 | core | browser_code |
|------|---------|:------:|:------:|:----:|:----------:|
| 本地(旧) | 168 char | 124 | 12 | **44** | 67(MacIntel) |
| 浏览器(新) | 192 char | 142 | 12 | **65** | 64(Win32) |
| 差值 | +24 | +18 | 0 | **+21** | -3 |

### 根因
- bdms 1.0.1.19 有 3 个执行路径 (168/172/192 char)
- 本地 `abogus_local.py` 只实现了 44-byte core (168-char 路径)
- 搜索接口要求 65-byte core (192-char 路径)
- 视频详情接口兼容两种格式

### list_4 缺陷
- `p`/`q` 值 > 255 (timestamp/2^32 ≈ 414) → latin-1 编码损坏
- 参考实现用 `generate_result` (JS UTF-16 code unit 编码) 避开此问题

## Snapshot 5 - bdms 字节码深度分析 (14:50-16:00)
- bdms.js 成功下载 (147KB) 并解码 VM 数据 (86KB)
- 字符串表: 1001 条目，含 XMLHttpRequest、msToken、searchParams 等
- 字节码: 74 条目，entry[41] (pc=2, bc_len=196) 是 a_bogus 生成器
- entry[41] 使用 11 个数据字符串 (496-504+36+52)，内含 sub-bytecode (ca=202 opcode)
- 多级 VM 解释器使完整反汇编需要大量时间

## Snapshot 6 - ShilongLee/Crawler 新版移植 (16:00)
- 从 GitHub 获取 douyin.js (15KB)，移植到 Python (abogus_new.py, 164 char)
- 关键差异：44 元素 bb vs 浏览器 65 元素 bb
- SM3 hash 验证通过，编码/解码 roundtrip 验证通过
- 但 164-char 格式对搜索接口无效（仅视频详情接口接受）

## Next
- **短期可用**: 浏览器 oracle (src/browser_bogus.py)
- **长期目标**: 完整 bdms VM 多级解释器模拟，提取 65 元素 bb 结构

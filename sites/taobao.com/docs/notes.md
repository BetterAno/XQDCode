# 阶段快照

## Snapshot 4 — 端到端验证通过 ✅
- Time: 2026-06-10
- Route: Python 协议请求
- Scope: Python → MTOP 网关端到端数据获取
- Confirmed:
  - ✅ `sign = MD5(token&t&appKey&data)` 公式正确
  - ✅ 4/5 API 成功获取真实数据：recommend / getUserSimple / queryBagCount / checkCollect
  - ✅ 关键：必须使用浏览器请求头中的完整 Cookie（含 cookie1/cookie2/uc3/uc4/isg/sgcookie 等）
  - ✅ AWSC 参数仅部分 API 需要（singleview）
  - ✅ 所有 MTOP API 用 POST 方式，GET 会返回 FAIL_SYS_ILLEGAL_ACCESS
- Gap:
  - singleview API 需要 AWSC 参数（bx-ua/bx_et）
  - Cookie 有时效性，需定期刷新
- Next: 封装最终 Python 客户端

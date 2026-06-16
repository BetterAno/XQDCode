# 阶段快照

## Snapshot 1
- Time: 2026-05-26 14:00
- Route: 路线 B (js-reverse-mcp)
- Scope: union.jd.com 秒杀专区 → api.m.jd.com/api
- Confirmed:
  - 接口: GET api.m.jd.com/api?functionId=unionSearchRecommend
  - 核心签名: h5st v5.3，10段分号分隔
  - sign 入口: ParamsSign.sign({functionId, appid, body})
  - body = SHA-256(JSON.stringify(params))，无排序
  - _stk = "appid,body,functionId"
  - SDK: js_security_v3_0.1.5.js (VM 字节码混淆)
  - Token/Fingerprint 存储: localStorage WQ_dy1_tk_algo
- Gap:
  - VM _$sdnmd 内部完整签名构建未完全反编译
  - 段5、8、9 的具体生成算法未独立验证
- Next:
  - 方案A: Node.js 补环境运行 SDK (推荐)
  - 方案B: 深入反编译 VM 字节码 (耗时长)

## Snapshot 2
- Time: 2026-05-26 14:30
- Route: 路线 B
- Scope: 动态 Hook sign 输入输出
- Confirmed:
  - sign 输入: {functionId, appid, body:SHA256(JSON.stringify(params))}
  - sign 输出: 增加 _stk, _ste, h5st
  - SDK 实例: _appId=586ae, _version=5.3, _token/fingerprint 从 localStorage 获取
  - SDK 内部 algos: {MD5, SHA256, HmacSHA256, HmacMD5}
- Gap:
  - 简单 MD5/HmacSHA256 对构造字符串的测试未匹配到段5/段9
  - Token 需要先解码，签名 key 从 token 派生
- Next: 尝试 Node.js 补环境

## Snapshot 3
- Time: 2026-05-26 14:56
- Route: 路线 B (Node.js 补环境)
- Scope: sign.js 生成 h5st → Python requests → api.m.jd.com/api
- Confirmed:
  - Node.js sign.js 生成的 h5st 通过服务端验证 (code:200)
  - 返回13条真实商品数据
  - 必需请求头: Cookie, User-Agent, Accept, Referer, Origin, x-referer-page, x-rp-client
  - body 参数使用 URL-encoded JSON (无空格, separators=(",", ":"))
  - 关键 Cookie: __jda (uuid), 3AB9D23F7A4B3CSS (eid token), sdtoken
  - x-api-eid-token 值 = 3AB9D23F7A4B3CSS cookie 值
- Gap:
  - Token 有效期 86400s，过期后需刷新 (sso.jd.com/sso/rac)
  - Cookie/session 可能过期
- Next: 编写 Python 主流程 jd_client.py，更新 api.md

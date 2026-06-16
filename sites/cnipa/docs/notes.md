# 阶段快照 - 欧冶钢铁平台 (ouyeel.com)

## Snapshot 1 - Phase 1/2 初步完成
- Time: 2026-06-01 18:30
- Route: B (js-reverse-mcp)
- Scope: 页面整体 + XHR 数据接口 + 加密参数定位
- Confirmed:
  1. 页面重定向 cnipa.gov.cn → ouyeel.com/steel/search
  2. 防护类型: 瑞数 JSVMP
  3. K5nOZLud (96字符) 附加到所有 XHR URL
  4. 瑞数 Cookie: T0k1m0u5AfREP / T0k1m0u5AfREO

## Snapshot 2 - 补环境 P cookie 生成成功 + 请求测试
- Time: 2026-06-01 19:00
- Route: Node.js 补环境 (ruishu-env-patch)
- Scope: P cookie 生成 + API 请求验证
- Confirmed:
  1. ✅ P cookie 生成成功: decrypt_js_code (202KB) 正确执行
  2. ✅ 环境属性补全无 MISS  (第二轮: 0个MISS)
  3. ✅ EXEC#1 内联VM代码(260KB)生成成功
  4. ⚠️ _$h3() 失败: _$fw() 返回 null → 无法生成 K5nOZLud 后缀
  5. ⚠️ 测试结果:
     - 仅 P cookie: API 返回 202 + 新瑞数挑战 (nsd=51192)
     - P cookie + 浏览器后缀: curl 返回 400 (TLS重协商 → TLS指纹绑定)
- Gap:
  1. _$fw() 返回 null - VM上下文初始化依赖未满足的环境属性
  2. 服务端有TLS指纹/会话绑定
  3. K5nOZLud 生成算法未提取
- Next:
  1. 修复 _$fw() null 问题 (补充VM需要的环境对象)
  2. 或跳过 _$h3(), 直接从已生成的VM代码中提取后缀算法
  3. 尝试用 requests + TLS 库绕过指纹检测

# 京东联盟 (union.jd.com) 协议逆向

## 目标
- 还原 `h5st` 签名参数，实现 Python 直接请求 `api.m.jd.com/api`
- 目标接口：`unionSearchRecommend` (秒杀专区商品列表)

## 技术栈
- JD h5st v5.3 签名
- VM 字节码混淆 (`js_security_v3_0.1.5.js`)
- CryptoJS (SHA-256, HMAC-SHA256, MD5, HMAC-MD5)

## 进度
- [x] Phase 1: 接口分析
- [x] Phase 2: 加密逻辑定位
- [ ] Phase 3: Plan 确认
- [ ] Phase 4: 代码还原

## 文件结构
- `plan.md` - 实施方案
- `docs/api.md` - 接口文档
- `docs/crypto.md` - 加密逻辑分析
- `docs/notes.md` - 阶段快照
- `src/` - 还原代码

# 闲鱼搜索 API 协议版 - 笔记

## Snapshot
- Time: 2026-06-17
- Route: B (js-reverse-mcp 分析, 纯算实现)
- Scope: 闲鱼搜索 API 纯协议复现
- Confirmed: mtop 签名纯 Python 实现，无需浏览器
- Gap: Cookie 需手动更新（_m_h5_tk 有效期有限）
- Next: 可选 - Cookie 自动续期

## 与 xianyu.com 的区别

| 对比项 | xianyu.com | xianyu_api.com |
|--------|-----------|----------------|
| 数据获取 | Playwright 注入 JS DOM 解析 | Python requests + mtop 签名 |
| 签名 | 浏览器自动处理 | **纯 Python MD5 算法** |
| 截图 | Playwright | Playwright（相同） |
| XLSX | openpyxl | openpyxl（相同） |
| 登录 | 需要浏览器登录态 | 需要 Cookie（_m_h5_tk） |

## 使用方法

```bash
# 搜索
python src/xianyu_search_api.py 手机壳 --pages 3

# 截图+XLSX
python src/xianyu_search_api.py --from-json 手机壳_xianyu_2026-06-17.json

# 全流程
python src/xianyu_search_api.py --auto 手机壳
```

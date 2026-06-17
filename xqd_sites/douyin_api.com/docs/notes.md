# 抖音搜索 API 协议版 - 笔记

## Snapshot
- Time: 2026-06-17
- Route: B (js-reverse-mcp 补环境)
- Scope: 抖音搜索 API 纯协议 + 截图 + XLSX
- Confirmed: Node.js 签名 + Python requests 完整流程可用
- Gap: Cookie 需手动更新
- Next: 可选 - Cookie 自动续期

## 与 douyin.com 的区别

| 对比项 | douyin.com | douyin_api.com |
|--------|-----------|----------------|
| 数据获取 | Playwright 浏览器注入 JS | Python requests + Node.js 签名 |
| 截图 | Playwright | Playwright（相同） |
| XLSX | openpyxl | openpyxl（相同） |
| 浏览器依赖 | 全程依赖 | 仅截图时依赖 |

## 使用方法

```bash
# 模式1: 搜索
python src/douyin_search_api.py 八段锦

# 模式2: 截图+XLSX
python src/douyin_search_api.py --from-json 八段锦_douyin_2026-06-17.json

# 模式3: 全流程
python src/douyin_search_api.py --auto 八段锦
```

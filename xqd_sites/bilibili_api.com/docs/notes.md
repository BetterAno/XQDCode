# B站搜索 API 协议版 - 笔记

## Snapshot
- Time: 2026-06-17
- Route: B (js-reverse-mcp 分析, 纯算实现)
- Scope: B站搜索 API 纯协议复现
- Confirmed: WBI 签名纯 Python 实现，无需浏览器
- Gap: 密钥可能定期更换
- Next: 可选 - 密钥缓存、更多筛选条件

## 与 bilibili.com 的区别

| 对比项 | bilibili.com | bilibili_api.com |
|--------|-------------|------------------|
| 数据获取 | Playwright 注入 JS DOM 解析 | Python requests + WBI 签名 |
| 签名 | 浏览器自动处理 | **纯 Python MD5 算法** |
| 截图 | Playwright | Playwright（相同） |
| XLSX | openpyxl | openpyxl（相同） |
| 登录 | 需要浏览器登录态 | **无需登录** |

## 使用方法

```bash
# 搜索
python src/bilibili_search_api.py 八段锦 --pages 3

# 截图+XLSX
python src/bilibili_search_api.py --from-json 八段锦_bilibili_2026-06-17.json

# 全流程
python src/bilibili_search_api.py --auto 八段锦
```

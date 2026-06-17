# B站搜索采集 - API 协议版

纯协议请求 + 自动截图 + XLSX 导出，不依赖浏览器自动化采集。

## 原理

- **数据获取**: Python requests + WBI 签名算法（纯算，无需浏览器）
- **签名**: WBI（img_key + sub_key → mixin_key → MD5 签名）
- **截图**: Playwright 打开详情页截图（仅截图用）
- **导出**: openpyxl 生成 XLSX（含封面图+截图嵌入）

## 使用方法

```bash
cd xqd_sites/bilibili_api.com

# 模式1: API 搜索 → JSON
python src/bilibili_search_api.py 八段锦
python src/bilibili_search_api.py 八段锦 --pages 3

# 模式2: JSON → 截图 → XLSX
python src/bilibili_search_api.py --from-json 八段锦_bilibili_2026-06-17.json

# 模式3: 一键全流程
python src/bilibili_search_api.py --auto 八段锦
python src/bilibili_search_api.py --auto 八段锦 --pages 3 --no-captcha
```

## 依赖

- Python: requests, playwright, openpyxl, Pillow
- Chrome: 截图用

## WBI 签名

B站搜索使用 WBI 签名，流程：
1. 从 `nav` API 获取 `img_key` + `sub_key`
2. 通过固定索引表生成 32 位 `mixin_key`
3. 参数排序 + 过滤特殊字符 + 附加 `wts`
4. `MD5(params + mixin_key)` → `w_rid`

**纯算实现，无需浏览器环境。**

## 文件结构

```
bilibili_api.com/
├── README.md
├── src/
│   └── bilibili_search_api.py  # 主脚本
├── screenshots/                # 截图目录
└── docs/
    ├── api.md
    ├── crypto.md
    └── notes.md
```

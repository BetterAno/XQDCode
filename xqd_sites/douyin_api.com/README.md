# 抖音搜索采集 - API 协议版

纯协议请求 + 自动截图 + XLSX 导出，不依赖浏览器自动化采集。

## 原理

- **数据获取**: Python requests + Node.js 签名（补环境运行 webmssdk）
- **截图**: Playwright 打开详情页截图（仅截图用，非采集）
- **导出**: openpyxl 生成 XLSX（含封面图+截图嵌入）

## 使用方法

```bash
cd xqd_sites/douyin_api.com

# 模式1: API 搜索 → JSON
python src/douyin_search_api.py 八段锦
python src/douyin_search_api.py 八段锦 --pages 3

# 模式2: JSON → 截图 → XLSX
python src/douyin_search_api.py --from-json 八段锦_douyin_2026-06-17.json

# 模式3: 一键全流程
python src/douyin_search_api.py --auto 八段锦
python src/douyin_search_api.py --auto 八段锦 --pages 3 --no-captcha
```

## 依赖

- Python: requests, playwright, openpyxl, Pillow
- Node.js: jsdom (签名器环境)
- Chrome: 截图用

## Cookie

搜索需要登录态 Cookie。从浏览器 DevTools → Application → Cookies 复制到 `cookies.txt`。

## 文件结构

```
douyin_api.com/
├── README.md
├── cookies.txt          # 浏览器 Cookie
├── webmssdk.es5.js      # 签名 SDK
├── src/
│   ├── douyin_search_api.py  # 主脚本
│   └── signer.js             # Node.js 签名器
├── screenshots/         # 截图目录
└── docs/
    ├── api.md
    ├── crypto.md
    └── notes.md
```

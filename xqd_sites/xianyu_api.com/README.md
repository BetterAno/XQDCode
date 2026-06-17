# 闲鱼搜索采集 - API 协议版

纯协议请求 + 自动截图 + XLSX 导出，不依赖浏览器自动化采集。

## 原理

- **数据获取**: Python requests + mtop 签名算法（纯算）
- **签名**: `sign = md5(token + '&' + t + '&' + appKey + '&' + data)`
- **截图**: Playwright 打开详情页截图（仅截图用）
- **导出**: openpyxl 生成 XLSX（含商品图+截图嵌入）

## 使用方法

```bash
cd xqd_sites/xianyu_api.com

# 模式1: API 搜索 → JSON
python src/xianyu_search_api.py 手机壳
python src/xianyu_search_api.py 手机壳 --pages 3

# 模式2: JSON → 截图 → XLSX
python src/xianyu_search_api.py --from-json 手机壳_xianyu_2026-06-17.json

# 模式3: 一键全流程
python src/xianyu_search_api.py --auto 手机壳
```

## 依赖

- Python: requests, playwright, openpyxl, Pillow
- Chrome: 截图用

## Cookie

搜索需要登录态 Cookie（`_m_h5_tk` 等）。从浏览器 DevTools → Application → Cookies 复制到 `cookies.txt`。

## mtop 签名

闲鱼使用阿里 mtop 签名，流程：
1. 从 `_m_h5_tk` Cookie 提取 token（`_` 前的部分）
2. `sign = md5(token + '&' + timestamp + '&' + appKey + '&' + data)`
3. appKey = `34839810`

**纯算实现，无需浏览器环境。**

## 文件结构

```
xianyu_api.com/
├── README.md
├── cookies.txt          # 浏览器 Cookie
├── src/
│   └── xianyu_search_api.py  # 主脚本
├── screenshots/         # 截图目录
└── docs/
    ├── api.md
    ├── crypto.md
    └── notes.md
```

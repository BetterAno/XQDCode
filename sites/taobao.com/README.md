# 淘宝搜索商品采集

## 项目结构

```
sites/taobao.com/
├── README.md              ← 本文档
├── extract_search.js      ← 浏览器 Console 提取脚本
├── src/
│   ├── taobao_search.py   ← 主入口（全部功能，含 3 个 Step）
│   └── mtop_client.py     ← MTOP 协议客户端（保留）
├── screenshots/           ← 商品详情页截图存放
├── chrome_profile/        ← Chrome 用户数据（保持登录态）
└── docs/
    ├── api.md
    ├── crypto.md
    └── notes.md
```

## 工作流（3 步，一个脚本完成）

```
python src/taobao_search.py                         # Step1: 生成提取脚本
python src/taobao_search.py --screenshot data.json  # Step2: 截图详情页
python src/taobao_search.py --to-xlsx data.json     # Step3: 生成 XLSX
```

### Step 1：提取商品数据（浏览器 Console）

```bash
# 交互输入关键词
python src/taobao_search.py

# 或直接指定关键词
python src/taobao_search.py --keyword 耳机
```

按提示操作：
1. 浏览器打开 `https://s.taobao.com/search?q=耳机`
2. F12 → Console → 粘贴脚本 → 回车
3. 自动滚动加载 → 下载 `耳机_taobao_2026-06-10.json`

输出格式：仅 JSON，文件名 = `{关键词}_taobao_{日期}.json`

### Step 2：自动截图商品详情页

```bash
python src/taobao_search.py --screenshot 耳机_taobao_2026-06-10.json
```

执行流程：
1. 自动启动 Chrome（Profile 自带登录态，无需重复登录）
2. 直接逐条打开商品详情页 → 截图 → 保存到 `screenshots/{itemId}.png`
3. 自动跳过已有截图（支持断点续传）

### Step 3：生成 XLSX（含截图）

```bash
python src/taobao_search.py --to-xlsx 耳机_taobao_2026-06-10.json
```

XLSX 列：序号、店铺名、标题、售价、地址、销量、详情页链接、商品图片、itemId、**商品详情页截图**（图片嵌入单元格）

## 依赖安装

```bash
pip install playwright openpyxl Pillow
```

## 代码结构

`src/taobao_search.py` 按功能分 4 块，便于排查：

| 区块 | 行内标记 | 职责 |
|------|---------|------|
| 配置 | `0. 配置` | 路径、常量、XLSX 列定义 |
| 工具函数 | `1. 工具函数` | 日志、Chrome 查找、文件名生成、路径解析 |
| Step 1 | `Step 1: 生成浏览器提取脚本` | 关键词输入 → 输出 Console 粘贴脚本 |
| Step 2 | `Step 2: 商品详情页截图` | Playwright 自动截图（依赖检查→加载→增量跳过→截图） |
| Step 3 | `Step 3: JSON → XLSX` | openpyxl 生成带截图的 Excel 文件 |
| 主入口 | `主入口` | 命令行参数分发 |

## JSON 数据字段

| 字段 | 说明 |
|------|------|
| `itemId` | 商品 ID |
| `title` | 商品标题 |
| `price` | 售价（含优惠信息） |
| `sales` | 销量 |
| `shopName` | 店铺名 |
| `location` | 发货地 |
| `detailUrl` | 详情页链接 |
| `image` | 商品主图 URL |

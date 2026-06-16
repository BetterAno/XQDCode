# Boss 直聘 职位搜索 API 协议请求

使用 **登录态 Cookie + curl_cffi TLS 指纹 + Chrome 147 完整 headers** 直接调用 Boss 直聘职位搜索接口 `wapi/zpgeek/search/joblist.json`，一次性返回 `code=0`。

## 目录结构

```
sites/zhipin/
├── README.md                   # 本文件
├── assets/
│   └── js/                     # security JS 缓存（兜底用）
└── src/
    ├── signer.py               # 主脚本（登录态模式 + code=37 兜底）
    ├── cookie_config.json      # 登录态配置
    ├── env/
    │   └── env.js              # Node.js 补环境脚本（code=37 兜底时才使用）
    └── output/                 # 响应落盘目录
```

## 快速开始

### 1. 环境依赖

```bash
pip install curl_cffi
# 兜底用：需要 Node.js（v18+）
node -v
```

### 2. 获取登录态 Cookie

1. 用普通 Chrome / Edge **登录** Boss 直聘（必须登录，未登录会 `code=38`）
2. 访问职位搜索页：`https://www.zhipin.com/web/geek/jobs?city=100010000&query=python`
3. 按 `F12` → **Network** → 在列表里找任意一次 `joblist.json` 请求
4. 右键该请求 → `Copy` → `Copy as cURL (bash)` 或直接在 **Headers** 面板复制 `Cookie:` 的值
5. 把整串 Cookie 粘贴到 `src/cookie_config.json` 的 `raw_cookie` 字段

### 3. 运行

```powershell
cd sites\zhipin\src
python signer.py              # 默认搜索 python
python signer.py 后端           # 自定义关键词
```

**期望输出：**

```
[INFO] Boss直聘 登录态模式请求
[INFO] 加载 cookie: 11 项
[INFO]   wt2: DnjGua8SS3JKc5O3gKXBd_1AVRuKVxp4iAaCmuJM...
[INFO]   zp_at: HgfxRbAskjzZX44qaFI84nZbUqGzRf9YrFkRjXEB...
[INFO] HTTP 200, body 24012 B
[INFO] API code=0, message=Success
[INFO] ✅ 成功！共 347 条，本页返回 15 条
[INFO]   [1] 【联想】Ai Python @ 中科软 ...
```

## cookie_config.json 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| `raw_cookie` | ✅ | 浏览器复制的整串 Cookie，**必须包含 `wt2`、`zp_at`** 登录态字段 |
| `user_agent` | ✅ | Chrome 147 的完整 UA，需和浏览器实际值保持一致 |
| `sec_ch_ua` | ✅ | Client Hints，如 `"Chromium";v="147", "Not.A/Brand";v="8"` |
| `sec_ch_ua_platform` | ✅ | 平台，如 `"Windows"` / `"macOS"` |
| `query_keyword` | ✅ | 默认搜索关键词 |
| `city_code` | ✅ | 城市代码，如 `100010000`=全国 |

## 关键技术点

### 1. 登录态是核心

服务器校验是**多维联合**的：即使 `__zp_stoken__` 完全正确，没有 `wt2` / `zp_at` 登录态也会被判 `code=38`（"您的环境存在异常，请登录后使用"）。

### 2. Chrome 147 完整 headers 不可少

以下 headers 缺一不可：

```
accept / accept-language / cache-control: no-cache / content-type
origin / pragma: no-cache / priority: u=1, i / referer
sec-ch-ua / sec-ch-ua-mobile: ?0 / sec-ch-ua-platform
sec-fetch-dest: empty / sec-fetch-mode: cors / sec-fetch-site: same-origin
sec-gpc: 1 / traceid / user-agent / x-requested-with: XMLHttpRequest
```

### 3. curl_cffi TLS 指纹

用 `impersonate="chrome131"` 模拟 Chrome 131 的 JA3/JA4 指纹。不使用代理 IP，直接本地直连。

### 4. code=37 兜底流程

`request_joblist()` 若收到 `code=37/38`，会自动：

1. 从响应 `zpData` 读 `seed`/`name`/`ts`
2. 下载对应的 `security-js/{name}.js`
3. 调用 `env/env.js`（Node.js 补环境）生成新 `__zp_stoken__`
4. 替换 cookie 后最多重试 2 次

## 常见问题

### Q1: 返回 `code=38`？

- 检查 `raw_cookie` 是否含有 `wt2` 和 `zp_at`
- 检查 `user_agent` 是否和浏览器一致（访问 `chrome://version/` 查看）
- 检查 `sec_ch_ua` 是否和浏览器一致（`navigator.userAgentData.brands`）

### Q2: 返回 `code=35`？

本地 IP 被 Boss 限流。建议：
- 降低请求频率（当前脚本每轮后不等待，生产环境请加 sleep）
- 换网络环境
- 不要使用公共代理 IP（会被直接标记）

### Q3: Cookie 多久会过期？

- `wt2` / `zp_at`（登录态）：数天到数周
- `__zp_stoken__`（安全 token）：几小时
- 过期后脚本会自动走 `code=37` 兜底重新生成 `__zp_stoken__`
- 若 `wt2` 也过期，需要重新登录浏览器并更新 `raw_cookie`

## 历史经验：为什么不搞算法逆向？

早期尝试纯算法逆向路径（补环境 161 个浏览器 API、Hook Math.random/crypto、做 z() 确定性测试），结论：

- Token 算法存在**非确定性**（即使固定随机源，同 seed 仍产不同 token）
- 服务器同时校验登录态 + TLS/HTTP2 指纹 + 完整 headers
- 即使提供浏览器**刚生成的真实 token**，curl_cffi 发出去**仍然** `code=38`

**结论：**算法逆向不是问题的主路径。登录态 + 正确 headers 才是最短路径。

## 相关文件

- [signer.py](src/signer.py) — 主脚本
- [cookie_config.json](src/cookie_config.json) — 登录态配置
- [env/env.js](src/env/env.js) — 补环境兜底

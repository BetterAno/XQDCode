# API 接口文档 - 欧冶钢铁平台

## 基础信息
- 域名: www.ouyeel.com
- 协议: HTTPS
- 瑞数后缀参数: `K5nOZLud`（每请求动态变化，96字符）

## 核心数据接口

### 1. 商品搜索 - 结果列表
- **URL**: `POST /search-ng/commoditySearch/queryCommodityResult?K5nOZLud={token}`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Body**: `criteriaJson={...}`
  - `pageSize`: 50
  - `pageIndex`: 0
  - `productType`: null
  - `sort`: null
  - `key_search`: null
  - `jsonParam.keywordAnalyseResult`: null
- **Response**: `{ count: 148622, resultList: "[{...}]", isLogin: "0" }`

### 2. 商品筛选条件
- **URL**: `POST /search-ng/commoditySearch/queryCommodityFilter?K5nOZLud={token}`
- **Content-Type**: `multipart/form-data`
- **Body**: `criteriaJson` (form-data field)
- **Response**: 包含品种/牌号/规格/产地等筛选维度

### 3. 其他接口（均带 K5nOZLud）
| 接口 | Method | 说明 |
|------|--------|------|
| `/account-ng/common/isLogin` | POST | 登录状态检查 |
| `/account-ng/common/getLoginInfo` | POST | 用户信息 |
| `/account-ng/advert/queryDistictList` | POST | 广告区域 |
| `/noauth/data/getHomePageAdvert` | POST | 首页广告 |
| `/search-ng/queryResource/hotSearchWords` | GET | 热门搜索 |
| `/search-ng/queryResource/queryPlatBusinessTime` | POST | 平台交易时间 |
| `/search-ng/commonFrameworkMethods/queryBusinessTime` | POST | 业务时间 |
| `/buyer-ng/resource/getRedisTimes` | GET | 缓存时间 |

## Cookie 传递链
- `T0k1m0u5AfREO` / `T0k1m0u5AfREP`: 瑞数环境 cookie
- `cookiesession1`: 会话 ID
- `SHGTSESSIONID`: 网关会话
- `staticVersion`: 静态资源版本

## 请求特征
- 所有 XHR 请求 URL 带有 `?K5nOZLud={96字符token}`
- 瑞数 token 由 JSVMP 虚拟机动态生成，每次请求不同
- Cookie 中 `T0k1m0u5AfREP` 由瑞数服务端 Set-Cookie

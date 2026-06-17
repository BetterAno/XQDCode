# 抖音搜索 API 接口文档

## 搜索接口

- **URL**: `https://www.douyin.com/aweme/v1/web/general/search/single/`
- **Method**: GET
- **Content-Type**: application/json

## 请求参数

### 固定参数

| 参数 | 值 | 说明 |
|------|-----|------|
| device_platform | webapp | |
| aid | 6383 | |
| channel | channel_pc_web | |
| search_channel | aweme_general | |
| enable_history | 1 | |
| search_source | normal_search | |
| query_correct_type | 1 | |
| is_filter_search | 0 | |
| disable_rs | 0 | |
| need_filter_settings | 0 | |
| list_type | single | |
| pc_client_type | 1 | |
| version_code | 190600 | |
| version_name | 19.6.0 | |
| platform | PC | |
| browser_name | Chrome | |
| browser_version | 146.0.0.0 | |

### 动态参数

| 参数 | 来源 | 说明 |
|------|------|------|
| keyword | 用户输入 | 搜索关键词 |
| offset | 分页 | 0, 10, 20, ... |
| count | 固定 10 | 每页数量 |
| search_id | 时间戳+随机 | 搜索会话 ID |
| a_bogus | frontierSign 签名 | X-Bogus 签名 |
| msToken | Cookie | |
| webid | Cookie/URL | |
| uifid | Cookie (UIFID) | 浏览器指纹 |
| fp / verifyFp | s_v_web_id Cookie | 指纹 ID |

### 签名参数 (X-MS-STUB)

参与签名计算的参数列表：
```
aid, channel, search_channel, keyword, search_source, offset, count, list_type, device_platform, version_code, version_name
```

拼接格式：`aid=6383,channel=channel_pc_web,...` → MD5 → `frontierSign({"X-MS-STUB": hash})`

## 响应结构

```json
{
  "status_code": 0,
  "data": [
    {
      "type": 1,
      "aweme_info": {
        "aweme_id": "视频ID",
        "desc": "标题",
        "author": { "nickname": "作者", "uid": "...", "sec_uid": "..." },
        "video": {
          "cover": { "url_list": ["封面图URL"] },
          "play_addr": { "url_list": ["播放URL"] }
        },
        "create_time": 1759051108
      }
    }
  ]
}
```

## Cookie 要求

必须包含登录态 Cookie（ttwid, sessionid, sid_tt 等），否则返回 `status_code: 2483`。

## 采集时间

- 首次抓包: 2026-06-17

# 抖音搜索接口

## 数据接口

### GET /aweme/v1/web/general/search/single/

| 参数 | 类型 | 说明 |
|------|------|------|
| device_platform | string | webapp |
| aid | string | 6383 |
| channel | string | channel_pc_web |
| search_channel | string | aweme_general |
| enable_history | string | 1 |
| keyword | string | 搜索关键词 |
| search_source | string | normal_search |
| query_correct_type | string | 1 |
| is_filter_search | string | 0 |
| from_group_id | string | (空) |
| disable_rs | string | 0 |
| offset | string | 分页偏移 (0/10/20...) |
| count | string | 每页数量 (10) |
| need_filter_settings | string | 0 |
| list_type | string | single |
| pc_search_top_1_params | string | {"enable_ai_search_top_1":1} (URL-encoded) |
| search_id | string | 搜索标识 (时间戳+随机) |
| update_version_code | string | 170400 |
| pc_client_type | string | 1 |
| pc_libra_divert | string | Windows |
| support_h265 | string | 1 |
| support_dash | string | 1 |
| cpu_core_num | string | CPU 核心数 |
| version_code | string | 190600 |
| version_name | string | 19.6.0 |
| cookie_enabled | string | true |
| screen_width | string | 屏幕宽度 |
| screen_height | string | 屏幕高度 |
| browser_language | string | zh-CN |
| browser_platform | string | Win32 |
| browser_name | string | Chrome |
| browser_version | string | Chrome 版本 |
| browser_online | string | true |
| engine_name | string | Blink |
| engine_version | string | Blink 版本 |
| os_name | string | Windows |
| os_version | string | 10 |
| device_memory | string | 设备内存(GB) |
| platform | string | PC |
| downlink | string | 网速 |
| effective_type | string | 4g |
| round_trip_time | string | RTT |
| webid | string | 设备标识 |
| uifid | string | 用户指纹 (长哈希) |
| verifyFp | string | 验证指纹 (来自 s_v_web_id) |
| fp | string | 验证指纹 (同 verifyFp) |
| msToken | string | **动态 token (bdms.js 生成)** |
| a_bogus | string | **签名 (bdms.js JSVMP 生成)** |

## Request Headers

| Header | 值 |
|--------|-----|
| Accept | application/json, text/plain, */* |
| Referer | https://www.douyin.com/search/{keyword}?... |
| uifid | 与 URL 参数 uifid 一致 |
| Cookie | 包含 ttwid, passport_csrf_token, s_v_web_id, odin_tt 等 |

## 真实样本 (2026-06-11)

```
GET /aweme/v1/web/general/search/single/?
  device_platform=webapp
  &aid=6383
  &channel=channel_pc_web
  &search_channel=aweme_general
  &keyword=%E6%9D%8E%E5%9C%A8%E5%B3%B0%E5%85%AB%E6%AE%B5%E9%94%A6
  &search_source=normal_search
  &offset=10
  &count=10
  &list_type=single
  &search_id=2026061114171740CFC3F911CE1EE086F7
  &webid=7650016773043111467
  &uifid=ed3eadd74fe8fd7fe8cc39b2f8425a87324d41d3f6a0cfdc014da4c26c654051...
  &msToken=modzZP55f9e51wZZWlzgCaPXdakLjmxIeAt7Hqj6KMxeV_7Nla14MSkFb-MS...
  &a_bogus=EXs5kzyimombFV%2FbYOYUt53lP%2F9ANPSyuGi%2FbqoltOwVPwMcg8Nt...
  &verifyFp=verify_mq93oq1f_nGSp7JWC_HMP1_4NOK_A0XE_1FL3RYKrYP4f
  &fp=verify_mq93oq1f_nGSp7JWC_HMP1_4NOK_A0XE_1FL3RYKrYP4f

Response: 200 OK
{"status_code":0,"data":[...]}
```

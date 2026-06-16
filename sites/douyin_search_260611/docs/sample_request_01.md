# 真实搜索请求样本 01

## URL Before bdms (原始参数，无 a_bogus/msToken)

```
device_platform=webapp&aid=6383&channel=channel_pc_web
&search_channel=aweme_general&enable_history=1
&keyword=%E6%9D%8E%E5%9C%A8%E5%B3%B0%E5%85%AB%E6%AE%B5%E9%94%A6
&search_source=normal_search&query_correct_type=1&is_filter_search=0
&from_group_id=&disable_rs=0&offset=10&count=10
&need_filter_settings=0&list_type=single
&pc_search_top_1_params=%7B%22enable_ai_search_top_1%22%3A1%7D
&search_id=20260611143500B1452AC5B1048279F37D
&update_version_code=170400&pc_client_type=1
&pc_libra_divert=Windows&support_h265=1&support_dash=1
&cpu_core_num=8&version_code=190600&version_name=19.6.0
&cookie_enabled=true&screen_width=1920&screen_height=1080
&browser_language=zh-CN&browser_platform=Win32
&browser_name=Chrome&browser_version=146.0.0.0
&browser_online=true&engine_name=Blink&engine_version=146.0.0.0
&os_name=Windows&os_version=10&device_memory=8&platform=PC
&downlink=10&effective_type=4g&round_trip_time=50
&webid=7650016773043111467
&uifid=ed3eadd74fe8fd7fe8cc39b2f8425a87324d41d3f6a0cfdc014da4c26c654051...
```

## bdms Generated Values

- **msToken**: `SSZr7IuzrDlD1JtQZXnM-axwBwdxoRYNmFEB_6CrBnwTvGTE6B8cKoHe5xCwz-fN4zSXL5SqoBtdSurvEsrqd670SWWLukao_vSICCzs0bEO4T7QEW5g87_aQx2qu8ebr4Q_VdyMsaRwUs65YrG-qnQlsJZ5DAJeFfh2nhiznCXDignt3b4SCQ%3D%3D`
- **a_bogus**: `xXs5DzUEQqmfOdMSmCJLHHAUV2LMNTuyati%2FS93UtNodahtOfYPvPNbhaxoy4LLRrSBkkKI7ZxMAbdncuz7TZHrpFmpDuFkyXT2cnSso0qwda0UsEq8wCgzzwwMYlQGulQQ9i9yRls0K2DcWnNCsABV7L%2FvxmcEdBN37VZujT9umUWSjin%2Fca5JkEh0qtD%3D%3D`
- **verifyFp/fp**: `verify_mq93oq1f_nGSp7JWC_HMP1_4NOK_A0XE_1FL3RYKrYP4f`

## a_bogus 解码后

```
xXs5DzUEQqmfOdMSmCJLHHAUV2LMNTuyati/S93UtNodahtOfYPvPNbhaxoy4LLRrSBkkKI7ZxMAbdncuz7TZHrpFmpDuFkyXT2cnSso0qwda0UsEq8wCgzzwwMYlQGulQQ9i9yRls0K2DcWnNCsABV7L/vxmcEdBN37VZujT9umUWSjin/ca5JkEh0qtD==
```

长度: 188 chars

## 对比本地实现

| 来源 | 长度 | 有效性 |
|------|------|--------|
| 浏览器 | 188 | ✅ 9 items |
| 本地 | 168 | ❌ 0 items |

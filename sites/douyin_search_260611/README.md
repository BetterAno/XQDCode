# 抖音搜索接口逆向

目标：分析 `www.douyin.com` 搜索页面的数据接口加密参数。

## 目标接口

`GET https://www.douyin.com/aweme/v1/web/general/search/single/`

## 关键加密参数

- `a_bogus` - 签名参数（已有纯算实现参考 douyin_abogus）
- `msToken` - 动态 token

## 参考

- [douyin_abogus](../douyin_abogus/README.md) - a_bogus 纯算实现

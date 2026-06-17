# 闲鱼搜索 API 接口文档

## 搜索接口

- **URL**: `https://h5api.m.goofish.com/h5/mtop.taobao.idlemtopsearch.pc.search/1.0/`
- **Method**: POST
- **Content-Type**: application/x-www-form-urlencoded

## URL 参数

| 参数 | 值 | 说明 |
|------|-----|------|
| jsv | 2.7.2 | |
| appKey | 34839810 | |
| t | 时间戳(ms) | |
| sign | MD5签名 | 动态生成 |
| v | 1.0 | |
| type | originaljson | |
| accountSite | xianyu | |
| dataType | json | |
| api | mtop.taobao.idlemtopsearch.pc.search | |
| sessionOption | AutoLoginOnly | |

## POST Body

```
data={"pageNumber":1,"keyword":"手机壳","fromFilter":false,"rowsPerPage":30,...}
```

## 签名算法

```
sign = md5(token + '&' + t + '&' + appKey + '&' + data)
```

- token: `_m_h5_tk` Cookie 的 `_` 前部分
- t: 毫秒时间戳
- appKey: 34839810
- data: JSON 请求体

## 响应结构

```json
{
  "ret": ["SUCCESS::调用成功"],
  "data": {
    "resultList": [
      {
        "data": {
          "item": {
            "main": {
              "exContent": {
                "itemId": "商品ID",
                "title": "标题",
                "price": [{"text": "¥"}, {"text": "117"}],
                "picUrl": "图片URL",
                "area": "地区",
                "userNickName": "卖家昵称",
                "want": "想要人数"
              },
              "targetUrl": "详情链接"
            }
          }
        }
      }
    ]
  }
}
```

## 采集时间

- 首次抓包: 2026-06-17
- 需要登录态 Cookie

# B站搜索 API 接口文档

## 搜索接口

- **URL**: `https://api.bilibili.com/x/web-interface/wbi/search/type`
- **Method**: GET
- **Content-Type**: application/json

## 请求参数

| 参数 | 值 | 说明 |
|------|-----|------|
| category_id | (空) | 分类 ID |
| search_type | video | 搜索类型 |
| page | 1,2,3... | 页码 |
| page_size | 42 | 每页数量 |
| keyword | 搜索词 | |
| platform | pc | |
| highlight | 1 | 高亮 |
| w_rid | WBI签名 | 动态生成 |
| wts | 时间戳 | 动态生成 |

## WBI 签名

1. 从 `https://api.bilibili.com/x/web-interface/nav` 获取 `img_key`, `sub_key`
2. 拼接后用固定索引表取 32 位 `mixin_key`
3. 参数排序 + 过滤特殊字符 + `wts`
4. `MD5(params_string + mixin_key)` → `w_rid`

## 响应结构

```json
{
  "code": 0,
  "data": {
    "page": 1,
    "pagesize": 42,
    "numResults": 1000,
    "numPages": 24,
    "result": [
      {
        "type": "video",
        "bvid": "BV1xx411c7mD",
        "title": "标题（含<em>高亮</em>）",
        "author": "作者",
        "mid": 12345,
        "aid": 123456,
        "pic": "//i0.hdslb.com/bfs/archive/xxx.jpg",
        "play": 123456,
        "danmaku": 789,
        "favorites": 123,
        "like": 456,
        "review": 78,
        "duration": "12:34",
        "pubdate": 1700000000,
        "tag": "标签1,标签2",
        "description": "描述"
      }
    ]
  }
}
```

## 采集时间

- 首次抓包: 2026-06-17
- 不需要登录态

import execjs
import pymongo
import requests

db = pymongo.MongoClient()['py_spider']['tv_rank']
js = execjs.compile(open("decrypt.js", encoding="utf-8").read())

headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Referer": "https://www.chinaindex.net/ranklist/5/1",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    # "UUID": "c585834c-3e00-544d-9eb5-54f324b3ba6b",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "funcID": "undefined",
    "incognitoMode": "0",
    "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
url = "https://www.chinaindex.net/iIndexMobileServer/teleplay/rank/waiting/fans"
response = requests.get(url, headers=headers).json()

decrypt_data = response["data"]
lastFetchTime = response["lastFetchTime"]
result = js.call("decrypt_data", lastFetchTime, decrypt_data)

for i in result['rank_list']:
    item = dict()
    item['name'] = i['object_info']['name']
    item['first_platform'] = ', '.join(i['object_info']['first_platform'])
    item['tags'] = ', '.join(i['object_info']['tags'])
    try:
        db.insert_one(item)
        print('数据插入成功:', item)
    except Exception as e:
        print(e)

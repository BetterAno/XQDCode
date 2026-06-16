import requests
import json


headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/json;charset=UTF-8",
    "Origin": "http://www.winshangdata.com",
    "Pragma": "no-cache",
    "Referer": "http://www.winshangdata.com/brandList",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
    "appType": "bigdata",
    "platform": "pc",
    "pwd": "mobile_regist",
    "uid": "ws409980749",
    "uuid": "123456"
}

url = "http://www.winshangdata.com/wsapi/brand/getBigdataList3_4"
data = {
    "isHaveLink": "",
    "isTuozhan": "",
    "isXxPp": "",
    "kdfs": "",
    "key": "",
    "orderBy": "1",
    "pageNum": 3,
    "pageSize": 60,
    "pid": "",
    "qy_p": "",
    "qy_r": "",
    "xqMj": "",
    "ytlb1": "",
    "ytlb2": ""
}
data = json.dumps(data, separators=(',', ':'))
response = requests.post(url, headers=headers, data=data, verify=False)

print(response.text)
print(response)
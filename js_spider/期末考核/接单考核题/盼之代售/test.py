import requests
import json


headers = {
    "globalId": "969a304622c644dba464c5a8a39b6787",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
    "sec-ch-ua-mobile": "?0",
    "PZVersionCode": "1",
    "deviceId": "812d2ffe9a4b4e06a7f8365252cb06d6",
    "x-oss-forbid-overwrite": "true",
    "PZTimestamp": "1772765174689",
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "Skey": "CLIENT",
    "PZOs": "windows",
    "Sign": "e0c1d92b274463b0132b9ca746bf5cd0",
    "Referer": "https://www.pzds.com/",
    "PZVersion": "1.0.1",
    "channelInfo": "{\"channelCode\":null,\"tag\":null,\"channelType\":null,\"searchWord\":\"null\",\"adExtras\":\"\",\"urlParam\":\"\"}",
    "PZPlatform": "pc",
    "Random": "598914",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
}
url = "https://api.pzds.com/api/web-client/v2/public/goodsPublic/page"
params = {
    "decode__1174": "222029ad07-t/v/=PFgLPygeIgrgAP=/GcTItc_Egcc/gh2iLzJgcfxS/psjM=Qis26RUrtZpUAu9Gc/TugAvGQgOP_j08ggEgBPrtgCPTlgtPIXBgbvgj4P=BIgMd8ugaG/taqxk0WGOCZT5u_YSvGahgTcgQY/gYqKOwPAu3_RlWI_ZWAv26T7EuTPcCk=EsA4Pg"
}
data = {
    "order": "ASC",
    "sort": None,
    "page": 2,
    "pageSize": 10,
    "action": {
        "gameId": "7",
        "merchantMark": None,
        "keywords": [],
        "searchWords": [],
        "searchPropertyIds": [],
        "unionGameIds": [],
        "goodsSearchActions": [],
        "goodsCatalogueId": 6,
        "countFlag": False,
        "conditionSearch": False
    }
}
data = json.dumps(data, separators=(',', ':'))
response = requests.post(url, headers=headers, params=params, data=data)

print(response.text)
print(response)
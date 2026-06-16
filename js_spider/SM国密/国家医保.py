import json

import subprocess
from functools import partial
subprocess.Popen = partial(subprocess.Popen, encoding="utf-8")
import execjs
import requests


js_signData = execjs.compile(open("国家医保.js", encoding="utf-8").read())
js_result = execjs.compile(open("get_result.js", encoding="utf-8").read())
js_encData = execjs.compile(open("demo.js", encoding="utf-8").read())
for i in range(1, 3):
    jssignData = js_signData.call("signData", i)
    jsencData = js_encData.call('encData', i)

    headers = {
        # "Accept": "application/json",
        # "Accept-Language": "zh-CN,zh;q=0.9",
        # "Cache-Control": "no-cache",
        # "Connection": "keep-alive",
        "Content-Type": "application/json",
        # "Origin": "https://fuwu.nhsa.gov.cn",
        # "Pragma": "no-cache",
        # "Referer": "https://fuwu.nhsa.gov.cn/nationalHallSt/",
        # "Sec-Fetch-Dest": "empty",
        # "Sec-Fetch-Mode": "cors",
        # "Sec-Fetch-Site": "same-origin",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
        # "X-Tingyun": "c=B|4Nl_NnGbjwY;x=cc5fb861d7c34a6d",
        # "channel": "web",
        # "contentType": "application/x-www-form-urlencoded",
        # "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"云南建筑监管公共服务平台\", \"Google Chrome\";v=\"140\"",
        # "sec-ch-ua-mobile": "?0",
        # "sec-ch-ua-platform": "\"Windows\"",
        # "x-tif-nonce": "s4iu0kfh",
        # "x-tif-paasid": "undefined",
        # "x-tif-signature": "25edd70e7ee77e44e04587d8b53a0f20a28b23b07d1ea7ca8709e9a195016e78",
        # "x-tif-timestamp": "1757583360"
    }
    cookies = {
        "amap_local": "441700",
        "yb_header_active": "-1",
        "acw_tc": "276aede517575833486207153e5d23268c381926630b8de091469ec91e0673"
    }
    url = "https://fuwu.nhsa.gov.cn/ebus/fuwu/api/nthl/api/CommQuery/queryFixedHospital"

    data = {"data": {"data": {
        "encData": jsencData},
        "appCode": "T98HPCGN5ZVVQBS8LZQNOAEXVI9GYHKQ", "version": "1.0.0", "encType": "SM4",
        "signType": "SM2", "timestamp": 1757940710,
        "signData": jssignData}}
    print(data)

    data = json.dumps(data, separators=(',', ':'))
    response = requests.post(url, headers=headers, cookies=cookies, data=data)
    enc_data = response.json()['data']['data']['encData']
    result = js_result.call("get_result", enc_data)
    print(result)
    # print(response.text)

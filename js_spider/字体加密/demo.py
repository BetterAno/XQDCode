import requests


headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Referer": "https://piaofang.maoyan.com/dashboard/movie?movieId=1528577",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "X-FOR-WITH": "1V9XORKdZWQaOgR8AVzV/Wnb18XY1+pDHRcCI2jJ797M9zeTKxhcZpyu2oIJw765ayc6yxdFB4dASrTV9RMMZmA7Ri7ZOicrheZElTeMqIaOUN6zdlQB8KOPc5HkgQX66EiyogtRBmbKLm1QmSnRekY5ll+fY2zma2m+C1qXSe2IyeIWK0UA85/K8kHMes6Z249Y1AZSN1It/a59iXJdc5PJ+FJ6z9d1ckaLyst5QYw=",
    "mygsig": "{\"m1\":\"0.0.3\",\"m2\":0,\"m3\":\"0.0.67_tool\",\"ms1\":\"57c2636074cad89d8b0d35cc34ff9255\",\"ts\":1763553520415,\"ts1\":1763553297013}",
    "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
cookies = {
    "_lxsdk_cuid": "199e3245bf3c8-08ff2e3e316628-26061851-144000-199e3245bf3c8",
    "_lxsdk": "199e3245bf3c8-08ff2e3e316628-26061851-144000-199e3245bf3c8",
    "_lxsdk_s": "19a9bf7c3fa-e11-50f-bda%7C%7C2"
}
url = "https://piaofang.maoyan.com/dashboard-ajax/movie"
params = {
    "movieId": "1528577",
    "orderType": "0",
    "uuid": "199e3245bf3c8-08ff2e3e316628-26061851-144000-199e3245bf3c8",
    "timeStamp": "1763553520074",
    "User-Agent": "TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzE0Mi4wLjAuMCBTYWZhcmkvNTM3LjM2",
    "index": "914",
    "channelId": "40009",
    "sVersion": "2",
    "signKey": "07977c61e71d06ca1f4f6c590960ae53",
    "WuKongReady": "h5"
}
response = requests.get(url, headers=headers, cookies=cookies, params=params)

print(response.text)
print(response)
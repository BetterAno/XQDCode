import json

import execjs
import requests

js = execjs.compile(open("获取请求参数.js", encoding="utf-8").read())

headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/json",
    "Origin": "https://www.pzds.com",
    "PZOs": "windows",
    "PZPlatform": "pc",
    "PZVersion": "1.0.1",
    "PZVersionCode": "1",
    "Pragma": "no-cache",
    "Referer": "https://www.pzds.com/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "Skey": "CLIENT",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "channelInfo": "{\"channelCode\":null,\"tag\":null,\"channelType\":null,\"searchWord\":\"null\",\"adExtras\":\"\",\"urlParam\":\"\"}",
    "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "x-oss-forbid-overwrite": "true"
}
cookies = {
    "_c_WBKFRo": "648NSmOzBCxzNrFl6Htz79TIjOCuYdug9ycf73hZ",
    "_nb_ioWEgULi": "",
    "Hm_lvt_8e2c03f98f8af83cf09317d232baf903": "1765710061",
    "HMACCOUNT": "B33A50A3C10C1055",
    "acw_tc": "0a099c2c17657156539881697e3435ccb879b085c54d9ccbf92ad8060f3fe3",
    "Hm_lpvt_8e2c03f98f8af83cf09317d232baf903": "1765715677",
    "ssxmod_itna": "1-iq_hY5BKD50IjxfxeK4YKxQ93tDpOx7KGHDyx4Q5DODLxn4GQDUDQwQrmSYxWW4/wYrA=7mXYMD05UrDnqD8UDQeDvKg804D0jMh9YBYjeF_qe9=jrb5qbtY_Se8EpWkZpqHjF4z8fHDTk9xIFuiuxYFYrnmDb0Q4DHxi8DBK=Nb0wDeeaDCeDQxirDD4DADiTbIxDRx0kAn8YDi5DjQ8fj/8jRt3D4=x3ft3DbgxpfB2fw4DrL3oD9pjE8xDz81=9dYPDE0jmLSrKRbuRKQSuAD0HrmUFw4DCfuUF9UQgKj1b198LDCKDjghrxGmAWKmhE0pLGcj99Y4Wb4nYB4QFGrF4=Y04t0DITq3_snR4S7e9Bw304Y0DGhFY05y2qhoHDDWMApMBQCED=7eMusxmGKWKw0_K0t=0t0i=0iQChr3Zd=7xpOeXO5ZB5slDtidlQ4YSwoDKrBrWlD4D",
    "ssxmod_itna2": "1-iq_hY5BKD50IjxfxeK4YKxQ93tDpOx7KGHDyx4Q5DODLxn4GQDUDQwQrmSYxWW4/wYrA=7mXYwDDcUYe9cAxGae4w0WD0i02xDlPdScAnUSc8B2zweccGAqKBaSgPp6/pKxX0A6INS7f1F4z2H7oehzhriknQAdYePQvrFQ0BI8ni5kr3P8F4wpORc4r6A7=0p8m_Ixp99DYIiW5YKObrivq8EjA1I7nZE7Stp7g25ImodXqkaqmOEa0nPwcRa7hIcAoe9wuKrHsc6ANbkQlforLgj0pa/DLboxCTqIgZBl/OX8N9OlLOg4AxHt9EjFm3aqDHkC2fipd956Y_xvuedc4CnD9u884QmczFDAinZj4XAWKxTczY3VTLIWCj7qBqjYw_foQl4wjbwzEFmck0Om_DlnTWYa4DvE8m7Ugw8qtnEqwAebE5kD9Q7qCGP5nOFvAtu7CpDqTe4cGBqARvx5wsB8EQaqRT78TO=YtfIa8PZBbzqpCoKjjkEU_VUMBYpm3BZjA7eg6lqpmbewv_U8Q8T_VqQilODvN6YTq97AqyjWxQBHDRAB2V_b4o1sewDXCsFF_FuN3IHYpdISzvyayHS0uDHqx8dfZqjaO1ymdiU31EucopBpUyeX4ZkkCPNtQ9hmArq9rzX_nIb4S7ruYsqu4U_jS0xj45UOLzsl50ldfDpyjYk4mop4QexI5_n35GihznTWCWghVasTrxR5Ge1CsppezPlrQczqFlZzHuDCPoBq8P5DQiH5PElDFAMcxbYK3xFYZZ_4xKzWw0YCPSYN4dMiNlq=G/gDH2B6wMY34zSADD"
}
url = "https://api.pzds.com/api/web-client/v2/public/goodsPublic/page"
params = {
    "decode__1174": "2287582d28-nlpl3C/kaCBkMCwDyqCrrvlpvCUZlwOeqOCjkkVlX3wLfm4X7w4V5I3CqTuP0hlSIBBuvCwlCPC=lR_COXXwZChvlCaEsRtCwXqFFCrsC4CpHwI_3VOXRCtx_CECtHlvC/80nClkw0_CLlsxCp_CKkmGKWB5vqXutqlTqgkcxDHCXoLsawc_aDcLqCC3sC"
}
data = {
    "order": "ASC",
    "sort": None,
    "page": 2,
    "pageSize": 21,
    "action": {
        "gameId": "7",
        "merchantMark": None,
        "keywords": [],
        "searchWords": [],
        "searchPropertyIds": [],
        "unionGameIds": [],
        "goodsSearchActions": [],
        "goodsCatalogueId": 6
    }
}

head = js.call("get_params", data)
headers['PZTimestamp'] = str(head['Timestamp'])
headers['Random'] = str(head['Random'])
headers['Sign'] = head['strMd5']

data = json.dumps(data, separators=(',', ':'))
response = requests.post(url, headers=headers, cookies=cookies, params=params, data=data)

print(response.text)
print(response)

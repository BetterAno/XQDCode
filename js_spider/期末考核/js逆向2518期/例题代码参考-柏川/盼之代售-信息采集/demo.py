import requests
import json


headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/json",
    "Origin": "https://www.pzds.com",
    "PZOs": "windows",
    "PZPlatform": "pc",
    "PZTimestamp": "1746019013277",
    "PZVersion": "1.0.0",
    "PZVersionCode": "1",
    "Pragma": "no-cache",
    "Random": "648742",
    "Referer": "https://www.pzds.com/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "Sign": "0bb080b62170e8302789394f51c0bdb8",
    "Skey": "CLIENT",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    "channelInfo": "{\"channelCode\":null,\"tag\":null,\"channelType\":null,\"searchWord\":\"null\"}",
    "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "x-oss-forbid-overwrite": "true"
}
cookies = {
    "_c_WBKFRo": "Sp6B8k8bvkvA9gLOK0de3Zzq00RCvvMKnxT8XFHP",
    "sensorsdata2015jssdkcross": "%7B%22distinct_id%兰州交大招标信息%3A%221966250dfd51668-0ba697d81b880a8-26011c51-1327104-1966250dfd6214e%兰州交大招标信息%2C%22first_id%兰州交大招标信息%3A%兰州交大招标信息%兰州交大招标信息%2C%22props%兰州交大招标信息%3A%7B%兰州交大招标信息%24latest_traffic_source_type%兰州交大招标信息%3A%兰州交大招标信息%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%兰州交大招标信息%2C%兰州交大招标信息%24latest_search_keyword%兰州交大招标信息%3A%兰州交大招标信息%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%兰州交大招标信息%2C%兰州交大招标信息%24latest_referrer%兰州交大招标信息%3A%兰州交大招标信息%兰州交大招标信息%7D%2C%22identities%兰州交大招标信息%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTk2NjI1MGRmZDUxNjY4LTBiYTY5N2Q4MWI4ODBhOC0yNjAxMWM1MS0xMzI3MTA0LTE5NjYyNTBkZmQ2MjE0ZSJ9%兰州交大招标信息%2C%22history_login_id%兰州交大招标信息%3A%7B%22name%兰州交大招标信息%3A%兰州交大招标信息%兰州交大招标信息%2C%22value%兰州交大招标信息%3A%兰州交大招标信息%兰州交大招标信息%7D%7D",
    "Hm_lvt_8e2c03f98f8af83cf09317d232baf903": "1745322407,1745406189,1745935116,1746014674",
    "Hm_lpvt_8e2c03f98f8af83cf09317d232baf903": "1746014674",
    "HMACCOUNT": "D4EE4EABA38C3B65",
    "acw_tc": "ac11000117460176397444327e00d4d1c5f1ff6fbc78a1e16281e8f4741c07",
    "ssxmod_itna": "eqmx0QDtoQT4yDAxBPBtiOD2DuxYqjKxGdq+D9n==YO+eO/B7mQ27iA40yDi=TDSxD=D6D7YDt=O7meKICGDNqlBpT3qaDRg0UOK96Zk9xOuZcotDHxY=DU2DyDTTDenrD5xGoDPxDeDACeDFxibDiehnxDdZ=Bho9y1HDGrDlKDRx07Hn5DbxDaDGas9nbsgxi7DD5DnaEfr4DWDWPGKDDzKAM=ln4DEnvhL1gPOR3qKt0DZxG1kD0HlljxZE3nbkDwK+jR/Iu1aFoDvxDkCb7kO34Gt+Y1//WegiDPArTaq0G4OPhxQ74PYDQ+reFrxz4abiX9yCKi=W2eQijKD4WhqoGDD===",
    "ssxmod_itna2": "eqmx0QDtoQT4yDAxBPBtiOD2DuxYqjKxGdq+D9n==YO+eO/B7mQ27iDnKtuDi=Dl=05xDLehrNTeg2DE+sD8ODrAZF/BvxfPgZdxaDgjn0N4rAtiOyaAsjmiif3MrFLW+Z7eXSBsQmXmzPxcsQGcGP4HT+xaeyAnDGcuqoecDKbcdZxP79rihqeaTh6EiOUWerEehXOErIlypGgvEtmGat8bACtPhFOwprIgODqa4QbG7PkK8eXMpAaYOi1D8fxvWZtGF1xcfs2D9Vxpk1sKvkt7ghz/9dPfab21AZ4zA9glzev8XMvcFdOFkdztRKehDgrHDr3lG3Qi=TdxZ4oAbWLSTp8CGdaWq=BhQThDUE5ESde01DLY5r=SghpueGEiN0QrxQqReV88GOa5OTKW33k8PY8kR=mkTshNPuAVo402tThxuStzdipx=rpQK68Ee=gnaKL+WZQq0EVB+Z25WEC34G/DY20hGOve2IyYxIY3uCdsp8op=1dE3TNjbE7MCeqkPx8IGwqpmPgx7ErHoOXdXThkNDzm=LVGUc+Q0mYil5Z03s6jeO3mWWQfF7dUWwkTkWWwdTqwut16dAf8LZ1bk2uy9LXub9ECc/WQ02QH2tlGT6HV+0ZbgVLfhunAh9V0A7vrHMMDeKx23zILx45D7jm=EqWoTomK7e4jGakDQLp4AFv3x+B7jxx83SNCrm+pR3YBXT83C3o8cGGmYY30Kn/G05DYCv/TpUXu0Qt4=j45f5lQDqgwx=p5nmSheDh0jrnxXXXiYnw=jj/+wY4I4kSm0d3Cc0rwAgI+eY4/GQGQ8DqiDD=="
}
url = "https://api.pzds.com/api/web-client/v2/public/goodsPublic/page"
params = {
    "decode__1174": "eqUxcDnGKx0QGCDlcmPe0I5lxIOnnOoD"
}
data = {
    "order": "ASC",
    "sort": None,
    "page": 7,
    "pageSize": 21,
    "action": {
        "gameId": "7",
        "goodsCatalogueId": 6,
        "merchantMark": None,
        "keywords": [],
        "searchWords": [],
        "searchPropertyIds": [],
        "unionGameIds": [],
        "goodsSearchActions": []
    }
}
data = json.dumps(data, separators=(',', ':'))
response = requests.post(url, headers=headers, cookies=cookies, params=params, data=data)

print(response.text)
print(response)
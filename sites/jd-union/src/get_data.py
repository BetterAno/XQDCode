"""
JD Union API — 获取选品广场商品列表
用法: python get_data.py
修改参数: 直接修改下方 BODY / COOKIES / HEADERS 对应字段
"""
import time
import json
import subprocess
import requests

BODY = {
    "funName": "getSkuByMaterialId",
    "page": {"pageNo": 1, "pageSize": 60},
    "param": {
        "materialId": 315,  # 素材/频道ID (数字), 如 108=秒杀, 315=超级品牌日, 13773=百亿补贴
        "secKillTimePeriod": 16,    # 秒杀时段 (0-23), 非秒杀频道可省略
        "seckillTimeType": 0,   # 秒杀类型: 0=当前时段, 可省略
        "requestScene": 0,    # 请求场景: 0
        "requestExtFields": ["shopInfo", "orientations"]    # 额外返回字段: ["shopInfo"=店铺信息, "orientations"=推广位]
    },
    "clientPageId": "jingfen_pc"
}

COOKIES = {
    "3AB9D23F7A4B3C9B": "WRQGF4MCFT7EJD47XBKJLVBVYCXX7DFQEQ6BFSMQ7MSPCNNXQ2ALPYK46H4CAMJEK4UBCWRRRUKMGZFBBHIENWUMCU",
    "shshshfpa": "b6569cc4-e9b0-d43a-d9d8-01099ca7d216-1779709130",
    "shshshfpx": "b6569cc4-e9b0-d43a-d9d8-01099ca7d216-1779709130",
    "__jdv": "209449046|www.google.com|-|referral|-|1779709130483",
    "__jdu": "17797091304821226170515",
    "areaId": "19",
    "ipLoc-djd": "19-1672-0-0",
    "PCSYCityID": "CN_440000_441700_0",
    "__jda": "209449046.17797091304821226170515.1779709130.1779778488.1779780813.5",
    "3AB9D23F7A4B3CSS": "jdd03WRQGF4MCFT7EJD47XBKJLVBVYCXX7DFQEQ6BFSMQ7MSPCNNXQ2ALPYK46H4CAMJEK4UBCWRRRUKMGZFBBHIENWUMCUAAAAM6MNHLYCYAAAAADEU5PVRIG7O3VYX",
    "__jdc": "209449046",
    "shshshfpb": "BApXW_CtGYPtAoDLUG_c6jmsRaH4nYWPMBjsxlh9p9xJ1MnYPCYy28XS93CqtZN4iJbYPsPXW0IgW8YY",
    "__jdb": "209449046.4.17797091304821226170515|5.1779780813",
    "sdtoken": "AAbEsBpEIOVjqTAKCQtvQu17sn_khCZNGPL-bfYG9RQPSq41AEhA5NSJcIg5l-dj4--qeqmGpauv7I09pyrf2cC9p1OPQ97KxT2ZclUobeRQtXEmDMsLgRfumNBcRdk0qUjNtI0cHKUBCEXBhZsQo1rhaMjOG1tgfSoWvx6GDJLY7xmTB2MuUcE"
}

HEADERS = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9",
    "origin": "https://union.jd.com",
    "referer": "https://union.jd.com/",
    "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    "x-referer-page": "https://union.jd.com/proManager/index",
    "x-rp-client": "h5_1.0.0"
}

# ====== 请求 ======
body_json = json.dumps(BODY, separators=(",", ":"))

# 调用 Node.js 生成 h5st 签名
proc = subprocess.run(
    ["node", "./main.js", "unionSearchRecommend", "unionpc", body_json],
    capture_output=True, text=True, cwd=".", timeout=30,
)
sign_result = json.loads(proc.stdout)

# 构造请求参数
UUID = "17797091304821226170515"
EID_TOKEN = "jdd03WRQGF4MCFT7EJD47XBKJLVBVYCXX7DFQEQ6BFSMQ7MSPCNNXQ2ALPYK46H4CAMJEK4UBCWRRRUKMGZFBBHIENWUMCUAAAAM6MMZ745YAAAAACKGGDZ6UEONU2MX"

params = {
    "functionId": "unionSearchRecommend",  # API 函数名
    "appid": "unionpc",                    # 应用标识: unionpc=联盟PC端
    "_": str(int(time.time() * 1000)),     # 时间戳(毫秒), 实时的
    "loginType": "3",                      # 登录类型: 3
    "uuid": UUID,                          # 设备唯一标识
    "x-api-eid-token": EID_TOKEN,          # 设备指纹令牌 (JS动态生成, 不同于cookie)
    "h5st": sign_result["h5st"],           # h5st v5.3 签名, 10段分号分隔:
    #  段1: 时间戳(毫秒)  段2: 指纹版本  段3: appId  段4: token
    #  段5: MD5 hash      段6: 版本号5.3  段7: unix时间戳
    #  段8: 签名体        段9: MD5 hash  段10: 固定后缀
    "body": body_json,                     # 请求体 JSON (紧凑格式, 无空格)
}
url = "https://api.m.jd.com/api"

response = requests.get(url, params=params, headers=HEADERS, cookies=COOKIES, timeout=30)
data = response.json()
# print(data)

if data.get("code") != 200:
    raise RuntimeError(f"API error: code={data.get('code')} message={data.get('message')}")
    
# 输出结果
for item in data['result']['goodsSynopsisList']:
    name = item.get('skuName', '')
    price = item.get('wlPrice', '')
    shop = item.get('venderName', '')
    good_comments = item.get('goodComments', 0)
    print(f"商品: {name}  价格: {price}  店铺: {shop}  好评数: {good_comments}")

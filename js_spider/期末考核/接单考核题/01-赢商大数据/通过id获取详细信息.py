import requests
import json


headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    # "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJleHBpclwiOjE3NzEzMTA3MzkyOTgsXCJ1aWRcIjpcIndzNDA5OTgwNzQ5XCIsXCJ1dWlkXCI6XCIxMjM0NTZcIn0iLCJpYXQiOjE3NjYxMjY3Mzl9.YUUJLmZ5qWSr7Xoy1T5hdO-w2ErOPX_671rSTolMyKA",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/json;charset=UTF-8",
    "Origin": "http://www.winshangdata.com",
    "Pragma": "no-cache",
    "Referer": "http://www.winshangdata.com/brandDetail?brandId=20515",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
    "appType": "bigdata",
    "platform": "pc",
    "pwd": "mobile_regist",
    # "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJleHBpclwiOjE3NzEzMTA3MzkyOTgsXCJ1aWRcIjpcIndzNDA5OTgwNzQ5XCIsXCJ1dWlkXCI6XCIxMjM0NTZcIn0iLCJpYXQiOjE3NjYxMjY3Mzl9.YUUJLmZ5qWSr7Xoy1T5hdO-w2ErOPX_671rSTolMyKA",
    "uid": "ws409980749",
    "uuid": "123456"
}
# cookies = {
#     "_uab_collina": "176511203102522118658723",
#     "tfstk": "gcKmXb6UOE7bRLZboAjjo-kWeluJhis1ZCEO6GCZz_57MSEvQ5oMZdOthdKAIGvBsN-ADKdubdRhBnMXBOrMI_sOMnLvS-tktlExGq9ajGIZ9XnKvKMffGlKyARais66U1kRug1gObsZ9Xn8y87jMGJYurEvZL55IOzVgCWzz_61_G5V77zPL_5NbCraa7WOnt5N7rkkU_6NbPRNbYjPNOSN_CSZ3s0VGh-y4fNgxVbHKPx5nZfe3sJvH3olur9VZpJHqtYd6KzUbl-lnZxkqeXOdZLwdwtvxcq5DpYP49xE1Pf9DpKO4GmuT_KXpe_BcvydanpwAsKqwoC2cUYdSEG3RBjDsw-VrRrwEGYAqT-EBy1JqsdwmakLxNIyvwS2y4GAWiXH_nO0IlReepKfPhc3a1TAdgWHYfaG6nppXgSF4NUz81sUfTk94Pa1uT6l9HJWcewtpGSEEY4ECZW5h6HoEPa1uT6l9YDu8q_VFt1d.",
#     "Hm_lvt_f48055ef4cefec1b8213086004a7b78d": "1765112032,1766126687",
#     "HMACCOUNT": "B33A50A3C10C1055",
#     "auth": "{%22uid%22:%22ZDNNME1EazVPREEzTkRrPQ==%22%2C%22uuid%22:%22ZDNNME1EazVPREEzTkRrPQ==%22%2C%22refreshToken%22:%22eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJleHBpclwiOjE3NzEzMTA3MzkyOTgsXCJ1aWRcIjpcIndzNDA5OTgwNzQ5XCIsXCJ1dWlkXCI6XCIxMjM0NTZcIn0iLCJpYXQiOjE3NjYxMjY3Mzl9.ru2My60LdINPzOUoobS7Z1MnliyRuaRxpLHIJ166MeA%22%2C%22token%22:%22eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJleHBpclwiOjE3NzEzMTA3MzkyOTgsXCJ1aWRcIjpcIndzNDA5OTgwNzQ5XCIsXCJ1dWlkXCI6XCIxMjM0NTZcIn0iLCJpYXQiOjE3NjYxMjY3Mzl9.YUUJLmZ5qWSr7Xoy1T5hdO-w2ErOPX_671rSTolMyKA%22}",
#     "winfanguser": "uid=ws409980749&nid=ws409980749_578519299&logNum=1&err163=mobile_regist&pwd=c0a6e535051d6ee682f7c7ecc67b5e&headerImg=&sex=0&Email=&IsCompany=0",
#     "eyeuser": "uid%3dws409980749%26nid%3dws409980749_578519299%26logNum%3d1%26err163%3dmobile_regist%26pwd%3dc0a6e535051d6ee682f7c7ecc67b5e%26headerImg%3d%26sex%3d0%26Email%3d%26IsCompany%3d0",
#     "Hm_lvt_d1167fb417504013a8e755b23aeee1ec": "1766126980",
#     "JSESSIONID": "8C2F85330AEF8B53FC5D4FEC618C9E5E",
#     "Hm_lpvt_d1167fb417504013a8e755b23aeee1ec": "1766127359",
#     "Hm_lpvt_f48055ef4cefec1b8213086004a7b78d": "1766127410"
# }
url = "http://www.winshangdata.com/wsapi/brand/getBigdataBrandExpandDemand"
data = {
    "brandId": "102782"
}
data = json.dumps(data, separators=(',', ':'))
response = requests.post(url, headers=headers, data=data, verify=False)

print(response.text)
print(response)
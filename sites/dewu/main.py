from loguru import logger
import subprocess
from functools import partial
subprocess.Popen = partial(subprocess.Popen, encoding="utf-8")
import execjs
import requests, json


headers = {
    "Accept": "*/*",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Origin": "https://www.dewu.com",
    "Pragma": "no-cache",
    "Referer": "https://www.dewu.com/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
    "adi": "-CHz_wWWhaJspXQNxCbm0Ae8Krwog4PHAgwo/CiVp/wr7DjyzDj8O5w6zvv67vvJxCQ3xDwro7w4zCoX0=",
    "content-type": "application/json",
    "hsn": "ee240e2642111678392c4ae7576e0ec7",
    "ltk": "JcKXwqrDosOFacKPw4HDssKFAsOTwprCh8OkR8OmwpbCnsKqMTXClXbDncOjKMK7WXrDiALCqV3DhsOCw5ltBsKcQWjDnMO1w5zCicO5w7jCpMON",
    "sec-ch-ua": "\"Chromium\";v=\"148\", \"Google Chrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sessionid": "u1bcSU8t-nRpa-I7CX-Phgp-7Y18wOYmmjUVlLg5",
    "shumeiid": "20260505133755514010884b212e0c85860f8e0205cbc0b1c0ab5cf6a82096",
    "sk": "9U3lGGxQTKhFWqOvNJTxDpIKhq87qfEz0w54Dnbgoqqd2OdvkKaaynRRTtKB4mIw98QOaTdQyz1a43ZqRVU0NFQ0LD1w",
    "sks": "1,hdw4",
    "traceparent": "00-f52080c36a04b74b4bc9cf830eb7f140-7e56da03f89c9626-01",
    "cookie": "sk=9U3lGGxQTKhFWqOvNJTxDpIKhq87qfEz0w54Dnbgoqqd2OdvkKaaynRRTtKB4mIw98QOaTdQyz1a43ZqRVU0NFQ0LD1w; _c_WBKFRo=OziGxEKB6Y9GKfpSrTdwa4fag6Baa4PrZw8UObN8; dw_edge_er_cookie=92a5b121-4b17-2c75-f130-ed0bb79035dc; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2219df6a4929a6f1-00fa07b9c44d41a8-26061e51-2073600-19df6a4929b65e%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTlkZjZhNDkyOWE2ZjEtMDBmYTA3YjljNDRkNDFhOC0yNjA2MWU1MS0yMDczNjAwLTE5ZGY2YTQ5MjliNjVlIn0%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%22%2C%22value%22%3A%22%22%7D%2C%22%24device_id%22%3A%2219df6a4929a6f1-00fa07b9c44d41a8-26061e51-2073600-19df6a4929b65e%22%7D"
}
js = execjs.compile(open('./纯算.js', encoding='utf-8').read())
url = "https://app.dewu.com/api/v1/h5/commodity-pick-interfaces/pc/pick-rule-result/feeds/info"

load_data = {
    "pickRuleId": 644479,
    "pageNum": 1,
    "pageSize": 24,
    "filterUnbid": True,
    "showCspu": True
}
options = {
    "sk": headers.get("sk"),
    "shumeiid": headers.get("shumeiid"),
}
signedData = js.call("getData", load_data, options)
data = {
    "data": signedData
}
logger.info(f"[GET SignedData] ==> {signedData}")
print('-' * 150)
response = requests.post(url, headers=headers, json=data)
logger.success(response)
logger.success(f"[GET EncryptedData] ==> {response.text}")
print('-' * 150)
resData = js.call("decryptFun99Core", response.text, response.headers.get("sks"))
logger.info("Decrypting...")
logger.success(f"[GET DecryptedData] ==> \n{json.loads(resData)}")

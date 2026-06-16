import requests


headers = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "referer": "https://www.jd.com/",
    "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "script",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
}
cookies = {
    "__jdu": "1762960188788403549159",
    "3AB9D23F7A4B3C9B": "YNDW6Y7J3GFLL3QZWEPLLDHSQKNQYPHY5T3CVYPSA5PSVBJBMNC26YCKBREPFQO2VT6DIXVW5HEUSDYI4TK2OIJWR4",
    "autoOpenApp_downCloseDate_jd_homePage": "1763533258266_1",
    "unpl": "JF8EAJ5nNSttWxsHAx8EHRMQTg1XW1xaSkQDbGYNXVoNH1UFHgpMEUB7XlVdWRRLFx9vbxRUWFNIUQ4aCisSEHteVVxcDEsRA21uNWRVUCVXSBtsGHwQBhAZbl4IexcCX2cDU15QTFUFEgsdGxlOXFZaWABLEwtfZjVUW2h7ZAQrAysTIAAzVRNdDkwUC2hmBV1UXkJdABoAHxcYS1lcblw4SA",
    "shshshfpa": "4399a44e-1a9f-7578-322a-db987142a4db-1744726277",
    "shshshfpx": "4399a44e-1a9f-7578-322a-db987142a4db-1744726277",
    "__jdv": "76161171|direct|-|none|-|1764578338770",
    "PCSYCityID": "CN_440000_441700_0",
    "areaId": "19",
    "ipLoc-djd": "19-1672-0-0",
    "wlfstk_smdl": "aeqlthx1m8n896gncyy3n892t74bfozq",
    "__jda": "76161171.1762960188788403549159.1762960188.1763533257.1764578339.4",
    "__jdc": "76161171",
    "3AB9D23F7A4B3CSS": "jdd03YNDW6Y7J3GFLL3QZWEPLLDHSQKNQYPHY5T3CVYPSA5PSVBJBMNC26YCKBREPFQO2VT6DIXVW5HEUSDYI4TK2OIJWR4AAAAM23EKSMDQAAAAADKZWWDFILCKNIAX",
    "_gia_d": "1",
    "shshshfpb": "BApXWs3Yd2v9Abwpe6NibzIDjsu_KhBUBBgYzZVho9xJ1MgWfCY-28XS_iX7_YIIgJLMK56eEhCDzpjE",
    "__jdb": "76161171.9.1762960188788403549159|4.1764578339",
    "sdtoken": "AAbEsBpEIOVjqTAKCQtvQu17fCssO4_pv_gzLzT80JgerKaliwLDlz8KWLAI37yFzx76loGaWQsuNL44h2qSe2YuXhiSYutFi2owMy3Jo3RERcWCO-_Di7yS_1wjm0HaXPKILx4O0jg"
}
url = "https://api.m.jd.com/"
params = {
    "h5st": "20251201164506973;33giggz9zp3td069;b5216;tk03wc0081ca418nyAA7krvMd6epTXr_sZ0NH_NV0f1RGlhSkGUSx_jXzBVITmOnV2EbVrxXqBfaBYHci3JGNGSPOamc;ad70a2f1a86a2f037ea46ad4986f88dac04f86f48eca112e1bc77dedeecb543a;5.2;1764578702973;fZRCXZPTrheItUeFn8_D6ELH6UuV-h-T-h6I-hfZXx-Vwh-T-prJ_YfZB5hW-F_VrReU8geVvZbUoR7UvVrJrVuUpd7VvNuUsheIsV_U-h-T-h6Q1E7J8E6ZBh-f1ZfIvhuJAQ_UwdOV-MrVvJbT8MLVvVOTsJuVoVeI7IeV_YfZnZvFAI6GAU7ZBh-f1ZfV-h-T-ROE-YfZB5hW-V_WvpPUrkMI187ICMeH-h-T-J6ZBh-f1ZfVpZ_RW8aMo88ZB5_Z0kbIzc7F-hfZXx-ZvV_G4E8ZB5_Z7g6ZBh-f1taZB5BZ2I9ZB5_ZudOE-YfZBhfZXx-VB5_ZwdOE-YfZBhfZXxfUwh-T-hOVsY7ZBhfZB5hWptfZnZ-VwN6J-hfZBh-f1ZvO3I7VdctVLU7R-h-T-trG9oLJvYfZBhfZXxfVB5_ZpN6J-hfZBh-f1heZnZvUsY7ZBhfZB5hWrZeZnZ-UsY7ZBhfZB5hWxh-T-NOE-YfZBhfZXxfVB5_ZtN6J-hfZBh-f1Z_UB5_ZuN6J-hfZBh-f1ZfUzd_WxZfZnZPVsY7ZBhfZB5hWxh-T-1rE-hfZBh-f1NeZnZvF1YfZBhfZXxfVB5_Z1YfZBhfZXxfVB5_Z9E6ZBhfZB5xDB5_Z9oLItAKI-hfZXxPCmg-T-haF-hfZXx-ZtJeDB1eUrpLHKgvTxpfVwhfMTgvFqkbIz8rM-h-T-dLEuYfZB5xD;0624667d32597db4f801804d9cebc94ee08cbfead2c6af2e2934d381530b7788;gRaW989Gy8bE_oLE7w-Gy8rFvM7MtoLI4wrJ1R6G88bG_wPD9k7J1RLHxgKJ",
    "appid": "www-jd-com",
    "body": "{\"page\":1,\"pagesize\":娱乐指数-电视剧排名,\"area\":\"19_1672_0_0\",\"source\":\"pc-home\",\"kuangjia\":1}",
    "clientVersion": "1.0.0",
    "client": "pc",
    "functionId": "pc_home_feed",
    "t": "1764578702960",
    "uuid": "76161171.1762960188788403549159.1762960188.1763533257.1764578339.4",
    "loginType": "3",
    "x-api-eid-token": "jdd03YNDW6Y7J3GFLL3QZWEPLLDHSQKNQYPHY5T3CVYPSA5PSVBJBMNC26YCKBREPFQO2VT6DIXVW5HEUSDYI4TK2OIJWR4AAAAM23EKSMDQAAAAADKZWWDFILCKNIAX",
    "callback": "jsonpMore2Goods",
    "_": "1764578702977"
}
response = requests.get(url, headers=headers, cookies=cookies, params=params)

print(response.text)
print(response)
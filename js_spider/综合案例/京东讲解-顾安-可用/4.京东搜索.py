import hashlib
import json
import time

from curl_cffi import requests

headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "origin": "https://search.jd.com",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://search.jd.com/Search?keyword=%E7%94%B5%E8%84%91&enc=utf-8&pvid=a128f88d0b0b440993eaf7073983012f",
    "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "x-referer-page": "https://search.jd.com/Search",
    "x-rp-client": "h5_1.0.0"
}
cookies = {
    "__jdu": "1762960188788403549159",
    "autoOpenApp_downCloseDate_jd_homePage": "1763533258266_1",
    "shshshfpa": "4399a44e-1a9f-7578-322a-db987142a4db-1744726277",
    "shshshfpx": "4399a44e-1a9f-7578-322a-db987142a4db-1744726277",
    "__jdv": "143920055|direct|-|none|-|1765881560689",
    "areaId": "19",
    "PCSYCityID": "CN_440000_441700_0",
    "jcap_dvzw_fp": "uY7LM__B2jZQNbJtF9hiH-wfWaG8s_F9rI8DC5j6oC-OCESUPhcXRd0eFECMsAwkbAiFZeCf4LmtJ9dX8X4N5e6nC2s=",
    "TrackID": "1E6S83jLicfnRcFcNsw2l9U3iKEYx3bZ2d1Sztpcl-TPE9A00nrud6HqzsHeSI0WAe-E0Q1b2xg9Pav5KoXorMldjB8C3i0TMuRi3bTiSOqs",
    "light_key": "AASBKE7rOxgWQziEhC_QY6yavxtZ403faFZdt5nBqmDSbFz3QibTqwGhQWeRQvkUKOEHmYJE",
    "pinId": "3oBo__IhTg-Rfwu1UK4iOLV9-x-f3wj7",
    "pin": "jd_412eea2840f28",
    "unick": "jd_136230ntts",
    "_tp": "cV7HKPl33NttNkloe%2F%2FX3NKWq%2BMLnkk6bpa6kVzsE3k%3D",
    "_pst": "jd_412eea2840f28",
    "ipLoc-djd": "1-72-55653-0",
    "3AB9D23F7A4B3C9B": "YNDW6Y7J3GFLL3QZWEPLLDHSQKNQYPHY5T3CVYPSA5PSVBJBMNC26YCKBREPFQO2VT6DIXVW5HEUSDYI4TK2OIJWR4",
    "__jda": "76161171.1762960188788403549159.1762960188.1766396238.1766398880.25",
    "__jdc": "76161171",
    "thor": "FA3942DEE69745BA2B70CED135899FF7EE3FC573A1E8DB149FE4B512FF9844B7A9259E7DA0F887E9C94E0E5A927336E4C83D383BA8FE8E43964D63D0854BC5DE7C90BBE273DEAF04A652D1A30126C7A0304F7023E5770C5A4828D9B4A3F1919697C5CAA7953A450DFB11B1091BC61C4BBD6FC8109CC39A5265F03B5405D5C45839E6EEE05F54FAF454A3988EBECC013DA0B5E12832041FAD222AA28EB0CDCE6D",
    "cn": "0",
    "3AB9D23F7A4B3CSS": "jdd03YNDW6Y7J3GFLL3QZWEPLLDHSQKNQYPHY5T3CVYPSA5PSVBJBMNC26YCKBREPFQO2VT6DIXVW5HEUSDYI4TK2OIJWR4AAAAM3IWNIIBYAAAAAC6FPS4EY3BVEM4X",
    "umc_count": "1",
    "shshshfpb": "BApXWYBuSRv5Abwpe6NibzIDjsu_KhBUBBgYzZVhs9xJ1ItZfQtKHwB_ujXmiZ9Z1Ie2BctWOsqFbcrtg4qVb4tkoYg23-mLbfciM",
    "sdtoken": "AAbEsBpEIOVjqTAKCQtvQu17xXqvdoh94erQjqIFDkLgFFQVoiePOWOPGIOBmmsI4OntaaMc3HcMRpdoy-XmXrkKuY31VdZnYQSUvslRNveZ38lSvIMlfPNyPeDPviIGz1EVfkQ",
    "flash": "3_KiwXXfUQMBN9-2oQ0LtloEStzRIq1TexPoPkqOYgxQDnziCwvZ6x52090feC-vNAwoivDEGw4XuG8NL1J4Us0puF5QODb8KRIpfQojGe_yDAgmyI4Ir6eiVZwN8CXNMDVtEZTVNWAuLH4VwMumFJD3rL4mF90LjPaF7cJxV-f1Mdzn6dx6PcDe**",
    "__jdb": "76161171.14.1762960188788403549159|25.1766398880"
}


def sha256_hash(data):
    hash_obj = hashlib.sha256(data.encode('utf-8'))
    return hash_obj.hexdigest()


url = "https://api.m.jd.com/api"

jd_params = {
    "enc": "utf-8",
    "pvid": "ecd79c13d7dd458ab8293861ceb70f6a",
    "area": "1_72_55653_0",
    "page": 1,
    "new_interval": True,
    "s": 49
}

paramsH5sign = {
    'appid': 'search-pc-java',
    'functionId': "pc_search_searchWare",
    'client': 'pc',
    'clientVersion': '1.0.0',
    't': str(int(time.time() * 1000)),
    'body': sha256_hash(json.dumps(jd_params))
}

response = requests.post("localhost:5000/api/data", json={"params": paramsH5sign})

h5st_info = response.json()["result"]
print('h5st_info ->', h5st_info)
params = {
    "appid": "search-pc-java",
    "t": [
        str(int(time.time() * 1000))
    ],
    "client": "pc",
    "clientVersion": "1.0.0",
    "uuid": "1745841960334352365307",
    "keyword": "口红",
    "functionId": "pc_search_getShopAndWare",
    "body": jd_params,  # 接口请求的body为明文
    "x-api-eid-token": "jdd03QJJ7DOUYP7T5O2IKSRFQANXZJYHALCU3ECRYXYVSULUXN7DODVWDAGUVYK2WLOTISQ3XQ7U7G5PP57CC2QFRLQFA5AAAAAMYYUR7TVIAAAAACORWVTOFTVSAUQX",
    "h5st": h5st_info["h5st"]
}
response = requests.get(url, headers=headers, cookies=cookies, params=params, impersonate='chrome101')

print(response.text)
print(response)

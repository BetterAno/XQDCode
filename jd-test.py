import requests


headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "priority": "u=1, i",
    "referer": "https://re.jd.com/search?keyword=%E6%9C%BA%E6%A2%B0%E9%94%AE%E7%9B%98&re_dcp=y9U-JIjvdbG_HUvEDR2Bi0NEuZ7Ea-m4ifXNu7Rb&extension_id=eyJhZCI6IiIsImNoIjoiIiwic2hvcCI6IiIsInNrdSI6IiIsInRzIjoiIiwidW5pcWlkIjoie1wiY2xpY2tfaWRcIjpcIjkzNzg0MmYwZjAwNzJkZmNcIixcInBvc19pZFwiOlwiNjk2NjBcIixcInNpZFwiOlwiXCIsXCJza3VfaWRcIjpcIlwifSJ9&jd_pop=937842f0f0072dfc&abt=1&utm_source=jump.yhzswl.com&utm_medium=adrealizable&utm_campaign=t_2037222536_0_0&utm_term=937842f0f0072dfc-p_0",
    "sec-ch-ua": "\"Microsoft Edge\";v=\"149\", \"Chromium\";v=\"149\", \"Not)A;Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0",
    "x-requested-with": "XMLHttpRequest"
}
cookies = {
    "mt_xid": "V2_52007VwMUW11fW1kXQBhaBGMDE1deWltfHUoYbA1lBRtXXg9TDR5IH19QMFEiUVxbVUYeTgVcA3YDFllZX1lZHnkbbAdXMxVaWl9T",
    "unpl": "V2_ZzNsbUpVRRxwCxFVLBhdA2RWRQ9eFi0SfQ9BVUsaXQZgHxNaXldFBHUMTVB8El8EVwMiXkNVRRZ2C0JWfClda2ALFVpDZ3MVdzhHZHsfVQVgChFVS1ZFFHEIR1F4G1UAZQATbUpVRRxwCxFVLBhdA2RWRQ9yUEQUfA%3D%3D",
    "__jdu": "17816829807051042384320",
    "_reuuid": "ace0925bd97940a3ae651c9189af0d58",
    "_mid": "38OCdzM4kOcbfq51URoIDA",
    "mid_openapp_interval": "1781683886",
    "areaId": "19",
    "ipLoc-djd": "19-1601-0-0",
    "__jda": "229668127.17816829807051042384320.1781682980.1781682980.1781682980.1",
    "__jdb": "229668127.4.17816829807051042384320|1.1781682980",
    "__jdc": "229668127",
    "__jdv": "229668127|jump.yhzswl.com|t_2037222536_0_0|adrealizable|937842f0f0072dfc-p_0|1781683120104",
    "3AB9D23F7A4B3C9B": "J25SPK6AV5C3ETMPUHVRNLZ4LN4QHNRWV35K44Z2FX5LZSLIZGAZFTD5R6MUYZWXCU74U2Z54AWTBRHLLJ6VYGXW2Y"
}
url = "https://re.jd.com/pcSearch/pageing"
params = {
    "psid": "5ba51714d34e47f69712cc4fc06a484f",
    "adInfo": "CKwVEBgYARgCGAMYBBgFGAoYCxgMGA0YDiIPZ29vZHMtcGMtc2VhcmNoKhAxdW9qN3RyWkFGZFZHVjBBYEhoAHD___________8BeCA",
    "pageUuid": "32-4c3a139969a340b59459098bb1da818b",
    "keyword": "李在峰八段锦",
    "page": "1"
}
response = requests.get(url, headers=headers, params=params)

print(response.text)
print(response)
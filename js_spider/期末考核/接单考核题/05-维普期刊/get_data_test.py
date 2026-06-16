import requests


headers = {
    "accept": "text/html, */*; q=0.01",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "origin": "https://qikan.cqvip.com",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://qikan.cqvip.com/Qikan/Journal/JournalGuid?from=index%E2%80%8B",
    "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest"
}
cookies = {
    "6HZbKHDjIEcgS": "60B44n829F4vjOvUyHP3D6EvUGeTGzXBtwhr3VeaQtHpU7QdHJPOrEk4.WdHXnH_2Sl98JV2nmmibzBILfePaLaG",
    "bbe2fd78a5836b4864": "94ee5fb45ad7f8f15d2d00578ab61262",
    "ASP.NET_SessionId": "fgs3jynt1pdypttfwipc0hr2",
    "LIBUSERCOOKIE": "Oosn4ui%2b3LLrWouj8WHplBg8l9VRCaz6bpwAOnBoP8wVsBk9CDltlMboiAVanj4B6HdNtRcqcCBY6YHUkhyKpx4SpS5TiZCBU00UZG9aKl%2bFlwf8QghSx4NuqymHOOB0I4VHcGNawNL7gG6FU1NEy5kvHRkoYwV6T9nhGH5Qw6QBsHye3KDkuBjjtQv73OhCiLzDsXeDJymHahFelAvO2v8N6wHGVsDhnHxBCJI3imbWIUhI%2bD45RaSsyA%2bbOZDVCWX%2bwFNSzQNunt90btS9fR30OIsIDqOYp%2fpCLuTD%2bRFho4GMkz5NzHVUPqEx2YTMGkuW9UmPbdudYhx2HGeZI3Q%2fHZGVVkEu0rmjxPt4qEC0ugggR%2fq0KZncRkpWwGFn01V%2f1W9SkLB9R7z%2fGsuSMYUy7YDUdAwGQ%2bAOGlHdaZGKA2vs04UMUNC0a%2bZ%2bizBBZuMouJgBZ%2bMR7hBR8LAlx6hFFptdvr4M0fltWSYm0Z%2bgQ2qCMorX3w%3d%3d",
    "LIBUSERIDCOOKIE": "13363468",
    "LIBUSERNAMECOOKIE": "%e5%b9%bf%e4%b8%9c%e6%b5%b7%e6%b4%8b%e5%a4%a7%e5%ad%a6",
    "f6324025fe": "f234a28048470632bbe204aea6eaedfa",
    "Hm_lvt_17262dc62ce874a510e9c97140f381d6": "1778669914",
    "Hm_lpvt_17262dc62ce874a510e9c97140f381d6": "1778669914",
    "HMACCOUNT": "670DB77EB299B3DF",
    "Hm_lvt_fee827c3dc795c5122daf5ee854c1683": "1778669914",
    "Hm_lpvt_fee827c3dc795c5122daf5ee854c1683": "1778669914",
    "user_behavior_flag": "d82133c3-a701-438b-93e5-192ccfe493a5",
    "tfstk": "gFPsxUfdwhxs-MbODh7ePsw9joGbGw5rBEgYrrdwkfhtMsZTcxkAjAJAGrmU_czZ6X5bXoMqX-cwMxEQcjoTnfRxHkZjgl0aQqTgOuO2_GXgkIGqMgSPa_zGSjcA4qvEbsoioynA8AI-AbeIMgSPTPb-pzcYuS9MnyUKxqO9MdEx9D3jvddYDcHpv4goMmEYDBHKuVdtWcHtvwgmvmhxMoUdRqoKDjhYDyhPl9gdCDz1onHQ_RYt4PnBMIFOiAi7oKRvMW0sClzsAPzaOVMs2xo1CIVTYrFasvXHLj4UFowY2MJZX8g7AYy1VCZ7jqEI_7QcIvDYGSg3Ki9jV-UaE-HCW1UI1cMYTkL9hfwYjSMgCEbuJfE3E0DOKM0Q_7kjqvtdXyzIXYwbbMAxb8aLAYPeYQl8EkNjebIyTQo5UopXRYAjR07CRKv0pHkRvus61rHt-2YPRw9ynA3nR07CRKvmB20haw_BUKf..",
    "__root_domain_v": ".cqvip.com",
    "_qddaz": "QD.654878669915449",
    "_qdda": "3-1.22zkgk",
    "_qddab": "3-daqspf.mp3y56ck",
    "6HZbKHDjIEcgT": "0z3wP_C6yfaURn1lZB9tTRx84EvtZh_efpAGR8xqnGNAoqavd3SOnKOO4xCwHjdT182VLYvR.MRR8r2adw0SN.5UNvamFmWSyEzXaA2jsPYmcx33MFpyPVAKCCLuaqIJS_eg29NaIizjAcvFXbw1obLGLf1ZuAge9Mvv4BRxikq7YBR4xuTSz8371s5g36GqgCiBJHvr9fIprBlZdklyw4iet8tuV41uewjl.iovWepd6vSz.oovz1ovBddSWcfclJtB.tdX31NmXAICmv4r2wH20jJucHij.xR_mSu_idqKUNNjFuOXU9YkED7VRrd7cZwg.pkqcES0sUXRS6eUchliws3uJuI1ecbVLVFdx8cGMkztfXz_MJYQor81VQBAc0KvvrMc7xHy5CXRl0H0JuQTtpa54GOLwp3sP25.PLHpGiVcQUpHnORKtOVDPvwZb"
}
url = "https://qikan.cqvip.com/Search/SearchList"
data = {
    "searchParamModel": "{\"ObjectType\":7,\"SearchKeyList\":[],\"SearchExpression\":null,\"BeginYear\":null,\"EndYear\":null,\"UpdateTimeType\":null,\"JournalRange\":null,\"DomainRange\":null,\"ClusterFilter\":\"ZY=320#产业经济\",\"ClusterLimit\":0,\"ClusterUseType\":\"Article\",\"UrlParam\":\"\",\"Sort\":\"1\",\"SortField\":null,\"UserID\":\"0\",\"PageNum\":1,\"PageSize\":20,\"SType\":null,\"StrIds\":null,\"IsRefOrBy\":0,\"ShowRules\":\"\",\"IsNoteHistory\":0,\"AdvShowTitle\":null,\"ObjectId\":null,\"ObjectSearchType\":0,\"ChineseEnglishExtend\":0,\"SynonymExtend\":0,\"ShowTotalCount\":0,\"AdvTabGuid\":\"\"}"
}
response = requests.post(url, headers=headers, cookies=cookies, data=data)

print(response.text)
print(response)
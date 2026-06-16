import requests

import subprocess		# 进程库, 用来控制终端




headers = {
    "sec-ch-ua-platform": "\"Windows\"",
    "Referer": "https://union.jd.com/",
    "sec-ch-ua": "\"Google Chrome\";v=\"147\", \"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"147\"",
    "sec-ch-ua-mobile": "?0",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    "accept": "application/json, text/plain, */*",
    "x-referer-page": "https://union.jd.com/proManager/index",
    "x-rp-client": "h5_1.0.0"
}
url = "https://api.m.jd.com/api"
params = {
    "functionId": "unionSearchRecommend",
    "appid": "unionpc",
    "_": "1776394202130",
    "loginType": "3",
    "uuid": "17763941781101381538254",
    "x-api-eid-token": "jdd035RCT54NA7UZSAQR5DGKYS45VAMLD4XOTVXQEL67DDBBL2XZX4YYMXMZCVACEPXECDKEGSXP77BVLFMTZLM2RLW4AFIAAAAM5TFMAZLIAAAAAD3KE4EIXIWM4OMX",
    # "h5st": "20260417105007964;zyinji1mvazinnn5;586ae;tk03wa0dc1bb418nZuPrXbz6b0Yh6AlKn4gJY57tZJYInNOKTn_CInnehIXF61lIl9pZWUWE-sHKZPRIn4Q4gG54nzZw;2f20de5c3858a221a98e3b36b035d9c5202576b067dc150aaa4e7225d913bea5;5.3;1776394203964;pjbMhjZe9yFQCCUT12VfCCFQCGENJrJdJrESJrpjh7Jf6rJdJz1TIipjLDrgJTVS2X4f2jFT6bYSKaoe1XIfHmVd0nYSGWodGKIe7T4TJrJdJrEa-OFTGOEjLrJp-j5fIeVeHGYSFeoeFKYSGWoSyfYf1T1e6nITHWISGa1eIipjxj5PKSEQKeFjLrJp-jpfJrJdJbYOJipjLDrgJjIg4zZe1uWS-GFSMWoRJrJdJTEjLrJp-j5UWeYe1bYQ-KIjLDIj_ulS9mFPJrpjh7Jj5fIQCOGjLDIjFqEjLrJp-3kjLDLj4SHjLDIj4nYOJipjLrpjh75fLDIj6nYOJipjLrpjh7pe6rJdJrYf2iFjLrpjLDrgz3pjxjJf6XETJrpjLrJp-j5RBaHa7eYW4rEfzaHjLDIj_ulS9mFPJrpjLrJp-rojxjpd2iFjLrpjLDrg7rJdJPYOJipjLrpjh7Jf6rJdJTYOJipjLrpjh7pfLDIj2XETJrpjLrJp-rojxjpe2iFjLrpjLDrg3jYfLDIj4XETJrpjLrJp-jZe9nIg7jpjxjZf2iFjLrpjLDrg7rJdJ-1OJrpjLrJp-Xojxj5P-ipjLrpjh7pfLDIj-ipjLrpjh7pfLDIjHOEjLrpjLD7NLDIjHyVS3KUSJrpjh7ZMwqJdJrkPJrpjh7Jj3ToNL-oe1zVRUq5d7zpf6rpWdq5P0ulS9G1WJrJdJnVO4ipjLD7N;8ee57eb5b8438c597899800ecb00477d2122c265a68d5419a67a1cedce56a13f;of7rHGHQ8GlOIyVOF6ZNHuFT-bVR7qUT",
    "body": "{\"funName\":\"getSkuByMaterialId\",\"page\":{\"pageNo\":1,\"pageSize\":60},\"param\":{\"materialId\":315,\"secKillTimePeriod\":12,\"seckillTimeType\":0,\"requestScene\":0,\"requestExtFields\":[\"shopInfo\",\"orientations\"]},\"clientPageId\":\"jingfen_pc\"}"
}

# subprocess.run 在终端执行 node.js 命令, 打印终端显示的结果
# capture_output: 捕获控制台输出内容		text: 将输出结果以文本形式返回
result = subprocess.run(['node', 'h5st_JS.js'], capture_output=True, text=True)
print(result.stdout)


# response = requests.get(url, headers=headers, params=params)
#
# print(response.text)
# print(response)
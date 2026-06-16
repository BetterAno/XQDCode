import requests, time, hashlib, execjs
from loguru import logger

js = execjs.compile(open('h5st5_3_3.js', encoding='utf-8').read())


headers = {
    "referer": "https://item.jd.com/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    "x-referer-page": "https://item.jd.com/100080668585.html",
}
cookies = {
    "flash": "3_eIH1nx17V5hgx79BK96DE28KGj7sFoXvHHu5ojXPRsNg7XCdWGtUWlyhm4O4RoQ-f956-Zpg-VO1PnExeqZQ4KWvdq2kZv8szbrU8PnTYKhN3ZLxsoPCS2VbWkZdo4jyztz1_5CvOvFYuuF3AdC0E3aRiFRnVEzjxFiZv8WLMMq*",
}
url = "https://api.m.jd.com/"
params = {
    "functionId": "pc_detailpage_wareBusiness",
    "body": "{\"skuId\":\"100080668585\",\"area\":\"19_1607_4773_62123\",\"num\":\"1\",\"sfTime\":\"1,0,0\"}",
    # "h5st": "20260508232753080;nzen2ipn1bveze23;fb5df;tk03w99581b7b18nLmxeXCibmnIVi3HeZ0gA_77zY1640lWhtFvdjsYEPMWCJ-tNIFD3b8hKB9FL5NGhqdlJ57VvqqZS;b3c6d5da0dfad677afbd7d09a4ac17bf;5.3;1778254068080;pjbMhjpd9nIg7jpjxjZf2iFjLrJp-j5f5XFNGSET6zlPCiIQGCEQJrJdJrESJrpjh7pe5rJdJz1TIipjLDrgJjYf3bYSHaof3Xof5rISFOYT0XIT3HodyXlfHmVSzXFTJrJdJrEa-OFTGOEjLrJp-jpeyTodGWle3LYdIqYSHelfyH4e3TYeKmVSKi1fKSod4jpjxj5PKSEQKeFjLrJp-jZf_jpjxjpe2iFjLrJp-j5f9fIg2T0UG6VRFuWeDipjxjJOJrpjh7JjJeYZFCnd4LYgS6HjLDIj_ulS9mFPJrpjh7Jj5fIQCOGjLDIjFqEjLrJp-3kjLDLj3SHjLDIj4nYOJipjLrpjh75fLDIj6nYOJipjLrpjh7pe6rJdJrYf2iFjLrpjLDrgz3pjxjJf6XETJrpjLrJp-jJX6KYV6_XOWeIVeaWfJrJdJ31QHyVT5ipjLrpjh7pfLDIjzXETJrpjLrJp-rojxj5e2iFjLrpjLDrg4jojxjJe2iFjLrpjLDrg7rJdJXYOJipjLrpjh7pfLDIj3XETJrpjLrJp-b4fLDIj4XETJrpjLrJp-jZd9nIg7jpjxjZf2iFjLrpjLDrg7rJdJ-1OJrpjLrJp-Xojxj5P-ipjLrpjh7pfLDIj-ipjLrpjh7pfLDIjHOEjLrpjLD7NLDIjHyVS3KUSJrpjh7ZMLrJpJnYf0rYQCe1XJrJdJjoPJrpjLrJpwqJdJrkPJrpjh7Jj3ToNL-oe1zVRUq5d7zpf6rpWdq5P0ulS9G1WJrJdJnVO4ipjLD7N;dc36552ef912cc018374c3143bd404bb;qbkgHGHQ8GlOIyVOF6JQ8G1P5WFW3yVSC61T-bEQGGlQI6ZNHuFT-bVR7qUT",
    "uuid": "1778047741273970201513",
    "loginType": "3",
    "appid": "pc-item-soa",
    "clientVersion": "1.0.0",
    "client": "pc",
    "t": f"{int(time.time() * 1000)}",
    "x-api-eid-token": "jdd03KBV6RBPXV5BAMADTI2E6KMDQWLLXNEHSMPWWXDSIWX4OPYX7QPMXP76RH5IOR6EXBPUZANLOZZI642RUFDOXMSYNTMAAAAM6BAZYGGYAAAAADJJI2VPXCU3AREX"
}

body = hashlib.sha256(params["body"].encode("utf-8")).hexdigest()
logger.info(f"SHA_ENC --> [{body}]")
h5st = js.call("getH5ST", params["appid"], body, params["client"], params["clientVersion"],
               params["functionId"], params["t"])
logger.success(f"GET_H5ST[5.3.3] => \n{h5st}")
logger.info(f"H5ST Length => [{len(h5st)}]")
params['h5st'] = h5st
response = requests.get(url, headers=headers, cookies=cookies, params=params)

logger.success(response.text)
logger.success(response)

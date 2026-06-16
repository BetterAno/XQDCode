import re

import execjs
import requests

js = execjs.compile(open('公安部.js', encoding='utf-8').read())
requests = requests.session()

headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
    "sec-ch-ua": "\"Google Chrome\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
url = "https://www.mps.gov.cn/n2253534/n2253875/n2253877/index.html"
response = requests.get(url, headers=headers)
clearance = execjs.eval(re.findall("cookie=(.*?);location", response.text)[0])
# print(clearance)

cookies = {
    "__jsl_clearance_s": re.findall("__jsl_clearance_s=(.*?); Max", clearance)[0],
}
response = requests.get(url, headers=headers, cookies=cookies)
print(re.findall(';go\((.*?)\)</script>', response.text)[0])

go_code = execjs.eval(re.findall(';go\((.*?)\)</script>', response.text)[0])
res = js.call("go", go_code)
# print(res)

headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "priority": "u=0, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
}
cookies = {
    '__jsl_clearance_s': re.findall('__jsl_clearance_s=(.*?);Max-age=3600; path = /; SameSite=None; Secure', res)[0],
}
response = requests.get(url, headers=headers, cookies=cookies)
response.encoding = 'utf-8'
print(response.text)

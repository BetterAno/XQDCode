import re

import subprocess
from functools import partial

subprocess.Popen = partial(subprocess.Popen, encoding='utf-8')
import execjs
import requests


class ouyeel:
    def __init__(self):
        self.headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "https://www.ouyeel.com",
    "Pragma": "no-cache",
    "Referer": "https://www.ouyeel.com/steel/search?pageIndex=0&pageSize=50",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
        self.url = "https://www.ouyeel.com/search-ng/commoditySearch/queryCommodityResult"
        self.js = execjs.compile(open('./get_cookie.js', encoding='utf-8').read())
        self.session = requests.session()

    def first_request(self):
        response = self.session.post(self.url, headers=self.headers)
        encrypt_code = re.findall(r"type=\"text/javascript\" r='m'>(.*?)</script><script", response.text)[0]
        with open('encrypt_js_code.js', 'wb') as f:
            f.write(encrypt_code.encode('utf-8'))

    def second_request(self):
        self.first_request()
        cookie = self.js.call('get_cookie').split('T0k1m0u5AfREP=')[1]  # cookie有无后缀信息都可
        self.session.cookies.set('T0k1m0u5AfREP', cookie)
        data = {
    "criteriaJson": "{\"pageSize\":50,\"industryComponent\":null,\"channel\":null,\"productType\":null,\"sort\":null,\"warehouseCode\":null,\"key_search\":null,\"is_central\":null,\"searchField\":null,\"companyCode\":null,\"inquiryCategory\":null,\"inquirySpec\":null,\"provider\":null,\"shopCode\":null,\"packCodes\":null,\"steelFactory\":null,\"resourceIds\":null,\"providerCode\":null,\"jsonParam\":{\"keywordAnalyseResult\":null},\"excludeShowSoldOut\":null,\"pageIndex\":1,\"maxPage\":50}"
}
        response = self.session.post(self.url, headers=self.headers, data=data)
        response.encoding = 'utf-8'
        print(response.text)

    def main(self):
        # self.first_request()
        self.second_request()


if __name__ == '__main__':
    oy = ouyeel()
    oy.main()


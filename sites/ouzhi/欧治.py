import json
import re

import subprocess
from functools import partial
subprocess.Popen = partial(subprocess.Popen, encoding="utf-8")
import execjs

import requests


class OuYeel:
    def __init__(self):
        self.headers = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://www.ouyeel.com",
            "Pragma": "no-cache",
            "Referer": "https://www.ouyeel.com/steel/search?channel=GG&pageIndex=1&pageSize=50",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        self.index_url = "https://www.ouyeel.com/steel/search?pageIndex=1&pageSize=50"
        self.api_url = "https://www.ouyeel.com/search-ng/commoditySearch/queryCommodityResult"
        self.ctx = None

    def first_request(self):
        response = requests.get(self.index_url, headers=self.headers)
        encrypt_code = re.findall(r"<script type=\"text/javascript\" r='m'>(.*?)</script><script type", response.text)[
            0]
        with open('main.js', 'r', encoding='utf-8') as f:
            js_code = f.read().replace('encrypt_js_code', encrypt_code)
        self.ctx = execjs.compile(js_code)
        return response.cookies.get('T0k1m0u5AfREO')

    def second_request(self):
        T0k1m0u5AfREO = self.first_request()
        T0k1m0u5AfREP = self.ctx.call('get_cookie').split('T0k1m0u5AfREP=')[1]  # cookie有无后缀信息都可
        cookies = {
            'T0k1m0u5AfREO': T0k1m0u5AfREO,
            'T0k1m0u5AfREP': T0k1m0u5AfREP
        }
        response = requests.get(self.index_url, headers=self.headers, cookies=cookies)
        return cookies

    def get_data(self, cookie):
        # params = {
        #     "K5nOZLud": "SXVjOAlqEhFqQ_YMdE6fJcwRiw3qJQgFxBYZTZHFeqeow0W.7R5uEJiSL4LnFBjDbLNMmdy6EmlLWdnebNG.RkGCxW5A6J3n"
        # }
        data = {
            "criteriaJson": "{\"pageSize\":50,\"industryComponent\":null,\"channel\":null,\"productType\":null,\"sort\":null,\"warehouseCode\":null,\"key_search\":null,\"is_central\":null,\"searchField\":null,\"companyCode\":null,\"inquiryCategory\":null,\"inquirySpec\":null,\"provider\":null,\"shopCode\":null,\"packCodes\":null,\"steelFactory\":null,\"resourceIds\":null,\"providerCode\":null,\"jsonParam\":{\"keywordAnalyseResult\":null},\"excludeShowSoldOut\":null,\"pageIndex\":0,\"maxPage\":50}"
        }
        response = requests.post(self.api_url, headers=self.headers, cookies=cookie, data=data)
        resultList = json.loads(response.json()['resultList'])
        # print(resultList)
        for item in resultList:
            # title = item['productName'] + item['shopSign']
            # location = item['storeCityName'] + '|' + item['warehouseName']
            # print(location)
            print(item, '\n', '-'*100)

    def main(self):
        cookie = self.second_request()
        self.get_data(cookie)


if __name__ == '__main__':
    oz = OuYeel()
    oz.main()

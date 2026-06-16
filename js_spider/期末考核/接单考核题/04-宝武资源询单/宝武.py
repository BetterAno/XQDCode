import json
import re
# import pymongo
import subprocess
from functools import partial
subprocess.Popen = partial(subprocess.Popen, encoding="utf-8")
import execjs
import requests


class BWSpider:
    def __init__(self):
        # self.db = pymongo.MongoClient()['py_spider']['BWu']
        self.headers = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "application/json;charset=UTF-8",
            "Origin": "https://qiye.obei.com.cn",
            "Pragma": "no-cache",
            "Referer": "https://qiye.obei.com.cn/web-zone/bwzy/procurement.html",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            # "traceparent": "00-7468a25233bccad0196e01d7b0d1792f-196e01d7b0d1792f-01"
        }
        self.api_url = "https://qiye.obei.com.cn/web-zone/api/sys/zone/getPurchaseList"
        self.session = requests.session()

    def req_index(self):
        response = self.session.get("https://qiye.obei.com.cn/web-zone/bwzy/procurement.html")
        print('第一次请求首页的状态码为:', response)

        response = self.session.get("https://qiye.obei.com.cn/web-zone/bwzy/procurement.html")
        encrypt_js_code = re.findall("type=\"text/javascript\" r='m'>(.*?)</script><script type=", response.text)[0]
        with open('get_cookie.js', 'r', encoding='utf-8') as f:
            js_code = f.read().replace('encrypt_js_code', encrypt_js_code)
        ENVTGhxsh01MP = execjs.compile(js_code).call("get_cookie").split("ENVTGhxsh01MP=")[1]
        self.session.cookies.set('ENVTGhxsh01MP', ENVTGhxsh01MP)

        response = self.session.get("https://qiye.obei.com.cn/web-zone/bwzy/procurement.html")
        print('第二次请求首页的状态码为:', response)

    def get_data(self, page):
        data = {
            "code": "bwzy",
            "noticeType": "1",
            "pageNum": page,
            "pageSize": 10,
            "pageFlag": "addSelect",
            "sidx": "issueDate",
            "sord": "desc"
        }
        data = json.dumps(data, separators=(',', ':'))
        response = self.session.post(self.api_url, headers=self.headers, data=data).json()
        self.parse_data(response)

    def parse_data(self, response):
        items_all = []
        for info in response['data']:
            item = dict()
            item['title'] = info['title']
            item['issueDate'] = info['issueDate']
            item['rfqMethod'] = '询比价' if info['rfqMethod'] == 'RAQ' else '综合比价'  # RAQ 为询比价; TBQ 为综合比价
            items_all.append(item)
            print(items_all)
        # self.save_data(items_all)

    # def save_data(self, items_all):
    #     try:
    #         self.db.insert_many(items_all)
    #         print('数据保存成功:', items_all)
    #     except Exception as e:
    #         print('数据保存失败:', e)

    def mian(self):
        self.req_index()
        for page in range(1, 11):
            print(f'正在爬取第{page}页数据...')
            self.get_data(page)


if __name__ == '__main__':
    bw = BWSpider()
    bw.mian()

"""
目标 ： 王者荣耀游戏账号交易平台 盼之代售
url ： https://www.pzds.com/goodsList/7/6
要求 ： 多线程
目标数据 ： 价格 标题 热度
记录 ： 找到翻页 page api 请求，浏览器xhr请求可以以json返回全部数据
        直接请求 460
        不带cookie 460
        + 不带 params 返回js
        核心： params
        网页实际也POST了两次
"""
import json
import threading
from queue import Queue
from threading import Thread

import execjs
import pymongo
import requests


class PzdsSpider:
    mongo_client = pymongo.MongoClient()
    mongo_collection = mongo_client['py_spider']['pzds']

    def __init__(self):
        self.headers = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "application/json",
            "DNT": "1",
            "Origin": "https://www.pzds.com",
            "PZOs": "windows",
            "PZPlatform": "pc",
            "PZVersion": "1.0.0",
            "PZVersionCode": "1",
            "Pragma": "no-cache",
            "Referer": "https://www.pzds.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Skey": "CLIENT",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            "channelInfo": "{\"channelCode\":null,\"tag\":null,\"channelType\":null,\"searchWord\":\"null\"}",
            "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"133\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "x-oss-forbid-overwrite": "true"
        }
        self.url = "https://api.pzds.com/api/web-client/v2/public/goodsPublic/page"
        self.js = execjs.compile(open('gen_params.js', 'r', encoding='utf-8').read())

        self.param_queue = Queue()
        self.res_queue = Queue()
        self.out_queue = Queue()

    def gen_params(self):
        for page in range(45, 46):
            data = {
                "order": "ASC",
                "sort": None,
                "page": page,
                "pageSize": 21,
                "action": {
                    "gameId": "7",
                    "goodsCatalogueId": 6,
                    "merchantMark": None,
                    "keywords": [],
                    "searchWords": [],
                    "searchPropertyIds": [],
                    "unionGameIds": [],
                    "goodsSearchActions": []
                }
            }
            params = self.js.call('gen_params', data)
            url = self.url + params['search_params']
            headers = self.headers
            headers['PZTimestamp'] = str(params['PZTimestamp'])
            headers['Sign'] = params['Sign']
            headers['Random'] = str(params['Random'])
            data = json.dumps(data, separators=(',', ':'))
            self.param_queue.put([url, headers, data])

    def req_get_data(self):
        while True:
            params = self.param_queue.get()
            response = requests.post(params[0], headers=params[1], data=params[2], verify=False)
            try:
                self.res_queue.put(response.json())
            except Exception as e:
                print(f"线程{threading.current_thread().name}请求json失败:{e}")
                with open('debug_verify.html', 'w', encoding='utf-8') as f:
                    f.write(response.text)
            finally:
                self.param_queue.task_done()

    def parse(self):
        while True:
            res = self.res_queue.get()
            try:
                records = res['data']['records']
                for record in records:
                    item = dict()
                    item['price'] = record['price']
                    item['title'] = record['title']
                    item['hots'] = record['hots']
                    self.out_queue.put(item)
                    print(f'线程{threading.current_thread().name}数据: {item}')
            except Exception as e:
                print(f"线程{threading.current_thread().name}json解析失败：{e}")
            finally:
                self.res_queue.task_done()

    def save2db(self):
        while True:
            data = self.out_queue.get()
            # self.mongo_collection.insert_one(data)
            self.out_queue.task_done()

    def close_database(self):
        self.mongo_client.close()

    def main(self):
        thread_gen_params = Thread(target=self.gen_params)
        thread_gen_params.start()

        thread_list = []
        for _ in range(1):
            thread_list.append(Thread(target=self.req_get_data))

        thread_list.append(Thread(target=self.parse))
        thread_list.append(Thread(target=self.save2db))

        for thread in thread_list:
            thread.daemon = True
            thread.start()

        thread_gen_params.join()

        for queue in [self.param_queue, self.res_queue, self.out_queue]:
            queue.join()

        self.close_database()


if __name__ == '__main__':
    spider = PzdsSpider()
    spider.main()

"""
目标： 影视综Rank 首页数据top10
url： https://www.chinaindex.net/ranklist/5
要求： 字段不限，mongodb存储
记录： 推测api https://www.chinaindex.net/iIndexMobileServer/teleplay/rank/waiting/fans 其它返回都太短
        返回数据有加密
"""
import requests
import pymongo


class YshzSpider:
    def __init__(self):
        self.headers = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-TW,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "DNT": "1",
            "Pragma": "no-cache",
            "Referer": "https://www.chinaindex.net/ranklist/5",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "UUID": "8ac87cde-c8ea-5134-a31a-e7ff6b98aeff",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
            "funcID": "undefined",
            "incognitoMode": "0",
            "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        self.url = "https://www.chinaindex.net/iIndexMobileServer/teleplay/rank/waiting/fans"
        import subprocess
        from functools import partial
        subprocess.Popen = partial(subprocess.Popen, encoding="utf-8")
        import execjs
        self.js = execjs.compile(open('decrypt.js', 'r', encoding='utf-8').read())
        self.mongo_client = pymongo.MongoClient()
        self.collection = self.mongo_client['py_spider']["yshzan_rank"]

    def send_req(self):
        # 这个参数不会变，加密数组是固定的
        params = {
            "sign": "46cf510e48f99667216bfa781d6bebab"
        }
        response = requests.get(self.url, headers=self.headers, params=params)
        return response.json()

    def parse(self, res):
        last_fetch_time = res['lastFetchTime']
        raw_data = res['data']
        data = self.js.call('decrypt', last_fetch_time, raw_data)
        rank_list = data['rank_list']
        for obj in rank_list:
            item = dict()
            item['_id'] = obj['object_id']
            item['rank'] = obj['rank']
            item['fans_num'] = obj['fans_num']
            item['name'] = obj['object_info']['name']
            self.collection.insert_one(item)
            print(f'数据入库成功：{item}')
            if item['rank'] > 10:
                break

    def main(self):
        res = self.send_req()
        self.parse(res)
        self.mongo_client.close()


if __name__ == '__main__':
    spider = YshzSpider()
    spider.main()

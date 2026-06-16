"""
目标： 云南省建设监管公共服务平台
url： https://www.ynjzjgcx.com/dataPub/enterprise
要求： 采集数据100条、要求对标题进行hash处理去重
字段： 企业名称 信用代码 企业注册地
记录： 打开有滑动验证码...又
"""
import json
import ddddocr
import execjs
import requests
import base64
import redis
import hashlib


class YnjsjgSpider:
    def __init__(self):
        self.headers = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-TW,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "application/json;charset=UTF-8",
            "DNT": "1",
            "Origin": "https://www.ynjzjgcx.com",
            "Pragma": "no-cache",
            "Referer": "https://www.ynjzjgcx.com/dataPub/enterprise",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
            "appId": "84ded2cd478642b2",
            "isToken": "false",
            "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        self.slider_url = "https://www.ynjzjgcx.com/prod-api/mohurd-pub/vcode/genVcode"
        self.data_url = "https://www.ynjzjgcx.com/prod-api/mohurd-pub/dataServ/findBaseEntDpPage"
        self.js = execjs.compile(open('gen_params.js', 'r', encoding='utf-8').read())
        self.redis_client = redis.Redis()

    def res_get_slider(self):
        data = {
            "key": "query"
        }
        data = self.js.call('gen_data', data)
        response = requests.post(self.slider_url, headers=self.headers, data=data)
        res_data = json.loads(response.json()['data'])
        slideId = res_data['slideId']
        bg = res_data['bigImage']
        front = res_data['smallImage']
        return slideId, bg, front

    @staticmethod
    def gen_slider_info(bg, front):
        background_bytes = base64.b64decode(bg)
        target_bytes = base64.b64decode(front)
        det = ddddocr.DdddOcr(det=False, ocr=False)
        width_r = det.slide_match(target_bytes, background_bytes, simple_target=True)['target'][0]
        return round(width_r)

    def gen_vcode_data(self):
        slideId, bg, front = self.res_get_slider()
        width = self.gen_slider_info(bg, front)
        return slideId, width

    def res_get_data(self, page, slideId, width):
        data = {
            "pageNum": page,
            "pageSize": 10,
            "certificateType": "",
            "name": "",
            "slideId": slideId,
            "key": "query",
            "width": width
        }
        data = self.js.call('gen_data', data)
        response = requests.post(self.data_url, headers=self.headers, data=data)
        return response.json()

    def name_verify(self, name):
        md5_data = hashlib.md5(name.encode('utf-8')).hexdigest()
        if self.redis_client.sadd('ynjsjg:name', md5_data):
            return True
        else:
            print(f'标题重复:{name}')
            return False

    def parse(self, res):
        if res['code'] == 200:
            records = res['data']['records']
            for record in records:
                item = dict()
                item['name'] = record['name']
                item['creditCode'] = record['creditCode']
                item['address'] = record['address']
                if self.name_verify(record['name']):
                    print(item)
            return True
        else:
            print(res['msg'])
            return False

    def main(self):
        for page in range(1, 11):
            slideId, width = self.gen_vcode_data()
            res = self.res_get_data(page, slideId, width)
            while not self.parse(res):
                slideId, width = self.gen_vcode_data()
                res = self.res_get_data(page, slideId, width)


if __name__ == '__main__':
    spider = YnjsjgSpider()
    spider.main()

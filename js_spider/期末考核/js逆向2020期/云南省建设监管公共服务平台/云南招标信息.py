import base64
import hashlib
import json
import time
import ddddocr
import execjs
import pymongo
import redis
import requests


class YNJS:
    def __init__(self):
        self.headers = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "application/json;charset=UTF-8",
            "Origin": "https://www.ynjzjgcx.com",
            "Pragma": "no-cache",
            "Referer": "https://www.ynjzjgcx.com/mohurd/data-query/enterprise",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            "appId": "84ded2cd478642b2",
            "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        self.url = "https://www.ynjzjgcx.com/prod-api/mohurd-pub/dataServ/entMgt/entQuery/findPage"  # 请求验证码和请求信息为同一个接口
        self.check_captcha_url = "https://www.ynjzjgcx.com/prod-api/mohurd-system/captcha/check"
        self.js = execjs.compile(open('获取请求和校验验证码参数.js', encoding='utf-8').read())
        self.det = ddddocr.DdddOcr(beta=True, show_ad=False)
        self.mongo_client = pymongo.MongoClient()
        self.db = self.mongo_client['py_spider']['yn_info']
        self.redis_client = redis.Redis()

    def get_captcha(self, page):
        data = {
            "params": self.js.call('get_param', page)
        }
        data = json.dumps(data, separators=(',', ':'))
        response = requests.post(self.url, headers=self.headers, data=data).json()
        return self.parse_captcha(page, response)

    def parse_captcha(self, page, response):
        captchaType = response['data']['captchaType']  # clickWord(点选)/blockPuzzle(滑块)
        token = response['data']['token']
        secretKey = response['data']['secretKey']
        if captchaType == 'blockPuzzle':
            # print('滑块验证码')
            jigsawImageBase64 = response['data']['jigsawImageBase64']
            originalImageBase64 = response['data']['originalImageBase64']
            with open('full.png', 'wb') as f:
                f.write(base64.b64decode(jigsawImageBase64))
            with open('bg.png', 'wb') as f:
                f.write(base64.b64decode(originalImageBase64))
            distance = self.dddd_ocr()  # 使用dddd_ocr库识别滑块验证码
            return captchaType, distance, token, secretKey
        elif captchaType == 'clickWord':
            wordList = ','.join(response['data']['wordList'])
            # print('点选验证码', wordList)
            originalImageBase64 = response['data']['originalImageBase64']
            with open('click.png', 'wb') as f:
                f.write(base64.b64decode(originalImageBase64))
            xy_arr = self.verify(wordList)  # 使用在线云码识别点选验证码
            return captchaType, xy_arr, token, secretKey

    def dddd_ocr(self):
        with open('full.png', 'rb') as f:
            full_bytes = f.read()
        with open('bg.png', 'rb') as f:
            bg_bytes = f.read()
        res = self.det.slide_match(full_bytes, bg_bytes)
        print('滑块的距离为:', res['target'][0])
        return res['target'][0]

    @staticmethod
    def verify(word_str):
        with open('click.png', 'rb') as f:
            b = base64.b64encode(f.read()).decode()
        url = "http://api.jfbym.com/api/YmServer/customApi"
        data = {
            "token": "YH5M9mLF88nOtPZG9ToAeaKGm6CcCebgi1JsEalBRlg",
            "type": "30100",
            "image": b,
            'extra': word_str
        }
        _headers = {
            "Content-Type": "application/json"
        }
        response = requests.request("POST", url, headers=_headers, json=data).json()
        print('点选的坐标为:', response['data']['data'])
        xy_arr = [
            {"x": int(x), "y": int(y)}
            for x, y in [s.split(',') for s in response['data']['data'].split('|')]
        ]
        return xy_arr

    def check_captcha(self, captchaType, dis_or_xy_arr, token, secretKey):
        param = self.js.call('check_params', captchaType, dis_or_xy_arr, secretKey, token)

        data = {
            "params": param
        }
        data = json.dumps(data, separators=(',', ':'))
        response = requests.post(self.check_captcha_url, headers=self.headers, data=data).json()
        token = response['repData']['token']
        pointJson = response['repData']['pointJson']
        return token, pointJson

    def get_info(self, captchaType, token2, secretKey, dis_or_xy_arr, page):
        print(captchaType, token2, secretKey, dis_or_xy_arr)
        headers = self.headers.copy()
        headers['CaptchaVerification'] = self.js.call('get_info_param', captchaType, token2, secretKey,
                                                      dis_or_xy_arr)
        data = {
            "params": self.js.call('get_param', page)
        }
        data = json.dumps(data, separators=(',', ':'))
        response = requests.post(self.url, headers=headers, data=data).json()
        self.parse_info(response)

    def parse_info(self, response_dict):
        for info in response_dict['data']['records']:
            item = dict()
            item['name'] = info['name']
            item['creditCode'] = info['creditCode']
            item['province'] = info['province']
            self.save_info(item)

    @staticmethod
    def info_deduplication(item):
        md5_hash = hashlib.md5(str(item).encode('utf-8')).hexdigest()
        return md5_hash

    def save_info(self, item):
        md5_hash = self.info_deduplication(item)
        flag = self.redis_client.sadd('yn_info', md5_hash)
        if flag:
            try:
                self.db.insert_one(item)
                print('数据保存成功:', item)
            except Exception as e:
                print('数据保存失败:', item, e)
        else:
            print('数据重复:', item)

    def main(self):
        for page in range(1, 11):
            try:
                print('正在请求第:', page, '页')
                time.sleep(1)
                captchaType, dis_or_xy_arr, token1, secretKey = self.get_captcha(page)
                token2, pointJson = self.check_captcha(captchaType, dis_or_xy_arr, token1, secretKey)
                self.get_info(captchaType, token2, secretKey, dis_or_xy_arr, page)
            except Exception as e:
                print('重新请求...', e)
                continue


if __name__ == '__main__':
    ynjs = YNJS()
    ynjs.main()

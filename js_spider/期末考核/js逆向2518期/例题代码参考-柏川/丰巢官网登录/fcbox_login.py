"""
目标： 丰巢快递登录
url： https://www.fcbox.com/pages/user/login.html
问题： 1. 账号密码登录 2. 滑块拼图验证码

记录：
    它验证码url后面那段参数每次还不一样，直接搜不行
    推测为刷新、登录按钮绑定了js事件
"""
import json
import os
import random
from math import floor

import execjs
import requests
from slider_coordinate import CoordinateGenerator
from move_simulator import Simulator


class FcLoginSpider:
    def __init__(self):
        self.verify_headers = {
            "Accept": "*/*",
            "Accept-Language": "zh-TW,zh;q=0.9,zh-CN;q=0.8,en-US;q=0.7,en;q=0.6",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "application/json",
            "DNT": "1",
            "Origin": "https://www.fcbox.com",
            "Pragma": "no-cache",
            "Referer": "https://www.fcbox.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-gpc": "1"
        }
        self.img_headers = {
            "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "accept-language": "zh-TW,zh;q=0.9,zh-CN;q=0.8,en-US;q=0.7,en;q=0.6",
            "cache-control": "no-cache",
            "dnt": "1",
            "pragma": "no-cache",
            "priority": "i",
            "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "image",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "cross-site",
            "sec-fetch-storage-access": "none",
            "sec-gpc": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
        }
        self.login_headers = {
            "Accept": "*/*",
            "Accept-Language": "zh-TW,zh;q=0.9,zh-CN;q=0.8,en-US;q=0.7,en;q=0.6",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "DNT": "1",
            "Pragma": "no-cache",
            "Referer": "https://www.fcbox.com/pages/user/login.html",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest",
            "fc_version_no": "8066002",
            "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-gpc": "1"
        }
        self.verify_get_url = "https://acs.fcbox.com/captcha/querySlideImage/"
        self.verify_check_url = "https://acs.fcbox.com/captcha/checkCode/"
        self.pub_key_url = "https://www.fcbox.com/noshiro/getPublicKey"
        self.login_url = "https://www.fcbox.com/passport/login"
        self.verify_para = ""
        self.return_data = ""
        self.key = ""
        self.y = 0
        self.js = execjs.compile(open('dealing_verify.js', 'r', encoding='utf-8').read())

    def save_img(self, url):
        response = requests.get(url, headers=self.img_headers)
        dirname = './image'
        filename = url.split('/')[-1]
        if not os.path.exists(dirname):
            os.mkdir(dirname)
        fullname = os.path.join(dirname, filename)
        with open(fullname, 'wb') as f:
            f.write(response.content)
        return fullname

    def verify_get(self):
        para = self.js.call('gen_url_para')
        self.verify_para = para
        url = self.verify_get_url + para
        data = {}
        data = json.dumps(data, separators=(',', ':'))
        # print(data)
        response = requests.post(url, headers=self.verify_headers, data=data)
        print(response.json())
        res_data = response.json()['data']
        self.return_data = res_data['clientIp'] + res_data['checkId'] + para
        self.key = res_data['key']
        self.y = res_data['pointY']
        shadeImageUrl = res_data['shadeImageUrl']
        slideImageUrl = res_data['slideImageUrl']
        return self.save_img(shadeImageUrl), self.save_img(slideImageUrl)

    # 存在图片缩放的可能，测试比例
    # 网页 : xh_max = 275 xh_min = 0
    # 实际图片对应位置: xr_max = 355 xr_min = 15
    # xh = (xr - xr_min) * (xh_max - xh_min) / (xr_max - xr_min)
    # 带入一组实际值测试 xh = 218 xr = 287 xhc = 220 差不多，公式成立
    @staticmethod
    def gen_tra(target):
        xh_max = 275
        xh_min = 0
        xr_max = 355
        xr_min = 15
        tra = []
        length = random.randint(190, 360)
        move_simulator = Simulator()
        orig_tra = move_simulator.second_order_system_simulator(target, duration=length)
        for orig_x in orig_tra:
            x = max(floor((orig_x - xr_min) * (xh_max - xh_min) / (xr_max - xr_min) + random.random() * 2 - 1), 0)
            tra.append(x)
        return tra

    def verify_check(self, tra):
        url = self.verify_check_url + self.verify_para
        data = self.js.call('gen_data', self.return_data, tra, self.y, self.key)
        print(data)
        response = requests.post(url, headers=self.verify_headers, data=data)
        print(response.json())
        if response.json()['success']:
            return response.json()['data']['token']
        return ''

    # 需要先获取公钥
    def login(self, token, username, password):
        response = requests.post(self.pub_key_url, headers=self.login_headers)
        key = response.json()['data']
        data = self.js.call('gen_login_encrypt_data', password, key)
        params = {
            "username": username,
            "password": data['password'],
            "verifyCode": token,
            "_": str(data['time'])
        }
        response = requests.get(self.login_url, headers=self.login_headers, params=params)
        print(response.json())

    def main(self):
        bg, front = self.verify_get()
        coordinate = CoordinateGenerator(bg, front)
        tra = self.gen_tra(coordinate.base_slider()['target'][2])
        token = self.verify_check(tra)
        print(token)
        # if token != '':
        #     self.login(token, "", "")


if __name__ == '__main__':
    spider = FcLoginSpider()
    spider.main()

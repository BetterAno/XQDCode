import base64
import json
import random

import execjs
import requests


class YiDun:
    def __init__(self):
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://dun.163.com/",
            "Sec-Fetch-Dest": "script",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Google Chrome\";v=\"145\", \"Chromium\";v=\"145\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        self.ctx = execjs.compile(open('./js_code/main.js', encoding='utf-8').read())
        self.cookies = {
            "_ga": "GA.1.2120438336894.b99a5efe0584fcab86ac",
            "Hm_lvt_4671c5d502135636b837050ec6d716ce": "1772359109",
            "HMACCOUNT": "17FB3224ECA269D5",
            "__root_domain_v": ".163.com",
            "_qddaz": "QD.468265178429263",
            "Hm_lpvt_4671c5d502135636b837050ec6d716ce": "1772359147"
        }

    def get_png(self):
        url = "https://c.dun.163.com/api/v3/get"
        params = {
            "referer": "https://dun.163.com/trial/picture-click",
            "zoneId": "CN31",
            "dt": "8Jtfrl4nUOFBFhQREQKCmLuk53NwvC0n",
            "irToken": "Pylv7mznSTxEJ0AEARPC8J2A8uUu7hj+",
            "id": "07e2387ab53a4d6f930b8d9a9be71bdf",
            "fp": "PzS/UWugdQfp4Q3aJQAK516AuzaV+Q+0oxT5Rv0+RQDRUyMtZmS/ivnOuvkQYfIEpS9uJN7MU0Zh1Viy\\CGLtpChdIVcUm\\YWSW\\RdtgR5I3KhOXb3J0/kus7fliJ4OBqeh8PCpR/pwJvwpj5TS2ZjWY+BHyQHlSOywxMIKzjpeRiK7s:1772360017445",
            "https": "true",
            "type": "3",
            "version": "2.28.5",
            "dpr": "1.25",
            "dev": "1",
            "cb": self.ctx.call('get_cb'),
            "ipv6": "false",
            "runEnv": "10",
            "group": "",
            "scene": "",
            "lang": "zh-CN",
            "sdkVersion": "",
            "loadVersion": "2.5.4",
            "iv": "4",
            "user": "",
            "width": "320",
            "audio": "false",
            "sizeType": "10",
            "smsVersion": "v3",
            "token": "e18d2c552ec648d0af8393f51243ca03",
            "callback": "__JSONP_sxmjgr2_9"
        }
        response = requests.get(url, headers=self.headers, cookies=self.cookies, params=params)
        bg_jpg = json.loads(response.text.split('(')[1].split(');')[0])['data']['bg'][0]
        front = json.loads(response.text.split('(')[1].split(');')[0])['data']['front']
        token = json.loads(response.text.split('(')[1].split(');')[0])['data']['token']
        self.parse_png(bg_jpg)
        return front, token

    @staticmethod
    def parse_png(bg_jpg):
        with open('bg.png', 'wb') as f:
            f.write(requests.get(bg_jpg).content)

    def verify(self, front):
        url = "http://api.jfbym.com/api/YmServer/customApi"
        data = {
            "token": "YH5M9mLF88nOtPZG9ToAeaKGm6CcCebgi1JsEalBRlg",
            "type": "300010",
            'extra': front,
            "image": base64.b64encode(open('bg.png', 'rb').read()).decode(),
        }
        _headers = {
            "Content-Type": "application/json"
        }
        response = requests.request("POST", url, headers=_headers, json=data).json()
        xy = response['data']['data']
        return xy

    def get_gj(self, xy):
        xy = xy.split('|')
        xy_list = [i.split(',') for i in xy]
        xy_list = [[int(num1), int(mum2)] for num1, mum2 in xy_list]
        # print(xy_list)
        tr = []
        zb = []
        for i in range(len(xy_list) - 1):
            s, e = xy_list[i], xy_list[i + 1]
            if not tr:
                tr.append([*s, 13])
                zb.append([*s, 13])
            np = random.randint(30, 40)  # 点到点之间生成多少个坐标点
            bt = random.randint(15, 20)  # 时间差值
            for j in range(np):
                p = (j + 1) / (np + 1)  # 获取进度比例
                x = int(s[0] + (e[0] - s[0]) * p)
                y = int(s[1] + (e[1] - s[1]) * p)
                tr.append([x, y, tr[-1][2] + bt])
            tr.append([*e, tr[-1][2] + bt])  # 确保我们的轨迹到重点
            zb.append(tr[-1])  # 确保我们的轨迹到重点
        return tr, zb

    def check_captcha(self, token, tr, zb):
        cb = self.ctx.call('get_cb')
        tr_dec = self.ctx.call('get_Data', token, tr, zb)
        params = {
            "referer": "https://dun.163.com/trial/picture-click",
            "zoneId": "CN31",
            "dt": "Mt7aIjLpe51AR1RVVFLUujVr9k5a7Ch9",
            "id": "07e2387ab53a4d6f930b8d9a9be71bdf",
            "token": token,
            "data": tr_dec,
            "width": "320",
            "type": "3",
            "version": "2.28.5",
            "cb": cb,
            "user": "",
            "extraData": "",
            "bf": "0",
            "runEnv": "10",
            "sdkVersion": "",
            "loadVersion": "2.5.3",
            "iv": "4",
            "callback": "__JSONP_aar8eoq_1"
        }
        response = requests.get("https://c.dun.163.com/api/v3/check", headers=self.headers, params=params)
        print(response.text)

    def main(self):
        for i in range(5):
            front, token = self.get_png()
            xy = self.verify(front)
            tr, zb = self.get_gj(xy)
            self.check_captcha(token, tr, zb)


if __name__ == '__main__':
    yd = YiDun()
    yd.main()

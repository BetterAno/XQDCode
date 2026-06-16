import json
import random
import uuid

import ddddocr

import subprocess
from functools import partial
subprocess.Popen = partial(subprocess.Popen, encoding="utf-8")
import execjs


import requests
from PIL import Image


class YunPian:
    def __init__(self):
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Sec-Fetch-Dest": "script",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        self.det = ddddocr.DdddOcr(beta=True, show_ad=False)
        self.js = execjs.compile(open("获取请求和验证参数.js", encoding="utf-8").read())

    def get_captcha(self):
        url = "https://captcha.yunpian.com/v1/jsonp/captcha/get"
        item = self.js.call('get_captcha_params')
        params = {
            "cb": item['cb'],
            "i": item['i'],
            "k": item['k'],
            "captchaId": "974cd565f11545b6a5006d10dc324281"
        }
        response = requests.get(url, headers=self.headers, params=params)
        bg_url = json.loads(response.text[8:-1])['data']['bg']
        front_url = json.loads(response.text[8:-1])['data']['front']
        token = json.loads(response.text[8:-1])['data']['token']
        sliderWidth = json.loads(response.text[8:-1])['data']['sliderWidth'] / 1.57
        return bg_url, front_url, token, sliderWidth

    def parse_img(self, bg_url, front_url):
        bg_bytes = requests.get(bg_url).content
        front_bytes = requests.get(front_url).content
        with open('bg.png', 'wb') as f:
            f.write(bg_bytes)
        with open('front.png', 'wb') as f:
            f.write(front_bytes)
        distance = self.dddd_ocr(bg_bytes, front_bytes)
        return distance

    def dddd_ocr(self, bg_bytes, front_bytes):
        res = self.det.slide_match(front_bytes, bg_bytes, simple_target=True)
        print('滑动的距离为:', res['target'][0])
        return res['target'][0]

    @staticmethod
    def parse_front():
        image = Image.open('front.png')
        width, height = image.size
        print('原始图片宽度:', width)
        """
        1.先获取页面js中的实际宽度 例如: this.alertImgTag.width = 59
        2.通过pillow包读取的本地滑块宽度为: 93
        3.得到比例: 93 / 59 约等于1.58
            比例值允许存在误差
        """
        return int(image.size[0] / 1.57)  # 缩放比例为1.57

    @staticmethod
    def generate_gj(slide_distance):
        start_x = random.randint(1100, 1120)  # x轴范围
        start_y = random.randint(1180, 1890)  # y轴范围
        start_t = random.randint(50, 60)  # 时间范围

        trace_data = [[start_x, start_y, start_t]]
        x = 0
        t = 0
        while x < slide_distance:
            x += random.randint(1, 5)
            y = random.randint(-1, 1)
            t += random.randint(10, 20)
            point_x = start_x + x
            point_y = start_y + y
            point_t = start_t + t

            if x >= slide_distance:
                point_x = start_x + slide_distance
                trace = [point_x, point_y, point_t]
                trace_data.append(trace)
                break
            trace = [point_x, point_y, point_t]
            trace_data.append(trace)
        # 验证码回拉操作
        # for _ in range(5):
        #     t += random.randint(10, 20)
        #     point_t = start_t + t
        #     trace = [point_x, point_y, point_t]
        #     trace_data.append(trace)
        return trace_data

    def check(self, gj_list, token, distance, sliderWidth):
        yp_riddler_id = str(uuid.uuid4())
        item = self.js.call('get_check_params', gj_list, sliderWidth, distance, yp_riddler_id)
        url = "https://captcha.yunpian.com/v1/jsonp/captcha/verify"
        params = {
            "cb": self.js.call('get_captcha_params')['cb'],
            "i": item['i'],
            "k": item['k'],
            "token": token,
            "captchaId": "974cd565f11545b6a5006d10dc324281"
        }
        response = requests.get(url, headers=self.headers, params=params)
        print(response.text)

    def main(self):
        for _ in range(10):
            bg_url, front_url, token, sliderWidth = self.get_captcha()
            slide_distance = self.parse_img(bg_url, front_url) / 1.45
            trace_data = self.generate_gj(slide_distance)
            # sliderWidth = self.parse_front()
            self.check(trace_data, token, slide_distance, sliderWidth)


if __name__ == '__main__':
    yp = YunPian()
    yp.main()

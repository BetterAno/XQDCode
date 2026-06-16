import re

import execjs
import requests


class Mps:
    def __init__(self):
        self.session = requests.session()
        self.headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://www.mps.gov.cn/n2253534/n2253875/n2253877/index.html",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        self.url = "https://www.mps.gov.cn/n2253534/n2253875/n2253877/index.html"

    def first_request(self):
        response = self.session.get(self.url, headers=self.headers)
        cookie_code = re.findall('<script>document.cookie=(.*?);location', response.text)[0]
        __jsl_clearance_s = execjs.eval(cookie_code).split('clearance_s=')[-1]
        return __jsl_clearance_s

    def second_request(self):
        __jsl_clearance_s = self.first_request()
        self.session.cookies.set('__jsl_clearance_s', __jsl_clearance_s)
        response = self.session.get(self.url, headers=self.headers)
        js_code = re.findall('<script>(.*?)</script>', response.text)[0]
        return js_code

    def third_request(self):
        js_code = self.second_request()
        ctx = execjs.compile(
            open('请求返回js中获取cookie.js', 'r', encoding='utf-8').read().replace('func_code', js_code))
        __jsl_clearance_s = ctx.call('get_cookie').split('clearance_s=')[-1]
        self.session.cookies.set('__jsl_clearance_s', __jsl_clearance_s)
        response = self.session.get(self.url, headers=self.headers)
        # print(response.text)

    def get_data(self):
        for page in range(2, 3):
            url = f"https://www.mps.gov.cn/n2253534/n2253875/n2253877/index_8221059_{page}.html"
            response = self.session.get(url, headers=self.headers)
            response.encoding = 'utf-8'
            print(response.text)
            print(response)

    def main(self):
        self.third_request()
        self.get_data()


if __name__ == '__main__':
    mps = Mps()
    mps.main()

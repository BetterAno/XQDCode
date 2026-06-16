import re

import execjs
import requests


class ChinaPatent:
    def __init__(self):
        self.headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "http://epub.cnipa.gov.cn/",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
        }
        self.url = "http://epub.cnipa.gov.cn/"
        self.js = execjs.compile(open('main.js', encoding='utf-8').read())
        self.session = requests.session()

    def first_request(self):
        response = self.session.get(self.url, headers=self.headers)
        encrypt_code = re.findall(r"type=\"text/javascript\" r='m'>(.*?)</script><script", response.text)[0]
        with open('encrypt_js_code.js', 'wb') as f:
            f.write(encrypt_code.encode('utf-8'))

    def second_request(self):
        NOh8RTWx6K2dT = self.js.call('get_cookie').split('NOh8RTWx6K2dT=')[1]
        self.session.cookies.set('NOh8RTWx6K2dT', NOh8RTWx6K2dT)
        response = self.session.get(self.url, headers=self.headers)
        print(response.text)
        print(response)

    def main(self):
        self.first_request()
        self.second_request()


if __name__ == '__main__':
    zl = ChinaPatent()
    zl.main()

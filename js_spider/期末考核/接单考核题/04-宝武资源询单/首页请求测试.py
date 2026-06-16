import re

import execjs
import requests


class BWSpider:
    def __init__(self):
        self.headers = {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36"
        }
        self.url = "https://qiye.obei.com.cn/web-zone/bwzy/procurement.html"

    def first_request(self):
        response = requests.get(self.url, headers=self.headers)
        encrypt_js_code = re.findall("type=\"text/javascript\" r='m'>(.*?)</script><script type=", response.text)[0]
        with open('get_cookie.js', 'r', encoding='utf-8') as f:
            js_code = f.read().replace('encrypt_js_code', encrypt_js_code)
        self.js = execjs.compile(js_code)

    def second_request(self):
        ENVTGhxsh01MP = self.js.call('get_cookie').split('ENVTGhxsh01MP=')[1]
        cookie = {
            "ENVTGhxsh01MP": ENVTGhxsh01MP
        }
        response = requests.get(self.url, headers=self.headers, cookies=cookie)
        print(response.text)
        print(response)

    def main(self):
        self.first_request()
        self.second_request()


if __name__ == '__main__':
    bw = BWSpider()
    bw.main()

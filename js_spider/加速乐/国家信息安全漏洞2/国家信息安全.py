import re

import execjs
import requests


class Cnvd:
    def __init__(self):
        self.session = requests.session()
        self.headers = {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=0, i",
            "referer": "https://www.cnvd.org.cn/flaw/typelist?typeId=27",
            "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
        }
        self.params = {
            "typeId": "27"
        }
        self.url = "https://www.cnvd.org.cn/flaw/typelist"

    def first_request(self):
        response = self.session.get(self.url, headers=self.headers, params=self.params)
        __jsluid_s = response.cookies.get('__jsluid_s')
        js_code = re.findall('<script>document.cookie=(.*?);location', response.text)[0]
        __jsl_clearance_s = execjs.eval(js_code).split('clearance_s=')[-1]
        return __jsl_clearance_s, __jsluid_s

    def second_request(self):
        __jsl_clearance_s, __jsluid_s = self.first_request()
        cookies = {
            '__jsl_clearance_s': __jsl_clearance_s,
            '__jsluid_s': __jsluid_s
        }
        response = self.session.get(self.url, headers=self.headers, params=self.params, cookies=cookies)
        return re.findall('<script>(.*?)</script>', response.text)[0]

    def third_request(self):
        js_code = self.second_request()
        ctx = execjs.compile(
            open('请求js代码中获取cookie.js', 'r', encoding='utf-8').read().replace('func_code', js_code))
        __jsl_clearance_s = ctx.call('get_cookie').split('clearance_s=')[-1]
        self.session.cookies.set('__jsl_clearance_s', __jsl_clearance_s)
        response = self.session.get(self.url, headers=self.headers, params=self.params)
        # print(response.text)

    def get_data(self):
        url = "https://www.cnvd.org.cn/flaw/typeResult"
        data = {
            "typeId": "27"
        }
        response = self.session.post(url, headers=self.headers, data=data)
        print(response.text)

    def main(self):
        # 先请求三次首页获取cookie, 再访问漏洞列表页面
        self.third_request()
        self.get_data()


if __name__ == '__main__':
    cnvd = Cnvd()
    cnvd.main()

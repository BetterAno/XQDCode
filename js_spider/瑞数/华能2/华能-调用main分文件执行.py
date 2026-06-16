import re
import time

import execjs
import requests


class HuangEn:
    def __init__(self):
        self.headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://ec.chng.com.cn/channel/home/",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        self.url = "https://ec.chng.com.cn/channel/home/"
        self.js = execjs.compile(open('main.js', encoding='utf-8').read())
        # self.session = requests.session()

    def first_request(self):
        params = {
            'SlJfApAfmEBp': str(time.time() * 1000)
        }
        response = requests.get(self.url, headers=self.headers, params=params)
        encrypt_code = re.findall(r"type=\"text/javascript\" r='m'>(.*?)</script><script", response.text)[0]
        with open('encrypt_js_code.js', 'wb') as f:
            f.write(encrypt_code.encode('utf-8'))
        return response.cookies.get('S6J51OuUjLieO')

    def second_request(self):
        S6J51OuUjLieO = self.first_request()
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://ec.chng.com.cn/channel/home/?SlJfApAfmEBp=1764948241217",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        # cookie = re.findall('S6J51OuUjLieP=(.*?); path=/;', self.js.call('get_cookie'))[0]
        cookie = self.js.call('get_cookie').split('S6J51OuUjLieP=')[1]  # cookie有无后缀信息都可
        # self.session.cookies.set('S6J51OuUjLieP', cookie)
        cookies = {
            'S6J51OuUjLieP': cookie,
            'S6J51OuUjLieO': S6J51OuUjLieO
        }
        print(cookies)
        response = requests.get(self.url, headers=headers, cookies=cookies)
        response.encoding = 'utf-8'
        print(response.text)

    def main(self):
        # self.first_request()
        self.second_request()


if __name__ == '__main__':
    huangen = HuangEn()
    huangen.main()

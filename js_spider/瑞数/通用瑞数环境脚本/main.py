# -*- coding:utf-8 -*- 
import subprocess
import time
import urllib.parse
from functools import partial

import requests
from loguru import logger as log  # 日志模块
from lxml import etree

subprocess.Popen = partial(subprocess.Popen, encoding="utf-8")
import execjs
from requests.utils import dict_from_cookiejar


class Rs:
    def __init__(self, url):
        self.session = requests.Session()
        # self.headers = {
        #     "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        #     "Accept-Encoding": "gzip, deflate",
        #     "Accept-Language": "en-GB,en;q=0.9",
        #     "Upgrade-Insecure-Requests": "1",
        #     "User-Agent": "Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36"
        # }
        self.headers = {
            "Accept-Language": "zh-CN,zh;q=0.9",
            "accept": "application/json, text/plain, */*",
            "origin": "https://www.114yygh.com",
            "request-source": "UNICOM_SERVICE",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Android WebView\";v=\"127\", \"Chromium\";v=\"127\"",
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": "Android",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Linux; Android 10; SM-G9880 Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.6533.103 Mobile Safari/537.36"
        }
        self.url = url
        self.cookies = {}
        self.dd = {}
        self.ctll = None
        self.session = requests.session()

    def get_cookie(self):
        response = self.session.get(self.url, headers=self.headers, verify=False)
        cookie_dict = dict_from_cookiejar(response.cookies)
        self.dd.update(cookie_dict)
        # self.cookies.update(cookie_dict)
        log.info('rs提交第一次: %d' % response.status_code)
        tree = etree.HTML(response.content.decode())
        arg1 = tree.xpath('//meta/@content')[-1]
        arg2 = tree.xpath('//script/text()')[0]
        path = urllib.parse.urlparse(self.url)
        log.info('解析地址: %s' % (path.scheme + "://" + path.netloc))
        ts_url = path.scheme + "://" + path.netloc + tree.xpath('//script[2]/@src')[0]
        headers = {
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://www.114yygh.com/newhlwyl/mobile/appointmentRegisterHome?pathchannel=bjwechat",
            "Sec-Fetch-Dest": "script",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36",
            "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": "\"Android\""
        }
        ts_res = requests.get(ts_url, headers=headers, verify=False).text
        with open('browser_envs.js', 'r', encoding='utf-8') as f:
            js = f.read().replace('arg1_content', arg1).replace('"arg2_js"', arg2).replace('"ts_code"', ts_res)
        self.ctll = execjs.compile(js)
        cookie = self.ctll.call('get_cookie')
        # log.info('拿到瑞数真实cookie值:%s' % cookie.split('=')[1])
        cookies = {
            cookie.split('=')[0]: cookie.split('=')[1].split(';')[0]
        }
        self.dd.update(cookies)

    def get_data(self):
        time.sleep(1)
        print(self.cookies)
        cookies = {}
        cookies.update(self.dd)
        response = requests.get(self.url, headers=self.headers, cookies=cookies, verify=False)
        print(response.status_code)
        log.info('rs提交第二次: %s' % response.status_code)
        print(response)

    def run(self):
        self.get_cookie()
        self.get_data()

        # 请求api的逻辑


# 瑞数已更新 2025.12.18
# 需要在Document.createElement() 添加if (tag_name === 'a') {
#         return {}
#     }
if __name__ == '__main__':
    # url = 'http://epub.cnipa.gov.cn'  # 专利
    url = 'https://hb.cbss.10010.cn/cas/login'  # 10010
    # url = 'https://www.ouyeel.com/steel/search?pageIndex=0&pageSize=50'
    ts = Rs(url)
    ts.run()

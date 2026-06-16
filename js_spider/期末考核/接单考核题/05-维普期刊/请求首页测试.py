import re

import execjs
import requests
import subprocess
from functools import partial
subprocess.Popen = partial(subprocess.Popen, encoding="utf-8")

class Qikan:
    def __init__(self):
        self.headers = {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=0, i",
            "referer": "https://qikan.cqvip.com/Qikan/Journal/JournalGuid",
            "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36"
        }
        self.index_url = "https://qikan.cqvip.com/Qikan/Journal/JournalGuid"
        self.params = {
            "from": "Qikan_Journal_JournalGuid"
        }
        self.ctx = None

    def first_request(self):
        response = requests.get(self.index_url, headers=self.headers, params=self.params)
        print(response)
        print(response.text)
        meta_content = re.findall(r"id=\"FbkwzLN5XOx0\" content=\"(.*?)\" r='m'><!", response.text)[0]
        print(meta_content)
        encrypt_js_code = re.findall(r"type=\"text/javascript\" r='m'>(.*?)</script><script type=", response.text)[0]
        with open('get_cookie_demo.js', 'r', encoding='utf-8') as f:
            js_code = f.read().replace('meta_content', meta_content).replace('encrypt_js_code',
                                                                             encrypt_js_code).replace('encrypt_js_code123', encrypt_js_code)
        self.ctx = execjs.compile(js_code)
        return response.cookies.get('6HZbKHDjIEcgS')

    def second_request(self):
        HZbKHDjIEcgS = self.first_request()
        HZbKHDjIEcgT = re.findall("6HZbKHDjIEcgT=(.*?); path=/;", self.ctx.call('get_cookie'))[0]
        cookies = {
            '6HZbKHDjIEcgS': HZbKHDjIEcgS,
            '6HZbKHDjIEcgT': HZbKHDjIEcgT
        }
        print(cookies)
        response = requests.get(self.index_url, headers=self.headers, params=self.params, cookies=cookies)
        print(response.content)
        print(response)
        return cookies

    def get_data(self, cookies):
        headers = {
            "accept": "text/html, */*; q=0.01",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://qikan.cqvip.com",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "referer": "https://qikan.cqvip.com/Qikan/Journal/JournalGuid?from=index%E2%80%8B",
            "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
            "x-requested-with": "XMLHttpRequest"
        }
        url = "https://qikan.cqvip.com/Search/SearchList"
        data = {
            "searchParamModel": "{\"ObjectType\":7,\"SearchKeyList\":[],\"SearchExpression\":null,\"BeginYear\":null,\"EndYear\":null,\"UpdateTimeType\":null,\"JournalRange\":null,\"DomainRange\":null,\"ClusterFilter\":\"ZY=320#产业经济\",\"ClusterLimit\":0,\"ClusterUseType\":\"Article\",\"UrlParam\":\"\",\"Sort\":\"1\",\"SortField\":null,\"UserID\":\"0\",\"PageNum\":1,\"PageSize\":20,\"SType\":null,\"StrIds\":null,\"IsRefOrBy\":0,\"ShowRules\":\"\",\"IsNoteHistory\":0,\"AdvShowTitle\":null,\"ObjectId\":null,\"ObjectSearchType\":0,\"ChineseEnglishExtend\":0,\"SynonymExtend\":0,\"ShowTotalCount\":0,\"AdvTabGuid\":\"\"}"
        }
        response = requests.post(url, headers=headers, data=data, cookies=cookies)
        print(response.text)
        print(response)

    def main(self):
        cookies = self.second_request()
        # self.get_data(cookies)


if __name__ == '__main__':
    qikan = Qikan()
    qikan.main()

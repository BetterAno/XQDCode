import time

import requests
from DrissionPage import ChromiumPage, ChromiumOptions


class MusicDownLoad:
    def __init__(self):
        self.index_url = "https://flac.music.hi.cn/"
        self.session = requests.Session()
        self.headers = {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=0, i",
            "referer": "https://flac.music.hi.cn/",
            "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
        }
        self.download_api = "https://flac.music.hi.cn/ajax.php"

    def get_cookie_jwt(self):
        co = ChromiumOptions()
        # 自己建个文件夹存放DrissionPage的相关信息
        co.set_user_data_path(r"E:\\Python全套课程资料\\课程总代码\\js_spider\\音乐下载\\MyProfile")
        # page = ChromiumPage(addr_or_opts=co)
        # 第一步：跑你之前的挑战脚本，拿到 jwt（只跑一次）
        page = ChromiumPage(addr_or_opts=co)  # 用同一个 profile
        page.get(self.index_url)
        while "sl_jwt_session" not in page.cookies(as_dict=True):
            time.sleep(1)
        jwt = page.cookies(as_dict=True)["sl_jwt_session"]
        page.quit()
        self.session.cookies.set("sl_jwt_session", jwt)

    def first_request(self):
        response = self.session.get(self.index_url, headers=self.headers)

    def second_request(self):
        for _ in range(2):
            response = self.session.get(self.index_url, headers=self.headers)
        # print(response.status_code)

    def get_info(self, keyword):
        headers = {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://flac.music.hi.cn",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            "x-requested-with": "XMLHttpRequest"
        }
        params = {
            "act": "search"
        }
        data = {
            "keyword": keyword,
            "page": "1",
            "size": "30"
        }
        print(self.session.post(self.download_api, headers=headers, params=params, data=data).status_code)
        response = self.session.post(
            self.download_api, headers=headers, params=params, data=data).json()
        songid = response['data']['list'][0]['id']
        singer = response['data']['list'][0]['artist']
        songname = response['data']['list'][0]['name']
        minfo = response['data']['list'][0]['minfo'][0]['bitrate']
        forma = response['data']['list'][0]['minfo'][0]['format']
        print(songid, singer, songname, minfo, forma)
        return {
            "songid": songid,
            "singer": singer,
            "songname": songname,
            "minfo": minfo,
            "format": forma
        }

    def download(self, namelist: list):
        for name in namelist:
            item = self.get_info(name)
            songname = item['songname']
            params = {
                "act": "getUrl"
            }
            data = {
                "songid": item['songid'],
                "format": item['format'],
                "bitrate": item['minfo']
            }
            response = self.session.post(
                self.download_api, headers=self.headers, params=params, data=data)
            self.save(response.json()['data']['url'], response.json()[
                'data']['format'], songname)

    def save(self, url, format, songname):
        response = requests.get(url).content
        with open(f'E:\Python全套课程资料\课程总代码\js_spider\音乐下载\song\{songname}.{format}', 'wb') as f:
            f.write(response)
            print(f'{songname}.{format}下载完成')

    def main(self):
        # self.first_request()
        self.get_cookie_jwt()
        # self.second_request()
        print(self.session.cookies)


if __name__ == '__main__':
    mdl = MusicDownLoad()
    mdl.main()
    mdl.download(['青花瓷'])

import requests


# cookie 加密, 有时效性.
class DownloadMusic:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Origin": "https://flac.music.hi.cn",
            "Connection": "keep-alive",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Priority": "u=0",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "TE": "trailers"
        }
        self.cookies = {
            # "sl-session": "ZYoHEy18CWmJ9F2ItkI/bw==",
            # "sl-challenge-server": "cloud",
            "sl_jwt_session": "fKdkCLhLJGk1FpZUKVsv6Q==",
            # "sl_jwt_sign": ""
        }
        self.url = "https://flac.music.hi.cn/ajax.php"

    def get_info(self, keyword):
        params = {
            "act": "search"
        }
        data = {
            "keyword": keyword,
            "page": "1",
            "size": "30"
        }
        response = requests.post(self.url, headers=self.headers, cookies=self.cookies, params=params, data=data).json()
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
            response = requests.post(self.url, headers=self.headers, cookies=self.cookies, params=params, data=data)
            self.save(response.json()['data']['url'], response.json()['data']['format'], songname)

    def save(self, url, format, songname):
        response = requests.get(url).content
        with open(f'E:\Python全套课程资料\课程总代码\js_spider\音乐下载\song\{songname}.{format}', 'wb') as f:
            f.write(response)
            print(f'{songname}.{format}下载完成')


if __name__ == '__main__':
    dlm = DownloadMusic()
    # namelist = ['夏夜最后的烟火', '童话', '挪威的森林', '我的宣言', '必杀技', 'Nevada', '下坠Falling', '浪人琵琶', '可不可以'
    #             , '侧脸', 'Take Me Hand', 'Superstar', 'Good Time', '赤壁醉', '只对你有感觉', '寄明月', '安娜的橱窗', 
    #             '红色高跟鞋', '追光者', '坏女孩', 'YOUTH', '我们', '心墙', '']
    namelist = ['心墙']
    dlm.download(namelist)

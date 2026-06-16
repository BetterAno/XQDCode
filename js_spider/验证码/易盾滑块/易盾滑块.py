import base64
import json

import ddddocr
import execjs
import requests

from cBezier import bezierTrajectory


class YiDun:
    def __init__(self):
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://dun.163.com/",
            "Sec-Fetch-Dest": "script",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        self.url = "https://c.dun.163.com/api/v3/get"
        self.js = execjs.compile(open('./js_code/main.js', encoding='utf-8').read())
        self.cookies = {
            "_ga": "GA.1.27adcc88bb6bf.3f883bb0d3aa24bdddd2",
            "__root_domain_v": ".163.com",
            "_qddaz": "QD.978562774106329",
            "Hm_lvt_4671c5d502135636b837050ec6d716ce": "1762774104,1762862418,1763394836,1765177951",
            "HMACCOUNT": "C97543C91A944C57",
            "Hm_lpvt_4671c5d502135636b837050ec6d716ce": "1765177963"
        }
        self.det = ddddocr.DdddOcr(det=False, ocr=False, show_ad=False)

    def get_png(self):
        cb = self.js.call('get_cb')
        params = {
            "referer": "https://dun.163.com/trial/jigsaw",
            "zoneId": "CN31",
            "dt": "8Jtfrl4nUOFBFhQREQKCmLuk53NwvC0n",
            "irToken": "3Gn94RGQqLtBY1REQBLWylEArmXhawLg",
            "id": "07e2387ab53a4d6f930b8d9a9be71bdf",
            "fp": "IPXKiVNxGYPZd3IY+5s37NXYMhmvDZzJM7OM2YqJJGLOAsU2w7MrmHooXGyj6vKK+h1DPXLb/kCq7H7/9KBPHW2T2v0HrToVCtMrh\\TfwXhQ3a9vp7SqP+jE7YVjdrkTXGzTh1rS+DBUgV4LeW9cACWpom+gpDZfJjyiJXyf\\6Zm+eSR:1765248055302",
            "https": "true",
            "type": "2",
            "version": "2.28.5",
            "dpr": "1",
            "dev": "1",
            "cb": cb,
            "ipv6": "false",
            "runEnv": "10",
            "group": "",
            "scene": "",
            "lang": "zh-CN",
            "sdkVersion": "",
            "loadVersion": "2.5.3",
            "iv": "4",
            "user": "",
            "width": "320",
            "audio": "false",
            "sizeType": "10",
            "smsVersion": "v3",
            "token": "ec62df2ca44f4f919a6c5f4cc53a1141",
            "callback": "__JSONP_3v5akea_5"
        }
        response = requests.get(self.url, headers=self.headers, params=params)
        res = json.loads(response.text.split('_5(')[1].split(');')[0])
        bg_url = res['data']['bg'][0]
        full_url = res['data']['front'][0]
        token = res['data']['token']
        return bg_url, full_url, token

    def parse1_png(self, bg_url, full_url, token):
        # with open('bg.png', 'wb') as f:
        #     f.write(requests.get(bg_url).content)
        # with open('full.png', 'wb') as f:
        #     f.write(requests.get(full_url).content)
        background_bytes = requests.get(bg_url).content
        target_bytes = requests.get(full_url).content
        distance = self.dddd_ocr(target_bytes, background_bytes)
        return distance

    def dddd_ocr(self, target_bytes, background_bytes):
        # 识别缺口的距离
        det = ddddocr.DdddOcr(det=False, ocr=False, show_ad=False)
        res = det.slide_match(target_bytes, background_bytes)
        print(f"滑动的距离为: {res['target'][0]}")
        return res['target'][0]

    def parse2_png(self, bg, full, token):
        # with open('full.png', 'wb') as f:
        #     f.write(requests.get(full).content)
        # with open('bg.png', 'wb') as f:
        #     f.write(requests.get(bg).content)
        full = base64.b64encode(requests.get(full).content).decode()
        bg = base64.b64encode(requests.get(bg).content).decode()
        distance = self.verify(full, bg)
        return distance

    # 使用云码进行识别
    def verify(self, full_image, bg_image, verify_type="20111"):  # 这里是300010  extra是要传入的识别文字
        payload = {
            "slide_image": full_image,
            'background_image': bg_image,
            "token": "YH5M9mLF88nOtPZG9ToAeaKGm6CcCebgi1JsEalBRlg",
            "type": verify_type
        }
        resp = requests.post("http://api.jfbym.com/api/YmServer/customApi",
                             headers={"Content-Type": "application/json"}, data=json.dumps(payload))
        print('滑动的距离:', resp.json()['data']['data'])
        return int(resp.json()['data']['data'])

    def check(self, guiji, token, slider_x):
        # 校验接口
        cb = self.js.call('window.get_cb')
        data = self.js.call('get_data', guiji, token, slider_x)
        url = "https://c.dun.163.com/api/v3/check"
        params = {
            "referer": "https://dun.163.com/trial/jigsaw",
            "zoneId": "CN31",
            "dt": "5A8duKA4b69EUwBQUFeWLtncnhBWAbeI",
            "id": "07e2387ab53a4d6f930b8d9a9be71bdf",
            "token": token,
            "data": data,
            "width": "320",
            "type": "2",
            "version": "2.28.5",
            "cb": cb,
            "user": "",
            "extraData": "",
            "bf": "0",
            "runEnv": "10",
            "sdkVersion": "",
            "loadVersion": "2.5.3",
            "iv": "4",
            "callback": self.js.call('get_callback')
        }
        response = requests.get(url, headers=self.headers, params=params)
        print(response.text)
        print(response)

    def main(self):
        for _ in range(10):
            bg, full, token = self.get_png()
            slider_x = self.parse1_png(bg, full, token)
            guiji = bezierTrajectory().generate_gj(slider_x + 5)
            self.check(guiji, token, slider_x)


if __name__ == '__main__':
    yd = YiDun()
    yd.main()

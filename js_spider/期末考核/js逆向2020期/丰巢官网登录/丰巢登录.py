import base64
import random
import time
import uuid
import ddddocr
import execjs
import requests


class FcBoxLogin:
    def __init__(self):
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "application/json",
            "Origin": "https://www.fcbox.com",
            "Pragma": "no-cache",
            "Referer": "https://www.fcbox.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        self.login_headers = {
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://www.fcbox.com/pages/user/login.html",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest",
            "fc_version_no": "8066002",
            "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        self.js = execjs.compile(open("获取验证码校验和登录信息.js", encoding="utf-8").read())
        self.det = ddddocr.DdddOcr(det=False, ocr=False, show_ad=False, beta=True)

    def get_captcha(self):
        # 使用Python的uuid模块生成UUID v4
        uuid4 = str(uuid.uuid4())
        url = "https://acs.fcbox.com/captcha/querySlideImage/" + uuid4
        response = requests.post(url, headers=self.headers, data={}).json()
        flag = response['success']  # 获取验证码是否成功 true/false
        if flag:
            distance = self.parse_captcha(response['data']['shadeImageUrl'], response['data']['slideImageUrl'])
            return distance, response['data']['clientIp'], response['data']['checkId'], uuid4, response['data']['key'], \
                response['data']['pointY']

    def parse_captcha(self, shadeImageUrl, slideImageUrl):
        open('full.png', 'wb').write(requests.get(slideImageUrl).content)
        open('bg.png', 'wb').write(requests.get(shadeImageUrl).content)
        # distance = self.verify()  # 使用在线云码平台
        distance = self.dddd_ocr()  # 使用ddddocr开源库
        return distance

    # 使用ddddocr开源库
    def dddd_ocr(self):
        with open('full.png', 'rb') as f:
            target_bytes = f.read()
        with open('bg.png', 'rb') as f:
            background_bytes = f.read()
        res = self.det.slide_match(target_bytes, background_bytes, simple_target=True)  # 要求det=False
        print('滑块的距离为:', res['target'][0])
        return res['target'][0]

    # 使用在线云码平台
    @staticmethod
    def verify():
        with open('full.png', 'rb') as f:
            full = base64.b64encode(f.read()).decode()  # 图片二进制流base64字符串
        with open('bg.png', 'rb') as f:
            bg = base64.b64encode(f.read()).decode()
        url = "http://api.jfbym.com/api/YmServer/customApi"
        data = {
            'slide_image': bg,
            'background_image': full,
            "token": "YH5M9mLF88nOtPZG9ToAeaKGm6CcCebgi1JsEalBRlg",
            "type": "20111",
        }
        _headers = {
            "Content-Type": "application/json"
        }
        response = requests.request("POST", url, headers=_headers, json=data).json()
        print('滑块的距离为:', response['data']['data'])
        return response['data']['data']

    @staticmethod
    def generate_gj(target_x: int, fixed_y: int, start_time: int = None):
        """
        生成轨迹
        :param target_x: 最终到达的x坐标
        :param fixed_y: 固定的y坐标
        :param start_time: 起始时间戳（毫秒），默认当前时间
        :return: [{"x": int, "y": int, "time": int}, ...]
        """
        if start_time is None:
            start_time = int(time.time() * 1000)

        track = []
        current_x = 0
        current_time = start_time

        # 第一点：原地停留一下（真实用户点下去不会立刻动）
        track.append({
            "x": 0,
            "y": fixed_y,
            "time": current_time
        })
        current_time += random.randint(60, 120)  # 按住后轻微延迟

        # 开始移动：每次只走 1 或 2 像素
        while current_x < target_x:
            step = random.choice([1, 1, 1, 2])  # 1出现的概率更高，更自然
            current_x += step
            if current_x > target_x:  # 防止超出
                current_x = target_x

            # 每步延迟 8~22ms（真实鼠标移动频率）
            delay = random.randint(8, 22)
            current_time += delay

            track.append({
                "x": current_x,
                "y": fixed_y,
                "time": current_time
            })

        # 最后停留一帧（重要！很多系统检测最后是否有停留）
        current_time += random.randint(80, 200)
        track.append({
            "x": target_x,
            "y": fixed_y,
            "time": current_time
        })

        return track

    def check_captcha(self, clientIp, checkId, uuid4, gj_list, key):
        data = self.js.call('get_check_params', clientIp, checkId, uuid4, gj_list, key)
        url = "https://acs.fcbox.com/captcha/checkCode/" + uuid4
        data = data.encode('unicode_escape')
        response = requests.post(url, headers=self.headers, data=data)
        flag = response.json()['success']  # 校验验证码是否通过 true/false
        if flag:
            print(response.json())
            return response.json()['data']['token']

    def get_public_key(self):
        url = "https://www.fcbox.com/noshiro/getPublicKey"
        response = requests.post(url, headers=self.headers)
        return response.json()['data']

    def login(self, token, public_key, username='123123', password='123123'):
        url = "https://www.fcbox.com/passport/login"
        item = self.js.call('get_login_params', password, token, public_key)
        params = {
            "username": username,
            "password": item['password'],
            "verifyCode": item['verifyCode'],
            "_": item['_']
        }
        response = requests.get(url, headers=self.login_headers, params=params)
        print(response.text)

    def main(self):
        try:
            slide_distance, clientIp, checkId, uuid4, key, pointY = self.get_captcha()
        except Exception as e:
            print('获取验证码失败...')
            return
        gj_list = self.generate_gj(target_x=int(slide_distance), fixed_y=pointY)
        token = self.check_captcha(clientIp, checkId, uuid4, gj_list, key)
        if token:
            print('验证码校验成功...')
            public_key = self.get_public_key()
            self.login(token=token, public_key=public_key)
        else:
            print('验证码校验失败...')


if __name__ == '__main__':
    fc = FcBoxLogin()
    fc.main()

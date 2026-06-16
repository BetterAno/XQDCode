import subprocess
import requests


class WMXLogin:
    def __init__(self):
        self.headers = {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            "origin": "https://www.waimaoxia.net",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "referer": "https://www.waimaoxia.net/login",
            "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
        }
        self.login_url = "https://www.waimaoxia.net/api/user/login"
        self.get_captcha_url = "https://captcha.waimaoxia.net/api/rotate/basic/captcha"

    def get_captcha(self):
        response = requests.get(self.get_captcha_url, headers=self.headers).json()
        captcha_key = response['captcha_key']
        return captcha_key

    def login(self, captcha_key):
        # 使用替换文件的方式实现更改变量值
        with open('获取sign值.js', 'r', encoding='utf-8') as f:
            js_code = f.read().replace('demo_captcha_key', captcha_key)
        # 重写写入到 webpack.js 文件并调用该文件获取sign值
        with open('test.js', 'w', encoding='utf-8') as f:
            f.write(js_code)
        result = subprocess.run(['node', 'webpack.js'], capture_output=True,
                                text=True)
        sign = result.stdout.strip()
        print('获取的sign值为:', sign)
        data = {
            "username": "123123",
            "password": "123123",
            "token": "e62d2e709b9abba18c300ac1f4db6263",
            "captcha_key": captcha_key,
            "sign": sign
        }
        response = requests.post(self.login_url, headers=self.headers, data=data)
        return response.text

    def main(self):
        captcha_key = self.get_captcha()
        print(self.login(captcha_key))


if __name__ == '__main__':
    wmx = WMXLogin()
    wmx.main()

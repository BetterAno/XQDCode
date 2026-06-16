"""
国开在线考试平台 - 登录脚本
纯 Python 实现, 使用 requests 直接请求

加密流程: HmacMD5 → AES/ECB → RSA
验证码: OpenCV + ddddocr 算术表达式识别
"""

import sys
import os
import json
import requests

# 添加项目路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from encrypt import encrypt_login_data
from captcha_solver import solve_captcha


# ========== 配置 ==========

BASE_URL = "https://student-examservice.ouc-online.com.cn"
API_PREFIX = "/exam_client_api"

CAPTCHA_URL = f"{BASE_URL}{API_PREFIX}/captchaImage"
LOGIN_URL = f"{BASE_URL}{API_PREFIX}/yt/student/api/client/login"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": "https://student-examservice.ouc-online.com.cn/",
    "Origin": "https://student-examservice.ouc-online.com.cn",
}


class OucExamLogin:
    """国开在线考试平台登录"""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(HEADERS)

    def get_captcha(self) -> dict:
        """
        获取验证码
        
        返回: {"img": "base64图片", "uuid": "验证码标识", "captchaOnOff": true/false}
        """
        resp = self.session.get(CAPTCHA_URL)
        resp.raise_for_status()
        result = resp.json()

        if result.get("code") != 200:
            raise Exception(f"获取验证码失败: {result.get('msg', '未知错误')}")

        # 若依框架: 数据在 data 字段内
        data = result.get("data", {})
        return {
            "img": data.get("img", ""),
            "uuid": data.get("uuid", ""),
            "captchaOnOff": data.get("captchaOnOff", True)
        }

    def solve_captcha(self, captcha_info: dict) -> str:
        """识别验证码"""
        if not captcha_info.get("captchaOnOff", True):
            return ""

        b64_img = captcha_info.get("img", "")
        if not b64_img:
            raise Exception("验证码图片为空")

        # 补全 base64 前缀
        if not b64_img.startswith("data:"):
            b64_img = f"data:image/png;base64,{b64_img}"

        answer = solve_captcha(b64_img)
        if not answer:
            raise Exception("验证码识别失败")

        return answer

    def login(self, username: str, password: str, max_retries: int = 5) -> dict:
        """
        登录
        
        Args:
            username: 准考证号
            password: 密码
            max_retries: 验证码识别失败或验证码错误时的最大重试次数
            
        Returns:
            登录响应数据
        """
        for attempt in range(1, max_retries + 1):
            if attempt > 1:
                print(f"\n[重试 {attempt}/{max_retries}]...")

            # 1. 获取验证码
            print("[1/3] 获取验证码...")
            captcha_info = self.get_captcha()
            print(f"  uuid: {captcha_info['uuid']}")

            # 2. 识别验证码
            print("[2/3] 识别验证码...")
            try:
                captcha_code = self.solve_captcha(captcha_info)
            except Exception as e:
                print(f"  验证码识别失败: {e}")
                if attempt < max_retries:
                    continue
                raise

            if not captcha_code:
                print("  验证码识别结果为空, 跳过本次")
                if attempt < max_retries:
                    continue
                raise Exception("验证码识别失败, 已达最大重试次数")

            print(f"  验证码答案: {captcha_code}")

            # 3. 加密并登录
            print("[3/3] 加密并登录...")
            
            # 构造登录数据(和前端loginForm一致)
            login_data = {
                "username": username,
                "password": password,
                "code": captcha_code,
                "uuid": captcha_info["uuid"],
                "appType": "0",
                "versionNo": "",
                "macAddress": "",
                "smsCode": "",
                "platformInfo": ""
            }
            
            # 加密: JSON.stringify → AES/CBC/ZeroPadding + RSA
            encrypted = encrypt_login_data(json.dumps(login_data, separators=(',', ':')))

            # 构造表单数据 (JSON格式)
            payload = {
                "secretKey": encrypted["secretKey"],
                "data": encrypted["data"],
                "code": captcha_code,
                "uuid": captcha_info["uuid"],
            }

            resp = self.session.post(
                LOGIN_URL,
                json=payload
            )
            resp.raise_for_status()
            result = resp.json()

            # 验证码错误时自动重试
            if result.get("code") == 500 and "验证码" in result.get("msg", ""):
                print(f"  服务端返回: {result.get('msg')}")
                if attempt < max_retries:
                    continue
            
            return result

        return result


def main():
    """主入口"""
    import argparse
    parser = argparse.ArgumentParser(description="国开在线考试平台登录")
    parser.add_argument("-u", "--username", required=True, help="准考证号")
    parser.add_argument("-p", "--password", required=True, help="密码")
    args = parser.parse_args()

    client = OucExamLogin()
    try:
        result = client.login(args.username, args.password)
        print(f"\n登录结果: code={result.get('code')}, msg={result.get('msg', '')}")
        if result.get("code") == 200:
            token = result.get("token", "")
            print(f"token: {token[:30]}..." if token else "无token")
        else:
            print(f"完整响应: {json.dumps(result, ensure_ascii=False, indent=2)}")
    except Exception as e:
        print(f"\n登录失败: {e}")
        raise


if __name__ == "__main__":
    main()

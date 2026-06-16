"""
欧创源酒店网站滑块验证码登录器
纯 Python 协议实现，无需浏览器自动化工具
"""

import requests
import json
import time
import uuid
import base64
import hashlib
from urllib.parse import urljoin


class OcyuanCaptchaSolver:
    """欧创源滑块验证码解决器"""
    
    def __init__(self, cloud_token: str):
        self.session = requests.Session()
        self.cloud_token = cloud_token
        self.base_url = "https://hotel.ocyuan.com"
        self.captcha_base = "https://captcha.tuyacn.com"
        self.verify_id = None
        self.challenge = None
        self.api_server = None
        
    def get_csrf_token(self) -> bool:
        """获取 CSRF Token"""
        resp = self.session.get(f"{self.base_url}/login")
        if resp.status_code == 200:
            csrf_token = self.session.cookies.get("csrf-token")
            csrf_sig = self.session.cookies.get("csrf-token.sig")
            print(f"[+] CSRF Token: {csrf_token}")
            return True
        return False
    
    def init_verify(self) -> dict:
        """初始化验证码，获取 challenge 和 verifyId"""
        url = f"{self.base_url}/api/v2/geeVerify"
        payload = {
            "clientType": "web_view",
            "lang": "zh",
            "user_id": str(uuid.uuid4())
        }
        csrf_token = self.session.cookies.get("csrf-token")
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "X-Requested-With": "XMLHttpRequest",
            "X-Ty-Referer": "/login",
            "Csrf-Token": csrf_token,
            "Origin": self.base_url,
            "Referer": f"{self.base_url}/login"
        }
        
        resp = self.session.post(url, json=payload, headers=headers)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("success"):
                result = data["result"]
                self.challenge = result["challenge"]
                self.verify_id = result["verifyId"]
                self.api_server = result["apiServer"]
                print(f"[+] Challenge: {self.challenge}")
                print(f"[+] VerifyId: {self.verify_id}")
                print(f"[+] APIServer: {self.api_server}")
                return result
        raise Exception(f"初始化验证码失败: {resp.text}")
    
    def get_question(self) -> dict:
        """获取验证码图片"""
        url = f"{self.captcha_base}/verify/v1/getQuestion"
        payload = {
            "type": 1,
            "verifyId": self.verify_id,
            "challenge": self.challenge,
            "callback": f"verify_{int(time.time() * 1000)}"
        }
        headers = {
            "Content-Type": "application/json",
            "Origin": self.base_url,
            "Referer": f"{self.base_url}/"
        }
        
        resp = self.session.post(url, json=payload, headers=headers)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("success"):
                result = data["result"]
                print(f"[+] 验证码图片获取成功")
                print(f"    背景图: {result['staticServer']}{result['bgUrl']}")
                print(f"    滑块图: {result['staticServer']}{result['sliceUrl']}")
                print(f"    XPosition(加密): {result['xposition']}")
                print(f"    YPosition: {result['yposition']}")
                return result
        raise Exception(f"获取验证码图片失败: {resp.text}")
    
    def recognize_gap_cloud(self, bg_url: str, slice_url: str) -> int:
        """使用云打码API识别缺口位置（备选：OpenCV本地识别）"""
        try:
            # 下载图片并转为 base64
            bg_resp = self.session.get(bg_url)
            slice_resp = self.session.get(slice_url)
            
            bg_base64 = base64.b64encode(bg_resp.content).decode()
            slice_base64 = base64.b64encode(slice_resp.content).decode()
            
            # 调用云打码API
            cloud_url = "http://api.jfbym.com/api/YmServer/customApi"
            payload = {
                "token": self.cloud_token,
                "type": "3004",  # 滑块缺口识别类型
                "image": bg_base64,
                "image_small": slice_base64
            }
            
            resp = requests.post(cloud_url, json=payload, timeout=30)
            if resp.status_code == 200:
                data = resp.json()
                print(f"[+] 云打码响应: {json.dumps(data, ensure_ascii=False)}")
                if data.get("code") == 0 or data.get("code") == "0":
                    result = data.get("data", {})
                    x = (result.get("x") or 
                         result.get("point", {}).get("x") or
                         result.get("gap", {}).get("x") or
                         result[0] if isinstance(result, list) else None)
                    if x is not None:
                        print(f"[+] 云打码识别结果: x={x}")
                        return int(x)
        except Exception as e:
            print(f"[-] 云打码识别失败: {e}")
        
        # 云打码失败，使用 OpenCV 本地识别
        print("[-] 云打码失败，使用 OpenCV 本地识别...")
        from gap_detector import GapDetector
        import os
        
        # 保存图片到临时文件
        bg_path = "temp_bg.webp"
        slice_path = "temp_slice.png"
        
        bg_resp = self.session.get(bg_url)
        with open(bg_path, 'wb') as f:
            f.write(bg_resp.content)
        
        slice_resp = self.session.get(slice_url)
        with open(slice_path, 'wb') as f:
            f.write(slice_resp.content)
        
        try:
            gap_x = GapDetector.detect_with_opencv(bg_path, slice_path)
            print(f"[+] OpenCV 识别结果: x={gap_x}")
            return gap_x
        except Exception as e:
            print(f"[-] OpenCV 识别也失败: {e}")
            raise Exception("无法识别缺口位置")
        finally:
            # 清理临时文件
            if os.path.exists(bg_path):
                os.remove(bg_path)
            if os.path.exists(slice_path):
                os.remove(slice_path)
    
    def solve_captcha(self) -> dict:
        """完整的验证码解决流程"""
        # 1. 初始化验证码
        self.init_verify()
        
        # 2. 获取验证码图片
        question = self.get_question()
        
        # 3. 构造完整图片URL
        static_server = question["staticServer"]
        bg_url = f"{static_server}{question['bgUrl']}"
        slice_url = f"{static_server}{question['sliceUrl']}"
        
        # 4. 识别缺口
        gap_x = self.recognize_gap_cloud(bg_url, slice_url)
        
        return {
            "gap_x": gap_x,
            "challenge": self.challenge,
            "verify_id": self.verify_id,
            "question": question
        }


class OcyuanLogin:
    """欧创源酒店登录器"""
    
    def __init__(self, cloud_token: str):
        self.solver = OcyuanCaptchaSolver(cloud_token)
        self.session = self.solver.session
        
    def login(self, account: str, password: str) -> dict:
        """执行登录流程"""
        print("=" * 60)
        print("欧创源酒店自动化登录")
        print("=" * 60)
        
        # 1. 获取 CSRF Token
        print("\n[1] 获取 CSRF Token...")
        self.solver.get_csrf_token()
        
        # 2. 解决验证码
        print("\n[2] 解决验证码...")
        captcha_result = self.solver.solve_captcha()
        
    def submit_verification(self, captcha_result: dict) -> str:
        """提交验证码并获取 token"""
        from captcha_solver import TuyaCaptchaSolver
        
        question = captcha_result["question"]
        gap_x = captcha_result["gap_x"]
        
        # 使用验证码解决器
        solver = TuyaCaptchaSolver()
        payload = solver.solve(
            challenge=self.solver.challenge,
            verify_id=self.solver.verify_id,
            xposition=question["xposition"],
            yposition=question["yposition"],
            public_key=question["publicKey"],
            shuffle=question["shuffle"],
            gap_x=gap_x
        )
        
        # 提交验证
        url = f"{self.solver.captcha_base}/verify/v1/checkAnswer"
        headers = {
            "Content-Type": "application/json",
            "Origin": self.solver.base_url,
            "Referer": f"{self.solver.base_url}/"
        }
        
        print(f"\n[+] 提交验证到: {url}")
        resp = self.session.post(url, json=payload, headers=headers)
        
        if resp.status_code == 200:
            data = resp.json()
            print(f"[+] 验证响应: {json.dumps(data, indent=2, ensure_ascii=False)}")
            
            if data.get("success"):
                # 返回验证 token
                token = data.get("result", {}).get("token") or data.get("result", {}).get("validate")
                if token:
                    print(f"[+] 验证成功! Token: {token[:50]}...")
                    return token
                else:
                    print(f"[-] 响应中没有找到 token")
                    return None
            else:
                print(f"[-] 验证失败: {data.get('errorMsg', 'Unknown')}")
                return None
        else:
            print(f"[-] 请求失败: {resp.status_code}")
            return None
    
    def do_login(self, account: str, password: str, verify_token: str) -> dict:
        """使用验证 token 完成登录"""
        url = f"{self.solver.base_url}/api/v1.0/hotel/auth/login"
        payload = {
            "account": account,
            "password": password,
            "verifyToken": verify_token
        }
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "X-Requested-With": "XMLHttpRequest",
            "Csrf-Token": self.session.cookies.get("csrf-token"),
            "Origin": self.solver.base_url,
            "Referer": f"{self.solver.base_url}/login"
        }
        
        print(f"\n[+] 提交登录请求...")
        resp = self.session.post(url, json=payload, headers=headers)
        
        if resp.status_code == 200:
            data = resp.json()
            print(f"[+] 登录响应: {json.dumps(data, indent=2, ensure_ascii=False)}")
            return data
        else:
            print(f"[-] 登录请求失败: {resp.status_code}")
            return {"error": "Request failed", "status": resp.status_code}
        
        # 3. 提交验证
        print("\n[3] 提交验证...")
        verify_token = self.submit_verification(captcha_result)
        
        if not verify_token:
            print("\n[-] 验证失败，无法登录")
            return captcha_result
        
        # 4. 使用验证 token 完成登录
        print("\n[4] 完成登录...")
        login_result = self.do_login(account, password, verify_token)
        
        print("\n" + "=" * 60)
        print("完整流程完成")
        print("=" * 60)
        
        return {
            "captcha": captcha_result,
            "verify_token": verify_token,
            "login_result": login_result
        }


if __name__ == "__main__":
    CLOUD_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"
    ACCOUNT = "test123456"
    PASSWORD = "Test@123456"
    
    login = OcyuanLogin(CLOUD_TOKEN)
    result = login.login(ACCOUNT, PASSWORD)
    print("\n结果:", json.dumps(result, indent=2, ensure_ascii=False))

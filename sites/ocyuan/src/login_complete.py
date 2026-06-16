"""
欧创源酒店完整登录实现
包含三个关键接口的完整流程
"""

import json
import time
import uuid
import base64
import hashlib
import requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

# 导入加密函数（或者直接使用下面的内联实现）
# from aes_encryptor import encrypt_username, encrypt_password


class OcyuanHotelLogin:
    """欧创源酒店登录器"""
    
    def __init__(self):
        self.base_url = "https://hotel.ocyuan.com"
        self.captcha_base = "https://captcha.tuyacn.com"
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9"
        })
        
        # 验证码相关
        self.challenge = None
        self.verify_id = None
        self.validate = None
        
        # 密钥相关
        self.secret_key = None
        self.iv = None
        self.secret_key_id = None
    
    def init_captcha(self):
        """步骤1: 初始化验证码"""
        print("\n[1] 初始化验证码...")
        url = f"{self.base_url}/api/v2/geeVerify"
        payload = {
            "clientType": "web_view",
            "lang": "zh",
            "user_id": str(uuid.uuid4())
        }
        headers = {
            "Csrf-Token": self.session.cookies.get("csrf-token"),
            "X-Requested-With": "XMLHttpRequest",
            "X-Ty-Referer": "/login",
            "Content-Type": "application/json; charset=utf-8"
        }
        
        resp = self.session.post(url, json=payload, headers=headers)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("success"):
                self.challenge = data.get("challenge")
                self.verify_id = data.get("verifyId")
                print(f"    ✓ challenge: {self.challenge[:30]}...")
                print(f"    ✓ verifyId: {self.verify_id[:30]}...")
                return True
        return False
    
    def get_captcha_question(self):
        """步骤2: 获取验证码图片"""
        print("\n[2] 获取验证码图片...")
        url = f"{self.captcha_base}/verify/v1/getQuestion"
        payload = {
            "type": 1,
            "verifyId": self.verify_id,
            "challenge": self.challenge,
            "callback": f"verify_{int(time.time() * 1000)}"
        }
        
        resp = self.session.post(url, json=payload)
        if resp.status_code == 200:
            data = resp.json()
            print(f"    ✓ 背景图: {data.get('bgUrl', '')[:50]}...")
            print(f"    ✓ xposition: {data.get('xposition')}")
            return data
        return None
    
    def submit_captcha_collect(self, track_data=None):
        """
        步骤3: 提交验证码验证 (collectData)
        
        注意: 这个接口的具体请求格式需要抓包确认
        验证成功后会生成 validate token
        """
        print("\n[3] 提交验证码验证...")
        print("    ⚠️  需要浏览器手动完成验证")
        print("    ⚠️  请提供 validate token")
        
        # TODO: 实现 collectData 接口调用
        # 需要抓包确认请求格式
        
        return False
    
    def get_secret_key(self):
        """步骤4: 获取加密密钥"""
        print("\n[4] 获取加密密钥...")
        url = f"{self.base_url}/v2/api/hotel/secret-key"
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Csrf-Token": self.session.cookies.get("csrf-token"),
            "X-Requested-With": "XMLHttpRequest",
            "X-Ty-Referer": "/login"
        }
        
        resp = self.session.post(url, headers=headers, json={})
        if resp.status_code == 200:
            data = resp.json()
            if data.get("success"):
                result = data["result"]
                self.secret_key_id = result["secret_key_id"]
                # 保存原始的 hex 字符串（不要转换为 bytes）
                self.secret_key_hex = result["secret_key"]
                self.iv_hex = result["iv"]
                
                print(f"    ✓ secret_key_id: {self.secret_key_id}")
                print(f"    ✓ secret_key: {self.secret_key_hex}")
                print(f"    ✓ iv: {self.iv_hex}")
                print(f"    ✓ expires_in: {result['expires_in']}分钟")
                return True
        return False
    
    def encrypt_field(self, plaintext: str, is_password: bool = False) -> str:
        """
        加密字段（AES-CBC）
        
        根据前端代码逆向分析：
        - username: 直接 AES 加密
        - password: 先 MD5，再 AES 加密
        - key 和 iv: 作为 UTF-8 字符串使用（不是 hex 字节）
        """
        if is_password:
            # password 先 MD5
            plaintext = hashlib.md5(plaintext.encode('utf-8')).hexdigest()
        
        # AES-CBC 加密
        # 关键：key 和 iv 作为 UTF-8 字符串编码
        key_bytes = self.secret_key_hex.encode('utf-8')
        iv_bytes = self.iv_hex.encode('utf-8')
        
        cipher = AES.new(key_bytes, AES.MODE_CBC, iv_bytes)
        ciphertext = cipher.encrypt(pad(plaintext.encode('utf-8'), AES.block_size))
        
        # 返回 Base64 编码
        return base64.b64encode(ciphertext).decode('utf-8')
    
    def login(self, username: str, password: str, validate_token: str = None):
        """
        步骤5: 登录
        
        Args:
            username: 用户名
            password: 密码
            validate_token: 验证码 validate token (captcha_xxx)
        """
        print("\n[5] 执行登录...")
        
        # 加密用户名和密码
        print("    加密登录数据...")
        encrypted_username = self.encrypt_field(username, is_password=False)
        encrypted_password = self.encrypt_field(password, is_password=True)
        
        # 构建 secure_key
        secure_key = {
            "verifyId": self.verify_id,
            "challenge": self.challenge,
            "validate": validate_token or self.validate or "captcha_placeholder"
        }
        
        # 构建登录请求
        payload = {
            "country_code": "86",
            "username": encrypted_username,
            "password": encrypted_password,
            "secret_key_id": self.secret_key_id,
            "secure_key": json.dumps(secure_key),
            "current_domain": "hotel.ocyuan.com"
        }
        
        url = f"{self.base_url}/v3/api/hotel/login"
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Csrf-Token": self.session.cookies.get("csrf-token"),
            "X-Requested-With": "XMLHttpRequest",
            "X-Ty-Referer": "/login",
            "Origin": self.base_url,
            "Referer": f"{self.base_url}/login"
        }
        
        print(f"    提交登录请求到: {url}")
        resp = self.session.post(url, json=payload, headers=headers)
        
        if resp.status_code == 200:
            data = resp.json()
            if data.get("success"):
                print(f"    ✓ 登录成功!")
                print(f"    响应: {json.dumps(data, indent=2, ensure_ascii=False)}")
                return data
            else:
                print(f"    ✗ 登录失败: {data.get('msg', 'Unknown')}")
                print(f"    响应: {json.dumps(data, indent=2, ensure_ascii=False)}")
                return data
        else:
            print(f"    ✗ 请求失败: {resp.status_code}")
            return {"error": "Request failed", "status": resp.status_code}
    
    def full_login_flow(self, username: str, password: str, validate_token: str):
        """完整的登录流程"""
        print("="*60)
        print("欧创源酒店完整登录流程")
        print("="*60)
        
        # 0. 获取 CSRF Token
        print("\n[0] 获取 CSRF Token...")
        resp = self.session.get(f"{self.base_url}/login")
        csrf = self.session.cookies.get("csrf-token")
        print(f"    ✓ csrf-token: {csrf[:30]}...")
        
        # 1-2. 验证码初始化
        if not self.init_captcha():
            return {"error": "验证码初始化失败"}
        
        question = self.get_captcha_question()
        if not question:
            return {"error": "获取验证码图片失败"}
        
        # 3. 验证码验证（需要浏览器完成）
        if not validate_token:
            print("\n⚠️  需要 validate token")
            print("    请在浏览器中完成验证码验证")
            return {"error": "需要 validate token"}
        
        self.validate = validate_token
        
        # 4. 获取密钥
        if not self.get_secret_key():
            return {"error": "获取密钥失败"}
        
        # 5. 登录
        result = self.login(username, password, validate_token)
        
        print("\n" + "="*60)
        print("流程完成")
        print("="*60)
        
        return result


if __name__ == "__main__":
    # 使用示例
    login = OcyuanHotelLogin()
    
    # 从浏览器捕获的 validate token
    VALIDATE_TOKEN = "captcha_1PKmBKLDbifkYmBSFWIEhct0VR8gbFwA"
    
    result = login.full_login_flow(
        username="test123456",
        password="Test@123456",
        validate_token=VALIDATE_TOKEN
    )
    
    print("\n最终结果:")
    print(json.dumps(result, indent=2, ensure_ascii=False))

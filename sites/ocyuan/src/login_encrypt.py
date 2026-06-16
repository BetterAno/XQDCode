"""
欧创源酒店登录加密分析

根据抓包分析：
1. username 和 password 被加密
2. 使用 secret_key_id 标识密钥
3. secure_key 包含验证码信息
4. 可能是 AES 加密

加密数据特征：
- username: l8OqveUYLAOglbnd9XEdCA== (Base64, 24字符 -> 16字节原始数据)
- password: peQaZZPh4VH55XT3BD3yKmBe3dJdD8MSIy/NGovT4VilymNrVllsd4iB1gK8uYYb (Base64, 88字符 -> 64字节原始数据)
- secret_key_id: 9c76042c-6e67-482d-95b4-da508087336a (UUID格式)
"""

import base64
import json
import time
import uuid
import requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad


class LoginEncryptor:
    """登录加密器"""
    
    def __init__(self):
        self.secret_key_id = None
        self.aes_key = None
        self.aes_iv = None
    
    def get_secret_key(self, session: requests.Session, base_url: str) -> dict:
        """
        获取加密密钥
        
        POST /v2/api/hotel/secret-key
        返回: secret_key_id, secret_key (AES密钥), iv, expires_in
        """
        url = f"{base_url}/v2/api/hotel/secret-key"
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Csrf-Token": session.cookies.get("csrf-token"),
            "X-Requested-With": "XMLHttpRequest",
            "X-Ty-Referer": "/login",
            "Origin": base_url,
            "Referer": f"{base_url}/login"
        }
        
        print("    请求密钥...")
        resp = session.post(url, headers=headers, json={})
        
        if resp.status_code == 200:
            data = resp.json()
            if data.get("success"):
                result = data["result"]
                print(f"    secret_key_id: {result['secret_key_id']}")
                print(f"    expires_in: {result['expires_in']}分钟")
                
                # AES 密钥和 IV 处理
                aes_key = bytes.fromhex(result["secret_key"])
                aes_iv_hex = result["iv"]
                
                # IV 可能只有8字节，需要填充到16字节
                aes_iv = bytes.fromhex(aes_iv_hex)
                if len(aes_iv) < 16:
                    # 填充到16字节
                    aes_iv = aes_iv + b'\x00' * (16 - len(aes_iv))
                
                return {
                    "secret_key_id": result["secret_key_id"],
                    "aes_key": aes_key,
                    "aes_iv": aes_iv
                }
            else:
                print(f"[-] 获取密钥失败: {data.get('errorMsg')}")
                return None
        else:
            print(f"[-] 请求失败: {resp.status_code}")
            return None
    
    def encrypt_field(self, plaintext: str, key: bytes, iv: bytes) -> str:
        """
        使用 AES-CBC 加密字段
        
        Args:
            plaintext: 原始文本
            key: AES 密钥
            iv: 初始化向量
        
        Returns:
            Base64 编码的密文
        """
        try:
            cipher = AES.new(key, AES.MODE_CBC, iv)
            padded = pad(plaintext.encode('utf-8'), AES.block_size)
            encrypted = cipher.encrypt(padded)
            return base64.b64encode(encrypted).decode('utf-8')
        except Exception as e:
            print(f"[-] AES 加密失败: {e}")
            return plaintext
    
    def encrypt_login_data(self, username: str, password: str, 
                          secret_key_info: dict) -> dict:
        """
        加密登录数据
        
        Args:
            username: 用户名
            password: 密码
            secret_key_info: 密钥信息
        
        Returns:
            加密后的登录数据
        """
        # 从密钥信息中提取 AES key 和 IV
        aes_key = secret_key_info.get('aes_key')
        aes_iv = secret_key_info.get('aes_iv')
        
        if not aes_key or not aes_iv:
            print("[-] 未找到 AES 密钥和 IV")
            print("[!] 需要分析前端代码获取密钥生成逻辑")
            return {
                "username": username,
                "password": password
            }
        
        # 加密 username 和 password
        encrypted_username = self.encrypt_field(username, aes_key, aes_iv)
        encrypted_password = self.encrypt_field(password, aes_key, aes_iv)
        
        return {
            "username": encrypted_username,
            "password": encrypted_password
        }


class OcyuanLoginV3:
    """欧创源登录 V3 版本"""
    
    def __init__(self, cloud_token: str = None):
        self.base_url = "https://hotel.ocyuan.com"
        self.captcha_base = "https://captcha.tuyacn.com"
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9"
        })
        self.cloud_token = cloud_token
        self.encryptor = LoginEncryptor()
        
        # 验证码相关
        self.challenge = None
        self.verify_id = None
        self.validate = None
    
    def init_captcha(self) -> dict:
        """初始化验证码"""
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
        
        print("[1] 初始化验证码...")
        resp = self.session.post(url, json=payload, headers=headers)
        
        if resp.status_code == 200:
            data = resp.json()
            if data.get("success"):
                self.challenge = data.get("challenge")
                self.verify_id = data.get("verifyId")
                self.captcha_base = data.get("apiServer", self.captcha_base)
                print(f"    challenge: {self.challenge}")
                print(f"    verifyId: {self.verify_id}")
                return data
            else:
                print(f"[-] 初始化失败: {data.get('errorMsg')}")
                return data
        else:
            print(f"[-] 请求失败: {resp.status_code}")
            return {"error": "Request failed"}
    
    def get_captcha_question(self) -> dict:
        """获取验证码图片"""
        url = f"{self.captcha_base}/verify/v1/getQuestion"
        payload = {
            "type": 1,
            "verifyId": self.verify_id,
            "challenge": self.challenge,
            "callback": f"verify_{int(time.time() * 1000)}"
        }
        
        print("[2] 获取验证码图片...")
        resp = self.session.post(url, json=payload)
        
        if resp.status_code == 200:
            data = resp.json()
            print(f"    bgUrl: {data.get('bgUrl')}")
            print(f"    xposition: {data.get('xposition')}")
            return data
        else:
            print(f"[-] 请求失败: {resp.status_code}")
            return {"error": "Request failed"}
    
    def solve_captcha(self) -> str:
        """
        解决验证码
        
        注意：这里需要：
        1. 下载图片
        2. 识别缺口位置
        3. 生成轨迹
        4. 提交验证获取 validate
        
        但由于验证是在浏览器端完成的，validate 已经包含在 secure_key 中
        所以这里暂时跳过，直接使用浏览器获取的 validate
        """
        print("[3] 验证码解决（需要浏览器手动完成）")
        print("[!] validate token 需要从浏览器的登录请求中获取")
        return self.validate or "captcha_placeholder"
    
    def get_secret_key_info(self) -> dict:
        """获取加密密钥信息"""
        print("[4] 获取加密密钥...")
        return self.encryptor.get_secret_key(self.session, self.base_url)
    
    def login(self, username: str, password: str, validate: str = None) -> dict:
        """
        完整登录流程
        
        Args:
            username: 用户名
            password: 密码
            validate: 验证码 validate token（从浏览器获取）
        """
        print("\n" + "="*60)
        print("欧创源酒店登录 V3")
        print("="*60)
        
        # 1. 获取 CSRF Token
        print("\n[0] 获取 CSRF Token...")
        resp = self.session.get(f"{self.base_url}/login")
        csrf_token = self.session.cookies.get("csrf-token")
        print(f"    csrf-token: {csrf_token}")
        
        # 2. 初始化验证码
        self.init_captcha()
        
        # 3. 获取验证码图片
        question = self.get_captcha_question()
        
        # 4. 验证码解决（需要浏览器完成）
        if validate:
            self.validate = validate
            print(f"    使用提供的 validate: {validate}")
        else:
            self.solve_captcha()
        
        # 5. 获取密钥信息
        secret_key_info = self.get_secret_key_info()
        
        # 6. 加密登录数据
        print("\n[5] 加密登录数据...")
        if secret_key_info and secret_key_info.get('aes_key'):
            encrypted_data = self.encryptor.encrypt_login_data(
                username, password, secret_key_info
            )
            print(f"    encrypted username: {encrypted_data['username']}")
            print(f"    encrypted password: {encrypted_data['password']}")
        else:
            print("[-] 未获取到密钥，使用明文（将会失败）")
            encrypted_data = {
                "username": username,
                "password": password
            }
        
        # 7. 构建登录请求
        print("\n[6] 提交登录请求...")
        secure_key = {
            "verifyId": self.verify_id,
            "challenge": self.challenge,
            "validate": self.validate or "captcha_placeholder"
        }
        
        login_payload = {
            "country_code": "86",
            "username": encrypted_data["username"],
            "password": encrypted_data["password"],
            "secret_key_id": secret_key_info["secret_key_id"],
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
        
        resp = self.session.post(url, json=login_payload, headers=headers)
        
        if resp.status_code == 200:
            data = resp.json()
            print(f"[+] 登录响应: {json.dumps(data, indent=2, ensure_ascii=False)}")
            return data
        else:
            print(f"[-] 登录失败: {resp.status_code}")
            print(f"    Response: {resp.text[:200]}")
            return {"error": "Login failed", "status": resp.status_code}


if __name__ == "__main__":
    # 测试
    login = OcyuanLoginV3()
    
    # 需要从浏览器获取的 validate token
    VALIDATE = "captcha_uKGGgi5mKXcyU1QIBnCrCRXgivkOp4gf"
    
    result = login.login("test123456", "Test@123456", validate=VALIDATE)
    
    print("\n最终结果:")
    print(json.dumps(result, indent=2, ensure_ascii=False))

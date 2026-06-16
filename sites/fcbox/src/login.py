"""
Fcbox Login - Pure Protocol Implementation
Complete login flow with slider captcha bypass.
"""

import base64
import requests
from typing import Optional
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding

from captcha import FcboxCaptchaSolver


class FcboxLogin:
    LOGIN_BASE = "https://www.fcbox.com"
    
    def __init__(self, username: str, password: str, 
                 yunma_token: Optional[str] = None,
                 session: Optional[requests.Session] = None):
        self.username = username
        self.password = password
        self.session = session or requests.Session()
        self.captcha_solver = FcboxCaptchaSolver(
            session=self.session,
            yunma_token=yunma_token
        )
    
    def get_public_key(self) -> Optional[str]:
        """Fetch RSA public key from server"""
        url = f"{self.LOGIN_BASE}/noshiro/getPublicKey"
        resp = self.session.post(url, timeout=15)
        if resp.status_code != 200:
            return None
        data = resp.json()
        if data.get('code') == 0:
            return data.get('data')
        return None
    
    def rsa_encrypt(self, plaintext: str, public_key_b64: str) -> Optional[str]:
        """Encrypt password with RSA public key (PKCS1v15)"""
        try:
            pub_key_der = base64.b64decode(public_key_b64)
            pub_key = serialization.load_der_public_key(pub_key_der)
            encrypted = pub_key.encrypt(plaintext.encode('utf-8'), padding.PKCS1v15())
            return base64.b64encode(encrypted).decode('utf-8')
        except Exception as e:
            print(f"[Login] RSA encryption failed: {e}")
            return None
    
    def login(self, path: Optional[str] = None) -> dict:
        """
        Full login flow.
        Returns server response dict.
        """
        print("[Login] Starting login flow...")
        
        # Step 1: Solve captcha
        token = self.captcha_solver.solve()
        if not token:
            return {"success": False, "error": "Captcha solving failed"}
        
        # Step 2: Get RSA public key
        print("[Login] Fetching public key...")
        pub_key = self.get_public_key()
        if not pub_key:
            return {"success": False, "error": "Failed to get public key"}
        
        # Step 3: Encrypt password
        encrypted_pwd = self.rsa_encrypt(self.password, pub_key)
        if not encrypted_pwd:
            return {"success": False, "error": "Password encryption failed"}
        
        # Step 4: Login request
        params = {
            "username": self.username,
            "password": encrypted_pwd,
            "verifyCode": token
        }
        
        url = f"{self.LOGIN_BASE}/passport/login"
        print(f"[Login] Sending login request...")
        resp = self.session.get(url, params=params, timeout=15)
        
        if resp.status_code != 200:
            return {"success": False, "error": f"HTTP {resp.status_code}"}
        
        try:
            result = resp.json()
        except Exception:
            result = {"raw": resp.text}
        
        if result.get('code') == 0 or result.get('code') == 113:
            print("[Login] Login successful!")
            return {"success": True, "data": result}
        else:
            print(f"[Login] Login failed: {result.get('chnDesc', result)}")
            return {"success": False, "data": result}


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python fcbox_login.py <username> <password> [yunma_token]")
        sys.exit(1)
    
    username = sys.argv[1]
    password = sys.argv[2]
    yunma_token = sys.argv[3] if len(sys.argv) > 3 else None
    
    client = FcboxLogin(username, password, yunma_token=yunma_token)
    result = client.login()
    print(f"Result: {result}")

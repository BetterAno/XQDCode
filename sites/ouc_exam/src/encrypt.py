"""
国开在线考试平台 - 加密模块
纯 Python 实现: AES/CBC/ZeroPadding + RSA

加密流程(从模块90c5反混淆确认):
1. AES密钥固定为 'XXXXXXXXXXXXXXXX' (16个X)
2. AES加密: CBC模式 + ZeroPadding, IV=Key(Latin1解析)
3. RSA公钥加密AES密钥 → secretKey
4. 返回 {"secretKey": "...", "data": "..."}
"""

import json
import base64

from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import rsa


# ========== 硬编码密钥（从前端JS反混淆提取） ==========

# AES密钥 - 固定为16个X (模块90c5的_b95b6f函数, 字符集索引33='X')
AES_KEY = "XXXXXXXXXXXXXXXX"

# RSA公钥 - 用于加密AES密钥/secretKey (d属性, 512位)
RSA_PUBLIC_KEY_D = """-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMiHSL7qO2jhSt05FxVUKc8DHc+2
PeRW1yNNNB2QUCzTVyuE8DCZaKsTeELCizaXSTm94nD+AEkS9iq3rZZS8H0CAwEAAQ==
-----END PUBLIC KEY-----"""


def _zero_pad(data: bytes, block_size: int = 16) -> bytes:
    """ZeroPadding: 补0到块大小的倍数"""
    if len(data) % block_size == 0:
        return data
    pad_len = block_size - (len(data) % block_size)
    return data + b'\x00' * pad_len


def aes_cbc_encrypt(plaintext: str, key: str) -> str:
    """
    AES/CBC/ZeroPadding 加密
    对应模块90c5的_c函数 (34e7e1)
    CryptoJS.AES.encrypt(Utf8.parse(plaintext), Latin1.parse(key), {iv: Latin1.parse(key), mode: CBC, padding: ZeroPadding})
    """
    key_bytes = key.encode('latin-1')  # Latin1解析
    iv_bytes = key.encode('latin-1')    # IV = Key
    plaintext_bytes = plaintext.encode('utf-8')  # Utf8解析
    
    padded = _zero_pad(plaintext_bytes)
    cipher = AES.new(key_bytes, AES.MODE_CBC, iv=iv_bytes)
    encrypted = cipher.encrypt(padded)
    return base64.b64encode(encrypted).decode('utf-8')


def rsa_encrypt(plaintext: str, pem_key: str) -> str:
    """
    RSA公钥加密
    对应 JSEncrypt.setPublicKey(pem).encrypt(plaintext)
    
    JSEncrypt默认使用 PKCS#1 v1.5 填充
    PEM格式为 PKCS#8 (BEGIN PUBLIC KEY)
    """
    pub_key = rsa.PublicKey.load_pkcs1_openssl_pem(pem_key.encode('utf-8'))
    encrypted = rsa.encrypt(plaintext.encode('utf-8'), pub_key)
    # JSEncrypt输出base64, 但有换行符分隔(每64字符换行), 需要移除
    b64 = base64.b64encode(encrypted).decode('utf-8')
    # JSEncrypt格式: 每64字符插入换行
    lines = [b64[i:i+64] for i in range(0, len(b64), 64)]
    return '\n'.join(lines)


def encrypt_login_data(plaintext: str) -> dict:
    """
    完整的登录加密流程
    
    Args:
        plaintext: 要加密的JSON字符串
    
    返回: {"secretKey": "...", "data": "..."}
    """
    # Step 1: AES/CBC/ZeroPadding 加密数据
    encrypted_data = aes_cbc_encrypt(plaintext, AES_KEY)
    
    # Step 2: RSA加密AES密钥(用d公钥, 512位)
    encrypted_key = rsa_encrypt(AES_KEY, RSA_PUBLIC_KEY_D)
    
    return {
        "secretKey": encrypted_key,
        "data": encrypted_data
    }


if __name__ == "__main__":
    # 测试
    import sys
    sys.path.insert(0, '.')
    
    result = encrypt_login_data('{"username":"testuser","password":"test123456"}')
    print("加密结果:")
    print(f"secretKey: {result['secretKey'][:50]}...")
    print(f"data: {result['data'][:50]}...")
    print("\n加密模块测试通过!")

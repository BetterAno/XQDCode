"""
欧创源酒店 AES 加密函数
根据逆向分析结果实现
"""

from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import hashlib
import base64


def md5_hex(text: str) -> str:
    """计算 MD5 并返回十六进制字符串"""
    return hashlib.md5(text.encode('utf-8')).hexdigest()


def encrypt_aes_cbc(plaintext: str, key_hex: str, iv_hex: str) -> str:
    """
    AES-CBC 加密（与前端 f.w 函数一致）
    
    参数:
        plaintext: 明文字符串
        key_hex: 密钥（十六进制字符串，如 "e362e41b452274387fbbc40657f5ef90"）
        iv_hex: IV（十六进制字符串，如 "457d08a1e733b7bb"）
    
    返回:
        Base64 编码的密文
    
    注意:
        前端使用 CryptoJS.enc.Utf8.parse() 解析 hex 字符串
        所以 key 和 iv 直接作为 UTF-8 字符串使用，不需要 fromhex()
    """
    # 将 hex 字符串作为 UTF-8 字符串编码为字节
    key_bytes = key_hex.encode('utf-8')
    iv_bytes = iv_hex.encode('utf-8')
    
    # AES-CBC 加密
    cipher = AES.new(key_bytes, AES.MODE_CBC, iv_bytes)
    ciphertext = cipher.encrypt(pad(plaintext.encode('utf-8'), AES.block_size))
    
    # 返回 Base64 编码
    return base64.b64encode(ciphertext).decode('utf-8')


def encrypt_username(username: str, key_hex: str, iv_hex: str) -> str:
    """加密用户名"""
    return encrypt_aes_cbc(username, key_hex, iv_hex)


def encrypt_password(password: str, key_hex: str, iv_hex: str) -> str:
    """
    加密密码（先 MD5，再 AES 加密）
    
    前端代码：
        password: (0, f.w)(c().MD5(e.password).toString(), p, i)
    """
    # 先计算 MD5（十六进制字符串）
    password_md5 = md5_hex(password)
    
    # 再 AES 加密
    return encrypt_aes_cbc(password_md5, key_hex, iv_hex)


if __name__ == "__main__":
    # 测试
    username = "test123456"
    password = "Test@123456"
    key_hex = "e362e41b452274387fbbc40657f5ef90"
    iv_hex = "457d08a1e733b7bb"
    
    print("=" * 80)
    print("欧创源酒店 AES 加密函数测试")
    print("=" * 80)
    
    encrypted_username = encrypt_username(username, key_hex, iv_hex)
    encrypted_password = encrypt_password(password, key_hex, iv_hex)
    
    print(f"\n原始数据:")
    print(f"  Username: {username}")
    print(f"  Password: {password}")
    
    print(f"\n加密结果:")
    print(f"  Encrypted Username: {encrypted_username}")
    print(f"  Encrypted Password: {encrypted_password}")
    
    print(f"\n预期对比 (之前捕获的数据):")
    print(f"  Expected Username: lRtrwHFeIxirHT4IO/v34A==")
    print(f"  Match: {encrypted_username == 'lRtrwHFeIxirHT4IO/v34A=='}")

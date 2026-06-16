"""
AES/ECB/PKCS7 加密模块（点选验证码坐标加密）
密钥: "abcdefgabcdefg12" (16 字节默认密钥)
"""

from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import base64


DEFAULT_KEY = "abcdefgabcdefg12"


def aes_ecb_encrypt(plaintext: str, key: str = DEFAULT_KEY) -> str:
    """
    AES/ECB/PKCS7 加密 → Base64
    对应 JS: CryptoJS.AES.encrypt(enc.Utf8.parse(plain), enc.Utf8.parse(key), {mode: ECB, padding: Pkcs7})
    """
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    padded = pad(plaintext.encode('utf-8'), AES.block_size)
    encrypted = cipher.encrypt(padded)
    return base64.b64encode(encrypted).decode('utf-8')


if __name__ == "__main__":
    # 验证: 加密 "[{\"x\":100,\"y\":50}]" 应得到 Base64 输出
    test = '[{"x":100,"y":50}]'
    result = aes_ecb_encrypt(test)
    print(f"加密 '{test}' -> {result}")

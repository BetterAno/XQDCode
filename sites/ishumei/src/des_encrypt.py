"""
数美滑块验证码 DES 加密模块

加密方式: DES-ECB, 零填充, 输出 Base64
每个参数使用独立的 8 字节 ASCII 密钥
"""

import json
import base64
from Crypto.Cipher import DES


def zero_pad(data: bytes, block_size: int = 8) -> bytes:
    pad_len = block_size - (len(data) % block_size)
    if pad_len == block_size:
        pad_len = 0
    return data + b'\x00' * pad_len


def des_encrypt(key_str: str, plaintext: str) -> bytes:
    key = key_str.encode('ascii')
    cipher = DES.new(key, DES.MODE_ECB)
    padded = zero_pad(plaintext.encode('utf-8'))
    return cipher.encrypt(padded)


def encrypt_param(data, des_key: str) -> str:
    """加密参数 (与 SDK getEncryptContent 对应)"""
    if isinstance(data, str):
        plaintext = data
    else:
        plaintext = json.dumps(data, separators=(',', ':'))
    encrypted = des_encrypt(des_key, plaintext)
    return base64.b64encode(encrypted).decode()


# 每个参数的固定 DES 密钥
KEYS = {
    'wi': '363f9192',   # 滑块X偏移比例 (mouseEndX / trueWidth)
    'gq': 'ffd9ef14',   # 鼠标轨迹数据 [[x,y,t],...]
    'vs': '80fefdd1',   # 拖动耗时(ms)
    'lx': '61ad6eff',   # CSS宽度 (300)
    'es': '620302a1',   # CSS高度 (150)
    'jq': '118c4021',   # 控制台检测 (0=关闭, 1=打开)
    'zm': 'da718702',   # 机器人检测 (0=正常)
    'tx': '786ef59e',   # 固定值 -1
    'ww': '36937571',   # appId ("default")
    'bb': 'bd7d3fb7',   # channel ("default")
    'vj': 'b7cdc6b2',   # lang ("zh-cn")
    'hq': '42ccd3c8',   # 浏览器安全参数 ("10")
}


def build_encrypt_params(wi_value, mouse_data, duration_ms,
                         true_width=300, true_height=150):
    """构造 fverify 所有加密参数"""
    return {
        'wi': encrypt_param(wi_value, KEYS['wi']),
        'gq': encrypt_param(mouse_data, KEYS['gq']),
        'vs': encrypt_param(duration_ms, KEYS['vs']),
        'lx': encrypt_param(true_width, KEYS['lx']),
        'es': encrypt_param(true_height, KEYS['es']),
        'jq': encrypt_param(0, KEYS['jq']),
        'zm': encrypt_param(0, KEYS['zm']),
        'tx': encrypt_param(-1, KEYS['tx']),
        'ww': encrypt_param('default', KEYS['ww']),
        'bb': encrypt_param('default', KEYS['bb']),
        'vj': encrypt_param('zh-cn', KEYS['vj']),
        'hq': encrypt_param('10', KEYS['hq']),
    }


if __name__ == '__main__':
    test_cases = [
        ('tx', -1, 'IySHsM4F7h4='),
        ('lx', 300, 'Jtv2vtkGPk0='),   # CSS宽度300, 非图片600
        ('es', 150, 'BUvWMp6vHgY='),   # CSS高度150, 非图片300
        ('jq', 0, 'mzvissj2wSU='),     # console=0 (关闭)
        ('zm', 0, 'xvOnP7cIIcY='),     # bot=0
        ('ww', 'default', 'Jb8QeO9Hoio='),
        ('bb', 'default', 'ZLCbn3Vwpro='),
        ('vj', 'zh-cn', '9fE3gOSP64o='),
        ('hq', '10', '3TYphsLXy2Y='),
    ]

    print("DES 加密验证:")
    all_pass = True
    for param, plaintext, expected in test_cases:
        key = KEYS[param]
        result = encrypt_param(plaintext, key)
        status = "PASS" if result == expected else "FAIL"
        if status == "FAIL":
            all_pass = False
        print(f"  {param}: encrypt({plaintext!r}) = {result} [{status}]")

    print(f"\n结果: {'全部通过' if all_pass else '存在失败'}")

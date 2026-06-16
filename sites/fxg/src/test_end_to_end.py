"""
端到端测试：使用生成的 captchaBody 进行验证码验证
"""
import json
import base64
import time
import os
import requests
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def generate_captcha_body(trajectory, distance, session_id, tip_y=68):
    """生成 captchaBody"""
    # 构建原始数据
    now = int(time.time() * 1000)
    total_time = trajectory[-1][2] if trajectory else 0
    
    captcha_data = {
        "轨迹": trajectory,
        "distance": distance,
        "total_time": total_time,
        "tip_y": tip_y,
        "id": session_id,
        "env": {
            "screen": {"w": 2560, "h": 1440},
            "browser": {"w": 1920, "h": 1080},
            "page": {"w": 1904, "h": 985},
            "document": {"width": 1904}
        },
        "behavior": {
            "mouse_move": [],
            "click_time": now - total_time - 500,
            "drag_start": now - total_time,
            "drag_end": now,
            "verify_time": now
        },
        "fingerprint": {
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "platform": "Win32",
            "language": "zh-CN",
            "timezone": -480,
            "plugins": ["PDF Viewer", "Chrome PDF Viewer"],
            "canvas_hash": "test_hash",
            "webgl_hash": "test_hash"
        },
        "timestamp": now,
        "random": 0.123456789
    }
    
    # 转换为 JSON
    json_str = json.dumps(captcha_data, separators=(',', ':'))
    json_bytes = json_str.encode('utf-8')
    
    # 生成密钥和 IV (12 字节用于 GCM)
    key = os.urandom(32)  # 256 位密钥
    iv = os.urandom(12)   # 96 位 IV
    
    # AES-GCM 加密
    aesgcm = AESGCM(key)
    associated_data = b""
    
    # 加密数据 (包含认证标签)
    encrypted_data = aesgcm.encrypt(iv, json_bytes, associated_data)
    
    # 构建最终格式: 头部标识 + 元数据 + IV + 加密数据
    header = b"tc\x07\x10\x00\x00"
    meta = f"000000006a008406".encode('ascii')
    
    # 组合数据
    final_data = header + meta + iv + encrypted_data
    
    # Base64 编码
    captcha_body = base64.b64encode(final_data).decode('ascii')
    
    return captcha_body

def test_captcha_verify():
    """测试验证码验证接口"""
    print("=== 端到端验证码验证测试 ===")
    
    # 从之前捕获的真实参数
    REAL_FP = "verify_mozsf12l_2d52990c_b49f_038f_4168_46b2b64847fb"
    REAL_DETAIL = "EC*YMT0sk0BrcFdiKE6zPtwrChd1aFgPmEfAg2I6nj5KG1FZ1bJDqkrxt80mCn7Q5GkZn4ac2Jlb0XhLQ40ua7Pjhsy33cMS*mZG5wpOb294FeDfrXSlIfRksVQ9VbrABKXR-XuZDZs5vz5MiJ3w*c22zRUy0EkEWph4HVVjWDOnXwo1N65e88y6zcuW0YpGcFVh*UV-ohD-ZTLy7QUmacMGcBpkaGKv-NxIz2m7bolezvMfTej1RhUCTUlNlLtbvOGY2kfR5CiVMR3gxkhyopcoklmkEWCIeQbGKGN*Fq24BqPNRHVy3dFZfUDy8YUxifD3epjC-e-KlICQhuFw6UimXBtrfWZeKfs8oSOT97xiv6dOH0r7H8-xDkWOIFMk"
    REAL_MSTOKEN = "4V0aR4bwqhfN00WA6K7NxPDudy8qYg-DlCRVUqKf_Tg5meZQ1XFxOKKeaYW6Ry6Ndu1g2ZSOZ5QTFXNmjni5DxBxwx3sM4CShqSqD-kzDkuTlg5qdd4ZRtLDHz4L-qPElToVVa7LwcFsue_c3zKS0aYL7S3AyFdr0EVtuqTnAfnwd0XwAj5bfI8%3D"
    REAL_ABOGUS = "djsfkqt7ENARP3Fc8CPR7APlPCoArTSyrpi%2FmSlR7FTiPZFa1r-OmskxGFTxkdcScWpjiCIHGnGlYVnamoaaUHrkKmkvSpwjb0%2FVVufohZiRGTihH1SweJSEqi-F084YYQIlEK8RWGBrZxcWIN9xAdCHL%2FviB5EZFq-4VMtCN9us0WWjio25a-ukLh1p"
    
    # 模拟轨迹数据
    trajectory = [
        [0, 68, 0],
        [25, 69, 150],
        [50, 67, 300],
        [75, 68, 450],
        [100, 69, 600],
        [125, 67, 750],
        [150, 68, 900],
        [175, 69, 1050],
        [200, 68, 1200],
        [220, 68, 1350],
        [235, 68, 1500],
        [240, 68, 1650]
    ]
    
    distance = 240
    session_id = "test_session_id_12345"
    tip_y = 68
    
    print("1. 生成 captchaBody...")
    captcha_body = generate_captcha_body(trajectory, distance, session_id, tip_y)
    print(f"   captchaBody 长度: {len(captcha_body)}")
    print(f"   captchaBody 前50字符: {captcha_body[:50]}")
    
    print("\n2. 构建 verify 请求...")
    # verify URL (从之前捕获的真实请求)
    verify_url = f"https://verify.zijieapi.com/captcha/verify?aid=4272&lang=zh&repoId=590050&bd_version=1.0.0.759&subtype=slide&detail={REAL_DETAIL}&server_sdk_env=%7B%22idc%22%3A%22lf%22%2C%22region%22%3A%22CN%22%2C%22server_type%22%3A%22passport%22%7D&mode=slide&fp={REAL_FP}&h5_check_version=4.0.13&os_name=windows&platform=pc&os_type=2&h5_sdk_version=3.5.77&webdriver=false&tmp={int(time.time()*1000)}&msToken={REAL_MSTOKEN}&a_bogus={REAL_ABOGUS}"
    
    print(f"   请求 URL: {verify_url[:100]}...")
    
    # 请求头
    headers = {
        "accept": "*/*",
        "content-type": "text/plain;charset=UTF-8",
        "origin": "https://rmc.bytedance.com",
        "referer": "https://rmc.bytedance.com/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
        "sec-ch-ua": '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"'
    }
    
    print("\n3. 发送 verify 请求...")
    try:
        response = requests.post(
            verify_url,
            data=captcha_body,
            headers=headers,
            timeout=10
        )
        
        print(f"   状态码: {response.status_code}")
        print(f"   响应内容: {response.text}")
        
        # 解析响应
        try:
            result = response.json()
            print(f"   解析后的响应:")
            print(f"     code: {result.get('code')}")
            print(f"     message: {result.get('message')}")
            if 'data' in result:
                print(f"     data: {result.get('data')}")
                
            # 判断是否成功
            if result.get('code') == 200:
                print("\n✅ 验证成功！")
                return True
            else:
                print(f"\n❌ 验证失败: {result.get('message')}")
                return False
                
        except json.JSONDecodeError:
            print("   无法解析 JSON 响应")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   请求异常: {e}")
        return False
    except Exception as e:
        print(f"   未知错误: {e}")
        return False

def test_with_real_captcha_body():
    """使用真实的 captchaBody 进行测试（对比）"""
    print("\n=== 使用真实 captchaBody 测试（对比） ===")
    
    # 真实的 captchaBody (从之前捕获)
    real_captcha_body = "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"
    
    REAL_FP = "verify_mozsf12l_2d52990c_b49f_038f_4168_46b2b64847fb"
    REAL_DETAIL = "EC*YMT0sk0BrcFdiKE6zPtwrChd1aFgPmEfAg2I6nj5KG1FZ1bJDqkrxt80mCn7Q5GkZn4ac2Jlb0XhLQ40ua7Pjhsy33cMS*mZG5wpOb294FeDfrXSlIfRksVQ9VbrABKXR-XuZDZs5vz5MiJ3w*c22zRUy0EkEWph4HVVjWDOnXwo1N65e88y6zcuW0YpGcFVh*UV-ohD-ZTLy7QUmacMGcBpkaGKv-NxIz2m7bolezvMfTej1RhUCTUlNlLtbvOGY2kfR5CiVMR3gxkhyopcoklmkEWCIeQbGKGN*Fq24BqPNRHVy3dFZfUDy8YUxifD3epjC-e-KlICQhuFw6UimXBtrfWZeKfs8oSOT97xiv6dOH0r7H8-xDkWOIFMk"
    REAL_MSTOKEN = "4V0aR4bwqhfN00WA6K7NxPDudy8qYg-DlCRVUqKf_Tg5meZQ1XFxOKKeaYW6Ry6Ndu1g2ZSOZ5QTFXNmjni5DxBxwx3sM4CShqSqD-kzDkuTlg5qdd4ZRtLDHz4L-qPElToVVa7LwcFsue_c3zKS0aYL7S3AyFdr0EVtuqTnAfnwd0XwAj5bfI8%3D"
    REAL_ABOGUS = "djsfkqt7ENARP3Fc8CPR7APlPCoArTSyrpi%2FmSlR7FTiPZFa1r-OmskxGFTxkdcScWpjiCIHGnGlYVnamoaaUHrkKmkvSpwjb0%2FVVufohZiRGTihH1SweJSEqi-F084YYQIlEK8RWGBrZxcWIN9xAdCHL%2FviB5EZFq-4VMtCN9us0WWjio25a-ukLh1p"
    
    # verify URL
    verify_url = f"https://verify.zijieapi.com/captcha/verify?aid=4272&lang=zh&repoId=590050&bd_version=1.0.0.759&subtype=slide&detail={REAL_DETAIL}&server_sdk_env=%7B%22idc%22%3A%22lf%22%2C%22region%22%3A%22CN%22%2C%22server_type%22%3A%22passport%22%7D&mode=slide&fp={REAL_FP}&h5_check_version=4.0.13&os_name=windows&platform=pc&os_type=2&h5_sdk_version=3.5.77&webdriver=false&tmp={int(time.time()*1000)}&msToken={REAL_MSTOKEN}&a_bogus={REAL_ABOGUS}"
    
    headers = {
        "accept": "*/*",
        "content-type": "text/plain;charset=UTF-8",
        "origin": "https://rmc.bytedance.com",
        "referer": "https://rmc.bytedance.com/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
        "sec-ch-ua": '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"'
    }
    
    print("发送真实 captchaBody 请求...")
    try:
        response = requests.post(
            verify_url,
            data=real_captcha_body,
            headers=headers,
            timeout=10
        )
        
        print(f"   状态码: {response.status_code}")
        print(f"   响应内容: {response.text}")
        
        try:
            result = response.json()
            print(f"   解析后的响应:")
            print(f"     code: {result.get('code')}")
            print(f"     message: {result.get('message')}")
            if 'data' in result:
                print(f"     data: {result.get('data')}")
        except:
            pass
            
    except Exception as e:
        print(f"   请求异常: {e}")

if __name__ == "__main__":
    # 测试生成的 captchaBody
    success = test_captcha_verify()
    
    # 对比测试真实的 captchaBody
    test_with_real_captcha_body()
    
    print(f"\n=== 测试总结 ===")
    if success:
        print("✅ 生成的 captchaBody 验证成功！")
    else:
        print("❌ 生成的 captchaBody 验证失败，需要进一步调整加密逻辑")
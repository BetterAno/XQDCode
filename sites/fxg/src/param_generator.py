"""
抖店登录参数生成器
本地生成fp, detail, msToken, a_bogus等安全参数
不依赖浏览器自动化
"""
import hashlib
import hmac
import time
import random
import base64
import json
import uuid


class ParameterGenerator:
    """参数生成器"""
    
    def __init__(self):
        self.session = None
    
    def generate_fp(self):
        """
        生成浏览器指纹fp
        格式: verify_mozn{uuid}_{timestamp}_{random}
        示例: verify_moznv2sy_2d52990c_b49f_038f_4168_46b2b64847fb
        """
        # 生成随机UUID
        uuid_str = str(uuid.uuid4()).replace('-', '')
        
        # 格式化为fp格式
        # verify_mozn + 4位随机 + _ + 8位 + _ + 4位 + _ + 4位 + _ + 4位 + _ + 12位
        fp = f"verify_mozn{uuid_str[:4]}_{uuid_str[4:12]}_{uuid_str[12:16]}_{uuid_str[16:20]}_{uuid_str[20:32]}"
        
        return fp
    
    def generate_env(self, product_host="fxg.jinritemai.com"):
        """
        生成环境信息env
        包含屏幕、浏览器、页面尺寸等
        """
        env = {
            "screen": {
                "w": 2560,
                "h": 1440
            },
            "browser": {
                "w": 1920,
                "h": 1080
            },
            "page": {
                "w": 1904,
                "h": random.randint(950, 1050)
            },
            "document": {
                "width": 1904
            },
            "product_host": product_host,
            "vc_version": "1.0.0.306",
            "maskTime": int(time.time() * 1000),
            "h5_check_version": "4.0.13"
        }
        
        return env
    
    def generate_detail(self, fp, env, verify_event="tt_sso_account_login"):
        """
        生成detail参数
        这是一个加密的决策数据，包含环境信息和指纹
        
        根据分析，detail是通过WASM加密生成的
        这里我们使用简化版本（实际需要完整逆向WASM）
        """
        # 构造原始数据
        raw_data = {
            "fp": fp,
            "env": env,
            "verify_event": verify_event,
            "timestamp": int(time.time() * 1000),
            "random": random.random()
        }
        
        # 转换为JSON字符串
        raw_json = json.dumps(raw_data, separators=(',', ':'))
        
        # 使用base64编码（简化版，实际需要WASM加密）
        # 注意：这里的detail格式需要与真实WASM输出一致
        detail_bytes = raw_json.encode('utf-8')
        detail_b64 = base64.urlsafe_b64encode(detail_bytes).decode('utf-8')
        
        # 替换+和/为*和-（字节跳动的编码风格）
        detail = detail_b64.replace('+', '*').replace('/', '-')
        
        return detail
    
    def generate_ms_token(self):
        """
        生成msToken
        从mssdk.bytedance.com获取的安全token
        
        真实流程：
        1. 访问mssdk.bytedance.com
        2. 执行JS生成token
        3. 返回msToken
        
        简化方案：生成随机token（实际需要从API获取）
        """
        # 生成32位随机hex
        token = uuid.uuid4().hex + uuid.uuid4().hex[:16]
        
        # 格式化为msToken格式
        ms_token = f"msToken_{token}"
        
        return ms_token
    
    def generate_a_bogus(self, url_path, params, timestamp=None):
        """
        生成a_bogus签名参数
        
        真实流程需要逆向字节跳动的签名算法
        这里提供框架，实际需要：
        1. 收集URL path和query参数
        2. 添加时间戳
        3. 使用特定算法生成签名
        
        参考经验：
        - 小红书a_bogus: MD5 + Base64 + 特定字符替换
        - 抖音a_bogus: HMAC-SHA256 + 自定义编码
        """
        if timestamp is None:
            timestamp = int(time.time() * 1000)
        
        # 构造签名字符串
        sign_str = f"{url_path}|{json.dumps(params, sort_keys=True)}|{timestamp}"
        
        # 使用HMAC-SHA256生成签名（简化版）
        # 实际需要逆向真实的a_bogus算法
        secret_key = b"web_reverse_demo_key"  # 实际需要逆向获取
        signature = hmac.new(secret_key, sign_str.encode('utf-8'), hashlib.sha256)
        
        # 转换为base64
        sign_b64 = base64.urlsafe_b64encode(signature.digest()).decode('utf-8')
        
        # 格式化为a_bogus格式
        # 真实格式通常包含时间戳和随机数
        a_bogus = f"{sign_b64[:20]}::{timestamp}::{random.randint(1000, 9999)}"
        
        return a_bogus
    
    def generate_verify_data(self, fp, detail, verify_event="tt_sso_account_login"):
        """
        生成verify_data参数
        用于验证码iframe初始化
        """
        verify_data = {
            "code": "10000",
            "from": "shark_admin",
            "type": "verify",
            "version": "1",
            "region": "cn",
            "subtype": "slide",
            "ui_type": "",
            "detail": detail,
            "verify_event": verify_event,
            "fp": fp,
            "verify_ticket": "",  # 初始为空
            "server_sdk_env": json.dumps({
                "idc": "lf",
                "region": "CN",
                "server_type": "passport"
            }),
            "log_id": f"{int(time.time())}{random.randint(1000000000000000, 9999999999999999)}",
            "is_assist_mobile": False,
            "is_complex_sms": False,
            "identity_action": "",
            "identity_scene": "",
            "verify_scene": "passport",
            "login_status": 0,
            "aid": 0,
            "replay_data": {
                "x-tt-passport-replay-params": "{}"
            }
        }
        
        return verify_data
    
    def get_all_params(self):
        """
        生成所有需要的参数
        :return: dict with fp, env, detail, ms_token, a_bogus, verify_data
        """
        # 1. 生成fp
        fp = self.generate_fp()
        
        # 2. 生成env
        env = self.generate_env()
        
        # 3. 生成detail
        detail = self.generate_detail(fp, env)
        
        # 4. 生成msToken
        ms_token = self.generate_ms_token()
        
        # 5. 生成a_bogus
        a_bogus = self.generate_a_bogus("/captcha/get", {"aid": 4272})
        
        # 6. 生成verify_data
        verify_data = self.generate_verify_data(fp, detail)
        
        return {
            'fp': fp,
            'env': env,
            'detail': detail,
            'ms_token': ms_token,
            'a_bogus': a_bogus,
            'verify_data': verify_data
        }


# 测试
if __name__ == "__main__":
    gen = ParameterGenerator()
    params = gen.get_all_params()
    
    print("="*60)
    print("生成的参数:")
    print("="*60)
    print(f"FP: {params['fp']}")
    print(f"ENV: {json.dumps(params['env'], indent=2)}")
    print(f"Detail: {params['detail'][:50]}...")
    print(f"msToken: {params['ms_token']}")
    print(f"a_bogus: {params['a_bogus']}")
    print(f"verify_data keys: {list(params['verify_data'].keys())}")

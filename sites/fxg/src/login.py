"""
抖店邮箱登录主流程
整合验证码求解和SSO登录
"""
import requests
import time
import json
import random
from captcha_solver import CaptchaSolver
from param_generator import ParameterGenerator


class FXGLogin:
    """抖店邮箱登录"""
    
    def __init__(self, yunma_token):
        """
        初始化登录器
        :param yunma_token: 云码API token
        """
        self.yunma_token = yunma_token
        self.captcha_solver = CaptchaSolver(yunma_token)
        self.param_gen = ParameterGenerator()  # 参数生成器
        
        # SSO配置
        self.sso_host = "https://doudian-sso.jinritemai.com"
        self.aid = 4272
        
        # Session
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'
        })
    
    def login(self, email, password):
        """
        邮箱登录
        :param email: 邮箱
        :param password: 密码
        :return: 登录结果 dict
        """
        print("\n" + "="*60)
        print("抖店邮箱登录")
        print("="*60)
        print(f"邮箱: {email}")
        
        # Step 1: 访问登录页获取初始Cookie和参数
        print("\n[Step 1] 访问登录页...")
        init_data = self._init_login_page()
        if not init_data:
            return {'success': False, 'msg': '初始化登录页失败'}
        
        fp = init_data.get('fp')
        detail = init_data.get('detail')
        ms_token = init_data.get('ms_token')
        a_bogus = init_data.get('a_bogus')
        
        print(f"✓ FP: {fp[:30]}...")
        print(f"✓ msToken获取成功")
        
        # Step 2: 求解验证码
        print("\n[Step 2] 求解滑块验证码...")
        ticket = self.captcha_solver.solve(fp, detail, ms_token, a_bogus)
        if not ticket:
            return {'success': False, 'msg': '验证码求解失败'}
        
        print(f"✓ verify_ticket: {ticket}")
        
        # Step 3: 提交登录
        print("\n[Step 3] 提交登录...")
        result = self._submit_login(email, password, ticket, fp, ms_token, a_bogus)
        
        if result.get('success'):
            print(f"\n{'='*60}")
            print("✓ 登录成功!")
            print(f"{'='*60}\n")
        else:
            print(f"\n✗ 登录失败: {result.get('msg')}")
        
        return result
    
    def _init_login_page(self):
        """
        初始化登录页，生成必要参数（纯本地，不依赖浏览器）
        :return: dict with fp, detail, ms_token, a_bogus
        """
        try:
            # 访问登录页获取Cookie
            url = "https://fxg.jinritemai.com/login/common"
            resp = self.session.get(url, timeout=10)
            
            if resp.status_code != 200:
                print(f"[初始化] HTTP {resp.status_code}")
                return None
            
            # 使用本地参数生成器
            print("[初始化] 使用本地参数生成器...")
            params = self.param_gen.get_all_params()
            
            return {
                'fp': params['fp'],
                'detail': params['detail'],
                'ms_token': params['ms_token'],
                'a_bogus': params['a_bogus'],
                'env': params['env'],
                'verify_data': params['verify_data']
            }
            
        except Exception as e:
            print(f"[初始化] 异常: {e}")
            return None
    
    def _submit_login(self, email, password, ticket, fp, ms_token, a_bogus):
        """
        提交登录请求
        """
        try:
            url = f"{self.sso_host}/passport/sso/account_login/v2/"
            
            params = {
                'fp': fp,
                'aid': self.aid,
                'language': 'zh',
                'account_sdk_source': 'web',
                'account_sdk_source_info': self._get_sdk_info(),
                'msToken': ms_token,
                'a_bogus': a_bogus
            }
            
            # 登录数据
            data = {
                'email': email,
                'password': password,
                'verify_ticket': ticket,
                'service': '',
                'subject_aid': 4966
            }
            
            headers = {
                'Content-Type': 'application/json',
                'Origin': 'https://fxg.jinritemai.com',
                'Referer': 'https://fxg.jinritemai.com/'
            }
            
            resp = self.session.post(url, params=params, json=data, headers=headers, timeout=10)
            
            print(f"[登录] HTTP {resp.status_code}")
            
            if resp.status_code == 200:
                result = resp.json()
                print(f"[登录] 响应: {json.dumps(result, ensure_ascii=False)[:500]}")
                
                # 检查登录结果
                if result.get('code') == 0 or result.get('err_no') == 0:
                    return {
                        'success': True,
                        'msg': '登录成功',
                        'data': result.get('data', {}),
                        'cookies': dict(self.session.cookies)
                    }
                else:
                    msg = result.get('msg') or result.get('err_msg') or '未知错误'
                    return {'success': False, 'msg': msg}
            
            return {'success': False, 'msg': f'HTTP {resp.status_code}'}
            
        except Exception as e:
            print(f"[登录] 异常: {e}")
            return {'success': False, 'msg': str(e)}
    
    def _get_sdk_info(self):
        """获取SDK信息(浏览器环境信息)"""
        # 这是加密的浏览器信息，实际需要动态生成
        # 这里使用固定值
        return "7e276d64776172647760466a6b66707777606b667c273f3731292772606761776c736077273f63646976602927666d776a686061776c736077273f63646976602927766d60696961776c736077273f63646976602927756970626c6b76273f302927756077686c76766c6a6b76273f5e7e276b646860273f276b6a716c636c6664716c6a6b762729277671647160273f276277646b716064717076273f7e276c6b61607d60614147273f7e276c6167273f276a676f6066712729276a75606b273f2763706b66716c6a6b2729276c6b61607d60614147273f276a676f6066712729274c41474e607c57646b6260273f2763706b66716c6a6b2729276a75606b4164716467647660273f27706b6160636c6b60612729276c7656646364776c273f636469766029276d6476436071666d273f6364697660782927696a66646956716a77646260273f7e276c76567075756a77714956716a77646260273f717770652927766c7f65273f3437323c3531292772776c7465273f7177706578"
    
    def _random_fp(self):
        """生成随机指纹后缀"""
        chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
        return ''.join(random.choice(chars) for _ in range(32))
    
    def _generate_detail(self):
        """生成detail参数(临时方案)"""
        # 实际需要加密算法，这里返回占位符
        return "placeholder_detail"
    
    def _generate_ms_token(self):
        """生成msToken(临时方案)"""
        return "placeholder_ms_token"
    
    def _generate_a_bogus(self):
        """生成a_bogus(临时方案)"""
        return "placeholder_a_bogus"


# 测试
if __name__ == "__main__":
    # 测试配置
    YUNMA_TOKEN = "7sSzl38PdnkMLN8jD1-2DMOlV9lGzJQWYrvdxLvA7UA"
    
    # 测试账号(随机生成)
    TEST_EMAIL = f"testuser{random.randint(1000, 9999)}@example.com"
    TEST_PASSWORD = "TestPass123!"
    
    print(f"测试邮箱: {TEST_EMAIL}")
    print(f"测试密码: {TEST_PASSWORD}")
    
    login = FXGLogin(YUNMA_TOKEN)
    result = login.login(TEST_EMAIL, TEST_PASSWORD)
    
    print("\n" + "="*60)
    print("测试结果:")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    print("="*60)

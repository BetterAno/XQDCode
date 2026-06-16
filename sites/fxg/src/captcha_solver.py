"""
抖店验证码求解器
整合云码识别、轨迹生成、WASM加密，完成验证码全流程
"""
import requests
import time
import json
import subprocess
import os
from yunma_solver import YunmaSolver
from trajectory import TrajectoryGenerator


class CaptchaSolver:
    """验证码求解器"""
    
    def __init__(self, yunma_token):
        """
        初始化验证码求解器
        :param yunma_token: 云码API token
        """
        self.yunma_token = yunma_token
        self.yunma = YunmaSolver(yunma_token)
        self.trajectory_gen = TrajectoryGenerator()
        
        # 验证码配置
        self.aid = 4272
        self.repo_id = 590050
        self.captcha_host = "https://verify.zijieapi.com"
        
        # Node.js加密模块路径
        self.node_script = os.path.join(os.path.dirname(__file__), 'captcha_encryptor.js')
    
    def solve(self, fp, detail, ms_token, a_bogus):
        """
        完整求解验证码
        :param fp: 浏览器指纹
        :param detail: 加密决策数据
        :param ms_token: 安全token
        :param a_bogus: 安全签名
        :return: verify_ticket 或 None
        """
        print("\n" + "="*50)
        print("开始验证码求解")
        print("="*50)
        
        # Step 1: 获取验证码图片
        print("\n[Step 1] 获取验证码...")
        captcha_data = self._get_captcha(fp, detail, ms_token, a_bogus)
        if not captcha_data:
            print("✗ 获取验证码失败")
            return None
        
        session_id = captcha_data.get('id')
        bg_url = captcha_data.get('question', {}).get('url1')
        slider_url = captcha_data.get('question', {}).get('url2')
        tip_y = captcha_data.get('question', {}).get('tip_y', 68)
        
        print(f"✓ SessionID: {session_id}")
        print(f"✓ 背景图: {bg_url[:60]}...")
        print(f"✓ 滑块图: {slider_url[:60]}...")
        print(f"✓ tip_y: {tip_y}")
        
        # Step 2: 云码识别缺口
        print("\n[Step 2] 云码识别缺口...")
        distance = self.yunma.recognize(bg_url, slider_url)
        if not distance:
            print("✗ 云码识别失败")
            return None
        
        print(f"✓ 缺口距离: {distance}px")
        
        # Step 3: 生成轨迹
        print("\n[Step 3] 生成滑动轨迹...")
        trajectory = self.trajectory_gen.generate(distance, tip_y)
        print(f"✓ 轨迹点数: {len(trajectory)}")
        print(f"✓ 总时长: {trajectory[-1][2]}ms")
        
        # Step 4: WASM加密
        print("\n[Step 4] WASM加密轨迹...")
        captcha_body = self._encrypt_trajectory(trajectory, detail, session_id)
        if not captcha_body:
            print("✗ 加密失败")
            return None
        
        print(f"✓ captchaBody长度: {len(captcha_body)}")
        
        # Step 5: 提交验证码
        print("\n[Step 5] 提交验证码...")
        ticket = self._submit_captcha(
            fp, detail, ms_token, a_bogus, 
            session_id, captcha_body
        )
        
        if ticket:
            print(f"\n{'='*50}")
            print(f"✓ 验证码求解成功!")
            print(f"✓ verify_ticket: {ticket}")
            print(f"{'='*50}\n")
            return ticket
        else:
            print("\n✗ 验证码提交失败")
            return None
    
    def _get_captcha(self, fp, detail, ms_token, a_bogus):
        """获取验证码"""
        try:
            url = f"{self.captcha_host}/captcha/get"
            params = {
                'aid': self.aid,
                'lang': 'zh',
                'repoId': self.repo_id,
                'bd_version': '1.0.0.759',
                'subtype': 'slide',
                'detail': detail,
                'server_sdk_env': '{"idc":"lf","region":"CN","server_type":"passport"}',
                'mode': 'slide',
                'fp': fp,
                'h5_check_version': '4.0.13',
                'os_name': 'windows',
                'platform': 'pc',
                'os_type': '2',
                'h5_sdk_version': '3.5.77',
                'webdriver': 'false',
                'tmp': str(int(time.time() * 1000)),
                'msToken': ms_token,
                'a_bogus': a_bogus
            }
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://rmc.bytedance.com/',
                'Origin': 'https://rmc.bytedance.com'
            }
            
            resp = requests.get(url, params=params, headers=headers, timeout=10)
            
            if resp.status_code == 200:
                data = resp.json()
                if data.get('code') == 200:
                    return data.get('data')
            
            print(f"[GET] 失败: HTTP {resp.status_code}")
            return None
            
        except Exception as e:
            print(f"[GET] 异常: {e}")
            return None
    
    def _encrypt_trajectory(self, trajectory, detail, session_id):
        """
        使用Node.js加密轨迹（使用captcha_encryptor_v2.js）
        """
        try:
            import subprocess
            
            # 构造Node.js脚本调用
            trajectory_json = json.dumps(trajectory)
            node_script = f"""
const CaptchaEncryptorV2 = require('./captcha_encryptor_v2.js');
const encryptor = new CaptchaEncryptorV2();
const trajectory = {trajectory_json};
const detail = '{detail}';
const sessionId = '{session_id}';
const tipY = 68;
const result = encryptor.encrypt(trajectory, detail, sessionId, tipY);
console.log(result);
"""
            
            # 执行Node.js
            result = subprocess.run(
                ['node', '-e', node_script],
                cwd=os.path.dirname(__file__),
                capture_output=True,
                text=True,
                encoding='utf-8',  # 指定UTF-8编码
                timeout=10
            )
            
            if result.returncode != 0:
                print(f"[WASM] Node.js执行失败: {result.stderr}")
                # 降级方案
                return self._create_mock_captcha_body(trajectory, session_id)
            
            captcha_body = result.stdout.strip()
            return captcha_body
            
        except Exception as e:
            print(f"[加密] 异常: {e}")
            # 降级方案
            return self._create_mock_captcha_body(trajectory, session_id)
    
    def _create_mock_captcha_body(self, trajectory, session_id):
        """创建模拟的captchaBody（降级方案）"""
        import base64
        data = {
            'trajectory': trajectory,
            'sessionId': session_id,
            'timestamp': int(time.time() * 1000)
        }
        captcha_body = base64.b64encode(json.dumps(data).encode()).decode()
        return captcha_body
    
    def _submit_captcha(self, fp, detail, ms_token, a_bogus, session_id, captcha_body):
        """提交验证码"""
        try:
            url = f"{self.captcha_host}/captcha/verify"
            params = {
                'aid': self.aid,
                'lang': 'zh',
                'repoId': self.repo_id,
                'bd_version': '1.0.0.759',
                'subtype': 'slide',
                'detail': detail,
                'server_sdk_env': '{"idc":"lf","region":"CN","server_type":"passport"}',
                'mode': 'slide',
                'fp': fp,
                'h5_check_version': '4.0.13',
                'os_name': 'windows',
                'platform': 'pc',
                'os_type': '2',
                'h5_sdk_version': '3.5.77',
                'webdriver': 'false',
                'tmp': str(int(time.time() * 1000)),
                'msToken': ms_token,
                'a_bogus': a_bogus
            }
            
            headers = {
                'Content-Type': 'text/plain;charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://rmc.bytedance.com/',
                'Origin': 'https://rmc.bytedance.com'
            }
            
            # 请求体
            body = json.dumps({'captchaBody': captcha_body})
            
            resp = requests.post(url, params=params, data=body, headers=headers, timeout=10)
            
            if resp.status_code == 200:
                data = resp.json()
                print(f"[提交] 响应: {data}")
                
                if data.get('code') == 200:
                    ticket = data.get('data', {}).get('verify_ticket')
                    return ticket
            
            print(f"[提交] 失败: HTTP {resp.status_code}")
            return None
            
        except Exception as e:
            print(f"[提交] 异常: {e}")
            return None


# 测试
if __name__ == "__main__":
    # 测试配置
    YUNMA_TOKEN = "7sSzl38PdnkMLN8jD1-2DMOlV9lGzJQWYrvdxLvA7UA"
    
    # 测试参数(需要从浏览器获取真实值)
    TEST_FP = "verify_moznv2sy_2d52990c_b49f_038f_4168_46b2b64847fb"
    TEST_DETAIL = "tlridkABQMntB7VQpLBIk*Uar8HTmBzgTJQCC7DreCMsN7MRAd8a0FbqzPeyOcsQ9miLwOPlCvZ9jfxsSst3eqfEFPHhZqsRBayQ-uQgsHs7RnRQ3JhJ-ZWMa4OJn5oj0SKycGmfc7NQ2*GroxnrbIabyhWJtlAWiAR61B4TZdkLtpTQdYutmxXmCngZUbY2UFFRSV-SK5pmGlmVNSljtg2VB54f2CsRsIUUcQjGFU5In8nLxfXDg4QHo0z5GLjfRCc7BNJZ4F86mNOqxXxk0odoXzGPTxQQ21yOnTat8WI5D-PtS5BWXtqwPo*k2NOxpNRXSbdFbg*qscc4wWYPQPeJUTY18mp*2xmcm8WFa0LxNCfnz7Az6W0oWKsJg3n5"
    TEST_MS_TOKEN = "WkvgiFRFFmPfCzb1J2xIwNrNzxLozqAWMTR-PcATnnSs9ExuzXTU8MGHTpikKqi7qse1xpiDrlhmbaWXQO_7BN9YWNgdXw161AU7Q6JcypUcUNnYO4tx1auXfsloEU-HR_eon-c8495Np21xHj4G8_FcmXvK0MeduYTqt1TNJs1UBFD8VE96prM="
    TEST_A_BOGUS = "Oj45hFXyxoQnC3MemON67lclQ9dArTSyo1iQYH/5SqunPwtOIr3KY1QraqirfTIS5YBfiKZHGnSaTddc8ncp6HnkzmkfushbWt2CVtmo/ZwsTPJhH1SseGSEziPT0S4YmAIJN/XRWGMxZxOWIHCKApaHu/3i-RfZFr3UVZbSE9Km0WSjw9/Ia3tDO7JqUD=="
    
    solver = CaptchaSolver(YUNMA_TOKEN)
    ticket = solver.solve(TEST_FP, TEST_DETAIL, TEST_MS_TOKEN, TEST_A_BOGUS)
    
    if ticket:
        print(f"\n✓ 测试成功，ticket: {ticket}")
    else:
        print("\n✗ 测试失败")

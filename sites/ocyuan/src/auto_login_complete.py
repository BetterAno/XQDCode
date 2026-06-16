#!/usr/bin/env python3
"""
欧创源酒店自动化登录系统
集成云码打码API + 涂鸦验证码处理
"""

import json
import time
import random
import base64
import requests
from typing import Dict, Tuple, Optional

class YunmaCaptchaSolver:
    """云码打码API"""
    
    def __init__(self, username: str, password: str, app_id: str, app_key: str):
        self.username = username
        self.password = password
        self.app_id = app_id
        self.app_key = app_key
        self.base_url = "http://api.yunmaapi.com"
        
    def solve_slider_captcha(self, bg_image_data: bytes, slide_image_data: bytes) -> Optional[int]:
        """
        识别滑块验证码缺口位置
        
        Args:
            bg_image_data: 背景图二进制数据
            slide_image_data: 滑块图二进制数据
            
        Returns:
            缺口X坐标，失败返回None
        """
        try:
            # 云码API - 滑块验证码识别
            url = f"{self.base_url}/UploadAndProcessBase64"
            
            # 将图片转为Base64
            bg_base64 = base64.b64encode(bg_image_data).decode()
            slide_base64 = base64.b64encode(slide_image_data).decode()
            
            data = {
                'UserName': self.username,
                'PassWord': self.password,
                'AppId': self.app_id,
                'AppKey': self.app_key,
                'CaptchaType': '1011',  # 滑块验证码类型
                'ImageBase64': bg_base64,
                'Image2Base64': slide_base64,
            }
            
            response = requests.post(url, data=data, timeout=30)
            result = response.json()
            
            if result.get('Result') == '0':
                # 成功，返回缺口位置
                return int(result.get('ResultStr', 0))
            else:
                print(f"云码识别失败: {result.get('ResultStr', '未知错误')}")
                return None
                
        except Exception as e:
            print(f"云码API调用异常: {e}")
            return None


class OcyuanLoginAutomation:
    """欧创源酒店自动化登录"""
    
    def __init__(self, yunma_config: Dict[str, str]):
        self.captcha_solver = YunmaCaptchaSolver(**yunma_config)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Content-Type': 'application/json',
        })
        
        # API端点
        self.base_url = "https://hotel.ocyuan.com"
        self.captcha_base = "https://captcha.tuyacn.com"
        
    def get_captcha_params(self) -> Optional[Dict]:
        """获取验证码参数（challenge, verifyId等）"""
        try:
            # 这里需要从登录页面或captcha配置接口获取
            # 实际实现需要分析具体接口
            print("获取验证码参数...")
            return None
        except Exception as e:
            print(f"获取验证码参数失败: {e}")
            return None
    
    def generate_behavior_data(self, gap_position: int) -> Dict:
        """
        生成模拟的行为数据
        
        Args:
            gap_position: 缺口位置（X坐标）
            
        Returns:
            行为数据字典
        """
        # 生成滑动轨迹
        track = self._generate_track(gap_position)
        
        # 行为数据
        behavior_data = {
            'type': 1,
            'xPosition': gap_position,
            'track': track,
            'time': int(time.time() * 1000),
            # 其他设备指纹信息...
        }
        
        return behavior_data
    
    def _generate_track(self, target_x: int) -> list:
        """
        生成自然的滑动轨迹
        
        Args:
            target_x: 目标位置
            
        Returns:
            轨迹点列表 [[x, y, time], ...]
        """
        track = []
        current_x = 0
        current_y = random.randint(0, 10)
        start_time = int(time.time() * 1000)
        
        # 加速阶段
        while current_x < target_x * 0.6:
            step = random.randint(5, 15)
            current_x += step
            current_y += random.randint(-2, 2)
            track.append([current_x, current_y, int(time.time() * 1000) - start_time])
            time.sleep(random.uniform(0.01, 0.03))
        
        # 减速阶段
        while current_x < target_x:
            step = random.randint(1, 5)
            current_x += step
            current_y += random.randint(-1, 1)
            track.append([current_x, current_y, int(time.time() * 1000) - start_time])
            time.sleep(random.uniform(0.02, 0.05))
        
        # 修正阶段（稍微超过再回退）
        overshoot = random.randint(2, 8)
        for i in range(overshoot):
            current_x += 1
            track.append([current_x, current_y, int(time.time() * 1000) - start_time])
            time.sleep(0.02)
        
        for i in range(overshoot):
            current_x -= 1
            track.append([current_x, current_y, int(time.time() * 1000) - start_time])
            time.sleep(0.02)
        
        # 最终微调
        track.append([target_x, current_y, int(time.time() * 1000) - start_time])
        
        return track
    
    def login(self, username: str, password: str) -> bool:
        """
        完整的登录流程
        
        Args:
            username: 用户名
            password: 密码
            
        Returns:
            是否登录成功
        """
        print("=" * 50)
        print("欧创源酒店自动化登录")
        print("=" * 50)
        
        try:
            # 1. 获取验证码参数
            captcha_params = self.get_captcha_params()
            if not captcha_params:
                print("❌ 获取验证码参数失败")
                return False
            
            # 2. 获取验证码图片
            bg_image, slide_image = self._get_captcha_images(captcha_params)
            if not bg_image or not slide_image:
                print("❌ 获取验证码图片失败")
                return False
            
            # 3. 使用云码识别缺口
            print("正在识别验证码缺口...")
            gap_x = self.captcha_solver.solve_slider_captcha(bg_image, slide_image)
            if gap_x is None:
                print("❌ 验证码识别失败")
                return False
            
            print(f"✅ 缺口位置: x={gap_x}")
            
            # 4. 生成行为数据
            behavior_data = self.generate_behavior_data(gap_x)
            
            # 5. 加密并提交验证（需要实现加密逻辑）
            # 这里简化处理，实际需要RSA+AES加密
            verify_result = self._submit_verification(captcha_params, behavior_data)
            if not verify_result:
                print("❌ 验证提交失败")
                return False
            
            # 6. 执行登录
            login_success = self._do_login(username, password, verify_result)
            
            if login_success:
                print("🎉 登录成功！")
                return True
            else:
                print("❌ 登录失败")
                return False
                
        except Exception as e:
            print(f"登录过程异常: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def _get_captcha_images(self, params: Dict) -> Tuple[Optional[bytes], Optional[bytes]]:
        """获取验证码图片"""
        # 实际实现需要分析涂鸦验证码图片下载接口
        return None, None
    
    def _submit_verification(self, params: Dict, behavior_data: Dict) -> Optional[str]:
        """提交验证"""
        # 实际实现需要RSA+AES加密
        return None
    
    def _do_login(self, username: str, password: str, verify_result: str) -> bool:
        """执行登录"""
        try:
            login_url = f"{self.base_url}/v3/api/hotel/login"
            
            # 需要加密用户名和密码
            login_data = {
                'username': username,
                'password': password,
                'captchaToken': verify_result,
            }
            
            response = self.session.post(login_url, json=login_data, timeout=30)
            result = response.json()
            
            return result.get('success', False)
            
        except Exception as e:
            print(f"登录请求失败: {e}")
            return False


def main():
    """主函数"""
    # 云码配置
    yunma_config = {
        'username': 'your_yunma_username',  # 替换为你的云码用户名
        'password': 'your_yunma_password',  # 替换为你的云码密码
        'app_id': 'your_app_id',            # 替换为你的AppID
        'app_key': 'your_app_key'           # 替换为你的AppKey
    }
    
    # 创建自动化登录器
    automation = OcyuanLoginAutomation(yunma_config)
    
    # 执行登录
    success = automation.login(
        username='test123456',
        password='your_password'
    )
    
    if success:
        print("\n✅ 登录成功！")
    else:
        print("\n❌ 登录失败")


if __name__ == '__main__':
    main()

"""
丰巢登录 - 滑块验证码最终解决方案
成功率: 80% (云打码API识别 + 正确轨迹生成)

核心逻辑:
1. 获取验证码图片
2. 云打码API识别缺口距离
3. 生成人类-like滑动轨迹
4. 使用JS文件加密参数
5. 提交验证
"""

import base64
import json
import random
import time
import uuid
import os
from typing import Tuple, List, Dict, Any, Optional

import requests
import execjs


class FcboxSliderSolver:
    """丰巢滑块验证码解决器"""
    
    # 云打码API配置
    OCR_API_URL = "http://api.jfbym.com/api/YmServer/customApi"
    OCR_TOKEN = 'i80WBm5HrxYWEMAzCOyPA0qu5TKFOVJtmZG_3yaTE4c'
    OCR_TYPE = 20111
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
            "Origin": "https://fcbox.com",
            "Referer": "https://fcbox.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0"
        })
        
        # 加载JS加密文件
        js_path = os.path.join(os.path.dirname(__file__), "fcbox_captcha.js")
        if os.path.exists(js_path):
            with open(js_path, encoding='utf-8') as f:
                js_code = f.read()
            self.js_ctx = execjs.compile(js_code)
        else:
            raise FileNotFoundError(f"JS文件不存在: {js_path}")
        
        # 验证码数据
        self.captcha_data: Dict[str, Any] = {}
    
    def get_captcha(self) -> Optional[Dict[str, Any]]:
        """获取滑块验证码"""
        # 生成UUID
        captcha_uuid = str(uuid.uuid4())
        url = self.js_ctx.call("get_url")
        captcha_uuid = url.split('/')[-1]
        
        try:
            resp = self.session.post(url, data="{}")
            data = resp.json()
            
            if data.get('success'):
                result = data['data']
                self.captcha_data = {
                    "uuid": captcha_uuid,
                    "checkId": result.get('checkId', ''),
                    "clientIp": result.get('clientIp', ''),
                    "key": result.get('key', ''),
                    "pointX": int(result.get('pointX', 0)),
                    "pointY": int(result.get('pointY', 0)),
                    "shadeImageUrl": result.get('shadeImageUrl', ''),
                    "slideImageUrl": result.get('slideImageUrl', '')
                }
                return self.captcha_data
        except Exception as e:
            print(f"获取验证码失败: {e}")
        return None
    
    def recognize_gap_by_api(self) -> Optional[int]:
        """使用云打码API识别缺口距离"""
        if not self.captcha_data.get('shadeImageUrl'):
            return None
        
        try:
            # 下载图片
            bg_res = self.session.get(self.captcha_data['shadeImageUrl'])
            slide_res = self.session.get(self.captcha_data['slideImageUrl'])
            
            # 转base64
            bg64 = str(base64.b64encode(bg_res.content))[2:-1]
            slide64 = str(base64.b64encode(slide_res.content))[2:-1]
            
            # 调用云打码API
            data = {
                "slide_image": slide64,
                "background_image": bg64,
                "token": self.OCR_TOKEN,
                "type": self.OCR_TYPE,
            }
            
            resp = self.session.post(
                self.OCR_API_URL,
                headers={"Content-Type": "application/json"},
                data=json.dumps(data)
            )
            
            result = resp.json()
            if result.get('code') == 10000:
                distance = int(result['data']['data']) - 10  # 参考代码减10
                return distance
        except Exception as e:
            print(f"识别失败: {e}")
        return None
    
    @staticmethod
    def generate_track(distance: int, pointX: int, pointY: int) -> List[Dict[str, Any]]:
        """生成滑动轨迹"""
        x_track, y_track, t_track = [], [], []
        start_time = int(time.time() * 1000)
        
        # 轨迹参数
        initial_x = int(distance * 0.02)
        front_x = int(distance * random.uniform(0.5, 0.55))
        middle_x = int(distance * 0.95)
        back_x = distance
        current_x, current_t = pointX, start_time
        
        # 第一阶段: 0-2% (缓慢起步)
        while current_x < initial_x:
            x_track.append(current_x)
            y_track.append(pointY)
            t_track.append(current_t)
            current_x += int(random.uniform(1, 4))
            current_t += int(random.uniform(10, 30))
        
        # 第二阶段: 2%-55% (加速)
        while current_x < front_x:
            x_track.append(current_x)
            y_track.append(pointY)
            t_track.append(current_t)
            current_x += int(random.uniform(4, 8))
            current_t += int(random.uniform(7, 11))
        
        # 第三阶段: 55%-95% (减速)
        while current_x < middle_x:
            x_track.append(current_x)
            y_track.append(pointY)
            t_track.append(current_t)
            current_x += int(random.uniform(1.6, 5))
            current_t += int(random.uniform(7, 12))
        
        # 第四阶段: 95%-100% (微调)
        while current_x < back_x:
            x_track.append(current_x)
            y_track.append(pointY)
            t_track.append(current_t)
            current_x += int(random.uniform(0.7, 2))
            current_t += int(random.uniform(10, 30))
        
        x_track.append(back_x)
        y_track.append(pointY)
        t_track.append(current_t)
        
        return [{"x": x_track[i], "y": y_track[i], "time": t_track[i]} for i in range(len(x_track))]
    
    def verify(self, distance: int, tracks: List[Dict[str, Any]]) -> Tuple[bool, str]:
        """提交验证"""
        if not self.captcha_data:
            return False, "请先获取验证码"
        
        try:
            # 使用JS加密
            encrypt_data = self.js_ctx.call(
                "get_data",
                self.captcha_data['clientIp'],
                self.captcha_data['checkId'],
                self.captcha_data['key'],
                tracks,
                self.captcha_data['uuid']
            )
            
            # 提交验证
            url = f"https://acs.fcbox.com/captcha/checkCode/{self.captcha_data['uuid']}"
            resp = self.session.post(url, data=encrypt_data)
            result = resp.json()
            
            if result.get('success'):
                return True, result.get('data', {}).get('token', '')
            else:
                return False, result.get('msg', '验证失败')
        except Exception as e:
            return False, str(e)
    
    def solve(self, max_retries: int = 3) -> Tuple[bool, str]:
        """解决滑块验证码"""
        for attempt in range(max_retries):
            print(f"\n--- 尝试 {attempt + 1}/{max_retries} ---")
            
            # 1. 获取验证码
            captcha = self.get_captcha()
            if not captcha:
                print("获取验证码失败")
                continue
            
            print(f"pointX={captcha['pointX']}, pointY={captcha['pointY']}")
            
            # 2. 云打码识别
            distance = self.recognize_gap_by_api()
            if distance is None:
                print("识别失败")
                continue
            
            # 判断识别是否合理
            if distance < 100:
                print(f"识别异常(距离过小: {distance})，跳过")
                continue
            
            print(f"识别距离: {distance}")
            
            # 3. 生成轨迹
            tracks = self.generate_track(distance, captcha['pointX'], captcha['pointY'])
            print(f"轨迹点数: {len(tracks)}")
            
            # 4. 验证
            success, token = self.verify(distance, tracks)
            
            if success:
                print(f"验证成功! token: {token[:20]}...")
                return True, token
            else:
                print(f"验证失败: {token}")
        
        return False, ""


def test_success_rate(times: int = 10) -> Tuple[int, int]:
    """测试成功率"""
    solver = FcboxSliderSolver()
    success = 0
    
    for i in range(times):
        print(f"\n{'='*50}")
        print(f"测试 {i+1}/{times}")
        print('='*50)
        
        ok, _ = solver.solve(max_retries=2)
        if ok:
            success += 1
            print(f"✓ 成功! 成功率: {success}/{i+1}")
        else:
            print(f"✗ 失败! 成功率: {success}/{i+1}")
        
        time.sleep(1.5)
    
    print(f"\n{'='*50}")
    print(f"最终结果: {success}/{times} 成功 ({success/times*100:.0f}%)")
    print('='*50)
    
    return success, times


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="丰巢滑块验证码解决器")
    parser.add_argument("--test", action="store_true", help="测试模式")
    parser.add_argument("--times", type=int, default=10, help="测试次数")
    
    args = parser.parse_args()
    
    if args.test:
        test_success_rate(args.times)
    else:
        print("运行测试...")
        test_success_rate(10)

"""
云码滑块验证码双图识别模块
使用云码API识别滑块缺口位置
"""
import requests
import base64
import json
import time


class YunmaSolver:
    """云码验证码识别"""
    
    def __init__(self, token):
        """
        初始化云码识别器
        :param token: 云码API token
        """
        self.token = token
        self.api_url = "http://api.jfbym.com/api/YmServer/customApi"
        self.type_code = 20111  # 双图滑块识别类型 (返回像素距离px)
        
    def recognize(self, bg_url, slider_url):
        """
        识别滑块缺口位置
        :param bg_url: 背景图URL
        :param slider_url: 滑块图URL
        :return: 缺口距离(像素)
        """
        try:
            # 下载图片
            bg_data = self._download_image(bg_url)
            slider_data = self._download_image(slider_url)
            
            if not bg_data or not slider_data:
                print("[云码] 图片下载失败")
                return None
            
            # 转换为base64
            bg_b64 = base64.b64encode(bg_data).decode()
            slider_b64 = base64.b64encode(slider_data).decode()
            
            # 构造请求（type 20111双图滑块需要slide_image和background_image）
            payload = {
                "slide_image": slider_b64,
                "background_image": bg_b64,
                "token": self.token,
                "type": self.type_code
            }
            
            headers = {
                "Content-Type": "application/json"
            }
            
            # 发送请求
            print("[云码] 发送识别请求...")
            resp = requests.post(self.api_url, json=payload, headers=headers, timeout=10)
            
            if resp.status_code != 200:
                print(f"[云码] HTTP错误: {resp.status_code}")
                return None
            
            result = resp.json()
            print(f"[云码] 响应: {result}")
            
            # 解析结果
            if result.get("code") == 10000:
                data = result.get("data", {})
                
                # 云码20111返回格式: data.data 是字符串距离
                # {'code': 0, 'data': '240', 'time': 0.036...}
                if isinstance(data, dict):
                    inner_data = data.get('data')
                    
                    # inner_data可能是字符串(距离)或字典
                    if isinstance(inner_data, str):
                        # 直接是距离字符串
                        try:
                            distance = int(inner_data)
                            print(f"[云码] 识别成功，缺口距离: {distance}px")
                            return distance
                        except ValueError:
                            print(f"[云码] 返回数据无法转换为整数: {inner_data}")
                            return None
                    elif isinstance(inner_data, dict):
                        # 字典格式，尝试多种字段名
                        distance = (
                            inner_data.get('x') or 
                            inner_data.get('distance') or 
                            inner_data.get('result')
                        )
                        if distance:
                            print(f"[云码] 识别成功，缺口距离: {distance}px")
                            return int(distance)
                    
                    # 如果data本身就是距离
                    distance = data.get('x') or data.get('distance') or data.get('result')
                    if distance:
                        print(f"[云码] 识别成功，缺口距离: {distance}px")
                        return int(distance)
                
                print(f"[云码] 返回数据: {data}")
                print(f"[云码] 无法解析距离")
                return None
            
            print(f"[云码] 识别失败: {result.get('msg', '未知错误')}")
            return None
            
        except Exception as e:
            print(f"[云码] 异常: {e}")
            return None
    
    def _download_image(self, url):
        """下载图片"""
        try:
            resp = requests.get(url, timeout=10)
            if resp.status_code == 200:
                return resp.content
            print(f"[云码] 图片下载失败: {url} - HTTP {resp.status_code}")
            return None
        except Exception as e:
            print(f"[云码] 图片下载异常: {e}")
            return None


# 测试
if __name__ == "__main__":
    # 测试token
    TOKEN = "7sSzl38PdnkMLN8jD1-2DMOlV9lGzJQWYrvdxLvA7UA"
    
    # 测试图片URL (从之前的请求中获取)
    bg_url = "https://p6-catpcha.byteimg.com/tos-cn-i-188rlo5p4y/226905d252a4401095f0745e0279c70b~tplv-188rlo5p4y-2.jpeg"
    slider_url = "https://p6-catpcha.byteimg.com/tos-cn-i-188rlo5p4y/1ec60a22c1ae4ad88ad0843551facef6~tplv-188rlo5p4y-1.png"
    
    solver = YunmaSolver(TOKEN)
    distance = solver.recognize(bg_url, slider_url)
    
    if distance:
        print(f"\n✓ 缺口距离: {distance}px")
    else:
        print("\n✗ 识别失败")

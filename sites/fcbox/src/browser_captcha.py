"""
丰巢登录 - 浏览器辅助滑块验证模块

使用AdsPower浏览器自动化完成滑块验证，
然后用Python获取验证token完成后续登录

这种方法可以绕过复杂的缺口检测算法，直接获取有效的验证token
"""

import json
import time
import base64
from typing import Dict, Any, Tuple, Optional
from io import BytesIO

import requests
import cv2
import numpy as np

try:
    from QoderMCP import CallMcpTool
    _has_mcp = True
except ImportError:
    _has_mcp = False


class BrowserCaptchaSolver:
    """使用浏览器自动化解决滑块验证码"""
    
    PROFILE_ID = "k1bhfp97"
    
    def __init__(self):
        self.ws_url = None
        self.browser_active = False
        
    def _call_adspower(self, tool_name: str, arguments: Dict) -> Any:
        """调用AdsPower MCP工具"""
        if not _has_mcp:
            return {"status": "error", "message": "MCP not available"}
        try:
            result = CallMcpTool(
                server_name="adspower-local-api",
                tool_name=tool_name,
                arguments=arguments
            )
            return result
        except Exception as e:
            print(f"AdsPower调用失败: {e}")
            return {"status": "error", "message": str(e)}
    
    def open_browser(self) -> bool:
        """打开浏览器"""
        result = self._call_adspower("open-browser", {"profileId": self.PROFILE_ID})
        
        if result and result.get("code") == 0 or "browser_id" in str(result):
            # 提取WebSocket URL
            ws_str = str(result)
            if "ws://" in ws_str:
                start = ws_str.find("ws://")
                end = ws_str.find('"', start)
                if end == -1:
                    end = ws_str.find("'", start)
                self.ws_url = ws_str[start:end]
                
                # 连接浏览器
                connect_result = self._call_adspower("connect-browser-with-ws", {
                    "wsUrl": self.ws_url
                })
                self.browser_active = True
                return True
        
        return False
    
    def close_browser(self):
        """关闭浏览器"""
        if self.browser_active:
            self._call_adspower("close-browser", {"profileId": self.PROFILE_ID})
            self.browser_active = False
    
    def solve_captcha(self, max_wait: int = 60) -> Tuple[bool, str]:
        """
        在浏览器中解决滑块验证码
        
        Returns:
            (是否成功, token或错误信息)
        """
        if not self.browser_active:
            if not self.open_browser():
                return False, "无法打开浏览器"
        
        try:
            # 导航到登录页面
            nav_result = self._call_adspower("navigate", {
                "url": "https://fcbox.com/pages/user/login.html"
            })
            
            if nav_result.get("status") != "success":
                return False, f"导航失败: {nav_result}"
            
            # 等待页面加载
            time.sleep(2)
            
            # 填写表单
            self._call_adspower("fill-input", {
                "selector": 'input[name="username"]',
                "text": "test_user"
            })
            self._call_adspower("fill-input", {
                "selector": 'input[name="password"]',
                "text": "test_pass"
            })
            
            # 点击登录按钮触发验证码
            self._call_adspower("click-element", {
                "selector": ".login-btn"
            })
            
            # 等待验证码出现
            time.sleep(3)
            
            # 获取验证码token
            # 方法1: 等待并获取Vue实例中的token
            for attempt in range(max_wait // 2):
                script = """
                (function() {
                    // 检查Vue实例中的验证码状态
                    var app = document.querySelector('#app');
                    if(app && app.__vue__) {
                        var vm = app.__vue__.$children[0];
                        if(vm && vm.validateToken) {
                            return {success: true, token: vm.validateToken};
                        }
                    }
                    // 检查滑块是否成功
                    var sliderSuccess = document.querySelector('.slider-success');
                    if(sliderSuccess) {
                        return {success: true, message: 'slider completed'};
                    }
                    return {success: false};
                })()
                """
                
                eval_result = self._call_adspower("evaluate-script", {
                    "script": script
                })
                
                if eval_result and eval_result.get("status") == "success":
                    result_data = eval_result.get("data", {})
                    if result_data.get("success"):
                        return True, result_data.get("token", "completed")
                
                time.sleep(2)
            
            return False, "验证码超时"
            
        except Exception as e:
            return False, f"异常: {e}"
    
    def get_captcha_token_via_browser(self) -> Optional[str]:
        """
        通过浏览器获取验证码token
        
        Returns:
            token字符串或None
        """
        success, result = self.solve_captcha()
        
        if success:
            return result if result != "completed" else None
        
        return None


def test_browser_captcha():
    """测试浏览器辅助验证码"""
    solver = BrowserCaptchaSolver()
    
    print("打开浏览器...")
    if not solver.open_browser():
        print("无法打开浏览器")
        return False
    
    try:
        print("等待验证码解决...")
        success, result = solver.solve_captcha(max_wait=30)
        
        if success:
            print(f"验证码解决成功: {result}")
            return True
        else:
            print(f"验证码解决失败: {result}")
            return False
    finally:
        print("关闭浏览器...")
        solver.close_browser()


if __name__ == "__main__":
    test_browser_captcha()

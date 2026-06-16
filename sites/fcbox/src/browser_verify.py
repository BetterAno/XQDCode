"""
丰巢登录 - AdsPower浏览器辅助验证
使用浏览器自动化完成滑块验证，获取验证token
"""

import json
import time
import base64
from typing import Optional, Tuple

import requests

try:
    from QoderMCP import CallMcpTool
    _has_mcp = True
except ImportError:
    _has_mcp = False


class BrowserCaptchaSolver:
    """使用AdsPower浏览器自动化解决滑块验证码"""
    
    PROFILE_ID = "k1bhfp97"
    
    def __init__(self):
        self.ws_url = None
        self.browser_active = False
    
    def _call_adspower(self, tool_name: str, arguments: dict) -> dict:
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
        
        if result and ("browser_id" in str(result) or "ws://" in str(result)):
            # 提取WebSocket URL
            ws_str = str(result)
            if "ws://" in ws_str:
                start = ws_str.find("ws://")
                end = ws_str.find('"', start)
                if end == -1:
                    end = ws_str.find("'", start)
                self.ws_url = ws_str[start:end]
                
                # 连接浏览器
                self._call_adspower("connect-browser-with-ws", {"wsUrl": self.ws_url})
                self.browser_active = True
                return True
        
        return False
    
    def navigate(self, url: str) -> bool:
        """导航到URL"""
        result = self._call_adspower("navigate", {"profileId": self.PROFILE_ID, "url": url})
        return result and result.get("status") == "success"
    
    def get_page_text(self) -> str:
        """获取页面文本"""
        result = self._call_adspower("get-page-visible-text", {"profileId": self.PROFILE_ID})
        if result and isinstance(result, dict):
            return result.get("data", "")
        return str(result) if result else ""
    
    def evaluate_script(self, script: str) -> any:
        """执行JavaScript"""
        result = self._call_adspower("evaluate-script", {"profileId": self.PROFILE_ID, "script": script})
        if result and isinstance(result, dict):
            return result.get("data")
        return result
    
    def fill_input(self, selector: str, text: str) -> bool:
        """填写输入框"""
        script = f"""
        (function() {{
            var el = document.querySelector('{selector}');
            if(el) {{
                el.value = '{text}';
                el.dispatchEvent(new Event('input', {{bubbles: true}}));
                return true;
            }}
            return false;
        }})()
        """
        result = self.evaluate_script(script)
        return result == True or result == "true"
    
    def click_element(self, selector: str) -> bool:
        """点击元素"""
        script = f"""
        (function() {{
            var el = document.querySelector('{selector}');
            if(el) {{
                el.click();
                return true;
            }}
            return false;
        }})()
        """
        result = self.evaluate_script(script)
        return result == True or result == "true"
    
    def wait_for_captcha(self, timeout: int = 10) -> bool:
        """等待验证码出现"""
        for _ in range(timeout * 2):
            text = self.get_page_text()
            if "验证码" in text or "滑动" in text:
                return True
            time.sleep(0.5)
        return False
    
    def solve_and_get_token(self) -> Tuple[bool, str]:
        """
        在浏览器中完成滑块验证并获取token
        
        Returns:
            (是否成功, token或错误信息)
        """
        try:
            # 1. 打开浏览器
            print("打开浏览器...")
            if not self.open_browser():
                return False, "无法打开浏览器"
            
            # 2. 导航到登录页面
            print("导航到登录页面...")
            if not self.navigate("https://fcbox.com/pages/user/login.html"):
                return False, "导航失败"
            
            time.sleep(2)
            
            # 3. 切换到会员登录
            print("切换到会员登录...")
            self.evaluate_script("""
                (function() {
                    var tabs = document.querySelectorAll('.tab-item');
                    for(var i = 0; i < tabs.length; i++) {
                        if(tabs[i].innerText && tabs[i].innerText.indexOf('会员') > -1) {
                            tabs[i].click();
                            return;
                        }
                    }
                })()
            """)
            time.sleep(1)
            
            # 4. 填写用户名密码
            print("填写用户名密码...")
            self.fill_input('input[name="username"]', 'test_user_123')
            self.fill_input('input[name="password"]', 'TestPass123')
            time.sleep(0.5)
            
            # 5. 点击登录按钮触发验证码
            print("点击登录按钮...")
            self.click_element('.login-btn')
            time.sleep(3)
            
            # 6. 等待验证码出现
            print("等待验证码...")
            if not self.wait_for_captcha(10):
                return False, "验证码未出现"
            
            # 7. 检查验证码状态
            # 尝试多次检测是否验证成功
            for attempt in range(30):
                captcha_data = self.evaluate_script("""
                    JSON.stringify({
                        captchaWrapper: !!document.querySelector('.fc-captcha-wrapper'),
                        captchaVisible: document.querySelector('.fc-captcha-wrapper') ? 
                            document.querySelector('.fc-captcha-wrapper').offsetParent !== null : false,
                        captchaData: window._captchaData
                    })
                """)
                
                print(f"验证码状态: {captcha_data}")
                time.sleep(1)
                
                # 检查是否验证成功（通过检查是否有成功标记）
                success_check = self.evaluate_script("""
                    (function() {
                        // 检查Vue实例
                        var app = document.querySelector('#app');
                        if(app && app.__vue__) {
                            var vm = app.__vue__.$children[0];
                            if(vm && vm.captchaToken) return {token: vm.captchaToken};
                        }
                        // 检查全局变量
                        if(window._captchaToken) return {token: window._captchaToken};
                        // 检查cookie
                        var cookies = document.cookie.split(';');
                        for(var i = 0; i < cookies.length; i++) {
                            if(cookies[i].indexOf('captcha_token') > -1) {
                                return {token: cookies[i].split('=')[1]};
                            }
                        }
                        return null;
                    })()
                """)
                
                if success_check and success_check.get('token'):
                    return True, success_check['token']
            
            return False, "验证超时"
            
        except Exception as e:
            return False, f"异常: {str(e)}"
    
    def close_browser(self):
        """关闭浏览器"""
        if self.browser_active:
            self._call_adspower("close-browser", {"profileId": self.PROFILE_ID})
            self.browser_active = False


def main():
    solver = BrowserCaptchaSolver()
    
    success, result = solver.solve_and_get_token()
    
    if success:
        print(f"验证成功! Token: {result}")
    else:
        print(f"验证失败: {result}")
    
    solver.close_browser()


if __name__ == "__main__":
    main()

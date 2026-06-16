"""
Verify5 HTTP 会话管理

使用 requests.Session 保持 Cookie 一致性
动态构造请求 Headers
"""

import requests
import random
import time
from typing import Dict, Optional


DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "max-age=0",
    "Connection": "keep-alive",
    "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
}


class Verify5Session:
    """
    Verify5 会话管理器
    
    Features:
    - requests.Session 自动 Cookie 管理
    - 动态 Headers 构造
    - Referer/Origin 自动设置
    - 重试和超时处理
    """
    
    def __init__(self, config: Optional[Dict] = None):
        self.session = requests.Session()
        self.base_url = "https://www.verify5.com"
        self.last_url = self.base_url + "/demo"
        
        # 设置基础 headers
        self.session.headers.update(DEFAULT_HEADERS)
        
        # 应用自定义配置
        if config:
            self._apply_config(config)
    
    def _apply_config(self, config: Dict):
        """应用配置文件"""
        headers = config.get("headers", {})
        if headers:
            self.session.headers.update(headers)
        
        if "proxies" in config:
            self.session.proxies = config["proxies"]
        
        if "timeout" in config:
            self.session.timeout = config["timeout"]
    
    def _build_headers(self, url: str, referer: str = None) -> Dict:
        """动态构造请求 Headers"""
        headers = {}
        
        if referer:
            headers["Referer"] = referer
        
        # 图片请求特殊处理
        if any(ext in url.lower() for ext in ['.jpg', '.png', '.jpeg', '.webp']):
            headers.update({
                "Accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "Sec-Fetch-Dest": "image",
                "Sec-Fetch-Mode": "no-cors",
                "Sec-Fetch-Site": "cross-site",
            })
        else:
            headers.update({
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
            })
        
        return headers
    
    def get(self, url: str, referer: str = None, **kwargs) -> requests.Response:
        """GET 请求"""
        headers = self._build_headers(url, referer)
        kwargs.setdefault("timeout", 15)
        kwargs["headers"] = {**self.session.headers, **headers, **kwargs.get("headers", {})}
        
        resp = self.session.get(url, **kwargs)
        self.last_url = url
        return resp
    
    def post(self, url: str, data=None, json=None, referer: str = None, **kwargs) -> requests.Response:
        """POST 请求"""
        headers = self._build_headers(url, referer)
        headers["Content-Type"] = kwargs.pop("content_type", "application/json")
        kwargs.setdefault("timeout", 15)
        kwargs["headers"] = {**self.session.headers, **headers, **kwargs.get("headers", {})}
        
        if json is not None:
            resp = self.session.post(url, json=json, **kwargs)
        else:
            resp = self.session.post(url, data=data, **kwargs)
        
        self.last_url = url
        return resp
    
    def download_image(self, url: str, save_path: str = None, referer: str = None) -> bytes:
        """下载图片"""
        resp = self.get(url, referer=referer, stream=True)
        
        content = resp.content
        
        if save_path:
            with open(save_path, 'wb') as f:
                f.write(content)
        
        return content
    
    def get_cookies(self) -> Dict:
        """获取当前 Cookies"""
        return dict(self.session.cookies.get_dict())
    
    def set_cookies(self, cookies: Dict):
        """设置 Cookies"""
        for key, value in cookies.items():
            self.session.cookies.set(key, value)
    
    def reset(self):
        """重置会话"""
        self.session.cookies.clear()
        self.session.headers.update(DEFAULT_HEADERS)
        self.last_url = self.base_url + "/demo"


if __name__ == "__main__":
    s = Verify5Session()
    resp = s.get("https://www.verify5.com/demo")
    print(f"Status: {resp.status_code}")
    print(f"Cookies: {s.get_cookies()}")

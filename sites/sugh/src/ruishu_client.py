"""
瑞数6 Cookie 纯协议请求模块
通过 Node.js 补环境生成 cookie，Python 端使用 requests 发起请求
"""

import subprocess
import json
import re
import requests
from typing import Optional, Dict, Tuple


# 瑞数6 Cookie 求解器 Node.js 路径（相对于 sugh 站点根目录）
SOLVER_PATH = r"node\rs_solver_v3.js"

# 目标 URL
TARGET_URL = "https://sugh.szu.edu.cn/Html/News/Columns/7/Index.html"

# User-Agent (必须与 Node.js 端一致)
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"


def get_ruishu_cookies(target_url: str = TARGET_URL, timeout: int = 30) -> Optional[Dict[str, str]]:
    """
    调用 Node.js 瑞数6 Cookie 求解器获取完整 cookie
    
    Args:
        target_url: 目标页面 URL
        timeout: 超时时间（秒）
    
    Returns:
        dict: 包含所有 cookie 的字典，或 None 如果失败
    """
    import os
    # 求解器在 sugh 站点根目录下的 node/ 子目录中
    # 当前文件在 sugh/src/ 下，所以需要上一级
    solver_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    solver_path = os.path.join(solver_dir, SOLVER_PATH)
    
    if not os.path.exists(solver_path):
        print(f"[!] Solver not found: {solver_path}")
        return None
    
    try:
        result = subprocess.run(
            ["node", solver_path],
            capture_output=True,
            timeout=timeout,
            cwd=solver_dir,
            encoding='utf-8',
            errors='replace',  # 替换无法解码的字节
        )
        
        if result.returncode != 0:
            print(f"[!] Solver failed with code {result.returncode}")
            if result.stderr:
                # 只打印最后几行错误
                lines = result.stderr.strip().split('\n')
                for line in lines[-5:]:
                    print(f"    {line}")
            return None
        
        # stdout 输出 JSON 格式的结果
        stdout = result.stdout.strip()
        if not stdout:
            print("[!] Solver produced no output")
            return None
        
        data = json.loads(stdout)
        return data.get("allCookies")
        
    except subprocess.TimeoutExpired:
        print(f"[!] Solver timed out after {timeout}s")
        return None
    except json.JSONDecodeError as e:
        print(f"[!] Failed to parse solver output: {e}")
        return None
    except Exception as e:
        print(f"[!] Error running solver: {e}")
        return None


def make_request(
    url: str = TARGET_URL,
    cookies: Optional[Dict[str, str]] = None,
    headers: Optional[Dict[str, str]] = None,
    max_retries: int = 3,
) -> Tuple[Optional[requests.Response], Dict[str, str]]:
    """
    使用瑞数6 cookie 发起请求
    
    Args:
        url: 请求 URL
        cookies: 已有的 cookie（如果为 None，会自动求解）
        headers: 额外的请求头
        max_retries: 最大重试次数
    
    Returns:
        tuple: (response, cookies) 或 (None, {}) 如果失败
    """
    all_cookies = cookies or {}
    
    for attempt in range(max_retries):
        if not all_cookies:
            print(f"[*] Attempt {attempt + 1}: Getting ruishu cookies...")
            all_cookies = get_ruishu_cookies(url)
            if not all_cookies:
                print(f"[!] Failed to get cookies, retrying...")
                continue
        
        req_headers = {
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
        }
        if headers:
            req_headers.update(headers)
        
        try:
            session = requests.Session()
            session.verify = False  # 跳过 SSL 验证
            resp = session.get(url, headers=req_headers, cookies=all_cookies, timeout=15)
            
            if resp.status_code == 200:
                print(f"[+] Success! Status 200, content length: {len(resp.text)}")
                return resp, all_cookies
            elif resp.status_code == 412:
                print(f"[-] Got 412, cookies may be expired. Refreshing...")
                all_cookies = {}  # 清空 cookie，重新获取
            else:
                print(f"[-] Got status {resp.status_code}")
                # 如果是 400，可能是环境补全不够，重试
                if resp.status_code == 400:
                    all_cookies = {}  # 重新获取
                
        except requests.RequestException as e:
            print(f"[!] Request error: {e}")
    
    print(f"[!] All {max_retries} attempts failed")
    return None, {}


# ==================== 使用示例 ====================
if __name__ == "__main__":
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    print("=" * 60)
    print("瑞数6 Cookie 纯协议请求模块")
    print("=" * 60)
    
    # 方式1: 自动获取 cookie 并请求
    print("\n[*] 自动获取 cookie 并请求...")
    resp, cookies = make_request(TARGET_URL)
    
    if resp:
        print(f"\n[+] 页面标题:")
        title_match = re.search(r'<title>(.*?)</title>', resp.text)
        if title_match:
            print(f"    {title_match.group(1)}")
        print(f"[+] 页面长度: {len(resp.text)}")
        print(f"[+] Cookies: {list(cookies.keys())}")
    else:
        print("[-] 请求失败")
    
    # 方式2: 仅获取 cookie
    print("\n[*] 仅获取 cookie...")
    only_cookies = get_ruishu_cookies()
    if only_cookies:
        print(f"[+] Cookies: {json.dumps(only_cookies, indent=2, ensure_ascii=False)}")
        cookie_header = "; ".join(f"{k}={v}" for k, v in only_cookies.items())
        print(f"[+] Cookie header: {cookie_header[:200]}...")

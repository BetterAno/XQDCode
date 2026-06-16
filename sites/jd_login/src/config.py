"""
京东登录配置
"""
import os

# 项目根目录
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Node.js 脚本路径
NODE_DIR = os.path.join(BASE_DIR, 'node')
PWD_ENCRYPT_JS = os.path.join(NODE_DIR, 'pwd_encrypt.js')

# 京东登录相关 URL
LOGIN_PAGE = 'https://passport.jd.com/new/login.aspx'
PUBLIC_KEY_API = 'https://passport.jd.com/publicKey/init'
LOGIN_SUBMIT_API = 'https://passport.jd.com/uc/loginService'

# User-Agent
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'

# 默认 Headers
DEFAULT_HEADERS = {
    'User-Agent': UA,
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': 'https://passport.jd.com/new/login.aspx',
}

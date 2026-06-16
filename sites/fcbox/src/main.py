"""
Fcbox Login - 主程序入口
完整登录流程: 验证码识别 → 轨迹生成 → AES加密 → RSA加密 → 登录

用法:
    python main.py <username> <password>
    python main.py <username> <password> --yunma-token <token>
"""

import sys
import json
import os

# 将项目根目录加入 sys.path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(PROJECT_ROOT, 'src'))

from captcha import FcboxCaptchaSolver
from login import FcboxLogin


def load_config():
    """加载配置文件"""
    config_path = os.path.join(PROJECT_ROOT, 'config', 'config.json')
    with open(config_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def main():
    config = load_config()
    yunma_token = config['yunma']['token']
    
    if len(sys.argv) < 3:
        print("用法: python main.py <手机号> <密码> [--yunma-token <token>]")
        sys.exit(1)
    
    username = sys.argv[1]
    password = sys.argv[2]
    
    # 命令行参数可覆盖配置文件的 yunma token
    if '--yunma-token' in sys.argv:
        idx = sys.argv.index('--yunma-token')
        yunma_token = sys.argv[idx + 1]
    
    client = FcboxLogin(username, password, yunma_token=yunma_token)
    result = client.login()
    print(f"登录结果: {result}")


if __name__ == "__main__":
    main()

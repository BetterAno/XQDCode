"""
使用浏览器提取的真实参数测试captcha/get请求
"""
import requests
import time
import json

# 从浏览器监控事件提取的真实参数
REAL_FP = "verify_mozrjhih_2d52990c_b49f_038f_4168_46b2b64847fb"
REAL_DETAIL = "5XE3C4ovnUQL3Ln09g9xakF2yMU7VoB0DzfZsCKCa*UFqUkPsbr2ECI9nGMxfT*jxH0i13DhwLRT4XxYg6tq9FOSpPYQ1-3WXuhmPZQ6WLjWp5uVK9Chc0bcEWunIENRDdtnHhJgcA9Db*u1*Lxm-gaWMI7DjyDH4QVQmR5kyF12Vpb1OgAb-F690z7f6oCL*RulMA8MnyvFdh-Tz6qQ6OGStetbtYiTX0YVXLOcfiRAHzDC7hVotwvw*jnj1yCmKAlybyRsM5ewo4tG"

# 从mssdk请求提取的msToken
REAL_MSTOKEN = "jC1K3mAygA4Ax0ZqBkS13XrUhrlWq4vU8_VszgfZzkWjdz7PmoUH0mJjgbl8XGpgjEI86qoif2aapCDuuD1yBGO6LRfqK5RvCeUJchrgCjYI9ctnwimIdqeQKtTIIQsPqM9rG0l71K6bWB9mknGNuBq05XRDAa4mw5elBtQh3VX1EcYg8q2lHo0%3D"

# 从监控事件提取的a_bogus
REAL_ABOGUS = "xXURgeyJEpQbe3KcYcc79anljqIArBWyZNTxYEl5SFOvahzPx1-xuBcdcxwL48dWCupRiFVHfnU%2FYxxcYnGs1erkumpvSZsbbTQVVS6o8ZNkGBkh3HDTCJbxFksx0C4TK%2FcyipiXA0FyIL53hrnKA-3aS5Fc5QmDWqqyd%2Fsbn9WxdWjHnndJedtA1hf%3D"

# 测试1: captcha/get
print("=" * 60)
print("测试1: captcha/get请求")
print("=" * 60)

url = "https://verify.zijieapi.com/captcha/get"
params = {
    'aid': 4272,
    'lang': 'zh',
    'repoId': 590050,
    'bd_version': '1.0.0.759',
    'subtype': 'slide',
    'detail': REAL_DETAIL,
    'server_sdk_env': '{"idc":"lf","region":"CN","server_type":"passport"}',
    'mode': 'slide',
    'fp': REAL_FP,
    'h5_check_version': '4.0.13',
    'os_name': 'windows',
    'platform': 'pc',
    'os_type': '2',
    'h5_sdk_version': '3.5.77',
    'webdriver': 'false',
    'tmp': str(int(time.time() * 1000)),
    'msToken': REAL_MSTOKEN,
    'a_bogus': REAL_ABOGUS
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
    'Referer': 'https://rmc.bytedance.com/',
    'Origin': 'https://rmc.bytedance.com'
}

print("请求参数:")
for k, v in params.items():
    val_str = str(v)
    if len(val_str) > 100:
        val_str = val_str[:100] + "..."
    print(f"  {k}: {val_str}")

try:
    resp = requests.get(url, params=params, headers=headers, timeout=15)
    print(f"\n响应状态: {resp.status_code}")
    print(f"响应内容: {resp.text[:2000]}")
    
    if resp.status_code == 200:
        data = resp.json()
        if data.get('code') == 200:
            captcha_data = data.get('data', {})
            print(f"\n✓ 验证码获取成功!")
            print(f"  captcha_id: {captcha_data.get('id')}")
            print(f"  question: {json.dumps(captcha_data.get('question', {}), indent=2)[:500]}")
        else:
            print(f"\n✗ 错误: code={data.get('code')}, message={data.get('message')}")
    else:
        print(f"\n✗ HTTP错误: {resp.status_code}")
except Exception as e:
    print(f"\n✗ 异常: {e}")

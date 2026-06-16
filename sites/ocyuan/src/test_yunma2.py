"""
用最新的涂鸦验证码图片测试云码10115类型
"""
import json
import urllib.request
import base64

TOKEN = 'tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI'

# 最新的图片URL（from getQuestion_126）
STATIC = 'https://images.tuyacn.com/'
BG_PATH = 'yrule/images/bg/260/160/eYuq4H7wHNNOLjnHF83DUdzmfWsmIQef.webp'
SL_PATH = 'yrule/images/slice/260/160/eYuq4H7wHNNOLjnHF83DUdzmfWsmIQef.png'

bg_url = STATIC + BG_PATH
sl_url = STATIC + SL_PATH

print(f"下载最新图片...")
print(f"  BG: {bg_url}")
print(f"  SL: {sl_url}")

bg_data = urllib.request.urlopen(bg_url, timeout=10).read()
sl_data = urllib.request.urlopen(sl_url, timeout=10).read()
bg_b64 = base64.b64encode(bg_data).decode()
sl_b64 = base64.b64encode(sl_data).decode()
print(f"  bg={len(bg_data)}bytes, sl={len(sl_data)}bytes")

def call_api(payload):
    req = urllib.request.Request(
        'http://api.jfbym.com/api/YmServer/customApi',
        data=json.dumps(payload).encode(),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    return json.loads(urllib.request.urlopen(req, timeout=30).read())

print("\n=== type=10115 (滑块缺口) ===")

# 官方推荐用法：image=背景图
r = call_api({'token': TOKEN, 'type': '10115', 'image': bg_b64, 'image_small': sl_b64})
print(f"  image+image_small: {json.dumps(r, ensure_ascii=False)[:300]}")

r2 = call_api({'token': TOKEN, 'type': '10115', 'image': bg_b64})
print(f"  只image: {json.dumps(r2, ensure_ascii=False)[:300]}")

# 10103也可能支持滑块
print("\n=== type=10103 (通用打码) ===")
r3 = call_api({'token': TOKEN, 'type': '10103', 'image': bg_b64, 'image_small': sl_b64})
print(f"  image+image_small: {json.dumps(r3, ensure_ascii=False)[:300]}")

# 尝试滑块专用格式
print("\n=== 其他可能类型 ===")
for tp in ['10116', '10117', '10118', '10119', '10120', '10150', '10200']:
    try:
        r = call_api({'token': TOKEN, 'type': tp, 'image': bg_b64, 'image_small': sl_b64})
        code = r.get('code')
        msg = r.get('msg', '')
        data = r.get('data', {})
        print(f"  type={tp}: code={code}, msg={msg}, data={str(data)[:100]}")
    except Exception as e:
        print(f"  type={tp}: ERROR={e}")

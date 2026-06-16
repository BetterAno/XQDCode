"""
测试云码API支持的滑块类型
"""
import json
import urllib.request
import base64

TOKEN = 'tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI'

# 使用之前捕获的图片URL
bg_url = 'https://images.tuyacn.com/yrule/images/bg/260/160/y01TrfyHAW8sJFwdezE6qkbKSH0RdO77.webp'
sl_url = 'https://images.tuyacn.com/yrule/images/slice/260/160/y01TrfyHAW8sJFwdezE6qkbKSH0RdO77.png'

print("下载图片...")
bg_data = urllib.request.urlopen(bg_url, timeout=10).read()
sl_data = urllib.request.urlopen(sl_url, timeout=10).read()
bg_b64 = base64.b64encode(bg_data).decode()
sl_b64 = base64.b64encode(sl_data).decode()
print(f'bg size: {len(bg_data)}, sl size: {len(sl_data)}')

def post_api(payload):
    req = urllib.request.Request(
        'http://api.jfbym.com/api/YmServer/customApi',
        data=json.dumps(payload).encode(),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    return json.loads(urllib.request.urlopen(req, timeout=20).read())

def test_type(tp, extra_params):
    try:
        payload = {'token': TOKEN, 'type': tp}
        payload.update(extra_params)
        resp = post_api(payload)
        code = resp.get('code')
        msg = resp.get('msg', '')
        data = resp.get('data', '')
        inner_data = data.get('data', '') if isinstance(data, dict) else data
        print(f'  type={tp}: code={code}, msg={msg}, inner_data={str(inner_data)[:150]}')
        return resp
    except Exception as e:
        print(f'  type={tp}: ERROR={e}')
        return None

# 云码滑块缺口识别常用类型：
# 9102 - 滑块缺口（大图+小图）
# 3004 - 滑块识别  
# 10115 - 滑块缺口位置
# 33 - 拼图滑块

print("\n=== 测试滑块类型（image+image_small）===")
for tp in ['9102', '9103', '10115', '33', '2005', '5000', '5002', '10110']:
    test_type(tp, {'image': bg_b64, 'image_small': sl_b64})

print("\n=== 测试滑块类型（image_big+image_small）===")
for tp in ['9102', '9103', '10115', '33', '3004']:
    test_type(tp, {'image_big': bg_b64, 'image_small': sl_b64})

print("\n=== 测试仅image（背景图）===")
for tp in ['9102', '10115']:
    test_type(tp, {'image': bg_b64})

print("\n=== 查询账户余额 ===")
try:
    # 尝试不同余额接口
    for balance_url in [
        'http://api.jfbym.com/api/YmServer/getToken',
        'http://api.jfbym.com/api/YmServer/score',
        'http://api.jfbym.com/api/YmServer/balance',
    ]:
        try:
            req = urllib.request.Request(
                balance_url,
                data=json.dumps({'token': TOKEN}).encode(),
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            resp = json.loads(urllib.request.urlopen(req, timeout=5).read())
            print(f'  {balance_url.split("/")[-1]}: {json.dumps(resp, ensure_ascii=False)[:200]}')
        except Exception as e2:
            print(f'  {balance_url.split("/")[-1]}: {e2}')
except Exception as e:
    print(f'  余额查询失败: {e}')

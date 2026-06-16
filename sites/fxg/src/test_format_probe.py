"""
测试不同的captchaBody格式
使用真实参数，尝试多种编码方案
"""
import requests
import time
import json
import base64
import hashlib
import struct

REAL_FP = "verify_mozrjhih_2d52990c_b49f_038f_4168_46b2b64847fb"
REAL_DETAIL = "5XE3C4ovnUQL3Ln09g9xakF2yMU7VoB0DzfZsCKCa*UFqUkPsbr2ECI9nGMxfT*jxH0i13DhwLRT4XxYg6tq9FOSpPYQ1-3WXuhmPZQ6WLjWp5uVK9Chc0bcEWunIENRDdtnHhJgcA9Db*u1*Lxm-gaWMI7DjyDH4QVQmR5kyF12Vpb1OgAb-F690z7f6oCL*RulMA8MnyvFdh-Tz6qQ6OGStetbtYiTX0YVXLOcfiRAHzDC7hVotwvw*jnj1yCmKAlybyRsM5ewo4tG"
REAL_MSTOKEN = "jC1K3mAygA4Ax0ZqBkS13XrUhrlWq4vU8_VszgfZzkWjdz7PmoUH0mJjgbl8XGpgjEI86qoif2aapCDuuD1yBGO6LRfqK5RvCeUJchrgCjYI9ctnwimIdqeQKtTIIQsPqM9rG0l71K6bWB9mknGNuBq05XRDAa4mw5elBtQh3VX1EcYg8q2lHo0%3D"
REAL_ABOGUS = "xXURgeyJEpQbe3KcYcc79anljqIArBWyZNTxYEl5SFOvahzPx1-xuBcdcxwL48dWCupRiFVHfnU%2FYxxcYnGs1erkumpvSZsbbTQVVS6o8ZNkGBkh3HDTCJbxFksx0C4TK%2FcyipiXA0FyIL53hrnKA-3aS5Fc5QmDWqqyd%2Fsbn9WxdWjHnndJedtA1hf%3D"

SESSION_ID = "a1c96f1361ec6fb987e2d133260a9014dbb057f0"
TIP_Y = 51

def get_base_params():
    return {
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

def test_format(name, captcha_body):
    """测试一种captchaBody格式"""
    params = get_base_params()
    headers = {
        'Content-Type': 'text/plain;charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://rmc.bytedance.com/',
        'Origin': 'https://rmc.bytedance.com'
    }
    
    body = json.dumps({'captchaBody': captcha_body})
    
    try:
        resp = requests.post(
            'https://verify.zijieapi.com/captcha/verify',
            params=params,
            data=body,
            headers=headers,
            timeout=10
        )
        data = resp.json() if resp.status_code == 200 else {}
        code = data.get('code', resp.status_code)
        msg = data.get('message', '')[:80]
        print(f"  [{name}] code={code} msg={msg}")
        return code, msg
    except Exception as e:
        print(f"  [{name}] ERROR: {e}")
        return -1, str(e)

# 轨迹数据模板
def make_trajectory(drag_x):
    """生成简单的轨迹数据"""
    trajectory = []
    steps = 40
    for i in range(steps + 1):
        p = i / steps
        # 缓动
        if p < 0.1:
            eased = 2.5 * p * p
        elif p < 0.8:
            eased = 0.025 + 0.975 * (p - 0.1) / 0.7
        else:
            eased = 0.998 + 0.002 * (1 - (1 - (p - 0.8) / 0.2) ** 2)
        x = drag_x * eased
        trajectory.append({
            'x': round(x, 1),
            'y': 0,
            't': i * 17
        })
    return trajectory

print("=" * 60)
print("测试 captchaBody 格式")
print(f"session_id: {SESSION_ID}")
print("=" * 60)

drag_x = 196  # 模拟拖动距离
traj = make_trajectory(drag_x)

# 格式1: 纯轨迹JSON → Base64
body1 = base64.b64encode(json.dumps(traj).encode()).decode()
test_format("格式1: 轨迹JSON→Base64", body1)

# 格式2: 完整对象JSON → Base64
obj2 = {
    'sessionId': SESSION_ID,
    'trajectory': traj,
    'dragX': drag_x,
    'tipY': TIP_Y,
    'timestamp': int(time.time() * 1000)
}
body2 = base64.b64encode(json.dumps(obj2, separators=(',', ':')).encode()).decode()
test_format("格式2: 完整JSON→Base64", body2)

# 格式3: 轨迹字符串 → Base64
traj_str = '|'.join([f"{p['x']},{p['y']},{p['t']}" for p in traj])
body3 = base64.b64encode(traj_str.encode()).decode()
test_format("格式3: 轨迹字符串→Base64", body3)

# 格式4: 二进制打包 → Base64 (仿WASM可能的输出)
buf = bytearray()
buf.extend(struct.pack('<I', drag_x))  # drag distance
buf.extend(struct.pack('<I', TIP_Y))    # tip_y
buf.extend(struct.pack('<I', len(traj)))  # point count
for p in traj:
    buf.extend(struct.pack('<h', int(p['x'] * 10)))  # x * 10
    buf.extend(struct.pack('<b', 0))     # y
    buf.extend(struct.pack('<H', p['t']))  # time
body4 = base64.b64encode(bytes(buf)).decode()
test_format("格式4: 二进制打包→Base64", body4)

# 格式5: AES-GCM加密模拟 → Base64
# 使用SHA256生成密钥
key_data = (REAL_DETAIL + SESSION_ID).encode()
key = hashlib.sha256(key_data).digest()
# 模拟加密输出（实际是hash，不是加密）
enc_data = key[:16] + json.dumps(traj).encode()
body5 = base64.b64encode(enc_data).decode()
test_format("格式5: Hash+轨迹→Base64", body5)

# 格式6: 空captchaBody
test_format("格式6: 空字符串", "")

# 格式7: 只有sessionId
body7 = base64.b64encode(SESSION_ID.encode()).decode()
test_format("格式7: sessionId→Base64", body7)

# 格式8: URL-safe Base64 + 字节跳动字符替换
import urllib.parse
body8_raw = base64.b64encode(json.dumps(obj2, separators=(',', ':')).encode()).decode()
# 字节跳动: +→*, /→-, =→_
body8 = body8_raw.replace('+', '*').replace('/', '-').replace('=', '_')
test_format("格式8: JSON→Base64→字符替换", body8)

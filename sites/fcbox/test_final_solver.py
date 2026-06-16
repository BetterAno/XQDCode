"""Final stable solver: yunma_distance - 68 = actual drag distance"""
import json, base64, hashlib, time, random, uuid, requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

YUNMA_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"
BASE = "https://acs.fcbox.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "*/*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Origin": "https://www.fcbox.com",
    "Referer": "https://www.fcbox.com/",
}
SLIDE_OFFSET = 68  # slider width in pixels

def yunma_recognize(shade_content, slide_content):
    payload = {
        "slide_image": base64.b64encode(slide_content).decode('utf-8'),
        "background_image": base64.b64encode(shade_content).decode('utf-8'),
        "token": YUNMA_TOKEN,
        "type": "20111"
    }
    resp = requests.post("http://api.jfbym.com/api/YmServer/customApi", json=payload, timeout=30)
    result = resp.json()
    if result.get('code') == 10000 and result.get('data', {}).get('code') == 0:
        return int(result['data']['data'])
    return None

def submit_with_distance(uid, key, check_id, client_ip, point_y, distance):
    start_time = int(time.time() * 1000)
    track = []
    start_x = random.randint(3, 10)
    num_points = random.randint(25, 35)
    current_time = start_time
    for i in range(num_points):
        x = start_x + int((distance - start_x) * i / (num_points - 1))
        current_time += random.randint(8, 15)
        track.append({"x": x, "y": point_y, "time": current_time})
    track[-1]["x"] = distance
    
    track_str = ''.join([f"{t['x']}{t['y']}{t['time']}" for t in track])
    sign = hashlib.md5(f"{client_ip}{check_id}{uid}{track_str}".encode()).hexdigest()
    payload = {"sign": sign, "track": track}
    plaintext = json.dumps(payload, separators=(',', ':'))
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    encrypted = base64.b64encode(cipher.encrypt(pad(plaintext.encode('utf-8'), AES.block_size))).decode('utf-8')
    
    resp = requests.post(f"{BASE}/captcha/checkCode/{uid}", data=encrypted, headers={
        **HEADERS, "Content-Type": "text/plain"
    }, timeout=15)
    return resp.json()

def solve():
    """Single attempt: yunma_dist - 68 = drag_distance"""
    uid = str(uuid.uuid4())
    resp = requests.post(f"{BASE}/captcha/querySlideImage/{uid}", headers=HEADERS, timeout=15)
    data = resp.json()['data']
    check_id = data['checkId']
    key = data['key']
    client_ip = data.get('clientIp', '')
    point_y = data.get('pointY', 0)
    
    shade_resp = requests.get(data['shadeImageUrl'], timeout=15)
    slide_resp = requests.get(data['slideImageUrl'], timeout=15)
    
    yunma_dist = yunma_recognize(shade_resp.content, slide_resp.content)
    if not yunma_dist:
        return None, "yunma_failed"
    
    # Key fix: subtract slider width (68px)
    drag_dist = max(1, yunma_dist - SLIDE_OFFSET)
    
    result = submit_with_distance(uid, key, check_id, client_ip, point_y, drag_dist)
    
    return yunma_dist, result

# Run 10 tests
success_count = 0
yunma_fail = 0
fail_count = 0

for i in range(10):
    yunma_dist, result = solve()
    if yunma_dist is None:
        yunma_fail += 1
        print(f"[{i+1}/10] yunma failed")
    elif isinstance(result, dict) and result.get('success'):
        success_count += 1
        token = result.get('data', {}).get('token', '')
        drag = max(1, yunma_dist - SLIDE_OFFSET)
        print(f"[{i+1}/10] SUCCESS! yunma={yunma_dist}, drag={drag}, token={token[:20]}...")
    else:
        fail_count += 1
        drag = max(1, yunma_dist - SLIDE_OFFSET)
        code = result.get('code') if isinstance(result, dict) else 'unknown'
        print(f"[{i+1}/10] FAILED: yunma={yunma_dist}, drag={drag}, code={code}")
    time.sleep(0.3)

print(f"\n{'='*50}")
print(f"Results: {success_count} success / {fail_count} fail / {yunma_fail} yunma_fail / 10 total")
print(f"Success rate: {success_count/10*100:.0f}%")

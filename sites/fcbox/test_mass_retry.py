"""Mass retry with raw yunma distance - measure true success rate"""
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

def solve_once():
    uid = str(uuid.uuid4())
    try:
        resp = requests.post(f"{BASE}/captcha/querySlideImage/{uid}", headers=HEADERS, timeout=15)
        data = resp.json()['data']
    except Exception as e:
        return None, f"query_error: {e}"
    
    check_id = data['checkId']
    key = data['key']
    client_ip = data.get('clientIp', '')
    point_y = data.get('pointY', 0)
    
    try:
        shade_resp = requests.get(data['shadeImageUrl'], timeout=15)
        slide_resp = requests.get(data['slideImageUrl'], timeout=15)
    except Exception as e:
        return None, f"download_error: {e}"
    
    # Yunma
    payload = {
        "slide_image": base64.b64encode(slide_resp.content).decode('utf-8'),
        "background_image": base64.b64encode(shade_resp.content).decode('utf-8'),
        "token": YUNMA_TOKEN,
        "type": "20111"
    }
    try:
        yunma_resp = requests.post("http://api.jfbym.com/api/YmServer/customApi", json=payload, timeout=30)
        yunma_result = yunma_resp.json()
    except Exception as e:
        return None, f"yunma_error: {e}"
    
    if yunma_result.get('code') != 10000 or yunma_result.get('data', {}).get('code') != 0:
        return None, f"yunma_fail: {yunma_result}"
    
    distance = int(yunma_result['data']['data'])
    
    # Build track with monotonic time
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
    
    # Sign & encrypt
    track_str = ''.join([f"{t['x']}{t['y']}{t['time']}" for t in track])
    sign = hashlib.md5(f"{client_ip}{check_id}{uid}{track_str}".encode()).hexdigest()
    payload = {"sign": sign, "track": track}
    plaintext = json.dumps(payload, separators=(',', ':'))
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    encrypted = base64.b64encode(cipher.encrypt(pad(plaintext.encode('utf-8'), AES.block_size))).decode('utf-8')
    
    # Submit
    try:
        check_resp = requests.post(f"{BASE}/captcha/checkCode/{uid}", data=encrypted, headers={
            **HEADERS, "Content-Type": "text/plain"
        }, timeout=15)
        result = check_resp.json()
    except Exception as e:
        return distance, f"submit_error: {e}"
    
    return distance, result

# Run 30 attempts
stats = {"success": 0, "fail": 0, "error": 0}
distances = []

for i in range(30):
    dist, result = solve_once()
    
    if dist is None:
        stats["error"] += 1
        print(f"[{i+1:2d}/30] ERROR: {str(result)[:60]}")
    elif isinstance(result, dict) and result.get('success'):
        stats["success"] += 1
        token = result.get('data', {}).get('token', '')
        distances.append(dist)
        print(f"[{i+1:2d}/30] SUCCESS! dist={dist}, token={token[:16]}...")
    else:
        stats["fail"] += 1
        code = result.get('code') if isinstance(result, dict) else '?'
        distances.append(dist)
        print(f"[{i+1:2d}/30] FAIL dist={dist}, code={code}")
    
    time.sleep(0.3)

total = sum(stats.values())
print(f"\n{'='*50}")
print(f"Results: {stats['success']} success / {stats['fail']} fail / {stats['error']} error / {total} total")
if total > 0:
    print(f"Success rate: {stats['success']/total*100:.1f}%")
if distances:
    print(f"Distances: {distances}")

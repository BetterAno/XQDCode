"""Robust retry test: each attempt gets fresh session + yunma recognition"""
import json, base64, hashlib, time, random, uuid, requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

YUNMA_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"
BASE = "https://acs.fcbox.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "*/*",
    "Origin": "https://www.fcbox.com",
    "Referer": "https://www.fcbox.com/",
}

def generate_simple_track(distance, point_y):
    start_time = int(time.time() * 1000)
    track = []
    start_x = random.randint(3, 10)
    num_points = random.randint(25, 35)
    for i in range(num_points):
        x = start_x + int((distance - start_x) * i / (num_points - 1))
        t = start_time + random.randint(0, 3)
        track.append({"x": x, "y": point_y, "time": t})
    track[-1]["x"] = distance
    return track

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

def single_attempt():
    uid = str(uuid.uuid4())
    
    # querySlideImage
    resp = requests.post(f"{BASE}/captcha/querySlideImage/{uid}", headers=HEADERS, timeout=15)
    data = resp.json()['data']
    check_id = data['checkId']
    key = data['key']
    client_ip = data.get('clientIp', '')
    point_y = data.get('pointY', 0)
    
    # Download images
    shade_resp = requests.get(data['shadeImageUrl'], headers={"User-Agent": HEADERS["User-Agent"]}, timeout=15)
    slide_resp = requests.get(data['slideImageUrl'], headers={"User-Agent": HEADERS["User-Agent"]}, timeout=15)
    
    # Yunma
    distance = yunma_recognize(shade_resp.content, slide_resp.content)
    if not distance:
        return None, "yunma_failed"
    
    # Build & encrypt
    track = generate_simple_track(distance, point_y)
    track_str = ''.join([f'{t["x"]}{t["y"]}{t["time"]}' for t in track])
    sign = hashlib.md5(f"{client_ip}{check_id}{uid}{track_str}".encode()).hexdigest()
    payload = {"sign": sign, "track": track}
    plaintext = json.dumps(payload, separators=(',', ':'))
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    encrypted = base64.b64encode(cipher.encrypt(pad(plaintext.encode('utf-8'), AES.block_size))).decode('utf-8')
    
    # checkCode
    check_resp = requests.post(f"{BASE}/captcha/checkCode/{uid}", data=encrypted, headers={
        **HEADERS, "Content-Type": "text/plain"
    }, timeout=15)
    result = check_resp.json()
    return distance, result

# Run 10 attempts
success_count = 0
fail_count = 0
yunma_fail = 0
distances = []

for i in range(10):
    distance, result = single_attempt()
    if distance is None:
        yunma_fail += 1
        print(f"[{i+1}/10] yunma failed")
    elif isinstance(result, dict) and result.get('success'):
        success_count += 1
        token = result.get('data', {}).get('token', '')
        distances.append(distance)
        print(f"[{i+1}/10] SUCCESS! distance={distance}, token={token}")
    else:
        fail_count += 1
        code = result.get('code') if isinstance(result, dict) else 'unknown'
        distances.append(distance)
        print(f"[{i+1}/10] FAILED distance={distance}, code={code}")
    time.sleep(0.3)

print(f"\n{'='*50}")
print(f"Results: {success_count} success / {fail_count} wrong_distance / {yunma_fail} yunma_fail / 10 total")
print(f"Success rate: {success_count/10*100:.0f}%")
if distances:
    print(f"Distances: {distances}")

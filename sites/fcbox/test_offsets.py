"""Test yunma distance with various offsets - SAME session for recognition and submission"""
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

def ddddocr_recognize(shade_content, slide_content):
    try:
        import ddddocr
        det = ddddocr.slide_match(shade_content, slide_content, simple_target=True)
        if 'target' in det:
            return det['target'][0]
    except Exception as e:
        print(f"  ddddocr error: {e}")
    return None

def submit_with_distance(uid, key, check_id, client_ip, point_y, distance):
    """Submit checkCode with a specific distance"""
    # Generate track with monotonic time
    start_time = int(time.time() * 1000)
    track = []
    start_x = random.randint(3, 10)
    num_points = random.randint(25, 35)
    current_time = start_time
    for i in range(num_points):
        x = start_x + int((distance - start_x) * i / (num_points - 1))
        current_time += random.randint(8, 15)  # Monotonic!
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

# Main test: get one session, try multiple offsets around yunma distance
for attempt in range(5):
    print(f"\n{'='*60}")
    print(f"ATTEMPT {attempt+1}")
    print(f"{'='*60}")
    
    # Get session
    uid = str(uuid.uuid4())
    resp = requests.post(f"{BASE}/captcha/querySlideImage/{uid}", headers=HEADERS, timeout=15)
    data = resp.json()['data']
    check_id = data['checkId']
    key = data['key']
    client_ip = data.get('clientIp', '')
    point_y = data.get('pointY', 0)
    
    # Download images
    shade_resp = requests.get(data['shadeImageUrl'], timeout=15)
    slide_resp = requests.get(data['slideImageUrl'], timeout=15)
    
    # Recognize
    yunma_dist = yunma_recognize(shade_resp.content, slide_resp.content)
    ddddocr_dist = ddddocr_recognize(shade_resp.content, slide_resp.content)
    
    print(f"  pointY={point_y}, yunma={yunma_dist}, ddddocr={ddddocr_dist}")
    
    if not yunma_dist:
        print("  yunma failed")
        continue
    
    # Try various offsets with FRESH sessions (each session can only be used once)
    offsets_to_try = [0, -34, -68, 34, 68, -17, 17, -10, 10]
    
    for offset in offsets_to_try:
        dist = yunma_dist + offset
        if dist < 10 or dist > 330:
            continue
        
        # Need a fresh session for each attempt
        new_uid = str(uuid.uuid4())
        new_resp = requests.post(f"{BASE}/captcha/querySlideImage/{new_uid}", headers=HEADERS, timeout=15)
        new_data = new_resp.json()['data']
        new_point_y = new_data.get('pointY', 0)
        
        result = submit_with_distance(
            new_uid, new_data['key'], new_data['checkId'],
            new_data.get('clientIp', ''), new_point_y, dist
        )
        
        if result.get('success'):
            print(f"  *** SUCCESS at offset={offset}! distance={dist}, token={result.get('data', {}).get('token')} ***")
            break
        else:
            code = result.get('code')
            print(f"  offset={offset:+d} dist={dist}: FAIL (code={code})")
        
        time.sleep(0.3)
    else:
        print("  All offsets failed for this yunma distance")
    
    time.sleep(0.5)

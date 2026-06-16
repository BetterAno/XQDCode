"""Each session: fresh image + yunma recognition + both track formats"""
import sys, os, json, base64, hashlib, time, random, uuid, requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

YUNMA_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"

def generate_simple_track(distance, point_y):
    """Browser-like track: few points, near-zero time span"""
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

def generate_physics_track(distance, point_y):
    """Physics-based track with realistic time intervals"""
    track = []
    current = 0.0
    mid = distance * 3 / 4
    t = 0.2
    v = 0.0
    start_time = int(time.time() * 1000)
    current_time = start_time
    while current < distance:
        if current < mid:
            a = random.randint(2, 4)
        else:
            a = -random.randint(3, 5)
        v0 = v
        v = v0 + a * t
        move = v0 * t + 0.5 * a * t * t
        current += move
        current_time += random.randint(15, 35)
        track.append({"x": min(int(current), distance), "y": point_y, "time": current_time})
    if track and track[-1]["x"] != distance:
        current_time += random.randint(20, 50)
        track.append({"x": distance, "y": point_y, "time": current_time})
    return track

def yunma_recognize(shade_content, slide_content):
    """Call yunma API"""
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

def submit_check(uid, key, check_id, client_ip, point_y, distance, track):
    track_str = ''.join([f'{t["x"]}{t["y"]}{t["time"]}' for t in track])
    sign_raw = f"{client_ip}{check_id}{uid}{track_str}"
    sign = hashlib.md5(sign_raw.encode('utf-8')).hexdigest()
    payload = {"sign": sign, "track": track}
    plaintext = json.dumps(payload, separators=(',', ':'))
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    padded = pad(plaintext.encode('utf-8'), AES.block_size)
    encrypted = base64.b64encode(cipher.encrypt(padded)).decode('utf-8')
    url = f"https://acs.fcbox.com/captcha/checkCode/{uid}"
    resp = requests.post(url, data=encrypted, headers={
        "Content-Type": "text/plain",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Origin": "https://www.fcbox.com",
        "Referer": "https://www.fcbox.com/"
    }, timeout=15)
    return resp.json()

def run_test(track_type="simple"):
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Origin": "https://www.fcbox.com",
        "Referer": "https://www.fcbox.com/"
    })
    
    # Fresh session
    uid = str(uuid.uuid4())
    url = f"https://acs.fcbox.com/captcha/querySlideImage/{uid}"
    resp = session.post(url, timeout=15)
    data = resp.json()['data']
    
    check_id = data['checkId']
    key = data['key']
    client_ip = data.get('clientIp', '')
    point_y = data.get('pointY', 0)
    point_x = data.get('pointX', 0)
    shade_url = data.get('shadeImageUrl')
    slide_url = data.get('slideImageUrl')
    
    print(f"  uid={uid[:8]}..., pointX={point_x}, pointY={point_y}")
    
    # Download images
    shade_resp = session.get(shade_url, timeout=15)
    slide_resp = session.get(slide_url, timeout=15)
    
    # Yunma recognition
    distance = yunma_recognize(shade_resp.content, slide_resp.content)
    print(f"  yunma distance: {distance}")
    
    if not distance:
        print("  yunma failed")
        return False
    
    # Generate track
    if track_type == "simple":
        track = generate_simple_track(distance, point_y)
    else:
        track = generate_physics_track(distance, point_y)
    
    # Submit
    result = submit_check(uid, key, check_id, client_ip, point_y, distance, track)
    code = result.get('code')
    success = result.get('success')
    
    if success:
        print(f"  *** SUCCESS! *** Token: {result.get('data', {}).get('token')}")
        return True
    else:
        print(f"  FAILED: code={code}")
        return False

# Run 3 tests with each track type
for track_type in ["simple", "physics"]:
    print(f"\n{'='*50}")
    print(f"Track type: {track_type}")
    print(f"{'='*50}")
    for i in range(3):
        print(f"\n[Test {i+1}]")
        if run_test(track_type):
            break
        time.sleep(0.5)

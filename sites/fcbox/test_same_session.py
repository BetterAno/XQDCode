"""CRITICAL FIX: Test distance on THE SAME session by reusing uid+key with updated checkId"""
import json, base64, hashlib, time, random, uuid, requests, io, cv2, numpy as np
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from PIL import Image

YUNMA_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"
BASE = "https://acs.fcbox.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "*/*",
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

def opencv_recognize(shade_content, slide_content):
    shade_arr = np.frombuffer(shade_content, np.uint8)
    shade_cv = cv2.imdecode(shade_arr, cv2.IMREAD_COLOR)
    slide_arr = np.frombuffer(slide_content, np.uint8)
    slide_cv = cv2.imdecode(slide_arr, cv2.IMREAD_COLOR)
    if shade_cv is None or slide_cv is None:
        return None
    shade_gray = cv2.cvtColor(shade_cv, cv2.COLOR_BGR2GRAY)
    slide_gray = cv2.cvtColor(slide_cv, cv2.COLOR_BGR2GRAY)
    shade_edge = cv2.Canny(shade_gray, 50, 150)
    slide_edge = cv2.Canny(slide_gray, 50, 150)
    result = cv2.matchTemplate(shade_edge, slide_edge, cv2.TM_CCOEFF_NORMED)
    _, max_val, _, max_loc = cv2.minMaxLoc(result)
    return max_loc[0], max_val

def submit_check(uid, key, check_id, client_ip, point_y, distance):
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

# Main test: use SAME session, try multiple distances
for i in range(5):
    print(f"\n{'='*60}")
    print(f"ITERATION {i+1}")
    print(f"{'='*60}")
    
    # Get ONE session
    uid = str(uuid.uuid4())
    resp = requests.post(f"{BASE}/captcha/querySlideImage/{uid}", headers=HEADERS, timeout=15)
    data = resp.json()['data']
    key = data['key']
    check_id = data['checkId']
    client_ip = data.get('clientIp', '')
    point_y = data.get('pointY', 0)
    
    # Download images
    shade_resp = requests.get(data['shadeImageUrl'], timeout=15)
    slide_resp = requests.get(data['slideImageUrl'], timeout=15)
    
    # Save for inspection
    shade_img = Image.open(io.BytesIO(shade_resp.content))
    shade_img.save(f"same_session_shade_{i+1}.png")
    
    # Recognize with both methods
    yunma_dist = yunma_recognize(shade_resp.content, slide_resp.content)
    cv_result = opencv_recognize(shade_resp.content, slide_resp.content)
    cv_dist = cv_result[0] if cv_result else None
    cv_conf = cv_result[1] if cv_result else 0
    
    print(f"  pointY={point_y}, yunma={yunma_dist}, opencv={cv_dist} (conf={cv_conf:.3f})")
    
    # Build candidate distances: yunma, opencv, and offsets
    candidates = []
    if yunma_dist and yunma_dist > 10:
        candidates.append(("yunma", yunma_dist))
    if cv_dist and cv_conf > 0.1:
        candidates.append(("opencv", cv_dist))
    
    # Also try average if both available
    if yunma_dist and cv_dist and abs(yunma_dist - cv_dist) < 50:
        avg = (yunma_dist + cv_dist) // 2
        candidates.append(("avg", avg))
    
    # Try offsets from yunma
    if yunma_dist:
        for offset in [-34, -17, 17, 34]:
            d = yunma_dist + offset
            if 10 < d < 330:
                candidates.append((f"yunma{offset:+d}", d))
    
    # Try each candidate ON THE SAME SESSION
    # On failure, server returns new checkId - use it for next attempt
    current_check_id = check_id
    found = False
    
    for name, dist in candidates:
        result = submit_check(uid, key, current_check_id, client_ip, point_y, dist)
        
        if result.get('success'):
            print(f"  *** {name}: dist={dist} → SUCCESS! token={result.get('data', {}).get('token', '')[:20]}... ***")
            found = True
            break
        else:
            code = result.get('code')
            # Update checkId for next attempt
            new_check = result.get('data', {}).get('checkId')
            if new_check:
                current_check_id = new_check
            print(f"  {name}: dist={dist} → FAIL(code={code}), new_checkId={current_check_id[:8]}...")
        
        time.sleep(0.2)
    
    if not found:
        print(f"  ALL CANDIDATES FAILED for this image")

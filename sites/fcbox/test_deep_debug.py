"""Deep debug: dump every detail of sign calculation & AES encryption"""
import json, base64, hashlib, time, random, uuid, requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

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

for attempt in range(5):
    print(f"\n{'='*60}")
    print(f"ATTEMPT {attempt+1}")
    print(f"{'='*60}")
    
    t0 = time.time()
    
    # Step 1: querySlideImage
    uid = str(uuid.uuid4())
    url = f"{BASE}/captcha/querySlideImage/{uid}"
    resp = requests.post(url, headers=HEADERS, timeout=15)
    t1 = time.time()
    
    full_resp = resp.json()
    data = full_resp.get('data', {})
    
    check_id = data.get('checkId', '')
    key = data.get('key', '')
    client_ip = data.get('clientIp', '')
    point_y = data.get('pointY', 0)
    point_x = data.get('pointX', 0)
    shade_url = data.get('shadeImageUrl', '')
    slide_url = data.get('slideImageUrl', '')
    
    print(f"  uid: {uid}")
    print(f"  checkId: {check_id}")
    print(f"  key: {key}")
    print(f"  clientIp: '{client_ip}'")
    print(f"  pointX: {point_x}, pointY: {point_y}")
    print(f"  querySlideImage time: {(t1-t0)*1000:.0f}ms")
    
    # Step 2: Download images
    shade_resp = requests.get(shade_url, headers={"User-Agent": HEADERS["User-Agent"]}, timeout=15)
    slide_resp = requests.get(slide_url, headers={"User-Agent": HEADERS["User-Agent"]}, timeout=15)
    t2 = time.time()
    print(f"  image download time: {(t2-t1)*1000:.0f}ms")
    print(f"  shade: {len(shade_resp.content)} bytes, slide: {len(slide_resp.content)} bytes")
    
    # Step 3: Yunma recognition
    distance = yunma_recognize(shade_resp.content, slide_resp.content)
    t3 = time.time()
    print(f"  yunma distance: {distance}")
    print(f"  yunma time: {(t3-t2)*1000:.0f}ms")
    print(f"  TOTAL time so far: {(t3-t0)*1000:.0f}ms")
    
    if not distance:
        print("  yunma failed, skipping")
        continue
    
    # Step 4: Build track & sign
    track = generate_simple_track(distance, point_y)
    
    # Build trackString exactly like JS: x + "" + y + time
    track_str = ''.join([f"{t['x']}{t['y']}{t['time']}" for t in track])
    
    # Sign: md5(clientIp + checkId + uuid + trackString)
    sign_raw = f"{client_ip}{check_id}{uid}{track_str}"
    sign = hashlib.md5(sign_raw.encode('utf-8')).hexdigest()
    
    # Step 5: AES encrypt
    payload = {"sign": sign, "track": track}
    plaintext = json.dumps(payload, separators=(',', ':'))
    
    print(f"\n  --- DEBUG ---")
    print(f"  sign_raw length: {len(sign_raw)}")
    print(f"  sign_raw (first 200): {sign_raw[:200]}")
    print(f"  sign: {sign}")
    print(f"  plaintext: {plaintext[:200]}...")
    print(f"  track points: {len(track)}")
    print(f"  first track: {track[0]}")
    print(f"  last track: {track[-1]}")
    
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    padded = pad(plaintext.encode('utf-8'), AES.block_size)
    encrypted = base64.b64encode(cipher.encrypt(padded)).decode('utf-8')
    
    # Verify decryption
    decrypt_cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    decrypted = unpad(decrypt_cipher.decrypt(base64.b64decode(encrypted)), AES.block_size).decode('utf-8')
    assert decrypted == plaintext, f"Decryption mismatch!"
    print(f"  AES decrypt verify: OK")
    
    # Step 6: checkCode
    check_url = f"{BASE}/captcha/checkCode/{uid}"
    check_resp = requests.post(check_url, data=encrypted, headers={
        **HEADERS,
        "Content-Type": "text/plain"
    }, timeout=15)
    t4 = time.time()
    
    result = check_resp.json()
    code = result.get('code')
    success = result.get('success')
    
    print(f"\n  checkCode time: {(t4-t3)*1000:.0f}ms")
    print(f"  TOTAL request time: {(t4-t0)*1000:.0f}ms")
    print(f"  response: code={code}, success={success}")
    
    if success:
        print(f"  *** SUCCESS! Token: {result.get('data', {}).get('token')} ***")
        break
    else:
        print(f"  FAILED")
        print(f"  full response: {json.dumps(result, ensure_ascii=False)}")
    
    time.sleep(0.5)

"""Test with NO session cookies, fresh requests.post() for each call"""
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

def yunma_recognize(shade_content, slide_content, yunma_type="20111"):
    payload = {
        "slide_image": base64.b64encode(slide_content).decode('utf-8'),
        "background_image": base64.b64encode(shade_content).decode('utf-8'),
        "token": YUNMA_TOKEN,
        "type": yunma_type
    }
    resp = requests.post("http://api.jfbym.com/api/YmServer/customApi", json=payload, timeout=30)
    result = resp.json()
    if result.get('code') == 10000 and result.get('data', {}).get('code') == 0:
        return int(result['data']['data']), result
    return None, result

def full_test(yunma_type="20111"):
    # Step 1: querySlideImage (no session, no cookies)
    uid = str(uuid.uuid4())
    url = f"{BASE}/captcha/querySlideImage/{uid}"
    resp = requests.post(url, headers=HEADERS, timeout=15)
    data = resp.json()['data']
    
    check_id = data['checkId']
    key = data['key']
    client_ip = data.get('clientIp', '')
    point_y = data.get('pointY', 0)
    point_x = data.get('pointX', 0)
    shade_url = data.get('shadeImageUrl')
    slide_url = data.get('slideImageUrl')
    
    # Step 2: Download images (no session)
    shade_resp = requests.get(shade_url, headers={"User-Agent": HEADERS["User-Agent"]}, timeout=15)
    slide_resp = requests.get(slide_url, headers={"User-Agent": HEADERS["User-Agent"]}, timeout=15)
    
    # Step 3: Yunma recognition
    distance, yunma_result = yunma_recognize(shade_resp.content, slide_resp.content, yunma_type)
    print(f"  pointX={point_x}, pointY={point_y}, yunma({yunma_type})={distance}")
    
    if not distance:
        print(f"  yunma failed: {json.dumps(yunma_result, ensure_ascii=False)}")
        return False
    
    # Step 4: Generate track & sign
    track = generate_simple_track(distance, point_y)
    track_str = ''.join([f'{t["x"]}{t["y"]}{t["time"]}' for t in track])
    sign = hashlib.md5(f"{client_ip}{check_id}{uid}{track_str}".encode()).hexdigest()
    
    # Step 5: AES encrypt
    payload = {"sign": sign, "track": track}
    plaintext = json.dumps(payload, separators=(',', ':'))
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    encrypted = base64.b64encode(cipher.encrypt(pad(plaintext.encode('utf-8'), AES.block_size))).decode('utf-8')
    
    # Step 6: checkCode (no session, fresh request)
    check_url = f"{BASE}/captcha/checkCode/{uid}"
    check_resp = requests.post(check_url, data=encrypted, headers={
        **HEADERS,
        "Content-Type": "text/plain"
    }, timeout=15)
    
    result = check_resp.json()
    code = result.get('code')
    success = result.get('success')
    
    if success:
        print(f"  *** SUCCESS! Token: {result.get('data', {}).get('token')} ***")
        return True
    else:
        print(f"  FAILED: code={code}, data={result.get('data')}")
        return False

# Test with different yunma types
for ytype in ["20111", "20110"]:
    print(f"\n{'='*50}")
    print(f"Yunma type: {ytype}")
    print(f"{'='*50}")
    for i in range(3):
        print(f"\n[Test {i+1}]")
        if full_test(ytype):
            break
        time.sleep(0.5)

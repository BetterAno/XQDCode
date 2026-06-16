"""Debug: save images, check sizes, compare yunma vs ddddocr"""
import json, base64, hashlib, time, random, uuid, requests, io
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

def yunma_recognize(shade_b64, slide_b64):
    payload = {
        "slide_image": slide_b64,
        "background_image": shade_b64,
        "token": YUNMA_TOKEN,
        "type": "20111"
    }
    resp = requests.post("http://api.jfbym.com/api/YmServer/customApi", json=payload, timeout=30)
    return resp.json()

def ddddocr_recognize(shade_content, slide_content):
    try:
        import ddddocr
        det = ddddocr.slide_match(shade_content, slide_content, simple_target=True)
        if 'target' in det:
            return det['target'][0]
    except Exception as e:
        print(f"  ddddocr error: {e}")
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

def submit_check(uid, key, check_id, client_ip, point_y, distance, track):
    track_str = ''.join([f'{t["x"]}{t["y"]}{t["time"]}' for t in track])
    sign = hashlib.md5(f"{client_ip}{check_id}{uid}{track_str}".encode()).hexdigest()
    payload = {"sign": sign, "track": track}
    plaintext = json.dumps(payload, separators=(',', ':'))
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    encrypted = base64.b64encode(cipher.encrypt(pad(plaintext.encode('utf-8'), AES.block_size))).decode('utf-8')
    check_resp = requests.post(f"{BASE}/captcha/checkCode/{uid}", data=encrypted, headers={
        **HEADERS, "Content-Type": "text/plain"
    }, timeout=15)
    return check_resp.json()

# Single comprehensive test
uid = str(uuid.uuid4())
resp = requests.post(f"{BASE}/captcha/querySlideImage/{uid}", headers=HEADERS, timeout=15)
data = resp.json()['data']
check_id = data['checkId']
key = data['key']
client_ip = data.get('clientIp', '')
point_y = data.get('pointY', 0)
point_x = data.get('pointX', 0)
shade_url = data.get('shadeImageUrl')
slide_url = data.get('slideImageUrl')

print(f"uid: {uid}")
print(f"pointX: {point_x}, pointY: {point_y}")
print(f"shadeUrl: {shade_url[:80]}...")
print(f"slideUrl: {slide_url[:80]}...")

# Download images
shade_resp = requests.get(shade_url, headers={"User-Agent": HEADERS["User-Agent"]}, timeout=15)
slide_resp = requests.get(slide_url, headers={"User-Agent": HEADERS["User-Agent"]}, timeout=15)
shade_content = shade_resp.content
slide_content = slide_resp.content

print(f"\nshade image: {len(shade_content)} bytes, content-type: {shade_resp.headers.get('content-type')}")
print(f"slide image: {len(slide_content)} bytes, content-type: {slide_resp.headers.get('content-type')}")

# Save images for inspection
with open("debug_shade.png", "wb") as f:
    f.write(shade_content)
with open("debug_slide.png", "wb") as f:
    f.write(slide_content)
print("Saved: debug_shade.png, debug_slide.png")

# Check image dimensions
try:
    from PIL import Image
    shade_img = Image.open(io.BytesIO(shade_content))
    slide_img = Image.open(io.BytesIO(slide_content))
    print(f"shade dimensions: {shade_img.size}")
    print(f"slide dimensions: {slide_img.size}")
    print(f"shade mode: {shade_img.mode}")
    print(f"slide mode: {slide_img.mode}")
except:
    print("PIL not available")

# Yunma recognition
shade_b64 = base64.b64encode(shade_content).decode('utf-8')
slide_b64 = base64.b64encode(slide_content).decode('utf-8')
yunma_result = yunma_recognize(shade_b64, slide_b64)
print(f"\nYunma result: {json.dumps(yunma_result, ensure_ascii=False)}")
yunma_dist = None
if yunma_result.get('code') == 10000 and yunma_result.get('data', {}).get('code') == 0:
    yunma_dist = int(yunma_result['data']['data'])
    print(f"Yunma distance: {yunma_dist}")

# ddddocr recognition
ddddocr_dist = ddddocr_recognize(shade_content, slide_content)
print(f"ddddocr distance: {ddddocr_dist}")

# Try BOTH distances with FRESH sessions
distances = []
if yunma_dist:
    distances.append(("yunma", yunma_dist))
if ddddocr_dist:
    distances.append(("ddddocr", ddddocr_dist))

# Also try common offset corrections
if yunma_dist:
    for offset in [-10, -5, 5, 10]:
        distances.append((f"yunma{offset:+d}", yunma_dist + offset))

for name, dist in distances:
    # Fresh session for each attempt
    new_uid = str(uuid.uuid4())
    new_resp = requests.post(f"{BASE}/captcha/querySlideImage/{new_uid}", headers=HEADERS, timeout=15)
    new_data = new_resp.json()['data']
    
    # Download new images (but use the SAME distance from the first image!)
    # This is intentional - we want to see if the distance works across sessions
    
    track = generate_simple_track(dist, new_data.get('pointY', 0))
    result = submit_check(
        new_uid, new_data['key'], new_data['checkId'],
        new_data.get('clientIp', ''), new_data.get('pointY', 0),
        dist, track
    )
    
    success = result.get('success')
    code = result.get('code')
    status = "SUCCESS!" if success else f"FAIL(code={code})"
    print(f"  {name}: dist={dist}, {status}")
    
    if success:
        print(f"  Token: {result.get('data', {}).get('token')}")
        break
    time.sleep(0.3)

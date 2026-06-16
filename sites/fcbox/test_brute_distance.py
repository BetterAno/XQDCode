"""Test with simple track format and multiple distance offsets"""
import sys, os, json, base64, hashlib, time, random, uuid, requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
from captcha import FcboxCaptchaSolver

try:
    import ddddocr
    ddddocr_solver = ddddocr.DdddOcr(det=False, ocr=False, show_ad=False)
except:
    ddddocr_solver = None

def generate_simple_track(distance, point_y):
    """Simple track like browser capture: few points, near-zero time span"""
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

def try_distance(uid, key, check_id, client_ip, point_y, distance, track_type="simple"):
    if track_type == "simple":
        track = generate_simple_track(distance, point_y)
    else:
        solver = FcboxCaptchaSolver()
        track = solver.generate_track(distance, point_y=point_y)
    
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

def main():
    # Get captcha session
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Origin": "https://www.fcbox.com",
        "Referer": "https://www.fcbox.com/"
    })
    
    uid = str(uuid.uuid4())
    url = f"https://acs.fcbox.com/captcha/querySlideImage/{uid}"
    resp = session.post(url, timeout=15)
    data = resp.json()['data']
    
    check_id = data['checkId']
    key = data['key']
    client_ip = data.get('clientIp', '')
    point_y = data.get('pointY', 0)
    shade_url = data.get('shadeImageUrl')
    slide_url = data.get('slideImageUrl')
    
    print(f"uid={uid}, pointY={point_y}")
    
    # Download images
    shade_resp = session.get(shade_url, timeout=15)
    slide_resp = session.get(slide_url, timeout=15)
    
    # Get ddddocr distance
    ddddocr_dist = None
    if ddddocr_solver:
        result = ddddocr_solver.slide_match(slide_resp.content, shade_resp.content, simple_target=True)
        ddddocr_dist = result.get('target_x')
        print(f"ddddocr: {ddddocr_dist} (conf={result.get('confidence', 0):.4f})")
    
    # Try with BOTH track formats and multiple distances
    base_distances = []
    if ddddocr_dist:
        base_distances.append(ddddocr_dist)
    
    # Try offsets from ddddocr
    if ddddocr_dist:
        for offset in range(-20, 25, 5):
            if offset != 0:
                base_distances.append(ddddocr_dist + offset)
    
    for dist in base_distances:
        if dist <= 0:
            continue
        
        # Get a fresh session for each attempt
        new_uid = str(uuid.uuid4())
        new_url = f"https://acs.fcbox.com/captcha/querySlideImage/{new_uid}"
        new_resp = session.post(new_url, timeout=15)
        new_data = new_resp.json()['data']
        
        new_check_id = new_data['checkId']
        new_key = new_data['key']
        new_client_ip = new_data.get('clientIp', '')
        new_point_y = new_data.get('pointY', 0)
        
        # Try simple track
        result = try_distance(new_uid, new_key, new_check_id, new_client_ip, new_point_y, dist, "simple")
        code = result.get('code')
        success = result.get('success')
        
        if success:
            print(f"  *** SUCCESS! distance={dist} ***")
            print(f"  Token: {result.get('data', {}).get('token')}")
            return
        elif code != 400400003:
            print(f"  distance={dist}: code={code} (not 400400003, might be sign error)")
        else:
            print(f"  distance={dist}: code=400400003 (wrong position)")
        
        time.sleep(0.3)

if __name__ == "__main__":
    main()

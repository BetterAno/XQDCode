"""Test checkCode with multiple distances to find the correct one"""
import sys, os, json, base64, hashlib, time, random, uuid, requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
from captcha import FcboxCaptchaSolver

YUNMA_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"

def generate_simple_track(distance, point_y, start_time=None):
    """Generate a simple track similar to browser capture:
    - Few points (~30)
    - Nearly identical timestamps
    - Small starting x
    """
    start_time = start_time or int(time.time() * 1000)
    track = []
    # Start from a small offset (like browser: starts at x=6)
    start_x = random.randint(3, 10)
    num_points = random.randint(25, 35)
    
    for i in range(num_points):
        x = start_x + int((distance - start_x) * i / (num_points - 1))
        # All timestamps within a few ms (like browser capture)
        t = start_time + random.randint(0, 3)
        track.append({
            "x": x,
            "y": point_y,
            "time": t
        })
    
    # Ensure last point is exactly the distance
    track[-1]["x"] = distance
    return track

def try_check_code(uid, key, check_id, client_ip, point_y, distance, track_type="simple"):
    """Try checkCode with a specific distance"""
    if track_type == "simple":
        track = generate_simple_track(distance, point_y)
    else:
        solver = FcboxCaptchaSolver()
        track = solver.generate_track(distance, point_y=point_y)
    
    # Calculate sign
    track_str = ''.join([f'{t["x"]}{t["y"]}{t["time"]}' for t in track])
    sign_raw = f"{client_ip}{check_id}{uid}{track_str}"
    sign = hashlib.md5(sign_raw.encode('utf-8')).hexdigest()
    
    # Encrypt
    payload = {"sign": sign, "track": track}
    plaintext = json.dumps(payload, separators=(',', ':'))
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    padded = pad(plaintext.encode('utf-8'), AES.block_size)
    encrypted = base64.b64encode(cipher.encrypt(padded)).decode('utf-8')
    
    # Submit
    url = f"https://acs.fcbox.com/captcha/checkCode/{uid}"
    resp = requests.post(url, data=encrypted, headers={
        "Content-Type": "text/plain",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Origin": "https://www.fcbox.com",
        "Referer": "https://www.fcbox.com/"
    }, timeout=15)
    
    result = resp.json()
    return result

def main():
    solver = FcboxCaptchaSolver(yunma_token=YUNMA_TOKEN)
    
    # Step 1: querySlideImage
    uid = str(uuid.uuid4())
    url = f"{solver.BASE_URL}/captcha/querySlideImage/{uid}"
    resp = solver.session.post(url, timeout=15)
    raw = resp.json()
    
    if not raw.get('success'):
        print("querySlideImage failed")
        return
    
    data = raw['data']
    check_id = data['checkId']
    key = data['key']
    client_ip = data.get('clientIp', '')
    point_x = data.get('pointX', 0)
    point_y = data.get('pointY', 0)
    shade_url = data.get('shadeImageUrl')
    slide_url = data.get('slideImageUrl')
    
    print(f"uid={uid}")
    print(f"checkId={check_id}")
    print(f"key={key}")
    print(f"clientIp={client_ip}")
    print(f"pointX={point_x}, pointY={point_y}")
    
    if point_x > 0:
        print(f"\npointX={point_x} is non-zero, server gives the answer directly!")
        # Test with the server-provided distance
        result = try_check_code(uid, key, check_id, client_ip, point_y, point_x, "simple")
        print(f"  Result: code={result.get('code')}, success={result.get('success')}")
        if result.get('success'):
            print(f"  Token: {result.get('data', {}).get('token')}")
        return
    
    # Step 2: Download images
    shade_resp = solver.session.get(shade_url, timeout=15)
    slide_resp = solver.session.get(slide_url, timeout=15)
    
    # Step 3: Get yunma distance
    yunma_payload = {
        "slide_image": base64.b64encode(slide_resp.content).decode('utf-8'),
        "background_image": base64.b64encode(shade_resp.content).decode('utf-8'),
        "token": YUNMA_TOKEN,
        "type": "20111"
    }
    yunma_resp = requests.post("http://api.jfbym.com/api/YmServer/customApi", json=yunma_payload, timeout=30)
    yunma_result = yunma_resp.json()
    yunma_distance = None
    if yunma_result.get('code') == 10000 and yunma_result.get('data', {}).get('code') == 0:
        yunma_distance = int(yunma_result['data']['data'])
    print(f"\nYunma distance: {yunma_distance}")
    
    # Step 4: Get OpenCV distances
    cv_distances = []
    try:
        import cv2
        import numpy as np
        shade_arr = np.frombuffer(shade_resp.content, np.uint8)
        shade_cv = cv2.imdecode(shade_arr, cv2.IMREAD_COLOR)
        slide_arr = np.frombuffer(slide_resp.content, np.uint8)
        slide_cv = cv2.imdecode(slide_arr, cv2.IMREAD_COLOR)
        
        if shade_cv is not None and slide_cv is not None:
            shade_gray = cv2.cvtColor(shade_cv, cv2.COLOR_BGR2GRAY)
            slide_gray = cv2.cvtColor(slide_cv, cv2.COLOR_BGR2GRAY)
            
            # Edge matching
            shade_edge = cv2.Canny(shade_gray, 100, 200)
            slide_edge = cv2.Canny(slide_gray, 100, 200)
            result = cv2.matchTemplate(shade_edge, slide_edge, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, max_loc = cv2.minMaxLoc(result)
            cv_distances.append(("Edge", max_loc[0], max_val))
            
            # Grayscale matching
            result2 = cv2.matchTemplate(shade_gray, slide_gray, cv2.TM_CCOEFF_NORMED)
            _, max_val2, _, max_loc2 = cv2.minMaxLoc(result2)
            cv_distances.append(("Gray", max_loc2[0], max_val2))
    except Exception as e:
        print(f"OpenCV error: {e}")
    
    for name, dist, conf in cv_distances:
        print(f"OpenCV {name}: distance={dist}, confidence={conf:.4f}")
    
    # Step 5: Try multiple distances
    # Each attempt needs a NEW querySlideImage because each UUID can only be used once
    distances_to_try = []
    if yunma_distance:
        distances_to_try.append(("Yunma", yunma_distance))
    for name, dist, conf in cv_distances:
        distances_to_try.append((f"CV-{name}", dist))
    
    # Also try common offsets relative to yunma
    if yunma_distance:
        for offset in [-10, -5, 5, 10]:
            distances_to_try.append((f"Yunma{offset:+d}", yunma_distance + offset))
    
    print(f"\n{'='*60}")
    print("Testing multiple distances (each needs a new session)")
    print(f"{'='*60}")
    
    for name, dist in distances_to_try:
        print(f"\n--- {name}: distance={dist} ---")
        
        # Get a new session
        new_uid = str(uuid.uuid4())
        new_url = f"{solver.BASE_URL}/captcha/querySlideImage/{new_uid}"
        new_resp = solver.session.post(new_url, timeout=15)
        new_raw = new_resp.json()
        
        if not new_raw.get('success'):
            print("  querySlideImage failed, skipping")
            continue
        
        new_data = new_raw['data']
        new_check_id = new_data['checkId']
        new_key = new_data['key']
        new_client_ip = new_data.get('clientIp', '')
        new_point_y = new_data.get('pointY', 0)
        
        # Use the same distance with the new session's pointY
        result = try_check_code(new_uid, new_key, new_check_id, new_client_ip, new_point_y, dist, "simple")
        
        code = result.get('code')
        success = result.get('success')
        msg = result.get('msg', '')
        print(f"  code={code}, success={success}, msg={msg}")
        
        if success:
            token = result.get('data', {}).get('token', '')
            print(f"  *** SUCCESS! Token: {token} ***")
            print(f"  Working distance: {dist} (method: {name})")
            break
        
        # Error code analysis
        if code == 400400002:
            print("  → 验证码过期/无效（sign错误）")
        elif code == 400400003:
            print("  → 验证失败（位置不对）")
        elif code == 400400005:
            print("  → 成功")
        
        time.sleep(0.5)  # Small delay between attempts

if __name__ == "__main__":
    main()

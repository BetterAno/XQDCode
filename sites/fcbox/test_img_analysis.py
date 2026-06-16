"""Download captcha images and verify yunma recognition"""
import sys, os, json, base64, requests, time, uuid

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
from captcha import FcboxCaptchaSolver

YUNMA_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"

def test_with_image_analysis():
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
    
    print(f"pointX={point_x}, pointY={point_y}")
    print(f"shadeUrl={shade_url}")
    print(f"slideUrl={slide_url}")
    
    # Step 2: Download images and check dimensions
    shade_resp = solver.session.get(shade_url, timeout=15)
    slide_resp = solver.session.get(slide_url, timeout=15)
    
    # Save images
    with open("test_shade.png", "wb") as f:
        f.write(shade_resp.content)
    with open("test_slide.png", "wb") as f:
        f.write(slide_resp.content)
    
    # Check image dimensions
    try:
        from PIL import Image
        import io
        shade_img = Image.open(io.BytesIO(shade_resp.content))
        slide_img = Image.open(io.BytesIO(slide_resp.content))
        print(f"\nShade image size: {shade_img.size}")
        print(f"Slide image size: {slide_img.size}")
    except ImportError:
        print("\nPIL not available, skipping image size check")
    
    # Step 3: Call yunma with detailed output
    yunma_payload = {
        "slide_image": base64.b64encode(slide_resp.content).decode('utf-8'),
        "background_image": base64.b64encode(shade_resp.content).decode('utf-8'),
        "token": YUNMA_TOKEN,
        "type": "20111"
    }
    
    yunma_resp = requests.post(
        "http://api.jfbym.com/api/YmServer/customApi",
        json=yunma_payload,
        timeout=30
    )
    yunma_result = yunma_resp.json()
    print(f"\nYunma full response:")
    print(json.dumps(yunma_result, indent=2, ensure_ascii=False))
    
    if yunma_result.get('code') == 10000:
        inner = yunma_result.get('data', {})
        if inner.get('code') == 0:
            distance = int(inner['data'])
            print(f"\nYunma distance: {distance}")
    
    # Step 4: Try to use OpenCV for self-detection
    try:
        import cv2
        import numpy as np
        
        # Read images
        shade_arr = np.frombuffer(shade_resp.content, np.uint8)
        shade_cv = cv2.imdecode(shade_arr, cv2.IMREAD_COLOR)
        slide_arr = np.frombuffer(slide_resp.content, np.uint8)
        slide_cv = cv2.imdecode(slide_arr, cv2.IMREAD_COLOR)
        
        if shade_cv is not None and slide_cv is not None:
            # Template matching
            shade_gray = cv2.cvtColor(shade_cv, cv2.COLOR_BGR2GRAY)
            slide_gray = cv2.cvtColor(slide_cv, cv2.COLOR_BGR2GRAY)
            
            # Edge detection for better matching
            shade_edge = cv2.Canny(shade_gray, 100, 200)
            slide_edge = cv2.Canny(slide_gray, 100, 200)
            
            result = cv2.matchTemplate(shade_edge, slide_edge, cv2.TM_CCOEFF_NORMED)
            min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
            
            print(f"\nOpenCV template matching:")
            print(f"  Best match position: {max_loc}")
            print(f"  Confidence: {max_val:.4f}")
            print(f"  Distance (x): {max_loc[0]}")
            
            # Also try with grayscale directly
            result2 = cv2.matchTemplate(shade_gray, slide_gray, cv2.TM_CCOEFF_NORMED)
            min_val2, max_val2, min_loc2, max_loc2 = cv2.minMaxLoc(result2)
            print(f"\nOpenCV grayscale matching:")
            print(f"  Best match position: {max_loc2}")
            print(f"  Confidence: {max_val2:.4f}")
            print(f"  Distance (x): {max_loc2[0]}")
    except ImportError:
        print("\nOpenCV not available, skipping self-detection")
    except Exception as e:
        print(f"\nOpenCV error: {e}")

if __name__ == "__main__":
    test_with_image_analysis()

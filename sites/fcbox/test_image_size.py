"""Check image dimensions vs what server expects for x value"""
import json, uuid, requests, io
from PIL import Image

BASE = "https://acs.fcbox.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "*/*",
    "Origin": "https://www.fcbox.com",
    "Referer": "https://www.fcbox.com/",
}

for i in range(3):
    uid = str(uuid.uuid4())
    url = f"{BASE}/captcha/querySlideImage/{uid}"
    resp = requests.post(url, headers=HEADERS, timeout=15)
    data = resp.json()['data']
    
    shade_resp = requests.get(data['shadeImageUrl'], timeout=15)
    slide_resp = requests.get(data['slideImageUrl'], timeout=15)
    
    shade_img = Image.open(io.BytesIO(shade_resp.content))
    slide_img = Image.open(io.BytesIO(slide_resp.content))
    
    print(f"Test {i+1}:")
    print(f"  shade: {shade_img.size[0]}x{shade_img.size[1]}, mode={shade_img.mode}")
    print(f"  slide: {slide_img.size[0]}x{slide_img.size[1]}, mode={slide_img.mode}")
    print(f"  pointX={data.get('pointX')}, pointY={data.get('pointY')}")
    
    # If image is 2x resolution, track x = pixel_x / 2
    # If image is 1x (340px wide), track x = pixel_x (no scaling)
    if shade_img.size[0] != 340:
        scale = 340 / shade_img.size[0]
        print(f"  *** IMAGE IS {shade_img.size[0]}px, NOT 340px! Scale factor: {scale:.3f} ***")
        print(f"  *** yunma distance needs to be multiplied by {scale:.3f} ***")
    else:
        print(f"  image is 340px - no scaling needed")
    print()

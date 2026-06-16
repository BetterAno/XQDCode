"""
转换webp为png后测试云码10115滑块识别
"""
import json
import urllib.request
import base64
import io

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("需要安装 PIL: pip install Pillow")

TOKEN = 'tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI'

STATIC = 'https://images.tuyacn.com/'
BG_PATH = 'yrule/images/bg/260/160/eYuq4H7wHNNOLjnHF83DUdzmfWsmIQef.webp'
SL_PATH = 'yrule/images/slice/260/160/eYuq4H7wHNNOLjnHF83DUdzmfWsmIQef.png'

print("下载图片...")
bg_data = urllib.request.urlopen(STATIC + BG_PATH, timeout=10).read()
sl_data = urllib.request.urlopen(STATIC + SL_PATH, timeout=10).read()

def to_png_b64(img_data):
    """转换为PNG格式的base64"""
    if HAS_PIL:
        img = Image.open(io.BytesIO(img_data)).convert('RGB')
        buf = io.BytesIO()
        img.save(buf, format='PNG')
        return base64.b64encode(buf.getvalue()).decode()
    return base64.b64encode(img_data).decode()

def call_api(payload):
    req = urllib.request.Request(
        'http://api.jfbym.com/api/YmServer/customApi',
        data=json.dumps(payload).encode(),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    resp = json.loads(urllib.request.urlopen(req, timeout=30).read())
    return resp

# 原始格式
bg_b64_raw = base64.b64encode(bg_data).decode()
sl_b64_raw = base64.b64encode(sl_data).decode()

# PNG格式（转换后）
bg_b64_png = to_png_b64(bg_data)
sl_b64_png = to_png_b64(sl_data)

print(f"  bg原始: {len(bg_b64_raw)} chars")
print(f"  bg转PNG: {len(bg_b64_png)} chars")

print("\n=== 10115 + PNG背景图 ===")
r = call_api({'token': TOKEN, 'type': '10115', 'image': bg_b64_png, 'image_small': sl_b64_raw})
print(f"  {json.dumps(r, ensure_ascii=False)[:400]}")

print("\n=== 10115 + PNG背景图+PNG小图 ===")
r2 = call_api({'token': TOKEN, 'type': '10115', 'image': bg_b64_png, 'image_small': sl_b64_png})
print(f"  {json.dumps(r2, ensure_ascii=False)[:400]}")

print("\n=== 10116 + PNG ===")
r3 = call_api({'token': TOKEN, 'type': '10116', 'image': bg_b64_png, 'image_small': sl_b64_raw})
print(f"  {json.dumps(r3, ensure_ascii=False)[:400]}")

print("\n=== 10117 + PNG ===")
r4 = call_api({'token': TOKEN, 'type': '10117', 'image': bg_b64_png, 'image_small': sl_b64_raw})
print(f"  {json.dumps(r4, ensure_ascii=False)[:400]}")

# 也测试只传背景图（有些接口自己识别缺口）
print("\n=== 10115 只传PNG背景图 ===")
r5 = call_api({'token': TOKEN, 'type': '10115', 'image': bg_b64_png})
print(f"  {json.dumps(r5, ensure_ascii=False)[:400]}")

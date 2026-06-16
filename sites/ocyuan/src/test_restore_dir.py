"""
验证shuffle还原方向 + 测试云码22222
"""
import json
import urllib.request
import base64
import io
import numpy as np
from PIL import Image

TOKEN = 'tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI'

STATIC = 'https://images.tuyacn.com/'
BG_PATH = 'yrule/images/bg/260/160/eYuq4H7wHNNOLjnHF83DUdzmfWsmIQef.webp'
SL_PATH = 'yrule/images/slice/260/160/eYuq4H7wHNNOLjnHF83DUdzmfWsmIQef.png'
SHUFFLE = [38, 41, 37, 12, 30, 42, 34, 32, 0, 8, 7, 5, 10, 48, 39, 17,
           49, 16, 14, 47, 51, 13, 40, 27, 15, 9, 1, 36, 26, 23, 43, 44,
           11, 18, 2, 35, 29, 22, 50, 6, 19, 45, 28, 46, 20, 3, 25, 21,
           4, 24, 33, 31]

bg_data = urllib.request.urlopen(STATIC + BG_PATH, timeout=10).read()
sl_data = urllib.request.urlopen(STATIC + SL_PATH, timeout=10).read()
bg_orig = np.array(Image.open(io.BytesIO(bg_data)).convert('RGB'))

rows, cols = 4, 13
h, w = bg_orig.shape[:2]
bh, bw = h // rows, w // cols
print(f"图片: {w}x{h}, 小块: {bw}x{bh}")


def restore_v1(img, shuffle, rows=4, cols=13):
    """方案1: shuffle[i] = 原图第shuffle[i]块 -> 还原后第i块"""
    bh2, bw2 = img.shape[0]//rows, img.shape[1]//cols
    out = np.zeros_like(img)
    for i, src_idx in enumerate(shuffle):
        dr, dc = i // cols, i % cols
        sr, sc = src_idx // cols, src_idx % cols
        out[dr*bh2:(dr+1)*bh2, dc*bw2:(dc+1)*bw2] = img[sr*bh2:(sr+1)*bh2, sc*bw2:(sc+1)*bw2]
    return out


def restore_v2(img, shuffle, rows=4, cols=13):
    """方案2: shuffle[src] = 原图第src块 -> 还原后第shuffle[src]块（逆向）"""
    bh2, bw2 = img.shape[0]//rows, img.shape[1]//cols
    out = np.zeros_like(img)
    for src_idx, dst_i in enumerate(shuffle):
        sr, sc = src_idx // cols, src_idx % cols
        dr, dc = dst_i // cols, dst_i % cols
        out[dr*bh2:(dr+1)*bh2, dc*bw2:(dc+1)*bw2] = img[sr*bh2:(sr+1)*bh2, sc*bw2:(sc+1)*bw2]
    return out


v1 = restore_v1(bg_orig, SHUFFLE)
v2 = restore_v2(bg_orig, SHUFFLE)

Image.fromarray(v1.astype(np.uint8)).save('restore_v1.png')
Image.fromarray(v2.astype(np.uint8)).save('restore_v2.png')
Image.fromarray(bg_orig.astype(np.uint8)).save('bg_orig.png')
print("已保存 restore_v1.png, restore_v2.png, bg_orig.png")


def to_png_b64(arr):
    img = Image.fromarray(arr.astype(np.uint8))
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    return base64.b64encode(buf.getvalue()).decode()


def call_yunma(image_b64, tp='22222', extra=None):
    payload = {'token': TOKEN, 'type': str(tp), 'image': image_b64}
    if extra is not None:
        payload['extra'] = extra
    req = urllib.request.Request(
        'http://api.jfbym.com/api/YmServer/customApi',
        data=json.dumps(payload).encode(),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    return json.loads(urllib.request.urlopen(req, timeout=30).read())


print("\n=== 测试 type=22222 ===")

# 原图
print("原图（未还原）:")
r = call_yunma(to_png_b64(bg_orig), '22222', extra='true')
print(f"  {json.dumps(r, ensure_ascii=False)[:300]}")

# v1还原
print("\nV1还原（shuffle[i]=src）:")
r = call_yunma(to_png_b64(v1), '22222', extra='true')
print(f"  {json.dumps(r, ensure_ascii=False)[:300]}")

# v2还原
print("\nV2还原（shuffle[src]=dst）:")
r = call_yunma(to_png_b64(v2), '22222', extra='true')
print(f"  {json.dumps(r, ensure_ascii=False)[:300]}")

# 也试试不带extra
print("\nV2还原（不带extra）:")
r = call_yunma(to_png_b64(v2), '22222')
print(f"  {json.dumps(r, ensure_ascii=False)[:300]}")

# 滑块图
sl_arr = np.array(Image.open(io.BytesIO(sl_data)).convert('RGB'))
Image.fromarray(sl_arr.astype(np.uint8)).save('slice_img.png')
print("\n已保存 slice_img.png")

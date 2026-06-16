"""
测试图片还原 + 云码识别完整流程
"""
import json
import urllib.request
import base64
import io
import numpy as np
from PIL import Image

TOKEN = 'tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI'

# 使用getQuestion_126的数据
STATIC = 'https://images.tuyacn.com/'
BG_PATH = 'yrule/images/bg/260/160/eYuq4H7wHNNOLjnHF83DUdzmfWsmIQef.webp'
SL_PATH = 'yrule/images/slice/260/160/eYuq4H7wHNNOLjnHF83DUdzmfWsmIQef.png'
SHUFFLE = [38, 41, 37, 12, 30, 42, 34, 32, 0, 8, 7, 5, 10, 48, 39, 17,
           49, 16, 14, 47, 51, 13, 40, 27, 15, 9, 1, 36, 26, 23, 43, 44,
           11, 18, 2, 35, 29, 22, 50, 6, 19, 45, 28, 46, 20, 3, 25, 21,
           4, 24, 33, 31]


def download_bytes(url):
    return urllib.request.urlopen(url, timeout=10).read()


def restore_image(img_data, shuffle, rows=4, cols=13):
    """
    还原被shuffle打乱的背景图
    shuffle[i] 表示：还原后第i个位置的小块，来自原图的第shuffle[i]个位置
    """
    img = np.array(Image.open(io.BytesIO(img_data)).convert('RGB'))
    h, w = img.shape[:2]
    bh = h // rows
    bw = w // cols
    print(f"  原图: {w}x{h}, 小块: {bw}x{bh}, 总块数: {rows*cols}")

    restored = np.zeros_like(img)
    for i, src_idx in enumerate(shuffle):
        dst_r, dst_c = i // cols, i % cols
        src_r, src_c = src_idx // cols, src_idx % cols

        src_block = img[src_r*bh:(src_r+1)*bh, src_c*bw:(src_c+1)*bw]
        restored[dst_r*bh:(dst_r+1)*bh, dst_c*bw:(dst_c+1)*bw] = src_block

    return restored


def to_png_b64(arr_or_bytes):
    """numpy数组或bytes转PNG base64"""
    if isinstance(arr_or_bytes, bytes):
        img = Image.open(io.BytesIO(arr_or_bytes)).convert('RGB')
    else:
        img = Image.fromarray(arr_or_bytes.astype(np.uint8))
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    return base64.b64encode(buf.getvalue()).decode()


def call_yunma(tp, payload):
    payload['token'] = TOKEN
    payload['type'] = str(tp)
    req = urllib.request.Request(
        'http://api.jfbym.com/api/YmServer/customApi',
        data=json.dumps(payload).encode(),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    return json.loads(urllib.request.urlopen(req, timeout=30).read())


# ===== 主流程 =====
print("1. 下载图片...")
bg_data = download_bytes(STATIC + BG_PATH)
sl_data = download_bytes(STATIC + SL_PATH)
print(f"   bg={len(bg_data)}bytes  sl={len(sl_data)}bytes")

print("\n2. 还原背景图...")
restored = restore_image(bg_data, SHUFFLE)

# 保存还原前后的图片对比
raw_img = Image.open(io.BytesIO(bg_data)).convert('RGB')
raw_img.save('bg_raw.png')
Image.fromarray(restored.astype(np.uint8)).save('bg_restored.png')
print("   已保存 bg_raw.png 和 bg_restored.png")

# 转base64
bg_restored_b64 = to_png_b64(restored)
sl_b64 = to_png_b64(sl_data)
bg_raw_b64 = to_png_b64(bg_data)

print(f"   还原后PNG base64长度: {len(bg_restored_b64)}")

print("\n3. 测试云码识别（已还原背景图）...")
for tp in ['10115', '10116', '10117']:
    r = call_yunma(tp, {'image': bg_restored_b64, 'image_small': sl_b64})
    code = r.get('code')
    msg = r.get('msg', '')
    data = r.get('data', {})
    inner = data.get('data', '') if isinstance(data, dict) else data
    print(f"  type={tp}: code={code}, msg={msg}, result={str(inner)[:100]}")

print("\n4. 对比：未还原的背景图...")
for tp in ['10115', '10116', '10117']:
    r = call_yunma(tp, {'image': bg_raw_b64, 'image_small': sl_b64})
    code = r.get('code')
    msg = r.get('msg', '')
    data = r.get('data', {})
    inner = data.get('data', '') if isinstance(data, dict) else data
    print(f"  type={tp}: code={code}, msg={msg}, result={str(inner)[:100]}")

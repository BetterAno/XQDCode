"""
正确策略：对比full图和bg图的像素差来定位缺口
full = 完整图（无缺口，但也是打乱的）
bg = 背景图（有缺口，也是打乱的，与full使用相同shuffle）
直接做像素差，最大差异区域就是缺口
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
FULL_PATH = 'yrule/images/260/160/eYuq4H7wHNNOLjnHF83DUdzmfWsmIQef.webp'

bg_data = urllib.request.urlopen(STATIC + BG_PATH, timeout=10).read()
sl_data = urllib.request.urlopen(STATIC + SL_PATH, timeout=10).read()
full_data = urllib.request.urlopen(STATIC + FULL_PATH, timeout=10).read()

bg = np.array(Image.open(io.BytesIO(bg_data)).convert('RGB')).astype(float)
sl = np.array(Image.open(io.BytesIO(sl_data)).convert('RGBA'))
full = np.array(Image.open(io.BytesIO(full_data)).convert('RGB')).astype(float)

print(f"bg: {bg.shape}, sl: {sl.shape}, full: {full.shape}")

# 计算像素差
diff = np.abs(full - bg)
diff_mean = diff.mean(axis=2)  # 每像素的平均差异

# 保存差异图
diff_vis = (diff_mean / diff_mean.max() * 255).astype(np.uint8)
Image.fromarray(diff_vis).save('diff_map.png')
print(f"差异图已保存，最大差: {diff_mean.max():.1f}, 平均差: {diff_mean.mean():.1f}")

# 找差异最大的列（缺口在某个x范围）
col_diff = diff_mean.mean(axis=0)  # 每列的平均差异
print(f"\n每列平均差异（前20列）: {col_diff[:20].round(1)}")
print(f"最大差异的列: {col_diff.argmax()} (差={col_diff.max():.1f})")

# 找到差异最大区域的x坐标
# 滑块有效宽度约51px
sl_alpha = sl[:, :, 3]
sl_w = int(np.where(np.any(sl_alpha > 50, axis=0))[0][-1] - np.where(np.any(sl_alpha > 50, axis=0))[0][0]) + 1
sl_h_start = np.where(np.any(sl_alpha > 50, axis=1))[0][0]
sl_h_end = np.where(np.any(sl_alpha > 50, axis=1))[0][-1]
print(f"\n滑块有效区域: rows={sl_h_start}-{sl_h_end}, width≈{sl_w}")

# 在bg中搜索缺口（用diff_mean在滑块高度范围内找最暗区域）
diff_in_range = diff_mean[sl_h_start:sl_h_end+1, :]
col_diff_range = diff_in_range.mean(axis=0)

# 滑动窗口找最大差异区域
win_size = sl_w
scores = []
for x in range(0, len(col_diff_range) - win_size + 1):
    score = col_diff_range[x:x+win_size].mean()
    scores.append(score)

gap_x = np.argmax(scores)
print(f"\n缺口位置: x={gap_x} (滑动窗口最大差异={max(scores):.1f})")
print(f"前10个得分: {[round(s,1) for s in scores[:10]]}")
print(f"最高得分区域: {sorted(enumerate(scores), key=lambda x: -x[1])[:5]}")

# 用云码22222识别bg图（不还原，只用差异来找缺口）
def to_png_b64(img_data):
    if isinstance(img_data, bytes):
        img = Image.open(io.BytesIO(img_data)).convert('RGB')
    else:
        img = Image.fromarray(img_data.astype(np.uint8))
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

print("\n=== 测试云码22222识别bg图 ===")
r = call_yunma(to_png_b64(bg_data), '22222', extra='true')
print(f"  bg图: {json.dumps(r, ensure_ascii=False)[:300]}")

print("\n=== 测试云码22222识别diff可视化图 ===")
# 尝试传入差异可视化图
diff_color = np.zeros((diff_mean.shape[0], diff_mean.shape[1], 3), dtype=np.uint8)
diff_color[:, :, 0] = diff_vis  # 红色通道显示差异
r2 = call_yunma(to_png_b64(diff_color), '22222', extra='true')
print(f"  diff图: {json.dumps(r2, ensure_ascii=False)[:300]}")

"""
分析涂鸦验证码图片结构：
- bgUrl：被打乱的背景图（含缺口）
- sliceUrl：滑块图（拼图块）  
- fullUrl：完整未切割的背景图

通过对比bgUrl和fullUrl来理解shuffle的工作原理
"""
import urllib.request
import io
import numpy as np
from PIL import Image

STATIC = 'https://images.tuyacn.com/'
BG_PATH = 'yrule/images/bg/260/160/eYuq4H7wHNNOLjnHF83DUdzmfWsmIQef.webp'
SL_PATH = 'yrule/images/slice/260/160/eYuq4H7wHNNOLjnHF83DUdzmfWsmIQef.png'
FULL_PATH = 'yrule/images/260/160/eYuq4H7wHNNOLjnHF83DUdzmfWsmIQef.webp'  # fullUrl

print("下载图片...")
bg_data = urllib.request.urlopen(STATIC + BG_PATH, timeout=10).read()
sl_data = urllib.request.urlopen(STATIC + SL_PATH, timeout=10).read()
try:
    full_data = urllib.request.urlopen(STATIC + FULL_PATH, timeout=10).read()
    print(f"  bg={len(bg_data)}B, sl={len(sl_data)}B, full={len(full_data)}B")
    full_img = np.array(Image.open(io.BytesIO(full_data)).convert('RGB'))
    Image.fromarray(full_img).save('full_img.png')
    print(f"  full图片尺寸: {full_img.shape}")
except Exception as e:
    print(f"  full图片下载失败: {e}")

bg_img = np.array(Image.open(io.BytesIO(bg_data)).convert('RGB'))
sl_img = np.array(Image.open(io.BytesIO(sl_data)).convert('RGBA'))

print(f"\n背景图: {bg_img.shape}")
print(f"滑块图: {sl_img.shape}")

# 保存原图
Image.fromarray(bg_img).save('bg_shuffled.png')
Image.fromarray(sl_img).save('sl_orig.png')

# 分析滑块图的alpha通道
alpha = sl_img[:, :, 3]
print(f"\n滑块alpha: min={alpha.min()}, max={alpha.max()}")
non_zero_rows = np.where(np.any(alpha > 50, axis=1))[0]
non_zero_cols = np.where(np.any(alpha > 50, axis=0))[0]
if len(non_zero_rows) > 0:
    print(f"  有效行: {non_zero_rows[0]}-{non_zero_rows[-1]} (高度={non_zero_rows[-1]-non_zero_rows[0]+1})")
    print(f"  有效列: {non_zero_cols[0]}-{non_zero_cols[-1]} (宽度={non_zero_cols[-1]-non_zero_cols[0]+1})")

# 分析shuffle参数
SHUFFLE = [38, 41, 37, 12, 30, 42, 34, 32, 0, 8, 7, 5, 10, 48, 39, 17,
           49, 16, 14, 47, 51, 13, 40, 27, 15, 9, 1, 36, 26, 23, 43, 44,
           11, 18, 2, 35, 29, 22, 50, 6, 19, 45, 28, 46, 20, 3, 25, 21,
           4, 24, 33, 31]
print(f"\nSHUFFLE长度: {len(SHUFFLE)}")
print(f"SHUFFLE范围: {min(SHUFFLE)}-{max(SHUFFLE)}")
print(f"  52个元素 -> 可能4行x13列 = 52块")

# 尝试不同分块方式
h, w = bg_img.shape[:2]
print(f"\n图片尺寸: {w}x{h}")
for rows, cols in [(4, 13), (2, 26), (13, 4)]:
    bh = h // rows
    bw = w // cols
    print(f"  {rows}行x{cols}列: 每块{bw}x{bh}px, {rows*cols}块")

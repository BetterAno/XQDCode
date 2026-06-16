"""
正确的缺口检测方法：
1. 下载bg图（打乱+有缺口）和full图（打乱+无缺口）
2. full和bg是用同一个shuffle打乱的，像素差可以直接对比
3. 找到差异最大的区域就是缺口所在的小块
4. 通过shuffle反推：该小块在原图（还原后）的列位置 = 缺口的实际x坐标

关键：缺口在打乱图中的列位置 -> 对应小块的shuffle索引 -> 在还原图中的真实列
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
SHUFFLE = [38, 41, 37, 12, 30, 42, 34, 32, 0, 8, 7, 5, 10, 48, 39, 17,
           49, 16, 14, 47, 51, 13, 40, 27, 15, 9, 1, 36, 26, 23, 43, 44,
           11, 18, 2, 35, 29, 22, 50, 6, 19, 45, 28, 46, 20, 3, 25, 21,
           4, 24, 33, 31]

bg_data = urllib.request.urlopen(STATIC + BG_PATH, timeout=10).read()
sl_data = urllib.request.urlopen(STATIC + SL_PATH, timeout=10).read()
full_data = urllib.request.urlopen(STATIC + FULL_PATH, timeout=10).read()

bg = np.array(Image.open(io.BytesIO(bg_data)).convert('RGB')).astype(float)
sl = np.array(Image.open(io.BytesIO(sl_data)).convert('RGBA'))
full = np.array(Image.open(io.BytesIO(full_data)).convert('RGB')).astype(float)

rows, cols = 4, 13
h, w = bg.shape[:2]
bh, bw = h // rows, w // cols  # 40x20

# 计算像素差
diff = np.abs(full - bg).mean(axis=2)

# 每个小块的平均差异
block_diffs = np.zeros((rows, cols))
for r in range(rows):
    for c in range(cols):
        block = diff[r*bh:(r+1)*bh, c*bw:(c+1)*bw]
        block_diffs[r, c] = block.mean()

print("各行各列的平均差异:")
for r in range(rows):
    print(f"  行{r}: {block_diffs[r].round(2)}")

# 找差异最大的列（按列聚合）
col_block_diffs = block_diffs.max(axis=0)  # 每列的最大差异（跨行）
print(f"\n每列最大块差异: {col_block_diffs.round(2)}")
gap_col = np.argmax(col_block_diffs)
print(f"最大差异列: col={gap_col} (差={col_block_diffs[gap_col]:.2f})")

# 找哪个行的差异最大
gap_row = np.argmax(block_diffs[:, gap_col])
print(f"差异最大块: row={gap_row}, col={gap_col}")

# 该块的shuffle索引
block_idx = gap_row * cols + gap_col
print(f"该块在打乱图中的索引: {block_idx}")

# 找shuffle中等于block_idx的位置（逆映射）
# shuffle[i] = j 表示：打乱后第i块来自原图第j块
# 我们要找的是：打乱后第block_idx块在原图中的位置
# 所以找 SHUFFLE[i] == block_idx 的 i
orig_positions = [i for i, s in enumerate(SHUFFLE) if s == block_idx]
print(f"该块在原图（还原后）的位置: {orig_positions}")
if orig_positions:
    orig_idx = orig_positions[0]
    orig_r, orig_c = orig_idx // cols, orig_idx % cols
    gap_x_in_restored = orig_c * bw
    print(f"  -> 还原后: row={orig_r}, col={orig_c}, gap_x={gap_x_in_restored}")

# 另一种解法：如果bg是由原图按shuffle[i]=j方式打乱的
# bg第i块 = 原图第shuffle[i]块
# 我们找打乱后差异最大的块(block_idx)，它对应原图的shuffle[block_idx]
orig_idx2 = SHUFFLE[block_idx]
orig_r2, orig_c2 = orig_idx2 // cols, orig_idx2 % cols
gap_x2 = orig_c2 * bw
print(f"\n另一种解法：SHUFFLE[{block_idx}]={orig_idx2} -> 还原后row={orig_r2}, col={orig_c2}, gap_x={gap_x2}")

# 用滑块图确认缺口行
sl_alpha = sl[:, :, 3]
sl_h_start = np.where(np.any(sl_alpha > 50, axis=1))[0][0]
sl_h_end = np.where(np.any(sl_alpha > 50, axis=1))[0][-1]
sl_h_mid = (sl_h_start + sl_h_end) // 2
sl_row_in_blocks = sl_h_mid // bh
print(f"\n滑块垂直中心在第 {sl_row_in_blocks} 行")

# 只看滑块所在行的差异
row_for_gap = sl_row_in_blocks
col_diffs_in_row = block_diffs[row_for_gap, :]
gap_col_in_sl_row = np.argmax(col_diffs_in_row)
print(f"滑块行({row_for_gap})各列差异: {col_diffs_in_row.round(2)}")
print(f"滑块行最大差异列: col={gap_col_in_sl_row} (差={col_diffs_in_row[gap_col_in_sl_row]:.2f})")

block_idx_sl = row_for_gap * cols + gap_col_in_sl_row
orig_idx_sl = SHUFFLE[block_idx_sl]
orig_c_sl = orig_idx_sl % cols
final_gap_x = orig_c_sl * bw
print(f"\n最终估算缺口x坐标: {final_gap_x}px (在还原图中)")
print(f"（注：实际滑动距离可能需要减去滑块起始宽度，约3-5px）")

# 保存分析可视化
print("\n图片尺寸信息:")
print(f"  bg图: {w}x{h}, 分块: {bw}x{bh}, {rows}行x{cols}列")
print(f"  滑块有效区: rows {sl_h_start}-{sl_h_end}")

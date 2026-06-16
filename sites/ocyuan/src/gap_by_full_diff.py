"""
通过full图和bg图的像素差精确定位缺口（打乱后的坐标）

涂鸦验证码有三张图：
- bg: 打乱+有缺口（含缺口阴影）
- full: 打乱+无缺口（完整）
- slice: 滑块拼图块（未打乱）

full和bg用同一shuffle打乱，所以diff直接反映缺口位置。
diff最大的连续区域（宽度~滑块宽度）就是缺口在打乱坐标系中的位置。
SDK验证时也在打乱坐标系中操作，所以这个坐标可以直接用于拖拽。
"""
import urllib.request
import io
import numpy as np
from PIL import Image


def get_gap_from_diff(static_server, bg_url, sl_url, full_url):
    """通过full图减bg图找缺口"""
    bg_data = urllib.request.urlopen(static_server + bg_url, timeout=10).read()
    sl_data = urllib.request.urlopen(static_server + sl_url, timeout=10).read()
    full_data = urllib.request.urlopen(static_server + full_url, timeout=10).read()
    
    bg = np.array(Image.open(io.BytesIO(bg_data)).convert('RGB')).astype(float)
    sl = np.array(Image.open(io.BytesIO(sl_data)).convert('RGBA'))
    full = np.array(Image.open(io.BytesIO(full_data)).convert('RGB')).astype(float)
    
    # 滑块有效行范围
    alpha = sl[:, :, 3]
    sl_rows = np.where(np.any(alpha > 50, axis=1))[0]
    sl_cols = np.where(np.any(alpha > 50, axis=0))[0]
    if len(sl_rows) == 0 or len(sl_cols) == 0:
        return None, None
    
    sl_r0, sl_r1 = sl_rows[0], sl_rows[-1]
    sl_w = sl_cols[-1] - sl_cols[0] + 1
    
    # 像素差（只在滑块行范围内）
    diff = np.abs(full - bg).mean(axis=2)  # (h, w)
    diff_in_range = diff[sl_r0:sl_r1+1, :]  # 只看缺口所在行
    
    # 按列求差异
    col_diff = diff_in_range.mean(axis=0)
    
    # 滑动窗口找最大差异区域（宽度=滑块宽度）
    win = sl_w
    best_score = -1
    best_x = 0
    for x in range(0, len(col_diff) - win + 1):
        score = col_diff[x:x+win].mean()
        if score > best_score:
            best_score = score
            best_x = x
    
    # best_x是缺口左边缘在打乱后坐标系的位置
    gap_x_shuffled = best_x
    
    print(f"  滑块行范围: {sl_r0}-{sl_r1}, 宽度: {sl_w}px")
    print(f"  缺口在打乱坐标: x={gap_x_shuffled} (差异得分={best_score:.2f})")
    
    # 另外输出前5个最高分区域
    scores = [(col_diff[x:x+win].mean(), x) for x in range(0, len(col_diff) - win + 1)]
    scores.sort(reverse=True)
    print(f"  TOP5区域: {[(round(s,2),x) for s,x in scores[:5]]}")
    
    return gap_x_shuffled, best_score


# ===== 测试 =====
if __name__ == '__main__':
    STATIC = 'https://images.tuyacn.com/'
    BG = 'yrule/images/bg/260/160/eYuq4H7wHNNOLjnHF83DUdzmfWsmIQef.webp'
    SL = 'yrule/images/slice/260/160/eYuq4H7wHNNOLjnHF83DUdzmfWsmIQef.png'
    FULL = 'yrule/images/260/160/eYuq4H7wHNNOLjnHF83DUdzmfWsmIQef.webp'
    
    print("测试full-bg差分定位缺口...")
    gap_x, score = get_gap_from_diff(STATIC, BG, SL, FULL)
    print(f"\n结果: 缺口在打乱坐标 x={gap_x}, 得分={score:.2f}")
    print(f"拖拽距离 = {gap_x} (直接用缺口左边缘坐标，因为滑块从x=0出发)")

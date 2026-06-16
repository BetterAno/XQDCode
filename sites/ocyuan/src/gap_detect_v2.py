"""
改进的缺口检测：
1. 背景图中有一个缺口（阴影/洞区域）
2. 滑块图包含填入缺口的图案
3. 检测方法：用滑块图案的形状在背景图上找"最暗"或"最突变"的区域
"""
import urllib.request
import io
import numpy as np
from PIL import Image


def detect_gap_improved(bg_url, sl_url):
    """改进的缺口检测"""
    bg_data = urllib.request.urlopen(bg_url, timeout=10).read()
    sl_data = urllib.request.urlopen(sl_url, timeout=10).read()
    
    bg = np.array(Image.open(io.BytesIO(bg_data)).convert('RGB'))
    sl = np.array(Image.open(io.BytesIO(sl_data)).convert('RGBA'))
    
    alpha = sl[:, :, 3]
    rows = np.any(alpha > 50, axis=1)
    cols = np.any(alpha > 50, axis=0)
    
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    
    print(f"  bg: {bg.shape}, sl: {sl.shape}")
    print(f"  slice有效区域: rows={rmin}-{rmax}, cols={cmin}-{cmax}")
    
    h = rmax - rmin + 1
    w = cmax - cmin + 1
    
    # 提取滑块mask（有效像素区域）
    sl_mask = alpha[rmin:rmax+1, cmin:cmax+1] > 50  # h x w
    
    # 在背景图上滑动，找"最黑暗/最阴影"的区域
    # 缺口区域通常是深色阴影（背景原色上盖了一层暗层）
    bg_h, bg_w = bg.shape[:2]
    
    scores = []
    
    for x in range(0, bg_w - w + 1):
        region = bg[rmin:rmin+h, x:x+w, :]  # h x w x 3
        
        # 方法1：找最暗区域（缺口通常比周围暗）
        region_masked = region[sl_mask]
        mean_brightness = region_masked.mean()
        
        # 方法2：找边缘梯度最大区域
        # 计算区域内水平梯度
        if x > 0 and x + w < bg_w:
            left_col = bg[rmin:rmin+h, x-1, :]
            right_col = bg[rmin:rmin+h, x+w, :]
            edge_strength = (np.abs(region[:, 0, :].astype(float) - left_col.astype(float)).mean() +
                           np.abs(region[:, -1, :].astype(float) - right_col.astype(float)).mean())
        else:
            edge_strength = 0
        
        scores.append({
            'x': x,
            'brightness': mean_brightness,
            'edge': edge_strength
        })
    
    if not scores:
        return None
    
    # 找最暗区域（brightness最低）
    darkest = min(scores, key=lambda s: s['brightness'])
    print(f"  最暗区域: x={darkest['x']}, brightness={darkest['brightness']:.1f}")
    
    # 找边缘最强区域
    most_edge = max(scores, key=lambda s: s['edge'])
    print(f"  边缘最强: x={most_edge['x']}, edge={most_edge['edge']:.2f}")
    
    # 综合评分：缺口通常既暗又有强边缘
    # 标准化后加权
    max_bright = max(s['brightness'] for s in scores)
    min_bright = min(s['brightness'] for s in scores)
    max_edge = max(s['edge'] for s in scores)
    
    combined = []
    for s in scores:
        if max_bright > min_bright:
            norm_dark = 1 - (s['brightness'] - min_bright) / (max_bright - min_bright)
        else:
            norm_dark = 0
        if max_edge > 0:
            norm_edge = s['edge'] / max_edge
        else:
            norm_edge = 0
        score = norm_dark * 0.6 + norm_edge * 0.4
        combined.append((score, s['x']))
    
    combined.sort(reverse=True)
    best_x = combined[0][1]
    print(f"  综合评分最高: x={best_x}, score={combined[0][0]:.3f}")
    
    # 转换为实际缺口位置
    # cmin = 2（滑块有效内容从col 2开始），所以gap实际位置 = x + cmin
    gap_x = best_x + cmin
    print(f"  最终缺口位置: gap_x={gap_x}")
    
    return gap_x, scores


if __name__ == '__main__':
    # 测试最新的URL
    bg_url = 'https://images.tuyacn.com/yrule/images/bg/260/160/y01TrfyHAW8sJFwdezE6qkbKSH0RdO77.webp'
    sl_url = 'https://images.tuyacn.com/yrule/images/slice/260/160/y01TrfyHAW8sJFwdezE6qkbKSH0RdO77.png'
    
    result = detect_gap_improved(bg_url, sl_url)
    if result:
        gap_x, scores = result
        
        # 打印亮度分布（找低谷）
        print("\n亮度分布 (每10px一组):")
        bright_arr = [s['brightness'] for s in scores]
        for i in range(0, len(bright_arr), 10):
            chunk = bright_arr[i:i+10]
            avg = sum(chunk) / len(chunk)
            bar = '#' * int((200 - avg) / 10)
            print(f"  x={i:3d}-{i+10:3d}: {avg:6.1f} {bar}")

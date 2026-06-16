import cv2
import numpy as np
import json

# 读取元数据获取真实答案
with open('captcha_images/metadata.json', 'r') as f:
    metadata = json.load(f)

print('分析丰巢验证码图片特征...')
print('=' * 60)

for meta in metadata[:5]:  # 分析前5张
    idx = meta['index']
    true_answer = meta['pointY']
    
    bg = cv2.imread(f'captcha_images/bg_{idx}.png')
    block = cv2.imread(f'captcha_images/block_{idx}.png')
    
    if bg is None or block is None:
        continue
    
    bg_gray = cv2.cvtColor(bg, cv2.COLOR_BGR2GRAY)
    block_gray = cv2.cvtColor(block, cv2.COLOR_BGR2GRAY)
    
    print(f'\n图片 {idx}: 真实答案 pointY={true_answer}')
    print(f'  背景尺寸: {bg.shape[1]}x{bg.shape[0]} (宽x高)')
    print(f'  滑块尺寸: {block.shape[1]}x{block.shape[0]} (宽x高)')
    
    # 边缘检测
    bg_edges = cv2.Canny(bg_gray, 50, 150)
    
    # 统计每列的边缘数量
    edge_cols = np.sum(bg_edges > 0, axis=0)
    
    # 找边缘密度异常的位置（可能是缺口）
    # 计算边缘密度的变化
    edge_diff = np.abs(np.diff(edge_cols.astype(float)))
    
    # 找到边缘密度变化最大的位置
    if len(edge_diff) > 0:
        max_diff_pos = np.argmax(edge_diff)
        print(f'  边缘变化最大位置: 列{max_diff_pos}')
    
    # 使用滑动窗口找缺口
    window_size = 68  # 滑块宽度
    for search_x in range(50, 200, 10):
        if search_x + window_size > bg_gray.shape[1]:
            break
        
        # 获取该区域的边缘密度
        region_edges = edge_cols[search_x:search_x+window_size]
        std_val = np.std(region_edges)
        
        if std_val > 5:  # 边缘密度变化大，可能是缺口
            print(f'  候选缺口位置: {search_x}, 边缘标准差: {std_val:.2f}')
            break

print('\n' + '=' * 60)
print('分析完成')

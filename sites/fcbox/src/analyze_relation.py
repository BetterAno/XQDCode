import cv2
import numpy as np
import json

# 分析多张图片
with open('captcha_images/metadata.json', 'r') as f:
    metadata = json.load(f)

results = []
for meta in metadata:
    bg = cv2.imread('captcha_images/bg_' + str(meta['index']) + '.png')
    block = cv2.imread('captcha_images/block_' + str(meta['index']) + '.png')
    
    bg_gray = cv2.cvtColor(bg, cv2.COLOR_BGR2GRAY)
    block_gray = cv2.cvtColor(block, cv2.COLOR_BGR2GRAY)
    
    # 简单模板匹配
    result = cv2.matchTemplate(bg_gray, block_gray, cv2.TM_CCOEFF_NORMED)
    _, _, _, max_loc = cv2.minMaxLoc(result)
    
    results.append({
        'idx': meta['index'],
        'true': meta['pointY'],
        'detected': max_loc[0]
    })

print('pointY vs 检测结果对比:')
print()
for r in results:
    diff = r['detected'] - r['true']
    print(f'图片{r["idx"]}: true={r["true"]}, detected={r["detected"]}, diff={diff}')

print()
# 计算相关性
trues = [r['true'] for r in results]
detecteds = [r['detected'] for r in results]
corr = np.corrcoef(trues, detecteds)[0, 1]
print(f'pointY与检测结果相关性: {corr:.4f}')

print()
print('检测结果统计:')
print(f'  最小值: {min(detecteds)}')
print(f'  最大值: {max(detecteds)}')
print(f'  平均值: {np.mean(detecteds):.1f}')
print()
print('真实答案统计:')
print(f'  最小值: {min(trues)}')
print(f'  最大值: {max(trues)}')
print(f'  平均值: {np.mean(trues):.1f}')

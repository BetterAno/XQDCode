"""
丰巢登录 - 滑块验证码识别模块
使用OpenCV模板匹配检测滑块缺口位置
"""

import base64
import io
import random
import time
from typing import Tuple, List, Dict, Any

import cv2
import numpy as np

try:
    import ddddocr
    _ocr = ddddocr.DdddOcr(show_ad=False, beta=True)
except Exception:
    _ocr = None


def _base64_to_image(b64_str: str) -> np.ndarray:
    """Base64图片字符串转OpenCV图像"""
    if ',' in b64_str:
        b64_str = b64_str.split(',', 1)[1]
    img_bytes = base64.b64decode(b64_str)
    nparr = np.frombuffer(img_bytes, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)


def _base64_to_gray(b64_str: str) -> np.ndarray:
    """Base64图片转灰度图"""
    img = _base64_to_image(b64_str)
    return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)


def detect_gap_by_template(bg_base64: str, block_base64: str) -> int:
    """
    使用OpenCV模板匹配检测滑块缺口位置
    
    Args:
        bg_base64: 背景图base64
        block_base64: 滑块图base64
        
    Returns:
        缺口距离左边的像素位置
    """
    # 转换图片
    bg_gray = _base64_to_gray(bg_base64)
    block_gray = _base64_to_gray(block_base64)
    
    # 滑块图通常有白色边框，需要裁剪
    block_h, block_w = block_gray.shape
    bg_h, bg_w = bg_gray.shape
    
    # 尝试找到滑块中的非白色区域（真实拼图块）
    # 滑块通常是带缺口的白色块
    _, block_thresh = cv2.threshold(block_gray, 200, 255, cv2.THRESH_BINARY)
    
    # 查找轮廓确定滑块边界
    contours, _ = cv2.findContours(block_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if contours:
        # 找最大轮廓
        max_contour = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(max_contour)
        # 裁剪滑块
        block_gray = block_gray[y:y+h, x:x+w]
    
    # 使用模板匹配
    # 由于是找缺口位置，需要滑动滑块去匹配
    # 实际缺口位置 = 背景图缺口位置 = 滑块需要移动的距离
    
    # 滑块宽高（从截图中测量）
    block_h, block_w = block_gray.shape
    
    # 使用滑动窗口匹配
    best_match_x = 0
    best_match_score = float('inf')
    
    # 搜索范围：背景宽度 - 滑块宽度
    search_range = bg_w - block_w - 10
    
    for x in range(10, search_range, 2):
        # 提取模板区域
        template_region = bg_gray[10:block_h-10, x:x+block_w-10]
        
        if template_region.shape != block_gray[10:block_h-10, 10:block_w-10].shape:
            continue
            
        # 计算差异
        diff = cv2.absdiff(
            template_region, 
            block_gray[10:block_h-10, 10:block_w-10]
        )
        score = np.sum(diff)
        
        if score < best_match_score:
            best_match_score = score
            best_match_x = x
    
    # 由于滑块有缺口，需要考虑缺口偏移
    # 通常缺口在滑块左侧约1/3处
    gap_offset = int(block_w * 0.3)
    
    return best_match_x - gap_offset


def detect_gap_by_edge(bg_base64: str, block_base64: str) -> int:
    """
    使用边缘检测检测滑块缺口位置
    
    Args:
        bg_base64: 背景图base64
        block_base64: 滑块图base64
        
    Returns:
        缺口距离左边的像素位置
    """
    bg_gray = _base64_to_gray(bg_base64)
    block_gray = _base64_to_gray(block_base64)
    
    # 背景图边缘检测
    bg_edges = cv2.Canny(bg_gray, 50, 150)
    
    # 滑块图边缘检测
    block_edges = cv2.Canny(block_gray, 50, 150)
    
    # 滑块图尺寸
    block_h, block_w = block_edges.shape
    
    # 查找滑块中的边缘（缺口边缘）
    # 缺口通常是黑色/深色区域
    _, block_binary = cv2.threshold(block_gray, 127, 255, cv2.THRESH_BINARY_INV)
    
    # 查找边缘点
    block_contours, _ = cv2.findContours(block_binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # 计算滑块左边缘位置（相对于滑块图）
    left_edge = block_w // 10  # 默认位置
    
    # 找到最左边的深色区域边界
    for i in range(block_w // 4):
        col_sum = np.sum(block_binary[:, i])
        if col_sum > block_h * 50:  # 有明显边缘
            left_edge = i
            break
    
    # 滑动匹配
    best_x = 0
    best_score = float('inf')
    
    search_range = bg_gray.shape[1] - block_w - 20
    
    for x in range(20, search_range, 3):
        region = bg_gray[5:block_h-5, x:x+block_w-10]
        if region.shape[1] != block_w - 10:
            continue
            
        # 计算边缘差异
        bg_edge_region = bg_edges[5:block_h-5, x:x+block_w-10]
        diff = cv2.absdiff(bg_edge_region, block_edges[5:block_h-5, 10:block_w])
        score = np.sum(diff)
        
        if score < best_score:
            best_score = score
            best_x = x
    
    # 返回缺口位置（滑块需要移动的距离）
    return best_x


def detect_gap_simple(bg_base64: str, block_base64: str) -> int:
    """
    使用相关性匹配检测滑块缺口位置
    背景图是带缺口的图，滑块图是拼图块
    
    Args:
        bg_base64: 背景图base64 (带缺口)
        block_base64: 滑块图base64 (拼图块)
        
    Returns:
        缺口距离左边的像素位置
    """
    try:
        bg_gray = _base64_to_gray(bg_base64)
        block_gray = _base64_to_gray(block_base64)
        
        bg_h, bg_w = bg_gray.shape
        block_h, block_w = block_gray.shape
        
        print(f"背景图尺寸: {bg_w}x{bg_h}, 滑块尺寸: {block_w}x{block_h}")
        
        # 在背景图上滑动滑块，找最佳匹配位置
        # 使用TM_CCOEFF_NORMED相关性匹配
        method = cv2.TM_CCOEFF_NORMED
        
        # 滑块去边框处理
        # 滑块通常有白色边框，需要裁剪
        _, block_thresh = cv2.threshold(block_gray, 200, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(block_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            max_contour = max(contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(max_contour)
            # 裁剪边框
            padding = 3
            block_crop = block_gray[y+padding:y+h-padding, x+padding:x+w-padding]
        else:
            block_crop = block_gray
        
        # 如果裁剪后太小，使用原图
        if block_crop.shape[0] < 10 or block_crop.shape[1] < 10:
            block_crop = block_gray
        
        print(f"裁剪后滑块尺寸: {block_crop.shape}")
        
        # 搜索范围
        step = 2
        start_x = 20
        end_x = bg_w - block_w - 20
        
        best_x = bg_w // 2
        best_score = -1
        
        for x in range(start_x, end_x, step):
            bg_region = bg_gray[0:block_h, x:x+block_w]
            
            # 调整大小确保匹配
            if bg_region.shape != block_crop.shape:
                bg_region = cv2.resize(bg_region, (block_crop.shape[1], block_crop.shape[0]))
            
            # 相关性匹配
            result = cv2.matchTemplate(
                bg_region.astype(np.float32), 
                block_crop.astype(np.float32), 
                method
            )
            _, max_val, _, _ = cv2.minMaxLoc(result)
            
            if max_val > best_score:
                best_score = max_val
                best_x = x
        
        print(f"最佳匹配位置: {best_x}, 匹配度: {best_score:.3f}")
        
        # 拼图块缺口偏移（滑块左侧有缺口）
        gap_offset = block_w // 3
        
        return max(10, best_x - gap_offset)
    except Exception as e:
        print(f"缺口检测异常: {e}")
        import traceback
        traceback.print_exc()
        return 100  # 默认位置


def generate_trajectory(target_x: int, target_y: int = 0) -> List[Dict[str, Any]]:
    """
    生成人类-like滑动轨迹
    
    Args:
        target_x: 目标x坐标
        target_y: 目标y坐标
        
    Returns:
        轨迹点列表 [{'x': int, 'y': int, 'time': int}, ...]
    """
    trajectory = []
    
    # 起始位置
    start_x = 0
    start_y = random.randint(10, 20)
    start_time = int(time.time() * 1000)
    
    # 总距离
    total_distance = target_x - start_x
    
    # 轨迹点数
    num_points = random.randint(30, 50)
    
    # 生成带加速-减速的轨迹
    for i in range(num_points):
        # 进度
        progress = i / (num_points - 1)
        
        # 缓动函数（先快后慢）
        if progress < 0.6:
            ease = progress / 0.6 * 0.7
        else:
            ease = 0.7 + (progress - 0.6) / 0.4 * 0.3
        
        # 添加随机抖动
        jitter = random.uniform(-2, 2)
        
        x = int(start_x + total_distance * ease + jitter)
        y = start_y + int(random.uniform(-3, 3))
        
        # 时间间隔（先快后慢）
        if i < num_points * 0.3:
            interval = random.randint(8, 15)
        else:
            interval = random.randint(15, 30)
        
        trajectory.append({
            'x': max(0, x),
            'y': max(0, y),
            'time': start_time + sum(p['time'] for p in trajectory[-29:] if len(trajectory) > 0) + interval if i > 0 else 0
        })
    
    # 确保最后一个点是目标位置
    if trajectory:
        trajectory[-1]['x'] = target_x
        trajectory[-1]['y'] = target_y
    
    return trajectory


def solve_slider(bg_base64: str, block_base64: str) -> Tuple[int, List[Dict[str, Any]]]:
    """
    解决滑块验证码
    
    Args:
        bg_base64: 背景图base64
        block_base64: 滑块图base64
        
    Returns:
        (缺口位置, 滑动轨迹)
    """
    # 检测缺口位置
    gap_x = detect_gap_simple(bg_base64, block_base64)
    
    # 确保位置合理
    gap_x = max(20, min(gap_x, 260))
    
    # 生成轨迹
    trajectory = generate_trajectory(gap_x)
    
    return gap_x, trajectory


if __name__ == "__main__":
    # 测试
    print("=== 滑块验证码识别测试 ===")
    print("检测函数: detect_gap_simple, generate_trajectory")
    print("轨迹生成: 生成30-50个点的带加速-减速轨迹")

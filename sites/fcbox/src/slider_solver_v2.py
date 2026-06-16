"""
丰巢登录 - 滑块验证码识别模块 (v2.0)
基于JS源码逆向的精确实现

关键发现:
1. 背景图带缺口，滑块图是拼图块
2. 缺口检测使用边缘匹配
3. 轨迹格式: {x, y, time}
   x = Math.round(offsetX / (clientWidth / 4.2 / 100)) + sliderX
   y = sliderY (固定值)
   time = Date.now()
4. 轨迹字符串: x + '' + y + time
5. 签名字符串: clientIp + checkId + uuid + trackStr
"""

import base64
import io
import random
import time
import math
from typing import Tuple, List, Dict, Any, Optional

import cv2
import numpy as np


# ==================== 图片处理工具 ====================

def _base64_to_image(b64_str: str) -> np.ndarray:
    """Base64图片字符串转OpenCV图像"""
    if not b64_str or len(b64_str) < 100:
        raise ValueError("Invalid base64 string")
    if ',' in b64_str:
        b64_str = b64_str.split(',', 1)[1]
    # 清理可能存在的data URL前缀
    b64_str = b64_str.strip()
    img_bytes = base64.b64decode(b64_str)
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Failed to decode image")
    return img


def _base64_to_gray(b64_str: str) -> np.ndarray:
    """Base64图片转灰度图"""
    img = _base64_to_image(b64_str)
    return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)


def _download_and_decode_image(url_or_b64: str, session=None) -> Optional[np.ndarray]:
    """
    下载或解码图片
    支持URL下载或直接base64解码
    """
    if not url_or_b64:
        return None
    
    # 如果是data URL或纯base64
    if 'data:image' in url_or_b64 or '/' not in url_or_b64[:30]:
        try:
            return _base64_to_image(url_or_b64)
        except Exception:
            return None
    
    # URL下载
    if session:
        try:
            resp = session.get(url_or_b64, timeout=10)
            if resp.status_code == 200:
                nparr = np.frombuffer(resp.content, np.uint8)
                return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception:
            pass
    
    return None


# ==================== 缺口检测算法 ====================

def detect_gap_edge_match(bg_base64: str, block_base64: str) -> int:
    """
    使用边缘匹配检测滑块缺口位置 (v2)
    
    原理:
    - 背景图有缺口阴影
    - 滑块图是拼图块
    - 滑块需要向左移动使拼图块填充缺口
    
    Returns:
        缺口中心x坐标 (像素)
    """
    try:
        # 解码图片
        bg_img = _base64_to_image(bg_base64)
        block_img = _base64_to_image(block_base64)
        
        bg_gray = cv2.cvtColor(bg_img, cv2.COLOR_BGR2GRAY)
        block_gray = cv2.cvtColor(block_img, cv2.COLOR_BGR2GRAY)
        
        bg_h, bg_w = bg_gray.shape
        block_h, block_w = block_gray.shape
        
        print(f"[缺口检测] 背景: {bg_w}x{bg_h}, 滑块: {block_w}x{block_h}")
        
        # 滑块图处理: 提取拼图块(去除白色背景边框)
        # 丰巢滑块是68x68, 实际拼图块约50x50
        _, block_thresh = cv2.threshold(block_gray, 250, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(block_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            max_contour = max(contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(max_contour)
            # 裁剪掉白色边框,留出拼图内容
            padding = 5
            block_inner = block_gray[
                max(0, y + padding):min(block_h, y + h - padding),
                max(0, x + padding):min(block_w, x + w - padding)
            ]
        else:
            block_inner = block_gray[5:block_h-5, 5:block_w-5]
        
        if block_inner.size == 0:
            block_inner = block_gray
        
        inner_h, inner_w = block_inner.shape
        print(f"[缺口检测] 滑块内芯: {inner_w}x{inner_h}")
        
        # 边缘检测
        block_edges = cv2.Canny(block_inner, 100, 200)
        bg_edges = cv2.Canny(bg_gray, 100, 200)
        
        # 搜索最佳匹配位置
        # 缺口在背景图上的位置
        best_x = bg_w // 2
        best_score = -1
        
        # 滑块通常在左侧,缺口搜索范围
        min_search = 20
        max_search = bg_w - inner_w - 20
        step = 2
        
        for x in range(min_search, max_search, step):
            # 提取背景图对应区域
            bg_region = bg_edges[0:inner_h, x:x+inner_w]
            
            if bg_region.shape != block_inner.shape:
                bg_region = cv2.resize(bg_region, (block_inner.shape[1], block_inner.shape[0]))
            
            # 计算边缘匹配度
            correlation = cv2.matchTemplate(
                bg_region.astype(np.float32),
                block_edges.astype(np.float32),
                cv2.TM_CCOEFF_NORMED
            )
            
            _, max_val, _, _ = cv2.minMaxLoc(correlation)
            
            if max_val > best_score:
                best_score = max_val
                best_x = x
        
        print(f"[缺口检测] 最佳匹配: x={best_x}, score={best_score:.3f}")
        
        # 考虑滑块宽度偏移,缺口中心通常在滑块左侧1/3处
        # 实际缺口位置 = 滑块块需要移动到的位置
        gap_offset = inner_w // 3
        
        return max(10, best_x + gap_offset)
        
    except Exception as e:
        print(f"[缺口检测] 异常: {e}")
        import traceback
        traceback.print_exc()
        return 100


def detect_gap_histogram(bg_base64: str, block_base64: str) -> int:
    """
    使用直方图差异检测缺口位置
    
    原理: 滑块缺失区域会导致背景图该位置的颜色分布异常
    """
    try:
        bg_gray = _base64_to_gray(bg_base64)
        block_gray = _base64_to_gray(block_base64)
        
        bg_h, bg_w = bg_gray.shape
        
        # 计算每列的颜色差异
        # 缺口区域通常颜色较深(阴影)
        diffs = []
        
        for x in range(10, bg_w - 50, 2):
            # 取一块区域
            region = bg_gray[10:bg_h-10, x:x+40]
            
            # 计算直方图
            hist = cv2.calcHist([region], [0], None, [256], [0, 256])
            
            # 计算低亮度像素比例(缺口通常是深色的)
            dark_ratio = np.sum(hist[:100]) / np.sum(hist)
            diffs.append((x, dark_ratio))
        
        # 找暗区(缺口)
        if diffs:
            # 取暗区中心
            avg_dark = np.mean([d[1] for d in diffs])
            candidates = [x for x, r in diffs if r > avg_dark * 1.2]
            
            if candidates:
                return candidates[len(candidates)//2]
        
        return bg_w // 3
        
    except Exception as e:
        print(f"[缺口检测] 直方图方法异常: {e}")
        return 100


def detect_gap_template_match(bg_base64: str, block_base64: str) -> int:
    """
    滑块拼图块模板匹配
    
    滑块图中的拼图块需要与背景图中的缺口位置匹配
    """
    try:
        bg_img = _base64_to_image(bg_base64)
        block_img = _base64_to_image(block_base64)
        
        bg_gray = cv2.cvtColor(bg_img, cv2.COLOR_BGR2GRAY)
        block_gray = cv2.cvtColor(block_img, cv2.COLOR_BGR2GRAY)
        
        bg_h, bg_w = bg_gray.shape
        block_h, block_w = block_gray.shape
        
        # 滑块去白色边框
        _, binary = cv2.threshold(block_gray, 240, 255, cv2.THRESH_BINARY_INV)
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            # 取最大轮廓
            largest = max(contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(largest)
            
            # 裁剪滑块主体(保留拼图形状)
            padding = 3
            template = block_gray[y+padding:y+h-padding, x+padding:x+w-padding]
        else:
            template = block_gray[5:block_h-5, 5:block_w-5]
        
        if template.size == 0:
            template = block_gray
        
        # 模板匹配
        result = cv2.matchTemplate(bg_gray, template, cv2.TM_CCOEFF_NORMED)
        _, max_val, _, max_loc = cv2.minMaxLoc(result)
        
        print(f"[缺口检测] 模板匹配: x={max_loc[0]}, score={max_val:.3f}")
        
        # 拼图块需要移动到缺口位置
        # 返回的是滑块左边缘应该到达的位置
        return max_loc[0] + template.shape[1] // 3
        
    except Exception as e:
        print(f"[缺口检测] 模板匹配异常: {e}")
        return 100


def detect_gap_v3(bg_base64: str, block_base64: str) -> int:
    """
    综合多种方法检测缺口
    
    1. 先用边缘匹配找大致位置
    2. 再用模板匹配精修
    """
    try:
        # 方法1: 边缘匹配
        pos1 = detect_gap_edge_match(bg_base64, block_base64)
        
        # 方法2: 模板匹配
        pos2 = detect_gap_template_match(bg_base64, block_base64)
        
        # 方法3: 直方图
        pos3 = detect_gap_histogram(bg_base64, block_base64)
        
        # 加权平均
        positions = [pos1, pos2, pos3]
        print(f"[缺口检测] 多方法结果: {positions}")
        
        # 去掉极值,取平均
        positions.sort()
        return positions[1]  # 中位数
        
    except Exception as e:
        print(f"[缺口检测] 综合方法异常: {e}")
        return 100


# ==================== 轨迹生成算法 ====================

def generate_track_string(trajectory: List[Dict[str, Any]]) -> str:
    """
    生成轨迹字符串 (根据JS逆向)
    
    JS代码: 
      trackStr += point.x + '' + point.y + point.time
    
    Returns:
        轨迹字符串, 如 "4000000400000169812345678900..."
    """
    track_str = ""
    for point in trajectory:
        track_str += str(point['x']) + str(point['y']) + str(point['time'])
    return track_str


def calculate_sign(client_ip: str, check_id: str, uuid: str, 
                   trajectory: List[Dict[str, Any]]) -> str:
    """
    计算签名 (根据JS逆向)
    
    JS代码:
      signStr = clientIp + checkId + uuid + trackStr
      sign = MD5(signStr)
    
    Returns:
        MD5签名字符串
    """
    import hashlib
    
    track_str = generate_track_string(trajectory)
    sign_str = client_ip + check_id + uuid + track_str
    
    return hashlib.md5(sign_str.encode()).hexdigest()


def generate_human_trajectory(slider_x: int, slider_y: int, 
                              target_offset: float, 
                              duration_ms: int = None) -> List[Dict[str, Any]]:
    """
    生成人类-like滑动轨迹 (根据JS逆向规则)
    
    JS代码分析:
      // 滑动中记录轨迹
      var x = Math.round(sliderLeft / (clientWidth / 4.2 / 100)) + sliderX;
      var y = sliderY;  // 固定值
      var time = Date.now();
    
    关键参数:
      - sliderX: 400000 (从服务器返回)
      - sliderY: 随机值 (从服务器返回)
      - sliderLeft: 实际滑动距离(像素)
      - clientWidth / 4.2: 缩放因子(约80.95)
    
    Args:
        slider_x: sliderX (默认400000)
        slider_y: sliderY (从服务器获取)
        target_offset: 目标滑动距离(像素)
        duration_ms: 滑动总时长(毫秒)
        
    Returns:
        轨迹点列表 [{'x': int, 'y': int, 'time': int}, ...]
    """
    import hashlib
    
    trajectory = []
    
    # 基础时间戳
    base_time = int(time.time() * 1000)
    
    # 默认滑动时长 1-2秒
    if duration_ms is None:
        duration_ms = random.randint(1000, 2000)
    
    # 轨迹点数
    num_points = random.randint(25, 45)
    
    # 生成带加速-减速的轨迹
    for i in range(num_points):
        # 进度 (0-1)
        progress = i / (num_points - 1)
        
        # 缓动函数: 先慢后快再慢
        if progress < 0.3:
            ease = 0.5 * (progress / 0.3) ** 2
        elif progress < 0.7:
            ease = 0.5 + (progress - 0.3) / 0.4 * 0.3
        else:
            ease = 0.8 + 0.2 * (1 - ((progress - 0.7) / 0.3) ** 2)
        
        # 添加随机抖动
        jitter = random.uniform(-3, 3)
        
        # 当前滑动距离
        current_offset = target_offset * ease + jitter
        
        # x坐标 = Math.round(offset / (clientWidth / 4.2 / 100)) + sliderX
        # clientWidth / 4.2 / 100 ≈ 0.8
        x_coord = int(round(current_offset / 0.8)) + slider_x
        
        # y坐标 = sliderY + 小抖动
        y_coord = slider_y + random.randint(-100, 100)
        
        # 时间戳
        time_offset = int(duration_ms * progress)
        timestamp = base_time + time_offset
        
        trajectory.append({
            'x': x_coord,
            'y': y_coord,
            'time': timestamp
        })
    
    # 确保最后一个点是目标位置
    if trajectory:
        final_x = int(round(target_offset / 0.8)) + slider_x
        trajectory[-1]['x'] = final_x
        trajectory[-1]['y'] = slider_y
        trajectory[-1]['time'] = base_time + duration_ms
    
    return trajectory


def generate_simple_trajectory(target_offset: int, slider_x: int = 400000, 
                              slider_y: int = 400000) -> List[Dict[str, Any]]:
    """
    简化版轨迹生成
    
    Args:
        target_offset: 目标滑动距离(像素)
        slider_x: sliderX (默认400000)
        slider_y: sliderY (默认400000)
        
    Returns:
        轨迹点列表
    """
    trajectory = []
    base_time = int(time.time() * 1000)
    
    # 轨迹点数
    num_points = random.randint(20, 35)
    
    for i in range(num_points):
        # 进度
        progress = i / (num_points - 1)
        
        # 使用正弦函数生成平滑曲线
        ease = 0.5 * (1 - math.cos(progress * math.pi))
        
        # 随机抖动
        jitter = random.uniform(-2, 2)
        
        # x坐标
        x_coord = int(round(target_offset * ease + jitter) / 0.8) + slider_x
        
        # y坐标
        y_coord = slider_y + random.randint(-50, 50)
        
        # 时间
        timestamp = base_time + int(progress * 1500)
        
        trajectory.append({
            'x': x_coord,
            'y': y_coord,
            'time': timestamp
        })
    
    # 修正最后一点
    if trajectory:
        trajectory[-1]['x'] = int(target_offset / 0.8) + slider_x
        trajectory[-1]['y'] = slider_y
    
    return trajectory


# ==================== 主入口 ====================

def detect_gap(bg_base64: str, block_base64: str) -> int:
    """
    检测滑块缺口位置 (默认使用v3综合方法)
    """
    return detect_gap_v3(bg_base64, block_base64)


def solve_slider(bg_base64: str, block_base64: str,
                slider_x: int = 400000, slider_y: int = 400000) -> Tuple[int, List[Dict[str, Any]]]:
    """
    解决滑块验证码
    
    Args:
        bg_base64: 背景图base64
        block_base64: 滑块图base64
        slider_x: 服务器返回的sliderX
        slider_y: 服务器返回的sliderY
        
    Returns:
        (缺口位置, 滑动轨迹)
    """
    # 检测缺口位置
    gap_x = detect_gap_v3(bg_base64, block_base64)
    
    # 确保位置合理
    gap_x = max(15, min(gap_x, 280))
    
    print(f"[滑块解决] 检测到缺口位置: {gap_x}px")
    
    # 生成轨迹
    trajectory = generate_simple_trajectory(gap_x, slider_x, slider_y)
    
    print(f"[滑块解决] 生成轨迹点数: {len(trajectory)}")
    
    return gap_x, trajectory


if __name__ == "__main__":
    print("=== 丰巢滑块验证码识别模块 v2.0 ===")
    print("检测函数: detect_gap_v3")
    print("轨迹格式: {x, y, time}")
    print("x坐标规则: round(offset / 0.8) + sliderX")

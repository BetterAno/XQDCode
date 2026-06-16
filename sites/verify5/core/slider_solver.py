"""
Verify5 滑块缺口识别与轨迹生成

识别算法: OpenCV Canny 边缘检测 + 模板匹配
轨迹生成: 模拟人类拖动行为 (加速 → 匀速 → 减速 → 微调)
"""

import random
import time
import math
import base64
import json
import os
import logging
from typing import List, Tuple, Optional, Union

try:
    import cv2
    import numpy as np
    HAS_OPENCV = True
except ImportError:
    HAS_OPENCV = False

from core.yunma_api import YunmaClient, YunmaError

logger = logging.getLogger(__name__)

# 全局云码客户端 (懒加载)
_yunma_client: Optional[YunmaClient] = None
def _get_yunma_client() -> Optional[YunmaClient]:
    """Get or create Yunma client instance"""
    global _yunma_client
    if _yunma_client is not None:
        return _yunma_client
    config_path = os.path.join(os.path.dirname(__file__), "..", "config", "config.json")
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            config = json.load(f)
        yunma_cfg = config.get("yunma", {})
        if not yunma_cfg.get("enabled", True):
            logger.info("Yunma is disabled in config")
            return None
        token = yunma_cfg.get("token", "")
        if not token:
            logger.warning("Yunma token not configured")
            return None
        _yunma_client = YunmaClient(
            token=token,
            distance_correction=yunma_cfg.get("distance_correction", 0),
            max_retries=yunma_cfg.get("max_retries", 3),
            base_delay=yunma_cfg.get("base_delay", 1.0),
            timeout=yunma_cfg.get("timeout", 30),
        )
        logger.info(f"Yunma client initialized, correction={_yunma_client.distance_correction}")
        return _yunma_client
    except Exception as e:
        logger.warning(f"Failed to init Yunma client: {e}")
        return None


def init_yunma_client(token, distance_correction=0, max_retries=3, base_delay=1.0, timeout=30):
    """Initialize Yunma client explicitly"""
    global _yunma_client
    _yunma_client = YunmaClient(
        token=token, distance_correction=distance_correction,
        max_retries=max_retries, base_delay=base_delay, timeout=timeout,
    )
    logger.info(f"Yunma client explicitly initialized with correction={distance_correction}")
    return _yunma_client





def detect_gap_canny(bg_img_path: str, slice_img_path: str) -> Tuple[Optional[float], dict]:
    """
    使用 Canny 边缘检测定位滑块缺口位置
    
    Args:
        bg_img_path: 背景图路径
        slice_img_path: 滑块图路径
    
    Returns:
        (distance, debug_info)
        distance: 缺口距离 (像素) 或 None
    """
    if not HAS_OPENCV:
        return None, {"error": "OpenCV not installed"}
    
    debug = {}
    
    # 读取图片
    bg = cv2.imread(bg_img_path)
    if bg is None:
        # 尝试从 URL 读取 (需要 requests)
        import requests
        resp = requests.get(bg_img_path, timeout=10)
        bg = cv2.imdecode(np.frombuffer(resp.content, np.uint8), cv2.IMREAD_COLOR)
        if bg is None:
            return None, {"error": "Cannot load background image"}
    
    slice_img = cv2.imread(slice_img_path)
    if slice_img is None:
        import requests
        resp = requests.get(slice_img_path, timeout=10)
        slice_img = cv2.imdecode(np.frombuffer(resp.content, np.uint8), cv2.IMREAD_COLOR)
        if slice_img is None:
            return None, {"error": "Cannot load slice image"}
    
    bg_h, bg_w = bg.shape[:2]
    slice_h, slice_w = slice_img.shape[:2]
    debug["bg_size"] = (bg_w, bg_h)
    debug["slice_size"] = (slice_w, slice_h)
    
    # 转换灰度
    bg_gray = cv2.cvtColor(bg, cv2.COLOR_BGR2GRAY)
    slice_gray = cv2.cvtColor(slice_img, cv2.COLOR_BGR2GRAY)
    
    # Canny 边缘检测
    bg_edges = cv2.Canny(bg_gray, 80, 180)
    slice_edges = cv2.Canny(slice_gray, 80, 180)
    
    # 模板匹配 - 在背景边缘图上搜索滑块边缘图
    result = cv2.matchTemplate(bg_edges, slice_edges, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
    
    debug["confidence"] = float(max_val)
    debug["match_location"] = max_loc
    
    # 计算实际滑块偏移 (模板匹配返回左上角)
    distance = max_loc[0]
    
    return distance, debug


def detect_gap_multi_canny(bg_img_path: str, slice_img_path: str) -> Tuple[Optional[float], dict]:
    """
    多种 Canny 参数组合检测，取最高置信度的结果
    
    与原 Canny 检测类似，但使用多组参数来提高成功率
    """
    if not HAS_OPENCV:
        return None, {"error": "OpenCV not installed"}
    
    import requests
    import numpy as np
    
    # 读取图片
    resp = requests.get(bg_img_path, timeout=10)
    bg = cv2.imdecode(np.frombuffer(resp.content, np.uint8), cv2.IMREAD_COLOR)
    if bg is None:
        return None, {"error": "Cannot load bg image"}
    
    resp = requests.get(slice_img_path, timeout=10)
    slice_img = cv2.imdecode(np.frombuffer(resp.content, np.uint8), cv2.IMREAD_COLOR)
    if slice_img is None:
        return None, {"error": "Cannot load slice image"}
    
    bg_gray = cv2.cvtColor(bg, cv2.COLOR_BGR2GRAY)
    slice_gray = cv2.cvtColor(slice_img, cv2.COLOR_BGR2GRAY)
    
    # 多组 Canny 参数
    canny_params = [
        (50, 150),
        (80, 180),
        (100, 200),
        (60, 160),
        (40, 140),
    ]
    
    best_distance = None
    best_confidence = -1
    best_debug = {}
    
    for low, high in canny_params:
        bg_edges = cv2.Canny(bg_gray, low, high)
        slice_edges = cv2.Canny(slice_gray, low, high)
        
        result = cv2.matchTemplate(bg_edges, slice_edges, cv2.TM_CCOEFF_NORMED)
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
        
        if max_val > best_confidence:
            best_confidence = float(max_val)
            best_distance = max_loc[0]
            best_debug = {
                "canny_params": (low, high),
                "confidence": float(max_val),
                "match_location": max_loc,
            }
    
    return best_distance, best_debug


def detect_gap_yunma(
    bg_img: Union[str, bytes],
    slice_img: Union[str, bytes],
    token: str = None,
    distance_correction: int = None,
) -> Tuple[Optional[float], dict]:
    """
    使用云码 API 识别滑块缺口位置

    支持两种输入方式:
    1. 文件路径 (str): detect_gap_yunma("bg.png", "slice.png")
    2. bytes 数据 (bytes): detect_gap_yunma(bg_bytes, slice_bytes)

    Args:
        bg_img: 背景图 (文件路径或 bytes)
        slice_img: 滑块图 (文件路径或 bytes)
        token: 云码 token (可选, 不提供则使用配置文件中的)
        distance_correction: 距离校正值 (可选, 覆盖配置文件中的值)

    Returns:
        (distance, debug_info)
        distance: 校正后的缺口距离 (像素) 或 None
        debug_info: {
            "method": "yunma",
            "success": bool,
            "raw_distance": int | None,
            "correction": int,
            "api_time_ms": str,
            "retry_count": int,
            "error": str | None,
        }
    """
    debug = {
        "method": "yunma",
        "success": False,
        "raw_distance": None,
        "correction": distance_correction or 0,
        "api_time_ms": "N/A",
        "retry_count": 0,
        "error": None,
    }

    client = None

    # 方式 1: 直接用 token 创建临时客户端
    if token:
        correction = distance_correction if distance_correction is not None else 0
        client = YunmaClient(token=token, distance_correction=correction)
        logger.info(f"Using temporary YunmaClient with explicit token")
    else:
        # 方式 2: 使用全局/配置客户端
        client = _get_yunma_client()
        if client is None:
            debug["error"] = "Yunma client not available (no token configured)"
            logger.warning(debug["error"])
            return None, debug

        # 覆盖配置中的校正值
        if distance_correction is not None:
            client.distance_correction = distance_correction

    debug["correction"] = client.distance_correction

    # 调用识别
    try:
        distance, yunma_debug = client.recognize(
            slide_image=slice_img,
            background_image=bg_img,
        )
    except YunmaError as e:
        debug["error"] = str(e)
        logger.error(f"Yunma recognition failed: {e}")
        return None, debug

    if distance is None:
        debug["error"] = yunma_debug.get("error", "Unknown yunma error")
        debug["retry_count"] = yunma_debug.get("retry_count", 0)
        logger.warning(f"Yunma recognition failed: {debug['error']}")
        return None, debug

    debug["success"] = True
    debug["raw_distance"] = yunma_debug.get("raw_distance")
    debug["api_time_ms"] = yunma_debug.get("api_time_ms", "N/A")
    debug["retry_count"] = yunma_debug.get("retry_count", 0)

    logger.info(
        f"Yunma detected gap: raw={yunma_debug.get('raw_distance')}px, "
        f"corrected={distance}px, conf=N/A (API), "
        f"time={yunma_debug.get('api_time_ms')}ms"
    )

    return float(distance), debug


def detect_gap_hybrid(
    bg_img: Union[str, bytes],
    slice_img: Union[str, bytes],
    confidence_threshold: float = 0.6,
    yunma_token: str = None,
    yunma_correction: int = None,
) -> Tuple[Optional[float], dict]:
    """
    混合缺口检测: OpenCV 优先，失败/低置信度时回退到云码

    策略:
    1. 首先尝试 OpenCV Canny 多参数检测
    2. 如果 confidence >= confidence_threshold: 使用 OpenCV 结果
    3. 否则: 回退到云码 API 识别

    Args:
        bg_img: 背景图 (文件路径或 bytes)
        slice_img: 滑块图 (文件路径或 bytes)
        confidence_threshold: OpenCV 置信度阈值 (低于此值回退到云码)
        yunma_token: 云码 token (可选)
        yunma_correction: 云码距离校正值 (可选)

    Returns:
        (distance, debug_info)
        - distance: 缺口距离 (像素) 或 None
        - debug_info["method"]: "opencv_canny" | "yunma" | "none"
    """
    # Step 1: OpenCV 检测
    if HAS_OPENCV:
        ocv_distance, ocv_debug = detect_gap_multi_canny(bg_img, slice_img)

        if ocv_distance is not None:
            confidence = ocv_debug.get("confidence", 0)

            if confidence >= confidence_threshold:
                logger.info(
                    f"Hybrid detection: OpenCV SUCCESS "
                    f"(distance={ocv_distance}px, confidence={confidence:.3f})"
                )
                ocv_debug["method"] = "opencv_canny"
                return float(ocv_distance), ocv_debug

            logger.info(
                f"Hybrid detection: OpenCV confidence ({confidence:.3f}) "
                f"below threshold ({confidence_threshold}), falling back to Yunma"
            )

    # Step 2: 云码回退
    yunma_distance, yunma_debug = detect_gap_yunma(
        bg_img, slice_img,
        token=yunma_token,
        distance_correction=yunma_correction,
    )

    if yunma_distance is not None:
        return yunma_distance, yunma_debug

    # Step 3: 都失败
    logger.error("Hybrid detection: both OpenCV and Yunma failed")
    return None, {"method": "none", "success": False, "error": "All methods failed"}


def generate_track(distance: float, start_y: float = 0, steps: int = None) -> List[List[int]]:
    """
    生成类人滑块轨迹
    
    Verify5 轨迹格式:
    [
        [type, x, y, timestamp],
        [type, x, y, timestamp],
        ...
    ]
    type: 1=down, 2=move, 3=up
    x: 相对位移 (从起点算起)
    y: 相对位移 (从起点算起)
    
    Args:
        distance: 目标滑动距离
        start_y: 起始 Y 偏移
        steps: 轨迹步数 (None = 自动计算)
    
    Returns:
        轨迹点列表 [[type, x, y, timestamp], ...]
    """
    if steps is None:
        steps = max(15, int(distance / 5))
    
    track = []
    current_x = 0
    current_y = start_y
    current_time = int(time.time() * 1000)
    
    # 轨迹分段: 0-20% 加速, 20-80% 匀速, 80-100% 减速
    phase1_end = int(steps * 0.2)   # 加速阶段
    phase2_end = int(steps * 0.75)  # 匀速阶段
    
    # 每段的目标
    phase1_target = distance * 0.15
    phase2_target = distance * 0.75
    phase3_target = distance * 0.10
    
    # 加速阶段: x 增量递增
    accel_increments = []
    for i in range(phase1_end):
        t = (i + 1) / phase1_end
        # ease-out: 先快后慢
        inc = (phase1_target / phase1_end) * (1.5 - t * 0.5)
        accel_increments.append(max(1, int(inc * random.uniform(0.9, 1.1))))
    
    # 匀速阶段
    steady_increments = []
    avg_steady = phase2_target / (phase2_end - phase1_end)
    for i in range(phase1_end, phase2_end):
        inc = avg_steady * random.uniform(0.85, 1.15)
        steady_increments.append(max(1, int(inc)))
    
    # 减速阶段
    decel_increments = []
    for i in range(phase2_end, steps):
        remaining = steps - i
        remaining_target = phase3_target
        for inc_list in [decel_increments]:
            already = sum(decel_increments)
        # 指数衰减
        if remaining > 0:
            t = (i - phase2_end) / (steps - phase2_end)
            factor = 1.0 - t
            inc = (remaining_target - sum(decel_increments)) / remaining * factor * 2
            if inc < 1:
                inc = random.randint(0, 1)
            decel_increments.append(int(inc))
    
    # 合并所有增量
    all_increments = accel_increments + steady_increments + decel_increments
    
    # 确保总距离正确
    total = sum(all_increments)
    if total < distance:
        diff = int(distance - total)
        # 分配剩余到末尾
        for i in range(min(diff, len(all_increments))):
            idx = len(all_increments) - 1 - (i % len(all_increments))
            if idx >= 0:
                all_increments[idx] += 1
    
    # 生成轨迹点
    # 1. pointerdown
    track.append([1, 0, 0, current_time])
    current_time += random.randint(50, 150)
    
    # 2. pointermove 序列
    cumulative = 0
    target = distance
    
    for inc in all_increments:
        if cumulative >= target:
            break
        
        actual_inc = min(inc, target - cumulative)
        if actual_inc <= 0:
            break
            
        cumulative += actual_inc
        current_x = cumulative
        
        # Y 抖动 (±3px)
        y_offset = random.randint(-3, 3)
        current_y += random.randint(-1, 1) * 0.3
        
        # 时间间隔 (8-25ms)
        dt = random.randint(8, 25)
        current_time += dt
        
        # 偶尔有停滞 (3%概率)
        if random.random() < 0.03:
            track.append([2, int(current_x), int(current_y + 1), current_time])
            current_time += random.randint(50, 100)
        
        track.append([2, int(current_x), int(current_y + y_offset), current_time])
    
    # 微调: 末尾回退一点再前进
    if len(track) > 3:
        # 回退 2-5px
        back_x = current_x - random.randint(2, 5)
        back_x = max(0, back_x)
        current_time += random.randint(30, 60)
        track.append([2, int(back_x), int(current_y + 1), current_time])
        
        # 再前进到目标位置
        current_time += random.randint(50, 120)
        track.append([2, int(distance), int(current_y), current_time])
    
    # 3. pointerup
    current_time += random.randint(20, 50)
    track.append([3, int(distance), int(current_y), current_time])
    
    return track


def generate_track_v2(distance: float) -> str:
    """
    生成轨迹字符串 (兼容 Verify5 格式)
    
    返回逗号分隔的轨迹数据
    """
    trees = int(distance / 3) + random.randint(5, 10)
    track_list = []
    current_x = 0
    base_time = int(time.time() * 1000)
    
    # 生成轨迹点
    storia_x = []
    azione = distance
    
    while current_x < distance:
        increment = random.randint(2, 6)
        if current_x + increment > distance:
            increment = int(distance - current_x)
        current_x += increment
        azione -= increment
        base_time += random.randint(8, 25)
        track_list.append(str(base_time))
        track_list.append(str(int(current_x)))
        track_list.append(str(random.randint(-2, 2)))
    
    return ','.join(track_list)


def compute_track_string(track_raw: List[List[int]], implement: bool = True) -> str:
    """
    将轨迹列表转换为 Verify5 trackString 格式
    
    trackString = startTime,moveTime1,moveX1,moveY1,moveTime2,moveX2,moveY2,...,releaseTime,releaseX,releaseY
    """
    if not implement:
        return "0,0,0"
    
    parts = []
    
    for point in track_raw:
        p_type, x, y, timestamp = point
        
        if p_type == 1:  # pointerdown
            parts.append(str(timestamp))
        elif p_type == 2:  # pointermove
            parts.append(str(timestamp))
            parts.append(str(x))
            parts.append(str(y))
        elif p_type == 3:  # pointerup
            parts.append(str(timestamp))
            parts.append(str(x))
            parts.append(str(y))
    
    return ','.join(parts)


if __name__ == "__main__":
    # 测试轨迹生成
    track = generate_track(200)
    print(f"Generated {len(track)} points for distance 200")
    for p in track[:5]:
        print(f"  type={p[0]}, x={p[1]}, y={p[2]}, t={p[3]}")
    
    track_str = compute_track_string(track)
    print(f"\nTrack string ({len(track_str)} chars):")
    print(f"  {track_str[:100]}...")

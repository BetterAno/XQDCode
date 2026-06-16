"""
验证码缺口识别模块
支持云打码API和OpenCV本地识别
"""

import cv2
import numpy as np
import requests
import base64
import json


class GapDetector:
    """缺口检测器"""
    
    @staticmethod
    def detect_with_opencv(bg_path: str, slice_path: str) -> int:
        """使用OpenCV模板匹配识别缺口位置"""
        # 读取图片
        bg_img = cv2.imread(bg_path)
        slice_img = cv2.imread(slice_path, cv2.IMREAD_UNCHANGED)
        
        if bg_img is None or slice_img is None:
            raise Exception("无法读取图片")
        
        # 如果滑块图有alpha通道，提取内容区域
        if slice_img.shape[2] == 4:
            b, g, r, a = cv2.split(slice_img)
            _, mask = cv2.threshold(a, 1, 255, cv2.THRESH_BINARY)
            # 提取有内容的部分
            coords = cv2.findNonZero(mask)
            if coords is not None:
                x, y, w, h = cv2.boundingRect(coords)
                slice_content = slice_img[y:y+h, x:x+w]
                slice_bgr = slice_content[:, :, :3]
                slice_mask = mask[y:y+h, x:x+w]
            else:
                slice_bgr = slice_img[:, :, :3]
                slice_mask = None
        else:
            slice_bgr = slice_img
            slice_mask = None
        
        # 灰度化
        bg_gray = cv2.cvtColor(bg_img, cv2.COLOR_BGR2GRAY)
        slice_gray = cv2.cvtColor(slice_bgr, cv2.COLOR_BGR2GRAY)
        
        # 模板匹配
        result = cv2.matchTemplate(bg_gray, slice_gray, cv2.TM_CCOEFF_NORMED)
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
        
        # 获取匹配位置
        gap_x = max_loc[0]
        
        print(f"[OpenCV] 匹配度: {max_val:.4f}, 缺口位置: x={gap_x}")
        
        return gap_x
    
    @staticmethod
    def detect_with_edge(bg_path: str) -> int:
        """使用边缘检测识别缺口（备选方案）"""
        bg_img = cv2.imread(bg_path)
        if bg_img is None:
            raise Exception("无法读取背景图")
        
        # 转换为灰度图
        gray = cv2.cvtColor(bg_img, cv2.COLOR_BGR2GRAY)
        
        # 边缘检测
        edges = cv2.Canny(gray, 100, 200)
        
        # 查找矩形轮廓
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # 查找最可能的缺口位置（通常是左侧的矩形区域）
        min_x = bg_img.shape[1]  # 初始化为最大宽度
        
        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            # 缺口通常是较小的矩形区域
            if 20 < w < 80 and 20 < h < 80 and x < min_x:
                min_x = x
        
        if min_x < bg_img.shape[1]:
            print(f"[Edge] 缺口位置: x={min_x}")
            return min_x
        
        raise Exception("未找到缺口")


def download_images(bg_url: str, slice_url: str, bg_path: str, slice_path: str):
    """下载验证码图片"""
    session = requests.Session()
    
    bg_resp = session.get(bg_url)
    with open(bg_path, 'wb') as f:
        f.write(bg_resp.content)
    
    slice_resp = session.get(slice_url)
    with open(slice_path, 'wb') as f:
        f.write(slice_resp.content)
    
    print(f"[+] 图片已下载: {bg_path}, {slice_path}")


if __name__ == "__main__":
    # 测试
    bg_url = "https://images.tuyacn.com/yrule/images/bg/260/160/Vc646r7d0Lk45OCQPX1rC1WEmKHCmWXW.webp"
    slice_url = "https://images.tuyacn.com/yrule/images/slice/260/160/Vc646r7d0Lk45OCQPX1rC1WEmKHCmWXW.png"
    
    download_images(bg_url, slice_url, "bg.webp", "slice.png")
    
    # 尝试OpenCV识别
    try:
        gap_x = GapDetector.detect_with_opencv("bg.webp", "slice.png")
        print(f"识别结果: x={gap_x}")
    except Exception as e:
        print(f"OpenCV识别失败: {e}")
        try:
            gap_x = GapDetector.detect_with_edge("bg.webp")
            print(f"边缘检测结果: x={gap_x}")
        except Exception as e2:
            print(f"边缘检测也失败: {e2}")

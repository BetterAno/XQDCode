"""
验证码识别模块
滑块验证码: 云码 API (主) + OpenCV 三策略 (备)
"""

import base64
import requests as _requests

# 云码 API 配置
CLOUD_API_URL = "http://api.jfbym.com/api/YmServer/customApi"
CLOUD_API_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"


def solve_slider(bg_b64: str, slider_b64: str) -> int:
    """
    滑块验证码偏移量识别 — 云码 API 优先，本地 OpenCV 兜底
    """
    offset = _cloud_solve(bg_b64, slider_b64)
    if offset > 0:
        return offset
    return _opencv_solve(bg_b64, slider_b64)


def _cloud_solve(bg_b64: str, slider_b64: str) -> int:
    """云码 API 滑块偏移量识别 (type=20111)"""
    try:
        r = _requests.post(CLOUD_API_URL, data={
            "token": CLOUD_API_TOKEN,
            "type": 20111,
            "slide_image": f"data:image/png;base64,{slider_b64}",
            "background_image": f"data:image/png;base64,{bg_b64}",
        }, timeout=30)
        data = r.json()
        # 响应: {"code": 10000, "msg": "识别成功", "data": {"code": 0, "data": "117", ...}}
        if data.get("code") in (0, 10000) and data.get("data"):
            inner = data["data"]
            if isinstance(inner, dict):
                val = inner.get("data", 0)
            else:
                val = inner
            return int(float(str(val)))
        return -1
    except Exception:
        return -1


def _opencv_solve(bg_b64: str, slider_b64: str) -> int:
    """OpenCV 三策略取中位数 (兜底)"""
    import cv2
    import numpy as np

    bg = cv2.imdecode(np.frombuffer(base64.b64decode(bg_b64), np.uint8), cv2.IMREAD_COLOR)
    sl = cv2.imdecode(np.frombuffer(base64.b64decode(slider_b64), np.uint8), cv2.IMREAD_COLOR)
    if bg is None or sl is None:
        raise ValueError("图片解码失败")

    bg_g = cv2.cvtColor(bg, cv2.COLOR_BGR2GRAY)
    sl_g = cv2.cvtColor(sl, cv2.COLOR_BGR2GRAY)

    o1 = cv2.minMaxLoc(cv2.matchTemplate(
        cv2.Canny(bg_g, 80, 200), cv2.Canny(sl_g, 80, 200),
        cv2.TM_CCOEFF_NORMED))[3][0]
    o2 = cv2.minMaxLoc(cv2.matchTemplate(bg_g, sl_g, cv2.TM_CCOEFF_NORMED))[3][0]
    k = np.ones((3, 3), np.uint8)
    o3 = cv2.minMaxLoc(cv2.matchTemplate(
        cv2.erode(cv2.dilate(bg_g, k), k),
        cv2.erode(cv2.dilate(sl_g, k), k),
        cv2.TM_CCOEFF_NORMED))[3][0]
    return sorted([o1, o2, o3])[1]


def extract_b64_image(data_url: str) -> str:
    """从 data:text/javascript;base64,XXX 或纯 base64 提取"""
    if ',' in data_url:
        return data_url.split(',', 1)[1]
    return data_url

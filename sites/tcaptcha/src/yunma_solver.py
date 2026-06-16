"""
云码打码 — 腾讯滑块识别 (type=20111)

API: http://api.jfbym.com/api/YmServer/customApi
参数:
  - slide_image: 滑块图的 base64
  - background_image: 背景图的 base64
  - token: 用户密钥
  - type: 20111 (腾讯滑块)
返回: {code, msg, data: [{code, data: "x坐标", time}]}
"""

import base64
import time
import requests
from io import BytesIO
from PIL import Image

# 全局水印
_AUTH_ = "laohe_munian"

# 云码配置
YUNMA_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"
YUNMA_URL = "http://api.jfbym.com/api/YmServer/customApi"
YUNMA_TYPE = "20111"  # 腾讯滑块


def extract_slider_from_sprite(sprite_image: bytes, sprite_pos: tuple, sprite_size: tuple) -> bytes:
    """
    从雪碧图中裁切滑块图
    Args:
        sprite_image: 雪碧图原始字节
        sprite_pos: (x, y) 雪碧图中滑块位置
        sprite_size: (w, h) 滑块尺寸
    Returns:
        滑块图的 PNG 字节
    """
    img = Image.open(BytesIO(sprite_image))
    x, y = sprite_pos
    w, h = sprite_size
    slider = img.crop((x, y, x + w, y + h))
    buf = BytesIO()
    slider.save(buf, format="PNG")
    return buf.getvalue()


def solve_slider(
    slide_image_bytes: bytes,
    background_image_bytes: bytes,
    token: str = None,
    max_retries: int = 3,
) -> int:
    """
    调用云码识别滑块位置
    Args:
        slide_image_bytes: 滑块图 PNG 字节
        background_image_bytes: 背景图 PNG/JPEG 字节
        token: 云码 token (可选，默认使用内置 token)
        max_retries: 最大重试次数
    Returns:
        滑块 x 坐标 (int)
    Raises:
        RuntimeError: 识别失败
    """
    _token = token or YUNMA_TOKEN

    slide_b64 = base64.b64encode(slide_image_bytes).decode("utf-8")
    bg_b64 = base64.b64encode(background_image_bytes).decode("utf-8")

    payload = {
        "slide_image": slide_b64,
        "background_image": bg_b64,
        "token": _token,
        "type": YUNMA_TYPE,
    }

    for attempt in range(max_retries):
        try:
            resp = requests.post(YUNMA_URL, data=payload, timeout=30)
            result = resp.json()
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(1)
                continue
            raise RuntimeError(f"云码请求失败: {e}")

        code = result.get("code", -1)
        if code == 10000:
            # 识别成功
            inner = result.get("data", None)
            if inner is None:
                raise RuntimeError(f"云码返回数据为空: {result}")

            # 兼容两种格式: 对象 或 数组
            if isinstance(inner, list):
                if len(inner) == 0:
                    raise RuntimeError(f"云码返回数据为空数组: {result}")
                inner = inner[0]

            if isinstance(inner, dict):
                inner_code = inner.get("code", -1)
                if inner_code == 10000:
                    x_str = inner.get("data", "0")
                    return int(float(x_str))
                elif inner_code == 0 and inner.get("data"):
                    # code=0 可能也表示成功（部分实现），且有 data 字段
                    x_str = inner.get("data", "0")
                    return int(float(x_str))
                else:
                    raise RuntimeError(
                        f"云码打码服务异常: inner_code={inner_code}, "
                        f"data={inner.get('data', 'N/A')}, time={inner.get('time', 'N/A')}"
                    )
            raise RuntimeError(f"云码返回数据格式异常: {result}")
        elif code == 10002:
            raise RuntimeError("云码余额不足")
        elif code in (10003, 10004):
            raise RuntimeError(f"云码参数错误: code={code}, msg={result.get('msg')}")
        else:
            if attempt < max_retries - 1:
                time.sleep(2)
                continue
            raise RuntimeError(f"云码识别失败: code={code}, msg={result.get('msg')}")

    raise RuntimeError(f"云码重试{max_retries}次后仍失败")


def solve_slider_from_urls(
    session: requests.Session,
    sprite_url: str,
    bg_url: str,
    sprite_pos: tuple = None,
    sprite_size: tuple = None,
    token: str = None,
) -> int:
    """
    从 URL 下载图片并识别
    Args:
        session: requests.Session
        sprite_url: 雪碧图 URL (img_index=0)
        bg_url: 背景图 URL (img_index=1)
        sprite_pos: 滑块在雪碧图中的位置 (x, y), 默认 (140, 490)
        sprite_size: 滑块尺寸 (w, h), 默认 (120, 120)
        token: 云码 token
    Returns:
        滑块在雪碧图中的 x 坐标
    """
    if sprite_pos is None:
        sprite_pos = (140, 490)  # 默认值来自 prehandle 的 fg_elem_list
    if sprite_size is None:
        sprite_size = (120, 120)

    # 下载雪碧图
    sprite_resp = session.get(sprite_url, timeout=15)
    sprite_resp.raise_for_status()

    # 下载背景图
    bg_resp = session.get(bg_url, timeout=15)
    bg_resp.raise_for_status()

    # 从雪碧图提取滑块
    slider_img = extract_slider_from_sprite(
        sprite_resp.content, sprite_pos, sprite_size
    )

    # 调用云码识别
    x_in_slider = solve_slider(slider_img, bg_resp.content, token=token)

    return x_in_slider

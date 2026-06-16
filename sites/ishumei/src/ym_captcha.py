"""
云码验证码识别模块 - 双图滑块缺口识别

接口: http://api.jfbym.com/api/YmServer/customApi
返回: 背景图上缺口最左边缘的 x 坐标
"""

import base64
import requests

YM_API = "http://api.jfbym.com/api/YmServer/customApi"
YM_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"


def download_image(url: str) -> bytes:
    return requests.get(url, timeout=15).content


def image_to_base64(data: bytes) -> str:
    return base64.b64encode(data).decode()


def recognize_slide_gap(bg_image_url: str, fg_image_url: str) -> int:
    """
    识别滑块缺口位置

    Args:
        bg_image_url: 背景图完整URL
        fg_image_url: 滑块前景图完整URL

    Returns:
        缺口最左边缘 x 坐标 (图片坐标系, 基于bg_width=600)
    """
    bg_data = download_image(bg_image_url)
    fg_data = download_image(fg_image_url)

    resp = requests.post(YM_API, {
        'slide_image': image_to_base64(fg_data),
        'background_image': image_to_base64(bg_data),
        'token': YM_TOKEN,
        'type': '20111',
    }, timeout=30)

    result = resp.json()
    code = result.get('code')
    data = result.get('data')

    # 格式1: {code: 10000, data: {code: 0, data: "440"}}
    if code == 10000 and isinstance(data, dict):
        if data.get('code') == 0:
            return int(data['data'])
        else:
            raise RuntimeError(f"云码识别失败: {data}")
    # 格式2: {code: 200, data: [{code: 200, data: "440"}]}
    elif code == 200 and isinstance(data, list):
        item = data[0]
        if item.get('code') == 200:
            return int(item['data'])
        else:
            raise RuntimeError(f"云码识别失败: {item}")
    else:
        raise RuntimeError(f"云码请求失败: {result}")


if __name__ == '__main__':
    # 测试: 使用 register 返回的图片URL
    domain = "https://castatic.fengkongcloud.cn"
    bg_path = "/crb/set-000006/v2/88224f9b291c368a499c804932c32fd5_bg.jpg"
    fg_path = "/crb/set-000006/v2/88224f9b291c368a499c804932c32fd5_fg.png"

    x = recognize_slide_gap(domain + bg_path, domain + fg_path)
    print(f"缺口 x 坐标: {x}")

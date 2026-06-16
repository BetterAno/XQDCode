"""
云码验证码识别模块
API文档: http://api.jfbym.com/api/YmServer/customApi
用于识别京东滑块拼图验证码的缺口距离
"""
import base64
import requests
from typing import Optional, Tuple


class YunCodeCaptcha:
    """云码验证码识别客户端"""

    API_URL = "http://api.jfbym.com/api/YmServer/customApi"
    TYPE_SLIDE = "20111"  # 滑块拼图类型

    def __init__(self, token: str):
        """
        Args:
            token: 云码用户中心密钥
        """
        self.token = token

    def recognize_slide(
        self,
        slide_image: bytes,
        background_image: bytes,
        timeout: int = 30
    ) -> Tuple[bool, Optional[int], str]:
        """
        识别滑块拼图缺口距离

        Args:
            slide_image: 滑块缺口图的原始字节 (PNG/JPEG)
            background_image: 背景图的原始字节 (PNG/JPEG)
            timeout: 请求超时时间(秒)

        Returns:
            (success, x_offset, message)
            - success: 是否识别成功
            - x_offset: 缺口最左边缘的x坐标(像素)，失败时为None
            - message: 状态说明
        """
        slide_b64 = base64.b64encode(slide_image).decode('utf-8')
        bg_b64 = base64.b64encode(background_image).decode('utf-8')

        params = {
            'slide_image': slide_b64,
            'background_image': bg_b64,
            'token': self.token,
            'type': self.TYPE_SLIDE,
        }

        try:
            resp = requests.post(
                self.API_URL,
                data=params,
                timeout=timeout
            )
            result = resp.json()
            return self._parse_result(result)

        except requests.RequestException as e:
            return False, None, f"网络请求失败: {e}"
        except Exception as e:
            return False, None, f"识别异常: {e}"

    def _parse_result(self, result: dict) -> Tuple[bool, Optional[int], str]:
        """解析云码返回结果"""
        code = result.get('code', -1)
        msg = result.get('msg', '')
        data = result.get('data', {})

        if code == 10000:
            # 识别成功
            inner_code = data.get('code', -1)
            inner_data = data.get('data', '')
            inner_time = data.get('time', '')

            if inner_data:
                try:
                    x_offset = int(inner_data)
                    return True, x_offset, f"识别成功, x={x_offset}, 耗时={inner_time}"
                except (ValueError, TypeError):
                    return False, None, f"识别结果解析失败: {inner_data}"

            return False, None, f"识别成功但无数据: code={inner_code}"

        # 错误码映射
        error_map = {
            10001: "参数错误",
            10002: "余额不足",
            10003: "无此访问权限（未获取到有效token）",
            10004: "无此验证类型（type参数值不对）",
            10005: "网络拥塞",
            10006: "数据包过载",
            10007: "服务繁忙（接口模型无法处理图片参数）",
            10008: "网络错误，请稍后重试",
            10009: "结果准备中，请稍后再试",
            10010: "请求结束",
        }

        error_msg = error_map.get(code, f"未知错误 code={code}")
        return False, None, f"{error_msg}: {msg}"


if __name__ == '__main__':
    # 测试云码 API
    import sys
    token = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"
    client = YunCodeCaptcha(token)

    # 用本地图片测试
    if len(sys.argv) >= 3:
        with open(sys.argv[1], 'rb') as f:
            slide = f.read()
        with open(sys.argv[2], 'rb') as f:
            bg = f.read()
        ok, x, msg = client.recognize_slide(slide, bg)
        print(f"结果: ok={ok}, x={x}, msg={msg}")
    else:
        print("用法: python yuncode_captcha.py <slide_image> <background_image>")

"""
云码(Yunma)滑块验证码缺口识别 API 封装

API 端点: http://api.jfbym.com/api/YmServer/customApi
验证码类型: type=20111 (滑块验证码)

错误码处理:
  10000 - 识别成功
  10001 - 参数错误
  10002 - 余额不足
  10003 - 无访问权限 (token无效)
  10004 - 无此验证类型 (type参数错误)
  10005 - 网络拥塞
  10006 - 数据包过载
  10007 - 服务繁忙 (模型无法处理图片)
  10008 - 网络错误，请重试
  10009 - 结果准备中，请重试
  10010 - 请求结束
"""

import base64
import logging
import time
from typing import Optional, Tuple, Union

import requests

logger = logging.getLogger(__name__)

# 云码 API 错误码定义
API_ERROR_CODES = {
    10000: "SUCCESS",
    10001: "PARAM_ERROR",
    10002: "INSUFFICIENT_BALANCE",
    10003: "NO_ACCESS_PERMISSION",
    10004: "INVALID_CAPTCHA_TYPE",
    10005: "NETWORK_CONGESTION",
    10006: "DATA_OVERLOAD",
    10007: "SERVICE_BUSY",
    10008: "NETWORK_ERROR",
    10009: "RESULT_PREPARING",
    10010: "REQUEST_ENDED",
}

# 可重试的错误码 (网络/服务临时问题)
RETRYABLE_ERROR_CODES = {10005, 10006, 10007, 10008, 10009}


class YunmaError(Exception):
    """云码 API 错误"""

    def __init__(self, code: int, message: str, retryable: bool = False):
        self.code = code
        self.message = message
        self.retryable = retryable
        super().__init__(f"Yunma API error code={code}: {message}")


class YunmaClient:
    """
    云码滑块缺口识别客户端

    支持:
    - 图片 base64 编码转换
    - 完善的错误码映射和重试策略
    - 距离校正 (基于经验，云码识别结果可能比实际偏大)
    - 从文件路径或 bytes 直接识别
    """

    API_URL = "http://api.jfbym.com/api/YmServer/customApi"
    CAPTCHA_TYPE = "20111"

    # 默认重试参数
    DEFAULT_MAX_RETRIES = 3
    DEFAULT_BASE_DELAY = 1.0  # 基础重试延迟 (秒)
    DEFAULT_TIMEOUT = 30  # 请求超时 (秒)

    def __init__(
        self,
        token: str,
        distance_correction: int = 0,
        max_retries: int = None,
        base_delay: float = None,
        timeout: int = None,
    ):
        """
        初始化云码客户端

        Args:
            token: 云码认证 token
            distance_correction: 距离校正值 (正数=减去, 负数=加上, 0=不校正)
            max_retries: 最大重试次数 (None=使用默认值 3)
            base_delay: 基础重试延迟秒数 (None=使用默认值 1.0)
            timeout: 请求超时秒数 (None=使用默认值 30)
        """
        self.token = token
        self.distance_correction = distance_correction
        self.max_retries = max_retries if max_retries is not None else self.DEFAULT_MAX_RETRIES
        self.base_delay = base_delay if base_delay is not None else self.DEFAULT_BASE_DELAY
        self.timeout = timeout if timeout is not None else self.DEFAULT_TIMEOUT

        self.last_response = None  # 最近一次 API 响应 (调试用)
        self.last_raw_distance = None  # 最近一次原始识别距离

        self._session = requests.Session()

    def _encode_image(self, image: Union[str, bytes]) -> str:
        """
        将图片转换为 base64 编码字符串

        Args:
            image: 图片文件路径 (str) 或 bytes 数据

        Returns:
            base64 编码字符串 (不含 data:image 前缀)
        """
        if isinstance(image, bytes):
            return base64.b64encode(image).decode("utf-8")

        # 文件路径
        with open(image, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")

    def _build_payload(
        self,
        slide_image: Union[str, bytes],
        background_image: Union[str, bytes],
    ) -> dict:
        """构造 API 请求 payload"""
        return {
            "slide_image": self._encode_image(slide_image),
            "background_image": self._encode_image(background_image),
            "token": self.token,
            "type": self.CAPTCHA_TYPE,
        }

    def _parse_response(self, result: dict) -> int:
        """
        解析 API 响应并返回识别距离

        API 响应结构:
        {
            "code": 10000,  // 顶层状态码
            "msg": "返回信息",
            "data": {
                "code": 0,     // 打码服务状态 (0=成功)
                "data": "123", // 缺口最左边缘 X 坐标值
                "time": "500"  // 打码耗时 (ms)
            }
        }

        Raises:
            YunmaError: API 返回非成功状态

        Returns:
            原始识别缺口 X 坐标 (int)
        """
        top_code = result.get("code")
        msg = result.get("msg", "")

        err_name = API_ERROR_CODES.get(top_code, f"UNKNOWN_{top_code}")

        if top_code != 10000:
            retryable = top_code in RETRYABLE_ERROR_CODES
            logger.warning(
                f"Yunma API returned error code={top_code} ({err_name}), "
                f"msg={msg}, retryable={retryable}"
            )
            raise YunmaError(top_code, f"[{err_name}] {msg}", retryable)

        # top_code == 10000, 继续检查 data
        data_obj = result.get("data", {})
        if not isinstance(data_obj, dict):
            raise YunmaError(-1, f"Unexpected data field type: {type(data_obj)}", retryable=False)

        inner_code = data_obj.get("code")
        if inner_code != 0:
            raise YunmaError(
                top_code,
                f"Inner data.code={inner_code} != 0, data={data_obj}",
                retryable=False,
            )

        # 提取距离
        distance_str = data_obj.get("data", "")
        try:
            distance = int(distance_str)
        except (ValueError, TypeError):
            raise YunmaError(
                top_code,
                f"Invalid distance value: {distance_str!r}",
                retryable=False,
            )

        recognition_time = data_obj.get("time", "N/A")
        logger.info(
            f"Yunma recognition success: distance={distance}px, "
            f"time={recognition_time}ms"
        )

        return distance

    def recognize(
        self,
        slide_image: Union[str, bytes],
        background_image: Union[str, bytes],
    ) -> Tuple[Optional[int], dict]:
        """
        调用云码 API 识别滑块缺口位置 (含重试)

        Args:
            slide_image: 滑块图 (文件路径或 bytes)
            background_image: 背景图 (文件路径或 bytes)

        Returns:
            (distance, debug_info)
            - distance: 校正后的缺口距离 (像素), None 表示识别失败
            - debug_info: 调试信息字典 {
                "success": bool,
                "raw_distance": int | None,     # API 返回的原始距离
                "corrected_distance": int | None, # 校正后的距离
                "correction": int,               # 应用的校正值
                "retry_count": int,              # 重试次数
                "error": str | None,             # 错误信息
                "elapsed_ms": int,               # 总耗时 (ms)
                "api_time_ms": str,              # API 打码耗时
            }
        """
        debug = {
            "success": False,
            "raw_distance": None,
            "corrected_distance": None,
            "correction": self.distance_correction,
            "retry_count": 0,
            "error": None,
            "elapsed_ms": 0,
            "api_time_ms": "N/A",
        }

        start_time = time.time()

        # 构造 payload (只做一次 base64 编码)
        try:
            payload = self._build_payload(slide_image, background_image)
        except Exception as e:
            debug["error"] = f"Image encoding failed: {e}"
            logger.error(debug["error"])
            debug["elapsed_ms"] = int((time.time() - start_time) * 1000)
            return None, debug

        # 重试循环
        last_error = None

        for attempt in range(self.max_retries + 1):
            debug["retry_count"] = attempt

            try:
                resp = self._session.post(
                    self.API_URL,
                    json=payload,
                    timeout=self.timeout,
                )
                resp.raise_for_status()

                result = resp.json()
                self.last_response = result

                raw_distance = self._parse_response(result)
                self.last_raw_distance = raw_distance

                # 应用距离校正
                corrected = raw_distance - self.distance_correction

                debug["success"] = True
                debug["raw_distance"] = raw_distance
                debug["corrected_distance"] = corrected
                debug["api_time_ms"] = result.get("data", {}).get("time", "N/A")

                if self.distance_correction != 0:
                    logger.info(
                        f"Distance correction applied: {raw_distance}"
                        f" - {self.distance_correction} = {corrected}"
                    )

                debug["elapsed_ms"] = int((time.time() - start_time) * 1000)
                return corrected, debug

            except YunmaError as e:
                last_error = e

                if not e.retryable:
                    # 不可重试的错误 (参数错误/余额不足/token无效等)
                    logger.error(f"Non-retryable Yunma error: {e}")
                    debug["error"] = str(e)
                    break

                # 可重试的错误 (网络拥塞/服务繁忙等)
                if attempt < self.max_retries:
                    wait = self.base_delay * (2 ** attempt)
                    logger.warning(
                        f"Retryable Yunma error (attempt {attempt + 1}/"
                        f"{self.max_retries}), retrying in {wait:.1f}s: {e}"
                    )
                    time.sleep(wait)
                else:
                    logger.error(f"Max retries exceeded: {e}")
                    debug["error"] = str(e)

            except requests.RequestException as e:
                last_error = e
                if attempt < self.max_retries:
                    wait = self.base_delay * (2 ** attempt)
                    logger.warning(
                        f"Yunma HTTP error (attempt {attempt + 1}/"
                        f"{self.max_retries}), retrying in {wait:.1f}s: {e}"
                    )
                    time.sleep(wait)
                else:
                    logger.error(f"Yunma HTTP error after max retries: {e}")
                    debug["error"] = f"HTTP error: {e}"

            except Exception as e:
                last_error = e
                logger.error(f"Unexpected error during Yunma recognition: {e}")
                debug["error"] = f"Unexpected: {e}"
                break

        debug["elapsed_ms"] = int((time.time() - start_time) * 1000)
        return None, debug

    def recognize_from_paths(
        self,
        bg_path: str,
        slice_path: str,
    ) -> Tuple[Optional[int], dict]:
        """
        从文件路径识别 (便捷方法)

        Args:
            bg_path: 背景图路径
            slice_path: 滑块图路径

        Returns:
            (距离, debug_info), 同 recognize()
        """
        return self.recognize(slide_image=slice_path, background_image=bg_path)

    def recognize_from_bytes(
        self,
        bg_bytes: bytes,
        slice_bytes: bytes,
    ) -> Tuple[Optional[int], dict]:
        """
        从 bytes 数据识别 (便捷方法)

        Args:
            bg_bytes: 背景图 bytes
            slice_bytes: 滑块图 bytes

        Returns:
            (距离, debug_info), 同 recognize()
        """
        return self.recognize(slide_image=slice_bytes, background_image=bg_bytes)


# ==================== 便捷函数 ====================

_default_client: Optional[YunmaClient] = None


def get_default_client(token: str = None) -> YunmaClient:
    """
    获取/创建默认云码客户端实例 (单例模式)

    Args:
        token: 云码 token (首次调用时必须提供)

    Returns:
        YunmaClient 实例
    """
    global _default_client

    if _default_client is None and token:
        _default_client = YunmaClient(token=token, distance_correction=0)
    elif _default_client is not None and token:
        # 允许替换 token
        _default_client.token = token

    if _default_client is None:
        raise RuntimeError(
            "YunmaClient not initialized. Call get_default_client(token='...') first."
        )

    return _default_client


def yunma_recognize(
    slide_image: Union[str, bytes],
    background_image: Union[str, bytes],
    token: str = None,
) -> Optional[int]:
    """
    快捷识别函数 - 向后兼容

    用法:
        distance = yunma_recognize(slide_bytes, bg_bytes)

    Args:
        slide_image: 滑块图 (文件路径或 bytes)
        background_image: 背景图 (文件路径或 bytes)
        token: 云码 token (可选, 第一次调用时提供)

    Returns:
        识别距离 (像素), 失败返回 None
    """
    client = get_default_client(token)
    distance, debug = client.recognize(slide_image, background_image)
    return distance


# ==================== 测试入口 ====================

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )

    # 测试 token (从 config 获取)
    import json
    import os

    config_path = os.path.join(
        os.path.dirname(__file__), "..", "config", "config.json"
    )
    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    token = config.get("yunma", {}).get(
        "token", "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"
    )

    client = YunmaClient(token=token)

    print("=" * 60)
    print("云码 API 客户端测试")
    print("=" * 60)
    print(f"Token: {token[:10]}...")
    print(f"API URL: {client.API_URL}")
    print(f"Captcha Type: {client.CAPTCHA_TYPE}")
    print(f"Max Retries: {client.max_retries}")
    print(f"Base Delay: {client.base_delay}s")
    print(f"Timeout: {client.timeout}s")

    # 如果有测试图片，运行识别
    test_bg = os.path.join(os.path.dirname(__file__), "..", "..", "fcbox", "test_shade.png")
    test_slide = os.path.join(os.path.dirname(__file__), "..", "..", "fcbox", "test_slide.png")

    if os.path.exists(test_bg) and os.path.exists(test_slide):
        print(f"\n测试图片: bg={test_bg}, slice={test_slide}")
        distance, debug = client.recognize_from_paths(test_bg, test_slide)

        if distance is not None:
            print(f"\n识别成功! Distance: {distance}px")
            print(f"Debug: {json.dumps(debug, indent=2, ensure_ascii=False)}")
        else:
            print(f"\n识别失败! Error: {debug.get('error')}")
    else:
        print("\n(没有测试图片，跳过识别测试)")
        print("客户端初始化完成，可通过 recognize() 方法调用")

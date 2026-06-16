"""
云码 (jfbym.com) 九宫格点选验证码识别模块
适用于阿里百川 Baxia 九宫格验证码

API 类型: 30008 (定制-九宫格点选)
接口: 需传 image(大图) + label_image(小标签图) → 返回坐标索引
"""

import base64
import time
import requests
import logging
from PIL import Image
from io import BytesIO

log = logging.getLogger("captcha_solver")

YUNMA_API = "http://api.jfbym.com/api/YmServer/customApi"
YUNMA_TYPE_GRID_CLICK = "30008"


class YunMaSolver:
    """云码九宫格点选验证码识别"""

    def __init__(self, token: str):
        self.token = token
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})

    def solve_grid_click(self, big_image_b64: str, label_image_b64: str, max_retry: int = 3) -> list[int] | None:
        """
        调用云码 API 识别九宫格点选

        Args:
            big_image_b64: 大图 (九宫格整体图) 的 base64 编码
            label_image_b64: 小标签图 (提示图/目标图) 的 base64 编码
            max_retry: 最大重试次数

        Returns:
            选中图片的索引列表 (0-based), 如 [0, 3, 7] 表示第1、4、8张
            失败返回 None
        """
        payload = {
            "token": self.token,
            "type": YUNMA_TYPE_GRID_CLICK,
            "image": big_image_b64,
            "label_image": label_image_b64,
        }

        for attempt in range(max_retry):
            try:
                resp = self.session.post(YUNMA_API, json=payload, timeout=30)
                result = resp.json()

                code = result.get("code")
                if code == 10000:
                    data_list = result.get("data", [])
                    if data_list:
                        inner = data_list[0]
                        indices_str = inner.get("data", "")
                        if indices_str:
                            # 返回格式: "1,3,7" (1-based), 转为 0-based
                            indices = [int(x.strip()) - 1 for x in indices_str.split(",") if x.strip()]
                            log.info(f"云码识别成功: 原始={indices_str}, 索引(0-based)={indices}")
                            return indices
                    log.warning(f"云码返回空数据: {result}")
                elif code == 10007:
                    log.warning(f"云码服务繁忙, 第{attempt + 1}次重试...")
                    time.sleep(2)
                    continue
                elif code == 10002:
                    log.error("云码余额不足")
                    return None
                else:
                    log.error(f"云码识别失败: code={code}, msg={result.get('msg')}")
                    return None
            except requests.RequestException as e:
                log.error(f"云码请求异常: {e}, 第{attempt + 1}次重试...")
                time.sleep(2)

        return None

    @staticmethod
    def merge_grid_images(images_b64: list[str], grid_size: int = 3) -> str:
        """
        将多张九宫格小图合并为一张大图 (用于云码 image 参数)

        Args:
            images_b64: 9 张小图的 base64 列表
            grid_size: 网格尺寸 (3x3)

        Returns:
            合并后大图的 base64
        """
        cell_size = 120
        canvas_w = cell_size * grid_size
        canvas_h = cell_size * grid_size
        canvas = Image.new("RGB", (canvas_w, canvas_h), (255, 255, 255))

        for i, img_b64 in enumerate(images_b64):
            row = i // grid_size
            col = i % grid_size
            try:
                img_data = base64.b64decode(img_b64)
                img = Image.open(BytesIO(img_data)).convert("RGB")
                img = img.resize((cell_size, cell_size), Image.LANCZOS)
                canvas.paste(img, (col * cell_size, row * cell_size))
            except Exception as e:
                log.warning(f"合并图片[{i}]失败: {e}")

        buf = BytesIO()
        canvas.save(buf, format="PNG")
        return base64.b64encode(buf.getvalue()).decode()

    @staticmethod
    def decode_single_image(content_b64: str) -> bytes:
        """解密/解码单张验证码图片数据"""
        try:
            return base64.b64decode(content_b64)
        except Exception:
            # 可能是加密的, 先尝试直接 base64
            return base64.b64decode(content_b64 + "==")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

    # 简单测试 - 需要实际图片数据才能运行
    solver = YunMaSolver(token="tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI")

    # 测试余额/连通性
    test_payload = {
        "token": solver.token,
        "type": YUNMA_TYPE_GRID_CLICK,
        "image": "",
        "label_image": "",
    }
    try:
        resp = requests.post(YUNMA_API, json=test_payload, timeout=10,
                             headers={"Content-Type": "application/json"})
        print(f"连通性测试: {resp.json()}")
    except Exception as e:
        print(f"连接失败: {e}")

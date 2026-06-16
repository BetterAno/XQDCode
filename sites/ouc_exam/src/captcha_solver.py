"""
国开在线考试平台 - 验证码识别模块
支持: OpenCV 算术表达式解析 + ddddocr OCR备选
"""

import re
import io
import base64

import cv2
import numpy as np

try:
    import ddddocr
    _ocr = ddddocr.DdddOcr(show_ad=False)
except Exception:
    _ocr = None


def _base64_to_image(b64_str: str) -> np.ndarray:
    """Base64图片字符串转OpenCV图像"""
    # 去除 data:image/png;base64, 前缀
    if ',' in b64_str:
        b64_str = b64_str.split(',', 1)[1]
    img_bytes = base64.b64decode(b64_str)
    nparr = np.frombuffer(img_bytes, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)


def _preprocess_image(img: np.ndarray) -> np.ndarray:
    """预处理图像: 灰度+二值化, 提升OCR准确率"""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # 自适应阈值二值化
    binary = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV, 11, 2
    )
    # 去噪
    kernel = np.ones((2, 2), np.uint8)
    cleaned = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
    return cleaned


def solve_arithmetic_captcha_opencv(b64_img: str) -> str:
    """
    OpenCV + ddddocr 方式解析算术验证码
    支持格式: "5+?=9", "9+9=", "?+5=9", "3-?=1", "12+8=9" 等
    
    步骤:
    1. 用 ddddocr OCR识别文本
    2. 解析算术表达式求值
    """
    # 直接用原始 base64 图片给 ddddocr 识别
    ocr_result = ""
    if _ocr is not None:
        # 去除 data:image/png;base64, 前缀
        b64_data = b64_img
        if ',' in b64_data:
            b64_data = b64_data.split(',', 1)[1]
        img_bytes = base64.b64decode(b64_data)
        ocr_result = _ocr.classification(img_bytes)
    
    if not ocr_result:
        return ""
    
    # 清理OCR结果
    text = ocr_result.strip().replace(' ', '').replace('×', '*').replace('÷', '/')
    
    # 尝试解析算术表达式
    answer = _parse_arithmetic(text)
    return str(answer) if answer is not None else ""


def _parse_arithmetic(text: str) -> int | None:
    """
    解析算术验证码表达式
    
    支持格式:
    - "5+?=9" → 4
    - "9+9=?" → 18
    - "?+5=9" → 4
    - "3-?=1" → 2
    - "12+8=?" → 20
    - "5+2=" → 7
    - "98-" → 1  (容错: 等号和问号缺失)
    - "7*5=" → 35
    - "4+5=9" → 9
    """
    text = text.replace('？', '?').replace('＝', '=').replace('＋', '+').replace('－', '-')
    text = text.replace('×', '*').replace('x', '*').replace('X', '*')
    # 清理常见OCR错误
    text = text.replace('l', '1').replace('I', '1').replace('O', '0').replace('o', '0')
    text = text.replace('s', '5').replace('S', '5').replace('t', '+').replace('g', '9')
    text = text.replace('来', '').replace('下', '')  # 中文干扰
    # 移除非算术字符, 保留数字、运算符、问号、等号
    text = re.sub(r'[^0-9+\-?*=]', '', text)

    # 格式: A op ? = B
    m = re.match(r'^(\d+)\s*([+\-*])\s*\?\s*=\s*(\d+)$', text)
    if m:
        a, op, b = int(m.group(1)), m.group(2), int(m.group(3))
        if op == '+':
            return b - a
        elif op == '-':
            return a - b
        elif op == '*':
            return b // a if a != 0 else None

    # 格式: ? op A = B
    m = re.match(r'^\?\s*([+\-*])\s*(\d+)\s*=\s*(\d+)$', text)
    if m:
        op, a, b = m.group(1), int(m.group(2)), int(m.group(3))
        if op == '+':
            return b - a
        elif op == '-':
            return a + b
        elif op == '*':
            return b // a if a != 0 else None

    # 格式: A op B = ?
    m = re.match(r'^(\d+)\s*([+\-*])\s*(\d+)\s*=\s*\?$', text)
    if m:
        a, op, b = int(m.group(1)), m.group(2), int(m.group(3))
        if op == '+':
            return a + b
        elif op == '-':
            return a - b
        elif op == '*':
            return a * b

    # 格式: A op B = (等号后无内容, 直接计算)
    m = re.match(r'^(\d+)\s*([+\-*])\s*(\d+)\s*=$', text)
    if m:
        a, op, b = int(m.group(1)), m.group(2), int(m.group(3))
        if op == '+':
            return a + b
        elif op == '-':
            return a - b
        elif op == '*':
            return a * b

    # 格式: A op B (无等号, 直接计算)
    m = re.match(r'^(\d+)\s*([+\-*])\s*(\d+)$', text)
    if m:
        a, op, b = int(m.group(1)), m.group(2), int(m.group(3))
        if op == '+':
            return a + b
        elif op == '-':
            return a - b
        elif op == '*':
            return a * b

    # 容错: AB op (等号和第二个操作数缺失, 拆分为 A op B)
    # 如 "98-" → 9-8=1, "99-" → 9-9=0
    m = re.match(r'^(\d)(\d)([+\-])$', text)
    if m:
        a, b, op = int(m.group(1)), int(m.group(2)), m.group(3)
        if op == '+':
            return a + b
        elif op == '-':
            return a - b

    # 容错: A op B = C (完整的算术式)
    m = re.match(r'^(\d+)\s*([+\-*])\s*(\d+)\s*=\s*(\d+)$', text)
    if m:
        a, op, b, c = int(m.group(1)), m.group(2), int(m.group(3)), int(m.group(4))
        if op == '+':
            expected = a + b
        elif op == '-':
            expected = a - b
        elif op == '*':
            expected = a * b
        else:
            expected = None
        if expected is not None:
            if expected == c:
                return c
            else:
                return expected

    return None


def solve_captcha(b64_img: str) -> str:
    """
    识别验证码(主入口)
    
    Args:
        b64_img: base64编码的验证码图片
        
    Returns:
        验证码答案字符串, 无法解析时返回空字符串
    """
    result = solve_arithmetic_captcha_opencv(b64_img)
    if result:
        return result

    return ""


if __name__ == "__main__":
    # 测试算术解析
    test_cases = [
        ("5+?=9", 4),
        ("9+9=?", 18),
        ("?+5=9", 4),
        ("3-?=1", 2),
        ("12+8=?", 20),
    ]
    print("=== 算术验证码解析测试 ===")
    for expr, expected in test_cases:
        result = _parse_arithmetic(expr)
        status = "✓" if result == expected else "✗"
        print(f"  {status} {expr} = {result} (期望: {expected})")

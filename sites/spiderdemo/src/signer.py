"""
OB Challenge1 签名生成模块

sign = hex_md5(f"{timestamp}{page}")
其中 hex_md5 实际为: MD5(input + salt)
Salt 通过动态 Hook 浏览器 hex_md5 函数确认
"""

import hashlib

# 固定 salt，从混淆 JS 中动态提取并经实证验证
_SALT = b"\xa3\xac\xa1\xa3fdjf,jkgfkl"


def generate_sign(timestamp: int, page: int) -> str:
    """
    生成请求签名

    Args:
        timestamp: 毫秒级时间戳
        page: 页码

    Returns:
        32位小写 MD5 十六进制字符串
    """
    data = f"{timestamp}{page}".encode("utf-8") + _SALT
    return hashlib.md5(data).hexdigest()


def generate_sign_for_answer(timestamp: int, answer: int) -> str:
    """
    提交答案时的签名（如需要）
    当前接口无需签名，保留备用
    """
    return ""


if __name__ == "__main__":
    # 本地对齐验证
    test_ts = 1777009343862
    test_page = 2
    expected = "a25c4c9bbb143ca43d88ca5198a23ad3"
    actual = generate_sign(test_ts, test_page)
    assert actual == expected, f"签名不一致: expected={expected}, actual={actual}"
    print("签名验证通过")

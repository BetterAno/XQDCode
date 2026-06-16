"""
Protobuf 加密挑战爬虫 - 纯 Python 实现
- MD4 签名（自定义：输入为数字值而非 ASCII）
- 手动 Protobuf 编解码
- encryptType: charCode + 3
"""

import requests
import struct
import time

BASE_URL = "https://spiderdemo.cn"
HEADERS = {
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Content-Type': 'application/x-protobuf',
    'Origin': 'https://spiderdemo.cn',
    'Referer': 'https://spiderdemo.cn/authentication/protobuf_challenge/?challenge_type=protobuf_challenge',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36'
}

COOKIES = {
    'sessionid': 'gmd8mkfk3n437a8bp2nlq49utpj1aft3'
}


# ============================================================
# MD4 实现（自定义输入：字符串数字值，非 ASCII 码）
# JS 中 "1" & 0xff = 1（Number coercion），不是 0x31
# ============================================================

def _mask32(x):
    """保持 32 位无符号"""
    return x & 0xFFFFFFFF

def _rot(x, n):
    """左旋转"""
    x = _mask32(x)
    return _mask32((x << n) | (x >> (32 - n)))

def _F(x, y, z):
    return _mask32((~x & z) | (y & x))

def _G(x, y, z):
    return _mask32((x & y) | (x & z) | (y & z))

def _H(x, y, z):
    return x ^ y ^ z

def _round1(a, b, c, d, k, s):
    return _rot(_mask32(a + _F(b, c, d) + k), s)

def _round2(a, b, c, d, k, s):
    return _rot(_mask32(a + _G(b, c, d) + k + 0x5A827999), s)

def _round3(a, b, c, d, k, s):
    return _rot(_mask32(a + _H(b, c, d) + k + 0x6ED9EBA1), s)

def md4_sign(input_str: str) -> str:
    """
    自定义 MD4：输入字符串的每个字符以 JS Number coercion 方式转换
    即 "1" -> 1, "7" -> 7（数字值，不是 ASCII 码）
    """
    # 将字符串转为 JS 风格的字节数组（数字值）
    input_bytes = []
    for ch in input_str:
        # 模拟 JS: str[i] & 0xff → Number(str[i]) & 0xff
        # 对于数字字符 "0"-"9"，Number("0")=0, Number("9")=9
        try:
            val = int(ch)
        except ValueError:
            val = 0  # NaN & 0xff = 0 in JS
        input_bytes.append(val & 0xFF)

    # padMessage
    bits = len(input_bytes) * 8
    padded = list(input_bytes)
    padded.append(0x80)
    while (len(padded) * 8 + 64) % 512 != 0:
        padded.append(0x00)
    # 追加 64 位长度（小端）
    # 注意：JS 中 >>> 操作符的 shift 量会 mod 32
    # 所以 bits >>> 32 = bits >>> 0 = bits，导致高低 32 位相同
    for i in range(8):
        shift = (i * 8) % 32  # 模拟 JS >>> 行为
        padded.append((bits >> shift) & 0xFF)

    # MD4 主循环
    A, B, C, D = 0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476

    num_blocks = len(padded) // 64
    for block in range(num_blocks):
        M = [0] * 16
        for i in range(16):
            offset = block * 64 + i * 4
            M[i] = (padded[offset] & 0xFF) | \
                   ((padded[offset + 1] & 0xFF) << 8) | \
                   ((padded[offset + 2] & 0xFF) << 16) | \
                   ((padded[offset + 3] & 0xFF) << 24)

        AA, BB, CC, DD = A, B, C, D

        # Round 1
        AA = _round1(AA, BB, CC, DD, M[0], 3)
        DD = _round1(DD, AA, BB, CC, M[1], 7)
        CC = _round1(CC, DD, AA, BB, M[2], 11)
        BB = _round1(BB, CC, DD, AA, M[3], 19)
        AA = _round1(AA, BB, CC, DD, M[4], 3)
        DD = _round1(DD, AA, BB, CC, M[5], 7)
        CC = _round1(CC, DD, AA, BB, M[6], 11)
        BB = _round1(BB, CC, DD, AA, M[7], 19)
        AA = _round1(AA, BB, CC, DD, M[8], 3)
        DD = _round1(DD, AA, BB, CC, M[9], 7)
        CC = _round1(CC, DD, AA, BB, M[10], 11)
        BB = _round1(BB, CC, DD, AA, M[11], 19)
        AA = _round1(AA, BB, CC, DD, M[12], 3)
        DD = _round1(DD, AA, BB, CC, M[13], 7)
        CC = _round1(CC, DD, AA, BB, M[14], 11)
        BB = _round1(BB, CC, DD, AA, M[15], 19)

        # Round 2
        AA = _round2(AA, BB, CC, DD, M[0], 3)
        DD = _round2(DD, AA, BB, CC, M[4], 5)
        CC = _round2(CC, DD, AA, BB, M[8], 9)
        BB = _round2(BB, CC, DD, AA, M[12], 13)
        AA = _round2(AA, BB, CC, DD, M[1], 3)
        DD = _round2(DD, AA, BB, CC, M[5], 5)
        CC = _round2(CC, DD, AA, BB, M[9], 9)
        BB = _round2(BB, CC, DD, AA, M[13], 13)
        AA = _round2(AA, BB, CC, DD, M[2], 3)
        DD = _round2(DD, AA, BB, CC, M[6], 5)
        CC = _round2(CC, DD, AA, BB, M[10], 9)
        BB = _round2(BB, CC, DD, AA, M[14], 13)
        AA = _round2(AA, BB, CC, DD, M[3], 3)
        DD = _round2(DD, AA, BB, CC, M[7], 5)
        CC = _round2(CC, DD, AA, BB, M[11], 9)
        BB = _round2(BB, CC, DD, AA, M[15], 13)

        # Round 3
        AA = _round3(AA, BB, CC, DD, M[0], 3)
        DD = _round3(DD, AA, BB, CC, M[8], 9)
        CC = _round3(CC, DD, AA, BB, M[4], 11)
        BB = _round3(BB, CC, DD, AA, M[12], 15)
        AA = _round3(AA, BB, CC, DD, M[2], 3)
        DD = _round3(DD, AA, BB, CC, M[10], 9)
        CC = _round3(CC, DD, AA, BB, M[6], 11)
        BB = _round3(BB, CC, DD, AA, M[14], 15)
        AA = _round3(AA, BB, CC, DD, M[1], 3)
        DD = _round3(DD, AA, BB, CC, M[9], 9)
        CC = _round3(CC, DD, AA, BB, M[5], 11)
        BB = _round3(BB, CC, DD, AA, M[13], 15)
        AA = _round3(AA, BB, CC, DD, M[3], 3)
        DD = _round3(DD, AA, BB, CC, M[11], 9)
        CC = _round3(CC, DD, AA, BB, M[7], 11)
        BB = _round3(BB, CC, DD, AA, M[15], 15)

        A = _mask32(A + AA)
        B = _mask32(B + BB)
        C = _mask32(C + CC)
        D = _mask32(D + DD)

    # 输出小端序 hex
    result_bytes = []
    for val in [A, B, C, D]:
        result_bytes.extend([val & 0xFF, (val >> 8) & 0xFF, (val >> 16) & 0xFF, (val >> 24) & 0xFF])
    return ''.join(f'{b:02x}' for b in result_bytes)


# ============================================================
# encryptType: 每个字符的 charCode + 3
# ============================================================

def encrypt_type(input_str: str) -> str:
    return ''.join(chr(ord(c) + 3) for c in input_str)


# ============================================================
# Protobuf 手动编解码
# ============================================================

def encode_varint(value):
    """编码 varint（支持负数和大整数）"""
    if value < 0:
        value = value + (1 << 64)  # 负数转无符号
    result = bytearray()
    while value > 0x7F:
        result.append((value & 0x7F) | 0x80)
        value >>= 7
    result.append(value & 0x7F)
    return bytes(result)

def decode_varint(data, pos):
    """解码 varint，返回 (value, new_pos)"""
    result = 0
    shift = 0
    while True:
        b = data[pos]
        result |= (b & 0x7F) << shift
        pos += 1
        if not (b & 0x80):
            break
        shift += 7
    return result, pos

def encode_protobuf_request(page, challengetype, timestamp, signature):
    """编码 ChallengeRequest protobuf"""
    buf = bytearray()

    # field 1: page (int32, wire type 0)
    buf.extend(b'\x08')
    buf.extend(encode_varint(page))

    # field 2: challengetype (string, wire type 2)
    ct_bytes = challengetype.encode('utf-8')
    buf.extend(b'\x12')
    buf.extend(encode_varint(len(ct_bytes)))
    buf.extend(ct_bytes)

    # field 3: timestamp (int64, wire type 0)
    buf.extend(b'\x18')
    buf.extend(encode_varint(timestamp))

    # field 4: signature (string, wire type 2)
    sig_bytes = signature.encode('utf-8')
    buf.extend(b'\x22')
    buf.extend(encode_varint(len(sig_bytes)))
    buf.extend(sig_bytes)

    return bytes(buf)

def decode_protobuf_response(data):
    """
    解码 ChallengeResponse protobuf
    返回: {numbers: [{id, value}, ...], total_pages, current_page, timestamp, signature}
    """
    result = {
        'numbers': [],
        'total_pages': 0,
        'current_page': 0,
        'timestamp': 0,
        'signature': ''
    }
    pos = 0
    while pos < len(data):
        tag_val, pos = decode_varint(data, pos)
        field_number = tag_val >> 3
        wire_type = tag_val & 0x07

        if wire_type == 0:  # varint
            value, pos = decode_varint(data, pos)
            if field_number == 2:
                result['total_pages'] = value
            elif field_number == 3:
                result['current_page'] = value
            elif field_number == 4:
                result['timestamp'] = value
        elif wire_type == 2:  # length-delimited
            length, pos = decode_varint(data, pos)
            payload = data[pos:pos + length]
            pos += length
            if field_number == 1:  # NumberData (embedded message)
                nd = decode_number_data(payload)
                result['numbers'].append(nd)
            elif field_number == 5:
                result['signature'] = payload.decode('utf-8')
        else:
            # 跳过未知 wire type
            break

    return result

def decode_number_data(data):
    """解码 NumberData 子消息"""
    nd = {'id': 0, 'value': 0}
    pos = 0
    while pos < len(data):
        tag_val, pos = decode_varint(data, pos)
        field_number = tag_val >> 3
        wire_type = tag_val & 0x07
        if wire_type == 0:
            value, pos = decode_varint(data, pos)
            if field_number == 1:
                nd['id'] = value
            elif field_number == 2:
                nd['value'] = value
    return nd


# ============================================================
# 主逻辑
# ============================================================

def build_request(page, challenge_type="protobuf_challenge"):
    """构建 protobuf 请求体"""
    timestamp = int(time.time() * 1000)  # Date.now() 毫秒
    timestamp_str = str(timestamp)
    signature = md4_sign(timestamp_str)
    encrypted_type = encrypt_type(challenge_type)

    payload = encode_protobuf_request(page, encrypted_type, timestamp, signature)
    return payload, timestamp, signature


def fetch_page(session, page):
    """获取单页数据"""
    payload, timestamp, signature = build_request(page)
    url = f"{BASE_URL}/authentication/api/protobuf_challenge/page/{page}/"

    try:
        resp = session.post(url, data=payload, headers=HEADERS, timeout=10)
        if resp.status_code == 200:
            result = decode_protobuf_response(resp.content)
            values = [n['value'] for n in result['numbers']]
            print(f"  Page {page:3d}: {values} (共 {len(values)} 个)")
            return values
        else:
            print(f"  Page {page:3d}: HTTP {resp.status_code} - {resp.text[:100]}")
            return None
    except Exception as e:
        print(f"  Page {page:3d}: 请求异常 - {e}")
        return None


def main():
    print("=" * 60)
    print("  Protobuf 加密挑战爬虫 - 纯 Python 实现")
    print("=" * 60)

    # 验证 MD4 实现
    print("\n[1] 验证 MD4 签名...")
    test1 = md4_sign("1776059601146")
    print(f"  md4('1776059601146') = {test1}")
    print(f"  期望值: bbc640a6d4261bd79742132315b8d1f2")
    assert test1 == "bbc640a6d4261bd79742132315b8d1f2", f"MD4 验证失败! got {test1}"

    test2 = md4_sign("1234567890123")
    print(f"  md4('1234567890123') = {test2}")
    print(f"  期望值: 46bee9a366823ff7a307c63dc81772ae")
    assert test2 == "46bee9a366823ff7a307c63dc81772ae", f"MD4 验证失败! got {test2}"
    print("  ✓ MD4 签名验证通过!")

    # 验证 encryptType
    print("\n[2] 验证 encryptType...")
    et = encrypt_type("protobuf_challenge")
    print(f"  encryptType('protobuf_challenge') = {et}")
    assert et == "surwrexibfkdoohqjh", f"encryptType 验证失败!"
    print("  ✓ encryptType 验证通过!")

    # 开始采集
    print("\n[3] 开始采集 100 页数据...")
    session = requests.Session()
    session.cookies.update(COOKIES)

    all_values = []
    failed_pages = []

    for page in range(1, 101):
        values = fetch_page(session, page)
        if values:
            all_values.extend(values)
        else:
            failed_pages.append(page)
        time.sleep(0.3)  # 防止请求过快

    # 重试失败的页面
    if failed_pages:
        print(f"\n[4] 重试 {len(failed_pages)} 个失败页面...")
        for page in failed_pages:
            time.sleep(1)
            values = fetch_page(session, page)
            if values:
                all_values.extend(values)

    # 汇总
    total = sum(all_values)
    print(f"\n{'=' * 60}")
    print(f"  采集完成!")
    print(f"  总数据量: {len(all_values)} 个数字")
    print(f"  数字总和: {total}")
    print(f"{'=' * 60}")

    # 提交答案
    print(f"\n[5] 提交答案: {total}")
    submit_resp = session.post(
        f"{BASE_URL}/authentication/api/protobuf_challenge/submit/",
        json={
            'challenge_type': 'protobuf_challenge',
            'answer': total
        },
        headers={
            'Content-Type': 'application/json',
            'Origin': 'https://spiderdemo.cn',
            'Referer': 'https://spiderdemo.cn/authentication/protobuf_challenge/?challenge_type=protobuf_challenge',
            'User-Agent': HEADERS['User-Agent']
        },
        timeout=10
    )
    print(f"  状态码: {submit_resp.status_code}")
    print(f"  响应: {submit_resp.text}")

    return total


if __name__ == '__main__':
    main()

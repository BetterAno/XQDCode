"""
Verify5 加密核心模块 - Python 纯算法实现

实现 Verify5 SDK (v2.6.2) 中所有加密算法：
- AES-256-CTR 加密/解密
- MurmurHash3 x64 128-bit 指纹哈希
- Base64/Hex 编解码
- XOR Key 派生
- 消息加密/解密包装

完全独立实现，不依赖任何 JavaScript 运行时。
"""

import base64
import hashlib
import hmac
import os
import random
import string
import struct
from typing import Tuple, List, Dict, Any, Optional

# ============================================================
# AES-256-CTR 实现
# ============================================================

# AES S-Box
SBOX = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
]

# AES Inverse S-Box
INV_SBOX = [
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
    0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
    0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
    0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
    0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
    0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
    0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
    0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
    0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
    0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
    0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
    0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
    0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
    0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
    0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
    0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d,
]

# Rcon
RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36]

def _gmult(a: int, b: int) -> int:
    """GF(2^8) 乘法"""
    p = 0
    for _ in range(8):
        if b & 1:
            p ^= a
        hi = a & 0x80
        a = (a << 1) & 0xff
        if hi:
            a ^= 0x1b
        b >>= 1
    return p


def _key_expansion(key: bytes) -> List[List[int]]:
    """AES-256 密钥扩展"""
    nk = 8  # 256-bit key = 8 words
    nr = 14  # 256-bit = 14 rounds
    nb = 4
    
    # 将密钥转换为 32-bit words
    w = []
    for i in range(nk):
        w.append(struct.unpack('>I', key[i*4:(i+1)*4])[0])
    
    for i in range(nk, nb * (nr + 1)):
        temp = w[i - 1]
        if i % nk == 0:
            # RotWord
            temp = ((temp << 8) & 0xffffffff) | (temp >> 24)
            # SubWord
            temp = (SBOX[(temp >> 24) & 0xff] << 24 |
                    SBOX[(temp >> 16) & 0xff] << 16 |
                    SBOX[(temp >> 8) & 0xff] << 8 |
                    SBOX[temp & 0xff])
            # XOR with Rcon
            temp ^= (RCON[i // nk] << 24)
        elif nk > 6 and i % nk == 4:
            # Additional SubWord for AES-256
            temp = (SBOX[(temp >> 24) & 0xff] << 24 |
                    SBOX[(temp >> 16) & 0xff] << 16 |
                    SBOX[(temp >> 8) & 0xff] << 8 |
                    SBOX[temp & 0xff])
        w.append(w[i - nk] ^ temp)
    
    # 组织为 round keys (每组 4 words)
    round_keys = []
    for i in range(0, len(w), 4):
        round_keys.append(w[i:i+4])
    return round_keys


class _AES:
    """AES-256 块加密/解密"""
    
    def __init__(self, key: bytes):
        self._round_keys = _key_expansion(key)
        self._nr = len(self._round_keys) - 1
        
    def encrypt_block(self, block: bytes) -> bytes:
        """加密单个 16 字节块"""
        state = list(struct.unpack('>4I', block))
        state = self._add_round_key(state, 0)
        
        for r in range(1, self._nr):
            state = self._sub_bytes(state)
            state = self._shift_rows(state)
            state = self._mix_columns(state)
            state = self._add_round_key(state, r)
        
        state = self._sub_bytes(state)
        state = self._shift_rows(state)
        state = self._add_round_key(state, self._nr)
        
        return struct.pack('>4I', *state)
    
    def _add_round_key(self, state: List[int], round_num: int) -> List[int]:
        rk = self._round_keys[round_num]
        return [s ^ r for s, r in zip(state, rk)]
    
    def _sub_bytes(self, state: List[int]) -> List[int]:
        result = []
        for word in state:
            result.append(
                SBOX[(word >> 24) & 0xff] << 24 |
                SBOX[(word >> 16) & 0xff] << 16 |
                SBOX[(word >> 8) & 0xff] << 8 |
                SBOX[word & 0xff]
            )
        return result
    
    def _shift_rows(self, state: List[int]) -> List[int]:
        # State as 4x4 matrix (column-major)
        # Row 0: no shift
        # Row 1: shift left 1
        # Row 2: shift left 2
        # Row 3: shift left 3
        result = [0, 0, 0, 0]
        for c in range(4):
            col = [
                (state[0] >> (24 - c * 8)) & 0xff,
                (state[1] >> (24 - c * 8)) & 0xff,
                (state[2] >> (24 - c * 8)) & 0xff,
                (state[3] >> (24 - c * 8)) & 0xff,
            ]
            # Shift: row r -> (r + c) % 4
            for r in range(4):
                shifted_col = col[(r + c) % 4]
                result[r] |= shifted_col << (24 - c * 8)
        return result
    
    def _mix_columns(self, state: List[int]) -> List[int]:
        result = []
        for word in state:
            a0 = (word >> 24) & 0xff
            a1 = (word >> 16) & 0xff
            a2 = (word >> 8) & 0xff
            a3 = word & 0xff
            
            r0 = _gmult(a0, 2) ^ _gmult(a1, 3) ^ a2 ^ a3
            r1 = a0 ^ _gmult(a1, 2) ^ _gmult(a2, 3) ^ a3
            r2 = a0 ^ a1 ^ _gmult(a2, 2) ^ _gmult(a3, 3)
            r3 = _gmult(a0, 3) ^ a1 ^ a2 ^ _gmult(a3, 2)
            
            result.append((r0 << 24) | (r1 << 16) | (r2 << 8) | r3)
        return result


def aes_ctr_encrypt(plaintext: bytes, key: bytes, iv: bytes) -> bytes:
    """
    AES-256-CTR 加密
    
    Args:
        plaintext: 明文数据
        key: 32 字节密钥 (AES-256)
        iv: 16 字节 IV (作为初始 counter)
    
    Returns:
        密文数据 (长度 = len(plaintext))
    """
    aes = _AES(key)
    result = bytearray()
    counter = int.from_bytes(iv, 'big')
    
    for i in range(0, len(plaintext), 16):
        block = plaintext[i:i+16]
        # 加密 counter 值
        counter_bytes = counter.to_bytes(16, 'big')
        encrypted_counter = aes.encrypt_block(counter_bytes)
        # XOR 与 plaintext
        for j, b in enumerate(block):
            result.append(b ^ encrypted_counter[j])
        counter += 1
    
    return bytes(result)


def aes_ctr_decrypt(ciphertext: bytes, key: bytes, iv: bytes) -> bytes:
    """
    AES-256-CTR 解密 (CTR 模式加密与解密相同)
    """
    return aes_ctr_encrypt(ciphertext, key, iv)


# ============================================================
# MurmurHash3 x64 128-bit 实现 (对齐 fingerprintjs v2)
# ============================================================

def _murmur_fmix64(k: int) -> int:
    """MurmurHash3 64-bit fmix"""
    k ^= k >> 33
    k = (k * 0xff51afd7ed558ccd) & 0xffffffffffffffff
    k ^= k >> 33
    k = (k * 0xc4ceb9fe1a85ec53) & 0xffffffffffffffff
    k ^= k >> 33
    return k


def murmur_hash_128(data: str, seed: int = 31) -> str:
    """
    MurmurHash3 x64 128-bit 实现
    
    与 fingerprintjs v2 的 x64hash128 完全对齐
    
    Args:
        data: 输入字符串
        seed: 哈希种子 (默认 31)
    
    Returns:
        32 字符 hex 字符串 (128-bit hash)
    """
    c1 = 0x87c37b91114253d5
    c2 = 0x4cf5ad432745937f
    
    # 转换为字节数组
    nbytes = len(data.encode('utf-8'))
    tail_bytes = nbytes % 16
    
    h1 = seed & 0xffffffffffffffff
    h2 = seed & 0xffffffffffffffff
    
    # 处理 16 字节块
    pos = 0
    data_bytes = data.encode('utf-8')
    
    while pos + 16 <= nbytes:
        # 读取两个 64-bit 值 (little-endian)
        k_raw = data_bytes[pos:pos+16]
        k1 = int.from_bytes(k_raw[0:8], 'little')
        k2 = int.from_bytes(k_raw[8:16], 'little')
        
        k1 = (k1 * c1) & 0xffffffffffffffff
        k1 = ((k1 << 31) | (k1 >> 33)) & 0xffffffffffffffff  # rotl by 31
        k1 = (k1 * c2) & 0xffffffffffffffff
        h1 ^= k1
        
        h1 = ((h1 << 27) | (h1 >> 37)) & 0xffffffffffffffff  # rotl by 27
        h1 = (h1 + h2) & 0xffffffffffffffff
        h1 = (h1 * 5 + 0x52dce729) & 0xffffffffffffffff
        
        k2 = (k2 * c2) & 0xffffffffffffffff
        k2 = ((k2 << 33) | (k2 >> 31)) & 0xffffffffffffffff  # rotl by 33
        k2 = (k2 * c1) & 0xffffffffffffffff
        h2 ^= k2
        
        h2 = ((h2 << 31) | (h2 >> 33)) & 0xffffffffffffffff  # rotl by 31
        h2 = (h2 + h1) & 0xffffffffffffffff
        h2 = (h2 * 5 + 0x38495ab5) & 0xffffffffffffffff
        
        pos += 16
    
    # 处理尾部
    if tail_bytes > 0:
        tail = data_bytes[pos:]
        k1 = 0
        k2 = 0
        
        # 根据尾部长度处理
        if tail_bytes > 8:
            for i in range(tail_bytes - 1, 7, -1):
                k2 = ((k2 << 8) | tail[i]) & 0xffffffffffffffff
        if tail_bytes > 0:
            k1_bytes = tail[:min(8, tail_bytes)]
            for i in range(len(k1_bytes) - 1, -1, -1):
                k1 = ((k1 << 8) | k1_bytes[i]) & 0xffffffffffffffff
        
        if tail_bytes >= 8:
            k2 = (k2 * c2) & 0xffffffffffffffff
            k2 = ((k2 << 33) | (k2 >> 31)) & 0xffffffffffffffff
            k2 = (k2 * c1) & 0xffffffffffffffff
            h2 ^= k2
        
        if tail_bytes > 0:
            k1 = (k1 * c1) & 0xffffffffffffffff
            k1 = ((k1 << 31) | (k1 >> 33)) & 0xffffffffffffffff
            k1 = (k1 * c2) & 0xffffffffffffffff
            h1 ^= k1
    
    # 最终处理: length
    h1 ^= nbytes
    h2 ^= nbytes
    
    h1 = (h1 + h2) & 0xffffffffffffffff
    h2 = (h2 + h1) & 0xffffffffffffffff
    
    h1 = _murmur_fmix64(h1)
    h2 = _murmur_fmix64(h2)
    
    h1 = (h1 + h2) & 0xffffffffffffffff
    h2 = (h2 + h1) & 0xffffffffffffffff
    
    # 输出 32 hex chars (128 bits)
    return f"{h1:016x}{h2:016x}"


# ============================================================
# Verify5 特定加密函数
# ============================================================

def random_hex(length: int) -> str:
    """生成随机 hex 字符串"""
    return ''.join(random.choice('0123456789abcdef') for _ in range(length))


def y_decrypt(encrypted_key: str, fingerprint_hash: str) -> str:
    """
    Y(a, b) - XOR 密钥派生 (对应 JS 中的 Y 函数)
    
    从服务端返回的加密 session key 中提取真正的 AES key
    
    Args:
        encrypted_key: 服务端返回的加密 key 字符串
        fingerprint_hash: 客户端指纹哈希
    
    Returns:
        解密的 AES key (hex 字符串)
    """
    # JS: b = b.charAt(b.length - 1) % 2 → 取最后一位字符的奇偶性
    # 如果最后字符为 '0','2','4','6','8' → start=0; '1','3','5','7','9' → start=1
    last_char = fingerprint_hash[-1]
    if last_char in '13579':
        start = 1
    else:
        start = 0
    
    result = []
    for i in range(start, len(encrypted_key), 2):
        result.append(encrypted_key[i])
    return ''.join(result)


def verify5_decrypt(encrypted_base64: str, aes_key: str) -> str:
    """
    Verify5 AES-256-CTR 解密 (对应 JS 中的 ja 函数)
    
    格式: Base64( IV(16 bytes) + AES-CTR-Ciphertext )
    
    Args:
        encrypted_base64: Base64 编码的加密数据
        aes_key: 16 字节 AES key (hex 字符串)
    
    Returns:
        解密后的明文字符串 (JSON)
    """
    # Base64 解码
    raw = base64.b64decode(encrypted_base64)
    
    if len(raw) < 16:
        raise ValueError("Encrypted data too short")
    
    # 前16字节 = IV/counter
    iv = raw[:16]
    ciphertext = raw[16:]
    
    # AES key: hex 字符串的 UTF-8 bytes → 填充到 32 bytes for AES-256
    key_bytes = aes_key.encode('utf-8')
    # 填充到 32 字节 (AES-256 requires 32 bytes)
    key_bytes = key_bytes + b'\x00' * (32 - len(key_bytes))
    key_bytes = key_bytes[:32]
    
    # AES-CTR 解密
    plaintext = aes_ctr_decrypt(ciphertext, key_bytes, iv)
    
    return plaintext.decode('utf-8', errors='replace')


def verify5_encrypt(plaintext: str, aes_key: str) -> str:
    """
    Verify5 AES-256-CTR 加密 (对应 JS 中的 E 函数)
    
    输出格式: Base64( random_IV(16 bytes) + AES-CTR-Ciphertext )
    
    Args:
        plaintext: 明文字符串
        aes_key: 16 字节 AES key (hex 字符串)
    
    Returns:
        Base64 编码的加密数据
    """
    # 生成随机 16-char hex → 16 bytes IV
    iv_hex = random_hex(16)
    iv = iv_hex.encode('utf-8')  # 16 bytes
    
    # AES key: 填充到 32 bytes
    key_bytes = aes_key.encode('utf-8')
    key_bytes = key_bytes + b'\x00' * (32 - len(key_bytes))
    key_bytes = key_bytes[:32]
    
    # AES-CTR 加密
    plaintext_bytes = plaintext.encode('utf-8')
    ciphertext = aes_ctr_encrypt(plaintext_bytes, key_bytes, iv)
    
    # 拼接 IV + ciphertext
    result = iv + ciphertext
    
    return base64.b64encode(result).decode('ascii')


def verify5_encrypt_message(message_json: str, aes_key: str) -> str:
    """
    加密 Verify5 消息的便捷方法
    
    Args:
        message_json: JSON 消息字符串
        aes_key: AES key (hex)
    
    Returns:
        Base64 加密数据
    """
    return verify5_encrypt(message_json, aes_key)


def verify5_decrypt_message(encrypted_base64: str, aes_key: str) -> str:
    """
    解密 Verify5 消息的便捷方法
    """
    return verify5_decrypt(encrypted_base64, aes_key)


# ============================================================
# 对齐检查工具
# ============================================================

def compare_encryption(python_output: str, js_output: str) -> bool:
    """比较 Python 加密输出与 JS 加密输出是否一致"""
    return python_output == js_output


if __name__ == "__main__":
    # 测试 MurmurHash3
    test_data = "hello world fingerprint test"
    hash_result = murmur_hash_128(test_data)
    print(f"MurmurHash3({test_data}) = {hash_result}")
    print(f"Hash length: {len(hash_result)} chars")
    
    # 测试 Y 解密
    test_encrypted = "abcdefghijklmnopqrstuv"
    test_fp = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"
    y_result = y_decrypt(test_encrypted, test_fp)
    print(f"Y decrypt result: {y_result}")
    
    # 测试 AES-CTR 加密/解密
    key = b"0123456789abcdef0123456789abcdef"  # 32 bytes AES-256
    iv = b"0000000000000000"
    plaintext = b"Hello, Verify5!"
    
    encrypted = aes_ctr_encrypt(plaintext, key, iv)
    decrypted = aes_ctr_decrypt(encrypted, key, iv)
    
    print(f"Plaintext: {plaintext}")
    print(f"Encrypted: {encrypted.hex()}")
    print(f"Decrypted: {decrypted}")
    print(f"Match: {plaintext == decrypted}")

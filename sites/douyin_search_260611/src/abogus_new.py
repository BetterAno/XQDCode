"""
抖音 a_bogus 新版纯算实现 (基于 ShilongLee/Crawler douyin.js)
匹配 bdms 1.0.1.19 的签名格式

Usage:
    from abogus_new import generate_a_bogus
    ab = generate_a_bogus(url_params, user_agent)
"""

import time
import random as rand
from urllib.parse import urlencode

# ── RC4 ──
def rc4_encrypt(plaintext, key):
    s = list(range(256))
    j = 0
    for i in range(256):
        j = (j + s[i] + ord(key[i % len(key)])) % 256
        s[i], s[j] = s[j], s[i]
    i = j = 0
    cipher = []
    for k in range(len(plaintext)):
        i = (i + 1) % 256
        j = (j + s[i]) % 256
        s[i], s[j] = s[j], s[i]
        t = (s[i] + s[j]) % 256
        cipher.append(chr(s[t] ^ ord(plaintext[k])))
    return ''.join(cipher)


# ── SM3 Hash ──
class SM3:
    def __init__(self):
        self.reg = [1937774191, 1226093241, 388252375, 3666478592,
                    2842636476, 372324522, 3817729613, 2969243214]
        self.chunk = []
        self.size = 0

    @staticmethod
    def _le(e, r):
        r %= 32
        return ((e << r) | (e >> (32 - r))) & 0xFFFFFFFF

    @staticmethod
    def _de(e):
        return 2043430169 if 0 <= e < 16 else 2055708042

    @staticmethod
    def _pe(e, r, t, n):
        if 0 <= e < 16:
            return (r ^ t ^ n) & 0xFFFFFFFF
        return (r & t | r & n | t & n) & 0xFFFFFFFF

    @staticmethod
    def _he(e, r, t, n):
        if 0 <= e < 16:
            return (r ^ t ^ n) & 0xFFFFFFFF
        return (r & t | (~r & n)) & 0xFFFFFFFF

    def reset(self):
        self.reg = [1937774191, 1226093241, 388252375, 3666478592,
                    2842636476, 372324522, 3817729613, 2969243214]
        self.chunk = []
        self.size = 0

    def write(self, e):
        if isinstance(e, str):
            n = e
            a = []
            for c in n:
                a.append(ord(c))
            e = a
        self.size += len(e)
        f = 64 - len(self.chunk)
        if len(e) < f:
            self.chunk.extend(e)
        else:
            self.chunk.extend(e[:f])
            while len(self.chunk) >= 64:
                self._compress(self.chunk)
                if f < len(e):
                    self.chunk = e[f:min(f + 64, len(e))]
                else:
                    self.chunk = []
                f += 64

    def _fill(self):
        a = 8 * self.size
        self.chunk.append(128)
        f = len(self.chunk) % 64
        if 64 - f < 8:
            f -= 64
        while f < 56:
            self.chunk.append(0)
            f += 1
        for i in range(4):
            c = a // 4294967296
            self.chunk.append((c >> (8 * (3 - i))) & 255)
        for i in range(4):
            self.chunk.append((a >> (8 * (3 - i))) & 255)

    def _compress(self, t):
        if len(t) < 64:
            return
        # Expand message
        r = [0] * 132
        for i in range(16):
            r[i] = (t[4 * i] << 24) | (t[4 * i + 1] << 16) | (t[4 * i + 2] << 8) | t[4 * i + 3]
            r[i] &= 0xFFFFFFFF
        for n in range(16, 68):
            a = r[n - 16] ^ r[n - 9] ^ self._le(r[n - 3], 15)
            a = a ^ self._le(a, 15) ^ self._le(a, 23)
            r[n] = (a ^ self._le(r[n - 13], 7) ^ r[n - 6]) & 0xFFFFFFFF
        for n in range(64):
            r[n + 68] = (r[n] ^ r[n + 4]) & 0xFFFFFFFF

        # Compress
        reg = self.reg[:]
        for c in range(64):
            o = self._le(reg[0], 12) + reg[4] + self._le(self._de(c), c)
            o = (o & 0xFFFFFFFF)
            o = self._le(o, 7)
            s = (o ^ self._le(reg[0], 12)) & 0xFFFFFFFF
            u = self._pe(c, reg[0], reg[1], reg[2])
            u = (u + reg[3] + s + r[c + 68]) & 0xFFFFFFFF
            b = self._he(c, reg[4], reg[5], reg[6])
            b = (b + reg[7] + o + r[c]) & 0xFFFFFFFF
            reg[3] = reg[2]
            reg[2] = self._le(reg[1], 9)
            reg[1] = reg[0]
            reg[0] = u
            reg[7] = reg[6]
            reg[6] = self._le(reg[5], 19)
            reg[5] = reg[4]
            reg[4] = (b ^ self._le(b, 9) ^ self._le(b, 17)) & 0xFFFFFFFF

        for l in range(8):
            self.reg[l] = (self.reg[l] ^ reg[l]) & 0xFFFFFFFF

    def sum(self, e, fmt=None):
        if e:
            self.reset()
            self.write(e)
        self._fill()
        for f in range(0, len(self.chunk), 64):
            self._compress(self.chunk[f:f + 64])

        if fmt == 'hex':
            result = ""
            for f in range(8):
                result += hex(self.reg[f])[2:].zfill(8)
            return result

        result = [0] * 32
        for f in range(8):
            c = self.reg[f]
            result[4 * f + 3] = c & 255
            c >>= 8
            result[4 * f + 2] = c & 255
            c >>= 8
            result[4 * f + 1] = c & 255
            c >>= 8
            result[4 * f] = c & 255
        self.reset()
        return result


# ── Custom Base64 (s4 charset) ──
S4 = "Dkdpgh2ZmsQB80/MfvV36XI1R45-WUAlEixNLwoqYTOPuzKFjJnry79HbGcaStCe"

def result_encrypt(long_str):
    """Custom base64 encoding using s4 charset (matching JS result_encrypt)"""
    result = []
    for i in range(0, len(long_str), 3):
        if i + 2 < len(long_str):
            n = (ord(long_str[i]) << 16) | (ord(long_str[i + 1]) << 8) | ord(long_str[i + 2])
        elif i + 1 < len(long_str):
            n = (ord(long_str[i]) << 16) | (ord(long_str[i + 1]) << 8)
        else:
            n = ord(long_str[i]) << 16

        for j, k in zip(range(18, -1, -6), (0xFC0000, 0x03F000, 0x0FC0, 0x3F)):
            if j == 6 and i + 1 >= len(long_str):
                break
            if j == 0 and i + 2 >= len(long_str):
                break
            result.append(S4[(n & k) >> j])

    return ''.join(result)


# ── Random prefix ──
def gener_random(random_val, option):
    """Generate 4 random bytes"""
    r = int(random_val)
    return [
        (r & 255 & 170) | option[0] & 85,
        (r & 255 & 85) | option[0] & 170,
        (r >> 8 & 255 & 170) | option[1] & 85,
        (r >> 8 & 255 & 85) | option[1] & 170,
    ]


# ── Browser environment string ──
DEFAULT_WINDOW_ENV = "1536|747|1536|834|0|30|0|0|1536|834|1536|864|1525|747|24|24|Win32"


# ── Main a_bogus generation ──
def generate_a_bogus(url_params, user_agent, window_env=None, suffix="cus", arguments=None):
    """
    Generate a_bogus signature matching bdms 1.0.1.19

    Args:
        url_params: URL query string (without a_bogus/msToken)
        user_agent: Browser User-Agent string
        window_env: Browser environment string (default: Win32 dimensions)
        suffix: Hash suffix (default: "cus")
        arguments: [arg0, arg1, arg2] (default: [0, 1, 14])

    Returns:
        a_bogus signature string
    """
    if window_env is None:
        window_env = DEFAULT_WINDOW_ENV
    if arguments is None:
        arguments = [0, 1, 14]

    sm3 = SM3()
    start_time = int(time.time() * 1000)

    # Double SM3 of URL params + suffix
    url_search_params_list = sm3.sum(sm3.sum(url_params + suffix))

    # Double SM3 of suffix
    cus = sm3.sum(sm3.sum(suffix))

    # UA processing: rc4_encrypt(UA, key) → result_encrypt → SM3
    ua_key = chr(int(0.00390625)) + chr(1) + chr(arguments[2])
    ua_encrypted = rc4_encrypt(user_agent, ua_key)
    ua_result = result_encrypt(ua_encrypted)
    ua = sm3.sum(ua_result)

    end_time = int(time.time() * 1000)

    # Build b array
    b = {}
    b[8] = 3  # fixed
    b[10] = end_time
    b[15] = {
        "aid": 6383,
        "pageId": 6241,
        "boe": False,
        "ddrt": 7,
        "paths": {"include": [{},{},{},{},{},{},{}], "exclude": []},
        "track": {"mode": 0, "delay": 300, "paths": []},
        "dump": True,
        "rpU": ""
    }
    b[16] = start_time
    b[18] = 44  # fixed
    b[19] = [1, 0, 1, 5]

    # Start time bytes
    b[20] = (b[16] >> 24) & 255
    b[21] = (b[16] >> 16) & 255
    b[22] = (b[16] >> 8) & 255
    b[23] = b[16] & 255
    b[24] = (b[16] // 4294967296) & 0xFFFFFFFF
    b[25] = (b[16] // 4294967296 // 256) & 0xFFFFFFFF

    # Arguments bytes
    b[26] = (arguments[0] >> 24) & 255
    b[27] = (arguments[0] >> 16) & 255
    b[28] = (arguments[0] >> 8) & 255
    b[29] = arguments[0] & 255
    b[30] = (arguments[1] // 256) & 255
    b[31] = (arguments[1] % 256) & 255
    b[32] = (arguments[1] >> 24) & 255
    b[33] = (arguments[1] >> 16) & 255
    b[34] = (arguments[2] >> 24) & 255
    b[35] = (arguments[2] >> 16) & 255
    b[36] = (arguments[2] >> 8) & 255
    b[37] = arguments[2] & 255

    # URL params SM3 bytes (double hash)
    b[38] = url_search_params_list[21]
    b[39] = url_search_params_list[22]

    # Suffix SM3 bytes
    b[40] = cus[21]
    b[41] = cus[22]

    # UA SM3 bytes
    b[42] = ua[23]
    b[43] = ua[24]

    # End time bytes
    b[44] = (b[10] >> 24) & 255
    b[45] = (b[10] >> 16) & 255
    b[46] = (b[10] >> 8) & 255
    b[47] = b[10] & 255
    b[48] = b[8]
    b[49] = (b[10] // 4294967296) & 0xFFFFFFFF
    b[50] = (b[10] // 4294967296 // 256) & 0xFFFFFFFF

    # pageId bytes
    b[51] = b[15]['pageId']
    b[52] = (b[15]['pageId'] >> 24) & 255
    b[53] = (b[15]['pageId'] >> 16) & 255
    b[54] = (b[15]['pageId'] >> 8) & 255
    b[55] = b[15]['pageId'] & 255

    # aid bytes
    b[56] = b[15]['aid']
    b[57] = b[15]['aid'] & 255
    b[58] = (b[15]['aid'] >> 8) & 255
    b[59] = (b[15]['aid'] >> 16) & 255
    b[60] = (b[15]['aid'] >> 24) & 255

    # Window env (browser fingerprint string char codes)
    window_env_list = [ord(c) for c in window_env]
    b[64] = len(window_env_list)
    b[65] = b[64] & 255
    b[66] = (b[64] >> 8) & 255

    b[69] = 0  # [].length
    b[70] = b[69] & 255
    b[71] = (b[69] >> 8) & 255

    # Complex XOR checksum
    b[72] = (b[18] ^ b[20] ^ b[26] ^ b[30] ^ b[38] ^ b[40] ^ b[42] ^
             b[21] ^ b[27] ^ b[31] ^ b[35] ^ b[39] ^ b[41] ^ b[43] ^
             b[22] ^ b[28] ^ b[32] ^ b[36] ^ b[23] ^ b[29] ^ b[33] ^
             b[37] ^ b[44] ^ b[45] ^ b[46] ^ b[47] ^ b[48] ^ b[49] ^
             b[50] ^ b[24] ^ b[25] ^ b[52] ^ b[53] ^ b[54] ^ b[55] ^
             b[57] ^ b[58] ^ b[59] ^ b[60] ^ b[65] ^ b[66] ^ b[70] ^ b[71]) & 255

    # Build bb array (44 elements)
    bb = [
        b[18], b[20], b[52], b[26], b[30], b[34], b[58], b[38], b[40], b[53], b[42],
        b[21], b[27], b[54], b[55], b[31],
        b[35], b[57], b[39], b[41], b[43], b[22], b[28], b[32], b[60], b[36], b[23],
        b[29], b[33], b[37], b[44], b[45],
        b[59], b[46], b[47], b[48], b[49], b[50], b[24], b[25], b[65], b[66], b[70], b[71]
    ]

    # Concatenate: bb + window_env_list + checksum
    full_data = bb + window_env_list + [b[72]]

    # RC4 encrypt with key "\x79" (121 = "y")
    rc4_result = rc4_encrypt(''.join(chr(x & 0xFF) for x in full_data), chr(121))

    # Random prefix (12 chars)
    rand1 = gener_random(rand.random() * 10000, [3, 45])
    rand2 = gener_random(rand.random() * 10000, [1, 0])
    rand3 = gener_random(rand.random() * 10000, [1, 5])
    random_str = ''.join(chr(x & 0xFF) for x in (rand1 + rand2 + rand3))

    # Combine and encode
    combined = random_str + rc4_result
    return result_encrypt(combined) + "="


if __name__ == "__main__":
    # Test
    params = "device_platform=webapp&aid=6383&keyword=test"
    ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36"
    ab = generate_a_bogus(params, ua)
    print(f"a_bogus: {ab}")
    print(f"length: {len(ab)}")

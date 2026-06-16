"""
分析 collectData 接口的加密数据
"""

import json
import base64

# 捕获的完整请求数据
captured_data = {
    "type": 1,
    "challenge": "s_GWnPBPf0mT2ycyDcoGvhp71lYMmFImxr",
    "verifyId": "v_EVoY1s1iGnAgOLOAuEvDPYjg1ofZE0zt",
    "collectData": "N1Q4U1VOQzg0VFdPS0ZPTD8Aur4o8q7aWFolCjAOMbabdqIF3A7Ij3tguhTKM9FoK9QOR8eztffrezhNws/DU7As8tyYePp36RV93XNK/2+ZdZs9y7LmGZDdq2p53L51zmfW9ArjiUMqDI3oANPd93brlGN98BYKD25AefI2hn9d9a1UXoLAvevTDiNhlC7dRGf0I9tmyDrnAtSpNgTYn2b0XrNWqWCL76QaNoymADhYCFCaSF9upCb2j8kbMcx7TDEMJ1TK3elCTt4y2VNl1LErCAd8ztEGuajTSCNrQtAFXYTyba/KlO+kSUhUVs5NBJ0HGLwK6n+loyRPLtc1vYHggd9RU+zWoS+/JPQi/qwHkNvZCPHxKGhxoIs+w4suT4uvqs1Zdl9qOBXA/zgKjLuttCBkS35DnI1ljaOZyM5pZTMUew+ThjL80aXGmdy2FF2yvTVRvgI9Uv6x2fh/dMOtfePAzICZutPuMTMzRycTSqoX5dVLEtbk5rJtAAqJiNVzWjtLOsgIFaOPTqG2K7yEnBHKvC8P4R++9qtOM0YQDeiJLHoqkGJiQfIXeyC6e5ljpup3sVaOTazKsfZEJEkITfGJAMCvMlRADs7F9hR4OSmuLba1i25JwgYJj7XDkotr5y/Ddoz0HP2+gUJJaT5SYBoQy/hn4kJm/fr7pJ9PQUPXbW3yFWCKp3gHpkJ5WKbsz8BQYEKvtobbsNPwf8sgsXRm3BJvV6xj31Sa35/7mUHKRZezyQK7JaSibvqV6dr84hvSD5CnVWxmkdSwmaURP15Kn9QwKtYWeHsQjrvhud+pIgbPFpZP2yFT+XSWV/ksme/URQcoghm/oG+0auN1H58eXViCyEBxM9JUuxKpzyP8GJsXHMNSDH06BKJENAKwZWSse2StWCqQ47j8T5yWh+fx18+vEfYELo2cCSfRZ/edlvwYpefSzFfIfmfX1lWjUWCdELkS4LNRxubKfEVSE3h17puFEi1o+vHrDHp7jYF/bPN+hjznppmg85p6wvD4U8P4t3autNrvA5HjLnsPwMTJLswZ8Ie3Sqke2LzbD+5mrlura+wIVt6iy02MONRnwy4HfrofIfH2SloWO9IizQru2na2uBVvp1QAU2YwMTjyz0b+4Gn+9ZIHmgQWILnRfRJz36CEOMN97PnhidVUZBqM1I+WZA+zh0EBckKMzBQ35GO5Clrsmavky3Br/4pqEBd8+TwZc/mEfeA8FsCUuesWmcYpteCYSAXqcy3kMOnuQetLWnZuQCNpx/AAqpbUOUcGTUxD9NrBm7r30cRd/WQW2BfO9eMLUZLsE+KTyx8hVJfKvIE6qRL4hMKYI8gaLhSBEx6ggoDQnBWcmysKOcnj2kizCXuUxVCyGJWRDVDixhcSoIUUOXZiAOKJUPfTPUWEfJxetbT6Tt9JA2qXqOc8Ii1uY214wBAB3o3leA4ucnHq7s3ZFoI6VXgmYXKtfGD8Lnj7T6ad88KZakJ08Dc3+Uj4F2SnQl6lbjqjIYdQlu2L4fY0p4qyG4djcUXsrnQ3xycDHCGqAilr+RQcZ1rB+WyrRTFjiDxShtN1rvA+louR4AV0VesWjAVcR2gmoVUQL7+Nurs9aJPfqWnpoVt5+dlLTLcrxi8IDURQN8Ll1SJva8QiATCJJCaDZydt7po9AvyTq1DErcvKN5GhvyayxdH9ffeuMKRCF1EuHcBn1llZ+p5GSUnwA90XmVubFZ81CemR3PrTJhxGVwC0t64WITYVDzhS9y52u58I+H9MPOmEFTtAl8zmj+MTIBNP9Lv0N/fC2bn0qnnOTYMGb8IdUE7lfqPE3PJWEfJA1bXY4CGqsdLjSmBa8LrnKxxOkWbOVuz+jNBdJhVe4SHxNOn5ey8OcSbH60bUioxnLyOAVRkzrAhDnEysZm1VstLbj+VIZCIu2gPoUUTTGFYUP4XjuBpS8jsmXProxh8zuzVJLfCF157WMbeT1Mdnmnjm11l4SvcT5nr008maCEJ//rxDFsuw//nMjMMBF0a5Yv9DEFMRdI+Rwe9cYVayAsmWLxOY2asxF0nblY2+21q3jj5uygLVMwHEgCY/n2MsLkXHiRoiK06ASq5A/DD8dJTmeNmU7h0buTRS1WzCAPhpfzToAD7KlUAZwWBh+zDXMna4ZYaTO81r0IBr/RBgIK2dHS5xI3cGaMm64/BDyJw+AOGcPmK9qiCqMBdCTNa829U2L1LaX979bV0vrXz92Qz22/dLtFjLbOrFpUREbI+uUW8jeg8AqOPb+kQbYsFT948nV4aw1Zvzp0ovpGHY5FfzNr87OBtkPgC37GsgWVBn/JzlSayLV6+94Yikv6pZ0aZuOaBJAGZoNGJhcn2R4kqpSg5NudagCScxbI+7RL9tMbbGv6P3hJSz3WyKgHTwcvK6oNLnm+20Okc6CIBuNz2VYO0FC1/ygDDvj4eEiUrEL79LzwZNS7nTITBdcOnIEnTuz3jSPKS9GCKhuCYAPs7Sc6Xp3hBucHHwcJCByT5UIiNFsSpZm8r7wPUire6o0/bStivtrqg+1dUeKCWyaXridhVOD1Iue6nAdaX9zyhGl0JsRxuwUrVl8+kIEtlTcF1KFPWvCZUX4fYPbKAOItFrr9Gwy7rya/h0h5+d52RYlCv9hmrlu4iFy0iDc9eXZ27TBNw5T1d9ewabzHQjjscTtMluS+hm0Z4yR2zDGFCLFdJ5SaVU2zbeypOYDZV8PvQoFvzVUlVSXgtUULcsENhfFjZPp6t1zZgaF6c3oLVKTv/X7lM9Ljy0wkj5JleA/faC91W+lC9Slml4TbzxfzpbN82TSsQ/yZOv2gWbZkb+3ENq+ZFPrpXPR8JpGOoEmBVLpFRDf40XxByPK1kBoXjLii0rHdc/GXe4zeVJb5L6KyqrxuLvNXYwFA/N3HczRiSInEJnxYfHMvTiJLDSbu2QXw0sppN9fMbJ+/swxgeDAGp9Mx7OjoHCtD/wOi7hQlZx0HIknOW72BxZcUOPUjV0cT9xO/Xpwqv+ZVgDhmueU77ZPBb0kGkHEf0uDqWqmYrCw++Cnz7YjkEPpwWQ5yFXsNzLGWgxCXWYtcJC2KeEU61jIK4IGzt1KBPY0s/fAmLkCLUYJuNoH51/sALawcCWQuJQurYakI/Bv2Uwt1vZ3CV/zymPz/jxXKv2k/TXUxpVaJacLpRpzjRzCfVhcec9cQrE9xkLMSNUzlR/aXp093DNKOh1BK0eOYj1Ckb71g2ZVcfreeUDZUIAp7y6w1fukMJLh/+ISfmdKtDVjMaKnZ1Vmz4ClroLl0AlSJPXheUB6lR8HRjEl3pal+1pUTeZN2SfxKgMY4DvmWB9QIfZrgGFwAbNI2W70lIEUEo19FQ7P1Us55hGCixhSDgTu7CjqTzhwbOl/HvXVYv58PGQj0EzOvwFwQOTmc0BcjvanRouZ6FtGta3AvqrO8Q554D2XT9Fj0JZTwrtUeLYAJeY+Xhgz75s6Tw424dHzsld3gBt4w8U3h6l02NlvTktTO3tDSkuna9YPbH6ZIEwHQLAKy25nRWuklRLtQSyxkGds0MFre2tB+Zhqz9HvPGU1jD9AvMsDD70DeaNxeEMfY2nR7ni7E3vi8nt38GXicK/O3/z7sy59kjjxU1N54oEQGpO4Se5k+qqoHdInLJLyywMH6xyMKFhHekPX3vnUwdhApS0whbDh4SVPXLDkOLaqGklacP2EH3zaIWAPwm6SptUKuDT8OFcvHKnBcrP235w+iaerLzroirpMXCUET7ev7ySUMhSfTypiIU0hLXyII8zvEntS2BKYxI9TmrcfyWyrcPTh/FUfzrMaT4MSxx8pSy9pJ5Un4niJjH0GKTLJL4yJ7h/x+5TYm9XnQXtfbgWnYPAns681HF296PYS5UKZb4NNjgZPwglNFLaHecG59bUY4Jmx21uOKw8YLxQ4Rh/GLneJPvi4iio7wT7li+fy9f/crE7rdPwZojRWdsu0ecx9e/PDVrjyBM8+n+dygTDjeH4zuzG3I+jO2mZLYVeCQgZnEzo2CuoJ9a9+wXR7x+Y7fKj7wteGUJmCQa9I2wLUHI+WAC0MMfdLlH6YbiyjrnZt7OYun7UQ4JMq7TH8CXCZWhLbf+M19n8su0gRQEnX//Ua2lU6Lml09NEX1MTFvklXb1xw3yBR7jO9A6P/d9KMTOLI1I3iKYmfX/eSKNrA9Ce291arOFNqNOwSrSN5KfxrFqMQseUJHcfD4KWabocf62ZnFbEnuq36u2FOiBulH6f4U8OIyd5tkl+07MnPOotLxxZSW0O0lTenfBFqMzGAKoC+ljH4MDLTgf240/QauQvTqXoJz0QlpKbtgpFyGZZHfX3pGQUJ1U4q2AUhE5DtCYwmktR60EXDfvokBqKct+2atgSDeO9i21mMQS9GoWm3sgQWwhYslMR801FE5uOK8sXvsOb5zNWhVa3DnG3X1vn0k7gIYx7tkvwqAVIBUUbbjYx5uqEiKq12mbE2/UswXSKpL5ww5SCP9i4DwIIinDJCqes3M8R7sbM9ZfuklAHBuLmVCuXSt4j+4Wyb9gg6FhygIwjJWvjH+mtpNh8/2numVBDwYXFLaK9gSJU3PEWZzOWVtU=",
    "key": "ebXRdTB1tFZV2bMNzN8JMzpL8lePf12ghxtTE9RlXkBYKAZO1VFSd8Z12nD8vOleYd/C+4Mp9K70hw3U5R4fTN8QSc5m4j8FsNZ2T9bAQxDMiAepWjYCMWJp6H+jC1264Rwy67+aTTYUX7iPMJkyzJ0g24VF28Jg/gsejiMbdW7Z5ZRiDui6Dem0EaMX2ftedjDsUJSbnk6MFeA0PN9pRkv5NcT46N7ZLvb95Nmt61M670ltQUZxW5CrmHWR8lj9bJ1tAtkeQzbyveKdR06zJRqVVv2JoAC7w64T3bDCeIsB1oYcIMJdRHw81wGvIS+FTmhsv/eryMpkEpi/iez29Q==",
    "callback": "verify_1776854443115"
}

print("=" * 80)
print("collectData 接口数据分析")
print("=" * 80)

print(f"\n📋 基本信息:")
print(f"  type: {captured_data['type']}")
print(f"  challenge: {captured_data['challenge']}")
print(f"  verifyId: {captured_data['verifyId']}")
print(f"  callback: {captured_data['callback']}")

print(f"\n🔐 加密字段分析:")
print(f"  collectData 长度: {len(captured_data['collectData'])} 字符")
print(f"  key 长度: {len(captured_data['key'])} 字符")

# 尝试 Base64 解码
print(f"\n🔍 Base64 解码分析:")

try:
    collectdata_decoded = base64.b64decode(captured_data['collectData'])
    print(f"  collectData 解码后长度: {len(collectdata_decoded)} 字节")
    print(f"  collectData 前 50 字节 (hex): {collectdata_decoded[:50].hex()}")
    print(f"  collectData 前 50 字节 (repr): {repr(collectdata_decoded[:50])}")
except Exception as e:
    print(f"  ❌ collectData Base64 解码失败: {e}")

try:
    key_decoded = base64.b64decode(captured_data['key'])
    print(f"\n  key 解码后长度: {len(key_decoded)} 字节")
    print(f"  key 解码后 (hex): {key_decoded.hex()}")
    print(f"  key 可能是: {'RSA-2048 加密' if len(key_decoded) == 256 else '其他加密'}")
except Exception as e:
    print(f"  ❌ key Base64 解码失败: {e}")

# 分析数据特征
print(f"\n📊 数据特征分析:")
print(f"  collectData:")
print(f"    - Base64 编码: ✅")
print(f"    - 长度较长: ✅ (可能是加密数据)")
print(f"    - 可能包含: 轨迹数据、设备信息、时间戳等")

print(f"\n  key:")
print(f"    - Base64 编码: ✅")
print(f"    - 解码后 256 字节: {'✅ RSA-2048' if len(key_decoded) == 256 else '❓'}")
print(f"    - 可能是: RSA 公钥加密的 AES 密钥")

print(f"\n💡 推测的加密流程:")
print(f"  1. 生成随机 AES 密钥")
print(f"  2. 用 AES 加密验证数据 (轨迹、位置等) → collectData")
print(f"  3. 用 RSA 公钥加密 AES 密钥 → key")
print(f"  4. 发送到服务端")

print(f"\n{'=' * 80}")
print("下一步需要:")
print("  1. 找到前端代码中的 RSA 公钥")
print("  2. 找到 AES 加密函数的实现")
print("  3. 分析 collectData 的明文结构")
print("=" * 80)

# 保存数据到文件
with open('collectdata_captured.json', 'w', encoding='utf-8') as f:
    json.dump(captured_data, f, indent=2, ensure_ascii=False)

print(f"\n✅ 数据已保存到: collectdata_captured.json")

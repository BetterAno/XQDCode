"""穷举验证 sign 计算方式"""
import base64, json, hashlib
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

key = '4LEJbupFf627EKJ0'
uuid = '2e812f6b-a5c0-4bc6-8d7b-7772e5740483'
check_id = '6DAF601139764C6AA8F9DA6DBF149508'
client_ip = '113.247.41.241'
encrypted_b64 = 'Mn/ijCHcaJIxAGbLvwWpflJ1PRHPTS0Q05uL6wQP7uR3yqTAVdcsxDY44cV6V6i76PFo+66TV4AxyBwqbV1BT0XQPJW4/pUi3AQDsVkruTJRfS+2CILUynM/D/rpF8YpCTuZ/Sfr+6tBjP9KqruuMTRxdJq0dSUmKKYWzFC5VE4i7s2tuYu4i3NzSX2Dom6eWLxZ+bllYzIjQkv9G11VIbnux79H1I1PnmzU24+B9UV0pu2DYOM+cdFNh5qAbmrrOpKD1MNJKe2Piqckm5vPavx8Rq5JD/LknVQNnlD+33U4pMcHQk3f0enDtNaTk4Feklghaa/704fERZZbt5OcGlVw1LYo9KrD3MyYFSJC+YkbQKbmN6KLE52930cPJ8mnPXzUrRIW1j3v7svChwmQLL7KOQNpPXJN8bUbYI40EqAxq/sNgdnOJv0Etyeq9cLv3KONwt8SnhK0vnuYy4s0GTZh9bflEH6WKmc4kPU0E/0ZQx8r77HZTSHM/bfrikzMxMo/7YJvVMB12/sMfwGm2aKkl9GGDoUM3w8TbF8cYeL5Y4febVTcQnLMti+AuDAMSNC35oC+1V2A+dzNGg77xSr7oEm/TWn3EbcAL+xgJ9i8lavM4EyNAVEosDt2HoZR1ifrKOSiWD4fsdMlZkzAMLOiNLGRlptX5gxXFu5Me8aI+ChM1JG+ytfcvkIfOZbIVb0KGZTLCMfHSNLGZrWK11+iXUv2fcZtx4Ur6Ek9G7wMr7z3NLTQjpNuBKxMB5EovJWrzOBMjQFRKLA7dh6GUdYn6yjkolg+H7HTJWZMwDD8RUtBOsyuGCyYk+LEwMkboqSX0YYOhQzfDxNsXxxh4v557cofynEMtfvPwb8vhBcxq/sNgdnOJv0Etyeq9cLv3KONwt8SnhK0vnuYy4s0GcJSBrLMP3r8ImGEDhSq8BRVcNS2KPSqw9zMmBUiQvmJo6eeVn9RGJwsprtFiDFs3nSm7YNg4z5x0U2HmoBuauvzjUYkjfETf3L/z8dQvRveCTuZ/Sfr+6tBjP9KqruuMTRxdJq0dSUmKKYWzFC5VE5tPc7jqQXRXDdfB8fHQDa00gdNApg5fO2pDv4Ml7t3EVGnDEFv/eyLfL0uWvq3bY9fol1L9n3GbceFK+hJPRu8Ugu8tEsXBdqCGmSHIQghyDvu6b+g0VHUrOtEMAYwMijWJ+so5KJYPh+x0yVmTMAwuFoLFI3nk/KhaUovGE5lQKKkl9GGDoUM3w8TbF8cYeJSLwkSYDXpT/bYrSi25qb8Mav7DYHZzib9BLcnqvXC79yjjcLfEp4StL57mMuLNBlNv3b0478+LwVy74vheXgFVXDUtij0qsPczJgVIkL5iUGa7CR8bov+1h5QU47ebXp0pu2DYOM+cdFNh5qAbmrrC6x7GRXqyXFKNRyVc61wOAk7mf0n6/urQYz/Sqq7rjE0cXSatHUlJiimFsxQuVROOK8d1u7zGPCJ4ivdrca9AdIHTQKYOXztqQ7+DJe7dxEq5XUPGkEURoJO/dodqHAKX6JdS/Z9xm3HhSvoST0bvDQ2PSbv1u7t1Ged0Qx3UtA='

cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
decrypted = unpad(cipher.decrypt(base64.b64decode(encrypted_b64)), AES.block_size)
data = json.loads(decrypted.decode('utf-8'))
actual_sign = data["sign"]
track = data["track"]

print(f'实际 sign: {actual_sign}')
print(f'track 点数: {len(track)}')

# 构建不同的 track 字符串格式
# 格式1: x + y + time (原实现)
track_str1 = ''.join([f"{t['x']}{t['y']}{t['time']}" for t in track])
# 格式2: 每个字段用固定宽度
track_str2 = ''.join([f"{t['x']:03d}{t['y']:03d}{t['time']}" for t in track])
# 格式3: JSON stringify
track_str3 = json.dumps(track, separators=(',', ':'))

variants = {
    # 不同的字段组合
    'ip+key+uuid+track(xyt)': f'{client_ip}{key}{uuid}{track_str1}',
    'ip+key+checkId+track(xyt)': f'{client_ip}{key}{check_id}{track_str1}',
    'key+uuid+track(xyt)': f'{key}{uuid}{track_str1}',
    'key+checkId+track(xyt)': f'{key}{check_id}{track_str1}',
    'ip+key+track(xyt)': f'{client_ip}{key}{track_str1}',
    'key+track(xyt)': f'{key}{track_str1}',
    'ip+key+uuid+track(3d)': f'{client_ip}{key}{uuid}{track_str2}',
    'ip+key+checkId+track(3d)': f'{client_ip}{key}{check_id}{track_str2}',
    # 用 JSON 格式的 track
    'ip+key+uuid+track(json)': f'{client_ip}{key}{uuid}{track_str3}',
    'ip+key+checkId+track(json)': f'{client_ip}{key}{check_id}{track_str3}',
    # 无 track
    'ip+key+uuid': f'{client_ip}{key}{uuid}',
    'ip+key+checkId': f'{client_ip}{key}{check_id}',
}

print(f'\n=== 穷举 sign 验证 ===')
for name, raw in variants.items():
    calc_sign = hashlib.md5(raw.encode()).hexdigest()
    match = calc_sign == actual_sign
    if match:
        print(f'*** MATCH *** {name}: {calc_sign}')
    # else:
    #     print(f'  {name}: {calc_sign[:16]}... no match')

# 额外尝试: UUID去掉横杠
uuid_no_dash = uuid.replace('-', '')
track_str = track_str1
extra = {
    'ip+key+uuid_nodash+track': f'{client_ip}{key}{uuid_no_dash}{track_str}',
    'key+uuid_nodash+track': f'{key}{uuid_no_dash}{track_str}',
}
for name, raw in extra.items():
    calc_sign = hashlib.md5(raw.encode()).hexdigest()
    match = calc_sign == actual_sign
    if match:
        print(f'*** MATCH *** {name}: {calc_sign}')

print('\n如果没有 MATCH, 尝试将 sign 的输入数据完整打印:')
# 打印 track 前5个点的原始数据
for i, t in enumerate(track[:5]):
    print(f'  track[{i}]: {t}')

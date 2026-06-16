"""验证 querySlideImage 响应中各字段到混淆变量的映射
通过遍历 JSON key 来穷举验证 sign 计算
"""
import base64, json, hashlib
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

key = '4LEJbupFf627EKJ0'
uuid = '2e812f6b-a5c0-4bc6-8d7b-7772e5740483'
check_id = '6DAF601139764C6AA8F9DA6DBF149508'
client_ip = '113.247.41.241'
point_y = 37
encrypted_b64 = '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'

cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
decrypted = unpad(cipher.decrypt(base64.b64decode(encrypted_b64)), AES.block_size)
data = json.loads(decrypted.decode('utf-8'))
actual_sign = data["sign"]
track = data["track"]

# 构建 track 字符串
track_str = ''.join([f"{t['x']}{t['y']}{t['time']}" for t in track])

# querySlideImage 返回的所有字段
response_fields = {
    'checkId': check_id,
    'clientIp': client_ip,
    'key': key,
    'pointX': '0',
    'pointY': str(point_y),
}

# 穷举所有 3 字段排列组合 + track
from itertools import permutations
field_names = list(response_fields.keys())

print(f'实际 sign: {actual_sign}')
print(f'track 点数: {len(track)}')
print()

# 尝试所有1字段 + track, 2字段+track, 3字段+track 的排列
found = False
for r in range(1, 5):
    if found:
        break
    for perm in permutations(field_names, r):
        raw = ''.join([response_fields[f] for f in perm]) + track_str
        calc = hashlib.md5(raw.encode()).hexdigest()
        if calc == actual_sign:
            print(f'*** MATCH *** 字段顺序: {list(perm)} + track')
            print(f'  raw前100字符: {raw[:100]}')
            found = True
            break

if not found:
    # 也尝试 uuid 作为其中一个字段
    all_fields = {**response_fields, 'uuid': uuid}
    field_names2 = list(all_fields.keys())
    for r in range(1, 5):
        if found:
            break
        for perm in permutations(field_names2, r):
            raw = ''.join([all_fields[f] for f in perm]) + track_str
            calc = hashlib.md5(raw.encode()).hexdigest()
            if calc == actual_sign:
                print(f'*** MATCH *** 字段顺序: {list(perm)} + track')
                print(f'  raw前100字符: {raw[:100]}')
                found = True
                break

if not found:
    print('未找到匹配的排列组合')
    print('尝试不用 trackStr...')
    for r in range(1, 6):
        if found:
            break
        for perm in permutations(list(all_fields.keys()), r):
            raw = ''.join([all_fields[f] for f in perm])
            calc = hashlib.md5(raw.encode()).hexdigest()
            if calc == actual_sign:
                print(f'*** MATCH (无track) *** 字段顺序: {list(perm)}')
                found = True
                break

"""Decrypt browser-captured checkCode data and analyze track format"""
import base64, json
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

print('sign:', data['sign'])
print('track points:', len(data['track']))
print()
print('First 5 points:')
for p in data['track'][:5]:
    print(f'  x={p["x"]}, y={p["y"]}, time={p["time"]}')
print()
print('Last 5 points:')
for p in data['track'][-5:]:
    print(f'  x={p["x"]}, y={p["y"]}, time={p["time"]}')
print()
print('x range:', min(p['x'] for p in data['track']), '-', max(p['x'] for p in data['track']))
print('y values:', set(p['y'] for p in data['track']))
print('time range:', min(p['time'] for p in data['track']), '-', max(p['time'] for p in data['track']))
print('time span (ms):', max(p['time'] for p in data['track']) - min(p['time'] for p in data['track']))

# Build trackString and verify sign
track_str = ''.join([f'{t["x"]}{t["y"]}{t["time"]}' for t in data['track']])
import hashlib
sign_calc = hashlib.md5(f'{client_ip}{check_id}{uuid}{track_str}'.encode()).hexdigest()
print(f'\nSign verification:')
print(f'  actual:   {data["sign"]}')
print(f'  computed: {sign_calc}')
print(f'  match: {sign_calc == data["sign"]}')

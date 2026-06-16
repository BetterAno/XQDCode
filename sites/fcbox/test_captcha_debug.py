"""
Fcbox 验证码纯协议模块 - 调试测试
逐步输出每个环节的数据，定位验证码失败原因
"""

import sys
import os
import json
import base64
import uuid
import time
import random
import hashlib
import requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

# 加入src路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from captcha import FcboxCaptchaSolver

YUNMA_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"


def debug_test():
    solver = FcboxCaptchaSolver(yunma_token=YUNMA_TOKEN)

    # ========== Step 1: querySlideImage ==========
    print("=" * 60)
    print("[Step 1] querySlideImage")
    print("=" * 60)
    uid = str(uuid.uuid4())
    url = f"{solver.BASE_URL}/captcha/querySlideImage/{uid}"
    print(f"  URL: {url}")
    print(f"  UUID: {uid}")
    print(f"  Headers: {dict(solver.session.headers)}")
    
    resp = solver.session.post(url, timeout=15)
    print(f"  Status: {resp.status_code}")
    print(f"  Response Headers: {dict(resp.headers)}")
    
    raw = resp.json()
    print(f"  Response JSON (formatted):")
    print(json.dumps(raw, indent=2, ensure_ascii=False))
    
    if not raw.get('success'):
        print("  [FAIL] querySlideImage 返回 success=false")
        return
    
    data = raw.get('data', {})
    check_id = data.get('checkId')
    key = data.get('key')
    client_ip = data.get('clientIp', '')
    point_x = data.get('pointX', 0)
    point_y = data.get('pointY', 0)
    shade_url = data.get('shadeImageUrl')
    slide_url = data.get('slideImageUrl')
    
    print(f"\n  关键字段:")
    print(f"    uid       = {uid}")
    print(f"    checkId   = {check_id}")
    print(f"    key       = {key}")
    print(f"    clientIp  = {client_ip}")
    print(f"    pointX    = {point_x}")
    print(f"    pointY    = {point_y}")
    print(f"    shadeUrl  = {shade_url}")
    print(f"    slideUrl  = {slide_url}")
    
    if point_x == 0:
        print("\n  [WARN] pointX=0, 当前IP可能被风控!")
        print("  尝试用云码识别缺口位置...")
    
    # ========== Step 2: 云码识别 ==========
    print("\n" + "=" * 60)
    print("[Step 2] 云码识别缺口位置")
    print("=" * 60)
    
    if point_x > 0:
        distance = point_x
        print(f"  使用 pointX 作为 distance: {distance}")
    else:
        distance = solver.solve_with_yunma(shade_url, slide_url)
        if distance is None:
            print("  [FAIL] 云码识别失败")
            return
        print(f"  云码识别 distance: {distance}")
    
    # ========== Step 3: 生成轨迹 ==========
    print("\n" + "=" * 60)
    print("[Step 3] 生成轨迹")
    print("=" * 60)
    
    track = solver.generate_track(distance, point_y=point_y)
    print(f"  轨迹点数: {len(track)}")
    print(f"  前3个点: {track[:3]}")
    print(f"  后3个点: {track[-3:]}")
    
    # ========== Step 4: 计算 sign ==========
    print("\n" + "=" * 60)
    print("[Step 4] 计算 sign")
    print("=" * 60)
    
    track_str = solver.build_track_string(track)
    # sign = MD5(clientIp + checkId + UUID + trackString)，第二参数是 checkId 不是 key
    sign_raw = f"{client_ip}{check_id}{uid}{track_str}"
    sign = hashlib.md5(sign_raw.encode('utf-8')).hexdigest()
    
    print(f"  clientIp = '{client_ip}'")
    print(f"  key      = '{key}' (用于AES加密)")
    print(f"  checkId  = '{check_id}' (用于sign计算)")
    print(f"  uid      = '{uid}' (用于sign计算)")
    print(f"  trackStr 长度 = {len(track_str)}")
    print(f"  trackStr 前100字符 = {track_str[:100]}")
    print(f"  signRaw 长度 = {len(sign_raw)}")
    print(f"  signRaw 前200字符 = {sign_raw[:200]}")
    print(f"  sign = {sign}")
    
    # ========== Step 5: AES 加密 ==========
    print("\n" + "=" * 60)
    print("[Step 5] AES 加密")
    print("=" * 60)
    
    payload = {
        "sign": sign,
        "track": track
    }
    plaintext = json.dumps(payload, separators=(',', ':'))
    print(f"  明文长度: {len(plaintext)}")
    print(f"  明文前200字符: {plaintext[:200]}")
    print(f"  AES key: '{key}' (长度={len(key)})")
    
    # 验证 AES 加密/解密一致性
    encrypted = solver.aes_encrypt(payload, key)
    print(f"  密文(base64)长度: {len(encrypted)}")
    print(f"  密文前100字符: {encrypted[:100]}")
    
    # 解密验证
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    decrypted = unpad(cipher.decrypt(base64.b64decode(encrypted)), AES.block_size)
    decrypted_json = json.loads(decrypted.decode('utf-8'))
    print(f"  解密验证: sign匹配={decrypted_json['sign'] == sign}, track点数={len(decrypted_json['track'])}")
    
    # ========== Step 6: checkCode 提交 ==========
    print("\n" + "=" * 60)
    print("[Step 6] checkCode 提交验证")
    print("=" * 60)
    
    check_url = f"{solver.BASE_URL}/captcha/checkCode/{uid}"
    print(f"  URL: {check_url}")
    print(f"  注意：checkCode URL 使用 UUID（与 querySlideImage 相同），而非 checkId")
    print(f"  Content-Type: text/plain")
    print(f"  Body长度: {len(encrypted)}")
    print(f"  int8:true → 直接发送 base64 字符串")

    check_resp = solver.session.post(check_url, data=encrypted, headers={
        "Content-Type": "text/plain"
    }, timeout=15)
    
    print(f"  Status: {check_resp.status_code}")
    print(f"  Response Headers: {dict(check_resp.headers)}")
    print(f"  Response Body: {check_resp.text}")
    
    try:
        check_data = check_resp.json()
        print(f"  Response JSON (formatted):")
        print(json.dumps(check_data, indent=2, ensure_ascii=False))
    except:
        print(f"  Response 非JSON: {check_resp.text[:500]}")
    
    # ========== 分析 ==========
    print("\n" + "=" * 60)
    print("[分析] 失败原因排查")
    print("=" * 60)
    
    if check_data.get('code') == 400100100:
        print("  错误码 400100100 → 验证码已过期/无效")
        print("  可能原因: 1) 时间窗口过短 2) clientIp不匹配 3) sign计算有误")
    elif check_data.get('code') == 400100200:
        print("  错误码 400100200 → 滑块位置验证失败")
        print("  可能原因: 1) distance计算不准确 2) 轨迹不合理")
    elif not check_data.get('success'):
        print(f"  其他错误: code={check_data.get('code')}, msg={check_data.get('chnDesc', check_data.get('msg', 'N/A'))}")


if __name__ == "__main__":
    debug_test()

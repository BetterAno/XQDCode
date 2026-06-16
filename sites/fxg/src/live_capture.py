"""
实时捕获最新的 captchaBody 和 URL
需要配合浏览器手动操作
"""
import json
import time
import requests
from urllib.parse import urlparse, parse_qs

def monitor_and_capture():
    """
    监控浏览器网络请求并捕获最新的 captchaBody
    """
    print("=" * 80)
    print("实时监控浏览器捕获")
    print("=" * 80)
    print("\n请按以下步骤操作：")
    print("1. 确保浏览器已打开抖店登录页面")
    print("2. 触发验证码（输入邮箱密码点击登录）")
    print("3. 手动拖动滑块完成验证")
    print("4. 观察下方输出，程序会自动捕获 verify 请求")
    print("\n等待捕获中...")
    
    # 这个脚本需要配合浏览器手动操作
    # 由于我们无法直接从浏览器获取请求体，这里提供一个模板
    
    print("\n" + "=" * 80)
    print("捕获模板")
    print("=" * 80)
    
    # 从浏览器开发者工具 Network 面板复制以下信息：
    
    # 1. 完整的 URL（从 Headers 标签页的 Request URL）
    VERIFY_URL = "从浏览器复制完整的 captcha/verify URL"
    
    # 2. Request Body（从 Payload 标签页）
    CAPTCHA_BODY = "从浏览器复制 Request Body"
    
    # 3. 请求头（从 Headers 标签页）
    headers = {
        "accept": "*/*",
        "content-type": "text/plain;charset=UTF-8",
        "origin": "https://rmc.bytedance.com",
        "referer": "https://rmc.bytedance.com/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
        "sec-ch-ua": '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"'
    }
    
    if VERIFY_URL == "从浏览器复制完整的 captcha/verify URL":
        print("\n❌ 请先从浏览器复制数据！")
        print("\n详细步骤：")
        print("1. 打开浏览器开发者工具 (F12)")
        print("2. 切换到 Network 面板")
        print("3. 勾选 'Preserve log'")
        print("4. 拖动滑块完成验证")
        print("5. 在 Network 列表中找到 'verify' 请求（POST 方法）")
        print("6. 点击该请求：")
        print("   - Headers 标签页 -> 复制 Request URL")
        print("   - Payload 标签页 -> 复制 Request Body")
        print("7. 粘贴到本脚本的 VERIFY_URL 和 CAPTCHA_BODY 变量")
        print("8. 立即运行测试（参数会过期！）")
        return False
    
    print(f"\n1. URL 长度: {len(VERIFY_URL)}")
    print(f"2. captchaBody 长度: {len(CAPTCHA_BODY)}")
    
    print("\n3. 发送请求...")
    try:
        start_time = time.time()
        response = requests.post(
            VERIFY_URL,
            data=CAPTCHA_BODY,
            headers=headers,
            timeout=10
        )
        elapsed = time.time() - start_time
        
        print(f"   响应时间: {elapsed:.2f} 秒")
        print(f"   状态码: {response.status_code}")
        print(f"   响应: {response.text[:300]}")
        
        try:
            result = response.json()
            print(f"\n   解析结果:")
            print(f"     code: {result.get('code')}")
            print(f"     message: {result.get('message')}")
            
            if result.get('code') == 200:
                print("\n" + "=" * 80)
                print("✅ 验证成功！")
                print("=" * 80)
                return True
            else:
                print(f"\n❌ 验证失败: {result.get('message')}")
                return False
                
        except:
            print("   无法解析响应")
            return False
            
    except Exception as e:
        print(f"   请求失败: {e}")
        return False

def analyze_captcha_body_structure():
    """分析 captchaBody 的结构"""
    print("\n" + "=" * 80)
    print("captchaBody 结构分析")
    print("=" * 80)
    
    # 使用之前捕获的真实 captchaBody
    REAL_CAPTCHA_BODY = "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"
    
    import base64
    import math
    
    print(f"原始长度: {len(REAL_CAPTCHA_BODY)}")
    
    try:
        decoded = base64.b64decode(REAL_CAPTCHA_BODY)
        print(f"Base64 解码后长度: {len(decoded)}")
        print(f"前32字节 hex: {decoded[:32].hex()}")
        print(f"前16字节 raw: {decoded[:16]}")
        
        # 计算熵值
        byte_counts = [0] * 256
        for byte in decoded:
            byte_counts[byte] += 1
        
        entropy = 0
        for count in byte_counts:
            if count > 0:
                prob = count / len(decoded)
                entropy -= prob * math.log2(prob)
        
        print(f"数据熵: {entropy:.3f} bits/byte (最大 8.0)")
        if entropy > 7.5:
            print("高熵值 -> 加密数据")
        
        # 检查头部结构
        print(f"\n头部分析:")
        print(f"  字节 0-1: {decoded[0:2].hex()} (可能是魔数)")
        print(f"  字节 2-3: {decoded[2:4].hex()} (可能是版本)")
        print(f"  字节 4-7: {decoded[4:8].hex()} (可能是长度/标志)")
        print(f"  字节 8-11: {decoded[8:12].hex()} (可能是偏移)")
        print(f"  字节 12-15: {decoded[12:16].hex()} (可能是校验)")
        
    except Exception as e:
        print(f"分析失败: {e}")

if __name__ == "__main__":
    # 分析 captchaBody 结构
    analyze_captcha_body_structure()
    
    # 运行监控捕获
    print("\n\n")
    monitor_and_capture()

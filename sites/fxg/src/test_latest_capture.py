"""
使用最新的浏览器捕获数据进行验证测试
"""
import json
import time
import requests

# 从浏览器网络日志捕获的最新数据
CAPTURED_VERIFY_URL = "https://verify.zijieapi.com/captcha/verify?aid=4272&lang=zh&repoId=590050&bd_version=1.0.0.759&subtype=slide&detail=cWJn8PVIjmv6LftVbuYP71G5e0nxYM7-lv5m*Wbjfh94*-LfLyk1fUWqSCyQzrZGZhv*h45T1NqmaHS-w6FFoyHNvAhKtmB4VCCteITG6z0v5XolEc8GnhbGQvbw0sU6DogbcCJxntgENFrKdalDgnInDDFV9PbA8Tvduf1zlNXY8h-jNRl9M8FLvZMzoCwSOrxhIJf7p3gkFB4KyveoKlNpcTCMwVK9qer-XYRoPguh5wwFElxpK15yN0OMgl*tmZ9jcIxcqy66mm4Q5vF7t25t3NwS9OhSHS1LgcNK6vzkWx9UwP60gfgWUTgQQ7bYYNyU1Z8aBTirkIglHRtcRsV8VybUHA7xoMSaI9MfRgCHcI*He8BYc1Ch3xuIslSS&server_sdk_env=%7B%22idc%22%3A%22lq%22%2C%22region%22%3A%22CN%22%2C%22server_type%22%3A%22passport%22%7D&mode=slide&fp=verify_mozttz2s_2d52990c_b49f_038f_4168_46b2b64847fb&h5_check_version=4.0.13&os_name=windows&platform=pc&os_type=2&h5_sdk_version=3.5.77&webdriver=false&tmp=1778420814277&xx-tt-dd=qJI7ttpVdGKKbSBvYqmaf0aPo&msToken=DJJ_3fQZ-u06SgBfeDRRSI0t-mM80HoGINCqcwyY5xTH0vzDRUOnWV--a63-XrIPYzu1aNtAmoSHdoUYbziz0MGkoRv3POKPRNTKklMeTUentt74MdH52iao2vmuuwdSkY9bu5KuCarsXu-x0rEtDt8hoea-VdvOay93Z3BK2kfhEAedX2k2RDU%3D&a_bogus=O74nkH7LQxAce3%2FamOPj7XQlBox%2FNP8yHHTouFr59qKkawUPtN-%2FY36hbKixRVZRARB6iH1HrnGtbfjauxGTICrkKmkDuTGyWs%2FVVusL2ZwsGsihrZy0eJSEoi-CU84YY%2FAeEo05AGsnZDcWVH9xABaHu%2FvJ-RDZFN3tVZbSP9KR0Wujwx%2FIaVtdThiqij%3D%3D"

# 之前捕获的真实 captchaBody（需要替换为最新的）
# 这个是从之前的请求中捕获的，可能需要更新
REAL_CAPTCHA_BODY = "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"

def test_latest_capture():
    """测试最新捕获的数据"""
    print("=" * 80)
    print("最新浏览器捕获数据测试")
    print("=" * 80)
    
    print(f"\n1. 捕获的 URL 长度: {len(CAPTURED_VERIFY_URL)}")
    print(f"   URL 前100字符: {CAPTURED_VERIFY_URL[:100]}...")
    
    print(f"\n2. captchaBody 长度: {len(REAL_CAPTCHA_BODY)}")
    print(f"   captchaBody 前50字符: {REAL_CAPTCHA_BODY[:50]}...")
    
    # 请求头（从浏览器复制）
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
    
    print("\n3. 发送 verify 请求...")
    try:
        start_time = time.time()
        response = requests.post(
            CAPTURED_VERIFY_URL,
            data=REAL_CAPTCHA_BODY,
            headers=headers,
            timeout=10
        )
        elapsed = time.time() - start_time
        
        print(f"   响应时间: {elapsed:.2f} 秒")
        print(f"   状态码: {response.status_code}")
        print(f"   响应内容: {response.text[:500]}")
        
        # 解析响应
        try:
            result = response.json()
            print(f"\n   解析后的响应:")
            print(f"     code: {result.get('code')}")
            print(f"     message: {result.get('message')}")
            
            if 'data' in result:
                data = result.get('data')
                if data:
                    print(f"     data: {json.dumps(data, indent=4, ensure_ascii=False)[:300]}")
                else:
                    print(f"     data: null")
            
            # 判断是否成功
            if result.get('code') == 200:
                print("\n" + "=" * 80)
                print("✅ 验证成功！！！")
                print("=" * 80)
                print("\n这说明：")
                print("1. captchaBody 加密格式正确")
                print("2. URL 参数有效（未过期）")
                print("3. 请求头正确")
                return True
            else:
                print(f"\n❌ 验证失败: {result.get('message')}")
                
                # 分析错误码
                error_code = result.get('code')
                if error_code == 504:
                    print("\n错误分析：")
                    print("  504 参数错误 -> 可能原因：")
                    print("  1. URL 参数已过期（detail, msToken, a_bogus 等有时效性）")
                    print("  2. captchaBody 格式或内容错误")
                    print("  3. 请求参数不匹配")
                elif error_code == 5011:
                    print("\n错误分析：")
                    print("  5011 格式错误 -> captchaBody 格式不正确")
                elif error_code == 5013:
                    print("\n错误分析：")
                    print("  5013 内容错误 -> captchaBody 内容不正确或已过期")
                
                return False
                
        except json.JSONDecodeError:
            print("   无法解析 JSON 响应")
            print(f"   原始响应: {response.text[:200]}")
            return False
            
    except requests.exceptions.Timeout:
        print("   请求超时")
        return False
    except requests.exceptions.RequestException as e:
        print(f"   请求异常: {e}")
        return False
    except Exception as e:
        print(f"   未知错误: {e}")
        import traceback
        traceback.print_exc()
        return False

def extract_url_params():
    """提取 URL 中的关键参数"""
    from urllib.parse import urlparse, parse_qs
    
    parsed = urlparse(CAPTURED_VERIFY_URL)
    params = parse_qs(parsed.query)
    
    print("\n" + "=" * 80)
    print("URL 关键参数提取")
    print("=" * 80)
    
    key_params = ['detail', 'fp', 'msToken', 'a_bogus', 'tmp']
    for param in key_params:
        if param in params:
            value = params[param][0]
            if len(value) > 50:
                print(f"{param}: {value[:50]}...")
            else:
                print(f"{param}: {value}")
        else:
            print(f"{param}: 未找到")

if __name__ == "__main__":
    # 提取 URL 参数
    extract_url_params()
    
    # 运行测试
    print("\n\n")
    success = test_latest_capture()
    
    if not success:
        print("\n\n" + "=" * 80)
        print("测试失败 - 参数可能已过期")
        print("=" * 80)
        print("\n建议：")
        print("1. 重新在浏览器中触发验证码")
        print("2. 立即复制最新的 URL 和 captchaBody")
        print("3. 更新本脚本中的 CAPTURED_VERIFY_URL 和 REAL_CAPTCHA_BODY")
        print("4. 尽快运行测试（参数有效期很短）")

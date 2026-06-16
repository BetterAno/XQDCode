"""
使用浏览器实时监控捕获最新的 captchaBody 和 URL 参数
然后立即进行验证测试
"""
import json
import time
import requests

def test_with_browser_capture():
    """
    说明：
    1. 在浏览器中打开 https://fxg.jinritemai.com/login/common
    2. 点击"邮箱登录"，输入邮箱和密码
    3. 当验证码出现时，手动拖动滑块完成验证
    4. 在浏览器开发者工具 Network 面板中找到 captcha/verify 请求
    5. 复制完整的 URL 和 Request Body
    6. 粘贴到下面的变量中
    """
    
    print("=" * 80)
    print("浏览器实时捕获测试")
    print("=" * 80)
    print("\n请按照以下步骤操作：")
    print("1. 在浏览器中打开: https://fxg.jinritemai.com/login/common")
    print("2. 点击'邮箱登录'标签")
    print("3. 输入测试邮箱和密码（任意）")
    print("4. 点击登录按钮触发验证码")
    print("5. 打开浏览器开发者工具 (F12) -> Network 面板")
    print("6. 手动拖动滑块完成验证")
    print("7. 在 Network 面板中找到 'captcha/verify' 请求")
    print("8. 复制完整的请求 URL 和 Request Body")
    print("\n请将捕获的数据粘贴到下面的变量中：\n")
    
    # ===== 在这里粘贴从浏览器捕获的数据 =====
    
    # 完整的 verify URL（包含所有参数）
    VERIFY_URL = "请粘贴完整的 captcha/verify URL"
    
    # Request Body（captchaBody）
    CAPTCHA_BODY = "请粘贴 Request Body"
    
    # ==========================================
    
    if VERIFY_URL == "请粘贴完整的 captcha/verify URL":
        print("\n❌ 请先从浏览器捕获数据并粘贴到脚本中！")
        print("\n捕获提示：")
        print("- URL 应该以 https://verify.zijieapi.com/captcha/verify 开头")
        print("- Request Body 是一个 base64 编码的长字符串")
        print("- 可以在 Network 面板中点击请求，查看 Headers 和 Payload")
        return False
    
    print("\n" + "=" * 80)
    print("开始测试...")
    print("=" * 80)
    
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
    
    print(f"\n1. 请求 URL 长度: {len(VERIFY_URL)}")
    print(f"   URL 前100字符: {VERIFY_URL[:100]}...")
    print(f"\n2. captchaBody 长度: {len(CAPTCHA_BODY)}")
    print(f"   captchaBody 前50字符: {CAPTCHA_BODY[:50]}...")
    
    print("\n3. 发送 verify 请求...")
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
                print("\n下一步：")
                print("- 分析这个成功的 captchaBody 的加密逻辑")
                print("- 实现本地生成器")
                print("- 实现完整的自动化流程")
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
                    print("\n建议：")
                    print("  - 尽快从浏览器复制数据并立即测试（避免过期）")
                    print("  - 检查 URL 中的所有参数是否完整")
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

def test_extract_from_network_log():
    """
    辅助函数：从浏览器 Network 日志中提取参数
    """
    print("\n" + "=" * 80)
    print("如何从浏览器 Network 日志提取参数")
    print("=" * 80)
    print("\n步骤：")
    print("1. 打开浏览器开发者工具 (F12)")
    print("2. 切换到 Network 面板")
    print("3. 确保勾选了 'Preserve log'（保留日志）")
    print("4. 拖动滑块完成验证")
    print("5. 在 Network 列表中找到 'verify' 请求（通常是 POST 请求）")
    print("6. 点击该请求，查看详细信息：")
    print("   - Headers 标签页 -> 复制完整的 Request URL")
    print("   - Payload/Request 标签页 -> 复制 Request Body")
    print("\n示例 URL 格式：")
    print("https://verify.zijieapi.com/captcha/verify?aid=4272&lang=zh&...")
    print("\n示例 Body 格式：")
    print("dGMHEAAAMDAwMDAwMDA2YTAwODQwNvjXiY/QVQKTFMqrwCGo...")
    print("\n提示：")
    print("- URL 非常长（包含很多参数），需要完整复制")
    print("- Body 是一个 base64 编码的字符串")
    print("- 尽快复制并测试，参数会过期！")

if __name__ == "__main__":
    # 显示提取说明
    test_extract_from_network_log()
    
    # 运行测试
    print("\n\n")
    success = test_with_browser_capture()
    
    if not success:
        print("\n\n" + "=" * 80)
        print("测试失败 - 请按照说明重新捕获最新数据")
        print("=" * 80)

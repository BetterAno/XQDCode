"""
验证 douyin_abogus 纯算实现是否适用于搜索接口
"""
import sys
import os
import requests
from urllib.parse import urlencode, quote

# 添加 douyin_abogus 到 path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'douyin_abogus'))
from abogus_local import ABogus, generate_a_bogus

# 从真实抓包提取的参数（去掉 a_bogus、msToken、verifyFp、fp）
params = {
    "device_platform": "webapp",
    "aid": "6383",
    "channel": "channel_pc_web",
    "search_channel": "aweme_general",
    "enable_history": "1",
    "keyword": "李在峰八段锦",
    "search_source": "normal_search",
    "query_correct_type": "1",
    "is_filter_search": "0",
    "from_group_id": "",
    "disable_rs": "0",
    "offset": "0",
    "count": "10",
    "need_filter_settings": "0",
    "list_type": "single",
    "pc_search_top_1_params": '{"enable_ai_search_top_1":1}',
    "search_id": "2026061114200000TEST000000000001",
    "update_version_code": "170400",
    "pc_client_type": "1",
    "pc_libra_divert": "Windows",
    "support_h265": "1",
    "support_dash": "1",
    "cpu_core_num": "8",
    "version_code": "190600",
    "version_name": "19.6.0",
    "cookie_enabled": "true",
    "screen_width": "1920",
    "screen_height": "1080",
    "browser_language": "zh-CN",
    "browser_platform": "Win32",
    "browser_name": "Chrome",
    "browser_version": "146.0.0.0",
    "browser_online": "true",
    "engine_name": "Blink",
    "engine_version": "146.0.0.0",
    "os_name": "Windows",
    "os_version": "10",
    "device_memory": "8",
    "platform": "PC",
    "downlink": "10",
    "effective_type": "4g",
    "round_trip_time": "50",
    "webid": "7650016773043111467",
    "uifid": "ed3eadd74fe8fd7fe8cc39b2f8425a87324d41d3f6a0cfdc014da4c26c6540511f1fec1b0513f9a29db4edb3181e705e066241e4ab8d17aa2f452dff806383e6955167397393eaea75cce58a00b9cce9036ce0eac2a7aebcb3cd00fdd2625723bcdd628f6f2e8bbb7b1e6d6e7f40c83a502e8a5bf37cd0f4d172c6d6581ce059e8faf646072d9e36a85d3db4aef7499f45d6675399daed5365ef2d54795aa2a0",
}

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36"

# 浏览器实际生成的 a_bogus（从真实抓包）
REAL_A_BOGUS = "EXs5kzyimombFV/bYOYUt53lP/9ANPSyuGi/bqoltOwVPwMcg8NtBNGjrxFr075SrupikFI76dP/YnVc8ttTZ9rpFmkvukJj7G2Inyfo/qNdPFvsEqmYez0Fuw0bMcTL-A/AE94R6s0e2DQW9r9sApIHw/3rRbDdFH3UV/znP9K4USujin2AaVYDqhXc"

# 浏览器实际生成的 msToken
REAL_MSTOKEN = "modzZP55f9e51wZZWlzgCaPXdakLjmxIeAt7Hqj6KMxeV_7Nla14MSkFb-MSsgnFcr-kl96S6b5kXlkY5ISxqfytJaNoO_d8n6Aj9TAcD2CVmfJBCcOkUDySa5hpms99X_78DUhtE3Kb_GFg0u6Rd6evbXX8VbWVvnUF8KdBjkC_2Qu84geoPA=="


def test_generate_a_bogus():
    """测试本地生成 a_bogus"""
    print("=" * 60)
    print("测试: 本地生成 a_bogus")
    print("=" * 60)

    # 生成 URL 参数字符串
    params_str = urlencode(params, doseq=True)
    print(f"参数长度: {len(params_str)}")
    print(f"参数 (前200): {params_str[:200]}")

    # 生成 a_bogus
    bogus = ABogus()
    local_ab = bogus.get_value(params_str, UA)

    print(f"\n本地生成: {local_ab}")
    print(f"长度: {len(local_ab)}")
    print(f"\n浏览器生成: {REAL_A_BOGUS}")
    print(f"长度: {len(REAL_A_BOGUS)}")

    # 注意：a_bogus 包含随机前缀，每次生成都不同
    # 所以我们只能验证格式，不能验证值相等
    print("\n⚠ a_bogus 包含随机前缀，值每次不同，只能验证格式和服务端有效性")


def test_request_with_local_ab():
    """用本地生成的 a_bogus 发送请求"""
    print("\n" + "=" * 60)
    print("测试: 用本地 a_bogus 发请求")
    print("=" * 60)

    # 使用 test.py 中的 cookies
    cookies = {
        "ttwid": "1%7CsQEZVLYAQjvJzCorLhlAe1QSSnF311IwjGVYZw3U94A%7C1781157067%7Cbb277960647ef1f8de4bb79efb940ef63ec8c5b0a2311d9398be53d0538ccf1f",
        "passport_csrf_token": "d398b283294479035a901443e6e43cab",
    }

    headers = {
        "User-Agent": UA,
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://www.douyin.com/search/",
    }

    # 生成 a_bogus
    params_str = urlencode(params, doseq=True)
    bogus = ABogus()
    local_ab = bogus.get_value(params_str, UA)

    # 组装请求参数
    req_params = dict(params)
    req_params["a_bogus"] = local_ab
    req_params["msToken"] = REAL_MSTOKEN  # 复用浏览器的 msToken
    req_params["verifyFp"] = "verify_mq93oq1f_nGSp7JWC_HMP1_4NOK_A0XE_1FL3RYKrYP4f"
    req_params["fp"] = "verify_mq93oq1f_nGSp7JWC_HMP1_4NOK_A0XE_1FL3RYKrYP4f"

    url = "https://www.douyin.com/aweme/v1/web/general/search/single/"

    print(f"请求 URL: {url}")
    print(f"a_bogus (本地): {local_ab[:60]}...")

    try:
        # 尝试用 requests（可能被风控拦截）
        resp = requests.get(url, params=req_params, headers=headers, cookies=cookies, timeout=15)
        print(f"状态码: {resp.status_code}")
        print(f"Content-Type: {resp.headers.get('Content-Type', 'N/A')}")
        print(f"响应 (前500): {resp.text[:500]}")

        if resp.status_code == 200:
            data = resp.json()
            if data.get("status_code") == 0:
                print("\n✅ 请求成功！a_bogus 纯算适用于搜索接口")
            else:
                print(f"\n❌ API 返回错误: {data.get('status_msg', 'N/A')}")
        else:
            print(f"\n❌ HTTP 错误")
    except Exception as e:
        print(f"❌ 请求失败: {e}")


def test_compare_only():
    """仅对照测试，不发请求"""
    print("=" * 60)
    print("对照测试: 本地生成 vs 浏览器生成")
    print("=" * 60)

    params_str = urlencode(params, doseq=True)
    bogus = ABogus()
    local_ab = bogus.get_value(params_str, UA)

    # 检查格式特征
    s2_chars = "Dkdpgh4ZKsQB80/Mfvw36XI1R25-WUAlEi7NLboqYTOPuzmFjJnryx9HVGcaStCe="

    print(f"参数数量: {len(params)}")
    print(f"参数字符串长度: {len(params_str)}")
    print(f"\n本地 a_bogus:")
    print(f"  值: {local_ab}")
    print(f"  长度: {len(local_ab)}")
    print(f"  字符集验证: {all(c in s2_chars for c in local_ab)}")

    print(f"\n浏览器 a_bogus:")
    print(f"  值: {REAL_A_BOGUS}")
    print(f"  长度: {len(REAL_A_BOGUS)}")
    print(f"  字符集验证: {all(c in s2_chars for c in REAL_A_BOGUS)}")

    # 两者格式一致即为通过
    format_match = len(local_ab) == len(REAL_A_BOGUS)
    print(f"\n格式匹配: {'✅' if format_match else '❌ 长度不一致'}")

    return format_match


if __name__ == "__main__":
    test_compare_only()
    print()
    # test_request_with_local_ab()

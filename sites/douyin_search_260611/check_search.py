"""
测试抖音搜索接口：所有测试统一使用 offset=30
"""
import sys, os, time
import requests
from urllib.parse import urlencode

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'douyin_abogus'))
from abogus_local import ABogus

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36"

COOKIES = {
    "s_v_web_id": "verify_mpb26mim_HlbcKToN_AsTn_4VLm_8M8j_clzrb821Wi9V",
    "ttwid": "1%7CsQEZVLYAQjvJzCorLhlAe1QSSnF311IwjGVYZw3U94A%7C1781157067%7Cbb277960647ef1f8de4bb79efb940ef63ec8c5b0a2311d9398be53d0538ccf1f",
    "passport_csrf_token": "d398b283294479035a901443e6e43cab",
    "UIFID": "e8af8eec168e6006bb749042c72c8d2abad7941d853b8500624783ee98d61da65824fd962e1ed454a930dbd635723f3172811a8c4df1f31fe7c951454380f0d7417ec39b725d47e39de891f1c53e21919b0417d9d0c66c5e0088157684d3f8ea1d7c9cb3427d4c59221ded2245d7681f1b008c594741fecebbcca7c67c3cd725705e12683eaabc4bedfc306f240012090ae66e4a3f9842b7e3243149cb15e509",
    "odin_tt": "7e25a0293807d52608d13514a6a6a95a9a3ea3bcd1abf8860e4131db9d75eb3f102079699730f5d64fcbb7e065629d514f4c0ab39f8c972d291630f5b6c52000b19f439177ad119a5fff6c51e5dee2af",
    "sessionid": "1e112ca162df94910b33abce6ef89c0a",
    "sid_guard": "1e112ca162df94910b33abce6ef89c0a%7C1781157060%7C5184000%7CMon%2C+10-Aug-2026+05%3A51%3A00+GMT",
    "__ac_nonce": "06a2a4c63001d102c5414",
    "__ac_signature": "_02B4Z6wo00f01eEGn.gAAIDCbK4mc1wRXoHhJptAABJte8",
}

HEADERS = {
    "User-Agent": UA,
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://www.douyin.com/search/",
}

# Browser-generated values for reference
BROWSER_MS_TOKEN = "p9Q3ZcMXK4qum_doZZsHLuEGPJON47d1X2ctntZxDyG4-gHFrBDplVQcifh2xoYz55cFccDk-PLTrzhZ6zDd8WPmqd1cSZdr0t9oBhbXiN2xgNEelbQiI4tH__IBtMbi70htrhO3D3NYborX4VfNgnLJ4Gq-cxVJ2F5iz4dSwJ8JADZDhGcIjQ=="
BROWSER_A_BOGUS = "DjsnkHtyDNAnKdMGYCNy74qUB79/rBSy0eTdRjoTCOF1PwtPM8P4FxtqnxznX6Cb1YpskFc7rneMcDnbuzXhZ9HpzmkDuOwSJzQAnU8LgqHXYBvZ9rmmCJSEovsNUWGYzOQriaL16t0F2gc3gZKFAqP9HKzc58bMOZPbdn4lSxg56avYVnQHC-hM"
BROWSER_SEARCH_ID = "20260611135927C5793FD3B2F38BCD0004"


def make_params(keyword="Li Zaifeng Ba Duan Jin", offset="30"):
    ts = time.strftime("%Y%m%d%H%M%S") + format(int(time.time() * 1000) % 2**32, 'X')
    return {
        "device_platform": "webapp", "aid": "6383", "channel": "channel_pc_web",
        "search_channel": "aweme_general", "enable_history": "1",
        "keyword": keyword, "search_source": "normal_search",
        "query_correct_type": "1", "is_filter_search": "0",
        "from_group_id": "", "disable_rs": "0",
        "offset": offset, "count": "10", "need_filter_settings": "0",
        "list_type": "single",
        "pc_search_top_1_params": '{"enable_ai_search_top_1":1}',
        "search_id": ts + "A" * 8,
        "update_version_code": "170400", "pc_client_type": "1",
        "pc_libra_divert": "Windows", "support_h265": "1", "support_dash": "1",
        "cpu_core_num": "12", "version_code": "190600", "version_name": "19.6.0",
        "cookie_enabled": "true", "screen_width": "1280", "screen_height": "720",
        "browser_language": "zh-CN", "browser_platform": "Win32",
        "browser_name": "Chrome", "browser_version": "148.0.0.0",
        "browser_online": "true", "engine_name": "Blink",
        "engine_version": "148.0.0.0", "os_name": "Windows", "os_version": "10",
        "device_memory": "32", "platform": "PC",
        "downlink": "10", "effective_type": "4g", "round_trip_time": "100",
        "webid": "7645921329246406170",
        "uifid": COOKIES["UIFID"],
        "verifyFp": COOKIES["s_v_web_id"],
        "fp": COOKIES["s_v_web_id"],
    }


def do_request(label, params):
    r = requests.get(
        "https://www.douyin.com/aweme/v1/web/general/search/single/",
        params=params, headers=HEADERS, cookies=COOKIES, timeout=15
    )
    print(f"  [{label}] HTTP {r.status_code}")
    try:
        data = r.json()
        print("do_requests:::", data)
        sc = data.get("status_code", "N/A")
        msg = data.get("status_msg", "")
        items = data.get("data", [])
        item_count = len(items) if isinstance(items, list) else "N/A"
        print(f"  status_code={sc}  msg={msg}  items={item_count}")

        if isinstance(items, list) and items:
            first = items[0]
            if "aweme_info" in first:
                ai = first["aweme_info"]
                print(f"  first: {ai.get('desc', 'N/A')[:50]}")
    except:
        print(f"  body(200): {r.text[:200]}")
    print()


if __name__ == "__main__":
    # --- Test 1: Baseline (browser-generated values) ---
    print("=" * 60)
    print("Test 1: Baseline (browser a_bogus + msToken, offset=30)")
    print("=" * 60)
    p1 = make_params(keyword="李在峰八段锦", offset="30")
    p1["search_id"] = BROWSER_SEARCH_ID  # match original
    p1["msToken"] = BROWSER_MS_TOKEN
    p1["a_bogus"] = BROWSER_A_BOGUS
    do_request("Baseline", p1)

    # # --- Test 2: Local AB + browser msToken ---
    # print("=" * 60)
    # print("Test 2: Local a_bogus + browser msToken, offset=30")
    # print("=" * 60)
    # p2 = make_params(keyword="Li Zaifeng Ba Duan Jin", offset="30")
    # p2["msToken"] = BROWSER_MS_TOKEN
    # params_str = urlencode(p2, doseq=True)
    # bogus = ABogus()
    # local_ab = bogus.get_value(params_str, UA)
    # p2["a_bogus"] = local_ab
    # print(f"  local_ab: {local_ab[:60]}... (len={len(local_ab)})")
    # do_request("LocalAB+ms", p2)

    # # --- Test 3: Local AB, no msToken ---
    # print("=" * 60)
    # print("Test 3: Local a_bogus only, no msToken, offset=30")
    # print("=" * 60)
    # p3 = make_params(keyword="Li Zaifeng Ba Duan Jin", offset="30")
    # params_str = urlencode(p3, doseq=True)
    # local_ab2 = bogus.get_value(params_str, UA)
    # p3["a_bogus"] = local_ab2
    # print(f"  local_ab: {local_ab2[:60]}... (len={len(local_ab2)})")
    # do_request("LocalAB-only", p3)

    # # --- Test 4: No AB, no msToken ---
    # print("=" * 60)
    # print("Test 4: No a_bogus, no msToken (control)")
    # print("=" * 60)
    # p4 = make_params(keyword="Li Zaifeng Ba Duan Jin", offset="30")
    # do_request("NoAB", p4)

import urllib.parse

import execjs
import requests

js = execjs.compile(open("抖音a_bogus参数.js", encoding="utf-8").read())

headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://www.douyin.com/user/MS4wLjABAAAAompXkPoYOGsA152dqYoytKycjIZ_aCCxHwGmLX5IsDM?from_tab_name=main",
    'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    # "uifid": "3336119d6ecc0f2721002588cf880fbc4753b1582d4c54bc5f80aa9273463f02aeb1e50af40db7a108d4dfae722ee4c241d6ca1418fc5e32dc28cf0948ec3ac958724bb8aa065a52bfc5f34d6c37b311285690bef055742a94bd30c68e6ac28b78b47a47ee0cf0046ef3642a001c988251e85c5e75a605844558639c9f53be07debedc6de41993990a9ffd926bd0f4390ba0d6b94a9a89b172fc888d9bfd5c09",
    # 注意要与补环境时的 navigator 的 UserAgent 对应
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
}

cookies = {
    # "live_use_vvc": "%22false%兰州交大招标信息",
    # "odin_tt": "e91f62e3f219a96d6bfdb3c89284221f3717e2b66386d9537e713f89839475fd7942ffc4dee3105b30bf6073ba0c3cb50b5a31471aab97d640f6b924ffe5f1956cb9fdb61cfaf43d3b6f0c4537a9f0ca",
    # "volume_info": "%7B%22isMute%兰州交大招标信息%3Atrue%2C%22isUserMute%兰州交大招标信息%3Atrue%2C%22volume%兰州交大招标信息%3A0.6%7D",
    # "enter_pc_once": "1",
    # "UIFID_TEMP": "3336119d6ecc0f2721002588cf880fbc4753b1582d4c54bc5f80aa9273463f02b4edc4c4d9c859eb42703d2a594b1740929b3fa1902793afd9dfaf1e9bc6f980cb89cd70f814838b5460f02d77438d70",
    # "dy_swidth": "1536",
    # "dy_sheight": "864",
    # "s_v_web_id": "verify_midzntxo_WzYIiN7Q_bgaP_4gL7_AKpI_W02mbtZnLNb2",
    # "passport_csrf_token": "86ca3b98059680dc9106c2d0ca693e38",
    # "passport_csrf_token_default": "86ca3b98059680dc9106c2d0ca693e38",
    # "xgplayer_user_id": "819262081471",
    # "__security_mc_1_s_sdk_crypt_sdk": "aa4e56a9-45ce-9f74",
    # "bd_ticket_guard_client_web_domain": "2",
    # "download_guide": "%223%2F20251125%2F0%兰州交大招标信息",
    # "__live_version__": "%221.1.4.4294%兰州交大招标信息",
    # "fpk1": "U2FsdGVkX19q4qNvmPhejHD6uD/IVbWJVCabzmxVWJlnTrmKjYGVTUKL5Z395EnKU+r2rxqAG+r4aMYhJpW8Ng==",
    # "fpk2": "3c9fc7ddec9b58823c1c96756dbd45d8",
    # "stream_player_status_params": "%兰州交大招标信息%7B%5C%22is_auto_play%5C%兰州交大招标信息%3A0%2C%5C%22is_full_screen%5C%兰州交大招标信息%3A0%2C%5C%22is_full_webscreen%5C%兰州交大招标信息%3A0%2C%5C%22is_mute%5C%兰州交大招标信息%3A1%2C%5C%22is_speed%5C%兰州交大招标信息%3A1%2C%5C%22is_visible%5C%兰州交大招标信息%3A0%7D%兰州交大招标信息",
    # "UIFID": "3336119d6ecc0f2721002588cf880fbc4753b1582d4c54bc5f80aa9273463f02aeb1e50af40db7a108d4dfae722ee4c241d6ca1418fc5e32dc28cf0948ec3ac958724bb8aa065a52bfc5f34d6c37b311285690bef055742a94bd30c68e6ac28b78b47a47ee0cf0046ef3642a001c988251e85c5e75a605844558639c9f53be07debedc6de41993990a9ffd926bd0f4390ba0d6b94a9a89b172fc888d9bfd5c09",
    # "strategyABtestKey": "%221764163292.973%兰州交大招标信息",
    # "live_can_add_dy_2_desktop": "%221%兰州交大招标信息",
    # "gulu_source_res": "eyJwX2luIjoiZDg5ZGRhM2JhYWRjMGY2Yzk3MDk4ZWM2Nzk1MTFlZjJjMGMwZTFmMDUyZTBlMTI5MzRkNDg2YzhlM2JjYmZkOSJ9",
    # "__ac_nonce": "0692708540004de455da4",
    # "__ac_signature": "_02B4Z6wo00f01W-IOHAAAIDBDEWPwqo5n6FvqDzAADLIbe",
    "ttwid": "1%7CDDLgwiW-igU-zxv1gwe6QC4DnVBZAx5eKbqJDtPTbpM%7C1764165720%7C4113449e32226c94552b7c0d4b8257cf733d60fe6807cca8c42d602fa57b65ea",
    # "bd_ticket_guard_client_data": "eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCTDh6eGpBeXN1bThyd1lpdGdMbnV0ODBxdUZJSXFEakFZcHl0TFBVaUtselZXYUE1L3BrbFhCeXl0THVvNUJ3OUtaajd4SDJHSmlrRXQ0RHRNam5ESnM9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoyfQ%3D%3D",
    # "biz_trace_id": "b9b1b7af",
    # "bd_ticket_guard_client_data_v2": "eyJyZWVfcHVibGljX2tleSI6IkJMOHp4akF5c3VtOHJ3WWl0Z0xudXQ4MHF1RklJcURqQVlweXRMUFVpS2x6VldhQTUvcGtsWEJ5eXRMdW81Qnc5S1pqN3hIMkdKaWtFdDREdE1qbkRKcz0iLCJyZXFfY29udGVudCI6InNlY190cyIsInJlcV9zaWduIjoiNFk2QThyQ2h3RHEya0dpVjU0V1gwVStNVjJqejlmMWtjaFBGcnVRSVFUVT0iLCJzZWNfdHMiOiIjRnpucVpkVGd0M0JGQkVQaVd0TG90bUpGcXMzTXhSVWJzRENHNVJwelVCWHYrS2RCem52QVJUVVQyaHM3In0%3D",
    # "sdk_source_info": "7e276470716a68645a606960273f276364697660272927676c715a6d6069756077273f276364697660272927666d776a68605a607d71606b766c6a6b5a7666776c7571273f275e58272927666a6b766a69605a696c6061273f27636469766027292762696a6764695a7364776c6467696076273f275e582729277672715a646971273f2763646976602729277f6b5a666475273f2763646976602729276d6a6e5a6b6a716c273f2763646976602729276c6b6f5a7f6367273f27636469766027292771273f2732333435373230333431333234272927676c715a75776a716a666a69273f2763646976602778",
    # "bit_env": "0kyTkOKoVWBMlPyW_BausS-PmQo1m625psIfZKQcVwhGigbk4BvkFUEG5LF6ek6aLrf5zSeiitGYPKKzhZRmbYUk1PUOV-aaDRUAv1_sC5QMIni7JYBWp1VHe6rVxgqnvl-yISgSWWIk1XUF5uGN1RmN3qgCHjvHGAlJw6i4pM_8SjmXDSHTFX7WUwhDCEQqdHLE28zXYyR0Z_p7MGd0sWI07h9dcstF8bktd5F551wawLNWhfzJMDZpFdqJwVn7zg1ktmMTx7a2-f9-oQoTC62xsdklaDxT0osfeGokf1bCFC1BU8ik0LNBCnstgu2cu9ZIcbU7K3aoKV3f-n2ZbQhDzZQWhWFM_8ViI5MiloAnIG3RgPlxNrYdnL3RHgtk0nhGlc6zuigjTbGNLBUMBi85ScWubbmuexsEeADGhZaOKCeliYUW-MrrzRoWFBqIoxckZ2SFS5x38A_8-7Y71Yw5amRf07xj5ovRAOZNcVCl7BW-yD9Tac__uX6Qt9tr",
    # "passport_auth_mix_state": "wf57txm9s9rdt62e2qlqea5tubmjixig",
    # "IsDouyinActive": "true",
    # "home_can_add_dy_2_desktop": "%220%兰州交大招标信息",
    # "stream_recommend_feed_params": "%兰州交大招标信息%7B%5C%22cookie_enabled%5C%兰州交大招标信息%3Atrue%2C%5C%22screen_width%5C%兰州交大招标信息%3A1536%2C%5C%22screen_height%5C%兰州交大招标信息%3A864%2C%5C%22browser_online%5C%兰州交大招标信息%3Atrue%2C%5C%22cpu_core_num%5C%兰州交大招标信息%3A12%2C%5C%22device_memory%5C%兰州交大招标信息%3A8%2C%5C%22downlink%5C%兰州交大招标信息%3A10%2C%5C%22effective_type%5C%兰州交大招标信息%3A%5C%224g%5C%兰州交大招标信息%2C%5C%22round_trip_time%5C%兰州交大招标信息%3A100%7D%兰州交大招标信息"
}
url = "https://www.douyin.com/aweme/v1/web/aweme/post/"

params = {
    "device_platform": "webapp",
    "aid": "6383",
    "channel": "channel_pc_web",
    "sec_user_id": "MS4wLjABAAAAompXkPoYOGsA152dqYoytKycjIZ_aCCxHwGmLX5IsDM",
    "max_cursor": "0",
    "locate_query": "false",
    "show_live_replay_strategy": "1",
    "need_time_list": "1",
    "time_list_query": "0",
    "whale_cut_token": "",
    "cut_version": "1",
    "count": "18",
    "publish_video_strategy_type": "2",
    "from_user_page": "1",
    "update_version_code": "170400",
    "pc_client_type": "1",
    "pc_libra_divert": "Windows",
    "support_h265": "0",
    "support_dash": "0",
    "cpu_core_num": "12",
    "version_code": "290100",
    "version_name": "29.1.0",
    "cookie_enabled": "true",
    "screen_width": "1536",
    "screen_height": "864",
    "browser_language": "zh-CN",
    "browser_platform": "Win32",
    "browser_name": "Chrome",
    "browser_version": "142.0.0.0",
    "browser_online": "true",
    "engine_name": "Blink",
    "engine_version": "142.0.0.0",
    "os_name": "Windows",
    "os_version": "10",
    "device_memory": "8",
    "platform": "PC",
    "downlink": "10",
    "effective_type": "4g",
    "round_trip_time": "100",
    "webid": "7576491808193889832",
    "uifid": "3336119d6ecc0f2721002588cf880fbc4753b1582d4c54bc5f80aa9273463f02aeb1e50af40db7a108d4dfae722ee4c241d6ca1418fc5e32dc28cf0948ec3ac958724bb8aa065a52bfc5f34d6c37b311285690bef055742a94bd30c68e6ac28b78b47a47ee0cf0046ef3642a001c988251e85c5e75a605844558639c9f53be07debedc6de41993990a9ffd926bd0f4390ba0d6b94a9a89b172fc888d9bfd5c09",
    "verifyFp": "verify_midzntxo_WzYIiN7Q_bgaP_4gL7_AKpI_W02mbtZnLNb2",
    "fp": "verify_midzntxo_WzYIiN7Q_bgaP_4gL7_AKpI_W02mbtZnLNb2",
    "msToken": "44DKlO0FQGb1jcf24LCjtALuqulkzMis5y9r89vXJBk99cZUTUTgJaK55pOnEvegPCiAmowdgkhdHSaW64VC1uLk54PJFayj_2_y1HOzuRTmL1eiVrcoEUNJTL8S-A-fTjY6HfIMXPiESvxvGxjid7FthsZ8QpfG5oEQZHkmF8OpEp6haBmgGg==",
    # "a_bogus": "OfUfgqSLOdR5edMtmKrZH95UK9flrTSyilidS7xTSPTZcqUPySP2PnG5GxqVswd6KbB0hH1HHfUlbdncTTUhZCHkumpvSd7y8Td9986L8qrgTPkZV1WdCGSEui-G8CGPQQA7EcEXA0lw12cfZrc0lqPy7AtiB8b8TNafpx4lyxg-g-kYjd2ESiD=",
    # "x-secsdk-web-expire": "1764169360347",
    # "x-secsdk-web-signature": "9c3b3817ed473f44aff08abedaab8c3e"
}

params_str = urllib.parse.urlencode(params)
url_str = 'https://www.douyin.com/aweme/v1/web/aweme/post/?' + params_str

a_bogus = js.call('get_a_bogus', url_str)
params['a_bogus'] = a_bogus

response = requests.get(url, headers=headers, cookies=cookies, params=params)

print(response.text)
print(response)

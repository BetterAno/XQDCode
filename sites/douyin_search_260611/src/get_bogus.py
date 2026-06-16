"""
通过 js-reverse MCP 从浏览器实时获取 a_bogus + msToken
用法:
  python get_bogus.py "device_platform=webapp&aid=6383&keyword=xxx&..."
"""
import json, sys, os

# 这个脚本本身不生成 a_bogus
# 它定义参数模板和接口，实际生成由 Claude 通过 MCP 在浏览器中完成

SEARCH_PARAMS_TEMPLATE = [
    "device_platform", "aid", "channel", "search_channel", "enable_history",
    "keyword", "search_source", "query_correct_type", "is_filter_search",
    "from_group_id", "disable_rs", "offset", "count", "need_filter_settings",
    "list_type", "pc_search_top_1_params", "search_id", "update_version_code",
    "pc_client_type", "pc_libra_divert", "support_h265", "support_dash",
    "cpu_core_num", "version_code", "version_name", "cookie_enabled",
    "screen_width", "screen_height", "browser_language", "browser_platform",
    "browser_name", "browser_version", "browser_online", "engine_name",
    "engine_version", "os_name", "os_version", "device_memory", "platform",
    "downlink", "effective_type", "round_trip_time", "webid", "uifid",
]

REQUIRED_PARAMS = [
    "device_platform", "aid", "keyword", "search_id", "offset", "count",
]

if __name__ == "__main__":
    if len(sys.argv) > 1:
        params_str = sys.argv[1]
        print(json.dumps({"params": params_str, "status": "ready_for_browser_injection"}))
    else:
        print(json.dumps({"templates": SEARCH_PARAMS_TEMPLATE, "required": REQUIRED_PARAMS}))

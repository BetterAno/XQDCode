"""
浏览器 oracle: 通过 MCP 从浏览器实时获取 a_bogus + msToken

使用 Claude + js-reverse MCP 在浏览器中触发 XHR 请求，
bdms.js 拦截后自动生成 a_bogus 和 msToken，我们捕获返回值。

Python 端调用方式:
    result = get_bogus_from_browser(url_params, user_agent)

这个函数不直接执行 - 它生成需要在浏览器中评估的 JavaScript 代码。
Claude 通过 MCP evaluate_script 执行此代码来获取 a_bogus。
"""

import json

INJECTION_SCRIPT = """
(async () => {
    const TARGET_PARAMS = __PARAMS_PLACEHOLDER__;
    const TARGET_UA = __UA_PLACEHOLDER__;

    // Create an XHR that bdms will intercept
    const baseUrl = 'https://www.douyin.com/aweme/v1/web/general/search/single/';
    const fullUrl = baseUrl + '?' + TARGET_PARAMS;

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        let captured = false;

        // Hook open to capture final URL (after bdms adds params)
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            // Check if this URL now has a_bogus (bdms added it)
            if (url.includes('a_bogus=')) {
                captured = true;
                const abMatch = url.match(/[?&]a_bogus=([^&]+)/);
                const msMatch = url.match(/[?&]msToken=([^&]+)/);
                resolve({
                    a_bogus: abMatch ? decodeURIComponent(abMatch[1]) : null,
                    msToken: msMatch ? decodeURIComponent(msMatch[1]) : null,
                    finalUrl: url
                });
            }
            return origOpen.apply(this, arguments);
        };

        xhr.open('GET', fullUrl);
        xhr.send(null);

        // Timeout fallback
        setTimeout(() => {
            if (!captured) {
                XMLHttpRequest.prototype.open = origOpen;
                reject(new Error('Timeout: bdms did not intercept within 3s'));
            }
        }, 3000);
    });
})()
"""

if __name__ == "__main__":
    print("This module provides browser injection scripts for a_bogus generation.")
    print("It must be used through Claude's MCP evaluate_script tool.")
    print()
    print("Example injection:")
    script = INJECTION_SCRIPT.replace("__PARAMS_PLACEHOLDER__",
        '"device_platform=webapp&aid=6383&keyword=test"')
    script = script.replace("__UA_PLACEHOLDER__",
        '"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"')
    print(script[:500])

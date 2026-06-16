"""
瑞数6 协议请求脚本 - 江苏产权市场网 (www.jscq.com.cn)
使用 requests 发起协议请求, Node.js 补环境生成 Cookie
"""

import json
import os
import re
import subprocess
import sys
import tempfile
import time

import requests

# ========== 配置 ==========
BASE_URL = "https://www.jscq.com.cn"
TARGET_URL = f"{BASE_URL}/jscq/cqjy/jygg/cqzr/index.shtml"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
GEN_COOKIE_JS = os.path.join(SCRIPT_DIR, "gen_cookie.js")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,"
              "image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "sec-ch-ua": '"Chromium";v="125", "Google Chrome";v="125", "Not/A)Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
}


def parse_html_response(html: str) -> dict:
    """从 412 响应的 HTML 中提取瑞数要素"""
    result = {"meta_content": "", "meta_id": "", "inline_script": "", "js_url": "", "trigger_call": ""}

    # 提取 meta content (带 id 属性的 meta 标签, content 较长)
    meta_pattern = re.compile(
        r'<meta\s+id="([^"]+)"\s+content="([a-zA-Z0-9_./\-+=]{50,})"',
        re.IGNORECASE
    )
    meta_match = meta_pattern.search(html)
    if meta_match:
        result["meta_id"] = meta_match.group(1)
        result["meta_content"] = meta_match.group(2)
    else:
        # 降级: 无 id 的 meta
        meta_pattern2 = re.compile(
            r'<meta[^>]+content="([a-zA-Z0-9_./\-+=]{50,})"[^>]*>',
            re.IGNORECASE
        )
        meta_match2 = meta_pattern2.search(html)
        if meta_match2:
            result["meta_content"] = meta_match2.group(1)

    # 提取内联 script (设置 $_ts 的代码)
    # 使用最简单的方式: 找到所有 <script>...</script> 内容, 筛选含 $_ts 的
    all_scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
    for script_content in all_scripts:
        stripped = script_content.strip()
        if stripped.startswith("$_ts") or "$_ts=" in stripped[:20]:
            result["inline_script"] = stripped
            break

    # 提取外链 JS URL
    js_pattern = re.compile(
        r'<script[^>]+src="(/[^"]+\.js)"[^>]*>',
        re.IGNORECASE
    )
    js_matches = js_pattern.findall(html)
    for js_url in js_matches:
        if "commonResource" not in js_url and "uiFramework" not in js_url:
            result["js_url"] = BASE_URL + js_url
            break

    # 提取触发调用 (在 </html> 之后的 script 标签中, 如 _$j0() 或 _$gR())
    for script_content in all_scripts:
        stripped = script_content.strip()
        if stripped.startswith("_$") and "()" in stripped and len(stripped) < 20:
            result["trigger_call"] = stripped.rstrip(";")
            break

    return result


def generate_cookie(session: requests.Session, html_parts: dict, url: str,
                    o_cookie_name: str = "", o_cookie_value: str = "") -> str:
    """调用 Node.js 生成 P Cookie"""
    # 下载外链 JS
    js_resp = session.get(html_parts["js_url"], timeout=15)
    js_resp.raise_for_status()
    js_content = js_resp.text

    # 准备输入数据
    input_data = {
        "url": url,
        "meta_content": html_parts["meta_content"],
        "meta_id": html_parts.get("meta_id", ""),
        "inline_script": html_parts["inline_script"],
        "js_content": js_content,
        "js_url": html_parts["js_url"],
        "trigger_call": html_parts.get("trigger_call", ""),
        "o_cookie_name": o_cookie_name or "",
        "o_cookie_value": o_cookie_value or "",
    }

    # 写入临时文件
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".json", delete=False, encoding="utf-8"
    ) as f:
        json.dump(input_data, f, ensure_ascii=False)
        temp_path = f.name

    try:
        # 调用 Node.js
        # Use gen_cookie.js (normal)
        js_script = GEN_COOKIE_JS
        result = subprocess.run(
            ["node", js_script, temp_path],
            capture_output=True,
            text=True,
            timeout=120,
            encoding="utf-8",
        )

        if result.returncode != 0:
            print(f"[ERROR] Node.js 执行失败:")
            print(f"  stderr: {result.stderr}")
            sys.exit(1)

        # Print stderr (diagnostic output)
        if result.stderr:
            print(f"  [diag] {result.stderr[:2000]}")

        cookie_str = result.stdout.strip()
        if not cookie_str:
            print("[ERROR] Node.js 未返回 Cookie")
            print(f"  stderr: {result.stderr}")
            sys.exit(1)

        return cookie_str

    finally:
        os.unlink(temp_path)


def get_page(url: str = TARGET_URL) -> str:
    """获取瑞数6保护的页面内容"""
    session = requests.Session()
    session.headers.update(HEADERS)

    print(f"[1] 第1次请求: {url}")
    resp1 = session.get(url, timeout=15, allow_redirects=False)
    print(f"    状态码: {resp1.status_code}")

    # 检查是否为瑞数拦截 (412/202)
    if resp1.status_code not in (200, 412, 202):
        print(f"[WARN] 未预期的状态码: {resp1.status_code}")
        if resp1.status_code == 200:
            return resp1.text

    # 提取 O Cookie (Set-Cookie 中带 O 后缀的)
    o_cookie_name = None
    o_cookie_value = None
    for cookie in session.cookies:
        if cookie.name.endswith("O"):
            o_cookie_name = cookie.name
            o_cookie_value = cookie.value
            print(f"    O Cookie: {cookie.name}={cookie.value[:40]}...")
            break

    if not o_cookie_name:
        print("[ERROR] 未找到 O Cookie (Set-Cookie)")
        print(f"    所有 cookies: {list(session.cookies.keys())}")
        sys.exit(1)

    # 解析 HTML
    html = resp1.text
    html_parts = parse_html_response(html)

    print(f"    meta_content 长度: {len(html_parts['meta_content'])}")
    print(f"    meta_id: {html_parts.get('meta_id', 'N/A')}")
    print(f"    inline_script 长度: {len(html_parts['inline_script'])}")
    print(f"    js_url: {html_parts['js_url']}")
    print(f"    trigger_call: {html_parts.get('trigger_call', 'N/A')}")

    if not html_parts["meta_content"]:
        print("[ERROR] 未能提取 meta_content")
        sys.exit(1)
    if not html_parts["inline_script"]:
        print("[ERROR] 未能提取 inline_script")
        sys.exit(1)
    if not html_parts["js_url"]:
        print("[ERROR] 未能提取 js_url")
        sys.exit(1)

    # 生成 P Cookie
    print(f"\n[2] 调用 Node.js 生成 P Cookie...")
    cookie_result_str = generate_cookie(session, html_parts, url, o_cookie_name, o_cookie_value)

    # 解析 JSON 结果 (包含 pcookie 和 all cookies)
    try:
        cookie_result = json.loads(cookie_result_str)
        p_cookie_str = cookie_result["pcookie"]
        all_cookies = cookie_result.get("all", [])
    except (json.JSONDecodeError, KeyError):
        # 降级: 兼容旧格式 (直接输出 cookie 字符串)
        p_cookie_str = cookie_result_str
        all_cookies = []

    print(f"    P Cookie: {p_cookie_str[:60]}...")
    p_cookie_val = p_cookie_str.split("=", 1)[1]
    print(f"    P Cookie 长度: {len(p_cookie_val)}")
    # Cookie structure analysis
    p_parts = p_cookie_val.split(".")
    print(f"    P Cookie dots: {p_cookie_val.count('.')}, underscores: {p_cookie_val.count('_')}, parts: {len(p_parts)}")
    for i, part in enumerate(p_parts):
        print(f"      Part {i}: {len(part)} chars, starts={part[:5]}, ends={part[-5:] if len(part) >= 5 else part}")

    # 解析 P Cookie
    p_cookie_name, p_cookie_value = p_cookie_str.split("=", 1)
    # 设置与 O Cookie 相同的 domain
    session.cookies.set(p_cookie_name, p_cookie_value, domain="www.jscq.com.cn")

    # 设置所有其他 cookies (enable_* 等)
    for cookie_line in all_cookies:
        if "=" in cookie_line and not cookie_line.startswith(o_cookie_name or "xxx"):
            cn, cv = cookie_line.split("=", 1)
            if cn != p_cookie_name:  # 避免重复设置 P Cookie
                session.cookies.set(cn, cv, domain="www.jscq.com.cn")
                print(f"    额外 Cookie: {cn}={cv[:40]}...")

    # 打印所有 cookies
    print(f"\n[*] Session cookies:")
    for c in session.cookies:
        print(f"    {c.name} = {c.value[:60]}... (domain={c.domain}, path={c.path})")

    # 第2次请求 - 添加 Referer 和打印完整请求信息
    print(f"\n[3] 第2次请求: {url}")
    second_headers = dict(session.headers)
    second_headers["Referer"] = url
    # 打印完整的 Cookie header
    cookie_header = "; ".join(f"{c.name}={c.value}" for c in session.cookies)
    print(f"    Cookie header 长度: {len(cookie_header)}")
    print(f"    Cookie header: {cookie_header[:200]}...")
    resp2 = session.get(url, timeout=15, headers=second_headers)
    print(f"    状态码: {resp2.status_code}")
    print(f"    响应长度: {len(resp2.text)}")
    print(f"    响应头: {dict(resp2.headers)}")
    if resp2.status_code != 200:
        print(f"    响应体: {repr(resp2.text[:500])}")

    if resp2.status_code == 200:
        # 验证是否为真实页面 (非瑞数拦截页)
        if "$_ts" not in resp2.text[:2000] or "江苏产权" in resp2.text:
            print(f"    [OK] 成功获取真实页面!")
            return resp2.text
        else:
            print(f"    [WARN] 可能仍然是瑞数拦截页")
            return resp2.text
    elif resp2.status_code in (412, 202):
        print(f"    [WARN] 仍然被瑞数拦截, Cookie 可能无效")
        return resp2.text
    else:
        print(f"    [ERROR] 未预期的状态码: {resp2.status_code}")
        return resp2.text


if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else TARGET_URL
    content = get_page(url)

    # 保存结果
    output_file = os.path.join(SCRIPT_DIR, "..", "output.html")
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"\n[4] 页面已保存到: {output_file}")

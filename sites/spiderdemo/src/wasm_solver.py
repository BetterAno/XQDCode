"""
WASM Challenge 协议请求脚本

目标: 采集100页全部数字，计算加和并提交结果
核心: 通过 Node.js 加载 WASM 模块生成 wasm_auth 签名，使用 requests 请求 API

解题思路:
1. 下载 wasm_anti_bg.wasm 和 wasm_anti.js
2. 用 Node.js 本地加载 WASM，调用 encrypt_simple(verifyString, timestamp) 生成签名
3. 带 wasm_auth 参数请求 /sec1/api/wasm_challenge/page/{page}/ 获取数据
4. 计算总和后提交到 /api/challenge/submit/

反调试策略:
- 页面有反调试保护（anti_automation.js），访问挑战页面会被重定向
- 绕过方案：不在浏览器中访问挑战页面，直接本地用 Node.js 执行 WASM 模块
"""

import json
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import quote

import requests

BASE_URL = "https://spiderdemo.cn"
CHALLENGE_TYPE = "wasm_challenge"
TOTAL_PAGES = 100
WASM_DIR = Path(__file__).parent / "wasm_assets"


def generate_all_auths() -> list[dict]:
    """调用 Node.js 生成所有页面的 wasm_auth 签名"""
    solver_path = WASM_DIR / "wasm_solver.mjs"
    if not solver_path.exists():
        raise FileNotFoundError(f"WASM solver 不存在: {solver_path}")

    result = subprocess.run(
        ["node", str(solver_path), CHALLENGE_TYPE, str(TOTAL_PAGES)],
        capture_output=True,
        text=True,
        cwd=str(WASM_DIR),
        timeout=30,
    )

    if result.returncode != 0:
        print(f"[错误] Node.js 执行失败: {result.stderr}")
        sys.exit(1)

    auths = json.loads(result.stdout.strip())
    print(f"[1/3] 已生成 {len(auths)} 个 wasm_auth 签名")
    return auths


def get_page_data(page: int, timestamp: str, wasm_auth: str, cookies: dict) -> list:
    """获取指定页码的数字列表"""
    url = (
        f"{BASE_URL}/sec1/api/wasm_challenge/page/{page}/"
        f"?challenge_type={quote(CHALLENGE_TYPE)}"
        f"&wasm_auth={quote(wasm_auth)}"
    )
    headers = {
        "Content-Type": "application/json",
        "X-WASM-Timestamp": timestamp,
        "X-WASM-Page": str(page),
    }
    resp = requests.get(url, headers=headers, cookies=cookies, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    if not data.get("success"):
        raise RuntimeError(f"API 返回失败 (page={page}): {data}")
    return data["page_data"]


def init_challenge(cookies: dict) -> dict:
    """初始化挑战"""
    url = f"{BASE_URL}/api/challenge/init/"
    resp = requests.get(url, params={"challenge_type": CHALLENGE_TYPE}, cookies=cookies, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    if data.get("success"):
        print(f"[初始化] 挑战已初始化: {data.get('message', '')}")
    else:
        print(f"[初始化] 警告: {data}")
    return data


def submit_answer(answer: int, cookies: dict) -> dict:
    """提交答案"""
    url = f"{BASE_URL}/api/challenge/submit/"
    payload = {
        "challenge_type": CHALLENGE_TYPE,
        "answer": answer,
    }
    resp = requests.post(url, json=payload, cookies=cookies, timeout=10)
    resp.raise_for_status()
    return resp.json()


def collect_all_numbers(auths: list[dict], cookies: dict) -> int:
    """并发采集所有100页数字并返回总和"""
    total = 0
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_page = {
            executor.submit(get_page_data, a["page"], a["timestamp"], a["wasm_auth"], cookies): a["page"]
            for a in auths
        }
        for future in as_completed(future_to_page):
            page = future_to_page[future]
            try:
                numbers = future.result()
                page_sum = sum(numbers)
                total += page_sum
                if page % 10 == 0:
                    print(f"[进度] 第 {page} 页已采集, 本页和: {page_sum}")
            except Exception as e:
                print(f"[错误] 第 {page} 页采集失败: {e}")
    return total


def main():
    print("=" * 50)
    print("WASM Challenge 协议请求脚本")
    print("=" * 50)

    # Cookies (需要登录后获取)
    # 可从浏览器 DevTools -> Application -> Cookies 中复制
    # 或者通过 AdsPower 获取
    cookies = {
        "sessionid": "",  # 填入你的 sessionid
    }

    # 如果没有 sessionid，提示用户
    if not cookies.get("sessionid"):
        print("\n[提示] 需要登录 Cookie (sessionid)")
        print("请从浏览器 DevTools -> Application -> Cookies 获取")
        print("或通过 AdsPower 浏览器执行: document.cookie")
        # 继续执行，可能 API 允许无登录访问部分功能

    # Step 1: 初始化挑战
    print("\n[1/4] 初始化挑战...")
    init_challenge(cookies)

    # Step 2: 生成所有页面的 wasm_auth 签名
    print("\n[2/4] 生成 WASM 签名...")
    auths = generate_all_auths()

    # Step 3: 并发采集所有100页数字
    print("\n[3/4] 开始采集100页数字...")
    total_sum = collect_all_numbers(auths, cookies)
    print(f"\n[结果] 100页数字总和: {total_sum}")

    # Step 4: 提交答案
    print(f"\n[4/4] 提交答案: {total_sum}")
    result = submit_answer(total_sum, cookies)

    if result.get("is_correct"):
        print(f"✅ 答案正确! {result.get('message', '')}")
    else:
        print(f"❌ 答案错误: {result}")


if __name__ == "__main__":
    main()

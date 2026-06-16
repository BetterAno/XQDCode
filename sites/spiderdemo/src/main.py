"""
OB Challenge1 协议请求脚本

目标: 采集100页全部数字，计算加和并提交结果
核心: 逆向 hex_md5 混淆函数，使用 requests 直接请求 API
注意: 需先注册登录获取 session，再初始化挑战后采集数据
"""

import time
import uuid
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from signer import generate_sign

BASE_URL = "https://spiderdemo.cn"
CHALLENGE_TYPE = "ob_challenge1"
TOTAL_PAGES = 100


def register_and_login(session: requests.Session) -> bool:
    """注册新账号并自动登录，获取 sessionid Cookie"""
    unique_id = uuid.uuid4().hex[:8]
    username = f"auto_{unique_id}"
    email = f"{username}@auto.com"
    password = "Auto123456!"

    resp = session.post(
        f"{BASE_URL}/admin_I/api/auth/register",
        json={
            "username": username,
            "email": email,
            "password": password,
            "confirmPassword": password,
        },
        timeout=10,
    )
    data = resp.json()
    if data.get("success"):
        print(f"[登录] 注册并登录成功: {username}")
        return True
    print(f"[登录] 注册失败: {data.get('message')}")
    return False


def init_challenge(session: requests.Session) -> list:
    """初始化挑战，返回第1页数据"""
    resp = session.get(
        f"{BASE_URL}/ob/api/challenge/init/?challenge_type={CHALLENGE_TYPE}",
        timeout=10,
    )
    data = resp.json()
    if not data.get("success"):
        raise RuntimeError(f"初始化失败: {data}")
    print(f"[初始化] {data.get('message')}")
    return data.get("page_data", [])


def get_page_data(session: requests.Session, page: int) -> list:
    """获取指定页码的数字列表"""
    timestamp = int(time.time() * 1000)
    sign = generate_sign(timestamp, page)
    url = f"{BASE_URL}/ob/api/ob_challenge1/page/{page}/"
    params = {
        "challenge_type": CHALLENGE_TYPE,
        "sign": sign,
        "timestamp": timestamp,
    }
    headers = {
        "Referer": f"{BASE_URL}/ob/ob_challenge1/?challenge_type={CHALLENGE_TYPE}",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
    }
    resp = session.get(url, params=params, headers=headers, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    if not data.get("success"):
        raise RuntimeError(f"API 返回失败: {data}")
    return data["page_data"]


def submit_answer(session: requests.Session, answer: int) -> dict:
    """提交答案"""
    url = f"{BASE_URL}/ob/api/challenge/submit/"
    payload = {
        "challenge_type": CHALLENGE_TYPE,
        "answer": answer,
    }
    resp = session.post(url, json=payload, timeout=10)
    resp.raise_for_status()
    return resp.json()


def collect_all_numbers(session: requests.Session) -> int:
    """并发采集所有100页数字并返回总和"""
    total = 0
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_page = {
            executor.submit(get_page_data, session, p): p
            for p in range(1, TOTAL_PAGES + 1)
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
    print("OB Challenge1 协议请求脚本")
    print("=" * 50)

    session = requests.Session()
    session.headers.update({
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
        ),
        "Referer": f"{BASE_URL}/",
    })

    print("\n[1/4] 注册并登录...")
    if not register_and_login(session):
        print("❌ 登录失败，退出")
        return

    print("\n[2/4] 初始化挑战...")
    init_challenge(session)

    print("\n[3/4] 开始采集100页数字...")
    total_sum = collect_all_numbers(session)
    print(f"\n[4/4] 100页数字总和: {total_sum}")

    print(f"\n[提交] 提交答案: {total_sum}")
    result = submit_answer(session, total_sum)

    if result.get("is_correct"):
        print(f"✅ 答案正确! {result.get('message')}")
    else:
        print(f"❌ 答案错误: {result}")


if __name__ == "__main__":
    main()

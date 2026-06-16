"""
Token 获取与刷新模块
authKey = MD5("test" + "test" + timestamp_ms) → hex
POST /icpproject_query/api/auth → JWT token (~480s 有效期)
"""

import time
import hashlib
import requests

# 硬编码凭据（源码实证: app.2f3af746.js module "0075"）
AUTH_ACCOUNT = "test"
AUTH_SECRET = "test"

BASE_URL = "https://hlwicpfwc.miit.gov.cn/icpproject_query"
AUTH_URL = f"{BASE_URL}/api/auth"
AUTH_REFRESH_URL = f"{BASE_URL}/api/auth/refresh"


def generate_auth_key(timestamp_ms: int) -> str:
    """纯算: MD5(account + secret + timestamp) → hex"""
    raw = f"{AUTH_ACCOUNT}{AUTH_SECRET}{timestamp_ms}"
    return hashlib.md5(raw.encode()).hexdigest()


class TokenManager:
    """Token 缓存与自动刷新"""

    def __init__(self, session: requests.Session):
        self.session = session
        self._token = None
        self._expire_time = 0

    @property
    def token(self) -> str:
        if self._token and time.time() < self._expire_time:
            return self._token
        return self._refresh_or_create()

    def _refresh_or_create(self) -> str:
        # 尝试刷新
        if self._token:
            try:
                r = self.session.get(AUTH_REFRESH_URL, timeout=10)
                data = r.json()
                if data.get('code') == 200 and data.get('params'):
                    params = data['params']
                    self._token = params['token']
                    self._expire_time = params.get('expire', 0) / 1000
                    return self._token
            except Exception:
                pass

        # 重新申请
        ts = int(time.time() * 1000)
        auth_key = generate_auth_key(ts)

        r = self.session.post(
            AUTH_URL,
            data={"authKey": auth_key, "timeStamp": str(ts)},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=10
        )
        data = r.json()

        if data.get('code') != 200:
            raise RuntimeError(f"Token 获取失败: {data}")

        params = data['params']
        self._token = params['token']
        self._expire_time = params.get('expire', 0) / 1000

        return self._token


if __name__ == "__main__":
    print("=== 测试 Token 获取 ===")
    from jsl_cookie import get_jsl_session
    session = get_jsl_session()
    tm = TokenManager(session)
    token = tm.token
    print(f"Token: {token[:60]}...")
    print(f"过期时间: {time.strftime('%H:%M:%S', time.localtime(tm._expire_time))}")

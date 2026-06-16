"""
\u4eac\u4e1c\u767b\u5f55\u5b8c\u6574\u6d41\u7a0b\u811a\u672c\uff08\u7eaf Node.js \u8865\u73af\u5883\u7248\uff0c\u4e0d\u4f9d\u8d56\u6d4f\u89c8\u5668/\u81ea\u52a8\u5316\uff09

\u67b6\u6784:
  - HTTP \u8bf7\u6c42: curl_cffi (TLS \u6307\u7eb9\u4f2a\u88c5)
  - jdCAP \u52a0\u5bc6: Node.js \u8865\u73af\u5883\uff08jcap_env.js --stdio\uff09
  - \u5bc6\u7801\u52a0\u5bc6: Node.js RSA (pwd_encrypt.js)
  - \u9a8c\u8bc1\u7801\u8bc6\u522b: \u4e91\u7801 API

\u6d41\u7a0b:
  1. \u52a0\u8f7d\u767b\u5f55\u9875\u63d0\u53d6 pubKey / appId / sessionId / jwtToken
  2. \u5982\u679c\u9875\u9762\u672a\u7ed9 sessionId\uff0c\u5219\u8c03 /uc/graphic/sessionId/refresh
  3. \u542f\u52a8 JcapSession\uff0c\u8c03 appCreate \u89e6\u53d1 fp \u6d41\u7a0b
  4. \u8c03 appCheck \u62e6\u622a /cgi-bin/api/check \u8bf7\u6c42\u5f97\u9a8c\u8bc1\u7801\u56fe
  5. \u4e91\u7801\u8bc6\u522b\u7f3a\u53e3 X \u5750\u6807\uff0c\u63d0\u4ea4\u7ed9 jcap
  6. \u901a\u8fc7 jcap \u62ff\u5230\u9a8c\u8bc1\u540e\u7684 jwtToken
  7. RSA \u52a0\u5bc6\u5bc6\u7801 + \u63d0\u4ea4 /uc/loginService

\u6ce8\u610f: ct/tk/cs \u662f jcap \u4e0e jcap-server \u7684\u5185\u90e8\u534f\u8bae\u53c2\u6570\uff0c\u7531 jcap_env.js \u6355\u83b7\u4ece
XHR body \u4e2d\u53d6\u51fa\uff1b\u4e1a\u52a1\u5c42\u5fc5\u9700\u7684\u53ea\u662f jwtToken\u3002
"""
import json
import time
import base64
import os
import sys
import re
import uuid
from typing import Dict, Any, Optional, List
from urllib.parse import urlencode, parse_qs

try:
    from curl_cffi import requests as cffi_requests
    HAS_CURL_CFFI = True
except ImportError:
    import requests as cffi_requests  # type: ignore
    HAS_CURL_CFFI = False
    print("[WARN] curl_cffi not available, using requests (may be detected)")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, 'src'))

from config import (
    LOGIN_PAGE, PUBLIC_KEY_API, LOGIN_SUBMIT_API, UA, DEFAULT_HEADERS
)
from node_bridge import encrypt_password, JcapSession

YUNCODE_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"

JCAP_FP_API = "https://jcap.m.jd.com/cgi-bin/api/fp"
JCAP_CHECK_API = "https://jcap.m.jd.com/cgi-bin/api/check"
GRAPHIC_SID_REFRESH = "https://passport.jd.com/uc/graphic/sessionId/refresh"


class JDLoginFlow:
    """\u4eac\u4e1c\u767b\u5f55\u5b8c\u6574\u6d41\u7a0b\uff08\u7eaf Node.js \u8865\u73af\u5883\uff09"""

    def __init__(self, username: str, password: str, proxy: Optional[str] = None):
        self.username = username
        self.password = password
        self.proxy = proxy

        self.session = cffi_requests.Session()
        if HAS_CURL_CFFI:
            self.session.impersonate = "chrome131"
        if proxy:
            self.session.proxies = {"http": proxy, "https": proxy}
        self.session.headers.update(DEFAULT_HEADERS)

        # \u767b\u5f55\u9875\u53c2\u6570
        self.pub_key: Optional[str] = None
        self.app_id: str = "1000803"
        self.status: str = "1"
        self.session_id: Optional[str] = None
        self.jwt_token: Optional[str] = None

        # jcap \u8fd4\u56de\u7684\u52a0\u5bc6\u53c2\u6570
        self.ct: Optional[str] = None
        self.tk: Optional[str] = None
        self.cs: Optional[str] = None
        self.fp_token: Optional[str] = None
        self.vt_token: Optional[str] = None

        # \u9a8c\u8bc1\u7801\u56fe\u7247
        self.captcha_bg: Optional[bytes] = None
        self.captcha_slide: Optional[bytes] = None

        self.cookies: Dict[str, str] = {}

    # ---------------------------------------------------------
    # Step 1: \u52a0\u8f7d\u767b\u5f55\u9875\uff0c\u63d0\u53d6 pubKey / graphic \u53c2\u6570
    # ---------------------------------------------------------
    def step1_load_login_page(self) -> bool:
        print("\n[Step 1] \u52a0\u8f7d\u767b\u5f55\u9875 \u5e76\u63d0\u53d6\u53c2\u6570...")
        try:
            resp = self.session.get(LOGIN_PAGE, timeout=15)
            if resp.status_code != 200:
                print(f"  [ERROR] \u767b\u5f55\u9875 HTTP {resp.status_code}")
                return False
            html = resp.text

            def _extract(pattern: str) -> Optional[str]:
                m = re.search(pattern, html)
                return m.group(1) if m else None

            self.pub_key = (
                _extract(r'id="pubKey"[^>]*value="([^"]+)"')
                or _extract(r'name="pubKey"[^>]*value="([^"]+)"')
                or _extract(r'publicKey["\']?\s*[:=]\s*["\']([^"\']+)')
            )
            if not self.pub_key:
                # \u56de\u9000\u8c03 /publicKey/init
                try:
                    r2 = self.session.get(PUBLIC_KEY_API, timeout=10)
                    if r2.status_code == 200:
                        try:
                            self.pub_key = r2.json().get("pubKey")
                        except Exception:
                            pass
                except Exception:
                    pass
            if self.pub_key:
                print(f"  pubKey: {self.pub_key[:50]}...")
            else:
                print("  [WARN] \u672a\u63d0\u53d6\u5230 pubKey")

            self.app_id = _extract(r'id="graphicCaptchaAppId"[^>]*value="([^"]+)"') or self.app_id
            self.status = _extract(r'id="graphicCaptchaStatus"[^>]*value="([^"]+)"') or self.status
            self.session_id = _extract(r'id="graphicCaptchaSessionId"[^>]*value="([^"]+)"')
            self.jwt_token = _extract(r'id="graphicCaptchaJwtToken"[^>]*value="([^"]+)"')

            print(f"  appId={self.app_id}, status={self.status}")
            print(f"  sessionId: {(self.session_id or '(none)')[:40]}...")

            # \u5982\u65e0 sessionId\uff0c\u4e3b\u52a8\u5237\u65b0
            if not self.session_id:
                print("  sessionId \u4e3a\u7a7a\uff0c\u8c03\u7528 /uc/graphic/sessionId/refresh ...")
                self._refresh_session_id()

            return True
        except Exception as e:
            print(f"  [ERROR] \u52a0\u8f7d\u767b\u5f55\u9875\u5f02\u5e38: {e}")
            return False

    def _refresh_session_id(self) -> bool:
        try:
            r = self.session.get(
                GRAPHIC_SID_REFRESH,
                params={"appId": self.app_id},
                timeout=10,
            )
            if r.status_code == 200:
                try:
                    data = r.json()
                    if data.get("code") == 1:
                        self.session_id = data.get("sessionId") or self.session_id
                        self.jwt_token = data.get("jwtToken") or self.jwt_token
                        print(f"  \u5237\u65b0\u6210\u529f: sessionId={self.session_id[:40] if self.session_id else ''}...")
                        return True
                    else:
                        print(f"  \u5237\u65b0\u5931\u8d25 code={data.get('code')} msg={data.get('msg')}")
                except Exception:
                    print(f"  \u5237\u65b0\u54cd\u5e94\u975e JSON: {r.text[:150]}")
            else:
                print(f"  \u5237\u65b0 HTTP {r.status_code}")
        except Exception as e:
            print(f"  \u5237\u65b0\u5f02\u5e38: {e}")
        return False

    # ---------------------------------------------------------
    # Step 2: 用 get_ct_direct 拿 ct + Python 直接 POST /cgi-bin/api/fp
    # （绕开 appCreate 同步路径 ct=null 问题）
    # ---------------------------------------------------------
    def step2_jcap_app_create(self, jcap: JcapSession) -> bool:
        print("\n[Step 2] get_ct_direct 拿 ct 后直接 POST /cgi-bin/api/fp ...")
        if not self.session_id:
            print("  [ERROR] 缺 sessionId")
            return False
    
        option = self._build_jcap_option()
        try:
            r = jcap.get_ct_direct(sid=self.session_id, option=option)
            if not r.get("ok"):
                print(f"  [ERROR] get_ct_direct: {r.get('error')}")
                return False
            self.ct = r.get("ct")
            if not self.ct:
                print("  [ERROR] ct 为空")
                return False
            print(f"  ct = {self.ct[:60]}... ({len(self.ct)} chars)")
        except Exception as e:
            print(f"  [ERROR] get_ct_direct 异常: {e}")
            return False
    
        # 直接 POST /cgi-bin/api/fp
        try:
            body = urlencode({
                "si": self.session_id,
                "ct": self.ct,
                "version": 3,
                "lang": 1,
                "client": "pc",
            })
            headers = {
                "User-Agent": UA,
                "Accept": "*/*",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Origin": "https://passport.jd.com",
                "Referer": "https://passport.jd.com/",
                "Content-Type": "application/x-www-form-urlencoded",
            }
            resp = self.session.post(JCAP_FP_API, data=body, headers=headers, timeout=15)
            print(f"  fp HTTP {resp.status_code} body: {resp.text[:300]}")
            if resp.status_code != 200:
                return False
            try:
                fp_json = resp.json()
            except Exception:
                fp_json = {}
            # 保存服务端返回的字段（st / tk / 等，依协议而定）
            self.fp_token = fp_json.get("st") or fp_json.get("tk") or ""
            if fp_json.get("code") and fp_json.get("code") not in (0, 1, "0", "1"):
                print(f"  [WARN] fp 业务码: code={fp_json.get('code')} s_code={fp_json.get('s_code')} msg={fp_json.get('msg')}")
            return True
        except Exception as e:
            print(f"  [ERROR] POST /fp 异常: {e}")
            return False

    # ---------------------------------------------------------
    # Step 3: \u83b7\u53d6\u9a8c\u8bc1\u7801\uff08\u7531 jcap \u5b9e\u73b0\u4e0d\u53d7\u963b\uff0c\u6216\u76f4\u63a5\u8bf7 check API\uff09
    # ---------------------------------------------------------
    def step3_jcap_app_check(self, jcap: JcapSession) -> bool:
        print("\n[Step 3] \u8c03\u7528 jcap.appCheck \u83b7\u53d6\u9a8c\u8bc1\u7801\u56fe...")
        option = self._build_jcap_option()
        try:
            r = jcap.app_check(option, wait_ms=3000)
            if not r.get("ok"):
                print(f"  [ERROR] appCheck: {r.get('error')}")
                return False
            captured = r.get("captured", [])
            print(f"  captured XHR: {len(captured)}")
            for c in captured:
                print(f"    {c.get('method')} {c.get('url')}")
                if c.get("body"):
                    print(f"      body: {c['body'][:200]}")
                    self._parse_jcap_body(c["body"])
            return True
        except Exception as e:
            print(f"  [ERROR] appCheck \u5f02\u5e38: {e}")
            return False

    def _parse_jcap_body(self, body: str):
        """\u4ecejcap \u53d1\u51fa\u7684 form-urlencoded body \u4e2d\u63d0\u53d6 si/tk/ct/cs"""
        try:
            data = parse_qs(body, keep_blank_values=True)
            for k in ("si", "tk", "ct", "cs"):
                v = data.get(k, [""])[0]
                if v and v != "null":
                    if k == "si" and not self.session_id:
                        self.session_id = v
                    elif k == "tk" and v != self.tk:
                        self.tk = v
                    elif k == "ct" and v != self.ct:
                        self.ct = v
                    elif k == "cs" and v != self.cs:
                        self.cs = v
        except Exception:
            pass

    # ---------------------------------------------------------
    # Step 4: \u9a8c\u8bc1\u7801\u56fe\u8bc6\u522b
    # ---------------------------------------------------------
    def step4_solve(self) -> Optional[int]:
        print("\n[Step 4] \u89e3\u51b3\u9a8c\u8bc1\u7801...")
        if not self.captcha_bg or not self.captcha_slide:
            print("  [WARN] \u9a8c\u8bc1\u7801\u56fe\u672a\u62ff\u5230\uff08\u9700 jcap \u54cd\u5e94\u622a\u83b7\u589e\u5f3a\uff09")
            return None
        screenshots = os.path.join(BASE_DIR, 'assets', 'screenshots')
        os.makedirs(screenshots, exist_ok=True)
        with open(os.path.join(screenshots, 'jd_bg.png'), 'wb') as f:
            f.write(self.captcha_bg)
        with open(os.path.join(screenshots, 'jd_slide.png'), 'wb') as f:
            f.write(self.captcha_slide)
        try:
            from yuncode_captcha import YunCodeCaptcha
            client = YunCodeCaptcha(YUNCODE_TOKEN)
            ok, x, msg = client.recognize_slide(self.captcha_slide, self.captcha_bg)
            if ok and x is not None:
                print(f"  \u4e91\u7801\u8bc6\u522b\u6210\u529f: x={x}")
                return int(x)
            print(f"  \u4e91\u7801\u5931\u8d25: {msg}")
        except Exception as e:
            print(f"  \u4e91\u7801\u5f02\u5e38: {e}")
        try:
            import cv2, numpy as np  # type: ignore
            bg = cv2.imdecode(np.frombuffer(self.captcha_bg, np.uint8), cv2.IMREAD_COLOR)
            slide = cv2.imdecode(np.frombuffer(self.captcha_slide, np.uint8), cv2.IMREAD_COLOR)
            res = cv2.matchTemplate(bg, slide, cv2.TM_CCOEFF_NORMED)
            _, _, _, max_loc = cv2.minMaxLoc(res)
            print(f"  OpenCV x={max_loc[0]}")
            return int(max_loc[0])
        except Exception as e:
            print(f"  OpenCV \u5f02\u5e38: {e}")
        return None

    # ---------------------------------------------------------
    # Step 5: \u63d0\u4ea4 loginService
    # ---------------------------------------------------------
    def step6_login(self) -> bool:
        print("\n[Step 6] \u63d0\u4ea4 loginService...")
        if not self.pub_key:
            print("  [ERROR] \u7f3a pubKey")
            return False
        try:
            enc_pwd = encrypt_password(self.password, self.pub_key)
            print(f"  \u5bc6\u7801\u5df2\u52a0\u5bc6")
            params = {
                "uuid": uuid.uuid4().hex,
                "eid": uuid.uuid4().hex,
                "fp": self.fp_token or "",
                "vt": self.vt_token or "",
                "loginname": self.username,
                "nloginpwd": enc_pwd,
                "loginType": "pc",
                "pubKey": self.pub_key,
                "t": str(int(time.time() * 1000)),
                "authCode": "",
                "useSlideAuthCode": "1",
                "machineNet": "",
                "machineCpu": "",
                "machineDisk": "",
                "client": "pc",
                "chkRememberMe": "",
                # graphic \u53c2\u6570 (\u94fe\u8def\u5173\u952e\uff09
                "graphicStatus": self.status,
                "graphicAppId": self.app_id,
                "graphicSessionId": self.session_id or "",
                "graphicJwtToken": self.jwt_token or "",
            }
            url = LOGIN_SUBMIT_API + "?" + urlencode(params)
            r = self.session.post(url, data={}, timeout=15, headers={
                "Referer": "https://passport.jd.com/new/login.aspx",
                "Content-Type": "application/x-www-form-urlencoded",
            })
            print(f"  HTTP {r.status_code} body: {r.text[:300]}")
            if r.status_code == 200 and ('"success"' in r.text or 'true' in r.text.lower()):
                for c in r.cookies:
                    self.cookies[c.name] = c.value
                return True
        except Exception as e:
            print(f"  [ERROR] login \u5f02\u5e38: {e}")
        return False

    # ---------------------------------------------------------
    # \u8f85\u52a9
    # ---------------------------------------------------------
    def _build_jcap_option(self) -> Dict[str, Any]:
        return {
            "account": self.username or "",
            "status": self.status,
            "appId": self.app_id,
            "sessionId": self.session_id or "",
            "jwtToken": self.jwt_token or "",
            "bizSource": "pc",
            "scene": "login-pc",
        }

    def run(self) -> bool:
        print("=" * 60)
        print(f"\u4eac\u4e1c\u767b\u5f55(\u7eaf\u8865\u73af\u5883) - \u8d26\u53f7: {self.username}")
        print("=" * 60)

        if not self.step1_load_login_page():
            return False

        with JcapSession() as jcap:
            print(f"\n[jcap] \u8865\u73af\u5883\u5df2\u5c31\u7eea")
            r = jcap.init(option=self._build_jcap_option())
            if not r.get("ok"):
                print("[jcap] init \u5931\u8d25")
                return False

            if not self.step2_jcap_app_create(jcap):
                return False
            time.sleep(0.5)
            # appCheck \u83b7\u53d6\u9a8c\u8bc1\u7801
            self.step3_jcap_app_check(jcap)

        # \u9a8c\u8bc1\u7801\u8bc6\u522b\uff08\u5982\u679c\u62ff\u5230\u56fe\u7247\uff09
        self.step4_solve()
        time.sleep(0.3)

        # TODO: \u63d0\u4ea4\u6ed1\u52a8\u7ed3\u679c\u4ece jcap \u62ff jwtToken
        # \u5f53\u524d\u4ee5\u5df2\u6709 jwtToken \u76f4\u63a5\u767b\u5f55
        return self.step6_login()


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("-u", "--username", help="\u8d26\u53f7")
    parser.add_argument("-p", "--password", help="\u5bc6\u7801")
    parser.add_argument("--proxy")
    args = parser.parse_args()

    username = args.username or os.environ.get("JD_USERNAME", "")
    password = args.password or os.environ.get("JD_PASSWORD", "")
    if not username or not password:
        print("\u9700\u63d0\u4f9b --username/-p \u6216 JD_USERNAME/JD_PASSWORD \u73af\u5883\u53d8\u91cf")
        sys.exit(1)

    flow = JDLoginFlow(username, password, proxy=args.proxy)
    ok = flow.run()
    print("\n\u6700\u7ec8\u7ed3\u679c:", "SUCCESS" if ok else "FAIL")
    sys.exit(0 if ok else 1)

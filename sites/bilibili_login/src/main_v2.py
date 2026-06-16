"""
B站登录 - 完整协议实现 v2

纯本地实现:
- Python: B站API + 极验API请求
- Node.js: geetest_crypto.js 生成 w 参数 (AES-128-CBC + RSA + 自定义Base64)
- 云码API: 点选验证码识别

极验流程 (简化版, 已验证):
1. get.php?type=click (无w) → 验证码图片 + c, s
2. ajax.php + w (含坐标) → validate

w参数算法: w = custom_base64(AES_CBC(JSON.stringify(data))) + RSA(random_key).hex()
"""

import base64
import hashlib
import json
import logging
import os
import re
import subprocess
import sys
import time
from typing import Optional, Tuple

import requests

sys.path.insert(0, os.path.dirname(__file__))
from rsa_encrypt import encrypt_password

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("bili_v2")

# ============ 配置 ============
YUNMA_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"
TEST_USERNAME = "testuser_bl_2026"
TEST_PASSWORD = "testPwd@2026!Abc"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
    "Referer": "https://www.bilibili.com/",
    "Origin": "https://www.bilibili.com",
    "Accept": "*/*",
    "Content-Type": "application/x-www-form-urlencoded",
}

GEETEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
    "Referer": "https://www.bilibili.com/",
}


class BilibiliLoginV2:
    """B站密码登录 - 纯协议实现"""

    PASSPORT_BASE = "https://passport.bilibili.com"
    GEETEST_API = "https://api.geetest.com"
    GEETEST_STATIC = "https://static.geetest.com"
    GEEVISIT_API = "https://api.geevisit.com"

    def __init__(self, yunma_token: str = YUNMA_TOKEN):
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.yunma_token = yunma_token

        self.gt = ""
        self.challenge = ""
        self.token = ""
        self.rsa_key = ""
        self.hash_salt = ""

        self.c = []
        self.s = ""
        self.aes_key = ""
        self.click_pic_path = ""
        self.captcha_start_time = 0

    def _jsonp_parse(self, text: str) -> dict:
        m = re.search(r'\((.+)\)', text, re.DOTALL)
        if m:
            return json.loads(m.group(1))
        return {}

    def _generate_w(self, mode: str, coords: list = None, reuse_key: bool = False,
                    no_rsa: bool = False, pic: str = "", passtime: int = 0) -> Optional[str]:
        """通过 Node.js geetest_crypto.js 生成极验 w 参数

        关键发现:
        - get.php: w = custom_base64(AES(data, random_key)) + RSA(random_key).hex() → 保存 key
        - ajax.php: w = custom_base64(AES(data, SAME_key)) → 复用 get.php 的 key, 无 RSA 后缀
        - ajax.php (validate): w = custom_base64(AES(data, SAME_key)) + RSA(SAME_key).hex()
        """
        js_path = os.path.join(os.path.dirname(__file__), 'geetest_crypto.js')
        if not os.path.exists(js_path):
            logger.error(f"[W] geetest_crypto.js 不存在: {js_path}")
            return None

        cmd = [
            'node', js_path,
            '--mode', mode,
            '--gt', self.gt,
            '--challenge', self.challenge,
            '--c', json.dumps(self.c),
            '--s', self.s,
        ]
        if coords:
            cmd.extend(['--coords', json.dumps(coords)])
        if mode == 'click_request':
            cmd.extend(['--captcha_token', self.token])
        if pic:
            cmd.extend(['--pic', pic])
        if passtime > 0:
            cmd.extend(['--passtime', str(passtime)])
        if reuse_key and self.aes_key:
            cmd.extend(['--reuse_key', self.aes_key])
        if no_rsa:
            cmd.extend(['--no_rsa', 'true'])

        try:
            result = subprocess.run(
                cmd, capture_output=True, text=True, timeout=15,
                cwd=os.path.dirname(__file__)
            )
            if result.returncode == 0 and result.stdout.strip():
                data = json.loads(result.stdout.strip())
                w = data.get('w', '')
                key = data.get('key', '')
                if w:
                    if key and not self.aes_key:
                        self.aes_key = key
                    logger.info(f"[W] w生成成功: mode={mode}, len={len(w)}, reuse={reuse_key}, noRsa={no_rsa}")
                    return w
            if result.stderr:
                logger.warning(f"[W] stderr: {result.stderr[:200]}")
        except Exception as e:
            logger.warning(f"[W] w生成失败: {e}")
        return None

    # ============ Step 1: 获取验证码参数 ============
    def step1_get_captcha(self) -> bool:
        url = f"{self.PASSPORT_BASE}/x/passport-login/captcha"
        try:
            resp = self.session.get(url, params={"source": "main-fe-header", "t": str(time.time())}, timeout=10)
            data = resp.json()
            if data.get("code") != 0:
                logger.error(f"[Step1] captcha错误: {data}")
                return False

            captcha_data = data["data"]
            self.token = captcha_data.get("token", "")
            geetest = captcha_data.get("geetest", {})
            self.gt = geetest.get("gt", "")
            self.challenge = geetest.get("challenge", "")
            logger.info(f"[Step1] OK - gt={self.gt[:12]}..., challenge={self.challenge[:12]}...")
            return True
        except Exception as e:
            logger.error(f"[Step1] 失败: {e}")
            return False

    # ============ Step 2: 获取RSA公钥 ============
    def step2_get_rsa_key(self) -> bool:
        url = f"{self.PASSPORT_BASE}/x/passport-login/web/key"
        try:
            resp = self.session.get(url, params={"_": str(int(time.time() * 1000))}, timeout=10)
            data = resp.json()
            if data.get("code") != 0:
                logger.error(f"[Step2] key错误: {data}")
                return False

            key_data = data["data"]
            self.hash_salt = key_data.get("hash", "")
            self.rsa_key = key_data.get("key", "")
            logger.info(f"[Step2] OK - hash={self.hash_salt}")
            return True
        except Exception as e:
            logger.error(f"[Step2] 失败: {e}")
            return False

    # ============ Step 3: 极验 fullpage 初始化 ============
    def step3_fullpage_init(self) -> bool:
        """get.php + w (fullpage init) → 获取 c, s, 并保存 AES key"""
        w = self._generate_w("fullpage")
        if not w:
            return False

        cb = f"geetest_{int(time.time() * 1000)}"
        params = {
            "gt": self.gt, "challenge": self.challenge,
            "lang": "zh-cn", "pt": 0, "client_type": "web",
            "w": w, "callback": cb
        }
        try:
            resp = self.session.get(f"{self.GEETEST_API}/get.php", params=params,
                                    headers=GEETEST_HEADERS, timeout=10)
            data = self._jsonp_parse(resp.text)
            logger.info(f"[Step3] status={data.get('status')}")

            if data.get("status") != "success":
                logger.error(f"[Step3] 失败: {data}")
                return False

            # geetest 可能更新 challenge (追加后缀)
            top_id = data.get("id", "")
            inner = data.get("data", {})
            new_c = inner.get("c", [])
            new_s = inner.get("s", "")
            new_challenge = inner.get("challenge", "") or top_id
            if new_c:
                self.c = new_c
            if new_s:
                self.s = new_s
            if new_challenge and new_challenge != self.challenge:
                logger.info(f"[Step3] challenge 更新: {self.challenge[:16]}... → {new_challenge[:16]}...")
                self.challenge = new_challenge
            logger.info(f"[Step3] OK - c={self.c}, s={self.s}, key={self.aes_key}")
            return True
        except Exception as e:
            logger.error(f"[Step3] 异常: {e}")
            return False

    # ============ Step 4: ajax.php 获取验证码类型 ============
    def step4_ajax_type(self) -> bool:
        """ajax.php + w (复用 AES key, 无 RSA 后缀) → 获取 result: "click" """
        w = self._generate_w("click_request", reuse_key=True, no_rsa=True)
        if not w:
            return False

        cb = f"geetest_{int(time.time() * 1000)}"
        params = {
            "gt": self.gt, "challenge": self.challenge,
            "lang": "zh-cn", "pt": 0, "client_type": "web",
            "w": w, "callback": cb
        }
        try:
            resp = self.session.get(f"{self.GEETEST_API}/ajax.php", params=params,
                                    headers=GEETEST_HEADERS, timeout=10)
            data = self._jsonp_parse(resp.text)
            status = data.get("status")
            result = data.get("data", {})
            logger.info(f"[Step4] status={status}, result={result}")

            if status == "success":
                captcha_type = result if isinstance(result, str) else result.get("result", "")
                logger.info(f"[Step4] OK - type={captcha_type}")
                return True

            logger.error(f"[Step4] 失败: {data}")
            return False
        except Exception as e:
            logger.error(f"[Step4] 异常: {e}")
            return False

    # ============ Step 5: 获取点选验证码图片 ============
    def step5_get_click_captcha(self) -> Tuple[bool, Optional[bytes]]:
        """get.php?type=click (无w) → 获取点选验证码图片"""
        self.captcha_start_time = int(time.time() * 1000)
        cb = f"geetest_{int(time.time() * 1000)}"
        params = {
            "is_next": "true", "type": "click",
            "gt": self.gt, "challenge": self.challenge,
            "lang": "zh-cn", "https": "false", "protocol": "https://",
            "offline": "false", "product": "embed",
            "api_server": "api.geetest.com", "isPC": "true",
            "autoReset": "true", "width": "100%", "callback": cb
        }
        try:
            resp = self.session.get(f"{self.GEETEST_API}/get.php", params=params,
                                    headers=GEETEST_HEADERS, timeout=10)
            data = self._jsonp_parse(resp.text)
            logger.info(f"[Step5] status={data.get('status')}")

            if data.get("status") != "success":
                error = data.get("error", data.get("message", "unknown"))
                logger.error(f"[Step5] 失败: {error}")
                return False, None

            inner = data.get("data", {})
            self.click_pic_path = inner.get("pic", "")
            new_c = inner.get("c", [])
            new_s = inner.get("s", "")
            new_challenge = inner.get("challenge", "") or data.get("id", "")
            if new_c:
                self.c = new_c
            if new_s:
                self.s = new_s
            if new_challenge and new_challenge != self.challenge:
                logger.info(f"[Step5] challenge 更新: {self.challenge[:16]}... → {new_challenge[:16]}...")
                self.challenge = new_challenge

            if not self.click_pic_path:
                logger.error("[Step5] pic为空")
                return False, None

            img_url = f"{self.GEETEST_STATIC}{self.click_pic_path}"
            logger.info(f"[Step5] pic={self.click_pic_path[:60]}...")

            img_resp = self.session.get(img_url, headers={
                "Referer": "https://www.geetest.com/",
                "User-Agent": GEETEST_HEADERS["User-Agent"]
            }, timeout=15)

            if img_resp.status_code == 200 and len(img_resp.content) > 500:
                logger.info(f"[Step5] 图片下载成功: {len(img_resp.content)} bytes")
                # 保存图片尺寸信息用于坐标归一化
                try:
                    from PIL import Image
                    import io
                    img = Image.open(io.BytesIO(img_resp.content))
                    logger.info(f"[Step5] 图片尺寸: {img.size[0]}x{img.size[1]}")
                except Exception:
                    logger.info("[Step5] 无法获取图片尺寸 (PIL未安装)")
                return True, img_resp.content

            logger.error(f"[Step5] 图片下载失败: {img_resp.status_code}")
            return False, None
        except Exception as e:
            logger.error(f"[Step5] 异常: {e}")
            return False, None

    # ============ Step 6: 云码识别 ============
    def step6_solve_captcha(self, image_bytes: bytes) -> Optional[list]:
        """云码识别点选验证码"""
        image_b64 = base64.b64encode(image_bytes).decode("utf-8")
        payload = {
            "image": image_b64,
            "extra": "click",
            "token": self.yunma_token,
            "type": "30103",
        }
        for attempt in range(3):
            try:
                resp = requests.post(
                    "http://api.jfbym.com/api/YmServer/customApi",
                    json=payload, timeout=60
                )
                result = resp.json()
                code = result.get("code", -1)

                if code == 10000:
                    data_obj = result.get("data", {})
                    if isinstance(data_obj, dict):
                        inner_data = str(data_obj.get("data", ""))
                    elif isinstance(data_obj, list) and data_obj:
                        inner_data = str(data_obj[0].get("data", ""))
                    else:
                        logger.error(f"[Solve] 云码格式异常: {result}")
                        continue

                    coords = self._parse_coords(inner_data)
                    if coords:
                        logger.info(f"[Solve] 云码识别成功: {coords}")
                        return coords
                    logger.error(f"[Solve] 坐标解析失败: {inner_data}")
                elif code in (10005, 10006, 10007, 10008, 10009):
                    wait = 2 ** attempt
                    logger.warning(f"[Solve] 云码繁忙(code={code}), {wait}s后重试")
                    time.sleep(wait)
                else:
                    logger.error(f"[Solve] 云码错误: code={code}, msg={result.get('msg')}")
                    return None
            except Exception as e:
                logger.error(f"[Solve] 请求异常: {e}")
                if attempt < 2:
                    time.sleep(2)
        return None

    def _parse_coords(self, raw: str) -> Optional[list]:
        """解析云码返回的坐标"""
        if not raw:
            return None
        try:
            if raw.startswith("["):
                parsed = json.loads(raw)
                coords = []
                for item in parsed:
                    if isinstance(item, dict) and "x" in item:
                        coords.append({"x": int(item["x"]), "y": int(item["y"])})
                    elif isinstance(item, (list, tuple)) and len(item) >= 2:
                        coords.append({"x": int(item[0]), "y": int(item[1])})
                return coords if coords else None

            if "|" in raw:
                coords = []
                for pair in raw.split("|"):
                    parts = pair.strip().split(",")
                    if len(parts) >= 2:
                        coords.append({"x": int(parts[0]), "y": int(parts[1])})
                return coords if coords else None

            parts = raw.split(",")
            nums = [int(p.strip()) for p in parts]
            if len(nums) >= 2 and len(nums) % 2 == 0:
                return [{"x": nums[i], "y": nums[i + 1]} for i in range(0, len(nums), 2)]
        except (ValueError, json.JSONDecodeError):
            pass
        return None

    def step7_validate_click(self, coords: list) -> Tuple[bool, Optional[str]]:
        """ajax.php + w → 提交点选坐标, 获取 validate (复用 AES key + RSA)"""
        # 模拟真实用户思考时间, passtime 需要 ~5-8 秒
        passtime_ms = 5000 + int(time.time() * 1000) % 3000
        elapsed = int(time.time() * 1000) - self.captcha_start_time
        wait_ms = max(0, passtime_ms - elapsed)
        if wait_ms > 0:
            logger.info(f"[Validate] 等待 {wait_ms}ms 模拟真实用户行为 (elapsed={elapsed}ms, target={passtime_ms}ms)")
            time.sleep(wait_ms / 1000.0)

        w = self._generate_w("click_validate", coords, reuse_key=True, pic=self.click_pic_path,
                             passtime=passtime_ms)
        if not w:
            logger.error("[Validate] w参数生成失败")
            return False, None

        cb = f"geetest_{int(time.time() * 1000)}"
        params = {
            "gt": self.gt, "challenge": self.challenge,
            "lang": "zh-cn", "pt": 0, "client_type": "web",
            "w": w, "callback": cb
        }
        # 优先尝试 geevisit.com (参考 ravizhan 实现), 失败回退 geetest.com
        api_endpoints = [self.GEEVISIT_API, self.GEETEST_API]
        for api_base in api_endpoints:
            try:
                logger.info(f"[Validate] 尝试 {api_base}")
                # 尝试带 callback
                resp = self.session.get(f"{api_base}/ajax.php", params=params,
                                        headers=GEETEST_HEADERS, timeout=15)
                raw = resp.text.strip()
                # 尝试 JSONP 解析
                if raw.startswith('(') or raw.startswith('geetest_'):
                    data = self._jsonp_parse(raw)
                else:
                    # 非JSONP, 直接JSON (geevisit 可能直接返回JSON)
                    try:
                        data = json.loads(raw)
                    except json.JSONDecodeError:
                        data = self._jsonp_parse(raw)
                logger.info(f"[Validate] 响应: {json.dumps(data, ensure_ascii=False)[:200]}")

                if data.get("status") == "success":
                    inner = data.get("data", {})
                    # 检查 result 字段
                    result_val = inner.get("result", "")
                    validate = inner.get("validate", "")
                    if validate:
                        logger.info(f"[Validate] 验证成功! validate={validate}")
                        return True, validate
                    # result=fail 但 status=success, 继续尝试下一个端点
                    msg = inner.get("message", "") or str(inner.get("msg", ""))
                    logger.warning(f"[Validate] {api_base} result={result_val}, msg={msg}")
                    continue

                logger.warning(f"[Validate] {api_base} 失败: {data}")
            except Exception as e:
                logger.error(f"[Validate] {api_base} 异常: {e}")

        return False, None

    # ============ Step 8: 登录提交 ============
    def step8_login(self, username: str, password: str, validate: str) -> dict:
        encrypted_pwd = encrypt_password(password, self.rsa_key, self.hash_salt)
        seccode = f"{validate}|jordan"
        logger.info(f"[Step8] 密码加密完成, 密文长度: {len(encrypted_pwd)}")

        url = f"{self.PASSPORT_BASE}/x/passport-login/web/login"
        data = {
            "source": "main-fe-header",
            "username": username,
            "password": encrypted_pwd,
            "keep": "0",
            "token": self.token,
            "challenge": self.challenge,
            "validate": validate,
            "seccode": seccode,
            "go_url": "https://www.bilibili.com",
        }

        try:
            resp = self.session.post(url, data=data, timeout=15)
            result = resp.json()
            logger.info(f"[Step8] 响应: code={result.get('code')}, message={result.get('message')}")

            if result.get("code") == 0:
                logger.info("[Step8] 登录成功!")
                cookies = self.session.cookies.get_dict()
                for k in ("SESSDATA", "bili_jct", "DedeUserID"):
                    if k in cookies:
                        logger.info(f"  {k}: {cookies[k][:15]}...")
            return result
        except Exception as e:
            logger.error(f"[Step8] 异常: {e}")
            return {"code": -1, "message": str(e)}

    # ============ 主流程 ============

    CAPTCHA_MAX_RETRY = 3  # 验证码最大重试次数

    def login(self, username: str, password: str) -> dict:
        logger.info("=" * 60)
        logger.info("B站密码登录 v2 - 纯协议实现")
        logger.info(f"账号: {username}")
        logger.info("=" * 60)

        # Step 1-2: 获取验证码参数 + RSA公钥
        if not self.step1_get_captcha():
            return {"code": -1, "message": "获取验证码参数失败"}
        if not self.step2_get_rsa_key():
            return {"code": -1, "message": "获取RSA公钥失败"}

        # Step 3: 极验 fullpage 初始化 (get.php + w)
        if not self.step3_fullpage_init():
            return {"code": -1, "message": "极验 fullpage 初始化失败"}

        # Step 4: ajax.php 获取验证码类型 (复用 AES key, 无 RSA)
        if not self.step4_ajax_type():
            return {"code": -1, "message": "获取验证码类型失败"}

        # Step 5-7: 获取验证码 → 识别 → 验证 (失败重试)
        for attempt in range(self.CAPTCHA_MAX_RETRY):
            logger.info(f"[Main] 验证码尝试 {attempt + 1}/{self.CAPTCHA_MAX_RETRY}")

            # Step 5: 获取点选验证码图片
            ok, image_bytes = self.step5_get_click_captcha()
            if not ok or not image_bytes:
                logger.warning(f"[Main] 获取验证码失败, 重试...")
                continue

            # Step 6: 云码识别
            coords = self.step6_solve_captcha(image_bytes)
            if not coords:
                logger.warning(f"[Main] 验证码识别失败, 重试...")
                continue

            # Step 7: 提交验证
            ok, validate = self.step7_validate_click(coords)
            if ok and validate:
                # Step 8: 登录
                return self.step8_login(username, password, validate)

            logger.warning(f"[Main] 验证码验证失败, 重试...")

        return {"code": -1, "message": f"验证码 {self.CAPTCHA_MAX_RETRY} 次尝试均失败"}


def main():
    print("=" * 60)
    print("B站密码登录 v2 - 纯协议实现")
    print("=" * 60)

    username = sys.argv[1] if len(sys.argv) > 1 else TEST_USERNAME
    password = sys.argv[2] if len(sys.argv) > 2 else TEST_PASSWORD

    login = BilibiliLoginV2(yunma_token=YUNMA_TOKEN)
    result = login.login(username, password)

    print()
    print(f"最终结果: code={result.get('code')}, message={result.get('message')}")
    if result.get("data"):
        print(f"data: {json.dumps(result['data'], ensure_ascii=False, indent=2)[:300]}")


if __name__ == "__main__":
    main()

"""
网易易盾滑块验证码 - 纯协议请求脚本
通过补环境生成加密参数 + 本地识别滑块位置
"""
import json
import time
import base64
import random
import string
import subprocess
import sys
import os
import re
import math
from pathlib import Path
from urllib.parse import urlencode, quote, unquote

import requests

# ========== 配置 ==========
CAPTCHA_ID = "07e2387ab53a4d6f930b8d9a9be71bdf"
REFERER = "https://dun.163.com/trial/jigsaw"
BASE_DIR = Path(__file__).parent
SIGNER_JS = str(BASE_DIR / "signer.js")
NODE = "node"

# 云码配置（默认不启用，避免误消耗第三方识别服务）
YUNMA_API = "http://api.jfbym.com/api/YmServer/customApi"
YUNMA_TOKEN = os.environ.get("YUNMA_TOKEN", "")
ALLOW_YUNMA = os.environ.get("DUN_ALLOW_YUNMA", "0").lower() in {"1", "true", "yes"}

# UA
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36"

# 固定指纹（从浏览器捕获）
FIXED_FP = r"uJobkMcsxSN8KHooQ\9\jHNIt\AmmKb1ZJK5/dWHxA4N\xfCqab6xhvRe5\HNTXwhzaa0byOcexty\+HJKgTsXodhL+MiWNU7BckuJGfMeEgInJjekng5MgDaq8diZB+\\TnhHWq2X+7ldcxyt\0Zs6/O0t0yizigmy8DjRyQgl1wUp/p:"


class Dun163Captcha:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": USER_AGENT,
            "Referer": REFERER,
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        })
        self.dt = ""
        self.zone_id = ""
        self.ir_config = {}
        self.ac_config = {}
        self.fp = FIXED_FP + str(int(time.time() * 1000))
        self.ir_token = ""
        self.captcha_token = ""
        self._slide_ocr = None
        self._fp_ready = False

    # ========== Step 1: getconf ==========
    def getconf(self):
        """获取 SDK 配置"""
        url = "https://c.dun.163.com/api/v2/getconf"
        params = {
            "referer": REFERER,
            "zoneId": "",
            "id": CAPTCHA_ID,
            "ipv6": "false",
            "runEnv": "10",
            "iv": "5",
            "type": "2",
            "loadVersion": "2.5.4",
        }
        # JSONP callback
        cb_name = f"__JSONP_{_random_str(7)}_0"
        params["callback"] = cb_name

        resp = self.session.get(url, params=params, timeout=10)
        text = resp.text

        # 解析 JSONP
        data = _parse_jsonp(text)
        if not data or data.get("error") != 0:
            raise Exception(f"getconf failed: {text}")

        conf = data["data"]
        self.dt = conf["dt"]
        self.zone_id = conf.get("zoneId", "CN31")
        self.ir_config = conf.get("ir", {})
        self.ac_config = conf.get("ac", {})

        print(f"[getconf] dt={self.dt[:20]}... zoneId={self.zone_id}")
        return conf

    # ========== Step 2: IR SDK 上报 ==========
    def prepare_fingerprint(self):
        """提前生成 core fingerprint，保证 IR/get/check 使用同一个会话指纹"""
        signed = self._generate_get_params()
        if signed.get("fp"):
            self._fp_ready = True
            print(f"[fp] fp={self.fp[:20]}... len={len(self.fp)}")
        return self.fp

    def ir_upload(self):
        """设备指纹上报，获取 irToken - 通过 Node.js 补环境执行 IR SDK"""
        if not self.ir_config.get("enable"):
            print("[ir] IR SDK not enabled, skipping")
            return ""

        api_server = self.ir_config.get("apiServer", ["ir-sdk.dun.163.com"])[0]
        url = f"https://{api_server}/v4/j/up"

        # 尝试通过 Node.js 补环境运行 IR SDK，成功时直接使用 SDK 生成的完整 body
        ir_body = self._run_ir_sdk_in_node()
        if not ir_body:
            print("[ir] Node.js IR SDK failed, trying direct upload...")
            ir_d = self._generate_ir_d()
            nonce = _random_hex(32)
            ir_body = {
                "p": self.ir_config.get("pn", "YD00192283058223"),
                "v": "2.0.13_yanzhengma",
                "vk": "d44593ca",
                "n": nonce,
                "d": ir_d,
            }

        resp = self.session.post(
            url,
            json=ir_body,
            headers={"Content-Type": "text/plain"},
            timeout=10
        )

        data = resp.json()
        if data.get("code") != 200:
            raise Exception(f"IR upload failed: {data}")

        self.ir_token = data["data"]["tk"]
        print(f"[ir] irToken={self.ir_token}")
        return self.ir_token

    def _run_ir_sdk_in_node(self):
        """通过 Node.js vm 加载 IR SDK 并捕获加密数据"""
        try:
            result = self._call_signer("ir", json.dumps({
                "pn": self.ir_config.get("pn", "YD00192283058223"),
                "referer": REFERER,
                "fixedFp": self.fp,
            }))
            if result and result.get("d"):
                return result
        except Exception as e:
            print(f"[ir] Node.js IR failed: {e}")
        return None

    def _generate_ir_d(self):
        """IR 数据生成 - 使用 fallback"""
        return self._generate_ir_d_fallback()

    def _generate_ir_d_fallback(self):
        """IR 数据 fallback（基本设备信息编码）"""
        import hashlib
        device_info = {
            "ua": USER_AGENT,
            "platform": "Win32",
            "screen": f"{2560}x{1440}",
            "colorDepth": 24,
            "timezone": -480,
            "language": "zh-CN",
            "plugins": 5,
            "canvas": hashlib.md5(b"canvas_fingerprint").hexdigest()[:16],
            "webgl": hashlib.md5(b"webgl_fingerprint").hexdigest()[:16],
            "ts": int(time.time() * 1000),
        }
        raw = json.dumps(device_info, separators=(',', ':'))
        # 简单编码
        encoded = base64.b64encode(raw.encode()).decode()
        return encoded

    # ========== Step 3: get 获取验证码 ==========
    def get_captcha(self):
        """获取验证码图片和 token"""
        url = "https://c.dun.163.com/api/v3/get"
        cb_name = f"__JSONP_{_random_str(7)}_{random.randint(0, 20)}"
        if self._fp_ready:
            signed = {"fp": self.fp, "cb": self._generate_cb(update_fp=False)}
        else:
            signed = self._generate_get_params()

        params = {
            "referer": REFERER,
            "zoneId": self.zone_id,
            "dt": self.dt,
            "irToken": self.ir_token,
            "id": CAPTCHA_ID,
            "fp": signed.get("fp") or self.fp,
            "https": "true",
            "type": "2",
            "version": "2.28.5",
            "dpr": "1",
            "dev": "1",
            "cb": signed.get("cb") or self._generate_cb(),
            "ipv6": "false",
            "runEnv": "10",
            "group": "",
            "scene": "",
            "lang": "zh-CN",
            "sdkVersion": "",
            "loadVersion": "2.5.4",
            "iv": "4",
            "user": "",
            "width": "320",
            "audio": "false",
            "sizeType": "10",
            "smsVersion": "v3",
            "token": self.captcha_token,
            "callback": cb_name,
        }

        resp = self.session.get(url, params=params, timeout=10)
        data = _parse_jsonp(resp.text)

        if not data or data.get("error") != 0:
            raise Exception(f"get captcha failed: {resp.text[:200]}")

        result = data["data"]
        self.captcha_token = result["token"]

        bg_urls = result["bg"]
        front_urls = result["front"]

        print(f"[get] token={self.captcha_token} bg={bg_urls[0][:60]}...")

        return {
            "bg_url": bg_urls[0],
            "front_url": front_urls[0],
            "token": self.captcha_token,
            "wait_time": result.get("waitTime", 300),
        }

    # ========== Step 4: 下载图片 ==========
    def download_images(self, bg_url, front_url):
        """下载背景图和滑块图"""
        bg_resp = self.session.get(bg_url, timeout=15)
        front_resp = self.session.get(front_url, timeout=15)

        bg_b64 = base64.b64encode(bg_resp.content).decode()
        front_b64 = base64.b64encode(front_resp.content).decode()

        print(f"[download] bg={len(bg_resp.content)}bytes front={len(front_resp.content)}bytes")
        return bg_b64, front_b64

    # ========== Step 5: 滑块识别 ==========
    def recognize_captcha(self, bg_b64, front_b64):
        """优先使用本地 ddddocr 识别滑块缺口位置，必要时可显式启用云码兜底"""
        local_error = None
        try:
            return self._recognize_captcha_local(bg_b64, front_b64)
        except Exception as e:
            local_error = e
            print(f"[recognize] local ddddocr failed: {e}")

        if ALLOW_YUNMA and YUNMA_TOKEN:
            return self._recognize_captcha_yunma(bg_b64, front_b64)

        raise Exception(
            "captcha recognize failed: local ddddocr failed and YunMa fallback is disabled. "
            "Set DUN_ALLOW_YUNMA=1 and YUNMA_TOKEN to enable cloud fallback."
        ) from local_error

    def _recognize_captcha_local(self, bg_b64, front_b64):
        """使用 ddddocr 本地识别滑块缺口位置"""
        import ddddocr

        bg_bytes = base64.b64decode(bg_b64)
        front_bytes = base64.b64decode(front_b64)

        if self._slide_ocr is None:
            self._slide_ocr = ddddocr.DdddOcr(det=False, ocr=False, show_ad=False)

        laohe_candidates = []
        for simple_target in (False, True):
            try:
                result = self._slide_ocr.slide_match(
                    front_bytes,
                    bg_bytes,
                    simple_target=simple_target,
                )
                distance = _extract_slide_distance(result)
                if distance is None:
                    continue

                confidence = result.get("confidence")
                laohe_candidates.append({
                    "mode": "simple" if simple_target else "full",
                    "distance": int(distance),
                    "confidence": _safe_float(confidence),
                    "raw": result,
                })
            except Exception as e:
                print(f"[recognize] ddddocr mode={simple_target} failed: {e}")

        opencv_candidate = self._recognize_captcha_opencv(bg_bytes, front_bytes)
        if opencv_candidate:
            laohe_candidates.append(opencv_candidate)

        if not laohe_candidates:
            raise ValueError("ddddocr returned no usable slide candidates")

        # full 模式在易盾拼图图块上更稳定；simple 模式可能给出负置信度的错误峰值。
        valid = [item for item in laohe_candidates if 0 <= item["distance"] <= 300]
        if not valid:
            valid = laohe_candidates

        def score(item):
            confidence = item["confidence"]
            if confidence is None:
                confidence = -1.0
            mode_bonus = 0.2 if item["mode"] == "opencv_masked" else 0.05 if item["mode"] == "full" else 0.0
            return confidence + mode_bonus

        munian_best = max(valid, key=score)
        distance = munian_best["distance"]
        print(
            "[recognize] candidates="
            + json.dumps(
                [{k: v for k, v in item.items() if k != "raw"} for item in laohe_candidates],
                ensure_ascii=False,
                separators=(',', ':'),
            )
            + f" selected={distance}"
        )
        return distance

    def _recognize_captcha_opencv(self, bg_bytes, front_bytes):
        """用滑块 PNG alpha mask 在背景图上做模板匹配。"""
        try:
            import cv2
            import numpy as np
        except Exception as e:
            print(f"[recognize] opencv unavailable: {e}")
            return None

        bg_arr = np.frombuffer(bg_bytes, dtype=np.uint8)
        front_arr = np.frombuffer(front_bytes, dtype=np.uint8)
        bg = cv2.imdecode(bg_arr, cv2.IMREAD_COLOR)
        front = cv2.imdecode(front_arr, cv2.IMREAD_UNCHANGED)
        if bg is None or front is None or front.ndim != 3 or front.shape[2] < 4:
            return None

        template = front[:, :, :3]
        mask = (front[:, :, 3] > 20).astype("uint8") * 255
        if int(mask.sum()) == 0:
            return None

        try:
            result = cv2.matchTemplate(bg, template, cv2.TM_CCORR_NORMED, mask=mask)
            _, max_val, _, max_loc = cv2.minMaxLoc(result)
        except Exception as e:
            print(f"[recognize] opencv masked match failed: {e}")
            return None

        if not math.isfinite(float(max_val)):
            return None

        return {
            "mode": "opencv_masked",
            "distance": int(max_loc[0]),
            "confidence": float(max_val),
            "raw": {"target": [int(max_loc[0]), int(max_loc[1])]},
        }

    def _recognize_captcha_yunma(self, bg_b64, front_b64):
        """使用云码识别滑块缺口位置"""
        data = {
            "slide_image": front_b64,
            "background_image": bg_b64,
            "token": YUNMA_TOKEN,
            "type": "20111",
        }

        resp = requests.post(YUNMA_API, json=data, timeout=30)
        result = resp.json()

        if result.get("code") != 10000:
            raise Exception(f"YunMa recognize failed: {result}")

        distance = int(result["data"]["data"])
        print(f"[recognize] distance={distance}")
        return distance

    # ========== Step 6: check 验证 ==========
    def check_captcha(self, distance):
        """验证滑块位置"""
        url = "https://c.dun.163.com/api/v3/check"
        cb_name = f"__JSONP_{_random_str(7)}_{random.randint(0, 20)}"

        # 生成轨迹
        tracks = self._generate_tracks(distance)

        # 生成加密的 data 参数
        check_data = self._generate_check_data(distance, tracks)

        params = {
            "referer": REFERER,
            "zoneId": self.zone_id,
            "dt": self.dt,
            "id": CAPTCHA_ID,
            "token": self.captcha_token,
            "data": json.dumps(check_data, separators=(',', ':')),
            "width": "320",
            "type": "2",
            "version": "2.28.5",
            "cb": self._generate_cb(),
            "user": "",
            "extraData": "",
            "bf": "0",
            "runEnv": "10",
            "sdkVersion": "",
            "loadVersion": "2.5.4",
            "iv": "4",
            "callback": cb_name,
        }

        resp = self.session.get(url, params=params, timeout=10)
        data = _parse_jsonp(resp.text)

        if not data:
            raise Exception(f"check failed: {resp.text[:200]}")

        result = data.get("data", {})
        success = result.get("result", False)
        validate = result.get("validate", "")

        if success:
            print(f"[check] SUCCESS! validate={validate[:40]}...")
        else:
            print(f"[check] FAILED, retry needed")

        return {
            "success": success,
            "validate": validate,
            "token": result.get("token", ""),
            "raw": data,
        }

    # ========== 轨迹生成 ==========
    def _generate_tracks(self, distance):
        """生成接近浏览器组件格式的滑动轨迹

        浏览器 atomTraceData 每个点为：
        [round(dragX), round(clientY - startY), now - beginTime, buttonsFlag]
        """
        tracks = []
        distance = max(0, int(distance))
        duration = random.randint(850, 1450)
        steps = random.randint(34, 52)
        y_base = random.randint(-2, 2)

        # 少量过冲再回拉，比全程单调更接近真实拖动。
        overshoot = random.randint(1, 4) if distance > 40 else 0

        for i in range(1, steps + 1):
            progress = i / steps
            if progress < 0.82:
                ease = 1 - (1 - progress / 0.82) ** 3
                x = round((distance + overshoot) * min(ease, 1))
            else:
                tail = (progress - 0.82) / 0.18
                x = round(distance + overshoot * (1 - tail))

            # 浏览器记录的是相对起点的 y 偏移和相对开始时间。
            y = y_base + round(math.sin(i / 4.0) * 2) + random.choice([-1, 0, 0, 1])
            elapsed = round(duration * progress + random.randint(-5, 8))
            elapsed = max(0, elapsed)
            x = max(0, x)
            tracks.append([x, y, elapsed, 1])

        if not tracks or tracks[-1][0] != distance:
            final_t = duration + random.randint(20, 80)
            final_y = tracks[-1][1] if tracks else y_base
            tracks.append([distance, final_y, final_t, 1])

        return tracks

    # ========== cb 参数生成 ==========
    def _generate_get_params(self):
        """生成 get 请求所需的 fp/cb 参数"""
        try:
            config = json.dumps({
                "referer": REFERER,
                "fixedFp": self.fp,
                "dt": self.dt,
            })
            result = self._call_signer("get", config)
            if result and isinstance(result, dict):
                if result.get("fp"):
                    self.fp = result["fp"]
                if result.get("cb"):
                    return {"fp": self.fp, "cb": result["cb"]}
        except Exception as e:
            print(f"[get signer] fallback: {e}")
        return {"fp": self.fp, "cb": _random_cb()}

    def _generate_cb(self, update_fp=False):
        """生成 cb 加密参数"""
        try:
            config = json.dumps({
                "referer": REFERER,
                "fixedFp": self.fp,
                "dt": self.dt,
            })
            result = self._call_signer("fp", config)
            if update_fp and result and isinstance(result, dict) and result.get("fp"):
                self.fp = result["fp"]
            if result and isinstance(result, dict) and result.get("cb"):
                return result["cb"]
        except Exception as e:
            print(f"[cb] signer fallback: {e}")

        # fallback: 生成随机 cb
        return _random_cb()

    # ========== check data 生成 ==========
    def _generate_check_data(self, distance, tracks):
        """生成 check 请求的 data 参数"""
        try:
            config = json.dumps({
                "referer": REFERER,
                "fixedFp": self.fp,
                "dt": self.dt,
                "token": self.captcha_token,
                "width": 320,
                "left": int(distance),
                "tracks": tracks,
            })
            result = self._call_signer("check", str(distance), config)
            if result and result.get("d"):
                return result
        except Exception as e:
            print(f"[data] signer fallback: {e}")

        # fallback: 生成基本 data
        return {
            "d": self._encode_tracks(tracks),
            "m": "",
            "p": self._generate_p(distance),
            "f": self._generate_f(),
            "ext": self._generate_ext(),
        }

    def _encode_tracks(self, tracks):
        """简单编码轨迹数据"""
        raw = json.dumps(tracks, separators=(',', ':'))
        encoded = base64.b64encode(raw.encode()).decode()
        # 替换字符使其看起来像易盾编码
        encoded = encoded.replace('+', '.').replace('/', '_').replace('=', '-')
        return encoded

    def _generate_p(self, distance):
        """生成 p 参数"""
        import hashlib
        raw = f"{distance}_{self.captcha_token}_{time.time()}"
        return base64.b64encode(hashlib.md5(raw.encode()).digest()).decode().replace('+', '.').replace('/', '_').replace('=', '-')

    def _generate_f(self):
        """生成 f 参数"""
        import hashlib
        raw = f"{self.fp}_{USER_AGENT}"
        return base64.b64encode(hashlib.md5(raw.encode()).digest()).decode().replace('+', '.').replace('/', '_').replace('=', '-')

    def _generate_ext(self):
        """生成 ext 参数"""
        import hashlib
        raw = f"ext_{self.dt}_{time.time()}"
        return base64.b64encode(hashlib.md5(raw.encode()).digest()).decode().replace('+', '.').replace('/', '_').replace('=', '-')

    # ========== Node.js 签名器调用 ==========
    def _call_signer(self, command, *args):
        """调用 Node.js 签名器"""
        cmd = [NODE, SIGNER_JS, command] + list(args)
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30,
                cwd=str(BASE_DIR),
            )
            if result.returncode == 0 and result.stdout:
                data = json.loads(result.stdout.strip())
                if data.get("ok"):
                    return data.get("data")
            else:
                if result.stderr:
                    print(f"[signer stderr] {result.stderr[:200]}")
        except subprocess.TimeoutExpired:
            print("[signer] timeout")
        except json.JSONDecodeError:
            pass
        except Exception as e:
            print(f"[signer] error: {e}")
        return None

    # ========== 主流程 ==========
    def run(self, max_retries=5):
        """运行完整验证码流程"""
        print("=" * 60)
        print("网易易盾滑块验证码 - 纯协议请求")
        print("=" * 60)

        for attempt in range(1, max_retries + 1):
            print(f"\n--- Attempt {attempt}/{max_retries} ---")
            try:
                # Step 1: getconf
                self.getconf()

                # Step 1.5: 生成 core fingerprint
                self.prepare_fingerprint()

                # Step 2: IR 上报
                self.ir_upload()

                # Step 3: 获取验证码
                captcha = self.get_captcha()

                # Step 4: 下载图片
                bg_b64, front_b64 = self.download_images(
                    captcha["bg_url"], captcha["front_url"]
                )

                # Step 5: 云码识别
                distance = self.recognize_captcha(bg_b64, front_b64)

                # 等待 (模拟人类操作时间)
                wait = captcha.get("wait_time", 300) / 1000
                time.sleep(max(wait, 0.5))

                # Step 6: check
                result = self.check_captcha(distance)

                if result["success"]:
                    print(f"\n{'=' * 60}")
                    print(f"验证成功!")
                    print(f"validate: {result['validate']}")
                    print(f"{'=' * 60}")
                    return result

                # 失败则重试
                print(f"[retry] 验证失败，等待重试...")
                time.sleep(1)

            except Exception as e:
                print(f"[error] {e}")
                time.sleep(1)

        print(f"\n所有尝试均失败")
        return None


# ========== 工具函数 ==========
def _extract_slide_distance(result):
    """从 ddddocr 结果中抽取 x 坐标。"""
    distance = result.get("target_x")
    if distance is not None:
        return distance

    target = result.get("target") or result.get("res")
    if isinstance(target, (list, tuple)) and target:
        return target[0]
    return None


def _safe_float(value):
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _random_str(length):
    chars = string.ascii_lowercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))


def _random_hex(length):
    chars = '0123456789abcdef'
    return ''.join(random.choice(chars) for _ in range(length))


def _random_cb():
    """生成随机 cb 值"""
    import hashlib
    raw = f"{time.time()}_{random.random()}_{_random_str(20)}"
    h = hashlib.md5(raw.encode()).digest()
    b64 = base64.b64encode(h).decode()
    return b64[:50].replace('+', '.').replace('/', '_').replace('=', '')


def _parse_jsonp(text):
    """解析 JSONP 响应"""
    # 移除 JSONP 包裹
    match = re.match(r'^[a-zA-Z_]\w*\((.+)\);?$', text.strip(), re.DOTALL)
    if match:
        return json.loads(match.group(1))
    try:
        return json.loads(text)
    except:
        return None


if __name__ == "__main__":
    solver = Dun163Captcha()
    solver.run()

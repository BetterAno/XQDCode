"""
银河票务 (galaxyticketing.com) 登录 + 阿里百川九宫格验证码自动识别

架构: Python requests (HTTP) + PIL (图片解码) + 云码 API (打码)

验证码系统: 阿里百川 Baxia Grid Click
图片解码: API 返回的图片是有效的 WebP (未加密!), 直接 PIL 解码
打码平台: 云码 (jfbym.com) type=30008
"""

import json
import base64
import time
import logging
import hashlib
import random
import string
import urllib3
from io import BytesIO

import requests
from PIL import Image

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

from captcha_solver import YunMaSolver

log = logging.getLogger("galaxyticketing")

BASE_URL = "https://www.galaxyticketing.com"
API_BASE = "https://rest-sig.imaitix.com"

YUNMA_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"


class GalaxyTicketingLogin:
    def __init__(self, yunma_token: str):
        self.session = requests.Session()
        self.session.verify = False
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                          "(KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            "Origin": BASE_URL,
            "Referer": f"{BASE_URL}/",
            "site": "m",
        })
        self.xsrf_token = None
        self.session_id = None
        self.captcha_solver = YunMaSolver(yunma_token)

    def _init_session(self):
        log.info("初始化 session...")
        self.session.get(
            f"{API_BASE}/api/cms/queryIntegrationConfig",
            params={"langType": "1", "dataType": "1", "needSiteConfig": "true",
                    "needHomePageConfig": "true", "needEnvironment": "true"},
            timeout=15,
        )
        cookies = self.session.cookies.get_dict()
        self.xsrf_token = cookies.get("XSRF-TOKEN", "")
        self.session_id = cookies.get("MZCONSUMERJSESSIONID", "")
        if self.xsrf_token:
            self.session.headers.update({
                "x-mz-session": self.session_id,
                "x-xsrf-token": self.xsrf_token,
            })
        log.info("Session 初始化完成")

    def _generate_hecate(self) -> str:
        return hashlib.md5(f"{time.time()}{random.random()}".encode()).hexdigest()

    def login(self, email: str, password: str) -> dict:
        self._init_session()

        email_b64 = base64.b64encode(email.encode()).decode()
        body = {
            "channelToken": "1",
            "email": email_b64,
            "loginPass": self._encrypt_password(password),
            "phone": "", "countryAreaCode": "", "messageCode": "",
            "serviceToken": "", "source": "1", "verifyCode": "",
            "signParam": {"scene": "register_h5", "sig": "", "sessionId": "", "token": ""},
            "mtee3Param": {"ua": "", "umidToken": "", "loginName": ""},
            "quickLogin": "", "langType": 1,
        }
        headers = {
            "_r": str(random.randint(10, 99)),
            "epeius": str(int(time.time() * 1000)),
            "hecate": self._generate_hecate(),
            "coeus": "10010",
        }

        log.info(f"发送登录请求: email={email}")
        resp = self.session.post(f"{API_BASE}/api/user/userLogin", json=body, headers=headers, timeout=15)
        result = resp.json()
        log.info(f"登录响应: {json.dumps(result, ensure_ascii=False)[:200]}")

        ret = result.get("ret", [])
        if any("RGV587_ERROR" in r for r in ret):
            uuid = result.get("uuid")
            punish_url = result.get("data", {}).get("url")
            log.info(f"触发验证码! uuid={uuid}")
            return {"status": "captcha_triggered", "uuid": uuid, "punish_url": punish_url}

        return {"status": "login_result", "data": result}

    def _encrypt_password(self, password: str) -> str:
        log.warning("密码加密使用占位实现, 需逆向 RSA 加密")
        return password

    def solve_captcha(self, punish_url: str, uuid: str) -> dict:
        log.info(f"开始验证码流程, uuid={uuid}")

        # Step 1: 从 punish_url 提取 x5secdata
        if "x5secdata=" not in punish_url:
            log.error("无法提取 x5secdata")
            return {"status": "error", "msg": "无法提取 x5secdata"}

        x5secdata = punish_url.split("x5secdata=")[1].split("&")[0]
        log.info(f"x5secdata 提取成功: {x5secdata[:20]}...")

        # Step 2: 获取九宫格图片并直接 PIL 解码 (不需要 WASM!)

        # Step 3: 获取九宫格图片并直接 PIL 解码 (不需要 WASM!)
        max_rounds = 9
        for round_num in range(max_rounds):
            log.info(f"=== 第 {round_num + 1} 轮识别 ===")

            encrypt_token, images = self._get_grid_images(uuid, x5secdata, n=round_num + 1)
            if not images:
                return {"status": "error", "msg": f"第 {round_num + 1} 轮获取验证码图片失败"}
            log.info(f"获取到 {len(images)} 张九宫格图片")

            # 直接 PIL 解码 WebP (API 返回的图片未加密)
            decoded_pngs = self._decode_images_direct(images)
            if not decoded_pngs:
                log.error("图片解码失败")
                return {"status": "error", "msg": "图片解码失败"}

            # 合并图片为大图
            big_img_b64 = YunMaSolver.merge_grid_images(decoded_pngs)
            label_img_b64 = decoded_pngs[0] if decoded_pngs else ""

            # 云码识别
            selected_indices = self.captcha_solver.solve_grid_click(big_img_b64, label_img_b64)
            if not selected_indices:
                log.error(f"第 {round_num + 1} 轮识别失败")
                return {"status": "error", "msg": f"第 {round_num + 1} 轮云码识别失败"}

            log.info(f"第 {round_num + 1} 轮选中索引: {selected_indices}")

            for idx in selected_indices:
                img = images[idx]
                replace_result = self._submit_grid_click(
                    uuid, x5secdata, encrypt_token,
                    img["imageId"], img["index"],
                    [i["imageId"] for i in images],
                )
                code = replace_result.get("code")
                if code == 0:
                    log.info("验证通过!")
                    return {"status": "success", "msg": "验证通过"}
                if code == 301:
                    log.info("继续选择...")

        return {"status": "exhausted", "msg": "已达最大轮次"}

    @staticmethod
    def _decode_images_direct(images: list) -> list[str]:
        """
        直接用 PIL 解码 API 返回的 WebP 图片 (无需 WASM)
        API 返回的 content 是 data:image/webp;base64,... 格式, 图片未加密
        """
        pngs_b64 = []
        for img_info in images:
            content = img_info.get("content", "")
            if not content.startswith("data:"):
                log.warning(f"图片[{img_info.get('index')}] 非标准格式")
                pngs_b64.append(None)
                continue
            b64 = content.split(",", 1)[1]
            raw = base64.b64decode(b64)
            pil_img = Image.open(BytesIO(raw))
            pil_img.load()
            buf = BytesIO()
            pil_img.save(buf, format="PNG")
            pngs_b64.append(base64.b64encode(buf.getvalue()).decode())
        return pngs_b64

    def _get_grid_images(self, uuid: str, x5secdata: str, n: int = 1) -> tuple:
        params = {
            "token": uuid,
            "appKey": "X82Y__0d308863e8ccf5d5734143a714fb628b",
            "ua": "234!" + ''.join(random.choices(string.ascii_letters + string.digits + "+/=", k=64)),
            "x5secdata": x5secdata,
            "language": "cn",
            "captchaConfigInfo": json.dumps({"gridType": 9}),
            "n": str(n),
            "_rand": ''.join(random.choices(string.ascii_letters + string.digits + "-_", k=44)),
            "v": self._generate_v(),
        }
        resp = self.session.get(
            f"{API_BASE}/api/user/userLogin/_____tmd_____/gridClickGet",
            params=params, timeout=15,
        )
        result = resp.json()
        if result.get("code") != 0:
            log.error(f"获取图片失败: code={result.get('code')}")
            return "", []
        data = result.get("data", {})
        return data.get("encryptToken", ""), data.get("images", [])

    def _submit_grid_click(self, uuid, x5secdata, encrypt_token,
                           selected_image_id, selected_image_index, displayed_images):
        params = {
            "token": uuid,
            "appKey": "X82Y__0d308863e8ccf5d5734143a714fb628b",
            "ua": "234!" + ''.join(random.choices(string.ascii_letters + string.digits + "+/=", k=64)),
            "umidToken": "",
            "encryptToken": encrypt_token,
            "x5secdata": x5secdata,
            "language": "cn",
            "selectedImageId": selected_image_id,
            "selectedImageIndex": str(selected_image_index),
            "displayedImages": json.dumps(displayed_images),
            "ppt": "1",
            "_rand": ''.join(random.choices(string.ascii_letters + string.digits + "-_", k=44)),
            "v": self._generate_v(),
        }
        resp = self.session.get(
            f"{API_BASE}/api/user/userLogin/_____tmd_____/gridClickReplace",
            params=params, timeout=15,
        )
        result = resp.json()
        log.info(f"gridClickReplace: code={result.get('code')}")
        return result

    @staticmethod
    def _generate_v():
        return ''.join(random.choices(string.digits, k=17))

    def close(self):
        pass


def main():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s - %(message)s")

    login = GalaxyTicketingLogin(yunma_token=YUNMA_TOKEN)
    result = login.login(email="testuser12345@gmail.com", password="TestPass123456!")

    if result.get("status") == "captcha_triggered":
        log.info("触发验证码, 开始自动识别...")
        captcha_result = login.solve_captcha(
            punish_url=result["punish_url"],
            uuid=result["uuid"],
        )
        log.info(f"验证码结果: {captcha_result}")
    else:
        log.info(f"登录结果: {result}")


if __name__ == "__main__":
    main()

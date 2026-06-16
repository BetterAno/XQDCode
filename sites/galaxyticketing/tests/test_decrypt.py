"""
真实测试: 登录触发验证码 → 获取加密图片 → WASM 解密 → 保存 PNG
"""
import sys, os, json, base64, time, logging, hashlib, random, string

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

from node_bridge import BaxiaSession

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("test")

API_BASE = "https://rest-sig.imaitix.com"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

def generate_v():
    return ''.join(random.choices(string.digits, k=17))

def step1_init_session():
    """获取 session cookies"""
    log.info("Step 1: 初始化 session...")
    s = requests.Session()
    s.verify = False
    s.headers.update({
        "User-Agent": UA,
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Origin": "https://www.galaxyticketing.com",
        "Referer": "https://www.galaxyticketing.com/",
        "site": "m",
    })
    s.get(f"{API_BASE}/api/cms/queryIntegrationConfig",
          params={"langType": "1", "dataType": "1", "needSiteConfig": "true",
                  "needHomePageConfig": "true", "needEnvironment": "true"},
          timeout=15)
    cookies = s.cookies.get_dict()
    xsrf = cookies.get("XSRF-TOKEN", "")
    sid = cookies.get("MZCONSUMERJSESSIONID", "")
    if xsrf:
        s.headers.update({"x-mz-session": sid, "x-xsrf-token": xsrf})
    log.info(f"  XSRF-TOKEN: {xsrf[:20]}...")
    log.info(f"  SESSION: {sid[:20]}...")
    return s

def step2_login(s, email, password):
    """登录触发验证码"""
    log.info("Step 2: 登录触发验证码...")
    email_b64 = base64.b64encode(email.encode()).decode()
    body = {
        "channelToken": "1", "email": email_b64,
        "loginPass": password,
        "phone": "", "countryAreaCode": "", "messageCode": "",
        "serviceToken": "", "source": "1", "verifyCode": "",
        "signParam": {"scene": "register_h5", "sig": "", "sessionId": "", "token": ""},
        "mtee3Param": {"ua": "", "umidToken": "", "loginName": ""},
        "quickLogin": "", "langType": 1,
    }
    headers = {
        "_r": str(random.randint(10, 99)),
        "epeius": str(int(time.time() * 1000)),
        "hecate": hashlib.md5(f"{time.time()}{random.random()}".encode()).hexdigest(),
        "coeus": "10010",
    }
    resp = s.post(f"{API_BASE}/api/user/userLogin", json=body, headers=headers, timeout=15)
    result = resp.json()
    log.info(f"  登录响应: ret={result.get('ret')}, uuid={result.get('uuid', 'N/A')[:20]}")
    return result

def step3_get_punish(s, punish_url):
    """获取验证码页面配置"""
    log.info("Step 3: 获取验证码配置...")
    resp = s.post(punish_url, json={}, timeout=15)
    log.info(f"  punish 响应 status={resp.status_code}, content-type={resp.headers.get('content-type','')}")
    log.info(f"  punish 响应 body[:300]: {resp.text[:300]}")
    try:
        data = resp.json()
    except Exception:
        # punish 可能返回 HTML 页面, 直接从 URL 提取 x5secdata
        log.warning("  punish 响应非 JSON, 尝试从 URL 提取 x5secdata")
        if "x5secdata=" in punish_url:
            x5secdata = punish_url.split("x5secdata=")[1].split("&")[0]
            log.info(f"  从 URL 提取 x5secdata: {x5secdata[:30]}...")
            return x5secdata, "captchaclick"
        return None, None
    data_url = data.get("data", {}).get("url", "")
    if "x5secdata=" not in data_url:
        log.error(f"  无法提取 x5secdata, url={data_url[:100]}")
        return None, None
    x5secdata = data_url.split("x5secdata=")[1].split("&")[0]
    action = data_url.split("action=")[1].split("&")[0] if "action=" in data_url else "captchaclick"
    log.info(f"  x5secdata: {x5secdata[:30]}...")
    log.info(f"  action: {action}")
    return x5secdata, action

def step4_get_images(s, uuid, x5secdata):
    """获取九宫格加密图片"""
    log.info("Step 4: 获取九宫格图片...")
    params = {
        "token": uuid,
        "appKey": "X82Y__0d308863e8ccf5d5734143a714fb628b",
        "ua": "234!" + ''.join(random.choices(string.ascii_letters + string.digits + "+/=", k=64)),
        "x5secdata": x5secdata,
        "language": "cn",
        "captchaConfigInfo": json.dumps({"gridType": 9}),
        "n": "1",
        "_rand": ''.join(random.choices(string.ascii_letters + string.digits + "-_", k=44)),
        "v": generate_v(),
    }
    resp = s.get(f"{API_BASE}/api/user/userLogin/_____tmd_____/gridClickGet",
                 params=params, timeout=15)
    result = resp.json()
    log.info(f"  响应 code: {result.get('code')}")
    data = result.get("data", {})
    encrypt_token = data.get("encryptToken", "")
    images = data.get("images", [])
    log.info(f"  encryptToken: {encrypt_token[:30]}...")
    log.info(f"  图片数量: {len(images)}")
    for i, img in enumerate(images):
        content = img.get("content", "")
        raw = base64.b64decode(content) if content else b""
        log.info(f"  图片[{i}]: content长度={len(content)}, 解码后={len(raw)} bytes, 前缀={raw[:8].hex() if len(raw)>=8 else raw.hex()}")
    return encrypt_token, images

def step5_decrypt(baxia, encrypt_token, images, output_dir):
    """WASM 解密图片并保存"""
    log.info("Step 5: WASM 解密图片...")
    results = baxia.decrypt_batch(encrypt_token, images)
    success_count = sum(1 for r in results if r is not None)
    log.info(f"  解密成功: {success_count}/{len(images)}")

    os.makedirs(output_dir, exist_ok=True)
    saved = []
    for i, png_b64 in enumerate(results):
        if png_b64 is None:
            log.warning(f"  图片[{i}] 解密失败")
            continue
        try:
            png_data = base64.b64decode(png_b64)
            fpath = os.path.join(output_dir, f"decrypted_{i}.png")
            with open(fpath, "wb") as f:
                f.write(png_data)
            # 检查 PNG magic
            is_png = png_data[:4] == b'\x89PNG'
            log.info(f"  图片[{i}]: {len(png_data)} bytes, PNG={'YES' if is_png else 'NO'} (前4字节: {png_data[:4].hex()})")
            saved.append(fpath)
        except Exception as e:
            log.error(f"  图片[{i}] 保存失败: {e}")
    return saved

def main():
    output_dir = os.path.join(os.path.dirname(__file__), "decrypt_output")

    # Step 1: Session
    s = step1_init_session()

    # Step 2: Login
    result = step2_login(s, "testuser12345@gmail.com", "TestPass123456!")
    ret = result.get("ret", [])
    if not any("RGV587_ERROR" in r for r in ret):
        log.error(f"登录未触发验证码: {json.dumps(result, ensure_ascii=False)[:200]}")
        return

    uuid = result["uuid"]
    punish_url = result["data"]["url"]
    log.info(f"  uuid: {uuid}")
    log.info(f"  punish_url: {punish_url}")

    # Step 3: Punish
    x5secdata, action = step3_get_punish(s, punish_url)
    if not x5secdata:
        return

    # Step 4: Get encrypted images
    encrypt_token, images = step4_get_images(s, uuid, x5secdata)
    if not images:
        log.error("未获取到图片")
        return

    # Step 5: WASM Decrypt
    log.info("启动 WASM 解密会话...")
    with BaxiaSession() as baxia:
        saved = step5_decrypt(baxia, encrypt_token, images, output_dir)

    if saved:
        log.info(f"\n成功保存 {len(saved)} 张解密图片到 {output_dir}")
        log.info("请检查图片是否可正常显示")
    else:
        log.error("\n所有图片解密失败!")

if __name__ == "__main__":
    main()

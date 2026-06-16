"""
真实测试: 获取加密图片 → 通过 test_real_data.js 解密 → 保存 PNG
"""
import sys, os, json, base64, time, logging, hashlib, random, string, subprocess

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("test")

API_BASE = "https://rest-sig.imaitix.com"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

def main():
    output_dir = os.path.join(os.path.dirname(__file__), "decrypt_output")
    os.makedirs(output_dir, exist_ok=True)

    # Step 1: Init session
    log.info("Step 1: 初始化 session...")
    s = requests.Session()
    s.verify = False
    s.headers.update({
        "User-Agent": UA, "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Origin": "https://www.galaxyticketing.com",
        "Referer": "https://www.galaxyticketing.com/", "site": "m",
    })
    s.get(f"{API_BASE}/api/cms/queryIntegrationConfig",
          params={"langType": "1", "dataType": "1", "needSiteConfig": "true",
                  "needHomePageConfig": "true", "needEnvironment": "true"}, timeout=15)
    cookies = s.cookies.get_dict()
    xsrf = cookies.get("XSRF-TOKEN", "")
    sid = cookies.get("MZCONSUMERJSESSIONID", "")
    if xsrf:
        s.headers.update({"x-mz-session": sid, "x-xsrf-token": xsrf})

    # Step 2: Login to trigger captcha
    log.info("Step 2: 登录触发验证码...")
    email_b64 = base64.b64encode(b"testuser12345@gmail.com").decode()
    body = {
        "channelToken": "1", "email": email_b64, "loginPass": "TestPass123456!",
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
    ret = result.get("ret", [])
    if not any("RGV587_ERROR" in r for r in ret):
        log.error(f"未触发验证码: {ret}")
        return

    uuid = result["uuid"]
    punish_url = result["data"]["url"]
    log.info(f"  uuid: {uuid[:20]}...")

    # Step 3: Extract x5secdata from URL
    x5secdata = punish_url.split("x5secdata=")[1].split("&")[0] if "x5secdata=" in punish_url else ""
    if not x5secdata:
        log.error("无法提取 x5secdata")
        return
    log.info(f"  x5secdata: {x5secdata[:20]}...")

    # Step 4: Get encrypted images
    log.info("Step 3: 获取九宫格图片...")
    params = {
        "token": uuid,
        "appKey": "X82Y__0d308863e8ccf5d5734143a714fb628b",
        "ua": "234!" + ''.join(random.choices(string.ascii_letters + string.digits + "+/=", k=64)),
        "x5secdata": x5secdata, "language": "cn",
        "captchaConfigInfo": json.dumps({"gridType": 9}),
        "n": "1",
        "_rand": ''.join(random.choices(string.ascii_letters + string.digits + "-_", k=44)),
        "v": ''.join(random.choices(string.digits, k=17)),
    }
    resp = s.get(f"{API_BASE}/api/user/userLogin/_____tmd_____/gridClickGet",
                 params=params, timeout=15)
    grid_result = resp.json()
    if grid_result.get("code") != 0:
        log.error(f"获取图片失败: {grid_result.get('code')}")
        return

    encrypt_token = grid_result["data"]["encryptToken"]
    images = grid_result["data"]["images"]
    log.info(f"  获取到 {len(images)} 张图片, encryptToken: {encrypt_token[:20]}...")

    for i, img in enumerate(images):
        raw = base64.b64decode(img["content"])
        log.info(f"  图片[{i}]: {len(raw)} bytes, 前缀={raw[:8].hex()}")

    # Step 5: Decrypt via Node.js with real canvas
    log.info("Step 4: WASM 解密 (真实 Canvas)...")
    input_data = json.dumps({"encryptToken": encrypt_token, "images": images})

    test_js = os.path.join(os.path.dirname(__file__), '..', 'node', 'test_wasm_decrypt.js')
    proc = subprocess.run(
        ["node", test_js],
        input=input_data.encode('utf-8'), capture_output=True, timeout=30,
        cwd=os.path.dirname(test_js),
    )
    stderr_text = proc.stderr.decode('utf-8', errors='replace') if proc.stderr else ''
    log.info(f"  Node.js stderr:\n{stderr_text[:3000]}")

    if proc.returncode != 0:
        log.error(f"  Node.js 执行失败: rc={proc.returncode}")
        return

    # Check saved PNG files
    saved_files = [f for f in os.listdir(output_dir) if f.endswith('.png')]
    log.info(f"  解密完成, 输出文件: {len(saved_files)}")
    for f in sorted(saved_files):
        fpath = os.path.join(output_dir, f)
        fsize = os.path.getsize(fpath)
        with open(fpath, 'rb') as pf:
            magic = pf.read(4)
        log.info(f"  {f}: {fsize} bytes, {'有效PNG' if magic == b'\\x89PNG' else '无效'}")

if __name__ == "__main__":
    main()

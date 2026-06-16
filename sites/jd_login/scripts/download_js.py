"""
下载 JD 登录页所有关键 JS 到 sites/jd_login/assets/js/
来源：Phase 1 在 passport.jd.com/new/login.aspx 实测的 script[src] 列表
"""
from __future__ import annotations
import os
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

try:
    import requests
except ImportError:
    print("pip install requests")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "js"
OUT.mkdir(parents=True, exist_ok=True)

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/144.0.0.0 Safari/537.36"
)

URLS = [
    "https://wl.jd.com/wl.js",
    "https://static.360buyimg.com/risk-cdn/seq/s.js?v=6",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/newLogin/compatibility-check.js",
    "https://sgm-static.jd.com/sgm-web-3.3.0.js",
    "https://sgm-static.jd.com/sgm-web-main-3.3.0.js",
    "https://storage.jd.com/fido-source/tc/1.0.1/trace-chain-sdk.umd.min.js",
    "https://misc.360buyimg.com/jdf/lib/jquery-1.6.4.js",
    "https://storage.jd.com/fido-source/ubc/1.0.4/wbc.min.js",
    "https://jcap.m.jd.com/home/requireCaptchaPc.js?v=2",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/newLogin/graphic-captcha-helper.js",
    "https://storage.360buyimg.com/jsresource/jcap/version/v2.7.1/1/jcap_ap0b2a.js",
    "https://storage.360buyimg.com/babelnode/jd-jssdk/4.6.4/jd-jssdk.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/underscore-min.js",
    "https://ivs.jd.com/slide/js/jdSlide.1.0.min.js",
    "https://jrsecstatic.jdpay.com/jr-sec-dev-static/summer-cryptico-h5.min.js",
    "https://misc.360buyimg.com/jdf/1.0.0/unit/base/1.0.0/base.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/newLogin/jdJsencrypt.min.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.index.2024.js",
    "https://gias.jd.com/js/pc-tk.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/util/eid.js",
    "https://storage.360buyimg.com/webcontainer/js_security_v3_0.1.8.js",
    "https://storage.360buyimg.com/bjd-utils-sdk/bjdcommon/login/1.0.0/index.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login2025_append.js",
    "https://gias.jd.com/js/td.js",
    # ===== 第二批：login.index.2024.js 通过 seajs 加载的二级模块（Phase 1 反混淆发现） =====
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/behavior/user_behavior.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.username.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.password.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.submit.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.qrcode.2024.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/newLogin/login.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/newLogin/login2024.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/newLogin/mobileLogin.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/newLogin/ssoDomain.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/util/aks.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/util/dra.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/util/ziwuxianwrapper.js",
    "https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/util/sign.js",
]


def safe_name(url: str) -> str:
    p = urlparse(url)
    host = p.netloc.replace(":", "_")
    path = re.sub(r"[^A-Za-z0-9._/-]", "_", p.path).strip("/")
    name = f"{host}__{path.replace('/', '__')}"
    if not name.endswith(".js"):
        name = name + ".js"
    if len(name) > 180:
        name = name[:180]
    return name


def main() -> int:
    sess = requests.Session()
    sess.headers.update({
        "User-Agent": UA,
        "Referer": "https://passport.jd.com/",
        "Accept": "*/*",
    })
    ok, fail = 0, 0
    for url in URLS:
        out_path = OUT / safe_name(url)
        try:
            r = sess.get(url, timeout=20)
            r.raise_for_status()
            out_path.write_bytes(r.content)
            print(f"[OK] {len(r.content):>8} B  ->  {out_path.name}")
            ok += 1
        except Exception as e:
            print(f"[FAIL] {url}\n       {e}")
            fail += 1
    print(f"\nDone. ok={ok} fail={fail}  out={OUT}")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main())

"""Test AdsPower-generated cookies with requests"""
import requests

O_COOKIE = "60nuk4n5.3_xZ4TcjWo9WGGNFy8DWgl5atGQE5OE5gRo.XhtckNfiYmHTt5cxBzfHDg8gR6FWWQ.H.A1xb03JReq"
P_COOKIE = "0VEiiBpymL8LF23Jy7pTgwsZVhKbfcs.k4i9oHnFNHrOlFsq5c82bbp8EX4zonb3BW_3OCgqvmTXEQDdReY10CsiCYPkjbP3g05..riMpmqXUmDUyikjfl1KwtruiS1uB4SJQmTd2LsDqc_I0x1Ae0Qcqvtm.Wvz1q.aMTJntBd6kIjF0msCl8dIZOIPDBQGQluou4S65cMySJG4gk4.djJ93mRupexXGvFedNrOQVfjzvI9.nJRNGsO7AQLtNYERkpRrqbd2sUJebfwk9GxSWWxMQtgzMO9A6V4yk9P7ZdIwgcNEimEpH9GtwlWP.K_SPxFCPhd2WesgC2suirQBnf40kLu0Rd0B1YtcQJLVvs_.tXKCgKUtkIQizUm5ihycU1sARNN3zgkecw5QQovWLwdMBVhY9HhWeONGaUt9cs09SVCXCptYFKxS8h5bnhVn"

TARGET = "https://www.jscq.com.cn/jscq/cqjy/jygg/cqzr/index.shtml"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,"
              "image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": TARGET,
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "sec-ch-ua": '"Chromium";v="125", "Google Chrome";v="125", "Not/A)Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
}

session = requests.Session()
session.headers.update(headers)
session.cookies.set("jDwkDWjIm6GRO", O_COOKIE, domain="www.jscq.com.cn")
session.cookies.set("jDwkDWjIm6GRP", P_COOKIE, domain="www.jscq.com.cn")
session.cookies.set("enable_jDwkDWjIm6GR", "true", domain="www.jscq.com.cn")

print(f"[*] Cookie header: {'; '.join(f'{c.name}={c.value[:30]}...' for c in session.cookies)}")
print(f"[*] P Cookie length: {len(P_COOKIE)}, dots: {P_COOKIE.count('.')}")

resp = session.get(TARGET, timeout=15)
print(f"\n[*] Status: {resp.status_code}")
print(f"[*] Response length: {len(resp.text)}")
print(f"[*] Response headers: {dict(resp.headers)}")

if resp.status_code == 200:
    if "江苏产权" in resp.text or "产权转让" in resp.text:
        print(f"\n[OK] SUCCESS! Real page content!")
        print(f"    Title area: {resp.text[resp.text.find('<title>'):resp.text.find('</title>')+8] if '<title>' in resp.text else 'N/A'}")
    elif "$_ts" in resp.text:
        print(f"\n[WARN] Still Ruishu challenge page")
    else:
        print(f"\n[?] Unknown response: {resp.text[:500]}")
else:
    print(f"\n[ERROR] Status {resp.status_code}: {resp.text[:500]}")

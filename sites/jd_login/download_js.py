import requests
import os
import urllib3
urllib3.disable_warnings()

base_dir = os.path.dirname(os.path.abspath(__file__))
js_dir = os.path.join(base_dir, 'assets', 'js')
os.makedirs(js_dir, exist_ok=True)

urls = [
    'https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/newLogin/jdJsencrypt.min.js',
    'https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.password.js',
    'https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.submit.js',
    'https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.index.2024.js',
    'https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login2025_append.js',
    'https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/newLogin/login2024.js',
    'https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/util/eid.js',
    'https://storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/util/sign.js',
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'
}

for url in urls:
    filename = url.split('/')[-1]
    filepath = os.path.join(js_dir, filename)
    try:
        resp = requests.get(url, headers=headers, timeout=30, verify=False)
        resp.raise_for_status()
        with open(filepath, 'wb') as f:
            f.write(resp.content)
        print(f'OK: {filename} ({len(resp.content)} bytes)')
    except Exception as e:
        print(f'FAIL: {filename} - {e}')

print('Done!')

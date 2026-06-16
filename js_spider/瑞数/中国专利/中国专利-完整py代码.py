import subprocess
from functools import partial

import requests
from lxml import etree

subprocess.Popen = partial(subprocess.Popen, encoding='utf-8')
import execjs

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
}

# 网站地址最后不能加斜杠, 之后会通过这个地址拼接外链的js地址
url = 'http://epub.cnipa.gov.cn'
session = requests.session()
response = session.get(url, headers=headers, verify=False)
response.encoding = 'utf-8'
html = etree.HTML(response.text)
meta_content = html.xpath('//meta/@content')[-1]
print(meta_content)
encrypt_js_code = html.xpath('//script/text()')[0]
decrypt_js_code_url = url + html.xpath('//script[2]/@src')[0]
decrypt_js_code = session.get(decrypt_js_code_url, headers=headers, verify=False).text

with open('中国专利-完整js代码.js', 'r', encoding='utf-8') as f:
    js_code = f.read()
    js_code = js_code.replace('meta_content', meta_content).replace("'encrypt_js_code'", encrypt_js_code).replace(
        "'decrypt_js_run_code'", decrypt_js_code)

ctx = execjs.compile(js_code)
cookie_t = ctx.call('get_cookie').split(';')[0].split('=')
print(cookie_t)
session.cookies.update({cookie_t[0]: cookie_t[1]})
response = session.get(url, headers=headers, verify=False)

print(response.text)
print(response)

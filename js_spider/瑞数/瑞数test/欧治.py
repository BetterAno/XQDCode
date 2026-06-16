

import requests
from lxml import etree
import execjs


url = 'https://www.ouyeel.com/steel/search?pageIndex=0&pageSize=50&productType='

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
}


# 几次请求  2
requests = requests.session()  # 携带响应的cookie


def first_request():
    response = requests.get(url, headers=headers)
    # print(response.text)
    obj_html = etree.HTML(response.text)
    content_data = obj_html.xpath('//meta[2]/@content')[0]
    func_code = obj_html.xpath('//script[1]/text()')[0]
    # print('content_data:', content_data, 'func_code:', func_code)
    return content_data, func_code


def two_request(content_data, func_code):
    with open('欧治.js', encoding='utf-8')as f:
        js_code = f.read().replace('content123', content_data).replace('!"sz_fun"', func_code)
    open('test2.js', 'w', encoding='utf-8').write(js_code)
    js = execjs.compile(js_code)
    cookie = js.call('RS_5')
    cookies = {
        cookie['name']: cookie['value']
    }
    print(cookies)
    res = requests.get(url, headers=headers, cookies=cookies)
    res.encoding = 'utf-8'
    print(res.text)
    print(res)


content_data, func_code = first_request()
two_request(content_data, func_code)

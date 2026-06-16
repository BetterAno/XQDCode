import re

import requests

session = requests.session()


# 请求首页获取_CSRF, cookies信息
def get_info():
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Pragma": "no-cache",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
    }
    url = "http://www.zjmazhang.gov.cn/hdjlpt/published"
    params = {
        "via": "pc"
    }
    response = session.get(url, headers=headers, params=params, verify=False)

    _CSRF = re.findall("var _CSRF = '(.*?)';", response.text)[0]
    XSRF_TOKEN = response.cookies['XSRF-TOKEN']
    szxx_session = response.cookies['szxx_session']
    get_Data(_CSRF, XSRF_TOKEN, szxx_session)


def get_Data(_CSRF, XSRF_TOKEN, szxx_session):
    headers = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "http://www.zjmazhang.gov.cn",
        "Pragma": "no-cache",
        "Referer": "http://www.zjmazhang.gov.cn/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        "X-CSRF-TOKEN": _CSRF
    }
    # cookies = {
    #     "XSRF-TOKEN": XSRF_TOKEN,
    #     "szxx_session": szxx_session
    # }
    url = "http://www.zjmazhang.gov.cn/hdjlpt/letter/pubList"
    data = {
        "offset": "0",
        "limit": "20",
        "site_id": "759010",
        "time_from": "1668528000",
        "time_to": "1697471999"
    }
    response = session.post(url, headers=headers, data=data)

    print(response.text)
    print(response)


get_info()

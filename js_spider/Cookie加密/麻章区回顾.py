import re

import requests


def get_index():
    headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
    }

    params = {
        'via': 'pc',
    }

    response = requests.get(
        'http://www.zjmazhang.gov.cn/hdjlpt/published',
        params=params,
        headers=headers,
        verify=False,
    )

    _CSRF = re.findall("var _CSRF = '(.*?)';", response.text)[0]
    szxx_session = response.cookies.get('szxx_session')
    return _CSRF, szxx_session


def get_data():
    _CSRF, szxx_session = get_index()
    cookies = {
        # 'XSRF-TOKEN': 'eyJpdiI6InVoQU5ZSkFmbm5XRlpcL0UwOElQM2t3PT0iLCJ2YWx1ZSI6IjNySXpPblZFSlhUb1pNRDNzRGVvVEdzSFhETEdvc1NacEdvbEtQbFJ3K1VsVmpqN2NmUmdhdXhtYjVPTU12R0kiLCJtYWMiOiIxYTBhYzQ3ZmZmZDc5NDExOGI5M2YxOTkyZWUwYmQxYjU4OTI0MWIzNWI1YTU1Mjc3ZWVlYTA2NzM5YmZmODIzIn0%3D',
        'szxx_session': szxx_session,
    }

    headers = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'http://www.zjmazhang.gov.cn',
        'Pragma': 'no-cache',
        'Referer': 'http://www.zjmazhang.gov.cn/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
        'X-CSRF-TOKEN': _CSRF
    }

    data = {
        'offset': '0',
        'limit': '20',
        'site_id': '759010',
        'time_from': '1733241600',
        'time_to': '1764777599',
    }

    response = requests.post(
        'http://www.zjmazhang.gov.cn/hdjlpt/letter/pubList',
        cookies=cookies,
        headers=headers,
        data=data,
        verify=False,
    )
    print(response.text)


get_data()

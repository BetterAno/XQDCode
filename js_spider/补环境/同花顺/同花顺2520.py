import requests
import execjs

item = execjs.compile(open('同花顺补原型.js', encoding='utf-8').read()).call('window.loader')

headers = {
    "accept": "text/html, */*; q=0.01",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "hexin-v": item,
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://q.10jqka.com.cn/",
    "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest"
}
cookies = {
    # "v": "A9KoqfBn70j5BxO0CLxXzsibI5Ox49bSCOXKrpwr_-RwcXwNhHMmjdh3Grpv"
}
url = "https://q.10jqka.com.cn/index/index/board/all/field/zdf/order/desc/page/2/ajax/1/"
response = requests.get(url, headers=headers, cookies=cookies)

print(response.text)
print(response)
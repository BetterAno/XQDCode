import requests


class JZSC:
    def __init__(self):
        self.headers = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://jzsc.mohurd.gov.cn/data/company",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
            "accessToken;": "",
            "sec-ch-ua": "\"Google Chrome\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "timeout": "30000",
            "v": "231012"
        }
        self.url = "https://jzsc.mohurd.gov.cn/APi/webApi/dataservice/query/comp/list?pg={}&pgsz=15&total=450"
        self.rpc_url = 'http://127.0.0.1:5620/business-demo/invoke'

    def get_Data(self, page):
        response = requests.get(url=self.url.format(page), headers=self.headers)
        return response.text

    def parse_Data(self, text):
        data = {
            'group': 'rpc-test',
            'action': 'test',
            'data': text
        }
        result = requests.post(url=self.rpc_url, data=data)
        print(result.json()['data'])

    def main(self):
        for page in range(1, 2):
            data = self.get_Data(page)
            self.parse_Data(data)


if __name__ == '__main__':
    jzsc = JZSC()
    jzsc.main()

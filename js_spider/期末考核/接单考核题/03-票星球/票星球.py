# import pymongo
import requests


class PXQSpider:
    def __init__(self):
        # self.mongo_client = pymongo.MongoClient()
        # self.db = self.mongo_client['py_spider']['PXQiu']
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            # "Angry-dog": "Xs9U8R5AK1-5C96P9opI8rsFZTi0GWpPSNMqP_2PsGwdJGXGFqjKszU5kjXC0Zp7V_JJ1dnk13bsfjVabxCZgGh51iL8TtJlAA0uRH81z8pdrb5xpdegv6hx8K6UmjMkNWtjWWxaMktLTnBzOWh4MA.WyIxLjEuMCIsIldFQiJd",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://m.piaoxingqiu.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
            "access-token;": "",
            # "front-trace-id": "mkgahoai92vgkguj6ao",
            "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "src": "WEB",
            "terminal-src": "WEB",
            "utc-offset": "480",
            "ver": "4.51.10"
        }
        self.api_url = "https://m.piaoxingqiu.com/cyy_gatewayapi/home/pub/v3/show_list/search_by_front"

    def get_data(self, page):
        params = {
            "bizFrontendCategoryId": "69688276c42fcf0001f25bf8",  # 根据类型(演唱会)固定的Id
            "cityId": "BL1241",  # 根据城市(北京)固定的Id
            "currency": "CNY",
            "lang": "zh",
            "length": "10",
            "offset": page * 10,
            "pageIndex": page,
            "pageLength": "10",
            "pageType": "ALL_PAGE",
            "siteId": "6268b17853245f055f21d677",  # 根据城市(cityId)固定的Id
            "terminalSrc": "WEB",
            "utcOffset": "480",
            "ver": "4.51.10",
            "src": "WEB"
        }
        response = requests.get(self.api_url, headers=self.headers, params=params).json()
        list_info = response['data']['searchData']
        for info in list_info:
            item = dict()
            item['title'] = info['showName']
            item['showDate'] = info['showDate']
            item['price'] = info['minOriginalPriceInfo']['yuanNum']
            print(item)
            # self.save_data(item)

    # def save_data(self, item):
    #     try:
    #         self.db.insert_one(item)
    #         print('数据保存成功:', item)
    #     except Exception as e:
    #         print('数据保存失败:', e)

    def main(self):
        for page in range(2):
            self.get_data(page)


if __name__ == '__main__':
    pxq = PXQSpider()
    pxq.main()

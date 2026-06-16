import re

import requests

from Font_parse import TTFont_parse


class MaoYan:
    def __init__(self):
        self.headers = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://piaofang.maoyan.com/dashboard/movie",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
            "X-FOR-WITH": "BJyzbfykEoYv1e1774mN4aBaXWJCGLSs432iWxO+VetJbBRW4tE4HgPUULiGK/vdy9jIIi/Xy5pFKYOU2QtqRxCyLzB691EuLU+rOIjJaYcUbS/ilhlS5Gg7WXgW2Ujin0w7i2m6bX9CKtGRPr0PQMHLPlj7wrZLSQCpBjX0mXUuldIIPmPfOurzouzwR1EsQAfVMgd/e26o+eIpCo55Fw==",
            "mygsig": "{\"m1\":\"0.0.3\",\"m2\":0,\"m3\":\"0.0.67_tool\",\"ms1\":\"065d347656f059d8bdad3c217065207a\",\"ts\":1760525951307,\"ts1\":1760525945725}",
            "sec-ch-ua": "\"Google Chrome\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        self.cookies = {
            "_lxsdk_cuid": "199e3245bf3c8-08ff2e3e316628-26061851-144000-199e3245bf3c8",
            "_lxsdk": "199e3245bf3c8-08ff2e3e316628-26061851-144000-199e3245bf3c8",
            "_lxsdk_s": "199e7860d3e-4aa-507-d14%7C%7C1"
        }
        self.url = "https://piaofang.maoyan.com/dashboard-ajax/movie"
        self.params = {
            "orderType": "0",
            "uuid": "199e3245bf3c8-08ff2e3e316628-26061851-144000-199e3245bf3c8",
            "timeStamp": "1760525950338",
            "User-Agent": "TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzE0MS4wLjAuMCBTYWZhcmkvNTM3LjM2",
            "index": "542",
            "channelId": "40009",
            "sVersion": "2",
            "signKey": "4f51da8f855fbc6fe4e018b467dbdb32",
            "WuKongReady": "h5"
        }

    def get_data(self):
        response = requests.get(self.url, headers=self.headers, cookies=self.cookies, params=self.params)
        fontStyle = response.json()['fontStyle']
        # print(fontStyle)
        font_url = 'https:' + re.findall(',url\(\\"(.*?woff)\\"\)', fontStyle)[0]
        open('猫眼字体.woff', 'wb').write(requests.get(font_url).content)
        zt = TTFont_parse('猫眼字体.woff')
        font_ky = zt.main()
        # print(font_ky)
        for i in response.json()['movieList']['list']:
            # print(i['boxSplitUnit']['num'].split('.'))
            boxSplitUnit = ''
            for x in i['boxSplitUnit']['num'].split(';')[0: -1]:
                da = x.upper().replace('&#X', 'uni')
                if '.' in da:
                    boxSplitUnit += "."
                    boxSplitUnit += str(font_ky[da.replace('.', '')])
                else:
                    boxSplitUnit += str(font_ky[da])
            boxSplitUnit += '万'
            boxRate = i['boxRate']
            splitBoxSplitUnit = ""
            for x in i['splitBoxSplitUnit']['num'].split(';')[0: -1]:
                da = x.upper().replace('&#X', 'uni')
                if '.' in da:
                    splitBoxSplitUnit += "."
                    splitBoxSplitUnit += str(font_ky[da.replace('.', '')])
                else:
                    splitBoxSplitUnit += str(font_ky[da])
            splitBoxSplitUnit += '万'
            print(boxSplitUnit, boxRate, splitBoxSplitUnit)

    def main(self):
        self.get_data()


if __name__ == '__main__':
    maoYan = MaoYan()
    maoYan.main()

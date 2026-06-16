import json
import time
import execjs
import requests


class SMDecrypt:
    def __init__(self):
        self.headers = {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            "origin": "https://dc.simuwang.com",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "referer": "https://dc.simuwang.com/",
            "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            # "x-requested-with": "M3FyNFo3NDVNakRLYkNXSXlQempUVGh1VzBXaC9YbjV4SUxoUWRuaE5UQXNXaTdKTEU5cDBWVWRvWDg4SDNIRg=="
        }
        self.url = "https://sppwapi.simuwang.com/sun/ranking/fundRankV3"
        self.cookies = {
            "_ga": "GA1.1.1328807225.1765785596",
            "_c_WBKFRo": "RzdUvapZzIPNWfVGeH3AGnpXEsX31GZ0PwXXv3Hu",
            "Hm_lvt_c3f6328a1a952e922e996c667234cdae": "1765982611",
            "_ga_ZCWR11HG01": "GS2.1.s1765982613$o1$g1$t1765982657$j16$l0$h0",
            "http_tK_cache": "6a9e44f4ffadb398cc5921f8648b6159c8f541bc",
            "rz_rem_u_p": "%2Fh4Tr3qn42g%3D%24eApsBvaKBoi%2FUPdNUayI4Q%3D%3D",
            "certification": "1",
            "qualified_investor": "1",
            "evaluation_result": "0",
            "focus-certification-pop": "-1",
            "_ga_7SBBX4Y5RE": "GS2.1.s1766058509$o5$g1$t1766059278$j53$l0$h0"
        }

    def get_data(self, page):
        params = {
            "page": page,
            "size": "50",
            "condition": "{\"fund_type\":\"6\"}",
            "sort_name": "ret_6m",
            "sort_asc": "desc",
            "tab_type": "1",
            "frequency": "week",
        }
        response = requests.get(self.url, headers=self.headers, params=params, cookies=self.cookies)
        data = response.json()['data']['data']
        encode = response.json()['data']['encode']
        id_ = response.json()['data']['id']
        key = response.json()['data']['key']
        # 通过替换文件中js_Code导入js代码获取相应的key值
        with open('数据解密.js', 'r') as f:
            run_code = f.read().replace('js_Code', key)
        res = execjs.compile(run_code).call('decrypt_data', data, encode, id_)
        return json.loads(res)

    def main(self):
        for page in range(1, 11):
            print(f'正在获取第{page}页数据...')
            time.sleep(2)
            print(self.get_data(page))


if __name__ == '__main__':
    sm = SMDecrypt()
    sm.main()

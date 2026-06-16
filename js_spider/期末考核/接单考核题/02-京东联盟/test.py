from curl_cffi import requests


class JdSpider:
    def __init__(self):
        self.headers = {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "origin": "https://union.jd.com",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "referer": "https://union.jd.com/",
            "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
            "x-referer-page": "https://union.jd.com/proManager/index",
            "x-rp-client": "h5_1.0.0"
        }
        self.url = "https://api.m.jd.com/api"
        self.cookies = {
            "qid_uid": "5acb7a0b-20a9-44de-9d9e-4f7e18dda935",
            "qid_fs": "1765953718936",
            "qid_ls": "1765953718936",
            "qid_ts": "1765953719007",
            "qid_vis": "1",
            "qid_evord": "47",
            "__jda": "209449046.17659537605721288442981.1765953761.1766403666.1766409864.3",
            "__jdv": "167603711|guanwang|-|-|notset|1765953760573",
            "__jdu": "17659537605721288442981",
            "shshshfpa": "2e909e2e-3c60-324b-4d87-c35372175750-1766403665",
            "shshshfpx": "2e909e2e-3c60-324b-4d87-c35372175750-1766403665",
            "3AB9D23F7A4B3CSS": "jdd03QA7ZODRTI6EKYEEXW3WPYRHKYMQPSSWKJHJQ3JC4ZSG36CZ46MH7J5LTLSKNIQB2AAKOYTC25S2S4IPG5K6JEGHRGAAAAAM3IY7E3QQAAAAADLD5UORP5EDV4EX",
            "shshshfpb": "BApXW-fg2Rf5AZjA-zifc__9OqiTJ0eaKBiQBMUpo9xJ1Mu4VVI-28XTv2XqsMNArdrcB5_fV0-7I06Y",
            "__jdc": "209449046",
            "__jdb": "209449046.12.17659537605721288442981|3.1766409864",
            "sdtoken": "AAbEsBpEIOVjqTAKCQtvQu17W1Sx32tXxIUxd02_YqYLBRRkG4MMPy9ncNtiVINgoRS9q0kjMx147yvvtGL6kfNqgS8mnK7r6t_4-YrECy3codVVdHS6UCLcw69fWhSSU5C45TSpPxXO8rI",
            "mba_muid": "17659537605721288442981",
            "mba_sid": "1766409944598172350307.2",
            "wlfstk_smdl": "p382hk59fz52u4gyvedqaf5z2ndu4ndu",
            "_gia_d": "1",
            "3AB9D23F7A4B3C9B": "QA7ZODRTI6EKYEEXW3WPYRHKYMQPSSWKJHJQ3JC4ZSG36CZ46MH7J5LTLSKNIQB2AAKOYTC25S2S4IPG5K6JEGHRGA"
        }

    def get_h5st_and_params(self, params):
        response = requests.post("localhost:5000/api/data", json={'params': params})
        return {
            "h5st": response.json()['result1']['h5st'],
            "params": response.json()['result2']
        }

    def get_data(self, params):
        item = self.get_h5st_and_params(params)
        params = {
            "functionId": "unionSearchRecommend",
            "appid": "unionpc",
            # "_": str(int(time.time() * 1000)),
            "_": item['params']['_'],
            "loginType": "3",
            "uuid": item['params']['uuid'],
            "x-api-eid-token": item['params']['x-api-eid-token'],
            "h5st": item['h5st'],
            "body": item['params']['body']
        }
        print(params)
        response = requests.get(self.url, headers=self.headers, params=params, cookies=self.cookies)
        print(response.text)
        print(response)

    def main(self):
        params = {
            "funName": "getSkuByMaterialId",
            "page": {
                "pageNo": 1,
                "pageSize": 60
            },
            "param": {
                "materialId": 315,
                "secKillTimePeriod": 0,
                "seckillTimeType": 0,
                "requestScene": 0,
                "requestExtFields": [
                    "shopInfo",
                    "orientations"
                ]
            }
        }
        self.get_data(params)


if __name__ == '__main__':
    jd = JdSpider()
    jd.main()

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
            "shshshfpa": "e4ddf256-0795-d9a5-c6d0-d40188a3b021-1766411095",
            "shshshfpx": "e4ddf256-0795-d9a5-c6d0-d40188a3b021-1766411095",
            "__jdv": "209449046|direct|-|none|-|1766411095283",
            "__jdu": "1766411095283129006865",
            "areaId": "19",
            "ipLoc-djd": "19-1672-0-0",
            "PCSYCityID": "CN_440000_441700_0",
            "mba_muid": "1766411095283129006865",
            "3AB9D23F7A4B3C9B": "67P6V6ERJ6TXLFOJ5DEMV4GCIM2HDNPIP2U3KXMX5ELXD6L3K5WAUT4CQM3PUUVXN4JI5CR5KQQY5VW7EOI37AW7DQ",
            "__jda": "209449046.1766411095283129006865.1766411095.1766483808.1766486248.8",
            "__jdc": "209449046",
            "3AB9D23F7A4B3CSS": "jdd0367P6V6ERJ6TXLFOJ5DEMV4GCIM2HDNPIP2U3KXMX5ELXD6L3K5WAUT4CQM3PUUVXN4JI5CR5KQQY5VW7EOI37AW7DQAAAAM3JLERCKIAAAAACUOWXCUVOBJOQUX",
            "shshshfpb": "BApXW44TBSf5AK1xG9dI3EXQZvXYzZQH7BiQAF7pp9xJ1MuVwVI-28XS9j3n-NYNycONZ5PffhMlw7Lo",
            "__jdb": "209449046.2.1766411095283129006865|8.1766486248",
            "sdtoken": "AAbEsBpEIOVjqTAKCQtvQu17eOWVSgto9C-OFX6e4Lt2sT8KqGx5eRoViTNefskh_ac9BqLRAYG5hRKH8Tt0B97Ocp4MkYkvgUEB9WVnXwsw2QhY5EOSrWOhIjNRv2aqZmVEFIS9Gkscww"
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

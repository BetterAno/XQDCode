# import requests
from curl_cffi import requests

headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "origin": "https://search.jd.com",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://search.jd.com/Search?keyword=%E5%8F%A3%E7%BA%A2&pvid=df9608079abb48f1bb66a8ae71b46727",
    "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "x-referer-page": "https://search.jd.com/Search",
    "x-rp-client": "h5_1.0.0"
}
cookies = {'自行填写小号的cookie信息'}
url = "https://api.m.jd.com/api"
params = {
    "appid": "search-pc-java",
    "t": [
        "1765368189095",
        "1765368189109"
    ],
    "client": "pc",
    "clientVersion": "1.0.0",
    "cthr": "1",
    "uuid": "17611118226861490021520",
    "loginType": "3",
    "functionId": "pctradesoa_mixer",
    "body": "\\{\"lim\":12,\"p\":202002,\"ec\":\"utf-8\",\"uuid\":\"17611118226861490021520\",\"lid\":\"1\",\"ck\":\"pinId,lighting,pin,ipLocation,atw,aview\",\"page\":\"1\",\"c1\":\"\",\"c2\":\"\",\"c3\":\"\",\"brand\":\"\"\\}",
    "x-api-eid-token": "jdd03OF3WSSN4W6QUV3OPJKPBYDBCUWCBIACGQPO6XGVODPM6JTW47CCLMLZ2M36OZXHJHF52HW2K6U5B5OEBFV5WYLSUJUAAAAM3BALBWBIAAAAADAI7AVZK7HI5PAX",
    "h5st": "20251210200313105;agwm69zz3jwh6jw3;f06cc;tk03w80251aa718nd80pV0B7psghrhH3XeiykYjNM61Q0VwV56Kp8vD0jZHLlI7DD4G8uYMJN3wJ-pc94StV6Uz49RbC;3277c7e3b98f5d6630e26ba56fa9292fc04ef593e9ca23137bdc596e9f60b507;5.2;1765368189105;fZRCXZvVq47U5E6Hu56DoJOGqELJ-h-T-h6I-hfZXxfTvh-T-prJ_YfZB5hW-V7J8MbUtV_JpNrJpdOT-YuUtd7V8UOIsVOIwNLI8QOI-h-T-h6Q1E7J8E6ZBh-f1ZPJvdLTqdOJ8M_UoV7UuBeTsRLI7AuV9QuV88_UoFeToZfZnZvFAI6GAU7ZBh-f1ZPV0ZfZnZfUsY7ZBh-f1ZfUzZ_WsJqK8wLH7kMU5YfZnZ-E-hfZXx-ZPcbGyg6V1YdVs9tP-h-T-trG9oLJvYfZB5hW-ZuVz8rM-h-T-JbF-hfZXxPCBh-f-x7Q-h-T-VOVsY7ZBhfZB5hWvh-T-dOVsY7ZBhfZB5hWtdeZnZfVwN6J-hfZBh-f1BOWB5_ZvdOE-YfZBhfZXx-ZwRdEpxbUv9NRyobERYfZnZPGyQ7GAY6ZBhfZB5hWxh-T-BOE-YfZBhfZXxfVB5_ZqN6J-hfZBh-f1V_VB5_ZrN6J-hfZBh-f1heZnZPUsY7ZBhfZB5hWxh-T-ROE-YfZBhfZXxvVsh-T-VOE-YfZBhfZXx-ZrpPVzh_ZB5_ZwN6J-hfZBh-f1heZnZvHqYfZBhfZXxPUB5_Zuw7ZBhfZB5hWxh-T-x7ZBhfZB5hWxh-T-RrE-hfZBh-fmg-T-R7G8QaD8YfZB5hWkgfZXZPJvFeIqF_U7YrV-YbUCQ7H-h-T-ZeF-hfZBh-fmg-T-haF-hfZXx-ZtJeDB1eUrpLHKgvTxpfVwhfMTgvFqkbIz8rM-h-T-dLEuYfZB5xD;7d3259e545dbee777448cba802542344a26ad81f63d5b7a12603ed0760f9b2c7;gRaW989Gy8bE_oLE7w-Gy8rFvM7MtoLI4wrJ1R6G88bG_wPD9k7J1RLHxgKJ"
}
response = requests.get(url, headers=headers, cookies=cookies, params=params, impersonate="chrome110")

print(response.text)
print(response)

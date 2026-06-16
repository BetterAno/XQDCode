import ddddocr
import requests
#
url = 'https://captcha.yunpian.com/v1/image/4a6e66dd37084a4ba1db18a4bb58cbcd.png'
res = requests.get(url)
open('full.png', 'wb').write(res.content)

url = 'https://captcha.yunpian.com/v1/image/5d24d27fc9554b71bf8b6cd2ad9708fb.jpg'
res = requests.get(url)
open('bg.png', 'wb').write(res.content)

# click_url = 'https://necaptcha.nosdn.127.net/e930a3fb50ed446d8055bb4c04d04e3c.jpg'
# open('click.png', 'wb').write(requests.get(click_url).content)

# 免费库识别
# import ddddocr
#
#
def text_dis():
    det = ddddocr.DdddOcr(det=True, ocr=True, show_ad=False)

    with open('易盾滑块/full.png', 'rb') as f:
        target_bytes = f.read()

    with open('易盾滑块/bg.png', 'rb') as f:
        background_bytes = f.read()

    res = det.slide_match(target_bytes, background_bytes)

    print(res['target'])

text_dis()

# import base64
# import requests
#
# with open('click.png', 'rb') as f:
#     b = base64.b64encode(f.read()).decode()  ## 图片二进制流base64字符串
#
#
# def verify():
#     url = "http://api.jfbym.com/api/YmServer/customApi"
#     data = {
#         'extra': '扩, 来, 验',
#         ## 关于参数,一般来说有3个;不同类型id可能有不同的参数个数和参数名,找客服获取
#         "token": "7YLLuj8QEblFNu01xSBs0x45q40aCLAVdq7Pt-sek-c",
#         "type": "300010",
#         "image": b,
#     }
#     _headers = {
#         "Content-Type": "application/json"
#     }
#     response = requests.request("POST", url, headers=_headers, json=data).json()
#     print(response)
#
#
# if __name__ == '__main__':
#     verify()

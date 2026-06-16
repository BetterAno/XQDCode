import gzip
import re

import execjs
import requests
from loguru import logger
from websocket import WebSocketApp

from douyin_pb2 import PushFrame, Response, ChatMessage

headers = {
    "Upgrade": "websocket",
    "Origin": "https://live.douyin.com",
    "Cache-Control": "no-cache",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Pragma": "no-cache",
    "Connection": "Upgrade",
    "Sec-WebSocket-Key": "YzocKCXJt7z2cTK+M5ls6A==",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "Sec-WebSocket-Version": "13",
    "Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits"
}
cookies = {
    "__ac_nonce": "068930a7900de9821ef49"
}


def on_message(ws, message):
    # print(f"{ws}收到消息: {message}")
    # 1. 转换PushFrame
    frame = PushFrame()
    frame.ParseFromString(message)
    # print(f"{ws}收到消息: {frame}")

    # 2. 基于PushFrame中的payload参数完成解压并反序列化
    source_bytes = gzip.decompress(frame.payload)
    response = Response()
    response.ParseFromString(source_bytes)
    # print(f"{ws}收到消息: {response}")

    # 3.在接收消息的过程中需要将原始数据返回给服务器确保长连接
    if response.need_ack:
        new_frame = PushFrame()
        new_frame.payload_type = 'ack'
        # frame.payload = response.internal_ext.encode('utf-8')  # 经过测试不向服务器推送此消息不影响弹幕接收
        new_frame.LogID = frame.LogID

        # 将数据序列化后发送给服务器
        ws.send(new_frame.SerializeToString())

    for item in response.messages:

        # 判断是否为弹幕信息, 如果不是则跳过此次循环
        if item.method != 'WebcastChatMessage':
            continue

        message = ChatMessage()
        message.ParseFromString(item.payload)
        info = f'[{message.user.nickName}]: {message.content}'
        logger.info(info)


def on_error(ws, error):
    print(f"{ws}发生错误: {error}")


def on_close(ws, close_status_code, close_msg):
    print(f"{ws}连接关闭: 状态码={close_status_code}, 原因={close_msg}")


def on_open(ws):
    print(f"{ws}连接已建立...")


def get_id_cookie(room_url):
    response = requests.get(room_url, headers=headers, cookies=cookies)
    room_id = re.findall(r'\\"roomId\\":\\"(\d+)\\"', response.text)[0]
    cookie = response.cookies.get_dict().get('ttwid')
    return room_id, cookie


def get_sign(r_id):
    sign = execjs.compile(open('获取抖音弹幕sign值.js',
                               encoding='utf-8').read()).call('get_sign', r_id)
    return sign


def main():
    url = 'https://live.douyin.com/168293131672'
    room_id, cookie = get_id_cookie(url)
    sign = execjs.compile(open('获取抖音弹幕sign值.js', encoding='utf-8').read()).call("get_sign", room_id)
    # WebSocket请求
    # 注意与js文件中的查询字符串保持一致
    wss_url = f'wss://webcast100-ws-web-hl.douyin.com/webcast/im/push/v2/?app_name=douyin_web&version_code=180800&webcast_sdk_version=1.0.15&update_version_code=1.0.15&compress=gzip&device_platform=web&cookie_enabled=true&screen_width=1536&screen_height=864&browser_language=zh-CN&browser_platform=Win32&browser_name=Mozilla&browser_version=5.0%20(Windows%20NT%2010.0;%20Win64;%20x64)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/142.0.0.0%20Safari/537.36&browser_online=true&tz_name=Asia/Shanghai&cursor=t-1764045251911_r-7576516657414155840_d-1_u-1_h-1&internal_ext=internal_src:dim|wss_push_room_id:7576503683232402218|wss_push_did:7576491808193889832|first_req_ms:1764044906049|fetch_time:1764045251911|seq:5|wss_info:0-1764045243919-1-0|wrds_v:7576516661709111630&host=https://live.douyin.com&aid=6383&live_id=1&did_rule=3&endpoint=live_pc&support_wrds=1&user_unique_id=7576491808193889832&im_path=/webcast/im/fetch/&identity=audience&need_persist_msg_count=15&insert_task_id=&live_reason=&room_id=7576503683232402218&heartbeatDuration=0&signature=fZ5hlFhR2dgaG7KY'
    ws = WebSocketApp(
        url=wss_url,
        header=headers,
        cookie=f'ttwid={cookie}',
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close,
    )

    ws.run_forever()


if __name__ == '__main__':
    main()

import gzip
import re

import execjs
import requests
from loguru import logger
from websocket import WebSocketApp

from douyin_pb2 import PushFrame, Response, ChatMessage

headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
}
cookies = {
    "__ac_nonce": "068930a7900de9821ef49"
}


def on_message(ws, message):
    # print(f"{ws}收到消息: {message}")
    """1.转换PushFrame"""
    frame = PushFrame()
    frame.ParseFromString(message)
    # print(f"{ws}收到消息: {frame}")

    """2.基于PushFrame中的payload参数完成解压并反序列化"""
    source_bytes = gzip.decompress(frame.payload)
    response = Response()
    response.ParseFromString(source_bytes)
    # print(f"{ws}收到消息: {response}")

    """3.在接收消息的过程中需要将原始数据返回给服务器确保长连接"""
    if response.need_ack:
        new_frame = PushFrame()
        new_frame.payload_type = 'ack'
        # frame.payload = response.internal_ext.encode('utf-8')  # 经过测试不向服务器推送此消息不影响弹幕接收
        new_frame.LogID = frame.LogID

        # 将数据序列化后发送给服务器
        ws.send(new_frame.SerializeToString())

    """
    4.在response反序列化之后发现数据包存在不同的类型(WebcastMemberMessage、WebcastChatMessage、WebcastLikeMessage)
        如果需要指定的信息则需要使用method字段判断消息类型, 比如弹幕: WebcastChatMessage
    """
    for item in response.messages:

        # 判断是否为弹幕信息, 如果不是则跳过此次循环
        if item.method != 'WebcastChatMessage':
            continue

        message = ChatMessage()
        message.ParseFromString(item.payload)
        info = f'[{message.user.nickname}]: {message.content}'
        logger.info(info)
        # logger.info(f'发送的弹幕: {message.content}')
        # logger.info(f'用户UID: {getattr(message.user.id, "id", "未知")}')
        # logger.info(f'短ID: {getattr(message.user.short_id, "short_id", "无")}')
        # logger.info(f'昵称: {getattr(message.user.nickname, "nickname", "未知用户")}')
        # logger.info(
        #     f'性别: {getattr(message.user.gender, "gender", 0)} → {"男" if getattr(message.user.gender, "gender", 0) == 1 else "女" if getattr(message.user.gender, "gender", 0) == 2 else "未知"}')
        # logger.info(f'个性签名: {getattr(message.user.signature, "signature", "无签名")}')
        # logger.info(f'用户等级: LV{getattr(message.user.level, "level", 0)}')
        # logger.info(f'生日时间戳: {getattr(message.user.birthday, "birthday", "未设置")}')
        # logger.info(f'手机号: {getattr(message.user.telephone, "telephone", "未绑定")}')
        # logger.info(f'城市: {getattr(message.user.city, "city", "未知")}')
        # logger.info(f'账号状态: {getattr(message.user.status, "status", 0)}')
        # logger.info(f'注册时间: {getattr(message.user.create_time, "create_time", "未知")}')
        # logger.info(f'资料修改时间: {getattr(message.user.modify_time, "modify_time", "未知")}')
        # logger.info(f'是否隐藏搜索: {"是" if getattr(message.user.secret, "secret", 0) == 1 else "否"}')
        # logger.info(f'二维码URI: {getattr(message.user.share_qrcode_uri, "share_qrcode_uri", "无")}')
        # logger.info(f'抖音号: {getattr(message.user.display_id, "display_id", "无抖音号")}')
        # logger.info(f'允许被定位: {"是" if getattr(message.user.allow_be_located, "allow_be_located", False) else "否"}')
        # logger.info(f'允许通讯录找到: {"是" if getattr(message.user.allow_find_by_contacts, "allow_find_by_contacts", False) else "否"}')
        # logger.info(f'我是否关注TA: {"是" if getattr(message.user.is_following, "is_following", False) else "否"}')
        # logger.info(f'TA是否关注我: {"是" if getattr(message.user.is_follower, "is_follower", False) else "否"}')
        # logger.info(f'是否绑定手机号认证: {"是" if getattr(message.user.verified_mobile, "verified_mobile", False) else "否"}')


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


def main():
    url = 'https://live.douyin.com/73854204168'
    room_id, cookie = get_id_cookie(url)
    # sign = execjs.compile(open('测试环境demo.js', encoding='utf-8').read()).call("get_sign", room_id)
    print(room_id)

    # WebSocket请求
    # 注意与js文件中的查询字符串保持一致
    wss_url = f'wss://webcast100-ws-web-hl.douyin.com/webcast/im/push/v2/?app_name=douyin_web&version_code=180800&webcast_sdk_version=1.0.15&update_version_code=1.0.15&compress=gzip&device_platform=web&cookie_enabled=true&screen_width=1536&screen_height=864&browser_language=zh-CN&browser_platform=Win32&browser_name=Mozilla&browser_version=5.0%20(Windows%20NT%2010.0;%20Win64;%20x64)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/142.0.0.0%20Safari/537.36&browser_online=true&tz_name=Asia/Shanghai&cursor=t-1764065825015_r-7576605022071296980_d-1_u-1_h-7576601543237062170&internal_ext=internal_src:dim|wss_push_room_id:7576589904080128819|wss_push_did:7576491808193889832|first_req_ms:1764065824937|fetch_time:1764065825015|seq:1|wss_info:0-1764065825015-0-0|wrds_v:7576605004891432180&host=https://live.douyin.com&aid=6383&live_id=1&did_rule=3&endpoint=live_pc&support_wrds=1&user_unique_id=7576491808193889832&im_path=/webcast/im/fetch/&identity=audience&need_persist_msg_count=15&insert_task_id=&live_reason=&room_id={room_id}&heartbeatDuration=0&signature=6DEOedvXKVZEB1XU'
    ws = WebSocketApp(
        url=wss_url,
        header=headers,
        cookie=f'ttwid={cookie}',
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close
    )

    ws.run_forever()


if __name__ == '__main__':
    main()

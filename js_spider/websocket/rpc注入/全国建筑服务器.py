import asyncio
import json

import requests
import websockets


def get_data(page):
    headers = {
        "v": "231012",
        "Referer": "https://jzsc.mohurd.gov.cn/data/company",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
    }
    url = 'https://jzsc.mohurd.gov.cn/APi/webApi/dataservice/query/comp/list'
    params = {
        "pg": page,
        "pgsz": "15",
        "total": "450"
    }
    response = requests.get(url, headers=headers, params=params)
    return response.text


async def echo(websocket):
    for i in range(1, 4):
        data = get_data(i)

        await websocket.send(data)
        # return True


async def recv_msg(websocket):
    while 1:
        # 接收数据
        recv_text = await websocket.recv()
        print(json.loads(recv_text))


async def main_logic(websocket, path):
    await echo(websocket)
    await recv_msg(websocket)


if __name__ == '__main__':
    start_server = websockets.serve(main_logic, '127.0.0.1', 8080)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(start_server)
    loop.run_forever()

!(function () {
    if (window.flag) {
    } else {
        const websocket = new WebSocket('ws://127.0.0.1:8080')
        // 创建一个标记用来判断是否创建套接字
        window.flag = true;

        // 接收服务端发送的数据
        websocket.onmessage = function (event) {
            var data = event.data

            // 调用js解密
            var result = b(data)
            console.log(result)

            // 发送解密数据给服务器
            websocket.send(result)
        }
    }
}())
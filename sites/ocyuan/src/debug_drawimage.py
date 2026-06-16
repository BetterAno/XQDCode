"""调试脚本：通过hook canvas.drawImage捕获图片URL"""
import json, urllib.request, websocket, threading, queue, time

port = 9222
pages = json.loads(urllib.request.urlopen(f'http://127.0.0.1:{port}/json').read())
target = next((p for p in pages if 'hotel.ocyuan.com' in p.get('url', '')), pages[0])
ws = websocket.WebSocket()
ws.connect(target['webSocketDebuggerUrl'], suppress_origin=True)

pending = {}
msg_id = [0]
ws_lock = threading.Lock()

def recv_loop():
    ws.settimeout(1.0)
    while True:
        try:
            raw = ws.recv()
            msg = json.loads(raw)
            if 'id' in msg and msg['id'] in pending:
                pending[msg['id']].put(msg)
        except: pass

threading.Thread(target=recv_loop, daemon=True).start()

def send_cmd(method, params=None):
    if params is None: params = {}
    with ws_lock:
        msg_id[0] += 1
        mid = msg_id[0]
        q = queue.Queue()
        pending[mid] = q
        ws.send(json.dumps({'id': mid, 'method': method, 'params': params}))
    result = q.get(timeout=10)
    if mid in pending: del pending[mid]
    return result

def js(expr):
    r = send_cmd('Runtime.evaluate', {'expression': expr, 'returnByValue': True, 'awaitPromise': False})
    return r.get('result', {}).get('result', {}).get('value')

# 安装canvas.drawImage hook
print("[1] 安装drawImage hook...")
hook_result = js("""(function() {
    if (window.__drawImageHooked) return 'already';
    window.__drawImageHooked = true;
    window.__capturedImgSrcs = [];
    
    // hook CanvasRenderingContext2D.drawImage
    var _origDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function() {
        // arguments[0] 是图片源（HTMLImageElement, HTMLCanvasElement, etc.）
        var img = arguments[0];
        if (img && img.src && typeof img.src === 'string' && img.src.includes('yrule')) {
            window.__capturedImgSrcs.push(img.src);
        }
        if (img && img.__src) {  // 捕获我们手动标记的src
            window.__capturedImgSrcs.push(img.__src);
        }
        return _origDrawImage.apply(this, arguments);
    };
    
    // hook Image构造函数，记录所有Image对象的src
    var _origImgSet = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set;
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
        set: function(v) {
            this.__src = v;  // 保存src到实例属性
            if (typeof v === 'string' && v.includes('yrule')) {
                window.__capturedImgSrcs.push(v);
            }
            return _origImgSet.call(this, v);
        },
        get: function() {
            return _origImgSet ? this.__src : '';
        }
    });
    
    return 'hooked';
})()""")
print(f"  drawImage hook: {hook_result}")

# 点击刷新验证码
print("[2] 刷新验证码...")
r1 = js("""(function() {
    var refresh = document.querySelector('[class*="refresh_btn"]');
    if (refresh) { refresh.click(); return 'refresh'; }
    return 'none';
})()""")
print(f"  操作: {r1}")

# 等待验证码加载
print("[3] 等待验证码加载...")
time.sleep(3)

# 检查捕获到的图片URL
captured = js("window.__capturedImgSrcs")
print(f"  捕获到的图片URL: {captured}")

# 也检查canvas图片数据
canvas_info = js("""(function() {
    var canvases = Array.from(document.querySelectorAll('canvas'));
    var result = [];
    canvases.forEach(function(c) {
        var ctx = c.getContext('2d');
        var data = ctx.getImageData(0, 0, Math.min(c.width, 10), Math.min(c.height, 10));
        result.push({w: c.width, h: c.height, firstPx: Array.from(data.data.slice(0, 12))});
    });
    return result;
})()""")
print(f"  Canvas状态: {canvas_info}")

ws.close()

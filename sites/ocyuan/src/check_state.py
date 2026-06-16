"""简单检查当前浏览器状态"""
import json, urllib.request, websocket, threading, queue, time

port = 9222
pages = json.loads(urllib.request.urlopen(f'http://127.0.0.1:{port}/json').read())
target = next((p for p in pages if 'hotel.ocyuan.com' in p.get('url', '')), pages[0])
print(f"URL: {target['url']}")
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

# 启用网络监控
send_cmd('Network.enable')

# 检查devicePixelRatio和视口大小
dpr = js('window.devicePixelRatio')
viewport = js('{w: window.innerWidth, h: window.innerHeight}')
print(f'DPR: {dpr}, Viewport: {viewport}')

# 检查canvas
result = js("""(function() {
    var canvases = Array.from(document.querySelectorAll('canvas'));
    return {canvasCount: canvases.length, sizes: canvases.map(c => c.width + 'x' + c.height)};
})()""")
print(f"Canvas: {result}")

if result.get('canvasCount', 0) == 0:
    print("没有canvas，点击登录...")
    r = js("""(function() {
        var btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('\\u767b'));
        if (btn) { btn.click(); return 'clicked'; }
        return 'none';
    })()""")
    print(f"  点击结果: {r}")
    time.sleep(5)
    
    result2 = js("""(function() {
        var canvases = Array.from(document.querySelectorAll('canvas'));
        return {canvasCount: canvases.length, sizes: canvases.map(c => c.width + 'x' + c.height)};
    })()""")
    print(f"Canvas after login: {result2}")

# 检查当前验证码状态（canvas存在时）
final = js("""(function() {
    var canvases = Array.from(document.querySelectorAll('canvas'));
    if (canvases.length === 0) return {noCanvas: true};
    var bgC = canvases.find(c => c.width === 260);
    var slC = canvases.find(c => c.width === 58);
    return {
        hasBg: !!bgC, hasSlice: !!slC,
        slider: document.querySelector('[class*="slider_block"]') ? 'found' : 'none'
    };
})()""")
print(f"Final: {final}")

ws.close()

"""调试脚本：检查当前验证码的canvas和DOM状态"""
import json, urllib.request, websocket, threading, queue, time

port = 9222
pages = json.loads(urllib.request.urlopen(f'http://127.0.0.1:{port}/json').read())
target = next((p for p in pages if 'hotel.ocyuan.com' in p.get('url', '')), pages[0])
ws = websocket.WebSocket()
ws.connect(target['webSocketDebuggerUrl'], suppress_origin=True)

pending = {}
events_q = queue.Queue()
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
            elif 'method' in msg:
                events_q.put(msg)
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

# 检查canvas和DOM
result = js("""(function() {
    var canvases = Array.from(document.querySelectorAll('canvas'));
    var result = {canvasCount: canvases.length, canvasSizes: []};
    canvases.forEach(function(c) { result.canvasSizes.push(c.width + 'x' + c.height); });
    var imgs = Array.from(document.querySelectorAll('img'));
    result.imgCount = imgs.length;
    result.imgSrcs = imgs.filter(i => i.src).map(i => i.src.substring(0, 120));
    return result;
})()""")
print('Canvas & IMG info:', json.dumps(result, indent=2, ensure_ascii=False))

# 检查yruleImgs
yruleImgs = js("window.__yruleImgs")
print('yruleImgs:', yruleImgs)

# 检查SDK全局变量
sdk_vars = js("""(function() {
    var keys = Object.keys(window);
    var found = [];
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (k.startsWith('__')) continue;
        try {
            var v = window[k];
            if (v && typeof v === 'object' && (v.bgUrl || v.fullUrl || v.sliceUrl)) {
                found.push({key: k, bgUrl: v.bgUrl, fullUrl: v.fullUrl});
            }
        } catch(e) {}
    }
    return found;
})()""")
print('SDK全局变量:', json.dumps(sdk_vars, indent=2, ensure_ascii=False))

# 尝试从canvas toDataURL判断图片格式
bg_data_prefix = js("""(function() {
    var canvases = Array.from(document.querySelectorAll('canvas'));
    var bgC = canvases.find(function(c){return c.width===260;});
    if (!bgC) return null;
    return bgC.toDataURL('image/png').substring(0, 60);
})()""")
print('bg canvas dataURL prefix:', bg_data_prefix)

ws.close()

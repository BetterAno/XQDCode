"""检查滑块元素和事件监听"""
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

# 检查滑块和容器
result = js("""(function() {
    var result = {};
    
    // 滑块
    var slider = document.querySelector('[class*="slider_block"]');
    if (slider) {
        var sr = slider.getBoundingClientRect();
        result.slider = {
            rect: {x: Math.round(sr.x), y: Math.round(sr.y), w: Math.round(sr.width), h: Math.round(sr.height)},
            left: slider.style.left,
            className: slider.className.substring(0, 60),
            parentClass: slider.parentElement ? slider.parentElement.className.substring(0, 60) : 'none'
        };
    }
    
    // 滑轨
    var track = document.querySelector('[class*="slider_track"]') || document.querySelector('[class*="track"]');
    if (track) {
        var tr = track.getBoundingClientRect();
        result.track = {
            rect: {x: Math.round(tr.x), y: Math.round(tr.y), w: Math.round(tr.width), h: Math.round(tr.height)},
            className: track.className.substring(0, 60)
        };
    }
    
    // yrule容器
    var containers = [];
    var yruleEls = document.querySelectorAll('[class*="yrule"]');
    yruleEls.forEach(function(el) {
        var r = el.getBoundingClientRect();
        containers.push({
            tag: el.tagName,
            class: el.className.substring(0, 60),
            rect: {x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height)}
        });
    });
    result.yruleContainers = containers;
    
    // Canvas
    var canvases = Array.from(document.querySelectorAll('canvas'));
    result.canvasRects = canvases.map(function(c) {
        var r = c.getBoundingClientRect();
        return {w: c.width, h: c.height, x: Math.round(r.x), y: Math.round(r.y)};
    });
    
    return result;
})()""")
print(json.dumps(result, indent=2, ensure_ascii=False))

ws.close()

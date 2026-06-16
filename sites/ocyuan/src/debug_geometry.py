"""调试：检查验证码canvas的几何关系"""
import json, urllib.request, websocket, threading, queue

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

# 先重新启用CDP监控
send_cmd('Network.enable')
print('Network enabled')

# 先点击登录按钮触发验证码
login_result = js("""(function() {
    var loginBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('\u767b'));
    if (loginBtn) { loginBtn.click(); return 'login'; }
    var refresh = document.querySelector('[class*="refresh_btn"]');
    if (refresh) { refresh.click(); return 'refresh'; }
    return 'none';
})()""")
# 先检查页面URL和基本DOM
page_url = js('window.location.href')
page_title = js('document.title')
print(f'URL: {page_url}')
print(f'Title: {page_title}')

# 检查是否有验证码相关的DOM
captcha_check = js("""(function() {
    var yruleEl = document.querySelector('[class*="yrule"]');
    var captchaEl = document.querySelector('[class*="captcha"]');
    var canvasEls = document.querySelectorAll('canvas');
    return {yrule: !!yruleEl, captcha: !!captchaEl, canvasCount: canvasEls.length, bodyLen: document.body.innerHTML.length};
})()""")
print(f'Captcha check: {captcha_check}')
import time
time.sleep(8)

# 再检查一次
captcha_check2 = js("""(function() {
    var canvasEls = document.querySelectorAll('canvas');
    var yruleEl = document.querySelector('[class*="yrule"]');
    return {canvasCount: canvasEls.length, yrule: !!yruleEl};
})()""")
print(f'After wait: {captcha_check2}')

# 检查验证码DOM结构
result = js("""(function() {
    var result = {};
    
    // 检查canvas
    var canvases = Array.from(document.querySelectorAll('canvas'));
    result.canvasCount = canvases.length;
    result.canvasInfo = canvases.map(function(c) {
        var r = c.getBoundingClientRect();
        return {w: c.width, h: c.height, x: Math.round(r.x), y: Math.round(r.y), 
                left: Math.round(r.left), className: c.className.substring(0, 50)};
    });
    
    // 检查slider
    var slider = document.querySelector('[class*="slider_block"]');
    if (slider) {
        var sr = slider.getBoundingClientRect();
        result.slider = {x: Math.round(sr.x), y: Math.round(sr.y), w: Math.round(sr.width), h: Math.round(sr.height), left: slider.style.left};
    }
    
    // 检查yrule容器
    var container = document.querySelector('[class*="yrule"]') || document.querySelector('[class*="captcha"]');
    if (container) {
        var cr = container.getBoundingClientRect();
        result.container = {x: Math.round(cr.x), y: Math.round(cr.y), w: Math.round(cr.width), h: Math.round(cr.height), className: container.className.substring(0, 80)};
    }
    
    // 检查所有带background的元素的style
    var bgElements = [];
    var allElements = document.querySelectorAll('*');
    for (var i = 0; i < Math.min(allElements.length, 200); i++) {
        var el = allElements[i];
        var bg = window.getComputedStyle(el).backgroundImage;
        if (bg && bg !== 'none' && bg.includes('yrule')) {
            bgElements.push({tag: el.tagName, class: el.className.substring(0, 40), bg: bg.substring(0, 120)});
        }
    }
    result.bgElements = bgElements;
    
    return result;
})()""")
print(json.dumps(result, indent=2, ensure_ascii=False))

ws.close()

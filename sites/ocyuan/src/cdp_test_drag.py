"""
测试CDP真实鼠标事件是否能驱动SDK滑块
"""
import json
import time
import random
import urllib.request
import websocket

port = 9222
pages = json.loads(urllib.request.urlopen(f'http://127.0.0.1:{port}/json').read())
target = next((p for p in pages if 'hotel.ocyuan.com' in p.get('url', '')), pages[0])
print(f"[+] 目标页面: {target['url']}")

ws = websocket.WebSocket()
ws.connect(target['webSocketDebuggerUrl'], suppress_origin=True)
print("[+] CDP 连接成功")
mid = [0]


def send(m, p=None):
    if p is None:
        p = {}
    mid[0] += 1
    ws.send(json.dumps({'id': mid[0], 'method': m, 'params': p}))
    while True:
        r = json.loads(ws.recv())
        if r.get('id') == mid[0]:
            return r


def ev(t, x, y, btn='none', btns=0, cc=0):
    send('Input.dispatchMouseEvent', {
        'type': t, 'x': x, 'y': y,
        'button': btn, 'buttons': btns,
        'clickCount': cc,
        'pointerType': 'mouse',
        'timestamp': time.time() * 1000
    })


def js(expr):
    r = send('Runtime.evaluate', {
        'expression': expr,
        'returnByValue': True,
        'awaitPromise': False
    })
    return r.get('result', {}).get('result', {}).get('value')


# 安装监控和Hook
monitor_js = """
(function() {
    window.__sliderLog = [];
    window.__collectCaptured = [];
    
    // 监控滑块 style 变化
    var sl = document.querySelector('[class*="slider_block"]');
    if (sl) {
        var ob = new MutationObserver(function(muts) {
            muts.forEach(function(m) {
                window.__sliderLog.push({
                    type: m.type,
                    attr: m.attributeName,
                    val: sl.style.left || sl.getAttribute('style')
                });
            });
        });
        ob.observe(sl, {attributes: true});
        window.__sliderObserved = true;
    }
    
    // Hook fetch
    var origFetch = window.fetch;
    window.fetch = async function() {
        var url = typeof arguments[0] === 'string' ? arguments[0] : '';
        if (url.includes('collect') || url.includes('checkAnswer')) {
            var body = arguments[1] && arguments[1].body;
            window.__collectCaptured.push({url: url, body: body, ts: Date.now()});
            console.log('[HOOK] Fetch:', url);
        }
        return origFetch.apply(this, arguments);
    };
    
    return {sliderFound: !!sl, sliderObserved: window.__sliderObserved};
})()
"""

result = js(monitor_js)
print(f"[+] 监控安装: {result}")

# 获取滑块位置
slider_info = js("""
(function() {
    var el = document.querySelector('[class*="slider_block"]');
    if (!el) return null;
    var r = el.getBoundingClientRect();
    return {x: r.x, y: r.y, w: r.width, h: r.height, cx: r.x + r.width/2, cy: r.y + r.height/2};
})()
""")

if not slider_info:
    print("[-] 未找到滑块！请确保验证码已显示")
    ws.close()
    exit(1)

slider_info = json.loads(slider_info) if isinstance(slider_info, str) else slider_info
print(f"[+] 滑块: {slider_info}")

sx = slider_info['cx']
sy = slider_info['cy']
# 目标拖拽距离 - 缺口位置大约在120px处（相对滑块起始）
# 注意：滑块从最左侧开始，验证码宽度260px
target_dist = 120  # 先尝试120px看效果

print(f"\n[*] 开始拖拽: ({sx:.0f}, {sy:.0f}) -> ({sx+target_dist:.0f}, {sy:.0f})")

# Step 1: 移动到滑块位置
ev('mouseMoved', sx, sy, btn='none', btns=0)
time.sleep(0.08)

# Step 2: mousedown
ev('mousePressed', sx, sy, btn='left', btns=1, cc=1)
print("[+] mousedown sent")
time.sleep(0.12)

# 检查mousedown后状态
state_after_down = js("""
JSON.stringify({
    sliderLeft: (document.querySelector('[class*="slider_block"]') || {style: {left: 'N/A'}}).style.left,
    log: window.__sliderLog
})
""")
print(f"[+] mousedown后状态: {state_after_down}")

# Step 3: mousemove - 发送一系列鼠标移动事件
print("[*] 发送 mousemove 序列...")
steps = 60
for i in range(1, steps + 1):
    t = i / steps
    # ease-out 曲线
    progress = 1 - (1 - t) ** 2
    x = sx + target_dist * progress
    y = sy + random.uniform(-1.5, 1.5)
    ev('mouseMoved', x, y, btn='left', btns=1)
    time.sleep(0.018)

# 检查中间状态
state_mid = js("""
JSON.stringify({
    sliderLeft: (document.querySelector('[class*="slider_block"]') || {style: {left: 'N/A'}}).style.left,
    logLen: window.__sliderLog ? window.__sliderLog.length : 0,
    lastLog: window.__sliderLog && window.__sliderLog.length > 0 ? window.__sliderLog[window.__sliderLog.length-1] : null
})
""")
print(f"[+] mousemove后状态: {state_mid}")

# Step 4: mouseup
time.sleep(0.05)
ev('mouseReleased', sx + target_dist, sy, btn='left', btns=0, cc=1)
print("[+] mouseup sent")

# 等待SDK处理
time.sleep(2.0)

# 检查最终状态
final = js("""
JSON.stringify({
    sliderLeft: (document.querySelector('[class*="slider_block"]') || {style: {left: 'N/A'}}).style.left,
    sliderLog: window.__sliderLog,
    collectCaptured: window.__collectCaptured,
    collectCount: window.__collectCaptured ? window.__collectCaptured.length : 0
})
""")
print(f"\n[+] 最终状态: {final}")

# 如果捕获到collectData，打印详情
if final:
    import json as j
    try:
        f = j.loads(final)
        if f.get('collectCount', 0) > 0:
            print(f"\n[!!!] 成功捕获 {f['collectCount']} 个collectData请求!")
            for item in f.get('collectCaptured', []):
                print(f"  URL: {item.get('url')}")
                body = item.get('body', '')
                if body:
                    print(f"  Body: {str(body)[:500]}")
        else:
            print("\n[-] 未捕获到collectData")
            print(f"  滑块日志条数: {len(f.get('sliderLog', []))}")
            if f.get('sliderLog'):
                print(f"  滑块日志: {f['sliderLog'][:5]}")
    except:
        pass

ws.close()
print("\n[+] 完成")

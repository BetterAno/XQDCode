"""
用CDP网络监控捕获getQuestion响应，然后精准拖拽
"""
import json
import time
import random
import urllib.request
import websocket
import threading
import io

try:
    from PIL import Image
    import numpy as np
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

port = 9222
pages = json.loads(urllib.request.urlopen(f'http://127.0.0.1:{port}/json').read())
target = next((p for p in pages if 'hotel.ocyuan.com' in p.get('url', '')), pages[0])
print(f"[+] 目标: {target['url']}")

ws = websocket.WebSocket()
ws.connect(target['webSocketDebuggerUrl'], suppress_origin=True)
print("[+] CDP连接成功")

mid = [0]
network_events = []
lock = threading.Lock()


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


def listen_loop(ws_obj, events_list, stop_ev):
    """后台监听CDP事件"""
    ws_obj.settimeout(1.0)
    while not stop_ev.is_set():
        try:
            msg_str = ws_obj.recv()
            msg = json.loads(msg_str)
            method = msg.get('method', '')
            if 'Network' in method:
                params = msg.get('params', {})
                url = (params.get('response', {}).get('url', '') or
                       params.get('request', {}).get('url', ''))
                if ('getQuestion' in url or 'collectData' in url or
                        'checkAnswer' in url):
                    req_id = params.get('requestId', '')
                    with lock:
                        events_list.append({
                            'method': method,
                            'reqId': req_id,
                            'url': url,
                            'params': params
                        })
                    print(f"  [NET] {method}: {url[:80]}")
        except:
            pass


def detect_gap(bg_url, slice_url):
    """模板匹配检测缺口"""
    if not HAS_PIL:
        return None
    try:
        bg_data = urllib.request.urlopen(bg_url, timeout=10).read()
        sl_data = urllib.request.urlopen(slice_url, timeout=10).read()
        bg = np.array(Image.open(io.BytesIO(bg_data)).convert('RGB'))
        sl = np.array(Image.open(io.BytesIO(sl_data)).convert('RGBA'))
        
        alpha = sl[:, :, 3]
        rows = np.any(alpha > 100, axis=1)
        cols = np.any(alpha > 100, axis=0)
        rmin, rmax = np.where(rows)[0][[0, -1]]
        cmin, cmax = np.where(cols)[0][[0, -1]]
        sl_rgb = sl[rmin:rmax+1, cmin:cmax+1, :3]
        sl_a = alpha[rmin:rmax+1, cmin:cmax+1]
        
        h, w = sl_rgb.shape[:2]
        bg_h, bg_w = bg.shape[:2]
        
        best_x, best_score = 0, float('inf')
        mask = sl_a > 100
        
        for x in range(0, bg_w - w + 1):
            region = bg[rmin:rmin+h, x:x+w, :]
            if region.shape != sl_rgb.shape:
                continue
            diff = np.abs(region[mask].astype(float) - sl_rgb[mask].astype(float))
            score = diff.mean()
            if score < best_score:
                best_score = score
                best_x = x
        
        result = best_x + cmin
        print(f"  [GAP] 模板匹配: x={result}, score={best_score:.1f}")
        return result
    except Exception as e:
        print(f"  [GAP] 匹配失败: {e}")
        return None


# ================
# 启用网络监控
# ================
send('Network.enable')
print("[+] 网络监控已启用")

stop_ev = threading.Event()
listener = threading.Thread(target=listen_loop, args=(ws, network_events, stop_ev), daemon=True)
listener.start()

# ================
# 刷新验证码
# ================
print("\n[1] 刷新验证码...")
js("""
(function() {
    var r = document.querySelector('[class*="refresh_btn"]');
    if (r) { r.click(); return 'refreshed'; }
    // 如果验证码没显示，点登录按钮
    var btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('登'));
    if (btn) { btn.click(); return 'login clicked'; }
    return 'nothing clicked';
})()
""")

print("[*] 等待getQuestion响应...")
time.sleep(3)

# ================
# 获取getQuestion数据
# ================
gq_events = [e for e in network_events if 'getQuestion' in e['url'] and 'ResponseReceived' in e['method']]
print(f"[2] 捕获到 {len(gq_events)} 个getQuestion响应")

gq_result = None
for gq_ev in gq_events[-1:]:  # 取最新
    try:
        body_resp = send('Network.getResponseBody', {'requestId': gq_ev['reqId']})
        body = body_resp.get('result', {}).get('body', '')
        if body:
            data = json.loads(body)
            if data.get('success') and data.get('result'):
                gq_result = data['result']
                print(f"  xposition: {gq_result.get('xposition')}")
                print(f"  yposition: {gq_result.get('yposition')}")
                print(f"  challenge: {gq_result.get('challenge', '')[:30]}")
    except Exception as e:
        print(f"  获取响应体失败: {e}")

# 如果还没有，尝试等待验证码并点登录
if not gq_result:
    print("  未找到getQuestion数据，等待验证码加载...")
    time.sleep(1)
    # 检查是否有验证码
    has_captcha = js("!!document.querySelector('[class*=\"slider_block\"]')")
    if not has_captcha:
        # 点登录按钮
        print("  点击登录按钮...")
        btn_info = js("""
        (function() {
            var btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('登'));
            if (!btn) return null;
            var r = btn.getBoundingClientRect();
            return {x: r.x + r.width/2, y: r.y + r.height/2};
        })()
        """)
        if btn_info:
            ev('mousePressed', btn_info['x'], btn_info['y'], btn='left', btns=1, cc=1)
            time.sleep(0.05)
            ev('mouseReleased', btn_info['x'], btn_info['y'], btn='left', btns=0, cc=1)
        time.sleep(3)
        
        # 重新检查
        gq_events = [e for e in network_events if 'getQuestion' in e['url'] and 'ResponseReceived' in e['method']]
        for gq_ev in gq_events[-1:]:
            try:
                body_resp = send('Network.getResponseBody', {'requestId': gq_ev['reqId']})
                body = body_resp.get('result', {}).get('body', '')
                if body:
                    data = json.loads(body)
                    if data.get('success') and data.get('result'):
                        gq_result = data['result']
                        print(f"  [+] xposition: {gq_result.get('xposition')}")
            except:
                pass

# ================
# 计算缺口位置
# ================
print("\n[3] 计算缺口位置...")
gap_x = None

if gq_result:
    static_server = gq_result.get('staticServer', 'https://static1.tuyacn.com/static/th-lib/')
    bg_url = f"{static_server}{gq_result.get('bgUrl', '')}"
    slice_url = f"{static_server}{gq_result.get('sliceUrl', '')}"
    xposition = gq_result.get('xposition', 0)
    yposition = gq_result.get('yposition', 0)
    
    print(f"  背景图: {bg_url}")
    print(f"  滑块图: {slice_url}")
    
    gap_x = detect_gap(bg_url, slice_url)
    
    if gap_x is None:
        # xposition简单解码尝试
        print("  使用xposition备用估算...")
        # 实验数据: xpos=8717->gap=50, xpos=62733->gap=46
        # 尝试 xposition % (range) 方法
        possible_x = xposition % 210  # 验证码宽260，有效range约50-210
        if possible_x < 20:
            possible_x += 20
        gap_x = possible_x
        print(f"  xposition备用估算: {gap_x}px")
else:
    print("  无getQuestion数据，使用默认值90px")
    gap_x = 90

print(f"[+] 缺口位置: gap_x={gap_x}px")

# ================
# 精准拖拽
# ================
print("\n[4] 精准拖拽...")
slider_info = js("""
(function() {
    var el = document.querySelector('[class*="slider_block"]');
    if (!el) return null;
    var r = el.getBoundingClientRect();
    return {x: r.x, y: r.y, w: r.width, h: r.height};
})()
""")

if not slider_info:
    print("[-] 未找到滑块！验证码可能未显示")
    stop_ev.set()
    ws.close()
    exit(1)

sx = slider_info['x'] + slider_info['w'] / 2
sy = slider_info['y'] + slider_info['h'] / 2
target_drag = gap_x

print(f"  滑块: ({sx:.0f}, {sy:.0f})")
print(f"  拖拽 {target_drag}px")

# 清理旧的collectData事件
with lock:
    network_events.clear()

# 执行拖拽
ev('mouseMoved', sx, sy)
time.sleep(0.1)
ev('mousePressed', sx, sy, btn='left', btns=1, cc=1)
time.sleep(0.13)

steps = 55
for i in range(1, steps + 1):
    t = i / steps
    progress = 1 - (1 - t) ** 2
    x = sx + target_drag * progress
    y = sy + random.uniform(-1.5, 1.5)
    ev('mouseMoved', x, y, btn='left', btns=1)
    time.sleep(0.018 + random.uniform(0, 0.008))

time.sleep(0.05)
ev('mouseReleased', sx + target_drag, sy, btn='left', btns=0, cc=1)
print("[+] 拖拽完成，等待结果...")

time.sleep(2.5)
stop_ev.set()

# ================
# 检查结果
# ================
print("\n[5] 检查结果...")
collect_events = [e for e in network_events if 'collectData' in e['url'] or 'checkAnswer' in e['url']]
print(f"  collectData/checkAnswer 事件: {len(collect_events)}")

for ce in collect_events:
    print(f"  URL: {ce['url']}")
    if 'ResponseReceived' in ce['method'] or 'RequestWillBeSent' in ce['method']:
        # 获取请求体
        pass

# 检查滑块状态
final_state = js("""
(function() {
    var sl = document.querySelector('[class*="slider_block"]');
    return {
        found: !!sl,
        left: sl ? sl.style.left : 'N/A'
    };
})()
""")
print(f"  最终滑块状态: {final_state}")

# 从网络事件获取collectData请求体
req_events = [e for e in network_events if 'RequestWillBeSent' in e.get('method', '') and 
              ('collectData' in e.get('url', '') or 'checkAnswer' in e.get('url', ''))]
if req_events:
    for re in req_events:
        req_body = re['params'].get('request', {}).get('postData', '')
        print(f"\n[!!!] 请求体: {req_body[:500]}")
        if req_body:
            try:
                parsed = json.loads(req_body)
                print(f"  collectData长度: {len(parsed.get('collectData', ''))}")
                print(f"  key长度: {len(parsed.get('key', ''))}")
                # 保存到文件
                with open('new_collectdata_captured.json', 'w') as f:
                    json.dump(parsed, f, indent=2)
                print("  [+] 已保存到 new_collectdata_captured.json")
            except:
                pass

ws.close()
print("\n[完成]")

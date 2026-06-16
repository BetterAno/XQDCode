"""
双WebSocket连接：
- ws1: 网络监控连接（异步监听Network事件）
- ws2: 控制连接（同步发送CDP命令）
"""
import json
import time
import random
import urllib.request
import websocket
import threading
import io
import sys

try:
    from PIL import Image
    import numpy as np
    HAS_PIL = True
    print("[+] PIL/numpy 可用")
except ImportError:
    HAS_PIL = False
    print("[-] PIL/numpy 不可用，将使用备用方法")

port = 9222


def get_ws_url():
    pages = json.loads(urllib.request.urlopen(f'http://127.0.0.1:{port}/json').read())
    target = next((p for p in pages if 'hotel.ocyuan.com' in p.get('url', '')), pages[0])
    print(f"[+] 目标: {target['url']}")
    return target['webSocketDebuggerUrl']


ws_url = get_ws_url()

# ---- 控制连接 ----
ws_ctrl = websocket.WebSocket()
ws_ctrl.connect(ws_url, suppress_origin=True)
print("[+] 控制连接已建立")

ctrl_mid = [0]


def send(m, p=None):
    if p is None:
        p = {}
    ctrl_mid[0] += 1
    ws_ctrl.send(json.dumps({'id': ctrl_mid[0], 'method': m, 'params': p}))
    ws_ctrl.settimeout(10)
    while True:
        r = json.loads(ws_ctrl.recv())
        if r.get('id') == ctrl_mid[0]:
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


# ---- 监控连接 ----
ws_monitor = websocket.WebSocket()
ws_monitor.connect(ws_url, suppress_origin=True)
print("[+] 监控连接已建立")

monitor_mid = [100000]
network_data = {'events': [], 'gq_result': None, 'collect_data': []}
monitor_lock = threading.Lock()
monitor_stop = threading.Event()


def send_monitor(m, p=None):
    if p is None:
        p = {}
    monitor_mid[0] += 1
    ws_monitor.send(json.dumps({'id': monitor_mid[0], 'method': m, 'params': p}))
    ws_monitor.settimeout(5)
    while True:
        r = json.loads(ws_monitor.recv())
        if r.get('id') == monitor_mid[0]:
            return r


def monitor_loop():
    ws_monitor.settimeout(1.0)
    while not monitor_stop.is_set():
        try:
            msg_str = ws_monitor.recv()
            msg = json.loads(msg_str)
            method = msg.get('method', '')
            params = msg.get('params', {})
            
            if method == 'Network.responseReceived':
                resp = params.get('response', {})
                url = resp.get('url', '')
                req_id = params.get('requestId', '')
                
                if 'getQuestion' in url:
                    # 获取响应体
                    try:
                        body_r = send_monitor('Network.getResponseBody', {'requestId': req_id})
                        body = body_r.get('result', {}).get('body', '')
                        if body:
                            data = json.loads(body)
                            if data.get('success') and data.get('result'):
                                with monitor_lock:
                                    network_data['gq_result'] = data['result']
                                xpos = data['result'].get('xposition', '?')
                                print(f"  [GQ] 捕获getQuestion! xposition={xpos}")
                    except Exception as e:
                        print(f"  [GQ] 获取响应体失败: {e}")
            
            elif method == 'Network.requestWillBeSent':
                req = params.get('request', {})
                url = req.get('url', '')
                if 'collectData' in url or 'checkAnswer' in url:
                    post_data = req.get('postData', '')
                    print(f"  [COLLECT] 捕获请求! URL={url[:60]}")
                    if post_data:
                        try:
                            parsed = json.loads(post_data)
                            with monitor_lock:
                                network_data['collect_data'].append(parsed)
                            print(f"  [COLLECT] collectData长度: {len(parsed.get('collectData', ''))}")
                            print(f"  [COLLECT] key长度: {len(parsed.get('key', ''))}")
                        except Exception as e:
                            print(f"  [COLLECT] 解析失败: {e}")
                            with monitor_lock:
                                network_data['collect_data'].append({'raw': post_data[:500]})
        except Exception:
            pass


# 启动监控线程
send_monitor('Network.enable')
print("[+] 网络监控已启用")
monitor_thread = threading.Thread(target=monitor_loop, daemon=True)
monitor_thread.start()

# =====================================
# STEP 1: 刷新验证码
# =====================================
print("\n[1] 刷新/触发验证码...")
result1 = js("""
(function() {
    var r = document.querySelector('[class*="refresh_btn"]');
    if (r) { r.click(); return 'refresh_clicked'; }
    var btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('\u767b'));
    if (btn) { btn.click(); return 'login_clicked'; }
    return 'nothing';
})()
""")
print(f"  结果: {result1}")

# 等待getQuestion
print("[*] 等待getQuestion...")
deadline = time.time() + 5
while time.time() < deadline:
    with monitor_lock:
        if network_data['gq_result']:
            break
    time.sleep(0.3)

with monitor_lock:
    gq_result = network_data['gq_result']

# =====================================
# STEP 2: 计算缺口位置
# =====================================
print("\n[2] 计算缺口位置...")
gap_x = None

if gq_result:
    static_server = gq_result.get('staticServer', 'https://static1.tuyacn.com/static/th-lib/')
    bg_path = gq_result.get('bgUrl', '')
    sl_path = gq_result.get('sliceUrl', '')
    xposition = gq_result.get('xposition', 0)
    yposition = gq_result.get('yposition', 0)
    challenge = gq_result.get('challenge', '')
    shuffle = gq_result.get('shuffle', '[]')
    public_key = gq_result.get('publicKey', '')
    
    print(f"  xposition: {xposition}")
    print(f"  yposition: {yposition}")
    print(f"  challenge: {challenge[:30]}")
    
    if bg_path and HAS_PIL:
        bg_url = f"{static_server}{bg_path}"
        sl_url = f"{static_server}{sl_path}"
        print(f"  bgUrl: {bg_url}")
        
        try:
            bg_data = urllib.request.urlopen(bg_url, timeout=10).read()
            sl_data = urllib.request.urlopen(sl_url, timeout=10).read()
            bg = np.array(Image.open(io.BytesIO(bg_data)).convert('RGB'))
            sl = np.array(Image.open(io.BytesIO(sl_data)).convert('RGBA'))
            
            print(f"  bg shape: {bg.shape}, sl shape: {sl.shape}")
            
            alpha = sl[:, :, 3]
            rows = np.any(alpha > 50, axis=1)
            cols = np.any(alpha > 50, axis=0)
            
            if rows.any() and cols.any():
                rmin, rmax = np.where(rows)[0][[0, -1]]
                cmin, cmax = np.where(cols)[0][[0, -1]]
                sl_rgb = sl[rmin:rmax+1, cmin:cmax+1, :3]
                sl_a = alpha[rmin:rmax+1, cmin:cmax+1]
                h, w = sl_rgb.shape[:2]
                
                bg_h, bg_w = bg.shape[:2]
                mask = sl_a > 50
                
                best_x, best_score = 0, float('inf')
                for x in range(0, bg_w - w + 1):
                    region = bg[rmin:rmin+h, x:x+w, :]
                    if region.shape[:2] != sl_rgb.shape[:2]:
                        continue
                    diff = np.abs(region[mask].astype(float) - sl_rgb[mask].astype(float))
                    score = diff.mean()
                    if score < best_score:
                        best_score = score
                        best_x = x
                
                gap_x = best_x + cmin
                print(f"  [GAP] 模板匹配: x={gap_x}, score={best_score:.1f}")
        except Exception as e:
            print(f"  [GAP] 匹配失败: {e}")
    
    if gap_x is None:
        # 备用：直接用 xposition 解码
        # 尝试不同的解码方式
        # 验证码宽260px，gap范围大约50-220px
        candidates = [
            xposition % 211,
            (xposition >> 3) % 211,
            xposition % 256 % 211,
        ]
        for c in candidates:
            if 30 <= c <= 220:
                gap_x = c
                print(f"  [GAP] xposition解码: {gap_x}px")
                break
        if gap_x is None:
            gap_x = 90
else:
    print("  未找到getQuestion数据")
    gap_x = 90

print(f"[+] 缺口位置: gap_x={gap_x}px")

# =====================================
# STEP 3: 精准拖拽
# =====================================
print("\n[3] 精准拖拽...")
slider_info = js("""
(function() {
    var el = document.querySelector('[class*="slider_block"]');
    if (!el) return null;
    var r = el.getBoundingClientRect();
    return {x: r.x, y: r.y, w: r.width, h: r.height};
})()
""")

if not slider_info:
    print("[-] 未找到滑块！")
    monitor_stop.set()
    ws_ctrl.close()
    ws_monitor.close()
    sys.exit(1)

sx = slider_info['x'] + slider_info['w'] / 2
sy = slider_info['y'] + slider_info['h'] / 2
target_drag = gap_x

print(f"  滑块: ({sx:.0f}, {sy:.0f}), 拖拽 {target_drag}px")

# 清空之前的collect数据
with monitor_lock:
    network_data['collect_data'].clear()

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
print("[+] 拖拽完成")
time.sleep(2.5)

# =====================================
# STEP 4: 检查结果
# =====================================
print("\n[4] 检查结果...")
monitor_stop.set()

with monitor_lock:
    collected = list(network_data['collect_data'])

final_state = js("""
(function() {
    var sl = document.querySelector('[class*="slider_block"]');
    return {found: !!sl, left: sl ? sl.style.left : 'N/A'};
})()
""")
print(f"  滑块状态: {final_state}")
print(f"  collectData数量: {len(collected)}")

if collected:
    print("\n[!!!] 成功捕获collectData!")
    for item in collected:
        print(f"  collectData长度: {len(item.get('collectData', ''))}")
        print(f"  key长度: {len(item.get('key', ''))}")
        print(f"  challenge: {item.get('challenge', '')[:30]}")
        
        # 保存完整数据
        with open('new_collectdata_captured.json', 'w', encoding='utf-8') as f:
            json.dump(item, f, indent=2, ensure_ascii=False)
        print("  [+] 已保存到 new_collectdata_captured.json")
else:
    print("[-] 未捕获到collectData")
    if gq_result:
        print(f"  xposition={gq_result.get('xposition')}, gap_x={gap_x}")
        print("  尝试不同的gap值进行调试...")

ws_ctrl.close()
ws_monitor.close()
print("\n[完成]")

"""
单连接CDP方案：通过非阻塞队列分发消息
缺口检测策略（优先级由高到低）：
  1. gq数据捕获成功 → full-bg差分（用gq中的URL）
  2. gq未捕获 → performance资源中提取bg URL → 推导full URL → Python差分
  3. 以上失败 → canvas亮度检测（图片打乱，不准，仅备用）
"""
import json
import time
import random
import urllib.request
import urllib.parse
import websocket
import threading
import queue
import io
import sys
import base64

CLOUD_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"

try:
    from PIL import Image
    import numpy as np
    HAS_PIL = True
    print("[+] PIL/numpy 可用")
except ImportError:
    HAS_PIL = False

port = 9222
pages = json.loads(urllib.request.urlopen(f'http://127.0.0.1:{port}/json').read())
target = next((p for p in pages if 'hotel.ocyuan.com' in p.get('url', '')), pages[0])
print(f"[+] 目标: {target['url']}")

ws = websocket.WebSocket()
ws.connect(target['webSocketDebuggerUrl'], suppress_origin=True)
print("[+] CDP连接成功")

# 消息路由
pending = {}  # id -> queue
events_queue = queue.Queue()
msg_id = [0]
ws_lock = threading.Lock()
stop_recv = threading.Event()


def recv_loop():
    """持续接收消息并路由"""
    ws.settimeout(1.0)
    while not stop_recv.is_set():
        try:
            raw = ws.recv()
            msg = json.loads(raw)
            if 'id' in msg:
                mid = msg['id']
                if mid in pending:
                    pending[mid].put(msg)
            elif 'method' in msg:
                events_queue.put(msg)
        except:
            pass


recv_thread = threading.Thread(target=recv_loop, daemon=True)
recv_thread.start()


def send_cmd(method, params=None, timeout=10):
    if params is None:
        params = {}
    with ws_lock:
        msg_id[0] += 1
        mid = msg_id[0]
        q = queue.Queue()
        pending[mid] = q
        ws.send(json.dumps({'id': mid, 'method': method, 'params': params}))
    try:
        result = q.get(timeout=timeout)
    except queue.Empty:
        if mid in pending:
            del pending[mid]
        return {'error': f'timeout after {timeout}s', 'method': method}
    if mid in pending:
        del pending[mid]
    return result


def ev(t, x, y, btn='none', btns=0, cc=0):
    send_cmd('Input.dispatchMouseEvent', {
        'type': t, 'x': x, 'y': y,
        'button': btn, 'buttons': btns,
        'clickCount': cc,
        'pointerType': 'mouse',
        'timestamp': time.time() * 1000
    })


def js(expr):
    r = send_cmd('Runtime.evaluate', {
        'expression': expr,
        'returnByValue': True,
        'awaitPromise': False
    })
    return r.get('result', {}).get('result', {}).get('value')


# 启用网络监控
send_cmd('Network.enable')
print("[+] 网络监控已启用")

# 事件收集
network_data = {'gq': None, 'collect': [], 'img_urls': {}, 'gq_rid': None}
net_lock = threading.Lock()

# CDP Fetch拦截的请求体缓存
fetch_bodies = {}
fetch_lock = threading.Lock()


def process_events():
    """处理网络事件"""
    while not stop_recv.is_set():
        try:
            msg = events_queue.get(timeout=0.5)
            method = msg.get('method', '')
            params = msg.get('params', {})

            if method == 'Network.requestWillBeSent':
                req = params.get('request', {})
                url = req.get('url', '')
                # 调试：打印所有tuyacn相关请求
                if 'tuyacn' in url or 'yrule' in url:
                    print(f"  [NET-REQ] {url[:80]}")
                # 记录yrule图片URL
                if 'yrule/images' in url and 'tuyacn.com' in url:
                    with net_lock:
                        if '/bg/' in url:
                            network_data['img_urls']['bg'] = url
                            print(f"  [NET-IMG] bg: {url[-70:]}")
                        elif '/slice/' in url:
                            network_data['img_urls']['slice'] = url
                            print(f"  [NET-IMG] slice: {url[-70:]}")
                        elif '/images/260/' in url and '/bg/' not in url and '/slice/' not in url:
                            network_data['img_urls']['full'] = url
                            print(f"  [NET-IMG] full: {url[-70:]}")
                if 'collectData' in url or 'checkAnswer' in url:
                    post_data = req.get('postData', '')
                    print(f"\n  [!!!NET] collectData请求! {url[:60]}")
                    if post_data:
                        try:
                            parsed = json.loads(post_data)
                            with net_lock:
                                network_data['collect'].append(parsed)
                            print(f"  collectData长度: {len(parsed.get('collectData', ''))}")
                            print(f"  key长度: {len(parsed.get('key', ''))}")
                        except:
                            with net_lock:
                                network_data['collect'].append({'_raw': post_data})

            if method == 'Network.responseReceived':
                resp = params.get('response', {})
                url = resp.get('url', '')
                req_id = params.get('requestId', '')
                if 'getQuestion' in url:
                    print(f"  [NET] getQuestion响应: {url[:60]}")
                    # 只记录requestId，在主线程中同步获取响应体
                    with net_lock:
                        network_data['gq_rid'] = req_id
                    # 同时尝试同步获取（非阻塞方式）
                    try:
                        body_r = send_cmd('Network.getResponseBody', {'requestId': req_id}, timeout=5)
                        body = body_r.get('result', {}).get('body', '')
                        if body:
                            data = json.loads(body)
                            if data.get('success') and data.get('result'):
                                r = data['result']
                                st = r.get('staticServer', 'https://images.tuyacn.com/')
                                with net_lock:
                                    network_data['gq'] = r
                                    if r.get('bgUrl'):
                                        network_data['img_urls']['bg'] = st + r['bgUrl']
                                    if r.get('fullUrl'):
                                        network_data['img_urls']['full'] = st + r['fullUrl']
                                    if r.get('sliceUrl'):
                                        network_data['img_urls']['slice'] = st + r['sliceUrl']
                                print(f"  [NET] 捕获getQuestion! xpos={r.get('xposition')} full={r.get('fullUrl','')[:40]}")
                            else:
                                print(f"  [NET] getQuestion非成功: {str(data)[:80]}")
                    except Exception as e:
                        print(f"  [NET] 响应体获取: {type(e).__name__}")
                        # 不阻塞，主线程会重试
                elif 'collectData' in url or 'checkAnswer' in url:
                    print(f"  [NET] {url.split('/')[-1]}响应: reqId={req_id}")
                    try:
                        body_r2 = send_cmd('Network.getResponseBody', {'requestId': req_id})
                        body2 = body_r2.get('result', {}).get('body', '')
                        if body2:
                            resp_data = json.loads(body2)
                            print(f"  [NET] 服务端响应: {json.dumps(resp_data, ensure_ascii=False)[:300]}")
                            with net_lock:
                                network_data.setdefault('collect_resp', []).append(resp_data)
                    except Exception as e2:
                        print(f"  [NET] 响应内容获取失败: {e2}")
        except queue.Empty:
            pass


event_thread = threading.Thread(target=process_events, daemon=True)
event_thread.start()

# =====================================
# 刷新验证码，等待getQuestion
# =====================================
print("\n[1] 获取当前验证码数据...")

# 不点刷新！当前验证码已在页面上
# 尝试从CDP网络事件获取已有的getQuestion响应
# 点击刷新按钮时SDK会重新发getQuestion（之前的同步获取已验证可行）
r1 = js("""(function() {
    var refresh = document.querySelector('[class*="refresh_btn"]');
    if (refresh) { refresh.click(); return 'refresh'; }
    return 'none';
})()""")
print(f"  操作: {r1}")

# 等待getQuestion响应
print("[*] 等待getQuestion响应...")
for i in range(80):  # 最多等24秒
    with net_lock:
        if network_data['gq']:
            break
    time.sleep(0.3)

with net_lock:
    gq = network_data['gq']

if gq:
    print(f"  捕获getQuestion! xpos={gq.get('xposition')}")
    # 等待图片加载完成（canvas已渲染新图片）
    print("  等待新验证码渲染...")
    time.sleep(2)
else:
    # 主线程重试获取响应体
    with net_lock:
        gq_rid = network_data.get('gq_rid')
    if gq_rid:
        print(f"  重试获取响应体 rid={gq_rid[:20]}...")
        try:
            body_r = send_cmd('Network.getResponseBody', {'requestId': gq_rid}, timeout=10)
            body = body_r.get('result', {}).get('body', '')
            if body:
                data = json.loads(body)
                if data.get('success') and data.get('result'):
                    gq = data['result']
                    r = data['result']
                    st = r.get('staticServer', 'https://images.tuyacn.com/')
                    with net_lock:
                        network_data['gq'] = gq
                        if r.get('bgUrl'):
                            network_data['img_urls']['bg'] = st + r['bgUrl']
                        if r.get('fullUrl'):
                            network_data['img_urls']['full'] = st + r['fullUrl']
                        if r.get('sliceUrl'):
                            network_data['img_urls']['slice'] = st + r['sliceUrl']
                    print(f"  [重试] 捕获getQuestion! xpos={r.get('xposition')} full={r.get('fullUrl','')[:40]}")
                    time.sleep(2)  # 等待验证码渲染
                else:
                    print(f"  [重试] 非成功: {str(data)[:80]}")
        except Exception as e:
            print(f"  [重试] 获取失败: {type(e).__name__}")
    else:
        print("  未捕获有效getQuestion数据")

# =====================================
# 计算缺口（full-bg差分，多策略）
# =====================================
print("\n[2] 计算缺口位置...")
gap_x = None


def diff_gap(bg_bytes, full_bytes, sl_bytes=None):
    """
    通过full图减bg图找缺口位置（打乱坐标系）
    full（无缺口打乱图）- bg（有缺口打乱图）= 缺口区域像素差最大
    """
    if not HAS_PIL:
        return None
    bg = np.array(Image.open(io.BytesIO(bg_bytes)).convert('RGB')).astype(float)
    full = np.array(Image.open(io.BytesIO(full_bytes)).convert('RGB')).astype(float)
    if sl_bytes:
        sl = np.array(Image.open(io.BytesIO(sl_bytes)).convert('RGBA'))
        alpha = sl[:, :, 3]
        sl_rows = np.where(np.any(alpha > 50, axis=1))[0]
        sl_cols = np.where(np.any(alpha > 50, axis=0))[0]
        sl_r0 = int(sl_rows[0]) if len(sl_rows) > 0 else 60
        sl_r1 = int(sl_rows[-1]) if len(sl_rows) > 0 else 110
        sl_w = int(sl_cols[-1] - sl_cols[0] + 1) if len(sl_cols) > 0 else 51
    else:
        sl_r0, sl_r1, sl_w = 60, 110, 51
    diff = np.abs(full - bg).mean(axis=2)
    col_diff = diff[sl_r0:sl_r1+1, :].mean(axis=0)
    best_score, best_x = -1, 0
    for x in range(0, len(col_diff) - sl_w + 1):
        score = float(col_diff[x:x+sl_w].mean())
        if score > best_score:
            best_score, best_x = score, x
    print(f"  差分结果: gapX={best_x}, 得分={best_score:.2f}, slW={sl_w}, 行={sl_r0}-{sl_r1}")
    return best_x


# --- 策略1: gq数据有效 ---
if gq and gq.get('fullUrl'):
    print("  [策略1] gq数据 → full-bg差分")
    static = gq.get('staticServer', 'https://images.tuyacn.com/')
    try:
        bg_d = urllib.request.urlopen(static + gq['bgUrl'], timeout=12).read()
        full_d = urllib.request.urlopen(static + gq['fullUrl'], timeout=12).read()
        sl_d = urllib.request.urlopen(static + gq['sliceUrl'], timeout=12).read() if gq.get('sliceUrl') else None
        gap_x = diff_gap(bg_d, full_d, sl_d)
    except Exception as e:
        print(f"  策略1失败: {e}")

# --- 策略2: 从CDP网络事件记录的img_urls获取 ---
if gap_x is None:
    print("  [策略2] CDP img_urls → 差分")
    with net_lock:
        iu = dict(network_data.get('img_urls', {}))
    if iu.get('bg') and iu.get('full'):
        try:
            bg_d = urllib.request.urlopen(iu['bg'], timeout=12).read()
            full_d = urllib.request.urlopen(iu['full'], timeout=12).read()
            sl_d = urllib.request.urlopen(iu['slice'], timeout=12).read() if iu.get('slice') else None
            gap_x = diff_gap(bg_d, full_d, sl_d)
        except Exception as e:
            print(f"  差分失败: {e}")
    elif iu.get('bg'):
        bg_abs = iu['bg']
        full_abs = bg_abs.replace('/images/bg/', '/images/')
        sl_abs = bg_abs.replace('/images/bg/', '/images/slice/').replace('.webp', '.png')
        try:
            bg_d = urllib.request.urlopen(bg_abs, timeout=12).read()
            full_d = urllib.request.urlopen(full_abs, timeout=12).read()
            sl_d = urllib.request.urlopen(sl_abs, timeout=12).read() if sl_abs else None
            gap_x = diff_gap(bg_d, full_d, sl_d)
        except Exception as e:
            print(f"  推导差分失败: {e}")
    else:
        print("  无图片URL")

# --- 策略3: canvas亮度检测（备用，打乱图不准）---
if gap_x is None:
    print("  [策略3] canvas亮度（备用，打乱图不准）")
    r = js("""(function() {
  var canvases = Array.from(document.querySelectorAll('canvas'));
  var bgC = canvases.find(function(c){return c.width===260;});
  var slC = canvases.find(function(c){return c.width===58;});
  if (!bgC || !slC) return null;
  var bgD = bgC.getContext('2d').getImageData(0,0,260,160).data;
  var slD = slC.getContext('2d').getImageData(0,0,58,160).data;
  var slR0=160,slR1=0;
  for(var y=0;y<160;y++){for(var x=0;x<58;x++){if(slD[(y*58+x)*4+3]>50){if(y<slR0)slR0=y;if(y>slR1)slR1=y;}}}
  var slColStart=58,slColEnd=0;
  for(var x=0;x<58;x++){for(var y=0;y<160;y++){if(slD[(y*58+x)*4+3]>50){if(x<slColStart)slColStart=x;if(x>slColEnd)slColEnd=x;}}}
  var slW=slColEnd-slColStart+1;
  var colB=[];
  for(var x=0;x<260;x++){var s=0,n=0;for(var y=slR0;y<=slR1;y++){var i=(y*260+x)*4;s+=bgD[i]*0.299+bgD[i+1]*0.587+bgD[i+2]*0.114;n++;}colB.push(n>0?s/n:0);}
  var best=9999,bx=0;
  for(var x=0;x<=260-slW;x++){var a=0;for(var i=0;i<slW;i++)a+=colB[x+i];a/=slW;if(a<best){best=a;bx=x;}}
  return {gapX:bx,minBright:Math.round(best),slRows:[slR0,slR1],slW:slW};
})()""")
    if r and isinstance(r, dict):
        print(f"  canvas: gapX={r.get('gapX')}, minBright={r.get('minBright')}, slW={r.get('slW')}")
        gap_x = r.get('gapX')

if gap_x is None:
    gap_x = 120
    print(f"  所有策略失败，使用默认值: {gap_x}")
else:
    gap_x = max(10, int(gap_x) - 3)
    print(f"  最终拖拽距离: {gap_x}px（缺口坐标-3）")

if gq:
    xposition = gq.get('xposition', 0)
    challenge = gq.get('challenge', '')
    shuffle = gq.get('shuffle', '[]')
    pub_key = gq.get('publicKey', '')
    print(f"  xposition={xposition}, challenge={challenge[:30]}")
else:
    xposition = 0
    challenge = ''
    shuffle = '[]'
    pub_key = ''

print(f"\n[+] 使用缺口位置: {gap_x}px")

# =====================================
# 拖拽
# =====================================
print("\n[3] 拖拽滑块...")
si = js("""(function() {
    var el = document.querySelector('[class*="slider_block"]');
    if (!el) return null;
    var r = el.getBoundingClientRect();
    return {x: r.x, y: r.y, w: r.width, h: r.height};
})()""")

if not si:
    print("[-] 未找到滑块！")
    stop_recv.set()
    ws.close()
    sys.exit(1)

sx = si['x'] + si['w'] / 2
sy = si['y'] + si['h'] / 2

print(f"  滑块: ({sx:.1f}, {sy:.1f}), 尺寸={si['w']}x{si['h']}")
print(f"  拖拽距离: {gap_x}px")

# 清空collect记录
with net_lock:
    network_data['collect'].clear()

# 拖拽序列
# 1. 先移动到滑块上方
ev('mouseMoved', sx, sy)
time.sleep(0.3)
# 2. 按下鼠标
print(f"  mousedown at ({sx:.1f}, {sy:.1f})")
ev('mousePressed', sx, sy, btn='left', btns=1, cc=1)
time.sleep(0.2)

# 检查按下后滑块是否有变化
slider_after_down = js("""(function() {
    var sl = document.querySelector('[class*="slider_block"]');
    return sl ? {left: sl.style.left, transform: sl.style.transform} : null;
})()""")
print(f"  按下后滑块: {slider_after_down}")

# 3. 拖拽
steps = 50
for i in range(1, steps + 1):
    t = i / steps
    # 缓出动画
    progress = 1 - (1 - t) ** 2
    x = sx + gap_x * progress
    y = sy + random.uniform(-1.5, 1.5)
    ev('mouseMoved', x, y, btn='left', btns=1)
    time.sleep(0.018 + random.uniform(0, 0.008))

# 4. 释放
final_x = sx + gap_x
print(f"  mouseup at ({final_x:.1f}, {sy:.1f})")
time.sleep(0.05)
ev('mouseReleased', final_x, sy, btn='left', btns=0, cc=1)
print("[+] 拖拽完成，等待响应...")
time.sleep(3.0)

# =====================================
# 检查结果
# =====================================
print("\n[4] 结果...")
final_state = js("""(function() {
    var sl = document.querySelector('[class*="slider_block"]');
    return {found: !!sl, left: sl ? sl.style.left : 'N/A'};
})()""")
print(f"  滑块状态: {final_state}")

with net_lock:
    collected = list(network_data['collect'])

print(f"  collectData数量: {len(collected)}")

if collected:
    print("\n[!!!] 成功捕获 collectData!")
    for item in collected:
        print(json.dumps(item, indent=2, ensure_ascii=False)[:600])
        with open('new_collectdata_captured.json', 'w', encoding='utf-8') as f:
            json.dump(item, f, indent=2, ensure_ascii=False)
        print("[+] 保存至 new_collectdata_captured.json")
else:
    print("[-] 未捕获到collectData")
    if gq:
        print(f"  xposition={gq.get('xposition')}, gap_x={gap_x}")

stop_recv.set()
ws.close()
print("\n[完成]")

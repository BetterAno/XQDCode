"""
完整流程：
1. 安装网络请求Hook捕获getQuestion响应
2. 点击登录触发验证码
3. 等待getQuestion响应（获取图片URL）
4. 下载图片，用模板匹配计算缺口位置
5. CDP精准拖拽到缺口
6. 捕获collectData请求
"""
import json
import time
import random
import urllib.request
import websocket
import base64
import io
import os

try:
    from PIL import Image
    import numpy as np
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("[-] PIL/numpy 不可用，将使用简单方法")

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
    val = r.get('result', {}).get('result', {})
    if val.get('type') == 'object' and val.get('subtype') != 'null':
        return val.get('value')
    return val.get('value')


def detect_gap_by_template(bg_url, slice_url):
    """
    用模板匹配检测缺口位置
    背景图：260x160 webp
    滑块图：58x160 png（实际滑块约50px宽，位于左上角）
    """
    if not HAS_PIL:
        return None
    
    try:
        # 下载图片
        bg_resp = urllib.request.urlopen(bg_url, timeout=10)
        slice_resp = urllib.request.urlopen(slice_url, timeout=10)
        
        bg_img = Image.open(io.BytesIO(bg_resp.read())).convert('RGB')
        slice_img = Image.open(io.BytesIO(slice_resp.read())).convert('RGBA')
        
        bg = np.array(bg_img)
        sl = np.array(slice_img)
        
        print(f"  背景图: {bg.shape}")
        print(f"  滑块图: {sl.shape}")
        
        # 提取滑块区域（alpha>100的像素区域）
        if sl.shape[2] == 4:
            alpha = sl[:, :, 3]
            # 找到滑块的边界框
            rows = np.any(alpha > 100, axis=1)
            cols = np.any(alpha > 100, axis=0)
            if rows.any() and cols.any():
                rmin, rmax = np.where(rows)[0][[0, -1]]
                cmin, cmax = np.where(cols)[0][[0, -1]]
                print(f"  滑块有效区域: rows={rmin}-{rmax}, cols={cmin}-{cmax}")
                # 提取RGB部分
                sl_rgb = sl[rmin:rmax+1, cmin:cmax+1, :3]
                sl_alpha = alpha[rmin:rmax+1, cmin:cmax+1]
            else:
                sl_rgb = sl[:, :, :3]
                sl_alpha = np.ones((sl.shape[0], sl.shape[1])) * 255
        else:
            sl_rgb = sl[:, :, :3]
            sl_alpha = np.ones((sl.shape[0], sl.shape[1])) * 255
        
        # 在背景图上滑动模板，找最小差异位置
        h, w = sl_rgb.shape[:2]
        bg_h, bg_w = bg.shape[:2]
        
        best_x = 0
        best_score = float('inf')
        
        for x in range(0, bg_w - w + 1):
            region = bg[0:h, x:x+w, :]
            # 只比较alpha > 100的区域
            mask = sl_alpha > 100
            if mask.sum() == 0:
                continue
            diff = np.abs(region[mask].astype(float) - sl_rgb[mask].astype(float))
            score = diff.mean()
            if score < best_score:
                best_score = score
                best_x = x
        
        print(f"  模板匹配结果: x={best_x}, score={best_score:.2f}")
        return best_x + cmin  # 加上滑块的水平偏移
        
    except Exception as e:
        print(f"[-] 模板匹配失败: {e}")
        import traceback
        traceback.print_exc()
        return None


def get_gap_from_canvas():
    """通过canvas分析获取缺口位置"""
    result = js("""
    (function() {
        var cvs = document.querySelector('[class*="slider_cvs"], [class*="yrule"] canvas');
        if (!cvs) return null;
        var ctx = cvs.getContext('2d');
        var w = cvs.width, h = cvs.height;
        var imageData = ctx.getImageData(0, 0, w, h);
        var data = imageData.data;
        
        // 找到颜色突变点（缺口边缘）
        var diffs = [];
        for (var x = 5; x < w - 5; x++) {
            var col_diff = 0;
            for (var y = 0; y < h; y++) {
                var idx = (y * w + x) * 4;
                var prev_idx = (y * w + (x-1)) * 4;
                var dr = Math.abs(data[idx] - data[prev_idx]);
                var dg = Math.abs(data[idx+1] - data[prev_idx+1]);
                var db = Math.abs(data[idx+2] - data[prev_idx+2]);
                col_diff += dr + dg + db;
            }
            diffs.push({x: x, d: col_diff});
        }
        
        // 找最大差异点
        diffs.sort(function(a,b) { return b.d - a.d; });
        return {topDiffs: diffs.slice(0, 5), canvasSize: {w: w, h: h}};
    })()
    """)
    return result


# ==================
# STEP 1: 安装网络Hook
# ==================
print("\n[1] 安装网络请求Hook...")
install_result = js("""
(function() {
    window.__getQuestionData = null;
    window.__collectCaptured = [];
    
    var origFetch = window.fetch;
    window.__origFetchSaved = origFetch;
    window.fetch = async function() {
        var url = typeof arguments[0] === 'string' ? arguments[0] : (arguments[0] && arguments[0].url) || '';
        var resp = await origFetch.apply(this, arguments);
        
        if (url.includes('getQuestion')) {
            try {
                var clone = resp.clone();
                var data = await clone.json();
                window.__getQuestionData = data;
                console.log('[NET] getQuestion captured, xpos:', data && data.result && data.result.xposition);
            } catch(e) {}
        }
        
        if (url.includes('collectData') || url.includes('checkAnswer')) {
            var body = arguments[1] && arguments[1].body;
            window.__collectCaptured.push({url: url, body: body, ts: Date.now()});
            console.log('[NET] collectData/checkAnswer captured:', url);
        }
        
        return resp;
    };
    
    return 'hooks installed';
})()
""")
print(f"  结果: {install_result}")

# ==================
# STEP 2: 点击登录按钮触发验证码
# ==================
print("\n[2] 点击登录按钮...")
btn_info = js("""
(function() {
    var btn = document.querySelector('button[type="button"]');
    if (!btn) btn = document.querySelector('.ant-btn-primary');
    if (!btn) btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('登'));
    if (!btn) return null;
    var r = btn.getBoundingClientRect();
    return {x: r.x + r.width/2, y: r.y + r.height/2, text: btn.textContent.trim()};
})()
""")
print(f"  登录按钮: {btn_info}")

if btn_info:
    btn_x = btn_info['x']
    btn_y = btn_info['y']
    ev('mouseMoved', btn_x, btn_y)
    time.sleep(0.05)
    ev('mousePressed', btn_x, btn_y, btn='left', btns=1, cc=1)
    time.sleep(0.05)
    ev('mouseReleased', btn_x, btn_y, btn='left', btns=0, cc=1)
    print(f"  已点击: ({btn_x:.0f}, {btn_y:.0f})")
else:
    print("  未找到登录按钮！")

# 等待验证码加载
print("[*] 等待验证码加载...")
time.sleep(2.5)

# ==================
# STEP 3: 等待验证码并获取数据
# ==================
print("\n[3] 检查验证码状态...")
captcha_info = js("""
(function() {
    var sl = document.querySelector('[class*="slider_block"]');
    if (!sl) return {found: false};
    var r = sl.getBoundingClientRect();
    
    // 查找验证码容器
    var container = document.querySelector('[class*="yrule_wrap"], [class*="captcha"]');
    var containerRect = container ? JSON.stringify(container.getBoundingClientRect()) : null;
    
    return {
        found: true,
        sliderRect: JSON.stringify(r),
        containerRect: containerRect,
        getQuestionCaptured: !!window.__getQuestionData,
        getQuestionData: window.__getQuestionData ? JSON.stringify(window.__getQuestionData).substring(0, 500) : null
    };
})()
""")
print(f"  验证码状态: {json.dumps(captcha_info, ensure_ascii=False)[:300]}")

if not captcha_info or not captcha_info.get('found'):
    print("[-] 验证码未显示，尝试重新点击登录...")
    time.sleep(1)
    # 重试
    if btn_info:
        ev('mousePressed', btn_x, btn_y, btn='left', btns=1, cc=1)
        time.sleep(0.05)
        ev('mouseReleased', btn_x, btn_y, btn='left', btns=0, cc=1)
        time.sleep(2.5)
        captcha_info = js("""
        (function() {
            var sl = document.querySelector('[class*="slider_block"]');
            return {found: !!sl, getQuestionCaptured: !!window.__getQuestionData};
        })()
        """)

# ==================
# STEP 4: 获取缺口位置
# ==================
print("\n[4] 计算缺口位置...")
gq_data_str = js("window.__getQuestionData ? JSON.stringify(window.__getQuestionData) : null")
gap_x = None

if gq_data_str:
    try:
        gq_data = json.loads(gq_data_str)
        result = gq_data.get('result', {})
        static_server = result.get('staticServer', 'https://static1.tuyacn.com/static/th-lib/')
        bg_url_path = result.get('bgUrl', '')
        slice_url_path = result.get('sliceUrl', '')
        xposition = result.get('xposition', 0)
        yposition = result.get('yposition', 0)
        shuffle_str = result.get('shuffle', '[]')
        public_key = result.get('publicKey', '')
        challenge = result.get('challenge', '')
        
        print(f"  xposition: {xposition}")
        print(f"  yposition: {yposition}")
        print(f"  challenge: {challenge[:30]}...")
        
        if bg_url_path:
            bg_url = f"{static_server}{bg_url_path}"
            slice_url = f"{static_server}{slice_url_path}"
            print(f"  背景图URL: {bg_url}")
            print(f"  滑块图URL: {slice_url}")
            
            print("  [*] 开始模板匹配...")
            gap_x = detect_gap_by_template(bg_url, slice_url)
            
        if gap_x is None:
            # 用xposition估算
            print("  [*] 使用xposition估算缺口位置...")
            # 根据之前的经验数据：
            # xpos=8973 -> gap≈31px
            # xpos=8717 -> gap≈50px  
            # xpos=62733 -> gap≈46px
            # 验证码宽度260px，有效范围约50-230px
            gap_x = xposition % 200 + 30  # 粗略估算
            print(f"  xposition估算缺口: {gap_x}px")
    except Exception as e:
        print(f"  解析getQuestion数据失败: {e}")
        import traceback
        traceback.print_exc()

if gap_x is None:
    gap_x = 100  # 默认值
    print(f"  使用默认缺口位置: {gap_x}px")

print(f"[+] 最终缺口位置: gap_x={gap_x}px")

# ==================
# STEP 5: 精准拖拽
# ==================
print("\n[5] 精准拖拽滑块...")
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
    ws.close()
    exit(1)

sx = slider_info['x'] + slider_info['w'] / 2
sy = slider_info['y'] + slider_info['h'] / 2

# 验证码容器的x起点（滑块起始位置，即容器左边缘）
container_left = slider_info['x']  # 滑块本身的左边缘即容器左边缘
# 目标拖拽距离 = gap_x（缺口位置从容器左侧算起，已减去滑块本身宽度）
# 注意：滑块宽50px，gap_x是缺口左边缘，拖拽量= gap_x
target_drag = gap_x

print(f"  滑块起点: ({sx:.0f}, {sy:.0f})")
print(f"  目标拖拽距离: {target_drag}px")
print(f"  目标终点: ({sx + target_drag:.0f}, {sy:.0f})")

# 安装滑块监控
js("""
window.__sliderMoves = [];
var el = document.querySelector('[class*="slider_block"]');
if (el) {
    var ob = new MutationObserver(function(muts) {
        muts.forEach(function(m) {
            window.__sliderMoves.push(el.style.left);
        });
    });
    ob.observe(el, {attributes: true, attributeFilter: ['style']});
}
""")

# 移动到滑块
ev('mouseMoved', sx, sy)
time.sleep(0.08)

# Mousedown
ev('mousePressed', sx, sy, btn='left', btns=1, cc=1)
time.sleep(0.12)

# Mousemove序列（模拟人类化拖拽）
steps = 50
for i in range(1, steps + 1):
    t = i / steps
    # ease-out 曲线：先快后慢
    progress = 1 - (1 - t) ** 2
    x = sx + target_drag * progress
    y = sy + random.uniform(-1.5, 1.5)
    ev('mouseMoved', x, y, btn='left', btns=1)
    time.sleep(0.018 + random.uniform(0, 0.008))

# 在目标位置停留一下
time.sleep(0.05)

# Mouseup
ev('mouseReleased', sx + target_drag, sy, btn='left', btns=0, cc=1)
print("[+] 拖拽完成")

# 等待SDK处理和网络请求
time.sleep(2.5)

# ==================
# STEP 6: 检查结果
# ==================
print("\n[6] 检查结果...")
final = js("""
(function() {
    var sl = document.querySelector('[class*="slider_block"]');
    return {
        sliderFound: !!sl,
        sliderLeft: sl ? sl.style.left : 'N/A',
        collectCount: window.__collectCaptured ? window.__collectCaptured.length : 0,
        collectData: window.__collectCaptured && window.__collectCaptured.length > 0 ? 
            window.__collectCaptured.map(function(c) { return {url: c.url, bodyLen: c.body ? c.body.length : 0, bodyPreview: c.body ? c.body.substring(0, 300) : ''}; }) : [],
        sliderMoves: window.__sliderMoves ? window.__sliderMoves.slice(-5) : []
    };
})()
""")

if final:
    print(f"  滑块状态: {final.get('sliderLeft')}")
    print(f"  collectData捕获数: {final.get('collectCount')}")
    print(f"  滑块移动历史(最后5): {final.get('sliderMoves')}")
    
    if final.get('collectCount', 0) > 0:
        print("\n[!!!] 成功捕获collectData请求!")
        for item in final.get('collectData', []):
            print(f"  URL: {item['url']}")
            print(f"  Body长度: {item['bodyLen']}")
            print(f"  Body预览: {item['bodyPreview']}")
            
            # 保存到文件
            body_data = item.get('bodyPreview', '')
            if body_data:
                try:
                    parsed = json.loads(body_data[:1000] if len(body_data) > 1000 else body_data)
                    print(f"  解析后的JSON keys: {list(parsed.keys())}")
                except:
                    pass
    else:
        print("\n[-] 未捕获到collectData")
        print("  可能原因: 缺口位置不准确，SDK验证失败")
else:
    print("[-] 无法获取最终状态")

ws.close()
print("\n[+] 完成")

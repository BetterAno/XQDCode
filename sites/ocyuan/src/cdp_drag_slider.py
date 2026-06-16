"""
通过CDP协议（端口9222）向浏览器发送真实的鼠标事件，拖拽滑块触发collectData
CDP Input.dispatchMouseEvent 产生的事件 isTrusted=true
"""
import json
import time
import math
import random
import urllib.request
import urllib.parse
import websocket  # pip install websocket-client

class CDPClient:
    def __init__(self, port=9222):
        self.port = port
        self.ws = None
        self._msg_id = 0
        
    def get_target(self):
        """获取调试页面"""
        url = f"http://127.0.0.1:{self.port}/json"
        req = urllib.request.urlopen(url, timeout=5)
        pages = json.loads(req.read())
        # 找到 hotel.ocyuan.com 页面
        for page in pages:
            if 'hotel.ocyuan.com' in page.get('url', ''):
                return page
        return pages[0] if pages else None
    
    def connect(self):
        target = self.get_target()
        if not target:
            raise Exception("未找到调试页面")
        ws_url = target['webSocketDebuggerUrl']
        print(f"[CDP] 连接到: {ws_url}")
        self.ws = websocket.WebSocket()
        # 不设置 Origin 头则默认为空，绕过浏览器严格 origin 检查
        self.ws.connect(ws_url, suppress_origin=True)
        print(f"[CDP] 连接成功，页面: {target['url']}")
        return True
    
    def send(self, method, params=None):
        self._msg_id += 1
        msg = {"id": self._msg_id, "method": method, "params": params or {}}
        self.ws.send(json.dumps(msg))
        # 等待对应响应
        while True:
            resp = json.loads(self.ws.recv())
            if resp.get("id") == self._msg_id:
                return resp
            # 忽略事件通知
    
    def evaluate(self, expression):
        """执行JS"""
        result = self.send("Runtime.evaluate", {
            "expression": expression,
            "returnByValue": True,
            "awaitPromise": True
        })
        return result.get("result", {}).get("result", {}).get("value")
    
    def mouse_event(self, event_type, x, y, button="left", buttons=1, click_count=0, delta_x=0, delta_y=0):
        """
        发送鼠标事件 - 这里产生的是 isTrusted=true 的事件
        event_type: mouseMoved | mousePressed | mouseReleased
        """
        params = {
            "type": event_type,
            "x": x,
            "y": y,
            "button": button,
            "buttons": buttons,
            "clickCount": click_count,
            "modifiers": 0,
            "timestamp": time.time() * 1000,
            "deltaX": delta_x,
            "deltaY": delta_y,
            "pointerType": "mouse"
        }
        return self.send("Input.dispatchMouseEvent", params)
    
    def drag_element(self, from_x, from_y, to_x, to_y, duration_ms=1500):
        """
        模拟拖拽操作
        从 (from_x, from_y) 拖拽到 (to_x, to_y)
        duration_ms: 总时长(毫秒)
        """
        print(f"\n[DRAG] 从 ({from_x:.0f}, {from_y:.0f}) 拖拽到 ({to_x:.0f}, {to_y:.0f})")
        
        # 1. 移动到起始位置
        self.mouse_event("mouseMoved", from_x, from_y, button="none", buttons=0)
        time.sleep(0.05)
        
        # 2. 按下鼠标
        self.mouse_event("mousePressed", from_x, from_y, button="left", buttons=1, click_count=1)
        print(f"[DRAG] mousedown at ({from_x:.0f}, {from_y:.0f})")
        time.sleep(0.1)
        
        # 3. 生成人类化轨迹
        steps = self._generate_track(from_x, from_y, to_x, to_y, duration_ms)
        
        # 4. 发送 mousemove 事件
        for i, (x, y, delay) in enumerate(steps):
            self.mouse_event("mouseMoved", x, y, button="left", buttons=1)
            if i % 5 == 0:
                print(f"[DRAG] mousemove {i+1}/{len(steps)}: ({x:.0f}, {y:.0f})")
            time.sleep(delay / 1000.0)
        
        # 5. 在目标位置释放鼠标
        time.sleep(0.05)
        self.mouse_event("mouseReleased", to_x, to_y, button="left", buttons=0, click_count=1)
        print(f"[DRAG] mouseup at ({to_x:.0f}, {to_y:.0f})")
        
        # 等待SDK处理
        time.sleep(1.0)
    
    def _generate_track(self, fx, fy, tx, ty, duration_ms):
        """生成人类化的鼠标移动轨迹"""
        dist = tx - fx
        steps = []
        n = max(30, min(100, int(duration_ms / 20)))
        
        for i in range(n):
            t = (i + 1) / n
            # 使用 ease-out 曲线
            progress = 1 - (1 - t) ** 2
            # 加入轻微随机抖动（y方向）
            jitter_y = random.uniform(-2, 2) * (1 - t)
            x = fx + dist * progress
            y = fy + jitter_y
            # 帧时间：加速阶段短，减速阶段长
            if t < 0.3:
                frame_delay = 10 + random.randint(0, 5)
            elif t < 0.7:
                frame_delay = 15 + random.randint(0, 10)
            else:
                frame_delay = 20 + random.randint(0, 15)
            steps.append((x, y, frame_delay))
        
        return steps
    
    def close(self):
        if self.ws:
            self.ws.close()


def get_gap_position():
    """获取当前验证码缺口位置（通过canvas匹配）"""
    # 这里用之前分析的值，实际上应该每次重新检测
    # 从最新 getQuestion 响应，xposition=62733
    # 根据经验，实际像素位置约为46px（在260px宽的画布中）
    return 46


def run_drag_test():
    print("=" * 60)
    print("CDP 真实鼠标事件拖拽测试")
    print("=" * 60)
    
    cdp = CDPClient(port=9222)
    
    try:
        cdp.connect()
        
        # 获取当前滑块位置
        slider_info = cdp.evaluate("""
            (function() {
                var el = document.querySelector('.index__yrule_slider_block--VCERV');
                if (!el) return null;
                var rect = el.getBoundingClientRect();
                return {x: rect.x, y: rect.y, width: rect.width, height: rect.height, 
                        left: rect.left, top: rect.top};
            })()
        """)
        
        if not slider_info:
            print("[-] 未找到滑块元素，验证码可能未显示")
            print("[*] 尝试刷新验证码...")
            cdp.evaluate("document.querySelector('[class*=\"refresh\"]') && document.querySelector('[class*=\"refresh\"]').click()")
            time.sleep(2)
            slider_info = cdp.evaluate("""
                (function() {
                    var el = document.querySelector('.index__yrule_slider_block--VCERV');
                    if (!el) return null;
                    var rect = el.getBoundingClientRect();
                    return {x: rect.x, y: rect.y, width: rect.width, height: rect.height};
                })()
            """)
        
        if not slider_info:
            print("[-] 仍未找到滑块，退出")
            return
        
        print(f"[+] 滑块位置: x={slider_info['x']}, y={slider_info['y']}, "
              f"size={slider_info['width']}x{slider_info['height']}")
        
        # 安装collect数据捕获Hook
        cdp.evaluate("""
            window.__collectDataList = [];
            var _origFetch = window.fetch;
            window.fetch = async function() {
                var url = typeof arguments[0] === 'string' ? arguments[0] : '';
                if (url.includes('collectData') || url.includes('checkAnswer')) {
                    var body = arguments[1] && arguments[1].body;
                    window.__collectDataList.push({url: url, body: body, ts: Date.now()});
                    console.log('[CDP HOOK] collectData captured!', url);
                }
                return _origFetch.apply(this, arguments);
            };
            'hook installed'
        """)
        print("[+] collectData Hook已安装")
        
        # 计算滑块起始位置（中心）
        start_x = slider_info['x'] + slider_info['width'] / 2
        start_y = slider_info['y'] + slider_info['height'] / 2
        
        # 目标位置（缺口位置）
        gap_x = get_gap_position()
        # 注意：目标x是相对于验证码容器的，需要转换到绝对坐标
        # 验证码容器 x=494.5，宽度260px
        container_x = 494.5
        # gap_x 是缺口位置（像素），需要加上容器偏移
        target_x = container_x + gap_x
        target_y = start_y
        
        print(f"[+] 缺口位置: gap_x={gap_x}px (绝对x={target_x})")
        print(f"[+] 拖拽距离: {target_x - start_x:.0f}px")
        
        # 执行拖拽
        cdp.drag_element(start_x, start_y, target_x, target_y, duration_ms=1800)
        
        # 检查是否有 collectData 请求
        time.sleep(1.5)
        captured = cdp.evaluate("JSON.stringify(window.__collectDataList || [])")
        if captured and captured != '[]':
            data_list = json.loads(captured)
            print(f"\n[!!!] 成功捕获 {len(data_list)} 个 collectData 请求!")
            for item in data_list:
                print(f"  URL: {item['url']}")
                if item.get('body'):
                    print(f"  Body (前200): {str(item['body'])[:200]}")
        else:
            print("\n[-] 未捕获到 collectData 请求")
            
            # 查看滑块当前状态
            slider_state = cdp.evaluate("""
                (function() {
                    var el = document.querySelector('.index__yrule_slider_block--VCERV');
                    if (!el) return {found: false};
                    return {
                        found: true,
                        styleLeft: el.style.left,
                        rect: JSON.stringify(el.getBoundingClientRect())
                    };
                })()
            """)
            print(f"  滑块状态: {slider_state}")
        
        # 检查控制台日志
        console_logs = cdp.evaluate("window.__hookLogs ? window.__hookLogs.join('\\n') : 'no logs'")
        print(f"\n[控制台Hook日志]:\n{console_logs}")
        
    except Exception as e:
        print(f"[-] 错误: {e}")
        import traceback
        traceback.print_exc()
    finally:
        cdp.close()


if __name__ == "__main__":
    run_drag_test()

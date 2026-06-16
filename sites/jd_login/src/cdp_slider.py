"""
CDP 桥接滑块解决器
通过 websocket 连接已打开的 AdsPower 浏览器(CDP端口65466)
1. 提取滑块背景图和缺口图
2. OpenCV 模板匹配找到缺口距离
3. CDP Input.dispatchMouseEvent 执行拖拽
"""
import json
import time
import base64
import os
import io
import websocket
import cv2
import numpy as np
import http.client

CDP_PORT = 65466  # AdsPower 浏览器 CDP 端口
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'screenshots')


class CDPSliderSolver:
    def __init__(self, cdp_port=CDP_PORT):
        self.cdp_port = cdp_port
        self.ws = None
        self.seq = 0
        self._connect()
        os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    def _connect(self):
        """连接到浏览器 CDP WebSocket"""
        conn = http.client.HTTPConnection("127.0.0.1", self.cdp_port)
        conn.request("GET", "/json")
        tabs = json.loads(conn.getresponse().read())
        conn.close()
        
        # 找到登录页面
        target_tab = None
        for tab in tabs:
            if 'passport.jd.com' in tab.get('url', ''):
                target_tab = tab
                break
        if not target_tab:
            target_tab = tabs[0]
        
        ws_url = target_tab['webSocketDebuggerUrl']
        print(f'Connecting to: {ws_url}')
        self.ws = websocket.create_connection(ws_url)
        
        # 启用必要的域
        self._send('Page.enable')
        self._send('Runtime.enable')
        self._send('Input.enable')
        print('CDP connected and domains enabled')
    
    def _send(self, method, params=None):
        """发送 CDP 命令"""
        self.seq += 1
        msg = {'id': self.seq, 'method': method}
        if params:
            msg['params'] = params
        self.ws.send(json.dumps(msg))
        return self._recv()
    
    def _recv(self):
        """接收 CDP 响应"""
        return json.loads(self.ws.recv())
    
    def evaluate(self, expression):
        """执行 JS 并返回结果"""
        resp = self._send('Runtime.evaluate', {
            'expression': expression,
            'returnByValue': True
        })
        result = resp.get('result', {}).get('result', {})
        return result.get('value')
    
    def get_captcha_images(self):
        """获取滑块背景图和缺口图"""
        js = """
        (function() {
            var mainImg = document.getElementById('main_img');
            var slotImg = document.getElementById('slot_img');
            return JSON.stringify({
                bg: mainImg ? mainImg.src : null,
                slot: slotImg ? slotImg.src : null,
                mainRect: mainImg ? {x: mainImg.getBoundingClientRect().x, y: mainImg.getBoundingClientRect().y, w: mainImg.width, h: mainImg.height} : null,
                slotRect: slotImg ? {x: slotImg.getBoundingClientRect().x, y: slotImg.getBoundingClientRect().y, w: slotImg.width, h: slotImg.height} : null
            });
        })()
        """
        result = self.evaluate(js)
        if not result:
            return None
        data = json.loads(result)
        
        # 保存图片
        if data.get('bg'):
            bg_path = self._save_b64(data['bg'], 'jd_bg.png')
            data['bg_path'] = bg_path
        if data.get('slot'):
            slot_path = self._save_b64(data['slot'], 'jd_slot.png')
            data['slot_path'] = slot_path
        
        return data
    
    def _save_b64(self, b64_str, filename):
        """保存 base64 图片"""
        if b64_str.startswith('data:'):
            b64_str = b64_str.split(',', 1)[1]
        filepath = os.path.join(OUTPUT_DIR, filename)
        with open(filepath, 'wb') as f:
            f.write(base64.b64decode(b64_str))
        print(f'Saved: {filepath}')
        return filepath
    
    def find_gap(self, bg_path, slot_path):
        """使用 OpenCV 模板匹配找缺口"""
        bg = cv2.imread(bg_path)
        slot = cv2.imread(slot_path)
        
        if bg is None or slot is None:
            print('Failed to load images')
            return None
        
        # 模板匹配
        result = cv2.matchTemplate(bg, slot, cv2.TM_CCOEFF_NORMED)
        _, _, _, max_loc = cv2.minMaxLoc(result)
        
        gap_x = max_loc[0]
        print(f'Gap found at x={gap_x} (slot width={slot.shape[1]})')
        
        # 在背景图上标记缺口
        h, w = slot.shape[:2]
        cv2.rectangle(bg, max_loc, (max_loc[0] + w, max_loc[1] + h), (0, 0, 255), 2)
        cv2.imwrite(os.path.join(OUTPUT_DIR, 'jd_gap_result.png'), bg)
        
        return gap_x
    
    def get_slider_button_pos(self):
        """获取滑块按钮位置"""
        js = """
        (function() {
            var btn = document.querySelector('.sp_msg, .slide_btn, [class*=\"slider_btn\"], .drag_btn');
            if (!btn) {
                // 尝试找 slide_path 内的可拖拽元素
                var path = document.querySelector('.slide_path');
                if (path) {
                    var rect = path.getBoundingClientRect();
                    return JSON.stringify({x: rect.x, y: rect.y + rect.height/2, w: rect.width, h: rect.height});
                }
                return null;
            }
            var rect = btn.getBoundingClientRect();
            return JSON.stringify({x: rect.x + rect.width/2, y: rect.y + rect.height/2, w: rect.width, h: rect.height});
        })()
        """
        result = self.evaluate(js)
        if not result:
            return None
        return json.loads(result)
    
    def drag_slider(self, start_x, start_y, distance, steps=50):
        """使用 CDP Input.dispatchMouseEvent 执行拖拽"""
        # Mouse pressed
        self._send('Input.dispatchMouseEvent', {
            'type': 'mousePressed',
            'x': start_x,
            'y': start_y,
            'button': 'left',
            'clickCount': 1
        })
        
        # 生成人类化轨迹 (先快后慢 + 微抖动)
        import random
        current = 0
        for i in range(steps):
            # 加速阶段 (前半段) / 减速阶段 (后半段)
            progress = i / steps
            if progress < 0.5:
                # 加速
                move = int(2 + progress * 6)
            elif progress < 0.85:
                # 匀速
                move = int(4 + random.uniform(-1, 1))
            else:
                # 减速 + 末端微调
                move = int(1 + random.uniform(-0.5, 0.5))
            
            current += move
            if current > distance:
                current = distance
            
            x = start_x + current
            y = start_y + random.randint(-1, 1)
            
            self._send('Input.dispatchMouseEvent', {
                'type': 'mouseMoved',
                'x': x,
                'y': y,
                'button': 'left',
                'modifiers': 0
            })
            
            time.sleep(0.01 + random.uniform(0, 0.02))
        
        # 到达终点后稍微停留
        time.sleep(0.1)
        
        # Mouse released
        self._send('Input.dispatchMouseEvent', {
            'type': 'mouseReleased',
            'x': start_x + distance,
            'y': start_y,
            'button': 'left',
            'clickCount': 1
        })
        
        print(f'Drag completed: {distance}px')
    
    def solve(self):
        """完整滑块解决流程"""
        print('=== Step 1: Getting captcha images ===')
        images = self.get_captcha_images()
        if not images or not images.get('bg_path'):
            print('Failed to get captcha images')
            return False
        
        print('=== Step 2: Finding gap ===')
        gap_x = self.find_gap(images['bg_path'], images['slot_path'])
        if gap_x is None:
            print('Failed to find gap')
            return False
        
        # 计算实际拖拽距离 (需要考虑图片缩放)
        # main_img natural size vs display size
        main_rect = images.get('mainRect', {})
        display_w = main_rect.get('w', 290)
        
        js_natural = self.evaluate("document.getElementById('main_img').naturalWidth")
        natural_w = js_natural if js_natural else 275
        
        scale = display_w / natural_w if natural_w else 1.0
        actual_distance = gap_x * scale
        print(f'Scale: {scale:.3f}, natural_w: {natural_w}, display_w: {display_w}')
        print(f'Gap: {gap_x}px (natural), Actual distance: {actual_distance:.1f}px')
        
        print('=== Step 3: Getting slider button position ===')
        btn_pos = self.get_slider_button_pos()
        if not btn_pos:
            print('Failed to get slider button position')
            return False
        
        print(f'Slider button at: x={btn_pos["x"]}, y={btn_pos["y"]}')
        
        print('=== Step 4: Dragging slider ===')
        self.drag_slider(
            start_x=int(btn_pos['x']),
            start_y=int(btn_pos['y']),
            distance=int(actual_distance)
        )
        
        print('=== Step 5: Waiting for verification ===')
        time.sleep(3)
        
        # 检查结果
        result = self.evaluate("""
        (function() {
            var modal = document.querySelector('.captcha_modal');
            if (!modal || modal.style.display === 'none') return 'captcha_closed';
            var errEl = document.querySelector('.errTip, [class*=\"error\"]');
            if (errEl) return 'error';
            return 'unknown';
        })()
        """)
        print(f'Result: {result}')
        
        return result == 'captcha_closed'
    
    def close(self):
        if self.ws:
            self.ws.close()
            print('CDP connection closed')


if __name__ == '__main__':
    solver = CDPSliderSolver()
    success = solver.solve()
    print(f'\nSlider solved: {success}')
    solver.close()

"""
Verify5 滑块验证码纯协议求解器

完整验证流程:
1. 加载页面 → 提取验证码参数
2. WebSocket 连接 → 获取 captcha 配置
3. 下载图片 → 缺口识别
4. 生成轨迹 → 加密提交
5. 获取验证结果

技术方案: WebSocket + AES-256-CTR 纯 Python 实现
"""

import json
import time
import base64
import hashlib
import uuid
import logging
from typing import Dict, Any, Optional, Tuple, Callable

try:
    import websocket
    HAS_WEBSOCKET = True
except ImportError:
    HAS_WEBSOCKET = False

from core.crypto import (
    murmur_hash_128,
    y_decrypt,
    verify5_decrypt,
    verify5_encrypt_message,
    random_hex
)
from core.slider_solver import (
    detect_gap_multi_canny,
    detect_gap_yunma,
    detect_gap_hybrid,
    generate_track,
    compute_track_string,
    init_yunma_client,
)
from src.session import Verify5Session

logger = logging.getLogger(__name__)


class Verify5Captcha:
    """
    Verify5 滑块验证码纯协议求解器
    
    实现完整的滑块验证流程，使用 WebSocket 通信和 Python 纯算法加密
    """
    
    SDK_VERSION = "2.6.2"
    WS_PROTOCOL = f"verify5-{SDK_VERSION}"
    
    def __init__(self, config: Optional[Dict] = None):
        self.config = config or {}
        self.http = Verify5Session(config)
        
        # 验证状态
        self.captcha_id = None      # captcha 实例 ID
        self.session_key = None     # WebSocket session key (16 hex chars)
        self.aes_key = None         # 派生的 AES key
        self.fingerprint_hash = None  # 指纹哈希
        
        # WebSocket
        self.ws = None
        self.ws_connected = False
        self.ws_message_buffer = ""
        self.ws_pending_responses = {}
        
        # 滑块数据
        self.bg_url = None
        self.slice_url = None
        self.slice_offset = 0  # 滑块初始 X 偏移
        self.gap_method = "hybrid"  # opencv | yunma | hybrid
        self.captcha_token = None
        
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def load_page(self) -> bool:
        """加载演示页面"""
        resp = self.http.get("https://www.verify5.com/demo")
        if resp.status_code != 200:
            self.logger.error(f"Page load failed: {resp.status_code}")
            return False
        
        self.logger.info("Page loaded successfully")
        return True
    
    def get_fingerprint(self) -> str:
        """
        生成浏览器指纹
        
        Verify5 使用 fingerprintjs v2 风格的指纹采集:
        - 标准属性 (userAgent, language, screen等)
        - 组合后通过 MurmurHash3 x64 128-bit 哈希
        """
        # 构造指纹数据 (模拟真实浏览器的指纹)
        fingerprint_data = {
            "userAgent": self.http.session.headers.get("User-Agent", 
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0"),
            "language": "zh-CN",
            "colorDepth": 24,
            "deviceMemory": "not available",
            "pixelRatio": 1,
            "hardwareConcurrency": 8,
            "screenResolution": [1920, 1080],
            "availableScreenResolution": [1920, 1040],
            "timezoneOffset": -480,  # UTC+8
            "timezone": "Asia/Shanghai",
            "sessionStorage": 1,
            "localStorage": 1,
            "indexedDb": 1,
            "addBehavior": 0,
            "openDatabase": 0,
            "cpuClass": "not available",
            "platform": "Win32",
            "doNotTrack": "not available",
            "plugins": "Chrome PDF Plugin::Portable Document Format::internal-pdf-viewer~Chrome PDF Viewer~pdf",
            "canvas": "canvas winding:yes~canvas fp:data:image/png;base64,placeholder",
            "webgl": "webgl aliased line width range:[1, 1]~extensions:EXT_color_buffer_float~webgl renderer:ANGLE",
            "adBlock": 0,
            "hasLiedLanguages": 0,
            "hasLiedResolution": 0,
            "hasLiedOs": 0,
            "hasLiedBrowser": 0,
            "touchSupport": [0, 0, 0],
            "fonts": "Arial~Times New Roman~Courier New",
            "audio": "35.7383295930922"  # 简化的音频指纹
        }
        
        # 转换为 fingerprintjs v2 格式的字符串
        fp_parts = []
        for key in sorted(fingerprint_data.keys()):
            val = fingerprint_data[key]
            if isinstance(val, list):
                val = ";".join(str(v) for v in val)
            fp_parts.append(f"{key}:{val}")
        
        fp_string = "~~~".join(fp_parts)
        
        # MurmurHash3 x64 128-bit
        hash_result = murmur_hash_128(fp_string, 31)
        
        self.fingerprint_hash = hash_result
        self.logger.info(f"Fingerprint hash: {hash_result[:16]}...")
        
        return hash_result
    
    def connect_websocket(self) -> bool:
        """建立 WebSocket 连接"""
        if not HAS_WEBSOCKET:
            self.logger.error("websocket-client not installed. Run: pip install websocket-client")
            return False
        
        # Verify5 WebSocket 地址 (从 JS 代码分析得出)
        # 实际生产环境的 WebSocket 地址通常动态获取
        ws_host = self.config.get("ws_host", "wss://verify5.com/ws")
        
        try:
            self.ws = websocket.create_connection(
                ws_host,
                timeout=15,
                header={
                    "User-Agent": self.http.session.headers.get("User-Agent", ""),
                },
                subprotocols=[self.WS_PROTOCOL]
            )
            
            self.ws_connected = True
            self.ws.settimeout(3.0)
            
            self.logger.info(f"WebSocket connected to {ws_host}")
            return True
            
        except Exception as e:
            self.logger.error(f"WebSocket connection failed: {e}")
            return False
    
    def _send_ws_message(self, message_type: str, payload: Dict) -> bool:
        """
        发送加密的 WebSocket 消息
        
        消息格式 (从 JS 代码分析):
        1. 构造消息对象: {l: sessId, f: msgType, o: payload}
        2. JSON 序列化
        3. 追加额外数据 (fingerprint等)
        4. AES-CTR 加密
        5. 分块发送
        """
        if not self.ws_connected:
            self.logger.error("WebSocket not connected")
            return False
        
        try:
            # 构造消息
            msg = {
                "l": self.session_key or "unknown",
                "f": message_type,
                "o": payload
            }
            
            # 特殊消息类型处理 (Ob 初始化消息)
            if message_type == "Ob":
                # 追加指纹数据
                msg_data = json.dumps(msg, separators=(',', ':'))
                msg_data += "|" + self.fingerprint_hash
            else:
                msg_data = json.dumps(msg, separators=(',', ':'))
            
            # AES 加密
            encrypted = verify5_encrypt_message(msg_data, self.aes_key or self.session_key or "default")
            
            # 分块 (1024 bytes per chunk, Safari: 186)
            chunk_size = 1024
            total = (len(encrypted) + chunk_size - 1) // chunk_size
            packet_id = 0  # 递增的包 ID
            
            for i in range(total):
                chunk = encrypted[i * chunk_size:(i + 1) * chunk_size]
                frame = f"{packet_id}|{total}|{i}|{chunk}"
                self.ws.send(frame)
            
            self.logger.debug(f"Sent WS message type={message_type}, {total} chunks")
            return True
            
        except Exception as e:
            self.logger.error(f"WebSocket send failed: {e}")
            return False
    
    def _recv_ws_message(self, timeout: float = 5.0) -> Optional[Dict]:
        """
        接收并解密 WebSocket 消息
        """
        if not self.ws_connected:
            return None
        
        try:
            self.ws.settimeout(timeout)
            result = self.ws.recv()
            
            if not result:
                return None
            
            # 解析分块帧
            if "|" in result:
                parts = result.split("|", 3)
                chunk_data = parts[3] if len(parts) > 3 else result
                self.ws_message_buffer += chunk_data
                
                # 检查是否所有分块已到达
                total_chunks = int(parts[1])
                current_chunk = int(parts[2])
                
                if current_chunk == total_chunks - 1:
                    # 所有分块到达, 解密
                    decrypted = verify5_decrypt(self.ws_message_buffer, 
                        self.aes_key or self.session_key or "default")
                    self.ws_message_buffer = ""
                    
                    # 解析 JSON
                    data = json.loads(decrypted)
                    return data
            else:
                # 不分块的消息
                decrypted = verify5_decrypt(result, 
                    self.aes_key or self.session_key or "default")
                data = json.loads(decrypted)
                return data
            
            return None
            
        except websocket.WebSocketTimeoutException:
            self.logger.debug("WebSocket recv timeout")
            return None
        except Exception as e:
            self.logger.error(f"WebSocket recv failed: {e}")
            return None
    
    def get_captcha_config(self) -> bool:
        """
        获取滑块验证码配置
        
        发送 Ob 消息获取初始化数据
        """
        # 1. 计算指纹
        self.get_fingerprint()
        
        # 2. 连接 WebSocket
        if not self.connect_websocket():
            return False
        
        # 3. 发送初始化消息 (Ob)
        if not self._send_ws_message("Ob", {
            "fingerprint": self.fingerprint_hash,
            "version": self.SDK_VERSION,
        }):
            return False
        
        # 4. 接收初始化响应
        init_response = self._recv_ws_message(timeout=10.0)
        if not init_response:
            self.logger.error("No init response from server")
            return False
        
        self.logger.debug(f"Init response: {json.dumps(init_response, ensure_ascii=False)[:500]}")
        
        # 5. 提取 session key 和其他参数
        session_data = init_response.get("o", {})
        self.session_key = session_data.get("u") or session_data.get("key", "")
        
        # 6. 发送 Vd (验证码获取请求)
        if not self._send_ws_message("Vd", {
            "l": session_data.get("l", ""),
            "z": self.fingerprint_hash
        }):
            return False
        
        # 7. 接收 captcha 配置
        captcha_response = self._recv_ws_message(timeout=10.0)
        if not captcha_response:
            self.logger.error("No captcha config response")
            return False
        
        self.logger.debug(f"Captcha config: {json.dumps(captcha_response, ensure_ascii=False)[:500]}")
        
        captcha_data = captcha_response.get("o", {})
        
        # 8. 提取图片信息
        self.bg_url = captcha_data.get("b", "")
        self.slice_url = captcha_data.get("s", "")
        self.slice_offset = captcha_data.get("r", 0)
        self.captcha_token = captcha_data.get("t", "")
        self.captcha_id = captcha_data.get("u", "")
        
        # 9. 派生 AES key
        if self.session_key:
            encrypted_aes_key = captcha_data.get("e") or captcha_response.get("l", "")
            if encrypted_aes_key:
                self.aes_key = y_decrypt(encrypted_aes_key, self.fingerprint_hash)
            else:
                self.aes_key = self.session_key
        
        self.logger.info(f"Got captcha config: bg={self.bg_url[:50]}..., slice={self.slice_url[:50]}...")
        self.logger.info(f"Offset: {self.slice_offset}, Token: {self.captcha_token[:20]}...")
        
        return bool(self.bg_url and self.slice_url)
    
    def solve(self) -> Optional[str]:
        """
        执行完整的滑块验证流程
        
        Returns:
            验证成功返回 token, 失败返回 None
        """
        # Step 1: 获取验证码配置
        if not self.get_captcha_config():
            self.logger.error("Failed to get captcha config")
            return None
        
        # Step 2: 下载图片
        try:
            bg_content = self.http.download_image(self.bg_url)
            slice_content = self.http.download_image(self.slice_url)
            self.logger.info(f"Downloaded images: bg={len(bg_content)}B, slice={len(slice_content)}B")
        except Exception as e:
            self.logger.error(f"Image download failed: {e}")
            return None
        
        # Step 3: gap detection
        gap_method = getattr(self, 'gap_method', 'hybrid')

        if gap_method == 'yunma':
            distance, debug_info = detect_gap_yunma(self.bg_url, self.slice_url)
        elif gap_method == 'hybrid':
            distance, debug_info = detect_gap_hybrid(self.bg_url, self.slice_url)
        else:
            distance, debug_info = detect_gap_multi_canny(self.bg_url, self.slice_url)
        if distance is None:
            self.logger.error("Gap detection failed")
            return None
        
        method = debug_info.get('method', 'opencv_canny')
        self.logger.info(f"Detected gap distance: {distance}px (method={method}, debug={str(debug_info)[:100]})")
        
        # Step 4: 生成轨迹
        track_raw = generate_track(distance)
        track_string = compute_track_string(track_raw)
        
        self.logger.info(f"Generated track: {len(track_raw)} points")
        
        # Step 5: 重新获取指纹 (滑块操作后的新指纹)
        new_fingerprint = self.get_fingerprint()
        
        # Step 6: 提交验证
        if not self._send_ws_message("Wd", {
            "s": track_string,
            "f": new_fingerprint,
            "z": self.fingerprint_hash,
            "t": self.captcha_token,
            "u": self.captcha_id,
        }):
            return None
        
        # Step 7: 接收验证结果
        verify_response = self._recv_ws_message(timeout=10.0)
        if not verify_response:
            self.logger.error("No verify response")
            return None
        
        self.logger.debug(f"Verify response: {json.dumps(verify_response, ensure_ascii=False)[:500]}")
        
        result_data = verify_response.get("o", {})
        
        if result_data.get("success"):
            token = result_data.get("token", self.captcha_token)
            self.logger.info(f"Verification SUCCESS! Token: {token[:30]}...")
            return token
        else:
            self.logger.warning(f"Verification failed: {result_data.get('msg', 'unknown error')}")
            return None
    
    def close(self):
        """清理资源"""
        if self.ws:
            try:
                self.ws.close()
            except:
                pass
            self.ws_connected = False


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, 
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    
    solver = Verify5Captcha()
    
    if solver.load_page():
        token = solver.solve()
        if token:
            print(f"\n验证成功! Token: {token}")
        else:
            print("\n验证失败!")
    
    solver.close()

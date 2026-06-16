"""
Fcbox Slider CAPTCHA Pure Protocol Implementation
Reverse-engineered from fc_slider_v2.0.js + aes.chunk.js

Sign Algorithm:
    sign = MD5(clientIp + checkId + uuid + trackString)
    trackString = concat all track points: x + y + time

Encryption:
    AES-ECB, PKCS7 padding, key from querySlideImage response
"""

import json
import base64
import hashlib
import time
import random
import requests
from typing import List, Dict, Optional, Tuple
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

try:
    import cv2
    import numpy as np
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False

try:
    import ddddocr
    _ddddocr_solver = ddddocr.DdddOcr(det=False, ocr=False, show_ad=False)
    HAS_DDDDOCR = True
except ImportError:
    HAS_DDDDOCR = False


class FcboxCaptchaSolver:
    BASE_URL = "https://acs.fcbox.com"
    
    def __init__(self, session: Optional[requests.Session] = None, 
                 yunma_token: Optional[str] = None,
                 yunma_type: str = "20111"):
        self.session = session or requests.Session()
        self.yunma_token = yunma_token
        self.yunma_type = yunma_type
        self._setup_headers()
    
    def _setup_headers(self):
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Origin": "https://www.fcbox.com",
            "Referer": "https://www.fcbox.com/",
        })
    
    @staticmethod
    def md5(text: str) -> str:
        return hashlib.md5(text.encode('utf-8')).hexdigest()
    
    @staticmethod
    def aes_encrypt(data: dict, key: str) -> str:
        """AES-ECB encrypt with PKCS7 padding, return base64"""
        plaintext = json.dumps(data, separators=(',', ':'))
        cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
        padded = pad(plaintext.encode('utf-8'), AES.block_size)
        encrypted = cipher.encrypt(padded)
        return base64.b64encode(encrypted).decode('utf-8')
    
    @staticmethod
    def generate_track(distance: int, point_y: int = 0, start_time: Optional[int] = None) -> List[Dict]:
        """Generate human-like slider track with monotonic time intervals
        Args:
            distance: target x position (pixel distance)
            point_y: y value from querySlideImage response (fixed for all track points)
            start_time: starting timestamp in milliseconds
        """
        track = []
        current = 0.0
        mid = distance * 3 / 4
        t = 0.2
        v = 0.0
        start_time = start_time or int(time.time() * 1000)
        current_time = start_time
        
        while current < distance:
            if current < mid:
                a = random.randint(2, 4)
            else:
                a = -random.randint(3, 5)
            v0 = v
            v = v0 + a * t
            move = v0 * t + 0.5 * a * t * t
            current += move
            
            # 确保时间严格单调递增，每次间隔 15-35ms
            current_time += random.randint(15, 35)
            track.append({
                "x": min(int(current), distance),
                "y": point_y,  # y值固定为pointY
                "time": current_time
            })
        
        # Ensure last point hits exactly
        if track and track[-1]["x"] != distance:
            current_time += random.randint(20, 50)
            track.append({
                "x": distance,
                "y": point_y,  # y值固定为pointY
                "time": current_time
            })
        
        return track
    
    @staticmethod
    def build_track_string(track: List[Dict]) -> str:
        """Build track string for sign: x + y + time for each point"""
        return ''.join([f"{t['x']}{t['y']}{t['time']}" for t in track])
    
    def query_slide_image(self, uid: Optional[str] = None) -> Optional[Tuple[str, Dict]]:
        """Query slide captcha image and metadata
        Returns (uuid, data) tuple, uuid is needed for checkCode URL
        """
        import uuid as _uuid
        self._uid = uid or str(_uuid.uuid4())
        url = f"{self.BASE_URL}/captcha/querySlideImage/{self._uid}"
        resp = self.session.post(url, timeout=15)
        if resp.status_code != 200:
            return None
        data = resp.json()
        if not data.get('success'):
            return None
        return data.get('data')
    
    def solve_with_ddddocr(self, shade_content: bytes, slide_content: bytes) -> Optional[int]:
        """Use ddddocr slide matching to find gap position."""
        if not HAS_DDDDOCR:
            return None
        
        try:
            result = _ddddocr_solver.slide_match(
                slide_content, shade_content, simple_target=True
            )
            distance = result.get('target_x')
            confidence = result.get('confidence', 0)
            print(f"[Captcha] ddddocr: distance={distance}, confidence={confidence:.4f}")
            return distance
        except Exception as e:
            print(f"[Captcha] ddddocr error: {e}")
            return None
    
    def solve_with_opencv(self, shade_content: bytes, slide_content: bytes) -> Optional[int]:
        """Use OpenCV edge-based template matching to find gap position.
        IMPORTANT: Only use edge matching - grayscale matching is INACCURATE for this captcha.
        Edge(50,150) is the most reliable Canny threshold combination.
        """
        if not HAS_CV2:
            return None

        try:
            shade_arr = np.frombuffer(shade_content, np.uint8)
            shade_cv = cv2.imdecode(shade_arr, cv2.IMREAD_COLOR)
            slide_arr = np.frombuffer(slide_content, np.uint8)
            slide_cv = cv2.imdecode(slide_arr, cv2.IMREAD_COLOR)

            if shade_cv is None or slide_cv is None:
                print("[Captcha] OpenCV: image decode failed")
                return None

            shade_gray = cv2.cvtColor(shade_cv, cv2.COLOR_BGR2GRAY)
            slide_gray = cv2.cvtColor(slide_cv, cv2.COLOR_BGR2GRAY)

            # Edge-based matching only - try multiple Canny thresholds
            results = []
            for low, high in [(50, 150), (100, 200), (80, 180)]:
                shade_edge = cv2.Canny(shade_gray, low, high)
                slide_edge = cv2.Canny(slide_gray, low, high)
                result = cv2.matchTemplate(shade_edge, slide_edge, cv2.TM_CCOEFF_NORMED)
                _, max_val, _, max_loc = cv2.minMaxLoc(result)
                results.append((f"edge({low},{high})", max_loc[0], max_val))

            for name, x, conf in results:
                print(f"  {name}: x={x}, conf={conf:.4f}")

            # Use the best edge result (highest confidence)
            if not results:
                return None

            best = max(results, key=lambda r: r[2])
            distance = best[1]
            best_conf = best[2]

            if best_conf < 0.10:
                print(f"[Captcha] OpenCV: confidence too low ({best_conf:.4f})")
                return None

            print(f"[Captcha] OpenCV: distance={distance}, confidence={best_conf:.4f}")
            return distance
        except Exception as e:
            print(f"[Captcha] OpenCV error: {e}")
            return None
    
    def solve_with_yunma(self, shade_url: str, slide_url: str) -> Optional[int]:
        """Call Yunma API to recognize gap position"""
        if not self.yunma_token:
            raise ValueError("yunma_token is required for image recognition")
        
        try:
            shade_resp = self.session.get(shade_url, timeout=15)
            slide_resp = self.session.get(slide_url, timeout=15)
            
            if shade_resp.status_code != 200 or slide_resp.status_code != 200:
                return None
            
            yunma_payload = {
                "slide_image": base64.b64encode(slide_resp.content).decode('utf-8'),
                "background_image": base64.b64encode(shade_resp.content).decode('utf-8'),
                "token": self.yunma_token,
                "type": self.yunma_type
            }
            
            resp = requests.post(
                "http://api.jfbym.com/api/YmServer/customApi",
                json=yunma_payload,
                timeout=30
            )
            result = resp.json()
            if result.get('code') == 10000:
                inner = result.get('data', {})
                if inner.get('code') == 0:
                    return int(inner['data'])
            return None
        except Exception as e:
            print(f"Yunma API error: {e}")
            return None
    
    def calculate_sign(self, client_ip: str, key: str, uuid: str, check_id: str, track: List[Dict]) -> str:
        """Calculate verification sign
        sign = MD5(clientIp + checkId + uuid + trackString)
        注意：第二参数是 checkId，不是 key
        """
        track_str = self.build_track_string(track)
        sign_raw = f"{client_ip}{check_id}{uuid}{track_str}"
        return self.md5(sign_raw)
    
    def check_code(self, uuid: str, key: str, check_id: str, client_ip: str,
                   track: List[Dict]) -> dict:
        """Submit verification and return full response dict
        Note: URL path uses uuid (same as querySlideImage), NOT checkId
        On failure, response contains new checkId for retry on same session.
        """
        sign = self.calculate_sign(client_ip, key, uuid, check_id, track)
        payload = {
            "sign": sign,
            "track": track
        }
        encrypted = self.aes_encrypt(payload, key)

        # 关键：checkCode URL 用的是 UUID，不是 checkId
        # Content-Type: text/plain (JS源码确认: setRequestHeader('Content-Type', 'text/plain'))
        # int8:true 时直接发送 base64 字符串，不 JSON.stringify
        url = f"{self.BASE_URL}/captcha/checkCode/{uuid}"
        resp = self.session.post(url, data=encrypted, headers={
            "Content-Type": "text/plain"
        }, timeout=15)

        if resp.status_code != 200:
            return {"success": False, "code": -1}

        return resp.json()
    
    def solve(self, max_retries: int = 5, use_yunma: bool = True) -> Optional[str]:
        """
        Full captcha solving flow with same-session retry.
        
        Key improvements:
        - OpenCV edge matching is the PRIMARY method (proven 80%+ accuracy)
        - yunma is FALLBACK only (returns offset distance, ~12-15px too high)
        - Same-session retry: on failure, server returns new checkId, reuse uid+key
        - Multiple recognition candidates tried in sequence on same session
        
        Returns token if successful, None otherwise.
        """
        slide_data = self.query_slide_image()
        if not slide_data:
            print("[Captcha] Failed to query slide image")
            return None

        uid = self._uid
        check_id = slide_data['checkId']
        key = slide_data['key']
        client_ip = slide_data.get('clientIp', '')
        point_x = slide_data.get('pointX', 0)
        point_y = slide_data.get('pointY', 0)
        shade_url = slide_data.get('shadeImageUrl')
        slide_url = slide_data.get('slideImageUrl')

        print(f"[Captcha] uid={uid[:8]}..., pointX={point_x}, pointY={point_y}")

        # Download images
        shade_content = None
        slide_content = None
        if shade_url and slide_url:
            try:
                shade_resp = self.session.get(shade_url, timeout=15)
                slide_resp = self.session.get(slide_url, timeout=15)
                if shade_resp.status_code == 200 and slide_resp.status_code == 200:
                    shade_content = shade_resp.content
                    slide_content = slide_resp.content
            except Exception as e:
                print(f"[Captcha] Image download failed: {e}")

        if not shade_content or not slide_content:
            print("[Captcha] Cannot download images")
            return None

        # Collect distance candidates: OpenCV FIRST (most accurate), then yunma
        candidates = []

        # PRIMARY: OpenCV edge matching (80%+ success rate)
        cv_dist = self.solve_with_opencv(shade_content, slide_content)
        if cv_dist:
            candidates.append(("opencv", cv_dist))

        # FALLBACK: yunma (distance is ~12-15px too high, but sometimes works)
        if use_yunma and self.yunma_token:
            yunma_dist = self.solve_with_yunma_bytes(shade_content, slide_content)
            if yunma_dist:
                candidates.append(("yunma", yunma_dist))
                # yunma is consistently 12-15px too high, add corrected version
                candidates.append(("yunma-13", yunma_dist - 13))

        # Additional: average of opencv and yunma
        if cv_dist and yunma_dist:
            avg = (cv_dist + yunma_dist) // 2
            candidates.append(("avg", avg))

        if not candidates:
            print("[Captcha] No recognition method available")
            return None

        # Try each candidate on the SAME session
        # Note: server allows ~2 attempts per session before blocking (400400005)
        current_check_id = check_id
        attempts = 0

        for name, distance in candidates:
            if distance < 5 or distance > 330:
                continue
            if attempts >= 2:  # Max 2 attempts per session to avoid 400400005
                break

            track = self.generate_track(distance, point_y=point_y)
            result = self.check_code(uid, key, current_check_id, client_ip, track)
            attempts += 1

            if result.get('success'):
                token = result.get('data', {}).get('token')
                print(f"[Captcha] SUCCESS! method={name}, dist={distance}, token={token}")
                return token

            # On failure, update checkId for next attempt
            new_check = result.get('data', {}).get('checkId')
            if new_check:
                current_check_id = new_check

            code = result.get('code', '?')
            print(f"[Captcha] {name} dist={distance}: FAIL(code={code})")
            time.sleep(0.1)

        print("[Captcha] All candidates failed")
        return None

    def solve_with_yunma_bytes(self, shade_content: bytes, slide_content: bytes) -> Optional[int]:
        """Call Yunma API with raw image bytes"""
        if not self.yunma_token:
            return None
        try:
            yunma_payload = {
                "slide_image": base64.b64encode(slide_content).decode('utf-8'),
                "background_image": base64.b64encode(shade_content).decode('utf-8'),
                "token": self.yunma_token,
                "type": self.yunma_type
            }
            resp = requests.post(
                "http://api.jfbym.com/api/YmServer/customApi",
                json=yunma_payload,
                timeout=30
            )
            result = resp.json()
            if result.get('code') == 10000:
                inner = result.get('data', {})
                if inner.get('code') == 0:
                    dist = int(inner['data'])
                    print(f"[Captcha] Yunma: distance={dist}")
                    return dist
            print(f"[Captcha] Yunma failed: {result}")
            return None
        except Exception as e:
            print(f"[Captcha] Yunma error: {e}")
            return None


if __name__ == "__main__":
    solver = FcboxCaptchaSolver(yunma_token="tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI")
    # Retry up to 3 times with fresh sessions
    for attempt in range(3):
        token = solver.solve()
        if token:
            print(f"Result: {token}")
            break
        print(f"[Captcha] Retry {attempt+1}/3...")
        time.sleep(0.5)
    else:
        print("Result: None")

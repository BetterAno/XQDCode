"""
京东 jcap 滑块验证码 - 纯本地协议验证脚本
===========================================
基于 Node.js WASM 补环境 (jcap_env.js) 生成加密参数，
Python 端发送 HTTP 请求，完成完整的滑块验证流程。

流程:
  1. 从登录页获取新鲜 sid
  2. jcap_env 生成 ct → POST /cgi-bin/api/fp → 获取 st
  3. jcap_env 生成 tk → POST /cgi-bin/api/check → 获取验证码图片
  4. 滑块缺口识别 (OpenCV 模板匹配 / 云码)
  5. 轨迹生成 (4阶段模拟人类行为)
  6. jcap_env 生成 tk+ct+cs → POST /cgi-bin/api/check → 验证提交
  7. 多轮验证支持
"""
import json
import time
import base64
import os
import re
import math
import random
import urllib.parse
from typing import Dict, Any, Optional, Tuple, List
from urllib.parse import urlencode

try:
    from curl_cffi import requests as cffi_requests
    HAS_CURL_CFFI = True
except ImportError:
    import requests as cffi_requests
    HAS_CURL_CFFI = False

from config import (
    LOGIN_PAGE, UA, DEFAULT_HEADERS
)
from node_bridge import JcapSession

# ============================================================
# 常量
# ============================================================
JCAP_FP_API = "https://jcap.m.jd.com/cgi-bin/api/fp"
JCAP_CHECK_API = "https://jcap.m.jd.com/cgi-bin/api/check"
GRAPHIC_SID_REFRESH = "https://passport.jd.com/uc/graphic/sessionId/refresh"
YUNCODE_TOKEN = "tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI"

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'screenshots')


class JDCaptchaSolver:
    """京东滑块验证码本地协议求解器"""

    def __init__(self, proxy: Optional[str] = None):
        self.proxy = proxy
        self.session = cffi_requests.Session()
        if HAS_CURL_CFFI:
            self.session.impersonate = "chrome131"
        if proxy:
            self.session.proxies = {"http": proxy, "https": proxy}
        self.session.headers.update(DEFAULT_HEADERS)

        # 会话状态
        self.session_id: Optional[str] = None   # si
        self.server_token: Optional[str] = None  # st (from fp response)
        self.check_st: Optional[str] = None      # st (from check response)
        self.jwt_token: Optional[str] = None
        self.app_id: str = "1000803"
        self.status: str = "1"

        # jcap 加密参数
        self.ct: Optional[str] = None
        self.tk: Optional[str] = None
        self.cs: Optional[str] = None
        self.instance_id: Optional[str] = None  # WASM 实例 ID（ii）

        # 验证码
        self.bg_image: Optional[bytes] = None
        self.slot_image: Optional[bytes] = None
        self.gap_x: Optional[int] = None
        self.captcha_type: Optional[int] = None  # tp

        os.makedirs(OUTPUT_DIR, exist_ok=True)

    # ============================================================
    # Step 1: 获取新鲜 sessionId
    # ============================================================
    def get_fresh_sid(self) -> bool:
        """从登录页获取或刷新 sessionId"""
        print("\n[Step 1] 获取新鲜 sessionId ...")
        try:
            resp = self.session.get(LOGIN_PAGE, timeout=15)
            if resp.status_code != 200:
                print(f"  [ERROR] 登录页 HTTP {resp.status_code}")
                return False
            html = resp.text

            def _extract(pattern: str) -> Optional[str]:
                m = re.search(pattern, html)
                return m.group(1) if m else None

            self.app_id = _extract(r'id="graphicCaptchaAppId"[^>]*value="([^"]+)"') or self.app_id
            self.status = _extract(r'id="graphicCaptchaStatus"[^>]*value="([^"]+)"') or self.status
            self.session_id = _extract(r'id="graphicCaptchaSessionId"[^>]*value="([^"]+)"')
            self.jwt_token = _extract(r'id="graphicCaptchaJwtToken"[^>]*value="([^"]+)"')

            print(f"  appId={self.app_id}, status={self.status}")
            print(f"  sessionId: {(self.session_id or '(none)')[:40]}...")

            if not self.session_id:
                print("  sessionId 为空，调用 /uc/graphic/sessionId/refresh ...")
                return self._refresh_sid()

            return True
        except Exception as e:
            print(f"  [ERROR] 获取登录页异常: {e}")
            return False

    def _refresh_sid(self) -> bool:
        try:
            r = self.session.get(
                GRAPHIC_SID_REFRESH,
                params={"appId": self.app_id},
                timeout=10,
            )
            if r.status_code == 200:
                try:
                    data = r.json()
                    if data.get("code") == 1:
                        self.session_id = data.get("sessionId") or self.session_id
                        self.jwt_token = data.get("jwtToken") or self.jwt_token
                        print(f"  刷新成功: sessionId={self.session_id[:40] if self.session_id else ''}...")
                        return True
                    else:
                        print(f"  刷新失败 code={data.get('code')} msg={data.get('msg')}")
                except Exception:
                    print(f"  刷新响应非 JSON: {r.text[:150]}")
            else:
                print(f"  刷新 HTTP {r.status_code}")
        except Exception as e:
            print(f"  刷新异常: {e}")
        return False

    # ============================================================
    # Step 2: jcap fp 请求（获取 server token）
    # ============================================================
    def step_fp(self, jcap: JcapSession) -> bool:
        """生成 ct → POST /cgi-bin/api/fp → 获取 st"""
        print("\n[Step 2] jcap fp 请求 ...")
        if not self.session_id:
            print("  [ERROR] 缺 sessionId")
            return False

        option = self._build_jcap_option()

        # 1. 生成 ct
        print("  生成 ct (get_ct_direct)...")
        try:
            r = jcap.get_ct_direct(sid=self.session_id, option=option)
            if not r.get("ok"):
                print(f"  [ERROR] get_ct_direct: {r.get('error')}")
                return False
            self.ct = r.get("ct")
            if not self.ct:
                print("  [ERROR] ct 为空")
                return False
            self.instance_id = str(r.get("instanceId", "")) if r.get("instanceId") else None
            print(f"  ct = {self.ct[:80]}... ({len(self.ct)} chars), ii={self.instance_id}")
        except Exception as e:
            print(f"  [ERROR] get_ct_direct 异常: {e}")
            return False

        # 2. POST /cgi-bin/api/fp
        print("  发送 POST /cgi-bin/api/fp ...")
        try:
            body = urlencode({
                "si": self.session_id,
                "ct": self.ct,
                "version": 3,
                "lang": 1,
                "client": "pc",
            })
            headers = {
                "User-Agent": UA,
                "Accept": "*/*",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Origin": "https://passport.jd.com",
                "Referer": "https://passport.jd.com/",
                "Content-Type": "application/x-www-form-urlencoded",
            }
            resp = self.session.post(JCAP_FP_API, data=body, headers=headers, timeout=15)
            print(f"  fp HTTP {resp.status_code} body: {resp.text[:300]}")
            if resp.status_code != 200:
                return False
            fp_json = resp.json()
            code = fp_json.get("code")
            s_code = fp_json.get("s_code")
            msg = fp_json.get("msg", "")

            if code not in (0, "0") and code is not None:
                print(f"  [WARN] fp 业务码: code={code} s_code={s_code} msg={msg}")
                # 检查是否可以重试
                if code == 16801:
                    print("  需要重新获取 sid...")
                    return False

            self.server_token = fp_json.get("st") or fp_json.get("tk") or ""
            if not self.server_token:
                print("  [WARN] fp 未返回 st")
            else:
                print(f"  st = {self.server_token[:30]}...")

            # 保存 fp token
            self._fp_response = fp_json
            return True
        except Exception as e:
            print(f"  [ERROR] POST /fp 异常: {e}")
            return False

    # ============================================================
    # Step 3: jcap check 请求（获取验证码图片）
    # ============================================================
    def step_check_get_captcha(self, jcap: JcapSession) -> bool:
        """生成 tk → POST /cgi-bin/api/check → 获取验证码图片"""
        print("\n[Step 3] jcap check 请求（获取验证码图片）...")
        if not self.session_id or not self.ct:
            print("  [ERROR] 缺 sessionId 或 ct")
            return False

        # 生成 tk（初始 check，轨迹为空）
        print("  生成 tk (get_tk_direct, empty trajectory)...")
        try:
            st_for_tk = self.server_token or ""
            empty_traj = urllib.parse.quote(json.dumps([]), safe=";/?:@&=+$,-_.!~*'()#")
            r_tk = jcap.get_tk_direct(
                sid=self.session_id,
                st=st_for_tk,
                trajectory=empty_traj,
            )
            if not r_tk.get("ok"):
                print(f"  [ERROR] get_tk_direct: {r_tk.get('error')}")
                return False
            self.tk = r_tk.get("tk")
            if not self.tk:
                print("  [ERROR] tk 为空")
                return False
            print(f"  tk = {self.tk[:80]}... ({len(self.tk)} chars)")
        except Exception as e:
            print(f"  [ERROR] get_tk_direct 异常: {e}")
            return False

        # 重新生成 ct（check 的 ct 可能和 fp 不同）
        print("  重新生成 ct...")
        try:
            r_ct = jcap.get_ct_direct(sid=self.session_id, option=self._build_jcap_option())
            if r_ct.get("ok") and r_ct.get("ct"):
                self.ct = r_ct.get("ct")
                print(f"  ct = {self.ct[:80]}... ({len(self.ct)} chars)")
        except Exception as e:
            print(f"  [WARN] ct 刷新失败: {e}")

        # POST /cgi-bin/api/check
        print("  发送 POST /cgi-bin/api/check ...")
        try:
            body = urlencode({
                "si": self.session_id,
                "lang": 1,
                "tk": self.tk,
                "ct": self.ct,
                "version": 3,
                "client": "pc",
            })
            headers = {
                "User-Agent": UA,
                "Accept": "*/*",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Origin": "https://passport.jd.com",
                "Referer": "https://passport.jd.com/",
                "Content-Type": "application/x-www-form-urlencoded",
            }
            resp = self.session.post(JCAP_CHECK_API, data=body, headers=headers, timeout=15)
            print(f"  check HTTP {resp.status_code} body: {resp.text[:500]}")
            if resp.status_code != 200:
                return False

            check_json = resp.json()
            code = check_json.get("code")
            msg = check_json.get("msg", "")
            self.captcha_type = check_json.get("tp")
            self.check_st = check_json.get("st", "")

            print(f"  code={code}, tp={self.captcha_type}, st={self.check_st[:30] if self.check_st else ''}...")

            if code not in (0, "0"):
                print(f"  [ERROR] check 业务失败: code={code} msg={msg}")
                return False

            # 解析验证码图片
            img_str = check_json.get("img", "")
            if img_str:
                self._parse_captcha_images(img_str)
                if self.bg_image and self.slot_image:
                    print(f"  验证码图片已提取: bg={len(self.bg_image)}B, slot={len(self.slot_image)}B")
                    return True
                else:
                    print("  [WARN] 验证码图片解析失败")
                    return False
            else:
                print("  [WARN] 响应无 img 字段（可能无需验证码）")
                return False
        except Exception as e:
            print(f"  [ERROR] POST /check 异常: {e}")
            return False

    def _parse_captcha_images(self, img_str: str):
        """解析 jcap check 响应的 img JSON"""
        try:
            img_data = json.loads(img_str) if isinstance(img_str, str) else img_str
            # b1 是背景图（含缺口），b2 是滑块图
            for key in ["b1", "b2", "bg", "slot", "background", "slide"]:
                b64 = img_data.get(key, "")
                if b64:
                    if b64.startswith("data:"):
                        b64 = b64.split(",", 1)[1]
                    img_bytes = base64.b64decode(b64)
                    if key in ("b1", "bg", "background"):
                        self.bg_image = img_bytes
                    elif key in ("b2", "slot", "slide"):
                        self.slot_image = img_bytes

            # 保存图片到本地
            if self.bg_image:
                bg_path = os.path.join(OUTPUT_DIR, 'jd_proto_bg.png')
                with open(bg_path, 'wb') as f:
                    f.write(self.bg_image)
                print(f"  背景图保存: {bg_path}")
            if self.slot_image:
                slot_path = os.path.join(OUTPUT_DIR, 'jd_proto_slot.png')
                with open(slot_path, 'wb') as f:
                    f.write(self.slot_image)
                print(f"  滑块图保存: {slot_path}")
        except Exception as e:
            print(f"  [WARN] 图片解析异常: {e}")

    # ============================================================
    # Step 4: 滑块缺口识别
    # ============================================================
    def step_solve_gap(self) -> Optional[int]:
        """识别滑块缺口距离，返回 display 像素（用于轨迹生成）
        
        策略:
        1. OpenCV 多方法匹配（CCOEFF + CCORR）
        2. 置信度检查：CCOEFF >= 0.08 或 CCORR >= 0.35 才采纳
        3. 低置信度自动回退云码
        4. 多种方法交叉验证防止误判
        """
        print("\n[Step 4] 滑块缺口识别 ...")
        if not self.bg_image or not self.slot_image:
            print("  [ERROR] 缺验证码图片")
            return None

        opencv_gap = None
        opencv_confidence = None

        # 方法1: OpenCV 模板匹配
        try:
            import cv2
            import numpy as np
            bg = cv2.imdecode(np.frombuffer(self.bg_image, np.uint8), cv2.IMREAD_COLOR)
            slot = cv2.imdecode(np.frombuffer(self.slot_image, np.uint8), cv2.IMREAD_COLOR)

            if bg is not None and slot is not None:
                natural_w = bg.shape[1]  # 通常是 275
                natural_h = bg.shape[0]  # 通常是 170
                print(f"  图片尺寸: bg={bg.shape}, slot={slot.shape}")

                # 多方法综合匹配，分别记录每个方法的结果
                results = {}
                for method, name in [
                    (cv2.TM_CCOEFF_NORMED, 'CCOEFF'),
                    (cv2.TM_CCORR_NORMED, 'CCORR'),
                ]:
                    result = cv2.matchTemplate(bg, slot, method)
                    _, max_val, _, max_loc = cv2.minMaxLoc(result)
                    results[name] = {"x": max_loc[0], "score": max_val, "method": method}
                    print(f"  {name}: x={max_loc[0]}, score={max_val:.3f}")

                # 置信度评估
                ccoeff = results.get('CCOEFF', {})
                ccorr = results.get('CCORR', {})
                ccoeff_score = ccoeff.get('score', 0)
                ccorr_score = ccorr.get('score', 0)

                # 策略：CCOEFF 高优先（更精确），低分数回退到 CCORR 或云码
                HIGH_CONFIDENCE_CCOEFF = 0.08   # CCOEFF >= 0.08 为高置信
                MID_CONFIDENCE_CCORR = 0.35     # CCORR >= 0.35 为中置信
                WARN_CCOEFF = 0.05               # CCOEFF < 0.05 必须回退
                AGREEMENT_MAX_DIFF = 20          # CCOEFF/CCORR 结果差异超过此值视为不一致

                # 检查两方法结果是否一致
                ccoeff_x = ccoeff.get('x', -999)
                ccorr_x = ccorr.get('x', -999)
                methods_agree = abs(ccoeff_x - ccorr_x) <= AGREEMENT_MAX_DIFF
                if not methods_agree:
                    print(f"  ⚠ 方法不一致: CCOEFF x={ccoeff_x}, CCORR x={ccorr_x} (差{abs(ccoeff_x-ccorr_x)}px)")

                if ccoeff_score >= HIGH_CONFIDENCE_CCOEFF and methods_agree:
                    # CCOEFF 高置信且两方法一致，直接采纳
                    best_x = ccoeff['x']
                    opencv_confidence = "high"
                    print(f"  ✓ CCOEFF 高置信度 ({ccoeff_score:.3f})，两方法一致，采纳 x={best_x}")
                elif ccoeff_score >= HIGH_CONFIDENCE_CCOEFF and not methods_agree:
                    # CCOEFF 分高但两方法不一致 → 用云码裁决
                    print(f"  ⚠ CCOEFF分高({ccoeff_score:.3f})但方法不一致，回退云码")
                    opencv_confidence = "reject"
                elif ccorr_score >= MID_CONFIDENCE_CCORR and methods_agree:
                    # CCOEFF 分低但 CCORR 可靠且一致
                    best_x = ccorr['x']
                    opencv_confidence = "mid"
                    print(f"  ○ CCOEFF 低 ({ccoeff_score:.3f})，回退到 CCORR (x={best_x}, score={ccorr_score:.3f})")
                elif ccoeff_score >= WARN_CCOEFF and methods_agree:
                    # 中等置信，采纳但标记警告
                    best_x = ccoeff['x']
                    opencv_confidence = "low"
                    print(f"  ⚠ CCOEFF 低置信 ({ccoeff_score:.3f})，勉强采纳 x={best_x}")
                else:
                    # 极低置信或方法不一致且CCORR也不可靠，回退云码
                    opencv_confidence = "reject"
                    reason = "方法不一致" if not methods_agree else f"置信度过低 (CCOEFF={ccoeff_score:.3f}, CCORR={ccorr_score:.3f})"
                    print(f"  ✗ {reason}，回退云码")

                if opencv_confidence != "reject":
                    opencv_gap = best_x
                    print(f"  OpenCV 最佳匹配: x={best_x} (自然像素, 置信={opencv_confidence})")

                    # 标记结果
                    h, w = slot.shape[:2]
                    cv2.rectangle(bg, (best_x, 0), (best_x + w, h), (0, 0, 255), 2)
                    result_path = os.path.join(OUTPUT_DIR, 'jd_proto_gap_result.png')
                    cv2.imwrite(result_path, bg)

                    # 计算 display gap
                    display_gap = int(best_x * 290 / natural_w)
                    print(f"  Display gap: {display_gap}px (scale={290/natural_w:.3f})")
                    self.gap_x = display_gap
                    return display_gap
        except Exception as e:
            print(f"  OpenCV 异常: {e}")

        # 方法2: 云码（低置信回退 或 OpenCV 失败时的保底）
        print("  尝试云码识别...")
        try:
            from yuncode_captcha import YunCodeCaptcha
            client = YunCodeCaptcha(YUNCODE_TOKEN)
            ok, x, msg = client.recognize_slide(self.slot_image, self.bg_image)
            if ok and x is not None:
                print(f"  云码识别: x={x}")
                # 云码可能返回自然像素或 display 像素
                # 保守估计：如果 x > 350 或 < 50，可能异常，验证合理性
                if opencv_gap is not None and abs(x - opencv_gap) > 30:
                    # 云码与 OpenCV 差异大，取 OpenCV（可能是云码误判）
                    print(f"  ⚠ 云码({x})与OpenCV({opencv_gap})差异>30，保留OpenCV")
                    self.gap_x = opencv_gap
                    return opencv_gap
                self.gap_x = x
                return x
            print(f"  云码失败: {msg}")
        except Exception as e:
            print(f"  云码异常: {e}")

        # 方法3: 边缘检测兜底（基于背景图差异）
        if opencv_gap is not None:
            print(f"  回退到 OpenCV 低置信结果: x={opencv_gap}")
            self.gap_x = opencv_gap
            return opencv_gap

        return None

    def generate_trajectory(self, target_x: int) -> List[List[int]]:
        """生成模拟人类拖拽轨迹（4阶段模型）"""
        target_x = max(10, target_x)  # 最小 10px
        trajectory = [[0, 0, 0]]  # [x, y, timeDelta]
        cx, cy = 0, 0
        random.seed()

        # Phase 1: 快速启动 (0-15%), 时间间隔递减
        phase1_pct = 0.12
        phase1_end = int(target_x * phase1_pct)
        step_count = max(8, min(14, phase1_end // 2))
        y_dir = random.choice([-1, 1])  # Y方向随机
        for i in range(step_count):
            cx += max(1, phase1_end // step_count + random.randint(0, 1))
            cy += y_dir if i > 1 and random.random() < 0.6 else 0
            dt = max(5, 106 - i * 8 + random.randint(-10, 20))
            if cx <= target_x:
                trajectory.append([min(cx, target_x), cy, dt])

        # Phase 2: 匀速滑行 (12-78%), 步幅2-3px, 间隔5-7ms
        phase2_end = int(target_x * 0.78)
        while cx < phase2_end:
            step = 2 + random.randint(0, 2)
            cx += step
            if random.random() < 0.1:  # 10% 微调Y
                cy += y_dir if cy < 3 else -1
            dt = 5 + random.randint(0, 2)
            trajectory.append([min(cx, target_x), cy, dt])

        # Phase 3: 减速 (78-95%), 步幅1px, 间隔8-18ms
        phase3_end = int(target_x * 0.95)
        y_recovery_dir = 1 if cy <= 0 else -1  # 向0收敛
        while cx < phase3_end:
            cx += 1
            if random.random() < 0.3:
                cy += y_recovery_dir
            dt = 6 + random.randint(0, 15)
            trajectory.append([min(cx, target_x), cy, dt])

        # Phase 4: 微调对齐 (95-100%), 步幅1px, 间隔15-55ms
        while cx < target_x:
            cx += 1
            if random.random() < 0.3:
                cy += random.choice([-1, 0, 1])
            dt = 15 + random.randint(0, 40)
            trajectory.append([cx, cy, dt])

        # 确保终点正确，末端停顿 200-500ms
        if trajectory[-1][0] != target_x:
            trajectory.append([target_x, cy, 350 + random.randint(0, 200)])
        else:
            # 最后一个点的停顿时间加长
            trajectory[-1][2] = max(trajectory[-1][2], 40 + random.randint(0, 80))

        # 去重：移除位置重复的点
        seen = {}
        deduped = []
        for pt in trajectory:
            k = (pt[0], pt[1])
            if k not in seen:
                seen[k] = True
                deduped.append(pt)
        trajectory = deduped

        # 限制点数在合理范围
        if len(trajectory) > 85:
            to_remove = len(trajectory) - 80
            indices = [i for i in range(10, len(trajectory) - 10) if i % 2 == 0]
            for idx in indices[:to_remove]:
                if idx < len(trajectory):
                    trajectory.pop(idx)

        total_time = sum(p[2] for p in trajectory[1:])
        print(f"  轨迹生成: {len(trajectory)} 点, endX={target_x}, totalTime={total_time}ms")

        return trajectory

    def build_trajectory_data(self, trajectory: List[List[int]]) -> Dict[str, Any]:
        """构建轨迹数据对象（浏览器中的 format）"""
        ii = int(self.instance_id) if self.instance_id else 42949672970000
        return {
            "ht": 179,
            "wt": 290,
            "bw": 48,
            "sw": 290,
            "mw": 69,
            "list": trajectory,
            "ii": ii,
        }

    # ============================================================
    # Step 6: 验证提交（verify）
    # ============================================================
    def step_verify(self, jcap: JcapSession, trajectory: List[List[int]]) -> Optional[Dict]:
        """
        提交滑块验证
        生成 tk（含轨迹）+ ct + cs → POST /cgi-bin/api/check
        返回响应 JSON 或 None
        """
        print("\n[Step 6] 提交滑块验证 ...")
        if not self.session_id:
            print("  [ERROR] 缺 sessionId")
            return None

        st_for_verify = self.check_st or self.server_token or ""
        print(f"  st for verify = {st_for_verify[:30]}...")

        # 构建轨迹数据
        traj_data = self.build_trajectory_data(trajectory)
        trajectory_json = json.dumps(traj_data)
        # JS encodeURI 兼容：保留 A-Za-z0-9;/?:@&=+$,-_.!~*'()# 不编码
        trajectory_encoded = urllib.parse.quote(trajectory_json, safe=";/?:@&=+$,-_.!~*'()#")
        print(f"  trajectory JSON: {len(trajectory_json)} chars, encoded: {len(trajectory_encoded)} chars")

        # 一键生成 ct + tk + cs
        print("  生成 ct + tk + cs (get_encrypt_all)...")
        try:
            r = jcap.get_encrypt_all(
                sid=self.session_id,
                st=st_for_verify,
                trajectory=trajectory_encoded,
            )
            if not r.get("ok"):
                print(f"  [ERROR] get_encrypt_all: {r.get('error')}")
                return None
            self.ct = r.get("ct")
            self.tk = r.get("tk")
            self.cs = r.get("cs")
            print(f"  ct = {self.ct[:60]}... ({len(self.ct or '')} chars)")
            print(f"  tk = {self.tk[:60]}... ({len(self.tk or '')} chars)")
            print(f"  cs = {self.cs[:60]}... ({len(self.cs or '')} chars)")
        except Exception as e:
            print(f"  [ERROR] get_encrypt_all 异常: {e}")
            return None

        # POST /cgi-bin/api/check (verify)
        print("  发送 POST /cgi-bin/api/check (verify)...")
        try:
            body = urlencode({
                "si": self.session_id,
                "lang": 1,
                "tk": self.tk,
                "ct": self.ct,
                "cs": self.cs,
                "version": 3,
                "client": "pc",
            })
            headers = {
                "User-Agent": UA,
                "Accept": "*/*",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Origin": "https://passport.jd.com",
                "Referer": "https://passport.jd.com/",
                "Content-Type": "application/x-www-form-urlencoded",
            }
            resp = self.session.post(JCAP_CHECK_API, data=body, headers=headers, timeout=15)
            print(f"  verify HTTP {resp.status_code} body: {resp.text[:500]}")
            if resp.status_code != 200:
                return None

            verify_json = resp.json()
            code = verify_json.get("code")
            msg = verify_json.get("msg", "")
            new_st = verify_json.get("st", "")
            new_img = verify_json.get("img", "")

            print(f"  code={code}, msg={msg}")
            print(f"  st={new_st[:30] if new_st else ''}...")

            # 更新 st
            if new_st:
                self.check_st = new_st

            # 检查是否需要多轮验证
            if code in (0, "0") and new_img:
                print("  [多轮验证] code=0 但返回新图片，需要继续验证")
                self._parse_captcha_images(new_img)
                verify_json["_need_retry"] = True
            elif code in (0, "0"):
                print("  [验证成功] code=0，无新图片")
                verify_json["_need_retry"] = False

            return verify_json
        except Exception as e:
            print(f"  [ERROR] POST verify 异常: {e}")
            return None

    # ============================================================
    # 完整流程
    # ============================================================
    def solve(self, max_rounds: int = 3) -> bool:
        """
        执行完整的滑块验证流程

        Returns:
            True: 验证成功，获取到 vt token
            False: 验证失败
        """
        print("=" * 60)
        print("京东 jcap 滑块验证 - 本地协议求解")
        print("=" * 60)

        # Step 1: 获取 sid
        if not self.get_fresh_sid():
            return False

        # 启动 jcap 补环境
        with JcapSession() as jcap:
            print(f"\n[jcap] 补环境已就绪")
            r_init = jcap.init(option=self._build_jcap_option())
            if not r_init.get("ok"):
                print("[jcap] init 失败")
                return False

            # Step 2: fp 请求
            if not self.step_fp(jcap):
                print("[FAIL] fp 请求失败")
                return False

            time.sleep(0.5)

            # Step 3: check 获取验证码
            if not self.step_check_get_captcha(jcap):
                print("[FAIL] 获取验证码失败")
                return False

            # 多轮验证循环
            for round_num in range(1, max_rounds + 1):
                print(f"\n{'=' * 40}")
                print(f"  第 {round_num} 轮验证")
                print(f"{'=' * 40}")

                # Step 4: 缺口识别
                gap_x = self.step_solve_gap()
                if gap_x is None:
                    print("[FAIL] 缺口识别失败")
                    return False

                # Step 5: 轨迹生成
                # gap_x 已经是 display 像素（由 step_solve_gap 计算）
                print(f"  gap (display): {gap_x}px")
                trajectory = self.generate_trajectory(gap_x)

                # Step 6: verify 提交
                result = self.step_verify(jcap, trajectory)
                if result is None:
                    print("[FAIL] 验证提交失败")
                    return False

                code = result.get("code")
                msg = result.get("msg", "")

                if code in (0, "0"):
                    if result.get("_need_retry"):
                        # 多轮验证，继续下一轮
                        print(f"  → 需要第 {round_num + 1} 轮验证")
                        time.sleep(0.5)
                        continue
                    else:
                        print(f"\n{'=' * 60}")
                        print(f"  ✓ 验证成功！")
                        print(f"  st = {self.check_st}")
                        print(f"{'=' * 60}")
                        return True
                else:
                    # 验证失败
                    print(f"  [验证失败] code={code} s_code={result.get('s_code','')} msg={msg}")
                    if code == 16808:
                        print(f"  错误: 验证未通过（轨迹可疑/位置不符）")
                    elif code == 16807:
                        print(f"  错误: 验证失败（缺口位置或轨迹问题）")
                    # 重试：需要重建完整 session（sid 可能已失效）
                    if round_num < max_rounds:
                        print(f"  重建 session 并重试...")
                        time.sleep(0.5)
                        # 1. 重置 D 实例
                        try:
                            jcap.reset_d_instance(timeout=10.0)
                            print("  D 实例已重置")
                        except Exception as e:
                            print(f"  [WARN] reset_d_instance: {e}")
                        # 2. 获取新鲜 sid
                        if not self.get_fresh_sid():
                            print("[FAIL] 无法获取新 sid")
                            continue
                        # 3. 重新初始化 jcap option
                        r_init = jcap.init(option=self._build_jcap_option())
                        if not r_init.get("ok"):
                            print("[FAIL] jcap init 失败")
                            continue
                        # 4. 重新 fp 请求
                        if not self.step_fp(jcap):
                            print("[FAIL] fp 请求失败")
                            continue
                        time.sleep(0.5)
                        # 5. 重新获取验证码
                        if not self.step_check_get_captcha(jcap):
                            print("[FAIL] 获取验证码失败")
                            continue
                        time.sleep(0.5)
                        continue
                    return False

        print(f"[FAIL] 超过最大轮数 ({max_rounds})")
        return False

    # ============================================================
    # 辅助方法
    # ============================================================
    def _build_jcap_option(self) -> Dict[str, Any]:
        return {
            "account": "",
            "status": self.status,
            "appId": self.app_id,
            "sessionId": self.session_id or "",
            "jwtToken": self.jwt_token or "",
            "bizSource": "pc",
            "scene": "login-pc",
        }

    def get_vt_token(self) -> Optional[str]:
        """获取验证成功后的 vt token（即 check_st）"""
        return self.check_st


# ============================================================
# 主入口
# ============================================================
if __name__ == "__main__":
    solver = JDCaptchaSolver()
    success = solver.solve()
    if success:
        print(f"\n最终 VT Token: {solver.get_vt_token()}")
    else:
        print("\n验证失败")

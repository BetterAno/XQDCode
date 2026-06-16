"""
spiderdemo.cn 字体反爬虫挑战 Solver

机制:
- init API 直接返回真实数字（整数）
- page API 返回混淆字符串 + base64 WOFF2 字体
- 字体将混淆字符映射到不同视觉数字（字符→数字的置换）
- 每个页面独立字体，同一页面所有数字共用同一映射

方案:
1. 用 fontTools 解析 WOFF2 字体
2. 提取 cmap 与 glyf 表，获取每个字符(0-9)的 glyph 几何特征
3. 用 PIL 渲染各字符，通过像素特征识别视觉数字
4. 也可用字体 glyph 坐标特征匹配来验证一致性
"""
import base64
import json
import os
import sys
import tempfile
import time
from io import BytesIO

import requests
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont
import numpy as np

BASE_URL = "https://spiderdemo.cn"
CHALLENGE_TYPE = "font_anti_challenge"
TOTAL_PAGES = 100


class FontAntiSolver:
    def __init__(self, session: requests.Session = None):
        self.session = session or requests.Session()
        self.init_data = None
        self.all_numbers = {}  # page -> [decoded numbers]
        self.font_cache = {}   # page -> font mapping {char: real_digit}
        
    def init_challenge(self) -> dict:
        """调用初始化 API，返回真实数字（仅第1页）"""
        url = f"{BASE_URL}/font_anti/api/challenge/init/"
        resp = self.session.get(url, params={"challenge_type": CHALLENGE_TYPE})
        data = resp.json()
        if not data.get("success"):
            raise Exception(f"初始化失败: {data}")
        self.init_data = data
        print(f"[init] 挑战初始化成功: page_data={data.get('page_data', [])[:3]}...")
        return data
    
    def get_page(self, page: int) -> dict:
        """获取指定页数据：混淆字符串 + 字体"""
        url = f"{BASE_URL}/font_anti/api/font_anti_challenge/page/{page}/"
        resp = self.session.get(url, params={"challenge_type": CHALLENGE_TYPE})
        data = resp.json()
        if not data.get("success"):
            raise Exception(f"获取第{page}页失败: {data}")
        return data
    
    def parse_font_glyph_features(self, b64_font: str) -> dict:
        """解析字体，提取每个字符(0-9)对应 glyph 的几何特征
        
        Returns: {char: {n_contours, xMin, yMin, xMax, yMax, width, height, coords_count}}
        """
        font_bytes = base64.b64decode(b64_font)
        font = TTFont(BytesIO(font_bytes))
        cmap = font.getBestCmap()
        glyf = font["glyf"]
        
        features = {}
        for char in "0123456789":
            codepoint = ord(char)
            glyph_name = cmap.get(codepoint)
            if glyph_name is None:
                print(f"  [WARN] 字符 '{char}' (U+{codepoint:04X}) 不在 cmap 中")
                continue
            glyph = glyf[glyph_name]
            coords, _, _ = glyph.getCoordinates(glyf) if hasattr(glyph, 'getCoordinates') else (None, None, None)
            features[char] = {
                "glyph_name": glyph_name,
                "n_contours": glyph.numberOfContours,
                "xMin": glyph.xMin, "yMin": glyph.yMin,
                "xMax": glyph.xMax, "yMax": glyph.yMax,
                "width": glyph.xMax - glyph.xMin,
                "height": glyph.yMax - glyph.yMin,
                "coords_count": len(coords) if coords is not None else 0,
            }
        font.close()
        return features
    
    def render_char(self, font_path: str, char: str, size: int = 48) -> np.ndarray:
        """用 PIL 渲染单个字符，返回二值化 numpy 数组"""
        img = Image.new("L", (size + 20, size + 20), 255)
        draw = ImageDraw.Draw(img)
        try:
            pil_font = ImageFont.truetype(font_path, size=size)
        except Exception:
            pil_font = ImageFont.load_default()
        # 居中渲染
        bbox = draw.textbbox((0, 0), char, font=pil_font)
        x = (img.width - (bbox[2] - bbox[0])) // 2 - bbox[0]
        y = (img.height - (bbox[3] - bbox[1])) // 2 - bbox[1]
        draw.text((x, y), char, font=pil_font, fill=0)
        arr = np.array(img)
        # 二值化与裁剪
        arr = (arr < 128).astype(np.uint8)
        # 裁剪到内容区域
        rows = np.any(arr, axis=1)
        cols = np.any(arr, axis=0)
        if not rows.any() or not cols.any():
            return arr
        ymin, ymax = np.where(rows)[0][[0, -1]]
        xmin, xmax = np.where(cols)[0][[0, -1]]
        return arr[ymin:ymax + 1, xmin:xmax + 1]
    
    def build_reference_templates(self) -> dict:
        """用系统默认字体渲染数字 0-9 作为参考模板"""
        print("[ref] 构建参考数字模板...")
        templates = {}
        # 使用系统自带字体
        font_candidates = [
            "C:/Windows/Fonts/arial.ttf",
            "C:/Windows/Fonts/calibri.ttf",
            "C:/Windows/Fonts/segoeui.ttf",
            "C:/Windows/Fonts/times.ttf",
        ]
        ref_font = None
        for fp in font_candidates:
            if os.path.exists(fp):
                ref_font = fp
                break
        if ref_font is None:
            print("[WARN] 未找到系统字体，使用 PIL 默认字体")
        
        for digit in range(10):
            char = str(digit)
            if ref_font:
                img = self.render_char(ref_font, char, size=48)
            else:
                img = self.render_char_default(char, size=48)
            templates[digit] = img
            print(f"  数字 {digit}: shape={img.shape}")
        return templates
    
    def render_char_default(self, char: str, size: int = 48) -> np.ndarray:
        """使用 PIL 默认字体渲染"""
        img = Image.new("L", (size + 20, size + 20), 255)
        draw = ImageDraw.Draw(img)
        font = ImageFont.load_default()
        bbox = draw.textbbox((0, 0), char, font=font)
        x = (img.width - (bbox[2] - bbox[0])) // 2 - bbox[0]
        y = (img.height - (bbox[3] - bbox[1])) // 2 - bbox[1]
        draw.text((x, y), char, font=font, fill=0)
        arr = np.array(img)
        arr = (arr < 128).astype(np.uint8)
        rows = np.any(arr, axis=1)
        cols = np.any(arr, axis=0)
        if not rows.any() or not cols.any():
            return arr
        ymin, ymax = np.where(rows)[0][[0, -1]]
        xmin, xmax = np.where(cols)[0][[0, -1]]
        return arr[ymin:ymax + 1, xmin:xmax + 1]
    
    def compare_images_simple(self, img1: np.ndarray, img2: np.ndarray) -> float:
        """简单图像对比：归一化后逐像素 IoU"""
        # 统一尺寸
        h = max(img1.shape[0], img2.shape[0])
        w = max(img1.shape[1], img2.shape[1])
        
        def pad_to(img, target_h, target_w):
            result = np.zeros((target_h, target_w), dtype=img.dtype)
            h_img, w_img = img.shape
            y0 = (target_h - h_img) // 2
            x0 = (target_w - w_img) // 2
            result[y0:y0 + h_img, x0:x0 + w_img] = img
            return result
        
        p1 = pad_to(img1, h, w)
        p2 = pad_to(img2, h, w)
        
        intersection = np.sum(p1 & p2)
        union = np.sum(p1 | p2)
        if union == 0:
            return 0.0
        return intersection / union
    
    def decode_font_mapping_by_features(self, b64_font: str, templates: dict = None) -> dict:
        """通过 glyph 几何特征解码字体映射
        
        核心思路：
        1. 提取 cmap 中 0-9 各字符对应 glyph 的几何特征（轮廓数、bbox等）
        2. 与参考模板特征对比，找出每个 glyph 代表的真实数字
        3. 返回 {混淆字符: 真实数字} 映射
        """
        features = self.parse_font_glyph_features(b64_font)
        
        glyph_list = []
        for char, feat in features.items():
            glyph_list.append({
                "char": char,
                "glyph_name": feat["glyph_name"],
                "width": feat["width"],
                "height": feat["height"],
                "n_contours": feat["n_contours"],
                "area": feat["width"] * feat["height"],
            })
        
        two_contour = [g for g in glyph_list if g["n_contours"] >= 2]
        one_contour = [g for g in glyph_list if g["n_contours"] == 1]
        
        print(f"  [特征] 双轮廓({len(two_contour)}个): {[(g['char'], g['n_contours']) for g in two_contour]}")
        print(f"  [特征] 单轮廓({len(one_contour)}个): {[(g['char'], g['n_contours']) for g in one_contour]}")
        
        # 优先用渲染+模板匹配法
        if templates:
            return self.decode_font_mapping_by_render(b64_font, templates)
        
        # 否则使用启发式规则
        return self.decode_font_mapping_by_heuristic(glyph_list, features)
    
    def decode_font_mapping_by_render(self, b64_font: str, templates: dict) -> dict:
        """通过 PIL 渲染 + 模板匹配解码字体映射"""
        font_bytes = base64.b64decode(b64_font)
        font = TTFont(BytesIO(font_bytes))
        
        # 保存为 TTF 文件供 PIL 使用
        with tempfile.NamedTemporaryFile(suffix=".ttf", delete=False) as f:
            font.save(f.name)
            ttf_path = f.name
        font.close()
        
        try:
            mapping = {}
            for char in "0123456789":
                rendered = self.render_char(ttf_path, char, size=48)
                best_digit = None
                best_score = -1
                
                for digit, template in templates.items():
                    score = self.compare_images_simple(rendered, template)
                    if score > best_score:
                        best_score = score
                        best_digit = digit
                
                mapping[char] = str(best_digit) if best_score > 0.05 else char
                print(f"  '{char}' → '{mapping[char]}' (score={best_score:.3f})")
            
            return mapping
        finally:
            os.unlink(ttf_path)
    
    def decode_font_mapping_by_heuristic(self, glyph_list: list, features: dict) -> dict:
        """启发式解码：基于轮廓数和宽度"""
        mapping = {}
        
        two_contour = [g for g in glyph_list if g["n_contours"] >= 2]
        one_contour = [g for g in glyph_list if g["n_contours"] == 1]
        
        two_contour.sort(key=lambda x: x["area"])
        one_contour.sort(key=lambda x: x["area"])
        
        if len(two_contour) == 4 and len(one_contour) == 6:
            two_map = ["9", "6", "0", "8"]
            for g, d in zip(two_contour, two_map):
                mapping[g["char"]] = d
            one_map = ["1", "7", "4", "2", "3", "5"]
            for g, d in zip(one_contour, one_map):
                mapping[g["char"]] = d
        elif len(two_contour) == 3 and len(one_contour) == 7:
            two_map = ["9", "6", "0"]
            for g, d in zip(sorted(two_contour, key=lambda x: x["area"]), two_map):
                mapping[g["char"]] = d
            one_map = ["1", "7", "4", "2", "3", "5", "8"]
            for g, d in zip(sorted(one_contour, key=lambda x: x["area"]), one_map):
                mapping[g["char"]] = d
        else:
            print(f"  [WARN] 非标准轮廓分布: 双={len(two_contour)}, 单={len(one_contour)}，使用渲染法")
            for g in glyph_list:
                mapping[g["char"]] = g["char"]
        
        return mapping
    
    def decode_page(self, page: int, templates: dict = None) -> list:
        """解码单页数据，返回真实数字列表"""
        if page == 1 and self.init_data:
            numbers = [int(n) for n in self.init_data.get("page_data", [])]
            print(f"[page {page}] 从 init 获取: {numbers}")
            self.all_numbers[page] = numbers
            return numbers
        
        data = self.get_page(page)
        page_data = data.get("page_data", [])
        b64_font = data.get("b64Font", "")
        
        if not b64_font:
            print(f"[page {page}] 无字体数据，尝试直接解析")
            numbers = [int(n) for n in page_data]
            self.all_numbers[page] = numbers
            return numbers
        
        print(f"[page {page}] 解码字体映射...")
        mapping = self.decode_font_mapping_by_features(b64_font, templates)
        self.font_cache[page] = mapping
        
        # 应用映射解码
        decoded = []
        for s in page_data:
            decoded_str = "".join(mapping.get(c, c) for c in s)
            decoded.append(int(decoded_str))
        
        print(f"[page {page}] 混淆: {page_data[:3]}... → 解码: {decoded[:3]}...")
        self.all_numbers[page] = decoded
        return decoded
    
    def solve(self) -> int:
        """主流程：初始化→采集100页→求和→提交"""
        print("=" * 50)
        print("SpiderDemo 字体反爬虫 Solver")
        print("=" * 50)
        
        # Step 1: 初始化
        self.init_challenge()
        
        # Step 2: 构建参考模板
        templates = self.build_reference_templates()
        
        # Step 3: 采集所有页面
        total_sum = 0
        for page in range(1, TOTAL_PAGES + 1):
            numbers = self.decode_page(page, templates)
            page_sum = sum(numbers)
            total_sum += page_sum
            print(f"  → 第{page}页和: {page_sum}, 累计: {total_sum}")
            if page % 20 == 0:
                print(f"  ... 进度: {page}/{TOTAL_PAGES}")
            time.sleep(0.1)
        
        print(f"\n{'=' * 50}")
        print(f"所有 {TOTAL_PAGES} 页数字总和: {total_sum}")
        print(f"{'=' * 50}")
        
        # Step 4: 提交答案
        result = self.submit_answer(total_sum)
        return total_sum
    
    def submit_answer(self, answer: int) -> dict:
        """提交答案"""
        url = f"{BASE_URL}/font_anti/api/challenge/submit/"
        resp = self.session.post(url, json={
            "challenge_type": CHALLENGE_TYPE,
            "answer": answer
        })
        data = resp.json()
        print(f"\n[提交] 答案={answer}")
        print(f"[提交] 结果: success={data.get('success')}, is_correct={data.get('is_correct')}")
        print(f"[提交] 消息: {data.get('message', '')}")
        return data


if __name__ == "__main__":
    solver = FontAntiSolver()
    solver.solve()

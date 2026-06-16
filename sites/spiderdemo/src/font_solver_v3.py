"""spiderdemo.cn 字体反爬 Solver - 基于 glyph 特征指纹匹配"""
import base64, json, time
from io import BytesIO
from fontTools.ttLib import TTFont

# 配置
BASE_URL = "https://spiderdemo.cn"
TOTAL_PAGES = 100

class BrowserFetcher:
    """通过 AdsPower 浏览器执行 fetch 获取数据 - 需要外部注入 fetch 回调"""
    def __init__(self, fetch_func):
        self.fetch = fetch_func  # fetch_func(path) -> dict
    
    def init_challenge(self):
        return self.fetch('/font_anti/api/challenge/init/?challenge_type=font_anti_challenge')
    
    def get_page(self, page):
        return self.fetch(f'/font_anti/api/font_anti_challenge/page/{page}/?challenge_type=font_anti_challenge')
    
    def submit(self, answer):
        return self.fetch('/font_anti/api/challenge/submit/', method='POST', body=json.dumps({
            "challenge_type": "font_anti_challenge", "answer": answer
        }))


class FontGlyphMatcher:
    """基于 glyph 几何特征指纹 (nc, w, h) 来识别和匹配字符"""
    
    def __init__(self):
        self.finger_to_digit = {}  # (nc, w, h) -> real_digit (str)
        self.digit_to_finger = {}  # real_digit (str) -> (nc, w, h)
    
    def build_reference(self, b64font: str, mapping: dict):
        """从 page 1 字体 + ground truth 构建参考指纹库
        
        mapping: {obf_char -> real_digit_char}, ex: {'0':'1', '1':'0', ...}
        """
        font_bytes = base64.b64decode(b64font)
        font = TTFont(BytesIO(font_bytes))
        cmap = font.getBestCmap()
        glyf = font["glyf"]
        
        for obf_char, real_digit in mapping.items():
            glyph_name = cmap.get(ord(obf_char))
            if not glyph_name:
                continue
            g = glyf[glyph_name]
            finger = (g.numberOfContours, g.xMax - g.xMin, g.yMax - g.yMin)
            self.finger_to_digit[finger] = real_digit
            print(f"  ref: char '{obf_char}' -> digit '{real_digit}' | finger=(nc={g.numberOfContours}, w={g.xMax-g.xMin}, h={g.yMax-g.yMin})")
        
        font.close()
        print(f"  构建 {len(self.finger_to_digit)} 个参考指纹")
    
    def decode(self, b64font: str) -> dict:
        """解码字体映射: {obf_char -> real_digit_char}"""
        font_bytes = base64.b64decode(b64font)
        font = TTFont(BytesIO(font_bytes))
        cmap = font.getBestCmap()
        glyf = font["glyf"]
        
        mapping = {}
        for char in "0123456789":
            glyph_name = cmap.get(ord(char))
            if not glyph_name:
                continue
            g = glyf[glyph_name]
            finger = (g.numberOfContours, g.xMax - g.xMin, g.yMax - g.yMin)
            real_digit = self.finger_to_digit.get(finger)
            if real_digit:
                mapping[char] = real_digit
            else:
                print(f"  [WARN] char '{char}' finger={finger} 不在参考库中")
                mapping[char] = char  # fallback
        
        font.close()
        return mapping


def derive_mapping(init_nums: list, page_obf: list) -> dict:
    """从 init API 真实数字 vs page API 混淆字符串推导映射"""
    mapping = {}
    for real, obf in zip(init_nums, page_obf):
        real_s = str(int(real)).zfill(4)
        for i, ch in enumerate(obf):
            mapping[ch] = real_s[i]
    return mapping


def test_fingerprint_consistency():
    """测试跨页面 glyph 指纹一致性"""
    # 手动注入数据（从之前的实验结果）
    # 这里仅验证逻辑，实际运行时通过 fetch 获取
    print("=" * 60)
    print("测试 glyph 指纹跨页面一致性")
    print("=" * 60)
    
    # 模拟数据 - 从实际浏览器 fetch 结果中注入
    # 实际流程在 main_workflow 中


def main_workflow():
    """完整工作流 - 需要 AdsPower 浏览器配合"""
    print("""
╔══════════════════════════════════════════════════════════╗
║    spiderdemo.cn 字体反爬 Solver                          ║
║                                                          ║
║  工作流:                                                  ║
║  1. 从浏览器 fetch page 1 的 init + page API 数据         ║
║  2. 推导 ground truth 字符映射                             ║
║  3. 提取参考 glyph 指纹                                    ║
║  4. 遍历 page 2-100，每个页面:                             ║
║     a. 获取 obfuscated 字符串 + b64font                    ║
║     b. 用 glyph 指纹匹配解码                               ║
║     c. 累加求和                                           ║
║  5. 提交答案                                              ║
╚══════════════════════════════════════════════════════════╝

启动需要 AdsPower 浏览器已打开并连接到 spiderdemo.cn
""")

if __name__ == "__main__":
    main_workflow()

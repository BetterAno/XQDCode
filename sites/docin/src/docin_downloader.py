"""
豆丁网 (docin.com) 文档下载器 - 纯协议方式
============================================
支持两种文档类型：
1. 扫描型：页面包含 data:image/jpeg;base64 嵌入图片 → 直接提取为 JPG
2. 文本型：页面是纯文本 SVG（路径+文字）→ 转为 SVG 文件

加密分析：
- 页面数据 URL: /huangke/docxinshi/doc/{pid}/svgbyjson/page-{n}.json.z.b64
  格式: base64(zlib(紧凑JSON))，紧凑JSON 是 _hkey 映射的 SVG 描述
- sid 通过 JS 动态获取（需要浏览器 cookie：JSESSIONID、cookie_id、time_id）
  客户端 cookie_id = UUID, time_id = YYYYMMDDHHmmss
- 免费访问有页数限制（通常前20页），超出返回 HTTP 500

用法：
  python docin_downloader.py <product_id> [sid]
  python docin_downloader.py 228788547 AVPiwWrbU0z6l...
"""
import requests
import base64
import zlib
import json
import re
import time
import os
from pathlib import Path

# ============================================================
# 配置
# ============================================================
BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'

HEADERS = {
    'User-Agent': UA,
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
}


class DocinDownloader:
    """豆丁网文档下载器"""

    def __init__(self, product_id):
        self.product_id = product_id
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.sid = None
        self.meta = None

    # ============ 元数据 ============

    def get_meta(self):
        """获取文档元数据"""
        url = f"https://page.douding.cn/docinfile2/meta_{self.product_id}_0.docin"
        r = self.session.get(url, timeout=15)
        text = r.text.strip()
        m = re.search(r'\{([^}]+)\}', text)
        if not m:
            raise Exception(f"无法解析元数据: {text}")
        inner = m.group(1)
        result = {}
        for pair in inner.split(','):
            if ':' in pair:
                k, v = pair.split(':', 1)
                k = k.strip()
                try:
                    result[k] = int(v.strip())
                except ValueError:
                    result[k] = v.strip()
        self.meta = result
        return result

    # ============ 页面数据获取 ============

    def fetch_page_raw(self, page_num):
        """获取单页紧凑 JSON 数据"""
        url = (f"https://page.douding.cn/huangke/docxinshi/doc/"
               f"{self.product_id}/svgbyjson/page-{page_num}.json.z.b64")
        params = {'sid': self.sid, 'watermark': 0}
        h = {
            **HEADERS,
            'Referer': f'https://www.docin.com/p-{self.product_id}.html',
            'Origin': 'https://www.docin.com',
        }
        r = self.session.get(url, params=params, headers=h, timeout=60)
        if r.status_code != 200:
            return None, r.status_code
        try:
            decoded = base64.b64decode(r.content)
            decompressed = zlib.decompress(decoded)
            return json.loads(decompressed), 200
        except Exception as e:
            return None, -1

    # ============ 文档类型检测 ============

    def detect_doc_type(self, page_data):
        """
        检测文档类型
        返回: 'scanned' (扫描型) 或 'text' (文本型)
        """
        hkey = page_data.get('_hkey', {})
        for k, v in hkey.items():
            if v == 'href':
                # 检查是否有 data:image 内容
                def has_image(node):
                    if isinstance(node, dict):
                        for ak, av in node.get('a', {}).items():
                            if isinstance(av, str) and av.startswith('data:image/'):
                                return True
                        for c in node.get('h', []):
                            if has_image(c):
                                return True
                    return False
                if has_image(page_data):
                    return 'scanned'
        return 'text'

    # ============ 图片提取（扫描型）============

    def extract_images_from_page(self, page_data):
        """从页面数据中提取所有 base64 图片"""
        images = []

        def find_images(node):
            if isinstance(node, dict):
                attrs = node.get('a', {})
                for k, v in attrs.items():
                    if isinstance(v, str) and v.startswith('data:image/'):
                        mime_match = re.match(r'data:(image/\w+);base64,(.+)', v)
                        if mime_match:
                            images.append({
                                'mime': mime_match.group(1),
                                'base64': mime_match.group(2),
                                'format': mime_match.group(1).split('/')[-1],
                            })
                for c in node.get('h', []):
                    find_images(c)

        find_images(page_data)
        return images

    # ============ SVG 转换（文本型）============

    def compact_to_svg(self, page_data):
        """紧凑 JSON → 标准 SVG 字符串"""
        hkey = page_data.get('_hkey', {})

        def expand(data):
            if isinstance(data, dict):
                result = {}
                for k, v in data.items():
                    expanded_key = hkey.get(k, k)
                    result[expanded_key] = expand(v)
                return result
            elif isinstance(data, list):
                return [expand(item) for item in data]
            return data

        svg_data = expand(page_data)
        root_attrs = svg_data.get('attr', {})
        children = svg_data.get('children', [])

        attr_str = ' '.join(f'{k}="{v}"' for k, v in root_attrs.items())
        parts = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            f'<svg {attr_str}>'
        ]

        # defs
        def_names = {'clipPath', 'linearGradient', 'mask', 'filter'}
        def_children = [c for c in children if c.get('name') in def_names]
        if def_children:
            parts.append('<defs>')
            for child in def_children:
                parts.append(self._build_element(child))
            parts.append('</defs>')

        # render
        for child in children:
            if child.get('name') not in def_names:
                parts.append(self._build_element(child))

        parts.append('</svg>')
        return '\n'.join(parts)

    @staticmethod
    def _decode_unicode(s):
        """解码紧凑 JSON 文本中的 Unicode 转义和代理对
        
        紧凑 JSON 中文本有两种形式：
        1. \\u0031 字面量 -> 需要解码为字符 '1'
        2. \\uD835 已被 json.loads 解码为代理码元 -> 需要配对为真正 Unicode 字符
        """
        if not s:
            return s
        # 步骤1: 将字面量 \uXXXX 转换为实际字符
        try:
            s = s.encode('utf-8').decode('unicode_escape')
        except Exception:
            s = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), s)
        # 步骤2: 修复 json.loads 解码后残留的代理对码元
        try:
            s.encode('utf-8')
            # 已经是有效 UTF-8，无需处理
            return s
        except UnicodeEncodeError:
            pass
        # 有残留代理码元，需要配对
        result = []
        i = 0
        while i < len(s):
            code = ord(s[i])
            if 0xD800 <= code <= 0xDBFF and i + 1 < len(s):
                code2 = ord(s[i + 1])
                if 0xDC00 <= code2 <= 0xDFFF:
                    # 有效代理对
                    cp = 0x10000 + ((code - 0xD800) << 10) + (code2 - 0xDC00)
                    result.append(chr(cp))
                    i += 2
                    continue
            # 孤立的代理码元（自定义字体字形索引）→ 替换为 U+FFFD
            if 0xD800 <= code <= 0xDFFF:
                result.append('�')
            else:
                result.append(chr(code))
            i += 1
        return ''.join(result)

    def _build_element(self, el):
        """构建 XML 元素"""
        tag = el.get('name', 'g')
        attrs = el.get('attr', {})
        children = el.get('children', [])

        attr_parts = []
        for k, v in attrs.items():
            if k == 'xmlns:xlink':
                continue
            svg_k = re.sub(r'([A-Z])', r'-\1', k).lower().lstrip('-')
            attr_map = {
                'href': 'xlink:href',
                'xlink-href': 'xlink:href',
            }
            svg_k = attr_map.get(svg_k, svg_k)
            attr_parts.append(f'{svg_k}="{v}"')

        attr_str = ' '.join(attr_parts)

        text_content = self._decode_unicode(el.get('text', ''))  # \uXXXX → 实际字符
        if not children and not text_content:
            return f'<{tag} {attr_str}/>'
        if text_content and not children:
            return f'<{tag} {attr_str}>{text_content}</{tag}>'

        inner_parts = []
        if text_content:
            inner_parts.append(text_content)
        inner_parts.extend(self._build_element(c) for c in children)
        inner = '\n  '.join(inner_parts)
        return f'<{tag} {attr_str}>\n  {inner}\n</{tag}>'

    # ============ 主下载流程 ============

    def download(self, sid=None, start_page=0, end_page=None):
        """
        下载文档
        - 扫描型文档 → 提取 JPG 图片
        - 文本型文档 → 保存 SVG 文件
        """
        if sid:
            self.sid = sid
            print(f"[*] 使用提供的 sid: {sid[:32]}...")
        else:
            raise ValueError("请提供 sid（使用浏览器访问页面后从 docinReader.config.flash_param_hzq 获取）")

        # 获取元数据
        print("[*] 获取文档元数据...")
        if not self.meta:
            self.meta = self.get_meta()
        total_pages = self.meta.get('totalPage', 1)
        width = self.meta.get('width', 0)
        height = self.meta.get('height', 0)
        print(f"    总页数: {total_pages}, 尺寸: {width}x{height}")

        if end_page is None:
            end_page = total_pages - 1

        # 获取第一页检测文档类型
        print("[*] 检测文档类型...")
        page0, status = self.fetch_page_raw(0)
        if page0 is None:
            print(f"    [!] 无法获取 Page 0 (HTTP {status})，sid 可能已过期")
            return 0, 0

        doc_type = self.detect_doc_type(page0)
        print(f"    文档类型: {'扫描型（含嵌入图片）' if doc_type == 'scanned' else '文本型（纯 SVG）'}")

        # 创建输出目录
        doc_dir = OUTPUT_DIR / str(self.product_id)
        doc_dir.mkdir(parents=True, exist_ok=True)

        print(f"\n[*] 开始下载页面 {start_page} 到 {end_page}...")
        if doc_type == 'scanned':
            print("    [模式] 提取嵌入的 JPEG 图片")
        else:
            print("    [模式] 转换为 SVG 文件（可用浏览器打开或用 cairosvg 转 PNG）")

        success_count = 0
        total_files = 0
        consecutive_failures = 0

        for page_num in range(start_page, end_page + 1):
            status_str = f"[{page_num + 1}/{total_pages}] Page {page_num}"

            page_data, status = self.fetch_page_raw(page_num)
            if page_data is None:
                if status == 500 and consecutive_failures >= 2:
                    print(f"  {status_str}: HTTP 500（可能达到免费页数上限，停止）")
                    break
                consecutive_failures += 1
                print(f"  {status_str}: HTTP {status}")
                continue
            consecutive_failures = 0

            if doc_type == 'scanned':
                # 扫描型：提取 JPEG
                images = self.extract_images_from_page(page_data)
                if not images:
                    print(f"  {status_str}: 无嵌入图片")
                    continue

                for img_idx, img in enumerate(images):
                    suffix = img['format']
                    if suffix == 'jpeg':
                        suffix = 'jpg'
                    if len(images) == 1:
                        filename = f"page_{page_num + 1:04d}.{suffix}"
                    else:
                        filename = f"page_{page_num + 1:04d}_{img_idx}.{suffix}"

                    filepath = doc_dir / filename
                    try:
                        img_data = base64.b64decode(img['base64'])
                        with open(filepath, 'wb') as f:
                            f.write(img_data)
                        total_files += 1
                    except Exception as e:
                        print(f"  {status_str}: 保存失败 - {e}")
                        continue

                print(f"  {status_str}: OK ({len(images)} 张 JPG)")
                success_count += 1

            else:
                # 文本型：转 SVG
                svg_content = self.compact_to_svg(page_data)
                filepath = doc_dir / f"page_{page_num + 1:04d}.svg"
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(svg_content)
                print(f"  {status_str}: OK (SVG, {len(svg_content)} bytes)")
                success_count += 1
                total_files += 1

            # 请求间隔
            if page_num < end_page:
                time.sleep(0.3)

        # 汇总
        expected = end_page - start_page + 1
        print(f"\n[+] 完成!")
        print(f"    成功: {success_count}/{expected} 页")
        if doc_type == 'scanned':
            print(f"    图片: {total_files} 张")
        else:
            print(f"    SVG: {total_files} 个")
        print(f"    输出: {doc_dir}")

        if success_count < expected and end_page - start_page > 5:
            print(f"\n    [!] 提示：免费访问通常限制前20页，需要更多页请付费或刷新 sid")

        return success_count, total_files


# ============================================================
# 命令行入口
# ============================================================

if __name__ == '__main__':
    import sys

    if len(sys.argv) < 2:
        print(__doc__)
        print("用法: python docin_downloader.py <product_id> [sid]")
        print("示例: python docin_downloader.py 228788547 AVPiwWrbU0z6l...")
        print("\n获取 sid 的方法：")
        print("1. 用浏览器打开 https://www.docin.com/p-<product_id>.html")
        print("2. F12 打开控制台，执行: docinReader.config.flash_param_hzq")
        print("3. 复制输出的 sid")
        sys.exit(1)

    product_id = int(sys.argv[1])
    sid = sys.argv[2] if len(sys.argv) > 2 else None

    downloader = DocinDownloader(product_id)
    downloader.download(sid=sid)

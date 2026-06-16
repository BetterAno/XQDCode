"""
豆丁网 (docin.com) 文档图片下载器
逆向分析脚本 - Phase 1 & 2 分析
"""
import requests
import base64
import zlib
import json
import os
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
    'Referer': 'https://www.docin.com/',
    'Origin': 'https://www.docin.com',
}

# ============================================================
# Phase 1: 获取文档元数据和 sid
# ============================================================

def get_meta(product_id):
    """获取文档元数据（总页数、宽高等）"""
    url = f"https://page.douding.cn/docinfile2/meta_{product_id}_0.docin"
    # 响应格式: {width:594,height:840,totalPage:64} 或 jQuery...(...)
    r = requests.get(url, headers=HEADERS, timeout=15)
    text = r.text.strip()
    # 用 regex 提取花括号内容，支持 key 不带引号的 JS 对象字面量
    m = re.search(r'\{([^}]+)\}', text)
    if m:
        inner = m.group(1)
        # JS 对象字面量: width:594,height:840
        pairs = inner.split(',')
        result = {}
        for pair in pairs:
            if ':' in pair:
                k, v = pair.split(':', 1)
                k = k.strip()
                v = v.strip()
                try:
                    result[k] = int(v)
                except ValueError:
                    result[k] = v.strip('"\'')
        return result
    return json.loads(text)


def get_sid(product_id):
    """获取访问 sid（通过 /newEnd/getSid.do）"""
    import time
    url = "https://www.docin.com/newEnd/getSid.do"
    params = {
        'pid': product_id,
        'd': int(time.time() * 1000)
    }
    r = requests.get(url, params=params, headers=HEADERS, timeout=15)
    return r.text.strip()


def fetch_page_raw(product_id, page_num, sid):
    """获取单页的紧凑 JSON 数据"""
    url = f"https://page.douding.cn/huangke/docxinshi/doc/{product_id}/svgbyjson/page-{page_num}.json.z.b64"
    params = {
        'sid': sid,
        'watermark': 0
    }
    r = requests.get(url, params=params, headers=HEADERS, timeout=30)
    if r.status_code != 200:
        print(f"  [!] Page {page_num} returned {r.status_code}")
        return None
    try:
        decoded = base64.b64decode(r.content)
        decompressed = zlib.decompress(decoded)
        return json.loads(decompressed)
    except Exception as e:
        print(f"  [!] Page {page_num} decode error: {e}")
        return None


# ============================================================
# Phase 2: 紧凑 JSON → 标准 SVG 转换
# ============================================================

def expand_keys(data, hkey):
    """递归展开紧凑的 key 名"""
    if isinstance(data, dict):
        result = {}
        for k, v in data.items():
            expanded_key = hkey.get(k, k)
            result[expanded_key] = expand_keys(v, hkey)
        return result
    elif isinstance(data, list):
        return [expand_keys(item, hkey) for item in data]
    else:
        return data


def compact_to_svg(page_data):
    """将紧凑 JSON 转为标准 SVG 字符串"""
    hkey = page_data.get('_hkey', {})
    svg_data = expand_keys(page_data, hkey)
    
    # 构建 SVG
    root_attrs = svg_data.get('attr', {})
    children = svg_data.get('children', [])
    
    return build_svg_xml(root_attrs, children)


def build_svg_xml(root_attrs, children):
    """构建 SVG XML"""
    attr_str = ' '.join(f'{k}="{v}"' for k, v in root_attrs.items())
    svg_parts = [f'<svg {attr_str}>']
    
    # 添加 defs（clipPath 等）
    has_defs = any(c.get('name') in ('clipPath', 'linearGradient', 'mask', 'filter') for c in children)
    if has_defs:
        svg_parts.append('<defs>')
        for child in children:
            if child.get('name') in ('clipPath', 'linearGradient', 'mask', 'filter'):
                svg_parts.append(build_element(child))
        svg_parts.append('</defs>')
    
    # 渲染其他元素
    for child in children:
        if child.get('name') not in ('clipPath', 'linearGradient', 'mask', 'filter'):
            svg_parts.append(build_element(child))
    
    svg_parts.append('</svg>')
    return '\n'.join(svg_parts)


def build_element(el):
    """递归构建 XML 元素"""
    tag = el.get('name', 'g')
    attrs = el.get('attr', {})
    children = el.get('children', [])
    
    attr_parts = []
    for k, v in attrs.items():
        if k == 'href':
            # xlink:href
            attr_parts.append(f'xlink:href="{v}"')
        elif k == 'xlink:href':
            attr_parts.append(f'xlink:href="{v}"')
        else:
            # HTML 属性名转 SVG（如 fillRule -> fill-rule）
            svg_k = re.sub(r'([A-Z])', r'-\1', k).lower()
            if svg_k.startswith('-'):
                svg_k = svg_k[1:]
            # 特殊处理 xlink 命名空间
            if svg_k == 'xmlns-xlink':
                continue  # 已在 root 处理
            attr_parts.append(f'{svg_k}="{v}"')
    
    attr_str = ' '.join(attr_parts)
    
    if not children:
        return f'<{tag} {attr_str}/>'
    
    inner = '\n'.join(build_element(c) for c in children)
    return f'<{tag} {attr_str}>\n{inner}\n</{tag}>'


# ============================================================
# Phase 1: 主分析入口
# ============================================================

def analyze(product_id=228788547):
    print(f"[*] 分析豆丁文档 {product_id}")
    
    # 1. 获取元数据
    print("[*] 获取文档元数据...")
    meta = get_meta(product_id)
    print(f"    总页数: {meta.get('totalPage')}")
    print(f"    页面尺寸: {meta.get('width')}x{meta.get('height')}")
    
    # 2. 获取 sid
    print("[*] 获取访问 sid...")
    sid = get_sid(product_id)
    print(f"    sid: {sid[:40]}...")
    
    # 3. 获取第一页并分析格式
    print("[*] 获取 Page 0 分析数据格式...")
    page0 = fetch_page_raw(product_id, 0, sid)
    
    if page0 is None:
        print("[!] 无法获取页面数据")
        return
    
    print(f"    原始 keys: {list(page0.keys())}")
    print(f"    _hkey 映射表:")
    for k, v in page0.get('_hkey', {}).items():
        print(f"      '{k}' -> '{v}'")
    
    # 4. 分析页面内容结构
    children = page0.get('h', [])
    print(f"    子元素数量: {len(children)}")
    
    text_elements = 0
    image_elements = 0
    path_elements = 0
    image_data = []
    
    for child in children:
        name = child.get('l', 'g')
        attrs = child.get('a', {})
        sub_children = child.get('h', [])
        
        if name == 'text':
            text_elements += 1
        if name == 'path':
            path_elements += 1
        
        for sub in sub_children:
            sub_attrs = sub.get('a', {})
            sub_name = sub.get('l', '')
            # 检查图像数据
            for key in ['p', 'href', 'xlink:href']:
                if key in sub_attrs and 'data:image' in str(sub_attrs[key]):
                    image_elements += 1
                    img_str = str(sub_attrs[key])
                    # 提取图像信息
                    img_prefix = img_str[:100]
                    print(f"    [IMAGE] in <{sub_name}>: {img_prefix}...")
                    image_data.append({
                        'element': sub_name,
                        'attrs': sub_attrs,
                        'data_prefix': img_prefix
                    })
    
    print(f"\n    统计: texts={text_elements}, paths={path_elements}, images={image_elements}")
    
    # 5. 尝试转换为 SVG 并保存
    print("\n[*] 转换为标准 SVG...")
    svg_content = compact_to_svg(page0)
    svg_path = OUTPUT_DIR / f"page_0.svg"
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f"    已保存: {svg_path} ({len(svg_content)} bytes)")
    
    return {
        'meta': meta,
        'sid': sid,
        'page0': page0,
        'image_count': image_elements,
        'text_count': text_elements
    }


if __name__ == '__main__':
    result = analyze(228788547)

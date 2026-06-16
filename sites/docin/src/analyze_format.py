"""分析豆丁网文档页面结构差异"""
import requests, base64, zlib, json

# 测试两个文档
tests = [
    {
        "pid": 228788547,
        "sid": "AVPiwWrbU0z6lAVLfuupKqpgA9Z5X3NNCVvJKddHRlIHEQtCElVcIGB4x60OIsXq",
        "name": "扫描型PDF(有图片)"
    },
    {
        "pid": 4981040215,
        "sid": "HwnOd3w6-Nt-NdYqR22wA4pgA9Z5X3NNUHY-iAK4VgfZRG9CBNLWwWB4x60OIsXq",
        "name": "文本型(无图片)"
    },
]

headers = {'User-Agent': 'Mozilla/5.0'}

for test in tests:
    pid = test['pid']
    sid = test['sid']
    print(f"\n{'='*60}")
    print(f"文档 {pid} ({test['name']})")
    print(f"{'='*60}")
    
    # 获取元数据
    meta_url = f"https://page.douding.cn/docinfile2/meta_{pid}_0.docin"
    r = requests.get(meta_url, headers=headers, timeout=15)
    print(f"Meta: {r.text.strip()}")
    
    # 获取 page 0
    url = f"https://page.douding.cn/huangke/docxinshi/doc/{pid}/svgbyjson/page-0.json.z.b64"
    r = requests.get(url, params={'sid': sid, 'watermark': 0}, headers={
        **headers, 'Referer': f'https://www.docin.com/p-{pid}.html'
    }, timeout=30)
    
    if r.status_code != 200:
        print(f"Page 0: HTTP {r.status_code}")
        continue
    
    decoded = base64.b64decode(r.content)
    decompressed = zlib.decompress(decoded)
    data = json.loads(decompressed)
    
    hkey = data.get('_hkey', {})
    print(f"\n_hkey mapping ({len(hkey)} keys):")
    for k, v in sorted(hkey.items()):
        print(f"  '{k}' -> '{v}'")
    
    # 查找 'href' 键是否在映射中
    href_key = None
    for k, v in hkey.items():
        if v == 'href':
            href_key = k
            break
    
    if href_key:
        print(f"\n  *** href key found: '{href_key}' ***")
    else:
        print(f"\n  *** NO href key in _hkey - this document has no embedded images ***")
    
    # 统计图片
    def count_images(node):
        count = 0
        if isinstance(node, dict):
            for k, v in node.get('a', {}).items():
                if isinstance(v, str) and v.startswith('data:image'):
                    count += 1
            for c in node.get('h', []):
                count += count_images(c)
        return count
    
    img_count = count_images(data)
    print(f"Embedded images: {img_count}")
    
    children = data.get('h', [])
    print(f"Top-level children: {len(children)}")
    
    # 检查是否所有页面都能访问
    import re
    total_match = re.search(r'totalPage:(\d+)', r.text if hasattr(r, 'text') else '') 
    # Actually get from meta
    meta_text = requests.get(meta_url, headers=headers, timeout=15).text
    total_match = re.search(r'totalPage[:\s]*(\d+)', meta_text)
    total = int(total_match.group(1)) if total_match else 5
    
    print(f"Total pages (from meta): {total}")
    for p in range(total):
        url = f"https://page.douding.cn/huangke/docxinshi/doc/{pid}/svgbyjson/page-{p}.json.z.b64"
        r = requests.get(url, params={'sid': sid, 'watermark': 0}, headers={
            **headers, 'Referer': f'https://www.docin.com/p-{pid}.html'
        }, timeout=30)
        status = "OK" if r.status_code == 200 else f"FAIL({r.status_code})"
        print(f"  Page {p}: {status} (len={len(r.content)})")

print("\nDone!")

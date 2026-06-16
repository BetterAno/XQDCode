import base64, requests, json
from io import BytesIO
from fontTools.ttLib import TTFont

BASE_URL = 'https://spiderdemo.cn'
s = requests.Session()

# 初始化
r = s.get(f'{BASE_URL}/font_anti/api/challenge/init/', params={'challenge_type': 'font_anti_challenge'})
init_data = r.json()
print('Init page_data:', init_data.get('page_data', []))

# 获取第2页
r2 = s.get(f'{BASE_URL}/font_anti/api/font_anti_challenge/page/2/', params={'challenge_type': 'font_anti_challenge'})
page2 = r2.json()
print('Page2 page_data:', page2.get('page_data', []))
print('Page2 b64Font length:', len(page2.get('b64Font', '')))

# 解析字体
font_bytes = base64.b64decode(page2['b64Font'])
font = TTFont(BytesIO(font_bytes))
cmap = font.getBestCmap()
glyf = font['glyf']

print()
print('Glyph features for each digit character:')
header = f'{"Char":<6} {"GlyphName":<12} {"NCont":<6} {"Width":<8} {"Height":<8} {"xMin":<8} {"yMin":<8} {"xMax":<8} {"yMax":<8}'
print(header)
print('-' * len(header))

feature_list = []
for char in '0123456789':
    glyph_name = cmap.get(ord(char))
    if glyph_name:
        g = glyf[glyph_name]
        w = g.xMax - g.xMin
        h = g.yMax - g.yMin
        feature_list.append({
            'char': char,
            'glyph': glyph_name,
            'nc': g.numberOfContours,
            'w': w, 'h': h,
            'area': w * h,
        })
        print(f'{char:<6} {glyph_name:<12} {g.numberOfContours:<6} {w:<8} {h:<8} {g.xMin:<8} {g.yMin:<8} {g.xMax:<8} {g.yMax:<8}')

font.close()

# 分析模式
print()
nc2 = [f for f in feature_list if f['nc'] >= 2]
nc1 = [f for f in feature_list if f['nc'] == 1]
print(f'双轮廓: {len(nc2)}个 = {[(f["char"], f["nc"]) for f in nc2]}')
print(f'单轮廓: {len(nc1)}个 = {[(f["char"], f["nc"]) for f in nc1]}')

# 按宽度排序
sorted_feats = sorted(feature_list, key=lambda x: x['w'])
print()
print('按宽度排序:')
for f in sorted_feats:
    print(f'  char={f["char"]}, nc={f["nc"]}, w={f["w"]}, h={f["h"]}, area={f["area"]}')

# 同时获取第3页进行对比
print()
print('=' * 50)
print('获取第3页对比...')
r3 = s.get(f'{BASE_URL}/font_anti/api/font_anti_challenge/page/3/', params={'challenge_type': 'font_anti_challenge'})
page3 = r3.json()
print('Page3 page_data:', page3.get('page_data', []))
print('Page3 b64Font length:', len(page3.get('b64Font', '')))

font_bytes3 = base64.b64decode(page3['b64Font'])
font3 = TTFont(BytesIO(font_bytes3))
cmap3 = font3.getBestCmap()
glyf3 = font3['glyf']

feature_list3 = []
for char in '0123456789':
    glyph_name = cmap3.get(ord(char))
    if glyph_name:
        g = glyf3[glyph_name]
        w = g.xMax - g.xMin
        h = g.yMax - g.yMin
        feature_list3.append({
            'char': char,
            'glyph': glyph_name,
            'nc': g.numberOfContours,
            'w': w, 'h': h,
            'area': w * h,
        })

font3.close()

# 对比第2页和第3页的glyph特征
print()
print('对比 Page2 vs Page3:')
page2_w_by_char = {f['char']: f['w'] for f in feature_list}
page3_w_by_char = {f['char']: f['w'] for f in feature_list3}

# 构建一个“特征指纹”来匹配跨页面的glyph
print()
print('Page2 特征指纹 (nc, w, h):')
for f in sorted(feature_list, key=lambda x: x['w']):
    print(f'  char={f["char"]}, finger=(nc={f["nc"]}, w={f["w"]}, h={f["h"]})')

print()
print('Page3 特征指纹 (nc, w, h):')
for f in sorted(feature_list3, key=lambda x: x['w']):
    print(f'  char={f["char"]}, finger=(nc={f["nc"]}, w={f["w"]}, h={f["h"]})')

# 检查特征是否一致
print()
page2_fingers = {(f['nc'], f['w'], f['h']): f['char'] for f in feature_list}
page3_fingers = {(f['nc'], f['w'], f['h']): f['char'] for f in feature_list3}

common_fingers = set(page2_fingers.keys()) & set(page3_fingers.keys())
print(f'共同特征指纹数: {len(common_fingers)} (期望: 10)')
if len(common_fingers) == 10:
    print('✓ 所有glyph特征在跨页面间一致！仅cmap映射不同。')
    # 建立跨页面char映射
    print()
    print('跨页面char映射 (Page2 char -> Page3 char):')
    p2_to_p3 = {}
    for finger, p2_char in page2_fingers.items():
        p3_char = page3_fingers[finger]
        p2_to_p3[p2_char] = p3_char
        print(f'  {p2_char} -> {p3_char}')
else:
    print(f'差异指纹: {set(page2_fingers.keys()) ^ set(page3_fingers.keys())}')

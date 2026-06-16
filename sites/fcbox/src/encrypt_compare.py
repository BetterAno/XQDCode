"""
丰巢滑块验证码 - 加密对比测试
使用浏览器中捕获的真实轨迹进行加密对比
"""
import hashlib
import base64
import json
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

# 浏览器中捕获的真实轨迹 (第3组)
# 轨迹点数: 89, 终点: x=218, y=64
browser_track = [
    {"x":1,"y":64,"time":1776753589363},
    {"x":2,"y":64,"time":1776753589370},
    {"x":3,"y":64,"time":1776753589377},
    {"x":4,"y":64,"time":1776753589383},
    {"x":5,"y":64,"time":1776753589390},
    {"x":6,"y":64,"time":1776753589396},
    {"x":7,"y":64,"time":1776753589403},
    {"x":8,"y":64,"time":1776753589409},
    {"x":9,"y":64,"time":1776753589416},
    {"x":10,"y":64,"time":1776753589423},
    {"x":11,"y":64,"time":1776753589429},
    {"x":12,"y":64,"time":1776753589436},
    {"x":13,"y":64,"time":1776753589443},
    {"x":14,"y":64,"time":1776753589449},
    {"x":15,"y":64,"time":1776753589456},
    {"x":16,"y":64,"time":1776753589463},
    {"x":17,"y":64,"time":1776753589470},
    {"x":18,"y":64,"time":1776753589476},
    {"x":19,"y":64,"time":1776753589483},
    {"x":20,"y":64,"time":1776753589490},
    {"x":21,"y":64,"time":1776753589496},
    {"x":22,"y":64,"time":1776753589503},
    {"x":23,"y":64,"time":1776753589510},
    {"x":24,"y":64,"time":1776753589516},
    {"x":25,"y":64,"time":1776753589523},
    {"x":26,"y":64,"time":1776753589530},
    {"x":27,"y":64,"time":1776753589536},
    {"x":28,"y":64,"time":1776753589543},
    {"x":29,"y":64,"time":1776753589550},
    {"x":30,"y":64,"time":1776753589556},
    {"x":31,"y":64,"time":1776753589563},
    {"x":32,"y":64,"time":1776753589570},
    {"x":33,"y":64,"time":1776753589576},
    {"x":34,"y":64,"time":1776753589583},
    {"x":35,"y":64,"time":1776753589590},
    {"x":36,"y":64,"time":1776753589596},
    {"x":37,"y":64,"time":1776753589603},
    {"x":38,"y":64,"time":1776753589610},
    {"x":39,"y":64,"time":1776753589616},
    {"x":40,"y":64,"time":1776753589623},
    {"x":41,"y":64,"time":1776753589630},
    {"x":42,"y":64,"time":1776753589636},
    {"x":43,"y":64,"time":1776753589643},
    {"x":44,"y":64,"time":1776753589650},
    {"x":45,"y":64,"time":1776753589656},
    {"x":46,"y":64,"time":1776753589663},
    {"x":47,"y":64,"time":1776753589670},
    {"x":48,"y":64,"time":1776753589676},
    {"x":49,"y":64,"time":1776753589683},
    {"x":50,"y":64,"time":1776753589690},
    {"x":51,"y":64,"time":1776753589696},
    {"x":52,"y":64,"time":1776753589703},
    {"x":53,"y":64,"time":1776753589710},
    {"x":54,"y":64,"time":1776753589716},
    {"x":55,"y":64,"time":1776753589723},
    {"x":56,"y":64,"time":1776753589730},
    {"x":57,"y":64,"time":1776753589736},
    {"x":58,"y":64,"time":1776753589743},
    {"x":59,"y":64,"time":1776753589750},
    {"x":60,"y":64,"time":1776753589756},
    {"x":61,"y":64,"time":1776753589763},
    {"x":62,"y":64,"time":1776753589770},
    {"x":63,"y":64,"time":1776753589776},
    {"x":64,"y":64,"time":1776753589783},
    {"x":65,"y":64,"time":1776753589790},
    {"x":66,"y":64,"time":1776753589796},
    {"x":67,"y":64,"time":1776753589803},
    {"x":68,"y":64,"time":1776753589810},
    {"x":69,"y":64,"time":1776753589816},
    {"x":70,"y":64,"time":1776753589823},
    {"x":71,"y":64,"time":1776753589830},
    {"x":72,"y":64,"time":1776753589836},
    {"x":73,"y":64,"time":1776753589843},
    {"x":74,"y":64,"time":1776753589850},
    {"x":75,"y":64,"time":1776753589856},
    {"x":76,"y":64,"time":1776753589863},
    {"x":77,"y":64,"time":1776753589870},
    {"x":78,"y":64,"time":1776753589876},
    {"x":79,"y":64,"time":1776753589883},
    {"x":80,"y":64,"time":1776753589890},
    {"x":81,"y":64,"time":1776753589896},
    {"x":82,"y":64,"time":1776753589903},
    {"x":83,"y":64,"time":1776753589910},
    {"x":84,"y":64,"time":1776753589916},
    {"x":85,"y":64,"time":1776753589923},
    {"x":86,"y":64,"time":1776753589930},
    {"x":87,"y":64,"time":1776753589936},
    {"x":88,"y":64,"time":1776753589943},
    {"x":89,"y":64,"time":1776753589950},
    {"x":90,"y":64,"time":1776753589956},
    {"x":91,"y":64,"time":1776753589963},
    {"x":92,"y":64,"time":1776753589970},
    {"x":93,"y":64,"time":1776753589976},
    {"x":94,"y":64,"time":1776753589983},
    {"x":95,"y":64,"time":1776753589990},
    {"x":96,"y":64,"time":1776753589996},
    {"x":97,"y":64,"time":1776753590003},
    {"x":98,"y":64,"time":1776753590010},
    {"x":99,"y":64,"time":1776753590016},
    {"x":100,"y":64,"time":1776753590023},
    {"x":101,"y":64,"time":1776753590030},
    {"x":102,"y":64,"time":1776753590036},
    {"x":103,"y":64,"time":1776753590043},
    {"x":104,"y":64,"time":1776753590050},
    {"x":105,"y":64,"time":1776753590056},
    {"x":106,"y":64,"time":1776753590063},
    {"x":107,"y":64,"time":1776753590070},
    {"x":108,"y":64,"time":1776753590076},
    {"x":109,"y":64,"time":1776753590083},
    {"x":110,"y":64,"time":1776753590090},
    {"x":111,"y":64,"time":1776753590096},
    {"x":112,"y":64,"time":1776753590103},
    {"x":113,"y":64,"time":1776753590110},
    {"x":114,"y":64,"time":1776753590116},
    {"x":115,"y":64,"time":1776753590123},
    {"x":116,"y":64,"time":1776753590130},
    {"x":117,"y":64,"time":1776753590136},
    {"x":118,"y":64,"time":1776753590143},
    {"x":119,"y":64,"time":1776753590150},
    {"x":120,"y":64,"time":1776753590156},
    {"x":121,"y":64,"time":1776753590163},
    {"x":122,"y":64,"time":1776753590170},
    {"x":123,"y":64,"time":1776753590176},
    {"x":124,"y":64,"time":1776753590183},
    {"x":125,"y":64,"time":1776753590190},
    {"x":126,"y":64,"time":1776753590196},
    {"x":127,"y":64,"time":1776753590203},
    {"x":128,"y":64,"time":1776753590210},
    {"x":129,"y":64,"time":1776753590216},
    {"x":130,"y":64,"time":1776753590223},
    {"x":131,"y":64,"time":1776753590230},
    {"x":132,"y":64,"time":1776753590236},
    {"x":133,"y":64,"time":1776753590243},
    {"x":134,"y":64,"time":1776753590250},
    {"x":135,"y":64,"time":1776753590256},
    {"x":136,"y":64,"time":1776753590263},
    {"x":137,"y":64,"time":1776753590270},
    {"x":138,"y":64,"time":1776753590276},
    {"x":139,"y":64,"time":1776753590283},
    {"x":140,"y":64,"time":1776753590290},
    {"x":141,"y":64,"time":1776753590296},
    {"x":142,"y":64,"time":1776753590303},
    {"x":143,"y":64,"time":1776753590310},
    {"x":144,"y":64,"time":1776753590316},
    {"x":145,"y":64,"time":1776753590323},
    {"x":146,"y":64,"time":1776753590330},
    {"x":147,"y":64,"time":1776753590336},
    {"x":148,"y":64,"time":1776753590343},
    {"x":149,"y":64,"time":1776753590350},
    {"x":150,"y":64,"time":1776753590356},
    {"x":151,"y":64,"time":1776753590363},
    {"x":152,"y":64,"time":1776753590370},
    {"x":153,"y":64,"time":1776753590376},
    {"x":154,"y":64,"time":1776753590383},
    {"x":155,"y":64,"time":1776753590390},
    {"x":156,"y":64,"time":1776753590396},
    {"x":157,"y":64,"time":1776753590403},
    {"x":158,"y":64,"time":1776753590410},
    {"x":159,"y":64,"time":1776753590416},
    {"x":160,"y":64,"time":1776753590423},
    {"x":161,"y":64,"time":1776753590430},
    {"x":162,"y":64,"time":1776753590436},
    {"x":163,"y":64,"time":1776753590443},
    {"x":164,"y":64,"time":1776753590450},
    {"x":165,"y":64,"time":1776753590456},
    {"x":166,"y":64,"time":1776753590463},
    {"x":167,"y":64,"time":1776753590470},
    {"x":168,"y":64,"time":1776753590476},
    {"x":169,"y":64,"time":1776753590483},
    {"x":170,"y":64,"time":1776753590490},
    {"x":171,"y":64,"time":1776753590496},
    {"x":172,"y":64,"time":1776753590503},
    {"x":173,"y":64,"time":1776753590510},
    {"x":174,"y":64,"time":1776753590516},
    {"x":175,"y":64,"time":1776753590523},
    {"x":176,"y":64,"time":1776753590530},
    {"x":177,"y":64,"time":1776753590536},
    {"x":178,"y":64,"time":1776753590543},
    {"x":179,"y":64,"time":1776753590550},
    {"x":180,"y":64,"time":1776753590556},
    {"x":181,"y":64,"time":1776753590563},
    {"x":182,"y":64,"time":1776753590570},
    {"x":183,"y":64,"time":1776753590576},
    {"x":184,"y":64,"time":1776753590583},
    {"x":185,"y":64,"time":1776753590590},
    {"x":186,"y":64,"time":1776753590596},
    {"x":187,"y":64,"time":1776753590603},
    {"x":188,"y":64,"time":1776753590610},
    {"x":189,"y":64,"time":1776753590616},
    {"x":190,"y":64,"time":1776753590623},
    {"x":191,"y":64,"time":1776753590630},
    {"x":192,"y":64,"time":1776753590636},
    {"x":193,"y":64,"time":1776753590643},
    {"x":194,"y":64,"time":1776753590650},
    {"x":195,"y":64,"time":1776753590656},
    {"x":218,"y":64,"time":1776753590659}
]

def encrypt_local(track, client_ip, check_id, uuid_val, key):
    """本地加密"""
    # 生成轨迹字符串
    track_str = ''.join(f"{p['x']}{p['y']}{p['time']}" for p in track)
    
    # 计算签名
    sign_str = client_ip + check_id + uuid_val + track_str
    sign = hashlib.md5(sign_str.encode()).hexdigest()
    
    # 加密数据
    data = {
        'sign': sign,
        'track': track
    }
    
    data_json = json.dumps(data, separators=(',', ':'))
    
    # AES加密 (ECB模式)
    cipher = AES.new(
        key.encode('utf-8')[:16].ljust(16, b'\0'),
        AES.MODE_ECB
    )
    encrypted = cipher.encrypt(pad(data_json.encode('utf-8'), 16))
    return base64.b64encode(encrypted).decode()


def main():
    # 浏览器捕获的UUID
    uuid_val = 'f0c99646-7fa1-48e3-af3a-4648f84e9de0'
    
    # 需要获取真实的checkId, clientIp, key
    # 这里先用测试值
    
    print("=== 加密对比测试 ===")
    print(f"轨迹点数: {len(browser_track)}")
    print(f"轨迹终点: x={browser_track[-1]['x']}, y={browser_track[-1]['y']}, time={browser_track[-1]['time']}")
    
    # 生成轨迹字符串
    track_str = ''.join(f"{p['x']}{p['y']}{p['time']}" for p in browser_track)
    print(f"\n轨迹字符串 (前200字符): {track_str[:200]}...")
    print(f"轨迹字符串长度: {len(track_str)}")
    
    # 测试不同参数组合
    test_cases = [
        {
            'name': '测试参数1',
            'client_ip': '113.247.60.116',
            'check_id': 'CDFFFDEE4B2A4721B0441A29C3BFEB7E',
            'key': 'Yfc813Zl5KK7WkqZ'
        },
        {
            'name': '测试参数2',
            'client_ip': '113.247.60.116', 
            'check_id': '03168111',
            'key': 'test_key'
        }
    ]
    
    for tc in test_cases:
        print(f"\n--- {tc['name']} ---")
        
        # 计算签名
        sign_str = tc['client_ip'] + tc['check_id'] + uuid_val + track_str
        sign = hashlib.md5(sign_str.encode()).hexdigest()
        print(f"Sign: {sign}")
        
        # 加密
        encrypted = encrypt_local(browser_track, tc['client_ip'], tc['check_id'], uuid_val, tc['key'])
        print(f"加密结果 (前100字符): {encrypted[:100]}...")
        
    # 解码浏览器加密数据看看结构
    print("\n=== 浏览器加密数据分析 ===")
    browser_encrypted = "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"
    
    try:
        decoded = base64.b64decode(browser_encrypted)
        
        # 尝试解密 (ECB模式)
        key = b'yJdWNfbY2J2VXmon'  # 测试key
        
        # 尝试不同key
        test_keys = [
            'Yfc813Zl5KK7WkqZ',
            'yJdWNfbY2J2VXmon',
            'test_key',
        ]
        
        for k in test_keys:
            try:
                cipher = AES.new(
                    k.encode('utf-8')[:16].ljust(16, b'\0'),
                    AES.MODE_ECB
                )
                decrypted = cipher.decrypt(decoded)
                # 去掉padding
                decrypted = decrypted.rstrip(b'\0')
                # 尝试解析JSON
                try:
                    parsed = json.loads(decrypted.decode('utf-8'))
                    print(f"\n使用key '{k}' 解密成功!")
                    print(f"解密内容: {json.dumps(parsed, indent=2)}")
                    break
                except:
                    pass
            except Exception as e:
                pass
                
    except Exception as e:
        print(f"解码失败: {e}")


if __name__ == '__main__':
    main()

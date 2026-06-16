"""
测试本地纯算生成的 mtgsig 是否能通过服务器验证
"""
import json
import subprocess
import requests

# 运行 Node.js 签名器
result = subprocess.run(
    ["node", "pure_signer.js"],
    cwd=r"e:\PythonCodeObject1\Qoder_ObjectProdemo2\sites\dianping\src",
    capture_output=True,
    text=True,
    timeout=30,
    encoding="utf-8",
    errors="replace"
)

output = result.stdout
stderr = result.stderr
print("=== Node.js 输出 ===")
print(output[:500] if len(output) > 500 else output)
if stderr:
    print("STDERR:", stderr[:300])

# 从输出中提取 mtgsig JSON
mtgsig_line = None
for line in output.split("\n"):
    if line.startswith("mtgsig: "):
        mtgsig_line = line.replace("mtgsig: ", "")
        break

if not mtgsig_line:
    # 尝试从 JSON 行提取
    for line in output.split("\n"):
        if '{"a1":"1.2"' in line and '"d1":"' in line:
            mtgsig_line = line.strip()
            break

if not mtgsig_line:
    print("ERROR: 无法从输出中提取 mtgsig")
    print("完整输出:")
    print(output)
    exit(1)

mtgsig = json.loads(mtgsig_line)

# 修复 a9 第三部分（如果是 undefined）
a9_parts = mtgsig["a9"].split(",")
if a9_parts[2] == "undefined":
    import random
    a9_parts[2] = str(random.randint(0, 255))
    mtgsig["a9"] = ",".join(a9_parts)
    print(f"修复 a9: {mtgsig['a9']}")

print("\n=== 生成的 mtgsig ===")
print(json.dumps(mtgsig, indent=2, ensure_ascii=False))

# 加载 cookies
with open(r"e:\PythonCodeObject1\Qoder_ObjectProdemo2\sites\dianping\src\real_b_data.json", "r", encoding="utf-8") as f:
    real_b = json.load(f)

cookies_str = real_b.get("cookies", "")
user_agent = real_b.get("userAgent", "Mozilla/5.0")

# 构建 Cookie 字典
cookies = {}
for item in cookies_str.split("; "):
    if "=" in item:
        k, v = item.split("=", 1)
        cookies[k] = v

headers = {
    "User-Agent": user_agent,
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": "https://m.dianping.com/shop/G7lZQSVUguP43EIT",
    "mtgsig": json.dumps(mtgsig, separators=(",", ":")),
    "Origin": "https://m.dianping.com",
}

url = "https://m.dianping.com/wxmapi/shop/shopquestion"
params = {
    "csecplatform": "4",
    "csecversion": "4.2.0",
    "device_system": "",
    "shopId": "G7lZQSVUguP43EIT",
    "yodaReady": "h5",
}

print("\n=== 发送请求 ===")
print(f"URL: {url}")
print(f"Headers: {json.dumps(headers, indent=2, ensure_ascii=False)}")

try:
    resp = requests.get(
        url,
        params=params,
        headers=headers,
        cookies=cookies,
        timeout=15
    )
    print(f"\n=== 响应 ===")
    print(f"Status: {resp.status_code}")
    print(f"Headers: {dict(resp.headers)}")
    
    try:
        body = resp.json()
        print(f"Body (JSON): {json.dumps(body, indent=2, ensure_ascii=False)[:1000]}")
    except:
        print(f"Body (text): {resp.text[:500]}")
        
except Exception as e:
    print(f"请求失败: {e}")

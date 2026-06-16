"""Save captured WASM binary from cache file to project directory."""
import base64, json, os, re

CACHE_FILE = r'C:\Users\25862\.qoder\cache\projects\Qoder_ObjectProdemo2-ad9702ed\agent-tools\eaeed550\b514672b.txt'
OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'node')
OUT_PATH = os.path.join(OUT_DIR, 'jcap.wasm')

with open(CACHE_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract JSON from markdown code block
match = re.search(r'```json\s*\n(.*?)\n```', content, re.DOTALL)
if match:
    data = json.loads(match.group(1))
    wasm_b64 = data.get('base64', '')
    if wasm_b64:
        wasm_bytes = base64.b64decode(wasm_b64)
        os.makedirs(OUT_DIR, exist_ok=True)
        with open(OUT_PATH, 'wb') as f:
            f.write(wasm_bytes)
        print(f'OK: {len(wasm_bytes)} bytes -> {OUT_PATH}')
    else:
        print('ERROR: no base64 in JSON')
else:
    print('ERROR: could not extract JSON')
    print(f'Content head: {content[:300]}')

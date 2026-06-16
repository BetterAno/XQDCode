"""Decode bdms.js VM bytecode - correct XOR formula"""
import base64, zlib, re, sys, os

BDMS_PATH = "sites/douyin_search_260611/assets/bdms.js"

with open(BDMS_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Find base64 data
pattern = re.compile(r"['\"]([A-Za-z0-9+/=]{500,})['\"]")
matches = pattern.findall(content)
print(f"Found {len(matches)} base64 chunks")

# JavaScript atob returns a binary string; Python b64decode returns bytes
# charCodeAt(i) on the JS string is equivalent to decoded[i] in Python bytes
decoded = base64.b64decode(matches[0])
print(f"Decoded: {len(decoded)} bytes")

# J function logic:
# r = atob(t)  -> decoded bytes
# checksum = sum of charCodeAt(4)..charCodeAt(7) = sum(decoded[4:8])
# key = checksum % 256
checksum = sum(decoded[4:8])
key = checksum % 256
print(f"Checksum from bytes[4:8]: {checksum}, key={key}")

# XOR formula: (key + (key % 10) * i) % 256
encrypted = decoded[8:]
decrypted_bytes = bytearray(len(encrypted))
for i, b in enumerate(encrypted):
    xor_val = (key + (key % 10) * i) % 256
    decrypted_bytes[i] = (b ^ xor_val) & 0xFF

print(f"Decrypted {len(decrypted_bytes)} bytes")
print(f"First 20 hex: {decrypted_bytes[:20].hex()}")

# Try to decompress
for wbits in [-15, 15, 31, 47]:
    try:
        data = zlib.decompress(bytes(decrypted_bytes), wbits)
        print(f"\nDecompressed with wbits={wbits}: {len(data)} bytes")
        print(f"First 200 hex: {data[:200].hex()}")
        outpath = BDMS_PATH.replace('.js', '_decoded.bin')
        with open(outpath, 'wb') as fout:
            fout.write(data)
        print(f"Saved to {outpath}")
        break
    except Exception as e:
        print(f"  wbits={wbits}: {e}")

"""
解码 bdms.js 的 VM 字节码
"""
import base64, struct, zlib, sys, os, re

def decode_bytecode(bdms_path):
    with open(bdms_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 找到长 base64 字符串
    matches = re.findall(r"['\"]([A-Za-z0-9+/=]{1000,})['\"]", content)
    if not matches:
        print("No base64 data found")
        return None

    b64_data = matches[0]
    print(f"Base64 data: {len(b64_data)} chars")

    # Step 1: Base64 decode
    decoded = base64.b64decode(b64_data)
    print(f"Decoded: {len(decoded)} bytes")
    print(f"First 8 bytes hex: {decoded[:8].hex()}")

    # Step 2: Extract checksum from bytes [4-8]
    checksum = sum(decoded[4:8])
    key = checksum % 256
    print(f"Checksum: {checksum}, XOR key: {key}")

    # Step 3: XOR decrypt bytes [8:]
    # _ function: (charCode ^ (index + index % 10 * key) % 256)
    encrypted = decoded[8:]
    decrypted = bytearray(len(encrypted))
    for i, b in enumerate(encrypted):
        decrypted[i] = (b ^ ((i + (i % 10) * key) % 256)) & 0xFF

    print(f"Decrypted: {len(decrypted)} bytes")
    print(f"First 8 bytes hex: {decrypted[:8].hex()}")

    # Step 4: Inflate (ZIP decompress)
    try:
        decompressed = zlib.decompress(decrypted, -15)  # raw deflate
    except:
        # Try with zlib header
        decompressed = zlib.decompress(decrypted)

    print(f"Decompressed: {len(decompressed)} bytes")
    print(f"First 50 bytes hex: {decompressed[:50].hex()}")

    return bytes(decompressed)


def parse_vlf(data, offset=0):
    """Parse variable-length format integer (like bdms W function)"""
    result = 0
    shift = 0
    while True:
        if offset >= len(data):
            break
        byte = data[offset]
        offset += 1
        result |= (byte & 0x7F) << shift
        shift += 7
        if not (byte & 0x80):
            break
    # Handle sign bit
    if shift < 32 and (byte & 0x40):
        result |= -1 << shift
    return result, offset


def parse_data(data):
    """Parse the decompressed data into bytecode and strings"""
    offset = 0

    # Read string table
    string_count, offset = parse_vlf(data, offset)
    print(f"\nString count: {string_count}")
    strings = []
    for i in range(string_count):
        strlen, offset = parse_vlf(data, offset)
        s = data[offset:offset+strlen].decode('utf-8', errors='replace')
        offset += strlen
        strings.append(s)
        if i < 10:
            print(f"  str[{i}]: len={strlen}, '{s[:60]}'")

    # Read bytecode table (z array)
    bc_count, offset = parse_vlf(data, offset)
    print(f"\nBytecode entry count: {bc_count}")
    bytecodes = []
    for i in range(bc_count):
        # Each entry: [int, bool, int, ...] - complex structure
        # Simplified reading
        v1, offset = parse_vlf(data, offset)
        v2 = bool(parse_vlf(data, offset)[0])
        # More data follows but structure is complex
        bytecodes.append((v1, v2))

    print(f"\nRemaining bytes: {len(data) - offset}")
    return strings, bytecodes, offset


if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "sites/douyin_search_260611/assets/bdms.js"
    data = decode_bytecode(path)
    if data:
        strings, bytecodes, _ = parse_data(data)

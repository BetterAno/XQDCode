"""Parse bdms.js decoded bytecode data into string table and bytecode entries"""
import sys, os, struct

def read_vlf(data, offset):
    """Read variable-length format integer (bdms W function)"""
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
    if shift < 32 and (byte & 0x40):
        result |= -1 << shift
    return result, offset

def read_string(data, offset):
    """Read a string (bdms K function)"""
    length, offset = read_vlf(data, offset)
    s = data[offset:offset+length].decode('utf-8', errors='replace')
    offset += length
    return s, offset

def parse_data(filepath):
    with open(filepath, 'rb') as f:
        data = f.read()

    print(f"Data size: {len(data)} bytes")
    offset = 0

    # 1. Read string table
    string_count, offset = read_vlf(data, offset)
    print(f"String count: {string_count}")
    strings = []
    for i in range(string_count):
        s, offset = read_string(data, offset)
        strings.append(s)

    # 2. Read bytecode entries
    entry_count, offset = read_vlf(data, offset)
    print(f"Bytecode entries: {entry_count}")

    entries = []
    for idx in range(entry_count):
        param_count, offset = read_vlf(data, offset)
        flag_val, offset = read_vlf(data, offset)
        flag = bool(flag_val)

        # Extra data
        extra_count, offset = read_vlf(data, offset)
        extra_data = []
        for _ in range(extra_count):
            item = [read_vlf(data, offset)[0] for _ in range(4)]
            extra_data.append(item)

        # Bytecode array
        bc_len, offset = read_vlf(data, offset)
        bytecode = []
        for _ in range(bc_len):
            op, offset = read_vlf(data, offset)
            bytecode.append(op)

        entries.append({
            'index': idx,
            'param_count': param_count,
            'flag': flag,
            'extra_data': extra_data,
            'bc_len': bc_len,
            'bytecode': bytecode
        })

    print(f"Remaining bytes: {len(data) - offset}")
    return strings, entries


def analyze_entries(entries):
    """Find the most interesting bytecode entries"""
    print("\n=== Bytecode Entry Analysis ===")
    print(f"{'Idx':>4} {'Params':>6} {'Flag':>5} {'Extra':>5} {'BC_len':>6}")
    print("-" * 35)

    # Sort by bc_len descending to find the largest bytecodes
    sorted_entries = sorted(entries, key=lambda e: e['bc_len'], reverse=True)

    for e in sorted_entries[:20]:
        extra = e['extra_data']
        extra_summary = f"{len(extra)}" if extra else "0"
        print(f"{e['index']:>4} {e['param_count']:>6} {str(e['flag']):>5} {extra_summary:>5} {e['bc_len']:>6}")

    # Find entries with param_count=2 (XHR interceptor takes 2 params: this, arguments)
    print("\n\n=== Entries with param_count=2 ===")
    for e in entries:
        if e['param_count'] == 2:
            print(f"  index={e['index']} flag={e['flag']} bc_len={e['bc_len']} extra={len(e['extra_data'])}")


if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "sites/douyin_search_260611/assets/bdms_decoded.bin"
    strings, entries = parse_data(path)
    analyze_entries(entries)

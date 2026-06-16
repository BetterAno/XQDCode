"""BDMS VM bytecode disassembler - clean parser"""
import sys, struct

def vlf(data, offset):
    """Read unsigned VLF integer from data at offset, return (value, new_offset)"""
    result, shift = 0, 0
    while True:
        if offset >= len(data):
            return result, offset
        byte = data[offset]; offset += 1
        result |= (byte & 0x7F) << shift
        shift += 7
        if not (byte & 0x80):
            break
    return result, offset

def parse_all(data):
    offset = 0

    # String table
    str_count, offset = vlf(data, offset)
    strings = []
    for _ in range(str_count):
        slen, offset = vlf(data, offset)
        s = data[offset:offset+slen]
        offset += slen
        strings.append(s)

    # Bytecode entries
    entry_count, offset = vlf(data, offset)
    entries = []
    for idx in range(entry_count):
        param_count, offset = vlf(data, offset)
        flag_val, offset = vlf(data, offset)
        flag = bool(flag_val)

        extra_count, offset = vlf(data, offset)
        extra_data = []
        for _ in range(extra_count):
            e0, offset = vlf(data, offset)
            e1, offset = vlf(data, offset)
            e2, offset = vlf(data, offset)
            e3, offset = vlf(data, offset)
            extra_data.append([e0, e1, e2, e3])

        bc_len, offset = vlf(data, offset)
        bytecode = []
        for _ in range(bc_len):
            op, offset = vlf(data, offset)
            bytecode.append(op)

        entries.append({
            'idx': idx,
            'param_count': param_count,
            'flag': flag_val,
            'extra_count': extra_count,
            'extra_data': extra_data,
            'bc_len': bc_len,
            'bytecode': bytecode
        })

    return strings, entries, offset


def main():
    with open('sites/douyin_search_260611/assets/bdms_decoded.bin', 'rb') as f:
        data = f.read()

    strings, entries, end_offset = parse_all(data)
    print(f"Parsed {len(strings)} strings, {len(entries)} entries")
    print(f"End offset: {end_offset}/{len(data)}")

    # Show all entries sorted by param_count
    for e in sorted(entries, key=lambda e: (e['param_count'], e['bc_len'])):
        if e['bc_len'] > 30:
            print(f"  idx={e['idx']:>3} pc={e['param_count']:>3} flag={e['flag']} "
                  f"extra={e['extra_count']:>3} bc_len={e['bc_len']:>4} "
                  f"ops_sample={e['bytecode'][:10]}")

    # Focus on entries with flag=59 (like entry[41])
    print("\n=== Entries with flag=59 ===")
    for e in entries:
        if e['flag'] == 59:
            print(f"  idx={e['idx']:>3} pc={e['param_count']} extra={e['extra_count']} "
                  f"bc_len={e['bc_len']} extras={e['extra_data'][:3] if e['extra_data'] else 'none'}")

    # Show entry with largest bc_len
    print("\n=== Largest bytecode entries ===")
    for e in sorted(entries, key=lambda e: e['bc_len'], reverse=True)[:10]:
        print(f"  idx={e['idx']:>3} pc={e['param_count']} flag={e['flag']} "
              f"extra={e['extra_count']} bc_len={e['bc_len']}")
        # Show string refs (opcode 73)
        refs = []
        bc = e['bytecode']
        for i in range(len(bc)-1):
            if bc[i] == 73 and i+1 < len(bc):
                refs.append(bc[i+1])
        if refs:
            print(f"    string_refs={refs[:20]}")

    # Deep dive into entry[41]
    print("\n=== Entry[41] deep dive ===")
    e = entries[41]
    print(f"bc_len={e['bc_len']} ops={e['bytecode']}")
    print(f"extra_data={e['extra_data']}")

    # Also check entries with pc=0 (no params like the XHR wrapper)
    print("\n=== Entries with pc=0 ===")
    for e in entries:
        if e['param_count'] == 0 and e['bc_len'] > 30:
            print(f"  idx={e['idx']:>3} flag={e['flag']} bc_len={e['bc_len']} extra={e['extra_count']}")


if __name__ == "__main__":
    main()

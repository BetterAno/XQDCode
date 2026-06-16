"""
Analyze H5guard.js source structure:
1. Extract and decode string table
2. Find b[] creation patterns
3. Extract key function signatures
"""
import re
import os
import json

SRC_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "js", "H5guard_live.js")

with open(SRC_PATH, 'r', encoding='utf-8') as f:
    src = f.read()

print(f"Total length: {len(src)} chars")
print()

# ===== 1. Find the 'a' array (hex-encoded string table) =====
print("=" * 60)
print("1. STRING TABLE (a array)")
m = re.search(r',a=\[([^\]]+)\]', src)
if m:
    a_arr = m.group(1)
    strings = re.findall(r'"([0-9a-f]+)"', a_arr)
    print(f"  Count: {len(strings)} hex strings")
    print(f"  First 3: {strings[:3]}")
    print(f"  Last 3: {strings[-3:]}")
    
    # Try to decode the strings (XOR pattern)
    print("\n  Trying to decode string table...")
    # H5guard typically uses XOR with a key or hex-to-string mapping
    # Try XOR with common keys
    for key_bytes in range(1, 256):
        test_str = strings[0]
        try:
            decoded = bytes.fromhex(test_str)
            result = bytes([b ^ key_bytes for b in decoded])
            # Check if result is printable
            if all(32 <= c < 127 or c in (10, 13) for c in result):
                sample = result[:40].decode('ascii', errors='replace')
                print(f"  XOR key {key_bytes}: {sample}")
                # Try second string
                test_str2 = strings[1]
                decoded2 = bytes.fromhex(test_str2)
                result2 = bytes([b ^ key_bytes for b in decoded2])
                sample2 = result2[:40].decode('ascii', errors='replace')
                print(f"    String 2: {sample2}")
        except:
            pass

# ===== 2. Find the $_u_zJ array =====
print()
print("=" * 60)
print("2. BYTECODE/VMDATA ($_u_zJ array)")
m = re.search(r'\$_u_zJ=\[([^\]]+)\]', src)
if m:
    zj = m.group(1)
    nums = re.findall(r'\d+', zj)
    print(f"  Approx elements: {len(nums)}")
    print(f"  First 20 numbers: {nums[:20]}")
    print(f"  Last 20 numbers: {nums[-20:]}")

# ===== 3. Find all function definitions =====
print()
print("=" * 60)
print("3. FUNCTION NAMES (2-4 chars)")
fn_patterns = re.findall(r'function\s+([a-zA-Z_$]{1,4})\s*\(', src)
unique_fns = sorted(set(fn_patterns))
print(f"  Found {len(unique_fns)} unique names:")
for fn in unique_fns:
    indices = [m.start() for m in re.finditer(rf'function\s+{fn}\s*\(', src)]
    # Get a snippet
    snippet_start = indices[0]
    snippet = src[snippet_start:snippet_start+150]
    # Clean up snippet
    snippet_clean = re.sub(r'\{[^}]*\}', '{...}', snippet)
    print(f"  function {fn}: {len(indices)} occurrences")
    print(f"    {snippet_clean[:120]}...")

# ===== 4. Find mtgsig-related patterns =====
print()
print("=" * 60)
print("4. MTSIG-RELATED PATTERNS")

# Look for the mtgsig field names in string table
# mtgsig has a1, a2, a3, a5, a6, a8, a9, a10, x0, d1
# These might be encoded as hex strings
known_fields = ['a1', 'a2', 'a3', 'a5', 'a6', 'a8', 'a9', 'a10', 'd1', 'x0', 'mtgsig']
for field in known_fields:
    # Search for literal string match
    literal = f'"{field}"'
    if literal in src:
        idx = src.find(literal)
        context = src[max(0,idx-50):idx+80]
        print(f"  '{field}' literal found: ...{context}...")
    # Search for single-quoted
    literal_sq = f"'{field}'"
    if literal_sq in src:
        idx = src.find(literal_sq)
        context = src[max(0,idx-50):idx+80]
        print(f"  '{field}' sq found: ...{context}...")

# ===== 5. Find setRequestHeader / header modification =====
print()
print("=" * 60)
print("5. HEADER MODIFICATION PATTERNS")

if "setRequestHeader" in src.lower():
    print("  setRequestHeader found (case insensitive)")
    idx = src.lower().find("setrequestheader")
    context = src[max(0,idx-50):idx+150]
    print(f"  Context: ...{context}...")
else:
    print("  setRequestHeader not found - using encoded form")

# ===== 6. Extract H5guard module export pattern =====
print()
print("=" * 60)
print("6. MODULE EXPORT / WINDOW ASSIGNMENT")
# Find where H5guard is assigned to window
for pattern in ['window.H5guard', "window['H5guard']", 'window["H5guard"]']:
    if pattern in src:
        idx = src.find(pattern)
        context = src[max(0,idx-100):idx+200]
        print(f"  {pattern}: ...{context}...")

# ===== 7. Find where b[] array is populated =====
print()
print("=" * 60)
print("7. b[] ARRAY PATTERNS")
# Look for Array(size) with sizes 20-35
array_sizes = re.findall(r'new Array\((\d+)\)', src)
sizes = [int(s) for s in array_sizes]
potential_b = [s for s in sizes if 20 <= s <= 35]
print(f"  Array sizes 20-35: {sorted(set(potential_b))}")

# Also look for [...][...] patterns that might be b[index] access
b_index = re.findall(r'\[(\d+)\]\s*=\s*', src)
if len(b_index) > 10:
    print(f"  Many [index]= assignments found: {len(b_index)}")

print()
print("=" * 60)
print("DONE")

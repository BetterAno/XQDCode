"""
Deep analysis of H5guard.js:
1. Find and decode the c(n) string decoder function
2. Extract the full string table
3. Extract init flow (how b[] is created)
4. Extract signing functions in detail
5. Map the full algorithm chain
"""
import re
import os
import json
import sys

SRC_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "js", "H5guard_live.js")

with open(SRC_PATH, 'r', encoding='utf-8') as f:
    src = f.read()

print(f"Total length: {len(src)} chars\n")

# ============================================================
# 1. Find the c(n) string decoder function
# ============================================================
print("=" * 70)
print("1. FINDING c(n) STRING DECODER")

# The c function is typically defined as: var c=function(n){...} or function c(n){...}
# Let's search for the pattern
c_matches = list(re.finditer(r'(?:var\s+|let\s+|const\s+)?c\s*=\s*function\s*\(n\)\s*\{', src))
if not c_matches:
    c_matches = list(re.finditer(r'function\s+c\s*\(n\)\s*\{', src))

if c_matches:
    for m in c_matches:
        start = m.start()
        # Find matching brace
        depth = 0
        end = start
        in_func = False
        for i in range(start, min(start + 2000, len(src))):
            if src[i] == '{':
                depth += 1
                in_func = True
            elif src[i] == '}':
                depth -= 1
                if in_func and depth == 0:
                    end = i + 1
                    break
        func_body = src[start:end]
        print(f"  Found at offset {start}, length {end-start}")
        print(f"  Function: {func_body[:300]}...")
        print(f"  ...{func_body[-200:]}")
        
        # Try to extract the XOR key from this function
        # Pattern: parseInt("...",28) or similar
        parseInt_matches = re.findall(r'parseInt\(["\']([^"\']+)["\'],\s*(\d+)\)', func_body)
        if parseInt_matches:
            print(f"  parseInt calls: {parseInt_matches}")
        
        # Look for XOR pattern: ^ or charCodeAt
        xor_patterns = re.findall(r'[\^]', func_body)
        print(f"  XOR operators: {len(xor_patterns)} found")
        
        # Look for the key seed
        seed_match = re.search(r'"([0-9a-z]+)"', func_body)
        if seed_match:
            print(f"  Possible seed: '{seed_match.group(1)}'")
else:
    print("  c function NOT found directly, trying alternative patterns...")
    # It might be defined differently
    alt = re.findall(r'c\s*=\s*function\s*\(n\)\s*\{[^}]*return', src[:50000])
    if alt:
        print(f"  Found alternative: {alt[0][:200]}")

# ============================================================
# 2. Extract the 'a' array (string table)
# ============================================================
print()
print("=" * 70)
print("2. STRING TABLE DECODING")

# Find the a array definition - it could be huge
# Pattern: ,a=["hex1","hex2",...]
a_match = re.search(r',a=\[(.*?)\]', src[:100000])
if a_match:
    a_content = a_match.group(1)
    hex_strings = re.findall(r'"([0-9a-f]+)"', a_content)
    print(f"  Total strings in a[]: {len(hex_strings)}")
    print(f"  First 5: {hex_strings[:5]}")
    print(f"  Last 5: {hex_strings[-5:]}")
    
    # Save decoded strings to file
    output = {"total": len(hex_strings), "hex_strings": hex_strings}
    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "string_table_raw.json")
    with open(out_path, 'w') as f:
        json.dump(output, f)
    print(f"  Saved to {out_path}")
    
    # Try to find the XOR key from the decoder
    # Look for the seed string like "3n2l3o2f2"
    seed_match = re.search(r'"([0-9a-z]{7,12})"', a_content)
    # Actually, the seed is in the c function, not in the array
else:
    # Try larger search area
    a_match2 = re.search(r',a=\[(.*?)\];', src[:200000])
    if a_match2:
        print(f"  Found a[] at offset {a_match2.start()}")
        print(f"  Length: {len(a_match2.group(1))}")

# ============================================================
# 3. Find the c function using a different approach - search for string "3n2l3o2f2"
# ============================================================
print()
print("=" * 70)
print("3. XOR SEED HUNTING")

seed = "3n2l3o2f2"
if seed in src:
    idx = src.find(seed)
    context = src[max(0,idx-200):idx+200]
    print(f"  Seed '{seed}' found at offset {idx}")
    print(f"  Context: ...{context}...")
    
    # Try all offsets
    all_idx = [i for i in range(len(src)) if src.startswith(seed, i)]
    print(f"  All occurrences: {all_idx}")
    
    # For each occurrence, find the enclosing function
    for offset in all_idx[:3]:
        # Search backward for function definition
        search_start = max(0, offset - 500)
        fn_match = re.search(r'function\s+(\w+)\s*\([^)]*\)\s*\{', src[search_start:offset])
        if fn_match:
            print(f"    In function '{fn_match.group(1)}'")
else:
    print(f"  Seed '{seed}' NOT found in source")
    # Try other seeds
    other_seeds = ["3n21302f2", "3n2l3o2f", "n2l3o2f2"]
    for s in other_seeds:
        if s in src:
            print(f"  Alternative seed '{s}' found")
            idx = src.find(s)
            print(f"  Context: ...{src[max(0,idx-100):idx+150]}...")

# ============================================================
# 4. Find H5guard.init function
# ============================================================
print()
print("=" * 70)
print("4. H5guard.init FUNCTION")

# The init is exported on the module, so it's defined inside the factory
# Look for the init function definition - it's likely named something short
# Search for patterns like init:function or function init
init_patterns = [
    r'(init|getfp|getId|sign)\s*:\s*function\s*\([^)]*\)\s*\{',
    r'function\s+(init|getfp)\s*\(',
]

for pat in init_patterns:
    matches = list(re.finditer(pat, src))
    if matches:
        print(f"  Pattern '{pat[:40]}...' found {len(matches)} matches")
        for m in matches[:2]:
            print(f"    At offset {m.start()}: ...{src[m.start():m.start()+120]}...")

# ============================================================
# 5. Extract key signing functions: k0, kB, kx, kP
# ============================================================
print()
print("=" * 70)
print("5. KEY SIGNING FUNCTIONS")

# Find major functions by size
# Search for function definitions with reasonable length
target_fns = ['k0', 'kB', 'kx', 'kP', 'jD', 'jE', 'jH', 'kJ', 'kA', 'kn', 'ks', 'jV']
# Also find functions referenced in init

for fn_name in target_fns:
    # Try multiple patterns
    patterns = [
        rf'function\s+{fn_name}\s*\(',
        rf'{fn_name}\s*=\s*function\s*\(',
    ]
    for pat in patterns:
        m = re.search(pat, src)
        if m:
            start = m.start()
            # Find matching brace
            depth = 0
            end = start
            in_body = False
            for i in range(m.end(), min(start + 20000, len(src))):
                if src[i] == '{':
                    if not in_body:
                        in_body = True
                    depth += 1
                elif src[i] == '}':
                    depth -= 1
                    if in_body and depth == 0:
                        end = i + 1
                        break
            body = src[start:end]
            length = end - start
            
            # Check how many c() references
            c_refs = len(re.findall(r'c\(\d+\)', body))
            
            print(f"  function {fn_name}: {length} chars, {c_refs} c() refs")
            print(f"    {body[:200]}...")
            if length > 500:
                print(f"    ...{body[-200:]}")
            
            # Save to file
            fn_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "functions")
            os.makedirs(fn_dir, exist_ok=True)
            with open(os.path.join(fn_dir, f"{fn_name}.js"), 'w', encoding='utf-8') as f:
                f.write(body)
            break

# ============================================================
# 6. Trace init → b[] creation flow
# ============================================================
print()
print("=" * 70)
print("6. INIT FLOW TRACING")

# Search for Array(size) where size is 20-35 (possible b[] array)
array_new = re.findall(r'new\s+Array\((\d+)\)', src)
sizes = [int(x) for x in array_new]
potential_b_sizes = sorted(set(s for s in sizes if 20 <= s <= 35))
print(f"  Possible b[] sizes: {potential_b_sizes}")

# Search for patterns like b[0]=, b[1]=, etc.
b_assign = re.findall(r'\[(\d+)\]\s*=\s*[^;]{3,200}', src)
if b_assign:
    # Group by index
    from collections import Counter
    indices = Counter(int(x) for x in b_assign)
    print(f"  Top [index]= assignments: {indices.most_common(10)}")

# Search for the main init function - it usually calls multiple setup functions
# Look for a function that contains b[0]=... AND b[1]=...
# That would be the init function

# ============================================================
# 7. Find the complete sign function entry point
# ============================================================
print()
print("=" * 70)
print("7. SIGN ENTRY POINT")

# Search for references to the signing flow
# Look for send hook ≡ kP
if 'XMLHttpRequest' in src:
    xhr_idx = src.find('XMLHttpRequest')
    print(f"  XMLHttpRequest found at offset {xhr_idx}")
    context = src[max(0,xhr_idx-100):xhr_idx+300]
    print(f"  Context: ...{context[:400]}...")

# ============================================================
# 8. Find custom Base64 implementation
# ============================================================
print()
print("=" * 70)
print("8. CUSTOM BASE64")

# Look for string "ZmserbBoHQtNP+wOcza/LpngG8yJq42KWYj0DSfdikx3VT16IlUA"
b64_alphabets = re.findall(r'"([A-Za-z0-9+/=]{64})"', src)
if b64_alphabets:
    unique = set(b64_alphabets)
    for alpha in unique:
        if alpha != "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/":
            print(f"  Custom Base64 alphabet: {alpha}")
else:
    # Try different pattern
    b64_in_array = re.findall(r'"([A-Za-z0-9+/]{60,66})"', src)
    for a in b64_in_array:
        if len(a) >= 63 and a != "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/":
            print(f"  Possible Base64 alphabet: {a} (len={len(a)})")

# ============================================================
# 9. Trace the complete signing pipeline
# ============================================================
print()
print("=" * 70)
print("9. SIGNING PIPELINE OVERVIEW")

# Print all function-to-function call relationships
# We know from the summary:
# sign → kA → kB → kx (real) / k0 (pass-through)
# XHR.send → kP → jH → jD → jE

pipeline = """
Full mtgsig signing pipeline:

1. XHR/fetch intercepted by kP (XHR hook)
2. kP checks domain via jH → returns sign type (0/1/2)
3. kP calls jD to build mtgsig parameter string
4. jD calls kA for actual signing
5. kA calls kB (dispatcher)
6. kB checks e7() → calls kx (Promise-based) or k0 (pass-through)
7. kx/k0 runs the aS VM to generate the signature
8. k0 returns the signed URL/mtgsig

Alternative: H5guard.sign() API
1. sign(url) → calls kA directly
2. kA → kB → kx/k0 → returns mtgsig
"""
print(pipeline)

print()
print("=" * 70)
print("DONE - Deep analysis complete")

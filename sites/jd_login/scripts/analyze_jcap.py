#!/usr/bin/env python3
"""Extract key code sections from jcap_ap0b2a.js"""
import re

path = r'e:\PythonCodeObject1\Qoder_ObjectProdemo2\sites\jd_login\assets\js\jcap_ap0b2a.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

print("File size:", len(content))

# Find the module that creates import object 'a'
# Look for patterns like: var X = { a: { ... } }
# The imports are module "a" with functions a-R
pattern = r"\{[\s\n]*[\"']a[\"'][\s\n]*:[\s\n]*\{"
matches = list(re.finditer(pattern, content))
print(f"\nFound {len(matches)} matches for 'a': {{")
for m in matches[:5]:
    start = max(0, m.start() - 100)
    end = min(len(content), m.end() + 500)
    print(f"\nAt offset {m.start()}:")
    print(content[start:end][:800])
    print("...")

# Find where Fa is called - context before it
fa_call_pos = content.find("),Fa(r,(function(A){e(A.instance)})).catch(q)")
print(f"\n\n=== Fa call at offset: {fa_call_pos} ===")
if fa_call_pos > 0:
    # Get the surrounding function context
    start = max(0, fa_call_pos - 3000)
    end = min(len(content), fa_call_pos + 200)
    chunk = content[start:end]
    
    # Find the function beginning
    func_start = chunk.rfind("function(")
    if func_start > 0:
        # Find the 'var r' or 'r =' before Fa call
        r_assigns = list(re.finditer(r'\br\s*=\s*', chunk))
        if r_assigns:
            print(f"Found r assignments: {len(r_assigns)}")
            for ra in r_assigns:
                ctx_start = max(0, ra.start() - 50)
                ctx_end = min(len(chunk), ra.end() + 300)
                print(f"  ...{chunk[ctx_start:ctx_end]}...")
        else:
            print("No 'r =' found in context")
            # r might be a parameter
            print("Checking if r is a function parameter...")
            print("Context before Fa:", chunk[-1000:])
    
    # Also find the local function containing this call
    # Search backwards for function name
    for m in re.finditer(r'function\s+(\w+)', chunk):
        print(f"Function in context: {m.group(0)} at {m.start()}")

# Find e function that processes the instance
print("\n\n=== Finding 'e' instance processing ===")
for m in re.finditer(r'function\s*\w*\s*\(A\)\s*\{[^}]*?A\.instance[^}]*?\}', content):
    start = max(0, m.start() - 100)
    end = min(len(content), m.end() + 100)
    print(f"At {m.start()}: ...{content[start:end]}...")
    print()

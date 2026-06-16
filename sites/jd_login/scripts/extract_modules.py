#!/usr/bin/env python3
"""
Parse webpack bundle and extract the module that defines WASM import functions.
The bundle structure is: 
  function(A){ var t={}; function e(n){...}; return e(...)({NUMBER: function(A,t,e){...}, ...}) }
"""
import re, json

path = r'e:\PythonCodeObject1\Qoder_ObjectProdemo2\sites\jd_login\assets\js\jcap_ap0b2a.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Total size: {len(content)}")

# The webpack modules are at the end: e(...)({ "0": function..., "1": function..., ... })
# Find the modules object: starts with { "0": or {0:
modules_match = re.search(r'return\s+e\s*\(\s*e\.s\s*=\s*\d+\s*\)\s*\}\s*\(\s*\{', content)
if modules_match:
    modules_start = modules_match.end() - 1  # start of {
    print(f"Modules object starts at {modules_start}")
    
    # Find the closing }) at the end
    # The entire structure is: }({ ... }))
    # Find the matching brace
    brace_count = 1
    pos = modules_start + 1
    in_string = False
    string_char = None
    while pos < len(content) and brace_count > 0:
        c = content[pos]
        if in_string:
            if c == '\\':
                pos += 1  # skip escaped char
            elif c == string_char:
                in_string = False
        else:
            if c in ('"', "'"):
                in_string = True
                string_char = c
            elif c == '{':
                brace_count += 1
            elif c == '}':
                brace_count -= 1
        pos += 1
    
    modules_end = pos
    modules_json = content[modules_start:modules_end]
    print(f"Modules object ends at {modules_end}, length: {len(modules_json)}")
    
    # Save the modules JSON for analysis
    with open(r'e:\PythonCodeObject1\Qoder_ObjectProdemo2\sites\jd_login\node\modules_raw.txt', 'w', encoding='utf-8') as f:
        f.write(modules_json[:10000])
    print("Saved first 10000 chars to modules_raw.txt")
    
    # Find module names (keys) - they are quoted strings before ':function'
    module_names = re.findall(r'"([^"]+)"\s*:\s*function', modules_json)
    print(f"\nFound {len(module_names)} modules")
    for name in module_names[:20]:
        print(f"  {name}")
    
    # Find the module that contains the 'Fa' call for WASM instantiation
    for name in module_names:
        pattern = f'"{name}"'
        idx = modules_json.find(pattern)
        if idx > 0:
            # Find the module body (skip to function body)
            func_match = re.search(pattern + r'\s*:\s*function\s*\(A\s*,\s*t\s*,\s*e\s*\)\s*\{', modules_json[idx:idx+200])
            if func_match:
                body_start = idx + func_match.end()
                # Find the matching closing brace
                bc = 1
                pi = body_start
                while pi < len(modules_json) and bc > 0:
                    if modules_json[pi] == '{':
                        bc += 1
                    elif modules_json[pi] == '}':
                        bc -= 1
                    pi += 1
                body = modules_json[body_start:pi-1]
                if 'Fa(r,' in body or 'WebAssembly.instantiate' in body or 'getCTData' in body:
                    print(f"\nModule '{name}' ({len(body)} chars) - KEY FIND!")
                    print(f"  Contains Fa: {'Fa(r,' in body}")
                    print(f"  Contains instantiate: {'WebAssembly.instantiate' in body}")
                    print(f"  Contains getCTData: {'getCTData' in body}")
                    print(f"  Contains wasmBinary: {'wasmBinary' in body}")
                    # Save this module
                    with open(rf'e:\PythonCodeObject1\Qoder_ObjectProdemo2\sites\jd_login\node\module_{name}.js', 'w', encoding='utf-8') as f:
                        f.write(body)
                    print(f"  Saved to module_{name}.js")
else:
    print("Could not find module object")

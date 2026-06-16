#!/usr/bin/env python3
"""Find the webpack module that creates WASM import environment"""
import re

path = r'e:\PythonCodeObject1\Qoder_ObjectProdemo2\sites\jd_login\assets\js\jcap_ap0b2a.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

fa_pos = 547522

# Find the webpack module containing the Fa call
# Webpack modules: {0: function(A,t,e){...}, "name": function(A,t,e){...}}
# Search for module boundaries
pattern = r'\}(?:\s*,\s*)?"([^"]+)"\s*:\s*function\s*\(A\s*,\s*t\s*,\s*e\s*\)'

# Find the last module before fa_pos
modules_before = list(re.finditer(pattern, content[:fa_pos]))
if modules_before:
    last_module = modules_before[-1]
    module_name = last_module.group(1)
    module_start = last_module.start()
    # Get the module content (go to the function body start)
    func_body_start = last_module.end()
    # Find the matching closing brace
    brace_count = 0
    pos = func_body_start - 1  # start at the opening brace of function
    found_open = False
    for pos in range(func_body_start, min(len(content), func_body_start + 50000)):
        if content[pos] == '{':
            brace_count += 1
            if not found_open:
                found_open = True
        elif content[pos] == '}':
            brace_count -= 1
            if found_open and brace_count == 0:
                module_end = pos + 1
                break
    else:
        module_end = func_body_start + 50000
    
    module_content = content[func_body_start:module_end]
    print(f"Module '{module_name}' at {module_start}, size: {len(module_content)}")
    
    # Check if this module contains the Fa call
    if 'Fa(r,' in module_content or 'Ea(' in module_content:
        print("This module contains the Fa/Ea call!")
    
    # Save the module content for analysis
    output_path = r'e:\PythonCodeObject1\Qoder_ObjectProdemo2\sites\jd_login\node\wasm_module.js'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(module_content)
    print(f"Saved module to {output_path}")
    
    # Search for 'a:' pattern in the module
    a_matches = list(re.finditer(r'\ba\s*:', module_content[:2000]))
    for m in a_matches:
        ctx = module_content[max(0,m.start()-20):m.end()+100]
        print(f"Found 'a:' at {m.start()}: ...{ctx}...")
else:
    print("No modules found before Fa call")

# Also find the module that wraps the exports (_ac, _U, _pb, _gc)
# These are right after the Fa call
# Search _ac
ac_pos = content.find('_ac=function(A){return(_ac=Z.U)(A)}')
if ac_pos > 0:
    print(f"\n_ac found at {ac_pos}")
    # Find the enclosing module
    for m in re.finditer(pattern, content[ac_pos-20000:ac_pos]):
        print(f"Module before _ac: {m.group(1)} at offset {ac_pos-20000+m.start()}")

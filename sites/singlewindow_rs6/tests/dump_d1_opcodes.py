"""Phase 2 — dump every D1 opcode body into a json file so we can analyze it."""
from __future__ import annotations
import json
import re
from pathlib import Path

JS_PATH = Path(__file__).resolve().parents[1] / "assets" / "js" / "oQ91zEKu9zN4.44d6eb6.js"
txt = JS_PATH.read_text(encoding="utf-8", errors="replace")

# D1 dispatcher starts at offset 1679 according to inspect_vmp output
# find the while(1){ at offset 1679
i = txt.find("while(1){", 1670)
assert i > 0, "D1 dispatcher not found"
# find matching '}'
depth = 0
open_idx = txt.find("{", i)
end = -1
j = open_idx
in_str = None
esc = False
while j < len(txt):
    ch = txt[j]
    if in_str:
        if esc: esc = False
        elif ch == "\\": esc = True
        elif ch == in_str: in_str = None
    else:
        if ch in ("'", '"'): in_str = ch
        elif ch == "{": depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                end = j; break
    j += 1
body = txt[open_idx + 1 : end]
print(f"D1 body len = {len(body)}")

# split into opcode cases
cases = {}
# pattern: if(_$$L===N){<stmt>}
case_pat = re.compile(r"if\(_\$\$L===(-?\d+)\)\{")
for m in case_pat.finditer(body):
    num = int(m.group(1))
    start = m.end()
    depth = 1
    k = start
    in_str = None
    esc = False
    while k < len(body):
        ch = body[k]
        if in_str:
            if esc: esc = False
            elif ch == "\\": esc = True
            elif ch == in_str: in_str = None
        else:
            if ch in ("'", '"'): in_str = ch
            elif ch == "{": depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    break
        k += 1
    cases[num] = body[start:k]

print(f"opcodes extracted: {len(cases)}")
print(f"opcode numbers: {sorted(cases.keys())}")

# also the trailing `else` of each tree (the default catch-all). For each missing N
# we can later determine which N corresponds to the else branch.

# dump
out = {str(k): cases[k] for k in sorted(cases.keys())}
out_path = JS_PATH.parent.parent / "phase2_d1_opcodes.json"
out_path.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"written: {out_path}")

# print one-liners for each opcode for an overview
print("\n--- opcode summary (first 120 chars each) ---")
for n in sorted(cases.keys()):
    line = cases[n].replace("\n", " ").strip()
    print(f"op {n:3d}: {line[:120]}")

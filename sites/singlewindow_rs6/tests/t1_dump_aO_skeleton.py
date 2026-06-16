"""T1 step 3 — dump the SKELETON of _$aO to understand its multi-entry dispatch."""
from __future__ import annotations
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
JS_PATH = SITE / "assets" / "js" / "oQ91zEKu9zN4.44d6eb6.js"
txt = JS_PATH.read_text(encoding="utf-8", errors="replace")

m = re.search(r"function\s+_\$aO\s*\(([^)]*)\)\s*\{", txt)
assert m, "_$aO not found"
sig = m.group(1)
brace_open = m.end() - 1

depth = 0
i = brace_open
in_str = None
esc = False
end = -1
while i < len(txt):
    ch = txt[i]
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
                end = i; break
    i += 1
body = txt[brace_open + 1 : end]
print(f"_$aO sig: ({sig})")
print(f"_$aO body length: {len(body)}")

inner_funcs = []
depth = 0
i = 0
in_str = None
esc = False
while i < len(body):
    ch = body[i]
    if in_str:
        if esc: esc = False
        elif ch == "\\": esc = True
        elif ch == in_str: in_str = None
    else:
        if ch in ("'", '"'): in_str = ch
        elif ch == "{": depth += 1
        elif ch == "}": depth -= 1
        elif depth == 0 and body[i:i+9] == "function ":
            mname = re.match(r"function\s+(_\$[\w$]+)\s*\(([^)]*)\)\s*\{", body[i:i+200])
            if mname:
                inner_funcs.append((i, mname.group(1), mname.group(2)))
    i += 1
print(f"_$aO inner top-level functions: {len(inner_funcs)}")
for pos, name, args in inner_funcs[:60]:
    print(f"  @{pos:6d}  {name}({args})")

aO_body_start = brace_open + 1
print(f"\n_$aO body starts at file-offset {aO_body_start}")
print(f"D1 dispatch (file 1679)  -> _$aO body offset {1679 - aO_body_start}")
print(f"D2 dispatch (file 256742) -> _$aO body offset {256742 - aO_body_start}")

prelude = txt[aO_body_start : 1679]
print(f"\n_$aO prelude head 600 chars:\n{prelude[:600]}")
print(f"\n_$aO prelude tail 800 chars:\n{prelude[-800:]}")

ci_re = re.compile(r"_\$ci")
ci_hits = [mm.start() for mm in ci_re.finditer(body)]
print(f"\n_$ci occurrences in _$aO: count={len(ci_hits)}")
for p in ci_hits[:8]:
    print(f"  @{p}: ...{body[max(0,p-30):p+80]}...")

sw_hits = [mm.start() for mm in re.finditer(r"switch\s*\(", body)]
print(f"\nswitch(...) hits in _$aO body: {len(sw_hits)}")
for p in sw_hits[:3]:
    print(f"  @{p}: ...{body[p:p+200]}...")

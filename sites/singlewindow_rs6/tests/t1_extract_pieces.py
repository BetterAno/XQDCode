"""T1 step 2 — extract from oQ91zEKu9zN4.44d6eb6.js:
  (a) full body of `_$k7()` — the byte-stream reader
  (b) full body of `_$bH` / `_$aO` (helper / function-table dispatcher)
  (c) D1 op 53's `_$j$` string (the BMP-packed encoded-token table)
  (d) the tail IIFE call: 5 opcode arrays
  (e) the inner IIFE wrapper head
"""
from __future__ import annotations
import json
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
JS_PATH = SITE / "assets" / "js" / "oQ91zEKu9zN4.44d6eb6.js"
OUT = SITE / "assets" / "t1_pieces.json"
txt = JS_PATH.read_text(encoding="utf-8", errors="replace")
print(f"vmp size = {len(txt)} bytes")


def brace_block(s: str, brace_open_idx: int) -> str:
    depth = 0
    i = brace_open_idx
    in_str = None
    esc = False
    while i < len(s):
        ch = s[i]
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
                    return s[brace_open_idx:i + 1]
        i += 1
    raise ValueError("unmatched brace")


def find_function_body(name: str) -> str | None:
    pat = re.compile(r"function\s+" + re.escape(name) + r"\s*\(([^)]*)\)\s*\{")
    m = pat.search(txt)
    if not m:
        return None
    open_idx = m.end() - 1
    body = brace_block(txt, open_idx)
    return f"function {name}({m.group(1)}){body}"


pieces: dict[str, object] = {}

# (a) _$k7
k7 = find_function_body("_$k7")
pieces["_$k7"] = {"len": len(k7) if k7 else 0, "src": k7}
print(f"_$k7: {'FOUND' if k7 else 'MISSING'} ({len(k7) if k7 else 0} chars)")
if k7:
    print(f"  body head 400: {k7[:400]}")

# (b) helpers
for name in ["_$bH", "_$aO", "_$my", "_$bU", "_$$s", "_$_i", "_$cP", "_$a4", "_$ps", "_$iq", "_$ea", "_$bs", "_$p0", "_$hy"]:
    body = find_function_body(name)
    pieces[name] = {"len": len(body) if body else 0, "src": (body[:1500] if body else None)}
    print(f"{name}: {'FOUND' if body else 'MISSING'} ({len(body) if body else 0} chars)")
    if body:
        print(f"  head 200: {body[:200]}")

# (c) _$j$ literal
m = re.search(r'_\$j\$\s*=\s*"', txt)
if m:
    start = m.end()
    i = start
    esc = False
    end = -1
    while i < len(txt):
        ch = txt[i]
        if esc:
            esc = False
        elif ch == "\\":
            esc = True
        elif ch == '"':
            end = i
            break
        i += 1
    j_str = txt[start:end]
    print(f"\n_$j$ literal: len={len(j_str)} chars, first cp = 0x{ord(j_str[0]):04x}")
    print(f"  first 30 codepoints: {[hex(ord(c)) for c in j_str[:30]]}")
    print(f"  last  30 codepoints: {[hex(ord(c)) for c in j_str[-30:]]}")
    # codepoint distribution
    cps = sorted(set(ord(c) for c in j_str))
    print(f"  unique codepoints: {len(cps)} from 0x{cps[0]:04x} to 0x{cps[-1]:04x}")
    print(f"  histogram by range: <128={sum(1 for c in j_str if ord(c)<128)}  128-255={sum(1 for c in j_str if 128<=ord(c)<256)}  256+={sum(1 for c in j_str if ord(c)>=256)}")
    pieces["_$j$"] = {"length": len(j_str), "unique_cp": len(cps), "min_cp": cps[0], "max_cp": cps[-1]}
    (SITE / "assets" / "t1__j_dollar.txt").write_text(j_str, encoding="utf-8")
else:
    pieces["_$j$"] = None
    print("_$j$ NOT FOUND")

# (d) tail IIFE call - the 5 opcode arrays
m = re.search(r"\}\s*\)\s*\(\s*\[\s*\]\s*,\s*\[\s*\[", txt)
if m:
    start = m.end() - 2
    depth = 0
    i = m.end() - 2
    end = -1
    while i < len(txt):
        ch = txt[i]
        if ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
        i += 1
    arr_src = txt[start:end]
    print(f"\ntail opcode-array src: starts@{start}, len={len(arr_src)} chars")
    try:
        groups = []
        cur = []
        depth = 0
        i = 0
        while i < len(arr_src):
            ch = arr_src[i]
            if ch == "[":
                if depth == 1:
                    cur = []
                depth += 1
                i += 1
            elif ch == "]":
                depth -= 1
                if depth == 1 and cur:
                    groups.append(cur)
                    cur = []
                i += 1
            elif depth >= 2 and (ch.isdigit() or ch == "-"):
                j = i
                while j < len(arr_src) and (arr_src[j].isdigit() or arr_src[j] == "-"):
                    j += 1
                cur.append(int(arr_src[i:j]))
                i = j
            else:
                i += 1
        print(f"parsed {len(groups)} opcode arrays, sizes = {[len(g) for g in groups]}")
        pieces["opcode_arrays"] = groups
        for idx, g in enumerate(groups):
            print(f"  arr[{idx}] first 30: {g[:30]}")
    except Exception as exc:
        print(f"parse failed: {exc!r}")
else:
    pieces["opcode_arrays"] = None
    print("tail IIFE call NOT FOUND")

# (e) IIFE wrapper head
m = re.search(r"\(\s*function\s*\(\s*_\$b0\s*,\s*_\$\$9\s*\)\s*\{", txt)
if m:
    open_idx = m.end() - 1
    head = txt[m.start():open_idx + 600]
    pieces["iife_head"] = head
    print(f"\nIIFE wrapper head 600 chars:")
    print(head[:600])

def trunc(obj, limit=4000):
    if isinstance(obj, str) and len(obj) > limit:
        return obj[:limit] + f"...[truncated {len(obj) - limit}]"
    if isinstance(obj, dict):
        return {k: trunc(v, limit) for k, v in obj.items()}
    if isinstance(obj, list):
        return obj
    return obj

OUT.write_text(json.dumps(trunc(pieces), indent=2, ensure_ascii=False), encoding="utf-8")
print(f"\n--- summary written to {OUT.name} ---")

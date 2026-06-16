"""Phase 2 — extract each `while(1){...}` dispatcher body from vmp,
count opcodes per dispatcher, and locate the string-table decoder (_$j$)."""
from __future__ import annotations
import json
import re
from pathlib import Path

JS = Path(__file__).resolve().parents[1] / "assets" / "js" / "oQ91zEKu9zN4.44d6eb6.js"
txt = JS.read_text(encoding="utf-8", errors="replace")

# find every "while(1){" position
starts = [m.start() for m in re.finditer(r"while\(1\)\{", txt)]
print(f"while(1) loops at: {starts}")

def extract_brace_block(s: str, open_brace_idx: int) -> tuple[int, int]:
    """Find matching '}' for the '{' at index open_brace_idx (s[open_brace_idx] == '{')."""
    depth = 0
    i = open_brace_idx
    in_str = None
    esc = False
    while i < len(s):
        ch = s[i]
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == in_str:
                in_str = None
        else:
            if ch in ("'", '"'):
                in_str = ch
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    return open_brace_idx, i
        i += 1
    return open_brace_idx, -1


# extract the three while(1) bodies
disp_info = []
for s in starts:
    open_idx = txt.find("{", s)
    a, b = extract_brace_block(txt, open_idx)
    body = txt[a + 1 : b]
    # find what variable is used as opcode (the assignment just before while)
    # pattern: _$pG = _$aE[_$_C++];  <-- inside while body usually first stmt
    asg = re.match(r"\s*([A-Za-z_$0-9]+)\s*=\s*([A-Za-z_$0-9]+)\[([A-Za-z_$0-9]+)\+\+\];", body)
    opcode_var = asg.group(1) if asg else "?"
    array_var = asg.group(2) if asg else "?"
    cursor_var = asg.group(3) if asg else "?"
    # find all `if(<opvar>===<N>){` opcodes
    pat = re.compile(rf"if\({re.escape(opcode_var)}===(-?\d+)\)\{{", re.S)
    cases = sorted(set(int(m.group(1)) for m in pat.finditer(body)))
    print(f"\n>>> dispatcher @{s} body len={b - a} opcode_var={opcode_var} table={array_var} cursor={cursor_var}")
    print(f"    cases count={len(cases)}  range=[{min(cases) if cases else None}..{max(cases) if cases else None}]")
    print(f"    missing in [0..max]: {sorted(set(range(max(cases) + 1)) - set(cases)) if cases else []}")
    print(f"    body head 400 chars:")
    print("    " + repr(body[:400]))
    disp_info.append({
        "offset": s, "body_len": b - a, "opcode_var": opcode_var,
        "array_var": array_var, "cursor_var": cursor_var,
        "case_count": len(cases), "min_case": min(cases) if cases else None,
        "max_case": max(cases) if cases else None,
    })

# locate _$j$ literal (the encoded string table) used by line ~4711 of rs6js_code.js
jp = re.search(r'_\$j\$\s*=\s*"([\s\S]+?)";', txt)
if jp:
    s = jp.group(1)
    print(f"\n>>> _$j$ string table found: len={len(s)}, first 80 chars repr= {s[:80]!r}")

# locate the LCG constants 0x3d3f and 0x269ec3 occurrences (signal of _$my key gen)
lcg = re.findall(r"0x3d3f\*\([^)]+\)\+0x269ec3", txt)
print(f"\n>>> LCG-key occurrences: {len(lcg)}")

# find string-decoder loop using _$ac
acdec = re.findall(r"_\$j\$\.substr\(_\$ac,\s*_\$_S\);_\$ac\+=_\$_S", txt)
print(f">>> _$j$.substr(_$ac, ...) decoder hits: {len(acdec)}")

(Path(JS.parent.parent) / "phase2_dispatcher.json").write_text(
    json.dumps(disp_info, indent=2, ensure_ascii=False), encoding="utf-8"
)
print("\n--- phase2_dispatcher.json written ---")

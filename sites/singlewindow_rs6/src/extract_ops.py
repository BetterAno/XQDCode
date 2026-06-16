"""Extract D1 opcode bodies from a vmp JS file (handles else branches + single-else trees).

Output: dict[int op_id, str body_js]. Standalone runnable as:
    python -m extract_ops
which writes a per-vmp catalog into src/d1_opcodes.json.
"""
from __future__ import annotations
import json
import re
from pathlib import Path


def _brace_close(s, start_brace_idx):
    depth = 0
    i = start_brace_idx
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
                    return i
        i += 1
    return -1


def _split_chain(s):
    out = []
    i = 0
    n = len(s)
    while i < n:
        while i < n and s[i].isspace():
            i += 1
        if i >= n:
            break
        if s.startswith("if(", i):
            i += 3
        elif s.startswith("else if(", i):
            i += 8
        elif s.startswith("else{", i):
            j = s.find("{", i)
            end = _brace_close(s, j)
            out.append(("", s[j + 1:end]))
            i = end + 1
            break
        elif s.startswith("else;", i) or s.startswith("else ;", i):
            out.append(("", ""))
            i = s.find(";", i) + 1
            break
        else:
            break
        depth = 1
        cs = i
        while i < n and depth > 0:
            if s[i] == "(":
                depth += 1
            elif s[i] == ")":
                depth -= 1
                if depth == 0:
                    cend = i
                    break
            i += 1
        cond = s[cs:cend]
        i = cend + 1
        while i < n and s[i] != "{":
            i += 1
        bend = _brace_close(s, i)
        out.append((cond, s[i + 1:bend]))
        i = bend + 1
    return out


def extract_d1_opcodes(vmp_js_text):
    needle = "_$$L=_$nl[_$lV++];"
    pos = vmp_js_text.find(needle)
    if pos < 0:
        raise RuntimeError("D1 dispatcher signature not found")
    ws_pos = vmp_js_text.rfind("while(1){", 0, pos)
    brace_pos = vmp_js_text.find("{", ws_pos + len("while(1)"))
    end_pos = _brace_close(vmp_js_text, brace_pos)
    body = vmp_js_text[brace_pos + 1:end_pos]
    first_if = body.find("if(")
    root = body[first_if:]
    opcodes = {}
    eq_pat = re.compile(r"_\$\$L===(-?\d+)$")
    lt_pat = re.compile(r"_\$\$L<(-?\d+)$")

    def walk(s, span_low, span_high):
        s = s.strip()
        if not s.startswith("if("):
            f = s.find("if(")
            if f < 0:
                return
            s = s[f:]
        chain = _split_chain(s)
        eq_cases = []
        lt_cases = []
        else_body = None
        for cond, b in chain:
            if cond == "":
                else_body = b
            else:
                m_eq = eq_pat.match(cond)
                m_lt = lt_pat.match(cond)
                if m_eq:
                    eq_cases.append((int(m_eq.group(1)), b))
                elif m_lt:
                    lt_cases.append((int(m_lt.group(1)), b))
        if eq_cases and not lt_cases:
            for op_id, b in eq_cases:
                opcodes[op_id] = b.strip()
            if else_body is not None and else_body.strip():
                base = (eq_cases[0][0] // 4) * 4
                opcodes[base + 3] = else_body.strip()
            return
        if lt_cases:
            prev = span_low
            for bound, b in lt_cases:
                walk(b, prev, bound - 1)
                prev = bound
            if else_body is not None:
                stripped = else_body.strip()
                if stripped.startswith("if("):
                    walk(stripped, prev, span_high)
                elif stripped:
                    opcodes[prev] = stripped

    walk(root, 0, 999)
    return opcodes


def vmp_name_from_path(p):
    return p.name.split(".")[0]


def main():
    SITE = Path(__file__).resolve().parents[1]
    JS_DIR = SITE / "assets" / "js"
    OUT = SITE / "src" / "d1_opcodes.json"
    catalog = {}
    for p in sorted(JS_DIR.glob("*.js")):
        name = vmp_name_from_path(p)
        ops = extract_d1_opcodes(p.read_text(encoding="utf-8", errors="replace"))
        catalog[name] = {str(k): ops[k] for k in sorted(ops.keys())}
        print(f"{name}: {len(ops)} opcodes, range [{min(ops)}..{max(ops)}]")
    OUT.write_text(json.dumps(catalog, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nwrote {OUT}")

    by_vmp = {}
    all_bodies = set()
    for vmp, ops in catalog.items():
        by_vmp[vmp] = set(ops.values())
        all_bodies |= by_vmp[vmp]
    print(f"\nunique bodies across vmps (union): {len(all_bodies)}")
    for vmp, body_set in by_vmp.items():
        print(f"  {vmp}: {len(body_set)} bodies")

    names = list(by_vmp.keys())
    if len(names) >= 2:
        a, b = names[0], names[1]
        only_a = by_vmp[a] - by_vmp[b]
        only_b = by_vmp[b] - by_vmp[a]
        common = by_vmp[a] & by_vmp[b]
        print(f"\nintersection {a} ∩ {b}: {len(common)}")
        print(f"only in {a}: {len(only_a)}")
        for body in sorted(only_a)[:12]:
            print(f"  - {body[:140]}")
        print(f"only in {b}: {len(only_b)}")
        for body in sorted(only_b)[:12]:
            print(f"  - {body[:140]}")


if __name__ == "__main__":
    main()

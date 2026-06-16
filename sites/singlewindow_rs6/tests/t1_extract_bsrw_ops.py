"""T1 — extract all opcodes from BSrw vmp's D1 dispatcher (incl. op 97/98/99 if present)
and merge into src/d1_opcodes.json."""
from __future__ import annotations
import json
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
JS = SITE / "assets" / "js" / "BSrw3csEQORp.44d6eb6.js"
OUT_JSON = SITE / "src" / "d1_opcodes.json"
txt = JS.read_text(encoding="utf-8", errors="replace")


def brace_close(s, start):
    depth = 0
    i = start
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


# locate D1 while body
needle = "_$$L=_$nl[_$lV++];"
idx = txt.find(needle)
# find the enclosing while(1){
while_start = txt.rfind("while(1){", 0, idx)
assert while_start >= 0
brace = txt.find("{", while_start + len("while(1)"))
end = brace_close(txt, brace)
inner = txt[brace + 1:end]
first_if = inner.find("if(")
root = inner[first_if:]
print(f"BSrw D1 body len={len(inner)}, root[:80]={root[:80]!r}")


def split_chain(s):
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
            body = s[j + 1:brace_close(s, j)]
            out.append(("", body))
            i = brace_close(s, j) + 1
            break
        elif s.startswith("else ;", i) or s.startswith("else;", i):
            out.append(("", ""))
            i = s.find(";", i) + 1
            break
        else:
            break
        paren_depth = 1
        cs = i
        while i < n and paren_depth > 0:
            if s[i] == "(":
                paren_depth += 1
            elif s[i] == ")":
                paren_depth -= 1
                if paren_depth == 0:
                    cend = i
                    break
            i += 1
        cond = s[cs:cend]
        i = cend + 1
        while i < n and s[i] != "{":
            i += 1
        bend = brace_close(s, i)
        body = s[i + 1:bend]
        out.append((cond, body))
        i = bend + 1
    return out


opcodes: dict[int, str] = {}


def recurse(s, depth=0):
    s = s.strip()
    if not s.startswith("if("):
        first = s.find("if(")
        if first < 0:
            return
        s = s[first:]
    chain = split_chain(s)
    eq_pat = re.compile(r"_\$\$L===(-?\d+)$")
    lt_pat = re.compile(r"_\$\$L<(-?\d+)$")
    eq_cases = []
    lt_cases = []
    else_body = None
    for cond, body in chain:
        if cond == "":
            else_body = body
        else:
            m_eq = eq_pat.match(cond)
            m_lt = lt_pat.match(cond)
            if m_eq:
                eq_cases.append((int(m_eq.group(1)), body))
            elif m_lt:
                lt_cases.append((int(m_lt.group(1)), body))
    if eq_cases and not lt_cases:
        for op_id, body in eq_cases:
            opcodes[op_id] = body
        if else_body is not None and else_body != "":
            base = (eq_cases[0][0] // 4) * 4
            opcodes[base + 3] = else_body
        return
    if lt_cases:
        for _, body in lt_cases:
            recurse(body, depth + 1)
        if else_body is not None and else_body != "":
            # else_body could itself be a sub-tree OR a single statement (single-op case like op96/97/98/99)
            stripped = else_body.strip()
            if stripped.startswith("if("):
                recurse(stripped, depth + 1)
            else:
                # this is a single trailing op. its id = the outermost boundary
                # we don't know the id from context here. record the body keyed by raw position.
                # Outer caller will resolve.
                opcodes[-1] = stripped  # sentinel
                if -1 not in opcodes:
                    pass


# Walk the tree manually starting at root, tracking the boundary stack so we can
# infer single-else op IDs at intermediate nodes.
def walk(s, boundary_stack):
    """boundary_stack: list[(low, high)] open intervals for this subtree's ops"""
    s = s.strip()
    if not s.startswith("if("):
        first = s.find("if(")
        if first < 0:
            return
        s = s[first:]
    chain = split_chain(s)
    eq_pat = re.compile(r"_\$\$L===(-?\d+)$")
    lt_pat = re.compile(r"_\$\$L<(-?\d+)$")
    eq_cases = []
    lt_cases = []  # list of (bound, body, low, high)
    else_body = None
    low, high = boundary_stack[-1]
    for cond, body in chain:
        if cond == "":
            else_body = body
        else:
            m_eq = eq_pat.match(cond)
            m_lt = lt_pat.match(cond)
            if m_eq:
                eq_cases.append((int(m_eq.group(1)), body))
            elif m_lt:
                lt_cases.append((int(m_lt.group(1)), body))
    if eq_cases and not lt_cases:
        for op_id, body in eq_cases:
            opcodes[op_id] = body
        if else_body is not None and else_body != "":
            base = (eq_cases[0][0] // 4) * 4
            opcodes[base + 3] = else_body
        return
    if lt_cases:
        # ordered: bounds appear sorted: <a, <b, <c
        prev_low = low
        bounds = [b for b, _ in lt_cases]
        for n_bound, body in lt_cases:
            walk(body, boundary_stack + [(prev_low, n_bound - 1)])
            prev_low = n_bound
        if else_body is not None:
            # the else covers [prev_low .. high]
            stripped = else_body.strip()
            if stripped.startswith("if("):
                walk(stripped, boundary_stack + [(prev_low, high)])
            elif stripped:
                # single statement = single op. If span is one value, that's the id.
                if prev_low == high:
                    opcodes[prev_low] = stripped
                else:
                    # else covers a range — treat as group base+3
                    # but here it might be a single op despite being a range (when high = prev_low+0)
                    opcodes[prev_low] = stripped  # best-effort
        return


walk(root, [(0, 999)])
print(f"BSrw recovered: {len(opcodes)} ops")
ids = sorted(opcodes.keys())
print(f"ids: {ids}")
missing = [n for n in range(max(ids) + 1) if n not in opcodes]
print(f"missing in [0..max]: {missing}")

# show ops above 96 (the BSrw-only ones)
for n in ids:
    if n >= 95:
        body_clean = opcodes[n].replace("\n", " ").strip()
        print(f"  op {n}: {body_clean[:200]}")

# merge into d1_opcodes.json
existing = json.loads(OUT_JSON.read_text(encoding="utf-8"))
existing_map = {int(k): v for k, v in existing.items()}
added = []
for n, body in opcodes.items():
    if n not in existing_map:
        existing_map[n] = body
        added.append(n)
    elif existing_map[n] != body:
        print(f"  diff at op {n}:")
        print(f"    oQ91: {existing_map[n][:100]!r}")
        print(f"    BSrw: {body[:100]!r}")
print(f"merged: added {len(added)} new ops {sorted(added)}")
OUT_JSON.write_text(
    json.dumps({str(k): existing_map[k] for k in sorted(existing_map.keys())}, indent=2, ensure_ascii=False),
    encoding="utf-8"
)
print(f"d1_opcodes.json now contains {len(existing_map)} ops")

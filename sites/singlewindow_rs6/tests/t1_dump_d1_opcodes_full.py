"""Recover all 97 D1 opcodes (0..96), including else branches."""
from __future__ import annotations
import json
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
JS_PATH = SITE / "assets" / "js" / "oQ91zEKu9zN4.44d6eb6.js"
txt = JS_PATH.read_text(encoding="utf-8", errors="replace")


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


# locate D1 dispatcher body
m = re.search(r"while\(1\)\{_\$\$L=_\$nl\[_\$lV\+\+\];", txt)
assert m
brace_idx = txt.find("{", m.start() + len("while(1)"))
while_body = brace_block(txt, brace_idx)
inner = while_body[1:-1]
# skip the `_$$L=_$nl[_$lV++];` prefix
first_if = inner.find("if(")
assert first_if >= 0
root = inner[first_if:]
print(f"root len={len(root)}  head 80: {root[:80]!r}")

opcodes: dict[int, str] = {}


def split_chain(s: str) -> list[tuple[str, str]]:
    """Split a string that consists of `if(<C>){B}(else if(<C>){B})*(else{B}|else;)?`
    Return list of (cond_str, body_str). For else branch cond_str == '' and body_str is body.
    The caller passes `s` starting exactly at the first `if(`."""
    out: list[tuple[str, str]] = []
    i = 0
    n = len(s)
    while i < n:
        # whitespace
        while i < n and s[i].isspace():
            i += 1
        if i >= n:
            break
        if s.startswith("if(", i):
            i += 3
            is_first = (len(out) == 0)
        elif s.startswith("else if(", i):
            i += 8
        elif s.startswith("else{", i):
            j = s.find("{", i)
            body_block = brace_block(s, j)
            out.append(("", body_block[1:-1]))
            i = j + len(body_block)
            break
        elif s.startswith("else ", i):
            # `else ;` style empty else
            j = s.find(";", i)
            if j < 0:
                break
            out.append(("", ""))
            i = j + 1
            break
        else:
            # done with chain
            break
        # read cond
        paren_depth = 1
        cond_start = i
        while i < n and paren_depth > 0:
            if s[i] == "(":
                paren_depth += 1
            elif s[i] == ")":
                paren_depth -= 1
                if paren_depth == 0:
                    cond_end = i
                    break
            i += 1
        cond = s[cond_start:cond_end]
        i = cond_end + 1
        # find `{`
        while i < n and s[i] != "{":
            i += 1
        body_block = brace_block(s, i)
        out.append((cond, body_block[1:-1]))
        i = i + len(body_block)
    return out


def recurse(s: str, group_base_hint: int | None = None) -> None:
    """Walk an if-chain. If all conds are `_$$L===N`, this is a leaf group;
    record each op. Otherwise (mix of `_$$L<N`), recurse into bodies."""
    s = s.strip()
    if not s.startswith("if("):
        # maybe a body that itself contains a chain
        first = s.find("if(")
        if first < 0:
            return
        s = s[first:]
    chain = split_chain(s)
    if not chain:
        return
    eq_pat = re.compile(rf"_\$\$L===(-?\d+)$")
    lt_pat = re.compile(rf"_\$\$L<(-?\d+)$")

    # classify
    eq_cases: list[tuple[int, str]] = []
    lt_cases: list[tuple[int, str]] = []
    else_body: str | None = None
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
        # leaf group
        seen = set()
        for op_id, body in eq_cases:
            opcodes[op_id] = body
            seen.add(op_id)
        if else_body is not None:
            base = (eq_cases[0][0] // 4) * 4
            else_id = base + 3
            if else_id not in seen:
                opcodes[else_id] = else_body
        return

    if lt_cases:
        # interior tree node
        for n_bound, body in lt_cases:
            recurse(body)
        if else_body is not None:
            recurse(else_body)
        return


recurse(root)
print(f"recovered: {len(opcodes)}")
ids = sorted(opcodes.keys())
print(f"op ids: {ids}")
missing = [n for n in range(97) if n not in opcodes]
print(f"missing in [0..96]: {missing}")

print("\n--- one-line per op ---")
for n in ids:
    body_clean = opcodes[n].replace("\n", " ").strip()
    print(f"op {n:3d}: {body_clean[:160]}")

out_path = SITE / "assets" / "phase2_d1_opcodes_full.json"
out_path.write_text(json.dumps({str(k): opcodes[k] for k in ids}, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"\nwritten: {out_path}")

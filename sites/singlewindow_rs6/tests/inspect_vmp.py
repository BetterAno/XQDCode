"""Phase 2 prep — extract dispatcher signature from each vmp JS.

We look for:
  - file head (first IIFE wrapper)
  - dispatcher pattern: while(1){ ... } with binary-tree opcode comparisons (_$_C<N)
  - constant string tables (often base91-ish chars beyond ASCII)
  - top-level function count
  - the IIFE invocation at the tail (opcode arrays)
"""
from __future__ import annotations
import re
from pathlib import Path

JS_DIR = Path(__file__).resolve().parents[1] / "assets" / "js"

DISPATCH_RE = re.compile(
    r"while\s*\(1\)\s*\{[^{}]{0,80}=[^{};]{0,80}\[[^\]]+\+\+\];", re.S
)
OPCODE_BOUND_RE = re.compile(r"<(\d{1,3})\)\{(?:if\([^()]+<\d+)?")
FUNC_DECL_RE = re.compile(r"function\s+(_\$[a-zA-Z0-9]{1,3})\s*\(")
IIFE_TAIL_RE = re.compile(r"\}\)\s*\(\[\],\[\[[\d,\[\]\s]{50,}\]\]\);")

for path in sorted(JS_DIR.glob("*.js")):
    txt = path.read_text(encoding="utf-8", errors="replace")
    print(f"\n=== {path.name}  ({len(txt)} bytes) ===")
    print(f"head 300:  {txt[:300]!r}")
    print(f"tail 300:  {txt[-300:]!r}")

    funcs = FUNC_DECL_RE.findall(txt)
    print(f"function decls: {len(funcs)} unique={len(set(funcs))}  examples={list(set(funcs))[:8]}")

    bounds = OPCODE_BOUND_RE.findall(txt)
    print(f"opcode-tree numeric bounds (top): {sorted(set(int(b) for b in bounds))[:30]}")

    dispatches = list(DISPATCH_RE.finditer(txt))
    print(f"dispatcher pattern hits: {len(dispatches)}")
    for d in dispatches[:3]:
        print(f"  @offset {d.start()}: {d.group(0)[:120]!r}")

    iifes = list(IIFE_TAIL_RE.finditer(txt))
    print(f"IIFE-with-opcode-array tail hits: {len(iifes)}")
    for d in iifes[:2]:
        s = d.group(0)
        print(f"  len {len(s)}, sample: {s[:200]!r}")

    # find candidate $_jf-style flag access (anti-prettify)
    for needle in [".jf", ".cd", ".nsd", ".lcd", "$_ts"]:
        hits = [m.start() for m in re.finditer(re.escape(needle), txt)][:5]
        if hits:
            print(f"  {needle!r} hits: {hits}")

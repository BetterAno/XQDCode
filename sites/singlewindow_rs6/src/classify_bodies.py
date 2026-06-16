"""Classify D1 opcode bodies by syntactic pattern.

Goal: see how many independent JS constructs we actually need to support
in the Python D1 interpreter.
"""
from __future__ import annotations
import json
import re
from collections import Counter
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
CATALOG = json.loads((SITE / "src" / "d1_opcodes.json").read_text(encoding="utf-8"))

# normalize bodies: strip trailing ';', whitespace
def norm(s):
    return s.strip().rstrip(";").strip()

# patterns to detect, in order. each returns a category label or None.
CAT_PATS = [
    ("jump-cond",       re.compile(r"^!_\$\w+\?_\$\w+\+=-?\d+:0$")),
    ("jump-uncond",     re.compile(r"^_\$\w+\+=-?\d+$")),
    ("var-assign-int",  re.compile(r"^_\$\w+=-?\d+$")),
    ("var-assign-bool", re.compile(r"^_\$\w+= ?!_\$\w+$")),
    ("var-assign-cmp",  re.compile(r"^_\$\w+=_\$\w+[<>]=?_\$\w+$")),
    ("var-assign-eq",   re.compile(r"^_\$\w+=_\$\w+===\w+$")),
    ("var-assign-prop", re.compile(r"^_\$\w+=_\$\w+\.\w+$")),
    ("var-assign-empty-arr", re.compile(r"^_\$\w+=\[\]$")),
    ("var-assign-empty-str", re.compile(r"^_\$\w+=''$|^_\$\w+=\"\"$")),
    ("incr",            re.compile(r"^_\$\w+\+\+ ?$")),
    ("readtok",         re.compile(r"^_\$\w+=_\$k7\(\)$")),
    ("readtok2",        re.compile(r"^_\$\w+=_\$k7\(\)\*55295\+_\$k7\(\)$")),
    ("ts-assign",       re.compile(r"^_\$a2\.\w+=.*$")),
    ("ts-read",         re.compile(r"^_\$\w+=_\$a2\.\w+$")),
    ("return-bare",     re.compile(r"^return$")),
    ("return-val",      re.compile(r"^return _\$\w+$")),
    ("call-a4",         re.compile(r"^_\$a4\(.*\)$")),
    ("call-aO",         re.compile(r"^_\$aO\(.*\)$")),
    ("set-window-eval", re.compile(r"^_\$\w+=_\$ke\.eval$")),
    ("set-execScript",  re.compile(r"^_\$\w+=_\$ke\.execScript.*$")),
    ("date-now",        re.compile(r"^return new _\$o0\(\)\.getTime\(\)$")),
    ("string-literal-large", re.compile(r"^_\$\w+(\[\d+\])?=\".{200,}\"$", re.S)),
    ("string-literal-medium", re.compile(r"^_\$\w+(\[\d+\])?=\".{20,199}\"$", re.S)),
    ("string-literal-small", re.compile(r"^_\$\w+(\[\d+\])?=\".{0,19}\"$", re.S)),
    ("array-push-tokens", re.compile(r"^_\$\w+\.push\(.*\)$")),
    ("substr-call",     re.compile(r".*\.substr\(.*\)$")),
    ("for-loop",        re.compile(r"^for\(.+;.+;.+\).+$")),
    ("split-call",      re.compile(r".*\.split\(.*\)$")),
    ("lcg-step",        re.compile(r"^_\$bU=_\$my\(_\$kD\)$|^_\$pG=_\$my\(_\$kD\)$")),
    ("shuffle-call",    re.compile(r"^_\$\$s\(_\$\w+,_\$\w+\)$")),
    ("window-write",    re.compile(r"^_\$ke\[_\$\w+\]=_\$_i$")),
    ("array-index-set", re.compile(r"^_\$\w+\[_?\$?\w+\]=.+$", re.S)),
]


def classify(body):
    s = norm(body)
    for label, pat in CAT_PATS:
        if pat.match(s):
            return label
    return "OTHER"


# union all bodies
all_bodies = set()
for vmp, ops in CATALOG.items():
    for b in ops.values():
        all_bodies.add(norm(b))
print(f"total unique bodies: {len(all_bodies)}")

# classify
cnt = Counter()
others = []
for b in all_bodies:
    label = classify(b)
    cnt[label] += 1
    if label == "OTHER":
        others.append(b)

print("\nbody categories:")
for label, n in cnt.most_common():
    print(f"  {label:25s} {n:3d}")

print(f"\nOTHER bodies ({len(others)}):")
for b in sorted(others)[:50]:
    print(f"  | {b[:160]}")

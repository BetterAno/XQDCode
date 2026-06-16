from pathlib import Path
import re

txt = Path(__file__).resolve().parents[1].joinpath(
    "assets", "js", "oQ91zEKu9zN4.44d6eb6.js"
).read_text(encoding="utf-8", errors="replace")


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


m = re.search(r"_\$\$L<96\)\{", txt)
assert m
start = m.end() - 1
end = brace_close(txt, start)
print(f"if(_$$L<96){{...}} closes at @{end}")
tail = txt[end + 1: end + 600]
print(f"tail 600: {tail!r}")
PYEOF

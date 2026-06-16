"""rs6 6th-gen vmp static decoder.

Public surface:
    Vmp.from_js_file(path) -> Vmp
    vmp.boot_array    -- arr[0], D0 boot sequence (12 ops, range [0..11])
    vmp.d1_bytecode   -- arr[1], D1 main program (~114 ops, range [0..94])
    vmp.d2_bytecode   -- arr[2], D2 _$a4 code-generator (~89 ops, range [0..74])
    vmp.d3_bytecode   -- arr[3], D3 _$ps keyword-builder (~62 ops, range [0..54])
    vmp.d5_bytecode   -- arr[4], D5 _$iq LCG/lookup (5 ops, range [0..3])
    vmp.j_table       -- the _$j$ BMP string (vmp data table)
    vmp.entry_ci      -- entry index for _$aO call (21 for oQ91, 73 for BSrw)

    vmp.disasm_d1()   -- list[tuple[int, int, str]] (index, op_id, one-line semantic)

The decoder is text-driven — it reads the JS source as-is, with no JS engine.
"""
from __future__ import annotations
import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

# canonical one-line semantics for each D1 opcode, copy-edited from
# assets/phase2_d1_opcodes.json (kept short for disassembly readability)
D1_SEMANTICS: dict[int, str] = {
    0:  "_$lo = _$k7()",                       # read token
    1:  "_$i3 = !_$bH",
    2:  "_$i3 = !_$ac",
    4:  "_$lo += 1",
    5:  "_$_S = _$k7()*55295 + _$k7()",        # 2-token wide value
    6:  "_$_q = _$n4.join('')",
    8:  "_$km[5] = _$aO(19) - _$ea",
    9:  "_$i3 = !_$$6",
    10: "_$a0 = _$k7()",
    12: "_$bU = _$my(_$kD)",                   # LCG state
    13: "if (!_$i3) _$lV += 12",
    14: "return _$km",
    16: "_$aE = '$_' + _$aE",
    17: "return",
    18: "_$mH = _$a2.aebi = []",               # fingerprint accumulator
    20: "_$a2.cp = _$km",                      # $_ts.cp = ...
    21: "if (!_$i3) _$lV += 6",
    22: "_$lV += -5",
    24: "_$i3 = (_$aq < _$d0)",
    25: "_$ea = _$km.call(_$ke, _$nD)",        # eval-like (window-bound call)
    26: "_$d0 = _$k7()",
    28: "_$kG = 0",
    29: "_$ea = '_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')",
    30: "_$a4(22, _$n4)",                      # call D2 code-gen
    32: "_$aO(110)",                           # threaded call
    33: "_$bH = _$j$.substr(_$ac, _$_S).split(String.fromCharCode(257))",  # slice data table
    34: "_$aF = 0",
    36: "_$aO(99, _$_q)",                      # threaded call w/arg
    37: "return _$ea",
    38: "if (!_$i3) _$lV += 11",
    40: "if (!_$i3) _$lV += 0  # nop-conditional",
    41: "if (!_$i3) _$lV += 10",
    42: "_$dm = _$aO(19)",
    44: "if (!_$i3) _$lV += -69",              # backward loop
    45: "_$gN += 1",
    46: "_$ac = 0",
    48: "_$gN = _$k7()",
    49: "if (!_$i3) _$lV += 4",
    50: "_$aq += 1",
    52: "_$kG = _$k7()",
    53: "_$j$ = \"<BMP-packed data table; literal embedded here>\"",
    54: "_$km[6] = ''",
    56: "_$km[2] = \"<backtick-delimited integer table; XOR'd>\"",
    57: "_$km[4] = _$aO(19) - _$ea",
    58: "_$$s(_$km, _$kW)",                    # shuffle
    60: "_$i3 = (_$nD === undefined || _$nD === '')",
    61: "_$i3 = (_$gN % 10 != 0) || !_$lo",
    62: "_$a2.nsd = _$$K",                     # $_ts.nsd = ...
    64: "_$i3 = !_$n4",
    65: "_$i3 = !_$ea",
    66: "_$kD = [1, 0, 0]",                    # LCG seed
    68: "if (!_$i3) _$lV += 3",
    69: "_$kD = _$a2.nsd",                     # read $_ts.nsd
    70: "_$km[0] = \"<XOR-cipher fingerprint template>\"",
    72: "_$pG = _$my(_$kD)",
    73: "_$lV += -12",                         # backward loop
    74: "_$$6 = _$k7()",
    76: "if (!_$i3) _$lV += 1",
    77: "_$n4.push(_$_C.substr(0, _$bU() % 5))",
    78: "if (!_$i3) _$lV += 2",
    80: "_$km = _$ke.eval",                    # capture window.eval
    81: "_$bH.push(_$a4(20, _$k7()*55295+_$k7()))",
    82: "_$lV += 2",
    84: "_$_C = '\\n\\n\\n\\n\\n'",
    85: "_$aE = _$pG().toString(16)",
    86: "_$lV += -6",
    88: "_$n4.push('}}}}}}}}}}'.substr(_$d0 - 1))",
    89: "_$a4(74)",                            # call D2 code-gen at entry 74
    90: "if (!_$i3) _$lV += 17",
    92: "_$ea = _$ke.execScript(_$nD)",        # IE-only eval; also touches window
    93: "_$i3 = (_$d0 > 0)",
    94: "_$i3 = !_$km",
}


def _brace_block(s: str, brace_open_idx: int) -> str:
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


def _parse_int_array_of_arrays(src: str) -> list[list[int]]:
    """Parse `[[..],[..],[..],[..],[..]]` literal into nested int lists."""
    groups: list[list[int]] = []
    cur: list[int] = []
    depth = 0
    i = 0
    while i < len(src):
        ch = src[i]
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
            while j < len(src) and (src[j].isdigit() or src[j] == "-"):
                j += 1
            cur.append(int(src[i:j]))
            i = j
        else:
            i += 1
    return groups


@dataclass
class Vmp:
    source_path: Path
    boot_array: list[int]
    d1_bytecode: list[int]
    d2_bytecode: list[int]
    d3_bytecode: list[int]
    d5_bytecode: list[int]
    j_table: str
    entry_ci: int
    raw_size: int = 0

    @classmethod
    def from_js_file(cls, path: str | Path) -> "Vmp":
        path = Path(path)
        txt = path.read_text(encoding="utf-8", errors="replace")

        # entry _$ci: var _$n4=[N]; ... return _$aO.apply(this,_$n4)
        m_entry = re.search(r"function\s+_\$_i\s*\(\)\s*\{\s*var\s+_\$\w+\s*=\s*\[\s*(\d+)\s*\]", txt)
        if not m_entry:
            raise RuntimeError("entry _$_i() not located")
        entry_ci = int(m_entry.group(1))

        # the 5 opcode arrays in the tail IIFE call
        m_arr = re.search(r"\}\s*\)\s*\(\s*\[\s*\]\s*,\s*\[\s*\[", txt)
        if not m_arr:
            raise RuntimeError("tail IIFE call not located")
        start = m_arr.end() - 2
        depth = 0
        i = start
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
        if end < 0:
            raise RuntimeError("unterminated tail IIFE arrays")
        groups = _parse_int_array_of_arrays(txt[start:end])
        if len(groups) != 5:
            raise RuntimeError(f"expected 5 opcode arrays, got {len(groups)}")

        # the _$j$ data-table string literal (assigned inside D1 op 53)
        m_j = re.search(r'_\$j\$\s*=\s*"', txt)
        if not m_j:
            raise RuntimeError("_$j$ literal not found")
        s = m_j.end()
        esc = False
        end_j = -1
        while s < len(txt):
            ch = txt[s]
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == '"':
                end_j = s
                break
            s += 1
        if end_j < 0:
            raise RuntimeError("unterminated _$j$ literal")
        j_raw = txt[m_j.end():end_j]
        # the source has JS escapes like \x00, \n, \uXXXX, etc. — evaluate them safely.
        # Note: the literal contains many real BMP chars >0x7f; we only need to undo
        # \\, \", \x.., \u...., \n, \t, \r.
        def js_decode(s: str) -> str:
            out = []
            i = 0
            while i < len(s):
                if s[i] == "\\" and i + 1 < len(s):
                    nxt = s[i + 1]
                    if nxt == "x" and i + 3 < len(s):
                        out.append(chr(int(s[i + 2:i + 4], 16)))
                        i += 4
                    elif nxt == "u" and i + 5 < len(s):
                        out.append(chr(int(s[i + 2:i + 6], 16)))
                        i += 6
                    elif nxt == "n":
                        out.append("\n"); i += 2
                    elif nxt == "t":
                        out.append("\t"); i += 2
                    elif nxt == "r":
                        out.append("\r"); i += 2
                    elif nxt == "0":
                        out.append("\0"); i += 2
                    elif nxt == "\\":
                        out.append("\\"); i += 2
                    elif nxt == '"':
                        out.append('"'); i += 2
                    elif nxt == "'":
                        out.append("'"); i += 2
                    else:
                        out.append(nxt); i += 2
                else:
                    out.append(s[i]); i += 1
            return "".join(out)

        j_table = js_decode(j_raw)

        return cls(
            source_path=path,
            boot_array=groups[0],
            d1_bytecode=groups[1],
            d2_bytecode=groups[2],
            d3_bytecode=groups[3],
            d5_bytecode=groups[4],
            j_table=j_table,
            entry_ci=entry_ci,
            raw_size=len(txt),
        )

    def disasm_d1(self) -> list[tuple[int, int, str]]:
        out = []
        for idx, op in enumerate(self.d1_bytecode):
            sem = D1_SEMANTICS.get(op, f"???   # op {op} unknown")
            out.append((idx, op, sem))
        return out

    def summary(self) -> dict:
        return {
            "source": str(self.source_path),
            "raw_size": self.raw_size,
            "entry_ci": self.entry_ci,
            "boot_len": len(self.boot_array),
            "d1_len": len(self.d1_bytecode),
            "d2_len": len(self.d2_bytecode),
            "d3_len": len(self.d3_bytecode),
            "d5_len": len(self.d5_bytecode),
            "j_table_len": len(self.j_table),
            "j_table_unique_cp": len(set(self.j_table)),
            "j_table_min_cp": min(ord(c) for c in self.j_table),
            "j_table_max_cp": max(ord(c) for c in self.j_table),
        }


if __name__ == "__main__":
    import sys
    p = Path(sys.argv[1]) if len(sys.argv) > 1 else \
        Path(__file__).resolve().parents[1] / "assets" / "js" / "oQ91zEKu9zN4.44d6eb6.js"
    vmp = Vmp.from_js_file(p)
    print(json.dumps(vmp.summary(), indent=2, ensure_ascii=False))
    print(f"\nboot_array (D0): {vmp.boot_array}")
    print(f"d5_bytecode (D5): {vmp.d5_bytecode}")
    print(f"\n--- D1 disassembly, first 40 ops from entry {vmp.entry_ci} ---")
    asm = vmp.disasm_d1()
    # show from entry to entry+40
    for idx, op, sem in asm[vmp.entry_ci:vmp.entry_ci + 40]:
        print(f"  [{idx:3d}]  op {op:3d}  | {sem}")
    print(f"\n--- D1 disassembly, first 30 ops from start ---")
    for idx, op, sem in asm[:30]:
        print(f"  [{idx:3d}]  op {op:3d}  | {sem}")

    # T1 acceptance — verify all D1 op IDs are known
    unknown = [op for _, op, _ in asm if op not in D1_SEMANTICS]
    print(f"\nT1 acceptance: D1 ops range [{min(op for _,op,_ in asm)}..{max(op for _,op,_ in asm)}], "
          f"unique={len(set(op for _,op,_ in asm))}, unknown={unknown}")

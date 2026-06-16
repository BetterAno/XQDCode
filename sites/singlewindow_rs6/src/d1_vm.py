"""rs6 D1 dispatcher - Python interpreter (P2-B path, per-body translation).

Stage T2.0 - minimal skeleton.

Architecture:
  - Registers: a Python dict keyed by JS identifier string (e.g. "_$lo", "_$_S").
  - Bytecode: arr[1] from vmp (list[int op_id]).
  - Per-vmp opcode table: dict[int, str] (the JS body source).
  - Each opcode body is translated to a Python callable.
  - Translation happens on demand: try to compile the body as a simple expression;
    if it falls into a known structural pattern, use a hand-written handler instead.
  - Unknown bodies raise NotImplementedError with the offending op id and source.
"""
from __future__ import annotations
import json
import math
import random
import re
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable

CATALOG_PATH = Path(__file__).parent / "d1_opcodes.json"


def load_catalog() -> dict[str, dict[int, str]]:
    raw = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    return {vmp: {int(k): v for k, v in ops.items()} for vmp, ops in raw.items()}


Handler = Callable[["D1VM"], Any]
_HANDLERS: dict[str, Handler] = {}


def _norm(body: str) -> str:
    return body.strip().rstrip(";").strip()


def register(body_pattern: str):
    def deco(fn):
        _HANDLERS[_norm(body_pattern)] = fn
        return fn
    return deco


_RE_JUMP_COND = re.compile(r"^!(_\$\w+)\?(_\$\w+)\+=(-?\d+):0$")
_RE_JUMP_UNCOND = re.compile(r"^(_\$\w+)\+=(-?\d+)$")
_RE_INCR = re.compile(r"^(_\$\w+)\+\+ ?$")
_RE_READTOK = re.compile(r"^(_\$\w+)=_\$k7\(\)$")
_RE_READTOK2 = re.compile(r"^(_\$\w+)=_\$k7\(\)\*55295\+_\$k7\(\)$")
_RE_ASSIGN_INT = re.compile(r"^(_\$\w+)=(-?\d+)$")
_RE_NOT_VAR = re.compile(r"^(_\$\w+)= ?!(_\$\w+)$")
_RE_RETURN_BARE = re.compile(r"^return$")
_RE_RETURN_VAL = re.compile(r"^return (_\$\w+)$")
_RE_PROP_GET = re.compile(r"^(_\$\w+)=(_\$\w+)\.(\w+)$")
_RE_EMPTY_ARR = re.compile(r"^(_\$\w+)=\[\]$")
_RE_EMPTY_STR = re.compile(r"""^(_\$\w+)=(?:''|"")$""")


def compile_body(body: str) -> Handler:
    s = _norm(body)
    if s in _HANDLERS:
        return _HANDLERS[s]
    if m := _RE_JUMP_COND.match(s):
        flag, pc, delta = m.group(1), m.group(2), int(m.group(3))
        def h(vm):
            if not vm.regs.get(flag):
                vm.regs[pc] = vm.regs.get(pc, 0) + delta
        return h
    if m := _RE_JUMP_UNCOND.match(s):
        var, delta = m.group(1), int(m.group(2))
        def h(vm):
            vm.regs[var] = vm.regs.get(var, 0) + delta
        return h
    if m := _RE_INCR.match(s):
        var = m.group(1)
        def h(vm):
            vm.regs[var] = vm.regs.get(var, 0) + 1
        return h
    if m := _RE_READTOK.match(s):
        var = m.group(1)
        def h(vm):
            vm.regs[var] = vm.read_token()
        return h
    if m := _RE_READTOK2.match(s):
        var = m.group(1)
        def h(vm):
            vm.regs[var] = vm.read_token() * 55295 + vm.read_token()
        return h
    if m := _RE_ASSIGN_INT.match(s):
        var, val = m.group(1), int(m.group(2))
        def h(vm):
            vm.regs[var] = val
        return h
    if m := _RE_NOT_VAR.match(s):
        dst, src = m.group(1), m.group(2)
        def h(vm):
            vm.regs[dst] = not vm.regs.get(src)
        return h
    if _RE_RETURN_BARE.match(s):
        def h(vm):
            vm.stop = True
        return h
    if m := _RE_RETURN_VAL.match(s):
        src = m.group(1)
        def h(vm):
            vm.stop = True
            vm.ret = vm.regs.get(src)
        return h
    if m := _RE_PROP_GET.match(s):
        dst, src, prop = m.group(1), m.group(2), m.group(3)
        def h(vm):
            obj = vm.regs.get(src)
            vm.regs[dst] = vm.get_prop(obj, prop) if obj is not None else None
        return h
    if m := _RE_EMPTY_ARR.match(s):
        dst = m.group(1)
        def h(vm):
            vm.regs[dst] = []
        return h
    if m := _RE_EMPTY_STR.match(s):
        dst = m.group(1)
        def h(vm):
            vm.regs[dst] = ""
        return h
    raise NotImplementedError(f"unsupported body: {body!r}")


@dataclass
class D1VM:
    vmp_name: str
    arr1: list[int]
    j_table: str
    opcode_bodies: dict[int, str]
    entry_ci: int
    regs: dict[str, Any] = field(default_factory=dict)
    ac: int = 0
    stop: bool = False
    ret: Any = None
    trace: list[tuple[int, int, str]] = field(default_factory=list)

    @classmethod
    def load(cls, vmp_js_path: Path, vmp_name: str | None = None) -> "D1VM":
        import sys
        sys.path.insert(0, str(Path(__file__).parent))
        from decoder import Vmp
        v = Vmp.from_js_file(vmp_js_path)
        if vmp_name is None:
            vmp_name = vmp_js_path.name.split(".")[0]
        catalog = load_catalog()
        if vmp_name not in catalog:
            raise RuntimeError(f"opcode catalog missing for {vmp_name!r}; run extract_ops.py")
        return cls(
            vmp_name=vmp_name,
            arr1=v.d1_bytecode,
            j_table=v.j_table,
            opcode_bodies=catalog[vmp_name],
            entry_ci=v.entry_ci,
        )

    def boot(self) -> None:
        self.regs.update({
            "_$ke": _WindowStub(),
            "_$ea": _DocumentStub(),
            "_$_z": random.random,
            "_$nK": math.floor,
            "_$_8": [4, 16, 64, 256, 1024, 4096, 16384, 65536],
            "_$o0": _DateCtor,
            "_$a2": _TsStub(),
            "_$$8": _StringStub(),
            "_$lK": list,
            "_$_S": 0,
        })
        self.regs["_$lV"] = self.entry_ci
        self.regs["_$nl"] = self.arr1

    def read_token(self) -> int:
        c = ord(self.j_table[self.ac])
        self.ac += 1
        return c

    def get_prop(self, obj, prop):
        if obj is None:
            return None
        if isinstance(obj, dict):
            return obj.get(prop)
        return getattr(obj, prop, None)

    def step(self) -> bool:
        lv = self.regs["_$lV"]
        if lv >= len(self.arr1) or lv < 0:
            self.stop = True
            return False
        op_id = self.arr1[lv]
        self.regs["_$lV"] = lv + 1
        body = self.opcode_bodies.get(op_id)
        if body is None:
            raise RuntimeError(f"op id {op_id} missing for {self.vmp_name}")
        self.trace.append((lv, op_id, body))
        handler = compile_body(body)
        handler(self)
        return not self.stop

    def run(self, max_steps: int = 10000):
        steps = 0
        while steps < max_steps and not self.stop:
            self.step()
            steps += 1
        return self.ret


class _WindowStub:
    def __init__(self):
        self._ts = {}


class _DocumentStub:
    def __init__(self):
        self.cookie = ""


class _StringStub:
    fromCharCode = staticmethod(chr)


def _DateCtor():
    class _D:
        def __init__(self):
            self._t = int(time.time() * 1000)
        def getTime(self):
            return self._t
    return _D()


class _TsStub:
    nsd = 0
    cd = ""
    aebi: list = []
    cp: Any = None
    lcd: Any = None
    scj: Any = None
    jf: Any = None


def main():
    import argparse
    ap = argparse.ArgumentParser()
    default_vmp = Path(__file__).resolve().parents[1] / "assets" / "js" / "oQ91zEKu9zN4.44d6eb6.js"
    ap.add_argument("vmp", nargs="?", default=str(default_vmp))
    ap.add_argument("--max-steps", type=int, default=200)
    args = ap.parse_args()

    vm = D1VM.load(Path(args.vmp))
    vm.boot()
    print(f"loaded {vm.vmp_name}: arr1 len={len(vm.arr1)} entry={vm.entry_ci} j_len={len(vm.j_table)}")
    try:
        vm.run(max_steps=args.max_steps)
        print("VM halted, ret =", vm.ret)
        print(f"steps executed: {len(vm.trace)}")
    except NotImplementedError as e:
        print(f"\nNOT IMPLEMENTED: {e}")
        print(f"\ntrace tail (last 10):")
        for lv, op, body in vm.trace[-10:]:
            print(f"  pc={lv:3d} op={op:3d}  {body[:120]}")
        print(f"\nregs snapshot:")
        for k in sorted(vm.regs.keys()):
            v = vm.regs[k]
            sv = repr(v)
            if len(sv) > 80:
                sv = sv[:80] + "..."
            print(f"  {k:10s} = {sv}")
    except RuntimeError as e:
        print(f"\nRUNTIME ERROR: {e}")
        for lv, op, body in vm.trace[-10:]:
            print(f"  pc={lv:3d} op={op:3d}  {body[:120]}")


if __name__ == "__main__":
    main()

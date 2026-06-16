"""Generate fresh sign + decode__1174 and output them"""
import subprocess, json, os, time, random, sys
D = os.path.dirname(os.path.abspath(__file__))
def node(cmd, *args):
    r = subprocess.run(["node", os.path.join(D, cmd)] + list(args),
        capture_output=True, text=True, timeout=60, cwd=D)
    if r.returncode != 0:
        raise RuntimeError(f"{cmd}: {r.stderr}")
    return r.stdout.strip()

ts = str(int(time.time() * 1000))
rnd = str(random.randint(100000, 999999))
body = json.dumps(dict(order="ASC", sort=None, page=1, pageSize=10,
    action=dict(gameId="17", merchantMark=None, keywords=[], searchWords=[],
        searchPropertyIds=[], recommendSearchConfigIds=[], unionGameIds=[],
        goodsSearchActions=[], metas=dict(single1=[]),
        goodsCatalogueId=6, goodsSubCatalogueIds=[],
        countFlag=False, conditionSearch=False)), separators=(',',':'))

sign = node("sign_service.js", body, "POST", ts, rnd)
d1174 = node("encode_full_cli.js", body, "POST", ts, rnd, sign)

print(f"ts={ts}")
print(f"rnd={rnd}")
print(f"sign={sign}")
print(f"d1174={d1174}")
print(f"d1174_len={len(d1174)}")

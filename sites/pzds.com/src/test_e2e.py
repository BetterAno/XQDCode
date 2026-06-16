"""
pzds.com E2E test v2 — Node.js encoder + Python requests
"""
import subprocess, json, os, time, random, requests, sys

D = os.path.dirname(os.path.abspath(__file__))
NODE = "node"

def node(cmd, *args, timeout=60):
    r = subprocess.run([NODE, os.path.join(D, cmd)] + list(args),
        capture_output=True, text=True, timeout=timeout, cwd=D)
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

print(f"ts={ts} rnd={rnd}")

sign = node("sign_service.js", body, "POST", ts, rnd)
print(f"sign: {sign}")

# Use encode_full_cli.js with same ts/rnd AND pre-computed sign
d1174 = node("encode_full_cli.js", body, "POST", ts, rnd, sign)
print(f"decode: {d1174[:60]}...")

cookies = dict(
    Hm_lvt_8e2c03f98f8af83cf09317d232baf903="1781579676",
    HMACCOUNT="FA7328ED04BBFF4A",
    _c_WBKFRo="XN6eSNvRakmF0Zc8OvvBR485B0c4Qx1ypPIiyWlO",
    _nb_ioWEgULi="",
    Hm_lpvt_8e2c03f98f8af83cf09317d232baf903="1781579868",
    track_uuid="55bf6f6ca6a24ef5b0d162377a2c41d6",
    new_track_uuid="55bf6f6ca6a24ef5b0d162377a2c41d6",
    track_time="1781579868985",
    ssxmod_itna="1-Qq0x9DnQK=YYqYQiQGCDpxKM8RGkQDGoe0dGMUDeq7tDRDFqAp5DHKAvY8ovlYIDWwv35lDjDE5KBxGXGmDA5Dn_x7YDtr3K44pI70TYGxvBl20olflYmui1OUU4T4a3k7jTK6609=lX8Mx47f=wYGmxYxGLDY=DCkG5YxrD4S3Dt4DIDAYDDxDWU4DLDYoDYfn3xGPNoPaaZeudD0YDzqDg90TDm4DfDDdNx3m34oniDDXrKgxDe_DGDYPNN6rCcDDSKBnoI0TDjkPD/4A2NKDBYyli8ZWUZF8I0nFkxBQD7M4NdZ2QAoWX3aab8oSxQrbmAeq_eD2oqY5aDxh7xYYoDhDG7QTn_zD_rqNjh53mmpDD=abb_GXi4S1NZ2NVrq32woReU0m5WKNWAegxpYKKQezBx_/qhWxozYd4mmIGs4mo=hPFxbApnDmrF_fKwnW_iYD",
    ssxmod_itna2="1-Qq0x9DnQK=YYqYQiQGCDpxKM8RGkQDGoe0dGMUDeq7tDRDFqAp5DHKAvY8ovlYIDWwv35lDjDE5KYxAobpzbb8ofll7Zv03ai7mD_AaE3D",
    acw_tc="",
)

headers = dict(
    accept="application/json, text/plain, */*",
    content_type="application/json",
    origin="https://www.pzds.com",
    referer="https://www.pzds.com/",
    pzos="windows", pzplatform="pc",
    pztimestamp=ts, pzversion="26.612.1437", pzversioncode="1",
    random=rnd, sign=sign, skey="CLIENT", x_sign_version="v17",
    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    channelinfo='{"channelCode":null,"tag":null,"channelType":null,"searchWord":"null","adExtras":"","urlParam":""}',
    deviceid="7aa7daef54db4f4ba1a3939770ef2b15",
    globalid="bdf5705d2da346d88b23d5e284314ae1",
)

url = f"https://api.pzds.com/api/web-client/v2/public/goodsPublic/page?decode__1174={d1174}"

print(f"\nPOST {url}")
try:
    sess = requests.Session()
    # Set cookies on session
    for k, v in cookies.items():
        sess.cookies.set(k, v)
    resp = sess.post(url, headers=headers, data=body, timeout=15)
    print(f"Status: {resp.status_code} len={len(resp.text)}")
    txt = resp.text[:600]

    if resp.status_code == 200:
        if "aliyun_waf" in txt.lower():
            print("BLOCKED by WAF")
            print(txt[:300])
        else:
            try:
                data = resp.json()
                if data.get("success"):
                    records = data.get("data", {}).get("records", [])
                    print(f"SUCCESS! {len(records)} records")
                    if records:
                        print(f"  First: {records[0]['title'][:60]}")
                else:
                    print(f"API: {data.get('info')}")
            except Exception:
                print(f"Raw: {txt[:200]}")
    else:
        print(f"Failed: {txt[:200]}")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

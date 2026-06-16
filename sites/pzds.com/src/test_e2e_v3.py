"""
pzds.com E2E test v3 — fresh cookies from browser
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

d1174 = node("encode_full_cli.js", body, "POST", ts, rnd, sign)
print(f"decode len={len(d1174)}: {d1174[:80]}...")

# Fresh cookies from browser (2026-06-16)
cookies = dict(
    Hm_lvt_8e2c03f98f8af83cf09317d232baf903="1781592224",
    HMACCOUNT="8786246032129F63",
    _c_WBKFRo="J3s4vQb8Wto68snvP1JUTtODRol3vWHhbLFvv44N",
    _nb_ioWEgULi="",
    Hm_lpvt_8e2c03f98f8af83cf09317d232baf903="1781600239",
    track_uuid="008baa625de94c06926c3395ec99b1e8",
    new_track_uuid="008baa625de94c06926c3395ec99b1e8",
    track_time="1781600239773",
    ssxmod_itna="1-Yq0h7Iq_hD87i73itGRDwxQkDeLFNfDl4BU3tGgDYq7=GFKDCgYIraWxBK4PG8IID0KP=4z7Dt4DGx5D/lo4GzDiuPGhDBmYH=F_d7tpZlEBgGCTWGkRDpNaUjoMo=riXyhIZRcMoky3DvkTnisx9FTDb0DTY4bDCPDExGk5o4x_Dii7x0rD0eDPxDYDG4FD7PDoxDrEIoDjY3fjSfACFxDKx0kDYyPaY3DbxDaDGpAZAne3afbDGvbrLnDDYexZDi3_U8ml_xDn10f3AGAD753DlaNEuQD0EtM3PMf_Tt9=2EUS40OD0K0bcmUiQ3cj8aI0IYtbTjeT3GYQn4YDhWRx4bqCWNYit4R78GbR7tI7Nl7k024PxT74D8Sb50rfWeNYY_isZqG_bGelbBDm=Ed=hr46QQgDg7DxrQxhw=bxvW5liE3rE4oYYg54ExY65Yoitfrkr=ZDpQErUi=LWDD",
    ssxmod_itna2="1-Yq0h7Iq_hD87i73itGRDwxQkDeLFNfDl4BU3tGgDYq7=GFKDCgYIraWxBK4PG8IID0KP=4z7Dt4DGreGI0cd7irqRED03xXST3D/R6ax9CTSKjyaH3KjaE_UqWCY=x6qInAkq9e_s6y41gRikPneHZGGc1axA1iN4tiqH6q_Xg470DFqenP8UGI4KPgv_1a4rRIdoC8zf=oQApAdemIFTQGGT_cxU_pFA43_vzGG8EWL4U9aY5jF0iCH7hCigncx53QfepoqoTmfbK=NEoyaTAeCstOqPq3F59LGucjAKvK8qW6G5RLX55=7Ap8PQFxQygwRcQH=G01iPhNKEmnhQ9G3mris=jG=6Dt5QpQHDdrZvlGQcjpMY6n72lGPiKvGBERgA_1RQ9pTUQWp6xWTBlRqjiBmEfe6jxI5Ej6nInZf6mnC6fqZDNb0BaK=2YOgbIroOfNKOEUicoh39jKmcD3RYLl5vKfxnQe_PtPi9ApzBnpOFY=Au=iERKZhKeAjIxQsPUDbbr_YsxL5/2zBAljAHPX_EDplj=T0noyg0EgAqpBf8=Ex0rpWL=VT7Aw6itt9GmfpcBLHU5ehiFboLxqbwarmDg_wIc0WIquzmnOfCCmWbeK1GEY4IG1C7C10wGQrXdmGGmjLDCC1xD",
    acw_tc="0a099c3717815996182507308e604d8d1eb03bace1d5e2c38e81f522616c13",
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
    deviceid="9368f577b09f4d13a8c896c4db5b0294",
    globalid="008baa625de94c06926c3395ec99b1e8",
)

url = f"https://api.pzds.com/api/web-client/v2/public/goodsPublic/page?decode__1174={d1174}"

print(f"\nPOST {url[:120]}...")
try:
    sess = requests.Session()
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

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
    Hm_lvt_8e2c03f98f8af83cf09317d232baf903="1781229865",
    HMACCOUNT="2C33A70C255F130E",
    _c_WBKFRo="iANeDU6WDwMr9HIoWTKeky3XLrMkFHFJN9fEi5EH",
    _nb_ioWEgULi="",
    acw_tc="0a099c3517812515247872601e6669c21fb0dd567a34fe2880c72db2e87d25",
    Hm_lpvt_8e2c03f98f8af83cf09317d232baf903="1781252215",
    ssxmod_itna="1-GqjxcDgiwx0QG0D2GDpxeqhDRDKuwDBP017DuxiK08D6jxB40QXbqAhbDyQY6Oj6E5h7b4rAAeDlo2iYDSxD=FDK4GTh7xGIx=0rYHqqQa9d54mC8jlhSzCT8iCR7kiDviMnLsMFZy=oEFHke4DHxi8DBK1hQiYDeWaDCeDQxirDD4DAWPDFxibDinvN4Dd7SEAm_EmaDGrDlKDRcrP74GWDiPD7hEqYn0I=DDz=7CqkDGiQDi37KShRFr5DiHQh3he74G1ID0HKB10DDyyhy0Ehz19Qvmm04dDvxDk9/O_1lRIEtSwQ541IqhKmwQ0bYRDiiF8iQYiFQbFlh78it_rYf7=Q0x9iH3bH/7YDiTHmDhDmOr4pl1RLz7SzgLrB7hoOdooYoo5x4Gg7qBrwq0QhGiSG5/DY5ZxhYx3Ydll5B7i_DdPEozQe_GPF6x4D",
    ssxmod_itna2="1-GqjxcDgiwx0QG0D2GDpxeqhDRDKuwDBP017DuxiK08D6jxB40QXbqAhbDyQY6Oj6E5h7b4rAYGI0=YFjiDAo5xDLek86IDBMgaUNpmpaXL=f/QQaFCc6ojeUjA/QF9RCoIa_aoWwpdd4KQcDC=0s_62WgjIx2iiFobawOOGGu1pxGE9WjG0aceIv_o7QYe3vXaP1UGffhp7O8o9W2zKdFPMfCrSfobf6CpwLjQG_qXxHoKw6BzPxNUILz=pqizcG94kaQpPabmdmofvOg6lWHfPx_s51zLj6wwBaKSF8Pdd4bGS8SgFjDhEx767jxoZv2YxZgAlWItaPqQ0fDKZoj=ewKeIEgvlYYgxm5rQtotql5MAX=nDQfNZrASYRElQy0EM7fR75S75R=Lezt=oYNr00YQd6fI6QyWQoldnj6hE0xWjx73Fxa7zYh1TOSGRixQR3Z1m0YYdSWvOpXeKLGj/nKFZe4mLVeQU/exUxh24doi5rdRc0mZ6j7pOZeQ_QtojgmpCY3/i=0leroj7YiN25LWE905h2ueSmKe_iqSr5_=Gw1nwsDeGlGiiSHdD",
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

print(f"\nPOST {url[:100]}...")
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

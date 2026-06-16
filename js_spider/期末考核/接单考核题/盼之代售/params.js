var crypto_js = require('crypto-js')

O = Date.now()

for (a = O, "", s = "", l = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9), f = 0; f < 6; f++) {
    d = Math.floor(9 * Math.random())
    s += l[d];
}

c = Number(s)

o = {
    "order": "ASC",
    "sort": null,
    "page": 8,
    "pageSize": 10,
    "action": {
        "gameId": "7",
        "merchantMark": null,
        "keywords": [],
        "searchWords": [],
        "searchPropertyIds": [],
        "unionGameIds": [],
        "goodsSearchActions": [],
        "goodsCatalogueId": 6,
        "countFlag": false,
        "conditionSearch": false
    }
}

g = []
g.push("PZTimestamp=" + a + "&Random=" + c + "&2147483647=" + encodeURIComponent(JSON.stringify(o)))

y = g.join("&") + "&accessKey=3qXyB7uf"
k = y.replace(/[(]/g, "%28")
y = k = (k = (k = (k = (k = k.replace(/[)]/g, "%29")).replace(/[']/g, "%27")).replace(/[*]/g, "%2A")).replace(/[~]/g, "%7E")).replace(/[!！]/g, "%21")
w = crypto_js.MD5(y).toString()


function get_globalId() {
    document_cookie = '_c_WBKFRo=pYp23BHnfbuvdLSnCGMo9TAKNxOlRVmVzWDxR0q8; Hm_lvt_8e2c03f98f8af83cf09317d232baf903=1772791738,1773894801,1773971985,1773984490; HMACCOUNT=1E995F711B166D2C; pzfrom=null; bd_vid=null; qhclickid=null; sourceid=null; uctrackid=null; markId=null; keyword=null; Hm_lpvt_8e2c03f98f8af83cf09317d232baf903=1773985880; track_uuid=519bb58397f34a539892736316201045; new_track_uuid=519bb58397f34a539892736316201045; track_time=1773986494474; ssxmod_itna=1-YuD=qRxjx_hx7KG07YG7YDtGkzGRn9Dl4BtNdGgDYq7=GFKDCx7I7KParI66O=G8BmErx1O7AqDsQ/o4GzDiuPGhDBmYHPRliv_tV7R7gG=YiRCI_mqdmC9X5oMQdOlBAujF2XpVbX9GSnMh5_EQ=zADPBAEOexGLDY=DCkIxngbD4f3Dt4DIDAYDDxDWDAEYx7QDmqGyiEaDQqDSDGPrrpcHp1FrxiYoirarxi3NIWPNFaWDY8cYx0tpdZxD0wijsYwEDYpIwCaNb19O79xrhKPD/S5csiWDGkZ9sBFIdyxUT_uFkPGuDDkziWDYEopf7WfCg37rdUo4dgId2pxmxr05KQqKmxeWG5mI_mK6g2GGGdcw=/wZQDUGm_GeUDDAn2qCEYBbxUhYByVe7xN7QehPODObbxiibKD17O1GBKKG4zG3gD4G7dghNK4_9G4W0Pr0430TV2ePr4eD; ssxmod_itna2=1-YuD=qRxjx_hx7KG07YG7YDtGkzGRn9Dl4BtNdGgDYq7=GFKDCx7I7KParI66O=G8BmErx1O7Y4DW_WnTHh4DFEq4erofD2QDlg8IW7q_tMrHRr16d8xP15jx=m261xz97U0_/Y8cUFOY3t9_NPKkD4Hdfs3wN287dYUuh2RYR=4mhMIOwYNuPLld6YU8RxjnpQeML2SCWqL7j4SfGs9TFyBd=23GhUQen3M3i/77GRfTrR/a24ici/lorHQCI9RYtL/8dPewSfrWTG17cRlO2A7YAlQ/Uz5qgebvNa=MFt5K=290bvrdw=Oo5C56mt/r5/ptjcLhajgnPj6omxLcGQEC2OE5Hnx56xSioEGNXQIq2QEQAnmok=qer=O=P96Iy=GppKEDv6pKD6bs6LnoIsnK5Zw52pD2oBWGtPYQpUsQdgj22BLwPvagdtGKp4X6WpA7Dx=DSiGL/0W8psjRK1YURvn/aYjPB0DV=qsaQ4QcUmnuhNlF6RG6xem0t6ogGEOdS_YMz52K25WLzlvDpIa9bwoBY/wsaQ06peG=XW010Da2g0DvUc38OpxCnB1TUIKqoK=iLn2EnaG7fxPS3kOYA0QC9TjhFUiNOIAi_GEpExo8TuacP5TOoGoPP0gkf8tdlEVn6QoXbGRAD0YFZbT1=wwLPu7=7F2eOHZSAMVaxoWnW=w4IkiXGqHi6S3n7pSe6Mx3I4BxnxywTehu7qlvkGaneDfTjN3ekjiEYA_mAxkSGsiczDwgxQfDx39v5G4VfbWeex5mKpi5C5Sx=YdRDHWxWGOeY5D17KPD'
    for (var r = {}, i = {}, u = document_cookie.split(/; */), c = decodeURIComponent, s = 0; s < u.length; s++) {
        var f = u[s]
        l = f.indexOf("=");
        var d = f.substr(0, l).trim()
        p = f.substr(++l, f.length).trim();
        '"' == p[0] && (p = p.slice(1, -1))
        null == r[d] && (r[d] = c(p))
    }
    return JSON.parse(r["track_uuid"])
}
console.log(get_globalId())

headers = {}
headers['PZTimestamp'] = a
headers['Sign'] = w
headers['Random'] = c




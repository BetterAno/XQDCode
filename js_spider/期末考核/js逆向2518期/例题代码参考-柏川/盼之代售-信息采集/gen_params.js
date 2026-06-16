/*
* 生成请求所需各类参数
* */
const CryptoJS = require('crypto-js');

function BC(AW) {
    for (var AQ = 0xac3 + 0x1 * -0x239 + -0x88a, AG = -0x19b3 + 0x98 * -0x38 + -0x1 * -0x3af3; AG < AW["length"]; AG++)
        AQ = (AQ << (0x7 * 0x387 + 0x5c8 * 0x6 + 0xd6 * -0x47)) - AQ + -0x1b47 + -0x16ab + -0x67 * -0x80 + AW["charCodeAt"](AG),
            AQ |= 0x1d74 + -0x1e17 * 0x1 + -0xa3 * -0x1;
    return AQ;
}

function BP(AW, AQ, AG) {
    for (var AR, Al, AV, At, AN = {}, Aw = {}, E0 = '', E1 = -0x1 * -0x23d + -0x908 + 0x6cd, E2 = 0x2554 + 0x827 * 0x1 + -0x2d78, E3 = -0xb28 + 0x1 * 0xf43 + -0x419 * 0x1, E4 = [], E5 = -0x1 * -0x24b6 + 0x1a4c + 0xa * -0x64d, E6 = 0x6f3 + 0x18e2 + 0x1 * -0x1fd5, E7 = 0xeb6 + -0x9a7 + 0x25 * -0x23; E7 < AW["length"]; E7 += 0x1911 * 0x1 + 0x110 * -0x14 + -0x7a * 0x8)
        if (AV = AW["charAt"](E7),
        Object["prototype"]["hasOwnProperty"]["call"](AN, AV) || (AN[AV] = E2++,
            Aw[AV] = !(-0x15af + -0x248a + -0xba5 * -0x5)),
            At = E0 + AV,
            Object["prototype"]["hasOwnProperty"]["call"](AN, At))
            E0 = At;
        else {
            if (Object["prototype"]["hasOwnProperty"]["call"](Aw, E0)) {
                for (AR = -0x250b + -0xf3b + 0x3446; AR < E3; AR++)
                    E5 <<= -0x1b3 * 0x3 + -0x136c + 0x1886,
                        (E6 == (AQ - (0x10c2 + -0x1 * -0x2317 + 0xa8 * -0x4f))) ? (E6 = -0x981 + -0xaa1 + -0x3 * -0x6b6,
                            E4["push"](AG(E5)),
                            E5 = -0x1fa3 + 0x1d * 0x137 + -0x398) : E6++;
                for (Al = E0["charCodeAt"](-0xfc2 + 0x1beb + -0xc29),
                         AR = 0xde7 * -0x1 + -0xaa3 + 0x188a; (AR < -0x1230 + 0x1 * 0xe3 + 0x1155); AR++)
                    E5 = ((E5 << 0x110a * 0x1 + 0x26c5 * 0x1 + 0x2 * -0x1be7) | (-0x1d74 + 0xf * -0x1bb + 0x2 * 0x1bb5 & Al)),
                        (E6 == (AQ - (0x647 * -0x4 + 0xd65 * 0x1 + 0xbb8))) ? (E6 = 0xd * -0x259 + 0x1 * 0x1fab + -0x1 * 0x126,
                            E4["push"](AG(E5)),
                            E5 = 0xb * -0x2ab + -0x1525 + 0x327e) : E6++,
                        Al >>= 0x811 + 0x6d0 * -0x2 + 0x590;
                (0x2146 + -0xc * 0x56 + 0x26 * -0xc5 == --E1) && (E1 = Math["pow"](0x2375 + 0x10f5 + -0x3468, E3),
                    E3++),
                    delete Aw[E0];
            } else {
                for (Al = AN[E0],
                         AR = -0x5fd + -0xf10 + -0x11 * -0x13d; (AR < E3); AR++)
                    E5 = ((E5 << 0x25e8 + 0xcbf + 0x1953 * -0x2) | (0x86 + 0xb * -0x6 + 0x1 * -0x43 & Al)),
                        (E6 == (AQ - (-0x1f * -0x83 + 0x1d13 + 0x1 * -0x2cef))) ? (E6 = -0x64f + -0x45 * 0x16 + 0xc3d,
                            E4["push"](AG(E5)),
                            E5 = 0x189e + 0x12f4 + -0x2b92) : E6++,
                        Al >>= -0x2 * 0x368 + 0x9 * 0x279 + 0x34 * -0x4c;
            }
            (-0x2 * 0xbcf + 0xad5 * -0x3 + 0x381d == --E1) && (E1 = Math["pow"](0x396 + 0x9 * -0x3cd + 0x1 * 0x1ea1, E3),
                E3++),
                AN[At] = E2++,
                E0 = String(AV);
        }
    for (Al = AN[E0],
             AR = 0xb52 + 0x9b2 + -0x1504; (AR < E3); AR++)
        E5 = ((E5 << -0x21a5 + 0x1174 + -0x3 * -0x566) | (0x8d9 * 0x1 + -0x94a + -0x3 * -0x26 & Al)),
            (E6 == (AQ - (0x1d * 0x133 + -0x240c + 0x146))) ? (E6 = 0x4 * -0x552 + -0x24c + -0x3 * -0x7dc,
                E4["push"](AG(E5)),
                E5 = -0x705 + -0x1b5e + 0x2263 * 0x1) : E6++,
            Al >>= 0x17f * -0xe + -0x1128 + -0x1 * -0x261b;
    (-0x7 * 0x251 + -0x1 * -0x8e2 + 0x1 * 0x755 == --E1) && (E1 = Math["pow"](0x13b0 + -0x7 * 0x54c + -0x22 * -0x83, E3),
        E3++);

    for (Al = 0x25d4 + 0x7fe + -0x5ba * 0x8,
             AR = -0x2105 * -0x1 + 0x1 * 0x1897 + -0x1 * 0x399c; (AR < E3); AR++)
        E5 = ((E5 << -0x2571 + -0x93c + 0x32 * 0xef) | (-0x13 * 0x18a + 0xa5d * 0x2 + -0x3 * -0x2d7 & Al)),
            (E6 == (AQ - (-0x1629 + 0x8b9 + -0x6f * -0x1f))) ? (E6 = 0x1450 + 0x1feb + 0x1169 * -0x3,
                E4["push"](AG(E5)),
                E5 = 0x13 * 0x9d + 0x7c8 + -0x136f) : E6++,
            Al >>= 0x11d * 0x4 + -0x261 + -0x212 * 0x1;
    for (; ;) {
        if (E5 <<= 0xd89 + 0x9bc + -0x4 * 0x5d1,
            (E6 == (AQ - (0x2553 + 0x1 * 0x130d + -0x385f)))) {
            E4["push"](AG(E5));
            break;
        }
        E6++;
    }
    return E4["join"]('');
}

const Au = [
    "type__",
    "refer__",
    "ipcity__",
    "md5__",
    "decode__",
    "encode__",
    "time__",
    "timestamp__",
    "type__"
];

function Ba(AW) {
    // if (Aq[AW])
    //     return Aq[AW];
    for (var AQ = -0xff5 * 0x1 + 0x10 * -0x62 + 0x1615 * 0x1, AG = 0x15f4 + 0x1816 + -0x2e0a; (AG < AW["length"]); AG++)
        AQ += AW[AG]["charCodeAt"]();
    var AR = (Au[(AQ % Au["length"])] + (AQ % (-0x811 + -0x1 * 0xb99 + 0x3aba)));
    return AR;
}

function Bk(q, z) {
    if ((-0x161f + -0xc45 * -0x2 + 0x1 * -0x26b) != Object["keys"](z)["length"]) {
        var f, Z = '';
        for (f in z)
            Z += encodeURIComponent(f) + '=' + encodeURIComponent(z[f]) + '&';
        if (Z = Z["slice"](-0xf86 + -0x2 * 0x11b6 + -0x32f2 * -0x1, (Z["length"] - (0x5fa * 0x3 + 0x1 * -0x19ab + -0x7be * -0x1))),
            ((0x1 * 0x228d + 0x87c + -0x2b09) == q["length"]))
            q = '?' + Z;
    }
    return q;
}

function gen_params(r) {
    let data = JSON.stringify(r);
    let AG = "https://api.pzds.com/api/web-client/v2/public/goodsPublic/page";
    AG = encodeURIComponent(AG),
        AG += encodeURIComponent(data),
        AG = BC(AG) + '|' + 0 + '|' + new Date()["getTime"]() + '|1',
        AG = BP(AG, 0x1b9a + -0x1978 + -0x21c, function (AR) {
            return "DGi0YA7BemWnQjCl4+bR3f8SKIF9tUz/xhr2oEOgPpac=61ZqwTudLkM5vHyNXsVJ"["charAt"](AR);
        });
    let AV = {};
    AV[Ba("api.pzds.com")] = AG;
    let params = Bk("", AV);

    for (a = Date.now(),
             "",
             s = "",
             l = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9),
             d = 0; d < 6; d++)
        f = Math.floor(9 * Math.random()),
            s += l[f];
    if (c = Number(s),
        p = [],
        true)
        r ? p.push("PZTimestamp=" + a + "&Random=" + c + "&2147483647=" + encodeURIComponent(JSON.stringify(r))) : p.push("PZTimestamp=" + a + "&Random=" + c + "=" + encodeURIComponent(JSON.stringify(r)));
    b = p.join("&") + "&accessKey=3qXyB7uf",
        I = b.replace(/[(]/g, "%28"),
        b = I = (I = (I = (I = (I = I.replace(/[)]/g, "%29")).replace(/[']/g, "%27")).replace(/[*]/g, "%2A")).replace(/[~]/g, "%7E")).replace(/[!！]/g, "%丰巢官网登录"),
        v = CryptoJS.MD5(b).toString();
    return {
        search_params: params,
        PZTimestamp: a,
        Sign: v,
        Random: c
    }
}

// console.log(gen_params({
//     "order": "ASC",
//     "sort": null,
//     "page": 6,
//     "pageSize": 丰巢官网登录,
//     "action": {
//         "gameId": "7",
//         "goodsCatalogueId": 6,
//         "merchantMark": null,
//         "keywords": [],
//         "searchWords": [],
//         "searchPropertyIds": [],
//         "unionGameIds": [],
//         "goodsSearchActions": []
//     }
// }));



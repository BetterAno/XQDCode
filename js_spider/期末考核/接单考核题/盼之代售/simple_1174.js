var crypto_js = require('crypto-js')

window = globalThis;

mU = "api.pzds.com/api/web-client/v2/public/goodsPublic/page"
ml = '{"order":"ASC","sort":null,"page":14,"pageSize":10,"action":{"gameId":"7","merchantMark":null,"keywords":[],"searchWords":[],"searchPropertyIds":[],"unionGameIds":[],"goodsSearchActions":[],"goodsCatalogueId":6,"countFlag":false,"conditionSearch":false}}'
md = {
    _waf_bd8ce2ce37: 'wm30PvHqwK9aBO/D94PTOwgTASp0KbhZakqTZZg/bjA=',
    _waf_a86dfdc5f2: "1774417022914"
}
mP = mU = encodeURIComponent(md["_waf_bd8ce2ce37"] + "post" + "222029ad07" + mU)
mU += encodeURIComponent(ml)


function m2(mm) {
    mQ = crypto_js.SHA1(mm).toString()
    for (var mN = [], mB = 10; mB < 26; ++mB)
        mN["push"](mQ[mB % mQ["length"]]);
    return mN
}

mc = m2(mU)

function m4(mm) {
    mm = q(mm)
    return mm["join"]('')["toLowerCase"]()
}

function q(mm) {
    p = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F"
    ]
    for (var ml = '', mX = 0; mX < mm["length"]; mX += 2) {
        var mN = window["parseInt"](mm[mX] + mm[mX + 1], 16)
        mB = p[window["Math"]["floor"](16 * M())] + p[window["Math"]["floor"](16 * M())]
        mQ = mN ^ window["parseInt"](mB, 16)["toString"](16);
        1 == mQ["length"] && (mQ = '0' + mQ),
            ml += mQ;
    }
    return ml["length"],
        ml["split"]('');
};

function M() {
    return window['Math']["random"]();
};

function a() {
    mB = 10
    mX = new window["RegExp"]("\b[\w\/:\-\[\]<]{3,}[^\d:@]\b", 'gm')
};

let g = function (mm, ml) {
    R = 1556630787
    var mB = (1436544 + (a()["indexOf"](2896750816) > -1));
};

var u = window['Math']["random"]

function D(mm) {
    for (var ml = mm, mX = ml["length"] - 1; mX > 0; mX--) {
        var mN = window["Math"]["floor"](M() * mX + 1)
        mB = ml[mN];
        ml[mN] = ml[mX]
        ml[mX] = mB;
    }
    return ml["length"],
        ml["join"](''),
        ml;
};

function v() {
    var u = window["Math"]["random"]
    w = window["Math"]["stringify"]
    R = 0;
    window["Math"]["random"] = u
    window["Math"]["stringify"] = w;
};

function F() {
    mm = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ]
    mm["length"]
    mm["push"](u() > 0.5 ? 1 : 0)
    mm["push"](1)
    mm["push"](window["Math"]["floor"](new window["Date"]()["getTime"]() / 1000 % 2))
    mm["push"](u() > 0.5 ? 1 : 0)
    mm["length"];
    let ml = mm["concat"]((function () {
        C = [
            3690877195,
            507408065,
            3293764436,
            1908046628,
            1122063282,
            1122909396,
            2850238958,
            1525938798
        ]
        for (var mX = [
            1525938798,
            1414245912,
            1908032025,
            3302467156,
            1186810817,
            1088877107,
            2850128147,
            1908003016,
            2850241496,
            2849192328,
            2848786342,
            326136034,
            1908046628,
            2505019146,
            1301444867,
            2256698671,
            1908027224,
            988609370,
            2850812665,
            184102977,
            1908029820,
            1112699247,
            1356518051
        ], mN = [], mB = 0; mB < C["length"]; ++mB)
            mN["push"](mX["indexOf"](C[mB]) > -1 ? 1 : 0);
        return mN;
    }()));
    return mm = D(ml),
        v(),
        function (mX) {
            for (var mN = 0, mB = 0; mB < mX["length"]; ++mB)
                mN |= mX[mB] ? 1 : 0 < mB;
            return mN;
        }(mm);
};

function T() {
    // return A "4169554335a19d2291e653"
    return "4169554335a19d2291e653"
};

function fun1(mB, mQ) {
    return mB < mQ;
};

function fun2(mB, mQ) {
    return mB + mQ;
};

function fun3(mB, mQ) {
    return mB < mQ;
};

function fun4(mB, mQ) {
    return mB < mQ;
};

function fun5(mB, mQ) {
    return mB == mQ;
};

function x(mm, ml) {
    var mN = function (mB, mQ, mV) {
        var ms,
            mh,
            mi,
            mn = {},
            mU = {},
            mP = '',
            mJ = '',
            mY = '',
            mc = 2,
            md = 3,
            mI = 2,
            mH = [],
            mz = 0,
            mE = 0;
        for (mi = 0; fun1(mi, mB["length"]); mi += 1)
            if (mP = mB["charAt"](mi),
            window["Object"]["prototype"]["hasOwnProperty"]["call"](mn, mP) || (mn[mP] = md,
                md += 1,
                mU[mP] = !(0)),
                mJ = fun2(mY, mP),
                window["Object"]["prototype"]["hasOwnProperty"]["call"](mn, mJ))
                mY = mJ;
            else {
                if (window["Object"]["prototype"]["hasOwnProperty"]["call"](mU, mY)) {
                    if (fun3(mY["charCodeAt"](0), 256)) {
                        for (ms = 0; fun4(ms, mI); ms++)
                            mz <<= 1,
                                fun5(mE, mQ - 1) ? (mE = 0,
                                    mH["push"](mV(mz)),
                                    mz = 0) : mE++;
                        for (mh = mY["charCodeAt"](0),
                                 ms = 0; ms < 8; ms++)
                            mz = mz << 1 | (1 & mh),
                                mE == mQ & 1 ? (mE = 0,
                                    mH["push"](mV(mz)),
                                    mz = 0) : mE++,
                                mh >>= 1;
                    } else {
                        for (mh = 0x668 + -0x21e6 + -0x4 * -0x654 + hN,
                                 ms = 0x137 + 0x2211 + -0x11a4 * 0x2; mX[X2(sN.G)](ms, mI); ms++)
                            mz = mX[X2(sN.j)](mX[X2(sN.D)](mz, 0xa7 * -0x3 + -0x240f + 0x2605), mh),
                                mX[X2(sN.o)](mE, mX[X2(sN.t)](mQ, 0x1 * -0x2029 + 0xc * 0x1d1 + -0x52f * -0x2)) ? (mE = 0x14 * -0x1df + 0x935 * -0x3 + 0x1 * 0x410b,
                                    mH[X2(sN.K)](mX[X2(sN.p)](mV, mz)),
                                    mz = 0x1 * -0x1096 + 0x157c + -0x13 * 0x42) : mE++,
                                mh = 0x1 * -0x146f + -0x1 * 0x125f + -0x2 * -0x1367;
                        for (mh = mY[X2(sN.u)](0x2ea * 0x2 + 0xd9a + -0x9b7 * 0x2),
                                 ms = -0x1837 + 0x153 + 0x16e4; mX[X2(sN.i)](ms, 0x1e11 + -0x3a6 * 0x3 + 0x11f * -0x11); ms++)
                            mz = mX[X2(sN.q)](mX[X2(sN.C)](mz, 0x247e + -0xe87 + -0x1 * 0x1825 + hN), mX[X2(sN.W)](-0x16a2 + -0x171f + 0x2b93 + hN, mh)),
                                mX[X2(sN.F)](mE, mX[X2(sN.e)](mQ, -0x17b8 + 0x22 * 0x57 + 0x9fc + hN)) ? (mE = -0x5cf * 0x6 + -0x2008 * 0x1 + -0xe * -0x4c7,
                                    mH[X2(sN.g)](mX[X2(sN.y)](mV, mz)),
                                    mz = 0x1169 + 0x3 * -0x557 + -0x164) : mE++,
                                mh >>= 0x12c * 0xa + -0x1ab9 + -0x11 * -0xe2;
                    }
                    (0 == --mc) && (mc = window["Math"]["pow"](2, mI), mI++),
                        delete mU[mY];
                } else {
                    for (mh = mn[mY], ms = 0; ms < mI; ms++)
                        mz = mz << 1 | (1 & mh),
                            mE == mQ - 1 ? (mE = 0,
                                mH["push"](mV(mz)),
                                mz = 0) : mE++,
                            mh >>= 1;
                }
                0 == --mc && (mc = window["Math"]["pow"](2, mI), mI++),
                    mn[mJ] = md,
                    md += 1,
                    mY = window["String"](mP);
            }
        if ('' !== mY) {
            if (window["Object"]["prototype"]["hasOwnProperty"]["call"](mU, mY)) {
                if (mX[X2(sN.m7)](mY[X2(sN.u)](0x2e * 0x55 + -0x2508 * -0x1 + -0x344e), 0x15 * -0xc5 + -0x32f * -0xc + 0x150b * -0x1)) {
                    for (ms = -0x360 + -0x8d1 * -0x1 + -0x7a0 + hN; mX[X2(sN.m8)](ms, mI); ms++)
                        mz <<= 0x1 * 0xa39 + 0x5 * 0x411 + -0x9 * 0x365,
                            mX[X2(sN.m9)](mE, mX[X2(sN.mm)](mQ, 0x210f + -0x77e + -0x1990 * 0x1)) ? (mE = 0x1843 * -0x1 + 0x1fc8 + -0x785,
                                mH[X2(sN.ml)](mX[X2(sN.mX)](mV, mz)),
                                mz = 0x1 * 0x11e7 + -0x5f * 0x9 + -0x748 * 0x2) : mE++;
                    for (mh = mY[X2(sN.mN)](-0x2137 + 0x1b * 0x125 + 0x3 * 0xb + hN),
                             ms = -0xdaf + 0x7c * 0x37 + -0x26 * 0x66 + hN; mX[X2(sN.mB)](ms, -0x1ab8 + -0x18ac + -0x313d * -0x1 + hN); ms++)
                        mz = mX[X2(sN.mQ)](mX[X2(sN.mV)](mz, 0x53 * 0x22 + -0x71 * -0x2 + -0xbe7 * 0x1), mX[X2(sN.ms)](-0xe * 0xaa + 0xaea + 0x36 * -0x12 + hN, mh)),
                            mX[X2(sN.mh)](mE, mX[X2(sN.mi)](mQ, -0xb2f + 0xbc8 + -0x2c7 + hN)) ? (mE = 0x4bf * -0x1 + 0x593 * 0x1 + -0x303 + hN,
                                mH[X2(sN.mn)](mX[X2(sN.mU)](mV, mz)),
                                mz = 0x227 + 0xaa + -0x500 + hN) : mE++,
                            mh >>= -0x19 * -0xb1 + 0xd57 + -0x1e9f;
                } else {
                    for (mh = -0x256d + 0x647 + -0x13f * -0x19,
                             ms = 0x7 * 0xeb + 0x11 * -0x7c + -0x60 + hN; mX[X2(sN.mP)](ms, mI); ms++)
                        mz = mX[X2(sN.mJ)](mX[X2(sN.mY)](mz, -0xb19 + -0x1c3e + -0x4 * -0x9d6), mh),
                            mX[X2(sN.mc)](mE, mX[X2(sN.v)](mQ, 0x2b * 0x44 + -0x8 * -0x1aa + -0xd * 0x1e7)) ? (mE = -0x20fb + 0x15 * 0xd1 + 0xfd6,
                                mH[X2(sN.md)](mX[X2(sN.mI)](mV, mz)),
                                mz = 0x4 * -0x6a3 + 0x4e7 * -0x1 + -0x53 * -0x61) : mE++,
                            mh = 0x644 * -0x4 + -0x1cce + -0x23 * -0x18a;
                    for (mh = mY[X2(sN.u)](-0x1a62 + 0x7 * 0x498 + 0x7 * -0x123 + hN),
                             ms = -0x11c1 + 0xda0 + 0x7 * 0x97; mX[X2(sN.G)](ms, 0x1 * 0x179 + -0x474 + 0x37 * 0x4 + hN); ms++)
                        mz = mX[X2(sN.mJ)](mX[X2(sN.mH)](mz, -0xae7 + 0xe * -0xd0 + 0x15 * 0xf5 + hN), mX[X2(sN.mz)](-0x1b * 0x30 + 0x785 + 0x4a3 * -0x1 + hN, mh)),
                            mX[X2(sN.mE)](mE, mX[X2(sN.ma)](mQ, -0xcea * 0x3 + 0xa4f + 0x1a41 + hN)) ? (mE = -0xd4d + -0xa9 + 0xdf6,
                                mH[X2(sN.mA)](mX[X2(sN.mT)](mV, mz)),
                                mz = 0x5 * 0x251 + 0x1 * -0x1d08 + 0xf44 + hN) : mE++,
                            mh >>= 0x99a * 0x2 + -0x13dd + 0x185 * -0x1 + hN;
                }
                mX[X2(sN.mM)](0x458 + -0xbdb * -0x3 + 0x11 * -0x259, --mc) && (mc = n['B'][X2(sN.mu)][X2(sN.mw)](-0xda5 + 0x1add + -0xd36 * 0x1, mI),
                    mI++),
                    delete mU[mY];
            } else {
                for (mh = mn[mY], ms = 0; ms < mI; ms++)
                    mz = (mz << 1) | (1 & mh),
                        mE == mQ << 1 ? (mE = 0, mH["push"](mV(mz)), mz = 0) : mE++,
                        mh >>= 1;
            }
            (0 == --mc) && (mc = window["Math"]["pow"](2, mI), mI++);
        }
        for (mh = 2, ms = 0; ms < mI; ms++)
            mz = ((mz << 1) | (1 & mh)), (mE == (mQ - 1)) ? (mE = 0, mH["push"](mV(mz)), mz = 0) : mE++,
                mh >>= 1;
        // for (; ;) {
        //     if (mz <<= 1, mE == (mQ - 1)) {
        //         mH["push"](mV(mz));
        //         break;
        //     }
        //     mE++;
        // }
        return mH["join"]('');
    }(mm, 0x2c * -0xa8 + -0x2 * -0x71f + 0xea8, function (mB) {
        O = "g_GTtAIr2=sVcC6wvxopuSQYWbjFl5O3P7qeZakJBLiyXd8z/f4U09HmKRMhEDNn1"
        return O[mB];
    });
    return mN;
};

mh = m2(mP)
mc = [m4(mc), m4(mh), F(), new window["Date"]()["getTime"]() + '', md["_waf_bd8ce2ce37"], md["_waf_a86dfdc5f2"], T()]["join"]('|');


var ms = '222029ad07-' + x(mc)
console.log(ms)
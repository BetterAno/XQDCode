require('./123')
require('./webpack')


// 谷歌 UA 生成位数为 983(相对固定的)
// 火狐 UA 生成位数为 975
var _ = window.loader(59340)
var k = window.loader.n(_)
var c = window.loader(39649)
var d = window.loader.n(c)
var p = window.loader(44845)
var i = window.loader(20116)
var r = window.loader.n(i)
var o = window.loader(14310)
var a = window.loader.n(o)
var g = (window.loader(51876),
    window.loader(6059),
    window.loader(96253),
    window.loader(66108),
    window.loader(86902))
var v = window.loader.n(g)
var F = window.loader(52153)
var K = window.loader.n(F)

function H(e, t) {
    var n = v()(e);
    if (a()) {
        var o = a()(e);
        t && (o = r()(o).call(o, (function (t) {
                return s()(e, t).enumerable
            }
        ))),
            n.push.apply(n, o)
    }
    return n
}

function Q(e) {
    for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2 ? H(Object(n), !0).forEach((function (t) {
                (0, p.Z)(e, t, n[t])
            }
        )) : d() ? Object.defineProperties(e, d()(n)) : H(Object(n)).forEach((function (t) {
                Object.defineProperty(e, t, s()(n, t))
            }
        ))
    }
    return e
}

function get_h5st(params) {
    i = params
    var i = Q(Q({}, i), {}, {
        clientPageId: "jingfen_pc"
    })

    var w = {
        functionId: "unionSearchRecommend",
        appid: "unionpc",
        body: K()(k()(i)).toString()
    }
    var x = new window.ParamsSign({
        appId: "586ae"
    })
    return x._$sdnmd(w)
}

var params = {
    "funName": "getSkuByMaterialId",
    "page": {
        "pageNo": 1,
        "pageSize": 60
    },
    "param": {
        "materialId": 315,
        // 时间段开头数字, 如: 08:00 -> 8
        "secKillTimePeriod": 8,
        "seckillTimeType": 0,
        "requestScene": 0,
        "requestExtFields": [
            "shopInfo",
            "orientations"
        ]
    }
};
console.log('123123', get_h5st(params));


module.exports = {
    get_h5st: get_h5st,
}
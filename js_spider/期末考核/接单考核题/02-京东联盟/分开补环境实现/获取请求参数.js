require('./mod2')
require('./webpack')
require('./123123')


var o = window.loader(14310)
var a = window.loader.n(o)
var i = window.loader(20116)
var r = window.loader.n(i)
var l = window.loader(34074)
var s = window.loader.n(l)
var c = window.loader(39649)
var d = window.loader.n(c)
var p = window.loader(44845)
var g = (window.loader(51876),
    window.loader(6059),
    window.loader(96253),
    window.loader(66108),
    window.loader(86902))
var v = window.loader.n(g)
var _ = window.loader(59340)
var k = window.loader.n(_)
var D = window.loader(36808)
var B = window.loader.n(D)
var S = window.loader(9669)
var z = window.loader.n(S)

// x-api-eid-token 的值为 G
// 导入完整js文件获取 getJsToken (123123.js)
window.getJsToken((function (e) {
    console.log("JS token 获取结果：", e),
        L = e.jsToken
}), 3e3);
var G = (z().create({
    timeout: 6e4
}),
    L);


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


function get_params(params) {
    var v = B().get("__jda")
    var m = v.split(".")[1]

    i = params
    var i = Q(Q({}, i), {}, {
        clientPageId: "jingfen_pc"
    })

    var b = {
        functionId: "unionSearchRecommend",
        appid: "unionpc",
        _: Date.now(),
        loginType: "3",
        // uuid的值与document.cookie值有关
        uuid: m,
        "x-api-eid-token": G,
        body: k()(i)
    };
    return b
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
// console.log(get_params(params));

module.exports = {
    get_params: get_params
}
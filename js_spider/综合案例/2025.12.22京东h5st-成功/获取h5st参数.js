require('./123')
var CryptoJS = require("crypto-js");

const time = new Date().getTime()

const paramsH5sign = {
    appid: 'search-pc-java',
    functionId: "pc_search_searchWare",
    client: 'pc',
    clientVersion: '1.0.0',
    t: time,
}

var params = {
    "enc": "utf-8",
    "pvid": "91b02ba74cd84a4cba5b2b2537825cf6",
    "area": "19_1672_19827_56534",
    "page": 3,
    "new_interval": true,
    "s": 46
}

if (params) {
    paramsH5sign['body'] = CryptoJS.SHA256(JSON.stringify(params))
}

function get_h5st(paramsH5sign) {
    window.PSignCom = new window.ParamsSign({
        appId: "fb5df",
        preRequest: !1,
        onSign: function (t) {
            0 != t.code && K.O.postDraData(704, "ParamsSign签名不可用", "ParamsSign", "code != 0", "", "")
        },
        onRequestTokenRemotely: function (t) {
            t.code,
                t.message
        },
        onRequestToken: function (t) {
            t.code,
                t.message
        }
    });

    result = window.PSignCom._$sdnmd(paramsH5sign)
    return result
}

module.exports = {get_h5st: get_h5st}
// console.log(get_h5st(paramsH5sign));

require('./source_code')
var crypto_js = require('crypto-js');

const time = new Date().getTime()

const paramsH5sign = {
    appid: 'search-pc-java',
    functionId: "pc_search_searchWare",
    client: 'pc',
    clientVersion: '1.0.0',
    t: time,
}

var params = {
    "pvid": "df9608079abb48f1bb66a8ae71b46727",
    "area": "1_72_55653_0",
    "page": 9,
    "new_interval": true,
    "s": 188
}


paramsH5sign['body'] = crypto_js.SHA256(JSON.stringify(params))


function get_h5st(paramsH5sign) {
    window.PSignCom = new ParamsSign({
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

    var result = window.PSignCom._$sdnmd(paramsH5sign);
    console.log(result);
    return result;
}


module.exports = {get_h5st: get_h5st}
// get_h5st(paramsH5sign)
// this._$sdnmd(paramsH5sign);
// const {h5st} = await window.PSign.sign(paramsH5sign)
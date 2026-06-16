var CryptoJS = require('crypto-js')

function get_params(o) {
    var a = Date.now()
    for (s = '', l = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9), f = 0; f < 6; f++) {
        d = Math.floor(9 * Math.random())
        s += l[d]
    }
    var u = Number(s)

    var g = []
    g.push("PZTimestamp=" + a + "&Random=" + u + "&2147483647=" + encodeURIComponent(JSON.stringify(o)))
    var y = g.join("&") + "&accessKey=3qXyB7uf"
    var w = CryptoJS.MD5(y).toString()
    return {
        Timestamp: a,
        strMd5: w,
        Random: u
    }
}

var o = {
    "order": "ASC",
    "sort": null,
    "page": 9,
    "pageSize": 21,
    "action": {
        "gameId": "7",
        "merchantMark": null,
        "keywords": [],
        "searchWords": [],
        "searchPropertyIds": [],
        "unionGameIds": [],
        "goodsSearchActions": [],
        "goodsCatalogueId": 6
    }
}
console.log(get_params(o));






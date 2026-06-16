const CryptoJS = require('crypto-js');

// 当前时间戳
const timestamp = Date.now();

// 生成 6 位随机数（从 1-9 中选）
let randomStr = '';
const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * 9);
    randomStr += digits[idx];
}
const randomNum = Number(randomStr);

// 请求参数
const payload = {
    order: "ASC",
    sort: null,
    page: 8,
    pageSize: 10,
    action: {
        gameId: "7",
        merchantMark: null,
        keywords: [],
        searchWords: [],
        searchPropertyIds: [],
        unionGameIds: [],
        goodsSearchActions: [],
        goodsCatalogueId: 6,
        countFlag: false,
        conditionSearch: false
    }
};

// 拼接签名字符串
const signParts = [
    `PZTimestamp=${timestamp}`,
    `Random=${randomNum}`,
    `2147483647=${encodeURIComponent(JSON.stringify(payload))}`
];

let signString = signParts.join('&') + '&accessKey=3qXyB7uf';

// 转义特殊字符（保持原逻辑）
signString = signString
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/'/g, '%27')
    .replace(/\*/g, '%2A')
    .replace(/~/g, '%7E')
    .replace(/[!！]/g, '%21');

// 计算 MD5 签名
const sign = CryptoJS.MD5(signString).toString();

// 最终 headers
const headers = {
    PZTimestamp: timestamp,
    Sign: sign,
    Random: randomNum
};

console.log(headers);



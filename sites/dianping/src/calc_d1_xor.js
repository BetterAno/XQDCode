const crypto = require('crypto');

// 真实浏览器 mtgsig 样本
const real = {
  a1: "1.2",
  a2: "1779787041022",
  a3: "805zzu6yz53v53v119w881v2w406vz6780v4wzv844497958y715u41y",
  a5: "+HJHbN7gOUWF4/0qNonxsdrMMwPmEeykwxcP3n/SjWiBT/IQJ6MQ5uGnPJz4DHQ49CGbmM/QAJptt0GQ7AtMbxnLnRy0SMkqRes8/JmoWCDSjV3dhJTQ94A9axX/",
  a6: "h1.9Q7a9jPFujuSpGqpQhPALgmdzxUHHiMAVrqC5cMnvkh5yFhHAqkVINxM/AYd0gUzlYTKlDmMWH2dI09et80CpEK0IWo5e4tyCoAbHPl0yEdWWzRxXUqRb+WCqRufd7M4Qz2N41Kjoret6ZwEhPChyKlcCVsdruqEPvIJ/Hw+bNypyJ3q9PvXK6O88IfSC7VV2wVekcHQ39VOt7cpm1nGDgjpUaoV4YMUiWz2BumMBPw6wYFzMP7wYACHE6HkuJQ6akI8t1L8asYNhh5Yyzz5hnRZlJT8nYFxHDypSck/kUKRYbRFZ8px2psSVFK5sXFE1TnGn5zrtFV/7+RkRS26tGh8FfP0w06PlDl6jENv7dHzVYuLLuU1hr/hAx4Ob4HGJfBk4uPKzIvwKsj6x2iEmGeROKh7pA/wcQKSQcqjjSjsMkYRG3efmp711+2kURlxTszY0VqDGsCmfrMG3WCD5TDORvr6utVvD2stV8sKrKpOlkOKdCjymL9O/RYrE1QeRMzuKAKShYjoLbSwYNv5xEQ==",
  a8: "847c3e9863846b0b0d749fa3ec88f584",
  a9: "4.2.0,7,247",
  a10: "63",
  d1: "af59cff0d904c6b5fe329b3d765d0948"
};

// 拼接
const concat = "4" + real.a1 + real.a2 + real.a3 + real.a5 + real.a6 + real.a8 + real.a9 + real.a10;

// URL 编码后转字节
const concatBytes = Buffer.from(encodeURIComponent(concat));

// MD5
const md5Hex = crypto.createHash('md5').update(concatBytes).digest('hex');

console.log("concat len:", concat.length);
console.log("concatBytes len:", concatBytes.length);
console.log("MD5:", md5Hex);

// XOR 反推 d1_fixed
let xorArr = [];
for (let i = 0; i < 16; i++) {
  const mb = parseInt(md5Hex.substr(i * 2, 2), 16);
  const db = parseInt(real.d1.substr(i * 2, 2), 16);
  xorArr.push(mb ^ db);
}
console.log("d1_xor array:", JSON.stringify(xorArr));
console.log("d1_xor hex:", xorArr.map(b => b.toString(16).padStart(2, '0')).join(''));

// 验证
let d1_check = "";
for (let i = 0; i < 16; i++) {
  const mb = parseInt(md5Hex.substr(i * 2, 2), 16);
  d1_check += (xorArr[i] ^ mb).toString(16).padStart(2, '0');
}
console.log("d1 verify:", d1_check === real.d1 ? "PASS" : "FAIL", d1_check);
console.log("expected:", real.d1);

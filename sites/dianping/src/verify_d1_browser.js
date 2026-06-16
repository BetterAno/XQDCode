const crypto = require('crypto');

// 真实浏览器 mtgsig 样本 (shopquestion)
const samples = [
  {
    name: "debugCheck",
    a1: "1.2", a2: "1779790838933",
    a3: "805zzu6yz53v53v119w881v2w406vz6780v4wzv844497958y715u41y",
    a5: "CkgkQNeMIhEtkFHtK4BH2Jy6fwiBCi62FGdQDsQfOC7tySFYnu2rmzFNh5q26/xZi/1+9+hpNwT97rutvpIpFtqtyXgEwpuXAI2etujWgAbPWzP=",
    a6: "h1.98cjhy0GDh3kMmefISFEINgjgjy+ueW7kGYOOHlJh5sh6wWKFK6U9R1gZjSFjrNCEOnZ0n1agGnzK75iYkgtNQFSB1d0lDVTqwC8AUS2traVIOB1sxbKUKBigMNK96yuyX6RohPfX6tNuJNzCbdxHTLKJ/0R4cqI9ALm+haFwh4zV2kf18I775btafM2TP5jLvoK57g01lGnwQhYXgtgQRlx6nZFT+ec0zQ9FshwVEiwKFkeXHvpY7d5sNrlGBOozsbexySwX6DNkm1moSwdT8Zo/MjNbJs1V0d8R2PG3BapW2w+O28w87BYAFLseqknf3ZWcUqXZML4rx1qZMZ+BUlnOpGchfMOwHMhET2quCDEnJfcTBrW/VDyt7eJUcQ8Xpq9YjExZ/YC1s5YXG5pycg==",
    a8: "796b4b04bee00f659557df1bfee13275",
    a9: "4.2.0,7,190", a10: "59",
    d1: "ab6a32d2af1a0d18e01e592704703fcb"
  },
  {
    name: "friendslike",
    a1: "1.2", a2: "1779790838950",
    a3: "805zzu6yz53v53v119w881v2w406vz6780v4wzv844497958y715u41y",
    a5: "xjeQMI2yw6wk8bPZNnL7qWndbmRjFbeYQgH6COSFvB9hixo19UJ1QQU6VfFwiDY1x0AdNvrmyMa0yNidYI+pU/0SBa5LoqF9xMcN0EyUfllKGGZ=",
    a6: "h1.98cjhy0GDh3kMmefISFEINgjgjy+ueW7kGYOOHlJh5sh6wWKFK6U9R1gZjSFjrNCEOnZ0n1agGnzK75iYkgtNQFSB1d0lDVTqwC8AUS2traVIOB1sxbKUKBigMNK96yuyX6RohPfX6tNuJNzCbdxHTLKJ/0R4cqI9ALm+haFwh4zV2kf18I775btafM2TP5jLvoK57g01lGnwQhYXgtgQRlx6nZFT+ec0zQ9FshwVEiwKFkeXHvpY7d5sNrlGBOozsbexySwX6DNkm1moSwdT8Zo/MjNbJs1V0d8R2PG3BapW2w+O28w87BYAFLseqknf3ZWcUqXZML4rx1qZMZ+BUlnOpGchfMOwHMhET2quCDEnJfcTBrW/VDyt7eJUcQ8Xpq9YjExZ/YC1s5YXG5pycg==",
    a8: "e341c39baed5a7eec75ed12e29c217f6",
    a9: "4.2.0,7,190", a10: "59",
    d1: "a606d47b67653a8b24a65965c163eef2"
  },
  {
    name: "shopdetail",
    a1: "1.2", a2: "1779790838952",
    a3: "805zzu6yz53v53v119w881v2w406vz6780v4wzv844497958y715u41y",
    a5: "AASZfj292ARH7foUzwibQQSM669sdK7JcnRaiM+7mE1FfTXycq9QFlHoNln3DjV140GiPv/Y0sLH9WnC8vEXPXY/CPwWPhyf6JqV+8xDuYp/iXV=",
    a6: "h1.98cjhy0GDh3kMmefISFEINgjgjy+ueW7kGYOOHlJh5sh6wWKFK6U9R1gZjSFjrNCEOnZ0n1agGnzK75iYkgtNQFSB1d0lDVTqwC8AUS2traVIOB1sxbKUKBigMNK96yuyX6RohPfX6tNuJNzCbdxHTLKJ/0R4cqI9ALm+haFwh4zV2kf18I775btafM2TP5jLvoK57g01lGnwQhYXgtgQRlx6nZFT+ec0zQ9FshwVEiwKFkeXHvpY7d5sNrlGBOozsbexySwX6DNkm1moSwdT8Zo/MjNbJs1V0d8R2PG3BapW2w+O28w87BYAFLseqknf3ZWcUqXZML4rx1qZMZ+BUlnOpGchfMOwHMhET2quCDEnJfcTBrW/VDyt7eJUcQ8Xpq9YjExZ/YC1s5YXG5pycg==",
    a8: "3405e036bd5f9d3564e11993ec10462e",
    a9: "4.2.0,7,190", a10: "59",
    d1: "506f784654072094e303484d046858d1"
  },
  {
    name: "shopquestion",
    a1: "1.2", a2: "1779790838953",
    a3: "805zzu6yz53v53v119w881v2w406vz6780v4wzv844497958y715u41y",
    a5: "k+QQ8PHpjXq831iFS6/V8JBFuZLOKmcYU9ikZsyDrtkGlFSIkLYbmaEZ3EER6OEIWUhUECqInsZr0zXQdXDz2tP+Kzh0hkuXi2JzWk2Ahi1sUjH=",
    a6: "h1.98cjhy0GDh3kMmefISFEINgjgjy+ueW7kGYOOHlJh5sh6wWKFK6U9R1gZjSFjrNCEOnZ0n1agGnzK75iYkgtNQFSB1d0lDVTqwC8AUS2traVIOB1sxbKUKBigMNK96yuyX6RohPfX6tNuJNzCbdxHTLKJ/0R4cqI9ALm+haFwh4zV2kf18I775btafM2TP5jLvoK57g01lGnwQhYXgtgQRlx6nZFT+ec0zQ9FshwVEiwKFkeXHvpY7d5sNrlGBOozsbexySwX6DNkm1moSwdT8Zo/MjNbJs1V0d8R2PG3BapW2w+O28w87BYAFLseqknf3ZWcUqXZML4rx1qZMZ+BUlnOpGchfMOwHMhET2quCDEnJfcTBrW/VDyt7eJUcQ8Xpq9YjExZ/YC1s5YXG5pycg==",
    a8: "8ef524e54ddd9e9c9312a5a7df636159",
    a9: "4.2.0,7,190", a10: "59",
    d1: "06533726495be6483916ca194f08d16a"
  }
];

function stdMd5Hex(bytes) { return crypto.createHash('md5').update(bytes).digest('hex'); }

console.log("=== d1 验证 - 真实浏览器样本 ===\n");

for (const s of samples) {
  const concat = "4" + s.a1 + s.a2 + s.a3 + s.a5 + s.a6 + s.a8 + s.a9 + s.a10;
  const concatBytes = Buffer.from(encodeURIComponent(concat));
  const md5Hex = stdMd5Hex(concatBytes);
  const md5Bytes = Buffer.from(md5Hex, "hex");
  const d1Bytes = Buffer.from(s.d1, "hex");
  
  const xorArr = [];
  for (let i = 0; i < 16; i++) {
    xorArr.push(md5Bytes[i] ^ d1Bytes[i]);
  }
  
  // 用 xorArr 验证 d1
  let verifyD1 = "";
  for (let i = 0; i < 16; i++) {
    verifyD1 += (xorArr[i] ^ md5Bytes[i]).toString(16).padStart(2, "0");
  }
  
  console.log(`${s.name}:`);
  console.log(`  MD5: ${md5Hex}`);
  console.log(`  d1:  ${s.d1}`);
  console.log(`  xor: ${xorArr.map(b => b.toString(16).padStart(2, '0')).join('')}`);
  console.log(`  verify: ${verifyD1 === s.d1 ? "PASS" : "FAIL"}`);
  console.log();
}

// 比较 4 个样本的 xor 数组是否相同
console.log("=== XOR arrays comparison ===");
const allXor = [];
for (const s of samples) {
  const concat = "4" + s.a1 + s.a2 + s.a3 + s.a5 + s.a6 + s.a8 + s.a9 + s.a10;
  const concatBytes = Buffer.from(encodeURIComponent(concat));
  const md5Bytes = Buffer.from(stdMd5Hex(concatBytes), "hex");
  const d1Bytes = Buffer.from(s.d1, "hex");
  const xorArr = [];
  for (let i = 0; i < 16; i++) xorArr.push(md5Bytes[i] ^ d1Bytes[i]);
  allXor.push(xorArr);
  console.log(`${s.name}: [${xorArr.join(",")}]`);
}

// Check if all are the same
const first = allXor[0];
const allSame = allXor.every(arr => arr.every((v, i) => v === first[i]));
console.log(`\nAll XOR arrays identical: ${allSame ? "YES - constant!" : "NO - varies per request"}`);

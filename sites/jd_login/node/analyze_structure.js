// 读出错位置附近的源码看看到底缺啥
const fs = require('fs');
const path = require('path');
const c = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'jcap_ap0b2a.js'), 'utf-8');

// 定位文件的行
const lines = c.split('\n');
console.log('Total lines:', lines.length);
for (let i = 0; i < lines.length; i++) {
    console.log(`Line ${i + 1} length: ${lines[i].length}`);
}

// Line 20 at column 11368 是出错位置  
if (lines.length >= 20) {
    console.log('\n=== Line 20, col 11200-11500 ===');
    console.log(lines[19].slice(11200, 11500));
}

// Line 8 at 22277 是调用栈
if (lines.length >= 8) {
    console.log('\n=== Line 8, col 22100-22400 ===');
    console.log(lines[7].slice(22100, 22400));
}

// 搜索 K5nOZLud 生成函数
var fs = require('fs');
require('./browser_envs');
require('./encrypt_js_code');

var _origExec = window.execScript;
window.execScript = function(code) {
    // 保存 EXEC 代码
    fs.writeFileSync('sites/cnipa/src/exec_code.js', code);
    return _origExec(code);
};

require('./decrypt_js_code');
_$h3();

// 搜索 EXEC 代码中的 URL/后缀相关模式
var code = fs.readFileSync('sites/cnipa/src/exec_code.js', 'utf8');

// 搜索可能的后缀生成函数
var patterns = [
    'location.search',
    'location.href',
    '.search',
    'window.location',
    'document.URL',
    'K5',                // 可能的后缀参数名前缀
    'nOZ',               // K5nOZLud 的部分
    'Lud',
    'suffix',
    '_$jV',              // 安装拦截器的函数
    '_$if',              // 事件处理器
    '_$fn',              // 常见 RS6 变量
];

patterns.forEach(function(p) {
    var count = (code.match(new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (count > 0) console.log('[SEARCH] "' + p + '" found ' + count + ' times');
});

// 检查所有新增的全局函数
var globalFuncs = [];
for (var k in globalThis) {
    try {
        if (typeof globalThis[k] === 'function' && k.startsWith('_$')) {
            globalFuncs.push(k);
        }
    } catch(e) {}
}
console.log('[GLOBALS] New _$ functions after _$h3:', globalFuncs.join(', '));

console.log('[RESULT] cookie len:', document.cookie.length);

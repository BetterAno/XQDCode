// 简版: 只生成 cookie 并输出
require('./browser_envs');
require('./encrypt_js_code');
require('./decrypt_js_code');
console.log(document.cookie);

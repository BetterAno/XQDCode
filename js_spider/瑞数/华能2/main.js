require('./brower_env.js')
require('./encrypt_js_code.js')
require('./decrypt_run_js_code.js')

function get_cookie() {
    return document.cookie
}

console.log(get_cookie());

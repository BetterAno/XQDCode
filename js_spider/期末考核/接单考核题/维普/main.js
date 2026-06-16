require('./browser_envs')
require('./encrypt_js_code')
require('./decrypt_js_code')

function get_cookie(){
    return document.cookie
}

console.log(get_cookie());

var JSEncrypt = require("jsencrypt");


function get_login_params(password, token, publicKey) {
    var data = {
        verifyCode: token,
        _: new Date().getTime()
    };
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    data.password = encrypt.encrypt(password);
    return data;
}

get_login_params()


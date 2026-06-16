var Crypt = require('crypto-js')

window = global
navigator = {}
navigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

var _0xdd81 = ['fg0Kw6c=', 'worDpy4A', 'w7jDjMO+w50=', 'wr7DpRsK', 'w63CnH3Csw==', 'XcK/N8OZ', 'BwbCvMOy',
    'w7jDvsO9w5E=', 'w43Cq1LCjw==', 'wojDmMOhwqk=', 'c8Owd8KL', 'w6DDtMO+', 'wpgOfzg=', 'LkTCssOE', 'w5LDlcK1wqo=',
    'w5oqIcKV', 'fggTfA==', 'wrzDpwkX', 'Qjs8w5g=', 'wpzDow4G', '6K645rOn6au46Kyx', 'HMKOJkI=', 'w5hNeEA=', 'wo0tw6NB',
    'ERZETQ==', 'w43DpQVV', 'wq/DqsOtw6Q=', 'w6rCgcONfA==', 'w67DnMObw50=', 'KMOvZsKr', 'JQZUwqk=', 'L8K5w7Er',
    'ChxqDA==', 'w77DvsKpwqI=', 'w6Y+wrp7', 'Gzcsew==', 'wrs/URM=', 'LcK0U8KF', 'wpjDo8OZwpo=', 'AQJoJA==', 'GmEPMQ==',
    'wqjDnRMx', 'JknCtMOJ', 'Kjx9NA==', 'wonCssKqw4M=', 'N8OBCUM=', 'R3tiQw==', 'VMOHWMKp', 'w5HDlEEH', 'w6dzFQs=',
    'w6xRV8Ok', 'FAJUwqE=', 'bA4rw6k=', 'w6h7SGI=', 'AB1aQw==', 'TVLCvMOa', 'EyN8Ww==', 'HsKKI1g=', 'w5vCmMO6ZQ==',
    'w6c1f8O9', 'w5NeQcOZ', 'w6nCssK6wpk=', 'w6XDo3fDmQ==', 'd8OhdsKE', 'wovDs8OOwqk=', 'w4fClMOtRg==', 'GMOFHEg=',
    'w5UpCcKP', 'w5jDg3jDlw==', 'cBAywrU=', 'wpDDvcOl', 'FcO0WcOo', 'w67ChMOjew==', 'I3Ygw54=', 'UjlqBg==', 'OQV+Ug==',
    'w5JJwoln', 'fGzCmMOj', 'w7zDqcK8wqE=', 'EwFueQ==', 'PMOKVcKG', 'Z2lJaQ==', 'McOAQsOU', 'w5/CkMOpcA==', 'Mi5xZQ==',
    'w7jDj8Ktw6E=', 'w55Lf0E=', 'wonDrcO5wqQ=', 'wp0Lw4o=', 'wq8+WSo=', 'HMOnSsKs', 'w4HCh8KIwqI=', 'FsOMBH0=',
    'CjJ2wo0=', 'w6HCo8O5fQ==', 'wpoXw5ta', 'PsOMO8K2', 'PTdiXA==', 'F1Inw5k=', 'NW8Sw6Y=', 'wqnDvAIw', 'aUfClcOq',
    'HTZROg==', 'wowVUgE=', 'CsK6InA=', 'w7MZCcKy', 'Fm4Aw4g=', 'M8OEGEo=', 'w77Dm8K7w7c=', 'BDh5fw==', 'bmpELA==',
    'w7QUGsK0', 'Gx1hYQ==', 'wpgeWsOh', 'UC0uwrM=', 'AWYNw7c=', 'EcKeLXw=', 'w4zDucKcwo8=', 'w6LDtsOQw7Q=', 'AzXDnls=',
    'w6UCwp1L', 'LgR9ZA==', 'w4IhwpZ3', 'w64MScOl', 'axc4wqo=', 'U1BCfg==', 'w45zUsOo', 'AGgtAw==', 'HcO0dMKh',
    'w7jCt8K6wqE=', 'w7pURsOP', 'ET5Gwqo=', 'w54FTcO+', 'LsO9XMO8', 'B8KHC3c=', 'w49UwrVk', 'w5DDlUzDiQ==', 'el7CvsOR',
    'KMOEAMKf', 'E8Kow7Um', 'UxjCn0Q=', 'AcKPw64s', 'ZsOgYcKT', 'w7pAwpFG', 'IxLDkwc=', 'w7prCRo=', 'DhhNVQ==',
    'AMOIHEI=', 'W2NDWg==', 'w7vDp8Kww4o=', 'wrbDpcOgwq4=', 'w67DjMKuw74=', 'w4kaaMOp', 'H8OjZMKg', 'BMO/b8Od',
    'AWjChcOP', 'PwhP', 'w6LDt8Ofw6M=', 'w4vCt8K6wr0=', 'cgY1wqM=', 'NRhjQw==', 'IcKGw4EC', 'ABpvGw==', 'J8KCw4AQ',
    'w6rCh8KzwoU=', 'B3oqw7c=', 'JMO0asOP', 'CMK7QsKS', 'PsK5RcKY', 'C8OoQMON', 'RQ0Bw64=', 'LCrDgwc=', 'wqTDkcOXwoY=',
    'w4TCgMKswrY=', 'wpMMXMOd', 'OcK8w7Mi', 'wrA1TxA=', 'acOtbsKG', 'w4gpwo9I', 'w7/DvHHDhA==', 'w5DCnsOyXQ==',
    'OjEiew==', 'w4jDlcKrw7c=', 'w7HDmsKsw6g=', 'AF97w6U=', 'w7XDqsK8wrk=', 'wqsqw6pL', 'woUJTcOe', 'w6DCgMOxRw==',
    'HRgkTg==', 'wqHCpsK8wq8=', 'NU/CpMOi', 'wrDDmMOuwqI=', 'wpbDghw=', 'Glsrw44=', 'SCsSwqU=', 'OcKSFU8=', 'wr/DiBx1',
    'XUE9SQ==', 'EFkTw4E=', 'TxoVw4o=', 'w7PDmsKZw6E=', 'PcOFRsOU', 'wqrDkMODwoc=', 'w5fDvMKJwp0=', 'A8Ovc8KD',
    'w7jCvsK3wr8=', 'wrfDjcO/woQ=', 'w4oBwp0=', 'w7MZGsKl', 'w6g4bcO8', 'IDtNTQ==', 'w7rDhMK4w7A=', 'w6PDlEEC',
    'BzzDi0Y=', 'w7LCjHHCpw==', 'd25rag==', 'EwEPRw==', 'w7rDt8K7w4Y=', 'w6XDm8K5w7s=', 'w7TDhWAK', 'JcKKJXw=',
    'Hwx8FA==', 'w7Q8asOn', 'B30kw64=', 'bxfCn2c=', 'OH0CIQ==', 'MsORYcKY', 'NAohdQ==', 'w4nDrsKEw6g=', 'OC7Dlho=',
    'NQHDhE4=', 'dTwPw7o=', 'WVshw44=', 'w7/DpVE9', 'GMK/VMKZ', 'M8OkVA==', 'PsOBY8OU', 'w6pff10=', 'eDUYw6E=',
    'wp3DuBgX', 'w59Xdw==', 'w6FJwpFh', 'w5Z1Gjo=', 'wqjDgcOCwo0=', 'wqodXzg=', 'G8OKJsKg', 'a0/CnMOV', 'UGVLYg==',
    'PC5sXQ==', 'KmU3MQ==', 'woEPw4pK', 'LsKFK0g=', 'w7fDpsKTw6k=', 'MVs8w6g=', 'JSrDgQE=', 'Rmt/Qg==', 'H8O4KWg=',
    'Gw9Dwq4=', 'w73Dg3PDiw==', 'wqYQccOB', 'IsOcYsOZ', 'BcO4ZsKw', 'w6XDmcKDw7g='];
(function (_0x266ba3, _0xdd8117) {
    var _0x5bc8ef = function (_0x191490) {
        while (--_0x191490) {
            _0x266ba3['push'](_0x266ba3['shift']());
        }
    };
    _0x5bc8ef(++_0xdd8117);
}(_0xdd81, 0x105));
var _0x5bc8 = function (_0x266ba3, _0xdd8117) {
    _0x266ba3 = _0x266ba3 - 0x0;
    var _0x5bc8ef = _0xdd81[_0x266ba3];
    if (_0x5bc8['rgrCRA'] === undefined) {
        (function () {
            var _0x1a9c58;
            try {
                var _0x21ad54 = Function('return\x20(function()\x20' + '{}.constructor(\x22return\x20this\x22)(\x20)' + ');');
                _0x1a9c58 = _0x21ad54();
            } catch (_0x13a7c6) {
                _0x1a9c58 = window;
            }
            var _0x493a78 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            _0x1a9c58['atob'] || (_0x1a9c58['atob'] = function (_0x570cb6) {
                    var _0xf9aead = String(_0x570cb6)['replace'](/=+$/, '');
                    var _0x382a2e = '';
                    for (var _0xe023f9 = 0x0, _0x4c65f1, _0x2b945f, _0x25d7de = 0x0; _0x2b945f = _0xf9aead['charAt'](_0x25d7de++); ~_0x2b945f && (_0x4c65f1 = _0xe023f9 % 0x4 ? _0x4c65f1 * 0x40 + _0x2b945f : _0x2b945f,
                    _0xe023f9++ % 0x4) ? _0x382a2e += String['fromCharCode'](0xff & _0x4c65f1 >> (-0x2 * _0xe023f9 & 0x6)) : 0x0) {
                        _0x2b945f = _0x493a78['indexOf'](_0x2b945f);
                    }
                    return _0x382a2e;
                }
            );
        }());
        var _0xd92032 = function (_0x1b1ae2, _0x1209bd) {
            var _0x17acc5 = [], _0x1b7090 = 0x0, _0x284f12, _0x1f0ad8 = '', _0x401b09 = '';
            _0x1b1ae2 = atob(_0x1b1ae2);
            for (var _0x312ca7 = 0x0, _0x5ca9cd = _0x1b1ae2['length']; _0x312ca7 < _0x5ca9cd; _0x312ca7++) {
                _0x401b09 += '%' + ('00' + _0x1b1ae2['charCodeAt'](_0x312ca7)['toString'](0x10))['slice'](-0x2);
            }
            _0x1b1ae2 = decodeURIComponent(_0x401b09);
            var _0x1a7619;
            for (_0x1a7619 = 0x0; _0x1a7619 < 0x100; _0x1a7619++) {
                _0x17acc5[_0x1a7619] = _0x1a7619;
            }
            for (_0x1a7619 = 0x0; _0x1a7619 < 0x100; _0x1a7619++) {
                _0x1b7090 = (_0x1b7090 + _0x17acc5[_0x1a7619] + _0x1209bd['charCodeAt'](_0x1a7619 % _0x1209bd['length'])) % 0x100;
                _0x284f12 = _0x17acc5[_0x1a7619];
                _0x17acc5[_0x1a7619] = _0x17acc5[_0x1b7090];
                _0x17acc5[_0x1b7090] = _0x284f12;
            }
            _0x1a7619 = 0x0;
            _0x1b7090 = 0x0;
            for (var _0x499445 = 0x0; _0x499445 < _0x1b1ae2['length']; _0x499445++) {
                _0x1a7619 = (_0x1a7619 + 0x1) % 0x100;
                _0x1b7090 = (_0x1b7090 + _0x17acc5[_0x1a7619]) % 0x100;
                _0x284f12 = _0x17acc5[_0x1a7619];
                _0x17acc5[_0x1a7619] = _0x17acc5[_0x1b7090];
                _0x17acc5[_0x1b7090] = _0x284f12;
                _0x1f0ad8 += String['fromCharCode'](_0x1b1ae2['charCodeAt'](_0x499445) ^ _0x17acc5[(_0x17acc5[_0x1a7619] + _0x17acc5[_0x1b7090]) % 0x100]);
            }
            return _0x1f0ad8;
        };
        _0x5bc8['zRSoko'] = _0xd92032;
        _0x5bc8['pewtbr'] = {};
        _0x5bc8['rgrCRA'] = !![];
    }
    var _0x191490 = _0x5bc8['pewtbr'][_0x266ba3];
    if (_0x191490 === undefined) {
        if (_0x5bc8['oEusvF'] === undefined) {
            _0x5bc8['oEusvF'] = !![];
        }
        _0x5bc8ef = _0x5bc8['zRSoko'](_0x5bc8ef, _0xdd8117);
        _0x5bc8['pewtbr'][_0x266ba3] = _0x5bc8ef;
    } else {
        _0x5bc8ef = _0x191490;
    }
    return _0x5bc8ef;
};

hash1 = {
    md5: function (aaa) {
        return Crypt.MD5(aaa).toString();
    },
    sha1: function (aaa) {
        return Crypt.SHA1(aaa).toString();
    },
    sha256: function (aaa) {
        return Crypt.SHA256(aaa).toString();
    }
}

function go(_0x29e674) {
    hash = hash1[_0x29e674['ha']];
    var _0xa6325 = {};
    _0xa6325[_0x5bc8('0xd6', '!HBy') + 'E'] = function (_0x4d569f, _0x4f6efc) {
        return _0x4d569f < _0x4f6efc;
    }
    ;
    _0xa6325[_0x5bc8('0x35', 'ww%^') + 'T'] = function (_0x465c7c, _0x2fb52c) {
        return _0x465c7c != _0x2fb52c;
    }
    ;
    _0xa6325[_0x5bc8('0xfd', ']!E7') + 'N'] = _0x5bc8('0x17', 'wg0[') + '失败';
    _0xa6325[_0x5bc8('0xca', 'FYzt') + 'y'] = function (_0x3cfe90, _0x2195fc) {
        return _0x3cfe90 + _0x2195fc;
    }
    ;
    _0xa6325[_0x5bc8('0xcc', 'Rm#a') + 'Q'] = function (_0x567a90, _0x39401a) {
        return _0x567a90(_0x39401a);
    }
    ;
    _0xa6325[_0x5bc8('0xc2', 'xeIN') + 'H'] = function (_0x30aaa6, _0x253780) {
        return _0x30aaa6 !== _0x253780;
    }
    ;
    _0xa6325[_0x5bc8('0x68', 'HsS1') + 'q'] = function (_0x9fec4b, _0x13d551) {
        return _0x9fec4b + _0x13d551;
    }
    ;
    _0xa6325[_0x5bc8('0x27', 'S7gr') + 'E'] = _0x5bc8('0x4d', 'RnZY') + _0x5bc8('0xec', 'FYzt') + '=';
    _0xa6325[_0x5bc8('0xc6', 'zfIi') + 'u'] = function (_0x2c994e, _0x51709d) {
        return _0x2c994e + _0x51709d;
    }
    ;
    _0xa6325[_0x5bc8('0x80', 't%!I') + 'G'] = _0x5bc8('0xcb', 'FYzt') + _0x5bc8('0xf0', 'OC9g') + _0x5bc8('0xbb', 'FYzt') + _0x5bc8('0x53', 'OC9g') + _0x5bc8('0x13', '6wUf') + _0x5bc8('0x5b', 'CH%6');
    _0xa6325[_0x5bc8('0x37', 'K6$&') + 'M'] = function (_0x24f13f, _0x282d2e) {
        return _0x24f13f + _0x282d2e;
    }
    ;
    _0xa6325[_0x5bc8('0xac', 'OC9g') + 'o'] = function (_0x553f94, _0x593076) {
        return _0x553f94 == _0x593076;
    }
    ;
    _0xa6325[_0x5bc8('0x28', 'H8O[') + 'E'] = function (_0x28ba46) {
        return _0x28ba46();
    }
    ;
    _0xa6325[_0x5bc8('0xb6', 'X&2@') + 'j'] = function (_0x162816, _0x446bea) {
        return _0x162816 !== _0x446bea;
    }
    ;
    _0xa6325[_0x5bc8('0x60', 'dVFK') + 'c'] = _0x5bc8('0x43', 'NDTi') + 'A';
    _0xa6325[_0x5bc8('0x67', '*EWe') + 'k'] = function (_0x3a42f1, _0x4e0b3c) {
        return _0x3a42f1 - _0x4e0b3c;
    }
    ;
    _0xa6325[_0x5bc8('0x97', 't%!I') + 's'] = function (_0x4294b2, _0x21bccb, _0x4c98f0) {
        return _0x4294b2(_0x21bccb, _0x4c98f0);
    }
    ;
    var _0x30712f = _0xa6325;

    function _0x7af31a() {
        var _0x4bbdde = window[_0x5bc8('0xcd', 'OC9g') + _0x5bc8('0x3b', '(Fdq') + 'r'][_0x5bc8('0x48', 'zfIi') + _0x5bc8('0xf1', 'cqca') + 't']
            , _0x2941de = [_0x5bc8('0x6', '*EWe') + _0x5bc8('0xe', '9jwa')];
        for (var _0x46ff75 = 0x0; _0x30712f[_0x5bc8('0xa4', '3D]G') + 'E'](_0x46ff75, _0x2941de[_0x5bc8('0xb4', 'NW@A') + 'th']); _0x46ff75++) {
            if (_0x30712f[_0x5bc8('0x52', '(Fdq') + 'T'](_0x4bbdde[_0x5bc8('0xa5', 'RnZY') + _0x5bc8('0xc4', '*EWe')](_0x2941de[_0x46ff75]), -0x1)) {
                return !![];
            }
        }
        if (window[_0x5bc8('0xd1', 'V%HP') + _0x5bc8('0x105', 'dVFK') + _0x5bc8('0x9f', 'dVFK')] || window[_0x5bc8('0x7c', '!HBy') + _0x5bc8('0x7f', 'zfIi')] || window[_0x5bc8('0x45', 'nbSI') + _0x5bc8('0xd5', 'YWnD')] || window[_0x5bc8('0x3c', '$n]G') + _0x5bc8('0xae', 'TW*z') + 'r'][_0x5bc8('0xa2', 'zfIi') + _0x5bc8('0x42', 'NW@A') + 'r'] || window[_0x5bc8('0x44', 'Z1XP') + _0x5bc8('0x24', '(e0z') + 'r'][_0x5bc8('0xe6', 'iEDs') + _0x5bc8('0xfe', 'CH%6') + _0x5bc8('0x36', 'dVFK') + _0x5bc8('0xbc', '(e0z') + 'e'] || window[_0x5bc8('0x102', 'TW*z') + _0x5bc8('0x7a', 'ms&I') + 'r'][_0x5bc8('0xd4', '0GoD') + _0x5bc8('0x55', 'OC9g') + _0x5bc8('0x56', 'Z1XP') + _0x5bc8('0x51', '(e0z') + _0x5bc8('0x6f', 'cZ3I')]) {
            return !![];
        }
    };
    if (_0x30712f[_0x5bc8('0x14', '*EWe') + 'E'](_0x7af31a)) {
        if (_0x30712f[_0x5bc8('0x11', '(e0z') + 'j'](_0x30712f[_0x5bc8('0x66', 'FYzt') + 'c'], _0x30712f[_0x5bc8('0xf', 'S7gr') + 'c'])) {
            alert(_0x30712f[_0x5bc8('0xed', 'q7Kc') + 'N']);
        } else {
            return;
        }
    }
    var _0xc2dbe6 = new Date();

    function _0x2465c7(_0x3a4d45, _0x5369cd) {
        var _0x3013e6 = _0x29e674[_0x5bc8('0xe3', 'R2@@') + 's'][_0x5bc8('0xce', '^m2q') + 'th'];
        for (var _0x2826dc = 0x0; _0x2826dc < _0x3013e6; _0x2826dc++) {
            for (var _0x4b8183 = 0x0; _0x30712f[_0x5bc8('0x32', 'NW@A') + 'E'](_0x4b8183, _0x3013e6); _0x4b8183++) {
                var _0x230af6 = _0x30712f[_0x5bc8('0x103', 't%!I') + 'y'](_0x5369cd[0x0] + _0x29e674[_0x5bc8('0x3e', 'YWnD') + 's'][_0x5bc8('0x19', 'cqca') + 'tr'](_0x2826dc, 0x1), _0x29e674[_0x5bc8('0x84', 'V%HP') + 's'][_0x5bc8('0xf3', '*EWe') + 'tr'](_0x4b8183, 0x1)) + _0x5369cd[0x1];
                if (_0x30712f[_0x5bc8('0x3', 'K6$&') + 'Q'](hash, _0x230af6) == _0x3a4d45) {
                    return [_0x230af6, new Date() - _0xc2dbe6];
                }
            }
        }
    };
    var _0x4dbd83 = _0x2465c7(_0x29e674['ct'], _0x29e674[_0x5bc8('0x49', 'NDTi')]);
    if (_0x4dbd83) {
        if (_0x5bc8('0xad', 'K6$&') + 'c' !== _0x5bc8('0x72', '0GoD') + 'F') {
            var _0x46efa7;
            if (_0x29e674['wt']) {
                _0x46efa7 = parseInt(_0x29e674['wt']) > _0x4dbd83[0x1] ? _0x30712f[_0x5bc8('0x4b', 'Z1XP') + 'k'](_0x30712f[_0x5bc8('0x33', 'q7Kc') + 'Q'](parseInt, _0x29e674['wt']), _0x4dbd83[0x1]) : 0x1f4;
            } else {
                _0x46efa7 = 0x5dc;
            }
            if (_0x30712f[_0x5bc8('0x46', '0GoD') + 'H'](_0x5bc8('0xa9', 'OC9g') + 'k', _0x5bc8('0xf8', 'S7gr') + 'a')) {
                var _0x460597 = _0x30712f[_0x5bc8('0x8b', 'X&2@') + 'y'](_0x30712f[_0x5bc8('0x107', 'DPWS') + 'q'](_0x29e674['tn'] + '=' + _0x4dbd83[0x0], _0x30712f[_0x5bc8('0xaf', '^m2q') + 'E']), _0x29e674['vt']) + (_0x5bc8('0x2f', '#o^z') + _0x5bc8('0x1c', 'q7Kc') + '\x20/');
                if (_0x29e674['is']) {
                    _0x460597 = _0x30712f[_0x5bc8('0x9e', 'xeIN') + 'u'](_0x460597, _0x30712f[_0x5bc8('0xa7', 'V%HP') + 'G']);
                }
                return _0x460597;
            } else {
                _0x46efa7 = 0x5dc;
            }

        } else {
            for (var _0x3d0ae3 = 0x0; _0x3d0ae3 < l; _0x3d0ae3++) {
                var _0x5cbbb8 = _0x30712f[_0x5bc8('0xdf', 'q7Kc') + 'u'](_0x30712f[_0x5bc8('0x95', '(Fdq') + 'M'](bts[0x0] + _0x29e674[_0x5bc8('0xeb', 'K6$&') + 's'][_0x5bc8('0x7', 'LEwk') + 'tr'](i, 0x1), _0x29e674[_0x5bc8('0x65', 'FYzt') + 's'][_0x5bc8('0x58', 'cZ3I') + 'tr'](_0x3d0ae3, 0x1)), bts[0x1]);
                if (_0x30712f[_0x5bc8('0x3f', 'ww%^') + 'o'](hash(_0x5cbbb8), ct)) {
                    return [_0x5cbbb8, new Date() - _0xc2dbe6];
                }
            }
        }
    } else {
        _0x30712f[_0x5bc8('0x93', 'TW*z') + 'Q'](alert, _0x30712f[_0x5bc8('0x8f', '#CFQ') + 'N']);
    }
};


// console.log(go({
//     "bts": ["1762232664.374|0|Re7", "9XPwl9uciW6FwQUrJca3T8%3D"],
//     "chars": "IeWapTPhChdxUuXieRSAxw",
//     "ct": "3e18947ff801329ac9631719b2d2a6778c6ba762",
//     "ha": "sha1",
//     "is": true,
//     "tn": "__jsl_clearance_s",
//     "vt": "3600",
//     "wt": "1500"
// }));

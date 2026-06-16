(function(n) {
    var o = n['document'];
    var p = n['Math'];
    var q = o['getElementsByTagName']('head')[0x0];
    var r = function(A, B) {
        var C = o['createElement']('script');
        C['type'] = 'text/javascript';
        C['charset'] = 'UTF-8';
        C['async'] = !![];
        C['src'] = A;
        C['onload'] = C['onreadystatechange'] = B;
        o['body']['appendChild'](C);
    };
    var s = function(A) {
        var B = o['createElement']('link');
        B['setAttribute']('rel', 'stylesheet');
        B['setAttribute']('type', 'text/css');
        B['setAttribute']('href', A);
        o['body']['appendChild'](B);
    };
    var t = function(A, B, C, D, E) {
        var F = 'jsonp_' + p['random']();
        F = F['replace']('.', '');
        window[F] = function(M) {
            clearTimeout(G);
            window[F] = null;
            L['removeChild'](K);
            D(M);
        };
        var G = setTimeout(function() {
            window[F] = null;
            L['removeChild'](K);
            E && E();
        }, 0x1388);
        B[C] = F;
        var H = [];
        for (var I in B) {
            H['push'](I + '=' + B[I]);
        }
        var J = A + '?' + H['join']('&');
        var K = o['createElement']('script');
        K['src'] = J;
        K['type'] = 'text/javascript';
        K['setAttribute']('ignore', 'true');
        var L = o['getElementsByTagName']('head')[0x0];
        L['appendChild'](K);
    };
    var u, v, w, x;
    var y = function(A, B) {
        x = 0x0;
        var C = A['protocol'] ? A['protocol'] + ':' : '';
        var D = C + (A['lang'] && A['lang'] != 'zh_CN' ? '//iv.joybuy.com' : '//iv.jd.com');
        u && v && w ? z(A, B) : t(D + '/slide/v.html', {}, 'callback', function(E) {
            var F = E;
            u = F['data']['static_servers'];
            v = F['data']['style'];
            w = F['data']['script'];
            s(C + F['data']['static_servers'] + F['data']['style']);
            r(C + F['data']['static_servers'] + F['data']['script'], function() {
                z(A, B);
            });
        });
    };
    var z = function(A, B) {
        var C = navigator['userAgent']['indexOf']('compatible') > -0x1 && navigator['userAgent']['indexOf']('MSIE') > -0x1;
        if (C) {
            x++;
            if (x > 0x1) {
                return;
            }
            var D = setInterval(function() {
                try {
                    new JDJRValidate(A, B);
                    clearInterval(D);
                } catch (E) {}
            }, 0x14);
        } else {
            new JDJRValidate(A, B);
        }
    };
    n['initJdSlide'] = y;
    return y;
}(typeof window !== 'undefined' ? window : this));
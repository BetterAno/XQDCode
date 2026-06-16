(function () {
    if (typeof globalThis === "undefined") {
        globalThis = this || (typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : global || {});
    }
})();

function isWebAssemblySupported() {
    if (typeof WebAssembly !== 'object' ||
        typeof WebAssembly.Module !== 'function' ||
        typeof WebAssembly.Instance !== 'function') {
        return false;
    }

    try {
        var bin = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 6, 1, 96, 1, 127, 1, 127, 3, 2, 1, 0, 5, 3, 1, 0, 1, 7, 8, 1, 4, 116, 101, 115, 116, 0, 0, 10, 16, 1, 14, 0, 32, 0, 65, 1, 54, 2, 0, 32, 0, 40, 2, 0, 11]);
        var mod = new WebAssembly.Module(bin);
        var inst = new WebAssembly.Instance(mod, {});

        return (inst.exports.test(4) !== 0);
    } catch (e) {
        return false;
    }
}

var jcapLoadCreate = (function () {
    var JdCaptcha = null;
    var isLoaded = false;
    var pubFn = [];

    var info = {
        appType: 3,
        tdat_version: 99992,
        host: "jcap.m.jd.com",
        tdat_ctx: "A8RpzPvMpQPEEPZC737Wbcqo4er3yvFj4ubEUKiJqqus7qCcnO2epKHwrvn5qfin9_murquvurqxtb0DAwe3Bgutzs_QE78RyxfGFsXL0soaHBwd0dPT28_U1djaK9bY3tje2yzy8vP0oKan",
        cs: 1
    };

    var MAIN_URL = "https://storage.360buyimg.com/jsresource/jcap/version/v2.7.1/1/jcap_ap0b2a.js";
    var BACK_URL = "https://storage.360buyimg.com/jsresource/jcap/version/v2.7.1/0/jcap_74nnyw.js";

    function isScriptLoaded(url) {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src === url) {
                return true;
            }
        }
        return false;
    }

    function loadScript(url, onLoad, onError) {
        if (isScriptLoaded(url)) {
            if (typeof onLoad === "function") {
                onLoad();
            }
            return;
        }

        var script = document.createElement("script");
        script.src = url;
        script.charset = "utf-8";
        
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    if (typeof onLoad === "function") {
                        onLoad();
                    }
                }
            };
        } else {
            script.onload = onLoad;
        }

        script.onerror = onError || function () {
            console.error("Failed to load script:", url);
        };

        document.getElementsByTagName("head")[0].appendChild(script);
    }

    function loadScripts() {
        if (isWebAssemblySupported()) {
            loadScript(MAIN_URL, handleScriptLoad);
        } else {
            loadScript(BACK_URL, handleScriptLoad);
        }
    }

    function handleScriptLoad() {
        isLoaded = true;
        JdCaptcha = window.jdCAP ? window.jdCAP.captcha(info) : captcha(info);
        while (pubFn.length > 0) {
            var callback = pubFn.shift();
            if (typeof callback === "function") {
                callback();
            }
        }
    }
    if (document.readyState === "complete" || document.readyState === "interactive") {
        loadScripts();
    } else {
        document.addEventListener("DOMContentLoaded", loadScripts);
    }

    function createCaptchaInstance(option, callback) {
        if (typeof callback !== "function" || typeof JdCaptcha !== "function") {
            console.error("Invalid callback or JdCaptcha");
            return;
        }
        var promise = JdCaptcha(option);
        if (promise && typeof promise.then === "function") {
            promise.then(function (captchaIns) {
                callback(captchaIns);
            }).catch(function (error) {
                console.error("Captcha initialization failed:", error);
            });
        } else {
            callback(promise);
        }
    }
    return function (option, callback) {
        if (isLoaded) {
            createCaptchaInstance(option, callback);
        } else {
            pubFn.push(function () {
                createCaptchaInstance(option, callback);
            });
        }
    };
})();

var captchaLoadJS = function (option, callback) {
    jcapLoadCreate(option, callback);
};

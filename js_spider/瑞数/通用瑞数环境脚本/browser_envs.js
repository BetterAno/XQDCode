/* 代理监控脚本 */
function get_environment(proxy_array) {
    for (var i = 0; i < proxy_array.length; i++) {
        var objName = proxy_array[i];
        try {
            // 如果变量未定义，则初始化为空对象
            if (typeof window[objName] === 'undefined') {
                window[objName] = {};
            }
            // 创建 Proxy handler
            var handler = {
                get: function (target, property, receiver) {
                    console.log("方法:", "get  ", "对象:", objName, "  属性:", property,
                        "  属性类型:", typeof property,
                        "  属性值类型:", typeof target[property]);
                    return target[property];
                },
                set: function (target, property, value, receiver) {
                    console.log("方法:", "set  ", "对象:", objName, "  属性:", property,
                        "  属性类型:", typeof property,
                        "  属性值类型:", typeof target[property]);
                    return Reflect.set(...arguments);
                }
            };
            // 应用代理
            window[objName] = new Proxy(window[objName], handler);
        } catch (e) {
            console.error(`Error proxying ${objName}:`, e);
        }
    }
}

proxy_array = ['window', 'document', 'location', 'navigator', 'history', 'screen']

var content = "arg1_content"

// ------------- 补环境开始  ------------
let is_logging = true

_log = console.log

function v_log() {
    if (is_logging) {
        _log(...arguments)
    }
}

// 去掉 Interval
!(function () {
    setInterval_ = setInterval;
    v_log("原函数已被重命名为setInterval_")
    setInterval = function (v1, v2) {
        v_log("--setInterval--", ...arguments)
        v1()
    }
    setInterval.toString = function () {
        v_log("有函数正在检测setInterval是否被hook");
        return setInterval_.toString();
    };
})();
// 去掉 Timeout
!(function () {
    setTimeout_ = setTimeout;
    v_log("原函数已被重命名为setTimeout_")
    setTimeout = function (v1, v2) {
        v_log("--setTimeout--", ...arguments)
        v1()
    }
    setTimeout.toString = function () {
        v_log("有函数正在检测setInterval是否被hook");
        return setTimeout.toString();
    };
})();
// 过掉toString检测
!(function () {
    "use strict";
    const $toString = Function.toString;
    const myFunction_toString_symbol = Symbol('('.concat('', ')_', (Math.random() + '').toString(36)));
    const mytoString = function () {
        return typeof this == 'function' && this[myFunction_toString_symbol] || $toString.call(this);
    };

    function set_native(func, key, value) {
        Object.defineProperty(func, key, {
            "enumerable": false,
            "configurable": true,
            "writable": true,
            "value": value
        })
    };
    delete Function.prototype['toString'];
    set_native(Function.prototype, "toString", mytoString);
    set_native(Function.prototype.toString, myFunction_toString_symbol, "function toString() { [native code] }");
    this.func_set_native = function (func) {
        set_native(func, myFunction_toString_symbol, `function ${myFunction_toString_symbol, func.name || ''}() { [native code] }`)
    }
}).call(this);

// Window = function Window(){};
// window = new Window();
// for(let name in global){
//     switch(name){
//         case "window":
//             continue;
//         case "global":
//             continue;
//     }
//     window[name] = global[name];
//     delete global[name];
// }
// Object.setPrototypeOf(global,window); // 设置原型链给global 设置window

function updateFunToString(callback, extName) {
    if (callback.name === 'webdriver') {
        Object.defineProperty(callback, 'name', {
            value: `get ${callback.name}`,
            configurable: true,
            writable: false,
            enumerable: false
        });
    }
    let toStr = `function ${callback.name}() { [native code] }`;
    if (callback.name && extName) {
        toStr = `function ${extName} ${callback.name}() { [native code] }`;
    } else if (extName) {
        toStr = `function ${extName}() { [native code] }`;
    }
    Object.defineProperty(callback, 'toStr', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: toStr
    });
    return callback;
}

const originToString = Function.prototype.toString;
Object.defineProperty(Function.prototype, 'toString', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: updateFunToString(function toString() {
        let toStr = this.toStr;
        console.log(toStr, 'toString_toStr', this.name)
        return toStr || Reflect.apply(originToString, this, arguments)
    })
});

Window = function () {
}
window = self = parent = top = global;
window.__proto__ = Window.prototype // "try{return (window instanceof Window);}catch(e){}"
delete global;
delete GLOBAL;
delete root;
delete __filename;
delete __dirname;
window.top = window;

var _null = function () {
    v_log("--arguments--", ...arguments)
};

window.outerHeight = 1080
window.outerWidth = 1920
window.Math = Math;
window.Date = Date;
window.parseInt = parseInt;
window.addEventListener = _null
window.attachEvent = undefined
HTMLFormElement = function () {
    this.init();
    return this.json;
}
window.HTMLFormElement = HTMLFormElement
window.openDatabase = function openDatabase(dbname, version, description, dbsize, dbcallback) {
    debugger;
    return {
        version: version
    }
};
window.chrome = {
    "app": {
        "isInstalled": false,
        "InstallState": {
            "DISABLED": "disabled",
            "INSTALLED": "installed",
            "NOT_INSTALLED": "not_installed"
        },
        "RunningState": {
            "CANNOT_RUN": "cannot_run",
            "READY_TO_RUN": "ready_to_run",
            "RUNNING": "running"
        }
    }
}
window.onbeforeunload = function _$8a(_$hM) {
    if (_$Sq) {
        _$IY(new _$Bd(_$BJ, {}, _$BS(_$hM[_$Mi(_$zu[41])])));
        _$CQ();
    }
}

window.ActiveXObject = undefined


div = {
    getElementsByTagName: function (arg) {
        _log(...arguments)
        if (arg === "i") {
            return {length: 0}
        }
    }
}
meta = {
    getAttribute: function (arg) {
        if (arg === "r") {
            return "m"
        }
    },
    parentNode: {
        removeChild: function () {
            _log("removeChild", ...arguments)
        }
    },
    content: content
}
getAttribute = function () {
    if (arguments[0] == 'r') {
        return 'm'
    }
}
script1 = {
    getAttribute: getAttribute,
    parentElement: {
        removeChild: function () {
            console.log('script1.parentElement.removeChild', arguments)
        }
    }
}
script2 = {
    getAttribute: getAttribute,
    parentElement: {
        removeChild: function () {
            console.log('script2.parentElement.removeChild', arguments)
        }
    }
}
script = [
    script1,
    script2,
]

// 后缀的位置
var elemA = {
    _href: '',
    set href(x) {
        console.log('set a href: ', x)
        if (!x.startsWith('http')) {
            if (x.startsWith('./')) {
                this._href = this.origin + '/' + x.replace('./', '')
            } else {
                this._href = this.origin + x
            }

        } else {
            this._href = x.replace(':443', '').replace(':80', '')
        }
    },
    get href() {
        console.log('get a href: ', this._href)
        return this._href
    },
    hostname: '', // webURL.split('://')[1]
    hash: '',
    origin: '', // webURL
    protocol: '', // webURL.split('//')[0]  http:
    pathname: "", // "/mall/service/query/QueryNavigations"
    port: '', // 80
    search: '', // ?mode=10
}

function getImageDate() {
    return 'function getImageData() { [native code] }'
}

CanvasRenderingContext2D = {
    canvas: {},
    direction: "ltr",
    fillStyle: "#000000",
    filter: "none",
    font: "10px sans-serif",
    fontKerning: "auto",
    fontStretch: "normal",
    fontVariantCaps: "normal",
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "low",
    letterSpacing: "0px",
    lineCap: "butt",
    lineDashOffset: 0,
    lineJoin: "miter",
    lineWidth: 1,
    miterLimit: 10,
    shadowBlur: 0,
    shadowColor: "rgba(0, 0, 0, 0)",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    strokeStyle: "#000000",
    textAlign: "start",
    textBaseline: "alphabetic",
    textRendering: "auto",
    wordSpacing: "0px",
    getImageDate: getImageDate
}

_ddd = {
    get: function () {
    }
}

_canvas = {
    getContext: function (arg) {
        if (arg === "2d") {
            return CanvasRenderingContext2D
        }

    },
    toDataURL: function () {
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAABGJJREFUeF7t1AEJAAAMAsHZv/RyPNwSyDncOQIECEQEFskpJgECBM5geQICBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAgQdWMQCX4yW9owAAAABJRU5ErkJggg=='
    },
}
window.canvas = _canvas

Navigator = function Navigator() {
}
Navigator.prototype = {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    webdriver: false,
    languages: ['en-GB', 'zh-CN', 'zh'],
    platform: "Win32",
    webkitPersistentStorage: {},

}
window.navigator = {};
window.navigator.__proto__ = Navigator.prototype

Location = function () {
}
Location.prototype = {
    "ancestorOrigins": {},
    "href": "https://www.szexgrp.com/jyfw/jsgc-view.html?id=jsgc",
    "origin": "https://www.szexgrp.com",
    "protocol": "http:",
    "host": "www.szexgrp.com",
    "hostname": "www.szexgrp.com",
    "port": "",
    "pathname": "/jyfw/jsgc-view.html",
    "search": "?id=jsgc",
    "hash": ""
}

window.location = new Location;


History = function History() {
}
History.prototype.back = function back() {
}
window.history = new History

Screen = function () {
}
Screen.prototype = {
    availWidth: 1920,
    availHeight: 1080,
    availLeft: 0,
    availTop: 0,
    height: 960,
    width: 1707
}
window.screen = new Screen

FengNewAll = function FengNewAll() {
}
const HTMLAllCollection = function HTMLAllCollection() {
};
HTMLAllCollection.name = "HTMLAllCollection";
HTMLAllCollection.length = 0;
HTMLAllCollection.prototype = Array.prototype;
HTMLAllCollection.prototype.constructor = HTMLAllCollection;
const myObject = {};
myObject.all = new FengNewAll();
Object.setPrototypeOf(myObject.all, HTMLAllCollection.prototype);
for (let i = 0; i < 5; i++) {
    myObject.all.push(i)
}

Document = function Document() {
}
Document.prototype = {
    getElementById: function getElementById() {
        _log(arguments)
    },
    createElement: function (a) {
        _log(arguments)
        if (a === "div") {
            return div
        }
        if (a === "a") {
            // console.log(elemA)
            // {
            // _href: '',
            // href: [Getter/Setter],
            // hostname: 'www.chinastock.com.cn',
            // hash: '',
            // origin: 'https://www.chinastock.com',
            // protocol: 'http:',
            // pathname: '/website2020/doc/queryDocList',
            // port: '',
            // search: '?pageSize=50&pageNo=1&dayLimit=9000&catName=yhgg_%E8%B0%83%E6%95%B4%E8%9E%8D%E8%B5%84%E8%9E%8D%E5%88%B8%E6%A0%87%E7%9A%84%E8%AF%81%E5%88%B8%E5%90%8D%E5%8D%95%E7%9A%84%E5%85%AC%E5%91%8A'
            // }
            // return  elemA
            return {}
        }
        if (a === "form") {
            return {}
        }
        if (a === "canvas") {
            return _canvas
        }
        if (a === "script") {
            return "<scripts></scripts>";
        }
    },
    getElementsByTagName: function (arg) {
        console.log("getElementsByTagName-->", arguments)
        if (arg === "script") {
            return script
        }
        if (arg === "meta") {
            return [meta, meta]
        }
        if (arg === "base") {
            return {}
        }

    },
    addEventListener: _null,
    appendChild: _null,
    removeChild: _null,
    documentElement: {},
    characterSet: 'UTF-8',
    charset: 'UTF-8'
}

Object.defineProperty(Document.prototype, "all", {
    get: function () {
        return myObject.all;
    },
    configurable: true,
    enumerable: true
})

window.document = new Document;
Object.setPrototypeOf(document, Document.prototype);
console.log("typeof document.all: ", typeof document.all);

window.localStorage = function () {
};
Storage = function () {
};
Storage.prototype.getItem = function getItem(key) {
};
Storage.prototype.setItem = function setItem(key, value) {
};


var XMLHttpRequest = function () {
    console.log("--XMLHttpRequest--", ...arguments)
}
window.open = function () {
    console.log("--window.open--", ...arguments)
}
let xhr_proto = {
    open: function (v1, v2, v3) {
        // req_param = v2.split("?")[1]
        // return void 0
        return arguments
    },
    send: function () {
        return void 0
    }
}
Object.setPrototypeOf(XMLHttpRequest, xhr_proto)
XMLHttpRequest.prototype = xhr_proto
window.XMLHttpRequest = XMLHttpRequest

window.location = location

get_environment(proxy_array);

"arg2_js";
"ts_code";

function get_cookie() {
    return document.cookie;
}
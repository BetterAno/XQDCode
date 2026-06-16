/* 代理脚本 */
function get_envs(proxy_array) {
    for (let i = 0; i < proxy_array.length; i++) {
        handler = `{
            get: function(target, property, receiver) {
                   var val = target[property];
                   if (val === undefined && typeof property !== 'symbol') {
                       console.log('[MISS] ${proxy_array[i]}.' + String(property));
                   }
                   return val;
            },
            set: function(target, property, value, receiver){
                    if ('${proxy_array[i]}' === 'document' && property === 'cookie') {
                        console.log('[COOKIE_SET]', value);
                    }
                    return Reflect.set(...arguments);
            }
        }`;
        eval(`
            try {
                ${proxy_array[i]};
                ${proxy_array[i]} = new Proxy(${proxy_array[i]}, ${handler});
            } catch (e) {
                ${proxy_array[i]} = {};
                ${proxy_array[i]} = new Proxy(${proxy_array[i]}, ${handler});
            }
        `);
    }
}

/* 浏览器环境补充 */
window = globalThis;
window.top = window;
window.self = window;
window.window = window;
window.execScript = function (s) {
    return eval(s);
};
window.addEventListener = function () {
};
window.attachEvent = function () {
};
window.name = '';
window.localStorage = {
    getItem: function () {
        return null;
    }, setItem: function () {
    }, removeItem: function () {
    }, clear: function () {
    }, length: 0
};
window.sessionStorage = {
    getItem: function () {
        return null;
    }, setItem: function () {
    }, removeItem: function () {
    }, clear: function () {
    }, length: 0
};
window.globalStorage = {};
window.indexedDB = undefined;
window.mozIndexedDB = undefined;
window.webkitIndexedDB = undefined;
window.msIndexedDB = undefined;
window.CollectGarbage = function () {
};
window.DOMParser = function () {
    this.parseFromString = function () {
        return _makeEl('html');
    };
};
window.ActiveXObject = undefined;
window.msCrypto = undefined;
window.setInterval = function () {
}
window.setInterval = function () {
}
window.XMLHttpRequest = function () {
    return {
        open: function () {
        },
        send: function () {
        },
        setRequestHeader: function () {
        },
        getResponseHeader: function () {
            return null;
        },
        getAllResponseHeaders: function () {
            return '';
        },
        readyState: 4,
        status: 200,
        statusText: 'OK',
        responseText: '',
        responseXML: null,
        onreadystatechange: null,
        abort: function () {
        }
    };
};

location = {
    "ancestorOrigins": {},
    "href": "https://www.ouyeel.com/steel/search?pageIndex=1&pageSize=50&productType=",
    "origin": "https://www.ouyeel.com",
    "protocol": "https:",
    "host": "www.ouyeel.com",
    "hostname": "www.ouyeel.com",
    "port": "",
    "pathname": "/steel/search",
    "search": "?pageIndex=1&pageSize=50&productType=",
    "hash": ""
}

// DOM 元素工厂
function _makeEl(tag) {
    var el = {};
    el.tagName = tag.toUpperCase();
    el.children = [];
    el.childNodes = [];
    el.innerHTML = '';
    el.innerText = '';
    el.outerHTML = '';
    el.style = {};
    el.getAttribute = function () {
        return null;
    };
    el.setAttribute = function () {
    };
    el.removeAttribute = function () {
    };
    el.appendChild = function (c) {
        this.children.push(c);
        return c;
    };
    el.removeChild = function (c) {
        return c;
    };
    el.addEventListener = function () {
    };
    el.removeEventListener = function () {
    };
    el.getElementsByTagName = function () {
        return [];
    };
    el.getElementsByClassName = function () {
        return [];
    };
    el.querySelector = function () {
        return null;
    };
    el.querySelectorAll = function () {
        return [];
    };
    el.hasChildNodes = function () {
        return false;
    };
    el.cloneNode = function () {
        return _makeEl(tag);
    };
    el.dispatchEvent = function () {
        return true;
    };
    return el;
}

document = {
    createElement: function (tag) {
        return _makeEl(tag);
    },
    createElementNS: function (ns, tag) {
        return _makeEl(tag);
    },
    appendChild: function (c) {
        return c;
    },
    removeChild: function (c) {
        return c;
    },
    addEventListener: function () {
    },
    removeEventListener: function () {
    },
    getElementById: function () {
        return _makeEl('div');
    },
    getElementsByTagName: function (tag) {
        if (tag && tag.toLowerCase() === 'script') return [_makeEl('script')];
        return [_makeEl(tag || 'div')];
    },
    getElementsByClassName: function () {
        return [_makeEl('div')];
    },
    querySelector: function () {
        return _makeEl('div');
    },
    querySelectorAll: function () {
        return [_makeEl('div')];
    },
    dispatchEvent: function () {
        return true;
    },
    createEvent: function () {
        return {
            initEvent: function () {
            }
        };
    },
    createComment: function () {
        return {};
    },
    head: _makeEl('head'),
    body: _makeEl('body'),
    documentElement: _makeEl('html'),
    charset: 'UTF-8',
    characterSet: 'UTF-8',
    readyState: 'complete',
    referrer: '',
    title: '',
    domain: 'www.ouyeel.com',
    URL: 'https://www.ouyeel.com/steel/search?pageIndex=1&pageSize=50&productType=',
    cookie: ''
};

/* 代理监听 */
get_envs(['window', 'document', 'location', 'navigator', 'screen'])
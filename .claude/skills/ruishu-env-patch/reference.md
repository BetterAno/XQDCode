# 瑞数环境补全完整参考

## 完整可用的 browser_envs.js 模板

以下是在 ouzhi/ouyeel 站点上验证通过的完整代码：

```js
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
window.execScript = function(s) { return eval(s); };
window.addEventListener = function() {};
window.attachEvent = function() {};
window.name = '';
window.localStorage = { getItem: function() { return null; }, setItem: function() {}, removeItem: function() {}, clear: function() {}, length: 0 };
window.sessionStorage = { getItem: function() { return null; }, setItem: function() {}, removeItem: function() {}, clear: function() {}, length: 0 };
window.globalStorage = {};
window.indexedDB = undefined;
window.mozIndexedDB = undefined;
window.webkitIndexedDB = undefined;
window.msIndexedDB = undefined;
window.CollectGarbage = function() {};
window.DOMParser = function() { this.parseFromString = function() { return _makeEl('html'); }; };
window.ActiveXObject = undefined;
window.msCrypto = undefined;
window.XMLHttpRequest = function() {
    return {
        open: function() {},
        send: function() {},
        setRequestHeader: function() {},
        getResponseHeader: function() { return null; },
        getAllResponseHeaders: function() { return ''; },
        readyState: 4,
        status: 200,
        statusText: 'OK',
        responseText: '',
        responseXML: null,
        onreadystatechange: null,
        abort: function() {}
    };
};

location = {
    "ancestorOrigins": {},
    "href": "https://www.example.com/path?query=",
    "origin": "https://www.example.com",
    "protocol": "https:",
    "host": "www.example.com",
    "hostname": "www.example.com",
    "port": "",
    "pathname": "/path",
    "search": "?query=",
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
    el.getAttribute = function() { return null; };
    el.setAttribute = function() {};
    el.removeAttribute = function() {};
    el.appendChild = function(c) { this.children.push(c); return c; };
    el.removeChild = function(c) { return c; };
    el.addEventListener = function() {};
    el.removeEventListener = function() {};
    el.getElementsByTagName = function() { return []; };
    el.getElementsByClassName = function() { return []; };
    el.querySelector = function() { return null; };
    el.querySelectorAll = function() { return []; };
    el.hasChildNodes = function() { return false; };
    el.cloneNode = function() { return _makeEl(tag); };
    el.dispatchEvent = function() { return true; };
    return el;
}

document = {
    createElement: function(tag) { return _makeEl(tag); },
    createElementNS: function(ns, tag) { return _makeEl(tag); },
    appendChild: function(c) { return c; },
    removeChild: function(c) { return c; },
    addEventListener: function() {},
    removeEventListener: function() {},
    getElementById: function() { return _makeEl('div'); },
    getElementsByTagName: function(tag) {
        if (tag && tag.toLowerCase() === 'script') return [_makeEl('script')];
        return [_makeEl(tag || 'div')];
    },
    getElementsByClassName: function() { return [_makeEl('div')]; },
    querySelector: function() { return _makeEl('div'); },
    querySelectorAll: function() { return [_makeEl('div')]; },
    dispatchEvent: function() { return true; },
    createEvent: function() { return { initEvent: function() {} }; },
    createComment: function() { return {}; },
    head: _makeEl('head'),
    body: _makeEl('body'),
    documentElement: _makeEl('html'),
    charset: 'UTF-8',
    characterSet: 'UTF-8',
    readyState: 'complete',
    referrer: '',
    title: '',
    domain: 'www.example.com',
    URL: 'https://www.example.com/path?query=',
    cookie: ''
};

/* 代理监听 */
get_envs(['window', 'document', 'location', 'navigator', 'screen'])
```

## 逐轮补环境真实案例日志

以下是在 ouzhi 站点上逐轮补环境的真实过程，可作为新站点补环境的参考路径：

### 第1轮：初始运行

```
[MISS] window.$_ts
[MISS] window.execScript
[MISS] window.top
ERR: Cannot read properties of undefined (reading 'location')
```

**操作**：补 `window.top = window; window.self = window; window.execScript = eval`

### 第2轮：DOM缺失

```
[MISS] window.$_ts
[MISS] document.createElement
[MISS] document.appendChild
[MISS] document.removeChild
(进程卡死)
```

**操作**：添加 `_makeEl` 工厂函数 + document对象

### 第3轮：特征检测

```
[MISS] window.CollectGarbage / DOMParser / ActiveXObject / localStorage / sessionStorage / indexedDB / ...
ERR: _$jr[_$gZ[4]] is not a function
```

**操作**：批量补充特征检测API(localStorage/sessionStorage/indexedDB/DOMParser/XHR等)

### 第4轮：DOM查询返回空

```
ERR: Cannot read properties of undefined (reading 'getAttribute')
```

**操作**：将 `getElementById` 从 `return null` 改为 `return _makeEl('div')`，`getElementsByTagName` 从 `return []` 改为返回mock元素数组

### 第5轮：成功

```
[COOKIE_SET] enable_T0k1m0u5AfRE=true; Secure
[COOKIE_SET] T0k1m0u5AfREP=hBeMoWtQfKHR...
cookie: T0k1m0u5AfREP=hBeMoWtQfKHR...
```

## 调试技巧

### 1. 代理只打印缺失和cookie写入

代理handler只做两件事，避免日志爆炸：
- get: 仅在值为 undefined 时打印 `[MISS]`
- set: 仅在 document.cookie 写入时打印 `[COOKIE_SET]`

### 2. 全局错误捕获

遇到报错就用一行命令快速测试：

```bash
node -e "process.on('uncaughtException',e=>{console.log('ERR:',e.message);});require('./browser_envs');require('./encrypt_js_code');require('./decrypt_js_code');console.log('cookie:',document.cookie);"
```

### 3. 进程卡死的处理

如果执行后无输出且进程不退出，说明缺环境导致无限循环/重试。此时需要：
1. `taskkill /F /IM node.exe` 杀进程
2. 根据最后一轮 `[MISS]` 日志补环境
3. 重新运行

### 4. Cookie命名规律

瑞数cookie通常命名为 `T0k...` 或类似hash前缀。

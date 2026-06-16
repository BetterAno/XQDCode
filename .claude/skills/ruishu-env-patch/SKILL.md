---
name: ruishu-env-patch
description: 瑞数Cookie加密JS的浏览器环境渐进式补全。通过代理日志驱动，从基础环境开始逐步补充window/document/navigator/location等浏览器对象及DOM方法，直到成功输出有效cookie值。当用户提供瑞数相关加密文件(encrypt_js_code.js/decrypt_js_code.js/main.js)需要补环境执行时使用。
---

# 瑞数浏览器环境补全

## 核心工作流程

遵循**逐轮迭代、日志驱动**：运行 → 看[MISS]/报错 → 补上缺失 → 重复直到出cookie。

```
Task Progress:
- [ ] Step 1: 确认文件结构(main.js, browser_envs.js等)
- [ ] Step 2: 搭建基础环境(window, top, self)
- [ ] Step 3: 补充location对象
- [ ] Step 4: 补充document对象和DOM工厂
- [ ] Step 5: 补充特征检测API(存储、索引DB、加密等)
- [ ] Step 6: 补充XHR和定时器
- [ ] Step 7: 验证cookie输出
```

## Step 1: 确认文件结构

读取目标目录，确认至少有以下文件：
- `main.js` — 入口，require(browser_envs) → require(encrypt) → require(decrypt)
- `encrypt_js_code.js` — 设置 `$_ts.nsd` 和 `$_ts.cd`
- `decrypt_js_code.js` — 瑞数解密主代码(IIFE + 数据数组)
- `browser_envs.js` — 环境补充脚本(如不存在则创建)

## Step 2: 搭建基础环境

在 `browser_envs.js` 中先必须设置：

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
            try { ${proxy_array[i]}; ${proxy_array[i]} = new Proxy(${proxy_array[i]}, ${handler}); }
            catch (e) { ${proxy_array[i]} = {}; ${proxy_array[i]} = new Proxy(${proxy_array[i]}, ${handler}); }
        `);
    }
}

/* 浏览器环境补充 */
window = globalThis;
window.top = window;
window.self = window;
window.window = window;
window.execScript = function(s) { return eval(s); };
```

## Step 3: 补充location对象

必须包含完整URL信息。**注意**：location的URL必须与目标站点一致，否则服务器校验不通过。

```js
location = {
    "ancestorOrigins": {},
    "href": "<目标站点的完整URL>",
    "origin": "<https://域名>",
    "protocol": "https:",
    "host": "<域名>",
    "hostname": "<域名>",
    "port": "",
    "pathname": "<路径>",
    "search": "<查询参数>",
    "hash": ""
}
```

## Step 4: 补充document对象和DOM工厂

**关键原则**：所有DOM查询方法不得返回 null 或空数组，否则代码访问 `[0].getAttribute()` 时报 `Cannot read properties of undefined`。

### DOM元素工厂

```js
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
    el.querySelector = function() { return _makeEl('div'); };
    el.querySelectorAll = function() { return []; };
    el.hasChildNodes = function() { return false; };
    el.cloneNode = function() { return _makeEl(tag); };
    el.dispatchEvent = function() { return true; };
    return el;
}
```

### document对象

```js
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
    domain: '<域名>',
    URL: '<完整URL>',
    cookie: ''
};
```

## Step 5: 补充特征检测API

瑞数会检测大量浏览器特征，以下为常见需要补充的window属性。每个属性设为 undefined 或空 stub 均可(除特别说明)：

```js
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
```

## Step 6: 补充XHR和定时器

```js
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
```

## Step 7: 代理监听与验证

在环境补充代码最后添加代理：

```js
get_envs(['window', 'document', 'location', 'navigator', 'screen'])
```

main.js 结构：

```js
require('./browser_envs')
require('./encrypt_js_code')
require('./decrypt_js_code')

function get_cookie() {
    return document.cookie
}

console.log(get_cookie());
```

运行 `node main.js`。

### 成功标志

日志中出现 `[COOKIE_SET] T0k...` 即表示cookie生成成功。

```bash
cd <目标目录>
node main.js
```

### 失败处理

如果执行报错或无cookie输出：
1. 查看 `[MISS]` 日志找到未定义的属性
2. 查看错误信息定位缺失对象/方法
3. 根据报错逐项补充
4. 重新运行直到出cookie

**常见错误与对策**：

| 错误 | 原因 | 解决 |
|------|------|------|
| `Cannot read properties of undefined (reading 'location')` | `window.top` 未定义 | `window.top = window` |
| 进程卡死无响应 | DOM方法返回空数组/null导致无限重试 | DOM方法返回mock元素 |
| `Cannot read properties of undefined (reading 'getAttribute')` | `getElementsByTagName`返回空数组 | 返回包含mock元素的数组 |
| `Maximum call stack size exceeded` | DOM工厂递归引用 | 检查style等属性的初始化 |

## 附加资源

- 完整的瑞数环境补全示例见 [reference.md](reference.md)

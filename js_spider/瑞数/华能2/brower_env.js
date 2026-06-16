// delete __dirname;
// delete __filename;
// delete exports
// delete global

// 代理器封装
function get_enviroment(proxy_array) {
    for (var i = 0; i < proxy_array.length; i++) {
        handler = '{\n' +
            '    get: function(target, property, receiver) {\n' +
            '        console.log("方法:", "get  ", "对象:", ' +
            '"' + proxy_array[i] + '" ,' +
            '"  属性:", property, ' +
            '"  属性类型:", ' + 'typeof property, ' +
            // '"  属性值:", ' + 'target[property], ' +
            '"  属性值类型:", typeof target[property]);\n' +
            'if (typeof target[property] == "undefined"){debugger}' +
            '        return target[property];\n' +
            '    },\n' +
            '    set: function(target, property, value, receiver) {\n' +
            '        console.log("方法:", "set  ", "对象:", ' +
            '"' + proxy_array[i] + '" ,' +
            '"  属性:", property, ' +
            '"  属性类型:", ' + 'typeof property, ' +
            // '"  属性值:", ' + 'target[property], ' +
            '"  属性值类型:", typeof target[property]);\n' +
            '        return Reflect.set(...arguments);\n' +
            '    }\n' +
            '}'
        eval('try{\n' + proxy_array[i] + ';\n'
            + proxy_array[i] + '=new Proxy(' + proxy_array[i] + ', ' + handler + ')}catch (e) {\n' + proxy_array[i] + '={};\n'
            + proxy_array[i] + '=new Proxy(' + proxy_array[i] + ', ' + handler + ')}')
    }
}


/* 补环境 */
window = globalThis;
// Window = function () {}
// WindowProperties = function () {}
EventTarget = function () {
}
// Object.setPrototypeOf(Window.prototype, WindowProperties.prototype);
// Object.setPrototypeOf(WindowProperties.prototype, EventTarget.prototype);
self = top = window
window.addEventListener = function (args) {
    console.log('addEventListener添加的监听器:', args)
}
setTimeout = function () {
}
setInterval = function () {
}
window.ActiveXObject = undefined

HTMLDocument = function () {
}
Document = function () {
}
Node = function () {
}
Object.setPrototypeOf(HTMLDocument.prototype, Document.prototype);
Object.setPrototypeOf(Document.prototype, Node.prototype);
Object.setPrototypeOf(Node.prototype, EventTarget.prototype);
document = new HTMLDocument()
// document = function(){}
// Object.setPrototypeOf(document, HTMLDocument.prototype);

div = {
    getElementsByTagName: function (name) {
        console.log('div的getElementsByTagName获取的标签:', name)
        if (name === 'i') {
            return []
        }
    }
}
script = {
    getAttribute: function (attr) {
        console.log('script的getAttribute获取的属性:', attr)
        if (attr === 'r') {
            return 'm'
        }
    },
    parentElement: {
        removeChild: function (child) {
            console.log('script的parentElement的removeChild移除的标签:', child)
        }
    }
}
meta = {
    getAttribute: function (attr) {
        console.log('meta的getAttribute获取的属性:', attr)
        if (attr === 'r') {
            return 'm'
        }
    },
    parentNode: {
        removeChild: function (child) {
            console.log('meta的parentNode的removeChild移除的标签:', child)
        },
    },
    content: 'oxwZ_dZx5MPtiJjmbVkXU6yt1hIzZFkeegJ_HMzPYhR18ZagQuxsW4KF3SfFku3PGOiPTRF4acEk8MORZR41vHl2caoufM_4'
}
base = []


Document.prototype.createElement = function (tag_name) {
    console.log('createElement创建的标签:', tag_name)
    if (tag_name === 'div') {
        return div
    }
}
Document.prototype.getElementsByTagName = function (tag_name) {
    console.log('document的getElementsByTagName获取的标签:', tag_name)
    if (tag_name === 'script') {
        return [script, script]
    }
    if (tag_name === 'meta') {
        return [meta, meta]
    }
    if (tag_name === 'base') {
        return base
    }
}
Document.prototype.getElementById = function (tag_name) {
    console.log('document的getElementById获取的标签:', tag_name)
}
Node.prototype.appendChild = function (child) {
    console.log('appendChild添加的标签:', child)
}
Node.prototype.removeChild = function (child) {
    console.log('removeChild移除的标签:', child)
}

location = {
    "ancestorOrigins": {},
    "href": "https://ec.chng.com.cn/channel/home/?SlJfApAfmEBp=1764850494618#/purchase?checked=3",
    "origin": "https://ec.chng.com.cn",
    "protocol": "https:",
    "host": "ec.chng.com.cn",
    "hostname": "ec.chng.com.cn",
    "port": "",
    "pathname": "/channel/home/",
    "search": "?SlJfApAfmEBp=1764850494618",
    "hash": "#/purchase?checked=3"
}

navigator = {
    "userAgent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
}

get_enviroment(['window', 'document', 'location', 'navigator', 'history', 'screen',
    'div', 'document.createElement', 'div.getElementsByTagName',
    'script', 'document.getElementsByTagName', 'script.getAttribute', 'script.parentElement',
    'meta', 'meta.getAttribute', 'head', 'meta.parentNode',
    'base',
])


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
self = top = window
window.addEventListener = function (event_name, callback) {
    console.log('window addEventListener监听的事件:', event_name)
}
setTimeout = function () {
}
setInterval = function () {
}
window.ActiveXObject = undefined

div = {
    getElementsByTagName: function (tag_name) {
        console.log('div getElementsByTagName获取的标签:', tag_name)
        if (tag_name === 'i') {
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
base = []


HTMLDocument = function () {
}
Document = function () {
}
Node = function () {
}
EventTarget = function () {
}
Object.setPrototypeOf(HTMLDocument.prototype, Document.prototype);
Object.setPrototypeOf(Document.prototype, Node.prototype);
Object.setPrototypeOf(Node.prototype, EventTarget.prototype);
document = function () {
}
Object.setPrototypeOf(document, HTMLDocument.prototype);

Document.prototype.createElement = function (tag_name) {
    console.log('document createElement创建的标签:', tag_name)
    if (tag_name === 'div') {
        return div
    }
    if (tag_name === 'a'){
        return {}
    }
}
Document.prototype.getElementsByTagName = function (tag_name) {
    console.log('document getElementsByTagName获取的标签:', tag_name)
    if (tag_name === 'script') {
        return [script, script]
    }
    if (tag_name === 'base') {
        return base
    }
}
Document.prototype.getElementById = function (tag_name) {
    console.log('document getElementById获取的标签:', tag_name)
}
EventTarget.prototype.addEventListener = function (event_name, callback) {
    console.log('EventTarget addEventListener监听的事件:', event_name)
}

location = {
    "ancestorOrigins": {},
    "href": "http://epub.cnipa.gov.cn/",
    "origin": "http://epub.cnipa.gov.cn",
    "protocol": "http:",
    "host": "epub.cnipa.gov.cn",
    "hostname": "epub.cnipa.gov.cn",
    "port": "",
    "pathname": "/",
    "search": "",
    "hash": ""
}

navigator = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

get_enviroment([
    'window', 'document', 'navigator', 'location',
    'div',
    'script', 'script.parentElement',
])
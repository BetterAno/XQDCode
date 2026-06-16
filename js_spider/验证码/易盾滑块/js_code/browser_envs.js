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
setTimeout = function () {
}
setInterval = function () {
}

div = {
    getAttribute: function (attr) {
        console.log('div的getAttribute获取的属性:', attr)
    },
}

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
document = new HTMLDocument();

Document.prototype.createElement = function (tag_name) {
    console.log('document createElement创建的标签:', tag_name)
    if (tag_name === 'div') {
        return div
    }
}
Document.prototype.getElementById = function (Id) {
    console.log("document getElementById 获取的id为:", Id);
}

location = {
    "ancestorOrigins": {},
    "href": "https://dun.163.com/trial/picture-click",
    "origin": "https://dun.163.com",
    "protocol": "https:",
    "host": "dun.163.com",
    "hostname": "dun.163.com",
    "port": "",
    "pathname": "/trial/picture-click",
    "search": "",
    "hash": ""
}

navigator = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

// get_enviroment(['window', 'document', 'location', 'navigator', 'history', 'screen',
//         'div', 'div.getAttribute'
// ])
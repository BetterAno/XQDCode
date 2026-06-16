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

proxy_array = ['window', 'document', 'location', 'navigator', 'history', 'screen']

/* 补环境 */
window = globalThis;

HTMLDocument = function () {
}
Document = function () {
}
Node = function () {
}
EventTarget = function () {
}
Object.setPrototypeOf(HTMLDocument.prototype, Document.prototype)
Object.setPrototypeOf(Document.prototype, Node.prototype)
Object.setPrototypeOf(Node.prototype, EventTarget.prototype)
// document = new HTMLDocument()
document = {}
Object.setPrototypeOf(document, HTMLDocument.prototype)

HTMLAllCollection = function () {
}
Document.prototype.all = new HTMLAllCollection()
Document.prototype.documentElement = {}
Document.prototype.createElement = function (Tag_name) {
    console.log('createElement创建的标签:', Tag_name)
    return {}
}
Document.prototype.createEvent = function () {
}

/* location navigator screen */
navigator = {
    platform: 'MacIntel',
    hardwareConcurrency: 4,
    cookieEnabled: true,
    language: "zh-CN",
    languages: ['zh-CN', 'zh'],
    webdriver: false,
    vendor: "Google Inc.",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    appCodeName: "Mozilla",
    appName: "Netscape",
    // appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
}


get_enviroment(proxy_array)


XMLHttpRequest = function () {
}
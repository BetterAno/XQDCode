function get_envs(proxy_array) {
    for (let i = 0; i < proxy_array.length; i++) {
        handler = `{
            get: function(target, property, receiver) {
                   console.log('方法：get','    对象：${proxy_array[i]}','    属性：',property,'    属性类型：',typeof property,'    属性值类型：',typeof target[property]);
                   return target[property];
            },
            set: function(target, property, value, receiver){
                    console.log('方法：set','    对象：${proxy_array[i]}','    属性：',property,'    属性类型：',typeof property,'    属性值类型：',typeof target[property]);
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

/* EventTarget补环境 */
EventTarget = function () {
}
EventTarget.prototype.addEventListener = function (type, listener) {
}

/* window 补环境 */
Window = function () {
}
Window.prototype.location = {
    "ancestorOrigins": {},
    "href": "https://q.10jqka.com.cn/",
    "origin": "https://q.10jqka.com.cn",
    "protocol": "https:",
    "host": "q.10jqka.com.cn",
    "hostname": "q.10jqka.com.cn",
    "port": "",
    "pathname": "/",
    "search": "",
    "hash": ""
}
Window.prototype.localStorage = {
    getItem(key) {}
}
Object.setPrototypeOf(Window.prototype, EventTarget.prototype)
window = new Window();

/* navigator 补环境 (可选) */
// Navigator = function () {}
// Navigator.prototype.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36'
// navigator = new Navigator()
// navigator.javaEnabled = function () {
//     return false;
// }

/* document 补环境 */
HTMLDocument = function () {
}
Document = function () {
}
Document.prototype.head = {}
Document.prototype.createElement = function (tagName) {
    console.log(`createElement方法创建了${tagName}标签...`)
    return {};
}
Node = function () {
}
Object.setPrototypeOf(HTMLDocument.prototype, Document.prototype)
Object.setPrototypeOf(Document.prototype, Node.prototype)
Object.setPrototypeOf(Node.prototype, EventTarget.prototype)
document = new HTMLDocument();

proxy_array = ['window', 'document', 'location', 'navigator', 'history', 'screen']
get_envs(proxy_array);
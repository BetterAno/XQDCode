window = global;
self = top = window;

window.ActiveXObject = undefined;  // 补环境的巨大的坑点, 有检测
window.addEventListener = function () {
}

// 标签
div = {
    getElementsByTagName(tag_name) {
        console.log("div getElementsByTagName 获取的标签为:", tag_name);
        if (tag_name === 'i') {
            return []
        }
    }
}
head = {
    removeChild(node) {
        console.log("head removeChild 删除的节点为:", node);
    }
}
script = {
    getAttribute(node) {
        console.log("script getAttribute 获取的属性为:", node);
        if (node === 'r') {
            return 'm'
        }
    },
    parentElement: head
}

// document
document = {
    createElement(tag_name) {
        console.log(`document createElement 方法创建的标签为: ${tag_name}`);
        if (tag_name === 'div') {
            return div;
        }
        if (tag_name === 'form') {
            return []
        }
    },
    getElementsByTagName(tag_name) {
        console.log("document getElementsByTagName 获取的标签为:", tag_name);
        if (tag_name === 'script') {
            return [script]
        }
        if (tag_name === 'base') {
            return []
        }
        if (tag_name === 'input') {
            return []
        }
    },
    getElementById(id) {
        console.log("document getElementById 获取的id为:", id);
    },
    documentElement: {},
    addEventListener: function () {},
    removeChild(node) {
        console.log("document removeChild 删除的节点为:", node);
    }
}

// location
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

// navigator
navigator = {}

// 定时器
setTimeout = function () {}
setInterval = function () {}


/* 源码区域 */
'encrypt_js_code';
'decrypt_js_run_code';

function get_cookie() {
    return document.cookie;
}
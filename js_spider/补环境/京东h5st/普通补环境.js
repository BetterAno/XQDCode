crypto = require('crypto');
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

proxy_array = ['window', 'document', 'location', 'navigator', 'history', 'screen', 'Element']

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

document = {}
document = new HTMLDocument()
document.querySelector = function () {
        console.log('querySelector获取的参数:', arguments)
}
// Object.setPrototypeOf(document, HTMLDocument.prototype)

HTMLAllCollection = function () {
}
Document.prototype.all = new HTMLAllCollection()
Document.prototype.documentElement = {}
Document.prototype.createElement = function (Tag_name) {
    console.log('createElement创建的标签:', Tag_name)
    if (Tag_name === 'script'){
        return {}
    }
}
Document.prototype.createEvent = function () {
}
Document.prototype.getElementsByTagName = function (name) {
    console.log('getElementsByTagName获取的标签:', name)
    if (name === 'head'){
        return []
    }
}

Element = function (){}
Object.setPrototypeOf(Element.prototype, Node.prototype)
console.log('Element:', Element)
// console.log(window.crypto)


localStorage = {
    "dra_union_device": "da3a345a-5432-443c-8af1-86c0c5392bd1",
    "JDst_rac_nfd": "{\"v\":10,\"t\":1764586841884,\"e\":31536000}",
    "hf_time": "1764596348106",
    "__we_m_gl__": "ZnAlM0E5YjQ1ZTZmOGM5OTU0MTk5MmNlN2EzNmRlZjA3NmQwZX52ZW5kb3IlM0FXZWJLaXR+dmVyc2lvbiUzQVdlYkdMJTIwMS4wJTIwKE9wZW5HTCUyMEVTJTIwMi4wJTIwQ2hyb21pdW0pfnVubWFza2VkJTIwdmVuZG9yJTNBR29vZ2xlJTIwSW5jLiUyMChJbnRlbCl+dW5tYXNrZWQlMjByZW5kZXJlciUzQUFOR0xFJTIwKEludGVsJTJDJTIwSW50ZWwoUiklMjBJcmlzKFIpJTIwWGUlMjBHcmFwaGljcyUyMCgweDAwMDA0NkE4KSUyMERpcmVjdDNEMTElMjB2c181XzAlMjBwc181XzAlMkMlMjBEM0QxMSk=",
    "modalCooling": "1764581940874",
    "WQ_gather_cv1": "{\"v\":\"c06fd393659321ee8f23eb11164ac02d\",\"t\":1764586836654,\"e\":31536000}",
    "loglevel": "SILENT",
    "3AB9D23F7A4B3CSS": "jdd03YNDW6Y7J3GFLL3QZWEPLLDHSQKNQYPHY5T3CVYPSA5PSVBJBMNC26YCKBREPFQO2VT6DIXVW5HEUSDYI4TK2OIJWR4AAAAM23FJDDWIAAAAADEORBIR7AK3AOYX",
    "3AB9D23F7A4B3C9B": "YNDW6Y7J3GFLL3QZWEPLLDHSQKNQYPHY5T3CVYPSA5PSVBJBMNC26YCKBREPFQO2VT6DIXVW5HEUSDYI4TK2OIJWR4",
    "CA1AN5BV0CA8DS2EPC": "0a935ac7a52197952d9e70a4b023bb1d",
    "__disp_m_gr__": "0",
    "WQ_dy1_vk": "{\"5.1\":{\"73806\":{\"e\":31536000,\"v\":\"iz9wxap3dahqqmj3\",\"t\":1744726276653},\"b5216\":{\"e\":31536000,\"v\":\"i3azpddgx3mh22m5\",\"t\":1744726276416}},\"5.2\":{\"73806\":{\"e\":31536000,\"v\":\"aat36i9mzqdpdp03\",\"t\":1756994320692},\"b5216\":{\"e\":31536000,\"v\":\"33giggz9zp3td069\",\"t\":1756994320481}}}",
    "viewedLiveIds": "35382630,35193172,34329734,34915402",
    "JDst_rac_last_update": "{\"v\":1764586836363}",
    "WQ_gather_wgl1": "{\"v\":\"635d057522a8736cc26d94b200e44627\",\"t\":1764586836655,\"e\":31536000}",
    "modalAdvert": "[{\"id\":\"9702165341\",\"expire\":1764664740874}]",
    "aria": "{\"runtime\":{\"appid\":\"bfeaebea192374ec1f220455f8d5f952\"},\"road\":\"https://static.360buyimg.com/item/assets/oldman/wza1/\"}",
    "__we_m_ft__": "QXJpYWwlMkNBcmlhbCUyMEJsYWNrJTJDQXJpYWwlMjBOYXJyb3clMkNBcmlhbCUyMFVuaWNvZGUlMjBNUyUyQ0Jvb2slMjBBbnRpcXVhJTJDQm9va21hbiUyME9sZCUyMFN0eWxlJTJDQ2FsaWJyaSUyQ0NhbWJyaWElMkNDYW1icmlhJTIwTWF0aCUyQ0NlbnR1cnklMkNDZW50dXJ5JTIwR290aGljJTJDQ2VudHVyeSUyMFNjaG9vbGJvb2slMkNDb21pYyUyMFNhbnMlMjBNUyUyQ0NvbnNvbGFzJTJDQ291cmllciUyQ0NvdXJpZXIlMjBOZXclMkNHYXJhbW9uZCUyQ0dlb3JnaWElMkNIZWx2ZXRpY2ElMkNMdWNpZGElMjBCcmlnaHQlMkNMdWNpZGElMjBDYWxsaWdyYXBoeSUyQ0x1Y2lkYSUyMENvbnNvbGUlMkNMdWNpZGElMjBGYXglMkNMdWNpZGElMjBIYW5kd3JpdGluZyUyQ0x1Y2lkYSUyMFNhbnMlMkNMdWNpZGElMjBTYW5zJTIwVHlwZXdyaXRlciUyQ0x1Y2lkYSUyMFNhbnMlMjBVbmljb2RlJTJDTWljcm9zb2Z0JTIwU2FucyUyMFNlcmlmJTJDTW9ub3R5cGUlMjBDb3JzaXZhJTJDTVMlMjBHb3RoaWMlMkNNUyUyMFBHb3RoaWMlMkNNUyUyMFJlZmVyZW5jZSUyMFNhbnMlMjBTZXJpZiUyQ01TJTIwU2FucyUyMFNlcmlmJTJDTVMlMjBTZXJpZiUyQ1BhbGF0aW5vJTIwTGlub3R5cGUlMkNTZWdvZSUyMFByaW50JTJDU2Vnb2UlMjBTY3JpcHQlMkNTZWdvZSUyMFVJJTJDU2Vnb2UlMjBVSSUyMExpZ2h0JTJDU2Vnb2UlMjBVSSUyMFNlbWlib2xkJTJDU2Vnb2UlMjBVSSUyMFN5bWJvbCUyQ1RhaG9tYSUyQ1RpbWVzJTJDVGltZXMlMjBOZXclMjBSb21hbiUyQ1RyZWJ1Y2hldCUyME1TJTJDVmVyZGFuYSUyQ1dpbmdkaW5ncyUyQ1dpbmdkaW5ncyUyMDIlMkNXaW5nZGluZ3MlMjAz",
    "__we_m_cv__": "Y2FudmFzJTIwd2luZGluZyUzQXllc35jYW52YXMlMjBmcCUzQTcwYTMxMjNkZDc3ZmI3NTQxNjA3MWQ3MTE2YTAxMGIy",
    "__we_m_ftk__": "MmRmYjZmOTgzZjExMTMwZWYxYTkyNmFmMjE0YzllMjg=",
    "__we_m_cf__": "{\"t\":1764582894825,\"v\":\"VjVWsffe3bR08C-YJTHCgVJMVNXePKoXqunavn3XpSu6yrWz2BBU_5tUTk_cQGdPMjjwwDuspUBvTstk28_PhAEIwVoZkT_zEAgvZMWIQGGgRhJUUWrEI3LhSpA5nhh7dYn66wn3SwFugy_MB5ABgwo1907PGCBoC0hh3YEGIdgEphiCekFHrCrgmOKkUzFbt4mn0A97Z8F-8xeqjzjaNviZ2bRZ12vXy2UjvFtVgNy487k94FZ9WcsN37q_xr2RRct54Dy_lsoFdOPOjFxtPvX8a_9tKDPejT8f1_wYBf8XAqfr_i5Fk8TQuWqrxDNfHxGs0ccpzINbt1IZmll5eOKPv5FWqLXh16u4GhKSB3PGydRgf8jLgdR4b0QA89c3oBz6nMXOkEyrtEkuTxUpC8bm6ztzt6BUb2yGrXei2vw6RW27-mukDJr9tmbPbkwa3TrryhpM8tiLd_9xEK9Tmsiy_wLguIx5OnoNqLjzH_EM08JxU2Aw92c-N-tF3clI9cVJiDAshghZXrKIFlEpzjI4oZGH6MrjtQY2j9hYdsMRaMNNXTPEpUT8pt-BiiP3lMW0vXyOa08-Nd8y9jL7Pq-JZ9PkLFoCQa4lb3FYBGOdqYM54DHGiEO-9LcaWwVniz4He9ARY_5z-dFC2G1SP1oLAEse0g4AQzk10g9xebKRsn6079rs2OpevingaW9fn5iTVS5HGInW0IjBfJuHm9h9-6VqIM1miZGhiPpV5kEvNImcPM4wIJKgmd0PSUDBk_TRQVps_Doj-V21y31jgEDZxJgtgpds2lOl19vPHIplYEGmQ6v2N6S0rLXhS2j8zuPqrmdI0d-JR61zOUFMmVgiGBWckjzPhhZ8DN5sLiomur8-ILk1KbOmXOcus05-X3yt3aWcc1t-6XDHV8cQuhujgSAWgRWhSVogMBQOZtyogB40W2pmEPC6KVeb2MyrGCxZJ1VIxMg4HDkbtLVr7tPpnk7iof4q6aTAJ3aFwDpoqUPggco2ywnHT_-HzWBilG5KdJyAbaxw9yGVAe7tLpaghCMuyOc5QRmvLWIY8GWvaaLwu4TV3-mYqpCOzhJhMAH9WnRWKE0pekEcgHeK9XHSn8oPNNA3yoVZO_FMtX4kg-NCMBOfMe9yYG7eE774YEH49vF1YtKpRQSRBJPjrX0o2qYnxsc3jiW2DQGt0xsW6Jpxr13nMiHhG1CmRj3H0FSXheTXCCd7IpBx1ScFs2cHe6a0DjE2a1-ddcY25oJJEHYF7_hdwFnDiS9hZrZ3t7e2Gdv_VsfZjm2w9lXuhFwi_ZcAPAdd3uOtpRDovCDvYBcA8nnUWJYwYmwN2Qw5mDMw-bYBgp1ixwbznZujsh8B2zlBG3_r_3Wqv8PRqQGxVNWqWe6FQBUC2dBR63JfPQDGfXTsFzXDXBfkfeM0A1juaP_Hn5ZJDACLrngcH42Fb6-wEalr904hc8FqjJ4rX0qD3LwyYc6OyjsXijBj5AjgJ2dFl_3_LGiv791EzWG5xNh2AQ68U4iaNblVuULMd5L6f6El5H7fLqn8PIYOXv5ihdRq4vLVUhhd1GpftmDKuqDdbJxPDfQ5qxFz6l7_R2MF0nAIeVZF-fpqBMeuJbL1_M0dtDRjNbmxTVuxnB_oZqL9Wq0AAMkxnSPEKlUk5VVSxMdcC8jpiJgV2ZKUvSyMocTU_5dKy8WTbu9qgMcn-ErT_YNjdSlmB8SxrDB7-s9pYqroxOq_jtqfgynNAIoK5f_w4UxWeUxjLJUk_vxJzlG-SF27l0-lBuus8pO0BHbZu0JASNaiw_o1zX6Pfz4t8cxt4syLaY3youx2jUENHuyQD20-79_SQLdfu9ctDFE4qmTs5o2yWtAzSUf3-8Mces5JUFeY3zdZ11cgmHPnda6QfGAod-mSyx0yuq4iCzqpF9hYEImsXH3b3X2szwoQZdCnX0iMlXlwoV9K5Z4NBpfwkc9ikvTi44GeEvkr-CSUzOGOROEbDt-14RZUTg_9cnVJEF2xTr3mxPp1iYV_Ze_TEq0Rvhq-_o_9BA0zhvqNX54ZRG_Xx8qM8Ae_8mx50V9wcDnAxvKW5-G-jEI6NSLKo7IvEcSTfwPbJCLDmRcqFw0gu2_yoMWEvQiGf0sba3sX07vT53WKhguD7BOBCyqZmnxGKiutw4Q_PauISCh3sEitQXM1YEVQ8FP42lhSdflLNDPgOSGtlxUfS4FL4s05WMEMPuOymC5zAE9eGPdJHwcbbxD7VtfX7kkVvgvv1VcRKc-fYpEHt3yhGI3mb7nDOzcUK5NLXQicinWKUL6pRx2xgvS9KMeAoBteSvBpbN4D0nAJ951e3dvf5ncZ3f1Aw9YwwcbPs8r1GIxmFzkKVBaNfjEN0QWhOWtPVsGqh98wSOc9vmqLMe43jH8YCDweWExJvoPj7AOngX7dwDpWs3jm5elFYkkLNCd02vPJn0dTyEHJhLk7SPHGKUORiN6eKULyjFaLytT-5xL6bcc7rPSM3ZzWa7b2OjIcH7wNTiuPA6lS54bgPx3qfqdZQVouWoIUScckCHyup0BRsBlLnw5d5xhtIiOMaOO5H5GpSyW_QuVuZkMT3rUr0l4_OAsC3lzJoPUIaqk41ApNH0hO-ubt_tlzyLP-efDT8J5lCcag2WUp5bTB--oigXIadkM-ASCQ-bXx4mX3Ns9F6nGeZmwaZgL71_MhpwpCNDpaAgN1mW3SuYy0UtdXQUzmM0gz7EmgFklW_lPNKK17gWPnfxRpgb5o15zCYZ2mrpoSqbaTcSrJhxYfG9pnFlLP4Nhjfy8WUzln6GI8EAQC-2igfKFQCpkxSACZtbX5wz1k54RoR-p3CJ-wfwZX3KfmeyuJ4XmnlYCRCxIUzUr6-cMg-kdH19L3CKvVeJp5736e25AOdshkiaJ8Vh8PPX20y5OUSBXuPzZkb37ZWvvBq5NA-unFguDpXztEk6zJ_VdQNbeEvaVXq5YT60Dc6l_y3sWdMobvsJH__UnYPXAJXUV09ENBRY73m3VpftmhOQ-rMjkAYAtfqxdHCWtIJ9Wsuk92wpvRDrcGaFAIveNJixUoH6d_3rjPB9qskKhi0PaJvxHzWsHVzqz5oxGuX41D7A02EohJ-I7rYElMuwpjWxb4C_Lt4TkTwhIBi7WCeS_me7g7Jz0auY_koKEoBwkDkKZ-sy5x1O1aBC0B2gm3XCe4Wx0rNZ-sJy9WOBVsULKKlCOvbQ1pZWIOT_TdKKNynRMFh4ygOt68qNnK9GC3QjGbNmSTSMvNHXK6iFecvAqWyxeBSpdYhn8WS1hJFSTm83OoZFZIPHBXGIMdcLzOTmUXAU2fM6zCI8yvS9lIK04uPJmR_yw_AjQI9oaaJbcAAkbbvJxihzytsMkwDg5G0340WrFL2QDs2oTzzJtRwKQYngBDra3GarpCiRnBGVes08Y8F3DeKNMiQJ_jXBu-a6-3FYP5t1O-4bidVwh42R8gTVc-rDfHbCqUVzWrNMF34WmEC5wtoc3o072AS39rhqjeFO4kRIOFW3RV7IH-u96dIZ-q6h4ROvzG1jUaMiyFi-bTxgHZo8cpG_DTgeK3eWVxNwwX9-2PkXs65_fQESevebSgv0G2g65o4ImvB-yYxcuYUvgvPpep6KljnMUiqhMBc1Elc6vL6ewF-q_VLjIQ6ZZFtd3Z1pL1FcMXv3BUtaQqbCDJUS31dwOrwiVGX8MemV3t3F8hTMT5jfSpn6TXeWfUvN9l7u1Hl7AwNPcjh0mAY7KqV4O46jtmYpoeeKwywcE6swTOFTfHLwzAhki3Vj0Gp9PTF5_VTKo8n6Kygft7AoowPaBB06PaNoRKQBSuYALDjGAvgl5Y5W-ioTE2xil2qFSafPMw8PyxVNP82Azr1PYgsEjeWvTByCi9oIciGALF_RUXx9Bz22FlMGtIquydIZh1cmz07rPSqRspyboWleVWaPcIPp_UTmvu1cfycccwKbJ43KgW2G2hUJHkl-aFtFxH3_48AxNgs8jEcyilCXhX72T2FHyBv76p\"}",
    "shortcut_auto_login": "{\"count\":1,\"firstTime\":1764578341769}",
    "areaId": "\"19\"",
    "shortcut_login_popup_time": "1764578341769",
    "PCA9D23F7A4B3CSS": "b973cef1213adbad53663fd74e2c61b0",
    "shshshfpb": "BApXWPdVd2v9Abwpe6NibzIDjsu_KhBUBBgYzZVho9xJ1MgWfCY-28XS_iX7_YIIgJLMK56eEhIWSEpg",
    "JDst_behavior_flag": "[{\"t\":1764582997379,\"e\":3600,\"v\":\"Fk\"}]",
    "shshshfpx": "4399a44e-1a9f-7578-322a-db987142a4db-1744726277",
    "shshshfpa": "4399a44e-1a9f-7578-322a-db987142a4db-1744726277",
    "PCTSD23F7A4B3CSS": "1764583233493",
    "WQ_dy1_tk_algo": "{\"33giggz9zp3td069\":{\"b5216\":{\"v\":\"eyJ0ayI6InRrMDN3YzAwODFjYTQxOG55QUE3a3J2TWQ2ZXBUWHJfc1owTkhfTlYwZjFSR2xoU2tHVVN4X2pYekJWSVRtT25WMkViVnJ4WHFCZmFCWUhjaTNKR05HU1BPYW1jIiwiYWxnbyI6ImZ1bmN0aW9uIHRlc3QodGssZnAsdHMsYWksYWxnbyl7dmFyIHJkPSdwRGMxdWRJZ1ROWlUnO3ZhciBzdHI9XCJcIi5jb25jYXQodGspLmNvbmNhdChmcCkuY29uY2F0KHRzKS5jb25jYXQoYWkpLmNvbmNhdChyZCk7cmV0dXJuIGFsZ28uU0hBMjU2KHN0cik7fSJ9\",\"e\":86400,\"t\":1764578339683}},\"aat36i9mzqdpdp03\":{\"73806\":{\"v\":\"eyJ0ayI6InRrMDN3ZGIzMzFjODgxOG5BV2o4YXZTZ2hHTFZvY1Z0RWFzeUNNd25XZm95akphVmhXbG5NS05hOGExSVFvZFFYaTlVa2hOVjhOVmo5MVA3UDBxMlBEcS1VSF9yIiwiYWxnbyI6ImZ1bmN0aW9uIHRlc3QodGssZnAsdHMsYWksYWxnbyl7dmFyIHJkPSdlWXZYME15ZzdLYjAnO3ZhciBzdHI9XCJcIi5jb25jYXQodGspLmNvbmNhdChmcCkuY29uY2F0KHRzKS5jb25jYXQoYWkpLmNvbmNhdChyZCk7cmV0dXJuIGFsZ28uU0hBMjU2KHN0cik7fSJ9\",\"e\":86400,\"t\":1764578339735}}}"
}

navigator = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
    appCodeName: "Mozilla",
    appName: "Netscape",
    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
}

location = {
    "ancestorOrigins": {},
    "href": "https://www.jd.com/",
    "origin": "https://www.jd.com",
    "protocol": "https:",
    "host": "www.jd.com",
    "hostname": "www.jd.com",
    "port": "",
    "pathname": "/",
    "search": "",
    "hash": ""
}


get_enviroment(proxy_array)



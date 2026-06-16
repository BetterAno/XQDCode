// 在 jcap 内部 hook fp 和 check 的请求构造函数，打印真实字段名和入参
const fs = require('fs');
const vm = require('vm');
const path = require('path');

// 复用 jcap_env 的沙箱构建
process.chdir(__dirname);
const envCode = fs.readFileSync('./jcap_env.js', 'utf-8');
// 从 jcap_env.js 提取 buildSandbox/buildDocument/... 需要新实例化
// 懒办法: require 不能用（非 module export），但 jcap_env.js 的沙箱代码是独立 函数
// => 直接复制 buildSandbox 到这里运行
// 避免复制: 用 vm.runInNewContext 加载一个 shim


// 读 jcap 源码并 patch，在 MA 的 fp 分支加入打印
const jcapPath = path.join(__dirname, '..', 'assets', 'js', 'jcap_ap0b2a.js');
let code = fs.readFileSync(jcapPath, 'utf-8');

// 定位 fp 分支的 u.ct=t.vkYOg(x,[n,o])
const FP_MARK = 'u.ct=t.vkYOg(x,[n,o])';
const fpIdx = code.indexOf(FP_MARK);
console.log('fp mark at:', fpIdx);

// 定位 check 分支的 ct:r(x,[g,l])
const CHK_MARK = 'ct:r(x,[g,l])';
const chkIdx = code.indexOf(CHK_MARK);
console.log('check mark at:', chkIdx);

if (fpIdx < 0 || chkIdx < 0) {
    console.log('FATAL: marker not found, abort');
    process.exit(1);
}

// patch: 在 fp 分支插入 console.error + 暴露 n/o 到 globalThis + 强制用 fresh D2 计算 ct
const fpPatch = `(function(){try{var __xs=String(x);console.error('[FP_X]','xLen=',__xs.length);for(var __i=0;__i<__xs.length;__i+=500){console.error('[FP_X_PART]',__i,__xs.slice(__i,__i+500));}console.error('[FP]','sid=',JSON.stringify(n),'o=',JSON.stringify(o),'o len=',o&&o.length,'xType=',typeof x,'A.devcInfo len=',A.devcInfo&&A.devcInfo.length,'A.tdat_ctx=',A.tdat_ctx&&A.tdat_ctx.slice(0,80),'A.tdat_code=',A.tdat_code,'A.platformOS=',A.platformOS);try{globalThis.__JCAP_LAST_SID=n;globalThis.__JCAP_LAST_DEVCINFO=o;globalThis.__JCAP_LAST_OPTION=A;}catch(e){}}catch(e){console.error('[FP] print error',e.message);}})(), u.ct=(function(){try{var __r1=t.vkYOg(x,[n,o]);console.error('[FP_MAIN_CT]',JSON.stringify(__r1));if(__r1)return __r1;}catch(e){console.error('[FP_MAIN_ERR]',e.message);}try{var __K=globalThis.__JCAP_DEBUG_KLASS;var __rr=globalThis.__JCAP_DEBUG_R;if(__K){var __D2=new __K(Object.assign({},__rr||{},{print:function(){},printErr:function(){},onAbort:function(){}}));if(__D2&&typeof __D2.then==='function'){console.error('[FP_FRESH] promise, cannot sync');return '';}var __ct=__D2.getCTData([n,o]);console.error('[FP_FRESH_CT]',JSON.stringify(__ct));try{__D2.delete();}catch(e){}return __ct||'';}}catch(e){console.error('[FP_FRESH_ERR]',e.message);}return '';})(), console.error('[FP] u.ct=',JSON.stringify(u.ct),'type=',typeof u.ct)`;
code = code.replace(FP_MARK, fpPatch);

// patch: check 分支 - 在 Q 对象构造后加一个侧效打印
// 原始片段: Q={si:g,lang:s,tk:_(...),ct:r(x,[g,l]),cs:"",version:3,client:C};T.a[...]
// patch 点选在 "};T.a" 之前插入
// 直接在 `Q={si:g,lang:s,tk:` 的位置插入 一个诊断语句，但用侧效替换更安全
const CHK_OBJ_OPEN = 'ct:r(x,[g,l]),cs:""';
const chkOpen = code.indexOf(CHK_OBJ_OPEN);
console.log('chk cs mark at:', chkOpen);
if (chkOpen >= 0) {
    // 在 ct:r(x,[g,l]) 计算之前，我们无法直接加 console.error（会破坏对象字面量）
    // 改为: ct: (function(){...; return r(x,[g,l]);})()
    code = code.replace('ct:r(x,[g,l])', 'ct:(function(){try{console.error(\'[CHK]\',\'g=\',g,\'l typeof=\',typeof l,\'l keys=\',l?Object.keys(l):null,\'xType=\',typeof x);}catch(e){} return r(x,[g,l]);})()');
}

// patch: 在 _t(t,gr(A)) 处打印 gr 和 gr(A) 返回值
const GR_CALL = '_t(t,gr(A))';
const grCallIdx = code.indexOf(GR_CALL);
console.log('gr call at:', grCallIdx);
if (grCallIdx >= 0) {
    const grPatch = `(function(){console.error('[GR] enter, typeof gr=',typeof gr);try{var __s;try{__s=Function.prototype.toString.call(gr);}catch(e1){__s='<toString failed:'+e1.message+'>';}console.error('[GR_SRC_LEN]',__s&&__s.length);var __chunks=[];for(var __i=0;__i<__s.length;__i+=500){__chunks.push(__s.slice(__i,__i+500));}for(var __j=0;__j<__chunks.length;__j++){console.error('[GR_SRC_PART]',__j,'/',__chunks.length,__chunks[__j]);}var __v=gr(A);console.error('[GR] result=',JSON.stringify(__v),'type=',typeof __v);_t(t,__v);}catch(e){console.error('[GR] err=',e.message,e.stack&&e.stack.slice(0,3000));throw e;}})()`;
    code = code.replace(GR_CALL, grPatch);
}

// patch: 在 Ir 函数 platformType==2 分支的 E 构造后打印 E
// 标记: _t(t,JSON["string"+f(-402,-414)](E))
const IR_MARK = '_t(t,JSON["string"+f(-402,-414)](E))';
const irIdx = code.indexOf(IR_MARK);
console.log('ir platformType==2 mark at:', irIdx);
if (irIdx >= 0) {
    const irPatch = `(function(){try{console.error('[IR2]','E=',JSON.stringify(E).slice(0,400));}catch(e){console.error('[IR2] err',e.message);}})(),${IR_MARK}`;
    code = code.replace(IR_MARK, irPatch);
}

// patch: 在 x 函数内部加入打印（x = function(A){...try{return D?D[...+"CTData"](A):""}catch...}）
// x 定义在源码位置约 564324 附近
// 找到特征：k.record(t);try{return D?D[..."CTData"](A)
const X_MARK = 'k.record(t);try{return D?D[function(A,t){return U(t-1462,A)}(1040,1035)+"CTData"](A):""}catch(A){return""}}';
const xIdx = code.indexOf(X_MARK);
console.log('x body mark at:', xIdx);
if (xIdx >= 0) {
    const xReplace = 'k.record(t);try{try{console.error("[X_ARG]","isArr=",Array.isArray(A),"len=",A&&A.length,"type=",typeof A,"raw=",JSON.stringify(A).slice(0,400));}catch(ex){console.error("[X_ARG_ERR]",ex.message);}var __key=(function(A,t){return U(t-1462,A)})(1040,1035)+"CTData";if(D){var __r=D[__key](A);console.error("[X_MAIN]","ct=",JSON.stringify(__r));try{var __K=globalThis.__JCAP_DEBUG_KLASS;var __rr=globalThis.__JCAP_DEBUG_R;if(__K){var __D2=new __K(Object.assign({},__rr||{},{print:function(){},printErr:function(){},onAbort:function(){}}));if(__D2&&typeof __D2.then==="function"){__D2.then(function(__D2r){try{var __ct2=__D2r[__key](A);console.error("[X_FRESH]","ct=",JSON.stringify(__ct2));try{__D2r.delete();}catch(e){}}catch(e){console.error("[X_FRESH_ERR]",e.message);}});}else{var __ct2=__D2[__key](A);console.error("[X_FRESH]","ct=",JSON.stringify(__ct2));try{__D2.delete();}catch(e){}}}}catch(__ee){console.error("[X_FRESH_CTOR_ERR]",__ee.message);}if(__r){return __r;}if(globalThis.__JCAP_FALLBACK_CT){console.error("[X_USING_FALLBACK]");return globalThis.__JCAP_FALLBACK_CT;}return "";}return"";}catch(__e){console.error("[X_CALL] err=",__e.message);return""}}';
    code = code.replace(X_MARK, xReplace);
}

// patch: 在 D = new (o.CaptchaWebAssembly)(r) 处注入 WASM Module 诊断钩子
// 同时打印 r 的结构
const WASM_MARK = 'D=new(o["CaptchaWebAs"+c(232,208)+"bly"])(r);case 13:';
const wasmIdx = code.indexOf(WASM_MARK);
console.log('wasm new mark at:', wasmIdx);
if (wasmIdx >= 0) {
    // 同时构造多个 D 实例，这里我们只构造主 D（r原样注入 hooks）
    // 额外暂存 _r，供后续 patch 调试时执行参数搜索
    const wasmPatch = 'D=(function(_r){try{console.error("[WASM_R_KEYS]",Object.keys(_r||{}).join(","));console.error("[WASM_R]",JSON.stringify(_r).slice(0,800));}catch(e){console.error("[WASM_R_ERR]",e.message);}var _hook={print:function(){try{console.error("[WASM_OUT]",Array.prototype.join.call(arguments," "));}catch(e){}},printErr:function(){try{console.error("[WASM_ERR]",Array.prototype.join.call(arguments," "));}catch(e){}},onAbort:function(x){console.error("[WASM_ABORT]",x);}};var _merged=Object.assign({},_r||{},_hook);globalThis.__JCAP_DEBUG_R=_merged;globalThis.__JCAP_DEBUG_KLASS=o["CaptchaWebAs"+c(232,208)+"bly"];return new(o["CaptchaWebAs"+c(232,208)+"bly"])(_merged);})(r);case 13:';
    code = code.replace(WASM_MARK, wasmPatch);
    console.log('wasm patch applied');
}

console.log('patched, new size:', code.length);
fs.writeFileSync(path.join(__dirname, 'jcap_patched.js'), code);
console.log('wrote jcap_patched.js');

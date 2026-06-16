/**
 * debug_encode.js — run encode_full_cli logic with debug hooks
 */
const fs=require('fs'),path=require('path'),D=__dirname;
const heap=new Array(128).fill(undefined);heap.push(undefined,null,true,false);let hn=heap.length;
const _go=i=>heap[i],_do=i=>{if(i<132)return;heap[i]=hn;hn=i},_to=i=>{const r=_go(i);_do(i);return r},_aho=o=>{if(hn===heap.length)heap.push(heap.length+1);const i=hn;hn=heap[i];heap[i]=o;return i},_he=(f,args)=>{try{return f.apply(this,args)}catch(e){_w.__wbindgen_exn_store(_aho(e))}};
let _w,_i32,_u8,_vl=0;const te=new TextEncoder(),es=typeof te.encodeInto==='function'?(a,v)=>te.encodeInto(a,v):(a,v)=>{const b=te.encode(a);v.set(b);return{read:a.length,written:b.length}};
function gsw(ptr,len){ptr>>>=0;if(!_u8)_u8=new Uint8Array(_w.memory.buffer);return new TextDecoder('utf-8').decode(_u8.subarray(ptr,ptr+len))}
function psw(arg,malloc,realloc){if(realloc===undefined){const b=te.encode(arg);const p=malloc(b.length,1)>>>0;if(!_u8)_u8=new Uint8Array(_w.memory.buffer);_u8.subarray(p,p+b.length).set(b);_vl=b.length;return p}let len=arg.length;let p=malloc(len,1)>>>0;if(!_u8)_u8=new Uint8Array(_w.memory.buffer);let o=0;for(;o<len;o++){const c=arg.charCodeAt(o);if(c>0x7F)break;_u8[p+o]=c}if(o!==len){if(o!==0)arg=arg.slice(o);p=realloc(p,len,len=o+arg.length*3,1)>>>0;_u8=new Uint8Array(_w.memory.buffer);const r=es(arg,_u8.subarray(p+o,p+len));o+=r.written;p=realloc(p,len,o,1)>>>0;_u8=new Uint8Array(_w.memory.buffer)}_vl=o;return p}
function gi32(){if(!_i32||_i32.byteLength===0)_i32=new Int32Array(_w.memory.buffer);return _i32}

// Env setup
function makeAnchor(){
  var p={_href:'',host:'',hostname:'',protocol:'',pathname:'',port:'',search:'',hash:'',origin:''},a={};
  Object.defineProperty(a,'href',{get:function(){return p._href},set:function(v){p._href=v;try{var u=new URL(v);p.host=u.host;p.hostname=u.hostname;p.protocol=u.protocol;p.pathname=u.pathname;p.port=u.port;p.search=u.search;p.hash=u.hash;p.origin=u.origin}catch(e){}}});
  ['host','hostname','protocol','pathname','port','search','hash','origin'].forEach(function(k){Object.defineProperty(a,k,{get:function(){return p[k]},set:function(v){p[k]=v}})});
  return new Proxy(a,{get:function(t,k){if(k in t)return t[k];if(k==='then')return;return t}});
}
globalThis.document={body:{children:{length:0}},addEventListener:()=>{},removeEventListener:()=>{},createElement:function(t){if(t==='a'||t==='A'||t==='div')return makeAnchor();return{style:{}}},querySelector:()=>null,getElementById:()=>null,getElementsByTagName:()=>[],cookie:'',referrer:'',title:'',documentElement:{}};
function MockWin(){}
var win={location:{href:'https://www.pzds.com/goodsList/17',hostname:'www.pzds.com',host:'www.pzds.com',protocol:'https:',pathname:'/goodsList/17',search:'',hash:'',origin:'https://www.pzds.com',port:''},Window:MockWin,document:globalThis.document,addEventListener:()=>{},removeEventListener:()=>{},performance:{now:()=>Date.now},[Symbol.toStringTag]:'Window'};
win.window=win;win.self=win;win.top=win;win.parent=win;
globalThis.window=win;globalThis.self=win;globalThis.location=win.location;
globalThis.navigator={userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',webdriver:false,platform:'Win32',language:'zh-CN',languages:['zh-CN'],cookieEnabled:true,hardwareConcurrency:8,deviceMemory:8,maxTouchPoints:0,vendor:'Google Inc.',plugins:{length:5},mimeTypes:{length:2}};
globalThis.screen={width:1920,height:1080};
globalThis.XMLHttpRequest=class{open(){};setRequestHeader(){};send(){};addEventListener(){};removeEventListener(){}};
globalThis.FormData=class{append(){}};
globalThis.console={log:()=>{},error:()=>{},warn:()=>{}};
globalThis.MutationObserver=class{observe(){};disconnect(){}};
globalThis.performance={now:()=>Date.now(),mark:()=>{},measure:()=>{}};
globalThis.Math=Math;
globalThis.JSON=JSON;
var _ls={};globalThis.localStorage={getItem:function(k){return _ls[k]||null},setItem:function(k,v){_ls[k]=v},removeItem:function(k){delete _ls[k]},key:function(i){return Object.keys(_ls)[i]||null},get length(){return Object.keys(_ls).length}};
globalThis.sessionStorage={getItem:function(k){return _ls[k]||null},setItem:function(k,v){_ls[k]=v},removeItem:function(k){delete _ls[k]},key:function(i){return Object.keys(_ls)[i]||null},get length(){return Object.keys(_ls).length}};
globalThis.Storage=function Storage(){};globalThis.Storage.prototype=globalThis.localStorage;
globalThis.pzversioncode='1';globalThis.pzos='windows';globalThis.pzplatform='pc';globalThis.skey='CLIENT';

// Init WASM
const wb=fs.readFileSync(path.join(D,'ad96acb6.wasm'));const wm=new WebAssembly.Module(wb.buffer.slice(wb.byteOffset,wb.byteOffset+wb.byteLength));
_w=new WebAssembly.Instance(wm,{wbg:{__wbindgen_object_drop_ref(a0){_to(a0)},__wbg_instanceof_Window_f401953a2cf86220(a0){try{return Object.prototype.toString.call(_go(a0))==='[object Window]'}catch(_){return false}},__wbg_location_2951b5ee34f19221(a0){return _aho(_go(a0).location)},__wbg_href_706b235ecfe6848c(){return _he((a0,a1)=>{const r=_go(a1).href;const p=psw(r,_w.__wbindgen_malloc,_w.__wbindgen_realloc);gi32()[a0/4+1]=_vl;gi32()[a0/4+0]=p},arguments)},__wbg_hostname_3d9f22c60dc5bec6(){return _he((a0,a1)=>{const r=_go(a1).hostname;const p=psw(r,_w.__wbindgen_malloc,_w.__wbindgen_realloc);gi32()[a0/4+1]=_vl;gi32()[a0/4+0]=p},arguments)},__wbg_newnoargs_e258087cd0daa0ea(a0,a1){return _aho(new Function(gsw(a0,a1)))},__wbg_self_ce0dbfc45cf2f5be(){return _he(()=>_aho(self.self),arguments)},__wbg_window_c6fb939a7f436783(){return _he(()=>_aho(window.window),arguments)},__wbg_globalThis_d1e6af4856ba331b(){return _he(()=>_aho(globalThis),arguments)},__wbg_global_207b558942527489(){return _he(()=>_aho({}),arguments)},__wbindgen_is_undefined(a0){return _go(a0)===undefined},__wbg_call_27c0f87801dedf93(){return _he((a0,a1)=>_aho(_go(a0).call(_go(a1))),arguments)},__wbindgen_object_clone_ref(a0){return _aho(_go(a0))},__wbindgen_throw(a0,a1){throw new Error(gsw(a0,a1))},}}).exports;

// Override encodeURIComponent
var realEUC=encodeURIComponent;
globalThis.encodeURIComponent=function(input){
  if(typeof input==='string'&&input.indexOf('undefinedpost')===0){
    var rest=input.substring('undefined'.length);
    return realEUC(globalThis.__signB64+rest);
  }
  return realEUC(input);
};

// Load script and export a4
let s=fs.readFileSync(path.join(D,'script_200_raw.js'),'utf8');
s=s.replace('var go;','var go=790;');
s=s.replace("typeof gC===[]+[][[]]?'/LN+23PNHvJGRW':gC()","'X'");
var a4Start=s.indexOf('function a4(a8,a9,aa,aA){');
var a5Start=s.indexOf('function a5(',a4Start);
if(a5Start>0)s=s.substring(0,a5Start)+'globalThis.__a4=a4;'+s.substring(a5Start);
s=s.replace('a7[az(gN.gb)]();','void 0;');
eval(s);

// The script may have overridden navigator. Force-restore our mocks.
// Key: the script accesses N.r (globalThis) for navigator, screen, document, etc.
// We need to ensure globalThis.navigator has the browser-like values.

// Check what navigator is now
process.stdout.write('navigator.userAgent after eval: ' + (globalThis.navigator ? globalThis.navigator.userAgent : 'MISSING') + '\n');
process.stdout.write('window.navigator after eval: ' + (globalThis.window && globalThis.window.navigator ? globalThis.window.navigator.userAgent : 'MISSING') + '\n');

// Restore console
globalThis.console={log:(...a)=>process.stdout.write(a.join(' ')+'\n'),error:(...a)=>process.stderr.write(a.join(' ')+'\n'),warn:(...a)=>process.stderr.write(a.join(' ')+'\n')};

// Re-set navigator if needed
if (globalThis.navigator.userAgent !== 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36') {
  process.stdout.write('WARNING: navigator.userAgent was overridden! Restoring...\n');
  Object.defineProperty(globalThis.navigator, 'userAgent', {
    value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
    writable: false, configurable: true
  });
}

// Now override a4 to log intermediate values
var origA4 = globalThis.__a4;
var body='{"order":"ASC","sort":null,"page":1,"pageSize":10,"action":{"gameId":"17","goodsCatalogueId":6,"goodsSubCatalogueIds":[],"keywords":[],"searchWords":[],"searchPropertyIds":[],"recommendSearchConfigIds":[],"unionGameIds":[],"goodsSearchActions":[],"metas":{"single1":[]},"countFlag":false,"conditionSearch":false}}';
var ts='1781601056985',rnd='697548',sign='3cc8bb32c109274061e5ffc7e8ba172c';
globalThis.__signB64=Buffer.from(sign).toString('base64');
globalThis.__lastBody=body;

// The key insight: a4 internally calls O(ag) where ag = [a2(ag), a2(aS), w(), ts, ver, devId, M()].join("|")
// Let's check what M() returns
// M() reads from Storage cache - let's check
process.stdout.write('localStorage.getItem("y"): ' + localStorage.getItem("y") + '\n');
process.stdout.write('sessionStorage keys: ' + JSON.stringify(Object.keys(_ls)) + '\n');

var result=origA4('https://api.pzds.com/api/web-client/v2/public/goodsPublic/page',body,'post',1);
var m=result.match(/decode__1174=([^&]+)/);
var val = m?m[1]:result;
process.stdout.write('len=' + val.length + '\n');
process.stdout.write('val=' + val + '\n');

// Try running again to see if values change
var result2=origA4('https://api.pzds.com/api/web-client/v2/public/goodsPublic/page',body,'post',1);
var m2=result2.match(/decode__1174=([^&]+)/);
var val2 = m2?m2[1]:result2;
process.stdout.write('len2=' + val2.length + '\n');
process.stdout.write('val2=' + val2 + '\n');
process.stdout.write('same=' + (val === val2) + '\n');

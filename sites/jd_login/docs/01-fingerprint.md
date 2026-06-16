# 京东登录页指纹/风控检测点（Phase 1 实测）

实测时间：2026-05-04，URL：https://passport.jd.com/new/login.aspx
浏览器：AdsPower 指纹浏览器 (Chrome/144)，user_id=k1bhfp97

## 1. 浏览器环境（AdsPower 已通过）

| 项 | 值 | 说明 |
|----|----|----|
| navigator.webdriver | `false` | OK |
| navigator.platform | `Win32` | OK |
| navigator.languages | `["zh-CN","zh"]` | OK |
| plugins.length | 5 | OK（裸浏览器为 0） |
| mimeTypes.length | 2 | OK |
| hardwareConcurrency | 12 | OK |
| deviceMemory | 8 | OK |
| chrome | object | OK |
| chrome.runtime | undefined | 需注意：AdsPower 此项是 undefined（chrome.runtime 仅扩展可见） |
| outerWidth/innerWidth | 1219/1219 | 一致（无 devtools） |

## 2. 京东风控全局对象（已识别）

```
_JdJrTdRiskFpInfo            string  -> 同盾 TDFingerprint 设备指纹
_JdEid                       string  -> 京东 EID 设备唯一标识
getJdEid                     function-> EID 生成入口
JdJrTdRiskFinger             ?       -> 同盾指纹算法对象
JdJrTdFingerDataStream       ?       -> 数据流上报
_jdfp_canvas_md5             string  -> Canvas 指纹 MD5
_jdfp_webgl_md5              string  -> WebGL 指纹 MD5
_jdtdmap_sessionId           string  -> 行为采集 sessionId
_jdtdseq_config_data         object  -> seq 配置
JDDSecCryptoJS               object  -> 京东自研加密 JS
JDDMAC                       object  -> MAC 签名
_riskFpMode                  ?       -> 风控指纹模式
seClick                      ?       -> 安全点击
Ttracker                     ?       -> 行为追踪
jdCAP                        object  -> 验证码模块入口
jcapLoadCreate, initJdSlide, jdSlide -> JDJR 滑块 SDK
_JdJrTdRiskDomainName        string  -> 风控域名
callEidfingerRisk_3AB9D23F7A4B3C9B   -> EID 回调
_JdJrRiskClientCollectData   function-> 客户端数据采集
_JdJrRiskClientStorage       object  -> 风控存储
_JdTdudfp                    string  -> TDFingerprint udfp
_jd_e_joint_                 ?       -> 联合采集
_jdJrTdRelationEidPin        ?       -> EID-pin 关联
_jdJrTdCommonsObtainPin      function-> pin 获取
JDJRTDLOCALSTORAGE           object  -> JR-TD 本地存储
jd_risk_token_id             string  -> 风控 token id
jdWebBCC, jd_shadow__        -> bjdcommon login SDK
__bjd_common_login_init__    function-> bjd common login 初始化
```

## 3. Cookie（页面加载后已自动写入）

| Cookie | 含义 |
|--------|------|
| `__jdv` `__jda` `__jdc` `__jdb` `__jdu` | UV/PV 追踪四件套 |
| `shshshfpa` `shshshfpx` `shshshfpb` | 神舟舟舟指纹（wl.js / s.js 生成） |
| `3AB9D23F7A4B3CSS` | EID-Server-Side（jdd03 开头） |
| `3AB9D23F7A4B3C9B` | **EID 设备指纹核心**（callEidfingerRisk 回调写入） |
| `wlfstk_smdl` | wl 风控 token |
| `_t` | 临时 token |
| `_tp` | 时间戳 token |
| `TrackID` | 追踪 ID |
| `pin` `pinId` `unick` | 登录态用户标识（已登录时） |
| `mba_muid` | 大数据用户 ID |
| `ipLoc-djd` | 区域定位 |

## 4. 关键 JS 资源清单（已下载到 assets/js/ 共 24 个）

按"逆向价值"排序：

| 文件 | 大小 | 用途 |
|------|------|------|
| `storage.360buyimg.com__jsresource__jcap__version__v2.7.1__1__jcap_ap0b2a.js` | 801 KB | **滑块核心**，重度混淆 |
| `storage.360buyimg.com__bjd-utils-sdk__...__index.js` | 1037 KB | bjd-common login SDK，含 user_rbd 加密 |
| `gias.jd.com__js__td.js` | 49 KB | TDFingerprint（EID/_JdJrTdRiskFpInfo） |
| `gias.jd.com__js__pc-tk.js` | 50 KB | 同盾 tk |
| `wl.jd.com__wl.js` | 50 KB | 神舟指纹（shshshfp*） |
| `static.360buyimg.com__risk-cdn__seq__s.js` | 6 KB | seq 风控采集 |
| `storage.jd.com__...__jdJsencrypt.min.js` | 54 KB | **密码 RSA 加密**（jsrsasign） |
| `jrsecstatic.jdpay.com__jr-sec-dev-static__summer-cryptico-h5.min.js` | 50 KB | JR cryptico（候选 SM2/SM4） |
| `storage.jd.com__...__util__eid.js` | <1 KB | EID 入口（小，应该是 wrapper） |
| `storage.jd.com__...__login.index.2024.js` | 4 KB | 登录主控（小，调度其它 JS） |
| `storage.jd.com__...__login2025_append.js` | 23 KB | 2025 追加逻辑 |
| `ivs.jd.com__slide__js__jdSlide.1.0.min.js` | 2 KB | 滑块 UI 胶水（薄封装） |
| `jcap.m.jd.com__home__requireCaptchaPc.js` | 4 KB | jcap 加载器 |
| `storage.360buyimg.com__webcontainer__js_security_v3_0.1.8.js` | 65 KB | 安全 SDK v3 |

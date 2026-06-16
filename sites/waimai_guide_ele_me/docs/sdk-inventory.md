# SDK 资源清单

## 存放位置

- 下载目录：`assets/js/sdk/`
- 下载脚本：`src/download_missing_sdks.js`
- 机器清单：`assets/js/sdk/manifest.json`

## 已补充 SDK

| 类别 | 本地文件 | 用途 |
|------|----------|------|
| AWSC loader | `AWSC__AWSC__awsc.js` | AWSC 模块调度入口 |
| ET | `AWSC__et__1.83.41__et_f.js` | `window.etSign` / `bx_et` 相关入口 |
| ET stable | `AWSC__et__1.83.35__et_f.js` | AWSC stable 配置里的 ET 版本 |
| ET br | `AWSC-br__et__1.80.0__et_f.js`, `AWSC-br__et__1.80.1__et_n.js` | AWSC br 备用链路，已解压为明文 JS |
| Fireye | `AWSC__fireyejs__1.231.67__fireyejs.js`, `AWSC__fireyejs__1.231.69__fireyejs.js` | AWSC/FY 风控模块 |
| Fireye newer | `AWSC__fireyejs__1.234.20__fireyejs.js`, `AWSC__fireyejs__1.234.24__fireyejs.js` | AWSC 针对淘宝/天猫 UA 的新版配置 |
| UAB | `AWSC__uab__1.140.0__collina.js` | `getUA` / UA 风控采集模块 |
| WebUMID | `AWSC__WebUMID__1.93.0__um.js` | umid token 相关模块 |
| NC | `AWSC__nc__1.97.0__nc.js` | AWSC nc/nvc/ic 模块 |
| Sufei | `secdev__sufei_data__3.9.14__index.js` | Baxia entry 里的 sufei 数据模块 |
| Baxia | `sd__baxia__2.5.36__baxiaCommon.js` | `x5sec` / challenge 处理入口 |
| Baxia handler | `sd__baxia__2.5.36__baxiaXhrHandler.js`, `sd__baxia__2.5.36__baxiaFetchHandler.js` | Baxia XHR/Fetch handler |

## 未完整项

| URL | 状态 | 说明 |
|-----|------|------|
| `https://g.alicdn.com/js/nc/60.js` | `http_404` | `awsc.js` 旧配置里的 nsModule 路径，当前 CDN 返回 404 |
| `https://g.alicdn.com/AWSC-br/fireyejs/1.227.0/fireyejs.js` | 已保存但 `node --check` 不通过 | CDN 返回内容不是可直接解析的明文 JS；保留原始文件供比对，不作为可执行 JS 使用 |

## 验证

```powershell
node --check .\sites\waimai_guide_ele_me\src\download_missing_sdks.js
node .\sites\waimai_guide_ele_me\src\download_missing_sdks.js
```

第二条命令会生成 `manifest.json`；因为 `js/nc/60.js` 当前返回 404，脚本会以非 0 退出码提示清单未 100% 完整，但已成功文件会正常落盘。

语法检查结果：

- `assets/js/sdk/` 下 19 个 `.js` 文件中，18 个可通过 `node --check`
- 未通过项：`AWSC-br__fireyejs__1.227.0__fireyejs.js`

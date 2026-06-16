# 加密逻辑分析 - 欧冶钢铁平台（瑞数）

## 定位状态
- Phase 2 初步完成
- 已定位到瑞数 JSVMP 虚拟机拦截 XHR 的位置

## 瑞数关键模块

### 1. 外部脚本
- **URL**: `https://www.ouyeel.com/vdGfdDb5PQO5/Yb22vZNxMd0t.6771a74.js`
- **大小**: 137,103 字节
- **入口**: `(function(_$bu,_$a$){if(!$_ts.cd) return;...`
- **特征**: JSVMP 混淆，`$_ts` 全局对象检测

### 2. 内联脚本 (Script ID 828)
- **大小**: 161,437 字节
- **入口**: `(function(_$iG,_$iM){if(!$_ts.cd) return;...`
- **关键函数**: `_$cN` — XHR open 拦截器
- **位置**: `script:828:4:54567`

### 3. 调用栈（XHR 被拦截时）
```
_$cN @ script:828:4:54567    ← 瑞数 VM 拦截器
_$_3 @ script:828:4:53416     ← VM 调度器
<anon> @ index-jlLATBS2:56    ← axios xhr adapter
xhr   @ index-jlLATBS2:56     ← axios dispatch
qw    @ index-jlLATBS2:58     ← dispatchRequest
```

### 4. VM 结构
- `$_ts`: 瑞数全局对象
- `_$b7`: 字节码数组 (VM opcodes)
- `_$cN`: XHR 拦截执行函数
- `_$gk`: 环境指纹采集函数
- `_$gG`: 字符串解密函数
- `_$da`: 字符转义函数

### 5. K5nOZLud 参数特征
- 长度: 96 字符
- 字符集: `[A-Za-z0-9_.]` (Base64-like)
- 每次 XHR 请求生成新值
- 由瑞数 VM 动态注入到 URL

## 瑞数 Cookie 关联
- `T0k1m0u5AfREP`: 瑞数环境指纹 cookie
- `T0k1m0u5AfREO`: 瑞数另一个环境 cookie
- Cookie 值格式与 K5nOZLud 相似 (Base64-like + dot/underscore)

## 下一步
- 需要瑞数专用技能 `ruishu-env-patch` 进行补环境
- 参考已有项目: `sites/singlewindow_rs6/`
- 已有瑞数 JS 代码: `rs6js_code.js` (530KB)

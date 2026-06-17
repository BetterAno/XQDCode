# 抖音搜索加密分析

## X-Bogus (a_bogus) 签名

### 生成流程

1. **参数拼接**: 按固定顺序拼接搜索参数
   ```
   aid=6383,channel=channel_pc_web,search_channel=aweme_general,keyword=八段锦,...
   ```

2. **MD5 哈希**: 对拼接字符串做 MD5 → `X-MS-STUB`

3. **SDK 签名**: `window.byted_acrawler.frontierSign({"X-MS-STUB": md5_hash})`
   - 返回 `{"X-Bogus": "签名值"}`
   - 签名值含随机/时间因子，每次不同

4. **URL 参数**: `X-Bogus` 作为 `a_bogus` 参数加入 URL

### 签名 SDK

- **文件**: `webmssdk.es5.js` (v1.0.0.53)
- **来源**: `https://lf-c-flwb.bytetos.com/obj/rc-client-security/c-webmssdk/1.0.0.53/webmssdk.es5.js`
- **技术**: VM 字节码混淆，`w_0x5c3140` 解释器执行
- **全局对象**: `window.byted_acrawler.frontierSign`

### 实现方案

**补环境方案 (当前采用)**:
- Node.js 中用 `vm.createContext` 模拟浏览器环境
- 加载 webmssdk 执行 `frontierSign`
- Python 通过 subprocess 调用 Node.js 签名器

**环境依赖**:
- 需要完整浏览器 Cookie (含 httpOnly 的 ttwid, sessionid 等)
- Cookie 有效期有限，需定期更新

### 关键文件

| 文件 | 说明 |
|------|------|
| `src/signer.js` | Node.js 签名器 |
| `src/douyin_search_api.py` | Python 主流程 |
| `webmssdk.es5.js` | 签名 SDK |
| `cookies.txt` | 浏览器 Cookie |

## 其他参数

| 参数 | 类型 | 来源 |
|------|------|------|
| search_id | 时间戳+随机 | 本地生成 |
| UIFID / uifid | 浏览器指纹 | Cookie |
| fp / verifyFp | 指纹 ID | s_v_web_id Cookie |
| msToken | 动态 token | Cookie |
| webid | 用户 ID | Cookie |

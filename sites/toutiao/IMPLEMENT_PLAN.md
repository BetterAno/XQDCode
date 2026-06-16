# 今日头条 a_bogus 本地补环境实现方案

## 📋 项目状态

- ✅ **基础环境补全**: 已完成 (watch 监控、DOM API、浏览器指纹)
- ⚠️ **加密算法**: 需要逆向 (当前使用简化版本)
- 🎯 **目标**: 获取科技频道文章标题

---

## 🎯 已完成的工作

### 1. 补环境框架 (env.js)
- ✅ `watch` 监控代理 - 参数感知型
- ✅ `managerNative` - 原生函数伪装
- ✅ Window/Document/Navigator/Screen/Location 补全
- ✅ Canvas 2D 环境补全
- ✅ 日志系统 (`[读取]`, `[参数调用]`, `@@@MISSING@@@`)

### 2. 浏览器环境捕获
- ✅ 成功捕获真实 a_bogus 值:
  ```
  QjR0/d0gmE2TvfyZ5lVLfY3qV-P3YhMr0t9bMDhqDdfZLL39HMT19exoGtzvIzWjE4/0IeWjy4hbYNcQrQAn8NgUHW4x/2nM-hbdte-25xSi5q4reyUgrsJNmkJ5tlc25klIE/iMow2aSYuhl9Fe-XKAO6ZCcrtswytrGI/bXfR3E-6/WE==
  ```
- ✅ 识别目标接口: `/api/pc/list/feed?channel_id=94349549395`
- ✅ 识别加密脚本: `collect.js`, `vendor.js`

---

## 🔍 a_bogus 加密分析

### 特征
- **长度**: ~180 字符
- **编码**: Base64 变种 (`-` 和 `_` 替代 `+` 和 `/`)
- **结尾**: 通常是 `==`
- **组成**: 时间戳 + URL参数 + 浏览器指纹 + 随机数 + 签名

### 生成流程 (推测)
```
1. 收集请求参数
   ├─ URL 路径
   ├─ Query 参数 (channel_id, msToken, etc.)
   └─ 时间戳

2. 收集浏览器指纹
   ├─ Canvas 指纹
   ├─ UserAgent
   ├─ Screen 属性
   ├─ Navigator 属性
   └─ Timezone

3. 混合加密
   ├─ 拼接数据
   ├─ 哈希计算 (可能是 HMAC-SHA256)
   └─ Base64 编码

4. 输出 a_bogus
```

---

## 📝 下一步行动计划

### Step 1: 逆向加密算法 (预计 2-3 天)

#### 方法 A: 动态调试 (推荐)
```javascript
// 在浏览器中 Hook 关键函数
(function() {
  // 1. Hook Object.assign (常用于参数合并)
  const origAssign = Object.assign;
  Object.assign = function(...args) {
    console.log('Object.assign:', args);
    debugger; // 断点调试
    return origAssign.apply(this, args);
  };
  
  // 2. Hook btoa (Base64 编码)
  const origBtoa = window.btoa;
  window.btoa = function(str) {
    console.log('btoa 输入:', str);
    console.log('调用栈:', new Error().stack);
    debugger;
    return origBtoa(str);
  };
  
  // 3. Hook CryptoJS (如果使用了加密库)
  if (window.CryptoJS) {
    const origSHA256 = CryptoJS.SHA256;
    CryptoJS.SHA256 = function(msg) {
      console.log('SHA256 输入:', msg.toString());
      debugger;
      return origSHA256(msg);
    };
  }
})();
```

#### 方法 B: 静态分析
```bash
# 1. 下载加密脚本
curl -o collect.js "https://lf-dw.toutiaostatic.com/obj/toutiao-duanwai/toutiao/toutiao_web_pc/common/collect.e756c865.js"

# 2. 使用 js-reverser 脱混淆
# (在 Qoder 中使用 js-reverser MCP 工具)

# 3. 搜索关键词
grep -i "bogus\|signature\|encrypt" collect.js
```

### Step 2: 完善 env.js

替换 `simpleEncrypt` 函数为真实算法:

```javascript
// 当前 (简化版本)
function simpleEncrypt(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return btoa(String(Math.abs(hash))) + '==';
}

// 目标 (真实算法 - 需要逆向后替换)
function generateRealABogus(params, fingerprint, timestamp) {
    // 1. 构造签名数据
    const signData = constructSignData(params, fingerprint, timestamp);
    
    // 2. 加密 (逆向后的算法)
    const encrypted = encryptWithRealAlgorithm(signData);
    
    // 3. Base64 编码
    return btoa(encrypted)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
```

### Step 3: 测试验证

```javascript
// 使用真实请求测试
const axios = require('axios');

async function testFetchNews() {
    const params = {
        offset: 0,
        channel_id: 94349549395,
        max_behot_time: 0,
        category: 'pc_profile_channel',
        disable_raw_data: true,
        aid: 24,
        app_name: 'toutiao_web',
        msToken: 'xxx',
        a_bogus: generateABogus({...})
    };
    
    const response = await axios.get('https://www.toutiao.com/api/pc/list/feed', {
        params: params,
        headers: {
            'User-Agent': navigator.userAgent,
            'Cookie': document.cookie
        }
    });
    
    console.log('获取到的文章:', response.data.data.map(item => ({
        title: item.title,
        source: item.source
    })));
}

testFetchNews();
```

---

## 🛠️ 技术栈

| 工具 | 用途 |
|------|------|
| **Qoder + chrome-devtools** | 浏览器调试、Hook 函数 |
| **Qoder + js-reverser** | 代码脱混淆、静态分析 |
| **Node.js** | 本地运行环境 |
| **axios** | HTTP 请求客户端 |
| **crypto-js** | 加密算法实现 |

---

## 📂 文件结构

```
toutiao/
├── env.js              # 补环境代码 (✅ 已完成)
├── 实战测试总结.js     # 测试总结 (✅ 已完成)
├── IMPLEMENT_PLAN.md   # 实现计划 (📝 当前文件)
└── (待添加)
    ├── encrypt.js      # 加密算法实现 (逆向后)
    └── fetch_news.js   # 获取新闻脚本
```

---

## ⚠️ 注意事项

1. **反爬更新**: 头条会定期更新加密算法，需要持续维护
2. **频率限制**: 避免高频请求，建议添加延迟
3. **Cookie 有效期**: msToken 和 ttwid 会过期，需要定期更新
4. **法律合规**: 仅用于学习研究，遵守 robots.txt

---

## 🎓 学习资源

- 补环境定义规范: `e:\PythonCodeObject1\ObjectProDerdemo1\.qoder\rules\补环境定义.md`
- 参考实现: `E:\PythonCodeObject1\ObjectKeys2\DYProbjectObje\大厂加密专题\阿里234加密3_7\pathcode.js`

---

## 📊 进度追踪

- [x] 基础环境补全
- [x] 捕获真实 a_bogus
- [x] 分析加密特征
- [ ] 逆向加密算法 (进行中)
- [ ] 完善 env.js
- [ ] 测试真实请求
- [ ] 获取科技频道文章

---

**最后更新**: 2026-04-09  
**状态**: 🟡 进行中 (等待逆向加密算法)

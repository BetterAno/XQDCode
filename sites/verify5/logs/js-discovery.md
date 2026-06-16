# Verify5 验证码 - 阶段三：JS 代码提取与混淆分析

## 核心脚本
- 文件: `verify5/assets/v5.js` (90,082 字符, 166 行)
- 来源: https://s.verify5.com/assets/latest/v5.js
- SDK 版本: 2.6.2

## 混淆类型诊断
- **混淆工具**: Google Closure Compiler (ADVANCED_OPTIMIZATIONS)
- 特征: `$jscomp` 前缀的 polyfill, 变量名压缩为单字符, 属性名收缩
- **字符串隐藏**: 使用 `String.fromCharCode(n-10)` 偏移解密
  - `a(109)+a(114)+a(107)+a(124)...` = `"charAt"` 等
- **无 JSVMP/VM**: 代码虽重度压缩但无虚拟机层, 逻辑可直接阅读
- **无控制流平坦化**: switch-case 均为正常逻辑分支

## 代码模块结构
```
v5.js
├── $jscomp polyfills (Promise, Array.fill, etc.)
├── 主 IIFE 入口
│   ├── 字符串解密函数 a(d)
│   ├── c() 函数 (XOR 解密)
│   ├── n() 缓存类
│   ├── l() 命名空间构建
│   ├── q() 随机字符串生成
│   ├── tc() UUID v4 生成
│   ├── Bb() eval 解析
│   ├── Cb() JSON 序列化
│   ├── r() 主 V5 类
│   │   ├── WebSocket transport (F)
│   │   ├── iframe transport (M)
│   │   └── Slider dialog (y["00"] = SliderVerification)
│   ├── 手指纹采集模块 (嵌入 fingerprintjs v2.0.0)
│   │   ├── canvas 指纹
│   │   ├── webgl 指纹
│   │   ├── 字体列表检测
│   │   ├── 音频指纹
│   │   └── 标准属性采集
│   └── c12_ CryptoJS 精简版
│       ├── AES-256 (CTR/CBC)
│       ├── MD5
│       ├── SHA-1
│       ├── Base64/Hex/Latin1/Utf8
│       └── MurmurHash3 (128-bit)
└── 导出: window[oc] (全局 V5 SDK)
```

## 解混淆策略
- **不需要 AST 解混淆**: Closure Compiler 压缩而非混淆, 逻辑结构完整
- 字符串解密直接 Hook `a(d)` 函数即可还原
- 关键变量名通过上下文推理解析

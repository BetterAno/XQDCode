# Verify5 验证码 - 阶段一：页面分析与类型识别

## 目标网站
- URL: https://www.verify5.com/demo
- 标题: V5验证官网 - 基础套餐免费 - 滑块验证，行为验证，防刷验证 - 在线体验

## 页面结构
- 顶部导航栏：首页、在线体验（当前）、帮助中心、注册、登录
- 主体区域：在线演示卡片
  - 两个标签页：**智能验证** 和 **滑块验证**
  - 每个标签页下有表单（username + password）和验证按钮

## 加载的关键脚本
| 脚本 | 来源 | 作用 |
|------|------|------|
| jquery.min.js | www.verify5.com | jQuery |
| bootstrap.min.js | www.verify5.com | Bootstrap |
| top.js | www.verify5.com | 页面交互 |
| **v5.js** | s.verify5.com | **核心 SDK** |
| keepalive.js | www.verify5.com | Session 保活 |

## 验证码组件特征
- 验证按钮文本: "Click or Tap to Verify"
- CSS 类: `v5-validation-btn`, `v5-logo-icon`, `v5-logo-small`
- 弹窗结构: `.v5-pop > .v5-wrapper > .v5-canvas-img + .v5-slider-bar`
- 滑块按钮: `.v5-slider-button`
- 背景图: `.v5-canvas-bg` (260x160)
- 滑块图: `.v5-canvas-slice` (52x60)

## 验证码框架鉴定
- 厂商: **Verify5 (数美定制版 / V5验证)**
- SDK 版本: **2.6.2**
- 验证方式: 滑块拼图验证码
- 通信方式: WebSocket (`F` transport) 或 iframe POST (`M` transport)
- 加密方案: AES-256-CTR (自定义 CryptoJS 实现)

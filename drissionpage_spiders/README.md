# DrissionPage 新手入门

本目录用一份带详细注释的脚本 [`drissionpage_tutorial.py`](./drissionpage_tutorial.py)
带你从零上手 DrissionPage，覆盖爬虫里最常用的功能。

---

## 一、DrissionPage 是什么

一句话：**把 `requests` 和 `浏览器自动化` 融为一体的 Python 库。**

| 模式 | 对象 | 像谁 | 适合场景 |
|------|------|------|----------|
| 会话模式 | `SessionPage` | requests | 静态页面、直接请求已知 API，速度快 |
| 浏览器模式 | `ChromiumPage` | selenium / playwright | JS 动态页面、要点击/滚动/登录、要听包 |
| 双模 | `WebPage` | 两者皆有 | 先浏览器分析、再切 session 批量抓 |

**怎么选？**

- 页面是死的 / 我只要接口 → `SessionPage`
- 页面是活的 / 要点要滚要等 JS → `ChromiumPage`
- 我先看看再批量抓 → `WebPage`

---

## 二、安装

在项目虚拟环境里安装：

```bash
.venv\Scripts\python.exe -m pip install DrissionPage
```

> 浏览器模式需要本地装有 Chrome 或 Edge，DrissionPage 一般会自动找到。

---

## 三、运行教程

```bash
.venv\Scripts\python.exe drissionpage_spiders\drissionpage_tutorial.py
```

默认会用浏览器模式打开公开练习站 `https://books.toscrape.com/`，演示：定位 → 提取 → 翻页 →
标签页 → 存盘，最后自动关闭浏览器。

> 新手建议先把 [`drissionpage_tutorial.py`](./drissionpage_tutorial.py) 里的 `Config.HEADLESS`
> 保持 `False`，**看着浏览器一步步跑**，跑通后再改成 `True` 无头批量采集。

---

## 四、定位语法速查（最常用的部分）

统一规律：`page.ele(...)` 找**单个**，`page.eles(...)` 找**全部**。

| 写法 | 含义 | 示例 |
|------|------|------|
| `css:` / `c:` | CSS 选择器 | `page.ele('css:h3 a')` |
| `xpath:` / `x:` | XPath | `page.eles('xpath://article[@class="product_pod"]')` |
| `text:` / `t:` | 文本**包含** | `page.ele('text:next')` |
| `text=` | 文本**等于** | `page.ele('text=next')` |
| `@xxx=` / `@xxx:` | 属性**等于/包含** | `page.eles('@class=item')` |
| `tag:` | 按标签名 | `page.ele('tag:article')` |

---

## 五、提取数据速查

```python
ele.text              # 可见文本
ele.attr('href')      # 任意属性
ele.link              # = attr('href')，链接快捷方式
ele.src               # 图片地址快捷方式
ele.inner_html        # 内层 HTML
ele.parent()          # 父元素；.parent(level=2) 往上两级
ele.next() / .prev()  # 下一个 / 上一个兄弟节点
ele.children()        # 所有子元素
ele.ele(...)/.eles()  # 在该元素【内部】继续定位（只搜子树）
```

---

## 六、交互 / 等待速查

```python
ele.click()                  # 点击
ele.input('关键词')          # 输入
ele.clear()                  # 清空
page.scroll.to_bottom()      # 滚到底（触发懒加载）
page.scroll.down(300)        # 按像素滚

page.wait.ele_displayed('css:.box', timeout=10)  # 等元素可见
page.wait.ele_deleted('css:.loading')            # 等元素消失（等加载圈消失）
page.wait.load_start()                           # 等开始加载（确认点击生效）
page.wait.doc_loaded()                           # 等文档加载完成
page.wait(2)                                     # 简单等待 2 秒
```

---

## 七、目录结构

```
drissionpage_spiders/
├── README.md                  ← 你正在看的入门说明
├── drissionpage_tutorial.py   ← 带详细注释的教程脚本（14 个常用功能）
└── output/                    ← 运行后自动生成，存放采集结果 / 下载文件
```

## 八、可扩展参数

所有可调参数集中在 [`drissionpage_tutorial.py`](./drissionpage_tutorial.py) 顶部的 `class Config`：

- 浏览器路径、端口、无头、UA、代理、启动参数
- 翻页/请求节流的随机等待区间（防风控）
- 元素等待超时
- 输出目录

需要换目标站点、加代理、改成无头批量抓时，**只改 `Config` 即可**，无需动函数逻辑。

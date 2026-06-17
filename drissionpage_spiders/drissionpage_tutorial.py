# -*- coding: utf-8 -*-
"""
================================================================================
 DrissionPage 新手入门教程（覆盖爬虫常用功能）
================================================================================

【DrissionPage 是什么】
    DrissionPage 是一个用 Python 写的网页自动化工具。
    它把 "requests（纯接口请求）" 和 "浏览器自动化（带界面/能执行 JS）" 合并在一起，
    你可以在同一个程序里随时切换两种模式，不用再为 "静态页用 requests、动态页用
    selenium" 而写两套代码。

    它最大的特点：
        1. 上手简单 —— 定位元素的语法非常直观（支持 CSS / XPath / 纯文本 / 属性）。
        2. 兼具能力 —— SessionPage（快，像 requests）+ ChromiumPage（强，像浏览器）。
        3. 自带 "听包" 功能 —— 直接拦截浏览器发出的请求/响应，分析接口特别方便。

【环境准备】
    1) 安装库（在项目虚拟环境里执行）：
         .venv\\Scripts\\python.exe -m pip install DrissionPage

    2) 浏览器模式（ChromiumPage / WebPage 的 'd' 模式）需要本地有 Chrome 或 Edge。
       通常 DrissionPage 会自动找到浏览器，找不到时再用 ChromiumOptions 指定路径。

【本文件包含的章节】
    0. 全局配置（可扩展参数集中在这里）
    1. 三种页面模式怎么选：SessionPage / ChromiumPage / WebPage
    2. 访问页面 + 获取标题/源码/URL
    3. 元素定位（CSS / XPath / 文本 / 属性 四种写法）
    4. 提取数据（文本 / 属性 / 链接 / 图片地址 / 内层 HTML）
    5. 批量采集列表（循环定位 + 相对定位 parent/next/child）
    6. 交互操作（点击 / 输入 / 清空 / 滚动）
    7. 等待策略（等元素出现 / 等加载完成 / 防止太快被风控）
    8. Cookie 与 Headers 管理（读取 / 设置 / 跨请求复用）
    9. 代理设置
    10. 标签页（Tab）与 iframe
    11. 监听数据包（听包神器，分析 Ajax 接口）
    12. 文件下载
    13. 异常处理与自动重试
    14. 综合演示 main()

【运行方式】
    只跑综合演示：
        python drissionpage_tutorial.py
    （演示目标使用公开练习站 books.toscrape.com，安全可运行）
================================================================================
"""

# ---------------------------------------------------------------------------
# 导入：DrissionPage 没装时给出清晰提示，而不是一堆红色报错
# ---------------------------------------------------------------------------
try:
    from DrissionPage import (
        ChromiumPage,   # 浏览器模式（驱动真实浏览器）
        ChromiumOptions,# 浏览器启动参数配置
        SessionPage,    # 会话模式（基于 requests，速度快）
        WebPage,        # 双模页面（可在 s/d 两种模式间切换）
    )
except ImportError:
    raise SystemExit(
        "\n[未安装 DrissionPage] 请先执行：\n"
        "    .venv\\Scripts\\python.exe -m pip install DrissionPage\n"
    )

import os
import time
import random
import json
import traceback


# ============================================================================
# 0. 全局配置（把可扩展的参数集中放这里，方便统一修改）
# ============================================================================
class Config:
    """全局配置：所有爬虫参数都在这里集中管理，便于扩展与复用。"""

    # ---- 演示目标（公开的爬虫练习网站，可放心访问）----
    DEMO_URL = "https://books.toscrape.com/"

    # ---- 浏览器相关 ----
    BROWSER_PATH = r"C:\Users\Administrator\AppData\Local\Google\Chrome\Application\chrome.exe"    # Chrome/Edge 可执行文件路径；留空则自动寻找
    USER_DATA_PATH = r""            # 用户数据目录（独立 profile，不污染你的常用浏览器）
    LOCAL_PORT = 9222               # 调试端口；为 0 或用 auto_port 时自动分配
    HEADLESS = False                # 是否无头（无界面）模式；新手调试建议先 False 看着跑
    USER_AGENT = ""                 # 自定义 UA；留空用默认
    SET_ARGUMENTS = [               # 额外的启动参数，按需增删
        "--disable-blink-features=AutomationControlled",  # 去掉 "Chrome正受到自动化软件控制" 提示
        "--no-sandbox",
    ]

    # ---- 网络 ----
    PROXY = ""                      # 代理，如 "http://127.0.0.1:7890"；留空不使用

    # ---- 行为节流（防止请求过快被风控）----
    PAGE_DELAY = (1, 2)             # 每次翻页/请求后的随机等待区间（秒），写成 (min, max)
    TIMEOUT = 10                    # 单个元素等待的超时时间（秒）

    # ---- 输出目录 ----
    OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")


def random_sleep(delay_range=None):
    """在区间内随机睡一会儿，模拟人手操作节奏，降低被风控概率。

    Args:
        delay_range: (min, max) 元组；不传则用 Config.PAGE_DELAY。
    """
    lo, hi = delay_range or Config.PAGE_DELAY
    time.sleep(random.uniform(lo, hi))


# ============================================================================
# 1. 三种页面模式怎么选
# ============================================================================
#   SessionPage   —— 纯 requests，不发浏览器，速度快、资源省。
#                    适合：纯静态页面、或你已经知道接口（API）直接请求的场景。
#   ChromiumPage  —— 驱动真实浏览器，能执行 JS、能点击、能截图。
#                    适合：页面内容由 JS 动态生成、需要登录交互、需要听包。
#   WebPage       —— 同一个对象里同时拥有上面两种能力，可用 change_mode() 切换。
#                    适合：先在浏览器里分析，再切到 session 模式批量请求。
#
#   速记：
#       "页面是死的 / 我只要接口" -> SessionPage
#       "页面是活的 / 要点要滚要等 JS" -> ChromiumPage
#       "我先看看再批量抓"          -> WebPage
# ============================================================================

def make_chromium_options():
    """构建浏览器启动配置（ChromiumOptions），把所有可扩展参数集中在这里。

    修改 Config 里的字段，这里会自动生效。
    """
    co = ChromiumOptions()

    # 浏览器路径：配置了才设置，否则交给 DrissionPage 自动寻找
    if Config.BROWSER_PATH:
        co.set_browser_path(Config.BROWSER_PATH)

    # 用户数据目录：隔离 profile，避免影响日常浏览器
    if Config.USER_DATA_PATH:
        co.set_user_data_path(Config.USER_DATA_PATH)

    # 调试端口
    if Config.LOCAL_PORT:
        co.set_local_port(Config.LOCAL_PORT)
    else:
        co.auto_port()  # 自动找一个空闲端口，适合多开

    # 无头模式
    co.headless(Config.HEADLESS)

    # 自定义 UA
    if Config.USER_AGENT:
        co.set_user_agent(Config.USER_AGENT)

    # 代理
    if Config.PROXY:
        co.set_proxy(Config.PROXY)

    # 追加启动参数
    for arg in Config.SET_ARGUMENTS:
        co.set_argument(arg)

    return co


def make_browser_page():
    """创建一个【浏览器模式】页面（ChromiumPage）。"""
    page = ChromiumPage(co=make_chromium_options())
    return page


def make_session_page():
    """创建一个【会话模式】页面（SessionPage，基于 requests）。

    SessionPage 没有 set_argument / headless 这些概念，它的配置方式是
    page.set.headers(...) / page.set.cookies(...) / page.set.proxies(...)。
    """
    page = SessionPage()
    if Config.PROXY:
        page.set.proxies({"http": Config.PROXY, "https": Config.PROXY})
    return page


# ============================================================================
# 2. 访问页面 + 获取基本信息
# ============================================================================
def open_page(page, url):
    """访问指定 URL，并打印标题、当前 URL。

    page.get(url) 返回的就是 page 本身，可链式调用。
    """
    page.get(url)
    # ChromiumPage 有 .title；SessionPage 没有 title 概念，用 html 解析也行
    title = getattr(page, "title", "(session 模式无 title)")
    print(f"[访问完成] {url}\n  标题: {title}\n  当前URL: {page.url}")
    return page


# ============================================================================
# 3. 元素定位（DrissionPage 最核心、最舒服的部分）
# ============================================================================
# 统一规律：page.ele(...) 找【单个】，page.eles(...) 找【全部】。
# 定位语法（在字符串里加前缀告诉它用什么方式找）：
#   'css:div.box'         或简写 'c:div.box'   -> CSS 选择器
#   'xpath://div[@class]' 或简写 'x://div'     -> XPath
#   'text:你好'          或简写 't:你好'        -> 文本【包含】"你好"
#   'text=你好'                                  -> 文本【等于】"你好"
#   '@class=box'          或简写 '@class:box'  -> 属性 class【等于/包含】box
#   'tag:div'                                  -> 只按标签名找
#
# 小技巧：DrissionPage 的定位语法可以直接混写，例如
#   page.ele('tag:article@class=product_pod')  标签 article 且 class 为 product_pod
# ============================================================================
def demo_locate(page):
    """演示四种定位方式（用 books.toscrape.com 的书籍卡片做例子）。"""

    # 1) CSS 选择器：找第一本书的标题
    title_ele = page.ele("css:h3 a")          # h3 下面的 a 标签
    print("[CSS] 第一本书标题:", title_ele.text)

    # 2) XPath：取所有书籍的标题链接
    titles = page.eles("xpath://article[@class='product_pod']//h3/a")
    print(f"[XPath] 本页共找到 {len(titles)} 本书")

    # 3) 纯文本：找到页面上包含某个文本的元素
    next_btn = page.ele("text:next")          # "next" 按钮
    print("[文本] 找到翻页按钮:", next_btn is not None)

    # 4) 属性：找所有带 title 属性的链接
    links = page.eles("@title")               # 所有有 title 属性的元素
    print(f"[属性] 带标题提示的元素 {len(links)} 个")


# ============================================================================
# 4. 提取数据
# ============================================================================
def extract_one_item(card_ele):
    """从【单个书籍卡片】元素里提取结构化数据。

    演示如何从元素里取：文本 / 属性 / 链接 / 图片地址 / 内层HTML。
    相对定位：在 card_ele 内部继续 .ele()，只会搜它子节点，不会搜整页。
    """
    item = {
        # .text           -> 元素的可见文本
        "title": card_ele.ele("css:h3 a").attr("title"),  # 这里用 attr 取提示文字更全
        # .attr('href')   -> 取任意属性；.link 是 href 的快捷方式
        "url": card_ele.ele("css:h3 a").link,
        # 取价格、库存
        "price": card_ele.ele("css:.price_color").text,
        "stock": card_ele.ele("css:.instock").text.strip(),
        # .src / .link / .text 都是常用快捷属性；这里取封面图地址
        "cover": card_ele.ele("css:.thumbnail").attr("src"),
    }
    return item


def demo_extract(page):
    """演示批量提取：遍历每一张卡片，调用 extract_one_item。"""
    cards = page.eles("css:article.product_pod")
    print(f"[提取] 本页卡片数: {len(cards)}")
    results = []
    for card in cards:
        results.append(extract_one_item(card))
    # 打印前两本看看
    for r in results[:2]:
        print("  -", json.dumps(r, ensure_ascii=False))
    return results


# ============================================================================
# 5. 相对定位（parent / next / prev / child）—— 在不重写选择器时定位"邻居"
# ============================================================================
def demo_relative(page):
    """演示相对定位：找到标题，再取它的"父级"、"下一个兄弟"。"""
    price_ele = page.ele("css:.price_color")
    # .parent()  -> 父元素；.parent(level=2) 往上两级
    parent = price_ele.parent()
    print("[相对] 价格的父元素 class =", parent.attr("class"))
    # .next()    -> 下一个兄弟节点（常用于表格/列表逐项读取）
    nxt = price_ele.next()
    print("[相对] 价格后面的兄弟文本 =", repr(nxt.text))


# ============================================================================
# 6. 交互操作：点击 / 输入 / 清空 / 滚动
# ============================================================================
def demo_interact(page):
    """演示点击翻页与滚动页面。

    注意：演示站可点击 next 翻页；如果你的目标是"点击触发加载更多"，
    思路一样：先定位按钮 -> .click() -> 等待新内容出现。
    """
    # 滚动到底部（让懒加载的图片/内容加载出来）
    page.scroll.to_bottom()
    random_sleep()

    # 也可以按像素滚：page.scroll.down(300) / up / to_top / to_location(y)
    page.scroll.to_top()

    # 输入框示例（本演示站没有搜索框，这里只演示标准用法）：
    #   search_box = page.ele('css:#input')
    #   search_box.input('关键词')      # 输入
    #   search_box.clear()              # 清空
    #   search_box.input('新词', by_js=False)
    print("[交互] 已演示 滚动 到底部/顶部；点击翻页见 demo_pagination()")


def demo_pagination(page):
    """演示点击 "next" 按钮翻页。"""
    next_btn = page.ele("text:next")
    if next_btn is None:
        print("[翻页] 没找到 next 按钮")
        return
    before = page.url
    next_btn.click()
    random_sleep()
    print(f"[翻页] 点击前: {before}\n  点击后: {page.url}")


# ============================================================================
# 7. 等待策略
# ============================================================================
# 为什么需要等待？
#   浏览器模式里，点击 / 翻页后页面要时间加载，直接去找元素可能找不到。
#   page.wait 提供了一组显式等待，比 time.sleep 更稳。
# ============================================================================
def demo_wait(page):
    """演示常用等待。

    page.wait.ele_displayed(locator)  -> 等元素【出现并可见】
    page.wait.ele_deleted(locator)    -> 等元素【消失】（常用于等遮罩/加载圈消失）
    page.wait.load_start()            -> 等【开始】加载（确认点击生效）
    page.wait.doc_loaded()            -> 等【文档】加载完成
    page.wait(seconds)                -> 简单等待 N 秒
    """
    # 等第一本书出现，最多等 Config.TIMEOUT 秒
    appeared = page.wait.ele_displayed("css:article.product_pod", timeout=Config.TIMEOUT)
    print(f"[等待] 书籍卡片是否出现: {appeared}")


# ============================================================================
# 8. Cookie 与 Headers 管理
# ============================================================================
def demo_cookies_headers(page):
    """读取/设置 Cookie 与 Headers。

    典型用法：先在浏览器里手动登录，再用 page.cookies() 把登录态取出来，
    存成文件；下次直接 page.set.cookies(...) 注入，免去重复登录。
    """
    # 读取（as_dict=True 返回字典，as_str=True 返回可直接放进 Header 的字符串）
    cookies = page.cookies(as_dict=True)
    print(f"[Cookie] 当前 Cookie 数量: {len(cookies)}")

    # 设置（演示：先取出再原样设回去）
    # page.set.cookies(cookies)

    # 自定义 Headers（SessionPage 尤其常用）
    # page.set.headers({'Referer': 'https://books.toscrape.com/', 'Accept-Language': 'zh-CN'})

    # 保存到本地，下次复用（示例，真正用的时候再取消注释）：
    # with open('cookies.json', 'w', encoding='utf-8') as f:
    #     json.dump(cookies, f, ensure_ascii=False, indent=2)


# ============================================================================
# 9. 代理设置（浏览器模式在 make_chromium_options 里已演示，这里补 session 模式）
# ============================================================================
def demo_proxy_session():
    """SessionPage 设置代理的写法（浏览器代理见 make_chromium_options）。"""
    page = SessionPage()
    if Config.PROXY:
        page.set.proxies({"http": Config.PROXY, "https": Config.PROXY})
    # page.set.headers({...})  # 同时可设 UA / Referer 等
    return page


# ============================================================================
# 10. 标签页（Tab）与 iframe
# ============================================================================
def demo_tab(page):
    """演示新建标签页、切换标签页。

    page.new_tab(url)   -> 新开标签页并访问 url，返回该 Tab 对象
    page.get_tabs()     -> 获取所有标签页
    page.latest_tab     -> 最近打开的标签页
    tab.close()         -> 关闭标签页
    """
    # 演示站打开一本书的详情页
    first_book_link = page.ele("css:article.product_pod h3 a")
    if first_book_link is not None:
        detail_tab = page.new_tab(first_book_link.link)
        print(f"[标签页] 详情页标题: {detail_tab.title}")
        detail_tab.close()


def demo_iframe(page):
    """演示进入 iframe 操作。

    DrissionPage 的 iframe 处理非常省心：直接用 get_frame() 拿到 frame 对象，
    然后就把它当一个【子页面】用，ele/scroll 全都一样。
    """
    # 写法示例（演示站没有 iframe，这里仅给模板）：
    #   frame = page.get_frame('css:iframe#ifr')   # 或 '@name=xxx'
    #   text = frame.ele('tag:p').text
    print("[iframe] 演示站无 iframe，模板见函数注释")


# ============================================================================
# 11. 监听数据包（听包神器）—— 分析 Ajax 接口的利器
# ============================================================================
# 当目标网站的数据是通过 JS 请求某个接口（返回 JSON）渲染时，
# 与其去解析渲染后的 HTML，不如直接 "听" 到那个接口的请求与响应。
#
# 三步走：
#   1) page.listen.start('关键词')   -> 开始监听 URL 里包含该关键词的请求
#   2) 触发操作（点击/滚动/翻页）
#   3) packet = page.listen.wait()   -> 拿到一个监听到的包
#      packet.url                  -> 请求 URL
#      packet.request.postData     -> 请求体（POST 参数）
#      packet.request.headers      -> 请求头
#      packet.response.body        -> 响应体（通常是 dict 或 str）
# ============================================================================
def demo_listen(page):
    """演示听包流程（演示站是服务端渲染、无明显 Ajax，这里给通用模板）。"""
    # page.listen.start('api/data')            # 监听 URL 含 'api/data' 的请求
    # page.ele('text:加载更多').click()          # 触发请求
    # packet = page.listen.wait(timeout=10)    # 等待包到来
    # if packet:
    #     data = packet.response.body          # 一般就是 dict
    #     print(data)
    # page.listen.stop()                       # 停止监听
    print("[听包] 演示站无 Ajax，通用模板见函数注释")


# ============================================================================
# 12. 文件下载
# ============================================================================
def demo_download(page):
    """下载封面图到本地。

    page.download(url, save_path, rename, ...) 直接下载，支持断点续传、
    大文件分块，比手写 requests 流式下载省事。
    """
    os.makedirs(Config.OUTPUT_DIR, exist_ok=True)
    cover_url = page.ele("css:article.product_pod img").src
    # src 取到的可能是相对路径，补全
    if cover_url and not cover_url.startswith("http"):
        cover_url = "https://books.toscrape.com/" + cover_url.lstrip("./")
    # 注意：演示站服务器有限流，大量下载请加 sleep；这里只示意一张
    # file_path = page.download(cover_url, save_path=Config.OUTPUT_DIR, rename="cover")
    # print("[下载] 已保存:", file_path)
    print(f"[下载] 示例图片地址: {cover_url}（取消注释即可下载到 {Config.OUTPUT_DIR}）")


# ============================================================================
# 13. 异常处理与自动重试（生产环境必备）
# ============================================================================
def with_retry(func, args=(), retries=3, backoff=1.5):
    """对一个函数做自动重试，失败后退避（backoff）越来越久。

    Args:
        func:    要执行的函数（无参或参数放 args）
        args:    传给 func 的位置参数元组
        retries: 最大重试次数
        backoff: 每次重试等待时间 = (重试次数序号) * backoff，线性退避
    """
    last_err = None
    for i in range(1, retries + 1):
        try:
            return func(*args)
        except Exception as e:                       # noqa: BLE001 教程统一兜底
            last_err = e
            print(f"[重试] 第 {i}/{retries} 次失败: {e}")
            time.sleep(i * backoff)
    raise RuntimeError(f"重试 {retries} 次后仍失败") from last_err


def demo_error_handling():
    """演示：把一个会抛错的调用包进重试里。"""
    def flaky():
        if random.random() < 0.7:
            raise ValueError("模拟偶发失败")
        return "成功"

    # 用 try/except 包住，避免整个程序挂掉
    try:
        result = with_retry(flaky, retries=4)
        print("[重试] 最终结果:", result)
    except Exception as e:                           # noqa: BLE001
        print("[重试] 仍然失败:", e)


# ============================================================================
# 14. 综合演示 main()
# ============================================================================
def main():
    """综合演示：用浏览器模式打开练习站 -> 定位 -> 提取 -> 翻页 -> 关闭。

    新手建议：先 Config.HEADLESS=False 看着浏览器一步步跑，
    跑通后再改成 True 无头批量采集。
    """
    page = make_browser_page()
    try:
        # ① 打开页面并等待关键元素
        page.get(Config.DEMO_URL)
        page.wait.ele_displayed("css:article.product_pod", timeout=Config.TIMEOUT)

        # ② 定位演示
        demo_locate(page)

        # ③ 提取本页全部书籍
        results = demo_extract(page)

        # ④ 相对定位 / 等待 / 交互演示
        demo_relative(page)
        demo_wait(page)
        demo_interact(page)

        # ⑤ Cookie / Tab 演示
        demo_cookies_headers(page)
        demo_tab(page)

        # ⑥ 把第一页结果存盘
        os.makedirs(Config.OUTPUT_DIR, exist_ok=True)
        out_file = os.path.join(Config.OUTPUT_DIR, "books_demo.json")
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        print(f"\n[完成] 第一页 {len(results)} 本书已保存到: {out_file}")

    except Exception:
        # 兜底：把完整错误栈打出来，便于排错
        traceback.print_exc()
    finally:
        # 无论成功失败都关闭浏览器，养成好习惯
        page.quit()
        print("[结束] 浏览器已关闭")


# ============================================================================
# 入口
# ============================================================================
if __name__ == "__main__":
    main()

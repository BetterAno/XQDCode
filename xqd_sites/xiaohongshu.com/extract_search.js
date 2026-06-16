// === 小红书搜索结果提取脚本（含笔记ID、详情链接、点赞数等） ===
// 使用方法:
//   1. 浏览器打开 https://www.xiaohongshu.com/search_result?keyword=关键词&source=web_search_result_notes
//   2. 等页面加载完毕后，F12 打开控制台
//   3. 粘贴本脚本运行 → 自动滚动加载 + 提取 + 下载JSON
//
// 说明: 小红书搜索结果为瀑布流，下滑触发接口增量加载（与抖音一致），无翻页。
// ⚠️ 详情链接需携带 xsec_token 票据，否则无法打开笔记详情页。
// ⚠️ 使用前请修改下方 KEYWORD 变量（或保持 __KEYWORD__ 由程序替换）

(async function extractXiaohongshuSearch() {
  // ========== 配置 ==========
  const KEYWORD = '__KEYWORD__';            // 会被 Python 自动替换为搜索关键词
  const MAX_SCROLL_ROUNDS = __MAX_PAGES__;  // 由 Python 替换，最大滚动轮数（每轮一次到底）
  const SCROLL_DELAY = 3000;                // 每轮滚动后等待接口返回（毫秒）
  const MAX_NO_NEW = 3;                     // 连续多少轮无新增则认为到底，停止
  // ==========================

  console.log(`🔍 开始提取小红书搜索数据 [关键词: ${KEYWORD}]...`);

  const seen = new Set();
  const items = [];

  // 提取当前已渲染的全部笔记卡片
  function extractCards() {
    const cards = document.querySelectorAll('section.note-item');
    let newCount = 0;

    cards.forEach((card) => {
      // 详情链接（优先 title 链接，其携带 xsec_token 票据；兜底 cover/隐藏 explore 链接）
      const linkEl =
        card.querySelector('a.title[href*="/search_result/"]') ||
        card.querySelector('a[href*="/search_result/"]') ||
        card.querySelector('a[href*="/explore/"]');
      if (!linkEl) return;

      const href = linkEl.getAttribute('href') || '';
      const idMatch = href.match(/(?:search_result|explore)\/([0-9a-fA-F]{16,32})/);
      if (!idMatch) return;

      const noteId = idMatch[1];
      if (seen.has(noteId)) return;
      seen.add(noteId);
      newCount++;

      // 标题（去 emoji 包裹与多余空白）
      const titleEl = card.querySelector('.footer .title') || card.querySelector('.title');
      const title = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';

      // 作者
      const authorEl = card.querySelector('.author .name');
      const author = authorEl ? authorEl.textContent.trim() : '';

      // 时间
      const timeEl = card.querySelector('.author .time');
      const time = timeEl ? timeEl.textContent.trim() : '';

      // 点赞数（含数字才保留；点赞为 0 时会显示引导文字「赞」，需过滤）
      const likeEl = card.querySelector('.like-wrapper .count');
      let likeCount = likeEl ? likeEl.textContent.trim() : '';
      if (likeCount && !/\d/.test(likeCount)) likeCount = '';

      // 笔记类型：有播放图标 → 视频，否则图文
      const type = card.querySelector('.play-icon, [class*="play-icon"]') ? '视频' : '图文';

      // 封面图（清理 xhs 处理后缀 !nc_n_webp_mw_1 → 得到原图）
      const img = card.querySelector('a.cover img, img[src*="xhscdn"], img[src*="sns-webpic"]');
      let image = '';
      if (img) {
        image = img.src || img.getAttribute('data-src') || '';
        if (image.startsWith('//')) image = 'https:' + image;
        image = image.replace(/!\w+.*$/, '');  // 去掉 !nc_n_webp_mw_1 等
      }

      // 详情页链接（补全为绝对地址，保留 xsec_token）
      let detailUrl = href;
      if (detailUrl.startsWith('/')) detailUrl = location.origin + detailUrl;

      items.push({
        noteId,
        title,
        author,
        time,
        likeCount,
        type,
        detailUrl,
        image,
      });
    });
    return newCount;
  }

  // 增量滚动加载
  function scrollToBottom() {
    // 主滚动在 window；同时兜底滚动可能的内容容器
    window.scrollTo(0, document.body.scrollHeight);
    try {
      const scroller = document.querySelector('[class*="feeds-container"]');
      if (scroller) scroller.scrollTop = scroller.scrollHeight;
    } catch (e) {}
  }

  // 首屏提取
  extractCards();
  console.log(`  首屏: 累计 ${items.length} 条`);

  // 增量滚动
  let noNew = 0;
  for (let round = 1; round <= MAX_SCROLL_ROUNDS; round++) {
    const before = items.length;
    scrollToBottom();
    await new Promise(r => setTimeout(r, SCROLL_DELAY));

    // 滚动后再次提取（已渲染的新卡片）
    const added = extractCards();
    console.log(`  第${round}轮: 新增 ${added} 条，累计 ${items.length} 条`);

    if (items.length === before) {
      noNew++;
      if (noNew >= MAX_NO_NEW) {
        console.log(`  连续 ${MAX_NO_NEW} 轮无新增，判定到底`);
        break;
      }
    } else {
      noNew = 0;
    }
  }

  if (items.length === 0) {
    console.log('❌ 未提取到数据，请确认页面已加载搜索结果');
    return;
  }

  // 下载 JSON
  const dateStr = new Date().toISOString().slice(0, 10);
  const safeKeyword = KEYWORD.replace(/[^\w一-鿿]/g, '_');
  const filename = `${safeKeyword}_xiaohongshu_${dateStr}.json`;

  const json = JSON.stringify(items, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);

  console.log(`\n✅ 提取完成！共 ${items.length} 条`);
  console.log(`💾 已保存: ${filename}`);
  console.table(items.slice(0, 5).map(i => ({
    笔记ID: i.noteId,
    作者: i.author,
    标题: i.title.substring(0, 30),
    点赞: i.likeCount || '(无)',
    类型: i.type,
  })));
})();

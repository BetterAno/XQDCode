// === B站搜索结果提取脚本（含视频BV号、详情链接、播放量等） ===
// 使用方法:
//   1. 浏览器打开 https://search.bilibili.com/all?keyword=关键词
//   2. 等页面加载完毕后，F12 打开控制台
//   3. 粘贴本脚本运行 → 自动翻页加载 + 提取 + 下载JSON
//
// ⚠️ 使用前请修改下方 KEYWORD 变量（或保持 __KEYWORD__ 由程序替换）

(async function extractBilibiliSearch() {
  // ========== 配置 ==========
  const KEYWORD = '__KEYWORD__';  // 会被 Python 自动替换为搜索关键词
  const MAX_PAGES = __MAX_PAGES__;  // 最多采集页数（由 Python 替换）
  const PAGE_DELAY = 2000;        // 翻页等待时间（毫秒）
  // ==========================

  console.log(`🔍 开始提取B站搜索数据 [关键词: ${KEYWORD}]...`);

  const seen = new Set();
  const items = [];

  // 提取当前页数据
  function extractCurrentPage() {
    const cards = document.querySelectorAll('.bili-video-card');
    let newCount = 0;

    cards.forEach(card => {
      const wrap = card.querySelector('.bili-video-card__wrap');
      if (!wrap) return;

      // 标题（title 属性包含纯净文本，无 <em> 高亮标签）
      const titEl = wrap.querySelector('.bili-video-card__info--tit');
      if (!titEl) return;
      const title = titEl.getAttribute('title') || titEl.textContent.replace(/\s+/g, ' ').trim();

      // BV号 & 详情链接
      const parentA = titEl.closest('a');
      const href = parentA ? parentA.href : '';

      // 跳过广告（cm.bilibili.com）
      if (href.includes('cm.bilibili.com')) return;

      const bvMatch = href.match(/(BV\w+)/);
      if (!bvMatch) return;
      const videoId = bvMatch[1];

      // 去重
      if (seen.has(videoId)) return;
      seen.add(videoId);

      // 作者 & 发布日期
      const ownerEl = wrap.querySelector('.bili-video-card__info--owner');
      const ownerText = ownerEl ? ownerEl.textContent.trim() : '';
      let author = ownerText;
      let publishDate = '';
      if (ownerText.includes('·')) {
        const parts = ownerText.split('·');
        author = parts[0].trim();
        publishDate = parts.slice(1).join('·').trim();
      }

      // 封面图（去掉 @ 后面的缩略图后缀）
      const img = card.querySelector('.bili-video-card__image img');
      const imgSrc = img ? (img.src || img.getAttribute('data-src') || '') : '';
      const image = imgSrc.replace(/@.+$/, '');

      // 播放量 & 弹幕数
      const statsItems = wrap.querySelectorAll('.bili-video-card__stats--item');
      let playCount = '';
      let danmaku = '';
      if (statsItems.length >= 1) playCount = statsItems[0].textContent.trim();
      if (statsItems.length >= 2) danmaku = statsItems[1].textContent.trim();

      // 时长
      const durationEl = wrap.querySelector('.bili-video-card__stats__duration');
      const duration = durationEl ? durationEl.textContent.trim() : '';

      const detailUrl = `https://www.bilibili.com/video/${videoId}/`;

      items.push({
        videoId,
        title,
        author,
        publishDate,
        detailUrl,
        image,
        playCount,
        danmaku,
        duration,
      });

      newCount++;
    });

    return newCount;
  }

  // === 第 1 页 ===
  let newCount = extractCurrentPage();
  console.log(`  第1页: 提取 ${newCount} 条视频 (累计 ${items.length})`);

  // === 翻页采集 ===
  for (let page = 2; page <= MAX_PAGES; page++) {
    // 点击下一页按钮
    const nextBtn = document.querySelector('.vui_pagenation--btn-side:last-child:not([disabled])');
    if (!nextBtn) {
      console.log(`  第${page}页: 无下一页按钮或已禁用，停止翻页`);
      break;
    }

    nextBtn.click();
    await new Promise(r => setTimeout(r, PAGE_DELAY));

    // 等待新内容加载
    try {
      await new Promise((resolve, reject) => {
        const observer = new MutationObserver((mutations, obs) => {
          obs.disconnect();
          resolve();
        });
        const cardList = document.querySelector('.video-list');
        if (cardList) {
          observer.observe(cardList, { childList: true, subtree: true });
          setTimeout(() => { observer.disconnect(); resolve(); }, 5000);
        } else {
          resolve();
        }
      });
    } catch(e) {}

    newCount = extractCurrentPage();
    console.log(`  第${page}页: 提取 ${newCount} 条视频 (累计 ${items.length})`);

    if (newCount === 0) {
      console.log('  无新数据，停止翻页');
      break;
    }
  }

  if (items.length === 0) {
    console.log('❌ 未提取到数据，请确认页面已加载搜索结果');
    return;
  }

  // 下载 JSON
  const dateStr = new Date().toISOString().slice(0, 10);
  const safeKeyword = KEYWORD.replace(/[^\w一-鿿]/g, '_');
  const filename = `${safeKeyword}_bilibili_${dateStr}.json`;

  const json = JSON.stringify(items, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);

  console.log(`\n✅ 提取完成！共 ${items.length} 条`);
  console.log(`💾 已保存: ${filename}`);
  console.log(`\n后续步骤:`);
  console.log(`  1. 将 ${filename} 移到项目目录`);
  console.log(`  2. 运行截图: python src/bilibili_search.py --screenshot ${filename}`);
  console.log(`  3. 生成XLSX: python src/bilibili_search.py --to-xlsx ${filename}`);
  console.table(items.slice(0, 5).map(i => ({
    BV号: i.videoId,
    作者: i.author,
    标题: i.title.substring(0, 35),
    播放: i.playCount,
    弹幕: i.danmaku,
    时长: i.duration,
  })));
})();

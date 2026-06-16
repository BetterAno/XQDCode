// === 抖音搜索结果提取脚本（含视频ID、详情链接） ===
// 使用方法:
//   1. 浏览器打开 https://www.douyin.com/search/关键词
//   2. 等页面加载完毕后，F12 打开控制台
//   3. 粘贴本脚本运行 → 自动滚动加载 + 提取 + 下载JSON
//
// ⚠️ 使用前请修改下方 KEYWORD 变量（或保持 __KEYWORD__ 由程序替换）

(async function extractDouyinSearch() {
  // ========== 配置 ==========
  const KEYWORD = '__KEYWORD__';  // 会被 Python 自动替换为搜索关键词
  const MAX_SCROLL_ROUNDS = __MAX_PAGES__;  // 由 Python 替换
  const SCROLL_DELAY = 6000;
  // ==========================

  console.log(`🔍 开始提取抖音搜索数据 [关键词: ${KEYWORD}]...`);

  const seen = new Set();

  // 增量滚动加载
  let lastCount = 0;
  for (let round = 0; round < MAX_SCROLL_ROUNDS; round++) {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, SCROLL_DELAY));
    const fresh = document.querySelectorAll('[class*="search-result-card"] img[src*="douyinpic"]');
    if (fresh.length === lastCount && round > 1) break;
    console.log(`  第${round + 1}轮: 已加载 ${fresh.length} 条视频...`);
    lastCount = fresh.length;
  }

  const items = [];
  const cards = document.querySelectorAll('[class*="search-result-card"]');

  cards.forEach((card) => {
    // 跳过非视频卡片
    const img = card.querySelector('img[src*="douyinpic"]');
    if (!img) return;

    let videoId = '';
    let title = '';
    let author = '';
    let detailUrl = '';
    let image = img.src || '';

    // 方式1: 从React Fiber提取（最完整）
    // 每个元素的__reactFiber$后缀不同，必须在当前元素上查找
    const fk = Object.keys(card).find(k => k.startsWith('__reactFiber$'));
    if (fk && card[fk]) {
      let current = card[fk];
      let depth = 0;
      while (current && depth < 10) {
        const props = current.memoizedProps;
        if (props && props.data && props.data.awemeInfo) {
          const info = props.data.awemeInfo;
          videoId = info.awemeId || '';
          title = (info.desc || info.itemTitle || '').replace(/\n/g, ' ');
          author = info.authorInfo?.nickname || '';
          if (videoId) detailUrl = 'https://www.douyin.com/video/' + videoId;
          break;
        }
        current = current.return;
        depth++;
      }
    }

    // 去重
    if (!videoId) {
      const coverKey = img.src.split('~')[0];
      if (seen.has(coverKey)) return;
      seen.add(coverKey);
    } else {
      if (seen.has(videoId)) return;
      seen.add(videoId);
    }

    // 方式2: Fiber提取失败时，从DOM叶子节点兜底
    if (!title || !author) {
      const leafTexts = [];
      const walk = (el) => {
        if (el.children.length === 0 && el.textContent.trim()) {
          leafTexts.push(el.textContent.trim());
        } else {
          for (const child of el.children) walk(child);
        }
      };
      walk(card);

      if (!title) title = (leafTexts[2] || '').replace(/\n/g, ' ');
      if (!author) {
        for (let i = 3; i < leafTexts.length; i++) {
          if (leafTexts[i] === '@' && leafTexts[i + 1]) {
            author = leafTexts[i + 1];
            break;
          }
        }
      }
    }

    if (!videoId) return; // 无法获取视频ID则跳过

    items.push({
      videoId: videoId,
      title: title,
      author: author,
      detailUrl: detailUrl,
      image: image,
    });
  });

  if (items.length === 0) {
    console.log('❌ 未提取到数据');
    return;
  }

  // 下载 JSON
  const dateStr = new Date().toISOString().slice(0, 10);
  const safeKeyword = KEYWORD.replace(/[^\w一-鿿]/g, '_');
  const filename = `${safeKeyword}_douyin_${dateStr}.json`;

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
    视频ID: i.videoId,
    作者: i.author,
    标题: i.title.substring(0, 30),
    详情链接: i.detailUrl,
    封面图: i.image.substring(0, 50),
  })));
})();

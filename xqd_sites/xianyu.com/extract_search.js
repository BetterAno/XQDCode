// === 闲鱼搜索结果提取脚本（含翻页） ===
// 使用方法:
//   1. 浏览器打开 https://www.goofish.com/search?q=关键词
//   2. 等页面加载完毕后，F12 打开控制台
//   3. 粘贴本脚本运行 → 自动翻页 + 提取 + 下载JSON
//
// ⚠️ 使用前请确保已登录闲鱼（未登录搜索无结果）

(async function extractXianyuSearch() {
  // ========== 配置 ==========
  const KEYWORD = '__KEYWORD__';  // 会被 Python 自动替换为搜索关键词
  const MAX_PAGES = __MAX_PAGES__;  // 由 Python 替换
  const PAGE_LOAD_DELAY = 3000;   // 翻页后等待加载（毫秒）
  // ==========================

  console.log(`🔍 开始提取闲鱼搜索数据 [关键词: ${KEYWORD}]...`);

  const seen = new Set();
  const items = [];

  // 占位图特征（懒加载未完成时的 2x2 透明图）
  const PLACEHOLDER_PATTERNS = ['tps-2-2', 'placeholder', 'default-avatar', '1x1'];

  // 滚动页面触发图片懒加载
  async function scrollForLazyLoad() {
    const scrollStep = 600;
    const totalHeight = document.body.scrollHeight;
    for (let y = 0; y < totalHeight; y += scrollStep) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 150));
    }
    // 滚回顶部
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 500));
  }

  // 判断图片是否为占位图
  function isPlaceholder(imgUrl) {
    if (!imgUrl || imgUrl.length < 20) return true;
    return PLACEHOLDER_PATTERNS.some(p => imgUrl.includes(p));
  }

  // 提取当前页面的所有商品卡片
  function extractCurrentPage() {
    const cards = document.querySelectorAll('[class*="feeds-item-wrap"]');
    let added = 0;

    cards.forEach(card => {
      const href = card.getAttribute('href') || '';
      const idMatch = href.match(/[?&]id=(\d+)/);
      const itemId = idMatch ? idMatch[1] : '';

      if (!itemId || seen.has(itemId)) return;
      seen.add(itemId);

      // 标题
      const titleEl = card.querySelector('[class*="main-title"]');
      const title = (titleEl?.textContent?.trim() || '').replace(/\n/g, ' ');

      // 价格
      const priceNum = card.querySelector('[class*="price-wrap"] [class*="number"]')?.textContent?.trim() || '';
      const priceDec = card.querySelector('[class*="price-wrap"] [class*="decimal"]')?.textContent?.trim() || '';
      const price = priceNum + priceDec;

      // 想要人数（仅匹配"X人想要"模式）
      const wantEl = card.querySelector('[class*="price-desc"] [class*="text"]');
      const wantTextRaw = wantEl?.textContent?.trim() || '';
      const wantMatch = wantTextRaw.match(/(\d+)人想要/);
      const wantCount = wantMatch ? wantMatch[1] + '人想要' : '';

      // 卖家/地区
      const sellerEl = card.querySelector('[class*="seller-text"]');
      const sellerText = sellerEl?.textContent?.trim() || '';

      // 图片（过滤占位图）
      const img = card.querySelector('img[class*="feeds-image"]');
      let image = img?.getAttribute('src') || img?.src || '';
      if (image.startsWith('//')) image = 'https:' + image;
      if (isPlaceholder(image)) image = '';

      // 详情链接（保留 categoryId 参数）
      let detailUrl = href;
      if (detailUrl.startsWith('/')) detailUrl = 'https://www.goofish.com' + detailUrl;

      items.push({
        itemId: itemId,
        title: title,
        price: price,
        wantCount: wantCount,
        sellerText: sellerText,
        detailUrl: detailUrl,
        image: image,
      });
      added++;
    });

    return added;
  }

  // === 第 1 页提取 ===
  console.log('  第1页: 滚动触发图片懒加载...');
  await scrollForLazyLoad();
  let added = extractCurrentPage();
  console.log(`  第1页: 提取 ${added} 条商品`);

  // === 翻页提取 ===
  for (let page = 2; page <= MAX_PAGES; page++) {
    // 查找下一页按钮（右箭头）
    const nextArrow = document.querySelector(
      '[class*="pagination-arrow-right"]'
    );
    if (!nextArrow) {
      console.log(`  第${page}页: 未找到下一页按钮，停止`);
      break;
    }

    // 检查下一页按钮是否被禁用（父按钮有 disabled 属性）
    const parentBtn = nextArrow.closest('button');
    if (parentBtn && parentBtn.disabled) {
      console.log(`  第${page}页: 已到最后一页，停止`);
      break;
    }

    // 点击下一页
    nextArrow.click();
    await new Promise(r => setTimeout(r, PAGE_LOAD_DELAY));

    // 滚动触发懒加载
    console.log(`  第${page}页: 滚动触发图片懒加载...`);
    await scrollForLazyLoad();

    added = extractCurrentPage();
    console.log(`  第${page}页: 提取 ${added} 条商品`);
    if (added === 0 && page > 2) {
      console.log('  连续无新增，停止翻页');
      break;
    }
  }

  if (items.length === 0) {
    console.log('❌ 未提取到数据，请确认已登录闲鱼');
    return;
  }

  // 下载 JSON
  const dateStr = new Date().toISOString().slice(0, 10);
  const safeKeyword = KEYWORD.replace(/[^\w一-鿿]/g, '_');
  const filename = `${safeKeyword}_xianyu_${dateStr}.json`;

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
    商品ID: i.itemId,
    标题: i.title.substring(0, 30),
    价格: i.price,
    想要: i.wantCount,
    地区: i.sellerText,
  })));
})();

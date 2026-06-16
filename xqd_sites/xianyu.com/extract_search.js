// === 闲鱼搜索结果提取脚本（含商品ID、详情链接） ===
// 使用方法:
//   1. 浏览器打开 https://www.goofish.com/search?q=关键词
//   2. 等页面加载完毕后，F12 打开控制台
//   3. 粘贴本脚本运行 → 自动翻页采集 + 下载JSON
//
// ⚠️ 使用前请修改下方 KEYWORD 变量（或保持 __KEYWORD__ 由程序替换）

(async function extractXianyuSearch() {
  // ========== 配置 ==========
  const KEYWORD = '__KEYWORD__';  // 会被 Python 自动替换为搜索关键词
  const MAX_PAGES = __MAX_PAGES__;  // 由 Python 替换，最大采集页数
  const PAGE_DELAY = 3000;      // 翻页后等待加载时间（ms）
  // ==========================

  console.log(`🔍 开始提取闲鱼搜索数据 [关键词: ${KEYWORD}]...`);

  const seen = new Set();
  const items = [];

  // 提取当前页商品
  function extractCurrentPage() {
    const cards = document.querySelectorAll('a[href*="goofish.com/item"]');
    let newCount = 0;
    cards.forEach((card) => {
      const idMatch = card.href.match(/[?&]id=(\d+)/);
      if (!idMatch || seen.has(idMatch[1])) return;
      seen.add(idMatch[1]);
      newCount++;

      const itemId = idMatch[1];

      // 标题
      const titleEl = card.querySelector('[class*="main-title"]');
      const title = titleEl ? titleEl.textContent.trim() : '';

      // 价格
      const signEl = card.querySelector('[class*="price-wrap"] [class*="sign"]');
      const numEl = card.querySelector('[class*="price-wrap"] [class*="number"]');
      const decEl = card.querySelector('[class*="price-wrap"] [class*="decimal"]');
      let price = '';
      if (signEl && numEl) {
        price = signEl.textContent.trim() + numEl.textContent.trim();
        if (decEl && decEl.textContent.trim()) price += decEl.textContent.trim();
      }

      // 卖家地区（闲鱼搜索页展示的是地区，非卖家名；卖家名需从详情页获取）
      const locationEl = card.querySelector('[class*="seller-text--"]');
      const location = locationEl ? locationEl.textContent.trim() : '';

      // 卖家名（搜索页不再展示，留空，由 step2 截图阶段从详情页抓取）
      const sellerName = '';

      // 商品图片
      const img = card.querySelector('img[class*="feeds-image"]');
      let image = '';
      if (img) {
        image = img.src || img.getAttribute('data-src') || '';
        if (image.startsWith('//')) image = 'https:' + image;
        image = image.replace(/_\d+x\d+.*\.\w+$/i, '');
      }

      // 想要人数（price-desc 区域可能显示“想要”数或划线原价，只取含“想要”的文本）
      const descEl = card.querySelector('[class*="price-desc"] [class*="text"]');
      const wantCount = (descEl && descEl.textContent.includes('想要')) ? descEl.textContent.trim() : '';

      // 属性标签（成色等）
      const cpvEls = card.querySelectorAll('[class*="cpv--"]');
      const tags = Array.from(cpvEls).map(el => el.textContent.trim()).filter(t => t);

      // 详情页链接（去掉 spm/trackParams 追踪参数，保留 categoryId）
      const detailUrl = card.href.split('&spm=')[0].split('&trackParams=')[0];

      // 卖家头像
      const avatarEl = card.querySelector('[class*="seller-wrap"] img, [class*="row4-wrap-seller"] img');
      const sellerAvatar = avatarEl ? (avatarEl.src || '') : '';

      items.push({
        itemId,
        title,
        price,
        location,
        sellerName,
        image,
        wantCount,
        tags,
        detailUrl,
        sellerAvatar,
      });
    });
    return newCount;
  }

  // 获取当前页码
  function getCurrentPage() {
    const activePage = document.querySelector('[class*="page-box-active"]');
    return activePage ? parseInt(activePage.textContent.trim()) : 1;
  }

  // 获取总页数
  function getTotalPages() {
    const pageBoxes = document.querySelectorAll('[class*="page-box"]');
    let maxPage = 1;
    pageBoxes.forEach(box => {
      const num = parseInt(box.textContent.trim());
      if (!isNaN(num) && num > maxPage) maxPage = num;
    });
    return maxPage;
  }

  // 点击下一页
  async function clickNextPage() {
    // 方法1: 点击右箭头
    const rightArrow = document.querySelector('[class*="arrow-right"]');
    if (rightArrow) {
      const btn = rightArrow.closest('button');
      if (btn && !btn.disabled) {
        btn.click();
        return true;
      }
    }
    // 方法2: 点击下一个页码
    const currentPage = getCurrentPage();
    const nextPage = currentPage + 1;
    const pageBoxes = document.querySelectorAll('[class*="page-box"]');
    for (const box of pageBoxes) {
      if (box.textContent.trim() === String(nextPage)) {
        box.click();
        return true;
      }
    }
    return false;
  }

  // 主循环：分页采集
  const totalPages = getTotalPages();
  const pagesToScrape = Math.min(MAX_PAGES, totalPages);
  console.log(`📄 检测到 ${totalPages} 页，计划采集 ${pagesToScrape} 页`);

  for (let page = 1; page <= pagesToScrape; page++) {
    console.log(`\n--- 第 ${page}/${pagesToScrape} 页 ---`);

    // 等待页面内容加载
    try {
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {}

    // 提取当前页
    const newCount = extractCurrentPage();
    console.log(`  提取 ${newCount} 条，累计 ${items.length} 条`);

    // 如果不是最后一页，点击翻页
    if (page < pagesToScrape) {
      const clicked = await clickNextPage();
      if (!clicked) {
        console.log('  ⚠️ 无法点击下一页，停止采集');
        break;
      }
      console.log(`  ⏳ 等待第 ${page + 1} 页加载...`);
      await new Promise(r => setTimeout(r, PAGE_DELAY));

      // 等待内容变化
      let waitCount = 0;
      while (waitCount < 5) {
        const currentCards = document.querySelectorAll('a[href*="goofish.com/item"]');
        const currentPageNum = getCurrentPage();
        if (currentPageNum === page + 1 || currentCards.length > 0) break;
        await new Promise(r => setTimeout(r, 1000));
        waitCount++;
      }
    }
  }

  if (items.length === 0) {
    console.log('❌ 未提取到数据');
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
    地区: i.location,
    标题: i.title.substring(0, 30),
    售价: i.price,
    想要: i.wantCount || '(无)',
  })));
})();

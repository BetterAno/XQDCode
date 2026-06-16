// === 闲鱼搜索结果提取脚本（含商品ID、详情链接） ===
// 使用方法:
//   1. 浏览器打开 https://www.goofish.com/search?q=关键词
//   2. 等页面加载完毕后，F12 打开控制台
//   3. 粘贴本脚本运行 → 自动滚动加载 + 提取 + 下载JSON
//
// ⚠️ 使用前请修改下方 KEYWORD 变量（或保持 __KEYWORD__ 由程序替换）

(async function extractXianyuSearch() {
  // ========== 配置 ==========
  const KEYWORD = '__KEYWORD__';  // 会被 Python 自动替换为搜索关键词
  const MAX_SCROLL_ROUNDS = __MAX_PAGES__;  // 由 Python 替换
  const SCROLL_DELAY = 2500;     // 每次滚动后等待（ms）
  // ==========================

  console.log(`🔍 开始提取闲鱼搜索数据 [关键词: ${KEYWORD}]...`);

  const seen = new Set();

  // 增量滚动加载
  let lastCount = 0;
  for (let round = 0; round < MAX_SCROLL_ROUNDS; round++) {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, SCROLL_DELAY));
    const fresh = document.querySelectorAll('a[href*="goofish.com/item"]');
    if (fresh.length === lastCount && round > 1) break;
    console.log(`  第${round + 1}轮: 已加载 ${fresh.length} 条商品...`);
    lastCount = fresh.length;
  }

  const items = [];
  const cards = document.querySelectorAll('a[href*="goofish.com/item"]');

  cards.forEach((card) => {
    // 从 href 提取 itemId
    const idMatch = card.href.match(/[?&]id=(\d+)/);
    if (!idMatch || seen.has(idMatch[1])) return;
    seen.add(idMatch[1]);

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
      // 取 src / data-src（懒加载兜底），协议相对URL补 https:
      image = img.src || img.getAttribute('data-src') || '';
      if (image.startsWith('//')) image = 'https:' + image;
      // 去掉阿里CDN缩略图后缀还原原图: xxx.jpg_450x10000Q90.jpg_.webp → xxx.jpg
      image = image.replace(/_\d+x\d+.*\.\w+$/i, '');
    }

    // 想要人数
    const descEl = card.querySelector('[class*="price-desc"] [class*="text"]');
    const wantCount = descEl ? descEl.textContent.trim() : '';

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
    想要: i.wantCount,
  })));
})();

// === 淘宝搜索商品提取（仅 JSON） ===
// Console 粘贴运行 → 自动下载 JSON
// 使用 CSS Modules 类名精确匹配
//
// ⚠️ 使用前请修改下方 KEYWORD 变量为你要搜索的关键词

(async function extractTaobaoSearch() {
  // ========== 配置 ==========
  const KEYWORD = '__KEYWORD__';  // 会被 Python 自动替换
  // ==========================

  console.log(`🔍 开始提取商品数据 [关键词: ${KEYWORD}]...`);

  const CITIES = ['广东深圳','广东广州','广东东莞','广东佛山','广东惠州','广东中山','广东珠海',
    '浙江杭州','浙江宁波','浙江温州','浙江义乌','江苏南京','江苏苏州','江苏无锡','江苏常州',
    '上海','北京','天津','重庆','四川成都','湖北武汉','福建厦门','福建福州','福建泉州',
    '湖南长沙','河南郑州','河南周口','山东济南','山东青岛','辽宁沈阳','陕西西安','河北石家庄',
    '江西南昌','广西南宁','云南昆明','安徽合肥','贵州贵阳','河南','广东','浙江','江苏',
    '福建','湖北','湖南','四川','山东','辽宁','陕西','河北','江西','广西','云南','安徽'];

  const seen = new Set();

  // 增量滚动加载
  let lastCount = 0;
  for (let round = 0; round < 3; round++) {
    window.scrollTo(0, document.body.scrollHeight * (round + 1) / 3);
    await new Promise(r => setTimeout(r, 1500));
    const fresh = document.querySelectorAll('a[href*="item.taobao.com/item.htm?id="]');
    if (fresh.length === lastCount) break;
    console.log(`  已加载 ${fresh.length} 条...`);
    lastCount = fresh.length;
  }

  // 精确提取每个商品
  const items = [];
  document.querySelectorAll('a[href*="item.taobao.com/item.htm?id="]').forEach(card => {
    const idMatch = card.href.match(/[?&]id=(\d+)/);
    if (!idMatch || seen.has(idMatch[1])) return;
    seen.add(idMatch[1]);

    // === 1. 标题（直接用专用选择器） ===
    const titleEl = card.querySelector('[class*="title--"]');
    const title = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';

    // === 2. 售价 ===
    let price = '';
    const priceIntEl = card.querySelector('[class*="priceInt--"]');
    const priceFloatEl = card.querySelector('[class*="priceFloat--"]');
    if (priceIntEl) {
      const intPart = priceIntEl.textContent.trim();
      const floatPart = priceFloatEl ? priceFloatEl.textContent.trim() : '';
      price = '¥' + intPart + floatPart;
      const priceDescEl = card.querySelector('[class*="priceDesc--"]');
      if (priceDescEl) price += ' (' + priceDescEl.textContent.trim() + ')';
    }

    // === 3. 销量 ===
    const salesEl = card.querySelector('[class*="realSales--"]');
    const sales = salesEl ? salesEl.textContent.trim() : '';

    // === 4. 店铺名 ===
    const shopEl = card.querySelector('[class*="shopNameText--"]');
    const shopName = shopEl ? shopEl.textContent.trim() : '';

    // === 5. 地址 ===
    const allText = (card.textContent || '').replace(/\s+/g, ' ');
    let location = CITIES.find(c => allText.includes(c)) || '';

    // === 6. 商品主图 ===
    let image = '';
    const mainImg = card.querySelector('img[class*="mainImg"]') || card.querySelector('img[class*="mainPic"]');
    if (mainImg) {
      const src = mainImg.src || mainImg.getAttribute('data-src') || '';
      if (src) {
        // 去掉缩略图后缀，还原原图: xxx.png_460x460q90.jpg_.webp → xxx.png
        image = src.replace(/_\d+x\d+q?\d*\.?\w*\.webp$/i, '')
                   .replace(/_\d+x\d+q?\d*\.?\w*\.jpg$/i, '')
                   .replace(/_\d+x\d+.*$/i, '');
      }
    }

    // === 7. 详情页链接 ===
    const detailUrl = card.href.split('&spm=')[0].split('&utparam=')[0];

    items.push({
      itemId: idMatch[1], title, price, sales,
      shopName, location, detailUrl, image,
    });
  });

  if (items.length === 0) {
    console.log('❌ 未提取到商品数据');
    return;
  }

  // 下载 JSON（文件名：关键词_taobao_日期.json）
  const dateStr = new Date().toISOString().slice(0, 10);
  const safeKeyword = KEYWORD.replace(/[^\w一-鿿]/g, '_');
  const filename = `${safeKeyword}_taobao_${dateStr}.json`;

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
  console.log(`  2. 运行截图: python src/taobao_search.py --screenshot ${filename}`);
  console.log(`  3. 生成XLSX: python src/taobao_search.py --to-xlsx ${filename}`);
  console.table(items.slice(0, 5).map(i => ({
    店铺: i.shopName,
    标题: i.title.substring(0, 35),
    售价: i.price,
    销量: i.sales,
    地址: i.location,
  })));
})();

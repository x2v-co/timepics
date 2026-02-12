const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: './demo-videos',
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();

  try {
    console.log('🎬 开始录制核心功能演示视频...\n');
    console.log('📋 演示内容：');
    console.log('   1️⃣  Time Capsule - 每日时间胶囊');
    console.log('   2️⃣  Timeline Wars - 时间线战争');
    console.log('   3️⃣  Solana NFT - NFT铸造与展示\n');

    // ========================================
    // 功能 1: Time Capsule (每日时间胶囊)
    // ========================================
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎁 功能 1: Daily Time Capsule');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    console.log('📍 展示首页 Time Capsule 模块...');

    // 滚动到 Time Capsule 区域
    const timeCapsuleHeading = await page.locator('text=🎁 Daily Time Capsule').first();
    if (await timeCapsuleHeading.count() > 0) {
      await timeCapsuleHeading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(3000);

      // 高亮显示 Time Capsule 卡片
      console.log('🔍 聚焦 Time Capsule 功能...');
      await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h2'));
        const capsuleHeading = headings.find(h => h.textContent?.includes('Daily Time Capsule'));
        const capsuleCard = capsuleHeading?.closest('div');
        if (capsuleCard) {
          capsuleCard.style.transform = 'scale(1.02)';
          capsuleCard.style.transition = 'transform 0.5s ease';
        }
      });
    }
    await page.waitForTimeout(2000);

    // 展示倒计时
    console.log('⏰ 展示倒计时功能...');
    await page.waitForTimeout(2000);

    // 展示谜题提示
    console.log('💡 展示谜题提示...');
    await page.waitForTimeout(2000);

    // 尝试输入答案（演示交互）
    console.log('🎯 演示解谜交互...');
    const guessInput = await page.$('input[placeholder*="guess"], input[placeholder*="猜测"]');
    if (guessInput) {
      await guessInput.click();
      await page.waitForTimeout(500);
      await guessInput.type('Neo Tokyo', { delay: 100 });
      await page.waitForTimeout(2000);

      // 点击 Unlock 按钮
      const unlockBtn = await page.$('button:has-text("Unlock")');
      if (unlockBtn) {
        console.log('🔓 点击 Unlock 按钮...');
        await unlockBtn.click();
        await page.waitForTimeout(2000);
      }
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);

    // ========================================
    // 功能 2: Timeline Wars (时间线战争)
    // ========================================
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚔️  功能 2: Timeline Wars');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🚀 导航到 Timeline Wars 页面...');
    await page.click('a:has-text("⚔️ Wars")');
    await page.waitForTimeout(3000);

    console.log('📊 展示对战统计面板...');
    // 展示页面顶部信息
    await page.waitForTimeout(2000);

    // 滚动展示两大阵营
    console.log('🏰 展示阵营对比...');
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let scrolled = 0;
        const distance = 80;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          scrolled += distance;
          if(scrolled >= 500) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
    await page.waitForTimeout(2000);

    // 展示 Steam Revolution 阵营
    console.log('⚙️  展示 Steam Revolution 阵营...');
    const steamCard = await page.$('text=Steam Revolution');
    if (steamCard) {
      await steamCard.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2500);
    }

    // 展示 Bio Genesis 阵营
    console.log('🧬 展示 Bio Genesis 阵营...');
    const bioCard = await page.$('text=Bio Genesis');
    if (bioCard) {
      await bioCard.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2500);
    }

    // 展示质押统计
    console.log('📈 展示质押统计...');
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(2000);

    // 点击选择阵营（演示交互）
    console.log('🎮 演示选择阵营交互...');
    const selectFactionBtn = await page.$('button:has-text("Select Faction")');
    if (selectFactionBtn) {
      await selectFactionBtn.click();
      await page.waitForTimeout(2000);
    }

    // 展示 Blink 分享功能
    console.log('🔗 展示 Blink 分享功能...');
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(2000);

    // 滚动到底部查看完整信息
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let scrolled = 0;
        const distance = 100;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          scrolled += distance;
          if(scrolled >= 800) {
            clearInterval(timer);
            resolve();
          }
        }, 80);
      });
    });
    await page.waitForTimeout(2000);

    // 返回顶部
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(2000);

    // ========================================
    // 功能 3: Solana NFT (NFT铸造与Gallery)
    // ========================================
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⛓️  功能 3: Solana NFT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 进入 Gallery 页面
    console.log('🖼️  导航到 Gallery...');
    await page.click('a:has-text("Gallery")');
    await page.waitForTimeout(3000);

    console.log('🎨 展示 NFT Gallery...');
    await page.waitForTimeout(2000);

    // 展示筛选功能
    console.log('🔍 展示引擎筛选功能...');
    const filterButtons = await page.$$('button:has-text("Rewind"), button:has-text("Refract"), button:has-text("Foresee")');
    if (filterButtons.length > 0) {
      await page.waitForTimeout(1000);
      // 点击 Rewind 筛选
      const rewindFilter = await page.$('button:has-text("Rewind")');
      if (rewindFilter) {
        console.log('🔄 筛选 Rewind Engine NFTs...');
        await rewindFilter.click();
        await page.waitForTimeout(2000);
      }

      // 点击 All 返回全部
      const allFilter = await page.$('button:has-text("All")');
      if (allFilter) {
        await allFilter.click();
        await page.waitForTimeout(1500);
      }
    }

    // 滚动浏览 NFT 卡片
    console.log('📜 浏览 NFT 卡片...');
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if(totalHeight >= 1200 || totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
    await page.waitForTimeout(2000);

    // 点击查看 NFT 详情（如果有卡片）
    console.log('🔍 展示 NFT 详情...');
    const nftCard = await page.$('[class*="group"]'); // NFT 卡片
    if (nftCard) {
      await nftCard.hover();
      await page.waitForTimeout(2000);
    }

    // 返回顶部
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1500);

    // 进入 Generate 页面展示 NFT 铸造流程
    console.log('\n🎨 导航到 Generate 页面...');
    await page.click('a:has-text("Generate")');
    await page.waitForTimeout(3000);

    console.log('⛓️  展示 NFT 铸造选项...');
    // 选择引擎
    const foreseeBtn = await page.$('button:has-text("Foresee Engine")');
    if (foreseeBtn) {
      await foreseeBtn.click();
      await page.waitForTimeout(1500);
    }

    // 滚动到 "Mint as NFT" 选项
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1500);

    // 展示 NFT 选项（如果可见）
    console.log('💎 展示 "Mint as NFT" 选项...');
    const mintCheckbox = await page.$('input[type="checkbox"]');
    if (mintCheckbox) {
      const isChecked = await mintCheckbox.isChecked();
      if (!isChecked) {
        await mintCheckbox.click();
        await page.waitForTimeout(1500);
      }
    }

    // 展示完整的生成界面
    console.log('📝 展示生成界面...');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(2000);

    // 最后返回首页作为结尾
    console.log('\n🏠 返回首页...');
    await page.click('a:has-text("TimePics.ai")');
    await page.waitForTimeout(3000);

    // 展示完整首页
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if(totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 80);
      });
    });
    await page.waitForTimeout(1500);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(2000);

    console.log('\n✅ 录制完成！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ 录制出错:', error);
  } finally {
    await context.close();
    await browser.close();
    console.log('🎥 视频已保存到 ./demo-videos 目录');
    console.log('📹 文件名: timepics-core-features.webm\n');
  }
})();

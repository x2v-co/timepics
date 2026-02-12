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
    console.log('🎬 开始录制 Solana NFT 功能演示...\n');

    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // ========================================
    // 功能 3: Solana NFT (NFT铸造与Gallery)
    // ========================================
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⛓️  功能 3: Solana NFT - 铸造与展示');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 先导航到 Generate 页面展示 NFT 铸造
    console.log('🎨 导航到 Generate 页面（NFT 铸造）...');
    await page.click('text=Start Creating');
    await page.waitForTimeout(3000);

    console.log('⛓️  展示 NFT 铸造选项...');

    // 选择 Foresee 引擎
    try {
      await page.click('text=Foresee Engine', { timeout: 5000 });
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log('  ℹ️  Foresee Engine 按钮未找到，继续...');
    }

    // 滚动查看表单
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1500);

    // 展示 "Mint as NFT" 复选框
    console.log('💎 聚焦 "Mint as NFT" 选项...');
    const mintLabel = await page.locator('text=Mint as NFT').first();
    if (await mintLabel.count() > 0) {
      await mintLabel.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);

      // 高亮该区域
      await page.evaluate(() => {
        const labels = Array.from(document.querySelectorAll('label'));
        const mintLabel = labels.find(l => l.textContent?.includes('Mint as NFT'));
        if (mintLabel) {
          mintLabel.style.background = 'rgba(99, 102, 241, 0.1)';
          mintLabel.style.padding = '8px';
          mintLabel.style.borderRadius = '8px';
          mintLabel.style.transition = 'all 0.3s ease';
        }
      });
      await page.waitForTimeout(2000);
    }

    // 显示完整的生成表单
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(2000);

    console.log('📝 展示完整的 NFT 生成界面...');
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let scrolled = 0;
        const distance = 100;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          scrolled += distance;
          if (scrolled >= 800) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
    await page.waitForTimeout(2000);

    // 返回顶部
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1500);

    // 导航到 Gallery 展示已铸造的 NFT
    console.log('\n🖼️  导航到 Gallery 页面...');

    // 使用导航菜单
    const galleryLink = await page.locator('nav >> text=Gallery').first();
    if (await galleryLink.count() > 0) {
      await galleryLink.click();
      await page.waitForTimeout(4000);

      console.log('🎨 展示 NFT Gallery...');
      await page.waitForTimeout(2000);

      // 展示筛选按钮
      console.log('🔍 展示引擎筛选功能...');
      const filterSection = await page.locator('text=All').first();
      if (await filterSection.count() > 0) {
        await filterSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1500);

        // 点击 Rewind 筛选
        try {
          const rewindButton = await page.locator('text=Rewind').first();
          if (await rewindButton.count() > 0) {
            console.log('🔄 筛选 Rewind Engine NFTs...');
            await rewindButton.click();
            await page.waitForTimeout(2500);
          }
        } catch (e) {
          console.log('  ℹ️  Rewind 筛选按钮未找到');
        }

        // 点击 Refract 筛选
        try {
          const refractButton = await page.locator('text=Refract').first();
          if (await refractButton.count() > 0) {
            console.log('🔀 筛选 Refract Engine NFTs...');
            await refractButton.click();
            await page.waitForTimeout(2500);
          }
        } catch (e) {
          console.log('  ℹ️  Refract 筛选按钮未找到');
        }

        // 返回 All
        try {
          const allButton = await page.locator('text=All').first();
          if (await allButton.count() > 0) {
            await allButton.click();
            await page.waitForTimeout(1500);
          }
        } catch (e) {}
      }

      // 滚动浏览 NFT 卡片
      console.log('📜 浏览 NFT 卡片展示...');
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if(totalHeight >= 1500 || totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 80);
        });
      });
      await page.waitForTimeout(2000);

      // 展示 NFT 卡片悬停效果
      console.log('🎯 展示 NFT 卡片交互...');
      await page.evaluate(() => window.scrollTo(400, 400));
      await page.waitForTimeout(1000);

      const cards = await page.$$('[class*="group"]');
      if (cards.length > 0) {
        await cards[0].hover();
        await page.waitForTimeout(2000);
        if (cards.length > 1) {
          await cards[1].hover();
          await page.waitForTimeout(2000);
        }
      }

      // 返回顶部
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      await page.waitForTimeout(2000);

      // 展示整体布局
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
    }

    // 返回首页作为结尾
    console.log('\n🏠 返回首页结束演示...');
    await page.click('text=TimePics.ai');
    await page.waitForTimeout(3000);

    // 快速浏览首页
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 120;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if(totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 60);
      });
    });
    await page.waitForTimeout(1000);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(2000);

    console.log('\n✅ NFT 功能录制完成！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ 录制出错:', error);
  } finally {
    await context.close();
    await browser.close();
    console.log('🎥 视频已保存到 ./demo-videos 目录\n');
  }
})();

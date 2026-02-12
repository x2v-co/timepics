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
    console.log('🎬 开始录制 Gallery 展示视频 (5秒)...\n');

    // 先访问首页，然后点击 Gallery
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    console.log('📍 导航到 Gallery...');
    await page.click('text=Gallery');
    await page.waitForTimeout(2000);

    console.log('🖼️  展示 NFT Gallery...');

    // 快速滚动浏览卡片
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let scrolled = 0;
        const distance = 150;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          scrolled += distance;
          if(scrolled >= 800) {
            clearInterval(timer);
            resolve();
          }
        }, 150);
      });
    });

    await page.waitForTimeout(1000);

    // 回到顶部
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1500);

    console.log('\n✅ 录制完成！');

  } catch (error) {
    console.error('❌ 录制出错:', error);
  } finally {
    await context.close();
    await browser.close();
    console.log('🎥 视频已保存到 ./demo-videos 目录\n');
  }
})();

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false, // 显示浏览器窗口
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
    console.log('🎬 开始录制演示视频...');

    // 1. 首页展示 (10秒)
    console.log('📍 场景 1: 首页');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);

    // 缓慢滚动首页展示所有功能
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if(totalHeight >= scrollHeight){
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);

    // 2. 点击进入 Generate 页面
    console.log('📍 场景 2: 生成页面');
    await page.click('text=Start Creating');
    await page.waitForTimeout(3000);

    // 展示 Rewind Engine
    console.log('🔄 展示 Rewind Engine');
    await page.click('button:has-text("Rewind Engine")');
    await page.waitForTimeout(2000);

    // 填写示例 prompt
    await page.fill('textarea[placeholder*="prompt"]', 'A vintage 1920s family photo, sepia tone, restored to 4K quality');
    await page.waitForTimeout(2000);

    // 展示 Refract Engine
    console.log('🔀 展示 Refract Engine');
    await page.click('button:has-text("Refract Engine")');
    await page.waitForTimeout(2000);
    await page.fill('textarea[placeholder*="prompt"]', 'What if dinosaurs never went extinct? A parallel world where humans and dinosaurs coexist in 2024');
    await page.waitForTimeout(2000);

    // 展示 Foresee Engine
    console.log('🔮 展示 Foresee Engine');
    await page.click('button:has-text("Foresee Engine")');
    await page.waitForTimeout(2000);
    await page.fill('textarea[placeholder*="prompt"]', 'Shanghai cityscape in 2077, flying cars, neon skyscrapers, cyberpunk aesthetic');
    await page.waitForTimeout(3000);

    // 3. 访问 Gallery 页面
    console.log('📍 场景 3: Gallery 画廊');
    await page.click('text=Gallery');
    await page.waitForTimeout(3000);

    // 滚动浏览 Gallery
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if(totalHeight >= scrollHeight || totalHeight > 1500){
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    await page.waitForTimeout(2000);

    // 4. 访问 Timeline Wars 页面
    console.log('📍 场景 4: Timeline Wars');
    await page.click('text=⚔️ Wars');
    await page.waitForTimeout(4000);

    // 滚动展示 Timeline Wars
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if(totalHeight >= scrollHeight){
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);

    // 5. 回到首页结束
    console.log('📍 场景 5: 返回首页');
    await page.click('text=TimePics.ai');
    await page.waitForTimeout(3000);

    console.log('✅ 录制完成！');

  } catch (error) {
    console.error('❌ 录制出错:', error);
  } finally {
    await context.close();
    await browser.close();
    console.log('🎥 视频已保存到 ./demo-videos 目录');
  }
})();

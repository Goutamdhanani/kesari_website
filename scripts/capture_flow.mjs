import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Initial skeleton capture during first 450ms
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 80));
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/40_kesari_skeleton_home_initial.png' });

  // 2. Settle home page
  await new Promise((r) => setTimeout(r, 650));
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/39_kesari_homepage_settled.png' });

  // 3. Click Schedule tab in dock
  await page.evaluate(() => {
    const dockButtons = document.querySelectorAll('nav button');
    for (const b of dockButtons) {
      if (b.innerText && b.innerText.includes('Schedule')) {
        b.click();
        return;
      }
    }
  });
  await new Promise((r) => setTimeout(r, 60)); // during skeleton
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/41_kesari_skeleton_schedule_tab.png' });

  await new Promise((r) => setTimeout(r, 350)); // settled
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/42_kesari_schedule_view_loaded.png' });

  // 4. Click Passes tab in dock
  await page.evaluate(() => {
    const dockButtons = document.querySelectorAll('nav button');
    for (const b of dockButtons) {
      if (b.innerText && b.innerText.includes('Passes')) {
        b.click();
        return;
      }
    }
  });
  await new Promise((r) => setTimeout(r, 60)); // during skeleton
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/43_kesari_skeleton_passes_tab.png' });

  await new Promise((r) => setTimeout(r, 350)); // settled
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/44_kesari_passes_view_loaded.png' });

  // 5. Mobile viewport test (390 x 844 iPhone 14)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    const dockButtons = document.querySelectorAll('nav button');
    for (const b of dockButtons) {
      if (b.innerText && b.innerText.includes('Discover')) {
        b.click();
        return;
      }
    }
  });
  await new Promise((r) => setTimeout(r, 350));
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/45_kesari_mobile_smooth_home.png' });

  console.log('All transitions and skeletons captured cleanly!');
  await browser.close();
})();

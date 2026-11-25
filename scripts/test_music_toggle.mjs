import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 700));

  // 1. Initial State Screenshot (Music OFF)
  const bentoEl = await page.$('section[aria-label="Studio quick metrics"]');
  if (bentoEl) {
    await bentoEl.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/70_bento_music_off.png' });
  }

  // 2. Click Toggle Switch to turn Music ON
  const switchBtn = await page.$('button[role="switch"][aria-label*="peaceful instrumental"]');
  if (switchBtn) {
    await switchBtn.click();
    await new Promise(r => setTimeout(r, 400));
    if (bentoEl) {
      await bentoEl.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/71_bento_music_on.png' });
    }

    // 3. Click Volume Down button
    const volDownBtn = await page.$('button[aria-label="Volume down"]');
    if (volDownBtn) {
      await volDownBtn.click();
      await new Promise(r => setTimeout(r, 300));
      if (bentoEl) {
        await bentoEl.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/72_bento_music_volume_down.png' });
      }
    }
  }

  // Full page view
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/73_full_page_music_live.png' });

  console.log('Music toggle tests completed cleanly!');
  await browser.close();
})();

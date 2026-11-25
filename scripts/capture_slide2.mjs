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

  // Click next button
  const nextBtn = await page.$('button[aria-label="Next featured event"]');
  if (nextBtn) {
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 450));
    const heroCard = await page.$('section[aria-label="Featured event drops"]');
    if (heroCard) {
      await heroCard.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/69_kesari_minimal_card_slide2.png' });
    }
  }

  console.log('Slide 2 captured!');
  await browser.close();
})();

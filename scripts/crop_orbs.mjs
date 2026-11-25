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

  const orbsEl = await page.$('[role="group"][aria-label*="Feature Spheres"]');
  if (orbsEl) {
    await orbsEl.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/46_kesari_orbs_closeup.png' });
    console.log('Orbs closeup captured!');
  }
  await browser.close();
})();

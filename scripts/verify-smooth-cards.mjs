import puppeteer from 'puppeteer-core';
import path from 'node:path';

const ARTIFACT_DIR = 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7';
const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

async function run() {
  console.log('[Verify] Launching Edge headless browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,950'],
    defaultViewport: { width: 1280, height: 950, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();

  // 1. Desktop View (Slide 1: Amour)
  console.log('[Verify] Loading desktop app at http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '31_kesari_smooth_card_desktop.png') });
  console.log('✓ Captured 31_kesari_smooth_card_desktop.png');

  // 2. Click Next Arrow to test smooth slide animation to Slide 2
  console.log('[Verify] Clicking Next arrow to slide to next event...');
  const nextBtn = await page.waitForSelector('button[aria-label="Next featured event"]');
  await nextBtn.click();
  await new Promise(r => setTimeout(r, 800)); // wait for smooth slide transition
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '32_kesari_smooth_card_slide2.png') });
  console.log('✓ Captured 32_kesari_smooth_card_slide2.png');

  // 3. Mobile View (Slide 1)
  console.log('[Verify] Setting mobile viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '33_kesari_smooth_card_mobile.png') });
  console.log('✓ Captured 33_kesari_smooth_card_mobile.png');

  await browser.close();
  console.log('[Verify] All smooth card screenshots captured successfully!');
}

run().catch(err => {
  console.error('[Verify] Error:', err);
  process.exit(1);
});

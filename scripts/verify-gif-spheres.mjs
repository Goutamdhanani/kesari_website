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

  // Test 1: Desktop View
  console.log('[Verify] Loading app at http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '21_kesari_spheres_20pct_smaller_desktop.png') });
  console.log('✓ Captured 21_kesari_spheres_20pct_smaller_desktop.png');

  // Test 2: Mobile Viewport
  console.log('[Verify] Setting mobile viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '22_kesari_spheres_20pct_smaller_mobile.png') });
  console.log('✓ Captured 22_kesari_spheres_20pct_smaller_mobile.png');

  await browser.close();
  console.log('[Verify] Verification complete! All screenshots saved.');
}

run().catch(err => {
  console.error('[Verify] Error during verification:', err);
  process.exit(1);
});

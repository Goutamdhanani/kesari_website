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
    defaultViewport: { width: 1280, height: 950 },
  });

  const page = await browser.newPage();

  // Test 1: Desktop View of Top 3 Spheres
  console.log('[Verify] Loading app at http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '13_kesari_top3_spheres_desktop.png') });
  console.log('✓ Captured 13_kesari_top3_spheres_desktop.png');

  // Test 2: Click Sphere 2 (Organise Event)
  console.log('[Verify] Clicking Organise Event Sphere...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const organiseBtn = btns.find(b => b.textContent && b.textContent.includes('Organise Event'));
    if (organiseBtn) organiseBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '14_kesari_sphere_organise_modal.png') });
  console.log('✓ Captured 14_kesari_sphere_organise_modal.png');

  // Close Organise modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Close organise event modal"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Test 3: Click Sphere 3 (Gear & Spaces / Accessories)
  console.log('[Verify] Clicking Gear & Spaces Sphere...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const gearBtn = btns.find(b => b.textContent && b.textContent.includes('Gear & Spaces'));
    if (gearBtn) gearBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '15_kesari_sphere_accessories_modal.png') });
  console.log('✓ Captured 15_kesari_sphere_accessories_modal.png');

  // Close Gear modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Dismiss booking dialog"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Test 4: Mobile Viewport (iPhone 14 style 390x844)
  console.log('[Verify] Setting mobile viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '16_kesari_top3_spheres_mobile.png') });
  console.log('✓ Captured 16_kesari_top3_spheres_mobile.png');

  await browser.close();
  console.log('[Verify] Verification complete! All 4 screenshots captured.');
}

run().catch(err => {
  console.error('[Verify] Error during verification:', err);
  process.exit(1);
});

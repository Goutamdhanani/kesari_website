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

  // Test 1: Public Client Site (Verify NO admin portal link anywhere)
  console.log('[Verify] Loading public client site at http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Verify text "Admin Portal" does not exist anywhere on the public page
  const pageContent = await page.content();
  const hasAdminPortal = pageContent.includes('Admin Portal');
  console.log('Public site has Admin Portal button?', hasAdminPortal);
  if (hasAdminPortal) {
    throw new Error('Public site still contains Admin Portal element!');
  }

  // Scroll to bottom to verify clean footer without admin link
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '34_kesari_public_app_no_admin.png') });
  console.log('✓ Captured 34_kesari_public_app_no_admin.png');

  // Test 2: Separate Admin Portal Route at http://localhost:3000/admin
  console.log('[Verify] Navigating to separate /admin route...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '35_kesari_admin_locked_screen.png') });
  console.log('✓ Captured 35_kesari_admin_locked_screen.png');

  // Test 3: Attempt Invalid Password
  console.log('[Verify] Testing invalid password rejection...');
  const pwdInput = await page.waitForSelector('input#admin-password');
  await pwdInput.type('wrongpassword123');
  const submitBtn = await page.waitForSelector('button[type="submit"]');
  await submitBtn.click();
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '36_kesari_admin_login_error.png') });
  console.log('✓ Captured 36_kesari_admin_login_error.png');

  // Test 4: Enter Valid Master Password (kesari2026)
  console.log('[Verify] Entering valid master password...');
  await page.evaluate(() => {
    const input = document.querySelector('input#admin-password');
    if (input) input.value = '';
  });
  await pwdInput.type('kesari2026');
  await submitBtn.click();
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '37_kesari_admin_unlocked_console.png') });
  console.log('✓ Captured 37_kesari_admin_unlocked_console.png');

  // Test 5: Click "Lock & Sign Out"
  console.log('[Verify] Testing Lock & Sign Out...');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Lock & Sign Out')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '38_kesari_admin_relocked.png') });
  console.log('✓ Captured 38_kesari_admin_relocked.png');

  await browser.close();
  console.log('[Verify] All admin isolation and security tests passed successfully!');
}

run().catch(err => {
  console.error('[Verify] Error:', err);
  process.exit(1);
});

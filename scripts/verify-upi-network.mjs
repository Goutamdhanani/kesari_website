import puppeteer from 'puppeteer-core';
import path from 'node:path';

const ARTIFACT_DIR = 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7';
const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

async function run() {
  console.log('[Verify] Launching Edge headless browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
    defaultViewport: { width: 1280, height: 900 },
  });

  const page = await browser.newPage();

  // Test 1: Open Home Page and Open "Phone / LAN" Modal
  console.log('[Verify] Loading app at http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  console.log('[Verify] Clicking Phone / LAN button...');
  const phoneBtn = await page.waitForSelector('button[title*="Phone"]', { timeout: 5000 });
  await phoneBtn.click();
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '09_kesari_network_phone_modal.png') });
  console.log('✓ Captured 09_kesari_network_phone_modal.png');

  // Close Network Phone Modal
  const closeBtn = await page.waitForSelector('button[aria-label="Close dialog"]', { timeout: 5000 });
  await closeBtn.click();
  await new Promise(r => setTimeout(r, 600));

  // Test 2: Open Ticket Checkout Modal for AMOUR Yash Raj Tribute
  console.log('[Verify] Clicking Buy Ticket on featured event...');
  const buyTicketSuccess = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const buyBtn = btns.find(b => b.textContent && b.textContent.includes('Buy Ticket'));
    if (buyBtn) {
      buyBtn.click();
      return true;
    }
    return false;
  });
  console.log('Buy Ticket clicked:', buyTicketSuccess);
  await new Promise(r => setTimeout(r, 1000));

  // Click "Pay via UPI (Phone App / QR)"
  const payUpiSuccess = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const upiBtn = btns.find(b => b.textContent && b.textContent.includes('Pay via UPI'));
    if (upiBtn) {
      upiBtn.click();
      return true;
    }
    return false;
  });
  console.log('Pay via UPI clicked:', payUpiSuccess);
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '10_kesari_upi_app_launcher.png') });
  console.log('✓ Captured 10_kesari_upi_app_launcher.png');

  // Test 3: Trigger Phone Return Verification
  console.log('[Verify] Navigating to Return Verification screen...');
  const verifyLinkSuccess = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.textContent && b.textContent.includes('Already paid? Verify here'));
    if (target) {
      target.click();
      return true;
    }
    return false;
  });
  console.log('Already paid verify clicked:', verifyLinkSuccess);

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '11_kesari_return_verification.png') });
  console.log('✓ Captured 11_kesari_return_verification.png');

  // Test 4: Complete Verification & Mint Pass
  console.log('[Verify] Clicking Verify & Mint Pass button...');
  const mintSuccess = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.textContent && b.textContent.includes('Verify & Mint Pass'));
    if (target) {
      target.click();
      return true;
    }
    return false;
  });
  console.log('Mint pass clicked:', mintSuccess);

  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '12_kesari_pass_verified_minted.png') });
  console.log('✓ Captured 12_kesari_pass_verified_minted.png');

  await browser.close();
  console.log('[Verify] Verification complete! All screenshots saved to artifact directory.');
}

run().catch(err => {
  console.error('[Verify] Error during verification:', err);
  process.exit(1);
});

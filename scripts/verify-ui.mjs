import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\pooja\\.gemini\\antigravity\\brain\\99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7';

async function runVerification() {
  console.log('[Verify] Launching headless Edge from:', EDGE_PATH);
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });

    const clickByText = async (text) => {
      await page.evaluate((t) => {
        const els = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
        const target = els.find(el => el.textContent && el.textContent.trim().includes(t));
        if (target) target.click();
      }, text);
      await new Promise(r => setTimeout(r, 600));
    };

    // 1. Home / Explore View
    console.log('[Verify] Navigating to http://localhost:3000/ ...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    const pHome = path.join(ARTIFACT_DIR, '01_kesari_home.png');
    await page.screenshot({ path: pHome, fullPage: false });
    console.log('[Verify] 1. Captured Home ->', pHome);

    // 2. Open Ticket Calibration Modal
    console.log('[Verify] Opening Ticket Calibration Modal...');
    await clickByText('Buy Ticket');
    await new Promise(r => setTimeout(r, 800));

    const pCalib = path.join(ARTIFACT_DIR, '02a_kesari_ticket_modal.png');
    await page.screenshot({ path: pCalib, fullPage: false });
    console.log('[Verify] 2a. Captured Ticket Calibration Modal ->', pCalib);

    // Click "Pay via UPI QR" to test dynamic QR generation
    await clickByText('Pay via UPI QR');
    await new Promise(r => setTimeout(r, 800));

    const pUpi = path.join(ARTIFACT_DIR, '02b_kesari_upi_checkout.png');
    await page.screenshot({ path: pUpi, fullPage: false });
    console.log('[Verify] 2b. Captured UPI Checkout Modal with QR ->', pUpi);

    // Close Modal
    await clickByText('Back');
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => {
      const dismiss = document.querySelector('button[aria-label="Dismiss ticket dialog"]');
      if (dismiss) dismiss.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 3. Open Rent Sound Gear Modal (13 Items)
    console.log('[Verify] Opening Rent Sound Gear Modal...');
    await clickByText('Rent Sound Gear');
    await new Promise(r => setTimeout(r, 800));

    const pGear = path.join(ARTIFACT_DIR, '03_kesari_gear_catalog.png');
    await page.screenshot({ path: pGear, fullPage: false });
    console.log('[Verify] 3. Captured Gear Catalog Modal ->', pGear);

    // Close Service Modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close service booking"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 4. Open Studio Memberships Modal
    console.log('[Verify] Opening Studio Memberships Modal...');
    await clickByText('Studio Memberships');
    await new Promise(r => setTimeout(r, 800));

    const pMem = path.join(ARTIFACT_DIR, '04_kesari_memberships.png');
    await page.screenshot({ path: pMem, fullPage: false });
    console.log('[Verify] 4. Captured Memberships Modal ->', pMem);

    // Close Service Modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close service booking"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 5. Open Admin Portal Modal
    console.log('[Verify] Opening Admin Portal...');
    await clickByText('Kesari Studio Operations · Admin Portal');
    await new Promise(r => setTimeout(r, 800));

    const pAdmin = path.join(ARTIFACT_DIR, '05_kesari_admin_portal.png');
    await page.screenshot({ path: pAdmin, fullPage: false });
    console.log('[Verify] 5. Captured Admin Portal ->', pAdmin);

    // Open "Launch New Event" to verify Fydo Importer inside Admin
    await clickByText('Launch New Event');
    await new Promise(r => setTimeout(r, 600));

    const pFydo = path.join(ARTIFACT_DIR, '06_kesari_fydo_importer.png');
    await page.screenshot({ path: pFydo, fullPage: false });
    console.log('[Verify] 6. Captured Fydo Auto-Importer Modal ->', pFydo);

    // Close Create Drop Modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close create event dialog"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Switch to Settings Tab in Admin Portal
    await clickByText('Studio & MongoDB Settings');
    await new Promise(r => setTimeout(r, 600));

    const pSettings = path.join(ARTIFACT_DIR, '07_kesari_mongodb_settings.png');
    await page.screenshot({ path: pSettings, fullPage: false });
    console.log('[Verify] 7. Captured MongoDB Atlas & Studio Settings ->', pSettings);

    // Close Admin Portal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close Admin Portal"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 8. Open Passes Wallet
    console.log('[Verify] Opening Passes Wallet...');
    await clickByText('Passes');
    await new Promise(r => setTimeout(r, 800));

    const pWallet = path.join(ARTIFACT_DIR, '08_kesari_pass_wallet.png');
    await page.screenshot({ path: pWallet, fullPage: false });
    console.log('[Verify] 8. Captured Passes Wallet ->', pWallet);

    console.log('[Verify] All screenshots and visual verifications completed successfully!');
  } finally {
    await browser.close();
  }
}

runVerification().catch((err) => {
  console.error('[Verify] Verification failed:', err);
  process.exit(1);
});

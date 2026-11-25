import puppeteer from 'puppeteer-core';
import path from 'node:path';

const ARTIFACT_DIR = 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7';
const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

async function clickButtonWithText(page, text) {
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const btnText = await page.evaluate(el => el.textContent, btn);
    if (btnText && btnText.toLowerCase().includes(text.toLowerCase())) {
      await btn.click();
      return true;
    }
  }
  return false;
}

async function run() {
  console.log('[Verify] Launching Edge headless browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,950'],
    defaultViewport: { width: 1280, height: 950, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();

  // 1. Desktop View
  console.log('[Verify] Loading desktop app at http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '23_kesari_real_logo_and_spheres_desktop.png') });
  console.log('✓ Captured 23_kesari_real_logo_and_spheres_desktop.png');

  // 2. Mobile View
  console.log('[Verify] Setting mobile viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '24_kesari_mobile_spheres_smaller.png') });
  console.log('✓ Captured 24_kesari_mobile_spheres_smaller.png');

  // Reset to desktop for checkout interaction test
  await page.setViewport({ width: 1280, height: 950, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // 3. Open ticket calibration modal
  console.log('[Verify] Opening checkout modal...');
  const clickedTicket = await clickButtonWithText(page, 'Buy Ticket') || await clickButtonWithText(page, 'Get Passes') || await clickButtonWithText(page, 'Tickets');
  if (!clickedTicket) {
    throw new Error('Could not find Buy Ticket button');
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '25_kesari_checkout_step1_calibrate.png') });
  console.log('✓ Captured 25_kesari_checkout_step1_calibrate.png');

  // 4. Click Proceed to UPI Payment
  console.log('[Verify] Proceeding to UPI step...');
  const clickedProceed = await clickButtonWithText(page, 'Proceed to UPI Payment');
  if (!clickedProceed) {
    throw new Error('Could not find Proceed to UPI Payment button');
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '26_kesari_checkout_step2_upi.png') });
  console.log('✓ Captured 26_kesari_checkout_step2_upi.png');

  // 5. Click "Pay with Installed UPI App" to trigger launch detection
  console.log('[Verify] Clicking Pay with Installed UPI App...');
  await clickButtonWithText(page, 'Pay with Installed UPI App');
  // Wait 3.5s for appLaunchFailed timer & auto-retry detection to trigger
  await new Promise(r => setTimeout(r, 3500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '27_kesari_checkout_auto_retry_detected.png') });
  console.log('✓ Captured 27_kesari_checkout_auto_retry_detected.png');

  // 6. Navigate to UTR verification screen
  console.log('[Verify] Navigating to UTR verification screen...');
  const clickedVerify = await clickButtonWithText(page, 'Verify 12-Digit UTR') || await clickButtonWithText(page, 'Verify UTR here');
  if (!clickedVerify) {
    throw new Error('Could not find Verify UTR button');
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '28_kesari_checkout_step3_utr_verification.png') });
  console.log('✓ Captured 28_kesari_checkout_step3_utr_verification.png');

  // 7. Type valid 12-digit UTR
  console.log('[Verify] Entering 12-digit UTR...');
  const utrInput = await page.waitForSelector('input#utr-input');
  await utrInput.type('432109876543');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '29_kesari_checkout_step3_utr_valid.png') });
  console.log('✓ Captured 29_kesari_checkout_step3_utr_valid.png');

  // 8. Submit verification and mint pass
  console.log('[Verify] Submitting UTR verification...');
  const clickedSubmit = await clickButtonWithText(page, 'Verify UTR & Mint Pass Now');
  if (!clickedSubmit) {
    throw new Error('Could not find Verify UTR & Mint Pass Now button');
  }
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '30_kesari_checkout_step4_minted_with_utr.png') });
  console.log('✓ Captured 30_kesari_checkout_step4_minted_with_utr.png');

  await browser.close();
  console.log('[Verify] All test screenshots captured successfully!');
}

run().catch(err => {
  console.error('[Verify] Error:', err);
  process.exit(1);
});

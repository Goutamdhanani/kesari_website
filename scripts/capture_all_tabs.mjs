import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Home
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/51_tab_home_settled.png' });

  // 2. Search
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const btn = btns.find(b => b.innerText && b.innerText.includes('Search'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/52_tab_search_settled.png' });

  // 3. Schedule
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const btn = btns.find(b => b.innerText && b.innerText.includes('Schedule'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/53_tab_schedule_settled.png' });

  // 4. Passes
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const btn = btns.find(b => b.innerText && b.innerText.includes('Passes'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/54_tab_passes_settled.png' });

  // 5. Profile
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const btn = btns.find(b => b.innerText && b.innerText.includes('Profile'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/55_tab_profile_settled.png' });

  console.log('All 5 tabs captured successfully!');
  await browser.close();
})();

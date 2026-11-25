import puppeteer from 'puppeteer-core';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
  });
  const page = await browser.newPage();
  await page.setContent(`
    <html>
    <body style="background:#111; display:flex; flex-direction:column; gap:20px; padding:20px;">
      <div>
        <h3 style="color:#fff;">logo-512.png</h3>
        <img src="http://localhost:3000/assets/kesari-logo-512.png" style="max-height:100px; background:#222;" />
      </div>
      <div>
        <h3 style="color:#fff;">kesari-logo-colour-long.png</h3>
        <img src="http://localhost:3000/assets/kesari-logo-colour-long.png" style="max-height:100px; background:#222;" />
      </div>
      <div>
        <h3 style="color:#fff;">kesari-logo.png</h3>
        <img src="http://localhost:3000/assets/kesari-logo.png" style="max-height:100px; background:#222;" />
      </div>
    </body>
    </html>
  `);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/logos_preview.png' });
  await browser.close();
  console.log('logos_preview.png saved');
}
test();

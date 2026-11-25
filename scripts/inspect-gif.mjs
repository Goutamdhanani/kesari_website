import puppeteer from 'puppeteer-core';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
  });
  const page = await browser.newPage();
  await page.setContent(`
    <html>
    <body style="margin:0; background:#050507; display:flex; justify-content:center; align-items:center; height:100vh;">
      <img src="http://localhost:3000/assets/plasma_sphere.gif" style="width:500px; height:auto;" />
    </body>
    </html>
  `);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/raw_gif_frame.png' });
  await browser.close();
  console.log('raw_gif_frame.png saved');
}
test();

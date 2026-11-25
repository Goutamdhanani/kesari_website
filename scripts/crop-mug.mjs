import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

async function cropMug() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
  });
  const page = await browser.newPage();
  await page.setContent(`
    <html>
    <body style="margin:0; background:transparent;">
      <canvas id="c" width="480" height="480"></canvas>
      <img id="logo" src="http://localhost:3000/assets/kesari-logo-colour-long.png" style="display:none;" />
      <script>
        window.cropDone = new Promise(resolve => {
          const img = document.getElementById('logo');
          img.onload = () => {
            const canvas = document.getElementById('c');
            const ctx = canvas.getContext('2d');
            // The mug is on the left: X around 40 to 420, Y around 30 to 520
            // In 1920x561 image:
            // Crop sx: 40, sy: 20, sWidth: 420, sHeight: 520
            ctx.drawImage(img, 50, 30, 400, 500, 0, 0, 480, 480);
            resolve(canvas.toDataURL('image/png'));
          };
        });
      </script>
    </body>
    </html>
  `);
  
  const dataUrl = await page.evaluate(() => window.cropDone);
  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('x:/district/public/assets/kesari-mug.png', base64Data, 'base64');
  fs.writeFileSync('x:/district/public/favicon.png', base64Data, 'base64');
  console.log('Mug cropped and saved to kesari-mug.png and favicon.png');
  await browser.close();
}
cropMug();

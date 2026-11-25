import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000; overflow:hidden; display:flex; align-items:center; justify-content:center;">
        <img id="gif" src="http://localhost:3000/assets/plasma_sphere.gif" style="width:800px; height:600px; display:block;" />
      </body>
    </html>
  `);
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/47_gif_raw_frame.png' });

  const stats = await page.evaluate(() => {
    const img = document.getElementById('gif');
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 800, 600);

    const bgPixel = ctx.getImageData(20, 20, 1, 1).data;
    const centerPixel = ctx.getImageData(400, 300, 1, 1).data;

    let rightEdge = 400;
    for (let x = 400; x < 800; x++) {
      const p = ctx.getImageData(x, 300, 1, 1).data;
      if (p[0] > 15 || p[1] > 15 || p[2] > 15) {
        rightEdge = x;
      }
    }
    let leftEdge = 400;
    for (let x = 400; x >= 0; x--) {
      const p = ctx.getImageData(x, 300, 1, 1).data;
      if (p[0] > 15 || p[1] > 15 || p[2] > 15) {
        leftEdge = x;
      }
    }

    let topEdge = 300;
    for (let y = 300; y >= 0; y--) {
      const p = ctx.getImageData(400, y, 1, 1).data;
      if (p[0] > 15 || p[1] > 15 || p[2] > 15) {
        topEdge = y;
      }
    }

    let bottomEdge = 300;
    for (let y = 300; y < 600; y++) {
      const p = ctx.getImageData(400, y, 1, 1).data;
      if (p[0] > 15 || p[1] > 15 || p[2] > 15) {
        bottomEdge = y;
      }
    }

    return {
      bg: [bgPixel[0], bgPixel[1], bgPixel[2]],
      center: [centerPixel[0], centerPixel[1], centerPixel[2]],
      leftEdge,
      rightEdge,
      topEdge,
      bottomEdge,
      sphereWidth: rightEdge - leftEdge,
      sphereHeight: bottomEdge - topEdge,
      centerX: (leftEdge + rightEdge) / 2,
      centerY: (topEdge + bottomEdge) / 2
    };
  });

  console.log('GIF stats:', JSON.stringify(stats, null, 2));
  await browser.close();
})();

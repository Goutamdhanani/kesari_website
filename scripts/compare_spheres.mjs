import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 600 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

  await page.evaluate(() => {
    document.body.innerHTML = `
      <div style="background:#08080C; color:white; font-family:sans-serif; display:flex; flex-direction:column; align-items:center; padding:40px; gap:30px; min-height:100vh;">
        <h2 style="margin:0 0 10px 0;">Kesari Studio Feature Spheres: Natural High-Def vs Masked</h2>
        <div style="display:flex; gap:40px; align-items:flex-start;">
          <!-- Card 1: Natural Screen Blend (Crisp Glowing Rim matching reference image) -->
          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:24px 32px; display:flex; flex-direction:column; align-items:center; gap:16px;">
            <div style="font-size:13px; color:#A78BFA; font-weight:700; letter-spacing:0.5px;">CRISP 4K RIM (EXACT REFERENCE MATCH)</div>
            <div style="display:flex; gap:24px;">
              <!-- Events -->
              <div style="position:relative; width:68px; height:68px; display:flex; align-items:center; justify-content:center;">
                <div style="position:absolute; width:48px; height:48px; border-radius:50%; filter:blur(12px); background:rgba(99,102,241,0.5);"></div>
                <img src="/assets/plasma_sphere.gif" style="position:absolute; width:136px; height:102px; left:50%; top:50%; transform:translate(-50%, -50%); mix-blend-mode:screen; filter:contrast(115%) brightness(1.15) saturate(130%); pointer-events:none;" />
              </div>
              <!-- Organise -->
              <div style="position:relative; width:68px; height:68px; display:flex; align-items:center; justify-content:center;">
                <div style="position:absolute; width:48px; height:48px; border-radius:50%; filter:blur(12px); background:rgba(245,158,11,0.45);"></div>
                <img src="/assets/plasma_sphere.gif" style="position:absolute; width:136px; height:102px; left:50%; top:50%; transform:translate(-50%, -50%); mix-blend-mode:screen; filter:hue-rotate(152deg) contrast(118%) brightness(1.15) saturate(160%); pointer-events:none;" />
              </div>
              <!-- Gear -->
              <div style="position:relative; width:68px; height:68px; display:flex; align-items:center; justify-content:center;">
                <div style="position:absolute; width:48px; height:48px; border-radius:50%; filter:blur(12px); background:rgba(216,255,72,0.4);"></div>
                <img src="/assets/plasma_sphere.gif" style="position:absolute; width:136px; height:102px; left:50%; top:50%; transform:translate(-50%, -50%); mix-blend-mode:screen; filter:hue-rotate(256deg) contrast(118%) brightness(1.2) saturate(175%); pointer-events:none;" />
              </div>
            </div>
            <span style="font-size:11px; color:#94A3B8;">Sharp luminous perimeter with pure black transparency & smooth interior fluid wave</span>
          </div>

          <!-- Card 2: Masked (Faded blurry edge) -->
          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:24px 32px; display:flex; flex-direction:column; align-items:center; gap:16px;">
            <div style="font-size:13px; color:#64748B; font-weight:700; letter-spacing:0.5px;">RADIAL-MASKED (FADED BLURRED RIM)</div>
            <div style="display:flex; gap:24px;">
              <div style="position:relative; width:68px; height:68px; display:flex; align-items:center; justify-content:center;">
                <div style="position:absolute; width:48px; height:48px; border-radius:50%; filter:blur(12px); background:rgba(99,102,241,0.45);"></div>
                <img src="/assets/plasma_sphere.gif" style="position:absolute; width:170px; height:128px; left:50%; top:50%; transform:translate(-50%, -50%); mix-blend-mode:screen; -webkit-mask-image:radial-gradient(circle at center, black 58%, transparent 72%); mask-image:radial-gradient(circle at center, black 58%, transparent 72%); filter:contrast(110%) brightness(1.15) saturate(120%); pointer-events:none;" />
              </div>
              <div style="position:relative; width:68px; height:68px; display:flex; align-items:center; justify-content:center;">
                <div style="position:absolute; width:48px; height:48px; border-radius:50%; filter:blur(12px); background:rgba(245,158,11,0.42);"></div>
                <img src="/assets/plasma_sphere.gif" style="position:absolute; width:170px; height:128px; left:50%; top:50%; transform:translate(-50%, -50%); mix-blend-mode:screen; -webkit-mask-image:radial-gradient(circle at center, black 58%, transparent 72%); mask-image:radial-gradient(circle at center, black 58%, transparent 72%); filter:hue-rotate(152deg) contrast(115%) brightness(1.12) saturate(160%); pointer-events:none;" />
              </div>
              <div style="position:relative; width:68px; height:68px; display:flex; align-items:center; justify-content:center;">
                <div style="position:absolute; width:48px; height:48px; border-radius:50%; filter:blur(12px); background:rgba(216,255,72,0.38);"></div>
                <img src="/assets/plasma_sphere.gif" style="position:absolute; width:170px; height:128px; left:50%; top:50%; transform:translate(-50%, -50%); mix-blend-mode:screen; -webkit-mask-image:radial-gradient(circle at center, black 58%, transparent 72%); mask-image:radial-gradient(circle at center, black 58%, transparent 72%); filter:hue-rotate(256deg) contrast(115%) brightness(1.2) saturate(175%); pointer-events:none;" />
              </div>
            </div>
            <span style="font-size:11px; color:#64748B;">Mask gradient feathers the crisp rim away making the sphere appear fuzzy</span>
          </div>
        </div>
      </div>
    `;
  });

  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/48_sphere_comparison.png' });
  console.log('Sphere comparison saved cleanly!');
  await browser.close();
})();

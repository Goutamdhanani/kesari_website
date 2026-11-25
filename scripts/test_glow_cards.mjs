import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 750 });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 40px;
            background: #06060A;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #FFFFFF;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }

          /* Exact Image 2 Style: Crisp Gradient Border + Smooth Inset Fade + Clear Centre */
          .carousel-glow-card {
            position: relative;
            width: 580px;
            height: 380px;
            border-radius: 36px;
            background: #08090F;
            box-shadow: 
              0 24px 60px -10px rgba(0, 0, 0, 0.85),
              0 0 45px -8px rgba(111, 120, 232, 0.55),
              0 0 25px -4px rgba(216, 255, 72, 0.35);
          }

          /* 1. Luminous 2.5px Gradient Rim Stroke (Colors all around) */
          .carousel-glow-card::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 38px;
            background: conic-gradient(
              from 215deg at 50% 50%,
              #6F78E8 0deg,
              #A78BFA 75deg,
              #D8FF48 175deg,
              #00F0FF 265deg,
              #6F78E8 360deg
            );
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            padding: 2.5px;
            pointer-events: none;
            z-index: 5;
          }

          /* 2. Perimeter Glow that reduces toward the center */
          .perimeter-fade {
            position: absolute;
            inset: 0;
            border-radius: 36px;
            pointer-events: none;
            z-index: 2;
            box-shadow: 
              inset 0 0 32px 3px rgba(111, 120, 232, 0.45),
              inset 0 0 65px 8px rgba(216, 255, 72, 0.20);
          }

          /* 3. Backdrop photo with soft vignette */
          .card-photo {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.30;
            border-radius: 36px;
            pointer-events: none;
          }

          /* 4. Clear Centre Content */
          .card-content {
            position: relative;
            z-index: 10;
            width: 100%;
            height: 100%;
            padding: 30px 34px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .badge {
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            font-size: 12px;
            font-weight: 600;
            padding: 5px 14px;
            border-radius: 100px;
          }

          .seats-pill {
            background: rgba(216, 255, 72, 0.14);
            border: 1px solid rgba(216, 255, 72, 0.35);
            color: #D8FF48;
            font-size: 11px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 100px;
          }

          .heart-btn {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
          }

          /* Minimal, Spacious, Proper Typography */
          .date-strip {
            font-size: 13px;
            font-weight: 700;
            color: #D8FF48;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
          }

          .event-title {
            font-size: 30px;
            font-weight: 900;
            letter-spacing: -0.5px;
            line-height: 1.15;
            margin: 0 0 6px 0;
            color: #FFFFFF;
          }

          .artist-line {
            font-size: 15px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.75);
            margin: 0;
          }

          .bottom-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 16px;
          }

          .price-val {
            font-size: 20px;
            font-weight: 800;
            font-family: monospace;
            color: #FFFFFF;
          }

          .buy-btn {
            background: #D8FF48;
            color: #07070A;
            font-weight: 800;
            padding: 11px 24px;
            border-radius: 100px;
            border: none;
            font-size: 13px;
            box-shadow: 0 0 20px rgba(216, 255, 72, 0.35);
            cursor: pointer;
          }

          .arrow-btn {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.45);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="carousel-glow-card">
          <!-- Colorful perimeter border glow (reduces toward center) -->
          <div class="perimeter-fade"></div>
          
          <!-- Background image -->
          <img src="http://localhost:3000/assets/events/rock_concert.webp" class="card-photo" />

          <!-- Minimal, clean, clear centre content -->
          <div class="card-content">
            <!-- Top Row: Minimal Badge + Seats Pill + Heart -->
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="badge">Main Stage</span>
              <div style="display:flex; align-items:center; gap:10px;">
                <span class="seats-pill">â—  8 seats left</span>
                <div class="heart-btn">â™¡</div>
              </div>
            </div>

            <!-- Middle: Clean, minimal, zero clutter -->
            <div style="margin: auto 0 16px 0;">
              <div class="date-strip">TONIGHT Â· 7:00 PM</div>
              <h2 class="event-title">Rock Legends Reunion</h2>
              <p class="artist-line">The Velvet Echoes</p>
            </div>

            <!-- Bottom Row: Price + Arrows + Buy CTA -->
            <div class="bottom-row">
              <div>
                <div style="font-size:10px; color:rgba(255,255,255,0.45); text-transform:uppercase; font-weight:600;">From</div>
                <div class="price-val">â‚¹1,499 <span style="font-size:11px; font-weight:normal; color:rgba(255,255,255,0.45); font-family:sans-serif;">/ pass</span></div>
              </div>

              <div style="display:flex; align-items:center; gap:12px;">
                <div style="display:flex; gap:6px;">
                  <button class="arrow-btn">â€¹</button>
                  <button class="arrow-btn">â€º</button>
                </div>
                <button class="buy-btn">Buy Ticket â†’</button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);

  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/pooja/.gemini/antigravity/brain/99d5dd0e-acdc-4a2e-bbb1-5388bb9e12c7/61_minimal_proper_card.png' });
  console.log('Minimal proper card captured!');
  await browser.close();
})();

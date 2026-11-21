import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import QRCode from 'qrcode';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, {recursive: true});
}

const domain = (process.env.DOMAIN || 'https://kesari.studio').replace(/\/+$/, '');
const targetUrl = `${domain}/menu`;

console.log(`[generate_qr] Generating permanent QR code for: ${targetUrl}`);

// 1. Generate High-Res PNG (2048x2048 with errorCorrectionLevel H)
const pngPath = path.join(publicDir, 'menu-qr-highres.png');
await QRCode.toFile(pngPath, targetUrl, {
  errorCorrectionLevel: 'H',
  type: 'png',
  margin: 4,
  width: 2048,
  color: {
    dark: '#080808',
    light: '#ffffff'
  }
});
console.log(`[generate_qr] Wrote ${pngPath} (${fs.statSync(pngPath).size} bytes)`);

// 2. Generate crisp SVG format
const svgPath = path.join(publicDir, 'menu-qr.svg');
const svgString = await QRCode.toString(targetUrl, {
  errorCorrectionLevel: 'H',
  type: 'svg',
  margin: 4,
  color: {
    dark: '#080808',
    light: '#ffffff'
  }
});
fs.writeFileSync(svgPath, svgString, 'utf8');
console.log(`[generate_qr] Wrote ${svgPath} (${fs.statSync(svgPath).size} bytes)`);

// 3. Generate Print-Ready HTML/PDF Template (A5 / A4 Standee & Table Tent)
const printHtmlPath = path.join(publicDir, 'menu-qr-print.html');
const printHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kesari - Live Menu QR Display</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');

    :root {
      --bg: #0A0C10;
      --card-bg: #12141D;
      --border: rgba(255, 255, 255, 0.12);
      --accent-lime: #DAFB71;
      --accent-gold: #F59E0B;
      --accent-blue: #0042D9;
      --text: #F8FAFC;
      --text-muted: #94A3B8;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: #050608;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      color: var(--text);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 16px;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    .toolbar {
      margin-bottom: 24px;
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .btn-print {
      background: var(--accent-lime);
      color: #080808;
      border: none;
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 700;
      border-radius: 9999px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 20px rgba(218, 251, 113, 0.3);
      transition: transform 0.2s, opacity 0.2s;
    }

    .btn-print:hover {
      transform: translateY(-1px);
      opacity: 0.95;
    }

    .print-card {
      width: 100%;
      max-width: 440px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 28px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      position: relative;
      overflow: hidden;
    }

    .print-card::before {
      content: '';
      position: absolute;
      top: -120px;
      left: 50%;
      transform: translateX(-50%);
      width: 240px;
      height: 240px;
      background: radial-gradient(circle, rgba(218, 251, 113, 0.15) 0%, transparent 70%);
      pointer-events: none;
    }

    .brand-tag {
      display: inline-block;
      font-family: 'Space Grotesk', monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--accent-lime);
      background: rgba(218, 251, 113, 0.1);
      padding: 6px 14px;
      border-radius: 9999px;
      border: 1px solid rgba(218, 251, 113, 0.25);
      margin-bottom: 16px;
    }

    .studio-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #FFFFFF;
      margin-bottom: 6px;
    }

    .studio-sub {
      font-size: 13px;
      color: var(--text-muted);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 28px;
    }

    .qr-container {
      background: #FFFFFF;
      border-radius: 20px;
      padding: 16px;
      display: inline-block;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      margin-bottom: 24px;
      position: relative;
    }

    .qr-container svg,
    .qr-container img {
      display: block;
      width: 220px;
      height: 220px;
    }

    .qr-badge {
      font-size: 11px;
      font-weight: 700;
      color: #080808;
      background: var(--accent-lime);
      padding: 4px 10px;
      border-radius: 6px;
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .headline {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin-top: 10px;
      margin-bottom: 8px;
      letter-spacing: -0.01em;
    }

    .subheadline {
      font-size: 13px;
      line-height: 1.5;
      color: var(--text-muted);
      margin-bottom: 24px;
      padding: 0 12px;
    }

    .steps {
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      padding: 14px 16px;
      text-align: left;
      margin-bottom: 24px;
    }

    .step-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: #E2E8F0;
    }

    .step-num {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(218, 251, 113, 0.15);
      color: var(--accent-lime);
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .footer-strip {
      border-top: 1px solid var(--border);
      padding-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 11px;
      color: var(--text-muted);
    }

    .footer-link {
      color: var(--accent-lime);
      text-decoration: none;
      font-weight: 600;
      word-break: break-all;
    }

    @media print {
      @page {
        size: A5 portrait;
        margin: 10mm;
      }

      body {
        background: #FFFFFF !important;
        color: #080808 !important;
        padding: 0 !important;
        display: block !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .no-print {
        display: none !important;
      }

      .print-card {
        max-width: 100% !important;
        background: #FFFFFF !important;
        border: 2px solid #080808 !important;
        border-radius: 16px !important;
        box-shadow: none !important;
        padding: 24px !important;
        color: #080808 !important;
      }

      .studio-name,
      .headline {
        color: #080808 !important;
      }

      .studio-sub,
      .subheadline,
      .footer-strip {
        color: #475569 !important;
      }

      .brand-tag {
        background: #F1F5F9 !important;
        border-color: #CBD5E1 !important;
        color: #0F172A !important;
      }

      .steps {
        background: #F8FAFC !important;
        border: 1px solid #E2E8F0 !important;
      }

      .step-item {
        color: #0F172A !important;
      }

      .step-num {
        background: #080808 !important;
        color: #FFFFFF !important;
      }

      .qr-container {
        border: 1px solid #CBD5E1 !important;
        box-shadow: none !important;
      }

      .qr-badge {
        background: #080808 !important;
        color: #FFFFFF !important;
      }

      .footer-link {
        color: #080808 !important;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar no-print">
    <button class="btn-print" onclick="window.print()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
      Print Table Standee (A5 / A4)
    </button>
  </div>

  <div class="print-card">
    <div class="brand-tag">Kesari Creative Sanctuary</div>
    <h1 class="studio-name">KESARI</h1>
    <div class="studio-sub">The Memory Studio • Koramangala</div>

    <div class="qr-container">
      ${svgString}
      <div class="qr-badge">SCAN LIVE MENU</div>
    </div>

    <h2 class="headline">Scan for Live Daily Menu</h2>
    <p class="subheadline">Fresh café culinary specials, specialty saffron brew, artisanal dining & event bulk catering.</p>

    <div class="steps">
      <div class="step-item">
        <span class="step-num">1</span>
        <span>Open your phone camera</span>
      </div>
      <div class="step-item">
        <span class="step-num">2</span>
        <span>Point at this QR code</span>
      </div>
      <div class="step-item">
        <span class="step-num">3</span>
        <span>Explore live items, dietary tags & specials</span>
      </div>
    </div>

    <div class="footer-strip">
      <div><strong>Kesari - The Memory Studio</strong></div>
      <div>Koramangala, Bangalore • Ph: +91 77605 39955</div>
      <div><a class="footer-link" href="${targetUrl}">${targetUrl}</a></div>
      <div style="margin-top: 6px; font-style: italic;">Work here. Eat here. Meet here. Belong here.</div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(printHtmlPath, printHtmlContent, 'utf8');
console.log(`[generate_qr] Wrote ${printHtmlPath} (${fs.statSync(printHtmlPath).size} bytes)`);
console.log('[generate_qr] Successfully generated all QR assets!');

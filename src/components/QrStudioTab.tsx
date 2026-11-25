import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  Check,
  Coffee,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Link2,
  Mic2,
  QrCode,
  Sparkles,
  Ticket,
} from 'lucide-react';

type QrPresetId = 'cafe' | 'events' | 'artists' | 'home' | 'custom';

const PRESETS: Array<{
  id: QrPresetId;
  label: string;
  path: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'cafe',
    label: 'Café Menu QR',
    path: '/menu',
    description: 'Opens digital Café Menu & WhatsApp ordering directly',
    Icon: Coffee,
  },
  {
    id: 'events',
    label: 'Events & Tickets QR',
    path: '/schedule',
    description: 'Opens live schedule & ticket booking',
    Icon: Ticket,
  },
  {
    id: 'artists',
    label: 'Artist Register QR',
    path: '/artists/register',
    description: 'Opens Artist Roster registration form',
    Icon: Mic2,
  },
  {
    id: 'home',
    label: 'Studio Home QR',
    path: '/',
    description: 'Opens main Kesari Studio homepage',
    Icon: Sparkles,
  },
  {
    id: 'custom',
    label: 'Custom URL / Link',
    path: '',
    description: 'Any custom studio page or external URL',
    Icon: Link2,
  },
];

export const QrStudioTab: React.FC = () => {
  const currentOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://kesaristudio.com';

  const [baseUrl, setBaseUrl] = useState<string>(currentOrigin);
  const [preset, setPreset] = useState<QrPresetId>('cafe');
  const [tableLabel, setTableLabel] = useState<string>('Table 1');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const targetUrl = useMemo(() => {
    const cleanBase = baseUrl.trim().replace(/\/+$/, '');
    if (preset === 'custom') {
      const raw = customUrl.trim();
      if (!raw) return cleanBase || currentOrigin;
      if (/^https?:\/\//i.test(raw)) return raw;
      return `${cleanBase}/${raw.replace(/^\/+/, '')}`;
    }

    const found = PRESETS.find((p) => p.id === preset);
    const path = found ? found.path : '/';
    if (preset === 'cafe' && tableLabel.trim()) {
      return `${cleanBase}${path}?table=${encodeURIComponent(tableLabel.trim())}`;
    }
    return `${cleanBase}${path}`;
  }, [baseUrl, preset, tableLabel, customUrl, currentOrigin]);

  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      width: 600,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: { dark: '#07070A', light: '#FFFFFF' },
    })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [targetUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    const suffix =
      preset === 'cafe' && tableLabel.trim()
        ? `cafe-${tableLabel.trim().toLowerCase().replace(/\s+/g, '-')}`
        : preset;
    a.download = `kesari-qr-${suffix}.png`;
    a.click();
  };

  return (
    <section aria-label="QR Menu & Multi-Purpose QR Generator" className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Controls */}
        <div className="lg:col-span-7 surface-charcoal rounded-[26px] p-5 space-y-5">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/45">
              DYNAMIC QR GENERATOR
            </p>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Café Menu &amp; Multi-Purpose QR
            </h3>
            <p className="text-xs text-white/55 mt-1">
              Works immediately with your live URL while your domain is pending, and switches to your custom domain anytime.
            </p>
          </div>

          {/* Step 1: Base Domain / Host */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#D8FF48]" />
              <span>1. Active Website Domain / Host</span>
            </label>
            <div className="flex flex-wrap gap-1.5 pb-1">
              <button
                type="button"
                onClick={() => setBaseUrl(currentOrigin)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                  baseUrl === currentOrigin
                    ? 'bg-white text-[#07070A] border-white font-semibold'
                    : 'bg-white/[0.04] text-white/65 border-white/10 hover:text-white'
                }`}
              >
                Use Current Live URL
              </button>
              <button
                type="button"
                onClick={() => setBaseUrl('https://kesaristudio.com')}
                className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                  baseUrl === 'https://kesaristudio.com'
                    ? 'bg-white text-[#07070A] border-white font-semibold'
                    : 'bg-white/[0.04] text-white/65 border-white/10 hover:text-white'
                }`}
              >
                kesaristudio.com (When Active)
              </button>
            </div>
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://your-domain-or-tunnel.com"
              className="w-full h-10 px-3.5 rounded-xl bg-black/45 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-[#D8FF48]"
            />
          </div>

          {/* Step 2: QR Purpose */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-white/80 block">
              2. Choose QR Destination
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESETS.map(({ id, label, description, Icon }) => {
                const active = preset === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPreset(id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                      active
                        ? 'bg-white/[0.09] border-[#D8FF48]/60 text-white'
                        : 'bg-white/[0.02] border-white/10 text-white/65 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        active ? 'bg-[#D8FF48] text-[#07070A]' : 'bg-white/[0.06] text-white/70'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{label}</div>
                      <p className="text-[10.5px] text-white/50 line-clamp-1 mt-0.5">
                        {description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contextual Option: Table Number for Cafe OR Custom Link */}
          {preset === 'cafe' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/75 block">
                Table / Seating Label (Optional — auto-fills in customer&apos;s order):
              </label>
              <input
                type="text"
                value={tableLabel}
                onChange={(e) => setTableLabel(e.target.value)}
                placeholder="e.g. Table 1, Lounge Couch, Balcony"
                className="w-full h-10 px-3.5 rounded-xl bg-black/45 border border-white/15 text-xs text-white focus:outline-none focus:border-[#D8FF48]"
              />
            </div>
          )}

          {preset === 'custom' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/75 block">
                Custom Path or Full URL:
              </label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="e.g. /about/our-story or https://instagram.com/..."
                className="w-full h-10 px-3.5 rounded-xl bg-black/45 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-[#D8FF48]"
              />
            </div>
          )}
        </div>

        {/* Right Preview Card */}
        <div className="lg:col-span-5 surface-charcoal rounded-[26px] p-5 flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#D8FF48]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
              {PRESETS.find((p) => p.id === preset)?.label}
            </span>
          </div>

          {qrDataUrl ? (
            <div className="p-3 rounded-2xl bg-white shadow-xl">
              <img
                src={qrDataUrl}
                alt="Kesari Studio QR Code"
                className="w-52 h-52 sm:w-56 sm:h-56"
              />
              <p className="text-[10px] font-bold text-[#07070A] tracking-wider uppercase mt-1.5">
                KESARI · {preset === 'cafe' && tableLabel ? tableLabel : 'THE MEMORY STUDIO'}
              </p>
            </div>
          ) : (
            <div className="w-56 h-56 rounded-2xl bg-white/10 animate-pulse" />
          )}

          <div className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-white/75 break-all">
            {targetUrl}
          </div>

          <div className="w-full grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="h-10 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#D8FF48]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="h-10 rounded-full bg-[#D8FF48] hover:bg-[#C8EE38] text-[#07070A] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
          </div>

          <a
            href={targetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-white/55 hover:text-white transition-colors"
          >
            <span>Test Link in New Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};

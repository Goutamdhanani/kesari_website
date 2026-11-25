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
  RefreshCw,
  Save,
  Sparkles,
  Ticket,
} from 'lucide-react';

type QrPresetId = 'cafe' | 'events' | 'artists' | 'home' | 'custom';

const PRODUCTION_DOMAIN = 'https://www.thekesari.com';

const DEFAULT_TARGETS: Record<Exclude<QrPresetId, 'custom'>, string> = {
  cafe: '/menu',
  events: '/schedule',
  artists: '/artists/register',
  home: '/',
};

const PRESETS: Array<{
  id: QrPresetId;
  label: string;
  path: string;
  qrSlug: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'cafe',
    label: 'Café Menu QR',
    path: '/menu',
    qrSlug: '/qr',
    description: 'Permanent /qr link — redirects to Café Menu (changeable anytime)',
    Icon: Coffee,
  },
  {
    id: 'events',
    label: 'Events & Tickets QR',
    path: '/schedule',
    qrSlug: '/qr/events',
    description: 'Permanent /qr/events link — live schedule & tickets',
    Icon: Ticket,
  },
  {
    id: 'artists',
    label: 'Artist Register QR',
    path: '/artists/register',
    qrSlug: '/qr/artists',
    description: 'Permanent /qr/artists link — Artist Roster registration',
    Icon: Mic2,
  },
  {
    id: 'home',
    label: 'Studio Home QR',
    path: '/',
    qrSlug: '/qr/home',
    description: 'Permanent /qr/home link — main Kesari Studio homepage',
    Icon: Sparkles,
  },
  {
    id: 'custom',
    label: 'Direct Custom URL',
    path: '',
    qrSlug: '',
    description: 'Encode any direct studio page or external link',
    Icon: Link2,
  },
];

async function renderQrWithLogo(
  text: string,
  embedLogo: boolean
): Promise<string> {
  const size = 800;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  await QRCode.toCanvas(canvas, text, {
    width: size,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: '#07070A', light: '#FFFFFF' },
  });

  if (!embedLogo) {
    return canvas.toDataURL('image/png');
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return canvas.toDataURL('image/png');
  }

  await new Promise<void>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const badgeSize = Math.round(size * 0.24);
      const badgeX = Math.round((size - badgeSize) / 2);
      const badgeY = Math.round((size - badgeSize) / 2);
      const radius = Math.round(badgeSize * 0.22);

      // Clean white rounded badge behind logo for 100% scan reliability
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, radius);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(7, 7, 10, 0.08)';
      ctx.stroke();
      ctx.restore();

      const pad = Math.round(badgeSize * 0.12);
      ctx.drawImage(
        img,
        badgeX + pad,
        badgeY + pad,
        badgeSize - pad * 2,
        badgeSize - pad * 2
      );
      resolve();
    };
    img.onerror = () => resolve();
    img.src = '/assets/kesari-logo-512.png';
  });

  return canvas.toDataURL('image/png');
}

export const QrStudioTab: React.FC = () => {
  const currentOrigin =
    typeof window !== 'undefined' ? window.location.origin : PRODUCTION_DOMAIN;

  const [baseUrl, setBaseUrl] = useState<string>(PRODUCTION_DOMAIN);
  const [preset, setPreset] = useState<QrPresetId>('cafe');
  const [usePermanentRedirect, setUsePermanentRedirect] = useState<boolean>(true);
  const [embedLogo, setEmbedLogo] = useState<boolean>(true);
  const [tableLabel, setTableLabel] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const [qrTargets, setQrTargets] = useState<Record<string, string>>(DEFAULT_TARGETS);
  const [savingTarget, setSavingTarget] = useState<boolean>(false);
  const [targetSavedMsg, setTargetSavedMsg] = useState<string>('');

  useEffect(() => {
    fetch('/api/qr/targets')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.ok && data.qrTargets) {
          setQrTargets({ ...DEFAULT_TARGETS, ...data.qrTargets });
        }
      })
      .catch(() => {});
  }, []);

  const targetUrl = useMemo(() => {
    const cleanBase = baseUrl.trim().replace(/\/+$/, '') || PRODUCTION_DOMAIN;
    if (preset === 'custom') {
      const raw = customUrl.trim();
      if (!raw) return cleanBase;
      if (/^https?:\/\//i.test(raw)) return raw;
      return `${cleanBase}/${raw.replace(/^\/+/, '')}`;
    }

    const found = PRESETS.find((p) => p.id === preset);
    const path = usePermanentRedirect
      ? found?.qrSlug || '/qr'
      : found?.path || '/';

    if (preset === 'cafe' && tableLabel.trim()) {
      return `${cleanBase}${path}?table=${encodeURIComponent(tableLabel.trim())}`;
    }
    return `${cleanBase}${path}`;
  }, [baseUrl, preset, usePermanentRedirect, tableLabel, customUrl]);

  useEffect(() => {
    let cancelled = false;
    renderQrWithLogo(targetUrl, embedLogo)
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [targetUrl, embedLogo]);

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

  const handleSaveRedirectTarget = async () => {
    if (preset === 'custom') return;
    setSavingTarget(true);
    setTargetSavedMsg('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrTargets }),
      });
      const data = await res.json();
      if (res.ok && data?.ok) {
        setTargetSavedMsg('Redirect destination saved! Existing printed QRs updated.');
        setTimeout(() => setTargetSavedMsg(''), 3500);
      } else {
        setTargetSavedMsg(data?.error || 'Failed to save redirect');
      }
    } catch {
      setTargetSavedMsg('Network error saving redirect');
    } finally {
      setSavingTarget(false);
    }
  };

  const activeRedirectValue =
    preset !== 'custom' ? qrTargets[preset] ?? DEFAULT_TARGETS[preset] : '';

  return (
    <section aria-label="QR Menu & Multi-Purpose QR Generator" className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Controls */}
        <div className="lg:col-span-7 surface-charcoal rounded-[26px] p-5 space-y-5">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/45">
              PERMANENT REDIRECTABLE QR + LOGO
            </p>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Café Menu &amp; Universal QR Studio
            </h3>
            <p className="text-xs text-white/55 mt-1">
              Print once with your Kesari logo. Because it uses{' '}
              <span className="font-mono text-white/80">www.thekesari.com/qr</span>, you can
              redirect it to any menu, event, or external link anytime without ever changing the QR.
            </p>
          </div>

          {/* Step 1: Base Domain / Host */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#D8FF48]" />
              <span>1. Website Domain</span>
            </label>
            <div className="flex flex-wrap gap-1.5 pb-1">
              <button
                type="button"
                onClick={() => setBaseUrl(PRODUCTION_DOMAIN)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                  baseUrl === PRODUCTION_DOMAIN
                    ? 'bg-white text-[#07070A] border-white font-semibold'
                    : 'bg-white/[0.04] text-white/65 border-white/10 hover:text-white'
                }`}
              >
                www.thekesari.com
              </button>
              <button
                type="button"
                onClick={() => setBaseUrl(currentOrigin)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                  baseUrl === currentOrigin
                    ? 'bg-white text-[#07070A] border-white font-semibold'
                    : 'bg-white/[0.04] text-white/65 border-white/10 hover:text-white'
                }`}
              >
                Current Host ({currentOrigin.replace(/^https?:\/\//, '')})
              </button>
            </div>
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://www.thekesari.com"
              className="w-full h-10 px-3.5 rounded-xl bg-black/45 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-[#D8FF48]"
            />
          </div>

          {/* Step 2: QR Purpose */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-white/80 block">
              2. Choose QR Purpose
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

          {/* Options: Permanent Redirect + Logo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {preset !== 'custom' && (
              <label className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-black/35 border border-white/10 cursor-pointer">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-[#D8FF48]" />
                    <span>Permanent Redirect</span>
                  </div>
                  <p className="text-[10.5px] text-white/45 mt-0.5">
                    QR stays fixed forever; change target anytime
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={usePermanentRedirect}
                  onChange={(e) => setUsePermanentRedirect(e.target.checked)}
                  className="accent-[#D8FF48] w-4 h-4 shrink-0"
                />
              </label>
            )}

            <label className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-black/35 border border-white/10 cursor-pointer">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white">Kesari Logo in Center</div>
                <p className="text-[10.5px] text-white/45 mt-0.5">
                  High-correction (H) scannable emblem
                </p>
              </div>
              <input
                type="checkbox"
                checked={embedLogo}
                onChange={(e) => setEmbedLogo(e.target.checked)}
                className="accent-[#D8FF48] w-4 h-4 shrink-0"
              />
            </label>
          </div>

          {/* Contextual Option: Table Number for Cafe OR Custom Link */}
          {preset === 'cafe' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/75 block">
                Table / Seating Label (Optional — leave blank for universal Café QR):
              </label>
              <input
                type="text"
                value={tableLabel}
                onChange={(e) => setTableLabel(e.target.value)}
                placeholder="e.g. Table 1, Lounge Couch (or leave blank for everywhere)"
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

          {/* Live Redirect Destination Editor */}
          {preset !== 'custom' && usePermanentRedirect && (
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-[#D8FF48]/25 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-white">
                  Live Redirect Destination for{' '}
                  <span className="font-mono text-[#D8FF48]">
                    {PRESETS.find((p) => p.id === preset)?.qrSlug}
                  </span>
                </span>
                <span className="text-[10px] text-white/45">No reprinting needed</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={activeRedirectValue}
                  onChange={(e) =>
                    setQrTargets((prev) => ({ ...prev, [preset]: e.target.value }))
                  }
                  placeholder="/menu or https://..."
                  className="flex-1 h-9 px-3 rounded-xl bg-black/50 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-[#D8FF48]"
                />
                <button
                  type="button"
                  onClick={handleSaveRedirectTarget}
                  disabled={savingTarget}
                  className="h-9 px-4 rounded-xl bg-[#D8FF48] hover:bg-[#C8EE38] disabled:opacity-60 text-[#07070A] text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingTarget ? 'Saving...' : 'Update Redirect'}</span>
                </button>
              </div>
              {targetSavedMsg && (
                <p className="text-[11px] text-[#D8FF48] font-medium">{targetSavedMsg}</p>
              )}
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
            <div className="p-3.5 rounded-2xl bg-white shadow-xl">
              <img
                src={qrDataUrl}
                alt="Kesari Studio QR Code with Logo"
                className="w-56 h-56 sm:w-60 sm:h-60"
              />
              <p className="text-[10px] font-bold text-[#07070A] tracking-wider uppercase mt-1.5">
                KESARI · {preset === 'cafe' && tableLabel ? tableLabel : 'CAFÉ & STUDIO'}
              </p>
            </div>
          ) : (
            <div className="w-60 h-60 rounded-2xl bg-white/10 animate-pulse" />
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

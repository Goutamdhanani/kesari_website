import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Mic2,
  Phone,
  RotateCcw,
  Shield,
  User,
  Users,
  UtensilsCrossed,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  collectAllDeviceInfo,
  DeviceDetails,
  formatDDMMYY,
  formatTime12h,
} from '../utils/collectDeviceInfo';

export interface CheckInResponse {
  success: boolean;
  message: string;
  entryNumber?: number;
  dayNumber?: number;
  slotInDay?: string;
  eventDate?: string;
  actualDate?: string;
  actualTime?: string;
  name?: string;
  phone?: string;
  role?: string;
  passId?: string;
  warning?: string;
  offlinePending?: boolean;
}

interface QueuedCheckIn {
  localId: string;
  name: string;
  phone: string;
  role: 'Audience' | 'Organisers' | 'Artist';
  clientInfo: DeviceDetails;
  queuedAt: string;
}

const OFFLINE_QUEUE_KEY = 'kesari_checkin_queue_v1';

function loadOfflineQueue(): QueuedCheckIn[] {
  try {
    const raw = window.localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOfflineQueue(items: QueuedCheckIn[]): void {
  try {
    window.localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

interface CheckInPageProps {
  onBack?: () => void;
  onOrderFood?: () => void;
}

export const CheckInPage: React.FC<CheckInPageProps> = ({ onBack, onOrderFood }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [role, setRole] = useState<'Audience' | 'Organisers' | 'Artist'>('Audience');
  const [error, setError] = useState<string | null>(null);
  const [showAutoInfo, setShowAutoInfo] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceDetails | null>(null);
  const [result, setResult] = useState<CheckInResponse | null>(null);
  const [redirectSeconds, setRedirectSeconds] = useState<number | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(() =>
    typeof window !== 'undefined' ? loadOfflineQueue().length : 0
  );
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const flushQueue = useCallback(async () => {
    const queue = loadOfflineQueue();
    if (queue.length === 0) {
      setPendingCount(0);
      return;
    }

    const remaining: QueuedCheckIn[] = [];
    for (const item of queue) {
      try {
        const res = await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: item.name,
            phone: item.phone,
            role: item.role,
            clientInfo: item.clientInfo,
          }),
          keepalive: true,
        });
        if (!res.ok) {
          remaining.push(item);
        }
      } catch {
        remaining.push(item);
      }
    }

    saveOfflineQueue(remaining);
    setPendingCount(remaining.length);
  }, []);

  useEffect(() => {
    collectAllDeviceInfo().then(setDeviceInfo);
    void flushQueue();

    const handleOnline = () => {
      setIsOnline(true);
      void flushQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    const interval = window.setInterval(() => {
      if (navigator.onLine && loadOfflineQueue().length > 0) {
        void flushQueue();
      }
    }, 15000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.clearInterval(interval);
    };
  }, [flushQueue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || cleanName.length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 6) {
      setError('Please enter a valid contact number.');
      return;
    }

    const formattedPhone = cleanPhone.startsWith('+')
      ? cleanPhone
      : `${countryCode} ${cleanPhone}`;

    const freshInfo = deviceInfo || (await collectAllDeviceInfo());
    const now = new Date();
    const actualDate = formatDDMMYY(now);
    const actualTime = formatTime12h(now);
    const localId = `Q-${now.getTime().toString().slice(-4)}`;

    // 1. Show instant confirmation immediately (zero wait!)
    setResult({
      success: true,
      message: navigator.onLine
        ? 'Sent! Your check-in is confirmed.'
        : 'Saved offline! Will sync automatically when internet returns.',
      name: cleanName,
      phone: formattedPhone,
      role,
      actualDate,
      actualTime,
      eventDate: actualDate,
      passId: localId,
      offlinePending: !navigator.onLine,
    });

    // 2. Queue locally first so offline / weak signal never loses a guest
    const queueItem: QueuedCheckIn = {
      localId,
      name: cleanName,
      phone: formattedPhone,
      role,
      clientInfo: freshInfo,
      queuedAt: now.toISOString(),
    };
    const nextQueue = [...loadOfflineQueue(), queueItem];
    saveOfflineQueue(nextQueue);
    setPendingCount(nextQueue.length);

    // 3. Dispatch immediately in background
    if (navigator.onLine) {
      try {
        const res = await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: cleanName,
            phone: formattedPhone,
            role,
            clientInfo: freshInfo,
          }),
          keepalive: true,
        });
        if (res.ok) {
          const data: CheckInResponse = await res.json();
          const remaining = loadOfflineQueue().filter((q) => q.localId !== localId);
          saveOfflineQueue(remaining);
          setPendingCount(remaining.length);
          setResult((prev) =>
            prev
              ? {
                  ...prev,
                  ...data,
                  offlinePending: false,
                }
              : data
          );
        }
      } catch {
        // Stays in localStorage queue and auto-syncs when internet is back
      }
    }
  };

  const handleReset = () => {
    setResult(null);
    setRedirectSeconds(null);
    setName('');
    setPhone('');
    setError(null);
    collectAllDeviceInfo().then(setDeviceInfo);
  };

  // Start 60-second auto-redirect to Café ONLY after check-in confirmation
  useEffect(() => {
    if (!result) {
      setRedirectSeconds(null);
      return;
    }
    setRedirectSeconds(60);
  }, [result]);

  useEffect(() => {
    if (redirectSeconds === null) return;
    if (redirectSeconds <= 0) {
      if (onOrderFood) {
        onOrderFood();
      } else if (typeof window !== 'undefined') {
        window.location.href = '/cafe';
      }
      return;
    }
    const timer = window.setTimeout(() => {
      setRedirectSeconds((prev) => (prev === null ? null : prev - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [redirectSeconds, onOrderFood]);

  return (
    <section aria-label="Guest Check-In" className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Studio</span>
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <button
              type="button"
              onClick={() => void flushQueue()}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-[11px] font-semibold text-amber-200"
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{pendingCount} pending sync</span>
            </button>
          )}
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D8FF48]">
            Contactless Check-In
          </span>
        </div>
      </div>

      <div className="max-w-[460px] mx-auto">
        {result ? (
          <div className="surface-charcoal rounded-[30px] p-6 sm:p-8 space-y-6 border border-white/12 shadow-2xl">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white text-[#07070A] flex items-center justify-center mx-auto shadow-[0_0_32px_rgba(255,255,255,0.28)]">
                <Check className="w-7 h-7 stroke-[2.75]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight">
                  Check-In Confirmed
                </h2>
                <p className="text-xs text-white/60">
                  Welcome, <span className="text-white font-semibold">{result.name}</span> — you&apos;re all set for the event.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-black/45 border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-white/45 block">
                    Pass ID
                  </span>
                  <span className="font-dot text-2xl text-[#D8FF48]">
                    {result.passId || 'VN-0001'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-white/45 block">
                    Role
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-white mt-0.5">
                    {result.role === 'Organisers' ? (
                      <Shield className="w-3 h-3 text-[#D8FF48]" />
                    ) : result.role === 'Artist' ? (
                      <Mic2 className="w-3 h-3 text-[#D8FF48]" />
                    ) : (
                      <Users className="w-3 h-3 text-[#D8FF48]" />
                    )}
                    {result.role || 'Audience'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-white/75">
                  <Calendar className="w-3.5 h-3.5 text-[#D8FF48]" />
                  <span>{result.actualDate || result.eventDate}</span>
                </div>
                <div className="flex items-center justify-end gap-1.5 text-white/75">
                  <Clock className="w-3.5 h-3.5 text-[#D8FF48]" />
                  <span>{result.actualTime}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#D8FF48]/15 border border-[#D8FF48]/45 text-center">
              <p className="text-sm font-extrabold text-[#D8FF48] tracking-wide">
                Ask for your band at the desk
              </p>
            </div>

            {result.warning && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-[11px] text-amber-200 leading-relaxed">
                {result.warning}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setRedirectSeconds(null);
                  if (onOrderFood) onOrderFood();
                }}
                className="h-12 rounded-full bg-white hover:bg-white/90 text-[#07070A] text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_28px_rgba(255,255,255,0.28)] transition-all active:scale-[0.98] cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Order Food</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="h-12 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Check In Another</span>
              </button>
            </div>

            {redirectSeconds !== null && (
              <p className="text-center text-[11px] text-white/45">
                Opening Café menu in <span className="font-mono text-white/75">{redirectSeconds}s</span>{' '}
                ·{' '}
                <button
                  type="button"
                  onClick={() => setRedirectSeconds(null)}
                  className="underline hover:text-white transition-colors"
                >
                  Stay here
                </button>
              </p>
            )}
          </div>
        ) : (
          <div className="surface-charcoal rounded-[30px] p-6 sm:p-8 space-y-6 border border-white/10 shadow-2xl">
            <div className="text-center space-y-2">
              <img
                src="/assets/kesari-logo-colour-long.png"
                alt="Kesari - The Memory Studio"
                className="h-9 w-auto object-contain mx-auto mb-1"
              />
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8FF48]/12 border border-[#D8FF48]/30 text-[#D8FF48] text-[10px] font-bold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8FF48] animate-pulse" />
                <span>Contactless Entry</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Guest Check-In
              </h1>
              <p className="text-xs text-white/55 max-w-[290px] mx-auto">
                Enter your details below for quick contactless clearance at Kesari Studio.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-red-500/15 border border-red-400/35 text-xs text-red-200 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="checkin-name"
                  className="block text-[10.5px] font-semibold uppercase tracking-wider text-white/60 pl-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    id="checkin-name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-2xl bg-black/45 border border-white/15 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#D8FF48] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="checkin-phone"
                  className="block text-[10.5px] font-semibold uppercase tracking-wider text-white/60 pl-1"
                >
                  Contact Number
                </label>
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-11 pl-3 pr-7 rounded-2xl bg-black/45 border border-white/15 text-xs font-semibold text-white focus:outline-none focus:border-[#D8FF48] appearance-none cursor-pointer"
                    >
                      <option value="+91">IN (+91)</option>
                      <option value="+1">US (+1)</option>
                      <option value="+44">UK (+44)</option>
                      <option value="+971">UAE (+971)</option>
                      <option value="+65">SG (+65)</option>
                      <option value="+61">AU (+61)</option>
                      <option value="+49">DE (+49)</option>
                      <option value="+33">FR (+33)</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-white/45 absolute right-2 top-3.5 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      id="checkin-phone"
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-2xl bg-black/45 border border-white/15 text-sm text-white font-mono placeholder-white/35 focus:outline-none focus:border-[#D8FF48] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-white/60 pl-1">
                  Attending As
                </span>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/45 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setRole('Audience')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'Audience'
                        ? 'bg-[#D8FF48] text-[#07070A]'
                        : 'text-white/65 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span>Audience</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Artist')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'Artist'
                        ? 'bg-[#D8FF48] text-[#07070A]'
                        : 'text-white/65 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Mic2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Artist</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Organisers')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'Organisers'
                        ? 'bg-[#D8FF48] text-[#07070A]'
                        : 'text-white/65 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    <span>Organisers</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-[#D8FF48] hover:bg-[#C8EE38] text-[#07070A] text-sm font-bold flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <span>Confirm Check-In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAutoInfo((v) => !v)}
                className="w-full flex items-center justify-between text-[11px] font-mono text-white/50 hover:text-white/80 py-1"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#D8FF48]" />
                  <span>Background telemetry (Date, Time, Device)</span>
                </span>
                {showAutoInfo ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {showAutoInfo && deviceInfo && (
                <div className="mt-2.5 p-3 rounded-2xl bg-black/45 border border-white/10 text-[10.5px] space-y-1.5 font-mono text-white/75">
                  <div className="flex justify-between">
                    <span className="text-white/45">Date:</span>
                    <span>{deviceInfo.clientDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/45">Time:</span>
                    <span>{deviceInfo.clientTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/45">Device:</span>
                    <span>
                      {deviceInfo.device} ({deviceInfo.os} · {deviceInfo.browser})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/45">Gate:</span>
                    <span className="text-[#D8FF48]">{deviceInfo.gate}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

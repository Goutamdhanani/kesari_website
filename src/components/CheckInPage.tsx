import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Loader2,
  Phone,
  RotateCcw,
  Shield,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { collectAllDeviceInfo, DeviceDetails } from '../utils/collectDeviceInfo';

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
}

interface CheckInPageProps {
  onBack?: () => void;
}

export const CheckInPage: React.FC<CheckInPageProps> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [role, setRole] = useState<'Audience' | 'Organisers'>('Audience');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAutoInfo, setShowAutoInfo] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceDetails | null>(null);
  const [result, setResult] = useState<CheckInResponse | null>(null);

  useEffect(() => {
    collectAllDeviceInfo().then(setDeviceInfo);
  }, []);

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

    setLoading(true);
    try {
      const formattedPhone = cleanPhone.startsWith('+')
        ? cleanPhone
        : `${countryCode} ${cleanPhone}`;

      const freshInfo = await collectAllDeviceInfo();

      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          phone: formattedPhone,
          role,
          clientInfo: freshInfo,
        }),
      });

      const data: CheckInResponse = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to complete check-in.');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setName('');
    setPhone('');
    setError(null);
    collectAllDeviceInfo().then(setDeviceInfo);
  };

  return (
    <section aria-label="Guest Check-In" className="space-y-5">
      {onBack && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Studio</span>
          </button>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D8FF48]">
            Contactless Check-In
          </span>
        </div>
      )}

      <div className="max-w-[460px] mx-auto">
        {result ? (
          <div className="surface-charcoal rounded-[30px] p-6 sm:p-8 space-y-6 border border-[#D8FF48]/25 shadow-2xl">
            <div className="text-center space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-[#D8FF48]/15 border border-[#D8FF48]/40 text-[#D8FF48] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#D8FF48]">
                CHECK-IN CONFIRMED
              </p>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Welcome, {result.name}
              </h2>
              <p className="text-xs text-white/55">
                {result.message}
              </p>
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
                    ) : (
                      <Users className="w-3 h-3 text-[#D8FF48]" />
                    )}
                    {result.role || 'Audience'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-white/45 block">
                    Day &amp; Slot
                  </span>
                  <span className="text-white font-semibold">
                    Day {result.dayNumber || 1} · {result.slotInDay || '1 / 50'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-white/45 block">
                    Entry #
                  </span>
                  <span className="font-mono text-white font-semibold">
                    #{result.entryNumber || 1}
                  </span>
                </div>
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

            {result.warning && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-[11px] text-amber-200 leading-relaxed">
                {result.warning}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleReset}
                className="h-11 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Check In Another</span>
              </button>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="h-11 rounded-full bg-[#D8FF48] hover:bg-[#C8EE38] text-[#07070A] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explore Studio</span>
                </button>
              )}
            </div>
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
                    disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
                      className="w-full h-11 pl-10 pr-4 rounded-2xl bg-black/45 border border-white/15 text-sm text-white font-mono placeholder-white/35 focus:outline-none focus:border-[#D8FF48] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-white/60 pl-1">
                  Attending As
                </span>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/45 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setRole('Audience')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'Audience'
                        ? 'bg-[#D8FF48] text-[#07070A]'
                        : 'text-white/65 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Audience</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Organisers')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'Organisers'
                        ? 'bg-[#D8FF48] text-[#07070A]'
                        : 'text-white/65 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Organisers</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-[#D8FF48] hover:bg-[#C8EE38] disabled:opacity-60 text-[#07070A] text-sm font-bold flex items-center justify-center gap-2 transition-colors mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking In...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Check-In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
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

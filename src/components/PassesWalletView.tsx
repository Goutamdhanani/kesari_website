import React, { useState } from 'react';
import { Bell, Calendar, CheckCircle2, QrCode, X } from 'lucide-react';
import { TicketPass, formatCurrencyINR } from '../utils/studioLogic';

interface PassesWalletViewProps {
  passes: TicketPass[];
  onToggleCheckIn: (passId: string) => void;
  onExploreEvents: () => void;
}

export const PassesWalletView: React.FC<PassesWalletViewProps> = ({
  passes,
  onToggleCheckIn,
  onExploreEvents,
}) => {
  const [activeQrPass, setActiveQrPass] = useState<TicketPass | null>(null);
  const [reminderArmed, setReminderArmed] = useState(false);
  const [calendarBanner, setCalendarBanner] = useState(false);

  const totalPasses = passes.length;
  const checkedInCount = passes.filter((p) => p.checkedIn).length;
  const sweepDeg = totalPasses > 0 ? Math.round((checkedInCount / totalPasses) * 270) : 45;

  const firstPending = passes.find((p) => !p.checkedIn) ?? passes[0] ?? null;

  return (
    <div className="space-y-6">
      {/* Reference 3: Deep Cerulean Ocean Glass Hero Card ("Daily Goal" -> "Entry Passes") */}
      <section
        aria-label="Nightly pass check-in progress"
        className="surface-cerulean rounded-[34px] p-6 sm:p-8 flex flex-col items-center text-center"
      >
        <h2 className="text-lg font-medium text-white tracking-tight">
          Nightly Check-In
        </h2>

        {/* Interlocking Dual Geometric Dial (Reference 3) */}
        <div className="my-7 flex items-center justify-center">
          {/* Left Conical Sweep Metallic Radar Circle */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 -mr-4 flex items-center justify-center">
            <div
              className="w-full h-full rounded-full conical-sweep-dial shadow-[0_14px_32px_rgba(0,0,0,0.6)] transition-transform duration-500"
              style={{ transform: `rotate(${sweepDeg}deg)` }}
            />
            {/* Signature crisp white square tick handles */}
            <span
              className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white"
              aria-hidden="true"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white"
              aria-hidden="true"
            />
          </div>

          {/* Right Dotted Orbital Ring + Iridescent Glint Orb */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-dotted border-white/40 flex items-center justify-center">
            <div className="w-[74px] h-[74px] sm:w-[82px] sm:h-[82px] rounded-full p-[2px] iridescent-orb-rim shadow-[0_0_26px_rgba(88,176,255,0.28)]">
              <div className="w-full h-full rounded-full bg-[#090D16] flex items-center justify-center">
                <span
                  data-testid="passes-fraction"
                  className="text-xl sm:text-2xl font-medium text-white tabular-nums"
                >
                  {checkedInCount}/{totalPasses}
                </span>
              </div>
            </div>
            <span
              className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white"
              aria-hidden="true"
            />
          </div>
        </div>

        <p className="max-w-xs text-xs text-white/60 leading-relaxed">
          Present your pass code at the Kesari Studio gate (Koramangala) to complete check-in.
        </p>

        {calendarBanner && (
          <p className="mt-3 text-xs text-[#9CD3FF] font-medium">
            {totalPasses} upcoming event schedule{totalPasses === 1 ? '' : 's'} synced to pass timeline.
          </p>
        )}

        {reminderArmed && (
          <p className="mt-2 text-xs text-[#D8FF48] font-medium">
            Gate reminder armed 60 minutes before doors open.
          </p>
        )}

        {/* Bottom 3-Button Action Dock inside Card (Reference 3) */}
        <div className="mt-6 w-full max-w-sm flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCalendarBanner((v) => !v)}
            aria-label="Sync event schedule"
            aria-pressed={calendarBanner}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
              calendarBanner
                ? 'bg-white/20 border-white/35 text-white'
                : 'bg-white/[0.06] border-white/10 text-white/80 hover:bg-white/12'
            }`}
          >
            <Calendar className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (firstPending) {
                setActiveQrPass(firstPending);
              } else {
                onExploreEvents();
              }
            }}
            className="flex-1 h-12 px-5 rounded-full bg-gradient-to-b from-[#235F92] to-[#133A5C] hover:from-[#2B70AB] hover:to-[#184770] border border-[#6FB8F7]/30 text-sm font-medium text-white shadow-[0_10px_28px_rgba(24,86,138,0.45)] active:scale-[0.98] transition-all whitespace-nowrap"
          >
            {firstPending ? 'Show QR Pass' : 'Browse Drops'}
          </button>

          <button
            type="button"
            onClick={() => setReminderArmed((v) => !v)}
            aria-label="Toggle gate reminder"
            aria-pressed={reminderArmed}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
              reminderArmed
                ? 'bg-[#D8FF48]/20 border-[#D8FF48]/60 text-[#D8FF48]'
                : 'bg-white/[0.06] border-white/10 text-white/80 hover:bg-white/12'
            }`}
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Minted Ticket Passes List */}
      <section aria-label="Your passes" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-semibold text-white">Your Passes</h3>
          <span className="text-xs text-white/55 tabular-nums">
            {totalPasses} Active
          </span>
        </div>

        {passes.length === 0 ? (
          <div className="surface-charcoal rounded-[26px] p-8 text-center">
            <p className="text-sm text-white/75">No ticket passes in your wallet yet.</p>
            <button
              type="button"
              onClick={onExploreEvents}
              className="mt-4 h-11 px-5 rounded-full bg-white text-[#07070A] text-xs font-semibold hover:bg-white/90"
            >
              Discover Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {passes.map((pass) => (
              <article
                key={pass.id}
                className="surface-charcoal rounded-[26px] p-4 sm:p-5 flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] text-white/55">
                      {pass.tier} · {pass.quantity} {pass.quantity === 1 ? 'Seat' : 'Seats'} ·{' '}
                      {pass.dateLabel} · {pass.timeLabel}
                    </p>
                    <h4 className="mt-1 text-[15px] font-semibold text-white truncate">
                      {pass.eventTitle}
                    </h4>
                    <p className="text-xs text-white/60 truncate mt-0.5">
                      {pass.venue}
                    </p>
                  </div>

                  <span className="font-dot text-sm text-white/90 shrink-0">
                    {pass.passCode}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/[0.08]">
                  <div className="min-w-0">
                    <div className="text-xs text-white/70 tabular-nums">
                      Paid {formatCurrencyINR(pass.totalPaid)}
                    </div>
                    <div
                      className={`text-[11px] font-medium ${
                        pass.checkedIn ? 'text-[#D8FF48]' : 'text-white/55'
                      }`}
                    >
                      {pass.checkedIn ? 'Checked In' : 'Ready at Gate'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveQrPass(pass)}
                      aria-label={`View QR pass for ${pass.eventTitle}`}
                      className="min-h-[40px] px-3 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleCheckIn(pass.id)}
                      className={`min-h-[40px] px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                        pass.checkedIn
                          ? 'bg-[#D8FF48] text-[#07070A]'
                          : 'bg-white text-[#07070A] hover:bg-white/90'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{pass.checkedIn ? 'Checked In' : 'Check In'}</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Interactive QR Gate Pass Modal */}
      {activeQrPass && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`QR Pass for ${activeQrPass.eventTitle}`}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
        >
          <div className="surface-cerulean w-full max-w-[360px] rounded-[34px] p-6 text-center relative">
            <button
              type="button"
              onClick={() => setActiveQrPass(null)}
              aria-label="Close QR pass"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <p className="text-xs text-white/65">Kesari Studio Gate Pass · Koramangala</p>
            <h3 className="mt-1 text-lg font-semibold text-white text-balance">
              {activeQrPass.eventTitle}
            </h3>
            <p className="mt-0.5 text-xs text-white/60">
              {activeQrPass.venue} · {activeQrPass.dateLabel}
            </p>

            {/* Deterministic Dot-Matrix QR Pattern */}
            <div className="my-5 mx-auto w-44 h-44 rounded-3xl bg-white p-4 flex items-center justify-center">
              <svg viewBox="0 0 90 90" className="w-full h-full" aria-hidden="true">
                {Array.from({ length: 9 }).map((_, r) =>
                  Array.from({ length: 9 }).map((__, c) => {
                    const hash =
                      (activeQrPass.passCode.charCodeAt((r + c) % activeQrPass.passCode.length) +
                        r * 7 +
                        c * 13) %
                      3;
                    const corner =
                      (r < 2 && c < 2) || (r < 2 && c > 6) || (r > 6 && c < 2);
                    if (!corner && hash === 0) return null;
                    return (
                      <rect
                        key={`${r}-${c}`}
                        x={c * 10 + 1}
                        y={r * 10 + 1}
                        width={8}
                        height={8}
                        rx={2}
                        fill="#050507"
                      />
                    );
                  })
                )}
              </svg>
            </div>

            <div className="font-dot text-2xl text-white">{activeQrPass.passCode}</div>
            <p className="mt-1 text-xs text-white/65">
              {activeQrPass.quantity}× {activeQrPass.tier} Entry
            </p>

            <button
              type="button"
              onClick={() => {
                onToggleCheckIn(activeQrPass.id);
                setActiveQrPass((prev) =>
                  prev ? { ...prev, checkedIn: !prev.checkedIn } : null
                );
              }}
              className="mt-5 w-full h-12 rounded-full bg-white text-[#07070A] font-semibold text-sm hover:bg-white/90 transition-colors"
            >
              {activeQrPass.checkedIn ? 'Checked In (Undo)' : 'Mark Checked In'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  FileText,
  MessageCircle,
  MessageSquare,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentInterface } from './PaymentInterface';
import {
  KESARI_CONTACT,
  SERVICE_CATALOG,
  ServiceKind,
  ServiceOption,
  StudioBooking,
  formatCurrencyINR,
} from '../utils/studioLogic';

interface ServiceBookingModalProps {
  kind: ServiceKind;
  onClose: () => void;
  onConfirmBooking: (params: {
    option: ServiceOption;
    duration: number;
    scheduleNote: string;
  }) => { ok: true; created: StudioBooking } | { ok: false; error: string };
}

const HEADER_COPY: Record<
  ServiceKind,
  { eyebrow: string; title: string; subtitle: string; listLabel: string; detailsLabel: string }
> = {
  membership: {
    eyebrow: 'THE KESARI CLUB',
    title: 'Make yourself at home.',
    subtitle: 'Your space to work, create and connect.',
    listLabel: 'CHOOSE YOUR MEMBERSHIP',
    detailsLabel: 'MEMBERSHIP BENEFITS',
  },
  gear: {
    eyebrow: 'AUDIO GEAR RENTAL',
    title: 'Pro audio, ready to roll.',
    subtitle: 'Official speakers, mixers, mics and stands for your event.',
    listLabel: 'CHOOSE YOUR EQUIPMENT',
    detailsLabel: 'EQUIPMENT SPECIFICATIONS',
  },
  space: {
    eyebrow: 'STUDIO SPACE RENTAL',
    title: 'Book your acoustic room.',
    subtitle: 'Main Hall, Jam Lounge & Full Studio · Koramangala.',
    listLabel: 'CHOOSE YOUR SPACE',
    detailsLabel: 'SPACE HIGHLIGHTS',
  },
};

const GEAR_FILTERS = ['All', 'Speakers', 'Mixers', 'Mics', 'Stands', 'Cables', 'Service'];

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  kind,
  onClose,
  onConfirmBooking,
}) => {
  const allOptions = SERVICE_CATALOG[kind];
  const copy = HEADER_COPY[kind];
  const [gearFilter, setGearFilter] = useState('All');

  const visibleOptions = useMemo(() => {
    if (kind !== 'gear' || gearFilter === 'All') return allOptions;
    return allOptions.filter((o) => o.badge === gearFilter);
  }, [allOptions, gearFilter, kind]);

  const [selectedId, setSelectedId] = useState(
    kind === 'membership' && allOptions[1] ? allOptions[1].id : allOptions[0].id,
  );
  const [duration, setDuration] = useState<number>(
    kind === 'membership' ? 1 : kind === 'gear' ? 1 : 2,
  );
  const [noteOpen, setNoteOpen] = useState(false);
  const [scheduleNote, setScheduleNote] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<StudioBooking | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedOption =
    visibleOptions.find((o) => o.id === selectedId) ??
    allOptions.find((o) => o.id === selectedId) ??
    allOptions[0];

  const durationChoices = useMemo(() => {
    if (kind === 'membership') {
      return [
        { value: 1, label: '1 mo' },
        { value: 3, label: '3 mo' },
        { value: 6, label: '6 mo' },
      ];
    }
    if (kind === 'gear') {
      return [
        { value: 1, label: '1 day' },
        { value: 2, label: '2 days' },
        { value: 3, label: '3 days' },
      ];
    }
    if (selectedOption.id === 'space-buyout') {
      return [
        { value: 1, label: 'Half-Day' },
        { value: 2, label: 'Full Day' },
      ];
    }
    return [
      { value: 2, label: '2 hrs' },
      { value: 4, label: '4 hrs' },
      { value: 6, label: '6 hrs' },
    ];
  }, [kind, selectedOption.id]);

  // Keep duration valid when switching between buyout and hourly rooms
  const activeDuration = durationChoices.some((d) => d.value === duration)
    ? duration
    : durationChoices[0].value;

  const total =
    selectedOption.id === 'space-buyout' && activeDuration === 2
      ? 14000
      : selectedOption.rate * activeDuration;

  const benefitItems = useMemo(() => {
    if (selectedOption.perks && selectedOption.perks.length > 0) {
      return selectedOption.perks;
    }
    const parts = selectedOption.subtitle
      .split('·')
      .map((s) => s.trim())
      .filter(Boolean);
    if (selectedOption.specs) {
      parts.push(selectedOption.specs);
    }
    return parts;
  }, [selectedOption]);

  const finalizeBooking = (ref?: string) => {
    const noteWithRef = [scheduleNote, ref ? `Ref: ${ref}` : ''].filter(Boolean).join(' · ');
    const res = onConfirmBooking({
      option: selectedOption,
      duration: activeDuration,
      scheduleNote: noteWithRef,
    });
    if (res.ok === false) {
      setError(res.error);
      return;
    }
    setError(null);
    if (ref) setPaymentRef(ref);
    setConfirmed(res.created);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handleWhatsAppInquiry = () => {
    const text = `Hi Kesari Studio, I have a question about ${selectedOption.name} (${activeDuration} ${selectedOption.unitLabel}) — ${formatCurrencyINR(total)}. ${scheduleNote ? `Note: ${scheduleNote}` : ''}`;
    window.open(KESARI_CONTACT.whatsappUrl(text), '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center sm:p-6 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full sm:max-w-[460px] rounded-t-[30px] sm:rounded-[30px] bg-[#0B0B0F] border border-white/10 p-5 sm:p-6 space-y-5 max-h-[92vh] overflow-y-auto shadow-2xl"
      >
        {/* Top Back + Close Bar */}
        <div className="flex items-center justify-between gap-2 pb-1">
          <button
            type="button"
            onClick={() => {
              if (showPayment) {
                setShowPayment(false);
              } else {
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-xs font-medium text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header */}
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/45">
            {copy.eyebrow}
          </p>
          <h3 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-tight mt-1">
            {copy.title}
          </h3>
          <p className="text-xs text-white/55 mt-1">{copy.subtitle}</p>
        </div>

        {confirmed ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-white text-[#07070A] flex items-center justify-center shadow-lg">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Booking Reserved</h4>
              <p className="mt-1 text-sm text-white/75">{confirmed.title}</p>
              <p className="text-xs text-white/50 mt-0.5">{confirmed.detail}</p>
            </div>
            <div className="inline-block px-5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-[10.5px] uppercase tracking-wider text-white/45 block">
                Reservation Code
              </span>
              <span className="font-dot text-2xl text-white mt-0.5 block">
                {confirmed.bookingCode}
              </span>
              {paymentRef && (
                <span className="text-[10px] text-white/60 font-mono block mt-1">
                  Ref: {paymentRef}
                </span>
              )}
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 rounded-full bg-white text-[#07070A] font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Done
              </button>
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="inline-flex items-center justify-center gap-1.5 text-xs text-white/55 hover:text-white py-2 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Confirm details on WhatsApp</span>
              </button>
            </div>
          </div>
        ) : showPayment ? (
          <PaymentInterface
            title={selectedOption.name}
            subtitle={`${activeDuration} ${selectedOption.unitLabel}`}
            amount={total}
            customerName={customerName}
            customerPhone={customerPhone}
            onChangeName={setCustomerName}
            onChangePhone={setCustomerPhone}
            onBack={() => setShowPayment(false)}
            onPaymentSuccess={({ reference }) => finalizeBooking(reference)}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Gear Category Filter Chips */}
            {kind === 'gear' && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {GEAR_FILTERS.map((cat) => {
                  const active = gearFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setGearFilter(cat)}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap border transition-colors ${
                        active
                          ? 'bg-white text-[#07070A] border-white font-semibold'
                          : 'bg-white/[0.03] text-white/60 border-white/10 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Radio Option List */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                {copy.listLabel}
              </p>

              <div
                className="space-y-2 max-h-[245px] overflow-y-auto pr-0.5"
                role="radiogroup"
                aria-label={copy.listLabel}
              >
                {visibleOptions.map((opt) => {
                  const selected = opt.id === selectedOption.id;
                  const shortUnit = opt.unitLabel.includes('half-day')
                    ? 'half-day'
                    : opt.unitLabel;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setSelectedId(opt.id)}
                      className={`w-full rounded-[16px] px-3.5 py-3 text-left border transition-all flex items-center justify-between gap-3 ${
                        selected
                          ? 'bg-white/[0.07] border-white/30'
                          : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Custom Radio Circle */}
                        <span
                          className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center transition-all ${
                            selected
                              ? 'border-[5px] border-white bg-[#0B0B0F]'
                              : 'border border-white/25 bg-transparent'
                          }`}
                        />
                        <div className="min-w-0">
                          <div className="text-[13.5px] font-semibold text-white truncate">
                            {opt.name}
                          </div>
                          <p className="text-[11px] text-white/50 truncate mt-0.5">
                            {opt.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 whitespace-nowrap">
                        <span className="text-[13.5px] font-semibold text-white tabular-nums">
                          {formatCurrencyINR(opt.rate)}
                        </span>
                        <span className="text-[11px] text-white/45 ml-1">/{shortUnit}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Benefits / Specifications Checklist */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                {copy.detailsLabel}
              </p>
              <div className="rounded-[16px] bg-white/[0.02] border border-white/[0.08] p-3.5 space-y-2">
                {benefitItems.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80">
                    <Check className="w-3.5 h-3.5 text-white/75 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Duration Segmented Pills */}
            <div className="flex items-center justify-between gap-3 pt-0.5">
              <span className="text-xs font-medium text-white/85">Duration</span>
              <div className="inline-flex items-center p-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
                {durationChoices.map((choice) => {
                  const active = activeDuration === choice.value;
                  return (
                    <button
                      key={choice.value}
                      type="button"
                      onClick={() => setDuration(choice.value)}
                      className={`px-3.5 py-1 rounded-full text-xs transition-all ${
                        active
                          ? 'bg-white text-[#07070A] font-semibold shadow-sm'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {choice.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Collapsible Note Accordion */}
            <div className="rounded-[16px] bg-white/[0.02] border border-white/[0.08] overflow-hidden">
              <button
                type="button"
                onClick={() => setNoteOpen((v) => !v)}
                aria-expanded={noteOpen}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs text-white/65 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-white/45" />
                  <span>{scheduleNote ? scheduleNote : 'Add a note (optional)'}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-white/45 transition-transform ${
                    noteOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {noteOpen && (
                <div className="px-3.5 pb-3 pt-1">
                  <input
                    type="text"
                    value={scheduleNote}
                    onChange={(e) => setScheduleNote(e.target.value)}
                    placeholder="Preferred date, session timing, or special request..."
                    className="w-full h-9 px-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-white/30"
                  />
                </div>
              )}
            </div>

            {error && <p className="text-xs text-rose-300 font-medium">{error}</p>}

            {/* Total & Primary White Pill CTA */}
            <div className="border-t border-white/[0.08] pt-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-white/90 block">Total</span>
                  <span className="text-[10.5px] text-white/45 block">Taxes included</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-dot text-[28px] sm:text-[32px] leading-none text-white tabular-nums">
                    {formatCurrencyINR(total)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-white text-[#07070A] font-semibold text-sm hover:bg-white/90 transition-colors active:scale-[0.99]"
              >
                Continue to Payment
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="inline-flex items-center justify-center gap-1.5 text-[11px] text-white/45 hover:text-white/80 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Have a question? Chat with us</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

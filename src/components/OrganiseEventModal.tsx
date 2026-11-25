import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Check,
  Disc3,
  MessageCircle,
  Mic2,
  Music2,
  Wrench,
  X,
} from 'lucide-react';
import { KESARI_CONTACT, StudioBooking } from '../utils/studioLogic';

interface OrganiseEventModalProps {
  onClose: () => void;
  onSubmitInquiry: (params: {
    format: string;
    capacityRange: string;
    venueRoom: string;
    dateAndConcept: string;
  }) => StudioBooking;
  onOpenAdminPortal?: () => void;
}

const EVENT_FORMATS = [
  { id: 'Live Gig', label: 'Music Event / Gig', Icon: Music2 },
  { id: 'Acoustic Set', label: 'Acoustic & Open Mic', Icon: Mic2 },
  { id: 'Workshop', label: 'Workshop & Meetup', Icon: Wrench },
  { id: 'Private Jam', label: 'Private Jam / Party', Icon: Disc3 },
];

const CAPACITY_RANGES = ['8–15', '20–40', '40–60', 'Up to 75'];

const STUDIO_ROOMS = [
  { id: 'Main Studio Hall (40–60 Pax)', label: 'Main Studio Hall', meta: '40–60 Pax · Live Stage & Yamaha PA' },
  { id: 'Acoustic Jam Room & Lounge (8–15 Pax)', label: 'Acoustic Jam Room & Lounge', meta: '8–15 Pax · Intimate Lounge' },
  { id: 'Full Studio Private Buyout (Up to 75 Pax)', label: 'Full Studio Private Buyout', meta: 'Up to 75 Pax · Exclusive Access' },
];

export const OrganiseEventModal: React.FC<OrganiseEventModalProps> = ({
  onClose,
  onSubmitInquiry,
}) => {
  const [format, setFormat] = useState('Live Gig');
  const [capacityRange, setCapacityRange] = useState('40–60');
  const [venueRoom, setVenueRoom] = useState(STUDIO_ROOMS[0].id);
  const [dateAndConcept, setDateAndConcept] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<StudioBooking | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateAndConcept.trim().length < 3) {
      setError('Enter your preferred date and event concept (at least 3 characters).');
      return;
    }
    setError(null);
    const created = onSubmitInquiry({
      format,
      capacityRange,
      venueRoom,
      dateAndConcept: dateAndConcept.trim(),
    });
    setSubmitted(created);
  };

  const handleWhatsAppChat = () => {
    const text = `Hi Kesari Studio! I'd like to enquire about hosting a ${format} (${capacityRange} guests) in ${venueRoom}. ${dateAndConcept ? `Concept: ${dateAndConcept}` : ''}`;
    window.open(KESARI_CONTACT.whatsappUrl(text), '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Organise Your Event"
      data-lenis-prevent
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center sm:p-6 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full sm:max-w-[460px] rounded-t-[30px] sm:rounded-[30px] bg-[#0B0B0F] border border-white/10 p-5 sm:p-6 space-y-5 max-h-[92vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between gap-2 pb-1">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-xs font-medium text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close organise event modal"
            className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/45">
            HOST AT KESARI STUDIO
          </p>
          <h3 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-tight mt-1">
            Organise your event.
          </h3>
          <p className="text-xs text-white/55 mt-1">
            Book our Acoustic Hall, Jam Lounge, or Full Studio with Yamaha PA &amp; sound engineer.
          </p>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-white text-[#07070A] flex items-center justify-center shadow-lg">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Event Request Logged</h4>
              <p className="mt-1 text-sm text-white/75">
                {submitted.title} · {venueRoom}
              </p>
              <p className="mt-1 text-xs text-white/50">{submitted.detail}</p>
            </div>
            <div className="px-5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 inline-block">
              <p className="text-[10.5px] uppercase tracking-wider text-white/45">Inquiry Ref</p>
              <p className="font-dot text-2xl text-white mt-0.5">{submitted.bookingCode}</p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 rounded-full bg-white text-[#07070A] font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Event Format */}
            <div className="space-y-2">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                CHOOSE EVENT FORMAT
              </span>
              <div className="grid grid-cols-2 gap-2">
                {EVENT_FORMATS.map(({ id, label, Icon }) => {
                  const active = format === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFormat(id)}
                      className={`min-h-[44px] rounded-[14px] px-3 py-2 border flex items-center gap-2 text-left transition-all ${
                        active
                          ? 'bg-white/[0.08] border-white/35 text-white font-semibold'
                          : 'bg-white/[0.02] border-white/[0.08] text-white/65 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Studio Space Radio Cards */}
            <div className="space-y-2">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                CHOOSE STUDIO SPACE
              </span>
              <div className="space-y-2" role="radiogroup" aria-label="Studio Space">
                {STUDIO_ROOMS.map((room) => {
                  const selected = venueRoom === room.id;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setVenueRoom(room.id)}
                      className={`w-full rounded-[16px] px-3.5 py-2.5 text-left border transition-all flex items-center gap-3 ${
                        selected
                          ? 'bg-white/[0.07] border-white/30'
                          : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full shrink-0 transition-all ${
                          selected
                            ? 'border-[5px] border-white bg-[#0B0B0F]'
                            : 'border border-white/25 bg-transparent'
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-white truncate">
                          {room.label}
                        </div>
                        <p className="text-[11px] text-white/50 truncate">{room.meta}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Expected Guests Segmented Pills */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-white/85">Guests</span>
              <div className="inline-flex items-center p-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
                {CAPACITY_RANGES.map((range) => {
                  const active = capacityRange === range;
                  return (
                    <button
                      key={range}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCapacityRange(range)}
                      className={`px-3 py-1 rounded-full text-[11px] transition-all ${
                        active
                          ? 'bg-white text-[#07070A] font-semibold shadow-sm'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {range}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Date & Concept */}
            <div>
              <label
                htmlFor="org-concept"
                className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45 mb-1.5"
              >
                DATE &amp; SESSION CONCEPT
              </label>
              <input
                id="org-concept"
                type="text"
                value={dateAndConcept}
                onChange={(e) => setDateAndConcept(e.target.value)}
                placeholder="e.g. Fri 12 Dec · Candlelit acoustic session"
                className="w-full h-11 px-3.5 rounded-[14px] bg-white/[0.03] border border-white/10 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/35"
              />
            </div>

            {/* Included Benefits */}
            <div className="rounded-[16px] bg-white/[0.02] border border-white/[0.08] p-3.5 space-y-1.5">
              {[
                'Spatial PA calibration & stage lighting cues',
                'Dedicated on-site sound engineer & green room',
                'Ticketing & guest check-in portal setup',
              ].map((perk, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-white/80">
                  <Check className="w-3.5 h-3.5 text-white/75 shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            {error && (
              <p role="alert" className="text-xs text-rose-300 font-medium">
                {error}
              </p>
            )}

            <div className="border-t border-white/[0.08] pt-4 space-y-3">
              <button
                type="submit"
                className="w-full h-12 rounded-full bg-white text-[#07070A] font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Submit Event Request
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleWhatsAppChat}
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

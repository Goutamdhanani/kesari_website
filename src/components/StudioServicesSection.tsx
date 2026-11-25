import React from 'react';
import { motion } from 'motion/react';
import { Building2, ChevronRight, CreditCard, Speaker } from 'lucide-react';
import { ServiceKind } from '../utils/studioLogic';

interface StudioServicesSectionProps {
  bookingsCount: number;
  onOpenService: (kind: ServiceKind) => void;
  onPlanEvent: () => void;
}

const SERVICE_ROWS: Array<{
  kind: ServiceKind;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ className?: string }>;
  accentBg: string;
}> = [
  {
    kind: 'gear',
    title: 'Rent Sound Gear',
    subtitle: '13 Official Items · Speakers, Mics, Mixers',
    Icon: Speaker,
    accentBg: 'bg-[#6F78E8]/25 text-[#A5ADFF]',
  },
  {
    kind: 'membership',
    title: 'Studio Memberships',
    subtitle: '3 Tiers from ₹3,000 · Coworking & 60 Coffees',
    Icon: CreditCard,
    accentBg: 'bg-[#E052A6]/25 text-[#FF9ED8]',
  },
  {
    kind: 'space',
    title: 'Rent Out Studio Space',
    subtitle: 'Acoustic Hall & Hi-Fi Lounge · From ₹800/h',
    Icon: Building2,
    accentBg: 'bg-[#3F8796]/30 text-[#8FE3F4]',
  },
];

export const StudioServicesSection: React.FC<StudioServicesSectionProps> = ({
  bookingsCount,
  onOpenService,
  onPlanEvent,
}) => {
  return (
    <section
      aria-label="Studio services and event hosting"
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch"
    >
      {/* Left Card: Studio Services Hub */}
      <div className="surface-cerulean rounded-[32px] p-4 sm:p-5 flex flex-col justify-between gap-4">
        <button
          type="button"
          onClick={() => onOpenService('space')}
          className="relative h-28 rounded-[22px] overflow-hidden text-left group border border-white/10"
        >
          <img
            src="/assets/events/kesari_lounge_inside.jpg"
            alt="Kesari Studio Hi-Fi Lounge"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060B14]/90 via-[#060B14]/35 to-transparent" />
          <div className="absolute inset-x-3.5 bottom-3 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-white">Acoustic Jam Room &amp; Lounge</span>
            <span className="text-[11px] font-medium text-white/80">
              Explore Spaces &gt;
            </span>
          </div>
        </button>

        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-white">Studio Services &amp; Gear</h2>
          <span className="text-[11px] text-white/60 tabular-nums">
            {bookingsCount > 0 ? `${bookingsCount} Booked` : 'Official Catalog'}
          </span>
        </div>

        <div className="space-y-2.5">
          {SERVICE_ROWS.map(({ kind, title, subtitle, Icon, accentBg }) => (
            <motion.button
              key={kind}
              type="button"
              whileTap={{ scale: 0.985 }}
              onClick={() => onOpenService(kind)}
              className="w-full min-h-[58px] rounded-[20px] bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/25 px-3.5 py-2.5 flex items-center justify-between gap-3 text-left transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${accentBg}`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-white truncate">
                    {title}
                  </div>
                  <div className="text-[11px] text-white/55 truncate tabular-nums">
                    {subtitle}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/55 shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Right Card: Organise Your Event */}
      <div className="surface-plum relative rounded-[32px] p-5 sm:p-6 overflow-hidden flex flex-col justify-between min-h-[280px]">
        <img
          src="/assets/events/kesari_stage_inside.jpg"
          alt="Host live sessions at Kesari Studio"
          referrerPolicy="no-referrer"
          className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(28, 10, 32, 0.72) 0%, rgba(16, 8, 22, 0.78) 55%, rgba(8, 5, 11, 0.95) 100%)',
          }}
        />

        <div className="relative z-10 flex items-center justify-between text-xs text-white/75">
          <span>Host at Kesari</span>
          <span>Main Studio Hall</span>
        </div>

        <div className="relative z-10 my-5">
          <h2 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight text-balance">
            Organise Your Event
          </h2>
          <p className="mt-2 text-sm text-white/75 leading-relaxed max-w-sm">
            Host live gigs, acoustic sets, and workshops inside our treated acoustic hall or lounge with Yamaha PA &amp; pro audio engineer.
          </p>
        </div>

        <div className="relative z-10">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={onPlanEvent}
            className="w-full h-12 px-5 rounded-full bg-white text-[#07070A] font-semibold text-sm flex items-center justify-between hover:bg-white/90 transition-colors shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
          >
            <span>Plan Your Event</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

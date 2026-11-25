import React, { useMemo } from 'react';
import { ChevronRight, Crown, Mic2 } from 'lucide-react';
import {
  SERVICE_CATALOG,
  StudioBooking,
} from '../utils/studioLogic';

interface BentoMetricsRowProps {
  bookings: StudioBooking[];
  artistsCount?: number;
  onOpenMembership: () => void;
  onOpenArtistRegister: () => void;
}

export const BentoMetricsRow: React.FC<BentoMetricsRowProps> = ({
  bookings,
  artistsCount = 0,
  onOpenMembership,
  onOpenArtistRegister,
}) => {
  // Derive starting membership plan & benefits dynamically from SERVICE_CATALOG
  const membershipCatalog = SERVICE_CATALOG.membership;
  const startingPlan = useMemo(() => {
    if (!membershipCatalog.length) return null;
    return membershipCatalog.reduce(
      (min, plan) => (plan.rate < min.rate ? plan : min),
      membershipCatalog[0],
    );
  }, [membershipCatalog]);

  const activeMembership = useMemo(
    () => bookings.find((b) => b.kind === 'membership') ?? null,
    [bookings],
  );

  const activeCatalogPlan = useMemo(() => {
    if (!activeMembership) return null;
    return (
      membershipCatalog.find((m) =>
        activeMembership.title.toLowerCase().includes(m.name.toLowerCase()),
      ) ?? null
    );
  }, [activeMembership, membershipCatalog]);

  const startingBenefitsLine = useMemo(() => {
    if (!startingPlan) return '';
    const first = startingPlan.perks?.[0]?.split('(')[0]?.trim();
    const second = startingPlan.perks?.[1]?.split('(')[0]?.trim();
    if (first && second) return `${first} · ${second}`;
    return startingPlan.subtitle;
  }, [startingPlan]);

  return (
    <section
      aria-label="Studio membership and artist registration"
      className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full min-w-0"
    >
      {/* Card 1: Studio Membership Card */}
      <button
        type="button"
        onClick={onOpenMembership}
        style={{
          background:
            'linear-gradient(155deg, rgba(139, 92, 246, 0.14) 0%, rgba(16, 16, 22, 0.96) 58%, rgba(11, 11, 16, 0.99) 100%)',
        }}
        className="group relative rounded-[24px] sm:rounded-[26px] p-3.5 sm:p-5 flex flex-col justify-between text-left min-h-[168px] sm:min-h-[184px] border border-violet-300/15 hover:border-violet-300/35 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60 min-w-0 overflow-hidden"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-violet-400/15 border border-violet-300/20 flex items-center justify-center shrink-0 text-violet-300">
            <Crown className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11.5px] sm:text-[13px] font-medium text-white/90 truncate">
            {activeMembership ? 'Your Membership' : 'Studio Membership'}
          </span>
        </div>

        {activeMembership ? (
          <div className="my-2 min-w-0">
            <span className="text-[10px] font-medium uppercase tracking-wider text-violet-300/80 block">
              Active Plan
            </span>
            <p className="mt-1 text-sm sm:text-base font-semibold text-white truncate">
              {activeMembership.title}
            </p>
            <p className="mt-1 text-[10.5px] sm:text-[11px] text-white/60 truncate">
              {activeCatalogPlan?.perks?.[0] || activeMembership.detail}
            </p>
          </div>
        ) : (
          <div className="my-2 min-w-0">
            <span className="text-[10px] sm:text-[11px] text-white/55 block">
              Starting from
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-medium text-violet-200/80">₹</span>
              <span className="font-dot text-[26px] sm:text-[34px] leading-none text-white tabular-nums tracking-tight">
                {startingPlan ? startingPlan.rate.toLocaleString('en-IN') : '3,000'}
              </span>
            </div>
            <p className="mt-1.5 text-[10px] sm:text-[11px] text-white/55 truncate">
              {startingBenefitsLine}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
          <span className="text-[11px] sm:text-xs font-medium text-violet-200 group-hover:text-white transition-colors truncate">
            {activeMembership ? 'Manage Membership' : 'Explore Plans'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-violet-300/80 group-hover:translate-x-0.5 group-hover:text-white transition-all shrink-0" />
        </div>
      </button>

      {/* Card 2: Register as Artist Card */}
      <button
        type="button"
        onClick={onOpenArtistRegister}
        style={{
          background:
            'linear-gradient(155deg, rgba(216, 255, 72, 0.10) 0%, rgba(16, 18, 14, 0.96) 58%, rgba(11, 12, 10, 0.99) 100%)',
        }}
        className="group relative rounded-[24px] sm:rounded-[26px] p-3.5 sm:p-5 flex flex-col justify-between text-left min-h-[168px] sm:min-h-[184px] border border-[#D8FF48]/15 hover:border-[#D8FF48]/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8FF48]/60 min-w-0 overflow-hidden"
      >
        <div className="flex items-center justify-between gap-1.5 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#D8FF48]/15 border border-[#D8FF48]/25 flex items-center justify-center shrink-0 text-[#D8FF48]">
              <Mic2 className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11.5px] sm:text-[13px] font-medium text-white/90 truncate">
              For Artists
            </span>
          </div>
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#D8FF48] shrink-0"
            aria-hidden="true"
          />
        </div>

        <div className="my-2 min-w-0">
          <span className="text-[10px] sm:text-[11px] text-white/55 block">
            Perform at Kesari
          </span>
          <h3 className="mt-1 text-[17px] sm:text-[20px] font-bold text-white leading-tight tracking-tight">
            Register as Artist
          </h3>
          <p className="mt-1.5 text-[10px] sm:text-[11px] text-white/55 truncate">
            {artistsCount > 0
              ? `${artistsCount} artists · Live gigs & open mics`
              : 'Live gigs, open mics & showcases'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
          <span className="text-[11px] sm:text-xs font-medium text-[#D8FF48] group-hover:text-white transition-colors truncate">
            Apply Now
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#D8FF48]/80 group-hover:translate-x-0.5 group-hover:text-white transition-all shrink-0" />
        </div>
      </button>
    </section>
  );
};

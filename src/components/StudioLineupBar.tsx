import React from 'react';
import { motion } from 'motion/react';
import { Mic2, Music2, Sparkles, Wrench, Zap } from 'lucide-react';
import { LineupType } from '../utils/studioLogic';

interface StudioLineupBarProps {
  selectedLineup: LineupType;
  onSelectLineup: (lineup: LineupType) => void;
}

const LINEUP_ITEMS: Array<{
  id: LineupType;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'all', label: 'All', Icon: Sparkles },
  { id: 'live-gigs', label: 'Live Gigs', Icon: Zap },
  { id: 'open-mic', label: 'Open Mic', Icon: Mic2 },
  { id: 'jam-sessions', label: 'Jam Sessions', Icon: Music2 },
  { id: 'workshops', label: 'Workshops', Icon: Wrench },
];

export const StudioLineupBar: React.FC<StudioLineupBarProps> = ({
  selectedLineup,
  onSelectLineup,
}) => {
  return (
    <section aria-label="Studio lineup categories" className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base sm:text-lg font-semibold text-white">Studio Lineup</h2>
        <span className="text-xs text-white/55">Live This Week</span>
      </div>

      <div
        className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
        role="group"
        aria-label="Filter by lineup format"
      >
        {LINEUP_ITEMS.map(({ id, label, Icon }) => {
          const active = selectedLineup === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelectLineup(id)}
              className="relative min-h-[44px] px-4 rounded-full flex items-center gap-2 text-xs font-medium whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {active ? (
                <motion.span
                  layoutId="studio-lineup-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[#D8FF48] shadow-[0_6px_20px_rgba(216,255,72,0.28)]"
                />
              ) : (
                <span className="absolute inset-0 rounded-full bg-[#121319] border border-white/10 hover:border-white/25 transition-colors" />
              )}
              <Icon
                className={`relative z-10 w-3.5 h-3.5 ${
                  active ? 'text-[#07070A]' : 'text-white/65'
                }`}
              />
              <span
                className={`relative z-10 ${
                  active ? 'text-[#07070A] font-semibold' : 'text-white/80'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

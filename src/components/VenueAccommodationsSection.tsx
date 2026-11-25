import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X } from 'lucide-react';

interface Amenity {
  id: string;
  name: string;
  tag: string;
  description: string;
  color: string;
  glow: string;
  renderIcon: () => React.ReactNode;
}

const AMENITIES: Amenity[] = [
  {
    id: 'changing-room',
    name: 'Changing Room',
    tag: 'Private Space',
    description: 'Dedicated green room & private change space for performers, artists & guests.',
    color: '#C084FC', // Purple
    glow: 'rgba(192, 132, 252, 0.35)',
    renderIcon: () => (
      <svg
        className="w-6 h-6 text-[#C084FC]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a2.5 2.5 0 0 1 2.5 2.5c0 1.2-.9 2.2-2.1 2.4L2.8 16.4A1.5 1.5 0 0 0 3.8 19h16.4a1.5 1.5 0 0 0 1-2.6L12.5 8.9" />
        <path d="M3.8 19h16.4" />
      </svg>
    ),
  },
  {
    id: 'washroom',
    name: 'Separate Washrooms',
    tag: 'Hygiene & Comfort',
    description: 'Clean, sanitized and dedicated separate restrooms for male & female visitors.',
    color: '#2DD4BF', // Cyan / Teal
    glow: 'rgba(45, 212, 191, 0.35)',
    renderIcon: () => (
      <svg
        className="w-6 h-6 text-[#2DD4BF]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="7" cy="5" r="2.2" />
        <path d="M4 20v-5a3 3 0 0 1 6 0v5" />
        <circle cx="17" cy="5" r="2.2" />
        <path d="M14 20v-5a3 3 0 0 1 6 0v5" />
      </svg>
    ),
  },
  {
    id: 'cafe',
    name: 'In-House Cafe',
    tag: 'Fresh Brews',
    description: 'Specialty artisanal coffee, hot teas, savories and handcrafted cafe snacks.',
    color: '#FBBF24', // Amber / Orange
    glow: 'rgba(251, 191, 36, 0.35)',
    renderIcon: () => (
      <svg
        className="w-6 h-6 text-[#FBBF24]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 8h1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1" />
        <path d="M3 8h14v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
        <line x1="2" y1="21" x2="18" y2="21" />
      </svg>
    ),
  },
  {
    id: 'drinks',
    name: 'Drinks & Beverages',
    tag: 'Refreshments',
    description: 'Chilled artisanal mocktails, cold brews, infused coolers and beverages.',
    color: '#38BDF8', // Sky Blue
    glow: 'rgba(56, 189, 248, 0.35)',
    renderIcon: () => (
      <svg
        className="w-6 h-6 text-[#38BDF8]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 4h14l-2 15a2 2 0 0 1-2 1.8H9a2 2 0 0 1-2-1.8L5 4z" />
        <line x1="4" y1="4" x2="20" y2="4" />
        <line x1="6" y1="9" x2="18" y2="9" />
      </svg>
    ),
  },
  {
    id: 'gifting',
    name: 'Gifting Section',
    tag: 'Studio Merch',
    description: 'Curated vinyls, exclusive Kesari merchandise, art souvenirs and custom gifts.',
    color: '#F472B6', // Pink / Magenta
    glow: 'rgba(244, 114, 182, 0.35)',
    renderIcon: () => (
      <svg
        className="w-6 h-6 text-[#F472B6]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" rx="1" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
  {
    id: 'lift',
    name: 'Elevator / Lift Access',
    tag: 'Accessibility',
    description: 'Full passenger elevator access to all venue floors, acoustic hall & terrace.',
    color: '#4ADE80', // Green
    glow: 'rgba(74, 222, 128, 0.35)',
    renderIcon: () => (
      <svg
        className="w-6 h-6 text-[#4ADE80]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 17V5" />
        <path d="m4 8 3-3 3 3" />
        <path d="M17 7v12" />
        <path d="m14 16 3 3 3-3" />
      </svg>
    ),
  },
];

export const VenueAccommodationsSection: React.FC = () => {
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [showAllDrawer, setShowAllDrawer] = useState<boolean>(false);

  return (
    <section aria-label="Venue Amenities & Services" className="space-y-3.5">
      {/* Header exactly matching user reference image */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.85)] shrink-0" />
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Venue Amenities &amp; Services
            </h2>
          </div>
          <p className="text-xs text-white/55 pl-5">
            On-site facilities for artists, audiences &amp; hosts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAllDrawer((v) => !v)}
          className="px-3 sm:px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-white/80 hover:text-white transition-all active:scale-95 shrink-0 flex items-center gap-1"
        >
          <span>All On-Site</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Row of 6 square icon tiles matching user reference image */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {AMENITIES.map((item) => {
          const isSelected = selectedAmenity?.id === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedAmenity((curr) => (curr?.id === item.id ? null : item))}
              aria-label={item.name}
              className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-[22px] flex items-center justify-center transition-all duration-200 active:scale-95 ${
                isSelected
                  ? 'bg-white/12 border-white/30 scale-105'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20'
              }`}
              style={{
                boxShadow: isSelected ? `0 0 20px ${item.glow}` : undefined,
              }}
            >
              {/* Colored icon */}
              {item.renderIcon()}

              {/* Active dot indicator */}
              {isSelected && (
                <span
                  className="absolute bottom-1.5 w-1 h-1 rounded-full"
                  style={{ background: item.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Interactive Detail Drawer when clicking an amenity */}
      <AnimatePresence>
        {selectedAmenity && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.22, ease: [0.19, 1, 0.22, 1] }}
            className="overflow-hidden"
          >
            <div
              className="rounded-[22px] p-4 bg-[#0A0B10]/90 border border-white/10 backdrop-blur-md flex items-center justify-between gap-3"
              style={{
                boxShadow: `0 8px 30px -10px ${selectedAmenity.glow}`,
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shrink-0"
                  style={{ boxShadow: `0 0 12px ${selectedAmenity.glow}` }}
                >
                  {selectedAmenity.renderIcon()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white truncate">{selectedAmenity.name}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/8 text-white/60 border border-white/10">
                      {selectedAmenity.tag}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 leading-snug mt-0.5">
                    {selectedAmenity.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAmenity(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white shrink-0"
                aria-label="Close detail"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded list modal or drawer if user clicks "All On-Site" */}
      <AnimatePresence>
        {showAllDrawer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
            className="overflow-hidden pt-1"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 p-4 rounded-[26px] bg-[#0A0B10]/95 border border-white/10 backdrop-blur-md">
              {AMENITIES.map((amenity) => (
                <div
                  key={amenity.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/6"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/8 shrink-0">
                    {amenity.renderIcon()}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white block truncate">
                      {amenity.name}
                    </span>
                    <span className="text-[11px] text-white/55 block leading-tight truncate">
                      {amenity.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

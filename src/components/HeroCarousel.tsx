import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Heart, Layers, Ticket } from 'lucide-react';
import { StudioEvent, getRemainingSeats } from '../utils/studioLogic';

interface HeroCarouselProps {
  events: StudioEvent[];
  savedIds: string[];
  onToggleSave: (eventId: string) => void;
  onSelectEvent: (event: StudioEvent) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  events,
  savedIds,
  onToggleSave,
  onSelectEvent,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  if (events.length === 0) {
    return (
      <div className="surface-charcoal rounded-[32px] p-8 text-center">
        <p className="text-sm text-white/70">No live drops match this filter.</p>
      </div>
    );
  }

  const safeIndex = activeIndex % events.length;
  const activeEvent = events[safeIndex];
  const isSaved = savedIds.includes(activeEvent.id);
  const remaining = getRemainingSeats(activeEvent);

  const goTo = (nextIdx: number, dir: 1 | -1) => {
    setDirection(dir);
    setActiveIndex((nextIdx + events.length) % events.length);
  };

  const handlePrev = () => goTo(safeIndex - 1, -1);
  const handleNext = () => goTo(safeIndex + 1, 1);

  // Subtle auto-rotation every 7 seconds when not hovered
  useEffect(() => {
    if (isPaused || events.length <= 1) return;
    const interval = setInterval(() => {
      goTo(safeIndex + 1, 1);
    }, 7000);
    return () => clearInterval(interval);
  }, [safeIndex, isPaused, events.length]);

  // Touch Swipe Handlers for smooth mobile gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  return (
    <section
      aria-label="Featured event drops"
      className="relative select-none w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 
        Apple TV+ Cinematic Event Preview Card Shell:
        Thin translucent border with subtle electric blue (left/top) to warm coral (right/top) perimeter rim glow
      */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full rounded-[30px] sm:rounded-[34px] p-[1px] bg-gradient-to-r from-[#2563EB]/40 via-[#1E293B]/20 to-[#EA580C]/40 shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
      >
        <div className="relative w-full rounded-[29px] sm:rounded-[33px] overflow-hidden bg-[#060814]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeEvent.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 35 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -35 }}
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.28 },
              }}
              className="relative w-full p-4 sm:p-8 min-h-[340px] sm:min-h-[400px] flex flex-col justify-between"
            >
              {/* Immersive Event Photography Layer (Hero) */}
              <img
                src={activeEvent.imageUrl}
                alt={activeEvent.title}
                referrerPolicy="no-referrer"
                className="pointer-events-none absolute inset-0 w-full h-full object-cover object-center scale-100 transition-transform duration-700 ease-out"
              />

              {/* Subtle Blue & Warm Coral Atmospheric Lighting */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `
                    radial-gradient(circle at 18% 22%, rgba(37, 99, 235, 0.32) 0%, transparent 55%),
                    radial-gradient(circle at 86% 28%, rgba(234, 88, 12, 0.28) 0%, transparent 50%)
                  `,
                }}
              />

              {/* Soft Black Gradient Behind Text for 100% Crisp Legibility */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `
                    radial-gradient(ellipse at 28% 62%, rgba(6, 8, 20, 0.90) 0%, rgba(6, 8, 20, 0.55) 50%, transparent 80%),
                    linear-gradient(90deg, rgba(6, 8, 20, 0.88) 0%, rgba(6, 8, 20, 0.65) 48%, rgba(6, 8, 20, 0.20) 78%, transparent 100%),
                    linear-gradient(180deg, rgba(6, 8, 20, 0.20) 0%, rgba(6, 8, 20, 0.38) 35%, rgba(6, 8, 20, 0.86) 80%, rgba(6, 8, 20, 0.96) 100%)
                  `,
                }}
              />

              {/* TOP ROW: Venue/Room Pill (Left) + Seats Pill & Heart (Right) */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#11172A]/85 backdrop-blur-md border border-[#3B82F6]/25 shadow-sm max-w-[145px] sm:max-w-none min-w-0">
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F59E0B] shrink-0" />
                  <span className="text-[11px] sm:text-[13px] font-medium text-white/95 truncate">
                    {activeEvent.room || activeEvent.badge || 'Acoustic Hall (60 Pax)'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                  <div className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#182012]/80 backdrop-blur-md border border-[#84CC16]/30 text-[11px] sm:text-[13px] font-medium text-[#BEF264]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                    <span>{remaining} left</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(activeEvent.id);
                    }}
                    aria-label={isSaved ? `Unsave ${activeEvent.title}` : `Save ${activeEvent.title}`}
                    aria-pressed={isSaved}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
                      isSaved
                        ? 'bg-white text-black border-white shadow-sm'
                        : 'bg-[#141624]/80 hover:bg-[#1E2238] border-white/15 text-white/90 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* MIDDLE-LEFT: Date/Time + Confident Sans Headline + Artist Subtitle */}
              <div className="relative z-10 my-auto py-4 sm:py-8 max-w-2xl">
                <p className="text-[11px] sm:text-[13px] font-semibold text-white/70 uppercase tracking-wider">
                  {activeEvent.dateLabel} · {activeEvent.timeLabel}
                </p>

                <h2 className="mt-1.5 sm:mt-2 text-xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-white leading-tight">
                  {activeEvent.title}
                </h2>

                <p className="mt-1 sm:mt-1.5 text-xs sm:text-base font-normal text-white/65">
                  {activeEvent.artistOrHost}
                </p>
              </div>

              {/* BOTTOM ROW: Pricing (Left) + Nav Controls & White Ticket CTA (Right) */}
              <div className="relative z-10 pt-3 sm:pt-4 border-t border-white/8 flex items-center justify-between gap-2">
                {/* Price Display */}
                <div className="flex flex-col shrink-0">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-white/50 font-semibold leading-none">
                    FROM
                  </span>
                  <div className="flex items-baseline gap-1 text-white font-bold text-lg sm:text-2xl mt-0.5">
                    <span>₹{Math.round(activeEvent.basePrice).toLocaleString('en-IN')}</span>
                    <span className="text-[10px] sm:text-xs text-white/50 font-normal">/ pass</span>
                  </div>
                </div>

                {/* Navigation Arrows + White Ticket Button */}
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous featured event"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#121422]/85 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next featured event"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#121422]/85 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95"
                    >
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {/* Clean Solid White Ticket Action Button */}
                  <button
                    type="button"
                    onClick={() => onSelectEvent(activeEvent)}
                    disabled={!activeEvent.isLive || remaining === 0}
                    className="h-9 sm:h-12 px-3 sm:px-7 rounded-full bg-white hover:bg-white/90 text-black font-semibold text-xs sm:text-[14px] shadow-[0_2px_14px_rgba(255,255,255,0.18)] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                  >
                    <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black rotate-[-15deg] stroke-[2.2]" />
                    <span>
                      {!activeEvent.isLive
                        ? 'Paused'
                        : remaining === 0
                          ? 'Sold Out'
                          : 'Buy Ticket'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Modern Center-Aligned Pagination Indicator */}
      <div
        className="mt-3.5 flex items-center justify-center gap-1.5"
        role="tablist"
        aria-label="Featured slides"
      >
        {events.map((evt, idx) => {
          const active = idx === safeIndex;
          return (
            <button
              key={evt.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Jump to ${evt.title}`}
              onClick={() => goTo(idx, idx >= safeIndex ? 1 : -1)}
              className="py-1 px-0.5 focus-visible:outline-none"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  active
                    ? 'w-7 bg-white shadow-sm'
                    : 'w-1.5 bg-white/25 hover:bg-white/45'
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};

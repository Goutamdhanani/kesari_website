import React from 'react';
import { motion } from 'motion/react';
import { Bookmark, MapPin, Play } from 'lucide-react';
import {
  GradientTheme,
  StudioEvent,
  getRemainingSeats,
} from '../utils/studioLogic';

interface PassesAndShowsRowProps {
  events: StudioEvent[];
  savedIds: string[];
  onToggleSave: (eventId: string) => void;
  onSelectEvent: (event: StudioEvent) => void;
  onViewAll: () => void;
  onBookUs?: (categoryTitle: string) => void;
}

interface BookUsItem {
  id: number;
  tag: string;
  title: string;
  description: string;
  glow: string;
  accent: string;
  imageUrl?: string;
}

const BOOK_US_FOR_ITEMS: BookUsItem[] = [
  {
    id: 1,
    tag: 'Music',
    title: 'Live Music Shows & Musical Evenings',
    description: 'Acoustic gigs, solo performances, musical evenings and unplugged sessions.',
    glow: 'rgba(59, 130, 246, 0.25)',
    accent: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    imageUrl: '/assets/book-us/book_us_01_live_music.jpg',
  },
  {
    id: 2,
    tag: 'Spoken Word',
    title: 'Open Mics, Poetry & Spoken Word',
    description: 'Open mics, shayari, poetry, storytelling and talent showcases.',
    glow: 'rgba(236, 72, 153, 0.25)',
    accent: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
    imageUrl: '/assets/book-us/book_us_02_spoken_word.jpg',
  },
  {
    id: 3,
    tag: 'Concerts',
    title: 'Band Performances & Live Concerts',
    description: 'Independent bands, live performances and ticketed music shows.',
    glow: 'rgba(249, 115, 22, 0.25)',
    accent: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    imageUrl: '/assets/book-us/book_us_03_concerts.jpg',
  },
  {
    id: 4,
    tag: 'Rehearsals',
    title: 'Band Practice & Artist Rehearsals',
    description: 'Band rehearsals, music practice, performance preparation and creative sessions.',
    glow: 'rgba(168, 85, 247, 0.25)',
    accent: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    imageUrl: '/assets/book-us/book_us_04_rehearsals.jpg',
  },
  {
    id: 5,
    tag: 'Comedy',
    title: 'Stand-Up Comedy & Storytelling Shows',
    description: 'Comedy nights, storytelling shows, humour and spoken-word performances.',
    glow: 'rgba(234, 179, 8, 0.25)',
    accent: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    imageUrl: '/assets/book-us/book_us_05_comedy.jpg',
  },
  {
    id: 6,
    tag: 'Dance',
    title: 'Dance Practice & Workshops',
    description: 'Dance rehearsals, choreography sessions, dance classes and workshops.',
    glow: 'rgba(20, 184, 166, 0.25)',
    accent: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
    imageUrl: '/assets/book-us/book_us_06_dance.jpg',
  },
  {
    id: 7,
    tag: 'Touring',
    title: 'Touring Shows & All-India Artist Tours',
    description: 'A Bengaluru venue for touring artists, ticketed shows, city gigs and independent productions.',
    glow: 'rgba(99, 102, 241, 0.25)',
    accent: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    imageUrl: '/assets/book-us/book_us_07_touring.jpg',
  },
  {
    id: 8,
    tag: 'Parties',
    title: 'Birthday Surprises & Midnight Celebrations',
    description: 'Birthday surprises, midnight celebrations and parties with friends.',
    glow: 'rgba(244, 63, 94, 0.25)',
    accent: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    imageUrl: '/assets/book-us/book_us_08_parties.jpg',
  },
  {
    id: 9,
    tag: 'Social',
    title: "Friends' Get-Togethers & Reunions",
    description: "School and college reunions, friends' meetups, group celebrations and game nights.",
    glow: 'rgba(14, 165, 233, 0.25)',
    accent: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
    imageUrl: '/assets/book-us/book_us_09_social.jpg',
  },
  {
    id: 10,
    tag: 'Private',
    title: 'Bachelorette, Farewell & Private Parties',
    description: "Girls' nights, boys' nights, farewell parties, surprise parties and private karaoke.",
    glow: 'rgba(192, 132, 252, 0.25)',
    accent: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    imageUrl: '/assets/book-us/book_us_10_private.jpg',
  },
  {
    id: 11,
    tag: 'Corporate',
    title: 'Corporate Team Celebrations & Award Nights',
    description: 'Team get-togethers, employee engagement, recognition ceremonies and office celebrations.',
    glow: 'rgba(34, 197, 94, 0.25)',
    accent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    imageUrl: '/assets/book-us/book_us_11_corporate.jpg',
  },
  {
    id: 12,
    tag: 'Brand',
    title: 'Product Launches & Brand Activations',
    description: 'Product showcases, brand experiences, media previews and launch events.',
    glow: 'rgba(251, 146, 60, 0.25)',
    accent: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    imageUrl: '/assets/book-us/book_us_12_brand.jpg',
  },
  {
    id: 13,
    tag: 'Literary',
    title: 'Book Launches & Author Meetups',
    description: 'Book releases, readings, author interactions and literary gatherings.',
    glow: 'rgba(168, 85, 247, 0.25)',
    accent: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    imageUrl: '/assets/book-us/book_us_13_literary.jpg',
  },
  {
    id: 14,
    tag: 'Community',
    title: 'Board Game Nights & Hobby Meetups',
    description: 'Board games, hobby clubs, social gatherings and interest-based communities.',
    glow: 'rgba(45, 212, 191, 0.25)',
    accent: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
    imageUrl: '/assets/book-us/book_us_14_community.jpg',
  },
  {
    id: 15,
    tag: 'Masterclass',
    title: 'Workshops, Masterclasses & Creative Sessions',
    description: 'Art workshops, interactive learning, creative classes and skill-building sessions.',
    glow: 'rgba(234, 179, 8, 0.25)',
    accent: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    imageUrl: '/assets/book-us/book_us_15_masterclass.jpg',
  },
];

// Scrims matching Reference Image 2: rich ambient glow at top & sides, deep readable black at bottom
const CARD_SCRIM: Record<GradientTheme, string> = {
  plum:
    'linear-gradient(180deg, rgba(236, 72, 153, 0.16) 0%, rgba(18, 7, 22, 0.35) 45%, rgba(8, 4, 10, 0.95) 100%)',
  cerulean:
    'linear-gradient(180deg, rgba(59, 130, 246, 0.16) 0%, rgba(6, 14, 28, 0.35) 45%, rgba(5, 7, 14, 0.95) 100%)',
  ember:
    'linear-gradient(180deg, rgba(249, 115, 22, 0.16) 0%, rgba(26, 11, 6, 0.35) 45%, rgba(12, 5, 4, 0.95) 100%)',
  indigo:
    'linear-gradient(180deg, rgba(168, 85, 247, 0.16) 0%, rgba(17, 8, 30, 0.35) 45%, rgba(9, 5, 15, 0.95) 100%)',
};

// Colored outer borders & soft ambient glow matching Reference Image 2
const CARD_BORDER: Record<GradientTheme, string> = {
  plum: 'border-[#EC4899]/35 hover:border-[#EC4899]/70 shadow-[0_4px_24px_rgba(236,72,153,0.18)]',
  cerulean: 'border-[#3B82F6]/35 hover:border-[#3B82F6]/70 shadow-[0_4px_24px_rgba(59,130,246,0.18)]',
  ember: 'border-[#F97316]/35 hover:border-[#F97316]/70 shadow-[0_4px_24px_rgba(249,115,22,0.18)]',
  indigo: 'border-[#A855F7]/35 hover:border-[#A855F7]/70 shadow-[0_4px_24px_rgba(168,85,247,0.18)]',
};

// Empty placeholder card matching the Reference Image 2 aspect ratio & geometry
const EmptyPlaceholderCard: React.FC<{ index: number }> = ({ index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28, delay: Math.min(index * 0.06, 0.25) }}
    className="relative w-[210px] sm:w-[258px] h-[245px] sm:h-[285px] shrink-0 snap-start rounded-[24px] sm:rounded-[28px] border border-white/8 bg-[#0A0B10]/60 backdrop-blur-md flex flex-col justify-between p-3.5 sm:p-4 group hover:border-white/20 transition-colors"
  >
    {/* Subtle placeholder action buttons */}
    <div className="flex justify-end gap-2">
      <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/5 flex items-center justify-center">
        <Bookmark className="w-3.5 h-3.5 text-white/20" />
      </div>
      <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/5 flex items-center justify-center">
        <Play className="w-3.5 h-3.5 text-white/20 ml-0.5" />
      </div>
    </div>

    {/* Subtle bottom placeholder lines */}
    <div className="space-y-2">
      <div className="w-16 h-2 rounded-full bg-white/10" />
      <div className="w-36 h-3 rounded-full bg-white/15" />
      <div className="w-24 h-2 rounded-full bg-white/10" />
    </div>
  </motion.div>
);

export const PassesAndShowsRow: React.FC<PassesAndShowsRowProps> = ({
  events,
  savedIds,
  onToggleSave,
  onSelectEvent,
  onViewAll,
  onBookUs,
}) => {
  return (
    <div className="space-y-7">
      {/* ── Row 1: Passes & Shows (Live Event Cards in Reference Image 2 Style) ── */}
      <section aria-label="Passes and shows" className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base sm:text-lg font-semibold text-white">Passes &amp; Shows</h2>
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-medium text-white/65 hover:text-white transition-colors"
          >
            All Shows &gt;
          </button>
        </div>

        <div className="flex items-stretch gap-3 sm:gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {events.map((evt, index) => {
            const remaining = getRemainingSeats(evt);
            const isSaved = savedIds.includes(evt.id);

            return (
              <motion.article
                key={evt.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: Math.min(index * 0.05, 0.2) }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectEvent(evt)}
                className={`group cursor-pointer relative w-[210px] sm:w-[258px] h-[245px] sm:h-[285px] shrink-0 snap-start rounded-[24px] sm:rounded-[28px] overflow-hidden border bg-[#0A0B10] transition-all flex flex-col justify-between p-3.5 sm:p-4 ${CARD_BORDER[evt.theme]}`}
              >
                {/* Event Photography Backdrop */}
                <img
                  src={evt.imageUrl}
                  alt={evt.title}
                  referrerPolicy="no-referrer"
                  className="pointer-events-none absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: CARD_SCRIM[evt.theme] }}
                />

                {/* Top Quick Actions (Bookmark + Play Button matching Reference Image 2) */}
                <div className="relative z-10 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(evt.id);
                    }}
                    aria-label={isSaved ? `Unsave ${evt.title}` : `Save ${evt.title}`}
                    aria-pressed={isSaved}
                    className={`w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
                      isSaved
                        ? 'bg-white/25 border-white/50 text-white shadow-sm'
                        : 'bg-black/40 hover:bg-black/65 border-white/20 text-white/90 hover:text-white'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(evt);
                    }}
                    disabled={!evt.isLive || remaining === 0}
                    aria-label={`Open tickets for ${evt.title}`}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md hover:bg-white text-white/90 hover:text-[#07070A] border border-white/20 flex items-center justify-center transition-all disabled:opacity-40"
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>
                </div>

                {/* Bottom Integrated Typography matching Reference Image 2 */}
                <div className="relative z-10 text-left pt-2">
                  {/* Category and Date Label: e.g. MUSIC · 12 APR */}
                  <p className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-white/65">
                    {evt.category.toUpperCase()} · {evt.dateLabel.toUpperCase()}
                  </p>

                  {/* Title */}
                  <h3 className="mt-1 text-[15.5px] sm:text-[16.5px] font-bold text-white tracking-tight leading-snug line-clamp-1 group-hover:text-white/95 transition-colors">
                    {evt.title}
                  </h3>

                  {/* Location with Pin Icon */}
                  <div className="mt-1 flex items-center gap-1.5 text-white/60">
                    <MapPin className="w-3.5 h-3.5 shrink-0 opacity-75" />
                    <span className="text-[11.5px] font-medium truncate">
                      {evt.city || evt.venue}
                    </span>
                  </div>

                  {/* Price & Availability Bar */}
                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="font-mono font-semibold text-white">
                      ₹{Math.round(evt.basePrice).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-medium text-[#D8FF48] tabular-nums">
                      {evt.isLive ? `${remaining} left` : 'Paused'}
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* ── Row 2: Book Us For (15 Curated Experiences) ── */}
      <section aria-label="Book Us For" className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-white">Book Us For</h2>
            <span className="text-[11px] text-white/40 font-medium px-2 py-0.5 rounded-full bg-white/6 border border-white/8">
              15 Categories
            </span>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-medium text-white/65 hover:text-white transition-colors"
          >
            All Experiences &gt;
          </button>
        </div>

        <div className="flex items-stretch gap-3 sm:gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {BOOK_US_FOR_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: Math.min(index * 0.03, 0.25) }}
              whileTap={{ scale: 0.98 }}
              onClick={() => (onBookUs ? onBookUs(item.title) : onViewAll())}
              className={`cursor-pointer relative w-[235px] sm:w-[265px] h-[245px] sm:h-[268px] shrink-0 snap-start rounded-[24px] sm:rounded-[28px] border transition-all overflow-hidden group ${
                item.imageUrl
                  ? 'border-white/20 hover:border-white/50'
                  : 'border-white/10 bg-[#0A0B10]/85 backdrop-blur-md hover:border-white/25 flex flex-col justify-between p-4 sm:p-5'
              }`}
              style={{
                boxShadow: `0 4px 22px -6px ${item.glow}`,
              }}
            >
              {item.imageUrl ? (
                <>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-[24px] sm:rounded-[28px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 pointer-events-none">
                    <span className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                      Studio Space
                    </span>
                    <span className="text-xs font-semibold text-white flex items-center gap-1 drop-shadow-md">
                      Enquire ›
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {/* Soft ambient corner light */}
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none blur-2xl opacity-40 group-hover:opacity-70 transition-opacity"
                    style={{ background: item.glow }}
                  />

                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${item.accent}`}>
                        {item.tag}
                      </span>
                      <span className="text-[11px] font-bold text-white/35 tabular-nums">
                        #{String(item.id).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-[15px] font-bold text-white leading-snug line-clamp-2 pt-1 group-hover:text-white transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-[11px] sm:text-xs text-white/60 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="relative z-10 pt-2.5 border-t border-white/8 flex items-center justify-between">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
                      Studio Space
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onBookUs) onBookUs(item.title);
                        else onViewAll();
                      }}
                      className="text-xs font-semibold text-white/80 group-hover:text-white flex items-center gap-1 transition-colors"
                    >
                      Enquire ›
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

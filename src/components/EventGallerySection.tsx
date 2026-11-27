import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, ChevronLeft, ChevronRight, X, Sparkles, Play, Pause } from 'lucide-react';

interface EventPhoto {
  id: string;
  category: 'all' | 'openmic' | 'music' | 'concert' | 'workshop';
  title: string;
  image: string;
}

const EVENT_PHOTOS: EventPhoto[] = [
  { id: 'ev-slow', category: 'music',   title: 'Slow Hour Acoustic Night',       image: '/assets/gallery/kesari_slow_hour.jpg' },
  { id: 'ev-lit',  category: 'openmic', title: 'Do.With.Lit Open Mic & Jam',     image: '/assets/gallery/kesari_dowithlit.jpg' },
  { id: 'ev-vibe', category: 'concert', title: 'Live Vocals & Crowd Energy',     image: '/assets/gallery/kesari_live_vibe.jpg' },
  { id: 'ev1', category: 'openmic',  title: 'Qala Open Mic & Poetry',         image: '/assets/gallery/kesari_ev_01.jpg' },
  { id: 'ev2', category: 'music',    title: 'Acoustic Jam Room Evening',      image: '/assets/gallery/kesari_ev_03.jpg' },
  { id: 'ev3', category: 'concert',  title: 'Live Band Showcase & Concert',   image: '/assets/gallery/kesari_ev_05.jpg' },
  { id: 'ev4', category: 'openmic',  title: 'Spoken Word & Shayari Evening',  image: '/assets/gallery/kesari_ev_07.jpg' },
  { id: 'ev5', category: 'workshop', title: 'Creative Music Masterclass',     image: '/assets/gallery/kesari_ev_08.jpg' },
  { id: 'ev6', category: 'music',    title: 'Soulful Vocals in Acoustic Hall', image: '/assets/gallery/kesari_ev_13.jpg' },
];

type CategoryFilter = 'all' | 'openmic' | 'music' | 'concert' | 'workshop';

const FILTERS: { key: CategoryFilter; label: string }[] = [
  { key: 'all',      label: 'All Memories' },
  { key: 'openmic',  label: 'Open Mic & Poetry' },
  { key: 'music',    label: 'Live Music & Jams' },
  { key: 'concert',  label: 'Concerts & Gigs' },
  { key: 'workshop', label: 'Workshops & Meets' },
];

function EventLightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: EventPhoto[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[index];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-colors"
        aria-label="Close lightbox"
      >
        <X size={18} />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-white/55 font-medium tracking-widest uppercase">
        {index + 1} / {photos.length}
      </div>

      {/* Prev */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-colors"
        aria-label="Previous photo"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-colors"
        aria-label="Next photo"
      >
        <ChevronRight size={20} />
      </button>

      {/* Active Photo Container */}
      <motion.div
        key={photo.id}
        className="relative max-w-4xl w-full mx-auto rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-2xl border border-white/10 bg-[#060814]"
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.image}
          alt={photo.title}
          className="w-full max-h-[75vh] object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="500"%3E%3Crect fill="%230A0B10" width="800" height="500"/%3E%3Ctext fill="%23ffffff30" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EPhoto preview%3C/text%3E%3C/svg%3E';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-6 py-4">
          <p className="text-white text-sm sm:text-base font-semibold">{photo.title}</p>
          <p className="text-xs text-white/50 mt-0.5">Memories are made here • Kesari Studio</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const EventGallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const toggleVideoPlay = (id: string) => {
    const target = videoRefs.current[id];
    if (!target) return;
    if (target.paused) {
      Object.entries(videoRefs.current).forEach(([otherId, el]) => {
        if (otherId !== id && el && !el.paused) el.pause();
      });
      void target.play();
      setPlayingId(id);
    } else {
      target.pause();
      setPlayingId(null);
    }
  };

  const filtered =
    activeCategory === 'all'
      ? EVENT_PHOTOS
      : EVENT_PHOTOS.filter((p) => p.category === activeCategory);

  const handleOpen = useCallback((idx: number) => setLightboxIndex(idx), []);
  const handleClose = useCallback(() => setLightboxIndex(null), []);
  const handlePrev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i - 1 + filtered.length) % filtered.length
      ),
    [filtered.length]
  );
  const handleNext = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i + 1) % filtered.length
      ),
    [filtered.length]
  );

  return (
    <>
      <section aria-label="Event Gallery" className="space-y-3.5">
        {/* Header with user tagline: Memories are made here */}
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-pink-400/90 block">
              Memories are made here
            </span>
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-white/50" />
              <h2 className="text-base sm:text-lg font-semibold text-white">Event Gallery</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className="text-xs font-medium text-white/55 hover:text-white transition-colors"
          >
            View All ({EVENT_PHOTOS.length}) ›
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5 -mx-4 px-4 sm:mx-0 sm:px-0">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveCategory(f.key)}
              className={[
                'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                activeCategory === f.key
                  ? 'bg-white text-black'
                  : 'bg-white/8 border border-white/10 text-white/60 hover:text-white hover:bg-white/12',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Photo & Video Strip */}
        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            {
              id: 'jamboree',
              src: '/assets/events/jamboree_30s.mp4',
              poster: '/assets/events/jamboree_poster.jpg',
              label: 'Jamboree Live (0:30)',
            },
            {
              id: 'clip8159',
              src: '/assets/events/kesari_clip_8159.mp4',
              poster: '/assets/events/kesari_clip_8159_poster.jpg',
              label: 'Studio Live Clip (0:30)',
            },
          ].map((vid) => {
            const isPlaying = playingId === vid.id;
            return (
              <button
                key={vid.id}
                type="button"
                onClick={() => toggleVideoPlay(vid.id)}
                aria-label={isPlaying ? `Pause ${vid.label}` : `Play ${vid.label}`}
                className="shrink-0 relative w-[165px] sm:w-[200px] h-[125px] sm:h-[150px] rounded-[20px] sm:rounded-[22px] overflow-hidden border border-white/12 cursor-pointer group bg-black text-left"
              >
                <video
                  ref={(el) => {
                    videoRefs.current[vid.id] = el;
                  }}
                  src={vid.src}
                  poster={vid.poster}
                  playsInline
                  loop
                  preload="metadata"
                  onEnded={() => setPlayingId((cur) => (cur === vid.id ? null : cur))}
                  className="w-full h-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15" />
                <span className="pointer-events-none absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-white">
                  {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                </span>
                <span className="pointer-events-none absolute bottom-2.5 left-3 right-3 text-[11px] font-semibold text-white truncate">
                  {vid.label}
                </span>
              </button>
            );
          })}

          {filtered.map((photo, idx) => (
            <motion.button
              key={photo.id}
              type="button"
              className="shrink-0 relative w-[165px] sm:w-[200px] h-[125px] sm:h-[150px] rounded-[20px] sm:rounded-[22px] overflow-hidden border border-white/8 cursor-pointer group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              onClick={() => handleOpen(idx)}
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%230A0B10" width="400" height="300"/%3E%3Ctext fill="%23ffffff20" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EEvent Photo%3C/text%3E%3C/svg%3E';
                }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1.5 p-3">
                <Maximize2 size={18} className="text-white" />
                <span className="text-white text-[11px] font-medium text-center leading-tight">
                  {photo.title}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <EventLightbox
            photos={filtered}
            index={lightboxIndex}
            onClose={handleClose}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, ChevronLeft, ChevronRight, X, Camera } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
interface VenuePhoto {
  id: string;
  area: 'all' | 'main-stage' | 'acoustic-lounge' | 'recording-studio' | 'cafe-terrace';
  title: string;
  image: string;
}

// ── Data ───────────────────────────────────────────────────────────────────
const VENUE_PHOTOS: VenuePhoto[] = [
  { id: 'v1',  area: 'main-stage',       title: 'Main Stage & Hall',          image: '/assets/venue/IMG20260409211806.jpg' },
  { id: 'v2',  area: 'acoustic-lounge',  title: 'Acoustic Lounge & Sofas',    image: '/assets/venue/IMG20260116215909(1).jpg' },
  { id: 'v3',  area: 'recording-studio', title: 'Recording Studio',           image: '/assets/venue/IMG20260115200347.jpg' },
  { id: 'v4',  area: 'cafe-terrace',     title: 'Cafe & Terrace Dining',      image: '/assets/venue/IMG20260117212705.jpg' },
  { id: 'v5',  area: 'main-stage',       title: 'Main Stage Backline',        image: '/assets/venue/IMG-20260209-WA0041.jpg' },
  { id: 'v6',  area: 'main-stage',       title: 'Main Stage Sound Rig',       image: '/assets/venue/kesari_main_stage_live.png' },
  { id: 'v7',  area: 'acoustic-lounge',  title: 'Acoustic Lounge Armchairs',  image: '/assets/venue/IMG20260219184115.jpg' },
  { id: 'v8',  area: 'acoustic-lounge',  title: 'Acoustic Lounge & Timber Den', image: '/assets/venue/IMG20260718173645.jpg' },
  { id: 'v9',  area: 'recording-studio', title: 'Recording Studio Console',   image: '/assets/venue/IMG20260727002410.jpg' },
  { id: 'v10', area: 'main-stage',       title: 'Audience Seating & Stage',   image: '/assets/venue/IMG20260727002158.jpg' },
  { id: 'v11', area: 'cafe-terrace',     title: 'Studio Entrance & Foyer',    image: '/assets/venue/IMG20260811154834.jpg' },
  { id: 'v12', area: 'acoustic-lounge',  title: 'Sunlit Reading Den',         image: '/assets/venue/IMG20260219175938.jpg' },
  { id: 'v13', area: 'main-stage',       title: 'Floor Chamber',              image: '/assets/venue/IMG20260718173334.jpg' },
  { id: 'v14', area: 'cafe-terrace',     title: 'Evening Cafe View',          image: '/assets/venue/IMG20260117203252 (1).jpg' },
];

type AreaFilter = 'all' | 'main-stage' | 'acoustic-lounge' | 'recording-studio' | 'cafe-terrace';

const FILTERS: { key: AreaFilter; label: string }[] = [
  { key: 'all',              label: 'All Spaces' },
  { key: 'main-stage',       label: 'Main Stage' },
  { key: 'acoustic-lounge',  label: 'Acoustic Lounge' },
  { key: 'recording-studio', label: 'Recording Studio' },
  { key: 'cafe-terrace',     label: 'Cafe & Terrace' },
];

// ── Lightbox ───────────────────────────────────────────────────────────────
function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: VenuePhoto[];
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-colors"
        aria-label="Close gallery"
      >
        <X size={18} />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-white/55 font-medium tracking-widest uppercase">
        {index + 1} / {photos.length}
      </div>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-colors"
        aria-label="Previous photo"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-colors"
        aria-label="Next photo"
      >
        <ChevronRight size={20} />
      </button>

      {/* Image */}
      <motion.div
        key={photo.id}
        className="relative max-w-4xl w-full mx-10 rounded-[28px] overflow-hidden shadow-2xl"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.image}
          alt={photo.title}
          className="w-full max-h-[76vh] object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"%3E%3Crect fill="%230A0B10" width="800" height="500"/%3E%3Ctext fill="%23ffffff30" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EPhoto unavailable%3C/text%3E%3C/svg%3E';
          }}
        />
        {/* Title scrim */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-4">
          <p className="text-white text-sm font-medium">{photo.title}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export function GallerySection() {
  const [activeArea, setActiveArea] = useState<AreaFilter>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeArea === 'all'
    ? VENUE_PHOTOS
    : VENUE_PHOTOS.filter((p) => p.area === activeArea);

  const handleOpen = useCallback((idx: number) => setLightboxIndex(idx), []);
  const handleClose = useCallback(() => setLightboxIndex(null), []);
  const handlePrev = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)), [filtered.length]);
  const handleNext = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length)), [filtered.length]);

  return (
    <>
      <section aria-label="Venue Gallery" className="space-y-3.5">
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-400/90 block">
              The KESARI Experience
            </span>
            <div className="flex items-center gap-2">
              <Camera size={15} className="text-white/50" />
              <h2 className="text-base sm:text-lg font-semibold text-white">Venue Gallery</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveArea('all')}
            className="text-xs font-medium text-white/55 hover:text-white transition-colors"
          >
            View All ›
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5 -mx-4 px-4 sm:mx-0 sm:px-0">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveArea(f.key)}
              className={[
                'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                activeArea === f.key
                  ? 'bg-white text-black'
                  : 'bg-white/8 border border-white/10 text-white/60 hover:text-white hover:bg-white/12',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Photo Strip */}
        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
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
                  (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%230A0B10" width="400" height="300"/%3E%3Ctext fill="%23ffffff20" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EPhoto%3C/text%3E%3C/svg%3E';
                }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1.5">
                <Maximize2 size={20} className="text-white" />
                <span className="text-white text-[11px] font-medium text-center px-3 leading-tight">
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
          <Lightbox
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
}

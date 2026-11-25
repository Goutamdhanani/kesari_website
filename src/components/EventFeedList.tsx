import React from 'react';
import { ArrowUpRight, Heart, MapPin } from 'lucide-react';
import {
  GradientTheme,
  StudioEvent,
  formatCurrencyINR,
  getRemainingSeats,
  isPastEvent,
} from '../utils/studioLogic';

interface EventFeedListProps {
  events: StudioEvent[];
  savedIds?: string[];
  onToggleSave?: (eventId: string) => void;
  onSelectEvent: (event: StudioEvent) => void;
}

const THEME_GLOW: Record<GradientTheme, string> = {
  plum: 'hover:border-[#E052A6]/45',
  indigo: 'hover:border-[#6F78E8]/45',
  cerulean: 'hover:border-[#3290D8]/45',
  ember: 'hover:border-[#E0532C]/45',
};

export const EventFeedList: React.FC<EventFeedListProps> = ({
  events,
  savedIds = [],
  onToggleSave,
  onSelectEvent,
}) => {
  if (events.length === 0) {
    return (
      <div className="surface-charcoal rounded-[26px] p-8 text-center">
        <p className="text-sm font-medium text-white/80">No events match your current selection.</p>
        <p className="mt-1 text-xs text-white/50">
          Try switching categories or turning off the Live Only filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
      {events.map((evt) => {
        const remaining = getRemainingSeats(evt);
        const past = isPastEvent(evt);
        const categoryLabel =
          evt.category.charAt(0).toUpperCase() + evt.category.slice(1);
        const isSaved = savedIds.includes(evt.id);

        return (
          <article
            key={evt.id}
            className={`surface-charcoal rounded-[26px] p-3.5 flex items-center gap-3.5 transition-colors ${THEME_GLOW[evt.theme]}`}
          >
            {/* 4:3 Editorial Thumbnail with Time Label Overlay */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-24 rounded-[18px] overflow-hidden shrink-0 bg-gradient-to-br from-[#1B1D2A] to-[#0B0C12]">
              <img
                src={evt.imageUrl}
                alt={evt.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              <span className="absolute bottom-1.5 inset-x-1.5 text-center text-[10px] font-semibold text-white tabular-nums drop-shadow">
                {evt.timeLabel}
              </span>
            </div>

            <div className="min-w-0 flex-1 flex flex-col justify-between gap-1.5">
              <div>
                <p className="text-[11px] text-white/55 truncate">
                  {categoryLabel} · {evt.dateLabel}
                </p>
                <h3 className="text-[15px] font-semibold text-white truncate mt-0.5">
                  {evt.title}
                </h3>
                <p className="text-[12px] text-white/65 flex items-center gap-1 truncate mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0 text-white/45" />
                  <span className="truncate">{evt.venue}, {evt.city}</span>
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-baseline gap-2 min-w-0">
                  <span className="text-[15px] font-semibold text-white tabular-nums">
                    {formatCurrencyINR(evt.basePrice)}
                  </span>
                  <span className="text-[11px] text-white/50 tabular-nums truncate">
                    {past ? 'Past Event' : evt.isLive ? `${remaining} left` : 'Paused'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {onToggleSave && (
                    <button
                      type="button"
                      onClick={() => onToggleSave(evt.id)}
                      aria-label={isSaved ? `Remove ${evt.title} from saved` : `Save ${evt.title}`}
                      aria-pressed={isSaved}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                        isSaved
                          ? 'bg-[#D8FF48]/20 border-[#D8FF48] text-[#D8FF48]'
                          : 'bg-white/[0.06] border-white/10 text-white/70 hover:text-white hover:bg-white/15'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectEvent(evt)}
                    disabled={past || !evt.isLive || remaining === 0}
                    aria-label={past ? `${evt.title} ended` : `Buy ticket for ${evt.title}`}
                    className="min-h-[40px] px-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#07070A] text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
                  >
                    <span>{past ? 'Ended' : evt.isLive ? 'Buy' : 'Paused'}</span>
                    {!past && <ArrowUpRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

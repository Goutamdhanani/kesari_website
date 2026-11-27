import React, { useMemo, useState } from 'react';
import {
  Building2,
  ChevronRight,
  Coffee,
  Crown,
  Mic2,
  Search,
  Speaker,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import {
  EventCategory,
  SERVICE_CATALOG,
  ServiceKind,
  StudioEvent,
  formatCurrencyINR,
} from '../utils/studioLogic';
import { DEFAULT_CAFE_MENU, MenuItem } from '../data/cafeMenu';
import { StudioArtist, getArtistDisplayName } from './ArtistsPage';
import { EventFeedList } from './EventFeedList';

type SearchScope = 'all' | 'events' | 'artists' | 'rentals' | 'memberships' | 'food';

interface SearchEventsViewProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedCategory: EventCategory | 'all';
  onSelectCategory: (cat: EventCategory | 'all') => void;
  results: StudioEvent[];
  allEvents?: StudioEvent[];
  artists?: StudioArtist[];
  cafeMenu?: MenuItem[];
  savedIds: string[];
  onToggleSave: (eventId: string) => void;
  onSelectEvent: (event: StudioEvent) => void;
  onOpenService?: (kind: ServiceKind) => void;
  onOpenCafe?: () => void;
  onOpenArtists?: () => void;
}

const SCOPE_TABS: Array<{ id: SearchScope; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'events', label: 'Events' },
  { id: 'artists', label: 'Artists' },
  { id: 'rentals', label: 'Rent & Spaces' },
  { id: 'memberships', label: 'Memberships' },
  { id: 'food', label: 'Food & Café' },
];

const CATEGORY_FILTERS: Array<{ id: EventCategory | 'all'; label: string }> = [
  { id: 'all', label: 'All Events' },
  { id: 'nightlife', label: 'Nightlife' },
  { id: 'music', label: 'Music' },
  { id: 'culture', label: 'Culture' },
];

export const SearchEventsView: React.FC<SearchEventsViewProps> = ({
  query,
  onQueryChange,
  selectedCategory,
  onSelectCategory,
  results,
  allEvents,
  artists = [],
  cafeMenu,
  savedIds,
  onToggleSave,
  onSelectEvent,
  onOpenService,
  onOpenCafe,
  onOpenArtists,
}) => {
  const [scope, setScope] = useState<SearchScope>('all');
  const q = query.trim().toLowerCase();

  const sourceEvents = allEvents && allEvents.length > 0 ? allEvents : results;

  // Dynamic Artist index derived from both registered artists & live events
  const matchingArtists = useMemo(() => {
    const items: Array<{
      key: string;
      name: string;
      subtitle: string;
      event?: StudioEvent;
      isRoster: boolean;
    }> = [];
    const seen = new Set<string>();

    for (const a of artists) {
      const displayName = getArtistDisplayName(a);
      const matches =
        !q ||
        a.name.toLowerCase().includes(q) ||
        displayName.toLowerCase().includes(q) ||
        a.genre.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q);
      if (!matches) continue;
      const k = a.name.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        items.push({
          key: `roster-${a.id}`,
          name: displayName,
          subtitle: `${a.genre} · ${a.city}`,
          isRoster: true,
        });
      }
    }

    for (const evt of sourceEvents) {
      const artistName = (evt.artistOrHost || '').trim();
      if (!artistName) continue;
      const matchesQuery =
        !q ||
        artistName.toLowerCase().includes(q) ||
        evt.title.toLowerCase().includes(q) ||
        evt.category.toLowerCase().includes(q);
      if (!matchesQuery) continue;

      const k = artistName.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        items.push({
          key: `evt-${evt.id}`,
          name: artistName,
          subtitle: evt.title,
          event: evt,
          isRoster: false,
        });
      }
    }
    return items;
  }, [artists, sourceEvents, q]);

  // Rent Audio Gear & Studio Spaces
  const matchingRentals = useMemo(() => {
    const combined = [...SERVICE_CATALOG.gear, ...SERVICE_CATALOG.space];
    if (!q) return combined;
    return combined.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q)) ||
        (item.specs && item.specs.toLowerCase().includes(q)),
    );
  }, [q]);

  // Studio Memberships
  const matchingMemberships = useMemo(() => {
    const list = SERVICE_CATALOG.membership;
    if (!q) return list;
    return list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.subtitle.toLowerCase().includes(q) ||
        (m.badge && m.badge.toLowerCase().includes(q)) ||
        (m.perks && m.perks.some((p) => p.toLowerCase().includes(q))),
    );
  }, [q]);

  // Café Food & Beverages (live backend menu + fallback)
  const activeCafeMenu = cafeMenu && cafeMenu.length > 0 ? cafeMenu : DEFAULT_CAFE_MENU;
  const matchingFood = useMemo(() => {
    if (!q) return activeCafeMenu;
    return activeCafeMenu.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.categoryId.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q)),
    );
  }, [q, activeCafeMenu]);

  const showEvents = scope === 'all' || scope === 'events';
  const showArtists = scope === 'all' || scope === 'artists';
  const showRentals = scope === 'all' || scope === 'rentals';
  const showMemberships = scope === 'all' || scope === 'memberships';
  const showFood = scope === 'all' || scope === 'food';

  const totalMatches =
    (showEvents ? results.length : 0) +
    (showArtists ? matchingArtists.length : 0) +
    (showRentals ? matchingRentals.length : 0) +
    (showMemberships ? matchingMemberships.length : 0) +
    (showFood ? matchingFood.length : 0);

  return (
    <div className="space-y-5">
      {/* Search Bar & Scope Filters */}
      <div className="surface-charcoal rounded-[28px] p-4 sm:p-5 space-y-3.5">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-white/45 absolute left-4 pointer-events-none" />
          <label htmlFor="district-search-input" className="sr-only">
            Search events, artists, rent items, memberships, or food
          </label>
          <input
            id="district-search-input"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search events, artists, rent gear, memberships, food..."
            className="w-full h-12 pl-11 pr-11 rounded-full bg-black/55 border border-white/12 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/45"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="Clear search query"
              className="absolute right-2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Scope Tabs */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
          role="tablist"
          aria-label="Search scope"
        >
          {SCOPE_TABS.map((tab) => {
            const active = scope === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setScope(tab.id)}
                className={`min-h-[36px] px-3.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-[#07070A] font-semibold'
                    : 'bg-white/[0.06] text-white/70 hover:text-white hover:bg-white/12'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Event Category Chips when viewing Events */}
        {showEvents && (
          <div
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-white/[0.06]"
            role="group"
            aria-label="Filter events by category"
          >
            {CATEGORY_FILTERS.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#D8FF48] text-[#07070A] font-semibold'
                      : 'bg-white/[0.04] text-white/60 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-white/80">
          {q ? `Results for "${query}"` : 'Explore Everything at Kesari'}
        </h3>
        <span className="text-xs text-white/50 tabular-nums">
          {totalMatches} {totalMatches === 1 ? 'match' : 'matches'}
        </span>
      </div>

      {/* 1. Artists & Performers */}
      {showArtists && matchingArtists.length > 0 && (
        <section aria-label="Matching Artists" className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Artists &amp; Performers ({matchingArtists.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {matchingArtists.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  if (item.event) {
                    onSelectEvent(item.event);
                  } else {
                    onOpenArtists?.();
                  }
                }}
                className="rounded-2xl bg-[#0E0F14] hover:bg-white/[0.06] border border-white/10 hover:border-white/25 p-3.5 text-left flex items-center justify-between gap-3 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 text-[#D8FF48]">
                    <Mic2 className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-white truncate">{item.name}</div>
                    <p className="text-[11px] text-white/55 truncate">{item.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/35 group-hover:text-white shrink-0" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 2. Events & Shows */}
      {showEvents && results.length > 0 && (
        <section aria-label="Matching Events" className="space-y-2.5">
          <div className="px-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Events &amp; Shows ({results.length})
            </h4>
          </div>
          <EventFeedList
            events={results}
            savedIds={savedIds}
            onToggleSave={onToggleSave}
            onSelectEvent={onSelectEvent}
          />
        </section>
      )}

      {/* 3. Rent Audio Gear & Studio Spaces */}
      {showRentals && matchingRentals.length > 0 && (
        <section aria-label="Matching Rent Gear and Spaces" className="space-y-2.5">
          <div className="px-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Audio Gear &amp; Studio Spaces ({matchingRentals.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {matchingRentals.map((item) => {
              const isSpace = item.kind === 'space';
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenService?.(item.kind)}
                  className="rounded-2xl bg-[#0E0F14] hover:bg-white/[0.06] border border-white/10 hover:border-white/25 p-3.5 text-left flex items-center justify-between gap-3 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 text-white/80">
                      {isSpace ? (
                        <Building2 className="w-4 h-4" />
                      ) : (
                        <Speaker className="w-4 h-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-semibold text-white truncate">
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/60 border border-white/10 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/50 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-white tabular-nums block">
                      {formatCurrencyINR(item.rate)}
                    </span>
                    <span className="text-[10px] text-white/45">/{item.unitLabel}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Studio Memberships */}
      {showMemberships && matchingMemberships.length > 0 && (
        <section aria-label="Matching Memberships" className="space-y-2.5">
          <div className="px-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Studio Memberships ({matchingMemberships.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {matchingMemberships.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => onOpenService?.('membership')}
                className="rounded-2xl bg-[#0E0F14] hover:bg-white/[0.06] border border-white/10 hover:border-violet-300/35 p-3.5 text-left flex flex-col justify-between gap-2 transition-all group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Crown className="w-3.5 h-3.5 text-violet-300" />
                    {plan.name}
                  </span>
                  <span className="text-xs font-semibold text-white tabular-nums">
                    {formatCurrencyINR(plan.rate)}/mo
                  </span>
                </div>
                <p className="text-[11px] text-white/55 line-clamp-2">{plan.subtitle}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 5. Café Food & Beverages */}
      {showFood && matchingFood.length > 0 && (
        <section aria-label="Matching Food and Beverages" className="space-y-2.5">
          <div className="px-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Café Food &amp; Beverages ({matchingFood.length})
            </h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {matchingFood.map((item) => {
              const isBev =
                item.categoryId === 'hot-beverages' || item.categoryId === 'cold-beverages';
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenCafe?.()}
                  className="rounded-2xl bg-[#0E0F14] hover:bg-white/[0.06] border border-white/10 hover:border-white/25 p-3 text-left flex flex-col justify-between gap-2 transition-all"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/50">
                      {isBev ? (
                        <Coffee className="w-3 h-3 text-sky-400" />
                      ) : (
                        <UtensilsCrossed className="w-3 h-3 text-amber-400" />
                      )}
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/65">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                  <div className="text-xs font-mono text-[#D8FF48] font-semibold">
                    ₹{item.price}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty State */}
      {totalMatches === 0 && (
        <div className="surface-charcoal rounded-[24px] p-8 text-center space-y-2">
          <p className="text-sm font-medium text-white/80">
            No results matched "{query}"
          </p>
          <p className="text-xs text-white/50">
            Try searching for an artist, acoustic gig, mic, speaker, membership, or coffee.
          </p>
        </div>
      )}
    </div>
  );
};

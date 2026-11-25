import React from 'react';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';
import {
  DateBucket,
  LineupType,
  StudioEvent,
  filterEvents,
} from '../utils/studioLogic';
import { StudioLineupBar } from './StudioLineupBar';
import { EventFeedList } from './EventFeedList';

interface ScheduleViewProps {
  events: StudioEvent[];
  selectedDateBucket: DateBucket;
  onSelectDateBucket: (bucket: DateBucket) => void;
  selectedLineup: LineupType;
  onSelectLineup: (lineup: LineupType) => void;
  savedIds: string[];
  onToggleSave: (eventId: string) => void;
  onSelectEvent: (event: StudioEvent) => void;
}

const DATE_TABS: Array<{ id: DateBucket; label: string }> = [
  { id: 'all', label: 'Upcoming' },
  { id: 'tonight', label: 'Tonight' },
  { id: 'week', label: 'This Week' },
  { id: 'past', label: 'Past Events' },
];

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  events,
  selectedDateBucket,
  onSelectDateBucket,
  selectedLineup,
  onSelectLineup,
  savedIds,
  onToggleSave,
  onSelectEvent,
}) => {
  const scheduledEvents = filterEvents(
    events,
    'all',
    '',
    selectedLineup,
    selectedDateBucket
  );

  return (
    <div className="space-y-6">
      {/* Schedule Header Card with Date Switcher */}
      <section
        aria-label="Schedule filters"
        className="surface-indigo rounded-[30px] p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-white/70">Acoustic Hall &amp; Lounge · Koramangala</p>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Live Schedule
            </h2>
          </div>
          <div className="w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        {/* Date Bucket Segmented Control */}
        <div
          className="grid grid-cols-4 gap-1 p-1 rounded-full bg-black/45 border border-white/10"
          role="tablist"
          aria-label="Filter schedule by date"
        >
          {DATE_TABS.map((tab) => {
            const active = selectedDateBucket === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectDateBucket(tab.id)}
                className="relative min-h-[40px] rounded-full text-xs font-semibold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {active && (
                  <motion.span
                    layoutId="schedule-date-tab"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-white shadow-sm"
                  />
                )}
                <span
                  className={`relative z-10 ${
                    active ? 'text-[#07070A]' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <StudioLineupBar
        selectedLineup={selectedLineup}
        onSelectLineup={onSelectLineup}
      />

      <section aria-label="Scheduled shows" className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-semibold text-white">
            {selectedDateBucket === 'past' ? 'Past Events Archive' : 'Upcoming Sessions'}
          </h3>
          <span className="text-xs text-white/55 tabular-nums">
            {scheduledEvents.length} {scheduledEvents.length === 1 ? 'Show' : 'Shows'}
          </span>
        </div>

        <EventFeedList
          events={scheduledEvents}
          savedIds={savedIds}
          onToggleSave={onToggleSave}
          onSelectEvent={onSelectEvent}
        />
      </section>
    </div>
  );
};

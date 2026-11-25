import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bookmark, CheckCircle2, ShieldCheck, SlidersHorizontal, Ticket } from 'lucide-react';
import {
  StudioBooking,
  StudioEvent,
  TicketPass,
  formatCurrencyINR,
} from '../utils/studioLogic';
import { EventFeedList } from './EventFeedList';

export type ProfileSubTab = 'passes' | 'saved' | 'settings';

interface ProfileViewProps {
  events: StudioEvent[];
  passes: TicketPass[];
  bookings: StudioBooking[];
  savedIds: string[];
  gateReminders: boolean;
  dropAlerts: boolean;
  onToggleGateReminders: () => void;
  onToggleDropAlerts: () => void;
  onToggleSave: (eventId: string) => void;
  onSelectEvent: (event: StudioEvent) => void;
  onOpenPassesWallet: () => void;
  onOpenAdminPortal?: () => void;
}

const SUB_TABS: Array<{ id: ProfileSubTab; label: string }> = [
  { id: 'passes', label: 'Passes' },
  { id: 'saved', label: 'Saved' },
  { id: 'settings', label: 'Settings' },
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  events,
  passes,
  bookings,
  savedIds,
  gateReminders,
  dropAlerts,
  onToggleGateReminders,
  onToggleDropAlerts,
  onToggleSave,
  onSelectEvent,
  onOpenPassesWallet,
  onOpenAdminPortal,
}) => {
  const [subTab, setSubTab] = useState<ProfileSubTab>('saved');

  const savedEvents = events.filter((evt) => savedIds.includes(evt.id));

  return (
    <div className="space-y-6">
      {/* Member Identity Card with Prismatic Halo Ring */}
      <section
        aria-label="Member profile"
        className="surface-plum rounded-[34px] p-6 sm:p-7 space-y-5"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full p-[2.5px] liquid-prism-ring shrink-0">
            <div className="w-full h-full rounded-full liquid-prism-inner flex items-center justify-center text-lg font-bold text-white tracking-tight">
              AR
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white/75">Kesari Circle VIP Member</p>
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
              Kesari Patron
            </h2>
            <p className="text-xs text-white/65 truncate">
              Koramangala, Bangalore
            </p>
          </div>
        </div>

        {/* 3-Column Profile Stats */}
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          <div className="rounded-[20px] bg-black/40 border border-white/10 p-3 text-center">
            <div className="font-dot text-2xl text-white tabular-nums">
              {String(passes.length).padStart(2, '0')}
            </div>
            <p className="text-[11px] text-white/60 mt-0.5">Passes</p>
          </div>

          <div className="rounded-[20px] bg-black/40 border border-white/10 p-3 text-center">
            <div className="font-dot text-2xl text-[#D8FF48] tabular-nums">
              {String(savedEvents.length).padStart(2, '0')}
            </div>
            <p className="text-[11px] text-white/60 mt-0.5">Saved</p>
          </div>

          <div className="rounded-[20px] bg-black/40 border border-white/10 p-3 text-center">
            <div className="font-dot text-2xl text-white tabular-nums">
              {String(bookings.length).padStart(2, '0')}
            </div>
            <p className="text-[11px] text-white/60 mt-0.5">Bookings</p>
          </div>
        </div>
      </section>

      {/* Segmented Profile Tabs: Passes | Saved | Settings */}
      <div
        className="grid grid-cols-3 gap-1.5 p-1.5 rounded-full bg-[#101116] border border-white/10"
        role="tablist"
        aria-label="Profile sections"
      >
        {SUB_TABS.map((tab) => {
          const active = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSubTab(tab.id)}
              className="relative min-h-[42px] rounded-full text-xs font-semibold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {active && (
                <motion.span
                  layoutId="profile-subtab-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-white"
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

      {/* Tab Panel Content */}
      {subTab === 'passes' && (
        <section aria-label="Member passes and studio bookings" className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-semibold text-white">Recent Passes</h3>
            <button
              type="button"
              onClick={onOpenPassesWallet}
              className="text-xs font-medium text-[#D8FF48] hover:underline"
            >
              Open Full Wallet &gt;
            </button>
          </div>

          {passes.length === 0 ? (
            <div className="surface-charcoal rounded-[26px] p-7 text-center">
              <Ticket className="w-6 h-6 text-white/45 mx-auto mb-2" />
              <p className="text-sm text-white/75">No ticket passes yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {passes.map((pass) => (
                <article
                  key={pass.id}
                  className="surface-charcoal rounded-[24px] p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] text-white/55">
                      {pass.tier} · {pass.dateLabel} · {pass.timeLabel}
                    </p>
                    <h4 className="text-sm font-semibold text-white truncate mt-0.5">
                      {pass.eventTitle}
                    </h4>
                    <p className="text-xs text-white/60 truncate">
                      {pass.venue} · {formatCurrencyINR(pass.totalPaid)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-dot text-sm text-white">{pass.passCode}</div>
                    <div
                      className={`mt-1 text-[11px] font-medium flex items-center justify-end gap-1 ${
                        pass.checkedIn ? 'text-[#D8FF48]' : 'text-white/55'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{pass.checkedIn ? 'Checked In' : 'Ready'}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {bookings.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <h3 className="text-sm font-semibold text-white px-1">
                Studio Service Bookings
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {bookings.map((bk) => (
                  <article
                    key={bk.id}
                    className="surface-charcoal rounded-[24px] p-4 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] text-white/55 uppercase tracking-wide">
                        {bk.kind}
                      </p>
                      <h4 className="text-sm font-semibold text-white truncate mt-0.5">
                        {bk.title}
                      </h4>
                      <p className="text-xs text-white/60 truncate">{bk.detail}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-dot text-sm text-white">{bk.bookingCode}</div>
                      <div className="text-xs text-[#D8FF48] tabular-nums mt-0.5">
                        {formatCurrencyINR(bk.totalPaid)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {subTab === 'saved' && (
        <section aria-label="Saved events" className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-semibold text-white">Saved Lineup</h3>
            <span className="text-xs text-white/55 tabular-nums">
              {savedEvents.length} Saved
            </span>
          </div>

          {savedEvents.length === 0 ? (
            <div className="surface-charcoal rounded-[26px] p-8 text-center">
              <Bookmark className="w-6 h-6 text-white/45 mx-auto mb-2" />
              <p className="text-sm font-medium text-white/80">No saved events yet.</p>
              <p className="mt-1 text-xs text-white/50">
                Tap the heart icon on any drop or show to bookmark it here.
              </p>
            </div>
          ) : (
            <EventFeedList
              events={savedEvents}
              savedIds={savedIds}
              onToggleSave={onToggleSave}
              onSelectEvent={onSelectEvent}
            />
          )}
        </section>
      )}

      {subTab === 'settings' && (
        <section aria-label="Member preferences and studio portal" className="space-y-3">
          <div className="surface-charcoal rounded-[26px] p-5 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-white">Gate Entry Reminders</h4>
              <p className="text-xs text-white/60 mt-0.5">
                Ping 60 minutes before doors open for upcoming passes.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={gateReminders}
              aria-label="Toggle gate entry reminders"
              onClick={onToggleGateReminders}
              className={`relative w-12 h-7 rounded-full p-1 transition-colors shrink-0 ${
                gateReminders ? 'bg-[#6F78E8]' : 'bg-white/15'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                  gateReminders ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="surface-charcoal rounded-[26px] p-5 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-white">Priority Drop Alerts</h4>
              <p className="text-xs text-white/60 mt-0.5">
                Early access notifications for intimate Acoustic Hall &amp; Lounge sets.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={dropAlerts}
              aria-label="Toggle priority drop alerts"
              onClick={onToggleDropAlerts}
              className={`relative w-12 h-7 rounded-full p-1 transition-colors shrink-0 ${
                dropAlerts ? 'bg-[#6F78E8]' : 'bg-white/15'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                  dropAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

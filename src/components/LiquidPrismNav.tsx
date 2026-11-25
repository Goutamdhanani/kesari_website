import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Home, Search, Ticket } from 'lucide-react';

export type NavTab =
  | 'explore'
  | 'search'
  | 'schedule'
  | 'passes'
  | 'artists'
  | 'menu'
  | 'about'
  | 'connect'
  | 'help';

interface LiquidPrismNavProps {
  activeTab: NavTab;
  passesCount: number;
  onSelectTab: (tab: NavTab) => void;
}

const TABS: Array<{
  id: NavTab;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'explore', label: 'Home', Icon: Home },
  { id: 'search', label: 'Search', Icon: Search },
  { id: 'schedule', label: 'Schedule', Icon: Calendar },
  { id: 'passes', label: 'Passes', Icon: Ticket },
];

export const LiquidPrismNav: React.FC<LiquidPrismNavProps> = ({
  activeTab,
  passesCount,
  onSelectTab,
}) => {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-24px)] max-w-[404px]"
    >
      <div className="liquid-capsule rounded-full h-[64px] px-1.5 flex items-center justify-between gap-1">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectTab(id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={
                id === 'passes' && passesCount > 0
                  ? `${label} (${passesCount})`
                  : label
              }
              className={`relative h-11 sm:h-12 rounded-full flex items-center gap-1 sm:gap-1.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                isActive
                  ? 'pr-3 sm:pr-3.5 pl-1 sm:pl-1.5 flex-1 justify-start min-w-0'
                  : 'w-9 sm:w-11 px-0 justify-center text-white/60 hover:text-white shrink-0'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="liquid-nav-active-pill"
                  transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                  className="absolute inset-0 rounded-full bg-white/[0.09] border border-white/15"
                />
              )}

              {isActive ? (
                <motion.span
                  layoutId="liquid-prism-ring"
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full p-[2px] sm:p-[2.5px] liquid-prism-ring flex items-center justify-center shrink-0"
                >
                  <span className="w-full h-full rounded-full liquid-prism-inner flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </span>
                </motion.span>
              ) : (
                <span className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
              )}

              {isActive && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 text-[12.5px] font-medium text-white whitespace-nowrap truncate"
                >
                  {label}
                  {id === 'passes' && passesCount > 0 ? ` (${passesCount})` : ''}
                </motion.span>
              )}
              {!isActive && <span className="sr-only">{label}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

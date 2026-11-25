import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  MessageSquare,
  HelpCircle,
  BookOpen,
  User,
  Flag,
  Users,
  Zap,
  Phone,
  Handshake,
  Award,
  Mic2,
  Building2,
  CreditCard,
  RotateCcw,
  FileText,
  ShieldCheck,
  MapPin,
  Mail,
} from 'lucide-react';
import { MainSectionKey, STUDIO_PAGES_CONFIG } from './StudioPagesView';

interface MinimalMenuBarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: MainSectionKey, subPage: string) => void;
  onSelectTab?: (tab: string) => void;
}

const SECTION_META: Record<
  MainSectionKey,
  {
    pageNum: string;
    title: string;
    subtitle: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  about: {
    pageNum: 'PAGE 01',
    title: 'About Kesari',
    subtitle: 'Our story, founder, milestones & acoustic room',
    Icon: LayoutGrid,
  },
  connect: {
    pageNum: 'PAGE 02',
    title: 'Connect With Us',
    subtitle: 'Come say hello, perform, collaborate or partner',
    Icon: MessageSquare,
  },
  help: {
    pageNum: 'PAGE 03',
    title: 'Help & Information',
    subtitle: 'FAQ, booking info, refund policy & terms',
    Icon: HelpCircle,
  },
};

const SUBPAGE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'our-story': BookOpen,
  'meet-the-founder': User,
  'our-journey': Flag,
  'our-community': Users,
  'why-kesari': Zap,
  'contact-us': Phone,
  collaborate: Handshake,
  partner: Award,
  'join-artists': Mic2,
  corporate: Building2,
  faq: HelpCircle,
  'booking-payment': CreditCard,
  'cancellation-refund': RotateCcw,
  terms: FileText,
  privacy: ShieldCheck,
};

export const MinimalMenuBar: React.FC<MinimalMenuBarProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  // Desktop active split-pane tab (defaults to 'about')
  const [activeDesktopSection, setActiveDesktopSection] = useState<MainSectionKey>('about');
  // Mobile accordion expanded section (defaults to 'about')
  const [expandedMobileSection, setExpandedMobileSection] = useState<MainSectionKey | null>('about');

  const sectionOrder: MainSectionKey[] = ['about', 'connect', 'help'];
  const activeDesktopMeta = SECTION_META[activeDesktopSection];
  const activeDesktopSubPages = STUDIO_PAGES_CONFIG[activeDesktopSection].subPages;

  const handleSelectSubPage = (section: MainSectionKey, subPageId: string) => {
    onNavigate(section, subPageId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Kesari Studio Navigation"
          data-lenis-prevent
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Navigation Dialog */}
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[380px] md:max-w-[820px] rounded-[24px] md:rounded-[28px] bg-[#0B0B0F] border border-white/10 shadow-2xl overflow-hidden my-auto"
          >
            {/* Top Header */}
            <div className="px-5 md:px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold tracking-wider text-white uppercase">
                  KESARI STUDIO
                </span>
                <span className="hidden md:inline text-xs text-white/30">/</span>
                <span className="hidden md:inline text-xs text-white/55">Navigation</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/10 flex items-center justify-center text-white/75 hover:text-white transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* ── DESKTOP SPLIT-PANE NAVIGATION (md and up) ── */}
            <div className="hidden md:grid md:grid-cols-12 min-h-[320px]">
              {/* Left Sidebar: 3 Main Categories */}
              <div className="md:col-span-4 border-r border-white/[0.08] p-4 space-y-1.5 bg-white/[0.01]">
                {sectionOrder.map((key) => {
                  const { title, Icon } = SECTION_META[key];
                  const isActive = activeDesktopSection === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveDesktopSection(key)}
                      className={`w-full px-3.5 py-3 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-white/[0.11] to-white/[0.04] border-white/15 text-white shadow-sm'
                          : 'bg-transparent border-transparent text-white/60 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          size={16}
                          className={isActive ? 'text-white shrink-0' : 'text-white/50 shrink-0'}
                        />
                        <span className="text-[13px] font-medium truncate">{title}</span>
                      </span>
                      <ChevronRight
                        size={14}
                        className={isActive ? 'text-white/80 shrink-0' : 'text-white/35 shrink-0'}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right Content: Selected Page Header + 2-Col Sub-Page Grid */}
              <div className="md:col-span-8 p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45 block">
                      {activeDesktopMeta.pageNum}
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight mt-1">
                      {activeDesktopMeta.title}
                    </h3>
                    <p className="text-xs text-white/55 mt-0.5">{activeDesktopMeta.subtitle}</p>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45 block">
                      EXPLORE
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {activeDesktopSubPages.map((item) => {
                        const SubIcon = SUBPAGE_ICONS[item.id] || BookOpen;
                        return (
                          <a
                            key={item.id}
                            href={`/${activeDesktopSection}/${item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSelectSubPage(activeDesktopSection, item.id);
                            }}
                            className="group rounded-xl bg-white/[0.02] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/25 px-3.5 py-3 flex items-center justify-between gap-2 transition-all"
                          >
                            <span className="flex items-center gap-2.5 min-w-0">
                              <SubIcon
                                size={15}
                                className="text-white/55 group-hover:text-white shrink-0 transition-colors"
                              />
                              <span className="text-xs font-medium text-white/85 group-hover:text-white truncate transition-colors">
                                {item.label}
                              </span>
                            </span>
                            <ChevronRight
                              size={14}
                              className="text-white/35 group-hover:text-white group-hover:translate-x-0.5 shrink-0 transition-all"
                            />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── MOBILE ACCORDION NAVIGATION (below md) ── */}
            <div className="md:hidden p-4 space-y-2.5 max-h-[68vh] overflow-y-auto">
              {sectionOrder.map((key) => {
                const { title, Icon } = SECTION_META[key];
                const isExpanded = expandedMobileSection === key;
                const subPages = STUDIO_PAGES_CONFIG[key].subPages;

                return (
                  <div
                    key={key}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isExpanded
                        ? 'bg-white/[0.05] border-white/15'
                        : 'bg-white/[0.02] border-white/[0.08]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedMobileSection((prev) => (prev === key ? null : key))
                      }
                      aria-expanded={isExpanded}
                      className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          size={16}
                          className={isExpanded ? 'text-white shrink-0' : 'text-white/60 shrink-0'}
                        />
                        <span className="text-[13px] font-medium text-white truncate">
                          {title}
                        </span>
                      </span>
                      <ChevronDown
                        size={15}
                        className={`text-white/50 transition-transform duration-200 shrink-0 ${
                          isExpanded ? 'rotate-180 text-white' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                          className="border-t border-white/[0.07] px-2 py-2 space-y-0.5"
                        >
                          {subPages.map((item) => {
                            const SubIcon = SUBPAGE_ICONS[item.id] || BookOpen;
                            return (
                              <li key={item.id}>
                                <a
                                  href={`/${key}/${item.id}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleSelectSubPage(key, item.id);
                                  }}
                                  className="px-3 py-2.5 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors"
                                >
                                  <SubIcon size={14} className="text-white/50 shrink-0" />
                                  <span className="font-medium truncate">{item.label}</span>
                                </a>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Footer Bar */}
            <div className="px-5 md:px-6 py-3.5 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 text-[11px] text-white/50">
              <div className="flex items-start md:items-center gap-2">
                <MapPin size={13} className="text-white/45 shrink-0 mt-0.5 md:mt-0" />
                <span>#33, 60 Feet Road, KHB Colony, 5th Block, Koramangala, Bengaluru – 560095</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-5 shrink-0">
                <a
                  href="tel:+917760539955"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Phone size={12} className="text-white/45 shrink-0" />
                  <span>77605 39955</span>
                </a>
                <a
                  href="mailto:Kesari.memory@gmail.com"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Mail size={12} className="text-white/45 shrink-0" />
                  <span>Kesari.memory@gmail.com</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
